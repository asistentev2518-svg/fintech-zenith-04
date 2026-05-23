import { createFileRoute } from "@tanstack/react-router";
import { TableProperties } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ALLOWED_TERMS, buildSimulationTable, formatMXN } from "@/lib/finance";
import { INSTITUTION } from "@/lib/config";

export const Route = createFileRoute("/_authenticated/tablas")({
  head: () => ({
    meta: [
      { title: "Tablas de montos — Impulso Go" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TablasPage,
});

const REFERENCE_AMOUNTS = [25000, 50000, 75000, 100000, 150000, 200000, 300000];

function TablasPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Referencia</p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">Tablas de montos</h1>
          <p className="text-sm text-muted-foreground">
            Cuotas mensuales referenciales sobre tasa fija anual del {INSTITUTION.annualRatePercent}%.
            Valores calculados con el mismo motor utilizado en el contrato firmado.
          </p>
        </header>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
          <header className="flex items-center gap-2 border-b border-border px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-surface text-action">
              <TableProperties className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-black text-institutional">Cuota mensual estimada</h2>
              <p className="text-xs text-muted-foreground">Plazos disponibles: {ALLOWED_TERMS.join(", ")} años</p>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 text-left">Monto</th>
                  {ALLOWED_TERMS.map((y) => (
                    <th key={y} className="px-5 py-3 text-right">{y} años</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REFERENCE_AMOUNTS.map((amount) => {
                  const rows = buildSimulationTable(amount);
                  return (
                    <tr key={amount} className="border-b border-border last:border-0 hover:bg-surface-alt">
                      <td className="px-5 py-3.5 font-bold text-institutional tabular-nums">{formatMXN(amount)}</td>
                      {rows.map((r) => (
                        <td key={r.years} className="px-5 py-3.5 text-right tabular-nums text-foreground">
                          {formatMXN(r.cuota)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          * Cifras informativas redondeadas al peso. La cuota definitiva se calcula al momento de la firma del contrato y queda registrada
          en la evidencia técnica del expediente.
        </p>
      </div>
    </DashboardShell>
  );
}
