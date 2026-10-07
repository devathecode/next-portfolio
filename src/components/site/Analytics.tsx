"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { outboundDestination, trackEvent } from "@/lib/analytics";
import { RESUME_PDF } from "@/lib/site";

/**
 * Google Analytics without the cost on the first screen: the queue is set up
 * inline so page views and events are never lost, and the 175KB gtag.js
 * loads only once the page is idle. Client-side navigations are counted by
 * GA4's enhanced measurement ("page changes based on browser history").
 *
 * Never loads on /admin or outside production, so your own sessions and
 * local development stay out of the reports.
 */
export default function Analytics({ gaId }: { gaId?: string }) {
  const pathname = usePathname() ?? "";
  const off = !gaId || process.env.NODE_ENV !== "production" || pathname.startsWith("/admin");

  // GA's own opt-out flag, in case gtag.js is already loaded when someone
  // navigates into /admin client-side
  useEffect(() => {
    if (gaId) (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = off;
  }, [gaId, off]);

  // Outbound links and résumé downloads, wherever they are on the page
  useEffect(() => {
    if (off) return;
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement)) return;
      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (url.origin === location.origin && url.pathname === RESUME_PDF) {
        trackEvent("resume_download", { source: location.pathname });
        return;
      }
      const destination = outboundDestination(url);
      if (destination) trackEvent("outbound_click", { destination, url: url.href });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [off]);

  if (off) return null;
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`,
        }}
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
    </>
  );
}
