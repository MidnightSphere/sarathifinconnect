import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Award, BriefcaseBusiness, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Eyebrow from "./Eyebrow";

const expertise = [
  "Home Loans",
  "Loan Against Property",
  "Personal Loans",
  "Business Loans",
  "MSME Finance",
];

const stats = [
  {
    value: "12+",
    label: "Years in banking & finance",
    icon: BriefcaseBusiness,
  },
  {
    value: "4",
    label: "Branches led",
    icon: Award,
  },
  {
    value: "18+",
    label: "People in his team",
    icon: Users,
  },
];

function LeadershipSection() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      aria-labelledby="founder-heading"
      className="relative isolate overflow-hidden bg-white py-16 text-brand-navy md:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="mb-12 max-w-3xl lg:mb-16"
        >
          <Eyebrow className="mb-4">Leadership at Sarathi</Eyebrow>

          <h2
            id="founder-heading"
            className="font-bricolage text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-brand-navy"
          >
            Who’s behind{" "}
            <span className="font-bricolage font-semibold text-brand-gold">
              Sarathi?
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            More than a name, Sarathi is built on real experience, clear advice,
            and a simple belief: every loan decision deserves the right guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Founder portrait */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
          >
            <div className="relative rounded-[2rem] border border-brand-navy/10 bg-white p-3 shadow-[0_24px_70px_-35px_rgba(18,30,54,0.35)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-100">
                {/* The source portrait asset is not present in the supplied project. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-0 flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-100 to-slate-200"
                >
                  <span className="font-bricolage text-7xl font-semibold tracking-tight text-brand-navy/25">
                    HM
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/75 via-brand-navy/20 to-transparent p-6 pt-24">
                  <p className="text-sm font-medium tracking-wide text-white/80">
                    Designated Partner
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    Hitesh D. Makwana
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.35, duration: 0.55 }}
              className="absolute -right-2 top-8 flex items-center gap-3 rounded-2xl border border-brand-navy/10 bg-white/95 px-4 py-3 shadow-[0_14px_35px_-18px_rgba(20,30,50,0.35)] backdrop-blur sm:-right-6 sm:px-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                <Award size={20} strokeWidth={1.8} />
              </span>
              <span>
                <strong className="block text-lg leading-none text-brand-navy">
                  12+ Years
                </strong>
                <span className="mt-1 block text-xs text-slate-500">
                  Banking experience
                </span>
              </span>
            </motion.div>

            <div className="absolute -bottom-5 left-6 -z-10 h-28 w-28 rounded-[1.75rem] border border-brand-gold/70" />
          </motion.div>

          {/* Founder story */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="mb-6">
              <Eyebrow>The experience behind the guidance</Eyebrow>
              <h3 className="mt-3 font-bricolage text-2xl font-semibold leading-tight tracking-[-0.02em] text-brand-navy md:text-3xl">
                Experience you can rely on.
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3 border-y border-brand-navy/10 py-5 sm:gap-6 sm:py-6">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="min-w-0">
                  <Icon
                    aria-hidden="true"
                    size={19}
                    strokeWidth={1.7}
                    className="mb-3 text-brand-gold"
                  />
                  <p className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-2xl md:text-3xl">
                    {value}
                  </p>
                  <p className="mt-1 max-w-28 text-[11px] leading-4 text-slate-500 sm:max-w-none sm:text-xs sm:leading-5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
              <p>
                Hitesh D. Makwana, Designated Partner, has spent over 12 years
                in banking and finance, working extensively on home loans,
                loan against property, personal loans, business loans, and
                MSME finance.
              </p>

              <p>
                He has held leadership roles at well-known housing finance
                companies across sales, credit assessment, and branch
                management. During his career, he led 4 branches and a team of
                18+ people. He also holds an MBA in Finance, Banking, and
                Insurance.
              </p>

              <p>
                Working closely with builders, chartered accountants, and
                everyday customers, Hitesh noticed one recurring problem: good
                people getting stuck simply because the process felt too
                complicated. Sarathi FinConnect was built to change that.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {expertise.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-brand-navy/10 bg-white/80 px-3.5 py-2 text-xs font-medium text-brand-navy shadow-sm shadow-[#0B1F4D]/[0.02] sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <blockquote className="mt-9 border-l-4 border-brand-gold bg-slate-50/65 px-5 py-5 sm:px-7">
              <p className="font-bricolage text-xl italic leading-relaxed text-brand-navy sm:text-2xl">
                “Every person deserves clear guidance before taking a loan.”
              </p>
              <cite className="mt-3 block text-xs font-semibold not-italic uppercase tracking-[0.16em] text-brand-gold">
                Hitesh D. Makwana
              </cite>
            </blockquote>

            <a
              href="/#contact"
              onClick={(event) => {
                event.preventDefault();
                navigate({ pathname: "/", hash: "#contact" });
              }}
              className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-brand-navy transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69214] focus-visible:ring-offset-4"
            >
              Talk to our team
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-navy/15 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-brand-navy group-hover:text-white">
                <ArrowUpRight size={17} />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default LeadershipSection;
