"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckIcon, CircleCheckIcon, CircleXIcon, CopyIcon, DownloadIcon, SearchIcon, XIcon } from "lucide-react";
import LinkedInBadge from "./LinkedInBadge";
import Footer from "@/components/Footer";
import { useSite } from "@/components/site/context";
import { CSS_TIPS, CATEGORIES, type CssTip, type Category } from "./tips-data";
import { browserLabel, runChecks, type SupportMap } from "./feature-checks";

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

// ─── Code panel ───────────────────────────────────────────────────────────────
/** Code panels stay dark in both themes, like an editor. */
const CODE_STYLES = `
  .css-code em { font-style: normal; }
  .css-comment { color: #8f8574; }
  .css-string  { color: #b9c48a; }
  .css-at      { color: #e3a84b; font-weight: 600; }
  .css-prop    { color: #f08a5d; }
  .css-val     { color: #ede4d3; }
`;

function CssCodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="css-code overflow-x-auto font-mono text-xs leading-relaxed text-[#cfc5b3] sm:text-[12.5px]"
      dangerouslySetInnerHTML={{ __html: highlightCSS(code) }}
    />
  );
}

// ─── Support line ─────────────────────────────────────────────────────────────
function SupportLine({ supported }: { supported: boolean | undefined }) {
  if (supported === undefined) {
    return <span className="h-3 w-40 animate-pulse bg-[var(--bg-secondary)]" aria-hidden="true" />;
  }
  return supported ? (
    <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
      <CircleCheckIcon size={15} strokeWidth={2.2} className="text-[var(--accent)]" />
      Works in your browser
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
      <CircleXIcon size={14} />
      Not supported in this browser yet
    </span>
  );
}

// ─── Tip card ─────────────────────────────────────────────────────────────────
function TipCard({
  tip,
  copied,
  onCopy,
  supported,
  index,
}: {
  tip: CssTip;
  copied: number | null;
  onCopy: (id: number, code: string) => void;
  supported: boolean | undefined;
  index: number;
}) {
  const reduce = useReducedMotion();
  const isCopied = copied === tip.id;
  const hasComparison = Boolean(tip.oldCode);
  const [view, setView] = useState<"old" | "new">("new");
  const activeCode = hasComparison && view === "old" ? tip.oldCode! : tip.code;

  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : Math.min(index, 8) * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col overflow-hidden bg-[var(--bg-card)] shadow-[inset_0_0_0_1.5px_var(--border)]
                 transition-shadow duration-100 hover:shadow-[inset_0_0_0_2px_var(--text-primary)]"
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <p className="t-label flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[var(--text-muted)]">
          <span className="text-[var(--accent)]">{tip.category}</span>
          <span aria-hidden="true">/</span>
          <span>{tip.support}</span>
        </p>
        <button
          type="button"
          onClick={() => onCopy(tip.id, activeCode)}
          aria-label={`Copy ${view === "old" && hasComparison ? "before" : "after"} code for ${tip.title}`}
          title="Copy code"
          className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--text-muted)] transition-colors duration-100
                     hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
        >
          {isCopied ? <CheckIcon size={15} className="text-[var(--accent)]" /> : <CopyIcon size={15} />}
        </button>
      </div>

      <div className="px-5 pb-5 pt-2">
        <h3 className="font-display text-[1.9rem] uppercase leading-[0.95] text-[var(--text-primary)]">
          {tip.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">{tip.description}</p>
      </div>

      {/* Editor panel */}
      <div className="mx-3 overflow-hidden bg-[#15120f]">
        <div className="flex h-10 items-end gap-0.5 border-b border-[#2c2620] px-2" role={hasComparison ? "tablist" : undefined}>
          {hasComparison ? (
            (["old", "new"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={`-mb-px h-9 border-b-2 px-2.5 font-mono text-[11px] transition-colors duration-100 ${
                  view === v
                    ? "border-[#d4471c] text-[#ede4d3]"
                    : "border-transparent text-[#8f8574] hover:text-[#cfc5b3]"
                }`}
              >
                {v === "old" ? "before.css" : "after.css"}
              </button>
            ))
          ) : (
            <span className="-mb-px h-9 border-b-2 border-[#d4471c] px-2.5 pt-2.5 font-mono text-[11px] text-[#ede4d3]">
              styles.css
            </span>
          )}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: reduce ? 0 : 0.16 }}
            className="p-4"
          >
            <CssCodeBlock code={activeCode} />
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-auto flex min-h-[3rem] items-center px-5 py-3 text-[14px]">
        <SupportLine supported={supported} />
      </p>
    </motion.article>
  );
}

