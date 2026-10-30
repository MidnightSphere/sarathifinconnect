import { motion, useReducedMotion } from "motion/react";
import { loanServices } from "../../data/loan-services-data.js";
import LoanCard from "./LoanCard";
import Eyebrow from "./Eyebrow";

export default function LoanGrid() {
  const reducedMotion = useReducedMotion();
  return (
    <section className="bg-[#f8fafc] px-4 py-14 sm:px-6 md:py-20" aria-labelledby="services-title">
      <div id="all-loans" className="mx-auto max-w-7xl scroll-mt-24">
        <header className="mx-auto mb-9 max-w-2xl text-center md:mb-12">
          <Eyebrow align="center">All loan services</Eyebrow>
          <h2 id="services-title" className="mb-0 mt-4 font-bricolage text-[clamp(1.875rem,3.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-brand-navy">
            Explore our <span className="text-brand-gold">loan services</span>
          </h2>
          <p className="mx-auto mb-0 mt-4 max-w-xl text-base leading-relaxed text-brand-navy/65">
            Choose from a wide range of loan options designed for your personal and business needs.
          </p>
        </header>
        <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loanServices.map((service, index) => (
            <motion.div
              key={service.id}
              className="h-full"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : (index % 3) * 0.055, ease: [0.22, 1, 0.36, 1] }}
            >
              <LoanCard service={service} to={`/services/${service.id}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
