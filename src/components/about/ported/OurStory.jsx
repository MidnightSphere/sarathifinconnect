import { useId } from "react";
import Reveal from "./Reveal";

const questions = [
  "Which loan is right for me?",
  "Which documents do I need?",
  "Who should I speak to?",
  "Where do I even start?",
];

export default function OurStory() {
  const headingId = useId();

  return (
    <section
      id="our-story"
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden bg-[#FAF8F3] px-6 py-20 text-[#102653] [font-family:Manrope,ui-sans-serif,system-ui,sans-serif] sm:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/90 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-36 top-12 h-80 w-80 rounded-full bg-[#D9A928]/[0.08] blur-3xl animate-[pulse_9s_ease-in-out_infinite] motion-reduce:animate-none" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 right-[-5rem] h-96 w-96 rounded-full bg-[#7892D8]/[0.07] blur-3xl animate-[pulse_13s_ease-in-out_infinite] motion-reduce:animate-none" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
          <Reveal>
            {(shown) => <>
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#65718A]">
              <span className={`h-px bg-[#C9951C] transition-[width] duration-700 ${shown ? "w-8" : "w-0"}`} aria-hidden="true" />
              01 {"\u00b7"} OUR STORY
            </p>
            <h2 id={headingId} className="text-4xl font-extrabold leading-[1.05] tracking-tight text-[#102653] sm:text-5xl lg:text-6xl">
              <span className="block overflow-hidden pb-[0.08em]"><span className={`inline-block transition-transform duration-700 ease-out delay-100 motion-reduce:transition-none ${shown ? "translate-y-0" : "translate-y-full"}`}>Behind every loan,</span></span>
              <span className="block overflow-hidden pb-[0.08em]"><span className={`inline-block font-serif font-medium italic text-[#A87920] transition-transform duration-700 ease-out delay-200 motion-reduce:transition-none ${shown ? "translate-y-0" : "translate-y-full"}`}>there is a bigger goal.</span></span>
            </h2>
            </>}
          </Reveal>
        </div>

        <div className="space-y-8 lg:col-span-7">
          <Reveal delay={100}>
            {(shown) => <p className="max-w-[62ch] text-xl leading-[1.75] text-[#344054]">
              A loan is never just papers and numbers. It may be a <span className={`bg-gradient-to-t from-[#E3B23C]/40 to-transparent bg-bottom bg-no-repeat transition-[background-size] duration-700 ${shown ? "[background-size:100%_0.5em]" : "[background-size:0%_0.5em]"}`}>family buying their first home</span>, <span className={`bg-gradient-to-t from-[#E3B23C]/40 to-transparent bg-bottom bg-no-repeat transition-[background-size] duration-700 delay-100 ${shown ? "[background-size:100%_0.5em]" : "[background-size:0%_0.5em]"}`}>a shop owner who wants to grow</span>, or <span className={`bg-gradient-to-t from-[#E3B23C]/40 to-transparent bg-bottom bg-no-repeat transition-[background-size] duration-700 delay-200 ${shown ? "[background-size:100%_0.5em]" : "[background-size:0%_0.5em]"}`}>a young professional planning a big step in life</span>.
            </p>}
          </Reveal>

          <div>
            <Reveal delay={200}>
              <p className="mb-4 text-[17px] leading-[1.75] text-[#5B6478]">But for many people, the loan process feels confusing.</p>
            </Reveal>
            <ul className="space-y-3" aria-label="Questions people may have about loans">
              {questions.map((question, index) => (
                <li key={question}>
                  <Reveal delay={index * 100} className={`max-w-max rounded-2xl border border-[#E6E0D2] bg-white px-4 py-3 text-[#0F2557] shadow-[0_12px_30px_-24px_rgba(15,37,87,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9951C]/40 hover:shadow-[0_30px_70px_-25px_rgba(15,37,87,0.25)] ${index === 1 ? "sm:ml-10" : index === 2 ? "ml-4 sm:ml-14" : index === 3 ? "ml-2 sm:ml-6" : ""}`}>
                    <span className="flex items-center gap-3 font-medium"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F6F0E1] font-bold text-[#9A6F10]" aria-hidden="true">?</span>{question}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <Reveal delay={300} className="pt-3 duration-1000">
            <p className="max-w-[62ch] text-[17px] leading-[1.75] text-[#5B6478]">
              <strong className="font-semibold text-[#0F2557]">We saw these worries again and again.</strong> That is why Sarathi FinConnect began. We wanted to offer a <strong className="font-semibold text-[#9A6F10]">clear, honest and friendly</strong> way to explore finance, with no heavy banking words and no hidden surprises.
            </p>
          </Reveal>

          <Reveal delay={400}>
            {(shown) => <div className="group relative overflow-hidden rounded-3xl border-l-4 border-[#C9951C] bg-gradient-to-br from-[#0F2557] to-[#0B1F4F] p-6 text-white shadow-[0_24px_60px_-38px_rgba(15,37,87,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-25px_rgba(15,37,87,0.35)] sm:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-5 h-28 w-28 opacity-20 motion-reduce:animate-none">
                <span className="absolute inset-0 rounded-full border border-[#D9A928]" />
                <span className="absolute inset-3 rounded-full border border-[#D9A928] animate-[spin_60s_linear_infinite] motion-reduce:animate-none" />
                <span className="absolute inset-7 rounded-full border border-[#D9A928]/70" />
              </div>
              <p className="relative max-w-[58ch] text-base leading-7 text-white/85 sm:text-[17px]">
                Our name tells the story. <strong className="font-semibold text-[#F0C65D]">Sarathi</strong> <span className="font-semibold text-[#F0C65D]">{"\u0938\u093e\u0930\u0925\u0940"}</span> means a guide who walks beside you and shows the way. That is what we try to be for every client.
              </p>
              <svg aria-hidden="true" viewBox="0 0 240 24" className="mt-4 h-6 w-60 max-w-full overflow-visible">
              <path d="M2 16 C62 4 116 22 176 10 S218 8 232 5" pathLength="1" fill="none" stroke="#D9A928" strokeWidth="2" strokeLinecap="round" className={`[stroke-dasharray:1] transition-[stroke-dashoffset] duration-[1600ms] ease-out motion-reduce:transition-none ${shown ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1]"}`} />
                <circle cx="232" cy="5" r="3" fill="#D9A928" />
              </svg>
            </div>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}


