import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, ExternalLink, FileText, Loader2 } from "lucide-react";
import type { SignedContract } from "@/lib/contracts";
import { exportSignedContractPdf } from "@/lib/contract-pdf";
import { formatMXN } from "@/lib/finance";

interface Props {
  contract: SignedContract | null;
  onClose: () => void;
}

export function ContractDetailModal({ contract, onClose }: Props) {
  const [qr, setQr] = useState<string>("");
  const [busy, setBusy] = useState<"pdf" | null>(null);

  useEffect(() => {
    if (!contract) return;
    const url = `${window.location.origin}/validar/${contract.folio}`;
    QRCode.toDataURL(url, { width: 240, margin: 1 }).then(setQr).catch(() => setQr(""));
  }, [contract]);

  if (!contract) return null;

  const reexport = async () => {
    setBusy("pdf");
    try {
      await exportSignedContractPdf(contract);
    } finally {
      setBusy(null);
    }
  };

  const date = new Date(contract.signedAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-action">Detalle de contrato</p>
            <h2 className="font-mono text-lg font-black text-institutional">{contract.folio}</h2>
            <p className="text-xs text-muted-foreground">{contract.data.fullName}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
            <Field label="Monto">{formatMXN(contract.data.amount)}</Field>
            <Field label="Plazo">{contract.data.termYears} años</Field>
            <Field label="Estado"><span className="rounded-full bg-success-light px-2 py-0.5 text-xs font-bold text-success">{contract.status}</span></Field>
            <Field label="CURP"><span className="font-mono text-xs">{contract.data.curp}</span></Field>
            <Field label="RFC"><span className="font-mono text-xs">{contract.data.rfc}</span></Field>
            <Field label="Teléfono">{contract.data.phone}</Field>
            <Field label="Firmado">{date.toLocaleString("es-MX")}</Field>
            <Field label="Huella técnica"><span className="break-all font-mono text-[10px]">{contract.hash}</span></Field>
          </dl>

          <div className="mt-5 rounded-lg border border-border bg-surface-alt p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-institutional">
              <FileText className="h-4 w-4 text-action" />
              Validación pública
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Cualquier tercero puede verificar este expediente en línea con el folio o el QR del contrato.
            </p>
            <a
              href={`/validar/${contract.folio}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-action hover:underline"
            >
              /validar/{contract.folio} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-border bg-surface-alt px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-bold text-foreground hover:bg-accent"
          >
            Cerrar
          </button>
          <button
            onClick={exportPng}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-bold text-institutional hover:bg-accent disabled:opacity-60"
          >
            {busy === "png" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            Exportar PNG
          </button>
          <button
            onClick={reexport}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-md gradient-brand px-4 py-2 text-sm font-bold text-white shadow-card-soft disabled:opacity-60"
          >
            {busy === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Reexportar PDF
          </button>
        </footer>

        {/* Hidden render targets for html2canvas */}
        <div style={{ position: "fixed", left: -10000, top: 0 }} aria-hidden>
          <ContractDocument ref={docRef} contract={contract} qrDataUrl={qr || undefined} />
          <ContractCardInstitutional ref={cardRef} contract={contract} qrDataUrl={qr || undefined} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold text-foreground">{children}</dd>
    </div>
  );
}
