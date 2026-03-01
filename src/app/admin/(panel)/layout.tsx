import { ReactNode } from "react";
import { LogOutIcon } from "lucide-react";
import { logoutAction } from "../actions";

export const metadata = {
  title: "Admin – devanshuverma.in",
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-sm font-semibold text-white">Admin Panel</span>
          <span className="text-gray-700 text-xs hidden sm:inline">
            / devanshuverma.in
          </span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-gray-800"
          >
            <LogOutIcon size={14} />
            Logout
          </button>
        </form>
      </header>
      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
