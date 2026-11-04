import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Award, BriefcaseBusiness, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      className="relative isolate overflow-hidden bg-[#F9F8F5] py-20 text-[#172033] sm:py-24 lg:py-28"
    >
      {/* Soft decorative accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-12 h-72 w-72 rounded-full bg-[#D9B76B]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#0B1F4D]/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="mb-12 max-w-3xl lg:mb-16"
        >
          <span className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#A87920]">
            <span className="h-px w-8 bg-[#B88A35]" />
            Leadership at Sarathi
          </span>

          <h2
            id="founder-heading"
            className="text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#101B32] sm:text-5xl lg:text-6xl"
          >
            Who’s behind{" "}
            <span className="font-serif font-medium italic text-[#A87920]">
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
            <div className="relative rounded-[2rem] border border-[#E8E2D7] bg-white p-3 shadow-[0_24px_70px_-35px_rgba(18,30,54,0.35)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#E9E5DC]">
                {/* The source portrait asset is not present in the supplied project. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-0 flex items-center justify-center bg-gradient-to-br from-[#EAE4D8] via-[#DCD5C8] to-[#C9C0B1]"
                >
                  <span className="font-serif text-7xl font-semibold tracking-tight text-[#0B1F4D]/25">
                    HM
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101B32]/75 via-[#101B32]/20 to-transparent p-6 pt-24">
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
              className="absolute -right-2 top-8 flex items-center gap-3 rounded-2xl border border-[#E8D8B6] bg-white/95 px-4 py-3 shadow-[0_14px_35px_-18px_rgba(20,30,50,0.35)] backdrop-blur sm:-right-6 sm:px-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EBD6] text-[#9B6B18]">
                <Award size={20} strokeWidth={1.8} />
              </span>
              <span>
                <strong className="block text-lg leading-none text-[#101B32]">
                  12+ Years
                </strong>
                <span className="mt-1 block text-xs text-slate-500">
                  Banking experience
                </span>
              </span>
            </motion.div>

            <div className="absolute -bottom-5 left-6 -z-10 h-28 w-28 rounded-[1.75rem] border border-[#D9C69F]/70" />
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
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#A87920]">
                The experience behind the guidance
              </span>
              <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#101B32] sm:text-4xl">
                Experience you can rely on.
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3 border-y border-[#E7E1D7] py-5 sm:gap-6 sm:py-6">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="min-w-0">
                  <Icon
                    aria-hidden="true"
                    size={19}
                    strokeWidth={1.7}
                    className="mb-3 text-[#A87920]"
                  />
                  <p className="text-3xl font-semibold tracking-tight text-[#101B32] sm:text-4xl">
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
                  className="rounded-full border border-[#E5DCCB] bg-white/80 px-3.5 py-2 text-xs font-medium text-[#344054] shadow-sm shadow-[#172033]/[0.02] sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <blockquote className="mt-9 border-l-4 border-[#B88A35] bg-[#F1EBDD]/65 px-5 py-5 sm:px-7">
              <p className="font-serif text-xl italic leading-relaxed text-[#172033] sm:text-2xl">
                “Every person deserves clear guidance before taking a loan.”
              </p>
              <cite className="mt-3 block text-xs font-semibold not-italic uppercase tracking-[0.16em] text-[#9B6B18]">
                Hitesh D. Makwana
              </cite>
            </blockquote>

            <a
              href="/#contact"
              onClick={(event) => {
                event.preventDefault();
                navigate({ pathname: "/", hash: "#contact" });
              }}
              className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-[#0B1F4D] transition-colors hover:text-[#A87920] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A35] focus-visible:ring-offset-4"
            >
              Talk to our team
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8C69F] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#0B1F4D] group-hover:text-white">
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
