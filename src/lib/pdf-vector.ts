/**
 * PDF vectorial puro con jsPDF — SIN html2canvas.
 * Texto seleccionable, fuente Helvetica nativa, coordenadas en mm, formato Letter.
 * Cubre los 4 documentos institucionales del generador.
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { INSTITUTION } from "./config";
import { formatMXN } from "./finance";
import { derive, offerDeadline72h, type MasterData } from "@/components/dashboard/shared";

// Paleta institucional (mismas que el resto del ecosistema)
const C_BRAND: [number, number, number] = [11, 42, 91];      // #0B2A5B
const C_ACCENT: [number, number, number] = [18, 102, 214];   // #1266D6
const C_INK: [number, number, number] = [15, 23, 42];        // #0F172A
const C_INK_SOFT: [number, number, number] = [100, 116, 139];// #64748B
const C_HAIRLINE: [number, number, number] = [226, 232, 240];// #E2E8F0
const C_SUCCESS: [number, number, number] = [10, 143, 60];   // #0A8F3C
const C_DANGER: [number, number, number] = [185, 28, 28];    // #B91C1C
const C_BG_SOFT: [number, number, number] = [247, 250, 255]; // #F7FAFF

type DocKind = "aprobacion" | "cancelacion" | "poliza" | "privacidad";

const LABEL: Record<DocKind, string> = {
  aprobacion: "CONSTANCIA DE APROBACIÓN",
  cancelacion: "NOTIFICACIÓN DE CANCELACIÓN",
  poliza: "PÓLIZA DE PROTECCIÓN",
  privacidad: "AVISO DE PRIVACIDAD",
};

function fileName(kind: DocKind, m: MasterData): string {
  const surname = (m.name.trim().split(/\s+/).pop() ?? "cliente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${kind}_${m.folio}_${date}_${surname || "cliente"}.pdf`;
}

function header(doc: jsPDF, kind: DocKind, m: MasterData) {
  const w = doc.internal.pageSize.getWidth();

  // Franja superior brand
  doc.setFillColor(...C_BRAND);
  doc.rect(0, 0, w, 22, "F");
  doc.setFillColor(...C_ACCENT);
  doc.rect(0, 22, w, 1.5, "F");

  // Título institución
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(INSTITUTION.shortName.toUpperCase(), 15, 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(INSTITUTION.legalName, 15, 17);

  // Folio derecha
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`Folio: ${m.folio}`, w - 15, 11, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`CONDUSEF: ${m.folioCondusef}`, w - 15, 17, { align: "right" });

  // Etiqueta documento
  doc.setTextColor(...C_BRAND);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(LABEL[kind], 15, 38);

  doc.setTextColor(...C_INK_SOFT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${m.city} · Emitido ${m.emittedAt}`, 15, 44);

  doc.setDrawColor(...C_HAIRLINE);
  doc.setLineWidth(0.3);
  doc.line(15, 48, w - 15, 48);
}

function footer(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...C_HAIRLINE);
  doc.setLineWidth(0.3);
  doc.line(15, h - 18, w - 15, h - 18);

  doc.setTextColor(...C_INK_SOFT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(INSTITUTION.legalName, 15, h - 12);
  doc.text(INSTITUTION.address, 15, h - 8);
  doc.text("Registro CONDUSEF · SIPRES", w - 15, h - 12, { align: "right" });
  doc.text(
    `Generado: ${new Date().toLocaleString("es-MX")}`,
    w - 15,
    h - 8,
    { align: "right" },
  );
}

function dataGrid(doc: jsPDF, y: number, items: [string, string][]): number {
  const w = doc.internal.pageSize.getWidth();
  const cols = 2;
  const cellW = (w - 30) / cols;
  const cellH = 14;
  items.forEach((item, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    const x = 15 + c * cellW;
    const yy = y + r * cellH;
    doc.setFillColor(...C_BG_SOFT);
    doc.setDrawColor(...C_HAIRLINE);
    doc.roundedRect(x, yy, cellW - 4, cellH - 2, 1.5, 1.5, "FD");
    doc.setTextColor(...C_INK_SOFT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(item[0].toUpperCase(), x + 4, yy + 5);
    doc.setTextColor(...C_INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(item[1], x + 4, yy + 10);
  });
  return y + Math.ceil(items.length / cols) * cellH + 4;
}

function paragraph(doc: jsPDF, text: string, x: number, y: number, maxW: number, lineH = 4.6): number {
  doc.setTextColor(...C_INK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const lines = doc.splitTextToSize(text, maxW);
  doc.text(lines, x, y);
  return y + lines.length * lineH;
}

// ============================================================
// Documento 1 — APROBACIÓN
// ============================================================
function buildAprobacion(m: MasterData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "letter", compress: true, putOnlyUsedFonts: true });
  const w = doc.internal.pageSize.getWidth();
  const d = derive(m);

  header(doc, "aprobacion", m);

  // Badge éxito
  doc.setFillColor(...C_SUCCESS);
  doc.roundedRect(15, 54, 60, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("✓ CRÉDITO APROBADO", 18, 59.5);

  let y = paragraph(
    doc,
    `Se le informa que la solicitud de crédito presentada por ${m.name || "el solicitante"} ha sido APROBADA por el Comité de Crédito de ${INSTITUTION.shortName}, sujeta a la firma del contrato y a las condiciones siguientes:`,
    15,
    74,
    w - 30,
  );
  y += 4;

  y = dataGrid(doc, y, [
    ["Titular", m.name || "—"],
    ["RFC", d.rfc],
    ["Monto aprobado", formatMXN(m.amount)],
    ["Plazo", `${m.termYears} años (${d.months} meses)`],
    ["Tasa anual fija", `${d.annualRatePct.toFixed(2)}%`],
    ["Cuota mensual", formatMXN(d.monthly)],
    ["Total a pagar", formatMXN(d.totalToPay)],
    ["Comisión apertura", formatMXN(m.commission)],
  ]);

  y = paragraph(
    doc,
    `La presente aprobación tiene vigencia hasta el ${offerDeadline72h()} (72 horas). Después de este plazo deberá renovarse. La formalización requiere identificación oficial vigente y firma del contrato electrónico con sello de tiempo.`,
    15,
    y + 2,
    w - 30,
  );

  // Bloque ejecutivo
  y += 6;
  doc.setFillColor(...C_BG_SOFT);
  doc.setDrawColor(...C_HAIRLINE);
  doc.roundedRect(15, y, w - 30, 22, 2, 2, "FD");
  doc.setTextColor(...C_INK_SOFT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("EJECUTIVO RESPONSABLE", 19, y + 6);
  doc.setTextColor(...C_BRAND);
  doc.setFontSize(11);
  doc.text(m.executive, 19, y + 13);
  doc.setTextColor(...C_INK_SOFT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Sucursal: ${m.city}`, 19, y + 18);

  footer(doc);
  return doc;
}

// ============================================================
// Documento 2 — CANCELACIÓN
// ============================================================
function buildCancelacion(m: MasterData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "letter", compress: true, putOnlyUsedFonts: true });
  const w = doc.internal.pageSize.getWidth();
  const d = derive(m);

  header(doc, "cancelacion", m);

  doc.setFillColor(...C_DANGER);
  doc.roundedRect(15, 54, 70, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("✕ CRÉDITO CANCELADO", 18, 59.5);

  let y = paragraph(
    doc,
    `Se notifica a ${m.name || "el cliente"} que el crédito identificado con el folio ${m.folio} ha sido CANCELADO por ${INSTITUTION.shortName} conforme a los términos pactados en el contrato. Esta cancelación genera la penalización prevista del ${INSTITUTION.penaltyPercent}% sobre el monto original del crédito.`,
    15,
    74,
    w - 30,
  );
  y += 4;

  y = dataGrid(doc, y, [
    ["Titular", m.name || "—"],
    ["RFC", d.rfc],
    ["Monto original", formatMXN(m.amount)],
    ["Penalización", formatMXN(d.penalty)],
    ["Total a liquidar", formatMXN(d.totalDue)],
    ["Cuenta para pago", d.accountMasked],
    ["CLABE", d.clabeMasked],
    ["Plazo para liquidar", "72 horas"],
  ]);

  paragraph(
    doc,
    `El cliente deberá liquidar el adeudo en un plazo máximo de 72 horas a partir de la fecha de emisión de la presente notificación. La falta de pago dentro del plazo será reportada al Buró de Crédito y podrá derivar en acciones legales conforme a la cláusula de Información Crediticia del contrato firmado.`,
    15,
    y + 2,
    w - 30,
  );

  footer(doc);
  return doc;
}

// ============================================================
// Documento 3 — PÓLIZA
// ============================================================
function buildPoliza(m: MasterData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "letter", compress: true, putOnlyUsedFonts: true });
  const w = doc.internal.pageSize.getWidth();
  const d = derive(m);

  header(doc, "poliza", m);

  // Badge brand
  doc.setFillColor(...C_BRAND);
  doc.roundedRect(15, 54, 78, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`PÓLIZA ${d.policyNumber}`, 18, 59.5);

  let y = paragraph(
    doc,
    `Se emite la presente póliza de protección a favor de ${m.name || "el titular"}, asociada al crédito ${m.folio} otorgado por ${INSTITUTION.shortName}. Esta póliza ampara el saldo insoluto en caso de fallecimiento o invalidez total y permanente del titular conforme a los términos generales del contrato.`,
    15,
    74,
    w - 30,
  );
  y += 4;

  y = dataGrid(doc, y, [
    ["Titular", m.name || "—"],
    ["Número de póliza", d.policyNumber],
    ["Suma asegurada", formatMXN(m.amount)],
    ["Vigencia desde", d.validFrom],
    ["Vigencia hasta", d.validTo],
    ["Cuota mensual", formatMXN(d.monthly)],
    ["Beneficiario", "Impulso Go, S.A. de C.V., SOFOM, E.N.R."],
    ["Prima", "Incluida en cuota"],
  ]);

  paragraph(
    doc,
    `La cobertura entra en vigor a partir del día siguiente a la firma del contrato y permanece vigente durante todo el plazo del crédito. Cualquier siniestro deberá reportarse en un plazo máximo de 30 días naturales al correo siniestros@impulsogo.mx adjuntando acta de defunción o dictamen médico según corresponda.`,
    15,
    y + 2,
    w - 30,
  );

  footer(doc);
  return doc;
}

// ============================================================
// Documento 4 — PRIVACIDAD
// ============================================================
function buildPrivacidad(m: MasterData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "letter", compress: true, putOnlyUsedFonts: true });
  const w = doc.internal.pageSize.getWidth();

  header(doc, "privacidad", m);

  let y = 54;
  const block = (title: string, text: string) => {
    doc.setTextColor(...C_BRAND);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, 15, y);
    y += 4;
    y = paragraph(doc, text, 15, y, w - 30) + 3;
  };

  block(
    "RESPONSABLE",
    `${INSTITUTION.legalName}, con domicilio en ${INSTITUTION.address}, es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).`,
  );

  block(
    "FINALIDADES",
    "Sus datos serán utilizados para: (i) evaluar y otorgar el crédito solicitado; (ii) cumplir obligaciones legales y regulatorias ante CONDUSEF y autoridades fiscales; (iii) prevenir lavado de dinero conforme a la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita; (iv) consultar y reportar a las Sociedades de Información Crediticia; (v) cobranza administrativa, extrajudicial y judicial; (vi) emitir, enviar y archivar comprobantes fiscales digitales.",
  );

  block(
    "DATOS RECABADOS",
    "Identificación, contacto, fiscales, biométricos (firma autógrafa digital y geolocalización), financieros, patrimoniales y laborales. No se recaban datos personales sensibles distintos a los expresamente consentidos.",
  );

  block(
    "TRANSFERENCIAS",
    "Sus datos pueden ser transferidos a: Sociedades de Información Crediticia, autoridades fiscales y financieras, despachos de cobranza autorizados y prestadores de servicios de validación de identidad. No se realizan transferencias internacionales fuera de estos supuestos.",
  );

  block(
    "DERECHOS ARCO Y REVOCACIÓN",
    `Usted puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO), así como revocar su consentimiento, enviando solicitud al correo privacidad@impulsogo.mx o por escrito al domicilio del Responsable. La respuesta se emitirá en un plazo máximo de 20 días hábiles.`,
  );

  block(
    "MEDIOS REMOTOS",
    "Se recopila información técnica (IP, navegador, geolocalización aproximada) mediante cookies y mecanismos similares estrictamente necesarios para la operación de los servicios digitales. Esta información no se utiliza para perfilamiento publicitario.",
  );

  footer(doc);
  return doc;
}

// ============================================================
// Public dispatcher
// ============================================================
export function exportInstitutionalPdf(kind: DocKind, m: MasterData): void {
  const builder: Record<DocKind, (m: MasterData) => jsPDF> = {
    aprobacion: buildAprobacion,
    cancelacion: buildCancelacion,
    poliza: buildPoliza,
    privacidad: buildPrivacidad,
  };
  const doc = builder[kind](m);
  doc.save(fileName(kind, m));
}

// ============================================================
// Tabla de montos referenciales (PDF vectorial)
// ============================================================
interface TablaMontosRow { years: number; cuota: number; total: number }

export function exportTablaMontosPdf(amount: number, rows: TablaMontosRow[]): void {
  const doc = new jsPDF({ unit: "mm", format: "letter", orientation: "portrait", compress: true });
  const w = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(...C_BRAND);
  doc.rect(0, 0, w, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("TABLA DE MONTOS REFERENCIALES", w / 2, 14, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `${INSTITUTION.shortName} · Tasa anual fija ${INSTITUTION.annualRatePercent}%`,
    w / 2,
    22,
    { align: "center" },
  );

  // Chip monto
  doc.setFillColor(...C_ACCENT);
  doc.roundedRect(w / 2 - 50, 38, 100, 16, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(`${formatMXN(amount)} a ${INSTITUTION.annualRatePercent}% ANUAL`, w / 2, 48, { align: "center" });

  autoTable(doc, {
    startY: 64,
    head: [["Años", "Cuota mensual", "Monto final"]],
    body: rows.map((r) => [`${r.years}`, formatMXN(r.cuota), formatMXN(r.total)]),
    styles: { font: "helvetica", fontSize: 14, cellPadding: 8, halign: "center" },
    headStyles: {
      fillColor: C_BRAND,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 12,
      halign: "center",
    },
    bodyStyles: { textColor: C_INK },
    alternateRowStyles: { fillColor: C_BG_SOFT },
    columnStyles: {
      0: { fontStyle: "bold", textColor: C_BRAND },
      1: { fontStyle: "bold", textColor: C_ACCENT },
      2: { fontStyle: "bold", textColor: C_SUCCESS },
    },
    margin: { left: 25, right: 25 },
  });

  footer(doc);
  doc.save(`tabla-montos_${amount}_${INSTITUTION.annualRatePercent}pct.pdf`);
}
