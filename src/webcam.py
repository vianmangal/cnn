import argparse
import os

import cv2
import numpy as np
from tensorflow.keras.models import load_model

from image_utils import build_model_input
from utils import load_class_names, resolve_model_and_labels


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

    model_path, labels_path = resolve_model_and_labels(
        args.models_dir,
        model_path=args.model_path,
        labels_path=args.labels_path
    )

    class_names = load_class_names(labels_path)

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
                input_tensor = build_model_input(face)
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
