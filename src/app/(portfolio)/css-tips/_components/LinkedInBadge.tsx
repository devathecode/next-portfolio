import Image from "next/image";
import { BsLinkedin } from "react-icons/bs";
import { LINKEDIN_URL } from "@/lib/site";

/** Author row under the CSS tips hero, with a follow link. */
export default function LinkedInBadge() {
  return (
    <div className="mt-10 flex max-w-md items-center gap-3 border-t border-[var(--border)] pt-6">
      <span className="relative h-11 w-11 shrink-0 overflow-hidden bg-[var(--cardinal)]">
        <Image src="/images/dev.webp" alt="" fill sizes="44px" className="object-cover object-top grayscale contrast-125 mix-blend-multiply" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-[var(--text-primary)]">Devanshu Verma</p>
        <p className="text-[14px] text-[var(--text-secondary)]">Sharing CSS and frontend tips weekly</p>
      </div>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-line btn-sm shrink-0"
      >
        <BsLinkedin size={13} />
        Follow
      </a>
    </div>
  );
}
