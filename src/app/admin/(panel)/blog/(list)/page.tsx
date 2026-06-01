import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { supabaseAdmin, type Post } from "@/lib/supabase";
import { PageHeader, btnPrimary } from "../../_components/ui";
import { PostList } from "../../_components/PostList";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Write and publish articles on your blog."
        action={
          <Link href="/admin/blog/new" className={btnPrimary}>
            <PlusIcon size={16} /> New post
          </Link>
        }
      />
      <PostList posts={(data ?? []) as Post[]} />
    </div>
  );
}
