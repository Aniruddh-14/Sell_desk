# FinSight-OCR Deployment Guide

This project consists of a **FastAPI backend** and a **React (Vite) frontend**. We recommend deploying the backend to **Render** and the frontend to **Vercel**.

## 1. Deploy the Backend (Render)

Render is perfect for Python/FastAPI backends.

1. Create a free account on [Render](https://render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository containing this project.
4. Render will automatically detect the `render.yaml` file in the root directory and configure the service for you.
5. In the Render Dashboard, you will be prompted to enter your Environment Variables. You MUST enter:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `GEMINI_API_KEY`
6. Click **Apply** or **Create Web Service**.
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
9. Click **Deploy**. Vercel will build and host your frontend.

### Troubleshooting
- **CORS Issues:** If your frontend cannot communicate with the backend on Render, ensure the `vercel.json` rewrites are correctly targeting your secure `https://...onrender.com` backend URL.
- **Environment Variables:** Remember that the frontend doesn't need the Supabase or Gemini keys. Those must be securely added to your Render web service environment settings.
