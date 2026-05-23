import { createFileRoute } from "@tanstack/react-router";
import { Settings, ShieldCheck, Building2, Percent } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { INSTITUTION, BRAND } from "@/lib/config";

export const Route = createFileRoute("/_authenticated/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — Impulso Go" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfiguracionPage,
});

function ConfiguracionPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Sistema</p>
          <h1 className="text-3xl font-black tracking-tight text-institutional">Configuración</h1>
          <p className="text-sm text-muted-foreground">
            Parámetros institucionales y financieros vigentes. Esta vista es de solo lectura; cualquier ajuste se realiza desde el código fuente.
          </p>
        </header>

        <Card icon={Building2} title="Identidad institucional">
          <Row label="Razón social" value={INSTITUTION.legalName} />
          <Row label="Nombre corto" value={INSTITUTION.shortName} />
          <Row label="Domicilio" value={INSTITUTION.address} />
          <Row label="Representante" value={`${INSTITUTION.representative} — ${INSTITUTION.representativeTitle}`} />
          <Row label="Jurisdicción" value={INSTITUTION.jurisdiction} />
        </Card>

        <Card icon={Percent} title="Parámetros financieros">
          <Row label="Tasa anual fija" value={`${INSTITUTION.annualRatePercent}%`} />
          <Row label="Penalización por mora" value={`${INSTITUTION.penaltyPercent}%`} />
          <Row label="Plazos disponibles" value={`${INSTITUTION.allowedTermsYears.join(", ")} años`} />
          <Row label="Monto mínimo" value={`$${INSTITUTION.minAmount.toLocaleString("es-MX")}`} />
          <Row label="Incremento" value={`$${INSTITUTION.amountIncrement.toLocaleString("es-MX")}`} />
        </Card>

        <Card icon={ShieldCheck} title="Canales y validación">
          <Row label="WhatsApp" value={BRAND.whatsappDisplay} />
          <Row label="SIPRES / CONDUSEF" value={BRAND.sipresUrl} mono />
        </Card>

        <Card icon={Settings} title="Sesión">
          <p className="text-sm text-muted-foreground">
            La sesión actual se mantiene en almacenamiento de sesión del navegador. Para cerrarla, utiliza el botón
            <span className="font-bold text-foreground"> Cerrar sesión </span>
            en la barra lateral.
          </p>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Settings;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
      <header className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-surface text-action">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-base font-black text-institutional">{title}</h2>
      </header>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-[200px_1fr] sm:items-center sm:gap-4">
      <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold text-foreground ${mono ? "break-all font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}
