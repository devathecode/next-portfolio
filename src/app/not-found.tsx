import Link from "next/link";
import { FileWarningIcon } from "lucide-react";
import BrowserShell from "@/components/browser/BrowserShell";
import BrowserErrorPage, { ERROR_PRIMARY, ERROR_SECONDARY } from "@/components/browser/BrowserErrorPage";
import CurrentUrl from "@/components/browser/CurrentUrl";
import { SITE_HOST } from "@/lib/site";

export default function NotFound() {
  return (
    <BrowserShell pageTitle="Page not found">
      <BrowserErrorPage
        icon={<FileWarningIcon size={44} strokeWidth={1.4} />}
        title={<>This {SITE_HOST} page can&apos;t be found</>}
        code="HTTP ERROR 404"
        actions={
          <>
            <Link href="/" className={ERROR_PRIMARY}>
              Go home
            </Link>
            <Link href="/blog" className={ERROR_SECONDARY}>
              Read the blog
            </Link>
          </>
        }
      >
        <p>
          No webpage was found for the web address: <CurrentUrl />
        </p>
        <p>It may have moved, or the link has a typo.</p>
      </BrowserErrorPage>
    </BrowserShell>
  );
}
