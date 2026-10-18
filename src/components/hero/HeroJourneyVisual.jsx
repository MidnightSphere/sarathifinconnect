import { motion } from "motion/react";
import useSplashDone from "../ui/split-reveal/useSplashDone";

/**
 * Custom SVG journey visual for the hero section.
 *
 * Depicts a curved road/path with milestone nodes and service cards
 * positioned along it — inspired by the Sarathi FinConnect logo's road + wing motif.
 *
 * All elements are decorative and aria-hidden.
 */

const services = [
  { label: "Personal Loan", x: 72, y: 85 },
  { label: "Home Loan", x: 265, y: 195 },
  { label: "Business Finance", x: 115, y: 320 },
];

const milestones = [
  { cx: 130, cy: 60 },
  { cx: 230, cy: 130 },
  { cx: 310, cy: 210 },
  { cx: 250, cy: 290 },
  { cx: 160, cy: 350 },
];

export default function HeroJourneyVisual() {
  const splashDone = useSplashDone();
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0" aria-hidden="true">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-brand-navy) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-navy) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <svg
        viewBox="0 0 440 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Glow filter for gold highlights */}
        <defs>
          <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="road-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-navy)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--color-brand-navy)" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="path-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-navy)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="var(--color-brand-gold)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-brand-navy)" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Wide road fill behind the stroke */}
        <motion.path
          d="M 80 30 C 160 30, 280 80, 320 160 C 360 240, 300 300, 220 340 C 140 380, 100 400, 120 420"
          stroke="url(#road-gradient)"
          strokeWidth="48"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: splashDone ? 1 : 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />

        {/* Main journey path */}
        <motion.path
          d="M 80 30 C 160 30, 280 80, 320 160 C 360 240, 300 300, 220 340 C 140 380, 100 400, 120 420"
          stroke="url(#path-stroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: splashDone ? 1 : 0 }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
        />

        {/* Gold dashed accent line */}
        <motion.path
          d="M 80 30 C 160 30, 280 80, 320 160 C 360 240, 300 300, 220 340 C 140 380, 100 400, 120 420"
          stroke="var(--color-brand-gold)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 8"
          fill="none"
          strokeOpacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: splashDone ? 1 : 0 }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.4 }}
        />

        {/* Milestone nodes */}
        {milestones.map((m, i) => (
          <motion.g key={i}>
            {/* Outer ring */}
            <motion.circle
              cx={m.cx}
              cy={m.cy}
              r="8"
              fill="none"
              stroke="var(--color-brand-gold)"
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: splashDone ? 1 : 0, opacity: splashDone ? 1 : 0 }}
              transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
            />
            {/* Inner dot */}
            <motion.circle
              cx={m.cx}
              cy={m.cy}
              r="3"
              fill="var(--color-brand-gold)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: splashDone ? 1 : 0, opacity: splashDone ? 1 : 0 }}
              transition={{ delay: 0.9 + i * 0.12, duration: 0.3 }}
            />
          </motion.g>
        ))}

        {/* Abstract financial symbols */}

        {/* Small chart line — near top */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: splashDone ? 0.15 : 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <polyline
            points="360,80 370,70 380,75 390,55 400,60"
            fill="none"
            stroke="var(--color-brand-navy)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Small shield — near middle */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: splashDone ? 0.12 : 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <path
            d="M 50 200 L 50 215 C 50 225 60 232 65 235 C 70 232 80 225 80 215 L 80 200 Z"
            fill="none"
            stroke="var(--color-brand-navy)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Small currency circle — near bottom */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: splashDone ? 0.12 : 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <circle
            cx="370"
            cy="320"
            r="14"
            fill="none"
            stroke="var(--color-brand-navy)"
            strokeWidth="1.2"
          />
          <text
            x="370"
            y="325"
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill="var(--color-brand-navy)"
            fontFamily="var(--font-sans)"
          >
            ₹
          </text>
        </motion.g>

        {/* Wing accent — top right, inspired by the logo */}
        <motion.path
          d="M 350 40 C 360 25, 385 20, 410 30 C 395 28, 375 35, 365 50"
          fill="none"
          stroke="var(--color-brand-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: splashDone ? 1 : 0, opacity: splashDone ? 0.35 : 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
        <motion.path
          d="M 355 50 C 365 32, 395 25, 418 38 C 400 35, 382 42, 370 58"
          fill="none"
          stroke="var(--color-brand-gold)"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: splashDone ? 1 : 0, opacity: splashDone ? 0.25 : 0 }}
          transition={{ delay: 1.35, duration: 0.7 }}
        />
      </svg>

      {/* Service cards positioned along the journey */}
      {services.map((s, i) => (
        <motion.div
          key={s.label}
          className={
            "absolute px-4 py-2.5 " +
            "bg-white rounded-lg " +
            "shadow-[0_2px_12px_rgba(11,31,77,0.07)] " +
            "border border-border " +
            "text-[0.8125rem] font-medium text-text-primary " +
            "select-none pointer-events-none " +
            "whitespace-nowrap"
          }
          style={{
            left: `${(s.x / 440) * 100}%`,
            top: `${(s.y / 440) * 100}%`,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={splashDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 1.1 + i * 0.15, duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold mr-2 align-middle" />
          {s.label}
        </motion.div>
      ))}
    </div>
  );
}
