import cv2
import numpy as np

from backend.models import cnn_model
from backend.services.face_detect import detect_largest_face


def preprocess_image_bytes(image_bytes: bytes):
    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Unable to decode image.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face, face_detected = detect_largest_face(gray)
    target = face if face_detected else gray

    resized = cv2.resize(target, (48, 48))
    normalized = resized.astype("float32") / 255.0
    input_tensor = normalized.reshape(1, 48, 48, 1)
    return input_tensor, face_detected


def run_inference(image_bytes: bytes):
    input_tensor, face_detected = preprocess_image_bytes(image_bytes)
    model = cnn_model.get_model()
    probabilities = model.predict(input_tensor, verbose=0)[0]

    labels = cnn_model.get_labels()
    scores = {label: float(probabilities[idx]) for idx, label in enumerate(labels)}
    pred_idx = int(np.argmax(probabilities))

    return {
        "emotion": labels[pred_idx],
        "confidence": float(probabilities[pred_idx]),
        "all_scores": scores,
        "face_detected": face_detected,
        "model_version": cnn_model.get_model_version(),
    }
