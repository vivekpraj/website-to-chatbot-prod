import os
from qdrant_client import QdrantClient

QDRANT_URL = os.getenv("QDRANT_URL")       # cloud url later
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

# LOCAL TEST MODE (no cloud yet)
client = QdrantClient(
    path="app/data/qdrant_local"
)