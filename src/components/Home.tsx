import type { CSSProperties } from "react";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import HeroBackdrop from "./HeroBackdrop";
import PortraitWindow from "./PortraitWindow";
import AskAIButton from "./browser/AskAIButton";

/** Stagger index for the CSS hero entrance (see .hero-in in globals.css). */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

const HomeComponent = () => {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[calc(100dvh_-_var(--chrome-h))] items-center px-5 pb-16 pt-8 lg:px-10 lg:pb-20"
    >
      <HeroBackdrop />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Copy */}
        <div className="lg:col-span-7">
          <p
            className="hero-in inline-flex items-center gap-2.5 rounded-lg border border-[var(--border)]
                       bg-[var(--bg-card)] px-3 py-1.5 text-[13px] text-[var(--text-secondary)]"
            style={step(0)}
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for full-time and freelance work
          </p>

          <h1
            className="hero-in mt-7 max-w-[15ch] text-balance text-[clamp(2.6rem,5.6vw,4.5rem)] font-semibold leading-[1.02]
                       tracking-[-0.04em] text-[var(--text-primary)]"
            style={step(1)}
          >
            <span className="sr-only">Devanshu Verma, frontend developer. </span>
            I build web apps that feel{" "}
            <span className="hero-underline text-[var(--accent)]">instant.</span>
          </h1>

          <p
            className="hero-in mt-6 max-w-[34rem] text-[17px] leading-relaxed text-[var(--text-secondary)] sm:text-lg"
            style={step(2)}
          >
            I&apos;m Devanshu, a frontend engineer who has spent 5+ years shipping
            production React, Next.js, Angular and Vue apps.
          </p>

          <div className="hero-in mt-9 flex flex-wrap items-center gap-3" style={step(3)}>
            <a
              href="#work"
              className="group inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--accent)] px-5
                         text-sm font-semibold text-[var(--on-accent)] transition-opacity duration-200
                         hover:opacity-90 active:scale-[0.98]"
            >
              See my work
              <ArrowRightIcon
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <AskAIButton
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[var(--border)]
                         bg-[var(--bg-card)] px-5 text-sm font-medium text-[var(--text-primary)]
                         transition-colors duration-200 hover:border-[var(--accent-line)] active:scale-[0.98]"
            >
              <SparklesIcon size={15} className="text-[var(--accent)]" />
              Ask my AI
            </AskAIButton>
          </div>
        </div>

        {/* Portrait */}
        <div className="lg:col-span-5">
          <PortraitWindow />
        </div>
      </div>
    </section>
  );
};

export default HomeComponent;
