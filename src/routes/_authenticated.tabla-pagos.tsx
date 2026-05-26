import { createFileRoute } from "@tanstack/react-router";
import { forwardRef, useRef, useState } from "react";
import { Download, Loader2, CalendarRange } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ALLOWED_TERMS, calculateMonthlyPayment, formatMXN, type TermYears } from "@/lib/finance";
import { INSTITUTION, ASSETS } from "@/lib/config";
import { exportNodeToPng } from "@/lib/png-export";

export const Route = createFileRoute("/_authenticated/tabla-pagos")({
  head: () => ({
    meta: [
      { title: "Tabla de pagos — Impulso Go" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TablaPagosPage,
});

function TablaPagosPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [amount, setAmount] = useState(50000);
  const [years, setYears] = useState<TermYears>(4);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const exportPng = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      await exportNodeToPng(ref.current, `tabla-pagos-${lastName || "cliente"}.png`, 1080, 1350);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Herramienta</p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">Tabla de pagos del cliente</h1>
          <p className="text-sm text-muted-foreground">
            Captura los datos del cliente y descarga su calendario de amortización como imagen PNG institucional.
          </p>
        </header>

        <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-card-soft sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Nombre"><input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} /></Field>
          <Field label="Apellido"><input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} /></Field>
          <Field label="Monto (MXN)">
            <input type="number" min={10000} step={5000} value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className={inputCls} />
          </Field>
          <Field label="Plazo (años)">
            <div className="mt-1 grid grid-cols-4 gap-1">
              {ALLOWED_TERMS.map((t) => (
                <button key={t} type="button" onClick={() => setYears(t)} className={`h-10 rounded-md text-sm font-black transition ${years === t ? "bg-institutional text-white" : "bg-surface text-foreground hover:bg-accent"}`}>{t}</button>
              ))}
            </div>
          </Field>
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              onClick={exportPng}
              disabled={busy || !firstName || !lastName}
              className="inline-flex h-12 items-center gap-2 rounded-md gradient-brand px-5 text-sm font-bold text-white shadow-card-soft disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Descargar PNG 1080×1350
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface-alt p-4 shadow-card-soft">
          <div className="overflow-auto">
            <div style={{ transform: "scale(0.45)", transformOrigin: "top left", width: 1080, height: 1350 }}>
              <PaymentScheduleDoc ref={ref} firstName={firstName} lastName={lastName} amount={amount} years={years} />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

const inputCls =
  "h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-action focus:ring-4 focus:ring-action/15";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

interface DocProps { firstName: string; lastName: string; amount: number; years: TermYears }

const PaymentScheduleDoc = forwardRef<HTMLDivElement, DocProps>(function PaymentScheduleDoc({ firstName, lastName, amount, years }, ref) {
  const pay = calculateMonthlyPayment(amount, years);
  const months = years * 12;
  const monthlyRate = INSTITUTION.annualRatePercent / 100 / 12;
  const now = new Date();
  let balance = amount;
  const rows: { n: number; date: string; interest: number; principal: number; balance: number }[] = [];
  for (let i = 1; i <= months; i++) {
    const interest = Math.round(balance * monthlyRate);
    const principal = pay.cuota - interest;
    balance = Math.max(0, balance - principal);
    const d = new Date(now.getFullYear(), now.getMonth() + i, now.getDate());
    rows.push({
      n: i,
      date: d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
      interest,
      principal,
      balance,
    });
  }
  const showRows = months <= 48 ? rows : rows.filter((r) => r.n % 2 === 1 || r.n === months);

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1350,
        background: "white",
        fontFamily: "'Inter', sans-serif",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: 10, background: "linear-gradient(90deg, #0B2A5B 0%, #1266D6 100%)" }} />
      <header style={{ padding: "30px 56px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={ASSETS.logo} alt="Impulso Go" style={{ height: 56, width: 56, objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 22, color: "#0B2A5B" }}>Impulso Go</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Calendario de pagos</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 28, color: "#0B2A5B", letterSpacing: "-0.01em" }}>TABLA DE PAGOS</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#64748b", marginTop: 2 }}>
            {new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </div>
      </header>

      <div style={{ padding: "20px 56px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#f7faff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Cliente</div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 26, marginTop: 4, color: "#0B2A5B" }}>
            {firstName || "—"} {lastName || ""}
          </div>
        </div>
        <div style={{ background: "linear-gradient(90deg, #0B2A5B 0%, #1266D6 100%)", color: "white", borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Pago mensual</div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 32, marginTop: 4, fontFeatureSettings: '"tnum"' }}>{formatMXN(pay.cuota)}</div>
        </div>
      </div>

      <div style={{ padding: "0 56px 8px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <Stat label="Monto" value={formatMXN(amount)} />
        <Stat label="Plazo" value={`${years} años`} />
        <Stat label="Tasa anual" value={`${INSTITUTION.annualRatePercent}%`} />
        <Stat label="Total a pagar" value={formatMXN(pay.total)} accent />
      </div>

      <div style={{ padding: "10px 56px 0", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden", border: "1px solid #e2e8f0", borderRadius: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr 1.1fr", background: "#0B2A5B", color: "white" }}>
            {["#", "Fecha", "Interés", "Capital", "Saldo"].map((h, i) => (
              <div key={h} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: i ? "right" : "center", borderLeft: i ? "1px solid rgba(255,255,255,0.12)" : undefined }}>{h}</div>
            ))}
          </div>
          {showRows.map((r, idx) => (
            <div key={r.n} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr 1.1fr", background: idx % 2 ? "#f7faff" : "white", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              <div style={{ padding: "6px 8px", textAlign: "center", color: "#64748b", fontWeight: 700 }}>{r.n}</div>
              <div style={{ padding: "6px 12px", textAlign: "right" }}>{r.date}</div>
              <div style={{ padding: "6px 12px", textAlign: "right", color: "#dc2626" }}>{formatMXN(r.interest)}</div>
              <div style={{ padding: "6px 12px", textAlign: "right", color: "#16a34a" }}>{formatMXN(r.principal)}</div>
              <div style={{ padding: "6px 12px", textAlign: "right", color: "#0B2A5B", fontWeight: 700 }}>{formatMXN(r.balance)}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ padding: "16px 56px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#64748b", fontSize: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={ASSETS.condusef} alt="CONDUSEF" style={{ height: 28, width: 28, objectFit: "contain" }} />
          <img src={ASSETS.sipres} alt="SIPRES" style={{ height: 28, width: 28, objectFit: "contain" }} />
          <span>Registro CONDUSEF · SIPRES</span>
        </div>
        <span>{INSTITUTION.legalName}</span>
      </footer>
    </div>
  );
});

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: accent ? "#0B2A5B" : "white", color: accent ? "white" : "#0f172a", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 18, marginTop: 2, fontFeatureSettings: '"tnum"' }}>{value}</div>
    </div>
  );
}
