import { ArrowDown, ArrowUpRight, Banknote, Briefcase, Building2, Car, Coins, Cog, GraduationCap, Home, LineChart, Repeat, Store, Sun, Truck, Wallet, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import Eyebrow from "../services/Eyebrow";
import { loanServiceImages } from "../../data/loan-service-images";

const icons = { Home, Car, Briefcase, Wallet, Building2, LineChart, Coins, Cog, Truck, Repeat, GraduationCap, Store, Wrench, Banknote, Sun };

export default function LoanDetailHero({ service, onApply }) {
  const imageSrc = loanServiceImages[service.id];
  const Icon = icons[service.icon] ?? Banknote;
  return (
    <section className="bg-[radial-gradient(ellipse_at_76%_42%,rgba(198,146,20,0.08),transparent_34%),linear-gradient(115deg,#f7f8fa_0%,#fff_52%,#f8f8f5_100%)] px-4 pb-12 pt-28 sm:px-6 md:pb-16 md:pt-32" aria-labelledby="loan-detail-heading">
      <div className="mx-auto grid min-w-0 grid-cols-1 max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0">
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
        <div className="relative mx-auto min-w-0 w-full max-w-[590px] lg:ml-auto">
          <div className="absolute -inset-3 rounded-[45%_38%_35%_40%] border border-[#d5a52c] sm:-inset-5" aria-hidden="true" />
          <div className="relative aspect-[1.35] overflow-hidden rounded-[42%_27%_34%_25%] bg-[#e9edf2] shadow-[0_24px_60px_rgba(16,34,77,0.14)]">
            {imageSrc ? (
              <img className="h-full w-full object-cover" src={imageSrc} alt={`Photo related to ${service.name}`} fetchPriority="high" />
            ) : (
              <div className="grid h-full place-items-center text-brand-navy">
                <span className="grid size-16 place-items-center rounded-full bg-brand-gold/15"><Icon size={30} strokeWidth={1.75} aria-hidden="true" /></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
