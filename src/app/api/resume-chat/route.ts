import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { RESUME_CONTENT } from "@/data/resume-content";

const CHAT_LIMIT = 30;
const CHAT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

async function isRateLimited(req: NextRequest): Promise<boolean> {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  const key = `chat:${ip}`;
  const windowStart = new Date(Date.now() - CHAT_WINDOW_MS).toISOString();

  const { count } = await supabaseAdmin
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip", key)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= CHAT_LIMIT) return true;

  await supabaseAdmin.from("login_attempts").insert({ ip: key });
  return false;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const today = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const SYSTEM_INSTRUCTION = `You are a helpful AI assistant for Devanshu Verma's portfolio website.
Today's date is ${today}. Use this to calculate exact durations when "present" appears in the resume.
Your role is to answer questions about Devanshu's resume, skills, work experience, projects, and background.
Be concise, professional, and helpful. Keep answers under 3-4 sentences unless more detail is clearly needed.
Only answer questions related to Devanshu's professional background.
If asked something unrelated, politely redirect to resume-related topics.

IMPORTANT — Contact link rule:
If the question asks for something that is NOT covered in the resume below (e.g. salary expectations, availability dates, references, specific portfolio links, anything not mentioned), end your reply with exactly this on its own line:
[Contact Devanshu directly](mailto:code.devanshu@gmail.com)

Do NOT add this link when the resume already contains a clear answer.

Here is Devanshu's full resume:

${RESUME_CONTENT}`;

type HistoryItem = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  if (await isRateLimited(req)) {
    return new Response("Too many requests. Please try again later.", { status: 429 });
  }

  try {
    const body = await req.json();
    const message: string = body?.message;
    const history: HistoryItem[] = Array.isArray(body?.history) ? body.history : [];

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response("Message is required.", { status: 400 });
    }
    if (message.length > 2000) {
      return new Response("Message too long.", { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      // Disable thinking tokens — they break stream parsing in SDK 0.24.x
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any,
    });

    const mapped = history
      .filter((m) => m.content.trim())
      .map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.content }],
      }));

    // Gemini requires history to start with 'user'; drop any leading model turns
    const firstUser = mapped.findIndex((m) => m.role === "user");
    const chatHistory = firstUser >= 0 ? mapped.slice(firstUser) : [];

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessageStream(message);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("[resume-chat]", err);
    return new Response("Something went wrong. Please try again.", {
      status: 500,
    });
  }
}
