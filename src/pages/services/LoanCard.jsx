import MagicCard from './ServicesMagicCard.jsx'
import { Link } from 'react-router-dom'
import useBlobNavigate from './useBlobNavigate.js'

function LoanIcon({ compact }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#f5e8c7] text-[#10224d] ${compact ? 'size-10' : 'size-11'}`}
    >
      <svg
        aria-hidden="true"
        className={compact ? 'size-[18px]' : 'size-5'}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      >
        <path d="m3 9 9-5 9 5" />
        <path d="M4 10h16M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18M2 22h20" />
      </svg>
    </span>
  )
}

function LoanLink({ to, loanName, label }) {
  const blobNavigate = useBlobNavigate()

  return (
    <Link
      to={to}
      onClick={(event) => blobNavigate(event, to, { label: loanName })}
      aria-label={`${label} about ${loanName}`}
      className="group/link mt-auto inline-flex w-full items-center justify-between gap-2 pt-5 text-xs font-semibold text-[#10224d] transition-colors duration-200 hover:text-[#9b741e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c69214] motion-reduce:transition-none"
    >
      <span>{label}</span>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f5e8c7] text-[#10224d] transition-colors duration-200 group-hover/link:bg-[#c69214] group-hover/link:text-white motion-reduce:transition-none">
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        >
          <path d="M3 8h10M8 3l5 5-5 5" />
        </svg>
      </span>
    </Link>
  )
}

function LoanCard({ service, to, compact = false, linkLabel = 'View More Details' }) {
  const detailsPath = to ?? `/services/${service.id}`

  return (
    <MagicCard
      className="h-full rounded-[20px] shadow-[0_8px_28px_rgba(16,34,77,0.08)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(16,34,77,0.14)] motion-reduce:transform-none motion-reduce:transition-none"
      gradientSize={280}
      gradientColor="rgba(198, 20, 79, 0.08)"
      gradientOpacity={0.8}
      gradientFrom="#c69214"
      gradientTo="#f3d98b"
      backgroundColor="#ffffff"
      borderColor="rgba(16, 34, 77, 0.12)"
      radius={20}
    >
      <article
        aria-labelledby={`${service.id}-card-title`}
        className={`flex h-full flex-col rounded-[19px] bg-white p-5 sm:p-6 ${compact ? 'min-h-[226px] p-4 sm:p-5' : 'min-h-[320px]'}`}
      >
        <LoanIcon compact={compact} />
        <h3
          id={`${service.id}-card-title`}
          className={`${compact ? 'mt-3 text-sm' : 'mt-4 text-base'} font-semibold leading-snug text-[#10224d]`}
        >
          {service.name}
        </h3>
        {!compact && (
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a6a21]">
            {service.category}
          </p>
        )}
        <p className={`${compact ? 'mt-2 min-h-[3.75rem] text-xs leading-5' : 'mt-4 min-h-[4.5rem] text-[13px] leading-6'} line-clamp-3 text-[#6c7890]`}>
          {service.summary}
        </p>
        {!compact && (
          <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[11px] leading-5 text-[#51608a]">
            <span>Rate: {service.rate ?? 'Lender set'}</span>
            <span aria-hidden="true">·</span>
            <span>Tenure: {service.tenure ?? 'Profile based'}</span>
          </div>
        )}
        <LoanLink to={detailsPath} loanName={service.name} label={linkLabel} />
      </article>
    </MagicCard>
  )
}

export default LoanCard