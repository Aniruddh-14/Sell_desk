from database import get_all_products
from typing import Dict, Any

def generate_itr_report(user_id: str = None) -> Dict[str, Any]:
    """Aggregates all product data to generate an ITR / financial report."""
    products = get_all_products(user_id=user_id)
    
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

from fpdf import FPDF
import io
import datetime

def generate_itr_pdf(user_id: str = None) -> io.BytesIO:
    """Generates a PDF version of the ITR report."""
    data = generate_itr_report(user_id)
    
    pdf = FPDF()
    pdf.add_page()
    
    # Title
    pdf.set_font("helvetica", "B", 20)
    pdf.cell(0, 15, "FinSight-OCR: Financial Statement (ITR Report)", new_x="LMARGIN", new_y="NEXT", align="C")
    
    # Date
    pdf.set_font("helvetica", "I", 10)
    date_str = datetime.datetime.now().strftime("%B %d, %Y")
    pdf.cell(0, 10, f"Generated on: {date_str}", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(10)
    
    # Summary Section
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 10, "Summary", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 12)
    
    pdf.cell(80, 10, "Total Purchase Value:")
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 10, f"INR {data['total_purchase_value']:,.2f}", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 12)
    
    pdf.cell(80, 10, "Estimated GST Input Credit (18%):")
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 10, f"INR {data['estimated_gst_input_credit']:,.2f}", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 12)
    
    pdf.cell(80, 10, "Total Items Acquired:")
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 10, f"{data['total_items_purchased']:,}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(10)
    
    # Supplier Breakdown
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 10, "Major Suppliers (Top Expenses)", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 12)
    
    for sup in data.get("supplier_breakdown", [])[:10]:
        pdf.cell(100, 8, sup["supplier"])
        pdf.cell(0, 8, f"INR {sup['amount']:,.2f}", align="R", new_x="LMARGIN", new_y="NEXT")
    
    pdf.ln(10)
    
    # Category Breakdown
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 10, "Expenses by Category", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 12)
    
    for cat in data.get("category_breakdown", []):
        pdf.cell(100, 8, cat["category"])
        pdf.cell(0, 8, f"INR {cat['amount']:,.2f}", align="R", new_x="LMARGIN", new_y="NEXT")
    
    # Return as BytesIO
    pdf_bytes = pdf.output()
    return io.BytesIO(pdf_bytes)
