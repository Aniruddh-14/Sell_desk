"""Multi-Agent Definitions using PydanticAI."""
import os
from pydantic_ai import Agent
from pydantic_ai.models.groq import GroqModel
from pydantic_ai.models.gemini import GeminiModel
from dotenv import load_dotenv

load_dotenv()

# Load API keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# We initialize the models that our agents will use
# The Text/Reasoning agents will use Llama via Groq
groq_model = GroqModel("llama-3.3-70b-versatile") if GROQ_API_KEY else None

# The OCR/Vision agent will use Gemini since Groq's multimodal is limited/different
gemini_model = GeminiModel("gemini-2.5-flash") if GEMINI_API_KEY else None

# 1. OCR / Data Extraction Agent
ocr_agent = Agent(
    model=gemini_model,
    system_prompt=(
        "You are a Data Extraction Specialist."
        "Your only job is to look at uploaded invoices (images/PDFs) and extract "
        "the raw text and a structured list of products exactly as they appear."
        "You never analyze or provide business advice. You only extract facts."
    )
)

# 2. Financial Analyst Agent
analyst_agent = Agent(
    model=groq_model,
    system_prompt=(
        "You are an expert Retail Financial Analyst."
        "You analyze inventory data, sales volume, and pricing structures."
        "Your job is to identify slow-moving products, top-selling items to restock, "
        "and suggest pricing optimizations or festival-specific restocking strategies."
        "You must be concise and actionable. Rely on the data provided to you."
    )
)

# 3. Tax & Compliance Agent
tax_agent = Agent(
    model=groq_model,
    system_prompt=(
        "You are a strict Indian Tax & Compliance Consultant."
        "Your job is to review purchase expenses and identify the Estimated Input GST Credit (18%)."
        "You look for supplier concentration risks and advise on ITR readiness."
        "You only speak about taxes, compliance, and financial liability."
    )
)
