import LaunchingSoon from './LaunchingSoon'

const PRODUCTION_HOSTS = new Set([
  'sarathifinconnect.com',
  'www.sarathifinconnect.com',
])

export default function LaunchingGate({ children }) {
  if (typeof window !== 'undefined' && PRODUCTION_HOSTS.has(window.location.hostname)) {
    return <LaunchingSoon />
  }

  return children
}