// ─── Live support report ──────────────────────────────────────────────────────
function SupportReport({ support, browser }: { support: SupportMap | null; browser: string }) {
  const total = CSS_TIPS.length;
  const passed = support ? CSS_TIPS.filter((t) => support[t.id]).length : 0;

  return (
    <div className="field-ink cut-b overflow-hidden">
      <div className="flex h-14 items-center justify-between gap-3 border-b border-[var(--border)] px-5">
        <p className="font-display text-[1.6rem] uppercase leading-none text-[var(--text-primary)]">Support report</p>
        <p className="t-label truncate text-[var(--text-muted)]">{support ? browser : "Checking…"}</p>
      </div>

      <div className="p-5 md:p-6">
        <p className="flex items-baseline gap-2">
          <span className="font-display text-[5.5rem] leading-[0.8] text-[var(--accent)]">
            {support ? passed : "–"}
          </span>
          <span className="font-display text-[2rem] leading-none text-[var(--text-muted)]">/ {total}</span>
        </p>
        <p className="mt-3 text-[15px] text-[var(--text-secondary)]">
          {!support
            ? "Testing each feature in your browser…"
            : passed === total
              ? "Every tip on this page works in the browser you're using right now."
              : `${total - passed} of these ${total - passed === 1 ? "tip needs" : "tips need"} a newer browser than the one you're using.`}
        </p>

        <ul className="mt-6 space-y-3">
          {CATEGORIES.map((cat) => {
            const tips = CSS_TIPS.filter((t) => t.category === cat);
            const ok = support ? tips.filter((t) => support[t.id]).length : 0;
            return (
              <li key={cat} className="grid grid-cols-[8rem_1fr_2.5rem] items-center gap-3 text-[14px]">
                <span className="truncate text-[var(--text-secondary)]">{cat}</span>
                <span className="flex gap-1" aria-hidden="true">
                  {tips.map((t) => (
                    <span
                      key={t.id}
                      className={`h-2 flex-1 transition-colors duration-300 ${
                        !support
                          ? "animate-pulse bg-[var(--bg-secondary)]"
                          : support[t.id]
                            ? "bg-[var(--accent)]"
                            : "bg-[var(--bg-secondary)]"
                      }`}
                    />
                  ))}
                </span>
                <span className="t-label text-right text-[var(--text-muted)]">
                  {support ? `${ok}/${tips.length}` : ""}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="border-t border-[var(--border)] px-5 py-3.5 text-[13px] text-[var(--text-muted)] md:px-6">
        Tested live with CSS.supports(). Nothing is looked up.
      </p>
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────
export default function CssTipsClient() {
  const reduce = useReducedMotion();
  const { notify } = useSite();
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [support, setSupport] = useState<SupportMap | null>(null);
  const [browser, setBrowser] = useState("your browser");

  useEffect(() => {
    setSupport(runChecks(CSS_TIPS.map((t) => t.id)));
    setBrowser(browserLabel());
  }, []);

  const filteredTips = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CSS_TIPS.filter((tip) => {
      const matchCat = activeCategory === "All" || tip.category === activeCategory;
      const matchSearch =
        !q ||
        tip.title.toLowerCase().includes(q) ||
        tip.description.toLowerCase().includes(q) ||
        tip.category.toLowerCase().includes(q) ||
        tip.code.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCopy = useCallback(
    (id: number, code: string) => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(id);
        notify("Code copied");
        setTimeout(() => setCopied(null), 2000);
      });
    },
    [notify],
  );

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

  const filters: { id: Category | "All"; count: number }[] = [
    { id: "All", count: CSS_TIPS.length },
    ...CATEGORIES.map((cat) => ({ id: cat, count: categoryCounts[cat] ?? 0 })),
  ];

  const downloadButton = (label: string) => (
    <button
      type="button"
      onClick={handleDownloadPDF}
      disabled={downloading}
      className="btn btn-plate shrink-0 disabled:cursor-wait"
    >
      <DownloadIcon size={16} strokeWidth={2.2} className={downloading ? "animate-bounce" : ""} />
      {downloading ? "Generating PDF…" : label}
    </button>
  );

  return (
    <main>
      <style>{CODE_STYLES}</style>

      {/* ── Hero ── */}
      <section data-act="CSS tips" data-field="ochre" className="field-ochre grain px-5 pb-16 pt-12 md:pb-24 md:pt-16 lg:px-10">
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="t-title cut-in-up max-w-[12ch]">
              Modern CSS <span className="offset-word text-[var(--cardinal)]">tips</span> and tricks
            </h1>
            <p className="mt-7 max-w-[36rem] text-[18px] leading-relaxed text-[var(--text-primary)] md:text-[19px]">
              {CSS_TIPS.length} modern CSS features every frontend developer should know. Container
              queries, cascade layers, :has() and more, each with a real before and after.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              {downloadButton("Download PDF")}
              <p className="t-label flex items-center gap-3 text-[var(--text-secondary)]">
                <span>{CSS_TIPS.length} tips</span>
                <span aria-hidden="true">/</span>
                <span>{CATEGORIES.length} topics</span>
                <span aria-hidden="true">/</span>
                <span>free</span>
              </p>
            </div>

            <LinkedInBadge />
          </div>

          <div className="cut-in-right lg:col-span-5">
            <SupportReport support={support} browser={browser} />
          </div>
        </div>
      </section>

      {/* ── Filters + grid ── */}
      <section aria-label="Tips" data-act="Tips" data-field="paper" className="field-paper px-5 py-14 md:py-20 lg:px-10">
        <div className="mx-auto max-w-[90rem]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div
              className="flex h-12 items-center gap-2.5 bg-[var(--bg-card)] pl-4 pr-1.5 shadow-[inset_0_0_0_1.5px_var(--border)]
                         transition-shadow duration-100 focus-within:shadow-[inset_0_0_0_2.5px_var(--text-primary)] lg:w-80"
            >
              <SearchIcon size={17} strokeWidth={2.2} className="shrink-0 text-[var(--text-primary)]" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search tips"
                aria-label="Search tips"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-[var(--text-primary)] outline-none
                           placeholder:text-[var(--text-muted)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="flex h-9 w-9 items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]
                             hover:text-[var(--text-primary)]"
                >
                  <XIcon size={14} />
                </button>
              )}
            </div>

            <div
              role="tablist"
              aria-label="Filter by topic"
              className="flex max-w-full gap-1 overflow-x-auto [scrollbar-width:none]"
            >
              {filters.map(({ id, count }) => {
                const active = activeCategory === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(id)}
                    className={`t-label relative h-12 shrink-0 whitespace-nowrap px-3.5 transition-colors duration-100 ${
                      active ? "bg-[var(--ink)] text-[var(--bone-ink)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {id}
                    <span className={`ml-2 ${active ? "text-[var(--ochre-lit)]" : "text-[var(--accent)]"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="t-label mb-6 mt-5 min-h-[1rem] text-[var(--text-muted)]" aria-live="polite">
            {(searchQuery || activeCategory !== "All") && filteredTips.length > 0
              ? `Showing ${filteredTips.length} of ${CSS_TIPS.length}`
              : ""}
          </p>

          <motion.div layout={!reduce} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTips.map((tip, i) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  index={i}
                  copied={copied}
                  onCopy={handleCopy}
                  supported={support?.[tip.id]}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredTips.length === 0 && (
            <div className="border-y border-[var(--border)] px-6 py-16 text-center">
              <p className="t-card text-[var(--text-primary)]">No tips match that</p>
              <p className="mt-2 text-[16px] text-[var(--text-secondary)]">Try another word or show every topic.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="btn btn-line btn-sm mt-6"
              >
                Reset filters
              </button>
            </div>
          )}

          {filteredTips.length > 0 && (
            <div className="field-ink cut-b mt-16 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center md:p-8">
              <div>
                <p className="t-card text-[var(--text-primary)]">
                  Keep all {CSS_TIPS.length} tips offline
                </p>
                <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
                  One PDF with every example, for your next code review.
                </p>
              </div>
              {downloadButton("Download all as PDF")}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
