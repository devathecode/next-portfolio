"use client";

import { useEffect } from "react";
import Link from "next/link";
import ErrorPage, { ERROR_PRIMARY, ERROR_SECONDARY } from "@/components/site/ErrorPage";

export default function PortfolioError({
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
      title="Something broke mid-scene"
      code={`Error code: ${error.digest ?? "RENDER_FAILED"}`}
      actions={
        <>
          <button type="button" onClick={reset} className={ERROR_PRIMARY}>
            Reload
          </button>
          <Link href="/" className={ERROR_SECONDARY}>
            Go home
          </Link>
        </>
      }
    >
      <p>This page hit an error while it was rendering. Running it again usually fixes it.</p>
    </ErrorPage>
  );
}
