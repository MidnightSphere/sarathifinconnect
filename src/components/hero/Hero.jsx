import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import ArrowButton from "../ui/ArrowButton";
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

/* ─────────────────────────────────────────────────────────
   Growth Curve — large upward-rising progress visualization
   "Your Goals → Sarathi → Right Financial Solution"
   ───────────────────────────────────────────────────────── */

// viewBox for the growth curve SVG — wide landscape, rising left→right
const VB_W = 1000;
const VB_H = 420;

// Three milestone positions at progressively higher Y (lower Y = higher on screen)
const MILESTONES = [
  { vx: 80, vy: 350, label: "Your Goals", kind: "start" },
  { vx: 480, vy: 200, label: "Sarathi", kind: "middle" },
  { vx: 900, vy: 60, label: "Right Financial Solution", kind: "end" },
];

// Smooth upward cubic Bézier from bottom-left to top-right through all three milestones
const CURVE_D = `M ${MILESTONES[0].vx} ${MILESTONES[0].vy} C 200 340, 340 220, ${MILESTONES[1].vx} ${MILESTONES[1].vy} S 740 90, ${MILESTONES[2].vx} ${MILESTONES[2].vy}`;

// Fractional path-lengths where the dot reaches each milestone (approximate)
const MILESTONE_T = [0, 0.46, 1];

