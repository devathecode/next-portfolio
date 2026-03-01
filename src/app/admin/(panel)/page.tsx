import { supabaseAdmin, Message } from "@/lib/supabase";
import { InboxIcon } from "lucide-react";
import { MessageList } from "./_components/MessageList";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-yellow-600/40 bg-yellow-600/5"
          : "border-gray-800 bg-gray-900"
      }`}
    >
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className={`text-xs mt-0.5 ${highlight ? "text-yellow-500" : "text-gray-500"}`}>
        {label}
      </p>
    </div>
  );
}

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-red-400 text-sm space-y-1">
        <p className="font-semibold">Failed to load messages.</p>
        <p className="text-red-500/70 font-mono text-xs">{error.code}: {error.message}</p>
      </div>
    );
  }

  const msgs = (data ?? []) as Message[];
  const unread = msgs.filter((m) => !m.is_read).length;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Messages</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Contact form submissions from devanshuverma.in
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total" value={msgs.length} />
        <StatCard label="Unread" value={unread} highlight />
        <StatCard label="Read" value={msgs.length - unread} />
      </div>

      {/* Messages list */}
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
        All Messages
      </h2>

      {msgs.length === 0 ? (
        <div className="text-center py-20 text-gray-700">
          <InboxIcon size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No messages yet.</p>
          <p className="text-xs mt-1 text-gray-600">
            Messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <MessageList messages={msgs} />
      )}
    </div>
  );
}
