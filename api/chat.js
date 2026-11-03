import { loanServices } from "../src/data/loan-services-data.js";

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1200;

const systemPrompt = `You are the Sarathi FinConnect website assistant. Help visitors understand the loan services described in the supplied website information. Be warm, clear, and concise.

Use only the supplied website information for claims about Sarathi FinConnect and its services. Rates, tenures, age ranges, and credit-score figures are illustrative references, not promises or current lender quotes. Explain that eligibility, rates, fees, and approval depend on the lender's assessment. Do not give personalized financial, legal, or tax advice, predict approval, or invent contact details or policies. For questions outside the supplied information, say you don't have enough information and suggest contacting a Sarathi FinConnect advisor.

Never request or repeat sensitive personal or financial data such as PAN, Aadhaar, bank-account details, passwords, or OTPs. If a visitor shares such information, advise them not to share it in chat. Do not claim to submit an enquiry or application for the visitor.`;

function getLoanContext() {
  return loanServices.map(
    ({
      name,
      category,
      rate,
      tenure,
      intro,
      summary,
      highlights,
      eligibility,
      terms,
      faqs,
    }) => ({
      name,
      category,
      rate,
      tenure,
      intro,
      summary,
      highlights,
      eligibility,
      terms,
      faqs,
    }),
  );
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = globalThis.process?.env?.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is not configured.");
    return response.status(500).json({ error: "Chat is not configured yet." });
  }

  const contentLength = Number(request.headers["content-length"]);
  if (Number.isFinite(contentLength) && contentLength > 16_000) {
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
        message.content.length > MAX_MESSAGE_LENGTH,
    ) ||
    messages[messages.length - 1].role !== "user"
  ) {
    return response.status(400).json({ error: "Please send a valid message." });
  }

  try {
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: `${systemPrompt}\n\nWebsite loan information:\n${JSON.stringify(getLoanContext())}`,
            },
            ...messages.map(({ role, content }) => ({
              role,
              content: content.trim(),
            })),
          ],
          max_completion_tokens: 700,
          temperature: 0.4,
        }),
        signal: AbortSignal.timeout(25_000),
      },
    );

    if (!groqResponse.ok) {
      console.error(`Groq returned status ${groqResponse.status}.`);
      return response.status(groqResponse.status === 429 ? 503 : 502).json({
        error: "The assistant is temporarily unavailable. Please try again.",
      });
    }

    const result = await groqResponse.json();
    const answer = result.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || answer.trim().length === 0) {
      console.error("Groq returned an empty chat response.");
      return response.status(502).json({
        error: "The assistant could not create a reply. Please try again.",
      });
    }

    return response.status(200).json({ reply: answer.trim() });
  } catch (error) {
    console.error("Groq chat request failed.", error);
    return response.status(502).json({
      error: "The assistant is temporarily unavailable. Please try again.",
    });
  }
}
