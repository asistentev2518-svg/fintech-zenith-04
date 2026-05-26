import { forwardRef } from "react";
import { AlertTriangle, Gavel, ShieldAlert, Phone, Home, Building2 } from "lucide-react";
import { DocShell, DocStamp, FieldRow, SectionTitle } from "./doc-shell";
import { formatMoney, derive, type MasterData } from "@/components/dashboard/shared";

const CONSEQUENCES = [
  { icon: ShieldAlert, title: "Reporte a Buró de Crédito y veto financiero", desc: "Queja formal ante entidades de la federación y solicitud de veto en todos los sistemas financieros nacionales." },
  { icon: Gavel, title: "Penalización 10% exigible", desc: "Cobro del 10% del valor del préstamo solicitado por solicitar el servicio y no disponer de él." },
  { icon: Home, title: "Visita domiciliaria de oficial", desc: "En el transcurso de la semana acudirá un oficial al domicilio registrado para notificación formal." },
  { icon: Building2, title: "Citación ante tribunal", desc: "Se indicará la fecha en la que el titular deberá presentarse ante el tribunal correspondiente." },
];

export const CancellationDoc = forwardRef<HTMLDivElement, { master: MasterData }>(function CancellationDoc({ master }, ref) {
  const d = derive(master);
  const accent = "var(--danger)";
  return (
    <DocShell
      ref={ref}
      accent="danger"
      badge="NOTIFICACIÓN FORMAL"
      title="NOTIFICACIÓN FORMAL DE CANCELACIÓN DE CRÉDITO"
      subtitle="Comunicado de cancelación del expediente crediticio y obligaciones derivadas."
      folio={master.folio}
      emittedAt={master.emittedAt}
      city={master.city}
      folioCondusef={master.folioCondusef}
      watermark="CANCELADO"
    >
      <DocStamp text="CANCELADO" color={accent} />

      {/* Comunicado principal */}
      <div
        style={{
          background: "white",
          border: `1px solid ${accent}`,
          borderLeft: `5px solid ${accent}`,
          borderRadius: 12,
          padding: "20px 24px",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>Comunicado oficial</div>
        <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>
          Se notifica que el expediente crediticio <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{master.folio}</strong>, a nombre de <strong>{master.name}</strong>, ha sido marcado como <strong style={{ color: accent }}>CANCELADO</strong> por incumplimiento de las condiciones operativas y contractuales aplicables al proceso de originación.
        </p>
      </div>

      {/* Detalle del adeudo */}
      <div style={{ marginTop: 18 }}>
        <SectionTitle title="Detalle del adeudo" accent={accent} />
        <div style={{ background: "white", border: "1px solid var(--hairline)", borderRadius: 12, padding: "8px 22px" }}>
          <FieldRow label="Titular" value={master.name} />
          <FieldRow label="RFC" value={d.rfc} mono />
          <FieldRow label="Cuenta asociada" value={d.accountMasked} mono />
          <FieldRow label="Plazo original" value={`${master.termYears} años`} />
          <FieldRow label="Monto original aprobado" value={formatMoney(master.amount)} mono />
          <FieldRow label="Penalización contractual (10%)" value={formatMoney(d.penalty)} mono color={accent} />
          <FieldRow label="ADEUDO TOTAL EXIGIBLE" value={formatMoney(d.totalDue)} mono strong color={accent} />
        </div>
      </div>

      {/* Notificación de acciones inmediatas */}
      <div
        style={{
          marginTop: 18,
          background: "var(--danger-soft)",
          border: `1px solid ${accent}`,
          borderLeft: `5px solid ${accent}`,
          borderRadius: 12,
          padding: "16px 22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle style={{ height: 18, width: 18, color: accent }} />
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 14, color: accent, letterSpacing: "0.08em" }}>NOTIFICACIÓN DE ACCIONES INMEDIATAS</div>
        </div>
        <p style={{ marginTop: 8, marginBottom: 8, fontSize: 12.5, color: "var(--ink)", lineHeight: 1.5 }}>
          Derivado de la cancelación del contrato, se procederá con las siguientes acciones:
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "var(--ink)", lineHeight: 1.55 }}>
          <li style={{ marginBottom: 4 }}>
            <strong>Reporte inmediato ante las entidades de la federación</strong>, principalmente Buró de Crédito, mediante queja formal y solicitud de <strong>veto a todos los sistemas financieros nacionales</strong>.
          </li>
          <li style={{ marginBottom: 4 }}>
            <strong>Cobro del 10% del valor del préstamo solicitado</strong> (<span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatMoney(d.penalty)}</span>) por haber solicitado el servicio y no disponer de él.
          </li>
          <li>
            <strong>Notificación domiciliaria</strong> a cargo de oficial adscrito en el transcurso de la semana, indicando la fecha en que el titular deberá presentarse ante el tribunal correspondiente.
          </li>
        </ol>
        <p style={{ marginTop: 10, marginBottom: 0, fontSize: 12, color: accent, fontWeight: 700, lineHeight: 1.4 }}>
          La empresa cuenta con la totalidad de la información del titular y procederá con la penalización conforme a lo establecido.
        </p>
      </div>

      {/* Consecuencias */}
      <div style={{ marginTop: 14 }}>
        <SectionTitle title="Consecuencias del incumplimiento" accent={accent} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {CONSEQUENCES.map((c, i) => (
            <div key={i} style={{ background: "white", border: "1px solid var(--hairline)", borderLeft: `3px solid ${accent}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <c.icon style={{ height: 16, width: 16, color: accent, marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, color: "var(--ink)" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.4, marginTop: 2 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canal de atención */}
      <div style={{ marginTop: "auto", paddingTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "var(--ink-soft)" }}>
          <Phone style={{ height: 12, width: 12, color: accent }} />
          Canal de atención a través del ejecutivo asignado: <span style={{ color: "var(--ink)", fontWeight: 600 }}>{master.executive}</span> · Sucursal {master.city}.
        </div>
        {/* Firma simulada */}
        <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ textAlign: "center", minWidth: 220 }}>
            <div style={{ borderBottom: "1px solid var(--ink)", height: 28, fontFamily: "'Caveat', 'Manrope', cursive", fontSize: 22, color: "var(--ink)", fontStyle: "italic" }}>
              {master.executive}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 4, fontFamily: "'Manrope', sans-serif" }}>
              Ejecutivo notificador · {d.initials}
            </div>
          </div>
        </div>
      </div>
    </DocShell>
  );
});