import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const A4_W = 794;   // px @ 96dpi
const A4_H = 1123;  // px @ 96dpi

/**
 * Renderiza un nodo HTML como PDF A4 multi-página en alta resolución.
 * El nodo debe estar en el DOM con ancho fijo de 794px para mantener proporciones.
 */
export async function exportNodeToPdf(node: HTMLElement, filename: string) {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: A4_W,
  });

  const pdf = new jsPDF({
    unit: "px",
    format: [A4_W, A4_H],
    orientation: "portrait",
    compress: true,
  });

  const pageHeightPx = A4_H;
  const totalHeight = canvas.height;
  const scale = canvas.width / A4_W;
  const pageSlicePx = pageHeightPx * scale;

  let offset = 0;
  let pageIndex = 0;

  while (offset < totalHeight) {
    const sliceHeight = Math.min(pageSlicePx, totalHeight - offset);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = sliceHeight;
    const ctx = slice.getContext("2d");
    if (!ctx) break;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(
      canvas,
      0, offset, canvas.width, sliceHeight,
      0, 0, canvas.width, sliceHeight,
    );

    const img = slice.toDataURL("image/jpeg", 0.92);
    if (pageIndex > 0) pdf.addPage([A4_W, A4_H], "portrait");
    pdf.addImage(img, "JPEG", 0, 0, A4_W, sliceHeight / scale, undefined, "FAST");

    offset += sliceHeight;
    pageIndex += 1;
  }

  pdf.save(filename);
}
