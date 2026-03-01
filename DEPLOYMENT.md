# FinSight-OCR Deployment Guide

This project consists of a **FastAPI backend** and a **React (Vite) frontend**. We recommend deploying the backend to **Render** and the frontend to **Vercel**.

## 1. Deploy the Backend (Render)

Render is perfect for Python/FastAPI backends.

1. Create a free account on [Render](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing this project.
4. Configure the Web Service with the following details:
   - **Name:** `finsight-ocr-backend` (or your preferred name)
   - **Language:** `Python 3`
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click on **Environment Variables** (or Advanced) and add the following keys:
   - `PYTHON_VERSION` set to `3.11.0`
   - `SUPABASE_URL` set to `<your-supabase-url>`
   - `SUPABASE_KEY` set to `<your-supabase-key>`
   - `GEMINI_API_KEY` set to `<your-gemini-key>`
6. Click **Create Web Service**.
7. Once the build finishes, Render will give you a public URL (e.g., `https://finsight-ocr-backend.onrender.com`).
   - **Copy this URL**, you will need it for the frontend!

---

## 2. Deploy the Frontend (Vercel)

Vercel is the fastest and easiest way to host a Vite React application.

1. In your project, open the `frontend/vercel.json` file.
2. Find the line that says `"destination": "https://<YOUR_RENDER_BACKEND_URL>/api/$1"`.
3. Replace `<YOUR_RENDER_BACKEND_URL>` with the actual URL Render gave you (e.g., `"destination": "https://finsight-ocr-backend.onrender.com/api/$1"`). 
   - *Ensure there is no trailing slash on the backend URL before `/api`.*
4. Commit and push this change to your GitHub repository.
5. Create a free account on [Vercel](https://vercel.com).
6. Click **Add New** -> **Project**.
7. Import your GitHub repository.
8. **VERY IMPORTANT**: Set the **Framework Preset** to `Vite`.
   - Set the **Root Directory** to `frontend`.
   - The build command should default to `npm run build` and the output directory should be `dist`.
9. Under **Environment Variables**, add your Supabase credentials so the frontend can authenticate users:
   - `VITE_SUPABASE_URL` = `<your-supabase-url>`
   - `VITE_SUPABASE_KEY` = `<your-supabase-anon-key>`
10. Click **Deploy**. Vercel will build and host your frontend.

### Troubleshooting
- **CORS Issues:** If your frontend cannot communicate with the backend on Render, ensure the `vercel.json` rewrites are correctly targeting your secure `https://...onrender.com` backend URL.
- **Backend API Key:** The frontend only needs Supabase credentials. Do **not** put your `GEMINI_API_KEY` in Vercel. That stays securely on the Render backend.
