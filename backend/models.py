"""Pydantic models for request/response schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    product_name: str
    quantity: int = 0
    price: float = 0.0
    supplier: Optional[str] = None
    category: Optional[str] = None


class ProductResponse(ProductBase):
    id: str
    invoice_id: Optional[str] = None
    created_at: Optional[str] = None


class InvoiceResponse(BaseModel):
    id: str
    filename: str
    upload_date: Optional[str] = None
    raw_ocr_text: Optional[str] = None
    supplier: Optional[str] = None
    products: list[ProductBase] = []


class DashboardData(BaseModel):
    total_products: int = 0
    total_revenue: float = 0.0
    avg_price: float = 0.0
    supplier_count: int = 0
    top_selling: list[dict] = []
    slow_moving: list[dict] = []
    profit_analysis: list[dict] = []
    category_distribution: list[dict] = []
    monthly_sales: list[dict] = []


class InsightRequest(BaseModel):
    context: Optional[str] = None
    festival: Optional[str] = None


class InsightResponse(BaseModel):
    stock_more: list[str] = []
    products_to_avoid: list[str] = []
    festival_recommendations: list[str] = []
    general_insights: list[str] = []
    raw_response: Optional[str] = None


class UploadResponse(BaseModel):
    invoice_id: str
    filename: str
    products_extracted: int
    products: list[ProductBase]
    raw_text: str
