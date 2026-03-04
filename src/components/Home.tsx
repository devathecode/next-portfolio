"use client";

import { motion } from "framer-motion";
import { DownloadIcon, ArrowDownIcon } from "lucide-react";
import Image from "next/image";
import { BsLinkedin } from "react-icons/bs";

/* ── Animation presets ─────────────────────────────────────────── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const imageFade = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.25,
    },
  },
};

/* ── Component ─────────────────────────────────────────────────── */
const HomeComponent = () => {
  return (
    <section
      id="home"
      className="relative grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-8vh)] items-center px-4 lg:px-8 py-10"
    >
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(161 130 0 / 0.22) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/3 w-[500px] h-[500px]
                   bg-yellow-500/8 dark:bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"
      />

      {/* ── Text column ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="col-span-12 lg:col-span-6 z-10 order-2 lg:order-1 py-6 lg:py-0"
      >
        {/* Status badge */}
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30
                          bg-green-500/8 text-green-600 dark:text-green-400 text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Available for opportunities
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent max-w-[80px]" />
        </motion.div>

        {/* Role label */}
        <motion.p
          variants={fadeUp}
          className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-4"
        >
          Frontend Engineer
        </motion.p>

        {/* Name — the hero statement */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl lg:text-[4rem] font-black tracking-tight leading-[1.0] text-gray-900 dark:text-white mb-6"
        >
          Devanshu
          {/* <br /> */}
          <span className="text-yellow-600"> Verma.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed mb-3"
        >
          I build fast, accessible, and beautifully crafted web experiences — at
          the intersection of{" "}
          <span className="text-gray-900 dark:text-gray-200 font-medium">
            design and engineering.
          </span>
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-sm text-gray-400 dark:text-gray-600 mb-8"
        >
          React &middot; Next.js &middot; Angular &middot; Vue.js &middot;
          TypeScript
        </motion.p>

        {/* Yellow rule */}
        <motion.div
          variants={fadeUp}
          className="h-px w-16 bg-yellow-600/40 mb-8"
        />

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-3"
        >
          <a
            href="/resume/Resume.pdf"
            download="Devanshu_Verma_Resume.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500
                       text-black text-sm font-semibold transition-all duration-200
                       hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-600/25"
          >
            <DownloadIcon size={15} />
            Download Resume
          </a>

          <button
            onClick={() =>
              document
                .getElementById("work")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-800
                       text-sm font-medium text-gray-600 dark:text-gray-400
                       hover:border-yellow-600/50 hover:text-yellow-600
                       dark:hover:border-yellow-600/40 dark:hover:text-yellow-500
                       transition-all duration-200"
          >
            See my work
            <ArrowDownIcon size={14} />
          </button>

          <a
            href="https://www.linkedin.com/in/devthecoder/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-gray-200 dark:border-gray-800
                       text-gray-400 hover:text-blue-600 hover:border-blue-600/30
                       dark:hover:border-blue-600/30 transition-all duration-200"
            aria-label="LinkedIn"
          >
            <BsLinkedin size={16} />
          </a>
        </motion.div>
      </motion.div>

      {/* ── Image column ── */}
      <motion.div
        variants={imageFade}
        initial="hidden"
        animate="visible"
        className="col-span-12 lg:col-span-6 order-1 lg:order-2 flex flex-col items-center lg:items-end z-10"
      >
        <div className="relative">
          {/* Corner dot grids — desktop only */}
          <div className="hidden lg:grid absolute -top-5 -right-5 grid-cols-3 gap-2.5 pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-yellow-600/35" />
            ))}
          </div>
          <div className="hidden lg:grid absolute -bottom-5 -left-5 grid-cols-3 gap-2.5 pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-yellow-600/35" />
            ))}
          </div>

          {/* Floating badge — experience (desktop only, positioned outside image) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="hidden lg:flex absolute -left-8 bottom-12 z-20 items-center gap-2.5 px-3 py-2.5 rounded-xl
                       bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                       shadow-lg shadow-black/5 dark:shadow-black/40"
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-600/15 flex items-center justify-center text-yellow-600 font-black text-xs shrink-0">
              4+
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900 dark:text-white leading-none">Years exp.</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">Production apps</p>
            </div>
          </motion.div>

          {/* Floating badge — availability (desktop only) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="hidden lg:block absolute right-3 top-4 z-20 px-3.5 py-2.5 rounded-xl
                       bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                       shadow-lg shadow-black/5 dark:shadow-black/40"
          >
            <p className="text-[9px] font-medium text-gray-400 leading-none mb-1 uppercase tracking-wider">Open to</p>
            <p className="text-[11px] font-bold text-yellow-600 leading-none">Full-time · Freelance</p>
          </motion.div>

          {/* Main floating image */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-yellow-500/20 dark:bg-yellow-600/10 blur-2xl scale-105" />
            <div className="relative rounded-3xl overflow-hidden border border-yellow-600/20 dark:border-yellow-600/15
                            bg-gradient-to-br from-yellow-50 to-gray-100 dark:from-gray-900 dark:to-gray-800
                            shadow-2xl shadow-yellow-600/10">
              <Image
                src="/images/dev.png"
                height={500}
                width={500}
                className="h-56 w-56 sm:h-72 sm:w-72 lg:h-[380px] lg:w-[380px] object-cover"
                alt="Devanshu Verma – Frontend Developer"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Mobile-only stat chips — shown below the image instead of overlapping face */}
        <div className="flex lg:hidden items-center gap-3 mt-5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-900
                          border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-yellow-600/15 flex items-center justify-center text-yellow-600 font-black text-xs">
              4+
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900 dark:text-white leading-none">Years exp.</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">Production apps</p>
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-gray-900
                          border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-[9px] font-medium text-gray-400 leading-none mb-0.5 uppercase tracking-wider">Open to</p>
            <p className="text-[11px] font-bold text-yellow-600 leading-none">Full-time · Freelance</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeComponent;
