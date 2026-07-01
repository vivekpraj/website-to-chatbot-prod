import asyncio
from urllib import response
import httpx

async def send_request():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://website-to-chatbot-prod.onrender.com/api/chat/6680f4d7-4f25-4121-a266-9d313b194883",
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