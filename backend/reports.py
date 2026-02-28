from database import get_all_products
from typing import Dict, Any

def generate_itr_report() -> Dict[str, Any]:
    """Aggregates all product data to generate an ITR / financial report."""
    products = get_all_products()
    
    total_purchases = 0.0
    total_qty = 0
    supplier_totals = {}
    category_totals = {}
    
    for p in products:
        try:
            qty = int(p.get("quantity", 0))
            price = float(p.get("price", 0.0))
        except (ValueError, TypeError):
            continue
            
        total_price = qty * price
        
        total_purchases += total_price
        total_qty += qty
        
        sup = p.get("supplier", "Unknown")
        cat = p.get("category", "General")
        
        supplier_totals[sup] = supplier_totals.get(sup, 0.0) + total_price
        category_totals[cat] = category_totals.get(cat, 0.0) + total_price

    # Assume standard 18% GST estimate for ITR deduction purposes on business purchases
    estimated_gst_input = total_purchases * 0.18
        
    return {
        "total_purchase_value": total_purchases,
        "total_items_purchased": total_qty,
        "estimated_gst_input_credit": estimated_gst_input,
        "supplier_breakdown": [{"supplier": k, "amount": v} for k, v in sorted(supplier_totals.items(), key=lambda x: x[1], reverse=True)],
        "category_breakdown": [{"category": k, "amount": v} for k, v in sorted(category_totals.items(), key=lambda x: x[1], reverse=True)],
    }
