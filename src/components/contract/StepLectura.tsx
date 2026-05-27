import { useState } from "react";
import { ArrowRight, ScrollText } from "lucide-react";
import { ACCEPTANCES, type ContractData } from "@/lib/contracts";
import { INSTITUTION } from "@/lib/config";
import { calculateMonthlyPayment, formatMXN } from "@/lib/finance";
import { CONTRACT_CLAUSES, DECLARACIONES_TEXT } from "./clauses";

interface Props {
  data: ContractData;
  onSubmit: () => void;
}

export function StepLectura({ data, onSubmit }: Props) {
  const [checks, setChecks] = useState<boolean[]>(Array(ACCEPTANCES.length).fill(false));
  const payment = calculateMonthlyPayment(data.amount, data.termYears);
  const allChecked = checks.every(Boolean);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card shadow-card-soft">
        <div className="flex items-center gap-2.5 border-b border-border bg-surface-alt px-5 py-3">
          <ScrollText className="h-4 w-4 text-action" />
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-institutional">
            Contrato de financiamiento
          </p>
        </div>
        <div className="max-h-[440px] overflow-y-auto p-6 text-sm leading-7 text-foreground/85">
          <h3 className="text-base font-black text-institutional">
            {INSTITUTION.legalName}
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">{INSTITUTION.address}</p>

          <h4 className="mt-5 text-sm font-black text-institutional">I. Partes</h4>
          <p className="mt-2">
            Comparecen <strong>{INSTITUTION.legalName}</strong>, representada por{" "}
            {INSTITUTION.representative}, y <strong>{data.fullName}</strong>, con CURP{" "}
            {data.curp.toUpperCase()} y RFC {data.rfc.toUpperCase()}.
          </p>

          <h4 className="mt-5 text-sm font-black text-institutional">II. Condiciones financieras</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li>· Monto: <strong>{formatMXN(data.amount)}</strong></li>
            <li>· Plazo: <strong>{data.termYears} años</strong> ({data.termYears * 12} meses)</li>
            <li>· Tasa anual fija: <strong>{INSTITUTION.annualRatePercent}%</strong></li>
            <li>· Cuota mensual estimada: <strong>{formatMXN(payment.cuota)}</strong></li>
            <li>· Total estimado: <strong>{formatMXN(payment.total)}</strong></li>
          </ul>

          <h4 className="mt-5 text-sm font-black text-institutional">III. Declaraciones</h4>
          <p className="mt-2 text-sm">{DECLARACIONES_TEXT}</p>

          <h4 className="mt-5 text-sm font-black text-institutional">IV. Cláusulas</h4>
          {CONTRACT_CLAUSES.map((c) => (
            <div key={c.n} className="mt-3">
              <p className="text-sm font-bold text-institutional">{c.n} {c.title}</p>
              {c.paragraphs.map((p, i) => (
                <p key={i} className="mt-1 text-sm">{p}</p>
              ))}
            </div>
          ))}

          <p className="mt-6 text-xs text-muted-foreground">
            El texto completo del contrato y sus anexos se conservan en el PDF
            institucional generado al finalizar el proceso.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {ACCEPTANCES.map((text, i) => (
          <label key={i} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition hover:border-action/40">
            <input
              type="checkbox"
              checked={checks[i]}
              onChange={(e) => {
                const next = [...checks];
                next[i] = e.target.checked;
                setChecks(next);
              }}
              className="mt-0.5 h-4 w-4 flex-none accent-action"
            />
            <span className="text-xs leading-6 text-foreground">{text}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!allChecked}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md gradient-brand text-sm font-bold text-white shadow-card-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {allChecked ? "Continuar a firma" : `Acepta los ${ACCEPTANCES.length} apartados para continuar`}
        {allChecked && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
}
