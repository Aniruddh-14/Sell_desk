"""Supabase database client wrapper."""
import os
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

_supabase_client = None
_use_local = False
_local_invoices: list[dict] = []
_local_products: list[dict] = []


def _get_client():
    """Get or create Supabase client, fallback to local storage."""
    global _supabase_client, _use_local
    if _supabase_client is not None:
        return _supabase_client
    if not SUPABASE_URL or not SUPABASE_KEY or SUPABASE_URL == "https://your-project.supabase.co":
        print("⚠️  Supabase not configured — using in-memory storage for demo")
        _use_local = True
        return None
    try:
        from supabase import create_client
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Connected to Supabase")
        return _supabase_client
    except Exception as e:
        print(f"⚠️  Supabase connection failed: {e} — using in-memory storage")
        _use_local = True
        return None


def insert_invoice(data: dict, user_id: str = None) -> dict:
    """Insert an invoice record."""
    import uuid
    client = _get_client()
    if user_id:
        data["user_id"] = user_id
    if _use_local or client is None:
        record = {**data, "id": str(uuid.uuid4())}
        _local_invoices.append(record)
        return record
    result = client.table("invoices").insert(data).execute()
    return result.data[0] if result.data else data


def insert_products(products: list[dict], user_id: str = None) -> list[dict]:
    """Insert multiple product records."""
    import uuid
    client = _get_client()
    if user_id:
        for p in products:
            p["user_id"] = user_id
    if _use_local or client is None:
        records = []
        for p in products:
            record = {**p, "id": str(uuid.uuid4())}
            _local_products.append(record)
            records.append(record)
        return records
    result = client.table("products").insert(products).execute()
    return result.data if result.data else products


def get_all_products(user_id: str = None) -> list[dict]:
    """Get all products."""
    client = _get_client()
    if _use_local or client is None:
        if user_id:
            return [p for p in _local_products if p.get("user_id") == user_id]
        return _local_products
    query = client.table("products").select("*")
    if user_id:
        query = query.eq("user_id", user_id)
    result = query.order("created_at", desc=True).execute()
    return result.data if result.data else []


def get_all_invoices(user_id: str = None) -> list[dict]:
    """Get all invoices."""
    client = _get_client()
    if _use_local or client is None:
        if user_id:
            return [i for i in _local_invoices if i.get("user_id") == user_id]
        return _local_invoices
    query = client.table("invoices").select("*")
    if user_id:
        query = query.eq("user_id", user_id)
    result = query.order("upload_date", desc=True).execute()
    return result.data if result.data else []


