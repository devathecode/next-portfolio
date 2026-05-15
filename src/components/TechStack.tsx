"use client";

import { motion } from "framer-motion";
import { CSSProperties, FC } from "react";
import { FaReact, FaNodeJs, FaDocker } from "react-icons/fa";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiGraphql,
  SiTypescript,
  SiAngular,
  SiVuedotjs,
  SiNuxtdotjs,
  SiSalesforce,
} from "react-icons/si";

type Icon = React.FC<{ size?: number }>;

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const primary = [
  {
    name: "React",
    category: "UI Library",
    Icon: FaReact as Icon,
    iconColor: "#61DAFB",
    glowBg: "rgba(97,218,251,0.07)",
    desc: "Component architecture & reactive state",
  },
  {
    name: "Next.js",
    category: "Framework",
    Icon: SiNextdotjs as Icon,
    iconColor: "var(--text-primary)" as string,
    glowBg: "rgba(128,128,128,0.05)",
    desc: "Full-stack apps & server rendering",
  },
  {
    name: "TypeScript",
    category: "Language",
    Icon: SiTypescript as Icon,
    iconColor: "#3178C6",
    glowBg: "rgba(49,120,198,0.07)",
    desc: "Type safety & developer tooling",
  },
  {
    name: "Angular",
    category: "Framework",
    Icon: SiAngular as Icon,
    iconColor: "#DD0031",
    glowBg: "rgba(221,0,49,0.07)",
    desc: "Enterprise SPA development",
  },
];

const secondary = [
  { name: "Vue.js",         Icon: SiVuedotjs as Icon,    color: "#42B883" },
  { name: "Nuxt.js",        Icon: SiNuxtdotjs as Icon,   color: "#00DC82" },
  { name: "Tailwind CSS",   Icon: SiTailwindcss as Icon, color: "#38BDF8" },
  { name: "GraphQL",        Icon: SiGraphql as Icon,     color: "#E10098" },
  { name: "Node.js",        Icon: FaNodeJs as Icon,      color: "#68A063" },
  { name: "Docker",         Icon: FaDocker as Icon,      color: "#2496ED" },
  { name: "Salesforce LWC", Icon: SiSalesforce as Icon,  color: "#00A1E0" },
];

function PrimaryCard({ tech, i }: { tech: (typeof primary)[0]; i: number }) {
  const accentLine =
    tech.iconColor === "var(--text-primary)" ? "var(--accent)" : tech.iconColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: i * 0.08, ease }}
      whileHover="hover"
      className="relative rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]
                 p-5 flex flex-col gap-4 overflow-hidden cursor-default"
    >
      {/* Radial glow on hover */}
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${tech.glowBg} 0%, transparent 65%)`,
        }}
      />

      {/* Icon + category */}
      <div className="flex items-start justify-between relative">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: tech.glowBg, color: tech.iconColor } as CSSProperties}
        >
          <tech.Icon size={26} />
        </div>
        <span
          className="font-mono text-[9px] uppercase tracking-[0.15em]
                     text-[var(--text-muted)] border border-[var(--border)]
                     rounded-full px-2.5 py-1"
        >
          {tech.category}
        </span>
      </div>

      {/* Name + desc */}
      <div className="relative">
        <p className="font-display font-bold text-xl text-[var(--text-primary)] leading-none mb-1.5">
          {tech.name}
        </p>
        <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
          {tech.desc}
        </p>
      </div>

      {/* Animated bottom border */}
      <motion.div
        variants={{ hover: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.35 }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
        style={{ background: accentLine }}
      />
    </motion.div>
  );
}

function SecondaryPill({ tech }: { tech: (typeof secondary)[0] }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-2xl
                 border border-[var(--border)] bg-[var(--bg-card)]
                 whitespace-nowrap select-none shrink-0"
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${tech.color}18`, color: tech.color } as CSSProperties}
      >
        <tech.Icon size={15} />
      </div>
      <span className="font-mono text-[11px] text-[var(--text-secondary)]">
        {tech.name}
      </span>
    </div>
  );
}

const TechStack: FC = () => {
  const doubled = [...secondary, ...secondary];

  return (
    <section className="mt-20 pt-14 border-t border-[var(--border)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="flex items-center gap-4 mb-10"
      >
        <p className="section-label">Technologies I work with</p>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </motion.div>

      {/* Featured tech cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {primary.map((tech, i) => (
          <PrimaryCard key={tech.name} tech={tech} i={i} />
        ))}
      </div>

      {/* Secondary marquee */}
      <div className="relative overflow-hidden">
        <div
          className="absolute left-0 inset-y-0 w-20 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, var(--bg-primary), transparent)",
          }}
        />
        <div
          className="absolute right-0 inset-y-0 w-20 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, var(--bg-primary), transparent)",
          }}
        />
        <div
          className="flex gap-2.5 animate-[marquee_35s_linear_infinite]"
          style={{ width: "max-content" }}
        >
          {doubled.map((tech, i) => (
            <SecondaryPill key={`${tech.name}-${i}`} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
