export default function Eyebrow({ children, align = "left" }) {
  return (
    <p className={`m-0 inline-flex items-center gap-3 font-space text-xs font-medium uppercase tracking-[0.18em] text-brand-navy/70 ${align === "center" ? "justify-center" : ""}`}>
      {align === "center" && <span aria-hidden="true" className="h-px w-8 bg-brand-gold" />}
      {align !== "center" && <span aria-hidden="true" className="h-px w-8 bg-brand-gold" />}
      {children}
      {align === "center" && <span aria-hidden="true" className="h-px w-8 bg-brand-gold" />}
    </p>
  );
}
