import { PlusIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import { FAQ } from "@/lib/profile";

/**
 * Plain question-and-answer pairs. Native <details>, so every answer is in the
 * server HTML for search engines and AI assistants, and works without JS.
 * Mirrors the FAQPage structured data on the home page.
 */
export default function Faq() {
  return (
    <section id="faq" className="border-t border-[var(--border)] px-5 py-24 md:py-32 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16">
        <AnimateOnScroll direction="up" className="lg:col-span-4">
          <h2
            className="text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]
                       text-[var(--text-primary)]"
          >
            Questions
          </h2>
          <p className="mt-4 max-w-sm text-[17px] text-[var(--text-secondary)]">
            The short answers, before you send a message.
          </p>
        </AnimateOnScroll>

        <div className="border-t border-[var(--border)] lg:col-span-8">
          {FAQ.map(({ q, a }, i) => (
            <details key={q} open={i === 0} className="group border-b border-[var(--border)]">
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left
                           text-[17px] font-medium text-[var(--text-primary)] transition-colors
                           hover:text-[var(--accent)] [&::-webkit-details-marker]:hidden"
              >
                {q}
                <PlusIcon
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-[62ch] pb-6 text-[15.5px] leading-relaxed text-[var(--text-secondary)]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
