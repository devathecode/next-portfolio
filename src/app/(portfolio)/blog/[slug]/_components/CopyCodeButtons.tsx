"use client";

import { useEffect } from "react";
import { useSite } from "@/components/site/context";

const CHECK_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

/** Wires the copy buttons that highlightCodeBlocks renders into each code block's head. */
export function CopyCodeButtons({ articleId }: { articleId: string }) {
  const { notify } = useSite();

  useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const onClick = async (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy-code]");
      if (!btn) return;
      const code = btn.closest(".code-block")?.querySelector("code")?.innerText ?? "";
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        notify("Couldn't copy: clipboard is blocked here", "info");
        return;
      }
      notify("Code copied");
      if ("copied" in btn.dataset) return;
      const icon = btn.innerHTML;
      btn.innerHTML = CHECK_ICON;
      btn.dataset.copied = "";
      const t = setTimeout(() => {
        btn.innerHTML = icon;
        delete btn.dataset.copied;
        timers.delete(t);
      }, 1500);
      timers.add(t);
    };

    article.addEventListener("click", onClick);
    return () => {
      article.removeEventListener("click", onClick);
      timers.forEach(clearTimeout);
    };
  }, [articleId, notify]);

  return null;
}
