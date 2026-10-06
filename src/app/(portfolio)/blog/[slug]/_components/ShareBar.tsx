"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CheckIcon, LinkIcon, Share2Icon } from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { useSite } from "@/components/site/context";

interface ShareBarProps {
  url: string;
  title: string;
  layout?: "horizontal" | "vertical";
}

export function ShareBar({ url, title, layout = "horizontal" }: ShareBarProps) {
  const { notify } = useSite();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const slug = url.split("/").pop() ?? url;

  useEffect(() => setCanShare(typeof navigator.share === "function"), []);

  const track = (platform: string) => trackEvent("blog_share", { platform, post_slug: slug });

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
    ? "flex h-10 w-full items-center gap-2.5 px-2.5 text-[14px] text-[var(--text-secondary)] transition-colors duration-100 " +
      "hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
    : "btn btn-line btn-sm";

  return (
    <div className={vertical ? "flex flex-col" : "flex flex-wrap items-center gap-2"}>
      {vertical && <p className="t-label mb-2 px-2.5 text-[var(--text-muted)]">Share</p>}

      <button type="button" onClick={copy} className={item}>
        {copied ? (
          <CheckIcon size={15} strokeWidth={2.4} className="text-[var(--accent)]" />
        ) : (
          <LinkIcon size={15} strokeWidth={2.2} />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("x")} className={item}>
        <FaXTwitter size={13} />
        Post on X
      </a>
      <a href={liUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("linkedin")} className={item}>
        <BsLinkedin size={13} />
        LinkedIn
      </a>
      {canShare && (
        <button type="button" onClick={nativeShare} className={item}>
          <Share2Icon size={15} strokeWidth={2.2} />
          More
        </button>
      )}
    </div>
  );
}
