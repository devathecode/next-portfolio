import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import ReadState from "./ReadState";
import { supabaseAdmin, Post } from "@/lib/supabase";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function publishedOn(post: Post) {
  const raw = post.published_at ?? post.created_at;
  return raw ? dateFormat.format(new Date(raw)) : null;
}

const BlogPreview = async () => {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  const posts = (data ?? []) as Post[];

  if (posts.length === 0) return null;

  const [lead, ...rest] = posts;

  return (
    <section
      id="blog"
      className="border-t border-[var(--border)] px-5 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll direction="up" className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div>
            <h2
              className="text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]
                         text-[var(--text-primary)]"
            >
              Writing
            </h2>
            <p className="mt-4 text-[17px] text-[var(--text-secondary)]">
              Notes on web development, React, Next.js and CSS.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-[var(--border)]
                       bg-[var(--bg-card)] px-4 text-sm font-medium text-[var(--text-primary)]
                       transition-colors duration-200 hover:border-[var(--accent-line)] active:scale-[0.98]"
          >
            All posts
            <ArrowRightIcon size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Lead post */}
          <AnimateOnScroll direction="up" className={rest.length ? "lg:col-span-7" : "lg:col-span-12"}>
            <Link
              href={`/blog/${lead.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)]
                         bg-[var(--bg-card)] shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color]
                         duration-300 hover:-translate-y-1 hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[var(--bg-secondary)]">
                {lead.cover_image ? (
                  <Image
                    src={lead.cover_image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center text-7xl font-semibold text-[var(--border)]"
                  >
                    {lead.title.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
                <PostMeta post={lead} />
                <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)] md:text-2xl">
                  {lead.title}
                </h3>
                {lead.excerpt && (
                  <p className="line-clamp-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {lead.excerpt}
                  </p>
                )}
              </div>
            </Link>
          </AnimateOnScroll>

          {/* More posts */}
          {rest.length > 0 && (
            <ul className="flex flex-col gap-5 lg:col-span-5">
              {rest.map((post, index) => (
                <li key={post.id} className="flex-1">
                  <AnimateOnScroll direction="up" delay={0.08 * (index + 1)} className="h-full">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full gap-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5
                                 transition-colors duration-200 hover:border-[var(--accent-line)]"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                        <PostMeta post={post} />
                        <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[var(--text-primary)]">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      {post.cover_image && (
                        <div className="relative hidden aspect-square w-24 shrink-0 self-start overflow-hidden rounded-xl bg-[var(--bg-secondary)] sm:block">
                          <Image src={post.cover_image} alt="" fill sizes="96px" className="object-cover" />
                        </div>
                      )}
                    </Link>
                  </AnimateOnScroll>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

function PostMeta({ post }: { post: Post }) {
  const date = publishedOn(post);
  const tag = post.tags[0];
  if (!date && !tag) return null;
  return (
    <p className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
      {tag && (
        <span className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
          {tag}
        </span>
      )}
      {date && <time dateTime={post.published_at ?? post.created_at}>{date}</time>}
      <ReadState slug={post.slug} />
    </p>
  );
}

export default BlogPreview;
