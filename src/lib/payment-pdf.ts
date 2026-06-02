import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateMonthlyPayment, formatMXN, type TermYears } from "./finance";
import { INSTITUTION } from "./config";

interface Args {
  firstName: string;
  lastName: string;
  amount: number;
  years: TermYears;
  startDate: string;
}

/**
 * PDF vectorial (jsPDF + autoTable) de la tabla de amortización.
 * Texto seleccionable, totales cuadrados, soporta cualquier plazo sin recortar.
 */
export function exportPaymentSchedulePdf({ firstName, lastName, amount, years, startDate }: Args) {
  const pay = calculateMonthlyPayment(amount, years);
  const months = years * 12;
  const monthlyRate = INSTITUTION.annualRatePercent / 100 / 12;
  const start = startDate ? new Date(startDate + "T00:00:00") : new Date();

  let balance = amount;
  const rows: (string | number)[][] = [];
  let totalInterest = 0;
  let totalPrincipal = 0;
  for (let i = 1; i <= months; i++) {
    const interest = Math.round(balance * monthlyRate);
    const principal = pay.cuota - interest;
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    totalPrincipal += principal;
    const d = new Date(start.getFullYear(), start.getMonth() + i, start.getDate());
    rows.push([
      i,
      d.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }),
      formatMXN(interest),
      formatMXN(principal),
      formatMXN(pay.cuota),
      formatMXN(balance),
    ]);
  }

  const doc = new jsPDF({ unit: "pt", format: "letter", compress: true });
  const pageW = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(11, 42, 91);
  doc.rect(0, 0, pageW, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("TABLA DE AMORTIZACIÓN", 40, 36);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(INSTITUTION.legalName, 40, 54);
  doc.text(
    `Emitido: ${new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}`,
    pageW - 40,
    54,
    { align: "right" },
  );

  // Client + summary
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Cliente:", 40, 100);
  doc.setFont("helvetica", "normal");
  doc.text(`${firstName || "—"} ${lastName || ""}`.trim(), 100, 100);

  const summary: [string, string][] = [
    ["Monto del crédito", formatMXN(amount)],
    ["Plazo", `${years} años (${months} meses)`],
    ["Tasa anual fija", `${INSTITUTION.annualRatePercent.toFixed(2)}%`],
    ["Pago mensual", formatMXN(pay.cuota)],
    ["Total a pagar", formatMXN(pay.total)],
    ["Intereses totales", formatMXN(pay.interest)],
  ];
  const colW = (pageW - 80) / 3;
  summary.forEach(([label, value], idx) => {
    const x = 40 + (idx % 3) * colW;
    const y = 130 + Math.floor(idx / 3) * 40;
    doc.setFillColor(247, 250, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, colW - 10, 34, 4, 4, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(label.toUpperCase(), x + 8, y + 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(11, 42, 91);
    doc.text(value, x + 8, y + 26);
  });

  autoTable(doc, {
    startY: 220,
    head: [["#", "Fecha", "Interés", "Capital", "Pago", "Saldo insoluto"]],
    body: rows,
    foot: [[
      "",
      "TOTAL",
      formatMXN(totalInterest),
      formatMXN(totalPrincipal),
      formatMXN(pay.cuota * months),
      formatMXN(0),
    ]],
    styles: { font: "helvetica", fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [11, 42, 91], textColor: 255, fontStyle: "bold", halign: "center" },
    footStyles: { fillColor: [241, 245, 249], textColor: [11, 42, 91], fontStyle: "bold" },
    bodyStyles: { textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [247, 250, 255] },
    columnStyles: {
      0: { halign: "center", cellWidth: 36 },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right", fontStyle: "bold" },
      5: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: 40, right: 40 },
    didDrawPage: (data) => {
      const pageH = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `${INSTITUTION.legalName} · Registro CONDUSEF · SIPRES`,
        40,
        pageH - 20,
      );
      doc.text(`Página ${data.pageNumber}`, pageW - 40, pageH - 20, { align: "right" });
    },
  });

  const filename = `tabla-pagos_${(lastName || "cliente").replace(/\s+/g, "-")}_${years}a.pdf`;
  doc.save(filename);
}
