"""Vision integration using Gemini 2.0 Flash for invoice data extraction."""
import os
import json
import base64
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def encode_image_bytes(image_bytes: bytes) -> str:
    """Encode image bytes to base64."""
    return base64.b64encode(image_bytes).decode("utf-8")


def extract_products_from_image_gemini(image_base64: str) -> tuple[str, list[dict]]:
    """Use Gemini Vision to directly read the invoice image and extract products.
    
    Returns (raw_ocr_text, products_list).
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your-gemini-api-key":
        print("⚠️  Gemini API key not set — cannot read invoice image")
        return "ERROR: Gemini API key is missing. Please add it to backend/.env", []

    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = """You are an expert invoice/receipt reader. Analyze this invoice image carefully.

Do TWO things:

1. FIRST: Extract ALL text you can read from this invoice/receipt exactly as it appears (OCR).

2. THEN: Extract every product/item into a structured JSON array.

Respond in this EXACT JSON format (no markdown, no explanation):
{
  "raw_text": "The full text content of the invoice as you read it",
  "supplier": "The store or company name from the invoice",
  "products": [
    {"product_name": "Item name", "quantity": 1, "price": 100.00, "supplier": "Store Name", "category": "Category"},
    ...
  ]
}

RULES for products:
- Extract ONLY actual product/item lines, NOT totals, taxes, subtotals, discounts
- "price" should be the UNIT PRICE (if total and qty are given, calculate: price = total / quantity)
- If quantity is not specified, assume 1
- "category" must be one of: Grocery, Dairy, Beverages, Snacks, Personal Care, Household, Confectionery, Condiments, Health, Electronics, Clothing, Stationery, General
- Read the actual items from the image — do NOT make up or guess products

Return ONLY the JSON object, nothing else."""

        # Send image to Gemini
        image_part = {
            "mime_type": "image/png",
            "data": image_base64,
        }

        response = model.generate_content([prompt, image_part])
        text = response.text.strip()

        # Clean markdown code blocks if present
        if text.startswith("```"):
            first_newline = text.index("\n") if "\n" in text else 3
            text = text[first_newline + 1:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        data = json.loads(text)
        raw_text = data.get("raw_text", "")
        supplier = data.get("supplier", "Unknown")
        products = data.get("products", [])
        cleaned = []
        for p in products:
            cleaned.append({
                "product_name": str(p.get("product_name", "Unknown"))[:100],
                "quantity": max(1, int(p.get("quantity", 1))),
                "price": float(p.get("price", 0)),
                "supplier": str(p.get("supplier", supplier)),
                "category": str(p.get("category", "General")),
            })

        print(f"✅ Gemini Vision extracted {len(cleaned)} products from invoice image")
        return raw_text, cleaned

    except Exception as e:
        print(f"⚠️  Gemini Vision failed: {e}")
        return f"ERROR: Gemini extraction failed. Details: {str(e)}", []
