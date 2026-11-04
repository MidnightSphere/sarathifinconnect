import { useId } from "react";
import Reveal from "./Reveal";
import useReveal from "../../../hooks/useAboutReveal";

const steps = [
  "Listen first",
  "Understand your options",
  "Get your documents ready",
  "Connect with banks and financial institutions",
];

function BridgeGraphic() {
  return (
    <Reveal className="mx-auto mt-8 w-full max-w-5xl">
      {(shown) => (
        <svg role="img" aria-label="A bridge from your goals through Sarathi to the right lender" viewBox="0 0 900 160" className="block h-auto w-full overflow-visible">
          <defs>
            <path id="sarathi-bridge-path" d="M80 112 C250 112 290 36 450 36 S650 112 820 112" />
          </defs>
          <path d="M80 112 C250 112 290 36 450 36 S650 112 820 112" fill="none" stroke="#E6E0D2" strokeWidth="3" strokeLinecap="round" />
          <path d="M80 112 C250 112 290 36 450 36 S650 112 820 112" pathLength="1" fill="none" stroke="#C9951C" strokeWidth="3" strokeLinecap="round" className={`[stroke-dasharray:1] transition-[stroke-dashoffset] duration-[1600ms] ease-out motion-reduce:transition-none ${shown ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1]"}`} />
          <circle cx="80" cy="112" r="15" fill="white" stroke="#0F2557" strokeWidth="3" />
          <circle cx="450" cy="36" r="13" fill="#0F2557" stroke="#C9951C" strokeWidth="4" />
          <circle cx="820" cy="112" r="15" fill="#C9951C" stroke="#0F2557" strokeWidth="2" />
          <text x="80" y="150" textAnchor="middle" className="fill-[#0F2557] text-[10px] font-semibold sm:text-xs">Your goals</text>
          <text x="450" y="16" textAnchor="middle" className="fill-[#0F2557] text-[10px] font-bold sm:text-xs">Sarathi</text>
          <text x="820" y="150" textAnchor="middle" className="fill-[#0F2557] text-[10px] font-semibold sm:text-xs">The right lender</text>
          {shown && <circle r="5" fill="#D9A928"><animateMotion dur="8s" repeatCount="indefinite" rotate="auto"><mpath href="#sarathi-bridge-path" /></animateMotion></circle>}
        </svg>
      )}
    </Reveal>
  );
}

function LocationPin() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="mr-1.5 h-3.5 w-3.5"><path d="M16 8.4c0 4.1-6 9.1-6 9.1S4 12.5 4 8.4a6 6 0 1 1 12 0Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export default function WhoWeAre() {
  const headingId = useId();
  const [processRef, processShown] = useReveal();

  return (
    <section
      id="who-we-are"
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#FAF8F3] to-white px-6 py-20 text-[#102653] [font-family:Manrope,ui-sans-serif,system-ui,sans-serif] sm:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D9A928]/[0.06] blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E6E0D2] bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#65718A] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9951C]" aria-hidden="true" />
              02 {"\u00b7"} WHO WE ARE
            </div>
            <h2 id={headingId} className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[#102653] sm:text-5xl lg:text-6xl">
              A bridge between your goals and the <span className="font-serif font-medium italic text-[#A87920]">right lender.</span>
            </h2>
        </Reveal>

        <BridgeGraphic />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Reveal as="article" delay={100} className="group rounded-3xl border border-[#E6E0D2] bg-white p-7 shadow-[0_20px_55px_-38px_rgba(15,37,87,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9951C]/40 hover:shadow-[0_30px_70px_-25px_rgba(15,37,87,0.25)] lg:col-span-7 sm:p-9">
            <p className="max-w-[62ch] text-[17px] leading-[1.75] text-[#5B6478]">Sarathi FinConnect Advisory LLP is a loan and financial advisory firm based in Bhavnagar, Gujarat. We help individuals, families, professionals and business owners explore suitable loan options and move forward with confidence.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Bhavnagar, Gujarat", "Individuals", "Families", "Professionals", "Business owners"].map((tag, index) => (
                <span key={tag} className="inline-flex items-center rounded-full border border-[#E5DCCB] bg-white/80 px-3.5 py-2 text-xs font-medium text-[#344054] shadow-sm shadow-[#172033]/[0.02] transition-colors hover:border-[#C9951C]/50 hover:bg-[#FAF8F3] sm:text-sm">
                  {index === 0 && <LocationPin />}{tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal as="article" delay={200} className="group relative isolate overflow-hidden rounded-3xl border border-[#0F2557]/10 bg-gradient-to-br from-[#0F2557] to-[#0B1F4F] p-7 text-white shadow-[0_22px_55px_-30px_rgba(15,37,87,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9951C]/40 hover:shadow-[0_30px_70px_-25px_rgba(15,37,87,0.4)] lg:col-span-5 sm:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_8%,rgba(217,169,40,0.35),transparent_48%)] opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border border-[#D9A928]/30"><span className="absolute inset-4 rounded-full border border-[#D9A928]/20" /></div>
            <p className="relative mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">We are not a bank.</p>
            <p className="relative mt-2 text-2xl font-semibold text-[#F0C65D] sm:text-3xl">We are your guide.</p>
          </Reveal>

          <Reveal as="article" delay={300} className="rounded-3xl border border-[#E6E0D2] bg-white p-7 shadow-[0_20px_55px_-38px_rgba(15,37,87,0.25)] lg:col-span-12 sm:p-9">
            <p className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#65718A]"><span className="h-px w-8 bg-[#C9951C]" aria-hidden="true" />We listen first.</p>
            <div ref={processRef} className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              <span aria-hidden="true" className={`pointer-events-none absolute left-5 top-5 bottom-5 w-px origin-top bg-[#C9951C] transition-transform duration-1000 ease-out motion-reduce:transition-none lg:hidden ${processShown ? "[transform:scaleY(1)]" : "[transform:scaleY(0)]"}`} />
              <span aria-hidden="true" className={`pointer-events-none absolute left-[12.5%] right-[12.5%] top-5 hidden h-px origin-left bg-[#C9951C] transition-transform duration-1000 ease-out motion-reduce:transition-none lg:block ${processShown ? "[transform:scaleX(1)]" : "[transform:scaleX(0)]"}`} />
              {steps.map((step, index) => (
                <Reveal key={step} delay={index * 100} className="relative z-[1]">
                  <div className="group/step flex min-h-[72px] items-center gap-4 rounded-2xl bg-white px-1 transition-colors duration-300">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#D7BC78] bg-[#FAF8F3] text-sm font-bold tabular-nums text-[#9A6F10] transition-all duration-300 group-hover/step:ring-4 group-hover/step:ring-[#C9951C]/15">{String(index + 1).padStart(2, "0")}</span>
                    <p className="text-[15px] font-medium leading-6 text-[#5B6478] transition-colors group-hover/step:text-[#0F2557]">{step}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal as="blockquote" delay={400} className="rounded-2xl border-l-4 border-[#C9951C] bg-[#F6F0E1]/70 px-8 py-8 lg:col-span-12">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A6F10]">OUR BELIEF</p>
            <p className="font-serif text-2xl italic leading-relaxed text-[#172033] sm:text-3xl">Good financial guidance starts with understanding the person behind the need.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


