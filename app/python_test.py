import asyncio
from urllib import response
import httpx

async def send_request():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://website-to-chatbot-prod.onrender.com/api/chat/9ca98f63-0218-43e0-a91f-86d6f0786e44",
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