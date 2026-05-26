import { forwardRef, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ScanLine } from "lucide-react";
import { MAIN_LOGO, DOC_VERSION } from "@/components/dashboard/shared";

type Accent = "success" | "danger" | "brand" | "ink";

const ACCENT_VAR: Record<Accent, string> = {
  success: "var(--success)",
  danger: "var(--danger)",
  brand: "var(--brand)",
  ink: "var(--ink)",
};

export const DOC_W = 1080;
export const DOC_H = 1350;

export type DocShellProps = {
  accent: Accent;
  badge: string;
  title: string;
  subtitle?: string;
  folio: string;
  emittedAt: string;
  city: string;
  folioCondusef: string;
  showQr?: boolean;
  watermark?: string;
  children: ReactNode;
};

export const DocShell = forwardRef<HTMLDivElement, DocShellProps>(function DocShell(
  { accent, badge, title, subtitle, folio, emittedAt, city, folioCondusef, showQr = true, watermark, children },
  ref,
) {
  const accentColor = ACCENT_VAR[accent];
  return (
    <div
      ref={ref}
      style={{
        width: DOC_W,
        height: DOC_H,
        background: "oklch(0.99 0.005 90)",
        color: "var(--ink)",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 8, background: accentColor }} />

      {/* Header */}
      <header style={{ padding: "36px 64px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              height: 56, width: 56, borderRadius: 12,
              background: "white",
              boxShadow: "0 0 0 1px var(--hairline), 0 2px 8px rgba(11,42,91,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <img src={MAIN_LOGO} alt="Impulso Go" style={{ height: 36, width: 36, objectFit: "contain" }} />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.01em" }}>Impulso Go</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>Soluciones de crédito · México</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.12em",
              padding: "6px 12px",
              borderRadius: 999,
              background: accent === "danger" ? "var(--danger-soft)" : accent === "success" ? "var(--success-soft)" : "oklch(0.95 0.04 256)",
              color: accentColor,
              border: `1px solid ${accentColor}`,
            }}
          >
            {badge}
          </span>
          <div style={{ marginTop: 10, fontSize: 11, color: "var(--ink-soft)", fontFamily: "'JetBrains Mono', monospace", fontFeatureSettings: '"tnum"' }}>
            Folio expediente: <span style={{ color: "var(--ink)", fontWeight: 600 }}>{folio}</span>
          </div>
          <div style={{ marginTop: 2, fontSize: 11, color: "var(--ink-soft)", fontFamily: "'JetBrains Mono', monospace" }}>
            Emitido: <span style={{ color: "var(--ink)" }}>{emittedAt} · {city}</span>
          </div>
        </div>
      </header>

      {/* Title */}
      <div style={{ padding: "0 64px 8px" }}>
        <h1
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.4 }}>{subtitle}</p>
        )}
        <div style={{ marginTop: 14, height: 2, width: 80, background: accentColor, borderRadius: 2 }} />
      </div>

      {/* Watermark */}
      {watermark && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%) rotate(-22deg)",
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 130,
            color: accentColor,
            opacity: 0.04,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            letterSpacing: "0.05em",
          }}
        >
          {watermark}
        </div>
      )}

      {/* Body */}
      <main style={{ padding: "20px 64px 24px", flex: 1, position: "relative", zIndex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          padding: "22px 64px 28px",
          background: "white",
          borderTop: "1px solid var(--hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, color: "var(--ink)", letterSpacing: "0.04em" }}>
            REGISTRO VERIFICABLE EN SIPRES / CONDUSEF
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.45 }}>
            Folio CONDUSEF/SIPRES: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--ink)", fontWeight: 600 }}>{folioCondusef}</span>
            {" · "}Escanea el QR para consultar el registro público.
          </div>
          <div style={{ marginTop: 6, fontSize: 10, color: "var(--ink-soft)" }}>
            © {new Date().getFullYear()} Impulso Go · Documento interno generado el {emittedAt} ({city}) · {DOC_VERSION}.
          </div>
        </div>
        {showQr && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ background: "white", padding: 6, borderRadius: 8, border: "1px solid var(--hairline)" }}>
              <QRCodeSVG
                value="https://webapps.condusef.gob.mx/SIPRES/jsp/home_publico.jsp?idins=16103"
                size={84}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#0B2A5B"
              />
            </div>
            <span style={{ fontSize: 9, color: "var(--ink-soft)", display: "inline-flex", alignItems: "center", gap: 3 }}>
              <ScanLine style={{ height: 10, width: 10 }} /> Verificar registro
            </span>
          </div>
        )}
      </footer>
    </div>
  );
});

// ============================================================
// Reusable bits
// ============================================================

export function DocStamp({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 130,
        right: 60,
        transform: "rotate(-14deg)",
        border: `4px solid ${color}`,
        color,
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 28,
        letterSpacing: "0.18em",
        padding: "8px 18px",
        borderRadius: 8,
        opacity: 0.85,
        zIndex: 2,
        background: "rgba(255,255,255,0.6)",
      }}
    >
      {text}
    </div>
  );
}

export function FieldRow({ label, value, mono = false, strong = false, color }: { label: string; value: string; mono?: boolean; strong?: boolean; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid var(--hairline)" }}>
      <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{label}</span>
      <span
        style={{
          fontSize: strong ? 16 : 14,
          fontWeight: strong ? 700 : 500,
          color: color ?? "var(--ink)",
          fontFamily: mono ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function SectionTitle({ n, title, accent }: { n?: number; title: string; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      {typeof n === "number" && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: 6,
            background: accent,
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          {n}
        </span>
      )}
      <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink)", margin: 0 }}>
        {title}
      </h3>
    </div>
  );
}