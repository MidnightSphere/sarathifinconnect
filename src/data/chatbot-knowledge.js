import { contactInfo } from "./contact.js";

export const chatbotKnowledge = {
  company: {
    name: "Sarathi FinConnect Advisory LLP",
    ownerANDFounder: "Sarathi FinConnect Advisory LLP is owned and operated by Hitesh Makwana.",
    description:
      "Sarathi FinConnect is a financial services firm that helps individuals and businesses explore suitable loan and finance options, offering guidance and support through the process.",
    role:
      "Sarathi FinConnect helps connect customers with suitable finance options. Lenders assess applications and determine eligibility, rates, fees, terms, and approval.",
    serviceApproach: [
      "The website describes its approach as clear guidance, a transparent process, and support at every step.",
      "Its suggested customer journey is: share your requirement, explore suitable options, then get guidance through the next stage.",
      "The services page highlights quick processing, flexible tenure, and trusted and secure service. These are website service commitments, not guarantees of approval, timing, or loan terms.",
    ],
    availableLanguages: ["English", "Hindi", "Gujarati"],
    website: "https://sarathifinconnect.com/",
    websiteDevelopment: "The website was developed by company Midnightsphere. Fouders of midnighhtsphere are Bhavik vavadiya, Krunal rathod and Arman Mahetar. company website is https://midnightsphere.me/",
  },
  contact: {
    phone: contactInfo.phone,
    email: contactInfo.email,
    address: contactInfo.address,
    businessHours:
      "Business hours are not listed in the information provided. Contact the team by phone or email to ask about availability.",
    enquiry:
      "The website enquiry form asks for a name and mobile number, with loan type, email, and message optional. The site says submitted details are used only to respond to the enquiry.",
  },
  faqs: [
    {
      question: "What does Sarathi FinConnect do?",
      answer:
        "Sarathi FinConnect helps individuals and businesses explore suitable loan and finance options, with guidance and support through the process.",
    },
    {
      question: "Does Sarathi FinConnect approve loans?",
      answer:
        "No. The lender assesses the application and makes the final decision about eligibility, rates, fees, terms, and approval.",
    },
    {
      question: "Are the rates and tenures on the website guaranteed?",
      answer:
        "No. They are illustrative references only. Current offers and terms depend on the lender and the applicant's assessment.",
    },
    {
      question: "How can I contact Sarathi FinConnect?",
      answer: `Call ${contactInfo.phone} or email ${contactInfo.email}.`,
    },
    {
      question: "Where is Sarathi FinConnect located?",
      answer: contactInfo.address,
    },
    {
      question: "What happens after I send an enquiry?",
      answer:
        "The website says the team will get back to you with guidance. Your details are used only to respond to your enquiry. The site does not specify a response time.",
    },
    {
      question: "Which languages can I use to contact the team?",
      answer:
        "The website lists English, Hindi, and Gujarati as available languages.",
    },
    {
      question: "How does the guidance process work?",
      answer:
        "The website outlines three steps: share your requirement, explore suitable options, and get guidance through the next stage. The lender evaluates applications and sets final terms.",
    },
    {
      question: "Which loan services are listed?",
      answer:
        "The services page lists home, car, business, personal, loan against property, loan against securities, gold, machinery, commercial vehicle, home-loan balance transfer, education, SME and MSME, business and equipment finance, working capital, and solar project finance. Availability and terms depend on lender assessment.",
    },
  ],
};
