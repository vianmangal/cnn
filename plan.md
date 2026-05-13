# Emotion Detection CNN — Development Plan

## Project Goal

Build a Convolutional Neural Network (CNN) capable of classifying human emotions from facial images using the FER2013 dataset.

# Phase 1 — Dataset + Preprocessing

## Objectives
- Understand image datasets
- Learn image preprocessing
- Convert images into CNN-ready tensors

## Tasks
- [x] Setup project structure
- [x] Install dependencies
- [x] Load FER2013 dataset
- [x] Read images using OpenCV
- [x] Resize images to 48x48
- [x] Normalize pixel values
- [x] Create dataset tensors
- [x] Create train-validation split

## Key Learnings
- Image matrices
- Grayscale channels
- Tensor dimensions
- Normalization
- Dataset pipelines

---

# Phase 2 — CNN Architecture

## Objectives
- Understand convolution layers
- Learn feature extraction
- Build first CNN model

## Tasks
- [ ] Create model.py
- [ ] Add Conv2D layers
- [ ] Add MaxPooling layers
- [ ] Add Flatten layer
- [ ] Add Dense layers
- [ ] Add Dropout regularization
- [ ] Compile CNN model
- [ ] Print model summary

## Concepts
- Convolution
- Kernels/Filters
- Feature maps
- Pooling
- Activation functions
- Overfitting

---

# Phase 3 — Label Encoding

## Objectives
- Convert emotion labels into numerical format

## Tasks
- [x] Encode labels using LabelEncoder
- [x] Convert labels to integers
- [x] Verify label mappings

## Example
happy -> 3
sad -> 4
angry -> 0

---

# Phase 4 — Model Training

## Objectives
- Train CNN on FER2013
- Monitor learning performance

## Tasks
- [x] Create train.py
- [x] Import preprocessing pipeline
- [x] Import CNN model
- [x] Train model
- [x] Save trained model
- [x] Track training accuracy
- [x] Track validation accuracy

## Metrics
- Accuracy
- Loss
- Validation performance

---

# Phase 5 — Evaluation

## Objectives
- Evaluate model quality
- Understand model weaknesses

## Tasks
- [x] Generate predictions
- [x] Plot confusion matrix
- [x] Visualize incorrect predictions
- [x] Analyze emotion confusion

## Common Failure Cases
- Neutral vs Sad
- Low-light images
- Extreme angles

---

# Phase 6 — Inference Pipeline

## Objectives
- Predict emotion from new image

## Tasks
- [x] Create predict.py
- [x] Load trained model
- [x] Preprocess new image
- [x] Generate prediction
- [x] Display confidence scores

---

# Phase 7 — Real-Time Webcam Detection

## Objectives
- Run live emotion detection

## Tasks
- [x] Access webcam using OpenCV
- [x] Detect faces
- [x] Crop face regions
- [x] Run CNN inference
- [x] Overlay predictions on video feed

---

# Current Status

## Completed
- Dataset loading
- Image preprocessing
- Tensor creation
- Train-validation split
- Label encoding
- Model training
- Model evaluation
- Inference pipeline
- Real-time webcam detection

## Next Step
Start Phase 8: iterate on improvements

---

# Expected Beginner Results

## Accuracy Targets
- 35–45% → Beginner baseline
- 50–60% → Good CNN
- 65%+ → Strong beginner project

FER2013 is a difficult dataset, so lower accuracy is normal initially.

---

# Tech Stack

## Libraries
- TensorFlow / Keras
- OpenCV
- NumPy
- scikit-learn
- Matplotlib

## Language
Python

---

# Final Goal

Build a real-time AI-powered emotion recognition system capable of:
- image emotion classification
- webcam emotion detection
- real-time inference
- facial expression analysis