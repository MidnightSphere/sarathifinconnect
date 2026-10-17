import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Briefcase, Home, User } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";

const services = [
  {
    icon: User,
    title: "Personal Loan",
    description:
      "Funding for personal milestones — planned or unplanned. Explore options that suit your needs and timeline.",
  },
  {
    icon: Briefcase,
    title: "Business Finance",
    description:
      "Working capital and growth funding for businesses at every stage. Find solutions that match your business goals.",
  },
  {
    icon: Home,
    title: "Home Finance",
    description:
      "Support for purchasing or renovating your home. Navigate the process with guidance at every step.",
  },
];

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-surface">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative flex items-center justify-center overflow-hidden px-5 pb-16 pt-36 text-center sm:px-8 sm:pt-40">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_center,rgba(198,146,20,0.08),transparent_62%)]"
            aria-hidden="true"
          />
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="relative mx-auto max-w-3xl"
          >
            <motion.div variants={item}>
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold no-underline transition-colors hover:text-brand-navy"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Back to Home
              </Link>
            </motion.div>
            <motion.p
              variants={item}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-white/70 px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.14em] text-brand-navy"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-brand-gold"
                aria-hidden="true"
              />
              OUR SERVICES
            </motion.p>
            <motion.h1
              variants={item}
              className="m-0 mx-auto max-w-2xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-brand-navy sm:text-[3.4rem]"
            >
              Financial solutions for{" "}
              <span className="text-brand-gold">your next step.</span>
            </motion.h1>
            <motion.p
              variants={item}
              className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              Sarathi FinConnect helps individuals and businesses explore suitable
              financial and loan options — with clear guidance throughout the
              process.
            </motion.p>
          </motion.div>
        </section>

        {/* Services Grid */}
        <section className="px-5 pb-24 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ staggerChildren: 0.12 }}
            className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  variants={item}
                  className="group rounded-2xl border border-border bg-white/80 p-7 shadow-[0_8px_32px_rgba(11,31,77,0.05)] backdrop-blur-sm transition-all duration-300 hover:border-brand-gold/30 hover:shadow-[0_12px_40px_rgba(11,31,77,0.08)] sm:p-8"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/5 transition-colors duration-300 group-hover:bg-brand-gold/10">
                    <Icon
                      size={22}
                      className="text-brand-navy transition-colors duration-300 group-hover:text-brand-gold"
                      strokeWidth={2}
                    />
                  </div>
                  <h2 className="m-0 mb-3 text-xl font-bold tracking-[-0.02em] text-brand-navy">
                    {service.title}
                  </h2>
                  <p className="m-0 text-[0.94rem] leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto mt-16 max-w-xl text-center"
          >
            <div className="rounded-2xl border border-brand-navy/8 bg-brand-navy/[0.03] px-7 py-6">
              <p className="m-0 text-[0.92rem] leading-relaxed text-text-secondary">
                Detailed information about each service, eligibility, and
                process will be available here soon. For now, feel free to{" "}
                <a
                  href="mailto:"
                  className="font-semibold text-brand-gold no-underline transition-colors hover:text-brand-navy"
                >
                  reach out to us
                </a>{" "}
                to discuss your requirements.
              </p>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="border-t border-border px-5 py-20 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-lg"
          >
            <h2 className="m-0 text-2xl font-bold tracking-[-0.03em] text-brand-navy sm:text-3xl">
              Ready to explore?
            </h2>
            <p className="mt-4 text-text-secondary">
              A conversation is the first move toward a clearer financial path.
            </p>
            <a
              href="mailto:hello@sarathiudaan.com"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-navy px-7 py-3.5 text-[0.9375rem] font-semibold text-white no-underline transition-colors duration-200 hover:bg-brand-navy-deep"
            >
              Talk to Us <ArrowRight size={16} aria-hidden="true" />
            </a>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
