"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { contactSubmit } from "@/lib/actions";
import { trackEvent } from "@/lib/analytics";
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

let recaptcha: Promise<void> | null = null;

/**
 * reCAPTCHA is ~400KB of script, styles and an iframe, so it loads only once
 * the form is close, not with the page. Safe to call repeatedly.
 */
function loadRecaptcha() {
  if (!SITE_KEY) return Promise.resolve();
  recaptcha ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    s.onload = () => window.grecaptcha.ready(resolve);
    s.onerror = () => {
      recaptcha = null;
      reject(new Error("reCAPTCHA failed to load"));
    };
    document.head.appendChild(s);
  });
  return recaptcha;
}

const inputClass = "field-input";

const labelClass = "t-label text-[var(--text-primary)]";

export default function ContactForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(contactSubmit, null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // Start loading reCAPTCHA as the form scrolls near, so a token is ready by submit
  useEffect(() => {
    const form = formRef.current;
    if (!SITE_KEY || !form) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          loadRecaptcha().catch(() => {});
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(form);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (state && "success" in state) {
      trackEvent("contact_submit", { source: location.pathname });
      router.push("/thankyou");
    }
  }, [state, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (SITE_KEY) {
      try {
        await loadRecaptcha();
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
      <form ref={formRef} onSubmit={handleSubmit} onFocus={() => loadRecaptcha().catch(() => {})} className="space-y-5">
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
            className="field-cardinal cut-b px-4 py-3 text-[15px] font-medium"
          >
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
          <Submitbutton buttonText="Send message" isPending={isPending} />
          {SITE_KEY && (
            /* Required when the floating reCAPTCHA badge is hidden (see globals.css) */
            <p className="max-w-[46ch] text-[13px] leading-relaxed text-[var(--text-muted)]">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="link">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="link">
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
