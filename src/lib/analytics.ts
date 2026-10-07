/**
 * Google Analytics events. `gtag` is defined inline from the first byte (see
 * site/Analytics.tsx) and queues calls until gtag.js loads and drains them.
 * On /admin, outside production and on opted-out devices, GA never sends and
 * every call is a no-op.
 *
 * Custom parameters only show up in GA4 reports once they're registered as
 * custom dimensions (Admin → Custom definitions): post_slug, destination,
 * url, source, platform.
 */

export type OutboundDestination = "github" | "linkedin" | "x" | "email";

/** localStorage key that opts this device out of GA. Set it with ?ga_ignore=1. */
export const GA_IGNORE_KEY = "ga_ignore";

export function isGaIgnored(): boolean {
  try {
    return localStorage.getItem(GA_IGNORE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Every custom event and its parameters. Add new events here first. */
export type AnalyticsEvents = {
  resume_view: Record<string, never>;
  /** `source` is the path the download started from */
  resume_download: { source: string };
  /** `source` is the path the form was sent from */
  contact_submit: { source: string };
  /** The contact email copied to the clipboard; `source` is the path */
  email_copy: { source: string };
  /** `source` is the path the link was clicked on */
  outbound_click: { destination: OutboundDestination; url: string; source: string };
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
