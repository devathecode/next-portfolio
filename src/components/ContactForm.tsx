"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { contactSubmit } from "@/lib/actions";
import Submitbutton from "./SubmitButton";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

const inputClass =
  "block w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] " +
  "px-3.5 py-2.5 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] " +
  "focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-muted)] " +
  "transition-[border-color,box-shadow] duration-200";

const labelClass = "text-[13px] font-medium text-[var(--text-secondary)]";

export default function ContactForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(contactSubmit, null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state && "success" in state) {
      router.push("/thankyou");
    }
  }, [state, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (SITE_KEY && typeof window !== "undefined" && window.grecaptcha) {
      try {
        await new Promise<void>((resolve) => window.grecaptcha.ready(resolve));
        const token = await window.grecaptcha.execute(SITE_KEY, { action: "contact" });
        formData.set("g-recaptcha-response", token);
      } catch {
        // proceed without token — server skips check when RECAPTCHA_SECRET_KEY is unset
      }
    }

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <>
      {SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot: off-screen field bots fill, real users never see */}
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          <label htmlFor="hp-b2x9k">Leave blank</label>
          <input
            type="text"
            id="hp-b2x9k"
            name="_b2x9k"
            tabIndex={-1}
            autoComplete="new-password"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={labelClass}>
              Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className={inputClass}
              placeholder="Your name"
              maxLength={100}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>
              Email *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={inputClass}
              placeholder="your@email.com"
              maxLength={254}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className={labelClass}>
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className={`${inputClass} resize-none`}
            placeholder="What's on your mind?"
            maxLength={5000}
            required
          />
        </div>

        {state && "error" in state && (
          <p
            role="alert"
            aria-live="assertive"
            className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
          <Submitbutton buttonText="Send message" isPending={isPending} />
          {SITE_KEY && (
            /* Required when the floating reCAPTCHA badge is hidden (see globals.css) */
            <p className="max-w-[46ch] text-xs leading-relaxed text-[var(--text-muted)]">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--text-secondary)]">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--text-secondary)]">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          )}
        </div>
      </form>
    </>
  );
}
