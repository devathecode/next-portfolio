"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  BriefcaseIcon,
  CodeXmlIcon,
  DownloadIcon,
  EyeIcon,
  HandshakeIcon,
  MapPinIcon,
  RocketIcon,
} from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { LINKEDIN_URL, RESUME_PDF, RESUME_PDF_NAME } from "@/lib/site";

const facts = [
  { Icon: MapPinIcon, text: "Noida, India. Remote-friendly." },
  { Icon: BriefcaseIcon, text: "5+ years in production" },
  { Icon: RocketIcon, text: "10+ apps shipped" },
  { Icon: HandshakeIcon, text: "Open to full-time and freelance" },
];

type View = "preview" | "source";

// Tiny token helpers for the source view
const K = ({ children }: { children: ReactNode }) => <span className="text-[var(--text-primary)]">{children}</span>;
const S = ({ children }: { children: ReactNode }) => <span className="text-[var(--accent)]">&quot;{children}&quot;</span>;
const P = ({ children }: { children: ReactNode }) => <span className="text-[var(--text-muted)]">{children}</span>;
const list = (items: string[]) => (
  <>
    <P>[</P>
    {items.map((item, i) => (
      <span key={item}>
        <S>{item}</S>
        {i < items.length - 1 && <P>, </P>}
      </span>
    ))}
    <P>]</P>
  </>
);

/**
 * The profile card from About, with a "view source" toggle that shows the
 * same facts as the object a developer would write.
 */
export default function ProfilePanel() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<View>("preview");

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-card)]
                 lg:ml-auto lg:max-w-md"
    >
      <div className="flex h-11 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-secondary)] pl-4 pr-1.5">
        <p className="truncate font-mono text-xs text-[var(--text-muted)]">
          {view === "source" ? "view-source:profile.ts" : "profile"}
        </p>
        <div role="tablist" aria-label="Profile view" className="flex gap-0.5">
          {(
            [
              { id: "preview", label: "Preview", Icon: EyeIcon },
              { id: "source", label: "Source", Icon: CodeXmlIcon },
            ] as const
          ).map(({ id, label, Icon }) => {
            const active = view === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`profile-${id}`}
                onClick={() => setView(id)}
                className={`relative flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors ${
                  active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="profile-view"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 36 }}
                    className="absolute inset-0 rounded-lg border border-[var(--border)] bg-[var(--bg-card)]"
                  />
                )}
                <Icon size={13} className="relative" />
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Both views share one grid cell, so switching never changes the height */}
      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
        <div
          id="profile-preview"
          role="tabpanel"
          aria-hidden={view !== "preview"}
          className={`p-6 transition-opacity duration-200 ${view === "preview" ? "" : "invisible opacity-0"}`}
        >
          <div className="flex items-center gap-4">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <Image src="/images/LInkedin_heashot.png" alt="" fill sizes="56px" className="object-cover" />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Devanshu Verma</p>
              <p className="text-sm text-[var(--accent)]">Frontend Developer</p>
            </div>
          </div>

          <ul className="mt-7 space-y-3.5">
            {facts.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[14.5px] text-[var(--text-secondary)]">
                <Icon size={16} strokeWidth={1.75} className="shrink-0 text-[var(--text-muted)]" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex gap-2 border-t border-[var(--border)] pt-5">
            <a
              href={RESUME_PDF}
              download={RESUME_PDF_NAME}
              tabIndex={view === "preview" ? undefined : -1}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border
                         border-[var(--border)] bg-[var(--bg-secondary)] px-4 text-sm font-medium
                         text-[var(--text-primary)] transition-colors duration-200
                         hover:border-[var(--accent-line)] active:scale-[0.98]"
            >
              <DownloadIcon size={15} />
              Download résumé
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              tabIndex={view === "preview" ? undefined : -1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border
                         border-[var(--border)] text-[var(--text-secondary)] transition-colors duration-200
                         hover:border-[var(--accent-line)] hover:text-[var(--text-primary)] active:scale-[0.98]"
            >
              <BsLinkedin size={15} />
            </a>
          </div>
        </div>

        <div
          id="profile-source"
          role="tabpanel"
          aria-hidden={view !== "source"}
          className={`flex overflow-x-auto p-6 transition-opacity duration-200 ${view === "source" ? "" : "invisible opacity-0"}`}
        >
          <pre className="font-mono text-[12.5px] leading-7 text-[var(--text-secondary)]">
            <P>const</P> <K>devanshu</K> <P>=</P> <P>{"{"}</P>
            {"\n  "}role<P>:</P> <S>Frontend developer</S>
            <P>,</P>
            {"\n  "}basedIn<P>:</P> <S>Noida, India</S>
            <P>,</P> <span className="italic text-[var(--text-muted)]">{"// remote-friendly"}</span>
            {"\n  "}experience<P>:</P> <S>5+ years</S>
            <P>,</P>
            {"\n  "}shipped<P>:</P> <S>10+ apps</S>
            <P>,</P>
            {"\n  "}stack<P>:</P> {list(["React", "Next.js", "Angular", "Vue"])}
            <P>,</P>
            {"\n  "}openTo<P>:</P> {list(["full-time", "freelance"])}
            <P>,</P>
            {"\n"}
            <P>{"};"}</P>
            {"\n\n"}
            <P>export default</P> <K>devanshu</K>
            <P>;</P>
          </pre>
        </div>
      </div>
    </div>
  );
}
