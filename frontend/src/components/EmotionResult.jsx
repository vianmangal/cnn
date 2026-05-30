import { EMOTION_COLORS, EMOJI_MAP } from "../utils/emotions.js";

export default function EmotionResult({ emotion, confidence, faceDetected }) {
  if (!emotion) {
    return null;
  }

  const color = EMOTION_COLORS[emotion] || "#94a3b8";
  const emoji = EMOJI_MAP[emotion] || "🙂";

  return (
    <div className="animate-pop rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center gap-6">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
          style={{ backgroundColor: `${color}22` }}
        >
          {emoji}
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Prediction
          </div>
          <div className="font-display text-3xl font-semibold text-white">
            {emotion}
          </div>
          <div className="text-sm text-slate-300">
            Confidence {(confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-400">
        {faceDetected ? "Face detected" : "No face detected, using full frame"}
      </div>
    </div>
  );
}
