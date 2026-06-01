"use client";

import { useEffect } from "react";
import Link from "next/link";
import { UnplugIcon } from "lucide-react";
import BrowserErrorPage, { ERROR_PRIMARY, ERROR_SECONDARY } from "@/components/browser/BrowserErrorPage";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <BrowserErrorPage
      icon={<UnplugIcon size={44} strokeWidth={1.4} />}
      title="The blog didn't load"
      code={`Error code: ${error.digest ?? "FETCH_FAILED"}`}
      actions={
        <>
          <button type="button" onClick={reset} className={ERROR_PRIMARY}>
            Try again
          </button>
          <Link href="/" className={ERROR_SECONDARY}>
            Go home
          </Link>
        </>
      }
    >
      <p>Couldn&apos;t fetch the blog content. This is usually a temporary issue.</p>
    </BrowserErrorPage>
  );
}
