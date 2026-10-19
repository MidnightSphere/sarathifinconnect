import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AboutUs() {
  return (
    <section
      id="about-us"
      className="relative z-10 -mt-20 bg-surface px-5 py-24 sm:px-8 sm:py-32"
    >
      {/* Subtle top divider */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.1 }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.p
          variants={fadeUp}
          className="mb-3 text-[0.68rem] font-bold tracking-[0.15em] text-brand-gold"
        >
          ABOUT US
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="m-0 text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-brand-navy sm:text-4xl"
        >
          About Sarathi FinConnect
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-text-secondary"
        >
          Helping you move forward with clarity.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-pretty text-[0.96rem] leading-relaxed text-text-secondary"
        >
          Sarathi FinConnect Advisory LLP is a financial services firm that helps individuals and businesses explore
          suitable loan and finance options. We act as a bridge between you and the right solution —
          offering guidance, clarity, and support at every stage of the process.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 max-w-xl text-pretty text-[0.96rem] leading-relaxed text-text-secondary"
        >
          Whether you are planning a personal milestone, growing a business, or stepping into
          homeownership — we are here to help you navigate the path forward.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8">
          <a
            href=""
            className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-brand-gold no-underline transition-colors duration-200 hover:text-brand-navy"
          >
            Learn More About Us <ArrowRight size={15} aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
