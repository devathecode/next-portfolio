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
  "block w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] " +
  "px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] " +
  "focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 " +
  "transition-colors duration-200 autofill:bg-[var(--bg-secondary)]";

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
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-mono text-xs text-[var(--text-muted)]">
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-mono text-xs text-[var(--text-muted)]">
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="font-mono text-xs text-[var(--text-muted)]">
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
          <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <div className="pt-2">
          <Submitbutton buttonText="Send Message" isPending={isPending} />
        </div>
      </form>
    </>
  );
}
