"use client";

import { useCallback, useState } from "react";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export const CHAT_SUGGESTIONS = [
  "What frameworks do you specialise in?",
  "Tell me about your projects",
  "Are you open to freelance work?",
  "What's your experience level?",
];

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I'm Devanshu! Ask me anything about my skills, experience, or projects. Happy to help.",
};

/**
 * Streaming chat against /api/resume-chat. Shared by the /resume page and the
 * browser's AI side panel.
 */
export function useResumeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: ChatMessage = { role: "user", content: text };
      const historySnapshot = [...messages];

      setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
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
      }
    },
    [loading, messages],
  );

  return { messages, loading, sendMessage };
}

/** Plain text with [label](url) markdown links turned into anchors. */
export function splitLinks(text: string) {
  return text.split(/(\[.*?\]\(.*?\))/g).map((part) => {
    const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
    return match ? { label: match[1], href: match[2] } : { text: part };
  });
}
