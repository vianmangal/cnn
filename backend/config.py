from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/emotiondb"
    SECRET_KEY: str = "change-me"
    MODEL_PATH: str = "emotion_model.keras"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CORS_ALLOW_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


settings = Settings()
ALGORITHM = "HS256"
