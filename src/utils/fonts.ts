import { Geist, Geist_Mono } from "next/font/google";

/* Geist carries both display and body roles: one family, weight does the hierarchy. */
export const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: "variable",
});
