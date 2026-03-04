"use client";

import { FaReact, FaNodeJs, FaDocker, FaDatabase } from "react-icons/fa";
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
import { JSX, FC } from "react";
import AnimateOnScroll from "./AnimateOnScroll";

interface Technology {
  name: string;
  icon: JSX.Element;
}

const row1: Technology[] = [
  { name: "React", icon: <FaReact className="text-blue-500" size={20} /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-black dark:text-white" size={20} /> },
  { name: "TypeScript", icon: <SiTypescript className="text-blue-600" size={20} /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-sky-400" size={20} /> },
  { name: "Angular", icon: <SiAngular className="text-red-500" size={20} /> },
  { name: "GraphQL", icon: <SiGraphql className="text-pink-500" size={20} /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" size={20} /> },
  { name: "Vue.js", icon: <SiVuedotjs className="text-green-500" size={20} /> },
];

const row2: Technology[] = [
  { name: "Nuxt.js", icon: <SiNuxtdotjs className="text-green-400" size={20} /> },
  { name: "Docker", icon: <FaDocker className="text-blue-500" size={20} /> },
  { name: "Salesforce LWC", icon: <SiSalesforce className="text-blue-600" size={20} /> },
  { name: "Database", icon: <FaDatabase className="text-gray-500" size={20} /> },
  { name: "React", icon: <FaReact className="text-blue-500" size={20} /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-black dark:text-white" size={20} /> },
  { name: "TypeScript", icon: <SiTypescript className="text-blue-600" size={20} /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-sky-400" size={20} /> },
];

function TechPill({ tech }: { tech: Technology }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-gray-200 dark:border-white/[0.08]
                    bg-white dark:bg-white/[0.03] text-gray-700 dark:text-gray-300
                    text-sm font-medium whitespace-nowrap select-none shrink-0">
      {tech.icon}
      {tech.name}
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: Technology[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex gap-3 ${reverse ? "animate-[marquee-reverse_30s_linear_infinite]" : "animate-[marquee_30s_linear_infinite]"}`}
        style={{ width: "max-content" }}
      >
        {doubled.map((tech, i) => (
          <TechPill key={`${tech.name}-${i}`} tech={tech} />
        ))}
      </div>
    </div>
  );
}

const TechStack: FC = () => {
  return (
    <section className="mt-16 pt-14 border-t border-gray-200 dark:border-white/5">
      <AnimateOnScroll direction="up" className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
          Technologies I work with
        </p>
      </AnimateOnScroll>

      <div className="space-y-3 relative">
        {/* Fade masks */}
        <div className="absolute left-0 inset-y-0 w-24 z-10 bg-gradient-to-r from-gray-50 dark:from-[#0d0d0d] to-transparent pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-24 z-10 bg-gradient-to-l from-gray-50 dark:from-[#0d0d0d] to-transparent pointer-events-none" />

        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>
    </section>
  );
};

export default TechStack;
