import { useMemo, useState } from "react";
import { ArrowRight, TrendingUp, Calendar, Wallet } from "lucide-react";
import {
  buildSimulationTable,
  calculateMonthlyPayment,
  formatMXN,
  type TermYears,
} from "@/lib/finance";
import { BRAND, INSTITUTION } from "@/lib/config";

const TERMS: TermYears[] = [2, 4, 6, 8];
const MIN = 10000;
const MAX = 250000;
const QUICK = [10000, 25000, 50000, 100000, 150000, 250000];

export function Simulator() {
  const [amount, setAmount] = useState(50000);
  const [years, setYears] = useState<TermYears>(4);

  const payment = useMemo(() => calculateMonthlyPayment(amount, years), [amount, years]);
  const rows = useMemo(() => buildSimulationTable(amount), [amount]);
  const percent = ((amount - MIN) / (MAX - MIN)) * 100;

  const whatsappMsg = encodeURIComponent(
    `Hola, realicé una simulación en ImpulsoGo:\n\nMonto: ${formatMXN(amount)}\nPlazo: ${years} años\nCuota estimada: ${formatMXN(payment.cuota)}\n\nQuiero recibir información sobre el proceso.`,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-finance">
      {/* Header */}
      <div className="gradient-brand px-6 py-5 text-white sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/75">
              Simulador financiero
            </p>
            <h3 className="mt-1.5 text-2xl font-black tracking-tight">
              Calcula una referencia clara
            </h3>
          </div>
          <span className="w-max rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur">
            {INSTITUTION.annualRatePercent}.00% anual fija
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_1.05fr]">
        {/* Inputs */}
        <div className="space-y-7 p-6 sm:p-8">
          <div>
            <div className="flex items-end justify-between gap-3">
              <label className="text-sm font-bold text-foreground" htmlFor="sim-amount">
                Monto del crédito
              </label>
              <input
                id="sim-amount"
                type="number"
                min={MIN}
                max={MAX}
                step={5000}
                value={amount}
                onChange={(e) => {
                  const v = Math.min(MAX, Math.max(MIN, Number(e.target.value) || MIN));
                  setAmount(Math.round(v / 5000) * 5000);
                }}
                className="h-10 w-32 rounded-md border border-border px-3 text-right text-sm font-black text-institutional outline-none focus:border-action focus:ring-2 focus:ring-action/20"
              />
            </div>
            <p className="mt-4 text-center text-5xl font-black tracking-tight text-institutional tabular-nums">
              {formatMXN(amount)}
            </p>

            <div className="relative mt-6 h-2.5 rounded-full bg-secondary">
              <div
                className="h-full rounded-full gradient-brand transition-[width] duration-150"
                style={{ width: `${percent}%` }}
              />
              <input
                aria-label="Monto"
                type="range"
                min={MIN}
                max={MAX}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="absolute inset-0 h-2.5 w-full cursor-pointer opacity-0"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold text-muted-foreground">
              <span>{formatMXN(MIN)}</span>
              <span>{formatMXN(MAX)}</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {QUICK.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className={`h-10 rounded-md border px-2 text-xs font-bold transition ${
                    amount === v
                      ? "border-action bg-surface text-action"
                      : "border-border bg-card text-muted-foreground hover:border-action/40 hover:text-foreground"
                  }`}
                >
                  {formatMXN(v)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-foreground">Plazo</label>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {TERMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setYears(t)}
                  className={`h-12 rounded-md text-sm font-black transition ${
                    years === t
                      ? "bg-institutional text-white shadow-card-soft"
                      : "bg-secondary text-foreground hover:bg-surface"
                  }`}
                >
                  {t} años
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="border-t border-border bg-surface-alt p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
            <Row icon={<Wallet className="h-4 w-4" />} label="Cuota mensual estimada">
              <strong className="text-3xl font-black text-institutional tabular-nums">
                {formatMXN(payment.cuota)}
              </strong>
            </Row>
            <hr className="my-4 border-border" />
            <Row icon={<TrendingUp className="h-4 w-4" />} label="Total estimado a pagar">
              <strong className="text-lg font-bold text-success tabular-nums">
                {formatMXN(payment.total)}
              </strong>
            </Row>
            <hr className="my-4 border-border" />
            <Row icon={<Calendar className="h-4 w-4" />} label="Plazo total">
              <strong className="text-base font-bold text-institutional">
                {payment.months} meses
              </strong>
            </Row>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-[0.7fr_1fr_1fr] bg-institutional text-center text-[10px] font-black uppercase tracking-[0.14em] text-white">
              <div className="px-3 py-3">Plazo</div>
              <div className="border-l border-white/10 px-3 py-3">Cuota</div>
              <div className="border-l border-white/10 px-3 py-3">Total</div>
            </div>
            {rows.map((r) => {
              const active = r.years === years;
              return (
                <button
                  key={r.years}
                  type="button"
                  onClick={() => setYears(r.years as TermYears)}
                  className={`grid w-full grid-cols-[0.7fr_1fr_1fr] border-t border-border text-center text-sm transition ${
                    active ? "bg-surface" : "hover:bg-surface-alt"
                  }`}
                >
                  <div className={`px-3 py-3 font-bold ${active ? "text-action" : "text-foreground"}`}>
                    {r.years} años
                  </div>
                  <div className="border-l border-border px-3 py-3 font-bold tabular-nums text-foreground">
                    {formatMXN(r.cuota)}
                  </div>
                  <div className="border-l border-border px-3 py-3 font-semibold tabular-nums text-muted-foreground">
                    {formatMXN(r.total)}
                  </div>
                </button>
              );
            })}
          </div>

          <a
            href={`${BRAND.whatsappUrl}&text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 text-sm font-bold text-white shadow-card-soft transition hover:bg-[#1fb957]"
          >
            Continuar por WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            La simulación es referencial. Toda operación está sujeta a evaluación
            crediticia y formalización contractual.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <span className="text-action">{icon}</span>
        {label}
      </span>
      {children}
    </div>
  );
}
