export type Category =
  | "Layout"
  | "Selectors"
  | "Visual Effects"
  | "Typography"
  | "Variables"
  | "Performance";

export type Support = "Widely available" | "Baseline 2023" | "Baseline 2024";

export interface CssTip {
  id: number;
  title: string;
  category: Category;
  support: Support;
  description: string;
  /** The modern/new approach */
  code: string;
  /** Old/legacy approach — when present, card shows Before/After toggle */
  oldCode?: string;
}

export const CATEGORIES: Category[] = [
  "Layout",
  "Selectors",
  "Visual Effects",
  "Typography",
  "Variables",
  "Performance",
];

export const CSS_TIPS: CssTip[] = [
  {
    id: 1,
    title: "Container Queries",
    category: "Layout",
    support: "Baseline 2023",
    description:
      "Respond to a container's own size instead of the viewport. Build truly portable components that adapt wherever they're placed.",
    oldCode: `/* Media queries check the viewport — not the component.
   This breaks when .card lives in a narrow sidebar. */

@media (min-width: 768px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
  }
}

/* You'd need separate breakpoints for every
   layout context the card could appear in. */`,
    code: `.wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 480px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
  }
}`,
  },
  {
    id: 2,
    title: "CSS Grid Subgrid",
    category: "Layout",
    support: "Baseline 2023",
    description:
      "Let nested grid items snap to the parent's tracks. Solves the classic 'cards with misaligned footers' problem without JavaScript.",
    oldCode: `/* Old: JavaScript to equalise card section heights */
const cards = document.querySelectorAll('.card');
let maxHead = 0, maxBody = 0;

cards.forEach(c => {
  maxHead = Math.max(maxHead, c.querySelector('.head').offsetHeight);
  maxBody = Math.max(maxBody, c.querySelector('.body').offsetHeight);
});
cards.forEach(c => {
  c.querySelector('.head').style.height = maxHead + 'px';
  c.querySelector('.body').style.height = maxBody + 'px';
});
/* Breaks on resize. Needs ResizeObserver. Clips overflow. */`,
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.card {
  display: grid;
  grid-row: span 3;
  /* Inherit parent row sizes */
  grid-template-rows: subgrid;
}`,
  },
  {
    id: 3,
    title: "CSS Grid auto-fit vs auto-fill",
    category: "Layout",
    support: "Widely available",
    description:
      "auto-fit collapses empty tracks so columns stretch to fill space. auto-fill keeps them. Use auto-fit for responsive grids with zero media queries.",
    oldCode: `/* Old: a breakpoint for every column count change */
.grid { grid-template-columns: 1fr; }

@media (min-width: 480px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
/* Still jumps — never truly fluid between breakpoints */`,
    code: `/* Columns stretch to fill — no media queries needed */
.responsive-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* Empty slots remain (useful for fixed layouts) */
.fixed-slots {
  grid-template-columns:
    repeat(auto-fill, minmax(260px, 1fr));
}`,
  },
  {
    id: 4,
    title: "aspect-ratio",
    category: "Layout",
    support: "Widely available",
    description:
      "Lock element proportions in one line. Replaces the old padding-top percentage hack entirely.",
    oldCode: `/* The padding-top % hack — 56.25% = 9/16 */
.embed-wrapper {
  position: relative;
  padding-top: 56.25%;
  height: 0;
  overflow: hidden;
}

/* Child must be absolutely positioned */
.embed-wrapper > iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
/* Different ratio? Recalculate the % by hand. */`,
    code: `.embed   { aspect-ratio: 16 / 9; width: 100%; }
.avatar  { aspect-ratio: 1;       width: 3rem; }
.card-img { aspect-ratio: 4 / 3; }
.golden  { aspect-ratio: 1.618; }

/* Works with object-fit too */
img.cover {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}`,
  },
  {
    id: 5,
    title: "CSS Logical Properties",
    category: "Layout",
    support: "Widely available",
    description:
      "Use flow-relative props instead of directional ones. Layouts mirror automatically for RTL languages — no extra CSS needed.",
    oldCode: `/* Physical properties break in RTL languages */
.card {
  margin-left: 1rem;
  padding-top: 1.5rem;
  border-right: 4px solid;
}

/* Forced to duplicate everything for RTL */
[dir="rtl"] .card {
  margin-left: 0;
  margin-right: 1rem;
  border-right: 1px solid;
  border-left: 4px solid;
}
/* Double the code, double the bugs. */`,
    code: `/* Logical — works in any writing mode */
.card {
  margin-inline-start: 1rem;
  padding-block-start: 1.5rem;
  border-inline-end: 4px solid;
}

/* No [dir="rtl"] override needed — ever */

/* Shorthand */
.box {
  margin-inline: auto;   /* left & right */
  padding-block: 2rem;   /* top & bottom */
}`,
  },
  {
    id: 6,
    title: ":has() — The Parent Selector",
    category: "Selectors",
    support: "Baseline 2023",
    description:
      "Select an element based on its descendants. The most requested CSS feature in history — now universally supported.",
    oldCode: `/* Old: JavaScript to style parents based on children */
document.querySelectorAll('.card').forEach(card => {
  if (card.querySelector('img')) {
    card.classList.add('has-image');
  }
});

/* Re-run on every DOM change */
new MutationObserver(() => {
  /* ...same logic again... */
}).observe(document.body, { childList: true, subtree: true });

/* CSS then targets the JS-added class */
.card.has-image { display: grid; grid-template-columns: 120px 1fr; }`,
    code: `/* Card layout shifts when it has an image */
.card:has(img) {
  display: grid;
  grid-template-columns: 120px 1fr;
}

/* Disable submit when form has invalid input */
form:has(input:invalid) .btn-submit {
  opacity: 0.5;
  pointer-events: none;
}

/* Dark nav when hero is visible */
:has(.hero:in-viewport) nav {
  color: white;
}`,
  },
  {
    id: 7,
    title: "CSS Nesting",
    category: "Selectors",
    support: "Baseline 2024",
    description:
      "Write nested rules natively — no Sass or PostCSS needed. Use & to reference the parent and keep related styles together.",
    oldCode: `/* Had to repeat the selector every time */
.button { padding: .5rem 1rem; }
.button:hover { background: oklch(45% 0.18 85); translate: 0 -2px; }
.button.large { padding: .75rem 1.5rem; }
.button.large { font-size: 1.125rem; }
.button .icon { margin-inline-end: .5rem; }

/* Or install Sass/PostCSS just to get nesting:
   npm install sass --save-dev */`,
    code: `.button {
  padding: .5rem 1rem;
  background: oklch(55% 0.18 85);

  &:hover {
    background: oklch(45% 0.18 85);
    translate: 0 -2px;
  }

  &.large {
    padding: .75rem 1.5rem;
    font-size: 1.125rem;
  }

  & .icon {
    margin-inline-end: .5rem;
  }
}`,
  },
  {
    id: 8,
    title: ":is() and :where()",
    category: "Selectors",
    support: "Widely available",
    description:
      ":is() groups selectors and keeps the highest specificity of the list. :where() does the same but with zero specificity — ideal for resets.",
    oldCode: `/* Verbose — hard to read and update */
h1 a, h2 a, h3 a, h4 a { color: inherit; }

article h2, section h2,
article h3, section h3 {
  font-size: clamp(1.25rem, 3vw, 2rem);
}

/* Specificity battles when overriding */
h1, h2, h3, h4 {
  line-height: 1.2;
  margin-block-end: .5em;
}`,
    code: `/* Clean with :is() */
h1 a, h2 a, h3 a, h4 a { color: inherit; }

/* Clean with :is() */
:is(h1, h2, h3, h4) a { color: inherit; }

/* :where() = zero specificity, easy to override */
:where(h1, h2, h3, h4) {
  line-height: 1.2;
  margin-block-end: .5em;
}

/* Combine both */
:is(article, section) :where(h2, h3) {
  font-size: clamp(1.25rem, 3vw, 2rem);
}`,
  },
  {
    id: 9,
    title: "Cascade Layers (@layer)",
    category: "Variables",
    support: "Widely available",
    description:
      "Control specificity at the layer level. Layers declared earlier always lose — no more specificity wars with third-party CSS.",
    oldCode: `/* Old: specificity wars with no clean resolution */

/* Third-party library ships this (0,1,0) */
.btn { background: blue; padding: .5rem 1rem; }

/* Your override needs brute-force specificity */
.page .wrapper .btn { background: red; } /* (0,3,0) */

/* Or the nuclear option — then nothing can override */
.btn { background: red !important; }

/* Import order matters but isn't always controllable */`,
    code: `/* Declare order upfront — first = lowest priority */
@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
}

@layer components {
  .btn { padding: .5rem 1rem; background: blue; }
}

/* Utilities always win regardless of specificity */
@layer utilities {
  .mt-4 { margin-top: 1rem !important; }
}`,
  },
  {
    id: 10,
    title: "@property — Typed Custom Properties",
    category: "Variables",
    support: "Baseline 2024",
    description:
      "Register CSS variables with a type and initial value. Unlocks smooth animation of properties that were previously unanimatable.",
    oldCode: `/* Old: custom properties simply cannot be transitioned */
.swatch {
  --hue: 0;
  background: hsl(var(--hue), 70%, 55%);
  transition: --hue 0.6s ease; /* ← silently ignored */
}
.swatch:hover { --hue: 220; } /* snaps instantly, no animation */

/* Workaround: animate a real property as a proxy */
.swatch {
  filter: hue-rotate(0deg);
  transition: filter 0.6s ease;
}
.swatch:hover { filter: hue-rotate(220deg); }
/* Rotates the entire element, not just background hue */`,
    code: `@property --hue {
  syntax: "<number>";
  initial-value: 0;
  inherits: false;
}

.swatch {
  background: hsl(var(--hue), 70%, 55%);
  transition: --hue 0.6s ease;
}
.swatch:hover { --hue: 220; }

/* Also works for gradients! */
@property --stop {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}`,
  },
  {
    id: 11,
    title: "CSS Custom Properties + calc()",
    category: "Variables",
    support: "Widely available",
    description:
      "Custom properties are more than static variables. Combine them with calc() to build a single-source-of-truth design system.",
    oldCode: `/* Old: Sass variables — compiled away, not dynamic */

/* _variables.scss */
$space: 4px;
$cols: 12;
$gap: $space * 4; /* 16px — baked in at build time */
$radius: 8px;

.grid {
  grid-template-columns: repeat(#{$cols}, 1fr);
  gap: $gap;
}

/* Can't change $cols at runtime or with a media query.
   Needs npm + build pipeline to work at all. */`,
    code: `:root {
  --space: 0.25rem;
  --cols: 12;
  --gap: calc(var(--space) * 4);
  --radius-base: 0.5rem;
  --radius-lg: calc(var(--radius-base) * 2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: var(--gap);
}

@media (max-width: 768px) {
  :root { --cols: 4; }
}`,
  },
  {
    id: 12,
    title: "clamp() — Fluid Typography",
    category: "Typography",
    support: "Widely available",
    description:
      "Fluid font sizes and spacing that scale smoothly between a min and max — no breakpoints, no JavaScript.",
    oldCode: `/* Stepped breakpoints — still jumps, not smooth */
h1 { font-size: 2rem; }

@media (min-width: 480px) {
  h1 { font-size: 2.5rem; }
}
@media (min-width: 768px) {
  h1 { font-size: 3.25rem; }
}
@media (min-width: 1280px) {
  h1 { font-size: 4.5rem; }
}
/* 4 rules just for one heading size */`,
    code: `/* clamp(minimum, preferred, maximum) */

h1 {
  /* 2rem on mobile → 4.5rem on wide screens */
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
  line-height: clamp(1.1, 1.2 + 0.3vw, 1.35);
}

section {
  padding: clamp(2rem, 8vw, 6rem);
}

.container {
  width: min(90%, 1280px);
  margin-inline: auto;
}`,
  },
  {
    id: 13,
    title: "text-wrap: balance & pretty",
    category: "Typography",
    support: "Baseline 2024",
    description:
      "balance distributes words evenly across lines for headings. pretty prevents orphaned last words in paragraphs. Both with one property.",
    oldCode: `/* Guesswork max-width to force even breaks */
h1, h2, h3 {
  max-width: 28ch; /* magic number, breaks on font change */
}

/* Orphan fix required manual BR tags in HTML */
/* <h1>This is a long<br> headline</h1> */

/* Or a JavaScript library:
   import Balancer from 'react-wrap-balancer';
   <Balancer>Long headline</Balancer> */`,
    code: `/* Even line lengths for headings */
h1, h2, h3 {
  text-wrap: balance;
  /* Browser limit: max 4 lines */
}

/* No orphaned words at end of paragraphs */
p, li {
  text-wrap: pretty;
}

/* Before: needed ugly hacks like this */
/* h1 { max-width: 28ch; } */`,
  },
  {
    id: 14,
    title: "backdrop-filter",
    category: "Visual Effects",
    support: "Widely available",
    description:
      "Apply blur, brightness, and saturation to whatever is behind an element. The foundation of modern glassmorphism UI.",
    oldCode: `/* Old: fake blur using a cloned, blurred background */
.glass {
  position: relative;
  overflow: hidden;
}

.glass::before {
  content: "";
  position: absolute;
  inset: -20px; /* oversized to hide blur edges */
  background: inherit;
  filter: blur(16px);
  z-index: -1;
}
/* Doesn't actually blur what's behind the element —
   only blurs a copy of the element's own background */`,
    code: `.glass {
  background: rgb(255 255 255 / 0.1);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: 1rem;
}

.frosted-nav {
  backdrop-filter: blur(24px) brightness(0.85);
  background: rgb(0 0 0 / 0.25);
}`,
  },
  {
    id: 15,
    title: "color-mix()",
    category: "Visual Effects",
    support: "Baseline 2023",
    description:
      "Mix two colors in any color space directly in CSS. Generate tints, shades, and transparent variants from a single token.",
    oldCode: `/* Old: hardcoded hex values — update one, update all */
:root {
  --brand:       #ca8a04;
  --brand-light: #e5b43a; /* manually eyeballed */
  --brand-dark:  #92620a; /* manually eyeballed */
  --brand-50:    rgba(202, 138, 4, 0.5); /* magic number */
}

/* Change --brand? Recalculate every variant by hand.
   Or add Sass just to use darken() / lighten(). */`,
    code: `:root {
  --brand: #ca8a04;

  /* 20% white = tint */
  --brand-light:
    color-mix(in oklch, var(--brand) 80%, white);

  /* 30% black = shade */
  --brand-dark:
    color-mix(in oklch, var(--brand) 70%, black);

  /* Transparent variant */
  --brand-alpha:
    color-mix(in srgb, var(--brand) 15%, transparent);
}`,
  },
  {
    id: 16,
    title: "accent-color",
    category: "Visual Effects",
    support: "Widely available",
    description:
      "Theme all native form controls — checkboxes, radios, range sliders, progress bars — with one line. No custom component needed.",
    oldCode: `/* Old: 30+ lines just to style one checkbox */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #d1d5db;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  background: white;
}
input[type="checkbox"]:checked {
  background: #ca8a04;
  border-color: #ca8a04;
}
input[type="checkbox"]:checked::after {
  content: "✓";
  position: absolute;
  color: white;
  font-size: .7rem;
  top: -2px; left: 1px;
}
/* Still looks inconsistent across browsers */`,
    code: `/* Global brand accent on all controls */
:root {
  accent-color: #ca8a04;
}

/* Or target specific elements */
input[type="checkbox"],
input[type="radio"] {
  accent-color: #ca8a04;
  width: 1.2rem;
  height: 1.2rem;
}

input[type="range"],
progress { accent-color: #ca8a04; }`,
  },
  {
    id: 17,
    title: "Scroll Snap",
    category: "Performance",
    support: "Widely available",
    description:
      "Smooth scroll-stop points with zero JavaScript. Perfect for carousels, image galleries, and full-screen sections.",
    oldCode: `/* Required a library + JS event wiring */
/* npm install swiper — adds ~40KB */

import Swiper from 'swiper';

const swiper = new Swiper('.carousel', {
  slidesPerView: 'auto',
  spaceBetween: 16,
  pagination: { el: '.swiper-pagination' },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});`,
    code: `/* Horizontal carousel */
.carousel {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  display: flex;
  gap: 1rem;
  scrollbar-width: none;
}
.slide {
  scroll-snap-align: start;
  flex: 0 0 300px;
}

/* Full-screen vertical sections */
.page {
  scroll-snap-type: y mandatory;
  height: 100vh;
  overflow-y: scroll;
}`,
  },
  {
    id: 18,
    title: "overscroll-behavior",
    category: "Performance",
    support: "Widely available",
    description:
      "Stop scroll chaining — the UX bug where scrolling inside a modal also scrolls the page. One line, no JS needed.",
    oldCode: `/* Old: block scroll chaining with JS event handling */
modal.addEventListener('wheel', (e) => {
  const { scrollTop, scrollHeight, clientHeight } = modal;
  const atTop    = scrollTop === 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight;

  if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
    e.preventDefault(); /* blocks scroll from reaching page */
  }
}, { passive: false }); /* passive:false kills scroll performance */

/* Also needed for touch: touchstart + touchmove handlers */`,
    code: `/* Modal: don't scroll the page when it ends */
.modal {
  overflow-y: auto;
  overscroll-behavior-y: contain;
}

/* PWA: disable pull-to-refresh */
body {
  overscroll-behavior-y: none;
}

/* Carousel: no horizontal bounce */
.carousel {
  overscroll-behavior-x: contain;
}`,
  },
  {
    id: 19,
    title: "content-visibility: auto",
    category: "Performance",
    support: "Baseline 2024",
    description:
      "Tell the browser to skip rendering off-screen content entirely. Can cut initial render time by 50%+ on content-heavy pages.",
    oldCode: `/* Old: Intersection Observer to defer off-screen renders */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); /* stop watching */
    }
  });
}, { rootMargin: '200px' });

document.querySelectorAll('.section')
  .forEach(el => observer.observe(el));

/* Also needed: CSS to hide/show + skeleton placeholders
   to prevent layout shifts. ~40 lines total. */`,
    code: `.article-section {
  content-visibility: auto;

  /* Hint at rendered height to
     prevent layout shifts */
  contain-intrinsic-size: 0 500px;
}

/* Works great for long lists too */
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}`,
  },
  {
    id: 20,
    title: "grid-template-areas",
    category: "Layout",
    support: "Widely available",
    description:
      "Name your grid regions for visual, readable layout code. Rearranging the layout for different breakpoints is as easy as editing a string.",
    oldCode: `/* Old: absolute positioning for every region */
.page     { position: relative; min-height: 100vh; }
header    { position: absolute; top: 0; left: 0; right: 0; height: 60px; }
aside     { position: absolute; top: 60px; left: 0; width: 240px; bottom: 50px; }
main      { position: absolute; top: 60px; left: 240px; right: 0; bottom: 50px; }
footer    { position: absolute; bottom: 0; left: 0; right: 0; height: 50px; }

/* Change header height from 60px to 80px?
   Update top on aside, main AND footer. Every. Time. */`,
    code: `.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main  "
    "footer footer ";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

header { grid-area: header; }
aside  { grid-area: sidebar; }
main   { grid-area: main;   }
footer { grid-area: footer; }`,
  },
];
