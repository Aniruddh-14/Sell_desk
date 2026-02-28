"""Gemini API integration for retail business insights."""
import os
import json
import asyncio
from typing import List, Optional
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.groq import GroqModel
from dotenv import load_dotenv

from agents import analyst_agent, tax_agent, groq_model
from tools import fetch_inventory_data

load_dotenv()

# Define the expected JSON shape from the final orchestrator
class RetailInsightsSchema(BaseModel):
    stock_more: List[str]
    products_to_avoid: List[str]
    festival_recommendations: List[str]
    general_insights: List[str]

# Create the Swarm Orchestrator Agent
orchestrator = Agent(
    model=groq_model,
    system_prompt=(
        "You are the Lead Insights Orchestrator for RetailIQ. "
        "Your job is to read the inputs from the specialized agents (Analyst & Tax) "
        "and combine them into a single, perfectly structured JSON response."
        "You MUST output raw JSON matching this schema:\n"
        "{\n"
        '  "stock_more": ["str"],\n'
        '  "products_to_avoid": ["str"],\n'
        '  "festival_recommendations": ["str"],\n'
        '  "general_insights": ["str"]\n'
        "}\n"
        "Do NOT include markdown formatting or ANY other text, just the raw JSON."
    )
)

def generate_insights(products: list[dict], context: str = None, festival: str = None) -> dict:
    """Generate business insights using a Multi-Agent Swarm."""
    if not products:
        return _get_demo_insights()

    try:
        # Run the swarm synchronously to return the API result
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(_run_swarm(context, festival))
        loop.close()
        return result
    except Exception as e:
        print(f"⚠️  Swarm execution failed: {e} — using demo insights")
        return _get_demo_insights()

async def _run_swarm(context: Optional[str], festival: Optional[str]) -> dict:
    """Run the multi-agent workflow."""
    # 1. Provide the agents with the tool to get their data
    db_text = fetch_inventory_data()
    
    # 2. Add extra user context if provided
    extra = ""
    if context:
        extra += f"\nUser Context: {context}"
    if festival:
        extra += f"\nUpcoming Festival: {festival}"

    # 3. Ask Analyst Agent to think
    print("🤖 Agent [Analyst]: Analyzing inventory metrics...")
    analyst_result = await analyst_agent.run(
        f"Review this database and suggest stock actions, slow movers, and festival plans: {db_text} {extra}"
    )

    # 4. Ask Tax Agent to think
    print("🤖 Agent [Tax]: Analyzing GST and ITR implications...")
    tax_result = await tax_agent.run(
        f"Review this database and advise on estimated GST input credits and supplier concentration risks: {db_text}"
    )

    # 5. Bring it together with the Orchestrator to format as our required UI JSON
    print("🤖 Agent [Orchestrator]: Synthesizing Swarm insights...")
    combine_prompt = (
        f"Merge these two agent reports into the required JSON schema.\n\n"
        f"--- Analyst Report ---\n{analyst_result.output}\n\n"
        f"--- Tax Report ---\n{tax_result.output}"
    )
    
    final_result = await orchestrator.run(combine_prompt)
    
    # Final data conversion
    try:
        data = json.loads(final_result.output)
    except json.JSONDecodeError:
        data = {
            "stock_more": [],
            "products_to_avoid": [],
            "festival_recommendations": [],
            "general_insights": ["Orchestrator failed to format JSON properly. Raw output: " + final_result.output]
        }
        
    data["raw_response"] = f"Orchestrated by RetailIQ Swarm:\n\n1. Analyst: {analyst_result.output}\n\n2. Tax & Compliance: {tax_result.output}"
    
    print("✅ Swarm execution complete")
    return data


def _build_product_summary(products: list[dict]) -> str:
    """Build a text summary of product data (Left here for backward compatibility if needed)."""


def _get_demo_insights() -> dict:
    """Return demo insights for hackathon presentation."""
    return {
        "stock_more": [
            "Parle-G Biscuits — Highest turnover rate at 300 units, extremely low price point makes it an everyday essential. Increase stock by 20%.",
            "Maggi Noodles — Strong steady demand at 250 units. Quick-commerce trend boosts instant food sales. Stock up before exam seasons.",
            "Toor Dal 1kg — Staple grocery item with consistent demand (200 units). Price is competitive at ₹135. Maintain buffer stock.",
            "Basmati Rice 5kg — Good margin product (₹320 × 150 units = ₹48,000 revenue). Essential for festival seasons.",
            "Haldiram Namkeen — Fast-moving snack category (120 units). Increase variety to capture more snack market share.",
        ],
        "products_to_avoid": [
            "Organic Honey 500g — Very slow mover (only 5 units). High price point ₹520 limits customer base. Consider removing or reducing stock.",
            "Lay's Chips Party Pack — Only 8 units moved. Large pack sizes don't suit daily shoppers. Switch to smaller SKUs.",
            "Paper Napkins 100pk — Low demand (12 units) with thin margins. Not a priority restock item.",
            "Pepsi 2L 6-pack — Low turnover (15 units). Customers prefer single bottles. Switch to 500ml/600ml variants.",
        ],
        "festival_recommendations": [
            "🪔 Diwali (Oct-Nov): Stock up on Cadbury gift boxes, dry fruits, cooking oils, sugar, and sweets packaging. Expect 3x demand spike.",
            "🎉 Holi (Mar): Increase beverage inventory (Pepsi, juices), snacks (namkeen, chips), and colors/water guns if applicable.",
            "🙏 Navratri (Oct): Stock religious items, fruits, sabudana, and special fasting foods. Dairy products see increased demand.",
            "📚 Back to School (Jun-Jul): Stock stationery items, lunch box snacks (biscuits, chips), and beverages.",
            "🏏 IPL Season (Apr-May): Snacks and beverages see 2x demand. Stock party-size packs and cold drinks.",
        ],
        "general_insights": [
            "📊 Revenue concentration: FMCG Hub supplies 7 of 20 products. Negotiate bulk discounts for 5-10% cost savings.",
            "💰 High-margin focus: Cadbury Dairy Milk (₹850/box) and Nescafe Coffee (₹380) have strong margins. Create combo offers.",
            "📦 Inventory optimization: Set reorder points at 25% of current stock levels to avoid stockouts on fast movers.",
            "🏪 Category gap: No fresh produce or frozen foods. Adding even 5 items could capture new customer segments.",
            "📈 Price strategy: Bundle slow movers with fast movers (e.g., 'Buy Rice, Get Honey at 10% off') to clear excess stock.",
            "🤝 Supplier diversification: 35% of inventory from FMCG Hub creates risk. Add 1-2 alternative suppliers.",
        ],
        "raw_response": "Demo insights generated for hackathon presentation",
    }
