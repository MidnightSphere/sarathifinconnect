import { ArrowDown, ArrowUpRight, Banknote, Briefcase, Building2, Car, Coins, Cog, GraduationCap, Home, LineChart, Repeat, Store, Sun, Truck, Wallet, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import Eyebrow from "../services/Eyebrow";

const icons = { Home, Car, Briefcase, Wallet, Building2, LineChart, Coins, Cog, Truck, Repeat, GraduationCap, Store, Wrench, Banknote, Sun };
const loanImages = {
  "home-loan": "/loan-pages-photos/01-home-loan.png",
  "car-loan": "/loan-pages-photos/02-car-loan.png",
  "business-loan": "/loan-pages-photos/03-business-loan.png",
  "personal-loan": "/loan-pages-photos/04-personal-loan.png",
};

export default function LoanDetailHero({ service, onApply }) {
  const imageSrc = loanImages[service.id];
  const Icon = icons[service.icon] ?? Banknote;
  return (
    <section className="bg-white px-4 pb-12 pt-28 sm:px-6 md:pb-16 md:pt-32" aria-labelledby="loan-detail-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="order-2 min-w-0 lg:order-1">
          <Eyebrow>{service.category}</Eyebrow>
          <h1 id="loan-detail-heading" className="mb-0 mt-4 font-bricolage text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-brand-navy">
            Explore <span className="text-brand-gold">{service.name}</span> options with a clearer view.
          </h1>
          <p className="mb-0 mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-brand-navy/70 md:text-base">
            {service.intro || service.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onApply} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-navy px-6 text-[0.9375rem] font-semibold text-white transition hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
              Apply Now <ArrowDown size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <Link to="/#contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-navy/25 px-6 text-[0.9375rem] font-semibold text-brand-navy no-underline transition hover:border-brand-gold/60 hover:bg-brand-gold/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
              Talk to our expert <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="relative order-1 mx-auto w-full max-w-xl lg:order-2">
          <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl border border-brand-navy/10 bg-surface-soft/60">
            {imageSrc ? <img src={imageSrc} alt={`${service.name} illustration`} fetchPriority="high" className="h-full w-full object-contain" /> : <div className="grid size-full place-items-center bg-brand-navy/[0.04]"><span className="grid size-16 place-items-center rounded-full bg-brand-gold/15 text-brand-navy"><Icon size={30} strokeWidth={1.75} aria-hidden="true" /></span></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
