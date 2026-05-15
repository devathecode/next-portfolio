"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDownIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BsLinkedin } from "react-icons/bs";
import Header from "./Header";

/* ── Cursor glow — follows mouse on hero only ───────────────── */
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div ref={glowRef} aria-hidden="true" id="cursor-glow" />;
}

/* ── Animation presets ──────────────────────────────────────── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const imageFade = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.15,
    },
  },
};

/* ── Component ──────────────────────────────────────────────── */
const HomeComponent = () => {
  return (
    <section
      id="home"
      className="relative flex items-center min-h-[calc(100vh)]
                 px-5 lg:px-10 py-12 overflow-hidden"
    >
      <CursorGlow />

      {/* Ambient orb — top-left */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none
                   bg-violet-500/5 dark:bg-violet-500/6"
      />

      {/* ── Background image layer ── */}
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
        {/* Amber ambient orb */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none
                     bg-amber-600/8 dark:bg-amber-500/10"
        />

        {/* Amber halo behind portrait — dark mode only (blur fogs portrait in light mode) */}
        <div
          className="hidden dark:block absolute right-0 inset-y-0 w-1/2 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 75% at 65% 55%, rgba(202,138,4,0.28) 0%, rgba(160,80,0,0.10) 48%, transparent 72%)",
            filter: "blur(30px)",
          }}
        />

        {/* Portrait — full bleed */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={imageFade}
          className="absolute inset-0 lg:left-[60%] pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 95%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 95%)",
          }}
        >
          <Image
            src="/images/dev5.png"
            fill
            className="object-cover object-center lg:object-right"
            alt="Devanshu Verma – Frontend Developer"
            priority
          />
        </motion.div>

        {/* Left-to-right overlay — text readability; clears at 62% so portrait (starts at 60%) shows cleanly */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--bg-primary)_50%,transparent_62%)]" />

        {/* Mobile: stronger overlay */}
        <div className="absolute inset-0 lg:hidden bg-[var(--bg-primary)]/72" />
      </div>

      {/* ── Text column ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-3xl py-8 lg:py-0"
      >
        {/* Status badge */}
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                       border border-green-500/30 bg-green-500/8
                       text-green-600 dark:text-green-400 text-xs font-medium font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            available for opportunities
          </div>
        </motion.div>

        {/* Mono label */}
        <motion.p variants={fadeUp} className="section-label mb-5">
          Frontend Engineer · Noida, India
        </motion.p>

        {/* ── Main heading — editorial serif ── */}
        <motion.h1
          variants={fadeUp}
          className="font-display font-bold leading-[1.0] tracking-tight mb-6
                     text-[clamp(3rem,7vw,5.5rem)] text-[var(--text-primary)]"
        >
          Crafting the <span className="text-[var(--accent)] italic">web</span>
          <br />
          one pixel
          <br />
          at a time.
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg text-[var(--text-secondary)] max-w-4xl leading-relaxed mb-2"
        >
          I&apos;m{" "}
          <span className="text-[var(--text-primary)] font-semibold">
            Devanshu Verma
          </span>{" "}
          — I build fast, accessible, and beautifully crafted web experiences at
          the intersection of design and engineering.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="font-mono text-xs text-[var(--text-muted)] mb-8"
        >
          React &nbsp;·&nbsp; Next.js &nbsp;·&nbsp; Angular &nbsp;·&nbsp; Vue.js
          &nbsp;·&nbsp; TypeScript
        </motion.p>

        {/* Accent rule */}
        <motion.div
          variants={fadeUp}
          className="h-px w-14 bg-[var(--accent)]/50 mb-8"
        />

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-3"
        >
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-[var(--accent)] text-black text-sm font-semibold
                       hover:opacity-90 hover:-translate-y-0.5
                       transition-all duration-200
                       shadow-[0_0_24px_var(--accent-glow)]"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/50 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black/60" />
            </span>
            Chat with my AI version
            <Sparkles className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() =>
              document
                .getElementById("work")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       border border-[var(--border)] text-sm font-medium
                       text-[var(--text-secondary)]
                       hover:border-[var(--accent)]/50 hover:text-[var(--accent)]
                       transition-all duration-200"
          >
            See my work
            <ArrowDownIcon size={13} />
          </button>

          <a
            href="https://www.linkedin.com/in/devthecoder/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full
                       border border-[var(--border)] text-[var(--text-muted)]
                       hover:text-blue-500 hover:border-blue-500/30
                       transition-all duration-200"
          >
            <BsLinkedin size={15} />
          </a>
        </motion.div>

        {/* Mobile stat chips */}
        <motion.div
          variants={fadeUp}
          className="flex lg:hidden items-center gap-3 mt-8"
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl
                          bg-[var(--bg-card)]/80 backdrop-blur-sm border border-[var(--border)] shadow-[var(--shadow-card)]"
          >
            <div
              className="w-7 h-7 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center
                            text-[var(--accent)] font-black text-xs font-mono"
            >
              5+
            </div>
            <div>
              <p className="text-[11px] font-bold text-[var(--text-primary)] leading-none">
                Years exp.
              </p>
              <p className="text-[10px] text-[var(--text-muted)] leading-none mt-0.5">
                Production apps
              </p>
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[var(--bg-card)]/80 backdrop-blur-sm border border-[var(--border)] shadow-[var(--shadow-card)]">
            <p className="font-mono text-[9px] font-medium text-[var(--text-muted)] leading-none mb-0.5 uppercase tracking-wider">
              Open to
            </p>
            <p className="text-[11px] font-bold text-[var(--accent)] leading-none">
              Full-time · Freelance
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Floating badges — desktop only, absolutely positioned ── */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="hidden lg:flex absolute right-[18%] bottom-[22%] z-20 items-center gap-2.5
                   px-3.5 py-2.5 rounded-2xl
                   bg-[var(--bg-card)]/80 backdrop-blur-md
                   border border-[var(--border)]
                   shadow-[var(--shadow-card)]"
      >
        <div
          className="w-9 h-9 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center
                        text-[var(--accent)] font-black text-sm shrink-0 font-mono"
        >
          5+
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--text-primary)] leading-none">
            Years exp.
          </p>
          <p className="text-[10px] text-[var(--text-muted)] leading-none mt-0.5">
            Production apps
          </p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="hidden lg:block absolute right-[10%] top-[18%] z-20 px-3.5 py-2.5 rounded-2xl
                   bg-[var(--bg-card)]/80 backdrop-blur-md
                   border border-[var(--border)]
                   shadow-[var(--shadow-card)]"
      >
        <p className="font-mono text-[9px] font-medium text-[var(--text-muted)] leading-none mb-1 uppercase tracking-wider">
          Open to
        </p>
        <p className="text-xs font-bold text-[var(--accent)] leading-none">
          Full-time · Freelance
        </p>
      </motion.div>
    </section>
  );
};

export default HomeComponent;
