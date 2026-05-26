import { forwardRef } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { DocShell, DocStamp, FieldRow, SectionTitle } from "./doc-shell";
import { formatMoney, derive, offerDeadline72h, type MasterData } from "@/components/dashboard/shared";

export const ApprovalDoc = forwardRef<HTMLDivElement, { master: MasterData }>(function ApprovalDoc({ master }, ref) {
  const d = derive(master);
  const accent = "var(--success)";
  const deadline = offerDeadline72h();
  return (
    <DocShell
      ref={ref}
      accent="success"
      badge="EXPEDIENTE APROBADO"
      title="CONSTANCIA DE APROBACIÓN DE CRÉDITO"
      subtitle={`Resultado de la evaluación crediticia para ${master.name || "el titular"}.`}
      folio={master.folio}
      emittedAt={master.emittedAt}
      city={master.city}
      folioCondusef={master.folioCondusef}
      watermark="APROBADO"
    >
      <DocStamp text="APROBADO" color={accent} />

      {/* Hero */}
      <div
        style={{
          background: "white",
          border: "1px solid var(--hairline)",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 2px 12px rgba(11,42,91,0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Monto aprobado</div>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: 64,
                lineHeight: 1,
                marginTop: 6,
                color: accent,
                letterSpacing: "-0.025em",
                fontFeatureSettings: '"tnum"',
              }}
            >
              {formatMoney(master.amount)}
            </div>
            <div style={{ marginTop: 14, fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>{master.name}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>RFC: <span style={{ color: "var(--ink)" }}>{d.rfc}</span></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "oklch(0.42 0.13 145)", background: "var(--success-soft)", padding: "6px 12px", borderRadius: 999 }}>
              <CheckCircle2 style={{ height: 14, width: 14 }} /> Dictamen aprobado
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-soft)" }}>Sucursal originadora</div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>{master.city}</div>
          </div>
        </div>
      </div>

      {/* Resumen financiero */}
      <div style={{ marginTop: 22 }}>
        <SectionTitle title="Resumen financiero" accent={accent} />
        <div style={{ background: "white", border: "1px solid var(--hairline)", borderRadius: 12, padding: "8px 22px" }}>
          <FieldRow label="Monto aprobado" value={formatMoney(master.amount)} mono strong />
          <FieldRow label="Comisión por apertura (cargo independiente)" value={formatMoney(master.commission)} mono />
          <FieldRow label="Plazo" value={`${master.termYears} años (${d.months} meses)`} />
          <FieldRow label="Tasa anual" value={`${d.annualRatePct.toFixed(2)}%`} mono />
          <FieldRow label="Pago mensual estimado" value={formatMoney(d.monthly)} mono />
          <FieldRow label="Total estimado a pagar" value={formatMoney(d.totalToPay)} mono strong />
        </div>
      </div>

      {/* Datos operativos */}
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "white", border: "1px solid var(--hairline)", borderRadius: 12, padding: "14px 18px" }}>
          <SectionTitle title="Cuenta de abono" accent={accent} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink)" }}>{d.accountMasked}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>CLABE {d.clabeMasked}</div>
        </div>
        <div style={{ background: "white", border: "1px solid var(--hairline)", borderRadius: 12, padding: "14px 18px" }}>
          <SectionTitle title="Ejecutivo asignado" accent={accent} />
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 700 }}>{master.executive}</div>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>Iniciales: <span style={{ fontWeight: 600 }}>{d.initials}</span></div>
        </div>
      </div>

      {/* Vigencia de la oferta */}
      <div
        style={{
          marginTop: 14,
          background: "var(--success-soft)",
          border: `1px solid ${accent}`,
          borderLeft: `4px solid ${accent}`,
          borderRadius: 12,
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Clock style={{ height: 20, width: 20, color: accent, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 12, color: accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Vigencia de la oferta · 72 horas máximo
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink)", marginTop: 2 }}>
            La presente aprobación deberá formalizarse antes del <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{deadline}</strong> (hora CDMX). Transcurrido este plazo, la oferta perderá vigencia.
          </div>
        </div>
      </div>

      {/* Texto institucional */}
      <div style={{ marginTop: "auto", paddingTop: 14 }}>
        <p style={{ fontSize: 12.5, color: "var(--ink)", lineHeight: 1.55, margin: 0 }}>
          Se informa que el expediente crediticio ha sido <strong>aprobado de forma preliminar</strong> conforme al proceso interno de validación de Impulso Go.
        </p>
        <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 6 }}>
          La presente constancia acredita el resultado preliminar del proceso interno de validación. La disposición del crédito queda sujeta a firma, validación documental y cumplimiento de condiciones aplicables.
        </p>
        {/* Firma simulada */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ textAlign: "center", minWidth: 220 }}>
            <div style={{ borderBottom: "1px solid var(--ink)", height: 28, fontFamily: "'Caveat', 'Manrope', cursive", fontSize: 22, color: "var(--ink)", fontStyle: "italic" }}>
              {master.executive}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 4, fontFamily: "'Manrope', sans-serif" }}>
              Ejecutivo asignado · {d.initials}
            </div>
          </div>
        </div>
      </div>
    </DocShell>
  );
});