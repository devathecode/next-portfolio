"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** The slice of the Navigation API used here (not in every TS lib yet). */
type NavigationLike = EventTarget & { canGoBack: boolean; canGoForward: boolean };

/**
 * Whether Back and Forward have somewhere to go. The Navigation API only
 * counts this site's own entries, so Back never leaves the portfolio; older
 * browsers fall back to history.length.
 */
export function useHistoryNav() {
  const pathname = usePathname();
  const [state, setState] = useState({ canGoBack: false, canGoForward: false });

  useEffect(() => {
    const nav = (window as unknown as { navigation?: NavigationLike }).navigation;
    const update = () => {
      if (nav && "canGoBack" in nav) {
        setState({ canGoBack: nav.canGoBack, canGoForward: nav.canGoForward });
      } else {
        setState({ canGoBack: window.history.length > 1, canGoForward: false });
      }
    };
    update();
    nav?.addEventListener("currententrychange", update);
    return () => nav?.removeEventListener("currententrychange", update);
  }, [pathname]);

  return state;
}
