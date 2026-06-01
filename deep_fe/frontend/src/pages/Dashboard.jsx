import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Sidebar from "../components/layouts/sidebar";
import { predictEmotion } from "../api/predict";
import { EMOJI_MAP } from "../utils/emotions";

const base64ToBlob = (base64, mimeType) => {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
};

const CornerBrackets = () => (
  <>
    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/40 z-10 pointer-events-none" />
    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/40 z-10 pointer-events-none" />
    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/40 z-10 pointer-events-none" />
    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/40 z-10 pointer-events-none" />
  </>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upload");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [webcamCaptured, setWebcamCaptured] = useState(false);

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clear state when tab changes
  useEffect(() => {
    handleClear();
  }, [activeTab]);

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setWebcamCaptured(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Supported formats: JPG, PNG, JPEG, WEBP");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      const blob = base64ToBlob(imageSrc, "image/jpeg");
      const file = new File([blob], "captured-frame.jpg", { type: "image/jpeg" });
      setImage(file);
      setResult(null);
      setError(null);
      setWebcamCaptured(true);
    }
  }, [webcamRef]);

  const handleAnalyze = async () => {
    if (!image) {
      setError("Please select or capture an image first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await predictEmotion(image);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white font-mono overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-black">
        {/* Compact SaaS Header */}
        <header className="border-b border-zinc-900 px-8 py-4 flex items-center justify-between shrink-0 bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-[0.25em] text-white">
              EMOTIONLENS
            </h1>
            <div className="h-4 w-px bg-zinc-800" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold hidden md:inline-block">
              AI-Powered Emotion Analytics Platform
            </span>
          </div>

          <div className="border border-zinc-800 px-3 py-1 rounded-md text-[10px] text-zinc-400 uppercase tracking-widest font-semibold bg-zinc-950/40">
            {activeTab === "upload" ? "📂 FILE MODE" : "📸 CAMERA MODE"}
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
            
            {/* Error Alert */}
            {error && (
              <div className="border border-red-950 bg-red-950/20 text-red-200 px-5 py-4 rounded-xl text-xs flex justify-between items-center transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  <span>{error}</span>
                </div>
                <button 
                  onClick={() => setError(null)} 
                  className="text-red-400 hover:text-red-200 uppercase tracking-wider text-[10px] font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Core Card Section (Upload Zone / Live Webcam) */}
            <div className="border border-zinc-900 bg-zinc-950/30 rounded-2xl p-6 transition-all duration-300">
              <div className="text-[10px] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-4">
                {activeTab === "upload" ? "IMAGE ACQUISITION" : "LIVE CAMERA FEED"}
              </div>

              {activeTab === "upload" ? (
                // Upload Tab View
                <div>
                  {!preview ? (
                    // Drag & Drop Area
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-xl h-64 flex flex-col justify-center items-center cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                        isDragging
                          ? "border-white bg-zinc-900/40"
                          : "border-zinc-800 hover:border-zinc-500 hover:bg-zinc-950/50"
                      }`}
                    >
                      <div className="w-10 h-10 border border-zinc-800 flex items-center justify-center rounded-lg mb-3 group-hover:border-zinc-600 transition-colors duration-200">
                        <span className="text-zinc-500 group-hover:text-white transition-colors duration-200 text-lg font-bold">+</span>
                      </div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
                        Drag & Drop or Click to Upload
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">
                        JPG, PNG, JPEG, WEBP (Max 5MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    // Upload Image Selected View
                    <div className="flex flex-col gap-4">
                      <div className="relative aspect-video max-h-80 overflow-hidden rounded-xl border border-zinc-900 bg-black flex items-center justify-center">
                        <CornerBrackets />
                        <img
                          src={preview}
                          alt="Uploaded facial preview"
                          className="max-h-full max-w-full object-contain"
                        />
                        {loading && (
                          <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-white/70 absolute animate-scan left-0 top-0 shadow-[0_0_10px_#fff]" />
                          </div>
                        )}
                      </div>

                      {/* Integrated Action Bar */}
                      <div className="flex gap-4">
                        <button
                          onClick={handleClear}
                          disabled={loading}
                          className="flex-1 py-3 border border-zinc-800 rounded-xl hover:border-zinc-600 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition disabled:opacity-50"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleAnalyze}
                          disabled={loading}
                          className="flex-[2.5] py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              Running Model...
                            </>
                          ) : (
                            "Analyze Image →"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Webcam Tab View
                <div>
                  {!webcamCaptured ? (
                    // Live View & Capture Action
                    <div className="flex flex-col gap-4">
                      <div className="relative aspect-video max-h-80 overflow-hidden rounded-xl border border-zinc-900 bg-black flex items-center justify-center">
                        <CornerBrackets />
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          className="max-h-full max-w-full object-contain"
                        />
                        <div className="absolute inset-0 z-20 pointer-events-none">
                          <div className="w-full h-0.5 bg-white/30 absolute animate-scan left-0 top-0 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                        </div>
                      </div>

                      <button
                        onClick={handleCapture}
                        className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
                      >
                        Capture Frame
                      </button>
                    </div>
                  ) : (
                    // Photo Captured View
                    <div className="flex flex-col gap-4">
                      <div className="relative aspect-video max-h-80 overflow-hidden rounded-xl border border-zinc-900 bg-black flex items-center justify-center">
                        <CornerBrackets />
                        <img
                          src={preview}
                          alt="Captured face preview"
                          className="max-h-full max-w-full object-contain"
                        />
                        {loading && (
                          <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-white/70 absolute animate-scan left-0 top-0 shadow-[0_0_10px_#fff]" />
                          </div>
                        )}
                      </div>

                      {/* Integrated Action Bar */}
                      <div className="flex gap-4">
                        <button
                          onClick={handleClear}
                          disabled={loading}
                          className="flex-1 py-3 border border-zinc-800 rounded-xl hover:border-zinc-600 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition disabled:opacity-50"
                        >
                          Retake
                        </button>
                        <button
                          onClick={handleAnalyze}
                          disabled={loading}
                          className="flex-[2.5] py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              Running Model...
                            </>
                          ) : (
                            "Analyze Frame →"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results Output Section */}
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 animate-fade">
                
                {/* Result Display Area */}
                <div className="border border-zinc-900 bg-zinc-950/30 rounded-2xl p-6">
                  <div className="text-[10px] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-5">
                    ANALYSIS FRAME
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-zinc-900 bg-black aspect-square flex items-center justify-center">
                    <CornerBrackets />
                    <img
                      src={preview}
                      alt="Analyzed target face"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* Classification Metrics */}
                <div className="flex flex-col gap-6">
                  
                  {/* Dominant Emotion Header */}
                  <div className="border border-zinc-900 bg-zinc-950/30 rounded-2xl p-6">
                    <div className="text-[10px] font-semibold tracking-[0.15em] text-zinc-500 uppercase">
                      DOMINANT EXPRESSION
                    </div>
                    <div className="flex items-baseline gap-3 mt-3">
                      <h2 className="text-4xl font-extrabold uppercase tracking-wider text-white">
                        {result.emotion}
                      </h2>
                      <span className="text-4xl select-none">
                        {EMOJI_MAP[result.emotion] || "•"}
                      </span>
                    </div>

                    <div className="text-xl font-medium text-zinc-400 mt-2">
                      {(result.confidence * 100).toFixed(1)}% Confidence
                    </div>

                    <div className="mt-4 flex gap-2 flex-wrap">
                      <div className="border border-zinc-800 px-2.5 py-1 rounded text-[10px] font-semibold text-zinc-400 tracking-wider bg-zinc-900/30">
                        {result.face_detected ? "FACE DETECTED ✓" : "NO FACE DETECTED"}
                      </div>
                      <div className="border border-zinc-800 px-2.5 py-1 rounded text-[10px] font-semibold text-zinc-400 tracking-wider bg-zinc-900/30">
                        {result.model_version || "V1.0"}
                      </div>
                    </div>
                  </div>

                  {/* Distribution Scores */}
                  <div className="border border-zinc-900 bg-zinc-950/30 rounded-2xl p-6 flex-1">
                    <div className="text-[10px] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-5">
                      PROBABILITY DISTRIBUTION
                    </div>
                    <div className="space-y-4">
                      {Object.entries(result.all_scores || {})
                        .sort((a, b) => b[1] - a[1])
                        .map(([emotion, score]) => (
                          <div key={emotion} className="text-xs">
                            <div className="flex justify-between items-center mb-1.5 uppercase font-medium">
                              <span className="flex items-center gap-2 text-zinc-300">
                                <span className="text-sm select-none">{EMOJI_MAP[emotion] || "•"}</span>
                                {emotion}
                              </span>
                              <span className="text-white font-bold">
                                {(score * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-white transition-all duration-700 ease-out"
                                style={{
                                  width: `${score * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

