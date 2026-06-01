"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Hero portrait framed like an element under DevTools: hovering shows the
 * highlight box and a tooltip with the image's real rendered size.
 */
export default function PortraitWindow() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<string>("");

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize(`${Math.round(width)} × ${Math.round(height)}`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <figure
      className="hero-rise relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)]
                 bg-[var(--bg-card)] shadow-[var(--shadow-card-hover)] sm:max-w-md lg:ml-auto lg:mr-0 lg:max-w-[26rem] xl:max-w-[28rem]"
    >
      <div
        ref={mediaRef}
        className="group relative aspect-[4/5] overflow-hidden"
        style={{
          background:
            "radial-gradient(110% 80% at 50% 100%, var(--accent-glow) 0%, transparent 62%), var(--bg-secondary)",
        }}
      >
        <Image
          src="/images/dev.webp"
          alt="Portrait of Devanshu Verma"
          fill
          priority
          sizes="(max-width: 640px) 24rem, (max-width: 1024px) 28rem, 36vw"
          className="object-cover object-top"
        />

        {/* DevTools-style highlight, on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          <div className="absolute inset-0 bg-[var(--accent-muted)] outline outline-1 -outline-offset-1 outline-[var(--accent)]" />
          <div
            className="absolute left-3 top-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)]
                       px-2.5 py-1.5 font-mono text-[11px] shadow-[var(--shadow-card)]"
          >
            <span className="text-[var(--accent)]">img</span>
            <span className="text-[var(--text-primary)]">.portrait</span>
            <span className="ml-3 tabular-nums text-[var(--text-muted)]">{size}</span>
          </div>
        </div>
      </div>

      <figcaption
        className="flex items-center gap-3 border-t border-[var(--border)] px-4 py-2.5 font-mono text-[11px]
                   text-[var(--text-muted)]"
      >
        <span className="min-w-0 truncate">
          section#home <span aria-hidden="true">›</span> figure{" "}
          <span aria-hidden="true">›</span>{" "}
          <span className="text-[var(--text-primary)]">img.portrait</span>
        </span>
        <span className="ml-auto shrink-0 tabular-nums">{size}</span>
      </figcaption>
    </figure>
  );
}
