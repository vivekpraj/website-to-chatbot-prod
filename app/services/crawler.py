import logging
import requests
from typing import Dict, Set
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


def _is_same_domain(base_url: str, target_url: str) -> bool:
    """Check if target URL is from the same domain as base URL"""
    base_domain = urlparse(base_url).netloc
    target_domain = urlparse(target_url).netloc
    return target_domain == "" or target_domain == base_domain


def _normalize_url(url: str) -> str:
    """Remove fragments and trailing slashes for consistency"""
    parsed = urlparse(url)
    # Remove fragment (#section)
    url = parsed._replace(fragment="").geturl()
    # Remove trailing slash (except for root)
    if url.endswith("/") and parsed.path != "/":
        url = url.rstrip("/")
    return url


def _get_page_content(url: str, session: requests.Session) -> tuple[str, int]:
    """
    Fetch page content and status code
    Returns: (html_content, status_code)
    """
    try:
        response = session.get(
            url,
            timeout=30,
            allow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            }
        )
        return response.text, response.status_code
    except requests.exceptions.RequestException as e:
        logger.warning(f"Failed to fetch {url}: {e}")
        return "", 0


def _extract_text_from_html(html: str) -> str:
    """Extract visible text from HTML"""
    soup = BeautifulSoup(html, "html.parser")
    
    # Remove script and style elements
    for script in soup(["script", "style", "meta", "noscript"]):
        script.decompose()
    
    # Get text
    text = soup.get_text(separator=" ", strip=True)
    
    # Clean up whitespace
    text = " ".join(text.split())
    
    return text


def _extract_links(html: str, base_url: str) -> Set[str]:
    """Extract all valid links from HTML"""
    soup = BeautifulSoup(html, "html.parser")
    links = set()
    
    for a_tag in soup.find_all("a", href=True):
        href = a_tag["href"]
        
        # Convert relative URLs to absolute
        absolute_url = urljoin(base_url, href)
        
        # Normalize and add
        normalized = _normalize_url(absolute_url)
        
        # Only add http/https URLs
        if normalized.startswith(("http://", "https://")):
            links.add(normalized)
    
    return links


def crawl_website(start_url: str, max_pages: int = 10) -> Dict[str, str]:
    """
    Crawl a website starting from start_url
    
    Args:
        start_url: The URL to start crawling from
        max_pages: Maximum number of pages to crawl
        
    Returns:
        Dictionary mapping URLs to their text content
    """
    logger.info(f"[BS4] Starting crawl at {start_url} (max_pages={max_pages})")
    
    # Normalize start URL
    start_url = _normalize_url(start_url)
    
    to_visit: Set[str] = {start_url}
    visited: Set[str] = set()
    results: Dict[str, str] = {}
    
    # Create a session for connection pooling
    session = requests.Session()
    
    while to_visit and len(visited) < max_pages:
        url = to_visit.pop()
        
        if url in visited:
            continue
        
        logger.info(f"[BS4] Crawling URL ({len(visited) + 1}/{max_pages}): {url}")
        
        # Fetch the page
        html, status = _get_page_content(url, session)
        
        # Mark as visited
        visited.add(url)
        
        # Skip if bad status
        if status == 0 or status >= 400:
            logger.warning(f"[BS4] Skipping {url}, bad status={status}")
            continue
        
        # Skip if no content
        if not html:
            logger.warning(f"[BS4] No HTML content at {url}")
            continue
        
        # Extract text
        text = _extract_text_from_html(html)
        
        # Skip if insufficient text
        if len(text) < 50:
            logger.warning(f"[BS4] Insufficient text at {url} (only {len(text)} chars)")
            continue
        
        # Save the result
        results[url] = text
        logger.info(f"[BS4] ✅ Extracted {len(text)} characters from {url}")
        
        # Extract links for further crawling
        links = _extract_links(html, url)
        
        # Add same-domain links to queue
        for link in links:
            if _is_same_domain(start_url, link):
                if link not in visited and link not in to_visit:
                    to_visit.add(link)
    
    # Close the session
    session.close()
    
    logger.info(f"[BS4] Finished crawling. Total pages collected: {len(results)}")
    return results


# -------------------------------------------------
# 🔍 QUICK LOCAL TEST
# -------------------------------------------------
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    test_url = "https://example.com"
    result = crawl_website(test_url, max_pages=3)
    
    print(f"\n✅ Crawled {len(result)} pages:")
    for url, text in result.items():
        print(f"  - {url}: {len(text)} chars")
        print(f"    Preview: {text[:100]}...")