"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Fuse from "fuse.js";
import { SearchIcon, XIcon } from "lucide-react";
import type { Post } from "@/lib/supabase";
import { PostRow } from "./PostRow";

/**
 * Find-in-list for the blog. While there's a query the results replace the
 * server-rendered list (children); "/" focuses the field from anywhere.
 */
export function BlogSearch({ posts, children }: { posts: Post[]; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(
    () => new Fuse(posts, { keys: ["title", "excerpt", "tags"], threshold: 0.35 }),
    [posts],
  );
  const results = useMemo(
    () => (query.trim() ? fuse.search(query).map((r) => r.item) : null),
    [query, fuse],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || t?.closest("input, textarea, [contenteditable]")) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        className="flex h-11 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pl-3.5 pr-2
                   transition-colors duration-150 focus-within:border-[var(--accent-line)]"
      >
        <SearchIcon size={16} className="shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setQuery("");
              e.currentTarget.blur();
            }
          }}
          placeholder={`Search ${posts.length} posts`}
          aria-label="Search posts"
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none
                     placeholder:text-[var(--text-muted)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors
                       hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)]"
          >
            <XIcon size={15} />
          </button>
        ) : (
          <kbd className="kbd hidden sm:inline-flex" aria-hidden="true">
            /
          </kbd>
        )}
      </div>

      {results === null ? (
        children
      ) : (
        <section aria-live="polite" className="mt-10">
          <p className="mb-2 font-mono text-xs text-[var(--text-muted)]">
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
          </p>
          {results.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-14 text-center text-sm text-[var(--text-secondary)]">
              Nothing matches that. Try a topic like <span className="font-mono">react</span> or{" "}
              <span className="font-mono">npm</span>.
            </p>
          ) : (
            <div className="border-b border-[var(--border)]">
              {results.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
