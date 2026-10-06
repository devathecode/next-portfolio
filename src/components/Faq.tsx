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
    <section id="faq" data-act="Questions" data-field="paper" className="field-paper px-5 py-24 md:py-32 lg:px-10">
      <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-12 lg:gap-10">
        <AnimateOnScroll direction="left" className="lg:col-span-4">
          <h2 className="t-act">Questions</h2>
          <p className="mt-6 max-w-sm text-[18px] leading-relaxed text-[var(--text-secondary)]">
            The short answers, before you send a message.
          </p>
        </AnimateOnScroll>

        <div className="border-t-2 border-[var(--text-primary)] lg:col-span-8">
          {FAQ.map(({ q, a }, i) => (
            <details key={q} open={i === 0} className="group border-b border-[var(--border)]">
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left
                           text-[19px] font-semibold text-[var(--text-primary)] transition-colors duration-100
                           hover:text-[var(--accent)] [&::-webkit-details-marker]:hidden"
              >
                {q}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--ink)] text-[var(--bone-ink)]
                             transition-colors duration-100 group-open:bg-[var(--cardinal)]"
                >
                  <PlusIcon size={18} strokeWidth={2.4} className="transition-transform duration-150 group-open:rotate-45" />
                </span>
              </summary>
              <p className="max-w-[62ch] pb-7 text-[17px] leading-relaxed text-[var(--text-secondary)]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
