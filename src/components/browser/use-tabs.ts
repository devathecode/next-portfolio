"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, type SectionId } from "@/lib/site";
import { useActiveSection } from "@/lib/use-section-nav";

export type TabId = SectionId | "page";

export interface BrowserTab {
  id: TabId;
  title: string;
  href: string;
  /** Scrolls on the home route instead of routing */
  inPage: boolean;
  preview: string;
  /** Page tabs can be closed, which goes back to their parent */
  closeHref?: string;
}

const TITLE_SUFFIX = " — Devanshu Verma";

function humanize(slug: string) {
  const words = decodeURIComponent(slug).replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Title and parent route for pages that are not one of the fixed tabs. */
function describePage(pathname: string): { title: string; closeHref: string } {
  if (pathname === "/projects") return { title: "Projects", closeHref: "/#work" };
  if (pathname === "/css-tips") return { title: "CSS tips", closeHref: "/" };
  if (pathname === "/thankyou") return { title: "Message sent", closeHref: "/" };
  const tag = pathname.match(/^\/blog\/tag\/([^/]+)/);
  if (tag) return { title: `#${decodeURIComponent(tag[1])}`, closeHref: "/blog" };
  const post = pathname.match(/^\/blog\/([^/]+)/);
  if (post) return { title: humanize(post[1]), closeHref: "/blog" };
  return { title: "Untitled", closeHref: "/" };
}

/** document.title, kept in sync as routes stream in their metadata. */
function useDocumentTitle() {
  const [title, setTitle] = useState<string | null>(null);
  useEffect(() => {
    const read = () => setTitle(document.title);
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, []);
  return title;
}

/**
 * The browser's tabs: the home sections and the blog are always open; any
 * other route gets its own closable tab at the end.
 */
export function useTabs(pageTitle?: string) {
  const routePath = usePathname();
  const section = useActiveSection();
  const docTitle = useDocumentTitle();
  // The 404 page is prerendered as /_not-found; its real URL is only known in the browser
  const [clientPath, setClientPath] = useState<string | null>(null);
  useEffect(() => {
    if (pageTitle) setClientPath(window.location.pathname);
  }, [pageTitle, routePath]);
  const pathname = pageTitle ? (clientPath ?? "") : routePath;

  const tabs: BrowserTab[] = NAV_ITEMS.map((item) => ({
    id: item.id,
    title: item.label,
    href: item.href,
    inPage: item.inPage,
    preview: item.preview,
  }));

  let pageTab: BrowserTab | null = null;
  if (pageTitle || (pathname !== "/" && section === null)) {
    const page = describePage(pathname);
    // Blog posts: the real title beats a title-cased slug
    const fromDoc =
      pathname.startsWith("/blog/") && docTitle?.endsWith(TITLE_SUFFIX)
        ? docTitle.slice(0, -TITLE_SUFFIX.length)
        : null;
    const title = pageTitle ?? fromDoc ?? page.title;
    pageTab = {
      id: "page",
      title,
      href: pathname || "/",
      inPage: false,
      preview: title,
      closeHref: page.closeHref,
    };
    tabs.push(pageTab);
  }

  const active: TabId = pageTab ? "page" : (section ?? "home");

  // What the address bar shows after the host
  const path =
    pathname === "/" && !pageTab
      ? section && section !== "home"
        ? `/#${section}`
        : ""
      : pathname;

  return { tabs, active, path };
}
