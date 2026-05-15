"use client";

import { useEffect, useState } from "react";

interface ProjectImageProps {
  liveUrl: string;
  alt: string;
  href: string;
}

export default function ProjectImage({ liveUrl, alt, href }: ProjectImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(liveUrl)}&screenshot=true`)
      .then((r) => r.json())
      .then(({ data }) => {
        const url = data?.screenshot?.url;
        if (url) setSrc(url);
        else setErrored(true);
      })
      .catch(() => setErrored(true));
  }, [liveUrl]);

  if (errored) return null;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
      <div className="relative w-full h-44 overflow-hidden bg-[var(--bg-secondary)]">
        {(!src || !loaded) && (
          <div className="absolute inset-0 overflow-hidden bg-[var(--bg-secondary)]">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-[var(--border)]/60 to-transparent" />
          </div>
        )}
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>
    </a>
  );
}
