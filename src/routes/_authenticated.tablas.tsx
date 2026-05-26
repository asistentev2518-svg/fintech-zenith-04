import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Download, Loader2, TableProperties } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ALLOWED_TERMS, buildSimulationTable, formatMXN } from "@/lib/finance";
import { INSTITUTION, ASSETS } from "@/lib/config";
import { exportNodeToPng } from "@/lib/png-export";

export const Route = createFileRoute("/_authenticated/tablas")({
  head: () => ({
    meta: [
      { title: "Tabla de montos — Impulso Go" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TablasPage,
});

function TablasPage() {
  const [amount, setAmount] = useState(10000);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const rows = buildSimulationTable(amount);

  const exportPng = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      await exportNodeToPng(ref.current, `tabla-montos-${amount}.png`, 1080, 1080);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Herramienta</p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">Tabla de montos referenciales</h1>
          <p className="text-sm text-muted-foreground">
            Selecciona un monto y descarga una imagen 1080×1080 con la tabla de cuotas (plazos {ALLOWED_TERMS.join(", ")} años, tasa fija {INSTITUTION.annualRatePercent}% anual).
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Monto a calcular</label>
              <p className="mt-2 text-4xl font-black tracking-tight text-institutional tabular-nums">{formatMXN(amount)}</p>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-3 w-full accent-action"
              />
            </div>
            <button
              onClick={exportPng}
              disabled={busy}
              className="inline-flex h-12 items-center gap-2 rounded-md gradient-brand px-5 text-sm font-bold text-white shadow-card-soft disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Descargar PNG
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface-alt p-4 shadow-card-soft">
          <div className="overflow-auto">
            <div style={{ transform: "scale(0.55)", transformOrigin: "top left", width: 1080, height: 1080 }}>
              <TablaCard ref={ref} amount={amount} rows={rows} />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

import { forwardRef } from "react";

const TablaCard = forwardRef<HTMLDivElement, { amount: number; rows: ReturnType<typeof buildSimulationTable> }>(
  function TablaCard({ amount, rows }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1080,
          background: "linear-gradient(135deg, #f4f8ff 0%, #ffffff 60%, #eaf2ff 100%)",
          fontFamily: "'Inter', sans-serif",
          padding: 56,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 100%, rgba(18,102,214,0.10), transparent 60%)" }} />
        <header style={{ position: "relative", display: "flex", alignItems: "center", gap: 18 }}>
          <img src={ASSETS.logo} alt="Impulso Go" style={{ height: 96, width: 96, objectFit: "contain" }} />
          <div style={{ textAlign: "right", flex: 1 }}>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 36, color: "#0B2A5B", letterSpacing: "-0.02em" }}>
              TABLA DE MONTOS
            </div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 22, color: "#1266D6", letterSpacing: "0.06em", marginTop: 2 }}>
              REFERENCIALES
            </div>
          </div>
        </header>

        <div
          style={{
            position: "relative",
            marginTop: 28,
            background: "linear-gradient(90deg, #0B2A5B 0%, #1266D6 100%)",
            color: "white",
            borderRadius: 18,
            padding: "22px 30px",
            textAlign: "center",
            boxShadow: "0 12px 28px rgba(11,42,91,0.25)",
          }}
        >
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 44, letterSpacing: "-0.01em" }}>
            {formatMXN(amount)} <span style={{ color: "#FACC15" }}>a {INSTITUTION.annualRatePercent}%</span> ANUAL
          </div>
        </div>

        <div style={{ position: "relative", marginTop: 36, background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 18px 40px rgba(11,42,91,0.10)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.4fr", background: "#0B2A5B", color: "white" }}>
            {["AÑOS", "CUOTA", "MONTO FINAL"].map((h, i) => (
              <div key={h} style={{ padding: "22px 0", textAlign: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", borderLeft: i ? "1px solid rgba(255,255,255,0.15)" : undefined }}>
                {h}
              </div>
            ))}
          </div>
          {rows.map((r, idx) => (
            <div
              key={r.years}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr 1.4fr",
                borderTop: "1px solid #eaf0f9",
                background: idx % 2 ? "#f7faff" : "white",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", padding: "26px 0" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  minWidth: 140, padding: "12px 22px",
                  background: "linear-gradient(135deg, #1266D6 0%, #0B2A5B 100%)",
                  color: "white", borderRadius: 999,
                  fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: "0.02em",
                  boxShadow: "0 6px 18px rgba(18,102,214,0.35)",
                }}>{r.years}</span>
              </div>
              <div style={{ textAlign: "center", padding: "26px 0", fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 40, color: "#1266D6", fontFeatureSettings: '"tnum"' }}>
                {formatMXN(r.cuota)}
              </div>
              <div style={{ textAlign: "center", padding: "26px 0", fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 40, color: "#16a34a", fontFeatureSettings: '"tnum"' }}>
                {formatMXN(r.total)}
              </div>
            </div>
          ))}
        </div>

        <footer style={{ position: "absolute", left: 56, right: 56, bottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#64748b", fontSize: 14 }}>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>
            {INSTITUTION.shortName} · Tasa anual fija {INSTITUTION.annualRatePercent}%
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={ASSETS.condusef} alt="CONDUSEF" style={{ height: 36, width: 36, objectFit: "contain" }} />
            <img src={ASSETS.sipres} alt="SIPRES" style={{ height: 36, width: 36, objectFit: "contain" }} />
            <span style={{ fontSize: 12 }}>Registro SIPRES / CONDUSEF</span>
          </div>
        </footer>
      </div>
    );
  },
);
