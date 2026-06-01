import Link from "next/link";
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
  "text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-5 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 py-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
            Devanshu Verma
          </p>
          <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-[var(--text-secondary)]">
            Frontend engineer building web apps with React, Next.js, Angular and Vue.
          </p>
          <PaletteHint className="mt-6" />
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-6 md:ml-auto md:gap-16">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">Site</p>
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
            <p className="text-xs font-medium text-[var(--text-muted)]">Connect</p>
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

      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-[var(--border)] py-6 text-xs text-[var(--text-muted)] sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Devanshu Verma</p>
        <p>Designed and built by me.</p>
      </div>
    </footer>
  );
};

export default Footer;
