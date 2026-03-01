"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, MailCheckIcon } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="relative min-h-[calc(100vh-8vh)] flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient background glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]
                   bg-yellow-600/10 dark:bg-yellow-600/8 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative text-center max-w-lg z-10">
        {/* Animated icon container */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center mx-auto mb-6"
        >
          {/* Ripple rings */}
          <span className="absolute w-28 h-28 rounded-full bg-yellow-600/10 animate-ping" />
          <span className="absolute w-20 h-20 rounded-full bg-yellow-600/15" />

          {/* Icon circle */}
          <div className="relative w-20 h-20 rounded-full bg-yellow-600/20 border border-yellow-600/40 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <MailCheckIcon size={36} className="text-yellow-600" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3"
        >
          Message{" "}
          <span className="text-yellow-600">Received!</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
          className="h-0.5 w-24 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mx-auto mb-5 origin-left"
        />

        {/* Body text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8"
        >
          Thanks for reaching out — I&apos;ve got your message and will get
          back to you as soon as possible.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/#home"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md border-2 border-yellow-600
                       text-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors duration-200
                       font-medium text-sm group"
          >
            <ArrowLeftIcon
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
