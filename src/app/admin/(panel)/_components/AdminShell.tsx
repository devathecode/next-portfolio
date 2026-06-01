"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  LayoutDashboardIcon,
  InboxIcon,
  FolderKanbanIcon,
  PenLineIcon,
  DownloadCloudIcon,
  ReceiptTextIcon,
  FileSignatureIcon,
  UsersIcon,
  BriefcaseBusinessIcon,
  EllipsisIcon,
  LogOutIcon,
  SunIcon,
  MoonIcon,
  ExternalLinkIcon,
  XIcon,
} from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { logoutAction } from "../../actions";
import { FeedbackProvider } from "./feedback";

type NavItem = {
  href: string;
  label: string;
  /** Shorter label for the mobile tab bar. */
  short?: string;
  icon: ComponentType<{ size?: number }>;
  exact?: boolean;
  badge?: "unread";
};

const OVERVIEW: NavItem = { href: "/admin", label: "Overview", icon: LayoutDashboardIcon, exact: true };
const MESSAGES: NavItem = { href: "/admin/messages", label: "Messages", icon: InboxIcon, badge: "unread" };
const QUOTATIONS: NavItem = { href: "/admin/quotations", label: "Quotations", short: "Quotes", icon: ReceiptTextIcon };
const CONTRACTS: NavItem = { href: "/admin/contracts", label: "Contracts", icon: FileSignatureIcon };

const NAV_GROUPS: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      OVERVIEW,
      MESSAGES,
      { href: "/admin/projects", label: "Projects", icon: FolderKanbanIcon },
      { href: "/admin/blog", label: "Blog", icon: PenLineIcon },
      { href: "/admin/downloads", label: "Downloads", icon: DownloadCloudIcon },
    ],
  },
  {
    label: "Business",
    items: [
      QUOTATIONS,
      CONTRACTS,
      { href: "/admin/clients", label: "Clients", icon: UsersIcon },
      { href: "/admin/settings", label: "Business profile", short: "Profile", icon: BriefcaseBusinessIcon },
    ],
  },
];

/** The mobile tab bar holds four items; everything else lives under "More". */
const MOBILE_TABS = [OVERVIEW, MESSAGES, QUOTATIONS, CONTRACTS];
const MORE_ITEMS = NAV_GROUPS.flatMap((g) => g.items).filter((i) => !MOBILE_TABS.includes(i));

/** Editors show a form and an A4 preview side by side, so they get more width. */
const WIDE_ROUTE = /^\/admin\/(quotations|contracts)\/[^/]+$/;

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminShell({
  unread,
  children,
}: {
  unread: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { toggleTheme } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MORE_ITEMS.some((i) => isActive(pathname, i));

  // Close the sheet after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMoreOpen(false);
  }

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const rowBtn =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-adm-muted transition " +
    "hover:bg-adm-raised hover:text-adm-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60";

  return (
    <FeedbackProvider>
      <div className="min-h-[100dvh] bg-adm-bg text-adm-text">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-adm-border bg-adm-surface lg:flex">
          <div className="px-5 py-5">
            <p className="text-sm font-semibold text-adm-text">Devanshu Verma</p>
            <p className="text-xs text-adm-subtle">Site admin</p>
          </div>

          <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto px-3">
            {NAV_GROUPS.map((group, gi) => (
              <div key={gi} className="space-y-0.5">
                {group.label && (
                  <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-adm-subtle">
                    {group.label}
                  </p>
                )}
                {group.items.map((item) => {
                  const active = isActive(pathname, item);
                  const badge = item.badge && unread > 0 ? unread : 0;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 ${
                        active
                          ? "bg-adm-accent/15 text-adm-accent-text"
                          : "text-adm-muted hover:bg-adm-raised hover:text-adm-text"
                      }`}
                    >
                      <item.icon size={17} />
                      <span className="flex-1">{item.label}</span>
                      {badge > 0 && (
                        <span className="rounded-full bg-adm-accent px-1.5 text-xs font-semibold tabular-nums text-adm-on-accent">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="space-y-0.5 border-t border-adm-border p-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className={rowBtn}>
              <ExternalLinkIcon size={16} /> View site
            </a>
            <button type="button" onClick={toggleTheme} className={rowBtn}>
              <SunIcon size={16} className="hidden dark:block" />
              <MoonIcon size={16} className="dark:hidden" />
              <span className="hidden dark:inline">Light mode</span>
              <span className="dark:hidden">Dark mode</span>
            </button>
            <form action={logoutAction}>
              <button type="submit" className={rowBtn}>
                <LogOutIcon size={16} /> Log out
              </button>
            </form>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-adm-border bg-adm-surface/95 px-4 backdrop-blur lg:hidden">
          <p className="text-sm font-semibold">Site admin</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-adm-muted hover:bg-adm-raised"
            >
              <SunIcon size={17} className="hidden dark:block" />
              <MoonIcon size={17} className="dark:hidden" />
            </button>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Log out"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-adm-muted hover:bg-adm-raised"
              >
                <LogOutIcon size={17} />
              </button>
            </form>
          </div>
        </header>

        <main className="px-4 py-6 pb-28 sm:px-6 lg:ml-60 lg:px-10 lg:py-10 lg:pb-10">
          <div className={`mx-auto ${WIDE_ROUTE.test(pathname) ? "max-w-7xl" : "max-w-5xl"}`}>{children}</div>
        </main>

        {/* Mobile "More" sheet */}
        {moreOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 animate-fade-in lg:hidden"
            onMouseDown={(e) => e.target === e.currentTarget && setMoreOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="More pages"
              className="absolute inset-x-0 bottom-0 rounded-t-xl border-t border-adm-border bg-adm-surface px-3 pb-24 pt-3"
            >
              <div className="mb-2 flex items-center justify-between px-2">
                <p className="text-sm font-semibold">More</p>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  aria-label="Close"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-adm-subtle hover:bg-adm-raised"
                >
                  <XIcon size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MORE_ITEMS.map((item) => {
                  const active = isActive(pathname, item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium ${
                        active
                          ? "border-adm-accent/40 bg-adm-accent/10 text-adm-accent-text"
                          : "border-adm-border text-adm-muted"
                      }`}
                    >
                      <item.icon size={19} />
                      {item.short ?? item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile bottom tabs */}
        <nav
          aria-label="Admin"
          className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-adm-border bg-adm-surface/95 backdrop-blur lg:hidden"
        >
          {MOBILE_TABS.map((item) => {
            const active = isActive(pathname, item) && !moreOpen;
            const showDot = item.badge && unread > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                  active ? "text-adm-accent-text" : "text-adm-subtle"
                }`}
              >
                <item.icon size={19} />
                {item.short ?? item.label}
                {showDot && (
                  <span className="absolute right-[28%] top-1.5 h-2 w-2 rounded-full bg-adm-accent" />
                )}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              moreOpen || moreActive ? "text-adm-accent-text" : "text-adm-subtle"
            }`}
          >
            <EllipsisIcon size={19} />
            More
          </button>
        </nav>
      </div>
    </FeedbackProvider>
  );
}
