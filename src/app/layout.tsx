import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { playfairDisplay, inter, jetbrainsMono } from "@/utils/fonts";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.devanshuverma.in"),
  title: {
    default: "Devanshu Verma | Frontend Developer",
    template: "%s — Devanshu Verma",
  },
  description: `Frontend developer based in India with 5+ years shipping production apps across fintech, e-commerce, and SaaS. Specialising in React, Next.js, Angular, and Vue.js. Open to freelance and full-time opportunities.`,
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
  authors: [{ name: "Devanshu Verma", url: "https://www.devanshuverma.in" }],
  alternates: {
    canonical: "https://www.devanshuverma.in",
  },
  openGraph: {
    type: "website",
    url: "https://www.devanshuverma.in",
    title: "Devanshu Verma | Frontend Developer",
    description:
      "Frontend developer from India building scalable web apps with React, Next.js, Angular & Vue.js.",
    siteName: "Devanshu Verma Portfolio",
    images: [{ url: "/images/dev.jpeg", width: 1200, height: 630, alt: "Devanshu Verma — Frontend Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devanshu Verma | Frontend Developer",
    description:
      "Frontend developer from India building scalable web apps with React, Next.js, Angular & Vue.js.",
  },
  verification: {
    google: "G0CPMFouEDVl1J7WUbmQ_HmTVMQUcZL0QpraFVFx_mY",
    // If it's a different service, you can use custom or other keys:
    // other: {
    //   'me-verification': ['your-custom-code'],
    // },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Devanshu Verma",
  url: "https://www.devanshuverma.in",
  image: "https://www.devanshuverma.in/images/LInkedin_heashot.png",
  jobTitle: "Frontend Developer",
  description:
    "Frontend developer with 5+ years of experience building scalable web apps using React, Next.js, Angular, and Vue.js.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  knowsAbout: [
    "React",
    "Next.js",
    "Angular",
    "Vue.js",
    "TypeScript",
    "Tailwind CSS",
  ],
  sameAs: ["https://www.linkedin.com/in/devthecoder/"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Devanshu Verma",
  url: "https://www.devanshuverma.in",
  description: "Portfolio of Devanshu Verma — Frontend Developer",
  author: { "@type": "Person", name: "Devanshu Verma" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable}`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* Runs synchronously before React hydrates — prevents dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>
          <div>{children}</div>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
