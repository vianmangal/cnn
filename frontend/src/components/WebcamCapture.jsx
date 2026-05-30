import { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture({ onCapture }) {
  const webcamRef = useRef(null);
  const [preview, setPreview] = useState("");

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

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="h-full w-full object-cover"
            videoConstraints={{ facingMode: "user" }}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleCapture}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
          >
            Capture frame
          </button>
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
