from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .models import cnn_model
from .routers import predict

@asynccontextmanager
async def lifespan(app: FastAPI):
    cnn_model.load_model_once()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)


@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": cnn_model.model_loaded()}
