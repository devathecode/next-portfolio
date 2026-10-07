export const SITE_HOST = "devanshuverma.in";
export const SITE_URL = "https://www.devanshuverma.in";
/** The generated 1200x630 share card (src/app/opengraph-image.tsx). */
export const OG_IMAGE = `${SITE_URL}/opengraph-image`;
export const CONTACT_EMAIL = "code.devanshu@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/devthecoder/";
export const RESUME_PDF = "/resume/Resume.pdf";
export const RESUME_PDF_NAME = "Devanshu_Verma_Resume.pdf";

/** Posts with the most search impressions (Search Console), shown as "Most read" on the home page. */
export const POPULAR_POSTS = [
  "javascript-tail-call-optimization-runtime-reality",
  "minimum-release-age-package-managers-complete-guide",
];

/** Home-page section ids, top to bottom. Used by scroll-spy and the command palette. */
export const HOME_SECTIONS = ["home", "about", "work", "contact", "blog"] as const;
export type SectionId = (typeof HOME_SECTIONS)[number];

/** The browser's fixed tabs: one per home section, plus the blog. */
export const NAV_ITEMS: {
  id: SectionId;
  /** Tab title */
  label: string;
  href: string;
  /** In-page section on the home route (scrolls instead of routing). */
  inPage: boolean;
  /** Headline shown on the phone tab switcher's card */
  preview: string;
}[] = [
  { id: "home", label: "Devanshu Verma", href: "/", inPage: true, preview: "I build web apps that feel instant." },
  { id: "about", label: "About", href: "/#about", inPage: true, preview: "Building for the web, obsessing over the craft." },
  { id: "work", label: "Work", href: "/#work", inPage: true, preview: "Projects I have built and shipped." },
  { id: "contact", label: "Contact", href: "/#contact", inPage: true, preview: "Have a web app in mind?" },
  { id: "blog", label: "Blog", href: "/blog", inPage: false, preview: "Writing on frontend, CSS and the web." },
];
