import { useEffect, useRef, useState } from 'react'
import './LaunchingSoon.css'

// ─── Launch configuration ─────────────────────────────────────────────────────
//
//  LAUNCH_MODE controls the production gate behaviour:
//
//    'auto'        — Show Launching Soon until LAUNCH_TIMESTAMP, then go live.
//                    This is the default and recommended setting.
//    'coming-soon' — Always show the Launching Soon page (forced).
//    'live'        — Always show the live website (gate disabled).
//
//  LAUNCH_TIMESTAMP — Official website launch: 21 November 2026, 12:00 AM IST.
//  NOTE: The inauguration ceremony starts at 9:00 AM — this is a separate event.
//
export const LAUNCH_MODE = 'auto'
export const LAUNCH_TIMESTAMP = new Date('2026-11-21T00:00:00+05:30').getTime()

// ─── Countdown helpers ────────────────────────────────────────────────────────

function getRemainingTime() {
  const diff = Math.max(0, LAUNCH_TIMESTAMP - Date.now())
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)      / 1_000),
    expired: diff === 0,
  }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

// ─── CountdownUnit ────────────────────────────────────────────────────────────

function CountdownUnit({ value, label }) {
  return (
    <div className="sfc-countdown-unit" aria-label={`${value} ${label}`}>
      <span className="sfc-countdown-value">{pad(value)}</span>
      <span className="sfc-countdown-label">{label}</span>
    </div>
  )
}

// ─── LaunchingSoon ────────────────────────────────────────────────────────────

export default function LaunchingSoon() {
  // Initialise without reading the clock on first render to avoid any SSR mismatch.
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })
  const timerRef = useRef(null)

  useEffect(() => {
    // Sync immediately on mount (client only).
    setTime(getRemainingTime())

    timerRef.current = setInterval(() => {
      const next = getRemainingTime()
      setTime(next)
      if (next.expired) {
        clearInterval(timerRef.current)
      }
    }, 1_000)

    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className="sfc-ls-root" role="main">
      {/* Subtle background texture */}
      <div className="sfc-bg-texture" aria-hidden="true" />

      {/* Top gold line */}
      <div className="sfc-top-line" aria-hidden="true" />

      <div className="sfc-ls-content">

        {/* Logo */}
        <div className="sfc-logo-wrap">
          <img
            src="/logo/sarathi-finconnect-only-logo.svg"
            alt="Sarathi FinConnect"
            className="sfc-logo"
            width="68"
            height="82"
          />
        </div>

        {/* Eyebrow */}
        <p className="sfc-eyebrow" aria-label="A new financial journey begins">
          A NEW FINANCIAL JOURNEY BEGINS
        </p>

        {/* Divider */}
        <div className="sfc-divider" aria-hidden="true">
          <span className="sfc-divider-line" />
          <span className="sfc-divider-diamond" aria-hidden="true">◆</span>
          <span className="sfc-divider-line" />
        </div>

        {/* Main heading */}
        <h1 className="sfc-heading">Launching Soon</h1>

        {/* Supporting message */}
        <p className="sfc-subheading">
          We&rsquo;re preparing something meaningful.
          <br className="sfc-break" />
          A new chapter in your financial journey is about to begin.
        </p>

        {/* Countdown */}
        <div className="sfc-countdown-wrap" aria-label="Countdown to launch">
          {time.expired ? (
            <p className="sfc-launched-msg">We are live. Welcome.</p>
          ) : (
            <div className="sfc-countdown">
              <CountdownUnit value={time.days}    label="Days"    />
              <span className="sfc-countdown-sep" aria-hidden="true">:</span>
              <CountdownUnit value={time.hours}   label="Hours"   />
              <span className="sfc-countdown-sep" aria-hidden="true">:</span>
              <CountdownUnit value={time.minutes} label="Minutes" />
              <span className="sfc-countdown-sep" aria-hidden="true">:</span>
              <CountdownUnit value={time.seconds} label="Seconds" />
            </div>
          )}
        </div>

        {/* Official date */}
        <p className="sfc-event-date">
          <span className="sfc-event-date-label">Official Inauguration</span>
          <span className="sfc-event-date-value">21 November 2026 &middot; Saturday &middot; 9:00 AM IST</span>
        </p>

        {/* CTA */}
        <div className="sfc-cta-wrap">
          <a
            href="/invitation/"
            className="sfc-cta-btn"
            aria-label="View inauguration invitation"
          >
            <span>View Inauguration Invitation</span>
            <span className="sfc-cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>

      </div>

      {/* Footer */}
      <footer className="sfc-footer">
        <div className="sfc-footer-line" aria-hidden="true" />
        <p className="sfc-footer-text">Sarathi FinConnect Advisory LLP</p>
      </footer>

      {/* Bottom gold line */}
      <div className="sfc-bottom-line" aria-hidden="true" />
    </div>
  )
}
