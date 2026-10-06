"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpIcon, DownloadIcon, FileTextIcon, MessageSquareIcon } from "lucide-react";
import { CHAT_SUGGESTIONS as SUGGESTIONS, splitLinks, useResumeChat } from "@/lib/use-resume-chat";
import { RESUME_PDF, RESUME_PDF_NAME } from "@/lib/site";

// Renders plain text but converts [label](url) markdown links to <a> tags
function MessageText({ text }: { text: string }) {
  return (
    <>
      {splitLinks(text).map((part, i) =>
        "href" in part ? (
          <a key={i} href={part.href} className="link font-medium">
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
    <span className="inline-flex items-center gap-1 py-0.5" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-bounce bg-current" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

/**
 * The résumé as a screening room: the PDF on one side, the assistant that
 * answers questions about it on the other. Phones switch between the two.
 */
export default function ResumePage() {
  const { messages, loading, sendMessage: send } = useResumeChat();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"pdf" | "chat">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    await send(text);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="site field-paper flex h-dvh flex-col overflow-hidden">
      {/* ── Top bar ── */}
      <header className="field-ink flex h-16 shrink-0 items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="t-label group inline-flex h-10 items-center gap-2 text-[var(--text-secondary)] transition-colors duration-100 hover:text-[var(--text-primary)]"
        >
          <ArrowLeftIcon size={15} strokeWidth={2.2} className="transition-transform duration-100 group-hover:-translate-x-0.5" />
          Portfolio
        </Link>

        <p className="absolute left-1/2 hidden -translate-x-1/2 items-baseline gap-3 sm:flex">
          <span className="font-display text-[1.75rem] uppercase leading-none">Devanshu Verma</span>
          <span className="t-label text-[var(--accent)]">Résumé</span>
        </p>

        <a href={RESUME_PDF} download={RESUME_PDF_NAME} className="btn btn-plate btn-sm">
          <DownloadIcon size={14} strokeWidth={2.2} />
          Download
        </a>
      </header>

      {/* ── Phone tabs ── */}
      <div role="tablist" aria-label="Résumé view" className="field-ink flex shrink-0 border-t border-[var(--border)] lg:hidden">
        {(["pdf", "chat"] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab)}
              className={`t-label flex h-12 flex-1 items-center justify-center gap-2 transition-colors duration-100 ${
                active ? "bg-[var(--cardinal)] text-[#fbf6ec]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab === "pdf" ? <FileTextIcon size={14} strokeWidth={2.2} /> : <MessageSquareIcon size={14} strokeWidth={2.2} />}
              {tab === "pdf" ? "View PDF" : "Ask my AI"}
            </button>
          );
        })}
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF */}
        <div
          className={`${activeTab === "pdf" ? "flex" : "hidden"} w-full flex-col bg-[var(--ink)] p-0 lg:flex lg:w-[58%] lg:p-5`}
        >
          <iframe src={RESUME_PDF} className="w-full flex-1 border-none bg-white" title="Devanshu Verma résumé" />
        </div>

        {/* Chat */}
        <div className={`${activeTab === "chat" ? "flex" : "hidden"} flex-1 flex-col lg:flex`}>
          <div className="field-cardinal flex shrink-0 items-center gap-3 px-5 py-4">
            <span className="cut-a relative h-11 w-11 shrink-0 overflow-hidden bg-[var(--ink)]">
              <Image src="/images/dev.webp" alt="" fill sizes="44px" className="object-cover object-top grayscale contrast-125" />
            </span>
            <div>
              <h1 className="font-display text-[1.9rem] uppercase leading-none">Ask my AI</h1>
              <p className="mt-1 text-[14px] text-[var(--text-primary)]">Anything about this résumé</p>
            </div>
          </div>

          {/* Messages */}
          <div role="log" aria-live="polite" aria-busy={loading} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.length === 1 && (
              <div className="mb-5">
                <p className="t-label text-[var(--text-muted)]">Try asking</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="px-3 py-2 text-left text-[14px] text-[var(--text-primary)] shadow-[inset_0_0_0_1.5px_var(--border)]
                                 transition-colors duration-100 hover:bg-[var(--ink)] hover:text-[var(--bone-ink)] hover:shadow-none"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <span className="relative mt-0.5 h-8 w-8 shrink-0 overflow-hidden bg-[var(--cardinal)]">
                    <Image src="/images/dev.webp" alt="" fill sizes="32px" className="object-cover object-top grayscale contrast-125 mix-blend-multiply" />
                  </span>
                )}
                <div
                  className={`max-w-[82%] whitespace-pre-wrap text-[15px] leading-relaxed ${
                    msg.role === "user"
                      ? "cut-b bg-[var(--ink)] px-4 py-2.5 text-[var(--bone-ink)]"
                      : "pt-1 text-[var(--text-primary)]"
                  }`}
                >
                  {msg.content ? (
                    <MessageText text={msg.content} />
                  ) : (
                    <span className="text-[var(--text-muted)]">
                      <TypingDots />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t-2 border-[var(--text-primary)] px-4 py-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 bg-[var(--bg-card)] py-1.5 pl-4 pr-1.5 shadow-[inset_0_0_0_1.5px_var(--border)]
                         transition-shadow duration-100 focus-within:shadow-[inset_0_0_0_2.5px_var(--text-primary)]"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, experience, projects…"
                aria-label="Message"
                disabled={loading}
                className="h-10 min-w-0 flex-1 bg-transparent text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--plate)] text-[var(--on-plate)] transition-colors duration-100
                           hover:bg-[var(--plate-hover)] disabled:opacity-30"
              >
                <ArrowUpIcon size={16} strokeWidth={2.4} />
              </button>
            </form>
            <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
              Answers come from my résumé via Gemini, and can be wrong.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
