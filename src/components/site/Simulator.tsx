import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Sparkles, TrendingDown, Calendar, Percent, Wallet } from "lucide-react";
import { calculateMonthlyPayment, formatMXN, type TermYears } from "@/lib/finance";
import { BRAND, INSTITUTION } from "@/lib/config";

const TERMS: TermYears[] = [2, 4, 6, 8];
const MIN = 10000;
const MAX = 250000;
const STEP = 10000;

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function Simulator() {
  const [amount, setAmount] = useState(50000);
  const [years, setYears] = useState<TermYears>(4);

  const { cuota, total, months, intereses } = useMemo(() => {
    const p = calculateMonthlyPayment(amount, years);
    return { ...p, intereses: p.total - amount };
  }, [amount, years]);

  const cuotaA = useCountUp(cuota);
  const totalA = useCountUp(total);

  // Ahorro vs banco tradicional (~12% anual)
  const bankRate = 0.12;
  const months12 = years * 12;
  const r12 = bankRate / 12;
  const cuotaBanco =
    (amount * r12) / (1 - Math.pow(1 + r12, -months12));
  const ahorro = Math.max(0, Math.round(cuotaBanco * months12 - total));

  const percent = ((amount - MIN) / (MAX - MIN)) * 100;

  const whatsappMsg = encodeURIComponent(
    `Hola, simulé en Impulso Go:\n\nMonto: ${formatMXN(amount)}\nPlazo: ${years} años\nCuota: ${formatMXN(cuota)}\nTotal: ${formatMXN(total)}\n\nQuiero continuar mi solicitud.`,
  );

  return (
    <div className="landing-glass mx-auto max-w-3xl rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">
        <Sparkles className="h-3.5 w-3.5" />
        Simulador interactivo
      </div>
      <h3 className="display mt-2 text-2xl font-extrabold text-white sm:text-3xl">
        Calcula tu crédito
      </h3>
      <p className="mt-1 text-sm text-[#9CA3AF]">
        Tasa anual fija {INSTITUTION.annualRatePercent}% · sin sorpresas
      </p>

      {/* Monto */}
      <div className="mt-6">
        <div className="flex items-end justify-between">
          <label className="text-sm font-semibold text-[#D1D5DB]" htmlFor="lp-amount">
            Monto del crédito
          </label>
          <span className="text-xs font-medium text-[#9CA3AF]">
            {formatMXN(MIN)} — {formatMXN(MAX)}
          </span>
        </div>
        <p className="display mt-3 text-center text-4xl font-extrabold tracking-tight text-white tabular-nums sm:text-5xl">
          {formatMXN(amount)}
        </p>
        <input
          id="lp-amount"
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="landing-range mt-4"
          style={{ ["--p" as never]: `${percent}%` }}
        />
      </div>

      {/* Plazo */}
      <div className="mt-6">
        <label className="text-sm font-semibold text-[#D1D5DB]">Plazo</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {TERMS.map((t) => {
            const active = years === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setYears(t)}
                className={`h-12 rounded-xl border text-sm font-bold transition ${
                  active
                    ? "border-transparent bg-[#3B82F6] text-white shadow-[0_0_18px_rgba(59,130,246,0.45)]"
                    : "border-white/10 bg-white/[0.04] text-[#D1D5DB] hover:border-white/25 hover:text-white"
                }`}
              >
                {t} años
              </button>
            );
          })}
        </div>
      </div>

      <div className="my-6 border-t border-white/10" />

      {/* Resultados grid 2/4 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ResultCard
          icon={<Wallet className="h-4 w-4" />}
          label="Cuota mensual"
          value={formatMXN(cuotaA)}
          color="text-[#10B981]"
        />
        <ResultCard
          icon={<TrendingDown className="h-4 w-4" />}
          label="Total a pagar"
          value={formatMXN(totalA)}
          color="text-white"
        />
        <ResultCard
          icon={<Calendar className="h-4 w-4" />}
          label="Plazo"
          value={`${months} meses`}
          color="text-white"
          size="sm"
        />
        <ResultCard
          icon={<Percent className="h-4 w-4" />}
          label="Tasa"
          value={`${INSTITUTION.annualRatePercent}%`}
          color="text-[#F59E0B]"
          size="sm"
        />
      </div>

      {/* Comparador */}
      <div className="mt-4 rounded-xl border border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.10)] p-3 text-sm text-[#FDE68A]">
        💡 <span className="font-semibold">Vs bancos tradicionales (~12% anual):</span> ahorro estimado{" "}
        <span className="font-bold text-white">{formatMXN(ahorro)}</span>{" "}
        <span className="text-[#9CA3AF]">· intereses {formatMXN(intereses)}</span>
      </div>

      <p className="mt-3 text-xs text-[#6B7280]">
        Simulación referencial. Sujeto a evaluación crediticia y formalización contractual.
      </p>

      <a
        href={`${BRAND.whatsappUrl}&text=${whatsappMsg}&utm_source=landing&utm_medium=simulator&utm_campaign=cta`}
        target="_blank"
        rel="noopener noreferrer"
        className="landing-cta-success mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition hover:opacity-95"
      >
        Continuar solicitud por WhatsApp
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function ResultCard({
  icon, label, value, color, size = "md",
}: {
  icon: React.ReactNode; label: string; value: string;
  color: string; size?: "sm" | "md";
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
        <span className="text-[#60A5FA]">{icon}</span>
        {label}
      </span>
      <p
        className={`mt-2 font-extrabold tabular-nums tracking-tight ${color} ${
          size === "sm" ? "text-lg" : "text-2xl sm:text-3xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
