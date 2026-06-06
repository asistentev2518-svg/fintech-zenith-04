import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Download, Home, ShieldCheck, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { SignedContract } from "@/lib/contracts";
import { exportSignedContractPdf } from "@/lib/contract-pdf";
import { formatMXN } from "@/lib/finance";

interface Props {
  contract: SignedContract;
}

export function StepConfirmacion({ contract }: Props) {
  const [qr, setQr] = useState<string>("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const url = `${window.location.origin}/validar/${contract.folio}`;
    QRCode.toDataURL(url, { width: 256, margin: 1, color: { dark: "#06245C", light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [contract.folio]);

  const downloadPdf = async () => {
    setExporting(true);
    try {
      await exportSignedContractPdf(contract);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-success/30 bg-gradient-to-br from-success-light to-card p-8 text-center">
        <span className="inline-grid h-14 w-14 place-items-center rounded-full bg-success text-white shadow-card-soft">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-institutional">
          Contrato firmado correctamente
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          El expediente quedó conservado con folio, fecha y huella técnica de generación.
        </p>

        <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-xl border border-border bg-card px-6 py-4">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            Folio del expediente
          </span>
          <span className="mt-1 font-mono text-2xl font-black text-institutional">
            {contract.folio}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <h3 className="text-sm font-black text-institutional">Resumen</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Cliente">{contract.data.fullName}</Row>
            <Row label="Monto">{formatMXN(contract.data.amount)}</Row>
            <Row label="Plazo">{contract.data.termYears} años</Row>
            <Row label="Fecha">{new Date(contract.signedAt).toLocaleString("es-MX")}</Row>
            <Row label="Huella">{contract.hash.slice(0, 16)}…</Row>
          </dl>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            Verificación pública
          </p>
          {qr ? (
            <img src={qr} alt="QR de validación" className="my-3 h-32 w-32" />
          ) : (
            <div className="my-3 grid h-32 w-32 place-items-center rounded bg-surface-alt">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          <Link
            to="/validar/$folio"
            params={{ folio: contract.folio }}
            className="inline-flex items-center gap-1 text-xs font-bold text-action hover:underline"
          >
            /validar/{contract.folio}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={downloadPdf}
          disabled={exporting}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md gradient-brand text-sm font-bold text-white shadow-card-soft transition hover:opacity-95 disabled:opacity-60"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {exporting ? "Generando PDF…" : "Descargar PDF institucional"}
        </button>
        <Link
          to="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-card px-6 text-sm font-bold text-institutional hover:bg-accent"
        >
          <Home className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        Expediente conservado como mensaje de datos conforme a la legislación aplicable.
      </p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-1.5 last:border-0">
      <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-right font-bold text-foreground">{children}</dd>
    </div>
  );
}
