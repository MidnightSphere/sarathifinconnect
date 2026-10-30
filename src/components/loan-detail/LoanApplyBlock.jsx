import { Mail, Phone } from "lucide-react";
import EnquiryForm from "../forms/EnquiryForm";
import { contactInfo } from "../../data/contact";

export default function LoanApplyBlock({ service }) {
  return (
    <section id="apply" className="scroll-mt-28 py-10 md:py-14" aria-labelledby="apply-heading">
      <div className="rounded-3xl bg-brand-navy p-5 text-white sm:p-7 md:p-9">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 font-space text-xs font-medium uppercase tracking-[0.18em] text-brand-gold-light">Apply now</p>
          <h2 id="apply-heading" className="m-0 font-bricolage text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight tracking-tight">Apply for your {service.name} today</h2>
          <p className="mb-0 mt-3 text-sm leading-relaxed text-white/75 md:text-base">Share a few details and our team will get back to you with clear guidance.</p>
        </div>
        {(contactInfo.phone || contactInfo.email) && <div className="mx-auto mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/80">
          {contactInfo.phone && <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-inherit no-underline hover:text-brand-gold-light"><Phone size={16} aria-hidden="true" />{contactInfo.phone}</a>}
          {contactInfo.email && <a href={`mailto:${contactInfo.email}`} className="inline-flex items-center gap-2 text-inherit no-underline hover:text-brand-gold-light"><Mail size={16} aria-hidden="true" />{contactInfo.email}</a>}
        </div>}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-white p-4 text-brand-navy shadow-[0_12px_32px_rgba(0,0,0,0.12)] sm:p-6">
          <EnquiryForm variant="loan" defaultLoan={service.id} source={`/services/${service.id}`} />
        </div>
      </div>
    </section>
  );
}
