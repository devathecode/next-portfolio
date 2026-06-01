"use client";

import { CommandIcon } from "lucide-react";
import { useBrowser } from "./browser/context";
import { useShortcutLabel } from "@/lib/use-section-nav";

export default function PaletteHint({ className = "" }: { className?: string }) {
  const { openOmnibox } = useBrowser();
  const shortcut = useShortcutLabel();

  return (
    <button
      type="button"
      onClick={openOmnibox}
      aria-haspopup="dialog"
      className={`inline-flex h-9 items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)]
                  px-3 text-[13px] text-[var(--text-secondary)] transition-colors duration-200
                  hover:border-[var(--accent-line)] hover:text-[var(--text-primary)] active:scale-[0.98] ${className}`}
    >
      <CommandIcon size={14} />
      Open command menu
      {shortcut && <kbd className="kbd">{shortcut}</kbd>}
    </button>
  );
}
