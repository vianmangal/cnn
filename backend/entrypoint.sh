#!/bin/sh
set -e

if [ -z "$MODEL_BUCKET" ]; then
  echo "MODEL_BUCKET is not set" >&2
  exit 1
fi

mkdir -p /app/models
aws s3 cp "s3://$MODEL_BUCKET/emotion_model.keras" /app/models/emotion_model.keras

exec "$@"
