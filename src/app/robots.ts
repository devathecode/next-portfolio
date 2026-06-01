import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PRIVATE = ["/admin/", "/thankyou", "/api/"];

/**
 * AI search, answer and training crawlers, welcomed by name. A crawler only
 * follows the most specific group that matches it, so these repeat the
 * private paths instead of inheriting them from "*".
 */
const AI_CRAWLERS = [
  // OpenAI: ChatGPT search, user-triggered browsing, training
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic: Claude search, user-triggered fetches, training
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini and AI Overviews, Apple Intelligence
  "Google-Extended",
  "GoogleOther",
  "Applebot",
  "Applebot-Extended",
  // Microsoft Copilot runs on Bing's index
  "Bingbot",
  // Meta AI, Amazon (Alexa, Rufus), DuckDuckGo, Mistral, Cohere, You.com
  "meta-externalagent",
  "Meta-ExternalFetcher",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
  "YouBot",
  // Common Crawl, which many models are trained on
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
