import { useState } from "react";

import Sidebar from "../components/layouts/sidebar";
import Header from "../components/layouts/header";
import AnalyticsTable from "../components/analytics/analyticstable";

import { predictEmotion } from "../api/predict";

export default function Dashboard() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    try {
      setLoading(true);

      const data = await predictEmotion(image);

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-auto p-8">
          {/* Upload Section */}
          <div className="border border-zinc-800 bg-zinc-950 p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              Analyze Image
            </h2>

            <p className="text-zinc-400 mb-6">
              Upload an image to detect emotions using AI.
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="block mb-4"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-700 px-6 py-3 font-medium transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {/* Result Section */}
          {result && (
            <div className="border border-zinc-800 bg-zinc-950 p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6">
                Analysis Result
              </h2>

              <div className="mb-8">
                <p className="text-zinc-400 text-sm mb-2">
                  Detected Emotion
                </p>

                <h3 className="text-5xl font-bold uppercase">
                  {result.emotion}
                </h3>

                <p className="mt-4 text-lg text-zinc-300">
                  Confidence:{" "}
                  {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold">
                  Emotion Breakdown
                </h4>

                {Object.entries(result.scores).map(
                  ([emotion, score]) => (
                    <div
                      key={emotion}
                      className="mb-4"
                    >
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="capitalize">
                          {emotion}
                        </span>

                        <span>
                          {(score * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-3 bg-zinc-800">
                        <div
                          className="h-3 bg-violet-500"
                          style={{
                            width: `${score * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* History Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Recent Analyses
            </h2>

            <AnalyticsTable />
          </div>
        </main>
      </div>
    </div>
  );
}