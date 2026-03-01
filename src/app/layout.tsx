import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { poppins } from "@/utils/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://devanshuverma.in"),
  title: "Devanshu Verma | Frontend Developer",
  description: `Frontend developer based in India with 4+ years shipping production apps across fintech, e-commerce, and SaaS. Specialising in React, Next.js, Angular, and Vue.js. Open to freelance and full-time opportunities.`,
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
  authors: [{ name: "Devanshu Verma", url: "https://devanshuverma.in" }],
  alternates: {
    canonical: "https://devanshuverma.in",
  },
  openGraph: {
    type: "website",
    url: "https://devanshuverma.in",
    title: "Devanshu Verma | Frontend Developer",
    description:
      "Frontend developer from India building scalable web apps with React, Next.js, Angular & Vue.js.",
    siteName: "Devanshu Verma Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devanshu Verma | Frontend Developer",
    description:
      "Frontend developer from India building scalable web apps with React, Next.js, Angular & Vue.js.",
  },
  icons: {
    icon: "/images/dev.jpeg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Devanshu Verma",
  url: "https://devanshuverma.in",
  jobTitle: "Frontend Developer",
  description:
    "Frontend developer with 4+ years of experience building scalable web apps using React, Next.js, Angular, and Vue.js.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  knowsAbout: ["React", "Next.js", "Angular", "Vue.js", "TypeScript", "Tailwind CSS"],
  sameAs: ["https://github.com/devanshu-verma"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <div>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
