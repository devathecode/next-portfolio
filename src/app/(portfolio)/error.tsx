"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FrownIcon } from "lucide-react";
import BrowserErrorPage, { ERROR_PRIMARY, ERROR_SECONDARY } from "@/components/browser/BrowserErrorPage";

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
    <BrowserErrorPage
      icon={<FrownIcon size={44} strokeWidth={1.4} />}
      title="Aw, snap!"
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
      <p>Something went wrong while displaying this page. Reloading usually fixes it.</p>
    </BrowserErrorPage>
  );
}
