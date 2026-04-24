import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

def upload_logo(file_bytes: bytes, filename: str) -> str:
    result = cloudinary.uploader.upload(
        file_bytes,
        folder="bot_logos",
        public_id=filename,
        overwrite=True,
        resource_type="image",
    )
    return result["secure_url"]