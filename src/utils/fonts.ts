import { Geist, Geist_Mono, League_Gothic } from "next/font/google";
import localFont from "next/font/local";

/* Admin panel face. The public site sets its own faces below, so this one
   is not preloaded: public pages never ask for it. */
export const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-sans",
  weight: "variable",
});

/* Code blocks and the source view: code is the only place mono belongs. */
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-mono",
  weight: "variable",
});

/* Title cards: skinny hand-set caps, after Saul Bass's title lettering. */
export const leagueGothic = League_Gothic({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gothic",
  axes: ["wdth"],
});

/* Running text and labels. The width axis gives the condensed label voice.
   Self-hosted: Google's Archivo latin file instanced with fontTools to the
   range the site sets (wght 400-700, wdth 72-100%), 88KB down to 54KB.
   OFL; see src/assets/fonts/OFL-Archivo.txt. */
export const archivo = localFont({
  src: "../assets/fonts/archivo-latin-wght400-700-wdth72-100.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  declarations: [{ prop: "font-stretch", value: "72% 100%" }],
  adjustFontFallback: "Arial",
});
