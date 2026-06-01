#!/bin/sh
set -e

echo "=== DEBUG START ==="

python -c "
import sys
print('Python:', sys.version)
print('Path:', sys.path)

import backend
print('backend OK')

from backend.models import cnn_model
print('cnn_model OK')
"

echo "=== DEBUG END ==="

if [ -z "$MODEL_BUCKET" ]; then
  echo "MODEL_BUCKET is not set" >&2
  exit 1
fi

mkdir -p /app/models
aws s3 cp "s3://$MODEL_BUCKET/emotion_model.keras" /app/models/emotion_model.keras

exec "$@"