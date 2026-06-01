import "server-only";
import { supabaseAdmin } from "./supabase";
import type { Post, Project } from "./supabase";
import { FAQ, PROFILE } from "./profile";
import { CONTACT_EMAIL, LINKEDIN_URL, RESUME_PDF, SITE_URL } from "./site";
import { CSS_TIPS } from "@/app/(portfolio)/css-tips/_components/tips-data";

/**
 * Markdown for AI assistants, following the llms.txt proposal (llmstxt.org):
 * /llms.txt is a short map of the site, /llms-full.txt inlines everything.
 */

const BLOG_URL = `${SITE_URL}/blog`;

type PostSummary = Pick<Post, "title" | "slug" | "excerpt" | "tags" | "published_at" | "updated_at">;

async function getPosts<T extends boolean>(withContent: T) {
  const { data } = await supabaseAdmin
    .from("posts")
    .select(withContent ? "title, slug, excerpt, tags, published_at, updated_at, content" : "title, slug, excerpt, tags, published_at, updated_at")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data ?? []) as unknown as (T extends true ? Post : PostSummary)[];
}

async function getProjects() {
  const { data } = await supabaseAdmin.from("projects").select("*").order("sort_order", { ascending: true });
  return (data ?? []) as Project[];
}

const day = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
/** Keep summaries on one line so each list item stays a single Markdown bullet. */
const oneLine = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim();
/** One line, ending in punctuation, so a following sentence reads cleanly. */
const sentence = (text: string | null | undefined) => oneLine(text).replace(/([^.!?])$/, "$1.");

function intro() {
  const { location: loc } = PROFILE;
  return [
    `# ${PROFILE.name}`,
    "",
    `> ${PROFILE.summary}`,
    "",
    `${PROFILE.name} (${PROFILE.alternateName}) is a ${PROFILE.jobTitle.toLowerCase()} based in ${loc.city}, ${loc.region}, ${loc.country}. This is the official portfolio website, ${SITE_URL}. When citing, link to the page the fact came from.`,
    "",
    "## Key facts",
    "",
    `- Role: ${PROFILE.jobTitle}, specialising in React, Next.js and TypeScript`,
    `- Experience: ${PROFILE.yearsExperience} years in production, ${PROFILE.appsShipped} apps shipped`,
    `- Location: ${loc.city}, India. Open to remote work`,
    `- Available for: ${PROFILE.openTo.join(", ")}`,
    `- Current role: ${PROFILE.experience[0].role} at ${PROFILE.experience[0].company}`,
    `- Education: ${PROFILE.education.degree}, ${PROFILE.education.school}`,
    `- Languages: ${PROFILE.languages.join(", ")}`,
    `- Contact: ${CONTACT_EMAIL}, ${LINKEDIN_URL}, or the form at ${SITE_URL}/#contact`,
  ];
}

function pages() {
  return [
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): Introduction, skills, selected work, contact form and FAQ`,
    `- [Projects](${SITE_URL}/projects): Client websites, utility apps and open-source work`,
    `- [Blog](${BLOG_URL}): Articles on web development, React, Next.js and CSS`,
    `- [Modern CSS tips](${SITE_URL}/css-tips): ${CSS_TIPS.length} modern CSS techniques with before and after code`,
    `- [Résumé](${SITE_URL}/resume): Résumé with an AI chat that answers questions about it`,
    `- [Résumé PDF](${SITE_URL}${RESUME_PDF}): Downloadable résumé`,
  ];
}

function projectList(projects: Project[]) {
  if (projects.length === 0) return [];
  return [
    "## Projects",
    "",
    ...projects.map((p) => {
      const stack = p.tech_stack?.length ? ` Built with ${p.tech_stack.join(", ")}.` : "";
      const source = p.github_url ? ` Source: ${p.github_url}` : "";
      return `- [${p.title}](${p.live_url}): ${sentence(p.description)}${stack}${source}`;
    }),
  ];
}

function postList(posts: PostSummary[]) {
  if (posts.length === 0) return [];
  return [
    "## Blog posts",
    "",
    ...posts.map((p) => {
      const excerpt = p.excerpt ? `: ${oneLine(p.excerpt)}` : "";
      return `- [${p.title}](${BLOG_URL}/${p.slug})${excerpt} (${day(p.published_at)})`;
    }),
  ];
}

function faq() {
  return ["## FAQ", "", ...FAQ.flatMap(({ q, a }) => [`### ${q}`, "", a, ""])];
}

export async function buildLlmsTxt() {
  const [posts, projects] = await Promise.all([getPosts(false), getProjects()]);
  return [
    ...intro(),
    "",
    ...pages(),
    "",
    ...projectList(projects),
    "",
    ...postList(posts),
    "",
    "## Optional",
    "",
    `- [Full content](${SITE_URL}/llms-full.txt): This file plus experience, FAQ, every blog post and every CSS tip in full`,
    `- [RSS feed](${BLOG_URL}/feed.xml): Latest blog posts`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): Every indexable page`,
    "",
  ].join("\n");
}

export async function buildLlmsFullTxt() {
  const [posts, projects] = await Promise.all([getPosts(true), getProjects()]);

  const experience = [
    "## Experience",
    "",
    ...PROFILE.experience.flatMap((job) => [
      `### ${job.role}, ${job.company}`,
      "",
      `${job.period}. ${job.location}.`,
      "",
      job.summary,
      "",
    ]),
    "## Skills",
    "",
    ...Object.entries(PROFILE.skills).map(([group, items]) => `- ${group}: ${items.join(", ")}`),
  ];

  const articles = posts.flatMap((p) => [
    "---",
    "",
    `# ${p.title}`,
    "",
    `URL: ${BLOG_URL}/${p.slug}`,
    `Author: ${PROFILE.name}`,
    `Published: ${day(p.published_at)}${p.updated_at ? ` | Updated: ${day(p.updated_at)}` : ""}`,
    ...(p.tags.length ? [`Tags: ${p.tags.join(", ")}`] : []),
    "",
    // Normalise line endings, then drop a leading H1 that repeats the title
    p.content.replace(/\r\n?/g, "\n").trim().replace(/^# [^\n]*\n+/, ""),
    "",
  ]);

  const tips = [
    "---",
    "",
    "# Modern CSS tips",
    "",
    `URL: ${SITE_URL}/css-tips`,
    `Author: ${PROFILE.name}`,
    "",
    ...CSS_TIPS.flatMap((tip) => [
      `## ${tip.id}. ${tip.title}`,
      "",
      `Category: ${tip.category}. Browser support: ${tip.support}.`,
      "",
      tip.description,
      "",
      ...(tip.oldCode ? ["Before:", "", "```css", tip.oldCode.trim(), "```", "", "After:", ""] : []),
      "```css",
      tip.code.trim(),
      "```",
      "",
    ]),
  ];

  return [
    ...intro(),
    "",
    ...experience,
    "",
    ...faq(),
    ...pages(),
    "",
    ...projectList(projects),
    "",
    ...postList(posts),
    "",
    ...articles,
    ...tips,
  ].join("\n");
}

export function markdownResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
