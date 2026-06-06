/**
 * Contrato electrónico — PDF vectorial multi-página (jsPDF + autoTable + qrcode).
 * Reemplaza el flujo basado en html2canvas-pro.
 * - Texto seleccionable y copiable
 * - 8 cláusulas formales, declaraciones, tabla resumen, aceptaciones
 * - Firma manuscrita embebida como PNG, QR de validación pública
 * - Header/footer institucional con folio, CONDUSEF, hash, paginación
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { INSTITUTION } from "./config";
import { calculateMonthlyPayment, formatMXN, type TermYears } from "./finance";
import { CONTRACT_CLAUSES, DECLARACIONES_TEXT } from "@/components/contract/clauses";
import { ACCEPTANCES, type SignedContract } from "./contracts";

const BRAND: [number, number, number] = [11, 42, 91];
const ACCENT: [number, number, number] = [18, 102, 214];
const INK: [number, number, number] = [15, 23, 42];
const INK_SOFT: [number, number, number] = [100, 116, 139];
const HAIRLINE: [number, number, number] = [226, 232, 240];
const BG_SOFT: [number, number, number] = [247, 250, 255];

const MARGIN_X = 18;
const TOP_BODY = 32;
const BOTTOM_LIMIT = 268; // mm, Letter ≈ 279.4

interface CommonInput {
  folio: string;
  fullName: string;
  curp: string;
  rfc?: string;
  phone?: string;
  address?: string;
  amount: number;
  termYears: TermYears;
  signedAt: string; // ISO
  hash?: string;
  userAgent?: string;
  signatureDataUrl?: string;
  acceptances?: readonly string[];
}

function header(doc: jsPDF, input: CommonInput, page: number, total: number) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, w, 18, "F");
  doc.setFillColor(...ACCENT);
  doc.rect(0, 18, w, 1.2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(INSTITUTION.shortName.toUpperCase(), MARGIN_X, 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(INSTITUTION.legalName, MARGIN_X, 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`Folio: ${input.folio}`, w - MARGIN_X, 8, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`Página ${page} de ${total}`, w - MARGIN_X, 13, { align: "right" });
}

function footer(doc: jsPDF, input: CommonInput) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...HAIRLINE);
  doc.setLineWidth(0.2);
  doc.line(MARGIN_X, h - 16, w - MARGIN_X, h - 16);
  doc.setTextColor(...INK_SOFT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(INSTITUTION.address, MARGIN_X, h - 11);
  doc.text("Registro CONDUSEF · SIPRES 16103", MARGIN_X, h - 7.5);
  if (input.hash) {
    doc.text(`Huella: ${input.hash.slice(0, 24)}…`, w - MARGIN_X, h - 11, { align: "right" });
  }
  doc.text(`Generado: ${new Date().toLocaleString("es-MX")}`, w - MARGIN_X, h - 7.5, { align: "right" });
}

function ensureSpace(doc: jsPDF, y: number, need: number, input: CommonInput, pageRef: { page: number; total: number }): number {
  if (y + need <= BOTTOM_LIMIT) return y;
  footer(doc, input);
  doc.addPage();
  pageRef.page += 1;
  header(doc, input, pageRef.page, pageRef.total);
  return TOP_BODY;
}

function paragraph(
  doc: jsPDF,
  text: string,
  y: number,
  input: CommonInput,
  pageRef: { page: number; total: number },
  opts: { bold?: boolean; size?: number; gap?: number; color?: [number, number, number] } = {},
): number {
  const w = doc.internal.pageSize.getWidth() - MARGIN_X * 2;
  doc.setFont("helvetica", opts.bold ? "bold" : "normal");
  doc.setFontSize(opts.size ?? 9.5);
  doc.setTextColor(...(opts.color ?? INK));
  const lines = doc.splitTextToSize(text, w) as string[];
  const lineH = (opts.size ?? 9.5) * 0.45;
  const blockH = lines.length * lineH + (opts.gap ?? 2);
  y = ensureSpace(doc, y, blockH, input, pageRef);
  doc.text(lines, MARGIN_X, y);
  return y + blockH;
}

function sectionTitle(
  doc: jsPDF,
  text: string,
  y: number,
  input: CommonInput,
  pageRef: { page: number; total: number },
): number {
  y = ensureSpace(doc, y, 12, input, pageRef);
  doc.setFillColor(...BRAND);
  doc.rect(MARGIN_X, y - 4.2, 2.2, 5.2, "F");
  doc.setTextColor(...BRAND);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(text, MARGIN_X + 5, y);
  return y + 5;
}

/** Genera el blob/objeto jsPDF del contrato firmado o manual */
async function buildContractDoc(input: CommonInput): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "letter", compress: true, putOnlyUsedFonts: true });
  const w = doc.internal.pageSize.getWidth();
  const pageRef = { page: 1, total: 1 };

  // Pre-render QR (validación pública)
  let qrPng: string | null = null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://impulsogo.mx";
    qrPng = await QRCode.toDataURL(`${origin}/validar/${input.folio}`, {
      width: 256,
      margin: 1,
      color: { dark: "#0B2A5B", light: "#FFFFFF" },
    });
  } catch { /* ignore */ }

  // Reserva placeholder de páginas — autoTable + texto fluyen y se autonumeran al final
  header(doc, input, pageRef.page, pageRef.total);

  // Encabezado del contrato
  let y = TOP_BODY;
  doc.setTextColor(...BRAND);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("CONTRATO DE FINANCIAMIENTO", w / 2, y, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(...INK_SOFT);
  doc.setFont("helvetica", "normal");
  doc.text("Solicitud, declaraciones, cláusulas y aceptaciones", w / 2, y + 5, { align: "center" });
  y += 12;

  // Partes
  const fechaLarga = new Date(input.signedAt).toLocaleDateString("es-MX", {
    day: "2-digit", month: "long", year: "numeric",
  });
  y = paragraph(
    doc,
    `En la ${INSTITUTION.jurisdiction}, a ${fechaLarga}, comparecen por una parte ${INSTITUTION.legalName}, representada por ${INSTITUTION.representative} en su carácter de ${INSTITUTION.representativeTitle} (en adelante "IMPULSO GO"); y por la otra ${input.fullName.toUpperCase()} (en adelante "EL CLIENTE"), quienes celebran el presente Contrato de Financiamiento al tenor de las siguientes declaraciones y cláusulas.`,
    y, input, pageRef,
  );

  // Tabla resumen económico
  const pay = calculateMonthlyPayment(input.amount, input.termYears);
  const months = input.termYears * 12;
  y = sectionTitle(doc, "CONDICIONES ECONÓMICAS", y + 2, input, pageRef);
  autoTable(doc, {
    startY: y,
    head: [["Concepto", "Detalle"]],
    body: [
      ["Monto del crédito", formatMXN(input.amount)],
      ["Plazo", `${input.termYears} años (${months} mensualidades)`],
      ["Tasa anual fija", `${INSTITUTION.annualRatePercent.toFixed(2)}%`],
      ["Pago mensual", formatMXN(pay.cuota)],
      ["Total a pagar", formatMXN(pay.total)],
      ["Intereses totales", formatMXN(pay.interest)],
      ["Penalización por cancelación", `${INSTITUTION.penaltyPercent}% sobre monto original`],
    ],
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: INK },
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: BG_SOFT },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 70 }, 1: { halign: "right" } },
    margin: { left: MARGIN_X, right: MARGIN_X },
    didDrawPage: () => header(doc, input, pageRef.page, pageRef.total),
  });
  // @ts-expect-error lastAutoTable inyectado
  y = (doc.lastAutoTable?.finalY ?? y) + 6;

  // Identificación del cliente
  y = sectionTitle(doc, "DATOS DEL CLIENTE", y, input, pageRef);
  autoTable(doc, {
    startY: y,
    body: [
      ["Nombre completo", input.fullName],
      ["CURP", input.curp || "—"],
      ["RFC", input.rfc || "—"],
      ["Teléfono", input.phone || "—"],
      ["Domicilio", input.address || "—"],
    ],
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: INK },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 45, fillColor: BG_SOFT }, 1: {} },
    theme: "grid",
    margin: { left: MARGIN_X, right: MARGIN_X },
    didDrawPage: () => header(doc, input, pageRef.page, pageRef.total),
  });
  // @ts-expect-error
  y = (doc.lastAutoTable?.finalY ?? y) + 8;

  // Declaraciones
  y = sectionTitle(doc, "DECLARACIONES", y, input, pageRef);
  y = paragraph(doc, DECLARACIONES_TEXT, y, input, pageRef);

  // Cláusulas
  y = sectionTitle(doc, "CLÁUSULAS", y + 2, input, pageRef);
  for (const c of CONTRACT_CLAUSES) {
    y = ensureSpace(doc, y, 14, input, pageRef);
    doc.setTextColor(...BRAND);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${c.n} ${c.title}`, MARGIN_X, y);
    y += 4.6;
    for (const p of c.paragraphs) {
      y = paragraph(doc, p, y, input, pageRef);
    }
    y += 1.5;
  }

  // Aceptaciones (si vienen)
  const accs = input.acceptances ?? ACCEPTANCES;
  if (accs?.length) {
    y = sectionTitle(doc, "ACEPTACIONES EXPRESAS", y + 2, input, pageRef);
    accs.forEach((a, i) => {
      y = paragraph(doc, `${i + 1}.  ${a}`, y, input, pageRef, { size: 9 });
    });
  }

  // Bloque de firma + QR (asegurar espacio para ambos)
  y = ensureSpace(doc, y, 70, input, pageRef);
  y += 6;
  doc.setDrawColor(...HAIRLINE);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN_X, y, w - MARGIN_X * 2, 56);

  // Firma cliente
  doc.setTextColor(...INK_SOFT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("FIRMA DEL CLIENTE", MARGIN_X + 4, y + 5);

  const sigBoxX = MARGIN_X + 4;
  const sigBoxY = y + 8;
  const sigBoxW = 80;
  const sigBoxH = 32;
  doc.setDrawColor(...HAIRLINE);
  doc.rect(sigBoxX, sigBoxY, sigBoxW, sigBoxH);
  if (input.signatureDataUrl) {
    try {
      doc.addImage(input.signatureDataUrl, "PNG", sigBoxX + 2, sigBoxY + 2, sigBoxW - 4, sigBoxH - 4);
    } catch { /* ignore */ }
  }
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.4);
  doc.line(sigBoxX, sigBoxY + sigBoxH + 2, sigBoxX + sigBoxW, sigBoxY + sigBoxH + 2);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(input.fullName.toUpperCase(), sigBoxX, sigBoxY + sigBoxH + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...INK_SOFT);
  doc.text(`CURP: ${input.curp || "—"}`, sigBoxX, sigBoxY + sigBoxH + 10);

  // QR + datos verificación
  if (qrPng) {
    const qrSize = 36;
    const qrX = w - MARGIN_X - 4 - qrSize;
    const qrY = y + 8;
    doc.addImage(qrPng, "PNG", qrX, qrY, qrSize, qrSize);
    doc.setTextColor(...INK_SOFT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("VALIDACIÓN PÚBLICA", qrX + qrSize / 2, qrY + qrSize + 4, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(`/validar/${input.folio}`, qrX + qrSize / 2, qrY + qrSize + 7.5, { align: "center" });
  }

  // Firma IMPULSO GO
  const repX = sigBoxX + sigBoxW + 14;
  doc.setTextColor(...INK_SOFT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("POR IMPULSO GO", repX, y + 5);
  doc.setDrawColor(...INK);
  doc.line(repX, sigBoxY + sigBoxH + 2, repX + 60, sigBoxY + sigBoxH + 2);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(INSTITUTION.representative.toUpperCase(), repX, sigBoxY + sigBoxH + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...INK_SOFT);
  doc.text(INSTITUTION.representativeTitle, repX, sigBoxY + sigBoxH + 10);

  // Bloque técnico debajo
  y += 60;
  y = ensureSpace(doc, y, 16, input, pageRef);
  doc.setFillColor(...BG_SOFT);
  doc.setDrawColor(...HAIRLINE);
  doc.roundedRect(MARGIN_X, y, w - MARGIN_X * 2, 14, 1.5, 1.5, "FD");
  doc.setTextColor(...INK_SOFT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("EVIDENCIA TÉCNICA", MARGIN_X + 3, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...INK);
  doc.setFontSize(7);
  doc.text(`Folio: ${input.folio}    ·    Firmado: ${new Date(input.signedAt).toLocaleString("es-MX")}`, MARGIN_X + 3, y + 8);
  if (input.hash) doc.text(`SHA-256 (32): ${input.hash}`, MARGIN_X + 3, y + 11.5);
  if (input.userAgent) {
    const ua = input.userAgent.length > 110 ? input.userAgent.slice(0, 110) + "…" : input.userAgent;
    doc.text(`UA: ${ua}`, MARGIN_X + 3, y + 14.5 > BOTTOM_LIMIT ? BOTTOM_LIMIT : y + 14.5 > y + 14 ? y + 13.5 : y + 13.5);
  }

  // Re-numerar páginas: pasamos por todas, redibujamos header con total real
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    // Limpiamos zona de header (rectángulo blanco encima)
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, w, 19.2, "F");
    header(doc, input, p, total);
    footer(doc, input);
  }

  return doc;
}

function fileName(folio: string, surname: string): string {
  const clean = surname.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `contrato_${folio}_${date}_${clean || "cliente"}.pdf`;
}

/** Exporta un contrato firmado (flujo wizard) */
export async function exportSignedContractPdf(c: SignedContract): Promise<void> {
  const doc = await buildContractDoc({
    folio: c.folio,
    fullName: c.data.fullName,
    curp: c.data.curp,
    rfc: c.data.rfc,
    phone: c.data.phone,
    address: c.data.address,
    amount: c.data.amount,
    termYears: c.data.termYears,
    signedAt: c.signedAt,
    hash: c.hash,
    userAgent: c.userAgent,
    signatureDataUrl: c.signatureDataUrl,
    acceptances: c.acceptances,
  });
  const surname = c.data.fullName.trim().split(/\s+/).pop() ?? "cliente";
  doc.save(fileName(c.folio, surname));
}

/** Exporta el contrato manual (firma física, ruta /contrato-electronico) */
export async function exportManualContractPdf(input: {
  folio: string;
  fullName: string;
  curp: string;
  rfc?: string;
  phone: string;
  address: string;
  amount: number;
  termYears: TermYears;
  fecha: string;
}): Promise<void> {
  const doc = await buildContractDoc({
    folio: input.folio,
    fullName: input.fullName,
    curp: input.curp,
    rfc: input.rfc,
    phone: input.phone,
    address: input.address,
    amount: input.amount,
    termYears: input.termYears,
    signedAt: input.fecha,
  });
  const surname = input.fullName.trim().split(/\s+/).pop() ?? "cliente";
  doc.save(fileName(input.folio, surname));
}

// ============================================================
// Editor manual /contrato — PDF vectorial 3 páginas
// ============================================================
export interface ContratoEditorInput {
  folio: string;
  fullName: string;
  curp: string;
  sexo: string;
  phone: string;
  income: string;
  address: string;
  clauses: {
    declaraciones: string;
    primera: string;
    segunda: string;
    tercera: string;
    cuarta: string;
    quinta: string;
    sexta: string;
    septima: string;
    octava: string;
    declaracionFinal: string;
  };
}

export async function exportContratoEditorPdf(s: ContratoEditorInput): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "letter", compress: true, putOnlyUsedFonts: true });
  const w = doc.internal.pageSize.getWidth();
  const pageRef = { page: 1, total: 1 };
  const common: CommonInput = {
    folio: s.folio,
    fullName: s.fullName || "—",
    curp: s.curp,
    phone: s.phone,
    address: s.address,
    amount: 0,
    termYears: 2 as TermYears,
    signedAt: new Date().toISOString(),
  };

  header(doc, common, pageRef.page, pageRef.total);
  let y = TOP_BODY;

  doc.setTextColor(...BRAND);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("CONTRATO DE CRÉDITO Y OTORGAMIENTO DE FINANCIAMIENTO", w / 2, y, { align: "center", maxWidth: w - 30 });
  y += 10;

  y = sectionTitle(doc, "1. DATOS DEL CLIENTE", y, common, pageRef);
  autoTable(doc, {
    startY: y,
    body: [
      ["Nombre completo", s.fullName || "—"],
      ["CURP", s.curp || "—"],
      ["Sexo", s.sexo || "—"],
      ["Teléfono", s.phone || "—"],
      ["Ingresos mensuales", s.income || "—"],
      ["Domicilio", s.address || "—"],
    ],
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: INK },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 50, fillColor: BG_SOFT }, 1: {} },
    theme: "grid",
    margin: { left: MARGIN_X, right: MARGIN_X },
    didDrawPage: () => header(doc, common, pageRef.page, pageRef.total),
  });
  // @ts-expect-error
  y = (doc.lastAutoTable?.finalY ?? y) + 6;

  y = sectionTitle(doc, "2. DATOS DEL FINANCIAMIENTO (LLENADO MANUAL)", y, common, pageRef);
  autoTable(doc, {
    startY: y,
    body: [
      ["Monto solicitado", "____________________"],
      ["Tasa anual ordinaria fija", `${INSTITUTION.annualRatePercent}%`],
      ["Plazo en años", "____________________"],
      ["Fecha de otorgamiento", "____ / ____ / ________"],
      ["Fecha estimada de vencimiento", "____ / ____ / ________"],
      ["Cuenta a acreditar", "____________________"],
      ["Nombre del banco", "____________________"],
    ],
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: INK },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 60, fillColor: BG_SOFT }, 1: {} },
    theme: "grid",
    margin: { left: MARGIN_X, right: MARGIN_X },
    didDrawPage: () => header(doc, common, pageRef.page, pageRef.total),
  });
  // @ts-expect-error
  y = (doc.lastAutoTable?.finalY ?? y) + 8;

  y = sectionTitle(doc, "DECLARACIONES", y, common, pageRef);
  y = paragraph(doc, s.clauses.declaraciones, y, common, pageRef);

  const items: [string, string][] = [
    ["PRIMERA. PAGOS", s.clauses.primera],
    ["SEGUNDA. DOMICILIOS Y MEDIOS DE CONTACTO", s.clauses.segunda],
    ["TERCERA. INFORMACIÓN CREDITICIA", s.clauses.tercera],
    ["CUARTA. COSTO ANUAL TOTAL (CAT)", s.clauses.cuarta],
    ["QUINTA. VERIFICACIÓN Y VALIDACIÓN DIGITAL", s.clauses.quinta],
    ["SEXTA. COMISIONES DE PAGO", s.clauses.sexta],
    ["SÉPTIMA. CANCELACIÓN Y PENALIZACIÓN", s.clauses.septima],
    ["OCTAVA. ACEPTACIÓN, LEGISLACIÓN Y JURISDICCIÓN", s.clauses.octava],
  ];
  y = sectionTitle(doc, "CLÁUSULAS", y + 2, common, pageRef);
  for (const [title, body] of items) {
    y = ensureSpace(doc, y, 12, common, pageRef);
    doc.setTextColor(...BRAND);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, MARGIN_X, y);
    y += 4.6;
    y = paragraph(doc, body, y, common, pageRef);
    y += 1.5;
  }
  y = paragraph(doc, s.clauses.declaracionFinal, y + 2, common, pageRef, { bold: true });

  // Firma manual
  y = ensureSpace(doc, y, 50, common, pageRef);
  y += 4;
  const colW = (w - MARGIN_X * 2 - 10) / 2;
  [0, 1].forEach((i) => {
    const x = MARGIN_X + i * (colW + 10);
    doc.setDrawColor(...HAIRLINE);
    doc.rect(x, y, colW, 40);
    doc.setTextColor(...BRAND);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(i === 0 ? "FIRMA DEL CLIENTE" : "FIRMA DEL REPRESENTANTE LEGAL", x + colW / 2, y + 5, { align: "center" });
    doc.setDrawColor(...INK);
    doc.line(x + 4, y + 30, x + colW - 4, y + 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    doc.text(i === 0 ? (s.fullName || "____________________") : INSTITUTION.representative, x + colW / 2, y + 34, { align: "center" });
    doc.setTextColor(...INK_SOFT);
    doc.setFontSize(7);
    doc.text(i === 0 ? "Fecha: ___/___/______" : INSTITUTION.representativeTitle, x + colW / 2, y + 37.5, { align: "center" });
  });

  // Re-numerar
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, w, 19.2, "F");
    header(doc, common, p, total);
    footer(doc, common);
  }

  const surname = s.fullName.trim().split(/\s+/).pop() ?? "cliente";
  doc.save(fileName(s.folio, surname));
}
