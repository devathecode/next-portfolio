import { Font } from "@react-pdf/renderer";

/** Noto Sans ships the ₹ glyph (U+20B9), which the PDF standard fonts lack. */
export const PDF_FONT = "NotoSans";

let registered = false;

/** `resolve` maps a font filename to a URL (browser) or file path (server). */
export function registerPdfFonts(resolve: (file: string) => string) {
  if (registered) return;
  registered = true;
  Font.register({
    family: PDF_FONT,
    fonts: [
      { src: resolve("NotoSans-Regular.ttf"), fontWeight: 400 },
      { src: resolve("NotoSans-SemiBold.ttf"), fontWeight: 600 },
      { src: resolve("NotoSans-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
    ],
  });
  // No automatic hyphenation: it breaks GSTINs, emails and legal terms mid-word.
  Font.registerHyphenationCallback((word) => [word]);
}
