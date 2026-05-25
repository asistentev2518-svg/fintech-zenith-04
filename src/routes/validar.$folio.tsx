import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, ShieldCheck, FileText } from "lucide-react";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { findContract, type SignedContract } from "@/lib/contracts";
import { formatMXN } from "@/lib/finance";

export const Route = createFileRoute("/validar/$folio")({
  head: ({ params }) => ({
    meta: [
      { title: `Validar contrato ${params.folio} — Impulso Go` },
      { name: "description", content: "Verificación pública de expediente firmado en Impulso Go." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ValidarPage,
});

function ValidarPage() {
  const { folio } = useParams({ from: "/validar/$folio" });
  const [contract, setContract] = useState<SignedContract | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setContract(findContract(folio));
    setChecked(true);
  }, [folio]);

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      <PublicHeader />
      <main className="flex-1 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-[11px] font-black uppercase tracking-[0.18em] text-action">
            Validación pública
          </p>
          <h1 className="mt-2 text-center text-3xl font-black tracking-tight text-institutional sm:text-4xl">
            Verificación de expediente
          </h1>

          {!checked ? (
            <div className="mt-10 grid place-items-center rounded-2xl border border-border bg-card p-12 shadow-card-soft">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-action border-t-transparent" />
            </div>
          ) : contract ? (
            <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-finance">
              <div className="border-b border-border bg-success-light px-6 py-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-success text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-success">Documento verificado</p>
                    <p className="text-xs text-success/80">
                      Expediente firmado y conservado por {`Impulso Go`}.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <Field label="Folio">
                  <span className="font-mono text-base font-black text-institutional">{contract.folio}</span>
                </Field>
                <Field label="Cliente">{contract.data.fullName}</Field>
                <Field label="Monto">{formatMXN(contract.data.amount)}</Field>
                <Field label="Plazo">{contract.data.termYears} años</Field>
                <Field label="Estado">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-2.5 py-1 text-[11px] font-bold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {contract.status}
                  </span>
                </Field>
                <Field label="Fecha de firma">
                  {new Date(contract.signedAt).toLocaleString("es-MX")}
                </Field>
                <Field label="Huella técnica">
                  <span className="break-all font-mono text-xs text-muted-foreground">{contract.hash}</span>
                </Field>
              </div>
              <div className="flex items-center gap-2 border-t border-border bg-surface-alt px-6 py-4 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                Esta verificación confirma la existencia y trazabilidad del expediente
                en la plataforma institucional.
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-card-soft">
              <span className="inline-grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-lg font-black text-institutional">Folio no encontrado</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                El folio <strong className="font-mono">{folio}</strong> no corresponde a
                ningún expediente registrado en este dispositivo.
              </p>
              <Link
                to="/firma-contrato"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-md gradient-brand px-5 text-sm font-bold text-white shadow-card-soft"
              >
                <FileText className="h-4 w-4" />
                Iniciar nuevo contrato
              </Link>
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0">
      <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-right font-bold text-foreground">{children}</dd>
    </div>
  );
}
