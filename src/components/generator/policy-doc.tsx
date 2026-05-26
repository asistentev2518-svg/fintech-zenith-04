import { forwardRef } from "react";
import { ShieldCheck, Check } from "lucide-react";
import { DocShell, FieldRow, SectionTitle } from "./doc-shell";
import { formatMoney, derive, type MasterData } from "@/components/dashboard/shared";

const COVERAGES = [
  "Fallecimiento por cualquier causa del titular.",
  "Invalidez total y permanente derivada de accidente o enfermedad.",
  "Desempleo involuntario (aplica a trabajadores asalariados).",
  "Saldo insoluto del crédito al momento del siniestro.",
];

export const PolicyDoc = forwardRef<HTMLDivElement, { master: MasterData }>(function PolicyDoc({ master }, ref) {
  const d = derive(master);
  const accent = "var(--brand)";
  return (
    <DocShell
      ref={ref}
      accent="brand"
      badge="PÓLIZA ACTIVA"
      title="CONSTANCIA DE PÓLIZA DE PROTECCIÓN CREDITICIA"
      subtitle="Carátula resumen de la póliza vinculada al expediente crediticio."
      folio={master.folio}
      emittedAt={master.emittedAt}
      city={master.city}
      folioCondusef={master.folioCondusef}
      watermark="PÓLIZA"
    >
      {/* Carátula */}
      <div
        style={{
          background: "white",
          border: "1px solid var(--hairline)",
          borderRadius: 14,
          padding: 24,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 20,
          alignItems: "center",
          boxShadow: "0 2px 12px rgba(11,42,91,0.05)",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Número de póliza</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: accent, marginTop: 4, letterSpacing: "0.04em" }}>{d.policyNumber}</div>
          <div style={{ marginTop: 10, fontSize: 13, color: "var(--ink-soft)" }}>Producto: <span style={{ color: "var(--ink)", fontWeight: 600 }}>Protección crediticia</span></div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Beneficiario: <span style={{ color: "var(--ink)", fontWeight: 600 }}>Impulso Go / entidad correspondiente</span></div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "oklch(0.42 0.13 145)", background: "var(--success-soft)", padding: "8px 14px", borderRadius: 999 }}>
            <ShieldCheck style={{ height: 14, width: 14 }} /> Estado: ACTIVA
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--ink-soft)" }}>Monto protegido</div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 22, color: "var(--ink)", fontFeatureSettings: '"tnum"' }}>{formatMoney(master.amount)}</div>
        </div>
      </div>

      {/* Datos del asegurado */}
      <div style={{ marginTop: 18 }}>
        <SectionTitle n={1} title="Datos del asegurado" accent={accent} />
        <div style={{ background: "white", border: "1px solid var(--hairline)", borderRadius: 12, padding: "8px 22px" }}>
          <FieldRow label="Nombre del titular" value={master.name} strong />
          <FieldRow label="RFC" value={d.rfc} mono />
          <FieldRow label="Sucursal" value={master.city} />
          <FieldRow label="Ejecutivo asignado" value={master.executive} />
        </div>
      </div>

      {/* Datos de la póliza */}
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "white", border: "1px solid var(--hairline)", borderRadius: 12, padding: "10px 18px" }}>
          <SectionTitle n={2} title="Datos de la póliza" accent={accent} />
          <FieldRow label="Crédito asociado" value={master.folio} mono />
          <FieldRow label="Plazo del crédito" value={`${master.termYears} años`} />
          <FieldRow label="Producto asociado" value="Protección crediticia" />
        </div>
        <div style={{ background: "white", border: "1px solid var(--hairline)", borderRadius: 12, padding: "10px 18px" }}>
          <SectionTitle n={3} title="Cobertura" accent={accent} />
          <FieldRow label="Tipo" value="Protección asociada al expediente crediticio" />
          <FieldRow label="Moneda" value="MXN" />
          <FieldRow label="Monto protegido" value={formatMoney(master.amount)} mono strong />
        </div>
      </div>

      {/* Coberturas incluidas */}
      <div style={{ marginTop: 14, background: "white", border: "1px solid var(--hairline)", borderRadius: 12, padding: "12px 18px" }}>
        <SectionTitle n={4} title="Coberturas incluidas" accent={accent} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {COVERAGES.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, color: "var(--ink)", lineHeight: 1.4 }}>
              <Check style={{ height: 14, width: 14, color: accent, marginTop: 1, flexShrink: 0 }} />
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vigencia visual */}
      <div style={{ marginTop: 14, background: "white", border: "1px solid var(--hairline)", borderRadius: 12, padding: "12px 18px" }}>
        <SectionTitle n={5} title="Vigencia" accent={accent} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
          <div style={{ textAlign: "center", minWidth: 110 }}>
            <div style={{ fontSize: 9, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Inicio</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>{d.validFrom}</div>
          </div>
          <div style={{ flex: 1, position: "relative", height: 8 }}>
            <div style={{ position: "absolute", inset: 0, background: "var(--hairline)", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "100%", background: accent, borderRadius: 4, opacity: 0.85 }} />
            <div style={{ position: "absolute", left: "50%", top: -22, transform: "translateX(-50%)", fontSize: 10, color: "var(--ink-soft)", fontWeight: 600 }}>
              {master.termYears} años de cobertura
            </div>
          </div>
          <div style={{ textAlign: "center", minWidth: 110 }}>
            <div style={{ fontSize: 9, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Vigente hasta</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: accent, marginTop: 2 }}>{d.validTo}</div>
          </div>
        </div>
      </div>

      <p style={{ marginTop: "auto", paddingTop: 14, fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5, margin: 0 }}>
        Este documento resume los datos principales de la póliza asociada al expediente crediticio. Las coberturas, exclusiones y condiciones aplicables se sujetan a los términos contratados y documentos vigentes.
      </p>
    </DocShell>
  );
});