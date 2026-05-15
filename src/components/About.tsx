"use client";

import TechStack from "./TechStack";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import {
  ArrowRightIcon,
  CodeIcon,
  LayersIcon,
  ZapIcon,
  UsersIcon,
  MapPinIcon,
  SparklesIcon,
  BrainIcon,
  BriefcaseIcon,
} from "lucide-react";

const stats = [
  { value: "5+", label: "Years\nexp." },
  { value: "10+", label: "Apps\nshipped" },
  { value: "3", label: "Major\nframeworks" },
];

const tags = [
  { icon: <LayersIcon size={11} />, label: "Component Architecture" },
  { icon: <ZapIcon size={11} />, label: "Performance" },
  { icon: <CodeIcon size={11} />, label: "Design Systems" },
  { icon: <UsersIcon size={11} />, label: "Cross-team Collab" },
  { icon: <SparklesIcon size={11} />, label: "UI Animation" },
  { icon: <BrainIcon size={11} />, label: "TypeScript" },
];

const spring = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: {
    duration: 0.7,
    delay,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
});

const AboutComponent = () => {
  return (
    <section
      id="about"
      className="relative py-28 px-5 lg:px-10 overflow-hidden"
    >
      {/* Ambient orbs */}
      <div
        aria-hidden
        className="absolute top-10 right-1/3 w-[560px] h-[560px]
                                   bg-[var(--accent)]/5 rounded-full blur-[150px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-1/4 left-0 w-[400px] h-[400px]
                                   bg-purple-500/4 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto">
        {/* ── Section label ── */}
        <motion.div {...spring(0)} className="mb-14 flex items-center gap-4">
          <p className="section-label">Who I am</p>
          <div className="h-px w-12 bg-[var(--border)]" />
        </motion.div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* ═══ LEFT COLUMN: identity card + stats ═══ */}
          <div className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
            {/* Identity card */}
            <motion.div
              {...spring(0.1)}
              className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6
                         flex flex-col gap-5"
            >
              {/* Available badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 self-start
                              rounded-full bg-[var(--bg-secondary)]
                              border border-[var(--border)] text-[11px] font-mono
                              text-[var(--text-secondary)]"
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full
                                   bg-emerald-400 opacity-75"
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Available for work
              </div>

              {/* Name + role */}
              <div>
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.18em]
                              text-[var(--text-muted)] mb-2"
                >
                  Who I am
                </p>
                <p
                  className="font-display font-bold text-[1.9rem] leading-tight
                              text-[var(--text-primary)]"
                >
                  Devanshu
                  <br />
                  Verma
                </p>
                <p className="text-[var(--accent)] font-medium text-sm mt-1.5">
                  Frontend Developer
                </p>
              </div>

              {/* Key facts */}
              <div className="space-y-2.5">
                {[
                  {
                    icon: <MapPinIcon size={12} />,
                    text: "Noida, India · Remote-friendly",
                  },
                  {
                    icon: <BriefcaseIcon size={12} />,
                    text: "5+ years in production",
                  },
                  {
                    icon: <CodeIcon size={12} />,
                    text: "React · Next.js · Angular · Vue",
                  },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)]
                                    flex items-center justify-center shrink-0
                                    text-[var(--accent)]"
                    >
                      {icon}
                    </div>
                    <span className="text-[12.5px] text-[var(--text-secondary)]">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                className="h-px bg-gradient-to-r from-[var(--accent)]/30
                              via-[var(--accent)]/10 to-transparent"
              />

              {/* Open to */}
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[10px] uppercase tracking-wider
                                 text-[var(--text-muted)]"
                >
                  Open to
                </span>
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  Full-time · Freelance
                </span>
              </div>
            </motion.div>

            {/* Stat tiles */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.82 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.55,
                    delay: 0.22 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]
                             p-4 text-center cursor-default"
                >
                  <p
                    className="font-display font-bold text-[1.6rem] leading-none
                                text-[var(--accent)] mb-1.5"
                  >
                    {s.value}
                  </p>
                  <p
                    className="font-mono text-[9px] uppercase tracking-wider
                                text-[var(--text-muted)] leading-tight whitespace-pre-line"
                  >
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT COLUMN: headline + cards ═══ */}
          <div className="lg:col-span-8 flex flex-col gap-4 order-1 lg:order-2">
            {/* Headline */}
            <motion.div {...spring(0.15)}>
              <h2
                className="font-display font-bold leading-[1.06] tracking-tight
                             text-[clamp(2.4rem,5.2vw,4.2rem)] text-[var(--text-primary)]"
              >
                Building for the web, <br className="hidden sm:block" />
                <span className="text-[var(--accent)] italic">
                  obsessing
                </span>{" "}
                over the craft.
              </h2>
            </motion.div>

            {/* Bio + expertise row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {/* Bio card */}
              <motion.div
                {...spring(0.2)}
                className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]
                           p-6 flex flex-col justify-between min-h-[220px]"
              >
                <div className="space-y-3.5 text-[var(--text-secondary)] leading-[1.75] text-[14.5px]">
                  <p>
                    I&apos;m a frontend developer sitting at the intersection of
                    design and engineering — turning complex requirements into
                    clean, fast, intuitive interfaces.
                  </p>
                  <p>
                    With{" "}
                    <span className="text-[var(--text-primary)] font-semibold">
                      5+ years of production experience
                    </span>{" "}
                    across{" "}
                    <span className="text-[var(--accent)] font-medium">
                      React, Next.js, Angular &amp; Vue
                    </span>
                    , I care deeply about code that scales.
                  </p>
                </div>

                <a
                  href="#work"
                  className="inline-flex items-center gap-2 mt-5 self-start text-[13px]
                             font-medium text-[var(--accent)] hover:opacity-75
                             transition-opacity group"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("work")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  See my work
                  <ArrowRightIcon
                    size={13}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </motion.div>

              {/* Expertise card */}
              <motion.div
                {...spring(0.25)}
                className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]
                           p-6 flex flex-col min-h-[220px]"
              >
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.18em]
                              text-[var(--text-muted)] mb-4"
                >
                  Core expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t, i) => (
                    <motion.span
                      key={t.label}
                      initial={{ opacity: 0, scale: 0.75 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 border border-[var(--border)] bg-[var(--bg-secondary)]
                                 text-[var(--text-secondary)] text-[11.5px] font-medium"
                    >
                      <span className="text-[var(--accent)]">{t.icon}</span>
                      {t.label}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Code card */}
            <motion.div
              {...spring(0.3)}
              className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]
                         p-5 font-mono text-xs leading-relaxed overflow-hidden"
            >
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-[10px] text-[var(--text-muted)]">
                  devanshu.ts
                </span>
              </div>
              <div className="space-y-0.5">
                <p>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-sky-400">me</span>{" "}
                  <span className="text-[var(--text-muted)]">=</span>{" "}
                  <span className="text-[var(--text-secondary)]">{"{"}</span>
                </p>
                <p className="pl-5">
                  <span className="text-[var(--text-muted)]">name:</span>{" "}
                  <span className="text-emerald-400">
                    &quot;Devanshu Verma&quot;
                  </span>
                  <span className="text-[var(--text-muted)]">,</span>
                </p>
                <p className="pl-5">
                  <span className="text-[var(--text-muted)]">role:</span>{" "}
                  <span className="text-emerald-400">
                    &quot;Frontend Developer&quot;
                  </span>
                  <span className="text-[var(--text-muted)]">,</span>
                </p>
                <p className="pl-5">
                  <span className="text-[var(--text-muted)]">focus:</span>{" "}
                  <span className="text-[var(--accent)]">
                    [&quot;UI/UX&quot;, &quot;Performance&quot;,
                    &quot;Scalability&quot;]
                  </span>
                  <span className="text-[var(--text-muted)]">,</span>
                </p>
                <p className="pl-5">
                  <span className="text-[var(--text-muted)]">available:</span>{" "}
                  <span className="text-emerald-400">true</span>
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">{"}"}</span>
                  <span className="text-[var(--text-muted)] ml-0.5 animate-pulse">
                    _
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tech stack marquee */}
        <TechStack />
      </div>
    </section>
  );
};

export default AboutComponent;
