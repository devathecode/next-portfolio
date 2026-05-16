import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, Post } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.DRAFT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, slug, content, tags, excerpt, cover_image } = body as {
    title?: string;
    slug?: string;
    content?: string;
    tags?: string[];
    excerpt?: string | null;
    cover_image?: string | null;
  };

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert({
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : [],
      excerpt: excerpt ?? null,
      cover_image: cover_image ?? null,
      published: false,
      published_at: null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single<Post>();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A post with that slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
