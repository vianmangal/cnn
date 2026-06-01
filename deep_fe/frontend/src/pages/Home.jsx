import { Link } from "react-router-dom";

import { EMOTION_COLORS, EMOTION_ORDER, EMOJI_MAP } from "../utils/emotions.js";

export default function Home() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12">
      <div className="absolute inset-0 -z-10 bg-radial-glow opacity-90" />
      <div className="absolute inset-0 -z-10 bg-grid bg-[length:40px_40px] opacity-30" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            Real-time CNN inference
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            Map your emotions with a camera, a single frame, or a memory.
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            Upload a photo or capture a live frame. The model scores each of the
            five emotions and keeps a timeline when you are signed in.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/predict"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            >
              Start a prediction
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100"
            >
              Create an account
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Emotion palette
          </div>
          <div className="mt-4 grid gap-3">
            {EMOTION_ORDER.map((emotion) => (
              <div
                key={emotion}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{EMOJI_MAP[emotion]}</span>
                  <span className="text-sm font-semibold capitalize text-white">
                    {emotion}
                  </span>
                </div>
                <span
                  className="h-3 w-12 rounded-full"
                  style={{ backgroundColor: EMOTION_COLORS[emotion] }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
