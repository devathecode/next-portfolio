"use client";

import { motion } from "framer-motion";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const imageFade = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.2,
    },
  },
};

const HomeComponent = () => {
  return (
    <div
      className="relative grid grid-cols-12 p-4 lg:gap-20 min-h-[calc(100vh-8vh)] items-center"
      id="home"
    >
      {/* Pulsing background glow */}
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-yellow-600/10 dark:bg-yellow-600/5 rounded-full blur-3xl pointer-events-none"
      />

      {/* Text column — staggered entrance */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="col-span-12 lg:col-span-7 my-auto place-self-center order-2 lg:order-1 z-10"
      >
        {/* Availability badge */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            Available for opportunities
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mt-1"
        >
          Hi <span className="animate-wiggle inline-flex">&#128075;</span>, I am{" "}
          <span className="text-yellow-600">Devanshu Verma</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-sm font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mt-3 mb-4"
        >
          Frontend Developer · React · Next.js · Angular · Vue.js
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-base text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed"
        >
          I turn ideas into polished, high-performance web experiences. With 4+
          years shipping production apps across fintech, e-commerce, and SaaS —
          I care deeply about both the code and the craft.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-4 mt-6"
        >
          <a
            href="/resume/Resume.pdf"
            download="Devanshu_Verma_Resume.pdf"
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium
               transition duration-300 ease-out border-2 border-yellow-600 rounded-md shadow-md group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-yellow-600 group-hover:translate-x-0 ease">
              <DownloadIcon size={18} />
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-yellow-600 transition-all duration-300 transform group-hover:translate-x-full ease">
              Download Resume
            </span>
            <span className="relative invisible">Download Resume</span>
          </a>

          <button
            onClick={() =>
              document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors duration-200 underline underline-offset-4"
          >
            See my work ↓
          </button>
        </motion.div>
      </motion.div>

      {/* Image column — fade + float */}
      <motion.div
        variants={imageFade}
        initial="hidden"
        animate="visible"
        className="col-span-12 lg:col-span-5 order-1 lg:order-2 place-self-center z-10"
      >
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Glow behind image */}
          <div className="absolute inset-0 rounded-full bg-yellow-600/20 dark:bg-yellow-600/10 blur-2xl scale-110" />
          <Image
            src="/images/dev.png"
            height={600}
            width={600}
            className="relative h-80 w-80 lg:h-96 lg:w-96 object-cover rounded-full ring-4 ring-yellow-600/40 dark:ring-yellow-600/30 bg-yellow-600/10 dark:bg-gray-800"
            alt="Devanshu Verma – Frontend Developer"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomeComponent;
