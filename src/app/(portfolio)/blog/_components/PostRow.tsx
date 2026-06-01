import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/supabase";
import ReadState from "@/components/ReadState";
import { postDate, readMinutes } from "./post-meta";

/** One entry in a reading list: date gutter, title and excerpt, thumbnail. */
export function PostRow({
  post,
  heading: Heading = "h2",
  activeTag,
}: {
  post: Post;
  heading?: "h2" | "h3";
  /** Highlighted on tag pages */
  activeTag?: string;
}) {
  const date = postDate(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-t border-[var(--border)] py-7
                 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:gap-8"
    >
      <time dateTime={date.iso} className="hidden pt-1 font-mono text-xs text-[var(--text-muted)] sm:block">
        {date.label}
      </time>

      <div className="min-w-0">
        <Heading
          className="text-lg font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)]
                     transition-colors duration-150 group-hover:text-[var(--accent)] md:text-xl"
        >
          {post.title}
        </Heading>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 max-w-[65ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {post.excerpt}
          </p>
        )}
        <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-[var(--text-muted)]">
          <time dateTime={date.iso} className="sm:hidden">
            {date.label}
          </time>
          <span>{readMinutes(post.content)} min read</span>
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`rounded-md border px-1.5 py-0.5 ${
                tag === activeTag
                  ? "border-[var(--accent-line)] bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-secondary)]"
              }`}
            >
              {tag}
            </span>
          ))}
          <ReadState slug={post.slug} />
        </div>
      </div>

      {post.cover_image ? (
        <div
          className="relative aspect-[16/10] w-24 shrink-0 self-start overflow-hidden rounded-xl border border-[var(--border)]
                     bg-[var(--bg-secondary)] sm:w-40"
        >
          <Image
            src={post.cover_image}
            alt=""
            fill
            sizes="160px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      ) : (
        <span aria-hidden="true" />
      )}
    </Link>
  );
}
