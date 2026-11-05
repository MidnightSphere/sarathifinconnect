export default function Eyebrow({ children, className = "" }) {
  return (
    <p className={`font-space text-xs font-medium uppercase tracking-[0.18em] text-brand-navy/60 ${className}`}>
      {children}
    </p>
  );
}
