import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/layout/Footer";
import LoanDetailHero from "../../components/loan-detail/LoanDetailHero";
import LoanApplyBlock from "../../components/loan-detail/LoanApplyBlock";
import { EligibilitySection, FeaturesSection, FaqSection, DocumentsSection, OverviewSection, RatesSection, StepsSection, TermsSection } from "../../components/loan-detail/DetailSections";
import { loanServices } from "../../data/loan-services-data.js";

function hasDetailContent(service) {
  return Boolean(service && (
    service.highlights?.length || service.eligibility?.length || service.documents?.length ||
    service.steps?.length || service.terms?.length || service.faqs?.length || service.rate || service.tenure
  ));
}

function scrollToApply() {
  const target = document.getElementById("apply");
  if (!target) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
}

function MobileApplyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-navy/10 bg-white/95 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(11,31,77,0.08)] backdrop-blur lg:hidden">
      <button type="button" onClick={scrollToApply} className="mx-auto inline-flex min-h-12 w-full max-w-lg items-center justify-center rounded-full bg-brand-navy px-6 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold">Apply now</button>
    </div>
  );
}

function LoanNotFound() {
  return (
    <main className="grid min-h-[65vh] place-items-center bg-surface px-4 py-16 text-center">
      <div className="max-w-xl">
        <p className="font-space text-xs uppercase tracking-[0.18em] text-brand-navy/65">Loan not found</p>
        <h1 className="mb-0 mt-3 font-bricolage text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-brand-navy">We couldn't find that loan page.</h1>
        <p className="mb-0 mt-4 text-[0.9375rem] leading-relaxed text-brand-navy/70">The link may be incorrect or the service may no longer be listed.</p>
        <Link to="/services" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-navy px-6 text-[0.9375rem] font-semibold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"><ArrowLeft size={17} aria-hidden="true" />Browse all services</Link>
      </div>
    </main>
  );
}

function DetailsComingSoon({ service }) {
  return (
    <main className="bg-surface px-4 py-10 pb-24 sm:px-6 md:py-14">
      <div className="mx-auto max-w-7xl">
        <LoanDetailHero service={service} onApply={scrollToApply} />
        <section className="mx-auto max-w-3xl py-10 text-center" aria-labelledby="details-coming-soon-heading">
          <h2 id="details-coming-soon-heading" className="font-bricolage text-2xl font-semibold text-brand-navy">Details coming soon</h2>
          <p className="text-[0.9375rem] leading-relaxed text-brand-navy/70">Share your enquiry and our team can guide you through this loan option.</p>
        </section>
        <LoanApplyBlock service={service} />
      </div>
      <MobileApplyBar />
    </main>
  );
}

export default function LoanDetailPage() {
  const { slug } = useParams();
  const service = loanServices.find((loan) => loan.id === slug);
  const hasContent = hasDetailContent(service);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = service ? `${service.name} | Sarathi FinConnect` : "Loan not found | Sarathi FinConnect";
    return () => { document.title = originalTitle; };
  }, [service]);

  return (
    <div className="min-h-screen overflow-x-clip bg-surface text-brand-navy">
      <Navbar />
      {service ? hasContent ? (
        <main>
          <LoanDetailHero service={service} onApply={scrollToApply} />
          <div className="bg-surface px-4 sm:px-6">
            <div className="mx-auto max-w-7xl">
              <OverviewSection service={service} />
              <FeaturesSection service={service} />
              <RatesSection service={service} />
              <EligibilitySection service={service} />
              <DocumentsSection service={service} />
              <StepsSection service={service} />
              <TermsSection service={service} />
              <FaqSection service={service} />
              <LoanApplyBlock service={service} />
            </div>
          </div>
          <MobileApplyBar />
        </main>
      ) : <DetailsComingSoon service={service} /> : <LoanNotFound />}
      <Footer />
    </div>
  );
}
