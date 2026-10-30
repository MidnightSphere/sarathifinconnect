import { ArrowRight, Check, FileText, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Eyebrow from "../services/Eyebrow";

export function RevealSection({ children, className = "", ...props }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.section
      {...props}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function SectionTitle({ eyebrow, title, id }) {
  return (
    <header className="mb-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mb-0 mt-2 font-bricolage text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-brand-navy">{title}</h2>
    </header>
  );
}

export function OverviewSection({ service }) {
  return (
    <RevealSection className="grid gap-6 py-10 md:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <SectionTitle eyebrow="Overview" title={`What is ${service.name}?`} id="overview-heading" />
        <p className="mb-0 max-w-[65ch] whitespace-pre-line text-[0.9375rem] leading-relaxed text-brand-navy/70 md:text-base">{service.intro || service.summary}</p>
      </div>
      <aside className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-[0_1px_2px_rgba(11,31,77,0.04)] md:p-6" aria-label={`${service.name} overview`}>
        <span className="grid size-11 place-items-center rounded-full bg-brand-gold/12 text-brand-navy"><ShieldCheck size={20} strokeWidth={1.75} aria-hidden="true" /></span>
        <h3 className="mb-0 mt-4 font-bricolage text-lg font-semibold text-brand-navy">{service.category}</h3>
        <p className="mb-0 mt-2 text-[0.9375rem] leading-relaxed text-brand-navy/70">{service.summary}</p>
      </aside>
    </RevealSection>
  );
}

function NumberedCards({ items, label }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <article key={`${label}-${item}`} className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-[0_1px_2px_rgba(11,31,77,0.04)] md:p-6">
          <span className="font-space text-xs text-brand-navy/40" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <p className="mb-0 mt-3 text-[0.9375rem] leading-relaxed text-brand-navy/80">{item}</p>
        </article>
      ))}
    </div>
  );
}

export function FeaturesSection({ service }) {
  if (!service.highlights?.length) return null;
  return <RevealSection className="py-8 md:py-10" aria-labelledby="features-heading">
    <SectionTitle eyebrow="Key features" title={`${service.name} features`} id="features-heading" />
    <NumberedCards items={service.highlights} label="feature" />
  </RevealSection>;
}

export function RatesSection({ service }) {
  const rates = [service.rate, service.tenure].filter(Boolean);
  if (!rates.length) return null;
  return <RevealSection className="grid gap-4 py-8 md:py-10 lg:grid-cols-[1.1fr_0.9fr]" aria-label="Rates and tenure">
    <div className="rounded-2xl bg-brand-navy p-6 text-white md:p-8">
      <Eyebrow>Rates and tenure</Eyebrow>
      <h2 className="mb-0 mt-3 max-w-md font-bricolage text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight tracking-tight text-white">Understand the terms before you decide.</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {service.rate && <div className="border-l border-white/20 pl-4"><p className="m-0 font-space text-xs text-white/65">Indicative interest rate</p><p className="mb-0 mt-2 text-lg font-semibold text-brand-gold-light md:text-xl">{service.rate}</p></div>}
        {service.tenure && <div className="border-l border-white/20 pl-4"><p className="m-0 font-space text-xs text-white/65">Tenure</p><p className="mb-0 mt-2 text-lg font-semibold text-brand-gold-light md:text-xl">{service.tenure}</p></div>}
      </div>
      <p className="mb-0 mt-6 text-xs leading-relaxed text-white/65">Figures are indicative where provided. Rates, tenure, charges, and eligibility vary by lender and applicant profile; confirm current terms directly with a lender.</p>
    </div>
    <div className="flex flex-col justify-center rounded-2xl border border-brand-navy/10 bg-white p-6 md:p-8">
      <span className="grid size-10 place-items-center rounded-full bg-brand-gold/12 text-brand-navy"><Check size={20} strokeWidth={1.75} aria-hidden="true" /></span>
      <h3 className="mb-0 mt-4 font-bricolage text-xl font-semibold text-brand-navy">Plan with clear information.</h3>
      <p className="mb-0 mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-brand-navy/70">Compare written offers and review the total repayment and applicable charges.</p>
    </div>
  </RevealSection>;
}

export function EligibilitySection({ service }) {
  if (!service.eligibility?.length) return null;
  return <RevealSection className="py-8 md:py-10" aria-labelledby="eligibility-heading">
    <SectionTitle eyebrow="Eligibility" title="Who can apply?" id="eligibility-heading" />
    <NumberedCards items={service.eligibility} label="eligibility" />
  </RevealSection>;
}

export function DocumentsSection({ service }) {
  if (!service.documents?.length) return null;
  return <RevealSection className="py-8 md:py-10" aria-labelledby="documents-heading">
    <SectionTitle eyebrow="Documents" title="Documents you may need" id="documents-heading" />
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {service.documents.map((item) => <article key={item} className="flex gap-3 rounded-2xl border border-brand-navy/10 bg-white p-5 text-[0.9375rem] leading-relaxed text-brand-navy/80 md:p-6"><FileText size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-brand-gold" aria-hidden="true" /><span>{item}</span></article>)}
    </div>
    <p className="mb-0 mt-4 text-xs leading-relaxed text-brand-navy/60">Document requirements differ by lender and applicant. Confirm the current checklist before applying.</p>
  </RevealSection>;
}

export function StepsSection({ service }) {
  if (!service.steps?.length) return null;
  return <RevealSection className="py-8 md:py-10" aria-labelledby="steps-heading">
    <SectionTitle eyebrow="How to apply" title="Application process" id="steps-heading" />
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {service.steps.map((step, index) => <article key={step} className="rounded-2xl border border-brand-navy/10 bg-white p-5 md:p-6"><span className="font-space text-xs text-brand-navy/40">{String(index + 1).padStart(2, "0")}</span><p className="mb-0 mt-3 text-[0.9375rem] leading-relaxed text-brand-navy/80">{step}</p></article>)}
    </div>
  </RevealSection>;
}

export function TermsSection({ service }) {
  if (!service.terms?.length) return null;
  return <RevealSection className="py-8 md:py-10" aria-labelledby="terms-heading">
    <SectionTitle eyebrow="Important information" title="Terms to review" id="terms-heading" />
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
      {service.terms.map((term) => <li key={term} className="flex gap-3 rounded-2xl border border-brand-navy/10 bg-white p-5 text-[0.9375rem] leading-relaxed text-brand-navy/70"><ArrowRight size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-brand-gold" aria-hidden="true" />{term}</li>)}
    </ul>
  </RevealSection>;
}

export function FaqSection({ service }) {
  if (!service.faqs?.length) return null;
  return <RevealSection className="py-8 md:py-10" aria-labelledby="faq-heading">
    <SectionTitle eyebrow="Frequently asked questions" title="Common questions" id="faq-heading" />
    <div className="grid gap-3 md:grid-cols-2">
      {service.faqs.map(({ question, answer }) => <article key={question} className="rounded-2xl border border-brand-navy/10 bg-white p-5 md:p-6"><h3 className="m-0 font-bricolage text-base font-semibold text-brand-navy">{question}</h3><p className="mb-0 mt-2 text-[0.9375rem] leading-relaxed text-brand-navy/70">{answer}</p></article>)}
    </div>
  </RevealSection>;
}
