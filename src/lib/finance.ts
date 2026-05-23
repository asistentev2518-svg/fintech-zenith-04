import { INSTITUTION } from "./config";

export const ANNUAL_RATE = INSTITUTION.annualRatePercent / 100;
export const ALLOWED_TERMS = INSTITUTION.allowedTermsYears;
export const MIN_AMOUNT = INSTITUTION.minAmount;
export const AMOUNT_INCREMENT = INSTITUTION.amountIncrement;
export const PENALTY_RATE = INSTITUTION.penaltyPercent / 100;

export type TermYears = (typeof ALLOWED_TERMS)[number];

export function calculateMonthlyPayment(amount: number, years: TermYears) {
  const monthlyRate = ANNUAL_RATE / 12;
  const months = years * 12;
  const monthlyPayment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const cuota = Math.round(monthlyPayment);
  const total = cuota * months;
  return { cuota, total, months, monthlyRate, interest: total - amount };
}

export function formatMXN(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildSimulationTable(amount: number) {
  return ALLOWED_TERMS.map((years) => {
    const { cuota, total, interest } = calculateMonthlyPayment(amount, years);
    return { years, cuota, total, interest };
  });
}
