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

# Phase 8 — Improvement Iterations

## Objectives
- Improve generalization and reduce class bias
- Push test accuracy toward 75%

## Tasks
- [x] Add data augmentation in the model
- [x] Add BatchNorm + L2 + GlobalAveragePooling
- [x] Use stratified train/validation split
- [x] Use class weights for imbalance
- [x] Add EarlyStopping, ReduceLROnPlateau, and checkpoints
- [ ] Train and evaluate on the test set
- [ ] Update stats and confusion summary

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

what is deep learning 
what is machine learning 
what is neural network
what is application of neural network 
how do nn function
cnn,rnn,ann, etc whats this?


# Emotion Detection CNN — Web Deployment Plan

> Extending the existing CLI-based CNN emotion recognition project into a full-stack deployable web application.

---

## Project Overview

The existing project is a Python CNN (TensorFlow/Keras) that classifies 5 emotions — **angry, fear, happy, neutral, sad** — from images and webcam feeds. This plan converts it into a web application where users can upload an image or use their browser camera to get real-time emotion predictions.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                     │
│   React + Tailwind   ──   Image Upload / Webcam Capture     │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS / REST API
┌────────────────────────────▼────────────────────────────────┐
│                  BACKEND (FastAPI / Python)                  │
│   /predict endpoint   ──   Model Inference   ──   Auth      │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    DATABASE (PostgreSQL)                     │
│   Users   ──   Prediction History   ──   Analytics          │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 9 — Backend (FastAPI)

### Goal
Serve the trained CNN model as a REST API that accepts images and returns emotion predictions.

### Stack
- **Framework**: FastAPI (Python) — fits naturally with existing TF/Keras code
- **Model serving**: Load `.keras` model at startup; reuse across requests
- **Image processing**: OpenCV + Pillow (already used in project)
- **Auth**: JWT tokens (register/login)
- **Server**: Uvicorn (dev) → Gunicorn + Uvicorn workers (prod)

### Folder Structure
```
backend/
├── main.py                  # FastAPI app entry point
├── routers/
│   ├── predict.py           # POST /predict — image upload & inference
│   ├── auth.py              # POST /register, POST /login
│   └── history.py           # GET /history — user's past predictions
├── models/
│   ├── cnn_model.py         # Model loader (singleton)
│   └── db_models.py         # SQLAlchemy ORM models
├── services/
│   ├── inference.py         # Preprocess image → run model → return result
│   └── face_detect.py       # OpenCV face crop (reused from webcam.py)
├── schemas/
│   ├── prediction.py        # Pydantic request/response schemas
│   └── user.py
├── database.py              # DB connection + session
├── config.py                # Env vars (DB URL, secret key, model path)
├── requirements.txt
└── Dockerfile
```

### Key Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/predict` | Upload image → returns emotion + confidence scores |
| POST | `/auth/register` | Create user account |
| POST | `/auth/login` | Returns JWT token |
| GET | `/history` | List user's past predictions (auth required) |
| GET | `/health` | Health check for deployment |

### Tasks
- [ ] Create FastAPI app skeleton (`main.py`, CORS, lifespan)
- [ ] Write model loader singleton (load `.keras` once on startup)
- [ ] Port `predict.py` preprocessing into `services/inference.py`
- [ ] Build `/predict` endpoint — accept `multipart/form-data` image
- [ ] Add face detection crop step (from `webcam.py`)
- [ ] Return JSON: `{ emotion, confidence, all_scores[] }`
- [ ] Add JWT auth (register + login routes)
- [ ] Protect `/history` route
- [ ] Write `requirements.txt`
- [ ] Write `Dockerfile` for backend

---

## Phase 10 — Frontend (React)

### Goal
A clean web UI where users can upload a photo or capture from webcam, see the predicted emotion, and view confidence scores visually.

### Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **HTTP**: Axios
- **Webcam**: `react-webcam` library
- **Charts**: Recharts (bar chart for confidence scores)
- **Auth**: React Context + localStorage JWT

### Folder Structure
```
frontend/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   └── client.js         # Axios instance + interceptors
│   ├── context/
│   │   └── AuthContext.jsx   # JWT storage + user state
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Predict.jsx       # Upload / webcam + results
│   │   ├── History.jsx       # Past prediction log
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── components/
│   │   ├── ImageUploader.jsx     # Drag-drop image upload
│   │   ├── WebcamCapture.jsx     # Live webcam + capture button
│   │   ├── EmotionResult.jsx     # Shows detected emotion + emoji
│   │   ├── ConfidenceChart.jsx   # Bar chart of all 5 scores
│   │   ├── PredictionCard.jsx    # History item card
│   │   └── Navbar.jsx
│   └── assets/
│       └── emotion-icons/
├── package.json
└── Dockerfile
```

### Key Pages & Features

**Home** — Hero section explaining the app, CTA to try it.

**Predict** — Toggle between "Upload Image" and "Use Webcam". On result, show:
- Dominant emotion with large emoji
- Confidence % for each of the 5 emotions (bar chart)
- Option to save result to history (if logged in)

**History** — Scrollable list of past predictions with thumbnails and timestamps.

**Auth** — Simple login/register forms; JWT stored in `localStorage`.

