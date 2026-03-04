import Image from "next/image";
import TechStack from "./TechStack";
import AnimateOnScroll from "./AnimateOnScroll";
import { ArrowRightIcon, CodeIcon, LayersIcon, ZapIcon, UsersIcon, MapPinIcon } from "lucide-react";

const stats = [
  { value: "4+", label: "Years exp." },
  { value: "10+", label: "Apps shipped" },
  { value: "3", label: "Frameworks" },
];

const expertise = [
  { icon: <LayersIcon size={14} />, label: "Component Architecture" },
  { icon: <ZapIcon size={14} />, label: "Performance Optimisation" },
  { icon: <CodeIcon size={14} />, label: "Design Systems" },
  { icon: <UsersIcon size={14} />, label: "Cross-team Collaboration" },
];

const AboutComponent = () => {
  return (
    <section id="about" className="py-16 px-4 overflow-hidden relative">
      <div className="max-w-6xl mx-auto">

        {/* Section heading */}
        <AnimateOnScroll direction="up" className="mb-12">
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            About Me
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800" />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-20 items-start">

          {/* ── Left column ── */}
          <AnimateOnScroll
            direction="fade"
            delay={0.1}
            className="md:col-span-5 order-2 md:order-1"
          >
            {/* Image card */}
            <div className="rounded-2xl overflow-hidden border border-yellow-600/20 bg-white dark:bg-gray-800">
              <div className="relative w-full h-52 sm:h-64 md:h-80">
                <Image
                  src="/images/main.gif"
                  fill
                  className="object-contain"
                  alt="Developer illustration"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-2 sm:p-4 text-center min-w-0"
                >
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600">{s.value}</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-500 mt-0.5 leading-tight">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          {/* ── Right column ── */}
          <AnimateOnScroll
            direction="up"
            delay={0.15}
            className="md:col-span-7 flex flex-col justify-center order-1 md:order-2"
          >
            {/* Location badge */}
            <div className="inline-flex items-center gap-2 self-start mb-6 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 text-xs font-medium">
              <MapPinIcon size={12} className="text-yellow-600" />
              Noida, India &middot; Remote-friendly
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug tracking-tight mb-5">
              Building for the web,{" "}
              <span className="text-yellow-600">obsessing</span>{" "}
              over the craft.
            </h2>

            {/* Bio */}
            <div className="space-y-3 text-gray-500 dark:text-gray-400 leading-7 text-[15px]">
              <p>
                I&apos;m a frontend developer who sits at the intersection of
                design and engineering — turning complex requirements into clean,
                fast, and intuitive interfaces. My work spans fintech,
                e-commerce, and SaaS.
              </p>
              <p>
                With{" "}
                <span className="text-gray-900 dark:text-white font-medium">
                  4+ years of production experience
                </span>{" "}
                across{" "}
                <span className="text-yellow-600 font-medium">
                  React, Next.js, Angular, and Vue.js
                </span>
                , I care deeply about code that scales and interfaces that users
                actually enjoy using.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gray-200 dark:bg-white/5 my-7" />

            {/* Expertise grid */}
            <div className="grid grid-cols-2 gap-3">
              {expertise.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-yellow-600/10 text-yellow-600 shrink-0">
                    {item.icon}
                  </span>
                  {item.label}
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#work"
              className="inline-flex items-center gap-2 self-start mt-8 text-sm font-medium text-yellow-600 hover:text-yellow-500 transition-colors group"
            >
              See my work
              <ArrowRightIcon
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </AnimateOnScroll>
        </div>

        {/* Tech stack */}
        <TechStack />
      </div>
    </section>
  );
};

export default AboutComponent;
