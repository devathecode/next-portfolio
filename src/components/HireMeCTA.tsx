"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";

export default function HireMeCTA() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });
  const rotateX = useTransform(springY, [-40, 40], [10, -10]);
  const rotateY = useTransform(springX, [-40, 40], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.6 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50"
    >
      {/* Outer container — extra padding to hold the dashed orbit ring */}
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center justify-center w-[88px] h-[88px] md:w-[120px] md:h-[120px]"
      >
        {/* ── Layer 1: deep glow bloom ── */}
        <motion.div
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.2, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-12px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--accent)" }}
        />

        {/* ── Layer 2: tight inner glow ── */}
        <motion.div
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="absolute inset-[8px] rounded-full blur-xl pointer-events-none"
          style={{ background: "var(--accent)" }}
        />

        {/* ── Layer 3: orbiting dashed ring ── */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: "1px dashed rgba(200,130,10,0.35)",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[6px] rounded-full pointer-events-none"
          style={{
            border: "1px solid rgba(200,130,10,0.15)",
          }}
        />

        {/* ── Layer 4: main gold sphere ── */}
        <motion.a
          href="#contact"
          style={{
            rotateX,
            rotateY,
            transformPerspective: 700,
            background:
              "radial-gradient(circle at 35% 30%, #fde68a 0%, #f59e0b 35%, #c8820a 65%, #7c3a00 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,200,60,0.25), 0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -3px 8px rgba(0,0,0,0.2)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="relative flex items-center justify-center w-[62px] h-[62px] md:w-[88px] md:h-[88px] rounded-full
                     cursor-pointer select-none no-underline overflow-hidden"
        >
          {/* Spinning text ring — ON the circle edge */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: hovered ? 4 : 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <path
                  id="cp"
                  d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                />
              </defs>
              <text
                fontSize="12"
                fontFamily="var(--font-mono)"
                fontWeight="900"
                letterSpacing="3.5"
                fill="rgba(0,0,0,0.55)"
              >
                <textPath href="#cp">HIRE ME · HIRE ME · HIRE ·</textPath>
              </text>
            </svg>
          </motion.div>

          {/* Sphere highlight — top-left glass glint */}
          <div
            className="absolute top-[7px] left-[10px] w-[20px] h-[11px] md:top-[10px] md:left-[14px] md:w-[28px] md:h-[16px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 100%)",
              filter: "blur(4px)",
            }}
          />

          {/* Bottom shadow inner */}
          <div
            className="absolute bottom-0 inset-x-0 h-1/3 rounded-b-full pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.18), transparent)",
            }}
          />

          {/* Center arrow */}
          <motion.span
            animate={
              hovered ? { x: 3, y: -3 } : { x: [0, 2, 0], y: [0, -2, 0] }
            }
            transition={
              hovered
                ? { type: "spring", stiffness: 400, damping: 15 }
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
            className="relative z-10"
          >
            <ArrowUpRight
              strokeWidth={2.5}
              className="w-[18px] h-[18px] md:w-6 md:h-6 text-black/80 drop-shadow-sm"
            />
          </motion.span>
        </motion.a>
      </div>
    </motion.div>
  );
}
