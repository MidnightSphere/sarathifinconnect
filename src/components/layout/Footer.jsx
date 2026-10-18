import { Link, useLocation, useNavigate } from "react-router-dom";

const serviceLinks = ["Personal Loan", "Business Finance", "Home Finance"];

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

function LinkGroup({ title, children }) {
  return (
    <nav aria-label={`${title} links`}>
      <h2 className="m-0 mb-4 text-sm font-bold text-brand-navy">{title}</h2>
      <ul className="m-0 grid list-none gap-3 p-0">
        {children}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="w-full px-3 pb-4 sm:px-4 sm:pb-6 lg:px-6">
      <div className="mx-auto mt-12 w-full max-w-[96rem] overflow-hidden rounded-[2rem] bg-surface-soft/65 px-3 pt-3 pb-1 shadow-[0_12px_36px_rgba(11,31,77,0.045)] sm:rounded-[2.5rem] sm:px-4 sm:pt-4 md:rounded-[3rem] md:px-6 md:pt-6">
        <div className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_8px_28px_rgba(11,31,77,0.035)] sm:p-8 md:rounded-[2rem] md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-12">
            <div className="max-w-md">
              <Link
                to="/"
                aria-label="Sarathi FinConnect home"
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
                Sarathi FinConnect helps individuals and businesses find suitable
                loan and finance options with clear guidance and trusted support.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-8">
              <LinkGroup title="Company">
                <li><SectionLink hash="#about-us">About</SectionLink></li>
                <li><SectionLink hash="#services">Services</SectionLink></li>
                <li><SectionLink hash="#contact">Contact</SectionLink></li>
              </LinkGroup>

              <LinkGroup title="Services">
                {serviceLinks.map((service) => (
                  <li key={service}>
                    <Link
                      to="/services"
                      className="text-sm text-text-secondary transition-colors duration-200 hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold"
                    >
                      {service}
                    </Link>
                  </li>
                ))}
              </LinkGroup>

              <LinkGroup title="Explore">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-text-secondary transition-colors duration-200 hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold"
                  >
                    Home page
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-sm text-text-secondary transition-colors duration-200 hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold"
                  >
                    All services
                  </Link>
                </li>
              </LinkGroup>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 md:mt-12 md:pt-7">
            <div className="flex flex-col gap-5 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
              <p className="m-0">
                © {new Date().getFullYear()} Sarathi FinConnect. All rights
                reserved.
              </p>
              <p className="m-0">
                Designed &amp; developed by{" "}
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

        <div
          aria-hidden="true"
          className="pointer-events-none select-none overflow-hidden px-1 pt-5 pb-1 text-center sm:px-3 sm:pt-7 md:pt-8"
        >
          <span
            className="block whitespace-nowrap font-bricolage font-black leading-[0.82] tracking-[0.05em]"
            style={{
              fontSize: "clamp(1.7rem, 9.3vw, 8.5rem)",
              backgroundImage:
                "linear-gradient(to bottom, color-mix(in srgb, var(--color-brand-navy) 3%, transparent), color-mix(in srgb, var(--color-brand-navy) 13%, transparent))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            sa<span className="text-[0.78em]">&#8377;</span>athi finconnect
          </span>
          </div>
      </div>
    </footer>
  );
}
