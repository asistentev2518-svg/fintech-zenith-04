import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  FileSignature,
  FolderArchive,
  CheckCircle2,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { formatMXN } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Resumen — Impulso Go" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const metrics = [
  { label: "Expedientes activos", value: "184", delta: "+12.4%", icon: FolderArchive, tone: "action" },
  { label: "Contratos firmados (mes)", value: "47", delta: "+8.1%", icon: FileSignature, tone: "success" },
  { label: "Cartera vigente", value: formatMXN(8460000), delta: "+3.2%", icon: TrendingUp, tone: "action" },
  { label: "Pendientes de revisión", value: "9", delta: "-2", icon: Clock3, tone: "warn" },
];

const recent = [
  { folio: "IG-2025-0184", cliente: "María López Hernández", monto: 75000, plazo: "4 años", estado: "Firmado" },
  { folio: "IG-2025-0183", cliente: "Roberto Sánchez Mora", monto: 120000, plazo: "6 años", estado: "Revisión" },
  { folio: "IG-2025-0182", cliente: "Andrea Vega Cortés", monto: 50000, plazo: "2 años", estado: "Firmado" },
  { folio: "IG-2025-0181", cliente: "Jorge Mendoza Ruiz", monto: 200000, plazo: "8 años", estado: "Pendiente" },
  { folio: "IG-2025-0180", cliente: "Lucía Ramos Espino", monto: 35000, plazo: "2 años", estado: "Firmado" },
];

const estadoStyles: Record<string, string> = {
  Firmado: "bg-success-light text-success",
  Revisión: "bg-surface text-action",
  Pendiente: "bg-amber-50 text-amber-700",
};

function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">
            Resumen operativo
          </p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">
            Buen día, equipo Impulso Go
          </h1>
          <p className="text-sm text-muted-foreground">
            Vista consolidada del estado de expedientes, contratos y cartera.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
              <div className="flex items-start justify-between">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-lg ${
                    m.tone === "success"
                      ? "bg-success-light text-success"
                      : m.tone === "warn"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-surface text-action"
                  }`}
                >
                  <m.icon className="h-5 w-5" />
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    m.delta.startsWith("-")
                      ? "bg-destructive/10 text-destructive"
                      : "bg-success-light text-success"
                  }`}
                >
                  <ArrowUpRight className="h-3 w-3" />
                  {m.delta}
                </span>
              </div>
              <p className="mt-4 text-2xl font-black tracking-tight text-institutional tabular-nums">
                {m.value}
              </p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Recent + side panel */}
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-base font-black text-institutional">Expedientes recientes</h2>
                <p className="text-xs text-muted-foreground">Últimos movimientos del sistema</p>
              </div>
              <button className="text-xs font-bold text-action hover:underline">Ver todos</button>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-alt text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 text-left">Folio</th>
                    <th className="px-5 py-3 text-left">Cliente</th>
                    <th className="px-5 py-3 text-right">Monto</th>
                    <th className="px-5 py-3 text-left">Plazo</th>
                    <th className="px-5 py-3 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.folio} className="border-b border-border last:border-0 hover:bg-surface-alt">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-institutional">{r.folio}</td>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{r.cliente}</td>
                      <td className="px-5 py-3.5 text-right font-bold tabular-nums text-foreground">
                        {formatMXN(r.monto)}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{r.plazo}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${estadoStyles[r.estado]}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {r.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
              <h3 className="text-base font-black text-institutional">Estado del sistema</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  ["Firmas digitales", "Operativo"],
                  ["Exportación PDF", "Operativo"],
                  ["Validación SIPRES", "Operativo"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between rounded-md bg-success-light/60 px-3 py-2.5">
                    <span className="font-semibold text-foreground">{k}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-institutional p-5 text-white shadow-card-soft">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/65">
                Próximo paso
              </p>
              <h3 className="mt-2 text-lg font-black">Construir módulos restantes</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Expedientes detallados, contratos manuales, generación PDF en alta
                resolución y administración de tablas — listos para la siguiente
                fase del proyecto.
              </p>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
