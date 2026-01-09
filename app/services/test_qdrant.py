from app.services.vector_store import add_chunks_to_qdrant, retrieve_chunks

# Fake bot
BOT_ID = "test-bot-123"

texts = [
    "Apple is a fruit",
    "Bananas are yellow",
    "Cars have wheels",
]

# Fake embeddings (same size!)
embeddings = [
    [0.1, 0.2, 0.3],
    [0.1, 0.25, 0.35],
    [0.9, 0.8, 0.7],
]

metadatas = [
    {"page_url": "a"},
    {"page_url": "b"},
    {"page_url": "c"},
]

print("➡ Adding vectors...")
add_chunks_to_qdrant(BOT_ID, texts, embeddings, metadatas)

print("➡ Searching...")
query = [0.1, 0.2, 0.3]

chunks, metas = retrieve_chunks(BOT_ID, query, top_k=2)

print("Chunks:", chunks)
print("Metas:", metas)