"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, MailCheckIcon } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="relative min-h-[calc(100vh-8vh)] flex items-center justify-center p-6 overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[480px] h-[480px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "var(--accent-glow)" }}
      />

      <div className="relative text-center max-w-lg z-10">
        {/* Icon with ripple */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center mx-auto mb-8"
        >
          <span
            aria-hidden="true"
            className="absolute w-28 h-28 rounded-full animate-ping"
            style={{ background: "var(--accent-muted)" }}
          />
          <span
            aria-hidden="true"
            className="absolute w-20 h-20 rounded-full"
            style={{ background: "var(--accent-muted)" }}
          />
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center border"
            style={{
              background: "var(--accent-muted)",
              borderColor: "var(--accent)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <MailCheckIcon size={34} style={{ color: "var(--accent)" }} strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* Mono label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="section-label mb-4"
        >
          Message received
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-bold text-4xl md:text-5xl text-[var(--text-primary)] leading-tight mb-4"
        >
          Thanks for{" "}
          <span className="text-[var(--accent)] italic">reaching out</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
          className="h-px w-20 mx-auto mb-6 origin-left"
          style={{ background: "var(--accent)" }}
        />

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[var(--text-secondary)] text-base leading-relaxed mb-10"
        >
          I&apos;ve got your message and will get back to you as soon as
          possible — usually within 24 hours.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/#home"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       border border-[var(--accent)] text-[var(--accent)]
                       font-semibold text-sm
                       hover:bg-[var(--accent)] hover:text-black
                       transition-all duration-200 group"
          >
            <ArrowLeftIcon
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
