import SiteShell from "@/components/site/SiteShell";
import { ReactNode } from "react";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
