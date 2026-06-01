import type { ReactNode } from "react";
import { SetupGate } from "../_components/documents/NeedsSetup";

/** These pages need the tables from supabase/documents.sql. */
export default function Layout({ children }: { children: ReactNode }) {
  return <SetupGate>{children}</SetupGate>;
}
