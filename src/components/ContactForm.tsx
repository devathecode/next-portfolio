"use client";

import { useActionState } from "react";
import { contactSubmit } from "@/lib/actions";
import Submitbutton from "./SubmitButton";

const inputClass =
  "block w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] " +
  "px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] " +
  "focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 " +
  "transition-colors duration-200 autofill:bg-[var(--bg-secondary)]";

export default function ContactForm() {
  const [state, action] = useActionState(contactSubmit, null);

  return (
    <form action={action} className="space-y-4">
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
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="font-mono text-xs text-[var(--text-muted)]">
          Message *
        </label>
        <input
          id="message"
          type="text"
          name="message"
          className={inputClass}
          placeholder="What's on your mind?"
          required
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="pt-2">
        <Submitbutton buttonText="Send Message" />
      </div>
    </form>
  );
}
