import os


class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    SITE_URL: str = os.getenv("SITE_URL", "https://website-to-chatbot-prod.vercel.app")
    SITE_NAME: str = os.getenv("SITE_NAME", "CustomBot")

    HF_API_TOKEN: str = os.getenv("HF_API_TOKEN", "")
    HF_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")

    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

    APIFY_API_TOKEN: str = os.getenv("APIFY_API_TOKEN", "")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "changeme")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days


settings = Settings()
