export function trackAnalyticsEvent(name, parameters = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, parameters);
}

export function trackOutboundContactClicks() {
  const onClick = (event) => {
    const target = event.target.closest?.("[data-analytics-event], a[href]");
    if (!target) return;
    const href = target.getAttribute("href") || "";
    const eventName =
      target.getAttribute("data-analytics-event") ||
      (href.startsWith("tel:")
        ? "phone_click"
        : href.startsWith("mailto:")
          ? "email_click"
          : null);
    if (eventName) {
      trackAnalyticsEvent(eventName, { page_path: window.location.pathname });
    }
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
