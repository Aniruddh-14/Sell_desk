"""Tools that the PydanticAI agents can call dynamically."""
from database import get_all_products

def fetch_inventory_data() -> str:
    """Tool: Fetch the latest inventory and sales data from the database."""
    products = get_all_products()
    if not products:
        return "The database is empty. No inventory data available."

    # Compute a quick text summary for the agents to read
    summary = "Current Store Inventory:\n"
    total_qty = 0
    total_rev = 0.0
    
    for p in products:
        name = p.get("product_name", "Unknown")
        qty = int(p.get("quantity", 0))
        price = float(p.get("price", 0.0))
        sup = p.get("supplier", "Unknown")
        cat = p.get("category", "General")
        
        rev = qty * price
        total_qty += qty
        total_rev += rev
        
        summary += f"- {name} | Qty: {qty} | Price: ₹{price} | Rev: ₹{rev} | Supplier: {sup} | Cat: {cat}\n"
        
    summary += f"\nTotal Items Sold/Stocked: {total_qty}\nGross Revenue: ₹{total_rev:,.2f}"
    return summary
