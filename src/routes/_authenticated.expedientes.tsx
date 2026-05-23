import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FolderArchive, Eye, Search } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ContractDetailModal } from "@/components/contract/ContractDetailModal";
import { listContracts, type SignedContract } from "@/lib/contracts";
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

function ExpedientesPage() {
  const [contracts] = useState<SignedContract[]>(() =>
    typeof window === "undefined" ? [] : listContracts(),
  );
  const [selected, setSelected] = useState<SignedContract | null>(null);
  const [query, setQuery] = useState("");

  const stats = useMemo(() => {
    const total = contracts.length;
    const monto = contracts.reduce((acc, c) => acc + c.data.amount, 0);
    const firmados = contracts.filter((c) => c.status === "Firmado").length;
    return { total, monto, firmados };
  }, [contracts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contracts;
    return contracts.filter(
      (c) =>
        c.folio.toLowerCase().includes(q) ||
        c.data.fullName.toLowerCase().includes(q),
    );
  }, [contracts, query]);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Operación</p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">Expedientes</h1>
          <p className="text-sm text-muted-foreground">
            Vista consolidada de los expedientes generados por el ecosistema Impulso Go.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Expedientes totales" value={stats.total.toString()} />
          <Metric label="Firmados" value={stats.firmados.toString()} />
          <Metric label="Monto acumulado" value={formatMXN(stats.monto)} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card-soft">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar expediente por folio o cliente…"
              className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-action focus:ring-2 focus:ring-action/15"
            />
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-action">
                <FolderArchive className="h-6 w-6" />
              </span>
              <h3 className="text-base font-black text-institutional">Sin expedientes registrados</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Cuando un cliente complete el portal de firma, su expediente aparecerá aquí con toda la evidencia técnica asociada.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((c) => (
                <li key={c.folio} className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-surface-alt">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface text-action">
                    <FolderArchive className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-bold text-institutional">{c.folio}</p>
                    <p className="truncate text-sm font-semibold text-foreground">{c.data.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatMXN(c.data.amount)} · {c.data.termYears} años · {new Date(c.signedAt).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(c)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold text-institutional hover:bg-accent"
                  >
                    <Eye className="h-3.5 w-3.5" /> Detalle
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <ContractDetailModal contract={selected} onClose={() => setSelected(null)} />
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
      <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black tabular-nums text-institutional">{value}</p>
    </div>
  );
}
