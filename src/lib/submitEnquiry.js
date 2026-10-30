const RATE_LIMIT_KEY = "sarathi_enquiry_last_submit";
const RATE_LIMIT_MS = 30_000;

export async function submitEnquiry(payload) {
  const endpoint = import.meta.env.VITE_ENQUIRY_ENDPOINT || "https://api.web3forms.com/submit";
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;

  if (!endpoint || (endpoint.includes("web3forms.com") && !accessKey)) {
    if (import.meta.env.DEV) console.warn("Enquiry submission is not configured. Set VITE_ENQUIRY_ENDPOINT and VITE_WEB3FORMS_KEY.");
    throw new Error("Enquiry submission is not configured.");
  }

  try {
    const lastSubmit = Number(sessionStorage.getItem(RATE_LIMIT_KEY));
    if (lastSubmit && Date.now() - lastSubmit < RATE_LIMIT_MS) {
      throw new Error("Please wait before sending another enquiry.");
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Please wait")) throw error;
  }

  const body = { ...payload };
  if (endpoint.includes("web3forms.com")) body.access_key = accessKey;
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Unable to reach the enquiry service.");
  }
  if (!response.ok) throw new Error("The enquiry service rejected the request.");
  const result = await response.json().catch(() => ({}));
  if (result.success === false) throw new Error("The enquiry service rejected the request.");
  try { sessionStorage.setItem(RATE_LIMIT_KEY, String(Date.now())); } catch { /* Storage may be disabled. */ }
  return result;
}
