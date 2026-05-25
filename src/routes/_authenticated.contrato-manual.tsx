import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Printer, Download, FileText, Loader2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ContractManualDocument, type ManualContractInput } from "@/components/contract/ContractManualDocument";
import { exportNodeToPdf } from "@/lib/pdf-export";
import { generateFolio } from "@/lib/contracts";
import { formatMXN, type TermYears } from "@/lib/finance";
import { INSTITUTION } from "@/lib/config";

export const Route = createFileRoute("/_authenticated/contrato-manual")({
  head: () => ({
    meta: [
      { title: "Contrato manual — Impulso Go" },
      { name: "description", content: "Generador de contrato manual imprimible." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ContratoManualPage,
});

const TERMS: TermYears[] = [2, 4, 6, 8];

const schema = z.object({
  fullName: z.string().min(5, "Nombre completo requerido").max(120),
  curp: z.string().regex(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i, "CURP inválida"),
  rfc: z.string().regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i, "RFC inválido"),
  phone: z.string().regex(/^\d{10}$/, "10 dígitos"),
  address: z.string().min(10, "Domicilio completo requerido").max(240),
});

type FormValues = z.infer<typeof schema>;

function ContratoManualPage() {
  const [amount, setAmount] = useState(50000);
  const [termYears, setTermYears] = useState<TermYears>(4);
  const [doc, setDoc] = useState<ManualContractInput | null>(null);
  const [busy, setBusy] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
  });

  const onSubmit = handleSubmit((values) => {
    setDoc({
      folio: generateFolio(),
      fullName: values.fullName.trim(),
      curp: values.curp.toUpperCase(),
      rfc: values.rfc.toUpperCase(),
      phone: values.phone,
      address: values.address,
      amount,
      termYears,
      fecha: new Date().toISOString(),
    });
  });

  const downloadPdf = async () => {
    if (!docRef.current) return;
    setBusy(true);
    try {
      await exportNodeToPdf(docRef.current, `contrato-manual-${doc?.folio}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  const print = () => window.print();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl space-y-6 print-hide">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Módulo</p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">Contrato manual imprimible</h1>
          <p className="text-sm text-muted-foreground">
            Genera un contrato A4 listo para imprimir y firmar de forma autógrafa. No reemplaza el flujo digital con folio firmado en línea.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-card-soft sm:grid-cols-2"
        >
          <Field label="Nombre completo" error={errors.fullName?.message} className="sm:col-span-2">
            <input {...register("fullName")} className={inputCls} />
          </Field>
          <Field label="CURP" error={errors.curp?.message}>
            <input {...register("curp")} className={`${inputCls} uppercase`} maxLength={18} />
          </Field>
          <Field label="RFC" error={errors.rfc?.message}>
            <input {...register("rfc")} className={`${inputCls} uppercase`} maxLength={13} />
          </Field>
          <Field label="Teléfono" error={errors.phone?.message}>
            <input {...register("phone")} inputMode="numeric" maxLength={10} className={inputCls} />
          </Field>
          <Field label="Domicilio" error={errors.address?.message} className="sm:col-span-2">
            <textarea {...register("address")} className={`${inputCls} min-h-[80px] resize-y py-2.5`} />
          </Field>

          <div className="sm:col-span-2 rounded-xl border border-border bg-surface-alt p-5">
            <div className="flex items-end justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-action">Condiciones</h3>
              <span className="text-xs font-bold text-muted-foreground">
                Tasa fija {INSTITUTION.annualRatePercent}% anual
              </span>
            </div>
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Monto</label>
              <p className="mt-2 text-center text-3xl font-black tracking-tight text-institutional tabular-nums">
                {formatMXN(amount)}
              </p>
              <input
                type="range"
                min={10000}
                max={250000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-3 w-full accent-action"
              />
            </div>
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Plazo</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {TERMS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTermYears(t)}
                    className={`h-11 rounded-md text-sm font-black transition ${
                      termYears === t
                        ? "bg-institutional text-white shadow-card-soft"
                        : "bg-card text-foreground hover:bg-surface"
                    }`}
                  >
                    {t} años
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="sm:col-span-2 inline-flex h-12 items-center justify-center gap-2 rounded-md gradient-brand text-sm font-bold text-white shadow-card-soft hover:opacity-95"
          >
            <FileText className="h-4 w-4" />
            Generar contrato
          </button>
        </form>

        {doc && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-action">Listo</p>
                <p className="font-mono text-lg font-black text-institutional">{doc.folio}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={print}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-bold text-institutional hover:bg-accent"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir
                </button>
                <button
                  onClick={downloadPdf}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-md gradient-brand px-4 py-2 text-sm font-bold text-white shadow-card-soft disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Documento visible para impresión y referencia */}
      {doc && (
        <div className="mt-8 flex justify-center print-area">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft print:border-0 print:shadow-none print:rounded-none">
            <ContractManualDocument ref={docRef} data={doc} />
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

const inputCls =
  "h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground outline-none transition focus:border-action focus:ring-4 focus:ring-action/15";

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-semibold text-destructive" role="alert">{error}</p>}
    </div>
  );
}
