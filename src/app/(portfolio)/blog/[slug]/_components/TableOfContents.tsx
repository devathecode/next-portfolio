"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

export type TocItem = { id: string; text: string; level: number };

/** Active = the last heading above the reading line (30% down the viewport). */
function useActiveHeading(items: TocItem[]): string {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = "";
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return active;
}

function TocList({ items, active, onPick }: { items: TocItem[]; active: string; onPick?: () => void }) {
  return (
    <ul className="border-l-2 border-[var(--border)]">
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onPick}
              aria-current={isActive ? "location" : undefined}
              className={`-ml-[2px] block border-l-2 py-1.5 pr-2 text-[14px] leading-snug transition-colors duration-100 ${
                item.level === 3 ? "pl-6" : "pl-3.5"
              } ${
                isActive
                  ? "border-[var(--cardinal)] font-semibold text-[var(--text-primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** The sidebar contents: follows the reader, and keeps its live entry in view in long posts. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items);
  const navRef = useRef<HTMLElement>(null);

  // The sidebar scrolls on its own; move it, never the page
  useEffect(() => {
    const nav = navRef.current;
    const box = nav?.parentElement;
    const link = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!box || !link || box.scrollHeight <= box.clientHeight) return;
    const b = box.getBoundingClientRect();
    const l = link.getBoundingClientRect();
    if (l.top >= b.top + 32 && l.bottom <= b.bottom - 32) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({
      top: box.scrollTop + (l.top - b.top) - b.height / 3,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active]);

  if (items.length === 0) return null;

  return (
    <nav ref={navRef} aria-label="Table of contents">
      <p className="t-label mb-3 text-[var(--text-muted)]">On this page</p>
      <TocList items={items} active={active} />
    </nav>
  );
}

/** Phones and tablets have no sidebar: the same contents, folded above the post. */
export function MobileToc({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items);
  const ref = useRef<HTMLDetailsElement>(null);
  const sections = items.filter((i) => i.level === 2).length || items.length;

  return (
    <details ref={ref} className="group mb-10 border-y-2 border-[var(--text-primary)] lg:hidden">
      <summary className="flex h-12 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span className="t-label text-[var(--text-primary)]">On this page</span>
        <span className="flex items-center gap-2 text-[14px] text-[var(--text-muted)]">
          {sections} {sections === 1 ? "section" : "sections"}
          <ChevronDownIcon size={16} className="transition-transform duration-100 group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>
      <nav aria-label="Table of contents" className="pb-4">
        <TocList items={items} active={active} onPick={() => ref.current?.removeAttribute("open")} />
      </nav>
    </details>
  );
}
