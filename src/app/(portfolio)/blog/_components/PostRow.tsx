import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/supabase";
import ReadState from "@/components/ReadState";
import { postDate, readMinutes } from "./post-meta";

/** One entry in a reading list: date gutter, title in caps and excerpt, a small print. */
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
      className="group grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-t border-[var(--border)] py-8
                 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-8"
    >
      <time dateTime={date.iso} className="t-label hidden pt-2 text-[var(--text-muted)] sm:block">
        {date.label}
      </time>

      <div className="min-w-0">
        <Heading
          className="font-display text-[1.85rem] uppercase leading-[0.95] text-[var(--text-primary)] transition-colors duration-100
                     group-hover:text-[var(--accent)] md:text-[2.2rem]"
        >
          {post.title}
        </Heading>
        {post.excerpt && (
          <p className="mt-3 line-clamp-2 max-w-[65ch] text-[16px] leading-relaxed text-[var(--text-secondary)]">{post.excerpt}</p>
        )}
        <div className="t-label mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[var(--text-muted)]">
          <time dateTime={date.iso} className="sm:hidden">
            {date.label}
          </time>
          <span>{readMinutes(post.content)} min read</span>
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={tag === activeTag ? "bg-[var(--ink)] px-1.5 py-0.5 text-[var(--bone-ink)]" : "text-[var(--text-secondary)]"}>
              {tag}
            </span>
          ))}
          <ReadState slug={post.slug} />
        </div>
      </div>

      {post.cover_image ? (
        <div className="cut-c relative aspect-[16/10] w-24 shrink-0 self-start overflow-hidden bg-[#eee6d6] sm:w-44">
          <Image src={post.cover_image} alt="" fill sizes="176px" className="print object-cover" />
        </div>
      ) : (
        <span aria-hidden="true" />
      )}
    </Link>
  );
}
