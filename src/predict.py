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


def preprocess_image(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        raise FileNotFoundError(f"Unable to read image: {image_path}")

    resized = cv2.resize(image, (48, 48))
    normalized = resized.astype("float32") / 255.0
    input_tensor = normalized.reshape(1, 48, 48, 1)
    return input_tensor


def parse_args():
    parser = argparse.ArgumentParser(description="Predict emotion from a single image")
    parser.add_argument("--image-path", required=True, help="Path to the input image")
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
        "--top-k",
        type=int,
        default=3,
        help="Number of top predictions to display."
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
    input_tensor = preprocess_image(args.image_path)

    probabilities = model.predict(input_tensor, verbose=0)[0]
    top_k = max(1, min(args.top_k, len(probabilities)))
    top_indices = np.argsort(probabilities)[::-1][:top_k]

    print(f"Model: {model_path}")
    if labels_path:
        print(f"Labels: {labels_path}")

    print("\nTop predictions:")
    for rank, idx in enumerate(top_indices, start=1):
        label = class_names[idx] if class_names else f"class_{idx}"
        confidence = probabilities[idx]
        print(f"{rank}. {label}: {confidence:.4f}")


if __name__ == "__main__":
    main()
