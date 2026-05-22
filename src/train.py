import json
import os
from datetime import datetime

import numpy as np
from sklearn.utils.class_weight import compute_class_weight
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

from model import build_cnn_model
from preprocess import load_data_splits


def main():
    X_train, X_val, y_train, y_val, label_mapping = load_data_splits()

    model = build_cnn_model(num_classes=len(label_mapping), learning_rate=3e-4)

    classes = np.unique(y_train)
    class_weights = compute_class_weight(
        class_weight="balanced",
        classes=classes,
        y=y_train
    )
    class_weight = {
        int(cls): float(weight)
        for cls, weight in zip(classes, class_weights)
    }

    os.makedirs("models", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_name = f"emotion_cnn_{timestamp}"
    model_path = os.path.join("models", f"{base_name}.keras")
    best_model_path = os.path.join("models", f"{base_name}_best.keras")
    history_path = os.path.join("models", f"{base_name}_history.json")
    labels_path = os.path.join("models", f"{base_name}_labels.json")

    callbacks = [
        EarlyStopping(monitor="val_accuracy", patience=6, restore_best_weights=True),
        ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, min_lr=1e-5),
        ModelCheckpoint(best_model_path, monitor="val_accuracy", save_best_only=True)
    ]

    history = model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=40,
        batch_size=64,
        class_weight=class_weight,
        callbacks=callbacks
    )

    model.save(model_path)

    with open(history_path, "w", encoding="utf-8") as file_handle:
        json.dump(history.history, file_handle)

    label_mapping_serializable = {label: int(idx) for label, idx in label_mapping.items()}
    with open(labels_path, "w", encoding="utf-8") as file_handle:
        json.dump(label_mapping_serializable, file_handle, indent=2)

    print(f"Saved model to: {model_path}")
    print(f"Saved best model to: {best_model_path}")
    print(f"Saved history to: {history_path}")
    print(f"Saved labels to: {labels_path}")


if __name__ == "__main__":
    main()
