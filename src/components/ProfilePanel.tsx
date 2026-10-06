import Image from "next/image";
import { DownloadIcon } from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { LINKEDIN_URL, RESUME_PDF, RESUME_PDF_NAME } from "@/lib/site";

const credits = [
  { role: "Based in", value: "Noida, India. Remote-friendly." },
  { role: "In production", value: "5+ years" },
  { role: "Shipped", value: "10+ apps" },
  { role: "Open to", value: "Full-time and freelance" },
];

/**
 * The profile card from About: an ink card pasted on the paper, the facts
 * set as credit lines (part on the left, name on the right) under a print
 * of the portrait.
 */
export default function ProfilePanel() {
  return (
    <div className="field-ink cut-b relative p-6 md:p-8 lg:ml-auto lg:max-w-md">
      <div className="flex items-end gap-5">
        <span className="cut-a relative h-24 w-20 shrink-0 overflow-hidden bg-[var(--cardinal)]">
          <Image
            src="/images/dev.webp"
            alt=""
            fill
            sizes="80px"
            className="object-cover object-top grayscale contrast-125 mix-blend-multiply"
          />
        </span>
        <div className="pb-1">
          <p className="font-display text-[2.4rem] uppercase leading-[0.88] text-[var(--text-primary)]">
            Devanshu
            <br />
            Verma
          </p>
          <p className="mt-2 text-[15px] text-[var(--accent)]">Frontend developer</p>
        </div>
      </div>

      <dl className="mt-8 border-t-2 border-[var(--text-primary)]">
        {credits.map(({ role, value }) => (
          <div key={role} className="grid grid-cols-[8.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-[var(--border)] py-3">
            <dt className="t-label text-[var(--text-muted)]">{role}</dt>
            <dd className="text-[15.5px] text-[var(--text-primary)]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex gap-2">
        <a href={RESUME_PDF} download={RESUME_PDF_NAME} className="btn btn-plate flex-1">
          <DownloadIcon size={15} />
          Download résumé
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="btn btn-line w-12 px-0"
        >
          <BsLinkedin size={15} />
        </a>
      </div>
    </div>
  );
}
