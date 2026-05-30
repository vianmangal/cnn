import { EMOTION_COLORS, EMOJI_MAP } from "../utils/emotions.js";

export default function PredictionCard({ item }) {
  const color = EMOTION_COLORS[item.emotion] || "#64748b";
  const emoji = EMOJI_MAP[item.emotion] || "🙂";
  const createdAt = new Date(item.created_at).toLocaleString();

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-xl text-3xl"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {emoji}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-display text-lg font-semibold text-white">
            {item.emotion}
          </div>
          <div className="text-xs text-slate-400">
            {(item.confidence * 100).toFixed(1)}%
          </div>
        </div>
        <div className="text-xs text-slate-400">{createdAt}</div>
      </div>
      <div className="text-xs text-slate-500">{item.model_version}</div>
    </div>
  );
}
