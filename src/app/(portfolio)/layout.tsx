import BrowserShell from "@/components/browser/BrowserShell";
import { ReactNode } from "react";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <BrowserShell>{children}</BrowserShell>;
}
