import { forwardRef } from "react";
import { formatMXN, calculateMonthlyPayment } from "@/lib/finance";
import { INSTITUTION } from "@/lib/config";
import type { SignedContract } from "@/lib/contracts";
import { ACCEPTANCES } from "@/lib/contracts";

interface Props {
  contract: SignedContract;
  qrDataUrl?: string;
}

/**
 * Documento legal exportable. Ancho fijo A4 (794px) para PDF estable.
 * Sin animaciones, sin sombras pesadas — todo controlado para html2canvas.
 */
export const ContractDocument = forwardRef<HTMLDivElement, Props>(
  function ContractDocument({ contract, qrDataUrl }, ref) {
    const { data, folio, signedAt, hash, signatureDataUrl, identity } = contract;
    const payment = calculateMonthlyPayment(data.amount, data.termYears);
    const months = data.termYears * 12;
    const date = new Date(signedAt);
    const fechaLarga = date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const amortRows = Array.from({ length: months }, (_, i) => {
      const n = i + 1;
      const balance = data.amount - payment.cuota * i * 0.6; // ilustrativo
      return { n, balance: Math.max(0, balance) };
    }).filter((r) => r.n === 1 || r.n === 12 || r.n === 24 || r.n === 36 || r.n === months);

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
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #06245C", paddingBottom: 14, marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "#1266D6", textTransform: "uppercase" }}>
              Contrato de financiamiento
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#06245C", margin: "6px 0 2px", letterSpacing: -0.3 }}>
              {INSTITUTION.legalName}
            </h1>
            <div style={{ fontSize: 10, color: "#475569" }}>{INSTITUTION.address}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Folio</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#06245C", fontFamily: "ui-monospace, monospace" }}>{folio}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>{fechaLarga}</div>
          </div>
        </div>

        {/* Partes */}
        <Section title="I. Partes del contrato">
          <p>
            En la Ciudad de México, a {fechaLarga}, comparecen por una parte{" "}
            <strong>{INSTITUTION.legalName}</strong>, en lo sucesivo <strong>"LA SOFOM"</strong>,
            representada por {INSTITUTION.representative}, en su carácter de {INSTITUTION.representativeTitle};
            y por la otra parte, <strong>{data.fullName.toUpperCase()}</strong>, en lo sucesivo{" "}
            <strong>"EL CLIENTE"</strong>, identificado con CURP {data.curp} y RFC {data.rfc},
            con domicilio en {data.address} y teléfono {data.phone}.
          </p>
        </Section>

        {/* Condiciones */}
        <Section title="II. Condiciones financieras">
          <Grid>
            <Cell label="Monto del crédito">{formatMXN(data.amount)}</Cell>
            <Cell label="Plazo">{data.termYears} años ({months} meses)</Cell>
            <Cell label="Tasa anual fija">{INSTITUTION.annualRatePercent}.00%</Cell>
            <Cell label="Cuota mensual estimada">{formatMXN(payment.cuota)}</Cell>
            <Cell label="Total estimado a pagar">{formatMXN(payment.total)}</Cell>
            <Cell label="Penalización por incumplimiento">{INSTITUTION.penaltyPercent}%</Cell>
          </Grid>
        </Section>

        {/* Cláusulas */}
        <Section title="III. Cláusulas">
          <Clause n="PRIMERA. Objeto.">
            LA SOFOM otorga a EL CLIENTE un financiamiento por la cantidad de {formatMXN(data.amount)},
            que se obliga a pagar en {months} mensualidades fijas conforme a las condiciones aquí pactadas.
          </Clause>
          <Clause n="SEGUNDA. Tasa de interés.">
            Las partes acuerdan una tasa de interés ordinaria anual fija del{" "}
            {INSTITUTION.annualRatePercent}%, calculada sobre saldos insolutos.
          </Clause>
          <Clause n="TERCERA. Forma de pago.">
            EL CLIENTE se obliga a cubrir puntualmente cada mensualidad por la cantidad de{" "}
            {formatMXN(payment.cuota)} en las fechas establecidas en el calendario de pagos.
          </Clause>
          <Clause n="CUARTA. Incumplimiento.">
            En caso de mora se generará una penalización equivalente al {INSTITUTION.penaltyPercent}%
            sobre el saldo vencido, sin perjuicio de las acciones legales aplicables.
          </Clause>
          <Clause n="QUINTA. Tratamiento de datos.">
            EL CLIENTE consiente el tratamiento de su información personal, identificación oficial
            e imagen facial conforme al Aviso de Privacidad publicado por LA SOFOM.
          </Clause>
          <Clause n="SEXTA. Firma electrónica.">
            Las partes reconocen plena validez a la firma electrónica capturada en este expediente,
            así como a la evidencia técnica (folio, fecha, dispositivo, huella de generación) como
            parte integral del contrato y medio de prueba.
          </Clause>
          <Clause n="SÉPTIMA. Jurisdicción.">
            Para la interpretación y cumplimiento del presente contrato, las partes se someten a la
            jurisdicción de los tribunales competentes de {INSTITUTION.jurisdiction}.
          </Clause>
        </Section>

        {/* Tabla referencial */}
        <Section title="IV. Tabla referencial de saldos">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
            <thead>
              <tr style={{ background: "#06245C", color: "#fff" }}>
                <th style={th}>Mes</th>
                <th style={th}>Cuota</th>
                <th style={th}>Saldo referencial</th>
              </tr>
            </thead>
            <tbody>
              {amortRows.map((r) => (
                <tr key={r.n}>
                  <td style={td}>{r.n}</td>
                  <td style={td}>{formatMXN(payment.cuota)}</td>
                  <td style={td}>{formatMXN(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Aceptaciones */}
        <Section title="V. Aceptaciones expresas">
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            {ACCEPTANCES.map((a, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{a}</li>
            ))}
          </ol>
        </Section>

        {/* Firma + identidad */}
        <Section title="VI. Firma y evidencia técnica">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>Firma del cliente</div>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: 8, background: "#fff" }}>
                <img src={signatureDataUrl} alt="Firma" style={{ width: "100%", height: 110, objectFit: "contain" }} />
              </div>
              <div style={{ marginTop: 6, fontSize: 10, fontWeight: 700, color: "#06245C" }}>{data.fullName}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>Validación de identidad</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                <IdImg label="INE frente" src={identity.ineFrontDataUrl} />
                <IdImg label="INE reverso" src={identity.ineBackDataUrl} />
                <IdImg label="Selfie" src={identity.selfieDataUrl} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, padding: 12, border: "1px solid #e2e8f0", borderRadius: 6, background: "#f8fafc" }}>
            <Grid>
              <Cell label="Folio">{folio}</Cell>
              <Cell label="Fecha y hora">{date.toLocaleString("es-MX")}</Cell>
              <Cell label="Huella técnica">{hash}</Cell>
              <Cell label="Validación pública">/validar/{folio}</Cell>
            </Grid>
          </div>

          {qrDataUrl && (
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <img src={qrDataUrl} alt="QR de validación" style={{ width: 80, height: 80 }} />
              <div style={{ fontSize: 10, color: "#475569" }}>
                Escanea el código para verificar la autenticidad del expediente en la
                página pública de validación de Impulso Go.
              </div>
            </div>
          )}
        </Section>

        <div style={{ marginTop: 24, paddingTop: 12, borderTop: "1px solid #e2e8f0", fontSize: 9, color: "#94a3b8", textAlign: "center" }}>
          Documento generado electrónicamente por {INSTITUTION.shortName} · Folio {folio} · {fechaLarga}
        </div>
      </div>
    );
  },
);

const th: React.CSSProperties = { padding: "8px 10px", textAlign: "left", fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" };
const td: React.CSSProperties = { padding: "7px 10px", borderBottom: "1px solid #e2e8f0", fontSize: 10.5 };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 12, fontWeight: 900, color: "#06245C", margin: "0 0 10px", letterSpacing: 0.2, textTransform: "uppercase" }}>{title}</h2>
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

function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>{children}</div>;
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#172033", marginTop: 2, wordBreak: "break-all" }}>{children}</div>
    </div>
  );
}

function IdImg({ label, src }: { label: string; src: string }) {
  return (
    <div>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 4, overflow: "hidden", background: "#fff", aspectRatio: "1/1" }}>
        <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontSize: 8.5, color: "#64748b", marginTop: 4, textAlign: "center", fontWeight: 700 }}>{label}</div>
    </div>
  );
}