function HeroGrowthCurve({ splashDone }) {
  const ref = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [phase, setPhase] = useState("idle"); // idle → drawing → milestones → dot

  // Track tab visibility
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const active = splashDone && inView && pageVisible;

  // Kick off the draw → milestones → dot sequence
  useEffect(() => {
    if (!active || reduceMotion) return;
    if (phase !== "idle") return;
    setPhase("drawing");
  }, [active, reduceMotion, phase]);

  // After path draw completes, show milestones then start dot
  const onPathDrawComplete = useCallback(() => {
    setPhase("milestones");
    const t = setTimeout(() => setPhase("dot"), 900);
    return () => clearTimeout(t);
  }, []);

  // ── Moving gold dot along the path (manual rAF for smooth motion) ──
  useEffect(() => {
    if (phase !== "dot" || reduceMotion) return;
    if (!active) return; // don't start if not visible
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;

    const totalLen = path.getTotalLength();
    const duration = 5500; // ms per loop
    startRef.current = null;
    let running = true;

    // Sarathi ring pulse element
    const sarathiRing = svgRef.current?.querySelector("[data-sarathi-ring]");

    const tick = (ts) => {
      if (!running) return;
      if (startRef.current === null) startRef.current = ts;
      const elapsed = (ts - startRef.current) % duration;
      const t = elapsed / duration; // 0→1 progress
      const pt = path.getPointAtLength(t * totalLen);
      dot.setAttribute("cx", pt.x);
      dot.setAttribute("cy", pt.y);

      // Pulse Sarathi ring when dot is near milestone 2
      if (sarathiRing) {
        const dist = Math.abs(t - MILESTONE_T[1]);
        if (dist < 0.025) {
          sarathiRing.setAttribute("r", "18");
          sarathiRing.setAttribute("stroke-opacity", "1");
        } else {
          sarathiRing.setAttribute("r", "15");
          sarathiRing.setAttribute("stroke-opacity", "0.6");
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, reduceMotion, active]);

  const showMilestones = phase === "milestones" || phase === "dot" || reduceMotion;

  // Label configs — positioning relative to each milestone
  const labelConfigs = [
    { anchor: "start", dx: 18, dy: 6 }, // "Your Goals" — right of dot
    { anchor: "middle", dx: 0, dy: -32 }, // "Sarathi" — above dot
    { anchor: "end", dx: -18, dy: 6 }, // "Right Financial Solution" — left of dot
  ];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none relative z-10 mx-auto mt-8 w-full max-w-[320px] sm:mt-10 sm:max-w-[520px] md:max-w-[700px] lg:mt-12 lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1150px]"
      style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-full w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ── Filters ── */}
        <defs>
          <filter id="hero-curve-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hero-dot-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Main upward-growth curve ── */}
        <motion.path
          ref={pathRef}
          d={CURVE_D}
          fill="none"
          stroke="var(--color-brand-gold)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#hero-curve-glow)"
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0.9 }}
          animate={
            phase === "drawing" || phase === "milestones" || phase === "dot"
              ? { pathLength: 1 }
              : reduceMotion
                ? { pathLength: 1 }
                : {}
          }
          transition={{ duration: 2, ease: [0.42, 0, 0.58, 1] }}
          onAnimationComplete={() => {
            if (phase === "drawing") onPathDrawComplete();
          }}
        />

        {/* ── Milestones ── */}
        {MILESTONES.map((m, i) => {
          const lc = labelConfigs[i];
          const isMiddle = m.kind === "middle";
          const isEnd = m.kind === "end";
          // Circle radii
          const outerR = isMiddle ? 13 : isEnd ? 10 : 8;
          const innerR = isMiddle ? 6 : 0;

          return (
            <motion.g
              key={m.kind}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
              animate={showMilestones ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                delay: reduceMotion ? 0 : i * 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Outer pulse ring for Sarathi */}
              {isMiddle && (
                <circle
                  data-sarathi-ring=""
                  cx={m.vx}
                  cy={m.vy}
                  r="15"
                  fill="none"
                  stroke="var(--color-brand-gold)"
                  strokeWidth="2"
                  strokeOpacity="0.6"
                  style={{ transition: "r 0.3s ease, stroke-opacity 0.3s ease" }}
                />
              )}
              {/* Main circle */}
              <circle
                cx={m.vx}
                cy={m.vy}
                r={outerR}
                fill={isEnd ? "var(--color-brand-gold)" : "var(--color-brand-navy)"}
                stroke={isEnd ? "var(--color-brand-navy)" : "var(--color-brand-gold)"}
                strokeWidth={isMiddle ? 3 : 2}
              />
              {/* Inner gold dot for Sarathi */}
              {isMiddle && (
                <circle
                  cx={m.vx}
                  cy={m.vy}
                  r={innerR}
                  fill="var(--color-brand-gold)"
                />
              )}
              {/* Label */}
              <text
                x={m.vx + lc.dx}
                y={m.vy + lc.dy}
                textAnchor={lc.anchor}
                fill="var(--color-brand-navy)"
                fillOpacity="0.78"
                fontSize="15"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight={isMiddle ? 700 : 500}
              >
                {m.label}
              </text>
            </motion.g>
          );
        })}

        {/* ── Moving gold dot ── */}
        {phase === "dot" && !reduceMotion && (
          <circle
            ref={dotRef}
            r="6"
            fill="var(--color-brand-gold)"
            filter="url(#hero-dot-glow)"
            cx={MILESTONES[0].vx}
            cy={MILESTONES[0].vy}
          />
        )}
      </svg>
    </div>
  );
}

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
      className="relative isolate flex min-h-[86vh] items-center justify-center overflow-hidden px-5 pb-20 pt-40 text-center sm:px-8 sm:pt-60"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden md:block"
      >
        <div className="absolute -top-20 left-[8%] h-[380px] w-[380px] rounded-full bg-brand-gold/35 blur-3xl" />
        <div className="absolute -top-[100px] right-[6%] h-[420px] w-[420px] rounded-full bg-brand-navy/25 blur-3xl" />
        <div className="absolute top-10 left-[45%] h-[280px] w-[280px] rounded-full bg-brand-gold-light/40 blur-3xl" />
      </div>
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
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        <motion.h1
          aria-label="Loan solutions for your goals, guided with confidence."
          className="m-0 mx-auto max-w-6xl text-balance font-bricolage text-[clamp(2.55rem,5.2vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-brand-navy"
        >
          <span aria-hidden="true" className="block">{["Loan", "solutions", "for", "your", "goals,"].map((word, i) => <span key={word} className="inline-block overflow-hidden align-bottom mr-[0.3em] pr-[0.05em]"><motion.span className="inline-block" initial={{ y: "100%", opacity: 0 }} animate={splashDone ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }} transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>{word}</motion.span></span>)}</span>
          <span aria-hidden="true" className="block">
            {["guided", "with", "confidence."].map((word, i) => <span key={word} className="inline-block overflow-hidden align-bottom mr-[0.3em] pr-[0.05em]"><motion.span className={`inline-block ${i !== 1 ? "font-crimson text-[1.08em] font-semibold italic tracking-[-0.02em]" : ""}`} initial={{ y: "100%", opacity: 0, color: i !== 1 ? "rgba(11,31,77,.6)" : undefined }} animate={splashDone ? { y: 0, opacity: 1, color: i !== 1 ? "#c69214" : undefined } : { y: "100%", opacity: 0 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.7, color: { delay: 1.1, duration: 0.6 }, ease: [0.22, 1, 0.36, 1] }}>{word}</motion.span></span>)}
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={splashDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ delay: 0.95, duration: 0.5 }}
          className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          Sarathi FinConnect helps individuals and businesses explore suitable loan
          options with clear guidance throughout the process.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={splashDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-9 flex justify-center"
        >
          <ArrowButton href="#services" variant="navy" size="md">
            Explore Solutions
          </ArrowButton>
        </motion.div>
        <HeroGrowthCurve splashDone={splashDone} />
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
