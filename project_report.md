# RetailIQ: Smart Store Analytics Hub

**One-line project description:** An AI app that helps local shop owners finally make sense of their supplier invoices to stock better and earn more.

---

## 1. Problem Statement
**Problem Title:** The "Flying Blind" Inventory Problem for Small Shops
**Problem Description:** If you walk into a local Kirana store or pharmacy, the owner usually has a stack of paper bills from distributors. They buy stock based on gut feeling rather than data because punching hundreds of items from paper into a computer is just too much work. Because of this, cash gets tied up in items that sit on shelves for months, while fast-moving items keep running out.
**Target Users:** Local grocery shops (Kirana stores), independent pharmacies, hardware stores, and neighborhood boutiques.
**Existing Gaps:** Big POS (Point of Sale) systems are expensive and built for supermarkets, not tiny mom-and-pop shops. Most software assumes the owner has time to sit down and type in data. They don't.

## 2. Problem Understanding & Approach
**Root Cause Analysis:** The core bottleneck is data entry. The data exists—it's just trapped on paper invoices and receipts.
**Solution Strategy:** We realized the easiest way for a shop owner to digitize data is just taking a picture. So, our approach is to use AI to "read" the invoice image, automatically extract every line item, and then use a second layer of AI to look at that data and tell the owner exactly what they should do next (like "you're buying too much soap, but running out of rice").

## 3. Proposed Solution
**Solution Overview:** We built RetailIQ. It’s a super simple web dashboard where a shop owner uploads a photo or PDF of their supplier bill. Behind the scenes, we use Gemini Vision to read it, save it, and instantly show charts of their best sellers and dead stock.
**Core Idea:** Zero manual entry. Upload image -> Get business advice.
**Key Features:**
- **Auto-Extract:** Drop an invoice image, and we pull the product name, quantity, price, and supplier.
- **Visual Dashboard:** Clean charts showing revenue, profit spread, and what's moving fast.
- **Smart AI Advice:** A dedicated tab where Gemini acts as a business consultant, warning about slow movers and suggesting what to buy before the next big festival.
- **One-Click Export:** Download everything to a CSV for the accountant.

## 4. System Architecture
**High-Level Flow:**
`User (Browser)` → `Uploads Image` → `React Frontend` → `FastAPI Backend` → `Gemini Vision (Reads Text)` → `Supabase (Saves Data)` → `Gemini AI (Thinks & Analyzes)` → `Dashboard (Shows Results)`

**Architecture Description:** 
We went with a standard client-server setup. The frontend is built in React (using Vite for speed). When someone uploads a bill, the FastAPI backend grabs it and hands the image directly to Google's Gemini Vision API. We told Gemini to look at the picture and return strict JSON data. We save that JSON into our Supabase PostgreSQL database. Then, whenever the user wants insights, the backend pulls their data, sends it to the Gemini text model, and asks for tailored business advice.

*(Add system architecture diagram image here)*

## 5. Database Design
**ER Diagram Description:**
We kept the database relational but simple, using two core tables:
1.  **Invoices:** Tracks the actual uploads.
    *   `id` (UUID, Primary Key)
    *   `filename` (Text)
    *   `upload_date` (Timestamp)
    *   `raw_ocr_text` (Text) - Just in case we need to re-parse later.
    *   `supplier` (Text)
2.  **Products:** The individual line items pulled from the bills.
    *   `id` (UUID, Primary Key)
    *   `invoice_id` (UUID, Foreign Key linking back to the invoice)
    *   `product_name` (Text)
    *   `quantity` (Integer)
    *   `price` (Numeric)
    *   `supplier` (Text)
    *   `category` (Text)

*(Add ER diagram image here)*

## 6. Dataset Selected
**Dataset Name:** Custom Seeded Indian Retail Data
**Source:** We generated realistic, synthetic FMCG data specifically for this hackathon.
**Data Type:** JSON / Relational DB rows.
**Selection Reason:** We needed data that actually looks like what a local shop buys—things like "10kg Ashirvaad Atta" or "Parle-G Biscuits." Using generic western datasets wouldn't show how well the AI understands local context and festival demands (like Diwali or Holi).
**Preprocessing Steps:** For real uploads, the images are converted to Base64 before hitting the API. The AI output is heavily sanitized to ensure it's valid JSON before hitting the database.

## 7. Model Selected
**Model Name:** Google `gemini-2.5-flash`
**Selection Reasoning:** 
We originally tried using a dedicated open-source OCR model (vLLM with Nanonets), but it was way too brittle when invoice formats changed. We switched completely to `gemini-2.5-flash` because:
1. **It has eyes:** The multimodal vision capabilities read messy bills flawlessly without us needing to write fragile Regex parsers.
2. **It's fast:** "Flash" lives up to its name. Waiting 30 seconds for a bill to process isn't good UX; Gemini does it in seconds.
3. **It's smart:** We can use the exact same model to give business advice later.
**Alternatives Considered:** Tesseract OCR (too inaccurate), AWS Textract (too hard to setup quickly for a hackathon).
**Evaluation Metrics:** We measured success by how often the API returned perfect, unbroken JSON arrays of products that could be inserted directly into SQL.

