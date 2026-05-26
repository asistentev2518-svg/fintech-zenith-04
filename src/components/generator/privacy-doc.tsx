import { forwardRef } from "react";
import { KeyRound, Mail, MapPin } from "lucide-react";
import { DocShell, SectionTitle } from "./doc-shell";
import { PRIVACY_CONTACT, type MasterData } from "@/components/dashboard/shared";

export const PrivacyDoc = forwardRef<HTMLDivElement, { master: MasterData }>(function PrivacyDoc({ master }, ref) {
  const accent = "var(--brand)";
  const sections: { n: number; title: string; body: React.ReactNode }[] = [
    {
      n: 1,
      title: "Identidad y domicilio del responsable",
      body: (
        <>
          <strong>Impulso Go</strong>, con domicilio en Ciudad de México, es el responsable del tratamiento de los datos personales que recaba del titular. Para asuntos relacionados con privacidad, el titular podrá contactar al área correspondiente a través de los canales oficiales de Impulso Go y de la sucursal de atención.
        </>
      ),
    },
    {
      n: 2,
      title: "Datos personales tratados",
      body: <>Datos de identificación, contacto, información financiera, laboral, patrimonial y documentación de respaldo del expediente. Se tratan únicamente los datos necesarios para las finalidades aquí descritas.</>,
    },
    {
      n: 3,
      title: "Finalidades primarias",
      body: <>Análisis y evaluación de la solicitud crediticia, validación de identidad, formalización del crédito, gestión y seguimiento del expediente, cobranza administrativa, cumplimiento de obligaciones legales, fiscales y regulatorias aplicables al sector.</>,
    },
    {
      n: 4,
      title: "Finalidades secundarias",
      body: <>Mejora de productos y servicios, prospección comercial y envío de comunicaciones informativas. El titular podrá manifestar su negativa a estas finalidades en cualquier momento a través de los canales oficiales, sin que ello afecte la relación principal.</>,
    },
    {
      n: 5,
      title: "Transferencias",
      body: <>Los datos podrán transferirse a sociedades de información crediticia, autoridades competentes cuando resulte procedente y proveedores de servicios necesarios para la operación, todos ellos sujetos a deberes de confidencialidad y seguridad equivalentes.</>,
    },
    {
      n: 6,
      title: "Derechos ARCO y revocación del consentimiento",
      body: <>El titular podrá ejercer sus derechos de <strong>acceso, rectificación, cancelación y oposición</strong>, así como revocar el consentimiento otorgado, mediante solicitud presentada en los canales oficiales de Impulso Go o en la sucursal de atención correspondiente.</>,
    },
    {
      n: 7,
      title: "Cambios al presente aviso",
      body: <>Cualquier modificación al presente Aviso de Privacidad será publicada por los canales oficiales de Impulso Go. Se recomienda al titular consultarlos periódicamente.</>,
    },
  ];
  return (
    <DocShell
      ref={ref}
      accent="brand"
      badge="AVISO INTEGRAL"
      title="AVISO DE PRIVACIDAD"
      subtitle="Tratamiento de datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)."
      folio={master.folio}
      emittedAt={master.emittedAt}
      city={master.city}
      folioCondusef={master.folioCondusef}
    >
      {/* Datos del titular */}
      <div style={{ background: "white", border: "1px solid var(--hairline)", borderRadius: 10, padding: "10px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Titular</div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 13, marginTop: 2 }}>{master.name}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Folio expediente</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 13, marginTop: 2 }}>{master.folio}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Sucursal</div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 13, marginTop: 2 }}>{master.city}</div>
        </div>
      </div>

      {/* Secciones del aviso integral */}
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
        {sections.map((s) => (
          <div key={s.n}>
            <SectionTitle n={s.n} title={s.title} accent={accent} />
            <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink)", lineHeight: 1.5 }}>{s.body}</p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: "auto", paddingTop: 12, fontSize: 10, color: "var(--ink-soft)", lineHeight: 1.45 }}>
        El presente Aviso de Privacidad se emite en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su Reglamento. Folio de expediente: <strong style={{ color: "var(--ink)" }}>{master.folio}</strong>.
      </p>

      {/* Derechos ARCO destacados + contacto */}
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 10 }}>
        <div style={{ background: "oklch(0.96 0.03 256)", border: `1px solid ${accent}`, borderLeft: `4px solid ${accent}`, borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <KeyRound style={{ height: 18, width: 18, color: accent, flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 11, color: accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>Derechos ARCO</div>
            <div style={{ fontSize: 10.5, color: "var(--ink)", lineHeight: 1.4, marginTop: 2 }}>
              Acceso, Rectificación, Cancelación y Oposición. El titular puede ejercerlos en cualquier momento por los canales oficiales.
            </div>
          </div>
        </div>
        <div style={{ background: "white", border: "1px solid var(--hairline)", borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontSize: 9, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>Contacto del responsable</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: "var(--ink)" }}>
            <Mail style={{ height: 11, width: 11, color: accent }} /> {PRIVACY_CONTACT.email}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 10.5, color: "var(--ink)", marginTop: 2, lineHeight: 1.35 }}>
            <MapPin style={{ height: 11, width: 11, color: accent, flexShrink: 0, marginTop: 2 }} /> {PRIVACY_CONTACT.address}
          </div>
        </div>
      </div>
    </DocShell>
  );
});