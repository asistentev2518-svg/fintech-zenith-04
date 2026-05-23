import { useRef, useState } from "react";
import { Camera, Upload, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { IDENTITY_CONSENT_TEXT } from "./consent";
import type { ContractIdentity } from "@/lib/contracts";

type SlotKey = "ineFrontDataUrl" | "ineBackDataUrl" | "selfieDataUrl";

const SLOTS: { key: SlotKey; label: string; hint: string }[] = [
  { key: "ineFrontDataUrl", label: "INE — frente", hint: "Foto nítida del frente de tu identificación" },
  { key: "ineBackDataUrl", label: "INE — reverso", hint: "Reverso completo, sin reflejos" },
  { key: "selfieDataUrl", label: "Selfie", hint: "Rostro visible, buena iluminación" },
];

interface Props {
  onSubmit: (identity: ContractIdentity) => void;
}

export function StepIdentidad({ onSubmit }: Props) {
  const [imgs, setImgs] = useState<Record<SlotKey, string>>({
    ineFrontDataUrl: "",
    ineBackDataUrl: "",
    selfieDataUrl: "",
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!imgs.ineFrontDataUrl || !imgs.ineBackDataUrl || !imgs.selfieDataUrl) {
      setError("Sube las tres imágenes requeridas.");
      return;
    }
    if (!consent) {
      setError("Marca el consentimiento biométrico para continuar.");
      return;
    }
    onSubmit({ ...imgs, biometricConsent: true });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {SLOTS.map((s) => (
          <IdentitySlot
            key={s.key}
            label={s.label}
            hint={s.hint}
            value={imgs[s.key]}
            onChange={(v) => setImgs((prev) => ({ ...prev, [s.key]: v }))}
          />
        ))}
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface-alt p-5 transition hover:border-action/40">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-action"
        />
        <span className="text-xs leading-6 text-foreground">{IDENTITY_CONSENT_TEXT}</span>
      </label>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive">
          {error}
        </p>
      )}

      <button onClick={submit} type="button" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md gradient-brand text-sm font-bold text-white shadow-card-soft transition hover:opacity-95">
        Continuar a lectura del contrato
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function IdentitySlot({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
      <div className="border-b border-border bg-surface-alt px-4 py-2.5">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-institutional">{label}</p>
      </div>
      <div className="aspect-square bg-surface-alt">
        {value ? (
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <Camera className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-md gradient-brand text-xs font-bold text-white"
        >
          {value ? <RotateCcw className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
          {value ? "Cambiar" : "Capturar / subir"}
        </button>
        {value && (
          <span className="inline-flex h-9 items-center gap-1 rounded-md bg-success-light px-2 text-xs font-bold text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Listo
          </span>
        )}
      </div>
    </div>
  );
}
