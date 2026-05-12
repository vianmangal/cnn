##loads and displays the img
##loads csv -> does the conversions/resizing etc

##learn parsing,reshaping, normalization

import os #folder nav
import cv2 #img access and readin etc 
import numpy as np
import matplotlib.pyplot as plt

# Dataset path
TRAIN_DIR = "data/fer2013/train"

# Emotion labels
emotion_labels = os.listdir(TRAIN_DIR)

print("Detected Emotion Classes:")
print(emotion_labels)

# Function to load image
def load_image(image_path):

    # Read image in grayscale
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    # Resize image to 48x48
    image = cv2.resize(image, (48, 48))

    # Normalize pixel values
    image = image / 255.0

    return image


# Display sample images
plt.figure(figsize=(12, 8))

index = 1

for emotion in emotion_labels:

    emotion_path = os.path.join(TRAIN_DIR, emotion)

    # Get first image from folder
    image_name = os.listdir(emotion_path)[0]

    image_path = os.path.join(emotion_path, image_name)

    # Load image
    image = load_image(image_path)

    # Plot image
    plt.subplot(3, 3, index)
    plt.imshow(image, cmap='gray')

    plt.title(emotion)
    plt.axis('off')

    index += 1

plt.tight_layout()
plt.show()