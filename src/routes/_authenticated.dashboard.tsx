import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  TrendingUp,
  FileSignature,
  FolderArchive,
  CheckCircle2,
  ArrowUpRight,
  Clock3,
  Eye,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ContractDetailModal } from "@/components/contract/ContractDetailModal";
import { formatMXN } from "@/lib/finance";
import { listContracts, type SignedContract } from "@/lib/contracts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Resumen — Impulso Go" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const estadoStyles: Record<string, string> = {
  Firmado: "bg-success-light text-success",
  Pendiente: "bg-amber-50 text-amber-700",
  Cancelado: "bg-destructive/10 text-destructive",
};

function DashboardPage() {
  const [contracts] = useState<SignedContract[]>(() =>
    typeof window === "undefined" ? [] : listContracts(),
  );
  const [selected, setSelected] = useState<SignedContract | null>(null);

  const metrics = useMemo(() => {
    const total = contracts.length;
    const now = new Date();
    const mesMs = 30 * 24 * 60 * 60 * 1000;
    const mes = contracts.filter(
      (c) => now.getTime() - new Date(c.signedAt).getTime() < mesMs,
    ).length;
    const cartera = contracts.reduce((acc, c) => acc + c.data.amount, 0);
    const pendientes = contracts.filter((c) => c.status === "Pendiente").length;
    return [
      { label: "Expedientes activos", value: total.toString(), delta: total ? "+nuevo" : "—", icon: FolderArchive, tone: "action" },
      { label: "Contratos firmados (30d)", value: mes.toString(), delta: mes ? "+actualizado" : "—", icon: FileSignature, tone: "success" },
      { label: "Cartera vigente", value: formatMXN(cartera), delta: cartera ? "live" : "—", icon: TrendingUp, tone: "action" },
      { label: "Pendientes de revisión", value: pendientes.toString(), delta: pendientes ? "atención" : "0", icon: Clock3, tone: "warn" },
    ];
  }, [contracts]);

  const recent = contracts.slice(0, 6);

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
            Vista consolidada del estado de expedientes, contratos y cartera generada por el ecosistema.
          </p>
        </div>

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
                <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
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

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-base font-black text-institutional">Contratos recientes</h2>
                <p className="text-xs text-muted-foreground">
                  Últimos expedientes firmados desde el portal público
                </p>
              </div>
              <Link to="/contratos" className="text-xs font-bold text-action hover:underline">
                Ver todos
              </Link>
            </header>
            {recent.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-action">
                  <FileSignature className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-black text-institutional">Aún no hay contratos firmados</h3>
                <p className="max-w-sm text-xs text-muted-foreground">
                  Cuando un cliente complete el portal de firma, aparecerá automáticamente en esta lista.
                </p>
                <Link
                  to="/firma-contrato"
                  className="mt-1 inline-flex items-center gap-2 rounded-md gradient-brand px-3 py-1.5 text-xs font-bold text-white shadow-card-soft"
                >
                  Abrir portal de firma
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-3 text-left">Folio</th>
                      <th className="px-5 py-3 text-left">Cliente</th>
                      <th className="px-5 py-3 text-right">Monto</th>
                      <th className="px-5 py-3 text-left">Plazo</th>
                      <th className="px-5 py-3 text-left">Estado</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r) => (
                      <tr key={r.folio} className="border-b border-border last:border-0 hover:bg-surface-alt">
                        <td className="px-5 py-3.5 font-mono text-xs font-bold text-institutional">{r.folio}</td>
                        <td className="px-5 py-3.5 font-semibold text-foreground">{r.data.fullName}</td>
                        <td className="px-5 py-3.5 text-right font-bold tabular-nums text-foreground">
                          {formatMXN(r.data.amount)}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{r.data.termYears} años</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${estadoStyles[r.status]}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setSelected(r)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-bold text-institutional hover:bg-accent"
                          >
                            <Eye className="h-3 w-3" />
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                Atajos
              </p>
              <h3 className="mt-2 text-lg font-black">Operación rápida</h3>
              <div className="mt-4 grid gap-2">
                <Link to="/contratos" className="rounded-md bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/15">
                  → Buscar y reexportar contratos
                </Link>
                <Link to="/expedientes" className="rounded-md bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/15">
                  → Ver expedientes
                </Link>
                <Link to="/tablas" className="rounded-md bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/15">
                  → Tablas de montos
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ContractDetailModal contract={selected} onClose={() => setSelected(null)} />
    </DashboardShell>
  );
}
