import os
import logging
import httpx

logger = logging.getLogger(__name__)


class AIQuotaError(Exception):
    pass


OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
SITE_URL = os.getenv("SITE_URL", "https://website-to-chatbot-prod.vercel.app")
SITE_NAME = os.getenv("SITE_NAME", "CustomBot")

OPENROUTER_MODEL = "nvidia/nemotron-3-super-120b-a12b:free"
GROQ_MODEL = "llama-3.1-8b-instant"


async def _call_openrouter(system_prompt: str, user_message: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
    }
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60,
        )
    response.raise_for_status()
    result = response.json()
    return result["choices"][0]["message"]["content"]


async def _call_groq(system_prompt: str, user_message: str) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60,
        )
    response.raise_for_status()
    result = response.json()
    return result["choices"][0]["message"]["content"]


async def generate_answer(system_prompt: str, user_message: str) -> str:
    # Try OpenRouter first
    if OPENROUTER_API_KEY:
        try:
            return await _call_openrouter(system_prompt, user_message)
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.warning("OpenRouter rate limited — falling back to Groq")
            else:
                logger.error(f"OpenRouter error {e.response.status_code}: {e.response.text}")
                raise Exception(f"AI service error: {e.response.status_code}")
        except httpx.ReadTimeout:
            logger.warning("OpenRouter timed out — falling back to Groq")

    # Fallback: Groq
    if GROQ_API_KEY:
        try:
            logger.info("Using Groq fallback (llama-3.1-8b-instant)")
            return await _call_groq(system_prompt, user_message)
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                raise AIQuotaError("Both OpenRouter and Groq are rate limited")
            logger.error(f"Groq error {e.response.status_code}: {e.response.text}")
            raise Exception(f"Groq fallback error: {e.response.status_code}")

    raise AIQuotaError("No AI provider available — set OPENROUTER_API_KEY or GROQ_API_KEY")
