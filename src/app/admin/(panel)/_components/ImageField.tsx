"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { AlertCircleIcon, ImagePlusIcon } from "lucide-react";
import { uploadImage } from "../../upload-image-action";

const ALT = { cover: "Project preview", logo: "Logo", signature: "Signature" };

/** The field under the pointer or holding focus. It takes pastes ahead of a page-wide field. */
let targeted: string | null = null;

/** Uploads to Cloudinary via drag and drop, file picker or paste. */
export function ImageField({
  value,
  onChange,
  variant = "cover",
  pasteAnywhere = true,
}: {
  value: string;
  onChange: (url: string) => void;
  /** cover: wide screenshot crop. logo, signature: whole image, contained. */
  variant?: "cover" | "logo" | "signature";
  /** Take Ctrl/Cmd+V from anywhere on the page. Off: only while pointed at or focused. */
  pasteAnywhere?: boolean;
}) {
  const id = useId();
  const contained = variant !== "cover";
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image. Use JPG, PNG, WebP or AVIF.");
      return;
    }
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const result = await uploadImage(fd);
      if ("error" in result) setError(result.error);
      else onChange(result.url);
    });
  };

  // Ctrl/Cmd+V uploads a clipboard image: to the field pointed at or focused, else the page-wide one.
  const handleFileRef = useRef(handleFile);
  handleFileRef.current = handleFile;
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (targeted ? targeted !== id : !pasteAnywhere) return;
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (!file) return;
      e.preventDefault();
      handleFileRef.current(file);
    };
    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("paste", onPaste);
      if (targeted === id) targeted = null;
    };
  }, [id, pasteAnywhere]);

  const target = () => {
    targeted = id;
  };
  // Stays targeted while it holds focus, even once the pointer has moved on.
  const untarget = () => {
    if (targeted === id && !rootRef.current?.contains(document.activeElement)) targeted = null;
  };

  const pasteFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (type) {
          const blob = await item.getType(type);
          handleFile(new File([blob], `pasted.${type.split("/")[1]}`, { type }));
          return;
        }
      }
      setError("No image on the clipboard. Copy an image first.");
    } catch {
      setError("Couldn't read the clipboard. Press Ctrl/Cmd+V instead.");
    }
  };

  return (
    <div>
      <div
        ref={rootRef}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onPointerEnter={target}
        onPointerLeave={untarget}
        onFocus={target}
        onBlur={(e) => {
          if (targeted === id && !e.currentTarget.contains(e.relatedTarget)) targeted = null;
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative overflow-hidden rounded-xl border transition ${
          dragging ? "border-adm-accent bg-adm-accent/10" : "border-dashed border-adm-border"
        }`}
      >
        {value ? (
          <div className={`group relative w-full bg-adm-surface ${contained ? "h-32" : "aspect-[16/7]"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={ALT[variant]}
              className={contained ? "h-full w-full object-contain p-4 pb-12" : "h-full w-full object-cover object-top"}
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-2.5">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={pending}
                className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-900 hover:bg-white disabled:opacity-60"
              >
                {pending ? "Uploading…" : "Replace"}
              </button>
              <button
                type="button"
                onClick={pasteFromClipboard}
                disabled={pending}
                className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-900 hover:bg-white disabled:opacity-60"
              >
                Paste
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={pending}
                className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="flex w-full flex-col items-center gap-1.5 px-4 py-7 text-center text-adm-muted transition hover:bg-adm-raised/60 hover:text-adm-text disabled:opacity-60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-adm-raised">
              {pending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-adm-subtle border-t-adm-text" />
              ) : (
                <ImagePlusIcon size={16} />
              )}
            </span>
            <span className="text-sm font-medium">{pending ? "Uploading…" : "Drop, click to upload, or paste"}</span>
            <span className="text-xs text-adm-subtle">
              JPG, PNG, WebP or AVIF · {pasteAnywhere ? "Ctrl/Cmd+V works too" : "point here and press Ctrl/Cmd+V"}
            </span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-adm-danger" role="alert">
          <AlertCircleIcon size={12} className="shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
