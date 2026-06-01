from pathlib import Path
import threading

from tensorflow.keras.models import load_model

from backend.config import settings

_model = None
_lock = threading.Lock()
_labels = ["angry", "fear", "happy", "neutral", "sad"]


def load_model_once():
    global _model
    if _model is None:
        with _lock:
            if _model is None:
                _model = load_model(settings.MODEL_PATH)
    return _model


def get_model():
    if _model is None:
        return load_model_once()
    return _model


def get_labels():
    return list(_labels)


def get_model_version() -> str:
    return Path(settings.MODEL_PATH).name


def model_loaded() -> bool:
    return _model is not None
