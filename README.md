# 🏪 RetailIQ — Smart Store Analytics

AI-powered retail analytics SaaS that helps small shop owners make data-driven product decisions using **invoice OCR** and **Gemini AI insights**.

## ✨ Features

- 📄 **Invoice OCR** — Upload invoices/receipts, extract product data via vLLM + Nanonets-OCR2-3B
- 📊 **Dashboard** — Top sellers, slow movers, revenue by supplier, category distribution
- 🧠 **AI Insights** — Gemini-powered recommendations: what to stock, what to avoid, festival-specific tips
- 🗃️ **Data Table** — Sortable, searchable product database with CSV export
- 🐳 **Docker Ready** — One-command deployment

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env    # Add your API keys
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Docker (Alternative)

```bash
docker-compose up --build
```

Open **http://localhost:5173** in your browser.

## 🔑 Configuration

Edit `backend/.env`:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Supabase anon key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `VLLM_BASE_URL` | vLLM server URL (default: `http://localhost:8000/v1`) |

> **Note:** The app works without any API keys using demo/mock data for hackathon presentations.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | FastAPI (Python) |
| OCR | vLLM + nanonets/Nanonets-OCR2-3B |
| AI Insights | Google Gemini API |
| Database | Supabase (with in-memory fallback) |
| Charts | Recharts |
| Deploy | Docker Compose |

## 📁 Project Structure

```
retail-analytics/
├── backend/
│   ├── main.py              # FastAPI endpoints
│   ├── ocr.py               # vLLM OCR integration
│   ├── gemini_insights.py   # Gemini AI analysis
│   ├── database.py          # Supabase + local storage
│   ├── models.py            # Pydantic schemas
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── api/client.js    # API client
│   │   └── index.css        # Design system
│   └── Dockerfile
└── docker-compose.yml
```

---

Built with ❤️ for hackathon judges 🏆
