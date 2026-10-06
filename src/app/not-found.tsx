import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import ErrorPage, { ERROR_PRIMARY, ERROR_SECONDARY } from "@/components/site/ErrorPage";

export default function NotFound() {
  return (
    <SiteShell>
      <ErrorPage
        word="Cut."
        title="This scene didn't make the final edit"
        code="404 · Page not found"
        actions={
          <>
            <Link href="/" className={ERROR_PRIMARY}>
              Back to the start
            </Link>
            <Link href="/blog" className={ERROR_SECONDARY}>
              Read the blog
            </Link>
          </>
        }
      >
        <p>There&apos;s no page at this address. It may have moved, or the link has a typo.</p>
      </ErrorPage>
    </SiteShell>
  );
}
