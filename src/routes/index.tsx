import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  FileCheck2,
  Fingerprint,
  PenLine,
  CircleCheckBig,
  ArrowRight,
  ChevronDown,
  Sparkles,
  QrCode,
  FileSignature,
} from "lucide-react";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { Simulator } from "@/components/site/Simulator";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { ASSETS, BRAND, INSTITUTION } from "@/lib/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Impulso Go — Créditos desde $10,000 MXN | Tasa fija 7% | SOFOM CONDUSEF",
      },
      {
        name: "description",
        content:
          "Impulso Go, SOFOM E.N.R. registrada en CONDUSEF. Créditos personales desde $10,000 MXN, tasa anual fija 7%, trámite 100% en línea con contrato electrónico válido.",
      },
      { name: "theme-color", content: "#0A0E1A" },
      {
        property: "og:title",
        content: "Impulso Go — Financiamiento formal en línea",
      },
      {
        property: "og:description",
        content: "Tasa fija 7% · Registro CONDUSEF · Fondos en 24h",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://fintech-zenith-04.lovable.app/",
      },
    ],
    links: [
      { rel: "canonical", href: "https://fintech-zenith-04.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          name: "Crédito personal Impulso Go",
          annualPercentageRate: "7",
          loanTerm: "24-96 months",
          amount: {
            "@type": "MonetaryAmount",
            currency: "MXN",
            minValue: 10000,
            maxValue: 250000,
          },
          provider: {
            "@type": "FinancialService",
            name: INSTITUTION.legalName,
            address: {
              "@type": "PostalAddress",
              streetAddress: INSTITUTION.address,
              addressLocality: "Ciudad de México",
              addressCountry: "MX",
            },
            areaServed: "MX",
          },
          url: "https://fintech-zenith-04.lovable.app/",
        }),
      },
    ],
  }),
  component: HomePage,
});

const trustPills = [
  "Registro SIPRES verificable",
  "Datos cifrados AES-256",
  "Contrato electrónico válido",
];

const processSteps = [
  {
    n: "01",
    icon: FileCheck2,
    title: "Captura datos",
    desc: "Registra identidad, contacto y condiciones del financiamiento solicitado.",
  },
  {
    n: "02",
    icon: Fingerprint,
    title: "Valida identidad",
    desc: "INE por ambos lados, selfie y consentimiento biométrico documentado.",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Lee y firma contrato",
    desc: "Cláusulas completas, aceptaciones expresas y firma digital con folio.",
  },
  {
    n: "04",
    icon: PenLine,
    title: "Recibe fondos",
    desc: "Folio único, fecha y huella técnica. Fondos disponibles en 24 horas.",
  },
];

const contractFeatures = [
  "Folio único de documento",
  "QR de validación en tiempo real",
  "Firma digital con huella técnica SHA-256",
  "Cláusulas legales completas",
  "Tabla de amortización detallada",
  "Póliza de protección incluida",
];

const stats = [
  { value: "500+", label: "Clientes atendidos", color: "landing-num-blue" },
  { value: "$5M+", label: "Pesos otorgados", color: "landing-num-green" },
  { value: "7%", label: "Tasa anual fija — sin sorpresas", color: "landing-num-amber" },
  { value: "24h", label: "Tiempo promedio de respuesta", color: "landing-num-pink" },
];

const faqs = [
  {
    q: "¿Es seguro que me aprueben?",
    a: "No. Los montos son referenciales y todo financiamiento queda sujeto a evaluación crediticia, validación documental y formalización contractual.",
  },
  {
    q: "¿Cómo sé que Impulso Go es real?",
    a: "La entidad está registrada en SIPRES de CONDUSEF. Puede verificarlo directamente en el portal público. Esa consulta verifica el registro oficial de la SOFOM.",
  },
  {
    q: "¿Por qué necesitan mi INE?",
    a: "Para prevenir suplantación, documentar consentimiento y conservar un expediente trazable cuando se formaliza el contrato. Es requerimiento legal de CONDUSEF.",
  },
  {
    q: "¿Cuánto pagaré realmente?",
    a: `Tasa anual fija de ${INSTITUTION.annualRatePercent}% con plazos de ${INSTITUTION.allowedTermsYears.join(", ")} años. El monto mínimo es $10,000 MXN. Use el simulador para una referencia personalizada.`,
  },
];

