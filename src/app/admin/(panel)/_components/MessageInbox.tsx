"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ArrowLeftIcon,
  InboxIcon,
  MailIcon,
  MailOpenIcon,
  ReplyIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import {
  markReadAction,
  markUnreadAction,
  deleteMessageAction,
} from "../../actions";
import type { Message } from "@/lib/supabase";
import { useFeedback } from "./feedback";
import {
  EmptyState,
  btnDangerGhost,
  btnGhost,
  btnPrimary,
  formatDate,
  inputCls,
  timeAgo,
} from "./ui";

type Filter = "all" | "unread";

export function MessageInbox({
  messages,
  initialOpenId,
}: {
  messages: Message[];
  initialOpenId?: string;
}) {
  const { toast, confirm } = useFeedback();
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialOpenId ?? null);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === "unread" && m.is_read) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, filter, query]);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const open = (m: Message) => {
    setSelectedId(m.id);
    if (!m.is_read) startTransition(() => markReadAction(m.id));
  };

  // A deep link from the overview page should also mark that message read.
  useEffect(() => {
    const m = messages.find((x) => x.id === initialOpenId);
    if (m && !m.is_read) startTransition(() => markReadAction(m.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRead = (m: Message) => {
    startTransition(async () => {
      await (m.is_read ? markUnreadAction(m.id) : markReadAction(m.id));
      toast(m.is_read ? "Marked as unread" : "Marked as read");
    });
  };

  const remove = async (m: Message) => {
    const ok = await confirm({
      title: `Delete message from ${m.name}?`,
      body: "This can't be undone.",
    });
    if (!ok) return;
    startTransition(async () => {
      await deleteMessageAction(m.id);
      setSelectedId(null);
      toast("Message deleted");
    });
  };

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={InboxIcon}
        title="No messages yet"
        body="When someone uses your contact form, their message will appear here."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:h-[calc(100dvh-13rem)] lg:grid-cols-[340px_minmax(0,1fr)]">
      {/* List pane */}
      <section
        className={`${selected ? "hidden lg:flex" : "flex"} min-h-0 flex-col overflow-hidden rounded-xl border border-adm-border bg-adm-surface`}
      >
        <div className="space-y-3 border-b border-adm-border p-3">
          <div className="relative">
            <SearchIcon
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-adm-subtle"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages"
              aria-label="Search messages"
              className={`${inputCls} pl-9`}
            />
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-adm-raised p-1 text-sm">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  filter === f
                    ? "bg-adm-surface text-adm-text shadow-sm"
                    : "text-adm-muted hover:text-adm-text"
                }`}
              >
                {f === "all" ? `All (${messages.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>
        </div>

        <ul className="min-h-0 flex-1 divide-y divide-adm-border overflow-y-auto">
          {visible.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-adm-muted">
              {filter === "unread" && !query ? "No unread messages." : "No messages match your search."}
            </li>
          )}
          {visible.map((m) => {
            const active = m.id === selectedId;
            return (
              <li key={m.id}>
                <button
                  onClick={() => open(m)}
                  aria-current={active ? "true" : undefined}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                    active ? "bg-adm-accent/10" : "hover:bg-adm-raised"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      m.is_read ? "bg-transparent" : "bg-adm-accent"
                    }`}
                    aria-label={m.is_read ? "Read" : "Unread"}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span
                        className={`truncate text-sm ${
                          m.is_read ? "text-adm-muted" : "font-semibold text-adm-text"
                        }`}
                      >
                        {m.name}
                      </span>
                      <span className="shrink-0 text-xs text-adm-subtle">{timeAgo(m.created_at)}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-sm text-adm-subtle">{m.message}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Reading pane */}
      <section
        className={`${selected ? "flex" : "hidden lg:flex"} min-h-0 flex-col overflow-hidden rounded-xl border border-adm-border bg-adm-surface ${
          pending ? "opacity-70" : ""
        }`}
      >
        {selected ? (
          <>
            <div className="flex items-start gap-3 border-b border-adm-border p-4">
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Back to list"
                className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-adm-muted hover:bg-adm-raised lg:hidden"
              >
                <ArrowLeftIcon size={17} />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold">{selected.name}</h2>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-sm text-adm-accent-text hover:underline"
                >
                  {selected.email}
                </a>
                <p className="mt-0.5 text-xs text-adm-subtle">
                  {formatDate(selected.created_at, true)}
                </p>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <p className="max-w-[65ch] whitespace-pre-wrap text-[15px] leading-relaxed text-adm-text">
                {selected.message}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-adm-border p-3">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  `Re: your message on devanshuverma.in`
                )}`}
                className={btnPrimary}
              >
                <ReplyIcon size={15} /> Reply
              </a>
              <button onClick={() => toggleRead(selected)} disabled={pending} className={btnGhost}>
                {selected.is_read ? <MailIcon size={15} /> : <MailOpenIcon size={15} />}
                {selected.is_read ? "Mark unread" : "Mark read"}
              </button>
              <button
                onClick={() => remove(selected)}
                disabled={pending}
                className={`${btnDangerGhost} sm:ml-auto`}
              >
                <Trash2Icon size={15} /> Delete
              </button>
            </div>
          </>
        ) : (
          <div className="m-auto px-6 text-center text-sm text-adm-muted">
            Select a message to read it.
          </div>
        )}
      </section>
    </div>
  );
}