def get_dashboard_data(user_id: str = None) -> dict:
    """Compute dashboard analytics from product data."""
    products = get_all_products(user_id=user_id)
    if not products:
        return {
            "total_products": 0,
            "total_revenue": 0,
            "avg_price": 0,
            "supplier_count": 0,
            "top_selling": [],
            "slow_moving": [],
            "profit_analysis": [],
            "category_distribution": [],
            "monthly_sales": [],
        }

    total_products = len(products)
    total_revenue = sum(float(p.get("price", 0)) * int(p.get("quantity", 0)) for p in products)
    prices = [float(p.get("price", 0)) for p in products]
    avg_price = sum(prices) / len(prices) if prices else 0
    suppliers = set(p.get("supplier", "Unknown") for p in products)

    # Top selling (by quantity)
    sorted_by_qty = sorted(products, key=lambda x: int(x.get("quantity", 0)), reverse=True)
    top_selling = [
        {"name": p.get("product_name", ""), "quantity": int(p.get("quantity", 0)),
         "revenue": float(p.get("price", 0)) * int(p.get("quantity", 0))}
        for p in sorted_by_qty[:10]
    ]

    # Slow moving (lowest quantity)
    slow_moving = [
        {"name": p.get("product_name", ""), "quantity": int(p.get("quantity", 0)),
         "revenue": float(p.get("price", 0)) * int(p.get("quantity", 0))}
        for p in sorted_by_qty[-10:]
    ]

    # Profit analysis by supplier
    supplier_revenue: dict[str, float] = {}
    for p in products:
        s = p.get("supplier", "Unknown")
        rev = float(p.get("price", 0)) * int(p.get("quantity", 0))
        supplier_revenue[s] = supplier_revenue.get(s, 0) + rev
    profit_analysis = [{"supplier": k, "revenue": v} for k, v in supplier_revenue.items()]

    # Category distribution
    cat_count: dict[str, int] = {}
    for p in products:
        c = p.get("category", "Uncategorized") or "Uncategorized"
        cat_count[c] = cat_count.get(c, 0) + 1
    category_distribution = [{"category": k, "count": v} for k, v in cat_count.items()]

    # Monthly sales timeline
    from collections import defaultdict
    import datetime
    
    monthly_data = defaultdict(lambda: {"revenue": 0.0, "products": 0})
    now = datetime.datetime.now()
    
    for p in products:
        d_str = p.get("created_at")
        if not d_str:
            d_str = now.isoformat()
        try:
            # Handle standard ISO formats
            dt = datetime.datetime.fromisoformat(d_str.replace("Z", "+00:00"))
            month_key = dt.strftime("%b %Y") # e.g. "Jan 2024"
        except Exception:
            month_key = now.strftime("%b %Y")
            dt = now
            
        qty = int(p.get("quantity", 0))
        price = float(p.get("price", 0))
        monthly_data[month_key]["revenue"] += qty * price
        monthly_data[month_key]["products"] += qty
        
    monthly_sales = [
        {"month": k, "revenue": v["revenue"], "products": v["products"]}
        for k, v in monthly_data.items()
    ]
    
    # Sort chronologically
    def parse_month(m):
        try:
            return datetime.datetime.strptime(m["month"], "%b %Y")
        except:
            return datetime.datetime.min
            
    monthly_sales.sort(key=parse_month)

    return {
        "total_products": total_products,
        "total_revenue": round(total_revenue, 2),
        "avg_price": round(avg_price, 2),
        "supplier_count": len(suppliers),
        "top_selling": top_selling,
        "slow_moving": slow_moving,
        "profit_analysis": profit_analysis,
        "category_distribution": category_distribution,
        "monthly_sales": monthly_sales,
    }


