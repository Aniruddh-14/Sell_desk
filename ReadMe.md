# FinSight OCR 🚀

> **"Transforming static invoices into strategic retail intelligence."**

---

## 📌 Project Overview
**FinSight OCR** is a next-generation AI SaaS designed for small-to-medium retail businesses. By combining high-performance OCR via **vLLM** and deep reasoning via **Google Gemini**, we turn messy stacks of paper invoices into a real-time "Command Center" for inventory, profit tracking, and festival demand forecasting.

---

## 1. Problem Statement

### **Problem Title**
The "Data Trap" in Traditional Retail Inventory Management.

### **Problem Description**
Most small shop owners manage stock based on intuition. Invoices arrive as physical papers, and manual entry into accounting systems is slow and error-prone. This lead to "Dark Data"—information that exists but isn't used to make decisions.

### **Target Users**
* **Retailers:** Kirana stores, pharmacies, and hardware shops.
* **Wholesalers:** Handling high-volume daily supply bills.
* **Accountants:** Seeking to automate data entry for clients.

### **Existing Gaps**
Existing billing apps (like Vyapar or Tally) are reactive—they record what happened. **FinSight OCR** is proactive—it tells you what *will* happen.

---

## 2. Problem Understanding & Approach

### **Root Cause Analysis**
* **Friction:** It takes 10–15 minutes to manually log a single complex invoice.
* **Invisibility:** Owners don't see price hikes from suppliers immediately.
* **Waste:** Over-stocking slow-moving goods ties up critical cash flow.

### **Solution Strategy**
We utilize a **Vision-to-Insight** pipeline:
1.  **Extract:** Nanonets-OCR2-3B (via vLLM) pulls raw table data.
2.  **Organize:** FastAPI structures this into a PostgreSQL database.
3.  **Advise:** Google Gemini analyzes the trends to give plain-English business advice.

---

## 3. Proposed Solution

### **Core Idea**
A "Smart Billing Assistant" that reads invoices like a human but thinks like a Data Scientist.

### **Key Features**
* **Intelligent Extraction:** Captures Product Name, Quantity, Unit Price, Tax, and Supplier.
* **The "Festival" Predictor:** AI alerts for upcoming spikes (e.g., "Holi is in 14 days—Increase colors and sweets stock by 40%").
* **Margin Guard:** Automatically flags if a supplier has increased prices compared to your last upload.
* **Live Dataset View:** A transparent, editable table for human-in-the-loop verification.
* **One-Click Export:** Seamless CSV/PDF exports for tax filing.

---

## 4. System Architecture

### **High-Level Flow**
`User (Image/PDF)` → `Next.js App` → `FastAPI` → `vLLM (Nanonets 3B OCR)` → `Supabase/PostgreSQL` → `Gemini 1.5 Flash` → `Insights Dashboard`

### **Architecture Description**
FinSight OCR uses an **Asynchronous Processing Architecture**. While the heavy OCR model processes the image on a GPU-enabled worker (vLLM), the UI remains responsive, updating the user in real-time as data populates the dashboard.

---

## 5. Technology Stack

* **Frontend:** React.js 14, Tailwind CSS, Shadcn/UI, Recharts.
* **Backend:** FastAPI (Python), LangChain.
* **ML/AI:** vLLM (serving Nanonets-OCR2-3B), Google Gemini API.
* **Database:** Supabase (PostgreSQL).
* **Deployment:** Docker, AWS EC2 (GPU Instances).

---

## 6. Model Selection & Reasoning

| Component | Model | Why? |
| :--- | :--- | :--- |
| **OCR** | **Nanonets-OCR2-3B** | Best-in-class for structured document extraction at low latency. |
| **Insights** | **Gemini 2.5 Flash** | Optimized for speed and large context windows; perfect for comparing months of sales data. |

---

## 7. Module-wise Deliverables

* **Module 1: The Eye (OCR):** Functional endpoint to convert image to structured JSON.
* **Module 2: The Vault (DB):** Schema to track products, prices, and supplier history.
* **Module 3: The Brain (AI):** Prompt logic for Gemini to generate "Buy/Avoid" lists.
* **Module 4: The Face (UI):** Clean, high-contrast dashboard for shop-floor use.

---

## 8. End-to-End Workflow
1.  **Upload:** User snaps a photo of the invoice.
2.  **OCR Processing:** FinSight extracts line items instantly.
3.  **DB Sync:** Data is saved and reconciled with previous entries.
4.  **Insight Generation:** Gemini generates a "Strategic Memo" for the owner.
5.  **Action:** Owner exports data or adjusts orders based on AI suggestions.

---

## ER Diagram 
**link** https://drive.google.com/file/d/1aFRv7eaUjGaM8Sr5c264G744x-1Pqy19/view?usp=sharing


## 10. Future Scope
* **Voice Commands:** "FinSight, how much did I spend on milk this month?"
* **Multi-Store Sync:** Manage 5 stores from a single dashboard.
* **Direct Supplier Chat:** AI-drafted emails to negotiate prices when a hike is detected.

