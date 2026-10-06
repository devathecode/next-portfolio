/**
 * Google Analytics events. `gtag` is defined inline from the first byte (see
 * site/Analytics.tsx) and queues calls until gtag.js loads and drains them.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", name, params);
}
