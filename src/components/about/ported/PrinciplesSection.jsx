import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Compass,
  Ear,
  Eye,
  Handshake,
  Heart,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import Eyebrow from "./Eyebrow";

/* Palette (from brief)
   navy #0B1F4D · royal #234B91 · gold #C69214 · cream #F8E8B5
   warm white #F8F9FC · pale blue #EAF0FA · slate #65718A
   Gold text on white uses #C69214 so large numerals keep 3:1 contrast. */

/* ------------------------------ Content ------------------------------ */

const missionMain = [
  { icon: Ear, title: "We listen first.", copy: "Before we suggest anything, we try to understand you, your family and your goal." },
  { icon: MessageCircle, title: "We speak your language.", copy: "Simple words, clear answers, and no confusing banking terms." },
  { icon: ShieldCheck, title: "We stay honest.", copy: "We tell you the real steps, costs and timelines, so there are no surprises later." },
];

const missionMore = [
  { icon: Handshake, title: "We walk with you.", copy: "From your first enquiry to your final disbursal, you are never left alone." },
  { icon: Heart, title: "We respect every dream.", copy: "Big or small, your goal matters to us." },
];

const goals = [
  { title: "More homes, less worry.", copy: "We want to help more families step into their own home with calm and confidence." },
  { title: "Stronger local businesses.", copy: "We want shop owners, traders and business owners to get the right finance at the right time, so they can grow." },
  { title: "Confident first-time borrowers.", copy: "We want every first-time loan seeker to feel informed, safe and respected." },
  { title: "Smooth support, every time.", copy: "We want to build strong, honest relationships with banks and lenders, so our clients get a smoother journey." },
  { title: "Growing with a personal touch.", copy: "We want to reach more people across Gujarat without ever losing the personal care we started with." },
];

const values = [
  { icon: BadgeCheck, title: "Honesty first", copy: "We tell you what is true, even when it is not what you hoped to hear." },
  { icon: Eye, title: "Clarity", copy: "If you cannot understand it, we have not explained it well enough." },
  { icon: Heart, title: "Respect", copy: "No question is too small. Every client is treated with care." },
  { icon: Compass, title: "Responsibility", copy: "We guide you toward what suits you, not only what is quick." },
  { icon: Handshake, title: "Long-term trust", copy: "We want you to come back, and to recommend us to your family and friends." },
];

/* ------------------------------ Helpers ------------------------------ */

function useInView(threshold = 0.12) {
  const ref = useRef(null);

  const [shown, setShown] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, shown];
}

// Hidden states only apply under motion-safe, so reduced-motion users see everything at once.
const hiddenFrom = {
  up: "motion-safe:opacity-0 motion-safe:translate-y-7",
  left: "motion-safe:opacity-0 motion-safe:translate-y-7 motion-safe:md:translate-y-0 motion-safe:md:-translate-x-6",
  right: "motion-safe:opacity-0 motion-safe:translate-y-7 motion-safe:md:translate-y-0 motion-safe:md:translate-x-6",
};

function Reveal({ from = "up", delay = "delay-0", className = "", children }) {
  const [ref, shown] = useInView();
  return (
    <div
      ref={ref}
      className={`h-full transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${delay} ${
        shown ? "" : hiddenFrom[from]
      } ${className}`}
    >
      {typeof children === "function" ? children(shown) : children}
    </div>
  );
}

// Cursor spotlight: a CSS-variable gradient, hidden on touch devices, no React state.
function trackPointer(e) {
  if (e.pointerType !== "mouse") return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Spotlight({ tone }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:hidden ${tone}`}
    />
  );
}

const cardBase =
  "group relative isolate h-full overflow-hidden rounded-2xl border border-brand-navy/[0.08] bg-white p-6 text-brand-navy shadow-[0_1px_2px_rgba(11,31,77,0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(11,31,77,0.08)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8 [--mx:50%] [--my:50%]";


const cardTitle = "font-bricolage font-semibold leading-[1.1] tracking-[-0.02em] text-2xl md:text-3xl";

function IconTile({ icon: Icon, size = 18, className = "" }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl bg-brand-navy text-brand-gold ${className}`}
    >
      <Icon aria-hidden="true" size={size} strokeWidth={1.8} />
    </span>
  );
}

