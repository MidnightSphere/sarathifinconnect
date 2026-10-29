import { Link } from 'react-router-dom'
import LoanCard from './LoanCard.jsx'
import { loanServices } from '../../data/loan-services-data.js'
import './ServicesPage.css'
import Navbar from '../../components/navbar/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'

const trustPoints = [
  { icon: 'lightning', label: 'Quick processing' },
  { icon: 'calendar', label: 'Flexible tenure' },
  { icon: 'shield', label: 'Trusted & secure' },
]

function TrustIcon({ name }) {
  const paths = {
    lightning: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    shield: <path d="m12 22 1.7-.8A11 11 0 0 0 20 11V5l-8-3-8 3v6a11 11 0 0 0 6.3 10.2L12 22Z M9 12l2 2 4-4" />,
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

function ServicesPage() {
  return (
    <div className="services-page">
      <Navbar />
      <main>
      <section className="services-hero" aria-labelledby="services-hero-title">

        <div className="services-hero-grid">
          <div className="services-hero-copy" id="about">
            <span className="services-eyebrow"><span aria-hidden="true" /> Our services</span>
            <h1 id="services-hero-title">
              Financial solutions for every stage of <span>your journey.</span>
            </h1>
            <p>
              From your dream home to business growth, explore tailored loan options and get clear guidance at every step.
            </p>
            <div className="services-hero-actions">
              <Link className="services-button services-button-primary" to="#services">
                Explore loan services <span aria-hidden="true">↘</span>
              </Link>
              <Link className="services-button services-button-secondary" to="#contact">
                Talk to an advisor
              </Link>
            </div>
          </div>

          <div className="services-hero-art">
            <img
              src="/services/servise-hero-image.png"
              alt="A couple exploring their next milestone, with a home, car, and city in the background."
              fetchPriority="high"
            />
          </div>

          <ul className="services-trust-list" aria-label="Our service commitments">
            {trustPoints.map(({ icon, label }) => (
              <li key={icon}>
                <span className="services-trust-icon"><TrustIcon name={icon} /></span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="services-catalog" id="services" aria-labelledby="services-title">
        <header className="services-catalog-heading">
          <span className="services-eyebrow"><span aria-hidden="true" /> All loan services</span>
          <h2 id="services-title">Explore Our <span>{loanServices.length} Loan Services</span></h2>
          <p>Choose from a wide range of loan options designed for your personal and business needs.</p>
        </header>

        <div className="services-card-grid">
          {loanServices.map((service) => (
            <LoanCard
              key={service.id}
              service={service}
              compact
              linkLabel="View loan details"
              to={`/services/${service.id}`}
            />
          ))}
        </div>

        <div className="services-promo" aria-label="Your financial partner">
          <span className="services-promo-orbit" aria-hidden="true" />
          <div>
            <span className="services-promo-kicker">Your financial partner</span>
            <h3>Let’s build a <span>brighter future.</span></h3>
          </div>
          <Link to="#contact" aria-label="Contact Sarathi FinConnect">↗</Link>
        </div>

        <aside className="services-contact-banner" id="contact" aria-labelledby="contact-title">
          <span className="services-contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 3h12l4 4v14H4z" />
              <path d="M16 3v5h4M8 12h8M8 16h8" />
            </svg>
          </span>
          <div className="services-contact-copy">
            <h3 id="contact-title">Need help choosing the right loan?</h3>
            <p>Our experts are here to guide you. Get in touch for a free consultation.</p>
          </div>
          <a className="services-contact-button" href="mailto:hello@sarathifinconnect.com">
            <span aria-hidden="true">↗</span> Contact us
          </a>
        </aside>
      </section>


      </main>
      <Footer />
    </div>
  )
}

export default ServicesPage
