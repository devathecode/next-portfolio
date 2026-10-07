import "server-only";
import { bundledLanguages, codeToHtml, type ThemeRegistration } from "shiki";

/**
 * Code under the projector: bone on ink, with the site's own stock for
 * tokens. Keywords in lit cardinal, strings in lit ochre, keys and
 * constants in lit midnight, comments in muted bone. Every colour clears
 * 4.5:1 on ink in both themes.
 */
const PROJECTOR: ThemeRegistration = {
  name: "projector",
  type: "dark",
  colors: { "editor.background": "#15120f", "editor.foreground": "#ede4d3" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#9a8f7e" } },
    {
      scope: ["keyword", "storage", "storage.type", "keyword.operator.new", "keyword.operator.expression", "entity.name.tag"],
      settings: { foreground: "#ec7a43" },
    },
    { scope: ["string", "string.template", "markup.inline.raw"], settings: { foreground: "#e3a84b" } },
    {
      scope: [
        "constant",
        "constant.numeric",
        "constant.language",
        "support.type.property-name",
        "entity.other.attribute-name",
        "variable.other.property",
        "meta.object-literal.key",
      ],
      settings: { foreground: "#9fb8cc" },
    },
    { scope: ["entity.name.function", "support.function", "entity.name.command"], settings: { foreground: "#f3ecdf" } },
    { scope: ["entity.name.type", "support.type", "support.class", "entity.name.class"], settings: { foreground: "#e9c99a" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#b5aa98" } },
  ],
};

export function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/g, "&");
}

const COPY_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><rect x="9" y="9" width="13" height="13"/><path d="M5 15H3V3h12v2"/></svg>';

const BLOCK = /<pre(?:\s[^>]*)?>\s*<code(?:\s+class="([^"]*)")?[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/g;

/**
 * Colours every <pre><code> block in sanitized post HTML at render time,
 * and gives each a head strip with its language and a copy button
 * (wired up by CopyCodeButtons). Runs after sanitize-html, so the
 * highlighter's inline colours survive; the code itself is re-escaped.
 */
export async function highlightCodeBlocks(html: string): Promise<string> {
  const blocks = Array.from(html.matchAll(BLOCK));
  if (blocks.length === 0) return html;

  const rendered = await Promise.all(
    blocks.map(async ([, className = "", inner]) => {
      const lang = /language-([\w+#-]+)/.exec(className)?.[1]?.toLowerCase() ?? "";
      const code = decodeEntities(inner.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/\n$/, "");
      const pre = await codeToHtml(code, {
        lang: lang in bundledLanguages ? lang : "text",
        theme: PROJECTOR,
        transformers: [
          {
            pre(node) {
              // The block's ink comes from the stylesheet, so it follows the theme
              delete node.properties.style;
            },
          },
        ],
      });
      const label = lang && lang !== "text" && lang !== "plaintext" ? `<span class="code-lang">${lang}</span>` : "<span></span>";
      return (
        `<div class="code-block"><div class="code-head">${label}` +
        `<button type="button" class="code-copy" data-copy-code aria-label="Copy code" title="Copy code">${COPY_ICON}</button>` +
        `</div>${pre}</div>`
      );
    }),
  );

  let i = 0;
  return html.replace(BLOCK, () => rendered[i++]);
}
