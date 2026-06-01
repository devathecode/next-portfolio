"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircleIcon, DownloadIcon } from "lucide-react";
import type { ContractDocData } from "@/lib/documents/pdf/ContractDocument";
import type { QuotationDocData } from "@/lib/documents/pdf/QuotationDocument";
import type { BusinessProfile } from "@/lib/documents/types";
import { btnGhost } from "../ui";

type Doc =
  | { kind: "quotation"; data: QuotationDocData }
  | { kind: "contract"; data: ContractDocData };

type Status = "rendering" | "ready" | "error";

/** Builds the PDF in the browser with the same component the server uses for downloads. */
async function buildBlob(doc: Doc, profile: BusinessProfile) {
  const mod = await import("@/lib/documents/pdf/render-client");
  return doc.kind === "quotation" ? mod.quotationBlob(doc.data, profile) : mod.contractBlob(doc.data, profile);
}

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  if (!pdfjs.GlobalWorkerOptions.workerPort) {
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" },
    );
  }
  return pdfjs;
}

/**
 * Live A4 preview. Pages are drawn to canvases (pdf.js) rather than an
 * <iframe>, so the scroll position survives every re-render and it works on
 * iOS, which only shows the first page of a PDF in a frame.
 */
export function PdfPreview({
  doc,
  profile,
  filename,
}: {
  doc: Doc;
  profile: BusinessProfile;
  filename: string;
}) {
  const pagesRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<Blob | null>(null);
  const [status, setStatus] = useState<Status>("rendering");
  const [pageCount, setPageCount] = useState(0);
  const [width, setWidth] = useState(0);
  const key = JSON.stringify([doc, profile]);

  useEffect(() => {
    const el = pagesRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!width) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setStatus("rendering");
      try {
        const [blob, pdfjs] = await Promise.all([buildBlob(doc, profile), loadPdfJs()]);
        if (cancelled) return;
        blobRef.current = blob;
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const canvases: HTMLCanvasElement[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (width / base.width) * dpr });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = "100%";
          canvas.className = "block rounded-sm bg-white shadow-md shadow-black/10 ring-1 ring-black/5";
          canvas.setAttribute("aria-label", `Page ${i} of ${pdf.numPages}`);
          await page.render({ canvas, viewport }).promise;
          if (cancelled) return;
          canvases.push(canvas);
        }
        await pdf.destroy();
        if (cancelled) return;
        // Swap all pages at once so the view never flashes empty or loses its scroll.
        pagesRef.current?.replaceChildren(...canvases);
        setPageCount(canvases.length);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        console.error("PDF preview failed", e);
        setStatus("error");
      }
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // `key` captures doc and profile by value, so edits that don't change them don't re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, width]);

  const download = async () => {
    const blob = blobRef.current ?? (await buildBlob(doc, profile));
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-adm-border bg-adm-raised">
      <div className="flex items-center justify-between gap-2 border-b border-adm-border bg-adm-surface px-3 py-2">
        <p className="flex items-center gap-2 text-xs text-adm-muted">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === "ready" ? "bg-adm-success" : status === "error" ? "bg-adm-danger" : "animate-pulse bg-adm-accent"
            }`}
          />
          {status === "rendering" ? "Updating preview…" : status === "error" ? "Preview failed" : `A4 · ${pageCount} ${pageCount === 1 ? "page" : "pages"}`}
        </p>
        <button type="button" onClick={download} className={`${btnGhost} h-8 px-2.5 text-xs`}>
          <DownloadIcon size={13} /> Download PDF
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {status === "error" && (
          <p className="mb-3 flex items-center gap-1.5 rounded-lg border border-adm-danger/30 bg-adm-danger/10 px-3 py-2 text-xs text-adm-danger">
            <AlertCircleIcon size={13} /> Couldn&apos;t draw the preview. Check the logo URL in your business profile.
          </p>
        )}
        <div ref={pagesRef} className="space-y-3" />
      </div>
    </div>
  );
}
