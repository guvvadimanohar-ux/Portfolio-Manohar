import React, { useState, useEffect, useRef, FormEvent } from "react";
import "./styles/ChatPanel.css";

type Message = {
  role: "user" | "assistant" | "error";
  content: string;
};

const SUGGESTIONS = [
  "What projects has Manohar built?",
  "What are his Generative AI and ML skills?",
  "Tell me about his internship at Kulture Hire",
  "What is his educational background?",
];

const ChatPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am Manohar's AI portfolio assistant. Feel free to ask me anything about his projects, skills, education, experience, or career focus in Data Science and AI.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: newHistory.filter((m) => m.role === "user" || m.role === "assistant"),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || data?.details || `Request failed with status ${res.status}`);
      }

      const answer = data?.answer || "I could not retrieve an answer at this time.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please check server and try again.";
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: `Unable to get response: ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="chat-panel" role="dialog" aria-modal="true" aria-label="Portfolio AI Chat">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-status-dot"></div>
          <h3>Manohar's Portfolio Assistant</h3>
        </div>
        <button onClick={onClose} aria-label="Close chat" className="close-btn" type="button">
          ✕
        </button>
      </div>

      <div className="chat-messages" id="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {messages.length === 1 && (
          <div className="chat-intro-banner">
            <div><strong>Suggested questions:</strong></div>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  className="suggestion-chip"
                  onClick={() => handleSend(s)}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="chat-bubble assistant">
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={onSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          aria-label="Chat input"
          disabled={loading}
          autoFocus
        />
        <button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
