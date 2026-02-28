# 🚀 FinSight OCR

> Transforming static invoices into strategic retail intelligence.

---

## 📌 Project Title  
**FinSight OCR – AI-Powered Retail Intelligence System**

## 📝 One-line Project Description  
An AI-driven SaaS platform that converts invoice images into structured data and actionable retail business intelligence.

---

# 1. Problem Statement

## Problem Title  
The “Data Trap” in Traditional Retail Inventory Management

## Problem Description  
Small and medium retailers rely heavily on intuition and manual bookkeeping. Invoices are stored as paper documents, and manual data entry into billing software is slow and error-prone.

This creates **“Dark Data”** — valuable business information that exists but is not leveraged for strategic decision-making.

Retailers lack:
- Real-time analytics  
- Supplier price monitoring  
- Seasonal demand forecasting  
- Automated GST & tax reporting  
- Predictive intelligence tools  

## Target Users  
- Kirana Stores  
- Pharmacies  
- Hardware Shops  
- Wholesalers  
- Accountants  
- Multi-store Retail Owners  

## Existing Gaps  
- Manual invoice entry  
- No supplier price tracking  
- No demand forecasting  
- No festival-based stocking insights  
- Reactive reporting instead of predictive intelligence  

---

# 2. Problem Understanding & Approach

## Root Cause Analysis  
- High friction in invoice logging (10–15 minutes per invoice)  
- No visibility into supplier price fluctuations  
- Overstocking slow-moving goods  
- No integrated analytics layer  
- Manual GST & compliance reporting  

## Solution Strategy  

We implement a **Vision-to-Insight Pipeline**:

1. Extract structured invoice data using AI-powered OCR  
2. Store data in a relational database  
3. Analyze historical patterns using LLM reasoning  
4. Generate strategic business insights  
5. Provide compliance-ready GST & tax reports  

---

# 3. Proposed Solution

## Solution Overview  
FinSight OCR is a full-stack AI retail assistant that automates invoice processing and transforms transactional data into strategic business recommendations.

## Core Idea  
**Read like a human. Think like a data scientist.**

## Key Features  

### 🏠 Smart Dashboard  
- Revenue overview  
- Expense tracking  
- Profit estimation  
- AI-generated strategic memo  
- Festival demand alerts  

### 🏢 Suppliers Module  
- Supplier database  
- Historical price tracking  
- Automatic price hike detection  

### 📦 Items Module  
- Inventory tracking  
- Margin analysis  
- Fast/Slow moving product detection  

### 📊 Sales Module  
- Daily & monthly analytics  
- Revenue trends  
- Buying behavior insights  

### 🧾 Purchases Module  
- OCR-based invoice upload  
- Purchase history analysis  

### 💰 Expenses Module  
- Operational expense management  
- Category-wise breakdown  

### 📈 Reports (Data Analyst Layer)  
- Sales & purchase trends  
- Seasonal forecasting  
- Profit & Loss reports  
- Buy/Avoid recommendations  

### 🧮 GST & ITR Reports  
- GST-ready exports  
- Tax summary reports  
- Accountant-friendly CSV/PDF generation  

---

# 4. System Architecture

## High-Level Flow  

User → Frontend → Backend → OCR Model → Database → AI Model → Dashboard  
User (Invoice Image)
↓
Frontend (React.js)
↓
Backend (FastAPI)
↓
OCR Model (vLLM + Nanonets-OCR2-3B)
↓
PostgreSQL Database
↓
Gemini AI Insights
↓
Dashboard Response 

## Architecture Description  

- User uploads invoice image  
- Backend processes image via OCR model  
- Structured data stored in PostgreSQL  
- Gemini generates strategic insights  
- Dashboard updates asynchronously  

This modular architecture ensures:
- Low latency processing  
- Scalable AI pipeline  
- Cloud-ready deployment  

---

# 5. Database Design

## Core Entities  
- Users  
- Suppliers  
- Products  
- Invoices  
- Sales  
- Purchases  
- Expenses  
- Tax Records  

## Relationships  
- One User → Many Invoices  
- One Supplier → Many Purchases  
- One Product → Multiple Transactions  

This enables:
- Supplier price history tracking  
- Product margin monitoring  
- GST reporting  
- Profit calculations  

