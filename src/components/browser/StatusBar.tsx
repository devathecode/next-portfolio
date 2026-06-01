"use client";

import { useEffect, useState } from "react";
import { SITE_HOST } from "@/lib/site";
import { useBrowser } from "./context";

/** How the status bubble prints a link: this site under its real host name. */
function describeLink(a: HTMLAnchorElement) {
  const raw = a.getAttribute("href") ?? "";
  if (raw.startsWith("mailto:") || raw.startsWith("tel:")) return raw;
  let url: URL;
  try {
    url = new URL(a.href);
  } catch {
    return raw;
  }
  if (url.origin === window.location.origin) {
    const rest = url.pathname === "/" && !url.search && !url.hash ? "" : url.pathname + url.search + url.hash;
    return SITE_HOST + rest;
  }
  return `${url.host.replace(/^www\./, "")}${url.pathname === "/" ? "" : url.pathname}${url.search}`;
}

/**
 * Chrome's status bubble: the URL of the hovered (or keyboard-focused) link in
 * the bottom corner, and "Waiting for…" while a page loads. It moves to the
 * other corner when the pointer gets close.
 */
export default function StatusBar() {
  const { loading } = useBrowser();
  const [href, setHref] = useState<string | null>(null);
  const [right, setRight] = useState(false);

  useEffect(() => {
    const linkFrom = (target: EventTarget | null) => {
      const a = target instanceof Element ? target.closest("a[href]") : null;
      return a instanceof HTMLAnchorElement ? describeLink(a) : null;
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setHref(linkFrom(e.target));
      setRight(e.clientX < 420 && e.clientY > window.innerHeight - 64);
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) setHref(null);
    };
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as Element;
      if (el.matches?.(":focus-visible")) {
        setRight(false);
        setHref(linkFrom(el));
      }
    };
    const onFocusOut = () => setHref(null);

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const text = href ?? (loading ? `Waiting for ${SITE_HOST}…` : null);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-0 z-[45] max-w-[min(34rem,calc(100vw-2rem))] truncate border-t
                  border-[var(--border)] bg-[var(--chrome-toolbar)] px-2.5 py-1 font-mono text-[11.5px]
                  text-[var(--text-secondary)] shadow-[var(--shadow-card)] transition-opacity duration-150 ${
                    right ? "right-0 rounded-tl-lg border-l" : "left-0 rounded-tr-lg border-r"
                  } ${text ? "opacity-100" : "opacity-0"}`}
    >
      {text ?? " "}
    </div>
  );
}
