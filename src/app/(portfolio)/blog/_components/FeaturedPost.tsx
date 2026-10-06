import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { Post } from "@/lib/supabase";
import ReadState from "@/components/ReadState";
import { postDate, readMinutes } from "./post-meta";

/** The newest post: its cover as a print on bone stock beside the title card. */
export function FeaturedPost({ post }: { post: Post }) {
  const date = postDate(post);

  return (
    <Link href={`/blog/${post.slug}`} className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="cut-a rotate-[-0.8deg] bg-[#eee6d6] p-2 transition-transform duration-150 group-hover:rotate-0 sm:p-2.5 lg:col-span-7">
        <div className="relative aspect-[1200/630] overflow-hidden bg-[#eee6d6]">
          {post.cover_image ? (
            <Image src={post.cover_image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 56vw" className="print object-cover" />
          ) : (
            <span
              aria-hidden="true"
              className="field-cardinal absolute inset-0 flex items-end p-6 font-display text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.85]"
            >
              {post.title}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:col-span-5">
        <h2 className="t-card text-[var(--text-primary)] decoration-2 underline-offset-[0.12em] group-hover:underline">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-5 line-clamp-3 text-[17px] leading-relaxed text-[var(--text-secondary)]">{post.excerpt}</p>
        )}
        <p className="t-label mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-muted)]">
          <time dateTime={date.iso}>{date.label}</time>
          <span>{readMinutes(post.content)} min read</span>
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <span className="btn btn-plate btn-sm">
            Read post
            <ArrowRightIcon size={15} strokeWidth={2.2} className="transition-transform duration-100 group-hover:translate-x-0.5" />
          </span>
          <span className="t-label text-[var(--text-muted)]">
            <ReadState slug={post.slug} />
          </span>
        </div>
      </div>
    </Link>
  );
}
