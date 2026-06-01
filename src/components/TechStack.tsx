"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiAngular,
  SiDocker,
  SiGraphql,
  SiNextdotjs,
  SiNodedotjs,
  SiNuxtdotjs,
  SiReact,
  SiSalesforce,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";

const STACK: { name: string; role: string; Icon: IconType; color: string }[] = [
  { name: "React", role: "UI library", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", role: "Framework", Icon: SiNextdotjs, color: "var(--text-primary)" },
  { name: "TypeScript", role: "Language", Icon: SiTypescript, color: "#3178C6" },
  { name: "Angular", role: "Framework", Icon: SiAngular, color: "#DD0031" },
  { name: "Vue.js", role: "Framework", Icon: SiVuedotjs, color: "#42B883" },
  { name: "Nuxt", role: "Framework", Icon: SiNuxtdotjs, color: "#00DC82" },
  { name: "Tailwind CSS", role: "Styling", Icon: SiTailwindcss, color: "#38BDF8" },
  { name: "GraphQL", role: "Data layer", Icon: SiGraphql, color: "#E10098" },
  { name: "Node.js", role: "Runtime", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Docker", role: "Tooling", Icon: SiDocker, color: "#2496ED" },
  { name: "Salesforce LWC", role: "Platform", Icon: SiSalesforce, color: "#00A1E0" },
];

/* Dock entrance: icons pop in one after another */
const dockVariants = { hidden: {}, shown: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.85 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 24 } },
} as const;

/* Dock geometry, in px */
const BASE = 52;
const PEAK = 80;
const REACH = 150;

/** Magnification only makes sense with a real hover-capable pointer. */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return fine;
}

export default function TechStack() {
  const mouseX = useMotionValue(Infinity);
  const reduce = useReducedMotion();
  const finePointer = useFinePointer();
  const still = !!reduce || !finePointer;

  return (
    <div className="mt-24 md:mt-32">
      <h3 className="text-center text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] md:text-2xl">
        The stack I ship with
      </h3>

      <div className="mt-8 flex justify-center md:mt-14">
        <motion.ul
          aria-label="Technologies"
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, margin: "-60px" }}
          variants={dockVariants}
          onPointerMove={(e) => {
            if (!still && e.pointerType === "mouse") mouseX.set(e.clientX);
          }}
          onPointerLeave={() => mouseX.set(Infinity)}
          className="flex max-w-full flex-wrap items-end justify-center gap-2 rounded-2xl border border-[var(--border)]
                     bg-[var(--bg-card)] p-3 shadow-[var(--shadow-card)]
                     md:h-[76px] md:flex-nowrap"
        >
          {STACK.map((item) => (
            <DockItem key={item.name} item={item} mouseX={mouseX} still={still} />
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

function DockItem({
  item,
  mouseX,
  still,
}: {
  item: (typeof STACK)[number];
  mouseX: MotionValue<number>;
  still: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);

  // Distance from the pointer to this icon's centre drives its size
  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box || !Number.isFinite(x)) return REACH;
    return x - (box.left + box.width / 2);
  });
  const target = useTransform(distance, [-REACH, 0, REACH], [BASE, PEAK, BASE]);
  const size = useSpring(target, { mass: 0.1, stiffness: 180, damping: 14 });

  return (
    <motion.li
      ref={ref}
      tabIndex={0}
      variants={itemVariants}
      style={
        (still
          ? { "--brand": item.color }
          : { width: size, height: size, "--brand": item.color }) as unknown as CSSProperties
      }
      className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)]
                 md:h-[52px] md:w-[52px]
                 bg-[var(--bg-secondary)] text-[var(--text-secondary)] outline-none
                 focus-visible:border-[var(--accent)]"
    >
      <item.Icon
        aria-hidden="true"
        className="h-[46%] w-[46%] transition-colors duration-200 group-hover:text-[var(--brand)] group-focus:text-[var(--brand)]"
      />
      <span className="sr-only">
        {item.name}, {item.role}
      </span>

      {/* Tooltip */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2.5 -translate-x-1/2 whitespace-nowrap
                   rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1 text-xs
                   opacity-0 shadow-[var(--shadow-card)] transition-opacity duration-150
                   group-hover:opacity-100 group-focus:opacity-100"
      >
        <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
        <span className="ml-1.5 text-[var(--text-muted)]">{item.role}</span>
      </span>
    </motion.li>
  );
}
