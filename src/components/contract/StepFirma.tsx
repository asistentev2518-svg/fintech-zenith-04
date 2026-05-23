import { useState } from "react";
import { PenLine, ArrowRight } from "lucide-react";
import { SignaturePadField } from "./SignaturePadField";

interface Props {
  fullName: string;
  onSubmit: (signatureDataUrl: string) => void;
}

export function StepFirma({ fullName, onSubmit }: Props) {
  const [signature, setSignature] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface-alt p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-lg gradient-brand text-white">
            <PenLine className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-black text-institutional">Firma de aceptación</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Firma con tu nombre completo: <strong className="text-foreground">{fullName}</strong>.
              Esta firma queda asociada al folio, fecha, dispositivo y huella técnica del expediente.
            </p>
          </div>
        </div>
      </div>

      <SignaturePadField onChange={setSignature} />

      <button
        type="button"
        disabled={!signature}
        onClick={() => signature && onSubmit(signature)}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md gradient-brand text-sm font-bold text-white shadow-card-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {signature ? "Generar contrato firmado" : "Firma para continuar"}
        {signature && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
}
