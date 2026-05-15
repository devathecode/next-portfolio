"use client";

import { useEffect, useRef } from "react";
import { sendGAEvent } from "@next/third-parties/google";

interface ReadTrackerProps {
  slug: string;
  title: string;
}

export function ReadTracker({ slug, title }: ReadTrackerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          sendGAEvent("event", "blog_read_complete", {
            post_slug: slug,
            post_title: title,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [slug, title]);

  return <div ref={sentinelRef} />;
}
