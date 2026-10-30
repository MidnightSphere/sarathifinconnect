import { ArrowDown, ArrowUpRight, CalendarDays, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Eyebrow from "./Eyebrow";

const trustPoints = [
  { icon: Zap, label: "Quick processing" },
  { icon: CalendarDays, label: "Flexible tenure" },
  { icon: ShieldCheck, label: "Trusted & secure" },
];

export default function ServicesHero() {
  return (
    <section className="services-hero relative isolate px-4 pt-28 pb-14 md:px-6 md:pt-32 md:pb-20" aria-labelledby="services-hero-title">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="min-w-0">
          <Eyebrow>Our services</Eyebrow>
          <h1 id="services-hero-title" className="mb-0 mt-5 max-w-[570px] font-bricolage text-[clamp(2.25rem,4.4vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.02em] text-brand-navy">
            Financial solutions for every stage of <span className="text-brand-gold">your journey.</span>
          </h1>
          <p className="mb-0 mt-5 max-w-lg text-base leading-relaxed text-brand-navy/65 md:text-[1.0625rem]">
            From your dream home to business growth, explore tailored loan options and get clear guidance at every step.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="#all-loans" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-navy px-6 text-[0.9375rem] font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold motion-reduce:transition-none">
              Explore loan services <ArrowDown size={16} aria-hidden="true" />
            </Link>
            <Link to="/#contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-navy/30 bg-white/70 px-6 text-[0.9375rem] font-semibold text-brand-navy no-underline transition hover:-translate-y-0.5 hover:border-brand-navy hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold motion-reduce:transition-none">
              Talk to an advisor <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="m-0 mt-7 flex list-none flex-wrap gap-x-6 gap-y-3 p-0" aria-label="Our service commitments">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2.5 text-sm font-medium text-brand-navy/70">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-gold/12 text-brand-navy" aria-hidden="true">
                  <Icon size={17} strokeWidth={1.75} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="services-hero-art relative mx-auto w-full max-w-md lg:max-w-none">
          <img src="/loan-pages-photos/service-hero-image.png" alt="A couple exploring their next milestone, with a home, car, and city in the background." fetchPriority="high" className="relative z-10 block h-auto w-full object-contain" />
        </div>
      </div>
    </section>
  );
}
