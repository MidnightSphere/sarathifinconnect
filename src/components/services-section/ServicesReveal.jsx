import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ScrollStack, { ScrollStackItem } from "./ServicesScrollStack.jsx";
import { loanServices } from "../../data/loan-services-data.js";
import useBlobNavigate from "../transitions/useBlobNavigate";

const SERVICE_CARD_COLORS = [
  {
    background: "#ffffff",
    color: "var(--navy)",
    tone: "light",
    dotColor: "var(--gold)",
  },
  {
    background: "var(--gold)",
    color: "var(--navy)",
    tone: "gold",
    dotColor: "#ffffff",
  },
  {
    background: "color-mix(in srgb, var(--navy) 9%, white)",
    color: "var(--navy)",
    tone: "light",
    dotColor: "var(--gold)",
  },
  {
    background: "#18356f",
    color: "#ffffff",
    border: "1px solid rgba(198, 146, 20, 0.36)",
    tone: "dark",
    dotColor: "var(--gold)",
  },
];

const SERVICE_BUTTON_STYLES = {
  navy: {
    background: "var(--navy)",
    color: "#ffffff",
    hoverBackground: "var(--navy-deep)",
    focusOutline: "var(--gold)",
    shadow: "0 5px 16px rgba(16, 34, 77, 0.14)",
    hoverShadow: "0 8px 20px rgba(16, 34, 77, 0.2)",
  },
  navyOnGold: {
    background: "var(--navy)",
    color: "#ffffff",
    hoverBackground: "var(--navy-deep)",
    focusOutline: "var(--navy)",
    shadow: "0 5px 16px rgba(16, 34, 77, 0.14)",
    hoverShadow: "0 8px 20px rgba(16, 34, 77, 0.2)",
  },
  gold: {
    background: "var(--gold)",
    color: "var(--navy)",
    hoverBackground: "#d6ad52",
    focusOutline: "#ffffff",
    shadow: "0 5px 16px rgba(198, 146, 20, 0.24)",
    hoverShadow: "0 8px 20px rgba(198, 146, 20, 0.3)",
  },
};

const imageByService = {
  "home-loan": {
    src: "/loan-pages-photos/01-home-loan.png",
    alt: "Home loan property",
    imagePosition: "center 40%",
  },
  "car-loan": {
    src: "/loan-pages-photos/02-car-loan.png",
    alt: "Car loan vehicle",
    imagePosition: "center 60%",
  },
  "personal-loan": {
    src: "/loan-pages-photos/04-personal-loan.png",
    alt: "Personal loan",
    imagePosition: "center 60%",
  },
  "business-loan": {
    src: "/loan-pages-photos/03-business-loan.png",
    alt: "Business loan",
    imagePosition: "center",
  },
};

const serviceOrder = [
  "home-loan",
  "car-loan",
  "personal-loan",
  "business-loan",
];

const serviceCards = serviceOrder.map((id, index) => {
  const service = loanServices.find((item) => item.id === id);
  return {
    id: service.id,
    number: String(index + 1).padStart(2, "0"),
    tag: service.category,
    title: service.name,
    description: service.intro,
    stats: [
      { label: "Indicative rate", value: service.rate.replaceAll("â€“", "–") },
      {
        label: "Indicative tenure",
        value: service.tenure.replaceAll("â€“", "–"),
      },
    ],
    image: imageByService[id],
    href: `/services/${service.id}`,
    ...SERVICE_CARD_COLORS[index],
    imageFirst: index % 2 === 0,
  };
});

function ArrowIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M4.2 10h11.6m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WalletPlaceholder() {
  return (
    <div
      className="flex aspect-[4/3] max-h-[24rem] w-full self-start items-center justify-center rounded-2xl bg-gradient-to-br from-[#10224d] via-[#18356f] to-[#294780] text-white sm:aspect-[16/10] sm:max-w-[38.4rem] sm:justify-self-center lg:aspect-auto lg:h-full lg:max-h-none lg:max-w-none lg:min-h-[22rem] lg:self-stretch lg:justify-self-stretch"
      aria-label="Personal loan image placeholder"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="size-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <rect x="9" y="17" width="46" height="34" rx="7" />
        <path d="M9 25h46M43 37h12" />
        <circle cx="43" cy="37" r="2" fill="currentColor" />
        <path d="M16 17v-4a4 4 0 0 1 4-4h27" />
      </svg>
    </div>
  );
}

