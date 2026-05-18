import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View and download Devanshu Verma's resume. Frontend developer with 5+ years of experience in React, Next.js, Angular, and Vue.js.",
  alternates: {
    canonical: "https://devanshuverma.in/resume",
  },
  openGraph: {
    url: "https://devanshuverma.in/resume",
    title: "Resume — Devanshu Verma",
    description:
      "Frontend developer with 5+ years of experience building production apps. Specialising in React, Next.js, Angular, and Vue.js.",
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
