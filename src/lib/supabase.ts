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
