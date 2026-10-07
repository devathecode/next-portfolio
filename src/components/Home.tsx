import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRightIcon, ArrowRightIcon, DownloadIcon, SparklesIcon } from "lucide-react";
import { getPublishedPosts, type PostSummary } from "@/lib/posts";
import { RESUME_PDF, RESUME_PDF_NAME } from "@/lib/site";
import AskAIButton from "./site/AskAIButton";
import CursorCut from "./sequence/CursorCut";
import VitalsSlate from "./VitalsSlate";

/** Stagger index for the hero's jump cuts (see .cut-in-up in globals.css). */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Act one, the title card: the claim in skinny caps on a cardinal field, an
 * ink print of the portrait on bone stock, and a cut-paper pointer reaching
 * in for the first action. On desktop it stops short of the fold so the
 * proof strip's timings sit on the first screen; phones get a slate instead.
 */
const HomeComponent = async () => {
  // The newest post gets a line under the actions; a Supabase hiccup just drops the line
  let latest: PostSummary | undefined;
  try {
    [latest] = await getPublishedPosts();
  } catch {}

  return (
    <section
      id="home"
      data-act="Titles"
      data-field="cardinal"
      className="field-cardinal grain relative isolate flex items-center overflow-hidden px-5 pb-16 pt-8 lg:px-10 lg:pb-12
                 lg:min-h-[calc(100svh_-_var(--header-h)_-_10.5rem)]"
    >
      <div className="mx-auto grid w-full max-w-[90rem] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* The claim */}
        <div className="relative z-10 lg:col-span-7 lg:pt-6">
          {/* Kept above the claim: below the actions, the pointer's arm crosses it */}
          {latest && (
            <p className="mb-8 max-w-[56ch] text-[15px] leading-snug text-[var(--text-primary)]">
              <span className="t-label mr-2.5">New on the blog</span>
              <Link href={`/blog/${latest.slug}`} className="link group font-medium">
                {latest.title}
                <ArrowRightIcon size={14} strokeWidth={2.4} className="ml-1 inline-block transition-transform duration-100 group-hover:translate-x-0.5" />
              </Link>
            </p>
          )}
          <h1 className="font-display uppercase">
            <span className="sr-only">Devanshu Verma, frontend developer. </span>
            <span className="cut-in-up block max-w-[16ch] text-balance text-[clamp(2.9rem,6vw,5.9rem)] leading-[0.9] tracking-[0.012em]" style={step(0)}>
              I build web apps that feel
            </span>
            {/* Set by hand: dropped off the baseline and knocked a little askew */}
            <span
              className="cut-in-up ml-[0.06em] mt-1 block text-[clamp(6rem,13.5vw,12rem)] leading-[0.8] tracking-[0.01em]"
              style={step(2)}
            >
              <span className="inline-block translate-y-[0.1em] rotate-[-2.4deg]">instant.</span>
            </span>
          </h1>

          <p className="mt-10 text-[18px] leading-snug text-[var(--text-primary)] sm:text-[clamp(1.125rem,1.4vw,1.3rem)]">
            I&apos;m Devanshu Verma, frontend developer in Noida, India, 5+ years in production.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn btn-plate group">
              See the work
              <ArrowDownRightIcon size={17} strokeWidth={2.2} className="transition-transform duration-100 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            <a href={RESUME_PDF} download={RESUME_PDF_NAME} className="btn btn-line">
              <DownloadIcon size={15} strokeWidth={2.2} />
              Résumé (PDF)
            </a>
            <AskAIButton className="btn btn-line">
              <SparklesIcon size={15} strokeWidth={2.2} />
              Ask my AI
            </AskAIButton>

            {/* The reach, desktop: pinned under this row rather than to the section,
                so whatever sits above the actions, its tip never lands on a button */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[25rem] top-[calc(100%_+_1rem)] z-20 hidden w-[clamp(14rem,18vw,19rem)] origin-top-left rotate-[-34deg] lg:block"
            >
              <CursorCut className="reach-in w-full text-[var(--ink)]" />
            </div>
          </div>

          <VitalsSlate className="mt-8 max-w-md lg:hidden" />

          <p className="t-label mt-8 flex items-center gap-2.5 text-[var(--text-primary)]">
            <span aria-hidden="true" className="h-2.5 w-2.5 bg-[var(--ink-ink)]" />
            Available for full-time roles and freelance projects
          </p>
        </div>

        {/* The portrait: an ink print on bone stock, pasted slightly off square */}
        <figure className="cut-in-right relative mx-auto w-full max-w-[22rem] sm:max-w-[25rem] lg:col-span-5 lg:ml-auto lg:mr-4 lg:max-w-[27rem]">
          <div aria-hidden="true" className="cut-c absolute -left-4 -top-4 h-full w-full rotate-[3deg] bg-[var(--ink)]" />
          <div className="cut-a relative aspect-[4/5] rotate-[-2deg] overflow-hidden bg-[#eee6d6]">
            {/* The ink print is baked into the file (grayscale, contrast 1.35,
                multiplied onto #eee6d6) so the first paint needs no blend or filters */}
            <Image
              src="/images/dev-print.webp"
              alt="Portrait of Devanshu Verma"
              fill
              preload
              fetchPriority="high"
              sizes="(max-width: 640px) 22rem, (max-width: 1024px) 25rem, 27rem"
              className="object-cover object-top"
            />
          </div>
          <figcaption className="t-label absolute -bottom-9 right-1 rotate-[-2deg] text-[var(--text-primary)]">
            Devanshu Verma · Frontend developer
          </figcaption>
        </figure>
      </div>

      {/* The reach: a pointer cut from black paper, its tail drawn out into an arm.
          Rotated about its tip, which sits just past the first action. Phones only;
          desktop pins it under the actions (above). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[62%] top-[83%] z-20 w-[min(46vw,13rem)] origin-top-left rotate-[-30deg] sm:left-[56%] lg:hidden"
      >
        <CursorCut className="reach-in w-full text-[var(--ink)]" />
      </div>
    </section>
  );
};

export default HomeComponent;
