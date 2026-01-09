import os
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from typing import List, Tuple
import uuid

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

# Initialize client
if QDRANT_URL and QDRANT_API_KEY:
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
else:
    # Local mode for testing
    client = QdrantClient(":memory:")

COLLECTION_PREFIX = "bot_"

def get_collection_name(bot_id: str) -> str:
    """Get collection name for a bot"""
    return f"{COLLECTION_PREFIX}{bot_id}"

def init_collection(bot_id: str, vector_size: int = 384):
    """Initialize collection if it doesn't exist"""
    collection_name = get_collection_name(bot_id)
    
    try:
        client.get_collection(collection_name)
        print(f"Collection {collection_name} already exists")
    except:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
        )
        print(f"Created collection {collection_name}")

def add_chunks_to_qdrant(
    bot_id: str,
    texts: List[str],
    embeddings: List[List[float]],
    metadatas: List[dict]
):
    """Add chunks with embeddings to Qdrant"""
    
    # Detect vector size from first embedding
    vector_size = len(embeddings[0])
    init_collection(bot_id, vector_size)
    
    collection_name = get_collection_name(bot_id)
    
    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={
                "text": text,
                **metadata
            }
        )
        for text, embedding, metadata in zip(texts, embeddings, metadatas)
    ]
    
    client.upsert(
        collection_name=collection_name,
        points=points
    )
    
    print(f"✅ Added {len(points)} chunks to {collection_name}")

def retrieve_chunks(
    bot_id: str,
    query_vector: List[float],
    top_k: int = 5
) -> Tuple[List[str], List[dict]]:
    """Search for similar chunks"""
    
    collection_name = get_collection_name(bot_id)
    
    # Use query_points instead of search
    search_result = client.query_points(
        collection_name=collection_name,
        query=query_vector,
        limit=top_k
    )
    
    chunks = []
    metadatas = []
    
    for point in search_result.points:
        chunks.append(point.payload.get("text", ""))
        
        # Extract metadata (everything except 'text')
        metadata = {k: v for k, v in point.payload.items() if k != "text"}
        metadatas.append(metadata)
    
    return chunks, metadatas

def delete_collection(bot_id: str):
    """Delete a bot's collection"""
    collection_name = get_collection_name(bot_id)
    
    try:
        client.delete_collection(collection_name)
        print(f"✅ Deleted collection {collection_name}")
    except Exception as e:
        print(f"⚠️ Could not delete {collection_name}: {e}")