## 8. Technology Stack
**Frontend:** React.js, Vite, Tailwind-style custom CSS, Recharts (for the graphs).
**Backend:** Python, FastAPI, Uvicorn.
**ML/AI:** Google Generative AI Python SDK (`gemini-2.5-flash`).
**Database:** Supabase (PostgreSQL).
**Deployment:** Docker and Docker Compose (makes it runnable anywhere in one click).

## 9. API Documentation & Testing
**API Endpoints List:**
- **Endpoint 1:** `POST /api/upload` - Give it an image, it returns the extracted product JSON.
- **Endpoint 2:** `GET /api/dashboard` - Computes the math for the charts (totals, averages, top 10 lists).
- **Endpoint 3:** `POST /api/insights` - Feeds the database to Gemini to get tailored advice (can filter by upcoming festivals).
- **Endpoint 4:** `GET /api/products` - Returns everything in the DB with search and filter support.
- **Endpoint 5:** `GET /api/export/csv` - Downloads the DB as a spreadsheet for accountants.

*(Add Postman / Thunder Client screenshots here)*

## 10. Module-wise Development & Deliverables
**Checkpoint 1: Research & Planning**
- Deliverables: Figured out the core problem, sketched the UI, and wrote the SQL schema.
**Checkpoint 2: Backend Development**
- Deliverables: Spun up the FastAPI server, wrote the Supabase integration, and tested the endpoints.
**Checkpoint 3: Frontend Development**
- Deliverables: Built the React dashboard. Focused heavily on a premium "glassmorphism" look so it doesn't feel like boring enterprise software. Added drag-and-drop for the uploads.
**Checkpoint 4: Model Integration (Vision)**
- Deliverables: Nailed down the exact system prompt for Gemini Vision to ensure it never hallucinated products and always returned valid JSON.
**Checkpoint 5: AI Insights Integration**
- Deliverables: Wrote the logic to pull the database state and ask Gemini to act as a fractional CFO for the shop owner.
**Checkpoint 6: Wrapping Up**
- Deliverables: Dockerized the whole thing so judges can run it without dependency hell.

## 11. End-to-End Workflow
1. The shop owner takes a picture of a fresh bill from their distributor.
2. They drag and drop it into the RetailIQ upload page.
3. The Vite frontend sends it to FastAPI, which forwards it to Gemini Vision.
4. Gemini reads the image, structuring it into neat data rows.
5. The backend saves this right into Supabase.
6. The dashboard instantly updates. The owner can now see that this new buy pushed their total investment up, and they can click over to the "Insights" tab to ask Gemini if this was a smart purchase for the current season.

## 12. Demo & Video
**Live Demo Link:** (Add link here)
**Demo Video Link:** (Add Loom or YouTube link here)
**GitHub Repository:** (Add GitHub repo link here)

## 13. Hackathon Deliverables Summary
- A fully working, full-stack MVP built from scratch during the hackathon.
- A completely containerized backend + frontend.
- Production-ready integrations with Supabase and Google Gemini.
- This documentation.

## 14. Team Roles & Responsibilities
| Member Name | Role | Responsibilities |
| :--- | :--- | :--- |
| (Your Name) | Solo Founder / Full Stack | Did everything: Frontend UI, FastAPI backend, Database schema, and AI prompt engineering. |

## 15. Future Scope & Scalability
**Short-Term:** 
- Add user accounts (multi-tenancy) so anybody can sign up and get their own isolated database space.
- Add support for WhatsApp. The owner just WhatsApps a photo of the bill to a bot, and it automatically updates their dashboard without them even opening the web app.
**Long-Term:** 
- Build a native mobile app.
- Partner with distributors so the AI can automatically place restock orders for the fast-moving goods before the store actually runs out.

## 16. Known Limitations
- If the uploaded picture is incredibly blurry or shot in the dark, Gemini sometimes struggles to read prices correctly.
- Currently, if a PDF invoice has 10 pages, we only scan the first page to save on API tokens during the hackathon phase.

## 17. Impact
Local commerce runs on paper and intuition. By giving a shop owner the same level of data analytics that Amazon has—just by making them take a picture of a piece of paper—we can help them free up trapped cash, reduce stockouts, and genuinely build a more profitable livelihood. This isn't just a cool tech demo; it's a tool that puts money back in the pockets of hardworking small business owners.
