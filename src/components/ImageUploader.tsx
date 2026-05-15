"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImage } from "@/app/admin/upload-image-action";

type Props = {
  name: string;
  defaultUrl?: string;
};

export default function ImageUploader({ name, defaultUrl = "" }: Props) {
  const [url, setUrl] = useState(defaultUrl);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | null | undefined) {
    if (!file) return;
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const result = await uploadImage(fd);
      if ("error" in result) setError(result.error);
      else setUrl(result.url);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200 group">
          <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          {isPending ? (
            <span className="text-sm text-gray-400">Uploading…</span>
          ) : (
            <>
              <span className="text-2xl text-gray-300">+</span>
              <p className="text-xs text-gray-400 text-center">
                Drag image here or <span className="text-blue-500 font-medium">browse</span>
                <br />
                <span className="text-[11px]">JPEG, PNG, WebP · max 10 MB</span>
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {url && !isPending && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-blue-500 hover:underline"
        >
          Replace image
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
