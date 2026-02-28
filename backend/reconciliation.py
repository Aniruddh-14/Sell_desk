"""Invoice Reconciliation Engine.

Matches uploaded invoices against expected payment records to detect:
- Matched pairs (vendor + amount within tolerance)
- Mismatched amounts (vendor matches but amount differs)
- Missing invoices (payment record with no matching invoice)
- Missing payments (invoice with no matching payment record)
- Duplicate invoices (same vendor + amount appearing multiple times)
"""
from difflib import SequenceMatcher
from collections import Counter
from database import get_all_invoices, get_all_products, get_payment_records, update_payment_record


def _fuzzy_match(a: str, b: str) -> float:
    """Return similarity ratio (0-1) between two strings."""
    if not a or not b:
        return 0.0
    a_clean = a.lower().strip()
    b_clean = b.lower().strip()
    if a_clean == b_clean:
        return 1.0
    return SequenceMatcher(None, a_clean, b_clean).ratio()


def _get_invoice_totals(invoices: list[dict], products: list[dict]) -> list[dict]:
    """Calculate total amount per invoice from its products."""
    invoice_products = {}
    for p in products:
        inv_id = p.get("invoice_id")
        if inv_id:
            if inv_id not in invoice_products:
                invoice_products[inv_id] = []
            invoice_products[inv_id].append(p)

    result = []
    for inv in invoices:
        inv_id = inv.get("id")
        prods = invoice_products.get(inv_id, [])
        total = sum(
            float(p.get("price", 0)) * int(p.get("quantity", 0))
            for p in prods
        )
        result.append({
            "id": inv_id,
            "filename": inv.get("filename", ""),
            "supplier": inv.get("supplier", "Unknown"),
            "total": round(total, 2),
            "upload_date": inv.get("upload_date", ""),
        })
    return result


