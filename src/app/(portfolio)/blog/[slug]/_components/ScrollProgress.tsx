"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrollable = scrollHeight - clientHeight;
      setProgress(scrollable > 0 ? (scrollTop / scrollable) * 100 : 0);
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-50 h-[3px] bg-[var(--accent)] transition-none"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}
