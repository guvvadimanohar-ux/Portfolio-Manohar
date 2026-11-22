import type { IncomingMessage, ServerResponse } from "http";
import { profile } from "../src/data/profile";

interface ChatRequest extends IncomingMessage {
  body?: {
    message?: string;
    history?: Array<{ role: string; content: string }>;
  } | string;
}

interface ChatResponse extends ServerResponse {
  status: (code: number) => ChatResponse;
  json: (data: unknown) => void;
}

export default async function handler(req: ChatRequest, res: ChatResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: "Invalid JSON body" });
      }
    }

    const { message, history } = (body as { message?: string; history?: Array<{ role: string; content: string }> }) || {};
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "A non-empty message string is required." });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured on the server." });
    }

    const systemPrompt = `You are a helpful, professional AI portfolio assistant for Guvvadi Manohar.
Answer questions accurately, concisely, and conversationally using ONLY the verified facts below.
If a question is unrelated to Manohar, his portfolio, skills, projects, education, experience, or career goals, politely explain that you can only answer questions about Guvvadi Manohar's portfolio and resume.
If a detail is not in the profile, state that it is not available in the profile rather than making assumptions.

Verified Profile:
${JSON.stringify(profile, null, 2)}`;

    const validHistory = Array.isArray(history)
      ? history
          .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-6)
      : [];

    const messages = [
      { role: "system", content: systemPrompt },
      ...validHistory,
      { role: "user", content: message.trim() },
    ];

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages,
        temperature: 0.2,
        max_tokens: 600,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return res.status(groqResponse.status).json({
        error: "Groq provider error",
        details: errorText,
      });
    }

    const data = await groqResponse.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || "No response received.";
    return res.status(200).json({ answer });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      error: "Internal server error",
      details: errorMsg,
    });
  }
}
