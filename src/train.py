import json
import os
from datetime import datetime

from model import build_cnn_model
from preprocess import load_data_splits


def main():
    X_train, X_val, y_train, y_val, label_mapping = load_data_splits()

    model = build_cnn_model(num_classes=len(label_mapping))

    history = model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=15,
        batch_size=64
    )

    os.makedirs("models", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_path = os.path.join("models", f"emotion_cnn_{timestamp}.keras")
    history_path = os.path.join("models", f"emotion_cnn_{timestamp}_history.json")
    labels_path = os.path.join("models", f"emotion_cnn_{timestamp}_labels.json")

    model.save(model_path)

    with open(history_path, "w", encoding="utf-8") as file_handle:
        json.dump(history.history, file_handle)

    label_mapping_serializable = {label: int(idx) for label, idx in label_mapping.items()}
    with open(labels_path, "w", encoding="utf-8") as file_handle:
        json.dump(label_mapping_serializable, file_handle, indent=2)

    print(f"Saved model to: {model_path}")
    print(f"Saved history to: {history_path}")
    print(f"Saved labels to: {labels_path}")


if __name__ == "__main__":
    main()
