import { ArrowRight, Banknote, Briefcase, Building2, Car, Coins, Cog, GraduationCap, Home, LineChart, Repeat, Store, Sun, Truck, Wallet, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import useBlobNavigate from "../transitions/useBlobNavigate";

const loanIcons = { Home, Car, Briefcase, Wallet, Building2, LineChart, Coins, Cog, Truck, Repeat, GraduationCap, Store, Wrench, Banknote, Sun };

export default function LoanCard({ service, to }) {
  const Icon = loanIcons[service.icon] ?? Banknote;
  const blobNavigate = useBlobNavigate();
  return (
    <Link to={to} onClick={(event) => blobNavigate(event, to, { label: service.name })} aria-label={`View loan details: ${service.name}`} className="group relative flex h-full min-h-[230px] flex-col rounded-2xl border border-brand-navy/[0.08] bg-white p-5 text-brand-navy no-underline shadow-[0_1px_2px_rgba(11,31,77,0.04)] transition-[transform,border-color,box-shadow] duration-250 hover:-translate-y-0.5 hover:border-brand-gold/40 hover:shadow-[0_12px_32px_rgba(11,31,77,0.08)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold md:min-h-[240px] md:p-6 motion-reduce:transform-none motion-reduce:transition-none">
      <span className="absolute right-5 top-5 font-space text-xs text-brand-navy/30 md:right-6 md:top-6" aria-hidden="true">{service.number}</span>
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-gold/12 text-brand-navy" aria-hidden="true">
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <h3 className="mb-0 mt-4 font-bricolage text-lg font-semibold leading-tight tracking-tight text-brand-navy md:text-xl">{service.name}</h3>
      <p className="mb-0 mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-brand-navy/65">{service.summary}</p>
      <span className="mt-auto inline-flex items-center justify-between gap-4 pt-5 text-sm font-semibold text-brand-navy">
        <span>View loan details</span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-gold text-brand-navy transition-transform duration-250 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true">
          <ArrowRight size={16} strokeWidth={1.8} />
        </span>
      </span>
    </Link>
  );
}
