import { supabaseAdmin, type Message } from "@/lib/supabase";
import { PageHeader } from "../_components/ui";
import { MessageInbox } from "../_components/MessageInbox";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ open?: string }>;
}) {
  const { open } = await searchParams;
  const { data } = await supabaseAdmin
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Messages" description="Contact form submissions from your site." />
      <MessageInbox messages={(data ?? []) as Message[]} initialOpenId={open} />
    </div>
  );
}
