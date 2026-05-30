import { useState } from "react";
import { useNavigate } from "react-router-dom";

import client from "../api/client.js";
import ConfidenceChart from "../components/ConfidenceChart.jsx";
import EmotionResult from "../components/EmotionResult.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import WebcamCapture from "../components/WebcamCapture.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Predict() {
  const [activeTab, setActiveTab] = useState("upload");
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const runPredict = async (blob, preview) => {
    if (!blob) {
      return;
    }
    setLoading(true);
    setError("");
    setPreviewUrl(preview || "");
    try {
      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");
      const response = await client.post("/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err) {
      setError("Prediction failed. Please try another image.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">
              Run a prediction
            </h2>
            <p className="text-sm text-slate-400">
              Upload a photo or grab a live frame from your webcam.
            </p>
          </div>
          <div className="flex gap-2 rounded-full border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "upload"
                  ? "bg-white text-slate-900"
                  : "text-slate-300"
              }`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("webcam")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "webcam"
                  ? "bg-white text-slate-900"
                  : "text-slate-300"
              }`}
            >
              Webcam
            </button>
          </div>
        </div>
      </div>

      {activeTab === "upload" ? (
        <ImageUploader onSelect={runPredict} />
      ) : (
        <WebcamCapture onCapture={runPredict} />
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
          Running inference...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <EmotionResult
              emotion={result.emotion}
              confidence={result.confidence}
              faceDetected={result.face_detected}
            />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Prediction preview"
                className="rounded-2xl border border-slate-800 object-cover"
              />
            ) : null}
            {!token ? (
              <button
                type="button"
                onClick={() => navigate("/login", { state: { from: "/predict" } })}
                className="w-full rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100"
              >
                Save to history
              </button>
            ) : (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                Saved to history.
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Confidence scores
            </div>
            <ConfidenceChart scores={result.all_scores} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
