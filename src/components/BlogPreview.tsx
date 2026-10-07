import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import ReadState from "./ReadState";
import { getPublishedPosts, type PostSummary } from "@/lib/posts";
import { POPULAR_POSTS } from "@/lib/site";
import { PostRow } from "@/app/(portfolio)/blog/_components/PostRow";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function publishedOn(post: PostSummary) {
  const raw = post.published_at ?? post.created_at;
  return raw ? dateFormat.format(new Date(raw)) : null;
}

/**
 * The writing act, on olive: the latest post as a print, the next two as
 * title lines, then the most-read posts so search's favourites are one click
 * from the home page. A post is listed once, under "Most read" if it's there.
 */
const BlogPreview = async () => {
  const all = await getPublishedPosts();
  const popular = POPULAR_POSTS.map((slug) => all.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  const posts = all.filter((p) => !POPULAR_POSTS.includes(p.slug)).slice(0, 3);

  if (posts.length === 0 && popular.length === 0) return null;

  const [lead, ...rest] = posts;

  return (
    <section id="blog" data-act="Writing" data-field="olive" className="field-olive grain px-5 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-[90rem]">
        <AnimateOnScroll direction="left" className="mb-12 flex flex-wrap items-end justify-between gap-8 md:mb-16">
          <div>
            <h2 className="t-act">Writing</h2>
            <p className="mt-6 max-w-[44ch] text-[18px] leading-relaxed text-[var(--text-secondary)]">
              Notes on web development, React, Next.js and CSS. The newest and the most read are below; the rest are on{" "}
              <Link href="/blog" className="link font-medium text-[var(--text-primary)]">
                the frontend and JavaScript blog
              </Link>
              .
            </p>
          </div>
          <Link href="/blog" className="btn btn-line group">
            All blog posts
            <ArrowRightIcon size={16} strokeWidth={2.2} className="transition-transform duration-100 group-hover:translate-x-0.5" />
          </Link>
        </AnimateOnScroll>

        {lead && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Lead post */}
            <Link href={`/blog/${lead.slug}`} className={`group block ${rest.length ? "lg:col-span-7" : "lg:col-span-12"}`}>
              <div className="cut-b rotate-[-0.8deg] bg-[#eee6d6] p-2 transition-transform duration-150 group-hover:rotate-0 sm:p-2.5">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#eee6d6]">
                  {lead.cover_image ? (
                    <Image src={lead.cover_image} alt="" fill sizes="(max-width: 1024px) 100vw, 56vw" className="print object-cover" />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="field-cardinal absolute inset-0 flex items-end p-6 font-display text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.85]"
                    >
                      {lead.title}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-7">
                <h3 className="t-card max-w-[30ch] text-[var(--text-primary)] decoration-2 underline-offset-[0.12em] group-hover:underline">
                  {lead.title}
                </h3>
                {lead.excerpt && (
                  <p className="mt-4 line-clamp-2 max-w-[58ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">
                    {lead.excerpt}
                  </p>
                )}
                <div className="mt-4">
                  <PostMeta post={lead} />
                </div>
              </div>
            </Link>

            {/* More posts */}
            {rest.length > 0 && (
              <ul className="border-t-2 border-[var(--text-primary)] lg:col-span-5">
                {rest.map((post) => (
                  <li key={post.id} className="border-b border-[var(--border)]">
                    <Link href={`/blog/${post.slug}`} className="group flex gap-5 py-7">
                      <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <h3 className="font-display text-[2rem] uppercase leading-[0.95] text-[var(--text-primary)] decoration-2 underline-offset-[0.12em] group-hover:underline">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="line-clamp-2 text-[15.5px] leading-relaxed text-[var(--text-secondary)]">{post.excerpt}</p>
                        )}
                        <PostMeta post={post} />
                      </div>
                      {post.cover_image && (
                        <div className="cut-c relative hidden aspect-square w-24 shrink-0 self-start overflow-hidden bg-[#eee6d6] sm:block">
                          <Image src={post.cover_image} alt="" fill sizes="96px" className="print object-cover" />
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {popular.length > 0 && (
          <div className={lead ? "mt-20 md:mt-28" : ""}>
            <h3 className="t-card mb-6 text-[var(--text-primary)]">Most read</h3>
            <div className="border-b border-[var(--border)]">
              {popular.map((post) => (
                <PostRow key={post.id} post={post} heading="h4" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

function PostMeta({ post }: { post: PostSummary }) {
  const date = publishedOn(post);
  const tag = post.tags[0];
  if (!date && !tag) return null;
  return (
    <p className="t-label flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-muted)]">
      {tag && <span className="text-[var(--text-primary)]">{tag}</span>}
      {date && <time dateTime={post.published_at ?? post.created_at}>{date}</time>}
      <ReadState slug={post.slug} />
    </p>
  );
}

export default BlogPreview;