function HomePage() {
  return (
    <div className="landing min-h-screen">
      <PublicHeader />
      <main id="top" className="pt-16">
        <Hero />
        <TrustBar />
        <SimuladorSection />
        <ProcesoSection />
        <ContratoPreview />
        <Numbers />
        <Faq />
        <CtaContact />
      </main>
      <PublicFooter />
      <WhatsAppFab />
    </div>
  );
}

/* ───────────────────── HERO ───────────────────── */
function Hero() {
  return (
    <section className="landing-hero-bg relative isolate overflow-hidden">
      <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#60A5FA] backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5" />
          SOFOM E.N.R. · Registro SIPRES CONDUSEF
        </span>

        <h1 className="display mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Financiamiento formal.
          <span className="block bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">
            Firma digital.
          </span>
          Fondos en 24 horas.
        </h1>

        <p className="mt-5 max-w-2xl text-base text-[#9CA3AF] sm:text-lg">
          {INSTITUTION.annualRatePercent}% anual fija · 100% en línea · Registro CONDUSEF
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[#D1D5DB]">
          {trustPills.map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <CircleCheckBig className="h-4 w-4 text-[#10B981]" />
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex w-full max-w-md flex-col items-stretch gap-3">
          <a
            href="#simulador"
            className="landing-cta inline-flex h-14 items-center justify-center gap-2 rounded-xl px-6 text-base font-bold text-white"
          >
            Simular mi crédito
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href={BRAND.sipresUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#60A5FA] hover:text-white"
          >
            Verificar registro CONDUSEF ↗
          </a>
        </div>

        <a
          href="#simulador"
          aria-label="Bajar al simulador"
          className="landing-bounce mt-14 text-[#60A5FA]"
        >
          <ChevronDown className="h-7 w-7" />
        </a>
      </div>
    </section>
  );
}

/* ─────────────────── TRUST BAR ─────────────────── */
function TrustBar() {
  return (
    <section className="-mt-8 px-4 sm:px-6">
      <div className="landing-glass mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 rounded-2xl px-4 py-3 text-xs text-[#D1D5DB] sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="hidden font-semibold text-[#9CA3AF] sm:inline">
            Entidad registrada ante autoridades mexicanas
          </span>
          <span className="flex items-center gap-2">
            <img src={ASSETS.sipres} alt="SIPRES" className="h-7 w-7 rounded bg-white object-contain p-0.5" />
            <img src={ASSETS.condusef} alt="CONDUSEF" className="h-7 w-7 rounded bg-white object-contain p-0.5" />
          </span>
        </div>
        <a
          href={`${BRAND.whatsappUrl}&utm_source=landing&utm_medium=trustbar`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-5 py-2 text-xs font-bold text-white shadow-[0_0_18px_rgba(59,130,246,0.45)]"
        >
          Iniciar trámite <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}

/* ─────────────────── SIMULADOR ─────────────────── */
function SimuladorSection() {
  return (
    <section id="simulador" className="px-4 pb-24 pt-16 sm:px-6">
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">
          Simulador
        </p>
        <h2 className="display mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Conoce tu cuota antes de avanzar
        </h2>
      </div>
      <Simulator />
    </section>
  );
}

/* ─────────────────── PROCESO ─────────────────── */
function ProcesoSection() {
  return (
    <section id="proceso" className="border-t border-white/5 bg-[#0F172A]/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Proceso en 4 pasos"
          title="Trámite documentado y trazable de extremo a extremo."
          desc="Cada etapa deja evidencia técnica que se conserva como mensaje de datos."
        />
        <div className="landing-snap mt-12 flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {processSteps.map((s, i) => (
            <div
              key={s.n}
              className="landing-glass landing-glass-hover relative w-[280px] flex-none rounded-2xl p-6 lg:w-auto"
            >
              <span className="display absolute right-5 top-4 text-5xl font-extrabold text-[#3B82F6]/25">
                {s.n}
              </span>
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#3B82F6]/30 to-[#60A5FA]/10 text-[#60A5FA]">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="display mt-4 text-lg font-extrabold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{s.desc}</p>
              {i < processSteps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-[#3B82F6]/40 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── CONTRATO PREVIEW ─────────────── */
function ContratoPreview() {
  return (
    <section id="contrato" className="border-t border-white/5 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Mockup */}
        <div className="flex justify-center">
          <div className="landing-mockup relative w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 text-[#1E3A5F] shadow-2xl">
            {/* header doc */}
            <div className="-mx-6 -mt-6 mb-4 flex items-center justify-between rounded-t-2xl bg-[#1E3A5F] px-6 py-4 text-white">
              <div>
                <p className="display text-xs font-bold uppercase tracking-[0.18em]">
                  Impulso Go
                </p>
                <p className="text-[10px] text-white/60">SOFOM, E.N.R.</p>
              </div>
              <span className="font-mono text-[10px]">IG-2026-9622</span>
            </div>
            <p className="display text-center text-xl font-extrabold">CONTRATO DE CRÉDITO</p>
            <p className="mt-1 text-center text-[10px] text-[#6B7280]">
              Y OTORGAMIENTO DE FINANCIAMIENTO
            </p>
            <div className="my-4 grid grid-cols-2 gap-3 text-[11px]">
              <div className="rounded bg-[#F8FAFC] p-3">
                <p className="font-bold uppercase tracking-wider text-[#6B7280]">Monto</p>
                <p className="display text-lg font-extrabold">$50,000</p>
              </div>
              <div className="rounded bg-[#1E3A5F] p-3 text-white">
                <p className="font-bold uppercase tracking-wider text-white/65">Tasa anual</p>
                <p className="display text-lg font-extrabold">7.00%</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 rounded bg-[#E5E7EB]" />
              <div className="h-1.5 w-11/12 rounded bg-[#E5E7EB]" />
              <div className="h-1.5 w-9/12 rounded bg-[#E5E7EB]" />
              <div className="h-1.5 w-10/12 rounded bg-[#E5E7EB]" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div className="grid h-14 w-14 place-items-center rounded border border-[#E5E7EB] bg-[#F8FAFC] text-[#1E3A5F]">
                <QrCode className="h-7 w-7" />
              </div>
              <div className="grid h-16 w-16 -rotate-12 place-items-center rounded-full border-2 border-[#F59E0B] text-center text-[8px] font-bold leading-tight text-[#F59E0B]">
                DOC.<br />ELECTRÓNICO<br />VÁLIDO
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">
            Tu contrato formal
          </p>
          <h2 className="display mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Documento institucional con validez plena
          </h2>
          <p className="mt-3 text-sm text-[#9CA3AF]">
            Conforme a la Ley de Firma Electrónica Avanzada. Cada PDF incluye huella técnica conservable como medio de prueba.
          </p>
          <ul className="mt-6 space-y-3">
            {contractFeatures.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#D1D5DB]"
              >
                <CircleCheckBig className="mt-0.5 h-4 w-4 flex-none text-[#10B981]" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-1.5 text-xs font-bold text-[#10B981]">
            <FileSignature className="h-3.5 w-3.5" />
            Validez jurídica plena
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── NÚMEROS ─────────────────── */
function Numbers() {
  return (
    <section className="border-t border-white/5 bg-[#0F172A]/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="landing-glass landing-glass-hover rounded-2xl p-6 text-center">
      <p
        className={`display text-4xl font-extrabold tracking-tight transition-all duration-700 sm:text-5xl ${color} ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
        {label}
      </p>
    </div>
  );
}

/* ─────────────────── FAQ ─────────────────── */
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Preguntas frecuentes"
          title="Todo lo que conviene aclarar antes de firmar."
        />
        <div className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-white">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-none text-[#60A5FA] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden px-6 transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 text-sm leading-7 text-[#9CA3AF]">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── CTA CONTACTO ──────────────── */
function CtaContact() {
  return (
    <section id="contacto" className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="landing-glass relative overflow-hidden rounded-3xl p-10 text-center sm:p-14">
          <div className="absolute inset-0 -z-10 landing-hero-bg opacity-60" />
          <Sparkles className="mx-auto h-8 w-8 text-[#60A5FA]" />
          <h2 className="display mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            ¿Listo para iniciar tu trámite con respaldo formal?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#9CA3AF] sm:text-base">
            Habla con un asesor por WhatsApp o ingresa al sistema interno para
            gestionar tu expediente.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={`${BRAND.whatsappUrl}&utm_source=landing&utm_medium=cta-final`}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-cta-success inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white"
            >
              Hablar por WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/login"
              className="inline-flex h-12 items-center rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-bold text-white backdrop-blur hover:bg-white/10"
            >
              Acceso interno
            </Link>
          </div>
        </div>
      </div>
    </section>
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
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">
        {eyebrow}
      </p>
      <h2 className="display mt-2 text-balance text-3xl font-extrabold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      {desc && <p className="mt-3 text-sm leading-7 text-[#9CA3AF] md:text-base">{desc}</p>}
    </div>
  );
}
