"use client";

import { useEffect } from "react";
import { useSite } from "./context";

/**
 * Drop into a route's loading.tsx: while the skeleton is on screen the reel
 * keeps its loading cut running.
 */
export default function PageLoading() {
  const { holdLoading } = useSite();
  useEffect(() => holdLoading(), [holdLoading]);
  return null;
}
