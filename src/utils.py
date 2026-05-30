import json
import os


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
    if not labels_path or not os.path.isfile(labels_path):
        raise FileNotFoundError(f"Labels file not found: {labels_path}")

    with open(labels_path, "r", encoding="utf-8") as file_handle:
        mapping = json.load(file_handle)

    return {label: int(idx) for label, idx in mapping.items()}


def build_class_names(mapping):
    return [label for label, idx in sorted(mapping.items(), key=lambda item: item[1])]


def load_class_names(labels_path):
    if not labels_path:
        return None

    return build_class_names(load_label_mapping(labels_path))


def resolve_model_and_labels(models_dir, model_path=None, labels_path=None):
    model_path = model_path or find_latest_file(models_dir, ".keras")

    if labels_path:
        return model_path, labels_path

    base_name = os.path.splitext(os.path.basename(model_path))[0]
    default_labels = os.path.join(models_dir, f"{base_name}_labels.json")
    if os.path.exists(default_labels):
        return model_path, default_labels

    try:
        return model_path, find_latest_file(models_dir, "_labels.json")
    except FileNotFoundError:
        return model_path, None
