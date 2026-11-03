import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdvisorStrip() {
  return (
    <aside id="contact" className="relative isolate grid gap-5 overflow-hidden rounded-3xl border border-brand-gold/25 bg-[#fffdf8] px-6 py-7 text-brand-navy shadow-[0_8px_28px_rgba(11,31,77,0.06)] md:grid-cols-[1fr_auto] md:items-center md:px-10 md:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-[radial-gradient(circle,rgba(240,189,70,0.28)_0%,rgba(240,189,70,0.14)_38%,transparent_72%)] blur-2xl md:-right-8 md:-top-32 md:size-[30rem]" />
      <div className="relative z-10">
        <p className="mb-2 font-space text-xs font-medium uppercase tracking-[0.16em] text-brand-navy/60">NEED GUIDANCE?</p>
        <h2 className="m-0 font-bricolage text-2xl font-semibold leading-tight tracking-tight text-brand-navy md:text-3xl">Not sure <span className="text-brand-gold">which loan fits?</span></h2>
        <p className="mb-0 mt-2 text-base leading-relaxed text-brand-navy/65">Talk to an advisor for clear guidance.</p>
      </div>
      <Link to="/#contact" className="group relative z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-navy px-6 text-[0.9375rem] font-semibold text-white no-underline shadow-[0_8px_24px_rgba(11,31,77,0.20)] transition-colors duration-200 hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold motion-reduce:transition-none">
        Talk to an advisor <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </aside>
  );
}
