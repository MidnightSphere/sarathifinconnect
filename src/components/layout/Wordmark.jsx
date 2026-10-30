export default function Wordmark({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative select-none overflow-hidden ${className}`.trim()}
      style={{ height: "clamp(46px, 8.5vw, 145px)" }}
    >
      <span
        className="absolute bottom-0 left-1/2 block whitespace-nowrap font-bricolage font-black leading-[0.82] tracking-[-0.075em] md:tracking-[0.03em]"
        style={{
          fontSize: "clamp(1.7rem, 9.3vw, 8.5rem)",
          transform: "translate(-50%, 22.5%)",
          backgroundImage:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-brand-navy) 3%, transparent), color-mix(in srgb, var(--color-brand-navy) 13%, transparent))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        sa<span className="text-[0.78em]">&#8377;</span>athi finconnect
      </span>
    </div>
  );
}
