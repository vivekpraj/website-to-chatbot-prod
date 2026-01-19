import os
import logging
import requests
import json

logger = logging.getLogger(__name__)

class AIQuotaError(Exception):
    pass

# Get API key - works in both local and CI environments
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "dummy-key")
SITE_URL = os.getenv("SITE_URL", "https://website-to-chatbot-prod.onrender.com")
SITE_NAME = os.getenv("SITE_NAME", "CustomBot")

def generate_answer(prompt: str) -> str:
    """
    Sends prompt to Google Gemma via OpenRouter (free tier).
    """
    if OPENROUTER_API_KEY == "dummy-key":
        raise Exception("OPENROUTER_API_KEY not configured properly")
    
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
            },
            data=json.dumps({
                "model": "google/gemini-flash-1.5-8b-exp",  # Free model
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }),
            timeout=30
        )
        
        response.raise_for_status()
        result = response.json()
        
        # Extract the response text
        if "choices" in result and len(result["choices"]) > 0:
            return result["choices"][0]["message"]["content"]
        else:
            logger.error(f"Unexpected OpenRouter response: {result}")
            raise Exception("Invalid response from OpenRouter")
            
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            logger.error(f"OpenRouter quota error: {e}")
            raise AIQuotaError("AI service quota exceeded")
        else:
            logger.error(f"OpenRouter HTTP error: {e}")
            raise
    except requests.exceptions.RequestException as e:
        logger.error(f"OpenRouter request error: {e}")
        raise
    except Exception as e:
        logger.error(f"OpenRouter error: {e}")
        raise