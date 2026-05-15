import "server-only";
import { createClient } from "@supabase/supabase-js";

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type PdfDownload = {
  id: string;
  created_at: string;
  ip: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  user_agent: string | null;
  screen_resolution: string | null;
  viewport: string | null;
  language: string | null;
  timezone: string | null;
  referrer: string | null;
  page_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  connection_type: string | null;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  live_url: string;
  github_url?: string | null;
  tech_stack: string[];
  accent: string;
  sort_order: number;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  content: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Supabase env vars missing — SUPABASE_URL: ${supabaseUrl ? "set" : "MISSING"}, SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? "set" : "MISSING"}`,
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
