"use client";

import { useState, useTransition } from "react";
import {
  MailOpenIcon,
  MailIcon,
  Trash2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import {
  markReadAction,
  markUnreadAction,
  deleteMessageAction,
} from "../actions";
import type { Message } from "@/lib/supabase";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function MessageRow({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();

  const toggleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(() => {
      if (message.is_read) {
        markUnreadAction(message.id);
      } else {
        markReadAction(message.id);
      }
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete message from ${message.name}?`)) return;
    startTransition(() => deleteMessageAction(message.id));
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        message.is_read
          ? "border-gray-800 bg-gray-900/50"
          : "border-yellow-600/30 bg-yellow-600/5"
      } ${pending ? "opacity-50" : ""}`}
    >
      {/* Summary row — always visible */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Read/unread dot */}
        <div className="mt-1.5 shrink-0">
          {message.is_read ? (
            <div className="w-2 h-2 rounded-full bg-gray-700" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span
              className={`font-semibold text-sm ${
                message.is_read ? "text-gray-300" : "text-white"
              }`}
            >
              {message.name}
            </span>
            <span className="text-xs text-gray-500">
              &lt;{message.email}&gt;
            </span>
          </div>
          {!expanded && (
            <p className="text-xs text-gray-500 truncate">{message.message}</p>
          )}
        </div>

        {/* Date + chevron */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-600 hidden sm:inline">
            {formatDate(message.created_at)}
          </span>
          {expanded ? (
            <ChevronUpIcon size={14} className="text-gray-500" />
          ) : (
            <ChevronDownIcon size={14} className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-9 pb-4">
          <p className="text-xs text-gray-600 sm:hidden mb-2">
            {formatDate(message.created_at)}
          </p>
          <p className="text-sm text-gray-300 whitespace-pre-wrap bg-gray-800/60 rounded-lg p-3 mb-3 leading-relaxed">
            {message.message}
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={toggleRead}
              disabled={pending}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-gray-700
                         text-gray-400 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-40"
            >
              {message.is_read ? (
                <>
                  <MailIcon size={12} /> Mark Unread
                </>
              ) : (
                <>
                  <MailOpenIcon size={12} /> Mark Read
                </>
              )}
            </button>
            <a
              href={`mailto:${message.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-gray-700
                         text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            >
              <MailIcon size={12} /> Reply
            </a>
            <button
              onClick={handleDelete}
              disabled={pending}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-red-500/30
                         text-red-400 hover:text-red-300 hover:border-red-500/60 transition-colors disabled:opacity-40"
            >
              <Trash2Icon size={12} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <MessageRow key={msg.id} message={msg} />
      ))}
    </div>
  );
}
