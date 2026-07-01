import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .db import Base, engine
from app import models  # noqa: F401 — ensures models are registered before create_all
from app.routers import bots, chat, auth, admin

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Creating database tables if not exist...")
Base.metadata.create_all(bind=engine)
logger.info("Database setup complete.")

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

app.include_router(bots.router, prefix="/bots", tags=["Bots"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(admin.router, tags=["Admin"])


@app.get("/")
def health_check():
    return {"status": "ok"}