/* --------------------------- Vision graph art --------------------------- */

function GrowthGraph({ shown }) {
  const curve =
    "M0 192 C70 188 120 176 190 160 S300 138 360 110 S480 72 560 42 S620 22 640 16";
  return (
    <svg viewBox="0 0 640 220" fill="none" aria-hidden="true" className="block h-auto w-full">
      <defs>
        <linearGradient id="about-vision-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C69214" stopOpacity="0.3" />
          <stop offset="1" stopColor="#C69214" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[55, 110, 165].map((y) => (
        <line key={y} x1="0" x2="640" y1={y} y2={y} stroke="#fff" strokeOpacity="0.07" />
      ))}

      {/* quiet comparison line */}
      <path d="M0 208 C120 204 240 196 360 180 S540 150 640 136" stroke="#fff" strokeOpacity="0.16" strokeWidth="2" strokeDasharray="4 8" />

      <path
        d={`${curve} L640 220 L0 220 Z`}
        fill="url(#about-vision-area)"
        className={`transition-opacity duration-1000 delay-[900ms] ${
          shown ? "opacity-100" : "motion-safe:opacity-0"
        }`}
      />

      <path
        d={curve}
        pathLength="1"
        stroke="#C69214"
        strokeWidth="3.5"
        strokeLinecap="round"
        className={`[stroke-dasharray:1_1] transition-[stroke-dashoffset] duration-[2200ms] ease-out delay-500 motion-reduce:transition-none ${
          shown ? "[stroke-dashoffset:0]" : "motion-safe:[stroke-dashoffset:1]"
        }`}
      />

      {[[190, 160], [360, 110]].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="5" fill="#0B1F4D" stroke="#F8E8B5" strokeWidth="2" className={`transition-opacity duration-700 delay-[1600ms] ${shown ? "" : "motion-safe:opacity-0"}`} />
      ))}

      <g className={`transition-opacity duration-700 delay-[2200ms] ${shown ? "" : "motion-safe:opacity-0"}`}>
        <circle cx="560" cy="42" r="12" fill="#C69214" fillOpacity="0.4" className="[transform-box:fill-box] [transform-origin:center] opacity-0 group-hover:animate-ping motion-reduce:animate-none" />
        <circle cx="560" cy="42" r="7" fill="#C69214" stroke="#F8E8B5" strokeWidth="2" />
      </g>
    </svg>
  );
}

/* ------------------------------- Section ------------------------------- */

