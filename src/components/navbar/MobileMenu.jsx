import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { navLinks } from "../../data/navigation";

export default function MobileMenu({ isOpen, onNavigate, activeHref, isHome }) {
  const getHref = (hash) => (isHome ? hash : `/${hash}`);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="navbar-glass navbar-glass-menu absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-[1.5rem] border p-2 md:hidden"
        >
          <nav aria-label="Mobile navigation">
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {navLinks.map((link, index) => (
                <motion.li key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + index * 0.04 }}>
                  <a
                    href={getHref(link.href)}
                    onClick={(event) => onNavigate(event, getHref(link.href))}
                    className={`block rounded-xl px-4 py-3 text-[0.95rem] no-underline transition-colors hover:bg-brand-navy/5 focus-visible:outline-2 focus-visible:outline-brand-gold ${activeHref === link.href ? "font-bold text-brand-gold" : "font-semibold text-brand-navy"}`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <li className="mt-1 border-t border-border pt-2">
                <a
                  href={getHref("#contact")}
                  onClick={(event) => onNavigate(event, getHref("#contact"))}
                  className="flex items-center justify-between rounded-xl bg-brand-navy px-4 py-3 text-[0.95rem] font-semibold text-white no-underline transition-colors hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-brand-gold"
                >
                  Get Started <ArrowRight size={17} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
