import { GoogleGenerativeAI } from "@google/generative-ai";
import { RESUME_CONTENT } from "@/data/resume-content";

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

export async function POST(req: Request) {
  try {
    const { message, history } = (await req.json()) as {
      message: string;
      history: HistoryItem[];
    };

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
