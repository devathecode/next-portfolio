"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string; level: number };

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        On this page
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? "0.75rem" : 0 }}>
            <a
              href={`#${item.id}`}
              className={`block text-[12px] leading-snug transition-colors duration-150 ${
                active === item.id
                  ? "text-[var(--accent)] font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
