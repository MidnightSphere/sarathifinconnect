import { useEffect, useRef, useState } from "react";
import {
  Bot,
  LoaderCircle,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import "./Chatbot.css";

const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1200;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [isOpen, isSending, messages]);

  async function sendMessage(event) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending || content.length > MAX_MESSAGE_LENGTH) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-MAX_MESSAGES) }),
      });
      const responseText = await response.text();
      let result;

      try {
        result = responseText ? JSON.parse(responseText) : null;
      } catch {
        result = null;
      }

      if (!result || typeof result !== "object") {
        throw new Error(
          `Chat service returned an empty or invalid response (HTTP ${response.status}). ${
            import.meta.env.DEV
            ? "Run this project with `npm run dev` and configure GEMINI_API_KEY."
              : "Please try again later."
          }`,
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error || "The assistant is temporarily unavailable.",
        );
      }

      if (typeof result.reply !== "string" || !result.reply.trim()) {
        throw new Error(
          "The assistant returned an empty reply. Please try again.",
        );
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.reply.trim() },
      ]);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Message failed to send. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleInputKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="chatbot">
      {isOpen && (
        <section
          className="chatbot__panel"
          aria-labelledby="chatbot-title"
          aria-label="Sarathi FinConnect chat"
        >
          <header className="chatbot__header">
            <span className="chatbot__avatar" aria-hidden="true">
              <Bot size={20} />
            </span>
            <div className="chatbot__heading">
              <h2 id="chatbot-title">Sarathi Assistant</h2>
              <p>Here to help you explore your options</p>
            </div>
            <button
              className="chatbot__close"
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </header>

          <div className="chatbot__messages" role="log" aria-live="polite">
            <div className="chatbot__message chatbot__message--assistant">
              Hi! I can help you explore the loan information on our site. What
              would you like to know?
            </div>
            {messages.map((message, index) => (
              <div
                className={`chatbot__message chatbot__message--${message.role}`}
                key={`${message.role}-${index}`}
              >
                {message.content}
              </div>
            ))}
            {isSending && (
              <div
                className="chatbot__message chatbot__message--assistant chatbot__thinking"
                aria-label="Assistant is responding"
              >
                <LoaderCircle size={16} aria-hidden="true" />
                <span>Thinking…</span>
              </div>
            )}
            {error && (
              <p className="chatbot__error" role="alert">
                {error}
              </p>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          <form className="chatbot__form" onSubmit={sendMessage}>
            <label className="chatbot__sr-only" htmlFor="chatbot-input">
              Your message
            </label>
            <textarea
              id="chatbot-input"
              ref={inputRef}
              className="chatbot__input"
              placeholder="Ask about a loan..."
              value={draft}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={1}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isSending}
            />
            <button
              className="chatbot__send"
              type="submit"
              aria-label="Send message"
              disabled={!draft.trim() || isSending}
            >
              <Send size={18} />
            </button>
          </form>
          <p className="chatbot__disclaimer">
            General information only. Please don&apos;t share sensitive details.
          </p>
        </section>
      )}

      <button
        className={`chatbot__launcher${isOpen ? " chatbot__launcher--open" : ""}`}
        type="button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        <span>{isOpen ? "Close" : "Chat with us"}</span>
      </button>
    </div>
  );
}
