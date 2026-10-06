"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface ProjectImageProps {
  liveUrl: string;
  alt: string;
  /** Unused: the caller owns the link. Kept for older call sites. */
  href?: string;
  className?: string;
  /** Shown when no screenshot can be fetched. */
  fallback?: ReactNode;
}

/** A live screenshot of a project's site, for projects with no uploaded image. */
export default function ProjectImage({ liveUrl, alt, className = "h-44", fallback = null }: ProjectImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [near, setNear] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Ask microlink only once the card is close to the viewport
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(liveUrl)}&screenshot=true`)
      .then((r) => r.json())
      .then(({ data }) => {
        const url = data?.screenshot?.url;
        if (url) setSrc(url);
        else setErrored(true);
      })
      .catch(() => setErrored(true));
  }, [liveUrl, near]);

  if (errored) return <>{fallback}</>;

  return (
    <div ref={boxRef} className={`relative w-full overflow-hidden bg-[#e3d9c5] ${className}`}>
      {(!src || !loaded) && <div className="absolute inset-0 animate-pulse bg-[#d9cdb6]" />}
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`object-cover object-top transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
