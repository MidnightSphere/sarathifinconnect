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

function PhraseGroup({ copy }) {
  return (
    <span className="floating-marquee__group" aria-hidden={copy || undefined}>
      {PHRASES.map((phrase) => (
        <span className="floating-marquee__item" key={phrase}>
          {phrase}
          <span className="floating-marquee__diamond" aria-hidden="true">◆</span>
        </span>
      ))}
    </span>
  );
}

/**
 * Decorative ticker; positioning is controlled by its page-level wrapper.
 * It intentionally does not participate in document flow.
 */
export default function FloatingMarquee({
  top = "calc(var(--home-hero-height, 100vh) - 24px)",
  left = "50%",
  width = "calc(100% + 5rem)",
  rotation = "-1.75deg",
  zIndex = 10,
}) {
  return (
    <div
      className="floating-marquee-position"
      role="img"
      aria-label={PHRASES.join(", ")}
      style={{
        "--floating-marquee-top": top,
        "--floating-marquee-left": left,
        "--floating-marquee-width": width,
        "--floating-marquee-rotation": rotation,
        "--floating-marquee-z": zIndex,
      }}
    >
      <div className="floating-marquee">
        <div className="floating-marquee__track" aria-hidden="true">
          <PhraseGroup />
          <PhraseGroup copy />
        </div>
      </div>
    </div>
  );
}
