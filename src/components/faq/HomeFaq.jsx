import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

const questions = [
  {
    question: "What financial solutions does Sarathi FinConnect assist with?",
    answer:
      "We assist individuals and businesses in exploring various financial solutions, including home loans, personal loans, business finance, loan against property, working capital and other financing requirements.",
  },
  {
    question: "Does Sarathi FinConnect directly provide loans?",
    answer:
      "Sarathi FinConnect is a financial advisory and loan consultancy service. We help clients explore suitable options and coordinate with banks and financial institutions. Loan approval and disbursement are subject to the respective lender's policies.",
  },
  {
    question: "How do I know which loan option is suitable for me?",
    answer:
      "Our team understands your financial requirements and helps you explore available options based on your needs, eligibility and lender criteria.",
  },
  {
    question: "What documents are generally required for a loan application?",
    answer:
      "Documents may include identity proof, address proof, income documents, bank statements and business-related documents, depending on the loan type and lender requirements.",
  },
  {
    question: "How long does the loan approval process take?",
    answer:
      "Processing time varies depending on the loan type, lender, applicant profile and document verification. The final timeline is determined by the respective financial institution.",
  },
  {
    question: "Can I enquire about multiple financial solutions?",
    answer:
      "Yes. You can discuss multiple financing requirements with our team, and we can help you explore the relevant options.",
  },
  {
    question: "How can I get started with Sarathi FinConnect?",
    answer:
      "You can contact us through the existing website enquiry form, call our team or email us. Our team will understand your requirement and guide you through the next steps.",
  },
  {
    question: "Where is Sarathi FinConnect located?",
    answer:
      "Our office is located at Office No. 415, 4th Floor, Imperial Arc, Waghawadi Road, Opp. Shamaldas College Gate, Bhavnagar, Gujarat – 364001.",
  },
];

export default function HomeFaq() {
  const sectionId = useId();
  const [openIndex, setOpenIndex] = useState(null);
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby={`${sectionId}-heading`}
      className="bg-surface px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto mb-9 max-w-3xl text-center md:mb-12">
          <p className="mb-3 font-space text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
            Frequently Asked Questions
          </p>
          <h2
            id={`${sectionId}-heading`}
            className="mb-0 font-bricolage text-3xl font-bold leading-tight tracking-[-0.035em] text-brand-navy sm:text-4xl md:text-5xl"
          >
            Have questions? We're here to <span className="font-crimson font-semibold italic text-brand-gold">help.</span>
          </h2>
          <p className="mx-auto mb-0 mt-4 max-w-2xl text-base leading-7 text-brand-navy/70 sm:text-lg">
            Find answers to common questions about our financial solutions and
            how we guide you through the financing process.
          </p>
        </header>

        <div className="overflow-hidden rounded-3xl border border-brand-navy/10 bg-white shadow-[0_18px_50px_-40px_rgba(11,31,77,0.35)]">
          {questions.map(({ question, answer }, index) => {
            const expanded = openIndex === index;
            const triggerId = `${sectionId}-question-${index}`;
            const panelId = `${sectionId}-answer-${index}`;

            return (
              <div
                key={question}
                className={index < questions.length - 1 ? "border-b border-brand-navy/10" : ""}
              >
                <h3 className="m-0">
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(expanded ? null : index)}
                    className="flex min-h-16 w-full items-center justify-between gap-5 px-5 py-5 text-left text-sm font-semibold leading-6 text-brand-navy transition-colors hover:bg-brand-navy/[0.025] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-gold sm:px-7 sm:text-base"
                  >
                    <span>{question}</span>
                    <ChevronDown
                      size={19}
                      aria-hidden="true"
                      className={`shrink-0 text-brand-gold transition-transform duration-200 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!expanded}
                  inert={!expanded}
                  initial={false}
                  animate={{
                    height: expanded ? "auto" : 0,
                    opacity: expanded ? 1 : 0,
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.24,
                    ease: "easeOut",
                  }}
                  className="overflow-hidden"
                >
                  <p className="mb-0 px-5 pb-6 text-sm leading-7 text-brand-navy/70 sm:px-7">
                    {answer}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
