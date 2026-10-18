import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  Compass,
  Eye,
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../ui/PrimaryButton";
import useSplashDone from "../ui/split-reveal/useSplashDone";

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

const services = [
  { num: "01", name: "Personal Loan", desc: "Funding for personal milestones, planned or unplanned." },
  { num: "02", name: "Business Finance", desc: "Working capital and growth funding for businesses." },
  { num: "03", name: "Home Finance", desc: "Support for purchasing or renovating your home." },
];

const values = [
  { icon: Compass, title: "Clear Guidance", desc: "Straightforward advice so you always know where you stand." },
  { icon: Eye, title: "Transparent Process", desc: "No hidden steps, no surprises along the way." },
  { icon: HeartHandshake, title: "Support at Every Step", desc: "From first enquiry to final step, we are with you." },
];

const howSteps = [
  { num: "01", title: "Share Your Requirement", desc: "Tell us what you are looking for and understand the next steps." },
  { num: "02", title: "Explore Suitable Options", desc: "Review the financial solution that best matches your requirement." },
  { num: "03", title: "Move Forward With Clarity", desc: "Get guidance through the next stage of the process." },
];

/* ═══════════════════════════════════════════════════
   PATH GENERATION
   ─────────────────────────────────────────────────
   S-curve where milestones are on the OPPOSITE side
   of their corresponding content cards:

   Solutions card (LEFT)     → milestone on RIGHT
   Why Choose Us card (RIGHT) → milestone on LEFT
   How It Works card (LEFT)   → milestone on RIGHT

   viewBox = actual pixel dimensions (ResizeObserver)
   → no stroke distortion, 1:1 coordinate mapping
   ═══════════════════════════════════════════════════ */