function PrinciplesSection() {
  return (
    <section
      aria-labelledby="principles-title"
      className="relative overflow-hidden bg-white px-4 py-16 text-brand-navy sm:px-6 md:py-24"
    >
      <div className="relative mx-auto max-w-280">
        {/* ------------------------- Heading ------------------------- */}
        <Reveal className="mb-10 lg:mb-14">
          <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <Eyebrow className="mb-5">What guides us</Eyebrow>
              <h2
                id="principles-title"
                className="font-bricolage text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em]"
              >
                Finance feels different when someone is beside you.
              </h2>
            </div>
            <p className="max-w-[40ch] text-base leading-7 text-brand-navy/65 lg:col-span-4 lg:pb-2">
              Clear advice, honest guidance and human support for every important financial step.
            </p>
          </div>
        </Reveal>

        {/* ----------------------- 12-column bento ----------------------- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-12">
          {/* ============ 01 VISION ============ */}
          <Reveal from="left" className="md:col-span-2 lg:col-span-7">
            {(shown) => (
              <article
                onPointerMove={trackPointer}
                className={`${cardBase} flex flex-col border-brand-navy/[0.08] bg-brand-navy  text-white shadow-[0_22px_50px_-26px_rgba(16,38,83,0.7)] hover:border-brand-gold/60 hover:shadow-[0_32px_70px_-26px_rgba(16,38,83,0.85)]`}
              >
                <Spotlight tone="bg-[radial-gradient(320px_circle_at_var(--mx)_var(--my),rgba(255,255,255,0.09),transparent_70%)]" />

                <Eyebrow className="relative text-white/75">Our vision</Eyebrow>

                <h3 className="mt-6 max-w-[16ch] font-bricolage text-2xl font-bold leading-[1.1] tracking-[-0.02em] md:text-3xl">
                  A future where no one is afraid of finance.
                </h3>

                <p className="mt-6 max-w-[48ch] text-base leading-7 text-white/75 sm:text-[17px]">
                  We dream of a day when every family and every business owner can take a financial step with confidence, not fear. A day when a loan feels like a helping hand, not a heavy burden.
                </p>

                <p className="mt-8 max-w-[34ch] text-lg font-bold leading-snug tracking-[-0.01em] text-brand-gold sm:text-xl">
                  To be a trusted guide for every person taking their next financial step.
                </p>

                <div className="-mx-7 -mb-7 mt-auto pt-6 sm:-mx-9 sm:-mb-9">
                  <GrowthGraph shown={shown} />
                </div>
              </article>
            )}
          </Reveal>

          {/* ============ 02 MISSION ============ */}
          <Reveal from="right" delay="delay-150" className="md:col-span-2 lg:col-span-5">
            <article
              onPointerMove={trackPointer}
              className={`${cardBase} border-brand-gold/30 bg-brand-gold  text-brand-navy shadow-[0_22px_50px_-28px_rgba(120,84,0,0.65)] hover:border-brand-gold/50 hover:shadow-[0_32px_70px_-28px_rgba(120,84,0,0.8)]`}
            >
              <Spotlight tone="bg-[radial-gradient(320px_circle_at_var(--mx)_var(--my),rgba(255,255,255,0.28),transparent_70%)]" />

              {/* decorative circles */}
              <div className="pointer-events-none absolute -right-20 -top-20 hidden size-60 sm:block" aria-hidden="true">
                <div className="absolute inset-0 rounded-full border border-brand-navy/[0.08]" />
                <div className="absolute inset-[15%] rounded-full border border-dashed border-brand-navy/15 animate-[spin_80s_linear_infinite] motion-reduce:animate-none" />
                <div className="absolute inset-[30%] rounded-full border border-brand-navy/[0.08]" />
              </div>

              <Eyebrow className="relative">Our mission</Eyebrow>

              <h3 className={`${cardTitle} relative mt-5 max-w-[18ch]`}>
                To make finance simple, honest and stress-free.
              </h3>

              <ul className="relative mt-6 divide-y divide-[#0B1F4D]/15 border-t border-brand-navy/15">
                {missionMain.map(({ icon, title, copy }) => (
                  <li key={title} className="group/m flex items-start gap-4 py-4">
                    <IconTile
                      icon={icon}
                      className="size-10 transition-transform duration-300 group-hover/m:-translate-y-0.5 group-hover/m:-rotate-6 motion-reduce:transition-none"
                    />
                    <div>
                      <h4 className="text-base font-bold leading-snug">{title}</h4>
                      <p className="mt-1 text-sm leading-6 text-brand-navy/85">{copy}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="relative mt-2 space-y-3 rounded-2xl bg-brand-gold/15/60 p-4">
                {missionMore.map(({ icon: Icon, title, copy }) => (
                  <p key={title} className="flex gap-3 text-[13px] leading-5 text-brand-navy/90">
                    <Icon aria-hidden="true" size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />
                    <span>
                      <strong className="font-bold">{title}</strong> {copy}
                    </span>
                  </p>
                ))}
              </div>
            </article>
          </Reveal>

          {/* ============ 03 GOALS ============ */}
          <Reveal from="left" className="md:col-span-1 lg:col-span-7">
            <article
              onPointerMove={trackPointer}
              className={`${cardBase} border-brand-navy/[0.08] bg-white shadow-[0_18px_44px_-28px_rgba(16,38,83,0.35)] hover:border-brand-gold/70 hover:shadow-[0_28px_60px_-28px_rgba(16,38,83,0.5)]`}
            >
              <Spotlight tone="bg-[radial-gradient(320px_circle_at_var(--mx)_var(--my),rgba(217,169,40,0.10),transparent_70%)]" />
              <span className="absolute left-9 top-0 h-1 w-14 rounded-b-full bg-brand-gold" aria-hidden="true" />

              <Eyebrow>Our goals</Eyebrow>
              <h3 className={`${cardTitle} mt-5`}>What we are working toward.</h3>

              <ol className="mt-6 divide-y divide-brand-navy/[0.08] border-t border-brand-navy/[0.08]">
                {goals.map(({ title, copy }, i) => (
                  <li key={title}>
                    <div className="group/g -mx-3 flex items-start gap-4 rounded-2xl px-3 py-4 transition-colors duration-300 hover:bg-slate-50/60 sm:gap-6">
                      <span className="w-12 shrink-0 text-[34px] font-extrabold leading-none tracking-[-0.04em] text-brand-navy tabular-nums transition-transform duration-300 group-hover/g:translate-x-1 motion-reduce:transition-none sm:w-14 sm:text-[40px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h4 className="text-base font-bold leading-snug sm:text-[17px]">{title}</h4>
                        <p className="mt-1 max-w-[52ch] text-sm leading-6 text-brand-navy/65">{copy}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>

          {/* ============ 04 VALUES ============ */}
          <Reveal from="right" delay="delay-150" className="md:col-span-1 lg:col-span-5">
            <article
              onPointerMove={trackPointer}
              className={`${cardBase} border-brand-navy/[0.08] bg-slate-50 shadow-[0_18px_44px_-28px_rgba(16,38,83,0.4)] hover:border-brand-gold/70 hover:shadow-[0_28px_60px_-28px_rgba(16,38,83,0.55)]`}
            >
              <Spotlight tone="bg-[radial-gradient(320px_circle_at_var(--mx)_var(--my),rgba(255,255,255,0.7),transparent_70%)]" />
              <span className="absolute left-9 top-0 h-1 w-14 rounded-b-full bg-brand-gold" aria-hidden="true" />

              {/* two-column header: words + trust illustration */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Eyebrow>Our values</Eyebrow>
                  <h3 className={`${cardTitle} mt-5`}>What we stand for.</h3>
                </div>
                <div className="relative grid size-24 shrink-0 place-items-center sm:size-28" aria-hidden="true">
                  <span className="absolute inset-0 hidden rounded-full border border-dashed border-[#234B91]/35 animate-[spin_50s_linear_infinite] motion-reduce:animate-none sm:block">
                    <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-brand-gold" />
                  </span>
                  <span className="absolute inset-3 rounded-full border border-brand-navy/[0.08] bg-white/60" />
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-brand-navy text-brand-gold shadow-[0_12px_24px_-10px_rgba(16,38,83,0.7)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-3 motion-reduce:transition-none">
                    <ShieldCheck size={28} strokeWidth={1.7} />
                  </span>
                </div>
              </div>

              <ul className="mt-6 divide-y divide-brand-navy/[0.08] border-t border-brand-navy/[0.08]">
                {values.map(({ icon, title, copy }) => (
                  <li key={title} className="group/v flex items-start gap-3.5 py-3.5">
                    <IconTile
                      icon={icon}
                      size={16}
                      className="size-9 transition-transform duration-300 group-hover/v:-translate-y-0.5 group-hover/v:-rotate-6 motion-reduce:transition-none"
                    />
                    <div>
                      <h4 className="text-[15px] font-bold leading-snug">{title}</h4>
                      <p className="mt-0.5 text-[13px] leading-5 text-brand-navy/70">{copy}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default PrinciplesSection;
