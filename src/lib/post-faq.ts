/**
 * The question-and-answer pairs in a post's FAQ section, for FAQPage JSON-LD.
 * A post has one when it has an H2 called "Frequently asked questions" (or
 * "FAQ"), with each question as an H3 and the answer as whatever follows it,
 * up to the next H3 or H2. Writing the section in the editor is enough.
 */

export type FaqItem = { question: string; answer: string };

const FAQ_HEADING = /^(frequently asked questions|faqs?)\b/i;

function text(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?)])/g, "$1")
    .trim();
}

export function extractFaq(html: string): FaqItem[] {
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  const start = h2s.findIndex((m) => FAQ_HEADING.test(text(m[1])));
  if (start === -1) return [];

  const from = h2s[start].index! + h2s[start][0].length;
  const to = h2s[start + 1]?.index ?? html.length;
  const section = html.slice(from, to);

  return section
    .split(/(?=<h3[^>]*>)/i)
    .map((chunk) => {
      const m = chunk.match(/^<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*)$/i);
      return m ? { question: text(m[1]), answer: text(m[2].replace(/<hr\s*\/?>/gi, "")) } : null;
    })
    .filter((item): item is FaqItem => !!item && !!item.question && !!item.answer);
}
