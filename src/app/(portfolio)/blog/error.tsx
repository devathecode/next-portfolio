"use client";

import { useEffect } from "react";
import Link from "next/link";
import ErrorPage, { ERROR_PRIMARY, ERROR_SECONDARY } from "@/components/site/ErrorPage";

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
    <ErrorPage
      word="Retake."
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
    </ErrorPage>
  );
}
