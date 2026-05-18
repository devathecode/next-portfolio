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

function str(val: unknown, max: number): string | null {
  if (typeof val !== "string") return null;
  return val.slice(0, max) || null;
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
      user_agent:        ua.slice(0, 512),
      screen_resolution: str(body.screen,       32),
      viewport:          str(body.viewport,     32),
      language:          str(body.language,     16),
      timezone:          str(body.timezone,     64),
      referrer:          str(body.referrer,   2048),
      page_url:          str(body.page_url,   2048),
      utm_source:        str(body.utm_source,  128),
      utm_medium:        str(body.utm_medium,  128),
      utm_campaign:      str(body.utm_campaign,128),
      connection_type:   str(body.connection,   32),
    };

    const { error } = await supabase.from("pdf_downloads").insert(row);
    if (error) console.error("[track] Supabase error:", error.message);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[track] Unexpected error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
