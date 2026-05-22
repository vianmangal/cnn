from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Input,
    Conv2D,
    MaxPooling2D,
    Dense,
    Dropout,
    BatchNormalization,
    GlobalAveragePooling2D,
    Activation,
    RandomFlip,
    RandomRotation,
    RandomZoom,
    RandomTranslation
)
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2


def build_cnn_model(
    input_shape=(48, 48, 1),
    num_classes=5,
    learning_rate=1e-3,
    l2_strength=1e-4,
    dropout_rate=0.4,
    augmentation=True
):
    model = Sequential()

    model.add(Input(shape=input_shape))

    if augmentation:
        model.add(RandomFlip("horizontal"))
        model.add(RandomRotation(0.08))
        model.add(RandomZoom(0.1))
        model.add(RandomTranslation(0.1, 0.1))

    def conv_block(filters, dropout=None):
        model.add(
            Conv2D(
                filters,
                (3, 3),
                padding="same",
                kernel_regularizer=l2(l2_strength)
            )
        )
        model.add(BatchNormalization())
        model.add(Activation("relu"))
        model.add(
            Conv2D(
                filters,
                (3, 3),
                padding="same",
                kernel_regularizer=l2(l2_strength)
            )
        )
        model.add(BatchNormalization())
        model.add(Activation("relu"))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        if dropout:
            model.add(Dropout(dropout))

    conv_block(32, dropout=0.15)
    conv_block(64, dropout=0.2)
    conv_block(128, dropout=0.25)
    conv_block(256, dropout=0.3)

    model.add(GlobalAveragePooling2D())
    model.add(Dense(128, activation="relu", kernel_regularizer=l2(l2_strength)))
    model.add(Dropout(dropout_rate))
    model.add(Dense(num_classes, activation="softmax"))

    model.compile(
        optimizer=Adam(learning_rate=learning_rate),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model


if __name__ == "__main__":
    model = build_cnn_model()
    model.summary()