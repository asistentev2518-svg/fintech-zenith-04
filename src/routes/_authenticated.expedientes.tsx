import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FolderArchive, Eye, Search, Filter } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { listContracts, type SignedContract, type ContractStatus } from "@/lib/contracts";
import { formatMXN } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/expedientes")({
  head: () => ({
    meta: [
      { title: "Expedientes — Impulso Go" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExpedientesPage,
});

const PAGE_SIZE = 10;
const STATUSES: (ContractStatus | "Todos")[] = ["Todos", "Firmado", "Pendiente", "Cancelado"];

function ExpedientesPage() {
  const [contracts] = useState<SignedContract[]>(() =>
    typeof window === "undefined" ? [] : listContracts(),
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("Todos");
  const [page, setPage] = useState(0);

  const stats = useMemo(() => {
    const total = contracts.length;
    const monto = contracts.reduce((a, c) => a + c.data.amount, 0);
    const firmados = contracts.filter((c) => c.status === "Firmado").length;
    return { total, monto, firmados };
  }, [contracts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contracts.filter((c) => {
      if (status !== "Todos" && c.status !== status) return false;
      if (!q) return true;
      return (
        c.folio.toLowerCase().includes(q) ||
        c.data.fullName.toLowerCase().includes(q) ||
        c.data.curp.toLowerCase().includes(q)
      );
    });
  }, [contracts, query, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const slice = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Operación</p>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Expedientes</h1>
          <p className="text-sm text-muted-foreground">
            Vista consolidada de los expedientes generados por el ecosistema Impulso Go.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Expedientes totales" value={stats.total.toString()} />
          <Metric label="Firmados" value={stats.firmados.toString()} />
          <Metric label="Monto acumulado" value={formatMXN(stats.monto)} />
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card-soft">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Buscar por folio, cliente o CURP…"
              className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-action focus:ring-[3px] focus:ring-action/15"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-background p-1">
            <Filter className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
            {STATUSES.map((s) => {
              const active = status === s;
              return (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setPage(0);
                  }}
                  className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                    active ? "bg-action text-[#050A14]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
          {slice.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-action">
                <FolderArchive className="h-6 w-6" />
              </span>
              <h3 className="text-base font-black text-foreground">Sin expedientes que coincidan</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Ajusta los filtros o limpia la búsqueda. Los expedientes firmados desde el portal aparecerán aquí en tiempo real.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-surface-alt">
                  <tr className="border-b border-border text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 text-left">Folio</th>
                    <th className="px-5 py-3 text-left">Cliente</th>
                    <th className="px-5 py-3 text-right">Monto</th>
                    <th className="px-5 py-3 text-left">Plazo</th>
                    <th className="px-5 py-3 text-left">Firmado</th>
                    <th className="px-5 py-3 text-left">Estado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {slice.map((c) => (
                    <tr key={c.folio} className="border-b border-border/60 last:border-0 hover:bg-surface-alt">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-action">{c.folio}</td>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{c.data.fullName}</td>
                      <td className="px-5 py-3.5 text-right font-bold tabular-nums">{formatMXN(c.data.amount)}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{c.data.termYears} años</td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {new Date(c.signedAt).toLocaleDateString("es-MX")}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to="/expedientes/$folio"
                          params={{ folio: c.folio }}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-bold hover:border-action hover:text-action"
                        >
                          <Eye className="h-3.5 w-3.5" /> Detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <span>
                Mostrando {current * PAGE_SIZE + 1}-{Math.min((current + 1) * PAGE_SIZE, filtered.length)} de{" "}
                {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={current === 0}
                  className="rounded-md border border-border px-3 py-1.5 font-bold disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="px-3 font-bold text-foreground">
                  {current + 1} / {pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                  disabled={current >= pages - 1}
                  className="rounded-md border border-border px-3 py-1.5 font-bold disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
      <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black tabular-nums text-foreground">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: ContractStatus }) {
  const tone =
    status === "Firmado"
      ? "bg-success-light text-success"
      : status === "Pendiente"
        ? "bg-amber-500/10 text-amber-500"
        : "bg-destructive/15 text-destructive";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
