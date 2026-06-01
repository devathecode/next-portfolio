"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpIcon, Maximize2Icon, SparklesIcon, XIcon } from "lucide-react";
import {
  CHAT_SUGGESTIONS,
  splitLinks,
  type useResumeChat,
} from "@/lib/use-resume-chat";

type Chat = ReturnType<typeof useResumeChat>;

function MessageText({ text }: { text: string }) {
  return (
    <>
      {splitLinks(text).map((part, i) =>
        "href" in part ? (
          <a
            key={i}
            href={part.href}
            className="font-medium text-[var(--accent)] underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            {part.label}
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

/**
 * The browser's AI side panel (think Gemini in Chrome), answering questions
 * about Devanshu from his résumé. Non-modal: the page stays usable beside it.
 */
export default function AssistantPanel({ chat, onClose }: { chat: Chat; onClose: () => void }) {
  const { messages, loading, sendMessage } = chat;
  const reduce = useReducedMotion();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Follow the stream
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    await sendMessage(text);
    inputRef.current?.focus({ preventScroll: true });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <motion.aside
      aria-label="AI assistant"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reduce ? 0 : 24, pointerEvents: "none", transition: { duration: reduce ? 0 : 0.16 } }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }}
      className="fixed bottom-0 right-0 top-[var(--chrome-h)] z-30 flex w-full flex-col border-l border-[var(--border)]
                 bg-[var(--chrome-toolbar)] shadow-[var(--shadow-pop)] md:w-[400px]"
    >
      {/* Panel header */}
      <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-[var(--border)] pl-4 pr-2">
        <SparklesIcon size={16} strokeWidth={1.9} className="shrink-0 text-[var(--accent)]" />
        <p className="flex-1 text-sm font-semibold text-[var(--text-primary)]">Ask AI</p>
        <Link
          href="/resume"
          aria-label="Open the full résumé page"
          title="Open full page"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors
                     duration-150 hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)]"
        >
          <Maximize2Icon size={15} strokeWidth={1.9} />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI panel"
          title="Close"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors
                     duration-150 hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)]"
        >
          <XIcon size={17} strokeWidth={1.9} />
        </button>
      </div>

      {/* Conversation */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-busy={loading}
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
      >
        {messages.map((msg, i) =>
          msg.role === "assistant" ? (
            <div key={i} className="flex items-start gap-2.5">
              <span className="relative mt-0.5 h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                <Image src="/images/LInkedin_heashot.png" alt="" fill sizes="28px" className="object-cover" />
              </span>
              <div className="min-w-0 flex-1 whitespace-pre-wrap pt-1 text-[14.5px] leading-relaxed text-[var(--text-primary)]">
                {msg.content ? (
                  <MessageText text={msg.content} />
                ) : (
                  <span className="text-[var(--text-muted)]">
                    <TypingDots />
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <p
                className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[var(--bg-secondary)] px-3.5 py-2.5
                           text-[14.5px] leading-relaxed text-[var(--text-primary)]"
              >
                {msg.content}
              </p>
            </div>
          ),
        )}

        {messages.length === 1 && (
          <div className="pl-[38px]">
            <p className="text-xs font-medium text-[var(--text-muted)]">Try asking</p>
            <ul className="mt-2 flex flex-col items-start gap-2">
              {CHAT_SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-left text-[13px]
                               text-[var(--text-secondary)] transition-colors duration-150
                               hover:border-[var(--accent-line)] hover:text-[var(--text-primary)]"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-[var(--border)] p-3">
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-1.5 pl-3.5 pr-1.5
                     transition-colors duration-150 focus-within:border-[var(--accent-line)]"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, projects, availability…"
            aria-label="Message"
            disabled={loading}
            className="h-9 min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none
                       placeholder:text-[var(--text-muted)] focus-visible:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--on-accent)]
                       transition-opacity duration-150 disabled:opacity-30"
          >
            <ArrowUpIcon size={16} strokeWidth={2.2} />
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">
          Answers come from my résumé via Gemini, and can be wrong.
        </p>
      </div>
    </motion.aside>
  );
}
