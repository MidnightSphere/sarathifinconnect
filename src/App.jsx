import { lazy, Suspense, useCallback, useLayoutEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigationType, useParams } from "react-router-dom";
import SplitRevealSplash from "./components/ui/split-reveal/SplitRevealSplash";
import SplashProvider from "./components/ui/split-reveal/SplashProvider";
import { Analytics } from "@vercel/analytics/react";
import Chatbot from "./components/chatbot/Chatbot";
import SEOHead from "./seo/SEOHead";
import { trackOutboundContactClicks } from "./seo/analytics";

const HomePage = lazy(() => import("./pages/HomePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const LoanDetailPage = lazy(() => import("./pages/loans/LoanDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AboutPage = lazy(() => import("./pages/about/AboutPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const EmiCalculatorPage = lazy(() => import("./pages/EmiCalculatorPage"));

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
  const navigationType = useNavigationType();
  useLayoutEffect(() => {
    if (navigationType === "POP" && pathname === "/services" && !hash) {
      try {
        const savedScroll = sessionStorage.getItem("sarathi_services_scroll");
        if (savedScroll !== null) {
          sessionStorage.removeItem("sarathi_services_scroll");
          window.scrollTo({ top: Number(savedScroll), behavior: "instant" });
          return;
        }
      } catch {
        // Continue with the normal scroll behavior when storage is unavailable.
      }
    }
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
  }, [pathname, hash, navigationType]);
  return null;
}

function LegacyLoanRedirect() {
  const { slug } = useParams();
  return <Navigate replace to={`/services/${slug}`} />;
}

function RouteLoading() {
  return (
    <div className="grid min-h-[50vh] place-items-center px-4 text-center font-space text-sm text-brand-navy/70" role="status" aria-live="polite">
      Loading page…
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [splashDone, setSplashDone] = useState(!SHOW_SPLASH_ON_BOOT);
  const completeSplash = useCallback(() => {
    setSplashDone(true);
  }, []);

  useLayoutEffect(() => trackOutboundContactClicks(), []);

  return (
    <SplashProvider value={splashDone}>
      <>
        <SEOHead />
        <div
          className="min-h-screen overflow-x-clip bg-surface"
          inert={!splashDone}
          aria-hidden={!splashDone}
        >
          <ScrollToTop />
          <Suspense fallback={<RouteLoading />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/emi-calculator" element={<EmiCalculatorPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<LoanDetailPage />} />
              <Route path="/loans/:slug" element={<LegacyLoanRedirect />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
        {!splashDone && <SplitRevealSplash onComplete={completeSplash} />}
        {splashDone && <Chatbot />}
        <Analytics />
      </>
    </SplashProvider>
  );
}
