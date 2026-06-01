"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./actions";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react";
import { btnPrimary, inputCls, labelCls } from "../(panel)/_components/ui";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-adm-bg p-4 text-adm-text">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-adm-muted">Admin for devanshuverma.in</p>
        </div>

        <div className="rounded-xl border border-adm-border bg-adm-surface p-6 shadow-sm">
          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="email" className={labelCls}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                className={inputCls}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className={labelCls}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-adm-subtle transition hover:text-adm-text"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            {state?.error && (
              <p
                role="alert"
                className="rounded-lg border border-adm-danger/30 bg-adm-danger/10 px-3 py-2 text-sm text-adm-danger"
              >
                {state.error}
              </p>
            )}

            <button type="submit" disabled={pending} className={`${btnPrimary} w-full`}>
              {pending && <LoaderCircleIcon size={15} className="animate-spin" />}
              {pending ? "Signing in" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
