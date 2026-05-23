import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { formatMXN, type TermYears } from "@/lib/finance";
import { INSTITUTION } from "@/lib/config";
import type { ContractData } from "@/lib/contracts";

const TERMS: TermYears[] = [2, 4, 6, 8];

const schema = z.object({
  fullName: z.string().min(5, "Nombre completo requerido"),
  curp: z.string().regex(/^[A-Z0-9]{18}$/i, "CURP de 18 caracteres"),
  rfc: z.string().regex(/^[A-Z0-9]{12,13}$/i, "RFC de 12 o 13 caracteres"),
  email: z.string().email("Correo inválido"),
  phone: z.string().regex(/^\d{10}$/, "10 dígitos"),
  address: z.string().min(10, "Domicilio completo requerido"),
  amount: z.number().min(10000).max(250000),
  termYears: z.union([z.literal(2), z.literal(4), z.literal(6), z.literal(8)]),
});

interface Props {
  initial?: Partial<ContractData>;
  onSubmit: (data: ContractData) => void;
}

export function StepDatos({ initial, onSubmit }: Props) {
  const [amount, setAmount] = useState(initial?.amount ?? 50000);
  const [termYears, setTermYears] = useState<TermYears>(initial?.termYears ?? 4);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      fullName: initial?.fullName ?? "",
      curp: initial?.curp ?? "",
      rfc: initial?.rfc ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      address: initial?.address ?? "",
      amount,
      termYears,
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      ...values,
      fullName: values.fullName.trim(),
      curp: values.curp.toUpperCase(),
      rfc: values.rfc.toUpperCase(),
      amount,
      termYears,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nombre completo" error={errors.fullName?.message} className="sm:col-span-2">
          <input {...register("fullName")} className={inputCls} placeholder="Como aparece en tu INE" />
        </FormField>
        <FormField label="CURP" error={errors.curp?.message}>
          <input {...register("curp")} className={`${inputCls} uppercase`} maxLength={18} />
        </FormField>
        <FormField label="RFC" error={errors.rfc?.message}>
          <input {...register("rfc")} className={`${inputCls} uppercase`} maxLength={13} />
        </FormField>
        <FormField label="Correo electrónico" error={errors.email?.message}>
          <input {...register("email")} type="email" className={inputCls} placeholder="nombre@correo.com" />
        </FormField>
        <FormField label="Teléfono (10 dígitos)" error={errors.phone?.message}>
          <input {...register("phone")} inputMode="numeric" className={inputCls} maxLength={10} />
        </FormField>
        <FormField label="Domicilio completo" error={errors.address?.message} className="sm:col-span-2">
          <textarea {...register("address")} className={`${inputCls} min-h-[80px] resize-y py-2.5`} />
        </FormField>
      </div>

      <div className="rounded-xl border border-border bg-surface-alt p-5">
        <div className="flex items-end justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-action">
            Condiciones solicitadas
          </h3>
          <span className="text-xs font-bold text-muted-foreground">
            Tasa fija {INSTITUTION.annualRatePercent}% anual
          </span>
        </div>

        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Monto solicitado</label>
          <p className="mt-2 text-center text-4xl font-black tracking-tight text-institutional tabular-nums">{formatMXN(amount)}</p>
          <input
            type="range"
            min={10000}
            max={250000}
            step={5000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full accent-action"
          />
          <div className="mt-1 flex justify-between text-[11px] font-semibold text-muted-foreground">
            <span>$10,000</span>
            <span>$250,000</span>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Plazo</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTermYears(t)}
                className={`h-11 rounded-md text-sm font-black transition ${
                  termYears === t
                    ? "bg-institutional text-white shadow-card-soft"
                    : "bg-card text-foreground hover:bg-surface"
                }`}
              >
                {t} años
              </button>
            ))}
          </div>
        </div>
      </div>

      <button type="submit" className={btnPrimary}>
        Continuar
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

const inputCls =
  "h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground outline-none transition focus:border-action focus:ring-4 focus:ring-action/15";

const btnPrimary =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-md gradient-brand text-sm font-bold text-white shadow-card-soft transition hover:opacity-95";

function FormField({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}
