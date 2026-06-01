import { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture({ onCapture }) {
  const webcamRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");

  const dataUrlToBlob = (dataUrl) => {
    const [header, base64] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
    const binary = atob(base64);
    const length = binary.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      return;
    }
    const blob = dataUrlToBlob(imageSrc);
    setPreview(imageSrc);
    onCapture?.(blob, imageSrc);
  };

  const handleStart = () => {
    setError("");
    setIsActive(true);
  };

  const handleUserMediaError = () => {
    setError("Unable to access your camera. Check permissions and try again.");
    setIsActive(false);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          {isActive ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="h-full w-full object-cover"
              videoConstraints={{ facingMode: "user" }}
              onUserMedia={() => setError("")}
              onUserMediaError={handleUserMediaError}
            />
          ) : (
            <div className="flex h-64 items-center justify-center px-6 text-center text-sm text-slate-400">
              Webcam is off. Enable it to preview and capture a frame.
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          {isActive ? (
            <button
              type="button"
              onClick={handleCapture}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
            >
              Capture frame
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStart}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
            >
              Enable webcam
            </button>
          )}
          {error ? <div className="text-xs text-rose-300">{error}</div> : null}
          {preview ? (
            <img
              src={preview}
              alt="Webcam capture"
              className="h-40 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="text-sm text-slate-400">No capture yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
