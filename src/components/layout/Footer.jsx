import { Link, useLocation, useNavigate } from "react-router-dom";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import Wordmark from "./Wordmark";
import { contactInfo } from "../../data/contact";

const { address, email, phone } = contactInfo;
const phoneHref = `tel:${phone.replace(/\s/g, "")}`;

function InstagramIcon({ size = 17 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

const linkClass =
  "text-sm text-text-secondary transition-colors duration-200 hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold";

function LinkGroup({ title, children }) {
  return (
    <nav aria-label={`${title} links`}>
      <h2 className="m-0 mb-4 text-sm font-bold text-brand-navy">{title}</h2>
      <ul className="m-0 grid list-none gap-3 p-0">{children}</ul>
    </nav>
  );
}

function ContactItem({ icon: Icon, children, href }) {
  const content = (
    <>
      <Icon
        size={16}
        strokeWidth={1.8}
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-brand-gold"
      />
      <span className="min-w-0 break-words">{children}</span>
    </>
  );

  return href ? (
    <a href={href} className="flex min-w-0 items-start gap-2.5 text-sm leading-6 text-text-secondary transition-colors hover:text-brand-navy">
      {content}
    </a>
  ) : (
    <div className="flex min-w-0 items-start gap-2.5 text-sm leading-6 text-text-secondary">
      {content}
    </div>
  );
}

function SectionLink({ hash, children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const href = pathname === "/" ? hash : `/${hash}`;

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        navigate({ pathname: "/", hash });
      }}
      className="text-sm text-text-secondary transition-colors duration-200 hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="w-full px-3 pb-0 sm:px-4 lg:px-6">
      <div className="mx-auto mt-12 w-full max-w-[96rem] overflow-hidden rounded-[2rem] bg-surface-soft/65 px-3 pt-3 pb-0 shadow-[0_12px_36px_rgba(11,31,77,0.045)] sm:rounded-[2.5rem] sm:px-4 sm:pt-4 md:rounded-[3rem] md:px-6 md:pt-6">
        <div className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_8px_28px_rgba(11,31,77,0.035)] sm:p-8 md:rounded-[2rem] md:p-10 lg:p-12">
          <div className="grid min-w-0 gap-10 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)_minmax(0,1.35fr)_minmax(15rem,2.5fr)] lg:gap-8 xl:gap-10">
            <div className="max-w-md">
              <Link
                to="/"
                aria-label="sa₹athi finconnect home"
                className="inline-flex items-center gap-3 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-brand-gold"
              >
                <img
                  src="/logo/sarathi-finconnect-only-logo.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-auto shrink-0 object-contain md:h-9"
                />
                <span className="font-bricolage text-[1.05rem] font-[750] leading-none tracking-wide text-brand-navy sm:text-xl md:text-[1.35rem]">
                  sa<span className="text-[0.78em]">&#8377;</span>athi finconnect
                </span>
              </Link>

              <p className="mb-0 mt-5 max-w-sm text-sm leading-relaxed text-text-secondary">
                Sarathi FinConnect is a loan consultancy and financial advisory
                firm in Bhavnagar, helping individuals and businesses explore
                suitable financing options and prepare applications.
              </p>
              <div className="mt-5 grid justify-items-start gap-2">
                <a
                  href="https://www.instagram.com/sarathi_finconnect/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="@sarathi_finconnect (opens in a new tab)"
                  className="inline-flex min-h-10 max-w-full items-center gap-2.5 rounded-full border border-brand-navy/10 bg-white px-3 text-sm text-brand-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-gold/50 hover:bg-brand-gold/10 hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                >
                  <InstagramIcon />
                  <span>@sarathi_finconnect</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  aria-label={email}
                  className="inline-flex min-h-10 max-w-full items-center gap-2.5 rounded-full border border-brand-navy/10 bg-white px-3 text-sm text-brand-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-gold/50 hover:bg-brand-gold/10 hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                >
                  <Mail size={17} strokeWidth={1.8} aria-hidden="true" />
                  <span className="break-all">{email}</span>
                </a>
              </div>
            </div>

            <LinkGroup title="Company">
              <li><Link to="/about" className={linkClass}>About</Link></li>
              <li><SectionLink hash="#services">Services</SectionLink></li>
              <li><SectionLink hash="#contact">Contact</SectionLink></li>
            </LinkGroup>

            <div className="min-w-0">
              <LinkGroup title="Explore">
                <li><Link to="/" className={linkClass}>Home Page</Link></li>
                <li><Link to="/services" className={linkClass}>All Services</Link></li>
                <li><Link to="/support" className={linkClass}>Support</Link></li>
                <li><Link to="/emi-calculator" className={linkClass}>EMI Calculator</Link></li>
              </LinkGroup>
            </div>

            <div className="min-w-0">
              <h2 className="m-0 mb-4 text-sm font-bold text-brand-navy">Contact Details</h2>
              <div className="grid gap-3">
                <ContactItem icon={MapPin}>{address}</ContactItem>
                <ContactItem icon={Clock3}>9:30 AM – 7:00 PM</ContactItem>
                <ContactItem icon={Phone} href={phoneHref}>{phone}</ContactItem>
                <ContactItem icon={Mail} href={`mailto:${email}`}>{email}</ContactItem>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 md:mt-12 md:pt-7">
            <div className="flex flex-col gap-5 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
              <p className="m-0">© 2026 Sarathi FinConnect. All rights reserved.</p>
              <p className="m-0">
                Designed &amp; Developed by{" "}
                <a
                  href="https://midnight-profile.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-text-secondary/50 underline-offset-4 transition-colors hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold"
                >
                  Midnight Sphere
                </a>
              </p>
            </div>
          </div>
        </div>

        <Wordmark />
      </div>
    </footer>
  );
}
