#!/bin/sh
set -e

echo "===== DEBUG ====="
pwd

echo "APP:"
ls -la /app

echo "BACKEND:"
ls -la /app/backend || true

python -c "
import sys
print('PATH=', sys.path)

import backend
print('backend=', backend.__file__)
"

echo "===== END DEBUG ====="

if [ -z "$MODEL_BUCKET" ]; then
  echo "MODEL_BUCKET is not set" >&2
  exit 1
fi

mkdir -p /app/models
aws s3 cp "s3://$MODEL_BUCKET/emotion_model.keras" /app/models/emotion_model.keras

exec "$@"q