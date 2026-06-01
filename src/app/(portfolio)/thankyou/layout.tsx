import type { Metadata } from "next";

// Only reached after sending the contact form; keep it out of search results
export const metadata: Metadata = {
  title: "Message sent",
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
