import { describe, expect, it } from "vitest";
import { extractFaq } from "./post-faq";

describe("extractFaq", () => {
  it("reads H3 questions and their answers from the FAQ section", () => {
    const html = `
      <h2 id="intro">Intro</h2><p>Not a question.</p>
      <h3>Not in the FAQ?</h3><p>Ignored.</p>
      <hr />
      <h2 id="faq">Frequently asked questions</h2>
      <h3 id="a">Does Bun support it?</h3>
      <p>Yes. It runs on <code>JavaScriptCore</code>.</p>
      <h3>Why did V8 remove it?</h3>
      <p>Stack traces.</p><ul><li>One</li><li>Two</li></ul>
      <h2>Resources</h2><h3>Not a question either</h3><p>Ignored.</p>`;

    expect(extractFaq(html)).toEqual([
      { question: "Does Bun support it?", answer: "Yes. It runs on JavaScriptCore." },
      { question: "Why did V8 remove it?", answer: "Stack traces. One Two" },
    ]);
  });

  it("accepts an FAQ heading and runs to the end of the post", () => {
    const html = `<h2>FAQ</h2><h3>Is &quot;min-release-age&quot; valid?</h3><p>On npm 11.10.0 &amp; newer.</p>`;
    expect(extractFaq(html)).toEqual([{ question: 'Is "min-release-age" valid?', answer: "On npm 11.10.0 & newer." }]);
  });

  it("returns nothing without an FAQ section or with empty answers", () => {
    expect(extractFaq("<h2>Summary</h2><h3>Q?</h3><p>A.</p>")).toEqual([]);
    expect(extractFaq("<h2>FAQ</h2><h3>Q?</h3>")).toEqual([]);
  });
});
