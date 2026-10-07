import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Admin-only preview of unpublished posts: turns on draft mode for this
 * browser and opens the post. /api/draft?slug=…&exit=1 turns it off again.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const draft = await draftMode();
  if (req.nextUrl.searchParams.has("exit")) draft.disable();
  else draft.enable();

  return NextResponse.redirect(new URL(`/blog/${slug}`, req.url));
}
