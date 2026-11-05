/**
 * LaunchingGate.jsx
 *
 * Hostname-based launch gate for the production domain.
 *
 * Rules:
 *  - Only activates on production hostnames: sarathifinconnect.com / www.sarathifinconnect.com
 *  - On development (.vercel.app or localhost), always passes through.
 *  - The /invitation/ route is NEVER gated — always passes through.
 *  - Controlled by LAUNCH_MODE in LaunchingSoon.jsx:
 *      'auto'        → respect LAUNCH_TIMESTAMP
 *      'coming-soon' → always show gate
 *      'live'        → always pass through
 */

import { LAUNCH_MODE, LAUNCH_TIMESTAMP } from './LaunchingSoon'
import LaunchingSoon from './LaunchingSoon'

// Production hostnames that should be gated.
const PRODUCTION_HOSTS = new Set([
  'sarathifinconnect.com',
  'www.sarathifinconnect.com',
])

function isProductionHost() {
  if (typeof window === 'undefined') return false
  return PRODUCTION_HOSTS.has(window.location.hostname)
}

function isInvitationRoute() {
  if (typeof window === 'undefined') return false
  return window.location.pathname.startsWith('/invitation')
}

function shouldShowGate() {
  // /invitation/ is always exempt.
  if (isInvitationRoute()) return false

  // Non-production hosts always pass through.
  if (!isProductionHost()) return false

  // Evaluate launch mode.
  if (LAUNCH_MODE === 'live')        return false
  if (LAUNCH_MODE === 'coming-soon') return true

  // 'auto' — compare current time to launch timestamp.
  return Date.now() < LAUNCH_TIMESTAMP
}

export default function LaunchingGate({ children }) {
  if (shouldShowGate()) {
    return <LaunchingSoon />
  }
  return children
}
