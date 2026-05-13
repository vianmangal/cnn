import argparse
import os
from datetime import datetime

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay, classification_report
from tensorflow.keras.models import load_model

from preprocess import X_val, y_val, label_mapping


def find_latest_model(models_dir):
    if not os.path.isdir(models_dir):
        raise FileNotFoundError(f"Models directory not found: {models_dir}")

    model_files = [
        file_name
        for file_name in os.listdir(models_dir)
        if file_name.endswith(".keras")
    ]

    if not model_files:
        raise FileNotFoundError(f"No .keras models found in: {models_dir}")

    model_files.sort(
        key=lambda file_name: os.path.getmtime(os.path.join(models_dir, file_name)),
        reverse=True
    )

    return os.path.join(models_dir, model_files[0])


def build_class_names(mapping):
    return [label for label, idx in sorted(mapping.items(), key=lambda item: item[1])]


def save_confusion_matrix(cm, class_names, output_path):
    fig, ax = plt.subplots(figsize=(8, 8))
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=class_names)
    disp.plot(include_values=True, cmap="Blues", ax=ax, xticks_rotation=45, colorbar=True)
    fig.tight_layout()
    fig.savefig(output_path, dpi=200)
    plt.close(fig)


def save_misclassified_grid(images, y_true, y_pred, class_names, output_path, max_samples=25):
    incorrect_indices = np.where(y_true != y_pred)[0]
    if incorrect_indices.size == 0:
        return False

    sample_count = min(max_samples, incorrect_indices.size)
    rng = np.random.default_rng(42)
    sample_indices = rng.choice(incorrect_indices, size=sample_count, replace=False)

    grid_size = int(np.ceil(np.sqrt(sample_count)))
    fig, axes = plt.subplots(grid_size, grid_size, figsize=(10, 10))
    axes = np.array(axes).reshape(-1)

    for ax in axes:
        ax.axis("off")

    for ax, idx in zip(axes, sample_indices):
        ax.imshow(images[idx].squeeze(), cmap="gray")
        true_label = class_names[int(y_true[idx])]
        pred_label = class_names[int(y_pred[idx])]
        ax.set_title(f"T:{true_label} P:{pred_label}", fontsize=8)

    fig.tight_layout()
    fig.savefig(output_path, dpi=200)
    plt.close(fig)
    return True


def top_confusions(cm, class_names, top_k=5):
    pairs = []
    for i, true_label in enumerate(class_names):
        for j, pred_label in enumerate(class_names):
            if i == j:
                continue
            pairs.append((cm[i, j], true_label, pred_label))

    pairs.sort(reverse=True)
    return pairs[:top_k]


def parse_args():
    parser = argparse.ArgumentParser(description="Evaluate CNN model on validation split")
    parser.add_argument(
        "--model-path",
        default=None,
        help="Path to a .keras model. Defaults to newest model in models/."
    )
    parser.add_argument(
        "--models-dir",
        default="models",
        help="Directory to search for model files if --model-path is not set."
    )
    return parser.parse_args()


def main():
    args = parse_args()

    model_path = args.model_path or find_latest_model(args.models_dir)
    base_name = os.path.splitext(os.path.basename(model_path))[0]

    model = load_model(model_path)

    y_pred_probs = model.predict(X_val, batch_size=64)
    y_pred = np.argmax(y_pred_probs, axis=1)

    class_names = build_class_names(label_mapping)
    cm = confusion_matrix(y_val, y_pred, labels=list(range(len(class_names))))

    os.makedirs(args.models_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    cm_path = os.path.join(args.models_dir, f"{base_name}_confusion_matrix.png")
    misclassified_path = os.path.join(args.models_dir, f"{base_name}_misclassified.png")
    report_path = os.path.join(args.models_dir, f"{base_name}_classification_report.txt")
    summary_path = os.path.join(args.models_dir, f"{base_name}_confusion_summary_{timestamp}.txt")

    save_confusion_matrix(cm, class_names, cm_path)
    saved_misclassified = save_misclassified_grid(
        X_val,
        y_val,
        y_pred,
        class_names,
        misclassified_path
    )

    report = classification_report(y_val, y_pred, target_names=class_names, digits=4)
    with open(report_path, "w", encoding="utf-8") as file_handle:
        file_handle.write(report)

    top_pairs = top_confusions(cm, class_names, top_k=5)
    with open(summary_path, "w", encoding="utf-8") as file_handle:
        file_handle.write("Top confusions (true -> predicted):\n")
        for count, true_label, pred_label in top_pairs:
            file_handle.write(f"{true_label} -> {pred_label}: {count}\n")

    print(f"Loaded model: {model_path}")
    print(f"Saved confusion matrix to: {cm_path}")
    if saved_misclassified:
        print(f"Saved misclassified grid to: {misclassified_path}")
    else:
        print("No misclassified samples to visualize.")
    print(f"Saved classification report to: {report_path}")
    print(f"Saved confusion summary to: {summary_path}")


if __name__ == "__main__":
    main()
