import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import PaletteHint from "./PaletteHint";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/site";

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "CSS tips", href: "/css-tips" },
  { label: "Résumé", href: "/resume" },
];

const linkClass =
  "text-[16px] text-[var(--text-secondary)] underline decoration-transparent underline-offset-4 transition-colors duration-100 " +
  "hover:text-[var(--text-primary)] hover:decoration-[var(--cardinal)]";

/** The end card: one last call to action, the name set full width, and the credits. */
const Footer = () => {
  return (
    <footer data-act="End" data-field="ink" className="field-ink grain overflow-hidden px-5 lg:px-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-[var(--border)] py-16 md:py-20">
          <p className="t-card max-w-[16ch]">Have a role or a project for me?</p>
          <Link href="/#contact" className="btn btn-plate group">
            Start a conversation
            <ArrowRightIcon size={16} strokeWidth={2.2} className="transition-transform duration-100 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap pt-10 font-display text-[clamp(3rem,18.4vw,21rem)] uppercase leading-[0.8] text-[var(--cardinal)]"
        >
          Devanshu Verma
        </p>

        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="max-w-[40ch] text-[16px] leading-relaxed text-[var(--text-secondary)]">
              Frontend engineer building web apps with React, Next.js, Angular and Vue.
            </p>
            <PaletteHint className="mt-6" />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-6 md:ml-auto md:gap-20">
            <div>
              <p className="t-label text-[var(--text-muted)]">Site</p>
              <ul className="mt-4 space-y-2.5">
                {siteLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label text-[var(--text-muted)]">Connect</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="t-label flex flex-col gap-2 border-t border-[var(--border)] py-6 text-[var(--text-muted)] sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Devanshu Verma</p>
          <p>Designed and built by me</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
