import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import ArrowButton from "../ui/ArrowButton";
import useSplashDone from "../ui/split-reveal/useSplashDone";
import { journeyCards } from "../../data/journey-cards";

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

function CountUp({ value, label, verified = true }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.45 });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) return;
    let frame;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / 1400, 1);
      setCount(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, reduceMotion, value]);

  const shownCount = reduceMotion && isInView ? value : count;
  const formatted = shownCount.toLocaleString("en-IN");
  const finalFormatted = value.toLocaleString("en-IN");
  return (
    <div ref={ref} role="img" className="flex flex-wrap items-baseline gap-x-2" aria-label={verified ? `${finalFormatted} plus ${label.toLowerCase()}` : "Our founder's client relationships"}>
      {verified ? (
        <span aria-hidden="true" className="font-bricolage text-[clamp(4rem,9vw,7rem)] font-bold leading-[0.9] tracking-[-0.065em] text-brand-navy">
          {formatted}<span className="text-brand-gold">+</span>
        </span>
      ) : (
        <span aria-hidden="true" className="font-bricolage text-lg font-semibold text-brand-navy">Our founder&apos;s client relationships</span>
      )}
      <span aria-hidden="true" className="font-bricolage text-lg font-semibold text-brand-navy">{label}</span>
    </div>
  );
}

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
    { x: cx, y: h },           // 8  end at the Journey section boundary
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

/* ═══════════════════════════════════════════════════
   MAIN JOURNEY COMPONENT
   ─────────────────────────────────────────────────
   Architecture:

   ┌─ Journey Container (relative) ─────────┐
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

  useEffect(() => {
    if (import.meta.env.DEV && !journeyCards[2].verified) {
      console.warn("Client count unverified");
    }
  }, []);

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

  return (
    <div
      ref={containerRef}
      className="relative overflow-y-clip"
      aria-label="Sarathi FinConnect financial journey"
    >
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        style={{
          maskImage: "linear-gradient(to bottom, #000 calc(100% - 28px), transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 calc(100% - 28px), transparent)",
        }}
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

        {/* 5. Desktop-only milestone dots at exact waypoint coordinates. */}
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
          CONTENT CARDS — normal flow, always visible
          z-10 sits above the SVG path layer
          ═══════════════════════════════════════════ */}

      {/* ─── SOLUTIONS (LEFT) ─── */}
      <section
        id="journey-services"
        className="relative z-10 px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="flex items-center md:justify-start">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
            className="w-full max-w-md rounded-3xl border border-brand-navy/[0.08] bg-white/90 p-6 shadow-[0_12px_34px_rgba(11,31,77,0.07)] backdrop-blur-sm sm:p-8 md:ml-[9%]"
          >
            <p className="m-0 font-space text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">{journeyCards[0].eyebrow}</p>
            <div className="mt-3 flex items-center gap-3 sm:gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-full border border-brand-gold/20 bg-brand-gold/10 sm:size-[4.5rem]" aria-hidden="true">
                <img src="/logo/sarathi-finconnect-only-logo.svg" alt="" className="size-9 object-contain sm:size-10" />
              </div>
              <svg viewBox="0 0 112 58" className="h-12 min-w-0 flex-1 max-w-28 text-brand-gold" fill="none" aria-hidden="true">
                <path d="M4 48C28 48 24 12 53 12s28 34 55 4" stroke="currentColor" strokeWidth="2" strokeDasharray="3 5" strokeLinecap="round" />
                <circle cx="4" cy="48" r="3" fill="currentColor" /><circle cx="53" cy="12" r="3" fill="currentColor" /><circle cx="108" cy="16" r="3" fill="currentColor" />
              </svg>
            </div>
            <h2 className="m-0 mt-3 font-bricolage text-2xl font-bold leading-[1.08] tracking-[-0.035em] text-brand-navy md:text-3xl">{journeyCards[0].heading}</h2>
            <p className="m-0 mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">{journeyCards[0].description}</p>
            <Link to="/about" className="group mt-2 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-brand-navy no-underline transition-colors hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold">
              Read more <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </motion.article>
        </div>
      </section>

      {/* ─── WHY CHOOSE US (RIGHT) ─── */}
      <section className="relative z-10 px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex items-center md:justify-end">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
            className="w-full max-w-md rounded-3xl border border-brand-navy/[0.08] bg-white/90 p-6 shadow-[0_12px_34px_rgba(11,31,77,0.07)] backdrop-blur-sm sm:p-8 md:mr-[9%]"
          >
            <p className="m-0 font-space text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">{journeyCards[1].eyebrow}</p>
            <div className="mt-2"><CountUp value={journeyCards[1].value} label={journeyCards[1].label} /></div>
            <h2 className="m-0 mt-1 font-bricolage text-lg font-semibold leading-tight text-brand-navy">{journeyCards[1].title}</h2>
            <p className="m-0 mt-1 text-xs leading-relaxed text-text-secondary">{journeyCards[1].attribution}</p>
            <p className="m-0 mt-2 text-sm leading-relaxed text-text-secondary">{journeyCards[1].description}</p>
          </motion.article>
        </div>
      </section>

      {/* ─── HOW IT WORKS (LEFT) ─── */}
      <section
        className="relative z-10 px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="flex items-center md:justify-start">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
            className="w-full max-w-md rounded-3xl border border-brand-navy/[0.08] bg-white/90 p-6 shadow-[0_12px_34px_rgba(11,31,77,0.07)] backdrop-blur-sm sm:p-8 md:ml-[9%]"
          >
            <p className="m-0 font-space text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">{journeyCards[2].eyebrow}</p>
            <div className="mt-2"><CountUp value={journeyCards[2].value} label={journeyCards[2].label} verified={journeyCards[2].verified} /></div>
            <h2 className="m-0 mt-1 font-bricolage text-lg font-semibold leading-tight text-brand-navy">{journeyCards[2].title}</h2>
            <p className="m-0 mt-1 text-xs leading-relaxed text-text-secondary">{journeyCards[2].attribution}</p>
            <p className="m-0 mt-2 text-sm leading-relaxed text-text-secondary">{journeyCards[2].description}</p>
          </motion.article>
        </div>
      </section>

      {/* ─── NEXT STEP CTA ───
           Path passes BEHIND this card (z-10 > z-0).
           Path ends at the Journey section boundary. */}
      <section
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
          <ArrowButton
            href="mailto:"
            variant="gold"
            size="md"
            className="mt-8"
          >
            Talk to Us
          </ArrowButton>
        </div>
      </section>
    </div>
  );
}