def run_reconciliation(user_id: str = None, tolerance: float = 0.02) -> dict:
    """
    Run full reconciliation between invoices and payment records.
    
    Args:
        user_id: optional user scope
        tolerance: amount match tolerance as a fraction (0.02 = 2%)
    
    Returns:
        ReconciliationReport dict
    """
    invoices = get_all_invoices(user_id=user_id)
    products = get_all_products(user_id=user_id)
    payments = get_payment_records(user_id=user_id)

    invoice_totals = _get_invoice_totals(invoices, products)
    
    items = []
    matched_invoice_ids = set()
    matched_payment_ids = set()

    # ── Step 1: Detect duplicates among invoices ──
    inv_fingerprints = Counter()
    for inv in invoice_totals:
        key = (inv["supplier"].lower().strip(), inv["total"])
        inv_fingerprints[key] += 1

    duplicate_keys = {k for k, v in inv_fingerprints.items() if v > 1}
    duplicate_count = 0
    for inv in invoice_totals:
        key = (inv["supplier"].lower().strip(), inv["total"])
        if key in duplicate_keys:
            duplicate_count += 1
            items.append({
                "invoice_id": inv["id"],
                "invoice_filename": inv["filename"],
                "invoice_supplier": inv["supplier"],
                "invoice_amount": inv["total"],
                "payment_id": None,
                "payment_vendor": None,
                "payment_amount": 0,
                "status": "duplicate",
                "amount_diff": 0,
                "confidence": 1.0,
                "notes": f"Duplicate invoice: same vendor '{inv['supplier']}' and amount ₹{inv['total']}"
            })

    # ── Step 2: Match invoices to payment records ──
    for pay in payments:
        pay_vendor = pay.get("vendor", "")
        pay_amount = float(pay.get("expected_amount", 0))
        pay_id = pay.get("id")

        best_match = None
        best_score = 0.0

        for inv in invoice_totals:
            if inv["id"] in matched_invoice_ids:
                continue

            vendor_score = _fuzzy_match(pay_vendor, inv["supplier"])
            if vendor_score < 0.5:
                continue

            amount_diff = abs(inv["total"] - pay_amount)
            amount_tolerance = max(pay_amount * tolerance, 1.0)  # At least ₹1 tolerance
            amount_match = 1.0 if amount_diff <= amount_tolerance else max(0, 1.0 - (amount_diff / max(pay_amount, 1)))

            combined = (vendor_score * 0.6) + (amount_match * 0.4)

            if combined > best_score:
                best_score = combined
                best_match = {
                    "inv": inv,
                    "vendor_score": vendor_score,
                    "amount_diff": round(inv["total"] - pay_amount, 2),
                    "amount_match": amount_match,
                }

        if best_match and best_score >= 0.6:
            inv = best_match["inv"]
            amount_diff = best_match["amount_diff"]
            
            if abs(amount_diff) <= max(pay_amount * tolerance, 1.0):
                status = "matched"
                notes = f"Matched with {best_score:.0%} confidence"
            else:
                status = "mismatched"
                notes = f"Amount differs by ₹{abs(amount_diff):.2f} (invoice: ₹{inv['total']}, expected: ₹{pay_amount})"

            matched_invoice_ids.add(inv["id"])
            matched_payment_ids.add(pay_id)

            # Update payment record status in DB
            try:
                update_payment_record(pay_id, {"status": status, "matched_invoice_id": inv["id"]})
            except Exception:
                pass

            items.append({
                "invoice_id": inv["id"],
                "invoice_filename": inv["filename"],
                "invoice_supplier": inv["supplier"],
                "invoice_amount": inv["total"],
                "payment_id": pay_id,
                "payment_vendor": pay_vendor,
                "payment_amount": pay_amount,
                "status": status,
                "amount_diff": amount_diff,
                "confidence": round(best_score, 2),
                "notes": notes,
            })
        else:
            # No match found — missing invoice for this payment
            items.append({
                "invoice_id": None,
                "invoice_filename": None,
                "invoice_supplier": None,
                "invoice_amount": 0,
                "payment_id": pay_id,
                "payment_vendor": pay_vendor,
                "payment_amount": pay_amount,
                "status": "missing_invoice",
                "amount_diff": -pay_amount,
                "confidence": 0,
                "notes": f"No matching invoice found for vendor '{pay_vendor}'",
            })
            try:
                update_payment_record(pay_id, {"status": "missing_invoice"})
            except Exception:
                pass

    # ── Step 3: Find unmatched invoices (missing payments) ──
    for inv in invoice_totals:
        key = (inv["supplier"].lower().strip(), inv["total"])
        if inv["id"] not in matched_invoice_ids and key not in duplicate_keys:
            items.append({
                "invoice_id": inv["id"],
                "invoice_filename": inv["filename"],
                "invoice_supplier": inv["supplier"],
                "invoice_amount": inv["total"],
                "payment_id": None,
                "payment_vendor": None,
                "payment_amount": 0,
                "status": "missing_payment",
                "amount_diff": inv["total"],
                "confidence": 0,
                "notes": f"No matching payment record for invoice from '{inv['supplier']}'",
            })

    # ── Build summary ──
    status_counts = Counter(item["status"] for item in items)
    total_inv_amount = sum(inv["total"] for inv in invoice_totals)
    total_pay_amount = sum(float(p.get("expected_amount", 0)) for p in payments)

    return {
        "total_invoices": len(invoices),
        "total_payments": len(payments),
        "matched": status_counts.get("matched", 0),
        "mismatched": status_counts.get("mismatched", 0),
        "missing_invoices": status_counts.get("missing_invoice", 0),
        "missing_payments": status_counts.get("missing_payment", 0),
        "duplicates": duplicate_count,
        "total_invoice_amount": round(total_inv_amount, 2),
        "total_payment_amount": round(total_pay_amount, 2),
        "amount_discrepancy": round(total_inv_amount - total_pay_amount, 2),
        "items": items,
    }
