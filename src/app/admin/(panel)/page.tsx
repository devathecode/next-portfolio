import { supabaseAdmin, Message, Project, PdfDownload, Post } from "@/lib/supabase";
import { InboxIcon, FolderOpenIcon, DownloadCloudIcon } from "lucide-react";
import { MessageList } from "./_components/MessageList";
import { ProjectList } from "./_components/ProjectList";
import { DownloadList } from "./_components/DownloadList";
import { PostList } from "./_components/PostList";
import Link from "next/link";

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

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "messages" } = await searchParams;

  const [msgResult, projResult, dlResult, postResult] = await Promise.all([
    supabaseAdmin.from("messages").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("projects").select("*").order("sort_order", { ascending: true }),
    supabaseAdmin.from("pdf_downloads").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("posts").select("*").order("created_at", { ascending: false }),
  ]);

  const msgs      = (msgResult.data  ?? []) as Message[];
  const projects  = (projResult.data ?? []) as Project[];
  const downloads = (dlResult.data   ?? []) as PdfDownload[];
  const posts     = (postResult.data ?? []) as Post[];
  const unread    = msgs.filter((m) => !m.is_read).length;
  const published = posts.filter((p) => p.published).length;

  return (
    <div>
      {/* Tab nav */}
      <div className="flex gap-1 mb-8 border-b border-gray-800">
        {[
          { key: "messages",   label: "Messages",   count: msgs.length      },
          { key: "projects",   label: "Projects",   count: projects.length  },
          { key: "downloads",  label: "Downloads",  count: downloads.length },
          { key: "blog",       label: "Blog",       count: posts.length     },
        ].map(({ key, label, count }) => (
          <Link
            key={key}
            href={`/admin?tab=${key}`}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key
                ? "border-yellow-600 text-yellow-500"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {label}
            <span className="ml-2 text-xs bg-gray-800 px-1.5 py-0.5 rounded-full text-gray-400">
              {count}
            </span>
          </Link>
        ))}
      </div>

      {tab === "messages" && (
        <>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">Messages</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Contact form submissions from devanshuverma.in
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Total" value={msgs.length} />
            <StatCard label="Unread" value={unread} highlight />
            <StatCard label="Read" value={msgs.length - unread} />
          </div>

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
        </>
      )}

      {tab === "downloads" && (
        <>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <DownloadCloudIcon size={20} className="text-yellow-500" />
                PDF Downloads
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Every CSS Tips PDF download — browser, device, screen, timezone, referrer &amp; more.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Downloads" value={downloads.length} highlight />
            <StatCard label="Desktop" value={downloads.filter((d) => d.device === "Desktop").length} />
            <StatCard label="Mobile"  value={downloads.filter((d) => d.device === "Mobile").length}  />
            <StatCard label="Tablet"  value={downloads.filter((d) => d.device === "Tablet").length}  />
          </div>

          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            All Downloads — click any row to expand full details
          </h2>

          <DownloadList downloads={downloads} />
        </>
      )}

      {tab === "projects" && (
        <>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">Projects</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage the projects shown on your portfolio.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard label="Total Projects" value={projects.length} />
            <StatCard label="Visible on site" value={projects.length} highlight />
          </div>

          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            All Projects
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-700">
              <FolderOpenIcon size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No projects yet.</p>
              <p className="text-xs mt-1 text-gray-600">
                Use the form above to add your first project.
              </p>
            </div>
          ) : null}

          <ProjectList projects={projects} />
        </>
      )}

      {tab === "blog" && (
        <>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">Blog Posts</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Write and publish articles on devanshuverma.in/blog.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Posts" value={posts.length} />
            <StatCard label="Published" value={published} highlight />
            <StatCard label="Drafts" value={posts.length - published} />
          </div>

          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            All Posts
          </h2>

          <PostList posts={posts} />
        </>
      )}
    </div>
  );
}
