import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from fastapi import File, UploadFile
from app.services.cloudinary_upload import upload_logo

from app.db import get_db
from app import models, schemas

from app.services.crawler_apify import crawl_website
from app.services.text_processing import process_text_to_chunks
from app.services.embeddings import embed_text
from app.services.vector_store import add_chunks_to_qdrant, delete_collection
from app.routers.auth import get_current_user  # 👈 use this for auth

router = APIRouter()
logger = logging.getLogger(__name__)

# -------------------------------------------------------------
# 🔧 BACKGROUND PIPELINE FUNCTION
# -------------------------------------------------------------
async def run_pipeline(bot_id: str, website_url: str, bot_db_id: int):
    db = next(get_db())
    try:
        bot = db.query(models.Bot).filter(models.Bot.id == bot_db_id).first()
        logger.info(f"[PIPELINE] Starting for bot {bot_id}")

        # 1️⃣ CRAWL
        bot.status = "crawling"
        bot.error_message = None
        db.commit()
        page_texts = crawl_website(website_url, max_pages=10)
        if not page_texts:
            raise Exception("No pages found. The website may be empty, behind a login, or blocked the crawler.")
        logger.info(f"[PIPELINE] Crawled {len(page_texts)} pages.")

        # 2️⃣ CHUNK + EMBED
        bot.status = "embedding"
        db.commit()

        all_chunks = []
        all_embeddings = []
        all_metadatas = []

        for page_url, text in page_texts.items():
            logger.info(f"[PIPELINE] Processing page: {page_url}")
            chunks = process_text_to_chunks(text)
            if not chunks:
                logger.warning(f"[PIPELINE] No chunks for page: {page_url}")
                continue
            embeddings = await embed_text(chunks)
            for c, e in zip(chunks, embeddings):
                chunk_index = len(all_chunks)
                all_chunks.append(c)
                all_embeddings.append(e)
                all_metadatas.append({
                    "bot_id": bot_id,
                    "page_url": page_url,
                    "chunk_index": chunk_index,
                })

        if not all_chunks:
            raise Exception("No content could be extracted from the website. Try a different URL.")

        # 3️⃣ SAVE TO QDRANT
        bot.status = "saving"
        db.commit()
        logger.info(f"[PIPELINE] Saving {len(all_chunks)} chunks for bot {bot_id}")
        await add_chunks_to_qdrant(bot_id, all_chunks, all_embeddings, all_metadatas)

        # 4️⃣ MARK READY
        bot.status = "ready"
        db.commit()
        logger.info(f"[PIPELINE] Bot {bot_id} is READY!")

    except Exception as e:
        logger.exception(f"[PIPELINE] Failed for bot {bot_id}: {e}")
        bot = db.query(models.Bot).filter(models.Bot.id == bot_db_id).first()
        if bot:
            bot.status = "failed"
            bot.error_message = str(e)
            db.commit()
    finally:
        db.close()
 
 # -------------------------------------------------------------
