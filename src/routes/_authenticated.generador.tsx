import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Download, FileImage, Loader2, RefreshCw } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { defaultMaster, type MasterData } from "@/components/dashboard/shared";
import { ApprovalDoc } from "@/components/generator/approval-doc";
import { CancellationDoc } from "@/components/generator/cancellation-doc";
import { PolicyDoc } from "@/components/generator/policy-doc";
import { PrivacyDoc } from "@/components/generator/privacy-doc";
import { exportNodeToPng } from "@/lib/png-export";
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

type DocKind = "approval" | "cancellation" | "policy" | "privacy";

const DOC_META: Record<DocKind, { label: string; file: string; color: string }> = {
  approval:     { label: "Aprobación de crédito",  file: "aprobacion",     color: "var(--success)" },
  cancellation: { label: "Cancelación de crédito", file: "cancelacion",    color: "var(--danger)"  },
  policy:       { label: "Póliza de protección",   file: "poliza",         color: "var(--brand)"   },
  privacy:      { label: "Aviso de privacidad",    file: "aviso-privacidad", color: "var(--brand)" },
};

function GeneradorPage() {
  const [master, setMaster] = useState<MasterData>(defaultMaster);
  const [busy, setBusy] = useState<DocKind | null>(null);
  const refs = {
    approval: useRef<HTMLDivElement>(null),
    cancellation: useRef<HTMLDivElement>(null),
    policy: useRef<HTMLDivElement>(null),
    privacy: useRef<HTMLDivElement>(null),
  };

  const set = <K extends keyof MasterData>(k: K, v: MasterData[K]) =>
    setMaster((m) => ({ ...m, [k]: v }));

  const exportPng = async (kind: DocKind) => {
    const node = refs[kind].current;
    if (!node) return;
    setBusy(kind);
    try {
      await exportNodeToPng(node, `${DOC_META[kind].file}-${master.folio}.png`, 1080, 1350);
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
          <p className="mt-4 text-[11px] text-muted-foreground">
            Tasa anual fija {INSTITUTION.annualRatePercent}% · Cuota y total se calculan automáticamente con la fórmula oficial.
          </p>
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
                  disabled={busy === kind || !master.name}
                  className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-3 py-2 text-xs font-bold text-white shadow-card-soft disabled:opacity-50"
                  title={!master.name ? "Captura el nombre del titular" : "Descargar PNG"}
                >
                  {busy === kind ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  PNG
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
