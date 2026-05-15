import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { PostEditor } from "../_components/PostEditor";
import type { Post } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <PostEditor post={data as Post} />;
}
