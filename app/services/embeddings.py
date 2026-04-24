import os
import httpx
from typing import List
from dotenv import load_dotenv

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
HF_URL = f"https://router.huggingface.co/hf-inference/models/{HF_MODEL}"

async def embed_text(texts: List[str]) -> List[List[float]]:
    if not HF_API_TOKEN:
        raise Exception("HF_API_TOKEN not set in environment variables")

    embeddings = []

    for text in texts:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"https://api-inference.huggingface.co/pipeline/feature-extraction/{HF_MODEL}",
                headers={
                    "Authorization": f"Bearer {HF_API_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={"inputs": text}
            )

        if response.status_code != 200:
            raise Exception(f"HF embedding failed: {response.status_code} - {response.text}")

        result = response.json()

        if isinstance(result, list) and len(result) > 0:
            if isinstance(result[0], list):
                vector = result[0]
            else:
                vector = result
        else:
            raise Exception(f"Unexpected response format: {type(result)}")

        embeddings.append(vector)

    return embeddings

# -------------------------------------------------
# 🔍 QUICK LOCAL TEST (run this file directly)
# -------------------------------------------------
if __name__ == "__main__":
    print("Testing Hugging Face Embedding API...")
    
    if not HF_API_TOKEN:
        print("❌ Error: HF_API_TOKEN not found in environment!")
        print("Please add it to your .env file:")
        print("HF_API_TOKEN=hf_your_token_here")
        exit(1)

    print(f"Using token: {HF_API_TOKEN[:10]}...")
    test_text = ["Hello, this is a test sentence."]
    
    try:
        vectors = embed_text(test_text)
        print("✅ API working!")
        print("Vector length:", len(vectors[0]))
        print("First 5 values:", vectors[0][:5])
    except Exception as e:
        print(f"❌ Error: {e}")