# 📊 BOT STATUS ENDPOINT (for frontend polling)
# -------------------------------------------------------------
@router.get("/{bot_id}/status")
def get_bot_status(
    bot_id: str,
    db: Session = Depends(get_db),
):
    bot = db.query(models.Bot).filter(models.Bot.bot_id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    return {"status": bot.status, "bot_id": bot.bot_id, "error_message": bot.error_message}

@router.post("/create", response_model=schemas.BotCreateResponse)
async def create_bot(
    payload: schemas.BotCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    website_url = str(payload.website_url)
    logger.info(f"User {current_user.id} ({current_user.email}) requested bot for: {website_url}")
 
    # Check bot limit
    user_bot_count = (
        db.query(models.Bot)
        .filter(models.Bot.user_id == current_user.id)
        .count()
    )
 
    # Check for existing bot FIRST
    existing_bot = (
        db.query(models.Bot)
        .filter(
            models.Bot.website_url == website_url,
            models.Bot.user_id == current_user.id,
        )
        .first()
    )
    if existing_bot:
        logger.info(f"Reusing existing bot_id={existing_bot.bot_id}, updating customization")
        existing_bot.bot_name = payload.bot_name
        existing_bot.greeting_message = payload.greeting_message
        existing_bot.primary_color = payload.primary_color
        existing_bot.background_color = payload.background_color
        existing_bot.text_color = payload.text_color
        existing_bot.logo_url = payload.logo_url
        existing_bot.show_branding = payload.show_branding
        db.commit()
        return schemas.BotCreateResponse(
            bot_id=existing_bot.bot_id,
            chat_url=f"/chat/{existing_bot.bot_id}",
            status=existing_bot.status,
        )

    # THEN check bot limit
    bot_limit = current_user.bot_limit or 1
    if user_bot_count >= bot_limit:
        logger.warning(f"User {current_user.id} has reached bot limit ({user_bot_count}/{bot_limit})")
        raise HTTPException(
            status_code=400,
            detail=f"You have reached your bot limit ({bot_limit}). Upgrade to create more bots."
        )
 
    # Create new bot in DB
    bot_id = str(uuid.uuid4())
    logger.info(f"Creating new bot with bot_id={bot_id}")
 
    new_bot = models.Bot(
    bot_id=bot_id,
    website_url=website_url,
    status="processing",
    vector_index_path=f"app/data/chroma/bots/{bot_id}",
    user_id=current_user.id,
    bot_name=payload.bot_name,
    greeting_message=payload.greeting_message,
    primary_color=payload.primary_color,
    background_color=payload.background_color,
    text_color=payload.text_color,
    logo_url=payload.logo_url,
    show_branding=payload.show_branding,
)
 
    try:
        db.add(new_bot)
        db.commit()
        db.refresh(new_bot)
    except Exception:
        db.rollback()
        logger.exception("Failed to save bot in DB.")
        raise HTTPException(status_code=500, detail="Failed to create bot")
 
    # 🚀 Run pipeline in background — return immediately
    background_tasks.add_task(run_pipeline, bot_id, website_url, new_bot.id)
 
    return schemas.BotCreateResponse(
        bot_id=bot_id,
        chat_url=f"/chat/{bot_id}",
        status="processing",
    )

@router.post("/{bot_id}/refresh", response_model=schemas.BotCreateResponse)
async def refresh_bot(
    bot_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),  # 👈 must be logged in
):
    """
    Rebuild an existing bot.
    Only:
      - the bot owner, or
      - a super_admin
    can refresh it.
    """

    logger.info(
        f"Refresh requested for bot_id={bot_id} by user {current_user.id} ({current_user.email})"
    )

    # 1️⃣ Load bot
    bot = db.query(models.Bot).filter(models.Bot.bot_id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")

    # 2️⃣ Permission check → this is where 403 happens
    if bot.user_id != current_user.id and current_user.role != "super_admin":
        logger.warning(
            f"User {current_user.id} tried to refresh bot {bot_id} owned by user {bot.user_id}"
        )
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to refresh this bot.",
        )

    website_url = bot.website_url
    logger.info(f"Rebuilding bot for website: {website_url}")

    # Set status to processing
    bot.status = "processing"
    db.commit()
    db.refresh(bot)

    try:
        # 3️⃣ Clear existing Qdrant collection
        delete_collection(bot_id)

        # 4️⃣ Crawl website again
        page_texts = crawl_website(website_url, max_pages=10)
        if not page_texts:
            raise Exception("No pages found or all pages were empty during refresh.")

        logger.info(f"Re-crawled {len(page_texts)} pages for bot {bot_id}")

        all_chunks = []
        all_embeddings = []
        all_metadatas = []

        for page_url, text in page_texts.items():
            logger.info(f"[REFRESH] Processing page: {page_url}")

            chunks = process_text_to_chunks(text)
            if not chunks:
                logger.warning(f"[REFRESH] No chunks created for page: {page_url}")
                continue

            embeddings = await embed_text(chunks)

            for c, e in zip(chunks, embeddings):
                chunk_index = len(all_chunks)
                all_chunks.append(c)
                all_embeddings.append(e)
                all_metadatas.append(
                    {
                        "bot_id": bot_id,
                        "page_url": page_url,
                        "chunk_index": chunk_index,
                    }
                )

        if not all_chunks:
            raise Exception("No chunks created during refresh for this website.")

        await add_chunks_to_qdrant(bot_id, all_chunks, all_embeddings, all_metadatas)

        bot.status = "ready"
        db.commit()
        db.refresh(bot)

        logger.info(f"Bot {bot_id} successfully refreshed and READY.")

    except Exception as e:
        logger.exception("Refresh pipeline failed. Marking bot as FAILED.")
        bot.status = "failed"
        db.commit()
        db.refresh(bot)
        raise HTTPException(status_code=500, detail=f"Bot refresh failed: {str(e)}")

    chat_url = f"/chat/{bot.bot_id}"
    return schemas.BotCreateResponse(
        bot_id=bot.bot_id,
        chat_url=chat_url,
        status=bot.status,
    )


@router.get("/{bot_id}/metrics", response_model=schemas.BotMetrics)
def get_bot_metrics(
    bot_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Return basic metrics for a single bot:
    - total messages (message_count)
    - created_at
    - last_used_at

    Only:
    - the bot owner, or
    - a super_admin
    can view this.
    """

    # 1️⃣ Find bot by public bot_id
    bot = db.query(models.Bot).filter(models.Bot.bot_id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")

    # 2️⃣ Permission check
    if current_user.role != "super_admin" and bot.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to view this bot")

    # 3️⃣ Return metrics
    return schemas.BotMetrics(
        bot_id=bot.bot_id,
        website_url=bot.website_url,
        message_count=bot.message_count or 0,
        status= bot.status,
        created_at=bot.created_at,
        last_used_at=bot.last_used_at,
    )

@router.get("/my", response_model=list[schemas.BotSummary])
def list_my_bots(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Return all bots created by the logged-in user.
    Useful for client dashboard.
    """
    bots = (
        db.query(models.Bot)
        .filter(models.Bot.user_id == current_user.id)
        .order_by(models.Bot.created_at.desc())
        .all()
    )

    return [
        schemas.BotSummary(
            bot_id=b.bot_id,
            website_url=b.website_url,
            status=b.status,
            message_count=b.message_count,
            created_at=b.created_at,
            last_used_at=b.last_used_at,
            chat_url=f"/chat/{b.bot_id}",
            bot_name=b.bot_name,
            greeting_message=b.greeting_message,
            primary_color=b.primary_color,
            background_color=b.background_color,
            text_color=b.text_color,
            logo_url=b.logo_url,
            show_branding=b.show_branding if b.show_branding is not None else True,
    )
        for b in bots
    ]

@router.post("/upload-logo")
async def upload_bot_logo(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
):
    contents = await file.read()
    filename = f"user_{current_user.id}_{file.filename}"
    url = upload_logo(contents, filename)
    return {"logo_url": url}

@router.delete("/{bot_id}")
async def delete_bot(
    bot_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    bot = db.query(models.Bot).filter(models.Bot.bot_id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    if bot.user_id != current_user.id and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Not allowed to delete this bot")

    try:
        delete_collection(bot_id)
    except Exception:
        logger.warning(f"Could not delete Qdrant collection for bot {bot_id}")

    db.delete(bot)
    db.commit()
    return {"detail": f"Bot {bot_id} deleted"}


@router.put("/{bot_id}/customize")
def update_bot_customization(
    bot_id: str,
    payload: schemas.BotUpdateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    bot = db.query(models.Bot).filter(models.Bot.bot_id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    if bot.user_id != current_user.id and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Not allowed to edit this bot")

    bot.bot_name = payload.bot_name
    bot.greeting_message = payload.greeting_message
    bot.primary_color = payload.primary_color
    bot.background_color = payload.background_color
    bot.text_color = payload.text_color
    bot.logo_url = payload.logo_url
    bot.show_branding = payload.show_branding
    db.commit()

    return {"detail": "Bot updated successfully"}


@router.get("/{bot_id}/public")
def get_bot_public_details(
    bot_id: str,
    db: Session = Depends(get_db),
):
    bot = db.query(models.Bot).filter(models.Bot.bot_id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    return {
        "bot_name": bot.bot_name,
        "greeting_message": bot.greeting_message,
        "primary_color": bot.primary_color or "#2563eb",
        "background_color": bot.background_color or "#ffffff",
        "text_color": bot.text_color or "#111827",
        "logo_url": bot.logo_url,
        "show_branding": bot.show_branding if bot.show_branding is not None else True,
    }

@router.get("/{bot_id}/status")
def get_bot_status(
    bot_id: str,
    db: Session = Depends(get_db),
):
    bot = db.query(models.Bot).filter(models.Bot.bot_id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    return {"status": bot.status, "bot_id": bot.bot_id, "error_message": bot.error_message}