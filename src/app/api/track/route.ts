import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// ── Lightweight UA parser (no extra dependency) ──────────────────────────────
function parseUA(ua: string) {
  const browser =
    /Edg\//.test(ua)     ? "Edge"    :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /Chrome\//.test(ua)  ? "Chrome"  :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua)  ? "Safari"  :
    /MSIE|Trident/.test(ua) ? "IE"   :
    "Unknown";

  const os =
    /Windows NT 10|Windows NT 11/.test(ua) ? "Windows 10/11" :
    /Windows NT 6\.3/.test(ua)             ? "Windows 8.1"   :
    /Windows NT 6\.1/.test(ua)             ? "Windows 7"     :
    /Windows/.test(ua)                     ? "Windows"       :
    /Mac OS X/.test(ua)                    ? "macOS"         :
    /Android/.test(ua)                     ? "Android"       :
    /iPhone|iPad/.test(ua)                 ? "iOS"           :
    /Linux/.test(ua)                       ? "Linux"         :
    "Unknown";

  const device =
    /Mobile|Android(?!.*Tablet)|iPhone/.test(ua) ? "Mobile"  :
    /iPad|Tablet|tablet/.test(ua)                ? "Tablet"  :
    "Desktop";

  return { browser, os, device };
}

// ── IP extraction ─────────────────────────────────────────────────────────────
function getIP(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??      // Cloudflare
    req.headers.get("x-real-ip") ??             // Nginx
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ua = req.headers.get("user-agent") ?? "";
    const { browser, os, device } = parseUA(ua);

    const row = {
      ip:                getIP(req),
      browser,
      os,
      device,
      user_agent:        ua,
      screen_resolution: body.screen        ?? null,
      viewport:          body.viewport      ?? null,
      language:          body.language      ?? null,
      timezone:          body.timezone      ?? null,
      referrer:          body.referrer      ?? null,
      page_url:          body.page_url      ?? null,
      utm_source:        body.utm_source    ?? null,
      utm_medium:        body.utm_medium    ?? null,
      utm_campaign:      body.utm_campaign  ?? null,
      connection_type:   body.connection    ?? null,
    };

    const { error } = await supabase.from("pdf_downloads").insert(row);
    if (error) console.error("[track] Supabase error:", error.message);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[track] Unexpected error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
