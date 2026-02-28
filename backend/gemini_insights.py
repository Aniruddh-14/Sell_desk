"""Gemini API integration for retail business insights."""
import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def generate_insights(products: list[dict], context: str = None, festival: str = None) -> dict:
    """Generate business insights using Google Gemini API."""

    # Build product summary for the prompt
    if not products:
        return _get_demo_insights()

    product_summary = _build_product_summary(products)
    prompt = _build_prompt(product_summary, context, festival)

    # Try Gemini API
    if GEMINI_API_KEY and GEMINI_API_KEY != "your-gemini-api-key":
        try:
            return _call_gemini(prompt)
        except Exception as e:
            print(f"⚠️  Gemini API failed: {e} — using demo insights")

    return _get_demo_insights()


def _build_product_summary(products: list[dict]) -> str:
    """Build a text summary of product data."""
    lines = ["Product Inventory Summary:", ""]

    # Aggregate by product
    product_map: dict = {}
    for p in products:
        name = p.get("product_name", "Unknown")
        if name not in product_map:
            product_map[name] = {"qty": 0, "price": 0, "supplier": p.get("supplier", ""), "category": p.get("category", "")}
        product_map[name]["qty"] += int(p.get("quantity", 0))
        product_map[name]["price"] = float(p.get("price", 0))

    for name, data in sorted(product_map.items(), key=lambda x: x[1]["qty"], reverse=True):
        revenue = data["qty"] * data["price"]
        lines.append(f"- {name}: Qty={data['qty']}, Price=₹{data['price']}, Revenue=₹{revenue:.0f}, Supplier={data['supplier']}, Category={data['category']}")

    # Summary stats
    total_revenue = sum(d["qty"] * d["price"] for d in product_map.values())
    lines.append(f"\nTotal Products: {len(product_map)}")
    lines.append(f"Total Revenue: ₹{total_revenue:,.0f}")
    lines.append(f"Suppliers: {', '.join(set(p.get('supplier', '') for p in products))}")

    return "\n".join(lines)


def _build_prompt(product_summary: str, context: str = None, festival: str = None) -> str:
    """Build the prompt for Gemini."""
    prompt = f"""You are a retail business analytics expert helping a small Indian shop owner make data-driven decisions.

Analyze the following product inventory data and provide actionable insights:

{product_summary}

Please provide your analysis in the following JSON format:
{{
  "stock_more": ["Product 1 — reason", "Product 2 — reason"],
  "products_to_avoid": ["Product 1 — reason", "Product 2 — reason"],
  "festival_recommendations": ["Recommendation 1", "Recommendation 2"],
  "general_insights": ["Insight 1", "Insight 2", "Insight 3"]
}}

Focus on:
1. **Products to stock more**: High-demand items that generate good revenue
2. **Products to avoid**: Slow-moving items with low margins or excessive stock
3. **Festival-specific recommendations**: What to stock for upcoming Indian festivals
4. **General business insights**: Pricing strategies, supplier diversification, category optimization
"""

    if context:
        prompt += f"\nAdditional context from the shop owner: {context}"

    if festival:
        prompt += f"\nSpecifically analyze for the upcoming festival: {festival}"

    prompt += "\n\nRespond ONLY with valid JSON, no markdown formatting."
    return prompt


def _call_gemini(prompt: str) -> dict:
    """Call Gemini API and parse response."""
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    text = response.text.strip()

    # Clean markdown code blocks if present
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    try:
        data = json.loads(text)
        data["raw_response"] = response.text
        return data
    except json.JSONDecodeError:
        return {
            "stock_more": [],
            "products_to_avoid": [],
            "festival_recommendations": [],
            "general_insights": [response.text],
            "raw_response": response.text,
        }


def _get_demo_insights() -> dict:
    """Return demo insights for hackathon presentation."""
    return {
        "stock_more": [
            "Parle-G Biscuits — Highest turnover rate at 300 units, extremely low price point makes it an everyday essential. Increase stock by 20%.",
            "Maggi Noodles — Strong steady demand at 250 units. Quick-commerce trend boosts instant food sales. Stock up before exam seasons.",
            "Toor Dal 1kg — Staple grocery item with consistent demand (200 units). Price is competitive at ₹135. Maintain buffer stock.",
            "Basmati Rice 5kg — Good margin product (₹320 × 150 units = ₹48,000 revenue). Essential for festival seasons.",
            "Haldiram Namkeen — Fast-moving snack category (120 units). Increase variety to capture more snack market share.",
        ],
        "products_to_avoid": [
            "Organic Honey 500g — Very slow mover (only 5 units). High price point ₹520 limits customer base. Consider removing or reducing stock.",
            "Lay's Chips Party Pack — Only 8 units moved. Large pack sizes don't suit daily shoppers. Switch to smaller SKUs.",
            "Paper Napkins 100pk — Low demand (12 units) with thin margins. Not a priority restock item.",
            "Pepsi 2L 6-pack — Low turnover (15 units). Customers prefer single bottles. Switch to 500ml/600ml variants.",
        ],
        "festival_recommendations": [
            "🪔 Diwali (Oct-Nov): Stock up on Cadbury gift boxes, dry fruits, cooking oils, sugar, and sweets packaging. Expect 3x demand spike.",
            "🎉 Holi (Mar): Increase beverage inventory (Pepsi, juices), snacks (namkeen, chips), and colors/water guns if applicable.",
            "🙏 Navratri (Oct): Stock religious items, fruits, sabudana, and special fasting foods. Dairy products see increased demand.",
            "📚 Back to School (Jun-Jul): Stock stationery items, lunch box snacks (biscuits, chips), and beverages.",
            "🏏 IPL Season (Apr-May): Snacks and beverages see 2x demand. Stock party-size packs and cold drinks.",
        ],
        "general_insights": [
            "📊 Revenue concentration: FMCG Hub supplies 7 of 20 products. Negotiate bulk discounts for 5-10% cost savings.",
            "💰 High-margin focus: Cadbury Dairy Milk (₹850/box) and Nescafe Coffee (₹380) have strong margins. Create combo offers.",
            "📦 Inventory optimization: Set reorder points at 25% of current stock levels to avoid stockouts on fast movers.",
            "🏪 Category gap: No fresh produce or frozen foods. Adding even 5 items could capture new customer segments.",
            "📈 Price strategy: Bundle slow movers with fast movers (e.g., 'Buy Rice, Get Honey at 10% off') to clear excess stock.",
            "🤝 Supplier diversification: 35% of inventory from FMCG Hub creates risk. Add 1-2 alternative suppliers.",
        ],
        "raw_response": "Demo insights generated for hackathon presentation",
    }
