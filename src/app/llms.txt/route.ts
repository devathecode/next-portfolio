import { buildLlmsTxt, markdownResponse } from "@/lib/llms";

export const revalidate = 3600;

export async function GET() {
  return markdownResponse(await buildLlmsTxt());
}
