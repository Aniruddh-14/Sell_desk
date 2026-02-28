import asyncio
from gemini_insights import _run_swarm

async def main():
    try:
        res = await _run_swarm("test", None)
        print("SUCCESS")
        print(res)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    asyncio.run(main())
