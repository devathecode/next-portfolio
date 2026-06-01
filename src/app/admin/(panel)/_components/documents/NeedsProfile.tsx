import Link from "next/link";
import { BriefcaseBusinessIcon } from "lucide-react";
import { EmptyState, btnPrimary } from "../ui";

/** Shown in place of an editor until the business profile exists. */
export function NeedsProfile({ what }: { what: string }) {
  return (
    <EmptyState
      icon={BriefcaseBusinessIcon}
      title="Set up your business profile first"
      body={`Your name, address, PAN and bank details go on every ${what}. Add them once and they're reused everywhere.`}
      action={
        <Link href="/admin/settings" className={btnPrimary}>
          Open business profile
        </Link>
      }
    />
  );
}
