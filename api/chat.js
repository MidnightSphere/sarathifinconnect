import { loanServices } from "../src/data/loan-services-data.js";
import { chatbotKnowledge } from "../src/data/chatbot-knowledge.js";

export const config = { maxDuration: 60 };

const MAX_MESSAGES = 8;
const MAX_USER_MESSAGE_LENGTH = 1200;
const MAX_ASSISTANT_MESSAGE_LENGTH = 8000;
const MAX_DETAILED_SERVICES = 2;
const GEMINI_TIMEOUT_MS = 25_000;
const RETRY_DELAY_MS = 600;
const GENERIC_QUERY_TERMS = new Set([
  "about",
  "and",
  "are",
  "can",
  "could",
  "does",
  "for",
  "from",
  "give",
  "have",
  "help",
  "how",
  "information",
  "loan",
  "loans",
  "me",
  "more",
  "need",
  "please",
  "tell",
  "the",
  "this",
  "what",
  "which",
  "with",
]);

const systemPrompt = `You are the Sarathi FinConnect website assistant. Help visitors understand the loan services described in the supplied website information. Be warm and very concise.

Keep every reply short: for greetings such as "Hi" or "Hii", reply with only a friendly greeting and a brief offer to help, in one sentence. For simple questions, answer in 1–2 short sentences. For questions that genuinely need several facts or steps, use at most 4 brief bullet points instead of a paragraph. Do not add a long introduction, repeat the question, or include unrelated details. Mention that rates or eligibility are indicative only when discussing those topics; do not repeat the disclaimer in unrelated replies.

Use only the supplied website information for claims about Sarathi FinConnect and its services. Rates, tenures, age ranges, and credit-score figures are illustrative references, not promises or current lender quotes. Explain that eligibility, rates, fees, and approval depend on the lender's assessment. Do not give personalized financial, legal, or tax advice, predict approval, or invent contact details or policies. For questions outside the supplied information, say you don't have enough information and suggest contacting a Sarathi FinConnect advisor.

Never request or repeat sensitive personal or financial data such as PAN, Aadhaar, bank-account details, passwords, or OTPs. If a visitor shares such information, advise them not to share it in chat. Do not claim to submit an enquiry or application for the visitor.`;

function getLoanContext(messages) {
  const query = messages
    .filter(({ role }) => role === "user")
    .map(({ content }) => content.toLowerCase())
    .join(" ");
  const queryTerms = new Set(
    query
      .match(/[a-z0-9]+/g)
      ?.filter((term) => term.length > 2 && !GENERIC_QUERY_TERMS.has(term)) ||
      [],
  );
  const detailedServices = loanServices
    .map((service) => {
      const searchableText = [
        service.id,
        service.name,
        service.category,
        service.intro,
        service.highlights.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const score = [...queryTerms].reduce(
        (total, term) => total + (searchableText.includes(term) ? 1 : 0),
        0,
      );
      return { service, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, MAX_DETAILED_SERVICES)
    .map(({ service }) => ({
      name: service.name,
      category: service.category,
      rate: service.rate,
      tenure: service.tenure,
      intro: service.intro,
      highlights: service.highlights,
      eligibility: service.eligibility,
      documents: service.documents,
      steps: service.steps,
      terms: service.terms,
      faqs: service.faqs,
    }));

  return {
    catalog: loanServices.map(({ name, category, summary }) => ({
      name,
      category,
      summary,
    })),
    detailedServices,
  };
}

function getGreetingReply(message) {
  const normalized = message
    .trim()
    .toLowerCase()
    .replace(/[!.?,]+$/g, "")
    .replace(/\s+/g, " ");

  if (
    /^(hi+|hello+|hey+|good morning|good afternoon|good evening)$/.test(
      normalized,
    )
  ) {
    return "Hi! How can I help you explore loan options?";
  }

  return null;
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const contentLength = Number(request.headers["content-length"]);
  if (Number.isFinite(contentLength) && contentLength > 48_000) {
    return response.status(413).json({ error: "Message is too large." });
  }

  let body = request.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return response.status(400).json({ error: "Invalid request body." });
    }
  }

  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    return response.status(400).json({ error: "Send a message to continue." });
  }

  const messages = body.messages.slice(-MAX_MESSAGES);
  if (
    messages.some(
      (message) =>
        !message ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        message.content.trim().length === 0 ||
        message.content.length >
          (message.role === "user"
            ? MAX_USER_MESSAGE_LENGTH
            : MAX_ASSISTANT_MESSAGE_LENGTH),
    ) ||
    messages[messages.length - 1].role !== "user"
  ) {
    return response.status(400).json({ error: "Please send a valid message." });
  }

  while (messages[0]?.role === "assistant") {
    messages.shift();
  }

  const greetingReply = getGreetingReply(messages[messages.length - 1].content);
  if (greetingReply) {
    return response.status(200).json({ reply: greetingReply });
  }

  const apiKey = globalThis.process?.env?.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not configured.");
    return response.status(500).json({ error: "Chat is not configured yet." });
  }

  try {
    const requestBody = JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: `${systemPrompt}\n\nGeneral company knowledge and FAQs:\n${JSON.stringify(chatbotKnowledge)}\n\nRelevant loan catalog and details:\n${JSON.stringify(getLoanContext(messages))}`,
          },
        ],
      },
      contents: messages.map(({ role, content }) => ({
        role: role === "assistant" ? "model" : "user",
        parts: [{ text: content.trim() }],
      })),
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.4,
      },
    });

    let geminiResponse;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: requestBody,
          signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
        },
      );
      if (geminiResponse.status !== 503 || attempt === 1) break;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }

    if (!geminiResponse.ok) {
      console.error(
        `Gemini returned status ${geminiResponse.status}${geminiResponse.status === 503 ? " after retry" : ""}.`,
      );
      if (geminiResponse.status === 503) {
        return response.status(503).json({
          error: "Gemini is temporarily busy. Please try again in a moment.",
        });
      }
      return response.status(geminiResponse.status === 429 ? 503 : 502).json({
        error:
          geminiResponse.status === 429
            ? "Chat is temporarily rate-limited. Please wait a moment and try again."
            : "The assistant is temporarily unavailable. Please try again.",
      });
    }

    const result = await geminiResponse.json();
    const answer = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter((text) => typeof text === "string")
      .join("");
    if (typeof answer !== "string" || answer.trim().length === 0) {
      console.error("Gemini returned an empty chat response.");
      return response.status(502).json({
        error: "The assistant could not create a reply. Please try again.",
      });
    }

    return response.status(200).json({ reply: answer.trim() });
  } catch (error) {
    console.error("Gemini chat request failed.", error);
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      return response.status(504).json({
        error: "Gemini took too long to respond. Please try again.",
      });
    }
    return response.status(502).json({
      error: "The assistant is temporarily unavailable. Please try again.",
    });
  }
}
