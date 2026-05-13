##loads and displays the img
##loads csv -> does the conversions/resizing etc

##learn parsing,reshaping, normalization

import os #folder nav
import cv2 #img access and readin etc 
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Dataset path
TRAIN_DIR = "data/fer2013/train"
INCLUDED_CLASSES = ["angry", "fear", "happy", "neutral", "sad"]

if not os.path.isdir(TRAIN_DIR):
    raise FileNotFoundError(f"Training directory not found: {TRAIN_DIR}")

# Emotion labels
available_labels = sorted(
    name
    for name in os.listdir(TRAIN_DIR)
    if not name.startswith(".") and os.path.isdir(os.path.join(TRAIN_DIR, name))
)

if not available_labels:
    raise ValueError(f"No emotion folders found in: {TRAIN_DIR}")

missing_labels = [label for label in INCLUDED_CLASSES if label not in available_labels]
if missing_labels:
    raise ValueError(f"Missing emotion folders: {missing_labels}")

emotion_labels = INCLUDED_CLASSES

print("Detected Emotion Classes:")
print(emotion_labels)
# Lists to store data
X = []
y = []

# Loop through emotion folders
for emotion in emotion_labels:

    emotion_path = os.path.join(TRAIN_DIR, emotion)

    # Get all image names
    images = os.listdir(emotion_path)

    print(f"Loading {emotion} images...")

    for image_name in images:

        image_path = os.path.join(emotion_path, image_name)

        # Read image
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

        # Resize
        image = cv2.resize(image, (48, 48))

        # Normalize
        image = image / 255.0

        # Add image to dataset
        X.append(image)

        # Add label
        y.append(emotion)

# Convert to NumPy arrays
X = np.array(X)
y = np.array(y)

# Encode labels to integers
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)
label_mapping = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))

print("\nLabel Mapping:")
for label, idx in label_mapping.items():
    print(f"{label} -> {idx}")

# Add channel dimension
X = X.reshape(-1, 48, 48, 1)  

print("\nDataset Loaded Successfully")
print("X shape:", X.shape)
print("y shape:", y.shape)

# Train-test split
X_train, X_val, y_train, y_val = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining Data Shape:", X_train.shape)
print("Validation Data Shape:", X_val.shape)