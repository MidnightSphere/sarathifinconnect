import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const THEME = {
  navy: "#0b1f4d",
  navyMid: "#10224d",
  navyLight: "#18356f",
  gold: "#f0bd46",
  white: "#ffffff",
};
const BLOB = {
  points: 14,
  wobbleIntensity: 0.2,
  stiffness: 140,
  damping: 22,
  rimColor: "rgba(240, 189, 70, 0.85)",
  rimGlow: "drop-shadow(0 0 14px rgba(240, 189, 70, 0.55))",
  fadeOutMs: 480,
};
let isRunning = false;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function nextFrames(count = 2) {
  return new Promise((resolve) => {
    const step = (remaining) => remaining <= 0 ? resolve() : requestAnimationFrame(() => step(remaining - 1));
    step(count);
  });
}

function createCover(label) {
  const cover = document.createElement("div");
  cover.setAttribute("aria-hidden", "true");
  Object.assign(cover.style, {
    position: "fixed", inset: "0", zIndex: "9998", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "14px", opacity: "0", pointerEvents: "none",
    background: [
      "radial-gradient(circle at 50% 42%, rgba(240, 189, 70, 0.16), transparent 46%)",
      `linear-gradient(135deg, ${THEME.navy} 0%, ${THEME.navyMid} 45%, ${THEME.navyLight} 100%)`,
    ].join(", "),
  });
  const mark = document.createElement("span");
  Object.assign(mark.style, {
    display: "grid", placeItems: "center", width: "64px", height: "64px", border: `1.5px solid ${THEME.gold}`,
    borderRadius: "9999px", color: THEME.gold, fontFamily: 'Georgia, "Times New Roman", serif', fontSize: "34px", lineHeight: "1",
  });
  mark.textContent = "S";
  cover.appendChild(mark);
  if (label) {
    const text = document.createElement("span");
    Object.assign(text.style, { maxWidth: "80vw", textAlign: "center", color: THEME.white, fontFamily: "inherit", fontSize: "15px", fontWeight: "700", letterSpacing: "-0.01em" });
    text.textContent = label;
    cover.appendChild(text);
  }
  return cover;
}

async function playBlobTransition(origin, onCovered, { label } = {}) {
  const { OrganicBlobPortal } = await import("motion-organic");
  const cover = createCover(label);
  document.body.appendChild(cover);
  const blob = new OrganicBlobPortal({
    nextPageEl: cover,
    container: document.body,
    points: BLOB.points,
    wobbleIntensity: BLOB.wobbleIntensity,
    stiffness: BLOB.stiffness,
    damping: BLOB.damping,
    rimColor: BLOB.rimColor,
  });
  if (blob.rimPath) blob.rimPath.style.filter = BLOB.rimGlow;
  try {
    await blob.trigger(origin, onCovered);
    await nextFrames(2);
    const fade = cover.animate([{ opacity: 1 }, { opacity: 0 }], { duration: BLOB.fadeOutMs, easing: "ease-out", fill: "forwards" });
    await fade.finished;
  } finally {
    cover.remove();
    blob.destroy();
  }
}

function getOrigin(event) {
  if (event.detail === 0 && event.currentTarget?.getBoundingClientRect) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
  }
  return { clientX: event.clientX, clientY: event.clientY };
}

export default function useBlobNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback((event, to, options = {}) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (isRunning) return;
    if (location.pathname === "/services" && /^\/services\/[^/]+$/.test(to)) {
      try { sessionStorage.setItem("sarathi_services_scroll", String(window.scrollY)); } catch { /* Storage may be disabled. */ }
    }
    if (prefersReducedMotion()) { navigate(to); return; }
    isRunning = true;
    const origin = getOrigin(event);
    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      navigate(to);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    playBlobTransition(origin, go, options)
      .catch((error) => console.warn("[blob transition] failed, navigating directly:", error))
      .finally(() => { go(); isRunning = false; });
  }, [location.pathname, navigate]);
}
