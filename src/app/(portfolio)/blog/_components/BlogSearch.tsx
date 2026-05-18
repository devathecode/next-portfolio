"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Fuse from "fuse.js";
import type { Post } from "@/lib/supabase";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SearchCard({ post }: { post: Post }) {
  const date = formatDate(post.published_at ?? post.created_at);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]
                 p-4 transition-all duration-200 hover:border-[var(--accent-glow)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-secondary)]">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-2xl font-bold text-[var(--border)]">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{post.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <time className="text-[11px] text-[var(--text-muted)]">{date}</time>
          {post.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-[var(--accent-muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent)]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function BlogSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "excerpt", "tags"],
        threshold: 0.35,
        includeScore: true,
      }),
    [posts]
  );

  const results = useMemo(() => {
    if (!query.trim()) return null;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse]);

  return (
    <div className="mb-10">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-2.5 pl-10 pr-4
                     text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                     focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {results !== null && (
        <div className="mt-4">
          {results.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] py-4 text-center">
              No posts found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-muted)]">
                {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
              </p>
              {results.map((post) => (
                <SearchCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
