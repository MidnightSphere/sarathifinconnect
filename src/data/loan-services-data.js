const standardFaqs = [
  {
    question: "How do I compare offers?",
    answer:
      "Compare the annualized cost, total repayment, fees, prepayment terms, and service experience across written lender offers.",
  },
  {
    question: "Are these terms guaranteed?",
    answer:
      "No. This guide is general information. A lender confirms rates, eligibility, fees, and final approval after reviewing your application.",
  },
];

export const loanServices = [
  {
    id: "home-loan",
    number: "01",
    name: "Home Loan",
    category: "Property finance",
    rate: "8.5–11% p.a.*",
    tenure: "Up to 20–30 years*",
    intro:
      "Explore finance for a new home, a resale property, construction, or a balance transfer, with guidance at every step.",
    summary: "A considered route to a place of your own.",
    highlights: [
      "Purchase or construction",
      "New or resale property",
      "Balance transfer options",
    ],
    eligibility: [
      "The supplied guide notes a typical age range of 21–65 at loan maturity; lender limits vary.",
      "Salaried employees, self-employed professionals, and business owners may apply.",
      "A credit score around 675+ is cited as a reference only; income, obligations, co-applicants, and property checks also matter.",
    ],
    documents: [
      "Applicant and co-applicant PAN, Aadhaar, or other accepted KYC.",
      "Salaried: recent salary slips, Form 16, and bank statements; self-employed: income-tax returns and financial statements.",
      "Property title, sale agreement, approved plan, and other legal or technical records requested by the lender.",
    ],
    steps: [
      "Submit a home-loan enquiry with applicant and property details.",
      "Share KYC, income, and property documents for lender review.",
      "The lender completes credit assessment plus legal and technical property checks.",
      "Review the sanction terms; disbursement follows lender conditions and transaction milestones.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists rates around 8.5–11% p.a. and tenures up to 20–30 years; current lender terms may differ.",
      "Processing, legal, valuation, and other charges vary by lender and property.",
      "A balance transfer may be worth comparing after accounting for all switching costs.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "car-loan",
    number: "02",
    name: "Car Loan",
    category: "Vehicle finance",
    rate: "8.5–15% p.a.*",
    tenure: "12–84 months*",
    intro:
      "Compare finance for a new or pre-owned car and understand the contribution, repayment, and vehicle checks involved.",
    summary: "Move toward your next car with a clear plan.",
    highlights: [
      "New and used vehicles",
      "Loan share depends on lender",
      "Tenure varies by vehicle and profile",
    ],
    eligibility: [
      "The supplied guide notes a typical age range of 21–65; lender limits vary.",
      "Salaried applicants, professionals, and business owners may be considered.",
      "A credit score around 675+ is a reference only; vehicle age, income, obligations, and valuation affect the offer.",
    ],
    documents: [
      "PAN and accepted identity/address proof.",
      "Salary slips and bank records, or self-employed income-tax and business records.",
      "New-car quotation; used car or refinance may require registration, insurance, ownership, and valuation records.",
    ],
    steps: [
      "Choose a new, used, or refinance requirement and share vehicle details.",
      "Submit KYC and income records with a dealer quotation or existing vehicle papers.",
      "The lender checks applicant credit and may inspect or value the vehicle.",
      "Review the sanction and repayment terms before dealer payment or disbursement.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists rates around 8.5–15% p.a. and tenures of 12–84 months; current lender terms may differ.",
      "Down payment, processing, and documentation charges depend on lender, vehicle, and applicant.",
      "Ask for written prepayment and foreclosure conditions before signing.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "business-loan",
    number: "03",
    name: "Business Loan",
    category: "Business finance",
    rate: "1–2% monthly*",
    tenure: "12–144 months*",
    intro:
      "Explore working-capital or expansion finance, with secured and unsecured options assessed against the business and its plans.",
    summary: "Give a sound business plan room to grow.",
    highlights: [
      "Working capital and expansion",
      "Secured or unsecured options",
      "Structured around business cash flow",
    ],
    eligibility: [
      "The supplied guide notes business vintage of about 2–3 years and promoter age of 25–65 as common references, not rules.",
      "Lenders review turnover, cash flow, profitability, business vintage, and existing obligations.",
      "A credit score around 675+ may be considered; secured and unsecured products use different criteria.",
    ],
    documents: [
      "Promoter KYC and business registration, GST, Udyam, or applicable trade records.",
      "Recent business bank statements, income-tax returns, and financial statements.",
      "Property or collateral records where required for a secured facility.",
    ],
    steps: [
      "Choose secured or unsecured finance and describe the business purpose.",
      "Submit business, promoter, bank, and financial documents.",
      "The lender reviews cash flow, credit, business records, and any proposed collateral.",
      "Review fees, repayment frequency, and security terms before accepting the sanction.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists roughly 1–2% per month for some products; secured options may have longer tenures. Ask how the rate is calculated.",
      "Security or collateral may be required for some offers.",
      "Compare processing fees, repayment frequency, and early repayment terms in writing.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "personal-loan",
    number: "04",
    name: "Personal Loan",
    category: "Personal finance",
    rate: "10.5–24% p.a.*",
    tenure: "12–60 months*",
    intro:
      "Understand an unsecured borrowing option for planned expenses, with repayment sized to your income and existing commitments.",
    summary: "A flexible option for life’s planned expenses.",
    highlights: [
      "Typically unsecured",
      "Flexible end use may be available",
      "Fixed instalments subject to lender terms",
    ],
    eligibility: [
      "The supplied guide notes a typical age range of 21–60; lender limits vary.",
      "Salaried and self-employed applicants may be assessed against lender income and work-history rules.",
      "A credit score around 700+ is cited as a reference only; income and existing EMIs also affect the decision.",
    ],
    documents: [
      "PAN and accepted identity/address proof.",
      "Recent bank statements plus salary slips or self-employed income-tax and business records.",
      "Photograph and additional verification documents where requested.",
    ],
    steps: [
      "Share the required amount, purpose, and applicant income details.",
      "Submit KYC and income records for digital or branch verification.",
      "The lender checks credit history, obligations, and repayment capacity.",
      "Review the written offer, charges, and early-repayment policy before accepting.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists rates around 10.5–24% p.a. and tenures of 12–60 months; current lender terms may differ.",
      "Processing fees and applicable taxes should be checked before acceptance.",
      "Prepayment or foreclosure may have conditions or charges under the lender’s policy.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "loan-against-property",
    number: "05",
    name: "Loan Against Property",
    category: "Property-backed finance",
    rate: "9–14% p.a.*",
    tenure: "Up to 15 years*",
    intro:
      "Learn about borrowing against eligible owned property while retaining ownership, subject to lender valuation and legal checks.",
    summary: "Unlock a property-backed borrowing option.",
    highlights: [
      "Residential or commercial property may qualify",
      "Property valuation and title checks",
      "Use of funds depends on lender policy",
    ],
    eligibility: [
      "The supplied guide notes age around 21–65 and credit score around 675+ as references only.",
      "Income, repayment capacity, property ownership, title, location, and condition are reviewed.",
      "Co-owners may need to participate; final criteria depend on lender policy.",
    ],
    documents: [
      "Applicant KYC and income documents.",
      "Ownership chain, title deeds, and current property tax records.",
      "Business or end-use documents where requested.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists rates around 9–14% p.a. and tenures up to 15 years.",
      "Loan-to-value depends on lender policy and valuation; legal, valuation, and processing charges may apply.",
      "Understand the consequences of default before pledging property.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "loan-against-securities",
    number: "06",
    name: "Loan Against Securities",
    category: "Investment-backed finance",
    intro:
      "Review the possibility of borrowing against eligible shares, mutual funds, or other approved securities.",
    summary:
      "Access liquidity without immediately selling eligible investments.",
    highlights: [
      "Eligible holdings depend on lender",
      "Portfolio and market value are monitored",
      "Pledged investments remain subject to terms",
    ],
    eligibility: [
      "Only securities on the lender’s approved list may qualify.",
      "The facility amount can change with market value and lender limits.",
      "Applicant KYC and ownership of the securities must be verified.",
    ],
    documents: [
      "Identity, address, and PAN documents.",
      "Demat or investment holding statements.",
      "Bank and income records as required by the lender.",
    ],
    terms: [
      "Interest, margin, and eligible collateral vary by lender and security.",
      "Market movements may trigger a request for additional collateral or repayment.",
      "Review pledge release and liquidation conditions carefully.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "gold-loan",
    number: "07",
    name: "Gold Loan",
    category: "Gold-backed finance",
    rate: "9–24% p.a.*",
    tenure: "3–36 months*",
    intro:
      "Understand short-term borrowing secured by eligible gold ornaments, subject to purity assessment and lender policy.",
    summary: "A secured borrowing option backed by eligible gold.",
    highlights: [
      "Gold purity and net weight are assessed",
      "Repayment options vary by lender",
      "Pledged gold is held as security",
    ],
    eligibility: [
      "Applicant identity and ownership requirements apply.",
      "Accepted gold items and purity standards are set by the lender.",
      "The amount is based on the lender’s valuation and applicable limits.",
    ],
    documents: [
      "Valid identity and address proof.",
      "Any ownership or supporting records requested during appraisal.",
      "Bank details for disbursement and repayment.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists rates around 9–24% p.a. and tenures of 3–36 months.",
      "Valuation, loan-to-value, charges, repayment schedule, and auction process vary by lender.",
      "Collect and retain the lender’s appraisal and pledge documentation.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "machinery-loan",
    number: "08",
    name: "Machinery Loan",
    category: "Equipment finance",
    rate: "From 0.9% monthly*",
    tenure: "12–84 months*",
    intro:
      "Compare financing for eligible new or pre-owned equipment used in manufacturing, services, or business expansion.",
    summary: "Invest in equipment with repayment planned around operations.",
    highlights: [
      "New or eligible used machinery",
      "Asset-backed options may be available",
      "Supplier and equipment checks apply",
    ],
    eligibility: [
      "Business track record and cash flow are assessed.",
      "Equipment type, supplier, useful life, and resale value may be reviewed.",
      "Promoter contribution or collateral depends on lender policy.",
    ],
    documents: [
      "Business KYC, registration, and financial statements.",
      "Supplier quotation, equipment specifications, and purchase details.",
      "Bank statements, GST returns, and tax returns where applicable.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists some rates from around 0.9% monthly and tenures of 12–84 months.",
      "Funding share, rate basis, insurance, valuation, and documentation costs depend on equipment and lender assessment.",
      "Confirm repayment, security, and maintenance obligations before purchase.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "commercial-vehicle-loan",
    number: "09",
    name: "Commercial Vehicle Loan",
    category: "Fleet finance",
    intro:
      "Explore financing for eligible commercial vehicles, whether you are building a fleet or replacing a working asset.",
    summary: "Keep business journeys moving with the right vehicle finance.",
    highlights: [
      "New and selected used vehicles",
      "Business-use assessment",
      "Vehicle-backed finance may be available",
    ],
    eligibility: [
      "Lenders assess business activity, route or usage, and repayment capacity.",
      "Vehicle age, model, and registration requirements differ by lender.",
      "Owner-operators and businesses may have different documentation needs.",
    ],
    documents: [
      "Applicant and business KYC.",
      "Income, bank statements, and business records.",
      "Vehicle quotation, registration, permits, and insurance details as applicable.",
    ],
    terms: [
      "Rates, down payment, and tenure vary by vehicle and lender.",
      "Processing, hypothecation, and insurance charges should be confirmed.",
      "Ask about repayment flexibility and early settlement conditions.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "home-loan-balance-transfer",
    number: "10",
    name: "Home Loan Balance Transfer",
    category: "Loan transfer",
    rate: "Compare offers",
    tenure: "Remaining term based",
    intro:
      "Compare a potential transfer of your existing home loan, weighing any new offer against the total cost of switching.",
    summary:
      "See whether a new lender offer could improve the overall picture.",
    highlights: [
      "Review current outstanding balance",
      "Compare total remaining cost",
      "Top-up availability is lender-specific",
    ],
    eligibility: [
      "Payment history and current outstanding balance are reviewed.",
      "Property title and existing loan records must be verified.",
      "The receiving lender completes a fresh credit and income assessment.",
    ],
    documents: [
      "Current lender statement, repayment history, and loan agreement.",
      "Applicant income and KYC documents.",
      "Property documents and current lender closure or consent records as requested.",
    ],
    terms: [
      "Compare the remaining interest cost against transfer fees and other charges.",
      "Any top-up is subject to separate lender assessment.",
      "Request a written foreclosure statement and transfer schedule before proceeding.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "education-loan",
    number: "11",
    name: "Education Loan",
    category: "Education finance",
    rate: "9–15% p.a.*",
    tenure: "Up to 10–15 years*",
    intro:
      "Plan financing for tuition, accommodation, books, and other eligible costs while pursuing higher education in India or abroad.",
    summary:
      "Support an education plan with a repayment path built around the course.",
    highlights: [
      "Tuition and eligible study costs",
      "Co-applicant commonly required",
      "Moratorium terms depend on lender and course",
    ],
    eligibility: [
      "Student must meet lender and institution criteria.",
      "A parent, guardian, or eligible family member may be required as co-applicant.",
      "Academic record, admission status, course, and repayment capacity are assessed.",
    ],
    documents: [
      "Student and co-applicant KYC.",
      "Academic records, entrance results, and official admission and fee details.",
      "Co-applicant income records and bank statements.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists rates around 9–15% p.a. and repayment periods up to 10–15 years after any moratorium.",
      "Eligible expenses, security requirements, and disbursement schedule vary by lender.",
      "Tax treatment depends on current law and individual circumstances; confirm with a qualified tax adviser.",
    ],
    steps: [
      "Share the course, institution, study location, and estimated cost.",
      "Submit admission, academic, student, and co-applicant records.",
      "The lender assesses the applicant, co-applicant, course, and any security requirement.",
      "Review the sanction terms and disbursement schedule before accepting.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "sme-msme-loan",
    number: "12",
    name: "SME & MSME Loan",
    category: "Enterprise finance",
    rate: "About 1–1.5% monthly*",
    tenure: "12–84 months*",
    intro:
      "Explore funding for registered small businesses that need to invest in machinery, inventory, diversification, or day-to-day cash flow.",
    summary:
      "Business finance shaped around the next stage of your enterprise.",
    highlights: [
      "Working capital and expansion",
      "Udyam/MSME registration may be relevant",
      "Scheme eligibility varies by lender",
    ],
    eligibility: [
      "Business vintage, turnover, and cash flow are assessed.",
      "Lenders may require GST compliance and valid business registration.",
      "Promoter and business credit histories may be reviewed.",
    ],
    documents: [
      "Promoter KYC and business registration or Udyam certificate.",
      "GST returns and current-account statements where applicable.",
      "Financial statements and income-tax records requested by the lender.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists some products around 1–1.5% monthly and tenures up to 60–84 months.",
      "Collateral, scheme support, charges, and repayment schedules depend on lender assessment.",
      "Confirm the reducing or flat rate basis and total repayment in writing.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "business-equipment-finance",
    number: "13",
    name: "Business & Equipment Finance",
    category: "Equipment finance",
    rate: "About 0.9–1.5% monthly*",
    tenure: "12–84 months*",
    intro:
      "Finance eligible tools, equipment, and commercial assets while preserving working capital for normal business operations.",
    summary:
      "Invest in productive assets with repayments planned around business use.",
    highlights: [
      "New equipment and eligible assets",
      "Supplier quotation informs assessment",
      "Asset-backed structures may be available",
    ],
    eligibility: [
      "Business operations and financial stability are reviewed.",
      "The lender may assess equipment utility, supplier, useful life, and resale value.",
      "Promoter contribution or collateral depends on the offer.",
    ],
    documents: [
      "Business KYC and registration documents.",
      "Financial statements, bank records, and applicable tax filings.",
      "Supplier quotation or pro forma invoice with equipment specifications.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists some rates around 0.9–1.5% monthly and tenures of 12–84 months.",
      "Insurance, valuation, processing, and security requirements vary.",
      "Confirm the rate basis, total cost, and vendor-disbursement terms before purchase.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "working-capital-finance",
    number: "14",
    name: "Working Capital Finance",
    category: "Cash-flow finance",
    rate: "11–18% p.a.*",
    tenure: "Revolving / short-term*",
    intro:
      "Review cash-credit, overdraft, and invoice-finance options to help manage inventory cycles and receivables.",
    summary: "Keep operating cash flow moving through uneven trade cycles.",
    highlights: [
      "Cash credit and overdraft facilities",
      "Invoice financing may unlock receivables",
      "Limits are reviewed against business activity",
    ],
    eligibility: [
      "Established businesses with verifiable trade activity may be considered.",
      "Turnover, receivables, stock, and repayment history are assessed.",
      "The lender sets renewal frequency, drawing power, and any security.",
    ],
    documents: [
      "Business KYC, incorporation, or partnership records.",
      "Recent financial statements, tax filings, and bank statements.",
      "Stock statements, receivable ageing, and invoices where relevant.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide lists rates around 11–18% p.a. for some facilities; pricing varies by product and security.",
      "Revolving limits may be reviewed or renewed periodically.",
      "Check utilization-based interest, renewal charges, drawing conditions, and invoice recourse terms.",
    ],
    faqs: standardFaqs,
  },
  {
    id: "solar-project-finance",
    number: "15",
    name: "Solar Project Finance",
    category: "Green energy finance",
    rate: "Lender set*",
    tenure: "12–144 months*",
    intro:
      "Explore finance for residential, commercial, or industrial solar installations and compare the project cost with expected savings.",
    summary: "Make a renewable-energy project easier to plan and fund.",
    highlights: [
      "Residential and business installations",
      "Vendor quotation and site checks",
      "Repayments depend on project and lender",
    ],
    eligibility: [
      "Property or site suitability and applicant profile are assessed.",
      "Required permits and utility-provider rules vary by location.",
      "The lender may require an approved installer and technical proposal.",
    ],
    documents: [
      "Applicant KYC and property or site records.",
      "Recent utility bills and installation quotation.",
      "Technical proposal, vendor details, and business financials where applicable.",
    ],
    terms: [
      "Illustrative reference only: the supplied guide notes tenures up to 144 months; rates and availability are lender-specific.",
      "Project feasibility, vendor approval, insurance, and applicable incentives need separate verification.",
      "Compare total cost and expected savings using conservative assumptions.",
    ],
    faqs: standardFaqs,
  },
];

// home loan -> https://unsplash.com/photos/two-men-shaking-hands-over-a-house-model-and-keys-69K2AGQc_Yw
