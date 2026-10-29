import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../../data/navigation";
import ArrowButton from "../ui/ArrowButton";
import MobileMenu from "./MobileMenu";
import useSplashDone from "../ui/split-reveal/useSplashDone";

const NAV_OFFSET = 96;
const JOURNEY_SELECTOR = '[aria-label="Sarathi FinConnect financial journey"]';

function getNavSection(href) {
  const id = href.slice(1);
  const section = document.getElementById(id);
  if (!section || section.closest(JOURNEY_SELECTOR)) return null;
  return section;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Default "#top" → Home link is active on initial load / page top
  const [activeHref, setActiveHref] = useState("#top");
  const navContainerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const prefersReducedMotion = useReducedMotion();
  const splashDone = useSplashDone();
  const pillTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 380, damping: 34, mass: 0.75 };

  // ── Scroll shadow ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const scrollToHash = useCallback((hash, smooth = true) => {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior = smooth && !prefersReducedMotion ? "smooth" : "auto";

    if (!id || id === "top") {
      window.scrollTo({ top: 0, behavior });
      return true;
    }

    const section = getNavSection(hash);
    if (!section) return false;
    const element =
      id === "services"
        ? document.getElementById("services-content") || section
        : section;

    const top =
      element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: id === "services" ? "instant" : behavior,
    });
    return true;
  }, []);

  const navigateFromMobileMenu = useCallback(
    (event, href) => {
      event.preventDefault();
      const hash = href.slice(href.indexOf("#"));
      if (isHome && !getNavSection(hash)) return;
      if (isHome) {
        if (!scrollToHash(hash)) return;
      }
      closeMobileMenu();
      navigate({ pathname: "/", hash });
    },
    [closeMobileMenu, isHome, navigate, scrollToHash],
  );

  useEffect(() => {
    if (!isHome || !location.hash || !getNavSection(location.hash)) return;

    const timer = window.setTimeout(() => scrollToHash(location.hash), 260);
    return () => window.clearTimeout(timer);
  }, [isHome, location.key, location.hash, scrollToHash]);

  // Track only actual navbar sections. Journey cards with matching legacy IDs
  // are deliberately excluded; future sections work automatically when their
  // IDs are added outside the Journey component.
  useEffect(() => {
    if (!isHome) return;

    let frame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const readingLine = NAV_OFFSET + 12;
        const sections = navLinks
          .map((link) => ({ link, section: getNavSection(link.href) }))
          .filter(({ section }) => section)
          .map(({ link, section }) => ({
            href: link.href,
            rect: section.getBoundingClientRect(),
          }));

        const current = sections.find(
          ({ rect }) => rect.top <= readingLine && rect.bottom > readingLine,
        );
        if (current) setActiveHref(current.href);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [isHome]);

  // ── Keyboard: Escape closes mobile menu ─────────────────────────────────
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMobileMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMobileMenu]);

  // ── Outside-click: closes mobile menu ───────────────────────────────────
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onPointerDown = (event) => {
      // Close only when the click lands outside the whole navbar container.
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };
    // pointerdown fires before click, so navigation links still work normally.
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileMenuOpen, closeMobileMenu]);

  // On home: use plain hash; on other pages: navigate to home then hash.
  const getHref = (hash) => (isHome ? hash : `/${hash}`);
  const navigateFromDesktopNav = (event, href) => {
    event.preventDefault();
    if (isHome && !getNavSection(href)) return;
    if (isHome && !scrollToHash(href)) return;
    navigate({ pathname: "/", hash: href });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5">
      {/* ref covers nav pill + mobile dropdown so outside-click works correctly */}
      <div ref={navContainerRef} className="relative w-full max-w-6xl">
        <motion.nav
          aria-label="Main navigation"
          initial={{ y: -18, opacity: 0 }}
          animate={splashDone ? { y: 0, opacity: 1 } : { y: -18, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`navbar-glass flex items-center justify-between rounded-full border px-4 py-2.5 sm:px-6 md:px-8 md:py-3 ${scrolled ? "navbar-glass-scrolled" : ""}`}
        >
          <Link
            to="/"
            className="flex min-w-0 items-center gap-4 no-underline"
            aria-label="Sarathi FinConnect — home"
          >
            <img
              src="/logo/sarathi-finconnect-only-logo.svg"
              alt=""
              aria-hidden="true"
              className="h-8 w-auto shrink-0 object-contain md:h-9"
            />
            <span className="ml-1 truncate font-bricolage text-[1.05rem] font-[750] leading-none tracking-wide text-brand-navy sm:text-xl md:ml-2 md:text-[1.5rem]">
              sa
              <span className="text-[1.05rem] sm:text-xl md:text-[1.3rem]">
                &#8377;
              </span>
              athi finconnect
            </span>
          </Link>
          <nav aria-label="Main navigation links" className="hidden md:block">
            <ul className="m-0 flex list-none items-center gap-1 p-0">
              {navLinks.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <li key={link.href}>
                    <a
                      href={getHref(link.href)}
                      aria-current={isActive ? "location" : undefined}
                      onClick={(event) =>
                        navigateFromDesktopNav(event, link.href)
                      }
                      className={`relative block rounded-full px-4 py-2 text-sm no-underline transition-colors duration-200 hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold ${isActive ? "font-bold text-brand-navy" : "font-semibold text-text-primary"}`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="desktop-nav-pill"
                          transition={pillTransition}
                          className="absolute inset-0 rounded-full border border-brand-navy/5 bg-brand-navy/5 shadow-sm"
                          aria-hidden="true"
                        />
                      )}
                      <motion.span
                        className="relative z-10 inline-block"
                        animate={{ scale: isActive ? 1 : 0.98 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.28,
                          ease: [0.32, 0.72, 0, 1],
                        }}
                      >
                        {link.label}
                      </motion.span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="hidden md:block md:justify-self-end">
            <ArrowButton
              href={getHref("#contact")}
              onClick={(e) => navigateFromDesktopNav(e, "#contact")}
              size="sm"
              variant="navy"
              className="md:h-9"
            >
              Get Started
            </ArrowButton>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent text-brand-navy transition-colors hover:bg-brand-navy/5 focus-visible:outline-2 focus-visible:outline-brand-gold md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={21} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </motion.nav>
        <MobileMenu
          isOpen={mobileMenuOpen}
          onNavigate={navigateFromMobileMenu}
          activeHref={activeHref}
          isHome={isHome}
        />
      </div>
    </header>
  );
}
