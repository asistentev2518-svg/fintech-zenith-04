import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AlertTriangle, Check, FileText, Loader2, RefreshCw } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { defaultMaster, type MasterData } from "@/components/dashboard/shared";
import { ApprovalDoc } from "@/components/generator/approval-doc";
import { CancellationDoc } from "@/components/generator/cancellation-doc";
import { PolicyDoc } from "@/components/generator/policy-doc";
import { PrivacyDoc } from "@/components/generator/privacy-doc";
import { exportInstitutionalPdf } from "@/lib/pdf-vector";
import { INSTITUTION } from "@/lib/config";
import type { TermYears } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/generador")({
  head: () => ({
    meta: [
      { title: "Generador de documentos — Impulso Go" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: GeneradorPage,
});

const TERMS: TermYears[] = [2, 4, 6, 8];

type DocKind = "aprobacion" | "cancelacion" | "poliza" | "privacidad";

const DOC_META: Record<DocKind, { label: string; color: string }> = {
  aprobacion:  { label: "Constancia de aprobación",   color: "var(--success)" },
  cancelacion: { label: "Notificación de cancelación", color: "var(--danger)" },
  poliza:      { label: "Póliza de protección",        color: "var(--brand)" },
  privacidad:  { label: "Aviso de privacidad",         color: "var(--brand)" },
};

function GeneradorPage() {
  const [master, setMaster] = useState<MasterData>(defaultMaster);
  const [busy, setBusy] = useState<DocKind | null>(null);
  const [done, setDone] = useState<DocKind | null>(null);
  const refs = {
    aprobacion: useRef<HTMLDivElement>(null),
    cancelacion: useRef<HTMLDivElement>(null),
    poliza: useRef<HTMLDivElement>(null),
    privacidad: useRef<HTMLDivElement>(null),
  };

  const set = <K extends keyof MasterData>(k: K, v: MasterData[K]) =>
    setMaster((m) => ({ ...m, [k]: v }));

  const required = useMemo(() => {
    const fields = [
      master.folio,
      master.folioCondusef,
      master.city,
      master.name,
      master.executive,
      master.amount > 0 ? "ok" : "",
      master.termYears ? "ok" : "",
      master.emittedAt,
    ];
    const filled = fields.filter((v) => String(v).trim().length > 0).length;
    return { filled, total: fields.length, pct: Math.round((filled / fields.length) * 100) };
  }, [master]);
  const missing = !master.name || !master.folio || !master.amount;

  const exportPdf = async (kind: DocKind) => {
    setBusy(kind);
    setDone(null);
    try {
      await Promise.resolve(exportInstitutionalPdf(kind, master));
      setDone(kind);
      setTimeout(() => setDone((d) => (d === kind ? null : d)), 3000);
    } finally {
      setBusy(null);
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Herramienta</p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">Generador de documentos</h1>
          <p className="text-sm text-muted-foreground">
            Genera imágenes PNG institucionales (1080×1350) listas para enviar al cliente. Edita los datos y descarga el documento que necesites.
          </p>
        </header>

        {/* Formulario maestro */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-institutional">Datos del expediente</h2>
            <button
              onClick={() => setMaster(defaultMaster())}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-accent"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Nuevo folio
            </button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Folio">
              <input value={master.folio} onChange={(e) => set("folio", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Folio CONDUSEF / SIPRES">
              <input value={master.folioCondusef} onChange={(e) => set("folioCondusef", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Sucursal / Ciudad">
              <input value={master.city} onChange={(e) => set("city", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Nombre del titular" className="sm:col-span-2">
              <input value={master.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Nombre completo" />
            </Field>
            <Field label="Ejecutivo asignado">
              <select
                value={master.executive}
                onChange={(e) => set("executive", e.target.value)}
                className={inputCls}
              >
                <option value="Ely Garcia">Ely Garcia</option>
                <option value="Adela Tapia">Adela Tapia</option>
                <option value="Maritza Lopez">Maritza Lopez</option>
              </select>
            </Field>
            <Field label="Monto aprobado (MXN)">
              <input
                type="number"
                min={10000}
                step={5000}
                value={master.amount}
                onChange={(e) => set("amount", Number(e.target.value) || 0)}
                className={inputCls}
              />
            </Field>
            <Field label="Plazo (años)">
              <div className="mt-1 grid grid-cols-4 gap-1.5">
                {TERMS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("termYears", t)}
                    className={`h-10 rounded-md text-sm font-black transition ${
                      master.termYears === t
                        ? "bg-institutional text-white"
                        : "bg-surface text-foreground hover:bg-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Comisión por apertura (MXN)">
              <input
                type="number"
                min={0}
                value={master.commission}
                onChange={(e) => set("commission", Number(e.target.value) || 0)}
                className={inputCls}
              />
            </Field>
            <Field label="Fecha de emisión (visible)">
              <input value={master.emittedAt} onChange={(e) => set("emittedAt", e.target.value)} className={inputCls} />
            </Field>
          </div>
          <div className="mt-5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Tasa anual fija {INSTITUTION.annualRatePercent}% · Cuota y total se calculan automáticamente.</span>
            <span className="font-bold tabular-nums">{required.filled} / {required.total} campos completados</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
            <div
              className="h-full rounded-full bg-action transition-all duration-500"
              style={{ width: `${required.pct}%` }}
            />
          </div>
          {missing && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>Completa los campos obligatorios (titular, folio y monto) antes de descargar los documentos.</span>
            </div>
          )}
        </section>

        {/* Grid de docs */}
        <section className="grid gap-6 lg:grid-cols-2">
          {(Object.keys(DOC_META) as DocKind[]).map((kind) => (
            <article key={kind} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
              <header className="flex items-center justify-between gap-3 border-b border-border bg-surface-alt px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-md text-white" style={{ background: DOC_META[kind].color }}>
                    <FileImage className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-institutional">{DOC_META[kind].label}</h3>
                    <p className="text-[11px] text-muted-foreground">1080 × 1350 px · PNG</p>
                  </div>
                </div>
                <button
                  onClick={() => exportPng(kind)}
                  disabled={busy === kind || missing}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold text-white shadow-card-soft transition disabled:opacity-50 ${
                    done === kind ? "bg-emerald-600" : "gradient-brand"
                  }`}
                  title={missing ? "Completa los campos obligatorios" : "Descargar PNG"}
                >
                  {busy === kind ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : done === kind ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  {done === kind ? "¡Listo!" : busy === kind ? "Generando..." : "PNG"}
                </button>
              </header>
              <div className="overflow-auto bg-surface-alt p-4" style={{ maxHeight: 560 }}>
                <div style={{ transform: "scale(0.42)", transformOrigin: "top left", width: 1080, height: 1350 }}>
                  {kind === "approval"     && <ApprovalDoc     ref={refs.approval}     master={master} />}
                  {kind === "cancellation" && <CancellationDoc ref={refs.cancellation} master={master} />}
                  {kind === "policy"       && <PolicyDoc       ref={refs.policy}       master={master} />}
                  {kind === "privacy"      && <PrivacyDoc      ref={refs.privacy}      master={master} />}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}

const inputCls =
  "h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-action focus:ring-4 focus:ring-action/15";

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
