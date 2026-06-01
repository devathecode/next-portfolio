"use client";

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { CheckIcon, LinkIcon, Share2Icon } from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { useBrowser } from "@/components/browser/context";

interface ShareBarProps {
  url: string;
  title: string;
  layout?: "horizontal" | "vertical";
}

export function ShareBar({ url, title, layout = "horizontal" }: ShareBarProps) {
  const { notify } = useBrowser();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const slug = url.split("/").pop() ?? url;

  useEffect(() => setCanShare(typeof navigator.share === "function"), []);

  const track = (platform: string) => sendGAEvent("event", "blog_share", { platform, post_slug: slug });

  const copy = async () => {
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
    notify("Link copied");
    setTimeout(() => setCopied(false), 2000);
    track("copy");
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
      track("native");
    } catch {
      // Dismissed
    }
  };

  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=devthecoder`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const vertical = layout === "vertical";
  const item = vertical
    ? "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] text-[var(--text-secondary)] transition-colors " +
      "hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)]"
    : "inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 text-[13px] " +
      "font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--text-primary)]";

  return (
    <div className={vertical ? "flex flex-col" : "flex flex-wrap items-center gap-2"}>
      {vertical && <p className="mb-2 px-2.5 font-mono text-[11px] text-[var(--text-muted)]">Share</p>}

      <button type="button" onClick={copy} className={item}>
        {copied ? (
          <CheckIcon size={15} className="text-[var(--accent)]" />
        ) : (
          <LinkIcon size={15} className="text-[var(--text-muted)]" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("x")} className={item}>
        <FaXTwitter size={13} className="text-[var(--text-muted)]" />
        Post on X
      </a>
      <a href={liUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("linkedin")} className={item}>
        <BsLinkedin size={13} className="text-[var(--text-muted)]" />
        LinkedIn
      </a>
      {canShare && (
        <button type="button" onClick={nativeShare} className={item}>
          <Share2Icon size={15} className="text-[var(--text-muted)]" />
          More
        </button>
      )}
    </div>
  );
}
