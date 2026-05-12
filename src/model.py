from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Input,
    Conv2D,
    MaxPooling2D,
    Flatten,
    Dense,
    Dropout
)

# Build CNN model
model = Sequential()

model.add(Input(shape=(48, 48, 1)))

# First Convolution Block
model.add(Conv2D(
    32,
    (3, 3),
    activation='relu'
))

model.add(MaxPooling2D(pool_size=(2, 2)))

# Second Convolution Block
model.add(Conv2D(
    64,
    (3, 3),
    activation='relu'
))

model.add(MaxPooling2D(pool_size=(2, 2)))

# Third Convolution Block
model.add(Conv2D(
    128,
    (3, 3),
    activation='relu'
))

model.add(MaxPooling2D(pool_size=(2, 2)))

# Flatten feature maps
model.add(Flatten())

# Dense Layer
model.add(Dense(128, activation='relu'))

# Dropout helps prevent overfitting
model.add(Dropout(0.5))

# Output layer
model.add(Dense(7, activation='softmax'))

# Compile model
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Print model summary
model.summary()