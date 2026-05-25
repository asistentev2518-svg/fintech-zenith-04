import html2canvas from "html2canvas";

/**
 * Renderiza un nodo HTML como PNG con dimensiones exactas (formato institucional).
 * El nodo debe estar montado con width/height fijos coincidiendo con (targetW, targetH).
 */
export async function exportNodeToPng(
  node: HTMLElement,
  filename: string,
  targetW = 1080,
  targetH = 1350,
) {
  const canvas = await html2canvas(node, {
    width: targetW,
    height: targetH,
    windowWidth: targetW,
    windowHeight: targetH,
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  // Re-escalar a tamaño exacto solicitado
  const out = document.createElement("canvas");
  out.width = targetW;
  out.height = targetH;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D no disponible");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(canvas, 0, 0, targetW, targetH);

  const blob: Blob = await new Promise((resolve, reject) =>
    out.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob falló"))), "image/png", 1),
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
