import { motion, useReducedMotion } from "motion/react";
import EnquiryForm from "../forms/EnquiryForm";
import ContactMap from "./ContactMap";

export default function ContactSection() {
  const reducedMotion = useReducedMotion();
  const reveal = (delay) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      duration: reducedMotion ? 0 : 0.5,
      delay: reducedMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1],
    },
  });
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate scroll-mt-28 overflow-hidden bg-surface px-4 py-20 sm:px-6 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-16 size-80 rounded-full bg-[radial-gradient(circle,rgba(198,146,20,0.045),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl">
        <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-brand-gold">
            CONTACT US
          </p>
          <h2
            id="contact-heading"
            className="m-0 font-bricolage text-3xl font-bold leading-tight tracking-[-0.04em] text-brand-navy md:text-5xl"
          >
            Let's talk about your loan.
          </h2>
          <p className="mb-0 mt-4 text-base leading-relaxed text-brand-navy/70 md:text-lg">
            Share a few details and our team will get back to you with clear
            guidance.
          </p>
        </header>
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <motion.div
            {...reveal(0)}
            className="relative rounded-[2rem] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(11,31,77,0.06),0_24px_60px_rgba(11,31,77,0.10)] sm:p-8 lg:p-10"
          >
            <EnquiryForm source="home-contact" />
          </motion.div>
          <motion.div {...reveal(0.12)} className="min-h-80 lg:min-h-[34rem]">
            <ContactMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
