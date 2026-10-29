import { Routes, Route, useLocation } from "react-router-dom";
import { useCallback, useState, useLayoutEffect } from "react";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/services/ServicesCatalogPage";
import SplitRevealSplash from "./components/ui/split-reveal/SplitRevealSplash";
import SplashProvider from "./components/ui/split-reveal/SplashProvider";
import { Analytics } from "@vercel/analytics/react";

const SPLASH_SEEN_KEY = "sarathi_splash_seen";

function shouldShowSplashOnBoot() {
  if (typeof window === "undefined") return false;
  if (window.location.pathname !== "/" || window.location.hash) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;

  try {
    if (window.sessionStorage.getItem(SPLASH_SEEN_KEY) === "1") return false;
    window.sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

// Decide once per document boot, outside React's StrictMode double render.
const SHOW_SPLASH_ON_BOOT = shouldShowSplashOnBoot();

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const servicesTarget = id === "services";
      const target = document.getElementById(
        servicesTarget ? "services-content" : id,
      ) || document.getElementById(id);
      if (target) {
        target.scrollIntoView({
          behavior: servicesTarget
            ? "instant"
            : window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const location = useLocation();
  const [splashDone, setSplashDone] = useState(!SHOW_SPLASH_ON_BOOT);
  const completeSplash = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <SplashProvider value={splashDone}>
      <>
        <div
          className="min-h-screen overflow-x-clip bg-surface"
          inert={!splashDone}
          aria-hidden={!splashDone}
        >
          <ScrollToTop />
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
          </Routes>
        </div>
        {!splashDone && <SplitRevealSplash onComplete={completeSplash} />}
        <Analytics />
      </>
    </SplashProvider>
  );
}
