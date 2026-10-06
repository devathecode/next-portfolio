import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import CursorCut from "@/components/sequence/CursorCut";

/** After the contact form: a cardinal end card. The message is in. */
export default function ThankYouPage() {
  return (
    <main
      data-act="Sent"
      data-field="cardinal"
      className="field-cardinal grain relative flex min-h-[calc(100dvh_-_var(--header-h))] items-center overflow-hidden px-5 py-20 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[58%] w-[min(40vw,16rem)] origin-top-left rotate-[-36deg] md:right-[18%]"
      >
        <CursorCut className="reach-in w-full text-[var(--ink)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <h1 className="font-display uppercase">
          <span className="cut-in-up block text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.9]">Thanks for</span>
          <span
            className="cut-in-up block text-[clamp(5rem,14vw,12.5rem)] leading-[0.82] text-[var(--ink-ink)]"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <span className="offset-word">reaching out.</span>
          </span>
        </h1>

        <p className="mt-9 max-w-[42ch] text-[19px] leading-relaxed text-[var(--text-primary)]">
          Your message is in. I&apos;ll get back to you as soon as I can, usually within 24 hours.
        </p>

        <Link href="/" className="btn btn-plate group mt-10">
          <ArrowLeftIcon size={16} strokeWidth={2.2} className="transition-transform duration-100 group-hover:-translate-x-0.5" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
