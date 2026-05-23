import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, FileSignature, Filter, Eye, Inbox } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ContractDetailModal } from "@/components/contract/ContractDetailModal";
import { listContracts, type SignedContract, type ContractStatus } from "@/lib/contracts";
import { formatMXN } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/contratos")({
  head: () => ({
    meta: [
      { title: "Contratos — Impulso Go" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContratosPage,
});

const STATUS_STYLES: Record<ContractStatus, string> = {
  Firmado: "bg-success-light text-success",
  Pendiente: "bg-amber-50 text-amber-700",
  Cancelado: "bg-destructive/10 text-destructive",
};

function ContratosPage() {
  const [contracts] = useState<SignedContract[]>(() =>
    typeof window === "undefined" ? [] : listContracts(),
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todos" | ContractStatus>("todos");
  const [selected, setSelected] = useState<SignedContract | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contracts.filter((c) => {
      if (status !== "todos" && c.status !== status) return false;
      if (!q) return true;
      return (
        c.folio.toLowerCase().includes(q) ||
        c.data.fullName.toLowerCase().includes(q) ||
        c.data.curp.toLowerCase().includes(q) ||
        c.data.rfc.toLowerCase().includes(q)
      );
    });
  }, [contracts, query, status]);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-1">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Módulo</p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">Contratos firmados</h1>
          <p className="text-sm text-muted-foreground">
            Expedientes generados desde el portal de firma electrónica. Consulta el detalle y reexporta el PDF cuando se requiera.
          </p>
        </header>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-card-soft sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por folio, nombre, CURP o RFC…"
              className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-action focus:ring-2 focus:ring-action/15"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {(["todos", "Firmado", "Pendiente", "Cancelado"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-md px-3 py-1.5 font-bold capitalize transition ${
                  status === s
                    ? "bg-institutional text-white"
                    : "bg-surface text-muted-foreground hover:bg-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
          {filtered.length === 0 ? (
            <EmptyState hasAny={contracts.length > 0} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-alt text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 text-left">Folio</th>
                    <th className="px-5 py-3 text-left">Cliente</th>
                    <th className="px-5 py-3 text-right">Monto</th>
                    <th className="px-5 py-3 text-left">Plazo</th>
                    <th className="px-5 py-3 text-left">Firmado</th>
                    <th className="px-5 py-3 text-left">Estado</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.folio} className="border-b border-border last:border-0 hover:bg-surface-alt">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-institutional">{c.folio}</td>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{c.data.fullName}</td>
                      <td className="px-5 py-3.5 text-right font-bold tabular-nums">{formatMXN(c.data.amount)}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{c.data.termYears} años</td>
                      <td className="px-5 py-3.5 text-muted-foreground text-xs">
                        {new Date(c.signedAt).toLocaleDateString("es-MX")}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[c.status]}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelected(c)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold text-institutional hover:bg-accent"
                        >
                          <Eye className="h-3.5 w-3.5" />
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
      </div>

      <ContractDetailModal contract={selected} onClose={() => setSelected(null)} />
    </DashboardShell>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-action">
        {hasAny ? <Inbox className="h-6 w-6" /> : <FileSignature className="h-6 w-6" />}
      </span>
      <h3 className="text-base font-black text-institutional">
        {hasAny ? "Sin resultados" : "Aún no hay contratos firmados"}
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {hasAny
          ? "Ajusta los filtros o limpia la búsqueda para ver más expedientes."
          : "Los contratos generados desde el portal público de firma aparecerán automáticamente en esta tabla."}
      </p>
      {!hasAny && (
        <a
          href="/firma-contrato"
          className="mt-2 inline-flex items-center gap-2 rounded-md gradient-brand px-4 py-2 text-sm font-bold text-white shadow-card-soft"
        >
          Abrir portal de firma
        </a>
      )}
    </div>
  );
}
