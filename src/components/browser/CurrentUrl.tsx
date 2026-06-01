"use client";

import { useEffect, useState } from "react";
import { SITE_HOST } from "@/lib/site";

/**
 * The address the visitor asked for. Read after mount: the 404 page is
 * prerendered once (as /_not-found), so the server can't know it.
 */
export default function CurrentUrl() {
  const [path, setPath] = useState("");
  useEffect(() => setPath(window.location.pathname), []);
  return (
    <span className="break-all font-mono text-[13px] text-[var(--text-primary)]">
      https://{SITE_HOST}
      {path}
    </span>
  );
}
