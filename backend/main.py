"""FastAPI backend for Retail Store Analytics SaaS."""
import io
import csv
import uuid
import datetime
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from models import (
    ProductBase, ProductResponse, InvoiceResponse,
    DashboardData, InsightRequest, InsightResponse, UploadResponse
)
from database import (
    insert_invoice, insert_products, get_all_products,
    get_all_invoices, get_dashboard_data, seed_demo_data
)
from ocr import extract_products_from_image_gemini, encode_image_bytes
from ocr import extract_products_from_image_gemini, encode_image_bytes
from gemini_insights import generate_insights
from reports import generate_itr_report


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown events."""
    print("🚀 Starting Retail Analytics API...")
    # Empty startup - no demo data seeded
    yield
    print("👋 Shutting down...")


app = FastAPI(
    title="Retail Store Analytics API",
    description="AI-powered invoice OCR + Gemini insights for small retail shops",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Upload & OCR
# ──────────────────────────────────────────────

@app.post("/api/upload", response_model=UploadResponse)
async def upload_invoice(file: UploadFile = File(...)):
    """Upload an invoice image/PDF and extract product data via OCR."""
    if not file.filename:
        raise HTTPException(400, "No file provided")

    allowed = {
        ".png": "image/png", 
        ".jpg": "image/jpeg", 
        ".jpeg": "image/jpeg", 
        ".webp": "image/webp", 
        ".pdf": "application/pdf", 
        ".bmp": "image/bmp", 
        ".tiff": "image/tiff"
    }
    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in allowed:
        raise HTTPException(400, f"Unsupported file type: {ext}")

    mime_type = allowed[ext]
    contents = await file.read()

    # Encode document to base64
    doc_b64 = encode_image_bytes(contents)

    # Use Gemini Vision to read the invoice directly
    print(f"🔄 Using Gemini Vision to read the invoice ({ext}) directly")
    raw_text, products = extract_products_from_image_gemini(doc_b64, mime_type)

    if not products:
        raw_text = raw_text or "No text could be extracted from this image."
        # Still save the invoice record even with no products
        invoice = insert_invoice({
            "filename": file.filename,
            "upload_date": datetime.datetime.now().isoformat(),
            "raw_ocr_text": raw_text,
            "supplier": "Unknown",
        })
        return UploadResponse(
            invoice_id=invoice["id"],
            filename=file.filename,
            products_extracted=0,
            products=[],
            raw_text=raw_text,
        )

    # Store invoice
    invoice = insert_invoice({
        "filename": file.filename,
        "upload_date": datetime.datetime.now().isoformat(),
        "raw_ocr_text": raw_text,
        "supplier": products[0].get("supplier", "Unknown") if products else "Unknown",
    })

    # Store products
    for p in products:
        p["invoice_id"] = invoice["id"]
        p["created_at"] = datetime.datetime.now().isoformat()

    insert_products(products)

    return UploadResponse(
        invoice_id=invoice["id"],
        filename=file.filename,
        products_extracted=len(products),
        products=[ProductBase(**p) for p in products],
        raw_text=raw_text,
    )


# ──────────────────────────────────────────────
# Products
# ──────────────────────────────────────────────

@app.get("/api/products")
async def list_products(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    supplier: Optional[str] = Query(None),
):
    """List all products with optional filters."""
    products = get_all_products()

    if search:
        search_lower = search.lower()
        products = [
            p for p in products
            if search_lower in p.get("product_name", "").lower()
            or search_lower in p.get("supplier", "").lower()
        ]

    if category:
        products = [p for p in products if p.get("category", "").lower() == category.lower()]

    if supplier:
        products = [p for p in products if p.get("supplier", "").lower() == supplier.lower()]

    return {"products": products, "total": len(products)}


# ──────────────────────────────────────────────
# Invoices
# ──────────────────────────────────────────────

@app.get("/api/invoices")
async def list_invoices():
    """List all raw invoices."""
    invoices = get_all_invoices()
    return {"invoices": invoices, "total": len(invoices)}


# ──────────────────────────────────────────────
# Dashboard
# ──────────────────────────────────────────────

@app.get("/api/dashboard")
async def dashboard():
    """Get aggregated dashboard analytics."""
    return get_dashboard_data()


# ──────────────────────────────────────────────
# Insights
# ──────────────────────────────────────────────

@app.post("/api/insights")
async def get_insights(request: InsightRequest = None):
    """Generate AI-powered business insights using Gemini."""
    products = get_all_products()
    context = request.context if request else None
    festival = request.festival if request else None
    insights = generate_insights(products, context, festival)
    return insights


# ──────────────────────────────────────────────
# Export
# ──────────────────────────────────────────────

@app.get("/api/export/csv")
async def export_csv():
    """Export all product data as CSV."""
    products = get_all_products()
    if not products:
        raise HTTPException(404, "No products to export")

    output = io.StringIO()
    fieldnames = ["product_name", "quantity", "price", "supplier", "category", "created_at"]
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for p in products:
        writer.writerow(p)

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=products_export.csv"},
    )


# ──────────────────────────────────────────────
# Reports
# ──────────────────────────────────────────────

@app.get("/api/reports/itr")
async def get_itr_endpoint():
    """Get ITR and financial summary report."""
    return generate_itr_report()


# ──────────────────────────────────────────────
# Health
# ──────────────────────────────────────────────

@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "retail-analytics-api"}
