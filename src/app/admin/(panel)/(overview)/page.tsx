import Link from "next/link";
import { redirect } from "next/navigation";
import {
  InboxIcon,
  FolderKanbanIcon,
  PenLineIcon,
  DownloadCloudIcon,
  PlusIcon,
  ArrowRightIcon,
  ReceiptTextIcon,
  FileSignatureIcon,
} from "lucide-react";
import { supabaseAdmin, type Message } from "@/lib/supabase";
import { documentSchemaState } from "@/lib/documents/server";
import {
  PageHeader,
  StatTile,
  EmptyState,
  btnGhost,
  timeAgo,
} from "../_components/ui";
import { NeedsSetup } from "../_components/documents/NeedsSetup";

export const dynamic = "force-dynamic";

const LEGACY_TABS = ["messages", "projects", "downloads", "blog"];

const head = (table: string) =>
  supabaseAdmin.from(table).select("id", { count: "exact", head: true });

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // Old bookmarks used /admin?tab=blog
  const { tab } = await searchParams;
  if (tab && LEGACY_TABS.includes(tab)) redirect(`/admin/${tab}`);

  const [recent, unread, projects, published, downloads, quotesSent, quotesAccepted, contractsSent, contractsSigned, schema] = await Promise.all([
    supabaseAdmin
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    head("messages").eq("is_read", false),
    head("projects"),
    head("posts").eq("published", true),
    head("pdf_downloads"),
    head("quotations").eq("status", "sent"),
    head("quotations").eq("status", "accepted"),
    head("contracts").eq("status", "sent"),
    head("contracts").eq("status", "signed"),
    documentSchemaState(),
  ]);

  const messages = (recent.data ?? []) as Message[];
  const unreadCount = unread.count ?? 0;

  return (
    <div>
      <PageHeader
        title="Overview"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread ${unreadCount === 1 ? "message" : "messages"}.`
            : "You're all caught up."
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Unread messages" value={unreadCount} tone={unreadCount ? "accent" : "default"} />
        <StatTile label="Projects" value={projects.count ?? 0} />
        <StatTile label="Published posts" value={published.count ?? 0} />
        <StatTile label="PDF downloads" value={downloads.count ?? 0} />
      </div>

      <h2 className="mb-3 mt-8 text-base font-semibold">Business</h2>
      {schema !== "ready" ? (
        <NeedsSetup outdated={schema === "outdated"} />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Quotes awaiting reply"
            value={quotesSent.count ?? 0}
            tone={quotesSent.count ? "accent" : "default"}
          />
          <StatTile label="Accepted quotes" value={quotesAccepted.count ?? 0} />
          <StatTile
            label="Contracts to be signed"
            value={contractsSent.count ?? 0}
            tone={contractsSent.count ? "accent" : "default"}
          />
          <StatTile label="Signed contracts" value={contractsSigned.count ?? 0} />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Latest messages</h2>
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-1 text-sm font-medium text-adm-accent-text hover:underline"
            >
              View all <ArrowRightIcon size={14} />
            </Link>
          </div>

          {messages.length === 0 ? (
            <EmptyState
              icon={InboxIcon}
              title="No messages yet"
              body="Submissions from your contact form will show up here."
            />
          ) : (
            <ul className="divide-y divide-adm-border overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
              {messages.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/admin/messages?open=${m.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-adm-raised"
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        m.is_read ? "bg-transparent" : "bg-adm-accent"
                      }`}
                      aria-label={m.is_read ? "Read" : "Unread"}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm ${m.is_read ? "text-adm-muted" : "font-semibold"}`}>
                        {m.name}
                      </p>
                      <p className="truncate text-sm text-adm-subtle">{m.message}</p>
                    </div>
                    <span className="shrink-0 text-xs text-adm-subtle">{timeAgo(m.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">Quick actions</h2>
          <div className="grid gap-2">
            <Link href="/admin/quotations/new" className={`${btnGhost} justify-start`}>
              <ReceiptTextIcon size={16} /> New quotation
            </Link>
            <Link href="/admin/contracts/new" className={`${btnGhost} justify-start`}>
              <FileSignatureIcon size={16} /> New contract
            </Link>
            <Link href="/admin/blog/new" className={`${btnGhost} justify-start`}>
              <PenLineIcon size={16} /> Write a post
            </Link>
            <Link href="/admin/projects?new=1" className={`${btnGhost} justify-start`}>
              <PlusIcon size={16} /> Add a project
            </Link>
            <Link href="/admin/downloads" className={`${btnGhost} justify-start`}>
              <DownloadCloudIcon size={16} /> See downloads
            </Link>
            <Link href="/admin/projects" className={`${btnGhost} justify-start`}>
              <FolderKanbanIcon size={16} /> Reorder projects
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
