"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Check, Search, X, Layers } from "lucide-react";
import LinkedInBadge from "./LinkedInBadge";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { CSS_TIPS, CATEGORIES, type CssTip, type Category } from "./tips-data";

// ─── CSS syntax highlighter ───────────────────────────────────────────────────
function highlightCSS(raw: string): string {
  // 1. Escape HTML entities first
  let code = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Stash comments & strings so inner content isn't re-processed
  const stash: string[] = [];
  const hide = (replacement: string) => {
    stash.push(replacement);
    return `\x00${stash.length - 1}\x00`;
  };

  code = code.replace(
    /\/\*[\s\S]*?\*\//g,
    (m) => hide(`<em class="css-comment">${m}</em>`)
  );
  code = code.replace(
    /"[^"\n]*"|'[^'\n]*'/g,
    (m) => hide(`<em class="css-string">${m}</em>`)
  );

  // 3. At-rules  (@container, @layer, @property …)
  code = code.replace(
    /(@[\w-]+)/g,
    `<em class="css-at">$1</em>`
  );

  // 4. Property + value pairs  (multiline mode)
  code = code.replace(
    /^(\s*)([\w-]+)(\s*:\s*)([^;{}\n\x00]+)(;?)/gm,
    (_, ws, prop, sep, val, sc) =>
      `${ws}<em class="css-prop">${prop}</em>${sep}<em class="css-val">${val}</em>${sc}`
  );

  // 5. Restore stashed tokens
  stash.forEach((tok, i) => {
    code = code.split(`\x00${i}\x00`).join(tok);
  });

  return code;
}

// ─── Code block component ─────────────────────────────────────────────────────
function CssCodeBlock({ code }: { code: string }) {
  return (
    <>
      <style>{`
        .css-code em { font-style: normal; }
        .css-comment { color: #6b7280; font-style: italic !important; }
        .css-string  { color: #fbbf24; }
        .css-at      { color: #f59e0b; font-weight: 600; }
        .css-prop    { color: #c084fc; }
        .css-val     { color: #34d399; }
      `}</style>
      <pre
        className="css-code text-xs sm:text-[13px] leading-relaxed text-gray-300 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: highlightCSS(code) }}
      />
    </>
  );
}

// ─── Support badge ────────────────────────────────────────────────────────────
const supportColor: Record<CssTip["support"], string> = {
  "Widely available": "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10",
  "Baseline 2023":    "text-sky-600    dark:text-sky-400    bg-sky-50    dark:bg-sky-400/10",
  "Baseline 2024":    "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-400/10",
};

// ─── Category badge colors ────────────────────────────────────────────────────
const catColor: Record<Category, string> = {
  Layout:           "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-400/10",
  Selectors:        "text-pink-700   dark:text-pink-400   bg-pink-50   dark:bg-pink-400/10",
  "Visual Effects": "text-blue-700   dark:text-blue-400   bg-blue-50   dark:bg-blue-400/10",
  Typography:       "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-400/10",
  Variables:        "text-teal-700   dark:text-teal-400   bg-teal-50   dark:bg-teal-400/10",
  Performance:      "text-rose-700   dark:text-rose-400   bg-rose-50   dark:bg-rose-400/10",
};

