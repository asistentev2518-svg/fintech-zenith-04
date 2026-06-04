import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Building2,
  Percent,
  Users,
  FileLock2,
  Bell,
  Plug,
} from "lucide-react";
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

type TabKey = "parametros" | "usuarios" | "privacidad" | "notificaciones" | "integraciones";

const TABS: { key: TabKey; label: string; icon: typeof Settings }[] = [
  { key: "parametros", label: "Parámetros", icon: Percent },
  { key: "usuarios", label: "Usuarios", icon: Users },
  { key: "privacidad", label: "Aviso de privacidad", icon: FileLock2 },
  { key: "notificaciones", label: "Notificaciones", icon: Bell },
  { key: "integraciones", label: "Integraciones", icon: Plug },
];

function ConfiguracionPage() {
  const [tab, setTab] = useState<TabKey>("parametros");

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">Sistema</p>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Configuración</h1>
          <p className="text-sm text-muted-foreground">
            Centro de control institucional. Vista de solo lectura para la presente revisión operativa.
          </p>
        </header>

        <nav className="sticky top-16 z-10 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card/95 p-1 backdrop-blur">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3.5 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-action text-[#050A14] shadow-card-soft"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {tab === "parametros" && <ParametrosTab />}
        {tab === "usuarios" && <UsuariosTab />}
        {tab === "privacidad" && <PrivacidadTab />}
        {tab === "notificaciones" && <NotificacionesTab />}
        {tab === "integraciones" && <IntegracionesTab />}
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
        <h2 className="text-base font-black text-foreground">{title}</h2>
      </header>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-4">
      <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold text-foreground ${mono ? "break-all font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function ParametrosTab() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card icon={Building2} title="Identidad institucional">
        <Row label="Razón social" value={INSTITUTION.legalName} />
        <Row label="Nombre corto" value={INSTITUTION.shortName} />
        <Row label="Domicilio" value={INSTITUTION.address} />
        <Row
          label="Representante"
          value={`${INSTITUTION.representative} — ${INSTITUTION.representativeTitle}`}
        />
        <Row label="Jurisdicción" value={INSTITUTION.jurisdiction} />
      </Card>
      <Card icon={Percent} title="Parámetros financieros">
        <Row label="Tasa anual fija" value={`${INSTITUTION.annualRatePercent}%`} />
        <Row label="Penalización por mora" value={`${INSTITUTION.penaltyPercent}%`} />
        <Row label="Plazos disponibles" value={`${INSTITUTION.allowedTermsYears.join(", ")} años`} />
        <Row label="Monto mínimo" value={`$${INSTITUTION.minAmount.toLocaleString("es-MX")}`} />
        <Row label="Incremento" value={`$${INSTITUTION.amountIncrement.toLocaleString("es-MX")}`} />
      </Card>
    </div>
  );
}

function UsuariosTab() {
  const users = [
    { id: "impulso26", role: "Operador maestro", status: "Activo", last: "Hoy" },
    { id: "soporte01", role: "Soporte", status: "Activo", last: "Ayer" },
    { id: "auditor99", role: "Auditor", status: "Inactivo", last: "Hace 12 d" },
  ];
  return (
    <Card icon={Users} title="Operadores del sistema">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-alt text-[11px] font-black uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">ID</th>
              <th className="px-5 py-3 text-left">Rol</th>
              <th className="px-5 py-3 text-left">Estado</th>
              <th className="px-5 py-3 text-left">Último acceso</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-surface-alt">
                <td className="px-5 py-3.5 font-mono text-xs font-bold text-action">{u.id}</td>
                <td className="px-5 py-3.5 font-semibold text-foreground">{u.role}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      u.status === "Activo"
                        ? "bg-success-light text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{u.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PrivacidadTab() {
  return (
    <Card icon={FileLock2} title="Aviso de privacidad vigente">
      <div className="prose prose-sm max-w-none space-y-3 px-5 py-4 text-sm text-foreground">
        <p className="text-muted-foreground">
          Última actualización: {new Date().toLocaleDateString("es-MX")}.
        </p>
        <p>
          <strong>{INSTITUTION.legalName}</strong> con domicilio en {INSTITUTION.address}, en cumplimiento
          de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, hace de su
          conocimiento que los datos personales recabados serán protegidos y tratados conforme a los
          principios de licitud, calidad, consentimiento, información, finalidad, lealtad,
          proporcionalidad y responsabilidad.
        </p>
        <p>
          Para ejercer los derechos ARCO (Acceso, Rectificación, Cancelación y Oposición), el titular
          puede dirigirse al canal oficial WhatsApp <strong>{BRAND.whatsappDisplay}</strong> o al portal
          SIPRES/CONDUSEF.
        </p>
        <a
          href="/aviso-de-privacidad"
          target="_blank"
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-bold hover:border-action hover:text-action"
        >
          Abrir aviso público completo
        </a>
      </div>
    </Card>
  );
}

function NotificacionesTab() {
  const channels = [
    { name: "WhatsApp transaccional", enabled: true, detail: BRAND.whatsappDisplay },
    { name: "Correo electrónico", enabled: true, detail: "operaciones@impulso.go" },
    { name: "SMS recordatorios", enabled: false, detail: "Provider no configurado" },
    { name: "Webhook interno", enabled: false, detail: "Sin endpoint registrado" },
  ];
  return (
    <Card icon={Bell} title="Canales de notificación">
      <ul className="divide-y divide-border">
        {channels.map((c) => (
          <li key={c.name} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-bold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.detail}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                c.enabled ? "bg-success-light text-success" : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {c.enabled ? "Activo" : "Inactivo"}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function IntegracionesTab() {
  const integ = [
    { name: "SIPRES / CONDUSEF", url: BRAND.sipresUrl, status: "Conectado" },
    { name: "Firma electrónica nativa", url: "Generación local SHA-256", status: "Conectado" },
    { name: "Generación documental PDF", url: "jsPDF vectorial + autoTable", status: "Conectado" },
    { name: "Pasarela de cobranza", url: "Pendiente de contratación", status: "Pendiente" },
  ];
  return (
    <Card icon={ShieldCheck} title="Servicios y APIs">
      <ul className="divide-y divide-border">
        {integ.map((i) => (
          <li key={i.name} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{i.name}</p>
              <p className="break-all font-mono text-[11px] text-muted-foreground">{i.url}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                i.status === "Conectado"
                  ? "bg-success-light text-success"
                  : "bg-amber-500/10 text-amber-500"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {i.status}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
