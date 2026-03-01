"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./actions";
import { LockIcon, MailIcon, EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Identity header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-600/20 border border-yellow-600/40 mb-4">
            <LockIcon size={22} className="text-yellow-500" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">Restricted area</p>
        </div>

        {/* Login card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl shadow-black/40">
          <form action={action} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-400 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <MailIcon
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white
                             placeholder-gray-600 focus:outline-none focus:border-yellow-600
                             focus:ring-1 focus:ring-yellow-600/30 transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-400 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <LockIcon
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white
                             placeholder-gray-600 focus:outline-none focus:border-yellow-600
                             focus:ring-1 focus:ring-yellow-600/30 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {state?.error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {state.error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed
                         text-black font-semibold text-sm rounded-lg py-2.5 transition-colors duration-200"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
