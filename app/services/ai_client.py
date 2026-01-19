import os
import logging
import requests
import json

logger = logging.getLogger(__name__)

class AIQuotaError(Exception):
    """Raised when AI service quota is exceeded"""
    pass

# Get API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "dummy-key")
SITE_URL = os.getenv("SITE_URL", "https://website-to-chatbot-prod.vercel.app")
SITE_NAME = os.getenv("SITE_NAME", "CustomBot")

def generate_answer(prompt: str) -> str:
    """
    Sends prompt to Google Gemma 3 via OpenRouter (free tier).
    """
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "dummy-key":
        raise Exception("OPENROUTER_API_KEY not configured properly")
    
    try:
        payload = {
            "model": "google/gemma-3-27b-it:free",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        }
        
        # Only add optional headers if they're set
        if SITE_URL and SITE_URL != "":
            headers["HTTP-Referer"] = SITE_URL
        if SITE_NAME and SITE_NAME != "":
            headers["X-Title"] = SITE_NAME
        
        logger.info(f"Sending request to OpenRouter with model: {payload['model']}")
        
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,  # Use json= instead of data=json.dumps()
            timeout=30
        )
        
        # Log the response for debugging
        logger.info(f"OpenRouter response status: {response.status_code}")
        
        if response.status_code != 200:
            logger.error(f"OpenRouter error response: {response.text}")
        
        response.raise_for_status()
        result = response.json()
        
        # Extract the response text
        if "choices" in result and len(result["choices"]) > 0:
            return result["choices"][0]["message"]["content"]
        else:
            logger.error(f"Unexpected OpenRouter response structure: {result}")
            raise Exception("Invalid response from OpenRouter")
            
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            logger.error(f"OpenRouter quota error: {e}")
            raise AIQuotaError("AI service quota exceeded")
        elif e.response.status_code == 400:
            error_detail = e.response.text
            logger.error(f"OpenRouter bad request: {error_detail}")
            raise Exception(f"Bad request to AI service: {error_detail}")
        else:
            logger.error(f"OpenRouter HTTP error: {e.response.status_code} - {e.response.text}")
            raise Exception(f"AI service error: {e.response.status_code}")
    except requests.exceptions.RequestException as e:
        logger.error(f"OpenRouter request error: {e}")
        raise Exception(f"Failed to connect to AI service: {str(e)}")
    except Exception as e:
        logger.error(f"OpenRouter unexpected error: {e}")
        raise