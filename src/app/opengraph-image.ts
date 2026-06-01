import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Devanshu Verma, React & Next.js frontend developer: I build web apps that feel instant.";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/**
 * The site's link preview: the first frame of the og:video loop
 * (public/og/home-loop.mp4, set in layout.tsx), so the still and the
 * motion version match. Platforms that don't play video show this.
 */
export default async function Image() {
  const png = await readFile(join(process.cwd(), "public/og/home-card.png"));
  return new Response(png, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