function buildPath(w, h) {
  const isMobile = w < 768;
  const cx = w / 2;
  const amp = isMobile ? w * 0.10 : Math.min(w * 0.15, 240);

  // Path curves to RIGHT when card is on LEFT, and vice versa
  const lx = cx - amp; // left side of path (for Why Choose Us milestone)
  const rx = cx + amp; // right side of path (for Solutions + How It Works milestones)

  const pts = [
    { x: cx, y: 0 },           // 0  start (top center)
    { x: rx, y: h * 0.13 },    // 1  Solutions milestone → RIGHT (card is LEFT)
    { x: cx, y: h * 0.22 },    // 2  center pass
    { x: lx, y: h * 0.33 },    // 3  Why Choose Us milestone → LEFT (card is RIGHT)
    { x: cx, y: h * 0.43 },    // 4  center pass
    { x: rx, y: h * 0.53 },    // 5  How It Works milestone → RIGHT (card is LEFT)
    { x: cx, y: h * 0.63 },    // 6  center pass
    { x: cx, y: h * 0.73 },    // 7  Next Step (center)
    { x: cx, y: h * 0.97 },    // 8  end → extends into bottom padding (behind About Us)
  ];

  // Smooth cubic Bézier: control points at same X as waypoint,
  // Y offset by 40% of vertical gap → vertical tangents at every junction
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dy = b.y - a.y;
    d += ` C ${a.x.toFixed(1)} ${(a.y + dy * 0.4).toFixed(1)},`
       + ` ${b.x.toFixed(1)} ${(b.y - dy * 0.4).toFixed(1)},`
       + ` ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }

  return {
    d,
    lx,
    rx,
    cx,
    solY: pts[1].y,
    whyY: pts[3].y,
    howY: pts[5].y,
  };
}

/* ═══════════════════════════════════════════════════
   MILESTONE LABEL (desktop only)
   ─────────────────────────────────────────────────
   Text label positioned near the SVG milestone dot.
   The dot itself is rendered inside the SVG element
   (as <circle> elements) for guaranteed alignment
   with the center path. This label just provides
   the text beside the dot.
   ═══════════════════════════════════════════════════ */

function MilestoneLabel({ label, scrollProgress, at, topPct, leftPct, labelSide = "right" }) {
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, at - 0.06), at],
    [0.45, 1],
  );

  // Offset label away from the dot center (dot is 14px SVG radius)
  const offsetX = labelSide === "left" ? "-100%" : "0%";
  const nudge = labelSide === "left" ? -22 : 22;

  return (
    <motion.div
      className="pointer-events-none absolute z-20 hidden md:block"
      style={{
        top: `${topPct}%`,
        left: `${leftPct}%`,
        opacity,
      }}
    >
      <span
        className="inline-block whitespace-nowrap text-[0.68rem] font-semibold tracking-[0.14em] text-brand-navy"
        style={{
          transform: `translate(${offsetX}, -50%) translateX(${nudge}px)`,
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MOBILE MILESTONE LABEL
   ─────────────────────────────────────────────────
   Flow-based label shown ABOVE each card on mobile.
   Hidden on desktop (absolute markers + SVG dots instead).

   pathXPct = the X coordinate of this milestone’s waypoint
   as a percentage of container width. This is the SAME
   coordinate the SVG center path passes through, ensuring
   the dot sits exactly between the two rails.
   ═══════════════════════════════════════════════════ */

function MobileMilestoneLabel({ label, pathXPct }) {
  return (
    <div className="relative mb-6 md:hidden" style={{ height: 28 }}>
      {/* Dot + label positioned at the path’s X coordinate */}
      <div
        className="absolute top-0 flex items-center gap-2"
        style={{ left: `${pathXPct}%`, transform: "translateX(-50%)" }}
      >
        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[1.5px] border-brand-gold/40 bg-surface" />
          <div className="absolute h-2.5 w-2.5 rounded-full bg-brand-gold" />
          <div className="absolute h-1 w-1 rounded-full bg-surface" />
        </div>
        <span className="whitespace-nowrap text-[0.62rem] font-semibold tracking-[0.14em] text-brand-navy">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN JOURNEY COMPONENT
   ─────────────────────────────────────────────────
   Architecture:

   ┌─ Journey Container (relative, pb-32) ─────────┐
   │                                                │
   │  SVG (absolute inset-0, z-0)                   │
   │    ├─ outer grey rail     (strokeWidth 22)      │
   │    ├─ inner white gap     (strokeWidth 9)       │
   │    ├─ gold progress line  (strokeWidth 3.5)     │
   │    └─ gold highlight      (strokeWidth 1.5)     │
   │                                                │
   │  Milestone Markers (absolute, z-20)            │
   │    ├─ SOLUTIONS ● ───── on RIGHT of path       │
   │    ├─ ● WHY CHOOSE US ─ on LEFT of path        │
   │    └─ HOW IT WORKS ● ── on RIGHT of path       │
   │                                                │
   │  Content Cards (relative, z-10, normal flow)   │
   │    ├─ Solutions card (LEFT side)                │
   │    ├─ Why Choose Us card (RIGHT side)           │
   │    ├─ How It Works card (LEFT side)             │
   │    └─ Next Step CTA (CENTER, path behind)       │
   │                                                │
   │  ── pb-32 padding (path tail visible here) ──  │
   └────────────────────────────────────────────────┘
   ┌─ About Us (separate component, bg-surface) ───┐
   │  -mt-20 overlaps journey padding               │
   │  z-10 → covers SVG path tail                   │
   │  path "disappears behind" About Us             │
   └────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════ */

export default function Journey() {
  const splashDone = useSplashDone();
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [dims, setDims] = useState({ w: 1200, h: 3600 });

  /* ── Measure container (including padding) so viewBox = pixel dims ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setDims({ w: Math.round(width), h: Math.round(height) });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* ── Scroll-driven progress ──
     DIRECT 1:1 mapping — NO spring, NO delay, NO time-based animation.
     offset: ["start center", "end center"]
     → progress 0: container TOP at viewport CENTER (user starts seeing journey)
     → progress 1: container BOTTOM at viewport CENTER (user reaches journey end)
     Range = exactly containerHeight.
     Each % of the container maps to the SAME % of gold progress.
     The gold line is physically attached to scroll position.

     WHY "start center" / "end center":
     With "start end" / "end end", progress starts when the container enters
     the viewport from below. By the time the user SEES the journey, ~30% of
     progress has already been consumed (viewport height / container height).
     Using "center" as the viewport anchor point eliminates this head-start,
     ensuring gold = 0% when the user first sees the journey content. */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  /* ── Generate path + milestone coordinates ── */
  const { d: pathData, lx, rx, solY, whyY, howY } = useMemo(
    () => buildPath(dims.w, dims.h),
    [dims],
  );

  const isMobile = dims.w < 768;
  const activeStyle = !splashDone
    ? { pathLength: 0 }
    : reduceMotion
      ? { pathLength: 1 }
      : { pathLength: scrollYProgress };

  /* ── Stroke widths (pixel values, no scaling needed) ── */
  const outerStroke = isMobile ? 14 : 22;
  const innerStroke = isMobile ? 5 : 9;
  const goldStroke = isMobile ? 2.5 : 3.5;
  const highlightStroke = isMobile ? 1 : 1.5;

  /* ── Milestone positions as percentages of container ── */
  const solTopPct = (solY / dims.h) * 100;
  const whyTopPct = (whyY / dims.h) * 100;
  const howTopPct = (howY / dims.h) * 100;
  const leftPct = (lx / dims.w) * 100;
  const rightPct = (rx / dims.w) * 100;

  return (
    <div
      ref={containerRef}
      className="relative pb-32"
      aria-label="Sarathi FinConnect financial journey"
    >
      {/* Subtle radial background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_27%,rgba(11,31,77,0.035),transparent_42%)]"
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════
          SVG PATH LAYER — 3-LINE RAIL SYSTEM
          viewBox matches container pixels → 1:1 mapping
          ═══════════════════════════════════════════ */}
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        {/* 1. OUTER TRACK — thick grey stroke forms the two visible rails */}
        <path
          d={pathData}
          stroke="#DCE2EA"
          strokeWidth={outerStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />

        {/* 2. INNER WHITE — carves the gap between the two rails */}
        <path
          d={pathData}
          stroke="#F7F8FA"
          strokeWidth={innerStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. GOLD CENTER LINE — scroll-driven progress */}
        <motion.path
          d={pathData}
          stroke="#C69214"
          strokeWidth={goldStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={activeStyle}
        />

        {/* 4. GOLD HIGHLIGHT — thin luminous sheen */}
        <motion.path
          d={pathData}
          stroke="#E3BD62"
          strokeWidth={highlightStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
          style={activeStyle}
        />

        {/* 5. MILESTONE DOTS — rendered in SVG at exact waypoint coords.
            Desktop only. On mobile, MobileMilestoneLabel handles dots
            (positioned at the same pathXPct) to avoid duplicates.      */}
        {!isMobile && [
          { x: rx, y: solY },
          { x: lx, y: whyY },
          { x: rx, y: howY },
        ].map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r={14} fill="#F7F8FA" stroke="rgba(198,146,20,0.4)" strokeWidth={1.5} />
            <circle cx={pt.x} cy={pt.y} r={5} fill="#C69214" />
            <circle cx={pt.x} cy={pt.y} r={1.5} fill="#F7F8FA" />
          </g>
        ))}
      </svg>

      {/* ═══════════════════════════════════════════
          MILESTONE MARKERS — on the path, outside cards
          Labels face AWAY from their cards to prevent overlap
          ═══════════════════════════════════════════ */}

      {/* ● SOLUTIONS label — beside the SVG dot on the RIGHT */}
      <MilestoneLabel
        label="SOLUTIONS"
        scrollProgress={scrollYProgress}
        at={0.13}
        topPct={solTopPct}
        leftPct={rightPct}
        labelSide="right"
      />

      {/* ● WHY CHOOSE US label — beside the SVG dot on the LEFT */}
      <MilestoneLabel
        label="WHY CHOOSE US"
        scrollProgress={scrollYProgress}
        at={0.33}
        topPct={whyTopPct}
        leftPct={leftPct}
        labelSide="left"
      />

      {/* ● HOW IT WORKS label — beside the SVG dot on the RIGHT */}
      <MilestoneLabel
        label="HOW IT WORKS"
        scrollProgress={scrollYProgress}
        at={0.53}
        topPct={howTopPct}
        leftPct={rightPct}
        labelSide="right"
      />

      {/* ═══════════════════════════════════════════
          CONTENT CARDS — normal flow, always visible
          z-10 sits above the SVG path layer
          ═══════════════════════════════════════════ */}

      {/* ─── SOLUTIONS (LEFT) ─── */}
      <section
        id="services"
        className="relative z-10 px-5 py-20 sm:px-8 sm:py-28"
      >
        <MobileMilestoneLabel label="SOLUTIONS" pathXPct={rightPct} />
        <div className="flex items-center md:justify-start">
        <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/72 p-6 shadow-[0_16px_44px_rgba(11,31,77,0.06)] backdrop-blur-sm sm:p-8 md:ml-[9%]">
          <h2 className="m-0 text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-brand-navy sm:text-4xl">
            Solutions for your next step.
          </h2>
          <ul className="mt-7 grid gap-4 p-0">
            {services.map((svc) => (
              <li
                key={svc.name}
                className="list-none border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex gap-3">
                  <span className="text-sm font-bold leading-tight text-brand-gold">
                    {svc.num}
                  </span>
                  <div>
                    <span className="text-[0.98rem] font-semibold text-brand-navy">
                      {svc.name}
                    </span>
                    <p className="m-0 mt-1 text-[0.88rem] leading-relaxed text-text-secondary">
                      {svc.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-brand-gold no-underline transition-colors duration-200 hover:text-brand-navy"
            >
              View All Services <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US (RIGHT) ─── */}
      <section className="relative z-10 px-5 py-20 sm:px-8 sm:py-28">
        <MobileMilestoneLabel label="WHY CHOOSE US" pathXPct={leftPct} />
        <div className="flex items-center md:justify-end">
        <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/72 p-6 shadow-[0_16px_44px_rgba(11,31,77,0.06)] backdrop-blur-sm sm:p-8 md:mr-[9%]">
          <h2 className="m-0 text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-brand-navy sm:text-4xl">
            Guidance that keeps things clear.
          </h2>
          <div className="mt-7 grid gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gold/8">
                    <Icon size={18} className="text-brand-gold" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="m-0 text-[0.95rem] font-semibold text-brand-navy">
                      {v.title}
                    </p>
                    <p className="m-0 mt-1 text-[0.85rem] leading-relaxed text-text-secondary">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (LEFT) ─── */}
      <section
        id="about"
        className="relative z-10 px-5 py-20 sm:px-8 sm:py-28"
      >
        <MobileMilestoneLabel label="HOW IT WORKS" pathXPct={rightPct} />
        <div className="flex items-center md:justify-start">
        <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/72 p-6 shadow-[0_16px_44px_rgba(11,31,77,0.06)] backdrop-blur-sm sm:p-8 md:ml-[9%]">
          <h2 className="m-0 text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-brand-navy sm:text-4xl">
            A simpler way to move forward.
          </h2>
          <ol className="mt-7 grid gap-4 p-0">
            {howSteps.map((s) => (
              <li
                key={s.num}
                className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <span className="text-lg font-bold leading-tight text-brand-gold">
                  {s.num}
                </span>
                <div>
                  <p className="m-0 text-[0.95rem] font-semibold text-brand-navy">
                    {s.title}
                  </p>
                  <p className="m-0 mt-1 text-[0.85rem] leading-relaxed text-text-secondary">
                    {s.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        </div>
      </section>

      {/* ─── NEXT STEP CTA ───
           Path passes BEHIND this card (z-10 > z-0).
           Path continues below in pb-32 padding,
           then gets covered by About Us.               */}
      <section
        id="contact"
        className="relative z-10 flex items-center justify-center px-5 py-20 text-center sm:px-8 sm:py-28"
      >
        <div className="max-w-2xl rounded-[2rem] border border-brand-navy/10 bg-brand-navy px-7 py-12 text-white shadow-[0_20px_55px_rgba(11,31,77,0.18)] sm:px-12 sm:py-16">
          <p className="mb-4 text-[0.68rem] font-bold tracking-[0.15em] text-brand-gold-light">
            NEXT STEP
          </p>
          <h2 className="m-0 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
            Your next step starts here.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-white/70">
            A conversation is the first move toward a clearer financial path.
          </p>
          <PrimaryButton
            href="mailto:"
            className="mt-8 !bg-brand-gold hover:!bg-brand-gold-light"
          >
            Talk to Us <ArrowRight size={16} aria-hidden="true" />
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
