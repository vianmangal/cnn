# Accuracy report

## Overview
This document explains how model accuracy is measured and which evaluation checks are used.

## Dataset split used for evaluation
- Data source: data/fer2013/train
- Split: train_test_split(test_size=0.2, random_state=42)
- Validation size: 5742 images (20% of 28709)

## How accuracy is computed
Accuracy is computed as:

$$
accuracy = correct_predictions / total_predictions
$$

From the previous 7-class evaluation report:
- Total validation samples: 5742
- Accuracy: 0.5571 (55.71%)

## Evaluation test cases
1) Overall validation accuracy
- Script: src/evaluate.py
- Output: models/emotion_cnn_20260513_190152_classification_report.txt

2) Per-class metrics
- Precision, recall, and f1-score for each emotion class
- Output: models/emotion_cnn_20260513_190152_classification_report.txt

3) Error analysis artifacts
- Confusion matrix: models/emotion_cnn_20260513_190152_confusion_matrix.png
- Misclassified grid: models/emotion_cnn_20260513_190152_misclassified.png

## Reproduce the latest result
1) Train a model:
   /Users/vian/Desktop/cnn/.venv/bin/python src/train.py

2) Evaluate the latest model:
   /Users/vian/Desktop/cnn/.venv/bin/python src/evaluate.py

3) Open the newest classification report and read the accuracy line.

## Notes
- This accuracy is computed on the validation split created from the training data.
- If you evaluate on the FER2013 test folders, the accuracy may differ.
