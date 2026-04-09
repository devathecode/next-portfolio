"use client";

import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { BsLinkedin } from "react-icons/bs";

export default function LinkedInBadge() {
  return (
    <AnimateOnScroll direction="up" delay={0.18}>
      <div className="mt-8 flex items-center gap-3 p-3 pr-4 rounded-xl w-full
                      border border-gray-200 dark:border-white/[0.07]
                      bg-white/70 dark:bg-white/[0.03]
                      backdrop-blur-sm">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Image
            src="/images/dev.png"
            alt="Devanshu Verma"
            width={44}
            height={44}
            className="rounded-full object-cover ring-2 ring-yellow-600/30"
          />
          {/* LinkedIn dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center ring-2 ring-white dark:ring-gray-950">
            <BsLinkedin size={8} className="text-white" />
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
            Devanshu Verma
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
            Sharing CSS &amp; frontend tips weekly
          </p>
        </div>

        {/* Follow button */}
        <a
          href="https://www.linkedin.com/in/devthecoder/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                     bg-[#0a66c2] hover:bg-[#004182]
                     text-white text-xs font-semibold
                     transition-all duration-200
                     hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0a66c2]/30"
        >
          <BsLinkedin size={11} />
          Follow
        </a>
      </div>
    </AnimateOnScroll>
  );
}
