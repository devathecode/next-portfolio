/**
 * A live feature test per tip (keyed by tip id), run in the visitor's own
 * browser. Declarations and selectors go through CSS.supports(); at-rules
 * have no CSS.supports() form, so those check for their CSSOM rule class.
 */
const CHECKS: Record<number, () => boolean> = {
  1: () => CSS.supports("container-type: inline-size"),
  2: () => CSS.supports("grid-template-columns: subgrid"),
  3: () => CSS.supports("grid-template-columns: repeat(auto-fit, minmax(10px, 1fr))"),
  4: () => CSS.supports("aspect-ratio: 16 / 9"),
  5: () => CSS.supports("margin-inline: 1px") && CSS.supports("inset-inline-start: 0"),
  6: () => CSS.supports("selector(:has(a))"),
  7: () => CSS.supports("selector(&)"),
  8: () => CSS.supports("selector(:is(a))") && CSS.supports("selector(:where(a))"),
  9: () => "CSSLayerBlockRule" in window,
  10: () => "CSSPropertyRule" in window,
  11: () => CSS.supports("width: calc(var(--x, 1px) * 2)"),
  12: () => CSS.supports("width: clamp(1rem, 2vw, 3rem)"),
  13: () => CSS.supports("text-wrap: balance"),
  14: () => CSS.supports("backdrop-filter: blur(1px)") || CSS.supports("-webkit-backdrop-filter: blur(1px)"),
  15: () => CSS.supports("color: color-mix(in srgb, red, blue)"),
  16: () => CSS.supports("accent-color: red"),
  17: () => CSS.supports("scroll-snap-type: x mandatory"),
  18: () => CSS.supports("overscroll-behavior: contain"),
  19: () => CSS.supports("content-visibility: auto"),
  20: () => CSS.supports('grid-template-areas: "a b"'),
};

export type SupportMap = Record<number, boolean>;

export function runChecks(ids: number[]): SupportMap {
  const out: SupportMap = {};
  for (const id of ids) {
    try {
      out[id] = CHECKS[id]?.() ?? true;
    } catch {
      out[id] = false;
    }
  }
  return out;
}

/** "Chrome 154", "Safari 18", or a generic label. */
export function browserLabel(): string {
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string; version: string }[] } })
    .userAgentData?.brands;
  const brand = brands?.find((b) => !/not.?a.?brand|chromium/i.test(b.brand));
  if (brand) return `${brand.brand.replace(/^Google /, "")} ${brand.version}`;

  const ua = navigator.userAgent;
  const match =
    ua.match(/(Firefox|Edg|OPR)\/(\d+)/) ??
    ua.match(/(Chrome)\/(\d+)/) ??
    (/Safari/.test(ua) ? ua.match(/(Version)\/(\d+)/) : null);
  if (!match) return "your browser";
  const name = { Edg: "Edge", OPR: "Opera", Version: "Safari" }[match[1]] ?? match[1];
  return `${name} ${match[2]}`;
}
