import Image from "next/image";
import { BsLinkedin } from "react-icons/bs";
import { LINKEDIN_URL } from "@/lib/site";

/** Author row under the CSS tips hero, with a follow link. */
export default function LinkedInBadge() {
  return (
    <div className="mt-10 flex max-w-md items-center gap-3 border-t border-[var(--border)] pt-6">
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
        <Image src="/images/LInkedin_heashot.png" alt="" fill sizes="40px" className="object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Devanshu Verma</p>
        <p className="text-[13px] text-[var(--text-secondary)]">Sharing CSS and frontend tips weekly</p>
      </div>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3
                   text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-line)]"
      >
        <BsLinkedin size={13} className="text-[var(--text-muted)]" />
        Follow
      </a>
    </div>
  );
}
