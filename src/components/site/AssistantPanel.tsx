"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { m, useReducedMotion } from "framer-motion";
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
            className="link font-medium"
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
          className="h-1.5 w-1.5 animate-bounce bg-current"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

/**
 * The Ask AI side panel, answering questions about Devanshu from his résumé.
 * Non-modal: the page stays usable beside it.
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
    <m.aside
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
      className="field-paper fixed bottom-0 right-0 top-[var(--header-h)] z-40 flex w-full flex-col
                 md:w-[420px] md:border-l-2 md:border-[var(--ink)]"
    >
      {/* Panel header */}
      <div className="field-cardinal flex h-14 shrink-0 items-center gap-2.5 pl-4 pr-2">
        <SparklesIcon size={17} strokeWidth={2} className="shrink-0" />
        <p className="flex-1 font-display text-[1.6rem] uppercase leading-none tracking-[0.03em]">Ask my AI</p>
        <Link
          href="/resume"
          aria-label="Open the full résumé page"
          title="Open full page"
          className="flex h-10 w-10 items-center justify-center text-[var(--text-primary)] transition-colors
                     duration-100 hover:bg-[var(--bg-secondary)]"
        >
          <Maximize2Icon size={15} strokeWidth={1.9} />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI panel"
          title="Close"
          className="flex h-10 w-10 items-center justify-center text-[var(--text-primary)] transition-colors
                     duration-100 hover:bg-[var(--bg-secondary)]"
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
              <span className="relative mt-0.5 h-8 w-8 shrink-0 overflow-hidden bg-[var(--cardinal)]">
                <Image src="/images/dev.webp" alt="" fill sizes="32px" className="object-cover object-top grayscale contrast-125 mix-blend-multiply" />
              </span>
              <div className="min-w-0 flex-1 whitespace-pre-wrap pt-1 text-[15px] leading-relaxed text-[var(--text-primary)]">
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
                className="cut-b max-w-[85%] whitespace-pre-wrap bg-[var(--ink)] px-4 py-2.5
                           text-[15px] leading-relaxed text-[var(--bone-ink)]"
              >
                {msg.content}
              </p>
            </div>
          ),
        )}

        {messages.length === 1 && (
          <div className="pl-[42px]">
            <p className="t-label text-[var(--text-muted)]">Try asking</p>
            <ul className="mt-2 flex flex-col items-start gap-2">
              {CHAT_SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="px-3 py-2 text-left text-[14px] text-[var(--text-primary)] shadow-[inset_0_0_0_1.5px_var(--border)]
                               transition-colors duration-100 hover:bg-[var(--ink)] hover:text-[var(--bone-ink)] hover:shadow-none"
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
      <div className="shrink-0 border-t-2 border-[var(--text-primary)] p-3">
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 bg-[var(--bg-card)] py-1.5 pl-3.5 pr-1.5 shadow-[inset_0_0_0_1.5px_var(--border)]
                     transition-shadow duration-100 focus-within:shadow-[inset_0_0_0_2.5px_var(--text-primary)]"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, projects, availability…"
            aria-label="Message"
            disabled={loading}
            className="h-10 min-w-0 flex-1 bg-transparent text-[15px] text-[var(--text-primary)] outline-none
                       placeholder:text-[var(--text-muted)] focus-visible:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--plate)] text-[var(--on-plate)]
                       transition-colors duration-100 hover:bg-[var(--plate-hover)] disabled:opacity-30"
          >
            <ArrowUpIcon size={16} strokeWidth={2.2} />
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
          Answers come from my résumé via Gemini, and can be wrong.
        </p>
      </div>
    </m.aside>
  );
}
