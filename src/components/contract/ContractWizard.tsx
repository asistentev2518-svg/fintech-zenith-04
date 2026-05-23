import { useState } from "react";
import { Check } from "lucide-react";
import { StepDatos } from "./StepDatos";
import { StepIdentidad } from "./StepIdentidad";
import { StepLectura } from "./StepLectura";
import { StepFirma } from "./StepFirma";
import { StepConfirmacion } from "./StepConfirmacion";
import {
  ACCEPTANCES,
  generateFolio,
  saveContract,
  technicalHash,
  type ContractData,
  type ContractIdentity,
  type SignedContract,
} from "@/lib/contracts";

const STEPS = [
  { n: 1, label: "Datos" },
  { n: 2, label: "Identidad" },
  { n: 3, label: "Contrato" },
  { n: 4, label: "Firma" },
  { n: 5, label: "Confirmación" },
] as const;

export function ContractWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ContractData | null>(null);
  const [identity, setIdentity] = useState<ContractIdentity | null>(null);
  const [signed, setSigned] = useState<SignedContract | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleSign = async (signatureDataUrl: string) => {
    if (!data || !identity) return;
    setGenerating(true);
    try {
      const folio = generateFolio();
      const signedAt = new Date().toISOString();
      const payload = JSON.stringify({ folio, data, signedAt, ua: navigator.userAgent });
      const hash = await technicalHash(payload);
      const contract: SignedContract = {
        folio,
        signedAt,
        data,
        identity,
        signatureDataUrl,
        hash,
        userAgent: navigator.userAgent,
        acceptances: [...ACCEPTANCES],
        status: "Firmado",
      };
      saveContract(contract);
      setSigned(contract);
      setStep(5);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <ol className="mb-10 flex items-center justify-between gap-2">
        {STEPS.map((s, i) => {
          const active = step === s.n;
          const done = step > s.n;
          return (
            <li key={s.n} className="flex flex-1 items-center gap-2">
              <span
                className={`grid h-9 w-9 flex-none place-items-center rounded-full text-xs font-black transition ${
                  done
                    ? "bg-success text-white"
                    : active
                      ? "gradient-brand text-white shadow-card-soft"
                      : "bg-surface text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : s.n}
              </span>
              <span className={`hidden text-xs font-bold sm:inline ${active ? "text-institutional" : "text-muted-foreground"}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className={`h-px flex-1 ${done ? "bg-success" : "bg-border"}`} />
              )}
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-finance sm:p-8">
        {step === 1 && (
          <StepDatos
            initial={data ?? undefined}
            onSubmit={(d) => {
              setData(d);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <StepIdentidad
            onSubmit={(id) => {
              setIdentity(id);
              setStep(3);
            }}
          />
        )}
        {step === 3 && data && (
          <StepLectura data={data} onSubmit={() => setStep(4)} />
        )}
        {step === 4 && data && (
          generating ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-action border-t-transparent" />
              <p className="text-sm font-bold text-muted-foreground">Generando folio y huella técnica…</p>
            </div>
          ) : (
            <StepFirma fullName={data.fullName} onSubmit={handleSign} />
          )
        )}
        {step === 5 && signed && <StepConfirmacion contract={signed} />}
      </div>
    </div>
  );
}
