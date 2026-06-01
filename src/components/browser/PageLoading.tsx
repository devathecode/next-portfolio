"use client";

import { useEffect } from "react";
import { useBrowser } from "./context";

/**
 * Drop into a route's loading.tsx: while the skeleton is on screen the
 * browser keeps its loading bar, tab spinner and "Waiting for…" bubble going.
 */
export default function PageLoading() {
  const { holdLoading } = useBrowser();
  useEffect(() => holdLoading(), [holdLoading]);
  return null;
}
