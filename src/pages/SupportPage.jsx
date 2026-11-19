import { useId } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import { contactInfo, officeHours } from "../data/contact.js";

const officeAddress = contactInfo.address;
const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeAddress)}`;

const faqs = [
  {
    question: "How can I contact Sarathi FinConnect?",
    answer: `Call us at ${contactInfo.phone}, email ${contactInfo.email}, or visit our Bhavnagar office.`,
  },
  {
    question: "What information should I prepare before discussing a loan?",
    answer: "It helps to know the purpose and approximate amount you need, your income or business details, and any questions you have. Our team can guide you on the documents a lender may request for your situation.",
  },
  {
    question: "Does Sarathi FinConnect directly provide loans?",
    answer: "No. Sarathi FinConnect is a financial advisory firm, not a bank or direct lender. We help people understand options and coordinate with banks and financial institutions. Lending decisions are made by the lender.",
  },
  {
    question: "Can I enquire about multiple financial solutions?",
    answer: "Yes. You can discuss more than one requirement with our team, including home, personal, business and other finance options.",
  },
  {
    question: "Where is the Sarathi FinConnect office located?",
    answer: officeAddress,
  },
];

function ContactCard({ icon: Icon, title, detail, href, action, external = false }) {
  return (
    <article className="flex min-w-0 flex-col rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-[0_16px_44px_-34px_rgba(11,31,77,0.3)] sm:p-7">
      <span className="grid size-11 place-items-center rounded-2xl bg-brand-gold/10 text-brand-gold">
        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h3 className="mb-0 mt-5 font-bricolage text-xl font-semibold text-brand-navy">{title}</h3>
      <p className="mb-0 mt-2 min-h-12 break-words text-sm leading-6 text-brand-navy/65">{detail}</p>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-brand-navy/15 px-4 text-sm font-semibold text-brand-navy no-underline transition-all hover:border-brand-gold hover:bg-brand-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
      >
        {action}
        <ArrowRight size={15} aria-hidden="true" />
      </a>
    </article>
  );
}

function SupportFaq() {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="bg-[#fbf9f5] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 font-space text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">A little more clarity</p>
        <h2 id={headingId} className="mb-8 font-bricolage text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-semibold text-brand-navy marker:hidden focus-visible:outline-2 focus-visible:outline-brand-gold [&::-webkit-details-marker]:hidden">
                {question}
                <span aria-hidden="true" className="float-right ml-4 text-brand-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mb-0 mt-3 max-w-3xl text-sm leading-7 text-brand-navy/70">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SupportPage() {
  const headingId = useId();

  return (
    <>
      <Navbar />
      <main>
        <section aria-labelledby={headingId} className="relative overflow-hidden bg-[#fbf9f5] px-4 pb-14 pt-32 text-center sm:px-6 md:pb-20 md:pt-40">
          <div aria-hidden="true" className="pointer-events-none absolute -right-36 top-12 size-96 rounded-full bg-[radial-gradient(circle,rgba(198,146,20,0.08),transparent_70%)]" />
          <div className="relative mx-auto max-w-4xl">
            <p className="mb-4 font-space text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">WE'RE HERE TO HELP</p>
            <h1 id={headingId} className="mb-0 font-bricolage text-[clamp(2.6rem,6vw,4.75rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-brand-navy">
              How Can We Help You?
            </h1>
            <p className="mx-auto mb-0 mt-6 max-w-3xl text-base leading-7 text-brand-navy/70 sm:text-lg sm:leading-8">
              Whether you have a question about our financial solutions, need help understanding the process, or want to connect with our team, we're here to guide you.
            </p>
          </div>
        </section>

        <section aria-label="Contact options" className="bg-[#fbf9f5] px-4 pb-16 sm:px-6 md:pb-20">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <ContactCard
              icon={Phone}
              title="Call Us"
              detail={contactInfo.phone}
              action="Call Now"
              href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
            />
            <ContactCard
              icon={Mail}
              title="Email Us"
              detail={contactInfo.email}
              action="Send Email"
              href={`mailto:${contactInfo.email}`}
            />
            <ContactCard
              icon={MapPin}
              title="Visit Our Office"
              detail={officeAddress}
              action="Get Directions"
              href={mapsUrl}
              external
            />
          </div>
        </section>

        <section aria-labelledby="support-hours-heading" className="bg-[#fbf9f5] px-4 py-4 sm:px-6 md:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-3xl bg-brand-navy px-6 py-7 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-10">
            <div>
              <p className="mb-2 font-space text-xs font-medium uppercase tracking-[0.16em] text-brand-gold-light">Here when you need us</p>
              <h2 id="support-hours-heading" className="mb-0 font-bricolage text-2xl font-semibold sm:text-3xl">We're Available to Assist You</h2>
            </div>
            <div className="inline-flex items-center gap-3 text-sm leading-6 text-white/85 sm:text-base">
              <Clock3 size={20} className="shrink-0 text-brand-gold-light" aria-hidden="true" />
              <span className="grid">
                <span>{officeHours.weekdays}</span>
                <span>{officeHours.sunday}</span>
              </span>
            </div>
          </div>
        </section>

        <SupportFaq />
        <section className="bg-[#fbf9f5] px-4 py-9 text-center sm:px-6 md:py-11">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2 border-t border-brand-navy/10 pt-8 text-base text-brand-navy/80">
            <span>Looking for a specific financial solution?</span>
            <Link to="/services" className="inline-flex min-h-11 items-center gap-1 font-semibold text-brand-navy underline decoration-brand-gold/60 underline-offset-4 transition-colors hover:text-brand-gold">
              Explore our services. <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
