import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { Post } from "@/lib/supabase";
import ReadState from "@/components/ReadState";
import { postDate, readMinutes } from "./post-meta";

/** The newest post, given a full card above the reading list. */
export function FeaturedPost({ post }: { post: Post }) {
  const date = postDate(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]
                 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-300
                 hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-card-hover)] lg:grid-cols-[1.1fr_1fr]"
    >
      <div className="relative aspect-[1200/630] overflow-hidden bg-[var(--bg-secondary)] lg:aspect-auto lg:min-h-[340px]">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-8xl font-semibold text-[var(--border)]"
          >
            {post.title.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex flex-col p-6 sm:p-8 lg:p-9">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-[var(--text-muted)]">
          <span className="font-medium text-[var(--accent)]">Latest</span>
          <time dateTime={date.iso}>{date.label}</time>
          <span>{readMinutes(post.content)} min read</span>
        </p>
        <h2
          className="mt-4 text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]
                     sm:text-[1.9rem]"
        >
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-4 line-clamp-3 text-[15.5px] leading-relaxed text-[var(--text-secondary)]">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
          <ReadState slug={post.slug} />
          <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
            Read post
            <ArrowRightIcon size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
