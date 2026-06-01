"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, MailIcon } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

export default function CopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = () => {
    navigator.clipboard
      .writeText(CONTACT_EMAIL)
      .then(() => setCopied(true))
      .catch(() => {
        window.location.href = `mailto:${CONTACT_EMAIL}`;
      });
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-1.5 pl-4 pr-1.5">
      <MailIcon size={15} className="shrink-0 text-[var(--text-muted)]" />
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="min-w-0 flex-1 truncate font-mono text-[13.5px] text-[var(--text-primary)] transition-colors duration-200 hover:text-[var(--accent)]"
      >
        {CONTACT_EMAIL}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border)]
                   bg-[var(--bg-secondary)] px-3 text-xs font-medium text-[var(--text-primary)]
                   transition-colors duration-200 hover:border-[var(--accent-line)] active:scale-[0.97]"
      >
        {copied ? (
          <>
            <CheckIcon size={13} className="text-[var(--accent)]" />
            Copied
          </>
        ) : (
          <>
            <CopyIcon size={13} />
            Copy
          </>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
