import os
import httpx
import cloudinary
import cloudinary.api
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.db import SessionLocal
from app.services.vector_store import client as qdrant_client

router = APIRouter()


@router.get("/health")
async def deep_health_check():
    results = {}

    # Neon / PostgreSQL
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        results["neon_postgres"] = "ok"
    except Exception as e:
        results["neon_postgres"] = f"FAIL: {e}"

    # Qdrant — get_collections catches deleted/unreachable clusters
    try:
        await qdrant_client.get_collections()
        results["qdrant"] = "ok"
    except Exception as e:
        results["qdrant"] = f"FAIL: {repr(e)}"

    # HuggingFace — embed a single string
    try:
        hf_token = os.getenv("HF_API_TOKEN")
        async with httpx.AsyncClient(timeout=15.0) as http:
            r = await http.post(
                "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
                headers={"Authorization": f"Bearer {hf_token}", "Content-Type": "application/json"},
                json={"inputs": "health check"},
            )
        results["huggingface"] = "ok" if r.status_code == 200 else f"FAIL: {r.status_code}"
    except Exception as e:
        results["huggingface"] = f"FAIL: {e}"

    # Apify — verify token via user profile endpoint
    try:
        apify_token = os.getenv("APIFY_API_TOKEN")
        async with httpx.AsyncClient(timeout=10.0) as http:
            r = await http.get(
                "https://api.apify.com/v2/users/me",
                headers={"Authorization": f"Bearer {apify_token}"},
            )
        results["apify"] = "ok" if r.status_code == 200 else f"FAIL: {r.status_code}"
    except Exception as e:
        results["apify"] = f"FAIL: {e}"

    # OpenRouter — 1-token completion
    try:
        or_key = os.getenv("OPENROUTER_API_KEY")
        async with httpx.AsyncClient(timeout=15.0) as http:
            r = await http.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {or_key}", "Content-Type": "application/json"},
                json={
                    "model": "nvidia/nemotron-3-super-120b-a12b:free",
                    "messages": [{"role": "user", "content": "hi"}],
                    "max_tokens": 1,
                },
            )
        results["openrouter"] = "ok" if r.status_code == 200 else f"FAIL: {r.status_code} {r.text[:80]}"
    except Exception as e:
        results["openrouter"] = f"FAIL: {e}"

    # Groq — 1-token completion
    try:
        groq_key = os.getenv("GROQ_API_KEY")
        async with httpx.AsyncClient(timeout=15.0) as http:
            r = await http.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
                json={
                    "model": "gemma2-9b-it",
                    "messages": [{"role": "user", "content": "hi"}],
                    "max_tokens": 1,
                },
            )
        results["groq"] = "ok" if r.status_code == 200 else f"FAIL: {r.status_code} {r.text[:80]}"
    except Exception as e:
        results["groq"] = f"FAIL: {e}"

    # Cloudinary — built-in ping
    try:
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        )
        cloudinary.api.ping()
        results["cloudinary"] = "ok"
    except Exception as e:
        results["cloudinary"] = f"FAIL: {e}"

    all_ok = all(v == "ok" for v in results.values())
    return JSONResponse(
        content={"status": "healthy" if all_ok else "degraded", "services": results},
        status_code=200 if all_ok else 503,
    )
