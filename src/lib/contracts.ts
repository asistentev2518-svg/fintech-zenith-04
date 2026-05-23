import type { TermYears } from "./finance";

export type ContractStatus = "Firmado" | "Pendiente" | "Cancelado";

export interface ContractIdentity {
  ineFrontDataUrl: string;
  ineBackDataUrl: string;
  selfieDataUrl: string;
  biometricConsent: boolean;
}

export interface ContractData {
  fullName: string;
  curp: string;
  rfc: string;
  email: string;
  phone: string;
  address: string;
  amount: number;
  termYears: TermYears;
}

export interface SignedContract {
  folio: string;
  signedAt: string; // ISO
  data: ContractData;
  identity: ContractIdentity;
  signatureDataUrl: string;
  hash: string;
  userAgent: string;
  acceptances: string[];
  status: ContractStatus;
}

const STORAGE_KEY = "ig.contracts";

export function generateFolio(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `IG-${year}-${rand}`;
}

export async function technicalHash(payload: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const enc = new TextEncoder().encode(payload);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 32);
  }
  // fallback
  let h = 0;
  for (let i = 0; i < payload.length; i++) {
    h = (h << 5) - h + payload.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16).padStart(16, "0");
}

export function listContracts(): SignedContract[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SignedContract[];
  } catch {
    return [];
  }
}

export function saveContract(contract: SignedContract) {
  const all = listContracts();
  all.unshift(contract);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 200)));
  } catch {
    /* quota */
  }
}

export function findContract(folio: string): SignedContract | null {
  return listContracts().find((c) => c.folio === folio) ?? null;
}

export const ACCEPTANCES = [
  "He leído íntegramente el contrato y acepto sus términos.",
  "Reconozco que los datos proporcionados son verdaderos, completos y actualizados.",
  "Autorizo la validación de mi identidad, INE, selfie, CURP, teléfono y datos financieros.",
  "Reconozco que la firma electrónica, evidencia técnica, INE, selfie, fecha, hora, folio, dispositivo y huella de generación forman parte integral del expediente.",
  "Declaro bajo protesta de decir verdad que soy la misma persona identificada en este contrato, en la INE adjunta y en la selfie proporcionada.",
  "Confirmo que mi firma representa mi voluntad libre, expresa e informada de obligarme conforme al contrato.",
  "Acepto que el contrato y sus anexos se conserven como mensaje de datos y puedan utilizarse como medio de prueba.",
] as const;
