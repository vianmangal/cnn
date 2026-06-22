import argparse

import cv2
from tensorflow.keras.models import load_model

from image_utils import build_model_input
from utils import load_class_names, resolve_model_and_labels


def preprocess_image(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        raise FileNotFoundError(f"Unable to read image: {image_path}")

    return build_model_input(image)


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

    model_path, labels_path = resolve_model_and_labels(
        args.models_dir,
        model_path=args.model_path,
        labels_path=args.labels_path
    )

    class_names = load_class_names(labels_path)

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
