import { useCallback, useEffect, useRef, useState } from "react";

const MAX_FILE_MB = 5;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export default function ImageUploader({ onSelect }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const updatePreview = useCallback(
    (file) => {
      if (!file) {
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      onSelect?.(file, url);
    },
    [onSelect]
  );

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) {
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setPreview("");
      setError("Only PNG or JPEG images are allowed.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setPreview("");
      setError(`Image must be smaller than ${MAX_FILE_MB}MB.`);
      return;
    }
    setError("");
    updatePreview(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 px-6 py-12 text-center"
      >
        <div className="text-sm text-slate-300">
          Drag and drop an image or choose a file.
        </div>
        <div className="text-xs text-slate-500">
          PNG or JPEG, up to {MAX_FILE_MB}MB.
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
        >
          Select image
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={(event) => handleFiles(event.target.files)}
          className="hidden"
        />
        {error ? (
          <div className="text-xs text-rose-300">{error}</div>
        ) : null}
        {preview ? (
          <img
            src={preview}
            alt="Selected preview"
            className="mt-4 max-h-52 rounded-xl object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}
