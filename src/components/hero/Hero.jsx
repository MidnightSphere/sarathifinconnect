import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import useSplashDone from "../ui/split-reveal/useSplashDone";

const GlowCursor = lazy(() => import("../ui/GlowCursor"));

// These hex values match the brand-navy and brand-gold tokens in index.css.
const BRAND_NAVY_HEX = "#0b1f4d";
const BRAND_GOLD_HEX = "#c69214";

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
export default function Hero() {
  const splashDone = useSplashDone();
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setSupportsFinePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[86vh] items-center justify-center overflow-hidden px-5 pb-20 pt-32 text-center sm:px-8 sm:pt-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-32 -z-10 h-[420px] w-[420px] rounded-full bg-[rgba(198,146,20,0.14)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 -z-10 h-[420px] w-[420px] rounded-full bg-[rgba(11,31,77,0.08)] blur-3xl"
      />
      {supportsFinePointer && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-35"
        >
          <Suspense fallback={null}>
            <GlowCursor
              theme="light"
              color={BRAND_NAVY_HEX}
              secondaryColor={BRAND_GOLD_HEX}
              intensity={0.6}
              trailWidth={2.5}
              linger={1.2}
              glow={0.4}
              hotspot={0.25}
              followSpeed={0.6}
              grain={0}
              clickBurst={false}
              quality="medium"
              maxDevicePixelRatio={1.5}
            />
          </Suspense>
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_at_center,rgba(198,146,20,0.09),transparent_62%)]"
        aria-hidden="true"
      />
      <motion.div
        initial="hidden"
        animate={splashDone ? "visible" : "hidden"}
        transition={{ staggerChildren: 0.1 }}
        className="relative z-10 mx-auto max-w-6xl"
      >
        <motion.p
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-white/70 px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.14em] text-brand-navy"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-brand-gold"
            aria-hidden="true"
          />
          LOAN & FINANCIAL SERVICES
        </motion.p>
        <motion.h1
          variants={item}
          className="m-0 mx-auto max-w-2xl text-balance text-5xl font-space font-[900] leading-[0.96] tracking-[-0.11em] text-brand-navy sm:text-[5.2rem]"
        >
          Loan solutions for your goals,{" "}
          <span className="text-brand-gold">guided with confidence.</span>
        </motion.h1>
        <motion.p
          variants={item}
          className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          Sarathi FinConnect helps individuals and businesses explore suitable loan
          options with clear guidance throughout the process.
        </motion.p>
        <motion.div
          variants={item}
          className="mt-9 flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          <PrimaryButton href="#services">
            Explore Solutions <ArrowRight size={16} aria-hidden="true" />
          </PrimaryButton>
          <SecondaryButton href="#contact">
            <MessageCircle size={16} aria-hidden="true" /> Talk to Us
          </SecondaryButton>
        </motion.div>
        <motion.div
          variants={item}
          className="mt-14 flex items-center justify-center gap-3 text-[0.68rem] font-bold tracking-[0.14em] text-brand-navy/55"
        >
          <span className="h-px w-12 bg-brand-gold/60" /> SCROLL TO FOLLOW THE
          JOURNEY <span className="h-px w-12 bg-brand-gold/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
