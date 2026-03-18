import asyncio
from urllib import response
import httpx

async def send_request():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://website-to-chatbot-prod.onrender.com/api/chat/5286ac79-0686-4362-8b3c-c16096ebc714",
            json={"message": "what is this website about?"},
            timeout=60
        )
        print(response.status_code)
        print(response.text) 

async def main():
    await asyncio.gather(
        send_request(),
        send_request(),
        send_request()
    )

asyncio.run(main())