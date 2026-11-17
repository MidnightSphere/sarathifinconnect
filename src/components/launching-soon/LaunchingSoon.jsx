import './LaunchingSoon.css'

/** Temporary production-facing page. The live site stays gated until manually changed. */
export default function LaunchingSoon() {
  return (
    <main className="sfc-ls-root">
      <div className="sfc-bg-texture" aria-hidden="true" />
      <div className="sfc-top-line" aria-hidden="true" />

      <div className="sfc-ls-content">
        <div className="sfc-logo-wrap">
          <img
            src="/logo/sarathi-finconnect-only-logo.svg"
            alt="Sarathi FinConnect"
            className="sfc-logo"
            width="68"
            height="82"
          />
        </div>

        <p className="sfc-eyebrow">A NEW FINANCIAL JOURNEY BEGINS</p>
        <div className="sfc-divider" aria-hidden="true">
          <span className="sfc-divider-line" />
          <span className="sfc-divider-diamond">◆</span>
          <span className="sfc-divider-line" />
        </div>

        <h1 className="sfc-heading">Launching Soon</h1>
        <p className="sfc-subheading">
          We&rsquo;re preparing something meaningful.
          <br className="sfc-break" />
          A new chapter in your financial journey is about to begin.
        </p>
      </div>

      <footer className="sfc-footer">
        <div className="sfc-footer-line" aria-hidden="true" />
        <p className="sfc-footer-text">Sarathi FinConnect Advisory LLP</p>
      </footer>

      <div className="sfc-bottom-line" aria-hidden="true" />
    </main>
  )
}