def seed_demo_data(user_id: str = None):
    """Seed demo data for hackathon demo if database is empty."""
    if get_all_products(user_id=user_id):
        return  # Already has data

    demo_products = [
        {"product_name": "Basmati Rice 5kg", "quantity": 150, "price": 320.00, "supplier": "AgriFresh Traders", "category": "Grocery"},
        {"product_name": "Toor Dal 1kg", "quantity": 200, "price": 135.00, "supplier": "AgriFresh Traders", "category": "Grocery"},
        {"product_name": "Sunflower Oil 1L", "quantity": 80, "price": 180.00, "supplier": "OilMax Pvt Ltd", "category": "Grocery"},
        {"product_name": "Amul Butter 500g", "quantity": 60, "price": 270.00, "supplier": "Dairy Direct", "category": "Dairy"},
        {"product_name": "Parle-G Biscuits", "quantity": 300, "price": 10.00, "supplier": "FMCG Hub", "category": "Snacks"},
        {"product_name": "Maggi Noodles (Pack of 12)", "quantity": 250, "price": 120.00, "supplier": "FMCG Hub", "category": "Snacks"},
        {"product_name": "Colgate Toothpaste 200g", "quantity": 100, "price": 110.00, "supplier": "FMCG Hub", "category": "Personal Care"},
        {"product_name": "Dettol Soap (3 pack)", "quantity": 75, "price": 165.00, "supplier": "FMCG Hub", "category": "Personal Care"},
        {"product_name": "Cadbury Dairy Milk (Box)", "quantity": 40, "price": 850.00, "supplier": "ChocoWorld", "category": "Confectionery"},
        {"product_name": "Haldiram Namkeen 400g", "quantity": 120, "price": 95.00, "supplier": "Snack Distributors", "category": "Snacks"},
        {"product_name": "Red Label Tea 500g", "quantity": 90, "price": 210.00, "supplier": "BevCo", "category": "Beverages"},
        {"product_name": "Nescafe Coffee 200g", "quantity": 45, "price": 380.00, "supplier": "BevCo", "category": "Beverages"},
        {"product_name": "Surf Excel 1kg", "quantity": 55, "price": 195.00, "supplier": "FMCG Hub", "category": "Household"},
        {"product_name": "Vim Dishwash Bar", "quantity": 180, "price": 30.00, "supplier": "FMCG Hub", "category": "Household"},
        {"product_name": "Ashirvaad Atta 10kg", "quantity": 70, "price": 450.00, "supplier": "AgriFresh Traders", "category": "Grocery"},
        {"product_name": "Kissan Ketchup 1kg", "quantity": 35, "price": 160.00, "supplier": "FMCG Hub", "category": "Condiments"},
        {"product_name": "Lay's Chips (Party Pack)", "quantity": 8, "price": 120.00, "supplier": "Snack Distributors", "category": "Snacks"},
        {"product_name": "Paper Napkins (100 pack)", "quantity": 12, "price": 45.00, "supplier": "PackageKing", "category": "Household"},
        {"product_name": "Pepsi 2L (6 pack)", "quantity": 15, "price": 330.00, "supplier": "BevCo", "category": "Beverages"},
        {"product_name": "Organic Honey 500g", "quantity": 5, "price": 520.00, "supplier": "NaturePure", "category": "Health"},
    ]

    import uuid, datetime
    invoice_id = str(uuid.uuid4())
    insert_invoice({
        "filename": "demo_invoice.pdf",
        "upload_date": datetime.datetime.now().isoformat(),
        "raw_ocr_text": "Demo data — seeded for hackathon presentation",
        "supplier": "Multiple Suppliers",
    }, user_id=user_id)

    import random
    from datetime import timedelta
    now = datetime.datetime.now()

    for p in demo_products:
        p["invoice_id"] = invoice_id
        # Scatter dates over the last 180 days for better charts
        random_days = random.randint(0, 180)
        p["created_at"] = (now - timedelta(days=random_days)).isoformat()

    insert_products(demo_products, user_id=user_id)
    print(f"✅ Seeded {len(demo_products)} demo products for user_id {user_id}")


# ──────────────────────────────────────────────
# Payment Records (Reconciliation)
# ──────────────────────────────────────────────

_local_payment_records: list[dict] = []


def insert_payment_records(records: list[dict], user_id: str = None) -> list[dict]:
    """Insert multiple payment records."""
    import uuid
    client = _get_client()
    if user_id:
        for r in records:
            r["user_id"] = user_id
    if _use_local or client is None:
        result = []
        for r in records:
            record = {**r, "id": str(uuid.uuid4())}
            _local_payment_records.append(record)
            result.append(record)
        return result
    result = client.table("payment_records").insert(records).execute()
    return result.data if result.data else records


def get_payment_records(user_id: str = None) -> list[dict]:
    """Get all payment records."""
    client = _get_client()
    if _use_local or client is None:
        if user_id:
            return [r for r in _local_payment_records if r.get("user_id") == user_id]
        return _local_payment_records
    query = client.table("payment_records").select("*")
    if user_id:
        query = query.eq("user_id", user_id)
    result = query.order("created_at", desc=True).execute()
    return result.data if result.data else []


def update_payment_record(record_id: str, data: dict) -> dict:
    """Update a payment record."""
    client = _get_client()
    if _use_local or client is None:
        for r in _local_payment_records:
            if r.get("id") == record_id:
                r.update(data)
                return r
        return data
    result = client.table("payment_records").update(data).eq("id", record_id).execute()
    return result.data[0] if result.data else data


def delete_payment_record(record_id: str, user_id: str = None) -> bool:
    """Delete a payment record."""
    client = _get_client()
    if _use_local or client is None:
        global _local_payment_records
        _local_payment_records = [r for r in _local_payment_records if r.get("id") != record_id]
        return True
    query = client.table("payment_records").delete().eq("id", record_id)
    if user_id:
        query = query.eq("user_id", user_id)
    query.execute()
    return True
