import cv2
import numpy as np

DEFAULT_IMAGE_SIZE = (48, 48)


def normalize_grayscale_image(image: np.ndarray, image_size=DEFAULT_IMAGE_SIZE) -> np.ndarray:
    width, height = image_size
    resized = cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)
    return resized.astype("float32") / 255.0


def build_model_input(image: np.ndarray, image_size=DEFAULT_IMAGE_SIZE) -> np.ndarray:
    normalized = normalize_grayscale_image(image, image_size=image_size)
    width, height = image_size
    return normalized.reshape(1, height, width, 1)
