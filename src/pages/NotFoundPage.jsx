import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Wordmark from "../components/layout/Wordmark";
import RupeeMark from "../components/not-found/RupeeMark";

const helpfulLinks = [
  { label: "Services", to: "/services" },
  { label: "About us", to: "/#about-us" },
  { label: "Contact", to: "/#contact" },
];

export default function NotFoundPage() {
  const playAreaRef = useRef(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "404: Not Found | Sarathi FinConnect";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.append(robots);
    }
    const previousRobots = robots.content;
    robots.content = "noindex, nofollow";
    return () => {
      document.title = previousTitle;
      if (previousRobots) robots.content = previousRobots;
      else robots.remove();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-surface text-brand-navy">
      <Navbar />
      <main ref={playAreaRef} className="relative flex flex-1 flex-col items-center px-4 pb-10 pt-28 text-center">
        <RupeeMark playAreaRef={playAreaRef} />
        <p className="mb-0 mt-3 max-w-xl font-space text-xs leading-relaxed text-text-secondary/80">
          Drag the dots to reshape, drag the mark to move it, drag the box handles to resize.
        </p>
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center">
          <h1 className="m-0 font-bricolage text-[clamp(4.5rem,14vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.075em] text-brand-navy">
            <span className="sr-only">404: Not Found</span>
            <span aria-hidden="true">404</span>
          </h1>
          <p aria-hidden="true" className="mb-0 mt-4 font-bricolage text-[clamp(1.5rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight text-brand-navy">
            Not Found
          </p>
          <p className="mb-0 mt-4 max-w-xl font-space text-base leading-relaxed text-text-secondary sm:text-lg">
            This page does not exist. Please check the URL and try again.
          </p>
          <Link to="/" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-navy px-6 font-space text-[0.9375rem] font-semibold text-white no-underline transition-colors hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
            Go back home
          </Link>
          <nav aria-label="Helpful pages" className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-space text-sm text-text-secondary sm:gap-x-7">
            {helpfulLinks.map((link) => <Link key={link.label} to={link.to} className="rounded-sm text-inherit underline decoration-brand-navy/20 underline-offset-4 transition-colors hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-gold">{link.label}</Link>)}
          </nav>
        </div>
      </main>
      <div className="mt-auto w-full" aria-hidden="true"><Wordmark /></div>
    </div>
  );
}
