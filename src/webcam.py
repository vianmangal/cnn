import argparse
import json
import os

import cv2
import numpy as np
from tensorflow.keras.models import load_model


def find_latest_file(directory, suffix):
    if not os.path.isdir(directory):
        raise FileNotFoundError(f"Directory not found: {directory}")

    files = [
        file_name
        for file_name in os.listdir(directory)
        if file_name.endswith(suffix)
    ]

    if not files:
        raise FileNotFoundError(f"No {suffix} files found in: {directory}")

    files.sort(
        key=lambda file_name: os.path.getmtime(os.path.join(directory, file_name)),
        reverse=True
    )

    return os.path.join(directory, files[0])


def load_label_mapping(labels_path):
    if not labels_path:
        return None

    with open(labels_path, "r", encoding="utf-8") as file_handle:
        raw_mapping = json.load(file_handle)

    index_to_label = {int(idx): label for label, idx in raw_mapping.items()}
    return [label for _, label in sorted(index_to_label.items())]


def parse_args():
    parser = argparse.ArgumentParser(description="Run real-time webcam emotion detection")
    parser.add_argument(
        "--camera-index",
        type=int,
        default=0,
        help="Webcam index (default: 0)."
    )
    parser.add_argument(
        "--model-path",
        default=None,
        help="Path to a .keras model. Defaults to newest model in models/."
    )
    parser.add_argument(
        "--labels-path",
        default=None,
        help="Path to labels JSON. Defaults to matching labels for the model."
    )
    parser.add_argument(
        "--models-dir",
        default="models",
        help="Directory to search for model/labels if paths are not set."
    )
    parser.add_argument(
        "--scale-factor",
        type=float,
        default=1.1,
        help="Haar cascade scale factor."
    )
    parser.add_argument(
        "--min-neighbors",
        type=int,
        default=5,
        help="Haar cascade min neighbors."
    )
    parser.add_argument(
        "--min-size",
        type=int,
        default=48,
        help="Minimum face size in pixels."
    )
    return parser.parse_args()


def main():
    args = parse_args()

    model_path = args.model_path or find_latest_file(args.models_dir, ".keras")
    base_name = os.path.splitext(os.path.basename(model_path))[0]

    labels_path = args.labels_path
    if not labels_path:
        default_labels = os.path.join(args.models_dir, f"{base_name}_labels.json")
        if os.path.exists(default_labels):
            labels_path = default_labels
        else:
            try:
                labels_path = find_latest_file(args.models_dir, "_labels.json")
            except FileNotFoundError:
                labels_path = None

    class_names = load_label_mapping(labels_path)

    model = load_model(model_path)

    cascade_path = os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml")
    face_cascade = cv2.CascadeClassifier(cascade_path)
    if face_cascade.empty():
        raise FileNotFoundError(f"Failed to load Haar cascade at: {cascade_path}")

    cap = cv2.VideoCapture(args.camera_index)
    if not cap.isOpened():
        raise RuntimeError("Unable to access webcam. Try a different --camera-index.")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(
                gray,
                scaleFactor=args.scale_factor,
                minNeighbors=args.min_neighbors,
                minSize=(args.min_size, args.min_size)
            )

            for (x, y, w, h) in faces:
                face = gray[y:y + h, x:x + w]
                resized = cv2.resize(face, (48, 48))
                normalized = resized.astype("float32") / 255.0
                input_tensor = normalized.reshape(1, 48, 48, 1)

                probabilities = model.predict(input_tensor, verbose=0)[0]
                pred_idx = int(np.argmax(probabilities))
                confidence = float(probabilities[pred_idx])
                label = class_names[pred_idx] if class_names else f"class_{pred_idx}"

                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                text = f"{label} {confidence:.2f}"
                text_y = y - 10 if y - 10 > 10 else y + h + 20
                cv2.putText(
                    frame,
                    text,
                    (x, text_y),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    2
                )

            cv2.imshow("Emotion Detection", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
