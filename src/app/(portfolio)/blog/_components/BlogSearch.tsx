"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Fuse from "fuse.js";
import { SearchIcon, XIcon } from "lucide-react";
import type { PostSummary } from "@/lib/posts";
import { PostRow } from "./PostRow";

/**
 * Find-in-list for the blog. While there's a query the results replace the
 * server-rendered list (children); "/" focuses the field from anywhere.
 */
export function BlogSearch({ posts, children }: { posts: PostSummary[]; children: ReactNode }) {
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
        className="flex h-14 max-w-2xl items-center gap-3 bg-[var(--bg-card)] pl-4 pr-2 shadow-[inset_0_0_0_1.5px_var(--border)]
                   transition-shadow duration-100 focus-within:shadow-[inset_0_0_0_2.5px_var(--text-primary)]"
      >
        <SearchIcon size={18} strokeWidth={2.2} className="shrink-0 text-[var(--text-primary)]" aria-hidden="true" />
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
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-[var(--text-primary)] outline-none
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
            className="flex h-10 w-10 items-center justify-center text-[var(--text-muted)] transition-colors duration-100
                       hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
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
          <p className="t-label mb-3 text-[var(--text-muted)]">
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
          </p>
          {results.length === 0 ? (
            <p className="border-y border-[var(--border)] py-14 text-center text-[16px] text-[var(--text-secondary)]">
              Nothing matches that. Try a topic like <strong className="font-semibold text-[var(--text-primary)]">react</strong> or{" "}
              <strong className="font-semibold text-[var(--text-primary)]">npm</strong>.
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
