"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { HeadphonesIcon, HistoryIcon, MinusIcon, PauseIcon, PlayIcon, PlusIcon, SquareIcon } from "lucide-react";
import { useSite } from "@/components/site/context";
import { READ_AT, saveReading, useReading } from "@/lib/reading";

const SIZES = [0.9, 1, 1.1, 1.22];
const SIZE_KEY = "reader-size";
/** Where in the viewport the "reading line" sits, as a share of its height. */
const LINE = 0.3;
/** Blocks read aloud, in document order. Code is skipped. */
const SPEAKABLE = ":scope > p, :scope > h2, :scope > h3, :scope > blockquote, :scope > ul > li, :scope > ol > li";

type Speech = "idle" | "playing" | "paused";

function articleGeometry(el: HTMLElement) {
  const top = el.getBoundingClientRect().top + window.scrollY;
  return { top, height: Math.max(1, el.offsetHeight) };
}

/**
 * Reading mode for a post, like the reader tools in a browser: text size,
 * read aloud (Web Speech API), and "pick up where you left off" from this
 * browser's reading history.
 */
export function ReaderBar({ slug, articleId }: { slug: string; articleId: string }) {
  const reduce = useReducedMotion();
  const { notify } = useSite();
  const saved = useReading(slug);
  const [size, setSize] = useState(1);
  const [progress, setProgress] = useState(0);
  const [speech, setSpeech] = useState<Speech>("idle");
  const [canSpeak, setCanSpeak] = useState(false);
  // Out of the way while reading down the page; back on any scroll up
  const [tucked, setTucked] = useState(false);
  const [entered, setEntered] = useState(false);
  // Offered once per visit, only if the reader starts at the top
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const offered = useRef(false);
  const session = useRef(0);
  const current = useRef<HTMLElement | null>(null);

  const article = useCallback(() => document.getElementById(articleId), [articleId]);

  // Text size, remembered across posts
  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(SIZE_KEY));
      if (SIZES.includes(stored)) setSize(stored);
    } catch {
      // Storage blocked: default size
    }
    setCanSpeak("speechSynthesis" in window);
  }, []);

  useEffect(() => {
    article()?.style.setProperty("--prose-scale", String(size));
  }, [size, article]);

  const changeSize = (dir: 1 | -1) => {
    const next = SIZES[Math.min(SIZES.length - 1, Math.max(0, SIZES.indexOf(size) + dir))];
    setSize(next);
    try {
      localStorage.setItem(SIZE_KEY, String(next));
    } catch {
      // Not remembered
    }
  };

  // Track and remember progress through the article
  useEffect(() => {
    const el = article();
    if (!el) return;
    let frame = 0;
    let lastSave = 0;
    let lastY = window.scrollY;
    const update = () => {
      frame = 0;
      const { top, height } = articleGeometry(el);
      const p = Math.min(1, Math.max(0, (window.scrollY + window.innerHeight * LINE - top) / height));
      setProgress(p);
      const dy = window.scrollY - lastY;
      if (Math.abs(dy) > 6) {
        setTucked(dy > 0 && p > 0.02);
        lastY = window.scrollY;
      }
      const now = Date.now();
      if (now - lastSave > 400 || p >= READ_AT) {
        lastSave = now;
        if (p > 0.02) saveReading(slug, p);
      }
      if (p > 0.05) setResumeAt(null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slug, article]);

  // Offer to jump back when returning to a half-read post
  useEffect(() => {
    if (offered.current || !saved) return;
    offered.current = true;
    if (saved.pos > 0.08 && saved.pos < READ_AT && window.scrollY < 200) setResumeAt(saved.pos);
  }, [saved]);

  const resume = () => {
    const el = article();
    if (!el || resumeAt === null) return;
    const { top, height } = articleGeometry(el);
    window.scrollTo({
      top: top + resumeAt * height - window.innerHeight * LINE,
      behavior: reduce ? "auto" : "smooth",
    });
    setResumeAt(null);
  };

  // ── Read aloud ──────────────────────────────────────────────
  const mark = (el: HTMLElement | null) => {
    current.current?.classList.remove("is-speaking");
    current.current = el;
    el?.classList.add("is-speaking");
  };

  const stop = useCallback(() => {
    session.current += 1;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    mark(null);
    setSpeech("idle");
  }, []);

  useEffect(() => stop, [stop]);

  const play = () => {
    const synth = window.speechSynthesis;
    if (speech === "paused") {
      synth.resume();
      setSpeech("playing");
      return;
    }
    const el = article();
    if (!el) return;
    const blocks = Array.from(el.querySelectorAll<HTMLElement>(SPEAKABLE)).filter((b) => b.innerText.trim());
    if (blocks.length === 0) return;

    // Start from the first block on screen, so it reads from where you are
    const line = window.innerHeight * LINE;
    let start = blocks.findIndex((b) => b.getBoundingClientRect().bottom > line);
    if (start < 0) start = 0;

    const id = ++session.current;
    const voice =
      synth.getVoices().find((v) => v.lang.startsWith("en") && /natural|google|samantha/i.test(v.name)) ??
      synth.getVoices().find((v) => v.lang.startsWith("en"));

    const speakAt = (i: number) => {
      if (id !== session.current) return;
      if (i >= blocks.length) {
        stop();
        return;
      }
      const block = blocks[i];
      mark(block);
      const r = block.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight - 80) {
        block.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      }
      const utter = new SpeechSynthesisUtterance(block.innerText);
      if (voice) utter.voice = voice;
      utter.rate = 1.02;
      utter.onend = () => speakAt(i + 1);
      utter.onerror = (e) => {
        // Our own cancel/stop; anything else means speech isn't available here
        if (e.error === "interrupted" || e.error === "canceled" || id !== session.current) return;
        stop();
        notify("Read aloud isn't available in this browser", "info");
      };
      synth.speak(utter);
    };

    synth.cancel();
    setSpeech("playing");
    speakAt(start);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setSpeech("paused");
  };

  const btn =
    "flex h-10 items-center justify-center gap-2 text-[var(--text-secondary)] transition-colors duration-100 " +
    "hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-35";
  const pct = Math.round(progress * 100);
  // Stays up while it has something to say: a resume offer, speech, or the end of the post
  const shown = !tucked || resumeAt !== null || speech !== "idle" || progress >= READ_AT;

  return (
    // Centred by the wrapper: motion owns the toolbar's transform
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 md:bottom-6">
      <m.div
        role="toolbar"
        aria-label="Reader tools"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 88 }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 380, damping: 32, delay: entered ? 0 : 0.4 }
        }
        onAnimationComplete={() => setEntered(true)}
        onFocus={() => setTucked(false)}
        className={`field-ink cut-a flex items-center gap-1 p-1 ${shown ? "pointer-events-auto" : ""}`}
      >
        <AnimatePresence initial={false}>
          {resumeAt !== null && (
            <m.button
              key="resume"
              type="button"
              onClick={resume}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="t-label flex h-10 items-center gap-2 overflow-hidden whitespace-nowrap bg-[var(--cardinal)] px-3
                         text-[#fbf6ec]"
            >
              <HistoryIcon size={15} strokeWidth={2.2} className="shrink-0" />
              Resume<span className="hidden sm:inline"> at</span> {Math.round(resumeAt * 100)}%
            </m.button>
          )}
        </AnimatePresence>

        <div className="flex items-center" role="group" aria-label="Text size">
          <button
            type="button"
            onClick={() => changeSize(-1)}
            disabled={size === SIZES[0]}
            aria-label="Smaller text"
            title="Smaller text"
            className={`${btn} w-9`}
          >
            <MinusIcon size={15} />
          </button>
          <span className="w-8 select-none text-center font-display text-[1.3rem] leading-none text-[var(--text-primary)]" aria-hidden="true">
            Aa
          </span>
          <button
            type="button"
            onClick={() => changeSize(1)}
            disabled={size === SIZES[SIZES.length - 1]}
            aria-label="Larger text"
            title="Larger text"
            className={`${btn} w-9`}
          >
            <PlusIcon size={15} />
          </button>
        </div>

        {canSpeak && (
          <>
            <span className="mx-0.5 h-5 w-px bg-[var(--border)]" aria-hidden="true" />
            {speech === "playing" ? (
              <button type="button" onClick={pause} aria-label="Pause" className={`${btn} t-label w-9 text-[var(--accent)] sm:w-auto sm:px-3`}>
                <PauseIcon size={15} />
                {/* Icon only on phones, so the bar fits beside a resume offer */}
                <span className="hidden sm:inline">Pause</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={play}
                aria-label={speech === "paused" ? "Resume reading aloud" : "Listen to this post"}
                className={`${btn} t-label w-9 sm:w-auto sm:px-3`}
              >
                {speech === "paused" ? <PlayIcon size={15} /> : <HeadphonesIcon size={15} />}
                <span className="hidden sm:inline">{speech === "paused" ? "Resume" : "Listen"}</span>
              </button>
            )}
            {speech !== "idle" && (
              <button type="button" onClick={stop} aria-label="Stop reading aloud" title="Stop" className={`${btn} w-9`}>
                <SquareIcon size={13} fill="currentColor" />
              </button>
            )}
          </>
        )}

        <span className="mx-0.5 h-5 w-px bg-[var(--border)]" aria-hidden="true" />
        <span
          className="w-14 text-center font-display text-[1.35rem] leading-none text-[var(--accent)]"
          aria-label={`${pct}% read`}
          title="Progress through the article"
        >
          {pct}%
        </span>
      </m.div>
    </div>
  );
}
