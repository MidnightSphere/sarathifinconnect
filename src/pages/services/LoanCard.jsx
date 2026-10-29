import {
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  Car,
  Coins,
  Cog,
  GraduationCap,
  Home,
  LineChart,
  Repeat,
  Store,
  Sun,
  Truck,
  Wallet,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const loanIcons = {
  Home,
  Car,
  Briefcase,
  Wallet,
  Building2,
  LineChart,
  Coins,
  Cog,
  Truck,
  Repeat,
  GraduationCap,
  Store,
  Wrench,
  Banknote,
  Sun,
}

function LoanCard({ service, to }) {
  const Icon = loanIcons[service.icon] ?? Banknote

  return (
    <article className="group relative flex h-full min-h-[310px] flex-col rounded-2xl border border-border bg-white p-6 shadow-[0_8px_28px_rgba(11,31,77,0.055)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-[0_18px_42px_rgba(11,31,77,0.12)] md:min-h-[330px] md:p-7 motion-reduce:transform-none motion-reduce:transition-none">
      <span className="grid size-[52px] shrink-0 place-items-center rounded-full bg-brand-gold/15 text-brand-navy" aria-hidden="true">
        <Icon size={24} strokeWidth={1.8} />
      </span>
      <h3 id={`${service.id}-card-title`} className="mb-0 mt-5 text-lg font-bold leading-snug text-brand-navy md:text-xl">
        {service.name}
      </h3>
      <p className="mb-0 mt-3 line-clamp-3 text-base leading-relaxed text-brand-navy/65">
        {service.summary}
      </p>
      <Link
        to={to}
        aria-labelledby={`${service.id}-card-title`}
        aria-label={`View loan details: ${service.name}`}
        className="mt-auto inline-flex items-center justify-between gap-4 pt-7 text-base font-semibold text-brand-navy no-underline after:absolute after:inset-0 after:z-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
      >
        <span>View loan details</span>
        <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-brand-gold text-brand-navy transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true">
          <ArrowRight size={19} strokeWidth={2} />
        </span>
      </Link>
    </article>
  )
}

export default LoanCard
