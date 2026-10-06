"use client";

import { CommandIcon } from "lucide-react";
import { useSite } from "./site/context";
import { useShortcutLabel } from "@/lib/use-section-nav";

export default function PaletteHint({ className = "" }: { className?: string }) {
  const { openCommand } = useSite();
  const shortcut = useShortcutLabel();

  return (
    <button
      type="button"
      onClick={openCommand}
      aria-haspopup="dialog"
      className={`btn btn-line btn-sm ${className}`}
    >
      <CommandIcon size={14} strokeWidth={2.2} />
      Open command menu
      {shortcut && <kbd className="kbd">{shortcut}</kbd>}
    </button>
  );
}
