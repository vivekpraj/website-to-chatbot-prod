import asyncio
from urllib import response
import httpx

async def send_request():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://website-to-chatbot-prod.onrender.com/api/chat/11011b41-dbb7-4746-ac45-cc62007bf45a",
            json={"message": "what is this website about?"},
            timeout=60
        )
        print(response.status_code)
        print(response.text) 

async def main():
    await send_request()
    await asyncio.sleep(2)
    await send_request()
    await asyncio.sleep(2)
    await send_request()

asyncio.run(main())