### Tasks
- [ ] Scaffold Vite + React project
- [ ] Set up Tailwind CSS
- [ ] Create Axios client with base URL + auth header interceptor
- [ ] Build `ImageUploader` component (drag-drop + file input)
- [ ] Build `WebcamCapture` component using `react-webcam`
- [ ] Build `ConfidenceChart` with Recharts horizontal bar chart
- [ ] Build `EmotionResult` display (emoji map: angry😠 fear😨 happy😊 neutral😐 sad😢)
- [ ] Create Predict page wiring upload → API → result display
- [ ] Create History page (fetch + render prediction cards)
- [ ] Add Auth pages + Context
- [ ] Write `Dockerfile` for frontend (Nginx static serve)

---

## Phase 11 — Database (PostgreSQL)

### Goal
Store users and their prediction history for a personalized experience and analytics.

### Stack
- **DB**: PostgreSQL
- **ORM**: SQLAlchemy (async) with Alembic migrations
- **Connection**: `asyncpg` driver

### Schema

#### `users` table
```sql
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    username    VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

#### `predictions` table
```sql
CREATE TABLE predictions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    image_filename  VARCHAR(255),
    emotion         VARCHAR(50) NOT NULL,       -- e.g. "happy"
    confidence      FLOAT NOT NULL,             -- top emotion score
    all_scores      JSONB NOT NULL,             -- { angry: 0.1, happy: 0.8, ... }
    source          VARCHAR(20) DEFAULT 'upload', -- 'upload' or 'webcam'
    created_at      TIMESTAMP DEFAULT NOW()
);
```

#### `model_versions` table (optional, for tracking)
```sql
CREATE TABLE model_versions (
    id          SERIAL PRIMARY KEY,
    version     VARCHAR(50) NOT NULL,
    accuracy    FLOAT,
    deployed_at TIMESTAMP DEFAULT NOW(),
    is_active   BOOLEAN DEFAULT TRUE
);
```

### Tasks
- [ ] Set up PostgreSQL (local Docker or managed: Supabase / Railway)
- [ ] Write SQLAlchemy ORM models matching above schema
- [ ] Write Alembic migration for initial schema
- [ ] Add DB session dependency to FastAPI
- [ ] Implement save-prediction logic in `/predict` route
- [ ] Add indexes on `user_id` and `created_at` for history queries

---

## Phase 12 — Deployment

### Goal
Get the full stack live on the internet with a public URL.

### Recommended Free/Low-Cost Stack

| Layer | Service | Notes |
|-------|---------|-------|
| Frontend | **Vercel** | Auto-deploy from GitHub; free tier |
| Backend | **Railway** or **Render** | Python/Docker deploy; free tier available |
| Database | **Supabase** (PostgreSQL) | Free tier, 500MB |
| Model file | **HuggingFace Hub** or ship with Docker | `.keras` file in container |
| Domain | Optional (Vercel gives `.vercel.app`) | |

### Docker Compose (local dev)
```yaml
version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: emotiondb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports: ["5432:5432"]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      DATABASE_URL: postgresql+asyncpg://user:password@db/emotiondb
      SECRET_KEY: your-secret-key
      MODEL_PATH: /app/models/emotion_model.keras
    depends_on: [db]

  frontend:
    build: ./frontend
    ports: ["3000:80"]
    environment:
      VITE_API_URL: http://localhost:8000
```

### CI/CD (GitHub Actions)
```
On push to main:
  1. Run backend tests (pytest)
  2. Build Docker images
  3. Deploy backend → Railway/Render
  4. Deploy frontend → Vercel
```

### Tasks
- [ ] Create `docker-compose.yml` for local dev
- [ ] Add `Dockerfile` for backend
- [ ] Add `Dockerfile` for frontend (Nginx)
- [ ] Set up Supabase PostgreSQL instance
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Set environment variables in each platform
- [ ] Wire `VITE_API_URL` in frontend build
- [ ] Test end-to-end on live URLs
- [ ] Add GitHub Actions workflow

---

## Complete Task Checklist

### Backend
- [ ] FastAPI app skeleton
- [ ] Model loader singleton
- [ ] `/predict` endpoint
- [ ] JWT auth routes
- [ ] SQLAlchemy DB models
- [ ] Alembic migration
- [ ] `/history` route
- [ ] Dockerfile

### Frontend
- [ ] Vite + React scaffold
- [ ] Tailwind setup
- [ ] ImageUploader component
- [ ] WebcamCapture component
- [ ] ConfidenceChart component
- [ ] Predict page
- [ ] History page
- [ ] Auth pages + Context
- [ ] Dockerfile

### Database
- [ ] PostgreSQL running (local + prod)
- [ ] `users` table
- [ ] `predictions` table
- [ ] Alembic migrations

### DevOps
- [ ] docker-compose.yml
- [ ] Supabase setup
- [ ] Railway/Render backend deploy
- [ ] Vercel frontend deploy
- [ ] GitHub Actions CI/CD

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| ML Model | TensorFlow / Keras (existing) |
| Backend | Python + FastAPI |
| Frontend | React + Vite + Tailwind CSS |
| Database | PostgreSQL + SQLAlchemy |
| Migrations | Alembic |
| Auth | JWT (python-jose) |
| Containerization | Docker + Docker Compose |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway or Render |
| DB Hosting | Supabase |
| CI/CD | GitHub Actions |

---

*Phases 1–8 are complete (CLI model). Phases 9–12 cover the web deployment.*