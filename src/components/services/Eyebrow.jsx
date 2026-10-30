export default function Eyebrow({ children, align = "left" }) {
  return (
    <p className={`m-0 inline-flex items-center font-space text-xs font-medium uppercase tracking-[0.18em] text-brand-navy/70 ${align === "center" ? "justify-center" : ""}`}>
      {children}
    </p>
  );
}
