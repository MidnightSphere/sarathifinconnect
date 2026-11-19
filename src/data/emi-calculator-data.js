import { loanServices } from "./loan-services-data.js";

export const EMI_AMOUNT = { min: 100_000, max: 50_000_000, step: 10_000 };
export const EMI_RATE = { min: 0, max: 24, step: 0.1 };
export const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const defaults = {
  "home-loan": [8.5, 2_500_000, 20, 30, 8.5, 11],
  "car-loan": [8.5, 800_000, 5, 7, 8.5, 15],
  "business-loan": [12, 1_000_000, 3, 5, 12, 24],
  "personal-loan": [10.5, 500_000, 3, 7, 10.5, 24],
  "loan-against-property": [9, 5_000_000, 15, 20, 9, 14],
  "loan-against-securities": [10, 1_000_000, 3, 5, 5, 24],
  "gold-loan": [9, 200_000, 1, 3, 9, 24],
  "machinery-loan": [10.8, 2_000_000, 5, 10, 10.8, 24],
  "commercial-vehicle-loan": [11, 1_500_000, 5, 7, 5, 24],
  "home-loan-balance-transfer": [8.5, 2_500_000, 20, 30, 5, 24],
  "education-loan": [9, 1_000_000, 7, 15, 9, 15],
  "sme-msme-loan": [12, 2_000_000, 3, 7, 12, 18],
  "business-equipment-finance": [10.8, 1_500_000, 5, 10, 10.8, 18],
  "working-capital-finance": [11, 2_500_000, 1, 3, 11, 18],
  "solar-project-finance": [9, 5_000_000, 10, 15, 5, 24],
};

export const EMI_LOANS = loanServices.map((service) => {
  const [rate, amount, years, maxYears, minRate, maxRate] =
    defaults[service.id] ?? [10, 1_000_000, 5, 15, 5, 24];
  return {
    id: service.id,
    label: service.name,
    category: service.category,
    rate,
    amount,
    years,
    maxYears,
    minRate,
    maxRate,
    rateText: service.rate || "Rate set by lender",
  };
});

export function calcEmi(principal, annualRate, months) {
  if (!Number.isFinite(principal) || principal <= 0 ||
      !Number.isFinite(annualRate) || annualRate < 0 ||
      !Number.isFinite(months) || months <= 0) return NaN;
  const monthlyRate = annualRate / 1200;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));

export const toNumber = (value) => {
  const number = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(number) ? number : NaN;
};
