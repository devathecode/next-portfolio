"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { GA_IGNORE_KEY, isGaIgnored, outboundDestination, trackEvent } from "@/lib/analytics";
import { RESUME_PDF } from "@/lib/site";

/**
 * Google Analytics without the cost on the first screen: the queue is set up
 * inline so page views and events are never lost, and the 175KB gtag.js
 * loads only once the page is idle. Client-side navigations are counted by
 * GA4's enhanced measurement ("page changes based on browser history"), so
 * nothing here sends page_view by hand; doing both would count every
 * navigation twice.
 *
 * Never loads on /admin or outside production. A device with
 * localStorage ga_ignore=1 is opted out too: open any page with ?ga_ignore=1
 * to set it (?ga_ignore=0 clears it). Signing in to the admin sets it, so
 * your own devices drop out of the reports on their own.
 */
export default function Analytics({ gaId }: { gaId?: string }) {
  const pathname = usePathname() ?? "";
  const onAdmin = pathname.startsWith("/admin");
  const off = !gaId || process.env.NODE_ENV !== "production" || onAdmin;

  // Past the login page means signed in, so this is the owner's device
  useEffect(() => {
    if (!onAdmin || pathname.startsWith("/admin/login")) return;
    try {
      localStorage.setItem(GA_IGNORE_KEY, "1");
    } catch {}
  }, [onAdmin, pathname]);

  // GA's own opt-out flag, in case gtag.js is already loaded when someone
  // navigates into /admin client-side
  useEffect(() => {
    if (gaId) (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = off || isGaIgnored();
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
      if (destination) trackEvent("outbound_click", { destination, url: url.href, source: location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [off]);

  if (off) return null;
  // The opt-out flag has to be set before config, or the first page_view goes out anyway
  const optOut = `try{var q=new URLSearchParams(location.search).get('${GA_IGNORE_KEY}');if(q==='1')localStorage.setItem('${GA_IGNORE_KEY}','1');else if(q==='0')localStorage.removeItem('${GA_IGNORE_KEY}');if(localStorage.getItem('${GA_IGNORE_KEY}')==='1')window['ga-disable-${gaId}']=true}catch(e){}`;
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}${optOut}gtag('js',new Date());gtag('config','${gaId}');`,
        }}
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
    </>
  );
}
