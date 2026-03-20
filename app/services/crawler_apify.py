import os
import logging
from typing import Dict
from apify_client import ApifyClient

logger = logging.getLogger(__name__)


def crawl_website(start_url: str, max_pages: int = 10) -> Dict[str, str]:
    """
    Crawl a website using Apify's Website Content Crawler actor.
    Returns dict mapping URLs to their text content.
    """
    logger.info(f"[Apify] Starting crawl at {start_url} (max_pages={max_pages})")

    client = ApifyClient(os.getenv("APIFY_API_TOKEN"))

    run_input = {
        "startUrls": [{"url": start_url}],
        "maxCrawlPages": max_pages,
        "crawlerType": "playwright:firefox",
        "ignoreCanonicalUrl": True,  # ← add this  # fast + cheap, switch to "playwright:firefox" for JS sites
    }

    run = client.actor("apify/website-content-crawler").call(run_input=run_input)

    results = {}
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        url = item.get("url")
        text = item.get("text") or item.get("markdown") or ""
        if url and len(text) > 50:
            results[url] = text
            logger.info(f"[Apify] ✅ Extracted {len(text)} characters from {url}")

    logger.info(f"[Apify] Finished crawling. Total pages: {len(results)}")
    return results

# -------------------------------------------------
# 🔍 QUICK LOCAL TEST
# -------------------------------------------------
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    test_url = "https://asynk.in/"
    result = crawl_website(test_url, max_pages=5)

    print(f"\n✅ Crawled {len(result)} pages:")
    for url, text in result.items():
        print(f"  - {url}: {len(text)} chars")
        print(f"    Preview: {text[:100]}...")