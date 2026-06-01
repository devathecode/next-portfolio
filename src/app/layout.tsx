import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { geistSans, geistMono } from "@/utils/fonts";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_URL } from "@/lib/site";
import { PROFILE, jsonLd, siteJsonLd } from "@/lib/profile";

const bingVerification = process.env.NEXT_PUBLIC_BING_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PROFILE.name} | ${PROFILE.headline}`,
    template: `%s | ${PROFILE.name}`,
  },
  description: PROFILE.summary,
  applicationName: PROFILE.name,
  keywords: [
    "Devanshu Verma",
    "Frontend Developer India",
    "hire frontend developer",
    "React developer India",
    "Next.js developer",
    "Angular developer",
    "Vue.js developer",
    "TypeScript developer",
    "freelance web developer India",
    "web development portfolio",
  ],
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  category: "technology",
  // No site-wide canonical here: pages set their own, so none inherits the homepage's
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}/blog/feed.xml` },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: `${PROFILE.name} | ${PROFILE.headline}`,
    description: PROFILE.summary,
    siteName: PROFILE.name,
    // An 8s loop of the preview card. iMessage and Discord play it inline;
    // everywhere else shows the still from opengraph-image.ts. Not resolved
    // against metadataBase like images are, so the URL must be absolute.
    videos: [
      {
        url: `${SITE_URL}/og/home-loop.mp4`,
        secureUrl: `${SITE_URL}/og/home-loop.mp4`,
        type: "video/mp4",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} | ${PROFILE.headline}`,
    description: PROFILE.summary,
  },
  // Let search and AI answers quote full snippets and large image previews.
  // No index/follow here, so it never contradicts a page's own noindex.
  robots: {
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  verification: {
    google: "G0CPMFouEDVl1J7WUbmQ_HmTVMQUcZL0QpraFVFx_mY",
    // Bing Webmaster Tools also feeds ChatGPT search and Copilot
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* Runs synchronously before React hydrates — prevents dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(siteJsonLd())} />
        <ThemeProvider>
          <div>{children}</div>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
