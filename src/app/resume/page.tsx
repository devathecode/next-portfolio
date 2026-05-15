"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  DownloadIcon,
  SendIcon,
  FileTextIcon,
  MessageSquareIcon,
} from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

// Renders plain text but converts [label](url) markdown links to <a> tags
function MessageText({ text }: { text: string }) {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (match) {
          return (
            <a
              key={i}
              href={match[2]}
              className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
              style={{ color: "var(--accent)" }}
            >
              {match[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

const SUGGESTIONS = [
  "What frameworks do you specialise in?",
  "Tell me about your projects",
  "Are you open to freelance work?",
  "What's your experience level?",
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm Devanshu's resume assistant. Ask me anything about his skills, experience, or projects — I'm happy to help.",
};

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export default function ResumePage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pdf" | "chat">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const historySnapshot = [...messages];

    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/resume-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historySnapshot }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* ── Top bar ── */}
      <header
        className="shrink-0 flex items-center justify-between px-5 py-2.5 border-b backdrop-blur-xl"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-primary)/80",
        }}
      >
        {/* Left — back */}
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 hover:-translate-x-0.5"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-muted)",
            background: "var(--bg-card)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <ArrowLeftIcon size={12} />
          Portfolio
        </Link>

        {/* Centre — identity */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-black text-[9px] font-black font-mono"
            style={{ background: "var(--accent)" }}
          >
            DV
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Devanshu Verma
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border"
            style={{
              borderColor: "var(--accent)",
              color: "var(--accent)",
              background: "var(--accent-muted)",
            }}
          >
            Resume
          </span>
        </div>

        {/* Right — download */}
        <a
          href="/resume/Resume.pdf"
          download="Devanshu_Verma_Resume.pdf"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:opacity-85 hover:-translate-y-px"
          style={{
            background: "var(--accent)",
            color: "#000",
            boxShadow: "0 0 16px var(--accent-glow)",
          }}
        >
          <DownloadIcon size={11} />
          Download
        </a>
      </header>

      {/* ── Mobile tabs ── */}
      <div
        className="lg:hidden flex shrink-0 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {(["pdf", "chat"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium font-mono transition-colors duration-150"
            style={{
              color:
                activeTab === tab ? "var(--accent)" : "var(--text-muted)",
              borderBottom:
                activeTab === tab
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
            }}
          >
            {tab === "pdf" ? (
              <FileTextIcon size={13} />
            ) : (
              <MessageSquareIcon size={13} />
            )}
            {tab === "pdf" ? "View PDF" : "Ask AI"}
          </button>
        ))}
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── PDF panel ── */}
        <div
          className={`${
            activeTab === "pdf" ? "flex" : "hidden"
          } lg:flex w-full lg:w-[58%] flex-col border-r`}
          style={{ borderColor: "var(--border)" }}
        >
          <iframe
            src="/resume/Resume.pdf"
            className="w-full flex-1 border-none"
            title="Devanshu Verma Resume"
          />
        </div>

        {/* ── Chat panel ── */}
        <div
          className={`${
            activeTab === "chat" ? "flex" : "hidden"
          } lg:flex flex-1 flex-col`}
        >
          {/* Chat header */}
          <div
            className="shrink-0 px-5 py-3.5 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-black text-[10px] font-black font-mono shrink-0"
                style={{ background: "var(--accent)" }}
              >
                DV
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Resume Assistant
                </p>
                <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                  Ask anything about this resume
                </p>
              </div>
              <span
                className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                online
              </span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Suggestion chips — shown only when just the welcome message is present */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                      background: "var(--bg-card)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-black text-[9px] font-black font-mono shrink-0 mt-0.5"
                    style={{ background: "var(--accent)" }}
                  >
                    DV
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "var(--accent)", color: "#000" }
                      : {
                          background: "var(--bg-card)",
                          color: "var(--text-primary)",
                          border: "1px solid var(--border)",
                        }
                  }
                >
                  {msg.content ? (
                    <MessageText text={msg.content} />
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>
                      <TypingDots />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div
            className="shrink-0 px-4 py-3 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-2xl border px-4 py-2.5 transition-colors duration-150 focus-within:border-[var(--accent)]"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-card)",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, experience, projects…"
                disabled={loading}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)] disabled:opacity-50"
                style={{ color: "var(--text-primary)" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-opacity duration-150 disabled:opacity-30"
                style={{ background: "var(--accent)", color: "#000" }}
              >
                <SendIcon size={13} />
              </button>
            </form>
            <p
              className="text-center text-[10px] font-mono mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              Powered by Gemini · Answers based on resume content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
