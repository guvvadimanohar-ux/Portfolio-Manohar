import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { profile } from "./src/data/profile";

function devChatApiPlugin(envKey: string | undefined): Plugin {
  return {
    name: "dev-chat-api",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: `Method ${req.method} Not Allowed` }));
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", async () => {
          try {
            const parsed = JSON.parse(body || "{}");
            const { message, history } = parsed;

            if (!message || typeof message !== "string" || !message.trim()) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "A non-empty message string is required." }));
              return;
            }

            const apiKey = envKey || process.env.GROQ_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "GROQ_API_KEY is not configured on the server. Please check your .env file.",
                })
              );
              return;
            }

            const systemPrompt = `You are a helpful, professional AI portfolio assistant for Guvvadi Manohar.
Answer questions accurately, concisely, and conversationally using ONLY the verified facts below.
If a question is unrelated to Manohar, his portfolio, skills, projects, education, experience, or career goals, politely explain that you can only answer questions about Guvvadi Manohar's portfolio and resume.
If a detail is not in the profile, state that it is not available in the profile rather than making assumptions.

Verified Profile:
${JSON.stringify(profile, null, 2)}`;

            const validHistory = Array.isArray(history)
              ? history
                  .filter((m: { role?: string; content?: string }) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
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
              const errText = await groqResponse.text();
              res.statusCode = groqResponse.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Groq provider error", details: errText }));
              return;
            }

            const data = await groqResponse.json();
            const answer = data.choices?.[0]?.message?.content?.trim() || "No response received.";
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ answer }));
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Server error", details: errorMsg }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;

  return {
    plugins: [react(), devChatApiPlugin(apiKey)],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-three": ["three", "three-stdlib"],
            "vendor-gsap": ["gsap", "@gsap/react"],
          },
        },
      },
    },
  };
});
