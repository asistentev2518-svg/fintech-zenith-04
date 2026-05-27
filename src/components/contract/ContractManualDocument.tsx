import { forwardRef } from "react";
import { formatMXN, calculateMonthlyPayment, type TermYears } from "@/lib/finance";
import { INSTITUTION } from "@/lib/config";
import { ACCEPTANCES } from "@/lib/contracts";
import { CONTRACT_CLAUSES, DECLARACIONES_TEXT } from "./clauses";

export interface ManualContractInput {
  folio: string;
  fullName: string;
  curp: string;
  rfc: string;
  phone: string;
  address: string;
  amount: number;
  termYears: TermYears;
  fecha: string; // ISO
}

interface Props {
  data: ManualContractInput;
}

/**
 * Contrato A4 imprimible (firma física). Reutilizable para PDF.
 */
export const ContractManualDocument = forwardRef<HTMLDivElement, Props>(
  function ContractManualDocument({ data }, ref) {
    const payment = calculateMonthlyPayment(data.amount, data.termYears);
    const months = data.termYears * 12;
    const date = new Date(data.fecha);
    const fechaLarga = date.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });

    return (
      <div
        ref={ref}
        style={{
          width: 794,
          fontFamily: "Inter, Segoe UI, system-ui, sans-serif",
          color: "#172033",
          background: "#ffffff",
          padding: "48px 56px",
          fontSize: 11.5,
          lineHeight: 1.6,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "2px solid #06245C",
            paddingBottom: 14,
            marginBottom: 22,
          }}
        >
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "#1266D6", textTransform: "uppercase" }}>
              Contrato de financiamiento (manual)
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#06245C", margin: "6px 0 2px" }}>{INSTITUTION.legalName}</h1>
            <div style={{ fontSize: 10, color: "#475569" }}>{INSTITUTION.address}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Folio</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#06245C", fontFamily: "ui-monospace, monospace" }}>{data.folio}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>{fechaLarga}</div>
          </div>
        </div>

        <Section title="I. Partes del contrato">
          <p>
            En la Ciudad de México, a {fechaLarga}, comparecen por una parte <strong>{INSTITUTION.legalName}</strong>,
            en lo sucesivo <strong>"LA SOFOM"</strong>, representada por {INSTITUTION.representative},
            en su carácter de {INSTITUTION.representativeTitle}; y por la otra parte,{" "}
            <strong>{data.fullName.toUpperCase()}</strong>, en lo sucesivo <strong>"EL CLIENTE"</strong>,
            identificado con CURP {data.curp}, con domicilio en {data.address} y teléfono {data.phone}.
          </p>
        </Section>

        <Section title="II. Condiciones financieras">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
            <Cell label="Monto">{formatMXN(data.amount)}</Cell>
            <Cell label="Plazo">{data.termYears} años ({months} meses)</Cell>
            <Cell label="Tasa anual fija">{INSTITUTION.annualRatePercent}.00%</Cell>
            <Cell label="Cuota mensual estimada">{formatMXN(payment.cuota)}</Cell>
            <Cell label="Total estimado">{formatMXN(payment.total)}</Cell>
            <Cell label="Penalización mora">{INSTITUTION.penaltyPercent}%</Cell>
          </div>
        </Section>

        <Section title="III. Cláusulas">
          <Clause n="PRIMERA. Objeto.">
            LA SOFOM otorga a EL CLIENTE un financiamiento por {formatMXN(data.amount)}, pagadero en {months} mensualidades fijas.
          </Clause>
          <Clause n="SEGUNDA. Tasa.">
            Tasa ordinaria anual fija del {INSTITUTION.annualRatePercent}% sobre saldos insolutos.
          </Clause>
          <Clause n="TERCERA. Pago.">
            Cuota mensual de {formatMXN(payment.cuota)} en las fechas establecidas en el calendario.
          </Clause>
          <Clause n="CUARTA. Incumplimiento.">
            En caso de mora se aplicará una penalización del {INSTITUTION.penaltyPercent}% sobre el saldo vencido.
          </Clause>
          <Clause n="QUINTA. Datos personales.">
            EL CLIENTE consiente el tratamiento conforme al Aviso de Privacidad de LA SOFOM.
          </Clause>
          <Clause n="SEXTA. Firma autógrafa.">
            Las partes formalizan el presente mediante firma autógrafa, conservada como instrumento físico además del expediente electrónico.
          </Clause>
          <Clause n="SÉPTIMA. Jurisdicción.">
            Para la interpretación y cumplimiento las partes se someten a los tribunales competentes de {INSTITUTION.jurisdiction}.
          </Clause>
        </Section>

        <Section title="IV. Aceptaciones expresas">
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            {ACCEPTANCES.map((a, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{a}</li>
            ))}
          </ol>
        </Section>

        <Section title="V. Firmas autógrafas">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 28 }}>
            <SignatureBlock title="EL CLIENTE" name={data.fullName.toUpperCase()} />
            <SignatureBlock title="LA SOFOM" name={`${INSTITUTION.representative} — ${INSTITUTION.representativeTitle}`} />
          </div>
          <div style={{ marginTop: 28, fontSize: 10, color: "#475569" }}>
            Huella digital del cliente:
            <div style={{ marginTop: 6, height: 90, border: "1px dashed #94a3b8", borderRadius: 6 }} />
          </div>
        </Section>

        <div
          style={{
            marginTop: 24,
            paddingTop: 12,
            borderTop: "1px solid #e2e8f0",
            fontSize: 9,
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          Documento manual generado por {INSTITUTION.shortName} · Folio {data.folio} · {fechaLarga}
        </div>
      </div>
    );
  },
);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 12, fontWeight: 900, color: "#06245C", margin: "0 0 10px", letterSpacing: 0.2, textTransform: "uppercase" }}>
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

function Clause({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p style={{ margin: "0 0 10px" }}>
      <strong style={{ color: "#06245C" }}>{n}</strong> {children}
    </p>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#172033", marginTop: 2 }}>{children}</div>
    </div>
  );
}

function SignatureBlock({ title, name }: { title: string; name: string }) {
  return (
    <div>
      <div style={{ height: 70, borderBottom: "1.5px solid #172033" }} />
      <div style={{ marginTop: 6, fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: "#64748b", textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: "#06245C", marginTop: 2 }}>{name}</div>
    </div>
  );
}
