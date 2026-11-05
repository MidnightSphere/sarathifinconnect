import { useEffect, useRef } from "react";
import Eyebrow from "./Eyebrow";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const services = [
  {
    title: "Home Loan",
    description:
      "We help you explore loan options for buying, building, or improving a home.",
  },
  {
    title: "Car Loan",
    description: "We help you compare finance options for a new or used car.",
  },
  {
    title: "Business Loan",
    description:
      "We help businesses find funding for their plans and expenses.",
  },
  {
    title: "Personal Loan",
    description: "We help you explore funding options for personal needs.",
  },
  {
    title: "Loan Against Property",
    description: "We help you explore a loan using your property as security.",
  },
  {
    title: "Loan Against Securities",
    description:
      "We help you explore borrowing options using eligible shares or investments as security.",
  },
  {
    title: "Gold Loan",
    description: "We help you find loan options using your gold as security.",
  },
  {
    title: "Machinery Loan",
    description:
      "We help you explore finance for buying or upgrading machinery.",
  },
  {
    title: "Commercial Vehicle Loan",
    description:
      "We help you find finance options for vehicles used by your business.",
  },
  {
    title: "Home Loan Balance Transfer",
    description:
      "We help you compare options for moving your home loan to another lender.",
  },
  {
    title: "Education Loan",
    description:
      "We help students and families explore funding for education costs.",
  },
  {
    title: "SME & MSME Loan",
    description:
      "We help small and medium businesses explore finance for their needs.",
  },
  {
    title: "Business & Equipment Finance",
    description: "We help businesses explore funding for equipment and growth.",
  },
  {
    title: "Working Capital Finance",
    description:
      "We help businesses explore funds for everyday operating costs.",
  },
  {
    title: "Solar Project Finance",
    description: "We help you explore funding options for solar projects.",
  },
].map((service, i) => ({ ...service, no: String(i + 1).padStart(2, "0") }));

// 3 rows x 5 cards. Each row has its own direction and speed (seconds per loop).
const rows = [
  { items: services.slice(0, 5), reverse: false, duration: 50 },
  { items: services.slice(5, 10), reverse: true, duration: 58 },
  { items: services.slice(10, 15), reverse: false, duration: 54 },
];

// How many times a row's cards are repeated inside one half of the track.
// 3 keeps the track wider than the screen, even on very large monitors.
const REPEAT = 3;

/* -------------------------------------------------------------------------- */
/*  Card                                                                      */
/* -------------------------------------------------------------------------- */

function ServiceCard({ no, title, description, hidden }) {
  // Moves the gold spotlight with the cursor (the row is paused while hovering).
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <article
      aria-hidden={hidden || undefined}
      onMouseMove={handleMouseMove}
      className="group relative w-60 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-brand-navy/[0.08] bg-white p-5 text-brand-navy shadow-[0_1px_2px_rgba(11,31,77,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-brand-gold/40 hover:shadow-[0_12px_32px_rgba(11,31,77,0.08)] sm:w-72 sm:p-6"
    >
      {/* cursor-following gold spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-brand-gold/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative">
        {/* number badge */}
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-brand-gold/40 bg-brand-gold/10 font-space text-xs font-bold text-brand-navy transition-all duration-300 group-hover:bg-brand-gold">
          {no}
        </span>

        <h3 className="mt-5 font-bricolage text-base font-semibold text-brand-navy sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-navy/65">
          {description}
        </p>
      </div>

      {/* gold underline that grows on hover */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-gold transition-all duration-500 ease-out group-hover:w-full"
      />
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  One scrolling row (replaces Magic UI Marquee)                             */
/* -------------------------------------------------------------------------- */

function MarqueeRow({ items, reverse = false, duration = 50 }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);

  // Endless loop using the Web Animations API, so no keyframes / CSS file needed.
  // The track holds two identical halves; sliding by -50% lands exactly on the
  // start again, which makes the loop seamless.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    animRef.current = track.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      {
        duration: duration * 1000,
        iterations: Infinity,
        easing: "linear",
        direction: reverse ? "reverse" : "normal",
      }
    );

    return () => animRef.current?.cancel();
  }, [duration, reverse]);

  // Pause on hover, and on touch devices while a finger is held on the row.
  const pause = () => animRef.current?.pause();
  const play = () => animRef.current?.play();

  return (
    <div
      onPointerEnter={pause}
      onPointerLeave={play}
      onPointerCancel={play}
      className="overflow-hidden py-3 motion-reduce:overflow-x-auto"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((half) => (
          // pr-* matches gap-* so both halves are exactly the same width
          <div
            key={half}
            className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
          >
            {Array.from({ length: REPEAT }).map((_, copy) =>
              items.map((service) => (
                <ServiceCard
                  key={`${half}-${copy}-${service.title}`}
                  {...service}
                  hidden={half > 0 || copy > 0}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function WhatWeDoSection() {
  return (
    <section
      id="about-services"
      className="relative isolate w-full overflow-hidden bg-slate-50 py-16 md:py-24"
    >

      {/* heading (the only part with side padding) */}
      <div className="mx-auto max-w-3xl px-4 text-center">
        <Eyebrow>What we do</Eyebrow>
        <h2 className="mt-4 text-balance font-bricolage text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-brand-navy">
          From first question to{" "}
          <span className="text-brand-gold">the right lender.</span>
        </h2>
        <p className="mt-4 text-base text-brand-navy/65">
          Hover over a card to pause and read.
        </p>
      </div>

      {/* full-width rows, edges fade out */}
      <div className="mt-10 flex w-full flex-col [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] sm:mt-14">
        {rows.map((row, i) => (
          <MarqueeRow key={i} {...row} />
        ))}
      </div>
    </section>
  );
}
