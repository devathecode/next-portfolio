import type { MetadataRoute } from "next";

const SITE_URL = "https://devanshuverma.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin/login", "/thankyou"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
