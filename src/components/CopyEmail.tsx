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
    <div className="flex h-14 items-center gap-3 bg-[var(--ink)] py-2 pl-4 pr-2 text-[var(--bone-ink)]">
      <MailIcon size={17} className="shrink-0" />
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="min-w-0 flex-1 truncate text-[16px] font-medium underline decoration-transparent underline-offset-4 transition-colors duration-100 hover:decoration-current"
      >
        {CONTACT_EMAIL}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        className="t-label inline-flex h-10 shrink-0 items-center gap-1.5 bg-[var(--ochre)] px-3.5 text-[var(--ink-ink)]
                   transition-colors duration-100 hover:bg-[var(--cardinal)] hover:text-[#fbf6ec]"
      >
        {copied ? (
          <>
            <CheckIcon size={14} strokeWidth={2.4} />
            Copied
          </>
        ) : (
          <>
            <CopyIcon size={14} strokeWidth={2.2} />
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