// ─── Tip card ─────────────────────────────────────────────────────────────────
function TipCard({
  tip,
  copied,
  onCopy,
  index,
}: {
  tip: CssTip;
  copied: number | null;
  onCopy: (id: number, code: string) => void;
  index: number;
}) {
  const isCopied = copied === tip.id;
  const hasComparison = Boolean(tip.oldCode);
  const [view, setView] = useState<"old" | "new">("new");
  const activeCode = hasComparison && view === "old" ? tip.oldCode! : tip.code;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col rounded-xl border border-gray-200 dark:border-white/[0.07]
                 bg-white dark:bg-white/[0.02]
                 hover:border-yellow-600/40 dark:hover:border-yellow-600/30
                 hover:shadow-lg hover:shadow-yellow-600/5
                 transition-all duration-300 overflow-hidden"
    >
      {/* Card header */}
      <div className="p-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${catColor[tip.category]}`}
          >
            {tip.category}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${supportColor[tip.support]}`}
          >
            {tip.support}
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={() => onCopy(tip.id, activeCode)}
          title="Copy code"
          className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500
                     hover:bg-yellow-600/10 transition-all duration-150"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isCopied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check size={14} className="text-emerald-500" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Copy size={14} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Title + description */}
      <div className="px-5 pb-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 leading-snug">
          {tip.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {tip.description}
        </p>
      </div>

      {/* Code block */}
      <div className="mt-auto mx-5 mb-5 rounded-lg bg-gray-950 border border-white/[0.05] overflow-hidden">
        {/* Before / After toggle — only when oldCode exists */}
        {hasComparison && (
          <div className="flex items-center gap-px p-2 pb-0">
            <button
              onClick={() => setView("old")}
              className={`relative px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-150
                ${view === "old"
                  ? "bg-red-500/15 text-red-400"
                  : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {view === "old" && (
                <motion.span
                  layoutId={`tab-bg-${tip.id}`}
                  className="absolute inset-0 rounded-md bg-red-500/15"
                />
              )}
              <span className="relative">Before</span>
            </button>
            <button
              onClick={() => setView("new")}
              className={`relative px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-150
                ${view === "new"
                  ? "text-emerald-400"
                  : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {view === "new" && (
                <motion.span
                  layoutId={`tab-bg-${tip.id}`}
                  className="absolute inset-0 rounded-md bg-emerald-500/15"
                />
              )}
              <span className="relative">After</span>
            </button>

            {/* Animated dot indicator */}
            <span
              className={`ml-auto mr-1 w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                view === "old" ? "bg-red-400" : "bg-emerald-400"
              }`}
            />
          </div>
        )}

        {/* Animated code area */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="p-4"
            >
              <CssCodeBlock code={activeCode} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────
export default function CssTipsClient() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  const filteredTips = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CSS_TIPS.filter((tip) => {
      const matchCat =
        activeCategory === "All" || tip.category === activeCategory;
      const matchSearch =
        !q ||
        tip.title.toLowerCase().includes(q) ||
        tip.description.toLowerCase().includes(q) ||
        tip.category.toLowerCase().includes(q) ||
        tip.code.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCopy = useCallback((id: number, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  const trackDownload = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conn = (navigator as any).connection;
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screen:       `${screen.width}x${screen.height}`,
          viewport:     `${window.innerWidth}x${window.innerHeight}`,
          language:     navigator.language,
          timezone:     Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer:     document.referrer || null,
          page_url:     window.location.href,
          utm_source:   params.get("utm_source"),
          utm_medium:   params.get("utm_medium"),
          utm_campaign: params.get("utm_campaign"),
          connection:   conn?.effectiveType ?? null,
        }),
      }).catch(() => {}); // fire-and-forget, never block the PDF
    } catch {
      // silently ignore — tracking must never break the main action
    }
  };

  const handleDownloadPDF = async () => {
    trackDownload();
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentW = pageW - margin * 2;
      let y = margin;

      const checkBreak = (needed: number) => {
        if (y + needed > pageH - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // ── Cover header ──
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, pageW, 38, "F");

      doc.setFontSize(20);
      doc.setTextColor(202, 138, 4);
      doc.text("Modern CSS Tips & Tricks", margin, 17);

      doc.setFontSize(8.5);
      doc.setTextColor(140, 140, 140);
      doc.text(
        `${CSS_TIPS.length} tips  •  devanshuverma.in  •  ${new Date().getFullYear()}`,
        margin,
        27
      );

      doc.setDrawColor(202, 138, 4);
      doc.setLineWidth(0.4);
      doc.line(margin, 33, pageW - margin, 33);

      y = 46;

      // ── Tips ──
      for (const tip of CSS_TIPS) {
        checkBreak(55);

        // Category + support row
        doc.setFontSize(7);
        doc.setTextColor(161, 98, 7);
        doc.text(tip.category.toUpperCase(), margin, y);

        doc.setTextColor(100, 100, 100);
        doc.text(`  ·  ${tip.support}`, margin + doc.getTextWidth(tip.category.toUpperCase()), y);
        y += 6;

        // Title
        checkBreak(10);
        doc.setFontSize(13);
        doc.setTextColor(18, 18, 18);
        doc.text(tip.title, margin, y);
        y += 7;

        // Description
        checkBreak(16);
        doc.setFontSize(9);
        doc.setTextColor(75, 75, 75);
        const descLines = doc.splitTextToSize(tip.description, contentW);
        doc.text(descLines, margin, y);
        y += descLines.length * 4.8 + 3;

        // Code block
        const codeLines = tip.code.split("\n");
        const codeH = codeLines.length * 4.2 + 10;
        checkBreak(codeH + 4);

        doc.setFillColor(15, 15, 15);
        doc.roundedRect(margin, y, contentW, codeH, 2, 2, "F");

        doc.setFont("Courier", "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(190, 190, 190);
        codeLines.forEach((line, li) => {
          doc.text(line, margin + 4, y + 6 + li * 4.2);
        });
        doc.setFont("helvetica", "normal");

        y += codeH + 12;

        // Separator
        if (tip.id < CSS_TIPS.length) {
          doc.setDrawColor(230, 230, 230);
          doc.setLineWidth(0.15);
          doc.line(margin, y - 5, pageW - margin, y - 5);
        }
      }

      // ── Footer on last page ──
      doc.setFontSize(7.5);
      doc.setTextColor(160, 160, 160);
      doc.text("devanshuverma.in", margin, pageH - 8);
      doc.text("Generated with ♥", pageW - margin, pageH - 8, { align: "right" });

      doc.save("modern-css-tips-devanshuverma.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {};
    CATEGORIES.forEach((cat) => {
      counts[cat] = CSS_TIPS.filter((t) => t.category === cat).length;
    });
    return counts;
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <section className="pt-16 pb-12 md:pt-20 md:pb-16 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left col ── */}
          <div>
            <AnimateOnScroll direction="up">
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-600/10 border border-yellow-600/20 text-yellow-600 dark:text-yellow-500 text-xs font-semibold uppercase tracking-widest">
                  <Layers size={11} />
                  CSS Tips
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-5">
                Modern{" "}
                <span className="text-yellow-600">CSS</span>{" "}
                Tips &amp; Tricks
              </h1>

              <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-8">
                A curated collection of modern CSS features every frontend developer
                should know. Container queries, cascade layers, :has(), and more —
                each with a real code example.
              </p>
            </AnimateOnScroll>

            {/* Stats + Download row */}
            <AnimateOnScroll direction="up" delay={0.1}>
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-black text-yellow-600">{CSS_TIPS.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mt-0.5">Tips</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-yellow-600">{CATEGORIES.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mt-0.5">Categories</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-yellow-600">Free</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mt-0.5">Always</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                             bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-600/60
                             text-black text-sm font-semibold
                             transition-all duration-200
                             hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-600/25
                             disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {downloading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="inline-block"
                      >
                        <Download size={15} />
                      </motion.span>
                      Generating…
                    </>
                  ) : (
                    <>
                      <Download size={15} />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </AnimateOnScroll>

            {/* LinkedIn official badge */}
            <LinkedInBadge />
          </div>

          {/* ── Right col — decorative code panel ── */}
          <AnimateOnScroll direction="right" delay={0.15} className="hidden lg:block">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-6 bg-yellow-600/5 dark:bg-yellow-600/8 rounded-3xl blur-3xl pointer-events-none" />

              {/* Code editor window */}
              <div className="relative rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-gray-950 shadow-xl shadow-gray-200/60 dark:shadow-black/40 overflow-hidden">

                {/* Window chrome */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.06] px-3 py-0.5 rounded-md font-mono tracking-wide">
                      styles.css
                    </span>
                  </div>
                </div>

                {/* Code snippets */}
                <div className="p-5 space-y-5">
                  {/* Snippet 1 */}
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mb-2 uppercase tracking-widest">Container Queries</p>
                    <pre className="text-[12.5px] leading-relaxed font-mono css-code"
                      dangerouslySetInnerHTML={{ __html: highlightCSS(
`.wrapper {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { display: grid; }
}`
                      )}}
                    />
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-white/[0.05]" />

                  {/* Snippet 2 */}
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mb-2 uppercase tracking-widest">:has() Parent Selector</p>
                    <pre className="text-[12.5px] leading-relaxed font-mono css-code"
                      dangerouslySetInnerHTML={{ __html: highlightCSS(
`form:has(input:invalid) .btn {
  opacity: 0.5;
  pointer-events: none;
}`
                      )}}
                    />
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-white/[0.05]" />

                  {/* Snippet 3 */}
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mb-2 uppercase tracking-widest">Fluid Typography</p>
                    <pre className="text-[12.5px] leading-relaxed font-mono css-code"
                      dangerouslySetInnerHTML={{ __html: highlightCSS(
`h1 {
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
  text-wrap: balance;
}`
                      )}}
                    />
                  </div>
                </div>

                {/* Footer bar */}
                <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02] flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 dark:text-gray-600 font-mono">20 tips inside →</span>
                  <div className="flex gap-1">
                    {CATEGORIES.map((cat) => (
                      <span key={cat} className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${catColor[cat]}`}>
                        {cat.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating tip count badge */}
              <div className="absolute -top-4 -right-4 bg-yellow-600 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-yellow-600/30">
                {CSS_TIPS.length} tips
              </div>
            </div>
          </AnimateOnScroll>

        </section>
      </div>

      {/* ── Filters + Grid ── */}
      <div className="w-full bg-gray-50 dark:bg-white/[0.02] border-y border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">

          {/* Search + category filters */}
          <AnimateOnScroll direction="up" delay={0.05}>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search tips…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 text-sm rounded-lg
                             border border-gray-200 dark:border-white/10
                             bg-white dark:bg-white/[0.03]
                             text-gray-900 dark:text-white
                             placeholder:text-gray-400
                             focus:outline-none focus:border-yellow-600/50 dark:focus:border-yellow-600/40
                             transition-colors duration-150"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                    ${
                      activeCategory === "All"
                        ? "bg-yellow-600 text-black shadow-sm"
                        : "border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-yellow-600/40 hover:text-yellow-600 dark:hover:text-yellow-500 bg-white dark:bg-white/[0.02]"
                    }`}
                >
                  All{" "}
                  <span className="opacity-60 font-normal">{CSS_TIPS.length}</span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                      ${
                        activeCategory === cat
                          ? "bg-yellow-600 text-black shadow-sm"
                          : "border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-yellow-600/40 hover:text-yellow-600 dark:hover:text-yellow-500 bg-white dark:bg-white/[0.02]"
                      }`}
                  >
                    {cat}{" "}
                    <span className="opacity-60 font-normal">{categoryCounts[cat]}</span>
                  </button>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Results count */}
          <AnimatePresence>
            {(searchQuery || activeCategory !== "All") && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-xs text-gray-400 mb-5"
              >
                {filteredTips.length === 0
                  ? "No tips matched."
                  : `Showing ${filteredTips.length} of ${CSS_TIPS.length} tips`}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Card grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredTips.map((tip, i) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  index={i}
                  copied={copied}
                  onCopy={handleCopy}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          <AnimatePresence>
            {filteredTips.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-20 text-center"
              >
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-gray-900 dark:text-white font-semibold mb-1">
                  No tips found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try a different search or clear the filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="mt-4 text-sm text-yellow-600 hover:underline"
                >
                  Reset filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          {filteredTips.length > 0 && (
            <AnimateOnScroll direction="up" delay={0.1}>
              <div className="mt-14 pt-10 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                    Want all {CSS_TIPS.length} tips in one file?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Download the full PDF — great for offline reference.
                  </p>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                             bg-yellow-600 hover:bg-yellow-500 disabled:opacity-60
                             text-black text-sm font-semibold
                             transition-all duration-200 whitespace-nowrap
                             hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-600/25
                             disabled:cursor-not-allowed"
                >
                  <Download size={15} />
                  {downloading ? "Generating PDF…" : "Download All as PDF"}
                </button>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
