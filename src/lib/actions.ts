"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import sanitizeHtml from "sanitize-html";
import { supabaseAdmin } from "@/lib/supabase";

const CONTACT_LIMIT = 3;
const CONTACT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

async function isContactRateLimited(): Promise<boolean> {
  const h = await headers();
  const ip =
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  const key = `contact:${ip}`;
  const windowStart = new Date(Date.now() - CONTACT_WINDOW_MS).toISOString();

  const { count } = await supabaseAdmin
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip", key)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= CONTACT_LIMIT) return true;

  await supabaseAdmin.from("login_attempts").insert({ ip: key });
  return false;
}

function sanitize(str: string): string {
  return sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} }).trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SPAM_KEYWORDS = [
  /lead[\s-]*generation/i,
  /100\s*times\s*more/i,
  /web\s*visitors?\s*into\s*leads/i,
  /blastleadgeneration\.com/i,
  /digital\s*marketing\s*agenc/i,
  /get\s*more\s*clients/i,
  /increase\s*your\s*sales/i,
  /seo\s*services/i,
];

const ALLOWED_URL_DOMAINS = [
  "linkedin.com",
  "github.com",
  "twitter.com",
  "x.com",
  "devanshuverma.in",
  "stackoverflow.com",
  "npmjs.com",
];

function isSpam(message: string): boolean {
  if (SPAM_KEYWORDS.some((p) => p.test(message))) return true;

  // Reject URLs from domains not on the allowlist
  const urlPattern = /https?:\/\/([a-z0-9.-]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = urlPattern.exec(message)) !== null) {
    const domain = m[1].toLowerCase().replace(/^www\./, "");
    const allowed = ALLOWED_URL_DOMAINS.some(
      (d) => domain === d || domain.endsWith(`.${d}`)
    );
    if (!allowed) return true;
  }
  return false;
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // skip verification when not configured
  if (!token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });
    const data = (await res.json()) as { success: boolean; score?: number };
    // Require a passing score (0.5 threshold — humans are typically 0.7–1.0)
    return data.success && (data.score ?? 1) >= 0.5;
  } catch {
    return true; // don't block submissions on reCAPTCHA API failure
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactState = { error: string } | { success: true } | null;

export async function contactSubmit(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: silently discard bot submissions that fill the hidden field
  const honeypot = (formData.get("_b2x9k") as string) ?? "";
  if (honeypot) return null;

  const rawName = ((formData.get("name") as string) ?? "").trim();
  const rawEmail = ((formData.get("email") as string) ?? "").trim();
  const rawMessage = ((formData.get("message") as string) ?? "").trim();
  const recaptchaToken = (formData.get("g-recaptcha-response") as string) ?? "";

  // Strip HTML tags and dangerous patterns from all fields
  const name = sanitize(rawName);
  const email = sanitize(rawEmail);
  const message = sanitize(rawMessage);

  if (!name || !email || !message) {
    return { error: "All fields are required." };
  }

  if (name.length > 100) return { error: "Name is too long (max 100 characters)." };
  if (email.length > 254) return { error: "Email address is too long." };
  if (message.length > 5000) return { error: "Message is too long (max 5000 characters)." };

  if (isSpam(message)) {
    return { error: "Your message was flagged as spam. Please reach out directly via email." };
  }

  if (!(await verifyRecaptcha(recaptchaToken))) {
    return { error: "reCAPTCHA verification failed. Please try again." };
  }

  if (await isContactRateLimited()) {
    return { error: "Too many submissions. Please try again later." };
  }

  let dbError: unknown = null;
  try {
    const { error } = await supabaseAdmin.from("messages").insert({ name, email, message });
    dbError = error;
  } catch (err) {
    console.error("[contact] Supabase threw an exception:", err);
    return { error: "Failed to send your message. Please try again later." };
  }

  if (dbError) {
    const e = dbError as { message?: string; code?: string; details?: string };
    console.error("[contact] Supabase error — code:", e.code, "| message:", e.message, "| details:", e.details);
    return { error: "Failed to send your message. Please try again later." };
  }

  // Fire-and-forget email — don't block redirect on email failure
  resend.emails
    .send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "code.devanshu@gmail.com",
      subject: `New message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;color:#111">
          <h2 style="color:#d97706;margin-bottom:4px">New Contact Form Submission</h2>
          <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 4px"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#d97706">${escapeHtml(email)}</a></p>
          <p style="margin:12px 0 4px"><strong>Message:</strong></p>
          <p style="background:#f5f5f5;padding:12px 16px;border-radius:8px;white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
          <p style="margin-top:20px;font-size:12px;color:#888">
            View all messages in your <a href="https://www.devanshuverma.in/admin" style="color:#d97706">admin panel</a>.
          </p>
        </div>
      `,
    })
    .catch((err) => console.error("[contact] Email send failed:", err));

  return { success: true };
}
