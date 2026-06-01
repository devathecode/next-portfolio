import type { ReactNode } from "react";
import { DatabaseIcon, ExternalLinkIcon } from "lucide-react";
import { documentSchemaState } from "@/lib/documents/server";
import { EmptyState, btnPrimary } from "../ui";

/** The project's SQL editor, worked out from SUPABASE_URL (https://<ref>.supabase.co). */
function sqlEditorUrl() {
  const ref = /^https:\/\/([a-z0-9]+)\.supabase\.co\b/.exec(process.env.SUPABASE_URL ?? "")?.[1];
  return ref ? `https://supabase.com/dashboard/project/${ref}/sql/new` : null;
}

/** Shown until the tables from supabase/documents.sql exist, or after it gains new columns. */
export function NeedsSetup({ outdated = false }: { outdated?: boolean }) {
  const url = sqlEditorUrl();
  return (
    <EmptyState
      icon={DatabaseIcon}
      title={outdated ? "Update the database tables" : "Create the database tables first"}
      body={
        outdated
          ? "Newer features (quotation revisions, your signature) need new columns. Run supabase/documents.sql again in the Supabase SQL editor (it keeps your data), then reload this page."
          : "Paste supabase/documents.sql from the project into the Supabase SQL editor, run it once, then reload this page."
      }
      action={
        url && (
          <a href={url} target="_blank" rel="noreferrer" className={btnPrimary}>
            Open SQL editor <ExternalLinkIcon size={14} />
          </a>
        )
      }
    />
  );
}

/**
 * Renders its children only once the document tables exist. With `latest`,
 * they must also have the newest columns (pages that read them).
 */
export async function SetupGate({ children, latest = false }: { children: ReactNode; latest?: boolean }) {
  const state = await documentSchemaState();
  if (state === "missing") return <NeedsSetup />;
  if (state === "outdated" && latest) return <NeedsSetup outdated />;
  return children;
}
