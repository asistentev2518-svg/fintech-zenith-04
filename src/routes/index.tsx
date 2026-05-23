import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  FileCheck2,
  Fingerprint,
  PenLine,
  CircleCheckBig,
  ArrowRight,
  Building2,
  Lock,
  Eye,
} from "lucide-react";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { Simulator } from "@/components/site/Simulator";
import { ASSETS, BRAND, INSTITUTION } from "@/lib/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Impulso Go — Financiamiento formal con contrato firmado en línea" },
      {
        name: "description",
        content:
          "SOFOM E.N.R. con proceso documentado: simulador, validación de identidad, contrato electrónico y firma con folio. Tasa fija 7% anual.",
      },
      { property: "og:title", content: "Impulso Go — Financiamiento formal en línea" },
      { property: "og:description", content: "Contrato electrónico, firma con folio y trámite 100% en línea." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const trustPills = [
  "Registro verificable en SIPRES / CONDUSEF",
  "Contrato electrónico con cláusulas completas",
  `Tasa anual fija ${INSTITUTION.annualRatePercent}%`,
  "Trámite totalmente en línea",
];

const processSteps = [
  { n: "01", icon: FileCheck2, title: "Captura datos", desc: "Registra identidad, contacto y condiciones del financiamiento solicitado." },
  { n: "02", icon: Fingerprint, title: "Valida identidad", desc: "INE por ambos lados, selfie y consentimiento biométrico documentado." },
  { n: "03", icon: ShieldCheck, title: "Lee contrato", desc: "Cláusulas completas y aceptaciones expresas antes de firmar." },
  { n: "04", icon: PenLine, title: "Firma digital", desc: "Firma con folio, fecha y huella técnica de generación del expediente." },
];

const trustItems = [
  { icon: Building2, title: "Entidad regulada", desc: "Registro público verificable en SIPRES de CONDUSEF." },
  { icon: Lock, title: "Datos protegidos", desc: "Tratamiento conforme al aviso de privacidad y acceso interno controlado." },
  { icon: Eye, title: "Trazabilidad total", desc: "Folio, fecha, dispositivo y huella técnica conservados en el expediente." },
];

const faqs = [
  {
    q: "¿La simulación garantiza aprobación?",
    a: "No. Los montos son referenciales y todo financiamiento queda sujeto a evaluación crediticia, validación documental y formalización contractual.",
  },
  {
    q: "¿Dónde se valida la entidad?",
    a: "La referencia pública se consulta en SIPRES de CONDUSEF. Esa consulta verifica el registro y no implica aprobación de operaciones.",
  },
  {
    q: "¿Por qué se solicita evidencia de identidad?",
    a: "Para prevenir suplantación, documentar consentimiento y conservar un expediente trazable cuando se formaliza el contrato.",
  },
  {
    q: "¿Qué tasa y plazos manejan?",
    a: `Tasa anual fija de ${INSTITUTION.annualRatePercent}% con plazos de ${INSTITUTION.allowedTermsYears.join(", ")} años. El monto mínimo es $10,000 MXN.`,
  },
];

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-20">
            <img
              src={ASSETS.hero1}
              alt="Atención financiera Impulso Go"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 -z-10 gradient-hero opacity-95" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#03183f]/40 to-[#03183f]" />

          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-28">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-blue-100 backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5" />
                {INSTITUTION.legalName}
              </div>
              <h1 className="mt-6 text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
                Financiamiento formal,
                <span className="block text-white/90">contrato firmado en línea.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/75 md:text-lg">
                {BRAND.subtagline}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#simulador"
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 text-sm font-bold text-institutional shadow-finance transition hover:bg-white/95"
                >
                  Simular crédito
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={BRAND.sipresUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center rounded-md border border-white/20 bg-white/5 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Consultar SIPRES
                </a>
              </div>

              <ul className="mt-10 grid gap-2.5 sm:grid-cols-2">
                {trustPills.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-white/80">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 flex-none text-success" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hero card stats */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-xl shadow-finance">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/65">
                  Referencia rápida
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Stat value={`${INSTITUTION.annualRatePercent}%`} label="Tasa anual fija" />
                  <Stat value="2–8" label="Años de plazo" />
                  <Stat value="$10K" label="Monto mínimo" />
                  <Stat value="100%" label="En línea" />
                </div>
                <div className="mt-6 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  <img src={ASSETS.sipres} alt="SIPRES" className="h-9 w-9 rounded bg-white object-contain p-1" />
                  <img src={ASSETS.condusef} alt="CONDUSEF" className="h-9 w-9 rounded object-cover" />
                  <p className="text-xs text-white/70">
                    Registro consultable en CONDUSEF · SIPRES
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIMULADOR */}
        <section id="simulador" className="relative -mt-16 px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Simulator />
          </div>
        </section>

        {/* PROCESO */}
        <section id="proceso" className="border-t border-border bg-surface-alt py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeader
              eyebrow="Proceso"
              title="Cuatro pasos documentados, trazables y firmados."
              desc="Cada etapa deja evidencia técnica conservada como mensaje de datos."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((s) => (
                <div
                  key={s.n}
                  className="hover-lift relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card-soft"
                >
                  <span className="absolute right-5 top-5 text-3xl font-black text-surface">
                    {s.n}
                  </span>
                  <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-surface text-action">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-black text-institutional">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONFIANZA */}
        <section id="confianza" className="border-t border-border bg-background py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeader
                align="left"
                eyebrow="Confianza"
                title="Operación seria, controles claros."
                desc="Trabajamos con la formalidad esperada de una financiera regulada."
              />
              <div className="mt-8 space-y-4">
                {trustItems.map((t) => (
                  <div key={t.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card-soft">
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-lg bg-surface text-institutional">
                      <t.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-institutional">{t.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-institutional p-8 text-white shadow-finance sm:p-10">
              <div className="panel-grid absolute inset-0 opacity-30" />
              <div className="relative">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/65">
                  Marco institucional
                </p>
                <h3 className="mt-3 text-2xl font-black tracking-tight">
                  {INSTITUTION.legalName}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Sociedad financiera de objeto múltiple, entidad no regulada
                  conforme a la legislación mexicana. Operamos con expediente
                  documental completo por cliente.
                </p>
                <dl className="mt-7 grid gap-4 sm:grid-cols-2">
                  <Field label="Domicilio">{INSTITUTION.address}</Field>
                  <Field label="Representante">
                    {INSTITUTION.representative} — {INSTITUTION.representativeTitle}
                  </Field>
                  <Field label="Jurisdicción">{INSTITUTION.jurisdiction}</Field>
                  <Field label="Tasa anual fija">{INSTITUTION.annualRatePercent}%</Field>
                </dl>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  <a
                    href={BRAND.sipresUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-bold text-institutional hover:bg-white/95"
                  >
                    Consultar SIPRES
                  </a>
                  <a
                    href={BRAND.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center rounded-md border border-white/20 bg-white/5 px-4 text-sm font-bold text-white hover:bg-white/10"
                  >
                    Hablar con asesor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border bg-surface-alt py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeader
              eyebrow="Preguntas frecuentes"
              title="Todo lo que conviene aclarar antes de firmar."
            />
            <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card shadow-card-soft">
              {faqs.map((f) => (
                <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-start justify-between gap-6">
                    <span className="text-base font-bold text-institutional">{f.q}</span>
                    <span className="mt-1 grid h-7 w-7 flex-none place-items-center rounded-full bg-surface text-action transition group-open:rotate-45">
                      <span className="text-lg leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-background py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl gradient-hero p-10 text-center text-white shadow-finance sm:p-14">
              <div className="panel-grid absolute inset-0 opacity-25" />
              <div className="relative">
                <h2 className="text-balance text-3xl font-black tracking-tight md:text-4xl">
                  ¿Listo para iniciar tu trámite con respaldo formal?
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                  Habla con un asesor por WhatsApp o ingresa al sistema interno
                  para gestionar tu expediente.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <a
                    href={BRAND.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center rounded-md bg-[#25D366] px-6 text-sm font-bold text-white shadow-card-soft hover:bg-[#1fb957]"
                  >
                    Hablar por WhatsApp
                  </a>
                  <Link
                    to="/login"
                    className="inline-flex h-12 items-center rounded-md border border-white/20 bg-white/5 px-6 text-sm font-bold text-white backdrop-blur hover:bg-white/10"
                  >
                    Acceso interno
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-2xl font-black text-white tabular-nums">{value}</p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">{label}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-white/55">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-white/90">{children}</dd>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  desc,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-action">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-black tracking-tight text-institutional md:text-4xl">
        {title}
      </h2>
      {desc && <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{desc}</p>}
    </div>
  );
}
