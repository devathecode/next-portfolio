"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 10 * 60 * 1000;

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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactState = { error: string } | null;

export async function contactSubmit(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = ((formData.get("name") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();

  if (!name || !email || !message) {
    return { error: "All fields are required." };
  }

  if (name.length > 100) return { error: "Name is too long (max 100 characters)." };
  if (email.length > 254) return { error: "Email address is too long." };
  if (message.length > 5000) return { error: "Message is too long (max 5000 characters)." };

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

  redirect("/thankyou");
}
