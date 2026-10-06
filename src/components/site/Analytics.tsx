import Script from "next/script";

/**
 * Google Analytics without the cost on the first screen: the queue is set up
 * inline so page views and events are never lost, and the 175KB gtag.js
 * loads only once the page is idle.
 */
export default function Analytics({ gaId }: { gaId?: string }) {
  if (!gaId) return null;
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
