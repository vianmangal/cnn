import os

import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

DEFAULT_TRAIN_DIR = "data/fer2013/train"
DEFAULT_INCLUDED_CLASSES = ["angry", "fear", "happy", "neutral", "sad"]
DEFAULT_IMAGE_SIZE = (48, 48)


def _get_available_labels(train_dir):
    if not os.path.isdir(train_dir):
        raise FileNotFoundError(f"Training directory not found: {train_dir}")

    available_labels = sorted(
        name
        for name in os.listdir(train_dir)
        if not name.startswith(".") and os.path.isdir(os.path.join(train_dir, name))
    )

    if not available_labels:
        raise ValueError(f"No emotion folders found in: {train_dir}")

    return available_labels


def _resolve_labels(available_labels, included_classes):
    if included_classes:
        missing_labels = [label for label in included_classes if label not in available_labels]
        if missing_labels:
            raise ValueError(f"Missing emotion folders: {missing_labels}")
        return included_classes

    return available_labels


def load_dataset(
    train_dir=DEFAULT_TRAIN_DIR,
    included_classes=DEFAULT_INCLUDED_CLASSES,
    image_size=DEFAULT_IMAGE_SIZE,
    verbose=True
):
    """Load images from disk and return tensors plus label mapping."""
    available_labels = _get_available_labels(train_dir)
    emotion_labels = _resolve_labels(available_labels, included_classes)

    if verbose:
        print("Detected Emotion Classes:")
        print(emotion_labels)

    X = []
    y = []
    skipped = 0

    width, height = image_size

    for emotion in emotion_labels:
        emotion_path = os.path.join(train_dir, emotion)
        images = [
            name
            for name in os.listdir(emotion_path)
            if not name.startswith(".")
        ]

        if verbose:
            print(f"Loading {emotion} images...")

        for image_name in images:
            image_path = os.path.join(emotion_path, image_name)
            if not os.path.isfile(image_path):
                continue

            image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if image is None:
                skipped += 1
                continue

            resized = cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)
            normalized = resized.astype("float32") / 255.0
            X.append(normalized)
            y.append(emotion)

    if not X:
        raise ValueError("No images were loaded from the dataset.")

    X = np.array(X, dtype="float32")
    y = np.array(y)

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    label_mapping = dict(
        zip(
            label_encoder.classes_,
            label_encoder.transform(label_encoder.classes_)
        )
    )

    X = X.reshape(-1, height, width, 1)

    if verbose:
        print("\nLabel Mapping:")
        for label, idx in label_mapping.items():
            print(f"{label} -> {idx}")

        print("\nDataset Loaded Successfully")
        print("X shape:", X.shape)
        print("y shape:", y_encoded.shape)
        if skipped:
            print(f"Skipped {skipped} unreadable images.")

    return X, y_encoded, label_mapping


def split_dataset(X, y, test_size=0.2, random_state=42):
    return train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state
    )


def load_data_splits(
    train_dir=DEFAULT_TRAIN_DIR,
    included_classes=DEFAULT_INCLUDED_CLASSES,
    image_size=DEFAULT_IMAGE_SIZE,
    test_size=0.2,
    random_state=42,
    verbose=True
):
    """Load the dataset and return train/validation splits plus label mapping."""
    X, y, label_mapping = load_dataset(
        train_dir=train_dir,
        included_classes=included_classes,
        image_size=image_size,
        verbose=verbose
    )
    X_train, X_val, y_train, y_val = split_dataset(
        X,
        y,
        test_size=test_size,
        random_state=random_state
    )

    if verbose:
        print("\nTraining Data Shape:", X_train.shape)
        print("Validation Data Shape:", X_val.shape)

    return X_train, X_val, y_train, y_val, label_mapping


if __name__ == "__main__":
    load_data_splits()