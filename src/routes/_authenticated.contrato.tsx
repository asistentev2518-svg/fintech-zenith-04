import { createFileRoute } from "@tanstack/react-router";
import { forwardRef, useRef, useState } from "react";
import { Download, Loader2, FileEdit } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { INSTITUTION, ASSETS } from "@/lib/config";
import { exportNodeToPng } from "@/lib/png-export";

export const Route = createFileRoute("/_authenticated/contrato")({
  head: () => ({
    meta: [
      { title: "Editor de contrato — Impulso Go" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ContratoEditorPage,
});

// Cláusulas base (transcripción del contrato físico de Impulso Go).
const DEFAULTS = {
  declaraciones:
    "EL CLIENTE declara bajo protesta de decir verdad que la información proporcionada en la solicitud y en este contrato es verídica, completa, exacta y actualizada; que cuenta con la capacidad legal para contratar; que los ingresos que declara son lícitos y comprobables; y que autoriza a IMPULSO GO para verificar, procesar y consultar dicha información en las fuentes que considere necesarias.",
  primera:
    "EL CLIENTE se obliga a pagar a IMPULSO GO las cantidades que se deriven del presente financiamiento conforme al plazo, periodicidad y monto establecidos en la solicitud. En caso de incumplimiento en cualquier pago, IMPULSO GO podrá cobrar intereses moratorios sobre el monto vencido, y podrá declarar el vencimiento anticipado del contrato, exigiendo el pago total del adeudo, intereses, comisiones, gastos y accesorios que correspondan. Los pagos deberán realizarse en las fechas y por los medios que IMPULSO GO le indique. El pago realizado se aplicará primero a intereses, luego a comisiones y gastos, y posteriormente al capital.",
  segunda:
    "Para todos los efectos legales derivados de este contrato, EL CLIENTE señala como su domicilio el indicado en la solicitud. Asimismo, autoriza expresamente a IMPULSO GO a enviar cualquier aviso, comunicación, notificación, estado de cuenta, requerimiento o información relacionada con este contrato a través de llamadas telefónicas, mensajes de texto (SMS), WhatsApp, correo electrónico y cualquier otro medio físico o electrónico que tenga registrado. EL CLIENTE reconoce como válidas y suficientes dichas comunicaciones.",
  tercera:
    "EL CLIENTE autoriza expresamente a IMPULSO GO para consultar, solicitar, obtener, usar, compartir, procesar y considerar su información crediticia ante las Sociedades de Información Crediticia que estime necesarias, tanto al inicio, durante la vigencia y al término de este contrato. En caso de incumplimiento, atraso o falta de pago, IMPULSO GO podrá reportar dicho comportamiento a las Sociedades de Información Crediticia correspondientes, lo cual puede afectar su historial crediticio.",
  cuarta:
    "EL CLIENTE reconoce y acepta que el Costo Anual Total (CAT) del financiamiento, expresado en términos porcentuales anuales, incluye todos los costos, comisiones, gastos e impuestos inherentes al presente contrato, de conformidad con las disposiciones aplicables. El CAT puede variar de acuerdo con el monto del financiamiento, el plazo y el comportamiento de pago del CLIENTE. IMPULSO GO entregará al CLIENTE, antes de la formalización del contrato, la hoja de cálculo y la información detallada utilizada para determinar el CAT aplicable.",
  quinta:
    "EL CLIENTE autoriza a IMPULSO GO para verificar su identidad, información, documentos y referencias a través de medios físicos, electrónicos y digitales, incluyendo pero no limitado a plataformas internas, bases de datos, burós de crédito, consultas públicas, instituciones financieras y proveedores de información. EL CLIENTE acepta que la firma autógrafa, electrónica, digital o cualquier otro mecanismo de aceptación utilizado en este contrato, así como los mensajes de texto, WhatsApp, correos electrónicos y llamadas telefónicas, tendrán plena validez jurídica y serán suficientes para acreditar su voluntad, instrucciones y consentimiento. La información y evidencia generada a través de medios electrónicos, ópticos, magnéticos o de cualquier otra tecnología será admisible y tendrá el mismo valor probatorio que un documento firmado físicamente.",
  sexta:
    'EL CLIENTE se obliga a pagar adelantadamente a "IMPULSO GO, S.A. de C.V. SOFOM, E.N.R." las comisiones, gastos de cobranza, intereses por el monto que se genera una vez vencida la vigencia del contrato, lo cual si se cancela pagaría una penalización del 10% una vez firmado dicho contrato.',
  septima:
    "EL CLIENTE podrá solicitar la cancelación del presente contrato antes del desembolso del financiamiento. En este caso, reconoce y acepta que deberá cubrir una penalización equivalente al 10% (diez por ciento) del monto solicitado, por concepto de gastos administrativos, operativos, de análisis, validación, gestión y recursos utilizados hasta ese momento.",
  octava:
    "EL CLIENTE manifiesta que ha leído íntegramente el presente contrato, comprendiendo su contenido, alcance y consecuencias legales y financieras, por lo que lo acepta de manera libre, voluntaria e informada, sin error, dolo, mala fe o vicio alguno del consentimiento. Este contrato se rige e interpreta conforme a las leyes de los Estados Unidos Mexicanos. Para la solución de cualquier controversia que se derive del presente contrato, las partes se someten expresamente a la jurisdicción de los tribunales competentes de la Ciudad de México.",
  declaracionFinal:
    "DECLARACIÓN FINAL DE ACEPTACIÓN: EL CLIENTE reconoce que la firma del presente contrato refleja su voluntad de obligarse en los términos aquí establecidos. Este documento, así como sus anexos, constituye la totalidad del acuerdo entre las partes y sustituye cualquier acuerdo previo, ya sea verbal o escrito.",
};

type State = {
  folio: string;
  fullName: string;
  curp: string;
  sexo: "Masculino" | "Femenino";
  phone: string;
  income: string;
  address: string;
  clauses: typeof DEFAULTS;
};

function defaultState(): State {
  const today = new Date();
  return {
    folio: `IG-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: "", curp: "", sexo: "Masculino", phone: "", income: "", address: "",
    clauses: { ...DEFAULTS },
  };
}

function ContratoEditorPage() {
  const [s, setS] = useState<State>(defaultState);
  const [busy, setBusy] = useState<number | null>(null);
  const refs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  const exportPage = async (page: number) => {
    const node = refs[page - 1].current;
    if (!node) return;
    setBusy(page);
    try {
      await exportNodeToPng(node, `contrato-${s.folio}-pagina-${page}.png`, 1080, 1500);
    } finally {
      setBusy(null);
    }
  };

  const u = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));
  const uc = <K extends keyof typeof DEFAULTS>(k: K, v: string) => setS((p) => ({ ...p, clauses: { ...p.clauses, [k]: v } }));

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Herramienta</p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">Editor de contrato</h1>
          <p className="text-sm text-muted-foreground">
            Edita los datos del cliente y las cláusulas del contrato. Descarga cada página como imagen PNG individual (1080×1500).
          </p>
        </header>

        {/* Datos */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card-soft space-y-5">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-institutional">Datos del cliente</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <F label="Folio"><input value={s.folio} onChange={(e) => u("folio", e.target.value)} className={inp} /></F>
            <F label="Nombre completo" span={2}><input value={s.fullName} onChange={(e) => u("fullName", e.target.value)} className={inp} /></F>
            <F label="CURP"><input value={s.curp} onChange={(e) => u("curp", e.target.value.toUpperCase())} maxLength={18} className={`${inp} uppercase`} /></F>
            <F label="Sexo">
              <select value={s.sexo} onChange={(e) => u("sexo", e.target.value as "Masculino" | "Femenino")} className={inp}>
                <option>Masculino</option><option>Femenino</option>
              </select>
            </F>
            <F label="Teléfono"><input value={s.phone} onChange={(e) => u("phone", e.target.value)} maxLength={10} className={inp} /></F>
            <F label="Ingresos mensuales"><input value={s.income} onChange={(e) => u("income", e.target.value)} placeholder="$15,000" className={inp} /></F>
            <F label="Domicilio" span={3}><input value={s.address} onChange={(e) => u("address", e.target.value)} className={inp} /></F>
          </div>

          <div className="rounded-xl border border-dashed border-action/40 bg-action/5 px-4 py-3 text-[11px] text-muted-foreground">
            <strong className="text-institutional">Nota:</strong> Esta herramienta genera un PDF/PNG en blanco para llenado manual con bolígrafo.
            Los datos del financiamiento (monto, plazo, fechas, cuentas) deben capturarse únicamente en el <strong>Contrato digital</strong>.
          </div>

          <details className="rounded-xl border border-border bg-surface-alt p-4">
            <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.16em] text-institutional">Editar cláusulas</summary>
            <div className="mt-4 space-y-3">
              {(Object.keys(s.clauses) as (keyof typeof DEFAULTS)[]).map((k) => (
                <div key={k}>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{k}</label>
                  <textarea value={s.clauses[k]} onChange={(e) => uc(k, e.target.value)} className={`${inp} min-h-[100px] resize-y py-2`} />
                </div>
              ))}
            </div>
          </details>
        </section>

        {/* Páginas */}
        <section className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((p) => (
            <article key={p} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
              <header className="flex items-center justify-between border-b border-border bg-surface-alt px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-md gradient-brand text-white"><FileEdit className="h-4 w-4" /></span>
                  <div>
                    <h3 className="text-sm font-black text-institutional">Página {p} de 3</h3>
                    <p className="text-[11px] text-muted-foreground">1080 × 1500 px · PNG</p>
                  </div>
                </div>
                <button onClick={() => exportPage(p)} disabled={busy === p || !s.fullName} className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-3 py-2 text-xs font-bold text-white shadow-card-soft disabled:opacity-50">
                  {busy === p ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}PNG
                </button>
              </header>
              <div className="overflow-auto bg-surface-alt p-3" style={{ maxHeight: 520 }}>
                <div style={{ transform: "scale(0.36)", transformOrigin: "top left", width: 1080, height: 1500 }}>
                  {p === 1 && <PageOne ref={refs[0]} s={s} />}
                  {p === 2 && <PageTwo ref={refs[1]} s={s} />}
                  {p === 3 && <PageThree ref={refs[2]} s={s} />}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}

const inp = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-action focus:ring-4 focus:ring-action/15";

function F({ label, span = 1, children }: { label: string; span?: number; children: React.ReactNode }) {
  return (
    <div style={{ gridColumn: `span ${span} / span ${span}` }}>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

// =========== Shared shell ===========
function PageShell({ title, subtitle, page, children }: { title: string; subtitle?: string; page: number; children: React.ReactNode }) {
  return (
    <div style={{ width: 1080, height: 1500, background: "white", fontFamily: "'Inter', sans-serif", color: "#0f172a", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "40px 70px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <img src={ASSETS.logo} alt="Impulso Go" style={{ height: 70, width: 70, objectFit: "contain" }} />
          <div style={{ marginTop: 8, fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 18, color: "#0B2A5B" }}>{INSTITUTION.legalName}</div>
        </div>
        <div style={{ position: "absolute", right: 70, top: 40, width: 90, height: 90, border: "2px solid #0B2A5B", borderRadius: 6, display: "grid", placeItems: "center", color: "#0B2A5B", fontSize: 9, textAlign: "center", padding: 4 }}>
          QR<br/>Validar
        </div>
      </header>
      <div style={{ padding: "20px 70px 8px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 26, color: "#0B2A5B", letterSpacing: "-0.01em" }}>{title}</h1>
        {subtitle && <p style={{ margin: "6px 0 0", fontSize: 13, color: "#64748b", fontStyle: "italic" }}>{subtitle}</p>}
      </div>
      <main style={{ flex: 1, padding: "16px 70px 16px", minHeight: 0 }}>{children}</main>
      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "16px 70px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#64748b", fontSize: 11 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span>🛡 Empresa registrada y autorizada ante la CONDUSEF.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={ASSETS.condusef} alt="CONDUSEF" style={{ height: 32, width: 32 }} />
          <img src={ASSETS.sipres} alt="SIPRES" style={{ height: 32, width: 32 }} />
          <span style={{ fontWeight: 700, color: "#0B2A5B" }}>Página {page} de 3</span>
        </div>
      </footer>
    </div>
  );
}

function ClauseBlock({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "inline-block", background: "#0B2A5B", color: "white", padding: "8px 16px", borderRadius: 6, fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.06em" }}>{title}</div>
      <div style={{ marginTop: 8, border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", fontSize: 11.5, lineHeight: 1.55, color: "#334155", textAlign: "justify" }}>{body}</div>
    </div>
  );
}

// =========== Page 1 ===========
const PageOne = forwardRef<HTMLDivElement, { s: State }>(function PageOne({ s }, ref) {
  return (
    <div ref={ref}>
      <PageShell title="CONTRATO DE CRÉDITO Y OTORGAMIENTO DE FINANCIAMIENTO" subtitle="Documento generado electrónicamente" page={1}>
        <SectionLabel n="1" title="DATOS DEL CLIENTE" />
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 14 }}>
          <Row label="NOMBRE COMPLETO" value={s.fullName} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 10 }}>
            <Row label="CURP" value={s.curp} mono />
            <Row label="SEXO" value={s.sexo} />
            <Row label="TELÉFONO" value={s.phone} mono />
            <Row label="INGRESOS MENSUALES" value={s.income} />
          </div>
          <div style={{ marginTop: 10 }}><Row label="DOMICILIO" value={s.address} /></div>
        </div>

        <SectionLabel n="2" title="DATOS DEL FINANCIAMIENTO" />
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
            <Row label="MONTO SOLICITADO" value="" mono />
            <Row label="TASA ANUAL ORDINARIA FIJA" value={`${INSTITUTION.annualRatePercent}%`} />
            <Row label="PLAZO EN AÑOS" value="" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 14, paddingTop: 14, borderTop: "1px dashed #e2e8f0" }}>
            <Row label="FECHA DE OTORGAMIENTO" value="" mono />
            <Row label="FECHA ESTIMADA DE VENCIMIENTO" value="" mono />
          </div>
          <p style={{ marginTop: 10, marginBottom: 0, fontSize: 10.5, color: "#64748b", fontStyle: "italic" }}>
            ⓘ Espacios destinados para llenado manual con bolígrafo. La tasa anual ordinaria fija del {INSTITUTION.annualRatePercent}% es fija durante toda la vigencia del contrato.
          </p>
        </div>

        <SectionLabel n="3" title="DATOS BANCARIOS" />
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Row label="CUENTA A ACREDITAR" value="" mono />
            <Row label="NOMBRE DEL BANCO" value="" />
          </div>
        </div>

        <div style={{ border: "1px solid #1266D6", borderLeft: "4px solid #1266D6", borderRadius: 8, padding: "12px 16px", fontSize: 11.5, color: "#334155", lineHeight: 1.5 }}>
          🛡 El <strong>CLIENTE</strong> declara que la información proporcionada es verdadera y correcta, y autoriza a <strong>IMPULSO GO</strong> para su verificación. La falsedad u omisión de datos podrá ser causa de cancelación del financiamiento y de las acciones legales que correspondan.
        </div>
      </PageShell>
    </div>
  );
});

// =========== Page 2 ===========
const PageTwo = forwardRef<HTMLDivElement, { s: State }>(function PageTwo({ s }, ref) {
  return (
    <div ref={ref}>
      <PageShell title="DECLARACIONES Y CLÁUSULAS DEL CONTRATO" page={2}>
        <ClauseBlock title="📋 DECLARACIONES" body={s.clauses.declaraciones} />
        <ClauseBlock title="PRIMERA. PAGOS" body={s.clauses.primera} />
        <ClauseBlock title="SEGUNDA. DOMICILIOS Y MEDIOS DE CONTACTO" body={s.clauses.segunda} />
        <ClauseBlock title="TERCERA. INFORMACIÓN CREDITICIA" body={s.clauses.tercera} />
        <ClauseBlock title="CUARTA. COSTO ANUAL TOTAL (CAT)" body={s.clauses.cuarta} />
      </PageShell>
    </div>
  );
});

// =========== Page 3 ===========
const PageThree = forwardRef<HTMLDivElement, { s: State }>(function PageThree({ s }, ref) {
  return (
    <div ref={ref}>
      <PageShell title="CLÁUSULAS FINALES Y ACEPTACIÓN" page={3}>
        <ClauseBlock title="QUINTA. VERIFICACIÓN Y VALIDACIÓN DIGITAL" body={s.clauses.quinta} />
        <ClauseBlock title="SEXTA. COMISIONES DE PAGO" body={s.clauses.sexta} />
        <ClauseBlock title="SÉPTIMA. CANCELACIÓN DEL CONTRATO Y PENALIZACIÓN" body={s.clauses.septima} />
        <ClauseBlock title="OCTAVA. ACEPTACIÓN, LEGISLACIÓN Y JURISDICCIÓN" body={s.clauses.octava} />

        <div style={{ marginTop: 8, background: "#f7faff", border: "1px solid #1266D6", borderRadius: 8, padding: "10px 14px", fontSize: 11, color: "#334155" }}>
          🤝 <strong>{s.clauses.declaracionFinal}</strong>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 12, color: "#0B2A5B", letterSpacing: "0.05em" }}>FIRMA DEL CLIENTE</div>
            <div style={{ marginTop: 30, borderBottom: "1px solid #0f172a", height: 1 }} />
            <div style={{ marginTop: 8, fontSize: 11, textAlign: "left" }}>
              <div><strong>Nombre completo:</strong> {s.fullName || "_______________________"}</div>
              <div style={{ marginTop: 6 }}><strong>Fecha:</strong> ___ / ___ / ______ <span style={{ color: "#94a3b8" }}>(DD / MM / AAAA)</span></div>
            </div>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 12, color: "#0B2A5B", letterSpacing: "0.05em" }}>FIRMA DEL REPRESENTANTE LEGAL</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{INSTITUTION.legalName}</div>
            <div style={{ marginTop: 14, position: "relative", height: 70, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
              <svg viewBox="0 0 280 70" width="240" height="62" style={{ overflow: "visible" }}>
                <text x="10" y="42" fontFamily="'Caveat', 'Brush Script MT', cursive" fontSize="40" fontStyle="italic" fill="#0B2A5B" fontWeight="700">Claudia T.</text>
                <path d="M 8 56 C 60 62, 130 48, 210 54 C 230 55, 248 50, 268 38" stroke="#0B2A5B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M 195 18 C 210 22, 222 30, 232 44" stroke="#0B2A5B" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>
            <div style={{ borderBottom: "1px solid #0f172a", marginTop: 2, height: 1 }} />
            <div style={{ marginTop: 8, fontSize: 11, textAlign: "left" }}>
              <div><strong>Nombre:</strong> {INSTITUTION.representative}</div>
              <div style={{ marginTop: 6 }}><strong>Cargo:</strong> {INSTITUTION.representativeTitle}</div>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
});

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0B2A5B", color: "white", padding: "8px 16px", borderRadius: 6, marginBottom: 10, fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.06em" }}>
      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#1266D6", display: "grid", placeItems: "center", fontSize: 12 }}>{n}</span>
      {title}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 800, color: "#0B2A5B", letterSpacing: "0.08em" }}>{label}:</div>
      <div style={{ marginTop: 4, paddingBottom: 4, borderBottom: "1px solid #cbd5e1", fontSize: 13, color: "#0f172a", fontFamily: mono ? "'JetBrains Mono', monospace" : undefined, minHeight: 18 }}>
        {value || "\u00A0"}
      </div>
    </div>
  );
}

function Mini({ label }: { label: string }) {
  return <div style={{ fontSize: 10, fontWeight: 800, color: "#0B2A5B", letterSpacing: "0.08em" }}>{label}</div>;
}
