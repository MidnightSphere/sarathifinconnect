import { useEffect, useId, useRef } from "react";

const NAME = ["S", "a", "r", "a", "t", "h", "i"];
const ROUTE = "M20 160 C160 20 260 30 390 120 S620 215 780 60";

const revealClasses =
  "opacity-0 translate-y-[26px] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(.2,.7,.2,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none";

/** The “Our name tells the story” section from Sarathi FinConnect’s About page. */
export default function SarathiNameStory() {
  const labelId = useId();
  const sectionRef = useRef(null);
  const wordRef = useRef(null);
  const routeRef = useRef(null);
  const youRef = useRef(null);
  const sarathiRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const word = wordRef.current;
    const route = routeRef.current;
    const youMarker = youRef.current;
    const sarathiMarker = sarathiRef.current;

    if (!section || !word || !route || !youMarker || !sarathiMarker) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealTargets = [word, ...section.querySelectorAll("[data-sfc-reveal]")];
    let observer;

    const reveal = (element) => {
      if (element === word) {
        element.querySelectorAll("[data-sfc-letter]").forEach((letter) => {
          letter.classList.remove("translate-y-[112%]");
          letter.classList.add("translate-y-0");
        });
      } else {
        element.classList.remove("opacity-0", "translate-y-[26px]");
        element.classList.add("opacity-100", "translate-y-0");
      }
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(reveal);
    } else {
      observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
              currentObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 },
      );
      revealTargets.forEach((element) => observer.observe(element));
    }

    let pathLength;
    try {
      pathLength = route.getTotalLength();
    } catch {
      return () => observer?.disconnect();
    }

    route.style.strokeDasharray = `${pathLength}`;

    const clamp = (value) => Math.max(0, Math.min(1, value));
    let frameRequested = false;
    let frameId;

    const placeMarker = (marker, distance) => {
      const point = route.getPointAtLength(distance);
      marker.setAttribute("transform", `translate(${point.x} ${point.y})`);
    };

    const updateProgress = () => {
      frameRequested = false;
      const viewportHeight = window.innerHeight;
      const routeTop = section.querySelector("[data-sfc-route]").getBoundingClientRect().top;
      const progress = reduceMotion
        ? 1
        : clamp((viewportHeight * 0.9 - routeTop) / (viewportHeight * 0.55));

      route.style.strokeDashoffset = `${pathLength * (1 - progress)}`;
      placeMarker(sarathiMarker, pathLength * progress);
      placeMarker(youMarker, pathLength * Math.max(0, progress - 0.07));
    };

    const requestUpdate = () => {
      if (!frameRequested) {
        frameRequested = true;
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden px-5 py-[clamp(80px,11vw,140px)] text-center text-white [background:radial-gradient(60%_55%_at_88%_0%,rgba(196,144,15,.32),transparent_62%),radial-gradient(50%_50%_at_0%_100%,rgba(79,107,216,.38),transparent_65%),#0b1f4b] [font-family:Inter,system-ui,-apple-system,Segoe_UI,sans-serif] [font-size:16px] [line-height:1.6] [-webkit-font-smoothing:antialiased]"
      aria-labelledby={labelId}
    >
      <div className="relative z-[1] mx-auto w-full max-w-[1040px]">
        <span
          id={labelId}
          className="text-[11px] font-bold uppercase tracking-[.18em] text-[#e7b94a]"
        >
          Our name tells the story
        </span>

        <div
          ref={wordRef}
          className="mt-[6px] flex justify-center overflow-hidden pb-[.08em] text-[clamp(66px,18vw,210px)] font-extrabold leading-none tracking-[-.06em]"
          role="img"
          aria-label="Sarathi"
        >
          {NAME.map((letter, index) => (
            <span
              data-sfc-letter
              className="inline-block translate-y-[112%] transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(.2,.7,.2,1)] [will-change:transform] motion-reduce:translate-y-0 motion-reduce:transition-none"
              style={{ transitionDelay: `${index * 70}ms` }}
              aria-hidden="true"
              key={`${letter}-${index}`}
            >
              {letter}
            </span>
          ))}
          <span
            data-sfc-letter
            className="inline-block translate-y-[112%] text-[#e7b94a] transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(.2,.7,.2,1)] [will-change:transform] motion-reduce:translate-y-0 motion-reduce:transition-none"
            style={{ transitionDelay: "560ms" }}
            aria-hidden="true"
          >
            .
          </span>
        </div>

        <div
          data-sfc-reveal
          className={`${revealClasses} [font-family:'Noto_Sans_Devanagari',Inter,system-ui,sans-serif] text-[clamp(20px,3vw,30px)] font-bold text-[#e7b94a]`}
        >
          सारथी
        </div>

        <svg
          data-sfc-route
          className="mx-auto mt-7 block h-auto w-full max-w-[820px] overflow-visible"
          viewBox="0 0 800 230"
          role="img"
          aria-label="A path showing Sarathi walking beside you toward your goal"
        >
          <path
            d={ROUTE}
            fill="none"
            stroke="rgba(255,255,255,.18)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            ref={routeRef}
            d={ROUTE}
            fill="none"
            stroke="#e7b94a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle
            cx="780"
            cy="60"
            r="8"
            fill="none"
            stroke="#e7b94a"
            strokeWidth="3"
          />
          <text
            x="790"
            y="36"
            textAnchor="end"
            className="fill-white text-[11px] font-bold uppercase tracking-[.14em] [font-family:Inter,system-ui,sans-serif]"
          >
            Your goal
          </text>
          <g ref={youRef}>
            <circle r="11" fill="#0b1f4b" stroke="white" strokeWidth="3" />
            <text
              y="-20"
              textAnchor="middle"
              className="fill-white text-[11px] font-bold uppercase tracking-[.14em] [font-family:Inter,system-ui,sans-serif]"
            >
              You
            </text>
          </g>
          <g ref={sarathiRef}>
            <circle r="11" fill="#e7b94a" />
            <circle r="4" fill="#0b1f4b" />
            <text
              y="34"
              textAnchor="middle"
              className="fill-white text-[11px] font-bold uppercase tracking-[.14em] [font-family:Inter,system-ui,sans-serif]"
            >
              Sarathi
            </text>
          </g>
        </svg>

        <p
          data-sfc-reveal
          className={`${revealClasses} mx-auto mt-[34px] max-w-[560px] text-[clamp(17px,2.2vw,21px)] text-[#b9c4de]`}
        >
          <b className="text-white">Sarathi</b> means a guide who walks beside you
          and shows the way. That is what we try to be for every client.
        </p>

        <div
          data-sfc-reveal
          className={`${revealClasses} mt-[46px] flex flex-wrap items-center justify-center gap-x-[22px] gap-y-[6px] text-[clamp(26px,5vw,52px)] font-extrabold tracking-[-.045em]`}
          aria-label="Our values: Clear, Honest, Friendly"
        >
          <span>Clear</span>
          <i className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#c4900f]" aria-hidden="true" />
          <span>Honest</span>
          <i className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#c4900f]" aria-hidden="true" />
          <span>Friendly</span>
        </div>

        <p
          data-sfc-reveal
          className={`${revealClasses} mt-[14px] text-[13px] text-[#b9c4de]`}
        >
          No hidden surprises. Ever.
        </p>
      </div>
    </section>
  );
}
