# cnn

CNN-based emotion recognition.

Detected emotions: angry, fear, happy, neutral, sad.

2 ways: Image or Webcam.

# Setup

1) Create a virtual environment:
	 python -m venv .venv

2) Activate it:
	 source .venv/bin/activate

3) Install dependencies:
	 pip install tensorflow==2.21.0 opencv-python==4.13.0.92 matplotlib==3.10.9 pandas==3.0.3 numpy==2.4.4 scikit-learn==1.8.0

# Run

Train the model:
	.venv/bin/python src/train.py

Evaluate the latest model:
	.venv/bin/python src/evaluate.py

Predict a single image (relative path example):
	.venv/bin/python src/predict.py --image-path data/custom/my_face.jpg

Predict a single image (absolute path example):
	/Users/vian/Desktop/cnn/.venv/bin/python src/predict.py --image-path /Users/vian/Desktop/cnn/data/custom/my_face.jpg

Run real-time webcam detection (press q to quit):
	.venv/bin/python src/webcam.py

# versions

1) tensorflow==2.21.0
2) opencv-python==4.13.0.92 - to read image into memory
3) matplotlib==3.10.9
4) pandas==3.0.3
5) numpy==2.4.4
6) scikit-learn==1.8.0

# Datasets
1) https://www.kaggle.com/datasets/nelgiriyewithana/emotions
2) https://www.kaggle.com/datasets/msambare/fer2013
3) any custom image and webcam.
