import { forwardRef } from "react";
import type { SignedContract } from "@/lib/contracts";
import { formatMXN, calculateMonthlyPayment } from "@/lib/finance";
import { INSTITUTION } from "@/lib/config";

interface Props {
  contract: SignedContract;
  qrDataUrl?: string;
}

/**
 * Tarjeta institucional 1080×1350 (formato vertical estilo IG/post).
 * Pensada para exportarse como PNG con html2canvas a escala 2.
 */
export const ContractCardInstitutional = forwardRef<HTMLDivElement, Props>(
  function ContractCardInstitutional({ contract, qrDataUrl }, ref) {
    const { data, folio, signedAt, hash } = contract;
    const { cuota } = calculateMonthlyPayment(data.amount, data.termYears);
    const date = new Date(signedAt);
    const fechaLarga = date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1350,
          fontFamily: "Inter, Segoe UI, system-ui, sans-serif",
          background: "linear-gradient(160deg, #ffffff 0%, #f4f7fc 100%)",
          color: "#172033",
          padding: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #06245C 0%, #1266D6 100%)",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 28,
                  letterSpacing: -1,
                }}
              >
                IG
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 2, color: "#1266D6", textTransform: "uppercase" }}>
                  Contrato firmado
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#06245C", marginTop: 2 }}>
                  {INSTITUTION.shortName}
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#0A8F3C",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Verificado
            </div>
          </div>

          <div
            style={{
              marginTop: 36,
              padding: "26px 30px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 22,
              background: "#fff",
              boxShadow: "0 18px 50px rgba(6,36,92,0.06)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 2, color: "#64748b", textTransform: "uppercase" }}>
              Folio del expediente
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#06245C",
                letterSpacing: -1,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                marginTop: 6,
              }}
            >
              {folio}
            </div>
            <div style={{ marginTop: 10, fontSize: 16, color: "#475569", fontWeight: 600 }}>{fechaLarga}</div>
          </div>
        </div>

        {/* Resumen */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 22,
            marginTop: 26,
          }}
        >
          <div
            style={{
              padding: "28px 30px",
              borderRadius: 22,
              background: "linear-gradient(135deg, #06245C 0%, #1266D6 100%)",
              color: "#fff",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
              Cliente
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6, lineHeight: 1.2 }}>
              {data.fullName}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24 }}>
              <Stat label="Monto" value={formatMXN(data.amount)} />
              <Stat label="Plazo" value={`${data.termYears} años`} />
              <Stat label="Cuota mensual" value={formatMXN(cuota)} />
              <Stat label="Tasa anual" value={`${INSTITUTION.annualRatePercent}.00%`} />
            </div>
          </div>

          <div
            style={{
              padding: "26px",
              borderRadius: 22,
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR validación" style={{ width: 200, height: 200 }} />
            ) : (
              <div style={{ width: 200, height: 200, background: "#f1f5f9", borderRadius: 10 }} />
            )}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, color: "#64748b", textTransform: "uppercase" }}>
                Validar en línea
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#06245C", marginTop: 4, fontFamily: "ui-monospace, monospace" }}>
                /validar/{folio}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 26 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              padding: 22,
              borderRadius: 18,
              background: "#fff",
              border: "1.5px solid #e2e8f0",
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, color: "#64748b", textTransform: "uppercase" }}>
                Entidad
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#172033", marginTop: 4, lineHeight: 1.4 }}>
                {INSTITUTION.legalName}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, color: "#64748b", textTransform: "uppercase" }}>
                Huella técnica
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#172033",
                  marginTop: 4,
                  fontFamily: "ui-monospace, monospace",
                  wordBreak: "break-all",
                }}
              >
                {hash}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              textAlign: "center",
              fontSize: 12,
              color: "#94a3b8",
              fontWeight: 600,
              letterSpacing: 0.6,
            }}
          >
            Registro consultable en SIPRES · CONDUSEF · {INSTITUTION.jurisdiction}
          </div>
        </div>
      </div>
    );
  },
);

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.6, color: "rgba(255,255,255,0.65)", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
    </div>
  );
}
