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
from gemini_insights import generate_insights
from reports import generate_itr_report
from auth_utils import get_current_user
from fastapi import Depends


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
async def upload_invoice(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
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
    try:
        raw_text, products = extract_products_from_image_gemini(doc_b64, mime_type)
    except Exception as ocr_err:
        print(f"⚠️ OCR failed: {ocr_err}")
        raise HTTPException(500, f"OCR extraction failed: {str(ocr_err)}")

    # Try to save the extracted data
    try:
        if not products:
            raw_text = raw_text or "No text could be extracted from this image."
            # Still save the invoice record even with no products
            invoice = insert_invoice({
                "filename": file.filename,
                "upload_date": datetime.datetime.now().isoformat(),
                "raw_ocr_text": raw_text,
                "supplier": "Unknown",
            }, user_id=user_id)
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
        }, user_id=user_id)

        # Store products
        for p in products:
            p["invoice_id"] = invoice["id"]
            p["created_at"] = datetime.datetime.now().isoformat()

        insert_products(products, user_id=user_id)

        return UploadResponse(
            invoice_id=invoice["id"],
            filename=file.filename,
            products_extracted=len(products),
            products=[ProductBase(**p) for p in products],
            raw_text=raw_text,
        )
    except Exception as db_err:
        error_msg = str(db_err)
        print(f"⚠️ Database error during upload: {error_msg}")
        if "row-level security" in error_msg.lower() or "42501" in error_msg:
            raise HTTPException(500, "Database security policy error. Please run the updated supabase_schema.sql in your Supabase SQL Editor.")
        raise HTTPException(500, f"Failed to save data: {error_msg}")


# ──────────────────────────────────────────────
# Products
# ──────────────────────────────────────────────

@app.get("/api/products")
async def list_products(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    supplier: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user)
):
    """List all products with optional filters."""
    products = get_all_products(user_id=user_id)

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
async def list_invoices(user_id: str = Depends(get_current_user)):
    """List all raw invoices."""
    invoices = get_all_invoices(user_id=user_id)
    return {"invoices": invoices, "total": len(invoices)}


# ──────────────────────────────────────────────
# Dashboard
# ──────────────────────────────────────────────

@app.get("/api/dashboard")
async def dashboard(user_id: str = Depends(get_current_user)):
    """Get aggregated dashboard analytics."""
    return get_dashboard_data(user_id=user_id)


# ──────────────────────────────────────────────
# Insights
# ──────────────────────────────────────────────

@app.post("/api/insights")
async def get_insights(
    request: InsightRequest = None,
    user_id: str = Depends(get_current_user)
):
    """Generate AI-powered business insights using Gemini."""
    products = get_all_products(user_id=user_id)
    context = request.context if request else None
    festival = request.festival if request else None
    insights = generate_insights(products, context, festival)
    return insights


# ──────────────────────────────────────────────
# Export
# ──────────────────────────────────────────────

@app.get("/api/export/csv")
async def export_csv(user_id: str = Depends(get_current_user)):
    """Export all product data as CSV."""
    products = get_all_products(user_id=user_id)
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
async def get_itr_endpoint(user_id: str = Depends(get_current_user)):
    """Get ITR and financial summary report."""
    return generate_itr_report(user_id=user_id)


# ──────────────────────────────────────────────
# Health
# ──────────────────────────────────────────────

@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "retail-analytics-api"}