([Added ER diagram image here](https://drive.google.com/file/d/1aFRv7eaUjGaM8Sr5c264G744x-1Pqy19/view?usp=sharing))

---

# 6. Dataset Selected

## Dataset Name  
Retail Invoice Dataset (Custom + OCR Testing Samples)

## Source  
- Sample retail invoices  
- Synthetic invoice data  
- Public OCR benchmarking datasets  

## Data Type  
- Invoice images (JPEG, PNG, PDF)  
- Structured financial tabular data  

## Selection Reason  
Simulates real-world Indian retail billing formats.

## Preprocessing Steps  
- Image resizing  
- Noise reduction  
- Table normalization  
- Field mapping  
- JSON schema validation  

---

# 7. Model Selected

## OCR Model  
Nanonets-OCR2-3B (served via vLLM)

## Insights Model  
Gemini 2.5 Flash

## Selection Reasoning  
- High structured table extraction accuracy  
- Low latency inference  
- Large context window for trend analysis  
- Fast reasoning optimized for SaaS dashboards  

## Alternatives Considered  
- Tesseract OCR  
- PaddleOCR  
- GPT-based OCR  
- Claude for reasoning  

## Evaluation Metrics  
- Extraction Accuracy (%)  
- Field Detection Precision  
- Latency (ms)  
- Business Insight Relevance Score  

---

# 8. Technology Stack

## Frontend  
- React.js 14  
- Tailwind CSS  
- Shadcn/UI  
- Recharts  

## Backend  
- FastAPI (Python)  
- LangChain  

## ML/AI  
- vLLM  
- Nanonets-OCR2-3B  
- Gemini API  

## Database  
- Supabase (PostgreSQL)  

## Deployment  
- Docker  
- AWS EC2 (GPU Instances)  

---

# 9. API Documentation & Testing

## Endpoints  

### POST /api/upload  
Upload invoice image  

### GET /api/insights  
Retrieve AI-generated business insights  

### GET /api/gst-report  
Generate GST-ready report  

(Add Postman / Thunder Client screenshots here)

---

# 10. Module-wise Development

## Checkpoint 1 – Research & Planning  
- Problem analysis  
- Architecture blueprint  

## Checkpoint 2 – Backend Development  
- FastAPI endpoints  
- Database schema  
- OCR integration  

## Checkpoint 3 – Frontend Development  
- Dashboard UI  
- Data tables  
- Analytics charts  

## Checkpoint 4 – Model Setup  
- OCR configuration  
- Prompt engineering  
- Validation testing  

## Checkpoint 5 – Integration  
- OCR → DB pipeline  
- AI insights integration  

## Checkpoint 6 – Deployment  
- Docker containers  
- AWS EC2 setup  
- Production-ready API  

---

# 11. End-to-End Workflow

1. Upload invoice  
2. OCR extracts structured data  
3. Data stored in database  
4. AI analyzes trends  
5. Strategic memo generated  
6. GST & ITR reports available  

---

# 12. Demo & Video

Live Demo Link: (Add link here)  
Demo Video Link: (Add link here)  
GitHub Repository: https://github.com/ananyapandey9895/FinSight-OCR

---

# 13. Hackathon Deliverables Summary

- Working OCR pipeline  
- AI-powered insights dashboard  
- GST report generation  
- Supplier price tracking  
- Fully deployed SaaS prototype  

---

# 14. Team Roles & Responsibilities

| Member Name | Role | Responsibilities |
|-------------|------|-----------------|
| (Anuj) | Backend Developer | API & Database |
| (Ananya) | Frontend Developer | UI & Dashboard |
| (Manmath) | AI Engineer | OCR + Gemini Integration |

---

# 15. Future Scope & Scalability

## Short-Term  
- Voice-based analytics  
- Multi-store sync  
- POS integration  

## Long-Term  
- Predictive cash flow engine  
- Supplier negotiation automation  
- AI-powered loan risk scoring  
- Advanced seasonal forecasting  

---

# 16. Known Limitations

- OCR accuracy depends on image quality  
- Internet required for AI inference  
- Forecast accuracy improves with historical data  

---

# 17. Impact

FinSight OCR empowers small retailers with enterprise-level AI intelligence, improving:

- Profit margins  
- Inventory efficiency  
- Tax compliance  
- Strategic decision-making  

It transforms traditional retail stores into data-driven smart businesses.

