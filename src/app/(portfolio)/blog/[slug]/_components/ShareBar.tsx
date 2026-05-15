"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.5 4.5V3A1.5 1.5 0 0 0 8 1.5H3A1.5 1.5 0 0 0 1.5 3v5A1.5 1.5 0 0 0 3 9.5h1.5"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="13" height="13" viewBox="0 0 300 300" fill="currentColor" aria-hidden="true">
      <path d="M178.57 127.15L290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59H300M35.02 19.61h40.56l187.31 262.13h-40.59" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface ShareBarProps {
  url: string;
  title: string;
  layout?: "horizontal" | "vertical";
}

export function ShareBar({ url, title, layout = "horizontal" }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const slug = url.split("/").pop() ?? url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
    sendGAEvent("event", "blog_share", { platform: "copy", post_slug: slug });
  };

  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=devthecoder`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  if (layout === "vertical") {
    return (
      <div className="flex flex-col gap-2">
        <span className="section-label mb-2">Share</span>

        <button
          onClick={handleCopy}
          className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs
                      font-medium transition-all duration-150 ${
                        copied
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                          : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      }`}
        >
          {copied ? <IconCheck /> : <IconCopy />}
          {copied ? "Copied!" : "Copy link"}
        </button>

        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendGAEvent("event", "blog_share", { platform: "x", post_slug: slug })}
          className="flex w-full items-center gap-2.5 rounded-xl border border-[var(--border)]
                     bg-[var(--bg-card)] px-3.5 py-2.5 text-xs font-medium
                     text-[var(--text-secondary)] transition-colors
                     hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
        >
          <IconX />
          Post on X
        </a>

        <a
          href={liUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendGAEvent("event", "blog_share", { platform: "linkedin", post_slug: slug })}
          className="flex w-full items-center gap-2.5 rounded-xl border border-[#0A66C2]/30
                     bg-[#0A66C2]/6 px-3.5 py-2.5 text-xs font-medium text-[#0A66C2]
                     transition-colors hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/12"
        >
          <IconLinkedIn />
          LinkedIn
        </a>
      </div>
    );
  }

  // horizontal (mobile inline)
  const btnBase =
    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="section-label mr-1">Share</span>

      <button
        onClick={handleCopy}
        className={`${btnBase} ${
          copied
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
            : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        }`}
      >
        {copied ? <IconCheck /> : <IconCopy />}
        {copied ? "Copied!" : "Copy link"}
      </button>

      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sendGAEvent("event", "blog_share", { platform: "x", post_slug: slug })}
        className={`${btnBase} border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)]
                    hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]`}
      >
        <IconX />
        Post on X
      </a>

      <a
        href={liUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sendGAEvent("event", "blog_share", { platform: "linkedin", post_slug: slug })}
        className={`${btnBase} border-[#0A66C2]/30 bg-[#0A66C2]/6 text-[#0A66C2]
                    hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/12`}
      >
        <IconLinkedIn />
        Share on LinkedIn
      </a>
    </div>
  );
}
