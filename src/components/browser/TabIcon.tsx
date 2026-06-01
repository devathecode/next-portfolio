import {
  BookOpenIcon,
  CircleCheckIcon,
  FileTextIcon,
  GlobeIcon,
  HashIcon,
  LayoutGridIcon,
  PenLineIcon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import type { BrowserTab } from "./use-tabs";

const ICON = { size: 14, strokeWidth: 1.9 } as const;

/** The site favicon (mirrors src/app/icon.tsx). */
export function SiteFavicon({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-4 w-4 items-center justify-center rounded-[4px] bg-[var(--accent)] text-[10px]
                  font-bold leading-none text-[var(--on-accent)] ${className}`}
    >
      D
    </span>
  );
}

export function TabSpinner() {
  return (
    <span
      aria-hidden="true"
      className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-[var(--chrome-sep)] border-t-[var(--accent)]"
    />
  );
}

export default function TabIcon({ tab }: { tab: BrowserTab }) {
  switch (tab.id) {
    case "home":
      return <SiteFavicon />;
    case "about":
      return <UserIcon aria-hidden="true" {...ICON} />;
    case "work":
      return <LayoutGridIcon aria-hidden="true" {...ICON} />;
    case "contact":
      return <SendIcon aria-hidden="true" {...ICON} />;
    case "blog":
      return <PenLineIcon aria-hidden="true" {...ICON} />;
  }
  const path = tab.href;
  if (path === "/projects") return <LayoutGridIcon aria-hidden="true" {...ICON} />;
  if (path === "/css-tips") return <BookOpenIcon aria-hidden="true" {...ICON} />;
  if (path === "/thankyou") return <CircleCheckIcon aria-hidden="true" {...ICON} />;
  if (path.startsWith("/blog/tag/")) return <HashIcon aria-hidden="true" {...ICON} />;
  if (path.startsWith("/blog/")) return <FileTextIcon aria-hidden="true" {...ICON} />;
  return <GlobeIcon aria-hidden="true" {...ICON} />;
}
