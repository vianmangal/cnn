from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_path: str = "emotion_model.keras"
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/emotion"
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 60
    cors_allow_origins: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


settings = Settings()
ALGORITHM = "HS256"
