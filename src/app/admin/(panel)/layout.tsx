import { ReactNode } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { AdminShell } from "./_components/AdminShell";

export const metadata = {
  title: "Admin | devanshuverma.in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const unread = await supabaseAdmin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  return <AdminShell unread={unread.count ?? 0}>{children}</AdminShell>;
}