function ServiceCard({ card }) {
  const blobNavigate = useBlobNavigate();
  const isDark = card.tone === "dark";
  const buttonStyle = isDark
    ? SERVICE_BUTTON_STYLES.gold
    : card.tone === "gold"
      ? SERVICE_BUTTON_STYLES.navyOnGold
      : SERVICE_BUTTON_STYLES.navy;
  const content = (
    <div
      className={`order-2 flex min-w-0 flex-col justify-center lg:order-1 ${card.imageFirst ? "lg:order-2" : ""}`}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className={`text-xs font-semibold ${isDark ? "text-white/60" : "text-[#10224d]/55"}`}
        >
          {card.number}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${isDark ? "border-white/20 bg-white/10 text-white/90" : "border-[#10224d]/15 bg-white/35 text-[#10224d]/85"}`}
        >
          {card.tag}
        </span>
      </div>

      <h3 className="mb-3 text-3xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
        {card.title}
        <span style={{ color: card.dotColor }}>.</span>
      </h3>
      <p
        className={`mb-6 line-clamp-2 max-w-md text-base leading-relaxed opacity-80 lg:text-lg ${isDark ? "text-white" : "text-[#10224d]"}`}
      >
        {card.description}
      </p>

      <div
        className={`mb-6 flex max-w-md items-stretch ${isDark ? "text-white" : "text-[#10224d]"}`}
      >
        {card.stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`min-w-0 flex-1 ${index > 0 ? `border-l pl-4 sm:pl-6 ${isDark ? "border-white/20" : "border-[#10224d]/20"} ml-4 sm:ml-6` : ""}`}
          >
            <strong className="block text-xl font-bold leading-tight sm:text-2xl">
              {stat.value}
            </strong>
            <span
              className={`mt-1 block text-xs font-medium normal-case ${isDark ? "text-white/70" : "text-[#10224d]/65"}`}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <Link
        to={card.href}
        onClick={(event) => blobNavigate(event, card.href, { label: card.title })}
        style={{
          "--cta-background": buttonStyle.background,
          "--cta-hover-background": buttonStyle.hoverBackground,
          color: buttonStyle.color,
          "--cta-shadow": buttonStyle.shadow,
          "--cta-hover-shadow": buttonStyle.hoverShadow,
          "--cta-focus-outline": buttonStyle.focusOutline,
        }}
        className="group mt-0 inline-flex min-h-11 w-fit items-center gap-3 rounded-full bg-[var(--cta-background)] px-6 py-2 text-sm font-bold no-underline shadow-[var(--cta-shadow)] transition-all duration-200 hover:bg-[var(--cta-hover-background)] hover:shadow-[var(--cta-hover-shadow)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--cta-focus-outline)] active:scale-[0.98]"
      >
        Explore {card.title}
        <ArrowIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );

  const image = card.image ? (
    <div
      className={`relative order-1 aspect-[4/3] w-full overflow-hidden rounded-2xl ${card.imageFirst ? "lg:order-1" : "lg:order-2"}`}
    >
      <img
        src={card.image.src}
        alt={card.image.alt}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: card.image.imagePosition || "center" }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  ) : (
    <WalletPlaceholder />
  );

  return (
    <ScrollStackItem
      itemClassName={`h-auto rounded-[28px] p-4 sm:p-6 lg:p-8 ${card.tone === "gold" ? "service-card--gold" : ""}`}
      style={{
        background: card.background,
        color: card.color,
        border: card.border,
      }}
    >
      <div
        className={`grid grid-cols-1 items-start gap-4 sm:gap-5 lg:items-center lg:gap-12 ${card.imageFirst ? "lg:grid-cols-[0.85fr_1fr]" : "lg:grid-cols-[1fr_0.85fr]"}`}
      >
        {card.imageFirst ? (
          <>
            {image}
            {content}
          </>
        ) : (
          <>
            {content}
            {image}
          </>
        )}
      </div>
    </ScrollStackItem>
  );
}

function ServicesReveal() {
  const revealRef = useRef(null);
  const stickyRef = useRef(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { hash } = useLocation();
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 639px)").matches,
  );
  const [maxRevealRadius, setMaxRevealRadius] = useState(0);
  const supportsMask =
    typeof CSS !== "undefined" &&
    (CSS.supports(
      "mask-image",
      "radial-gradient(circle, transparent, #000)",
    ) ||
      CSS.supports(
        "-webkit-mask-image",
        "radial-gradient(circle, transparent, #000)",
      ));
  const { scrollYProgress } = useScroll({
    target: revealRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });
  const revealRadius = useTransform(
    progress,
    [0, 0.55],
    ["0px", `${maxRevealRadius}px`],
  );
  const maskOpacity = useTransform(progress, [0.55, 0.58], [1, 0]);
  const fallbackOpacity = useTransform(progress, [0, 0.55], [1, 0]);
  const eyebrowOpacity = useTransform(progress, [0.55, 0.64], [0, 1]);
  const eyebrowY = useTransform(progress, [0.55, 0.64], [16, 0]);
  const headingOpacity = useTransform(progress, [0.58, 0.7], [0, 1]);
  const headingY = useTransform(progress, [0.58, 0.7], [24, 0]);
  const subtextOpacity = useTransform(progress, [0.64, 0.78], [0, 1]);
  const subtextY = useTransform(progress, [0.64, 0.78], [16, 0]);
  const buttonOpacity = useTransform(progress, [0.72, 0.86], [0, 1]);
  const buttonY = useTransform(progress, [0.72, 0.86], [16, 0]);

  useLayoutEffect(() => {
    if (hash === "#services") progress.jump(1);
  }, [hash, progress]);

  useLayoutEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    const updateRadius = () => {
      const { width, height } = sticky.getBoundingClientRect();
      const diagonal = Math.hypot(width, height);
      setMaxRevealRadius(diagonal * 0.6);
    };

    const observer = new ResizeObserver(updateRadius);
    observer.observe(sticky);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section
      className="relative isolate m-0 mb-20 rounded-b-[1.75rem] bg-brand-navy px-4 pb-16 text-white md:rounded-b-[2.5rem] md:pb-24"
      id="services"
      style={{
        "--navy": "#10224d",
        "--navy-deep": "#0b1f4d",
        "--gold": "#c69214",
      }}
      aria-labelledby="services-heading"
    >
      <div
        ref={revealRef}
        className={
          reducedMotion
            ? "relative h-screen supports-[height:100lvh]:h-[100lvh]"
            : "relative h-[165vh] md:h-[205vh] supports-[height:100lvh]:h-[165lvh] md:supports-[height:100lvh]:h-[205lvh]"
        }
      >
        {!reducedMotion && (
          <div
            ref={stickyRef}
            className="sticky top-0 -mx-4 h-screen supports-[height:100lvh]:h-[100lvh] w-[calc(100%+2rem)] overflow-hidden"
          >
            <motion.div
              className="pointer-events-none absolute inset-0 z-0 h-full bg-white"
              style={{
                "--reveal-radius": revealRadius,
                maskImage:
                  "radial-gradient(circle at 50% 50%, transparent var(--reveal-radius), #000 calc(var(--reveal-radius) + 1px))",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 50%, transparent var(--reveal-radius), #000 calc(var(--reveal-radius) + 1px))",
                opacity: supportsMask ? maskOpacity : fallbackOpacity,
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pt-24 pb-[24svh] md:pb-[28svh] text-center">
              <motion.span
                className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d6ad52]"
                style={{ opacity: eyebrowOpacity, y: eyebrowY }}
              >
                Our Loans
              </motion.span>
              <motion.h2
                id="services-heading"
                className="m-0 mt-4 max-w-[840px] text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.035em]"
                style={{ opacity: headingOpacity, y: headingY }}
              >
                Loans built around your goals.
              </motion.h2>
              <motion.p
                className="mb-0 mt-4 max-w-[650px] text-sm leading-7 text-white/80 sm:text-base"
                style={{ opacity: subtextOpacity, y: subtextY }}
              >
                Explore loan options for your personal, business and property
                needs, with clear guidance from application to approval.
              </motion.p>
              <motion.div
                className="mt-5"
                style={{ opacity: buttonOpacity, y: buttonY }}
              >
                <Link
                  to="/services"
                  className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-[#c69214] px-6 py-2 text-sm font-bold text-white no-underline transition-colors hover:bg-[#c69214] hover:text-[#10224d] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#c69214]"
                >
                  Explore more services
                  <ArrowIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        )}
        {reducedMotion && (
          <div className="sticky top-0 flex h-screen supports-[height:100lvh]:h-[100lvh] flex-col items-center justify-center px-4 pt-24 pb-[24svh] md:pb-[28svh] text-center">
            <ServicesRevealCopy />
          </div>
        )}
        {!reducedMotion && (
          <div
            id="services-content"
            className="pointer-events-none absolute top-[calc(90%_-_90svh_+_96px)] h-0 w-0"
            aria-hidden="true"
          />
        )}
      </div>

      <div
        id="services-cards"
        className="relative z-20 w-full pt-8 md:pt-12"
      >
        <ScrollStack
          useWindowScroll
          smoothScroll={false}
          stackPosition={isMobile ? "100px" : "110px"}
          itemStackDistance={isMobile ? 14 : 18}
          itemDistance={105}
          itemScale={0.04}
          baseScale={0.88}
          dimAmount={0.12}
          holdDistance={180}
          className="relative left-1/2 mx-auto !w-[94vw] max-w-[90rem] -translate-x-1/2 overflow-x-clip"
          innerClassName="px-[clamp(0.25rem,1vw,1rem)]"
        >
          {serviceCards.map((card) => (
            <ServiceCard key={card.id} card={card} />
          ))}
        </ScrollStack>
        <p className="mx-auto mb-0 mt-8 w-[94%] max-w-3xl px-2 text-center text-xs leading-relaxed text-white/70 md:mt-12 sm:text-sm">
          * Indicative references from the supplied loan guide only. Rates,
          tenure, charges, and eligibility vary by lender and applicant; confirm
          current terms directly with a lender.
        </p>
      </div>
    </section>
  );
}

function ServicesRevealCopy() {
  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d6ad52]">
        Our Loans
      </span>
      <h2
        id="services-heading"
        className="m-0 max-w-[840px] text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.035em]"
      >
        Loans built around your goals.
      </h2>
      <p className="m-0 max-w-[650px] text-sm leading-7 text-white/80 sm:text-base">
        Explore loan options for your personal, business and property needs,
        with clear guidance from application to approval.
      </p>
      <Link
        to="/services"
        className="group mt-1 inline-flex min-h-11 items-center gap-3 rounded-full border border-[#c69214] px-6 py-2 text-sm font-bold text-white no-underline transition-colors hover:bg-[#c69214] hover:text-[#10224d] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#c69214]"
      >
        Explore more services
        <ArrowIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export default ServicesReveal;
