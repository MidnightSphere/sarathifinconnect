/**
 * DiagonalMarquee — a continuously scrolling diagonal gold ticker strip.
 *
 * Sits at the bottom boundary of the Services section, overlapping the
 * transition into the following light section. Purely decorative.
 */

const PHRASES = [
  "GUIDANCE YOU CAN TRUST",
  "HOME LOANS",
  "BUSINESS FINANCE",
  "PERSONAL LOANS",
  "LOAN AGAINST PROPERTY",
  "MSME FINANCE",
  "FINANCIAL SOLUTIONS",
  "SUPPORTING YOUR NEXT STEP",
  "CONNECTING YOU WITH LENDERS",
];

const SEPARATOR = "\u00A0\u00A0\u25C6\u00A0\u00A0"; // ◆ diamond with spacing

// Build a single run of all phrases joined by separators
const singleRun = PHRASES.join(SEPARATOR) + SEPARATOR;

export default function DiagonalMarquee() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-5 left-0 right-0 z-30 select-none overflow-hidden sm:-bottom-6 md:-bottom-7"
      style={{ height: "clamp(36px, 4.2vw, 56px)" }}
    >
      {/* Rotated inner — wider than viewport to cover corners */}
      <div
        className="absolute left-1/2 top-1/2 flex items-center whitespace-nowrap bg-brand-gold"
        style={{
          width: "120vw",
          height: "100%",
          transform: "translate(-50%, -50%) rotate(-2.5deg)",
        }}
      >
        {/* Animated track — two copies for seamless loop */}
        <div className="marquee-track flex items-center">
          <span className="marquee-content inline-block font-bricolage text-[clamp(0.65rem,1.1vw,0.95rem)] font-bold uppercase tracking-[0.12em] text-brand-navy-deep">
            {singleRun}
          </span>
          <span className="marquee-content inline-block font-bricolage text-[clamp(0.65rem,1.1vw,0.95rem)] font-bold uppercase tracking-[0.12em] text-brand-navy-deep">
            {singleRun}
          </span>
        </div>
      </div>
    </div>
  );
}

