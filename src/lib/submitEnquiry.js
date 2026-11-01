const RATE_LIMIT_KEY = "sarathi_enquiry_last_submit";
const RATE_LIMIT_MS = 30_000;
const DEFAULT_ENQUIRY_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxvM89TKSW5AZ0SY58DWbHDPg8H6EyURs5-QJZADnH5hmGc4NcOfyMCc06bRvNJsXsK/exec";

export async function submitEnquiry(payload) {
  const endpoint =
    import.meta.env.VITE_ENQUIRY_ENDPOINT || DEFAULT_ENQUIRY_ENDPOINT;

  try {
    const lastSubmit = Number(sessionStorage.getItem(RATE_LIMIT_KEY));
    if (lastSubmit && Date.now() - lastSubmit < RATE_LIMIT_MS) {
      throw new Error("Please wait before sending another enquiry.");
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Please wait")) throw error;
  }

  const nonce = crypto.randomUUID();
  await new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    const form = document.createElement("form");
    const target = `enquiry-${nonce}`;
    iframe.name = target;
    iframe.title = "Enquiry submission";
    iframe.hidden = true;
    iframe.src = "about:blank";
    form.action = endpoint;
    form.method = "POST";
    form.target = target;
    form.hidden = true;

    const fields = { ...payload, company: "", nonce };
    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value ?? "");
      form.append(input);
    }

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      iframe.removeEventListener("load", onFrameLoad);
      window.clearTimeout(timeout);
      form.remove();
      iframe.remove();
    };
    let submitted = false;
    const onFrameLoad = () => {
      if (!submitted) {
        submitted = true;
        try {
          form.submit();
        } catch {
          cleanup();
          reject(new Error("Unable to reach the enquiry service."));
        }
        return;
      }

      cleanup();
      resolve();
    };
    const onMessage = (event) => {
      if (event.data?.nonce !== nonce) return;
      if (event.origin !== "null") {
        const origin = new URL(event.origin);
        const isGoogleOrigin =
          origin.protocol === "https:" &&
          (origin.hostname === "script.google.com" ||
            origin.hostname.endsWith(".googleusercontent.com"));
        if (!isGoogleOrigin) return;
      }

      cleanup();
      if (event.data.success) {
        resolve();
      } else {
        reject(new Error(event.data.error || "Unable to save your enquiry."));
      }
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("The enquiry service did not respond. Please try again."));
    }, 30_000);

    window.addEventListener("message", onMessage);
    iframe.addEventListener("load", onFrameLoad);
    document.body.append(iframe, form);
  });

  try {
    sessionStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
  } catch {
    // Storage may be disabled.
  }
}
