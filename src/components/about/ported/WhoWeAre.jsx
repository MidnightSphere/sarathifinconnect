import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";

const steps = [
  "Listen first",
  "Understand your options",
  "Get your documents ready",
  "Connect with banks and financial institutions",
];

function BridgeGraphic() {
  return (
    <Reveal className="mx-auto mt-8 w-full max-w-5xl">
      {(shown) => (
        <svg role="img" aria-label="A bridge from your goals through Sarathi to the right lender" viewBox="0 0 900 160" className="block h-auto w-full overflow-visible">
          <defs>
            <path id="sarathi-bridge-path" d="M80 112 C250 112 290 36 450 36 S650 112 820 112" />
          </defs>
          <path d="M80 112 C250 112 290 36 450 36 S650 112 820 112" fill="none" stroke="#E6E0D2" strokeWidth="3" strokeLinecap="round" />
          <path d="M80 112 C250 112 290 36 450 36 S650 112 820 112" pathLength="1" fill="none" stroke="#C69214" strokeWidth="3" strokeLinecap="round" className={`[stroke-dasharray:1] transition-[stroke-dashoffset] duration-[1600ms] ease-out motion-reduce:transition-none ${shown ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1]"}`} />
          <circle cx="80" cy="112" r="15" fill="white" stroke="#0B1F4D" strokeWidth="3" />
          <circle cx="450" cy="36" r="13" fill="#0B1F4D" stroke="#C69214" strokeWidth="4" />
          <circle cx="820" cy="112" r="15" fill="#C69214" stroke="#0B1F4D" strokeWidth="2" />
          <text x="80" y="150" textAnchor="middle" className="fill-[#0B1F4D] text-[10px] font-semibold sm:text-xs">Your goals</text>
          <text x="450" y="16" textAnchor="middle" className="fill-[#0B1F4D] text-[10px] font-bold sm:text-xs">Sarathi</text>
          <text x="820" y="150" textAnchor="middle" className="fill-[#0B1F4D] text-[10px] font-semibold sm:text-xs">The right lender</text>
          {shown && <circle r="5" fill="#C69214"><animateMotion dur="8s" repeatCount="indefinite" rotate="auto"><mpath href="#sarathi-bridge-path" /></animateMotion></circle>}
        </svg>
      )}
    </Reveal>
  );
}

function LocationPin() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="mr-1.5 h-3.5 w-3.5"><path d="M16 8.4c0 4.1-6 9.1-6 9.1S4 12.5 4 8.4a6 6 0 1 1 12 0Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export default function WhoWeAre() {
  const headingId = useId();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="who-we-are"
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden bg-[#fbf9f5] px-4 pt-28 pb-16 text-brand-navy sm:px-6 md:pt-36 md:pb-24"
    >
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="text-center">
            <p className="mb-5 font-space text-xs font-medium uppercase tracking-[0.18em] text-brand-navy/60">Who we are</p>
            <h2 id={headingId} className="mx-auto max-w-4xl font-bricolage text-[clamp(2.4rem,5.2vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-brand-navy">
              A bridge between your<br className="hidden sm:block" /> goals and the <span className="font-serif font-normal italic text-brand-gold">right lender.</span>
            </h2>
        </Reveal>

        <BridgeGraphic />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Reveal as="article" delay={100} className="group rounded-3xl border border-brand-navy/10 bg-white p-7 shadow-[0_20px_55px_-38px_rgba(15,37,87,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-[0_30px_70px_-25px_rgba(15,37,87,0.25)] lg:col-span-7 sm:p-9">
            <p className="max-w-[62ch] text-base leading-7 text-brand-navy/65">Sarathi FinConnect Advisory LLP is a loan and financial advisory firm based in Bhavnagar, Gujarat. We help individuals, families, professionals and business owners explore suitable loan options and move forward with confidence.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Bhavnagar, Gujarat", "Individuals", "Families", "Professionals", "Business owners"].map((tag, index) => (
                <span key={tag} className="inline-flex items-center rounded-full border border-brand-navy/10 bg-white/80 px-3.5 py-2 text-xs font-medium text-brand-navy shadow-sm shadow-[#0B1F4D]/[0.02] transition-colors hover:border-brand-gold/50 hover:bg-slate-50 sm:text-sm">
                  {index === 0 && <LocationPin />}{tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal as="article" delay={200} className="group relative isolate overflow-hidden rounded-3xl border border-brand-navy/10 bg-gradient-to-br from-brand-navy to-brand-navy p-7 text-white shadow-[0_22px_55px_-30px_rgba(15,37,87,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-[0_30px_70px_-25px_rgba(15,37,87,0.4)] lg:col-span-5 sm:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_8%,rgba(217,169,40,0.35),transparent_48%)] opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border border-brand-gold/30"><span className="absolute inset-4 rounded-full border border-brand-gold/20" /></div>
            <p className="relative mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-2xl md:text-3xl">We are not a bank.</p>
            <p className="relative mt-2 text-2xl font-semibold text-brand-gold sm:text-3xl">We are your guide.</p>
          </Reveal>

          <Reveal as="article" delay={300} className="rounded-3xl border border-brand-navy/10 bg-white px-6 pt-6 pb-8 shadow-[0_20px_55px_-38px_rgba(15,37,87,0.25)] md:px-8 md:pt-8 lg:px-10 lg:pt-10 lg:col-span-12">
            <p className="mb-8 font-space text-xs font-medium uppercase tracking-[0.18em] text-brand-gold md:mb-10">We listen first.</p>
            <motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="relative grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:grid-cols-4 lg:gap-0"
            >
              <span aria-hidden="true" className="pointer-events-none absolute top-5 bottom-5 left-5 w-px bg-brand-gold/30 md:hidden" />
              {steps.map((step, index) => (
                <motion.li
                  key={step}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="group/step relative z-[1] min-w-0"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-5 left-10 right-0 border-t border-dashed border-brand-gold/35 ${
                      index === steps.length - 1 ? "hidden" : "hidden lg:block"
                    }`}
                  />
                  <div className="flex items-start gap-4 md:block">
                    <span className="relative z-[2] grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brand-gold/50 bg-white font-space text-sm font-semibold tabular-nums text-brand-gold transition-colors duration-200 group-hover/step:bg-brand-gold/10">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="max-w-[16rem] pt-1 font-bricolage text-base font-semibold leading-snug text-brand-navy [text-wrap:balance] transition-colors group-hover/step:text-brand-navy md:mt-4 md:pt-0 md:text-lg">
                      {step}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </Reveal>

          <Reveal as="blockquote" delay={400} className="rounded-2xl border-l-4 border-brand-gold bg-[#f8f4e9] px-8 py-8 lg:col-span-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold">OUR BELIEF</p>
            <p className="whitespace-nowrap font-serif text-[clamp(1rem,1.7vw,1.45rem)] italic leading-tight text-brand-navy">Good financial guidance starts with understanding the person behind the need.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


