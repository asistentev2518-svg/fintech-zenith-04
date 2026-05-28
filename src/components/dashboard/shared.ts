import { calculateMonthlyPayment, formatMXN, type TermYears } from "@/lib/finance";
import { INSTITUTION } from "@/lib/config";
import { ASSETS } from "@/lib/config";

export const MAIN_LOGO = ASSETS.logo;
export const DOC_VERSION = "v1.0";

export const PRIVACY_CONTACT = {
  email: "privacidad@impulsogo.mx",
  address: INSTITUTION.address,
};

export type MasterData = {
  folio: string;
  folioCondusef: string;
  emittedAt: string;
  city: string;
  name: string;
  amount: number;
  termYears: TermYears;
  commission: number;
  executive: string;
};

export function formatMoney(v: number) {
  return formatMXN(Math.round(v));
}

export function offerDeadline72h(now = new Date()) {
  const d = new Date(now.getTime() + 72 * 3600 * 1000);
  return d.toLocaleString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function derive(m: MasterData) {
  const pay = calculateMonthlyPayment(m.amount, m.termYears);
  const seed = m.folio.replace(/\D/g, "").slice(-6).padStart(6, "0");
  const rfcSurname = (m.name.split(" ").pop() ?? "XAX").toUpperCase().slice(0, 3).padEnd(3, "X");
  const rfc = `${rfcSurname}${seed.slice(0, 6)}A1B`;
  const account = `••• •••• ${seed.slice(0, 4)}`;
  const clabe = `0123 4567 ${seed} ${seed.slice(0, 2)}`;
  const initials = m.executive
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const validFrom = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const validTo = new Date(Date.now() + m.termYears * 365 * 24 * 3600 * 1000).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const policyNumber = `POL-${seed}-${m.termYears}A`;
  return {
    monthly: pay.cuota,
    totalToPay: pay.total,
    months: pay.months,
    annualRatePct: INSTITUTION.annualRatePercent,
    rfc,
    accountMasked: account,
    clabeMasked: clabe,
    initials,
    validFrom,
    validTo,
    policyNumber,
    penalty: Math.round(m.amount * (INSTITUTION.penaltyPercent / 100)),
    totalDue: Math.round(m.amount + m.amount * (INSTITUTION.penaltyPercent / 100)),
  };
}

export function newFolio() {
  const y = new Date().getFullYear();
  return `IG-${y}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function newFolioCondusef() {
  return `CONDUSEF-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function defaultMaster(): MasterData {
  return {
    folio: newFolio(),
    folioCondusef: newFolioCondusef(),
    emittedAt: new Date().toLocaleString("es-MX", { day: "2-digit", month: "long", year: "numeric" }),
    city: "Ciudad de México",
    name: "",
    amount: 50000,
    termYears: 4,
    commission: 1500,
    executive: "Ely Garcia",
  };
}
