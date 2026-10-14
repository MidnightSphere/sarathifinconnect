import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "../../data/navigation";
import MobileMenu from "./MobileMenu";

/**
 * Set of hrefs that have a corresponding navbar link.
 * Sections NOT in this set cause Home ("#top") to become active.
 */
const MAPPED_HREFS = new Set(navLinks.map((l) => l.href));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Default "#top" → Home link is active on initial load / page top
  const [activeHref, setActiveHref] = useState("#top");
  const navContainerRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // ── Scroll shadow ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  // ── IntersectionObserver — active section tracking ───────────────────────
  useEffect(() => {
    if (!isHome) return;

    // Observe every known section so unmapped ones can fall back to Home.
    const ALL_SECTION_IDS = ["top", "about-us", "services", "contact", "journey"];
    const allSections = ALL_SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    // Keep a live map of intersection ratios keyed by element id.
    const ratioMap = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratioMap.set(entry.target.id, entry.intersectionRatio);
        });

        // Pick the section with the highest visibility.
        let bestId = null;
        let bestRatio = 0;
        ratioMap.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId !== null && bestRatio > 0) {
          const candidate = `#${bestId}`;
          // Map to navbar link, or fall back to Home.
          setActiveHref(MAPPED_HREFS.has(candidate) ? candidate : "#top");
        }
      },
      // Upper-middle band of the viewport; avoids flickering at boundaries.
      { rootMargin: "-25% 0px -50%", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    allSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5">
      {/* ref covers nav pill + mobile dropdown so outside-click works correctly */}
      <div ref={navContainerRef} className="relative w-full max-w-6xl">
        <motion.nav
          aria-label="Main navigation"
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-6 md:px-8 md:py-3 ${scrolled ? "border-white/80 bg-white/88 shadow-[0_5px_18px_rgba(11,31,77,0.09)] backdrop-blur-lg" : "border-white/75 bg-white/70 shadow-[0_2px_10px_rgba(11,31,77,0.045)] backdrop-blur-sm"}`}
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
            <span className="ml-1 truncate font-museo text-[1.05rem] font-semibold leading-none tracking-wide text-brand-navy sm:text-xl md:ml-2 md:text-[1.35rem]">
              Sa&#8377;athi FinConnect
            </span>
            {/* <img
              src="/logo/sarathi-finconnect-tile-logo.svg"
              alt="Sarathi FinConnect"
              className="h-4 w-auto max-w-[9.5rem] object-contain sm:h-5 md:h-[1.35rem] md:max-w-none"
            /> */}
          </Link>
          <ul className="m-0 hidden list-none items-center gap-1 p-0 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={getHref(link.href)}
                  className={`relative block px-4 py-2 text-sm no-underline transition-colors duration-200 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px after:origin-left after:bg-brand-gold after:transition-transform after:duration-200 ${activeHref === link.href ? "font-bold text-brand-gold after:scale-x-100" : "font-semibold text-text-primary after:scale-x-0 hover:text-brand-gold hover:after:scale-x-100"}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
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
          onClose={closeMobileMenu}
          activeHref={activeHref}
          isHome={isHome}
        />
      </div>
    </header>
  );
}
