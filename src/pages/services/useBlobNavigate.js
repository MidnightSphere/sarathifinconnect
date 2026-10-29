import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrganicBlobPortal } from 'motion-organic'

/**
 * useBlobNavigate
 *
 * Runs motion-organic's OrganicBlobPortal (the liquid droplet with Fourier
 * surface-tension waves) from the exact point the user clicked, fills it with
 * the Sarathi FinConnect navy + gold theme, and navigates once the screen is
 * fully covered. The cover then fades out to reveal the new page.
 *
 * Why this doesn't use <Mo> or usePageTransition():
 * - OrganicBlobPortal only draws a blob when it is given an element to mask.
 *   Those helpers don't pass one, so you would see just a thin outline.
 * - A transition created inside a component is destroyed when that component
 *   unmounts. The Services page unmounts the moment the route changes, which
 *   would cut the animation short. Here the animation lives outside React.
 *
 * Usage:
 *   const blobNavigate = useBlobNavigate()
 *   <Link to="/services/home-loan" onClick={(e) => blobNavigate(e, '/services/home-loan', { label: 'Home Loan' })} />
 */

// Theme — matches the navy / gold already used across the site.
const THEME = {
  navy: '#0b1f4d',
  navyMid: '#10224d',
  navyLight: '#18356f',
  gold: '#f0bd46',
  goldDeep: '#c69214',
  white: '#ffffff',
}

const BLOB = {
  points: 14,
  wobbleIntensity: 0.2, // surface-wave amplitude (library default 0.18)
  stiffness: 140, // library default is 95 (about 1.2s); 140/22 lands in about 0.8s, still no overshoot
  damping: 22,
  rimColor: 'rgba(240, 189, 70, 0.85)',
  rimGlow: 'drop-shadow(0 0 14px rgba(240, 189, 70, 0.55))',
  fadeOutMs: 480,
}

let isRunning = false

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function nextFrames(count = 2) {
  return new Promise((resolve) => {
    const step = (remaining) => {
      if (remaining <= 0) resolve()
      else requestAnimationFrame(() => step(remaining - 1))
    }
    step(count)
  })
}

// The full-screen surface the blob reveals. Built with plain DOM because the
// library masks a real element with an SVG clip-path.
function createCover(label) {
  const cover = document.createElement('div')
  cover.setAttribute('aria-hidden', 'true')
  Object.assign(cover.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '9998', // the library's gold rim sits above at 9999
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    opacity: '0',
    pointerEvents: 'none',
    background: [
      'radial-gradient(circle at 50% 42%, rgba(240, 189, 70, 0.16), transparent 46%)',
      `linear-gradient(135deg, ${THEME.navy} 0%, ${THEME.navyMid} 45%, ${THEME.navyLight} 100%)`,
    ].join(', '),
  })

  // "S" monogram — same mark as the site footer.
  const mark = document.createElement('span')
  Object.assign(mark.style, {
    display: 'grid',
    placeItems: 'center',
    width: '64px',
    height: '64px',
    border: `1.5px solid ${THEME.gold}`,
    borderRadius: '9999px',
    color: THEME.gold,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '34px',
    lineHeight: '1',
  })
  mark.textContent = 'S'
  cover.appendChild(mark)

  if (label) {
    const text = document.createElement('span')
    Object.assign(text.style, {
      maxWidth: '80vw',
      textAlign: 'center',
      color: THEME.white,
      fontFamily: 'inherit',
      fontSize: '15px',
      fontWeight: '700',
      letterSpacing: '-0.01em',
    })
    text.textContent = label // textContent, never innerHTML
    cover.appendChild(text)
  }

  return cover
}

async function playBlobTransition(origin, onCovered, { label } = {}) {
  const cover = createCover(label)
  document.body.appendChild(cover)

  const blob = new OrganicBlobPortal({
    nextPageEl: cover,
    container: document.body,
    points: BLOB.points,
    wobbleIntensity: BLOB.wobbleIntensity,
    stiffness: BLOB.stiffness,
    damping: BLOB.damping,
    rimColor: BLOB.rimColor,
  })
  // The library hard-codes a green glow behind the rim; recolor it to gold.
  if (blob.rimPath) blob.rimPath.style.filter = BLOB.rimGlow

  try {
    // Resolves when the blob has fully covered the viewport; onCovered runs then.
    await blob.trigger(origin, onCovered)

    // Give React a couple of frames to paint the new route, then reveal it.
    await nextFrames(2)
    const fade = cover.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: BLOB.fadeOutMs,
      easing: 'ease-out',
      fill: 'forwards',
    })
    await fade.finished
  } finally {
    cover.remove()
    blob.destroy()
  }
}

// A keyboard "click" (Enter on a link) has no pointer position, so start the
// blob from the middle of the element instead.
function getOrigin(event) {
  const el = event.currentTarget
  if (event.detail === 0 && el?.getBoundingClientRect) {
    const rect = el.getBoundingClientRect()
    return { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }
  }
  return { clientX: event.clientX, clientY: event.clientY }
}

export default function useBlobNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (event, to, options = {}) => {
      // Leave "open in new tab", middle-click, etc. to the browser.
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return
      }

      event.preventDefault()
      if (isRunning) return // ignore double clicks mid-transition

      // Reduced motion: no animation, just go.
      if (prefersReducedMotion()) {
        navigate(to)
        return
      }

      isRunning = true
      const origin = getOrigin(event)
      let navigated = false
      const go = () => {
        if (navigated) return
        navigated = true
        navigate(to)
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }

      playBlobTransition(origin, go, options)
        .catch((error) => {
          console.warn('[blob transition] failed, navigating directly:', error)
        })
        .finally(() => {
          go() // safety net: always end up on the destination
          isRunning = false
        })
    },
    [navigate],
  )
}