import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdvisorStrip() {
  return (
    <aside id="contact" className="grid gap-5 rounded-3xl bg-brand-navy px-6 py-7 text-white md:grid-cols-[1fr_auto] md:items-center md:px-10 md:py-8">
      <div>
        <h2 className="m-0 font-bricolage text-xl font-semibold leading-tight tracking-tight md:text-2xl">Not sure which loan fits?</h2>
        <p className="mb-0 mt-2 text-sm leading-relaxed text-white/75 md:text-base">Talk to an advisor for clear guidance.</p>
      </div>
      <Link to="/#contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gold px-6 text-[0.9375rem] font-semibold text-brand-navy no-underline transition hover:-translate-y-0.5 hover:bg-brand-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none">
        Talk to an advisor <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </aside>
  );
}
