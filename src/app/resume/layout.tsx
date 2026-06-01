import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View and download Devanshu Verma's resume. Frontend developer with 5+ years of experience in React, Next.js, Angular, and Vue.js.",
  alternates: {
    canonical: "https://www.devanshuverma.in/resume",
  },
  openGraph: {
    url: "https://www.devanshuverma.in/resume",
    title: "Resume | Devanshu Verma",
    description:
      "Frontend developer with 5+ years of experience building production apps. Specialising in React, Next.js, Angular, and Vue.js.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Devanshu Verma, Frontend Developer" }],
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
