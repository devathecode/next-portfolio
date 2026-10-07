/**
 * Google Analytics events. `gtag` is defined inline from the first byte (see
 * site/Analytics.tsx) and queues calls until gtag.js loads and drains them.
 * On /admin, and outside production, GA never loads and every call is a no-op.
 */

export type OutboundDestination = "github" | "linkedin" | "x" | "email";

/** Every custom event and its parameters. Add new events here first. */
export type AnalyticsEvents = {
  resume_view: Record<string, never>;
  /** `source` is the path the download started from */
  resume_download: { source: string };
  contact_submit: Record<string, never>;
  outbound_click: { destination: OutboundDestination; url: string };
  blog_share: { platform: string; post_slug: string };
  blog_read_complete: { post_slug: string; post_title: string };
};

export function trackEvent<K extends keyof AnalyticsEvents>(
  name: K,
  ...[params]: AnalyticsEvents[K] extends Record<string, never> ? [] : [AnalyticsEvents[K]]
) {
  if (typeof window === "undefined") return;
  (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", name, params ?? {});
}

/** Which outbound link a URL is, if it's one we count. Share intents are tracked as blog_share. */
export function outboundDestination(url: URL): OutboundDestination | null {
  if (url.protocol === "mailto:") return "email";
  const host = url.hostname.replace(/^www\./, "");
  if (host === "github.com") return "github";
  if (host === "linkedin.com" && !url.pathname.startsWith("/sharing")) return "linkedin";
  if ((host === "x.com" || host === "twitter.com") && !url.pathname.startsWith("/intent")) return "x";
  return null;
}
