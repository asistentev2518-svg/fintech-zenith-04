import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  FileSignature,
  CalendarClock,
  History,
  MessageSquare,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { findContract, type SignedContract } from "@/lib/contracts";
import { calculateMonthlyPayment, formatMXN } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/expedientes/$folio")({
  head: ({ params }) => ({
    meta: [
      { title: `Expediente ${params.folio} — Impulso Go` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExpedienteDetail,
});

type TabKey = "resumen" | "documentacion" | "contrato" | "pagos" | "historial" | "comunicacion";

const TABS: { key: TabKey; label: string; icon: typeof FileText }[] = [
  { key: "resumen", label: "Resumen", icon: FileText },
  { key: "documentacion", label: "Documentación", icon: ShieldCheck },
  { key: "contrato", label: "Contrato", icon: FileSignature },
  { key: "pagos", label: "Pagos", icon: CalendarClock },
  { key: "historial", label: "Historial", icon: History },
  { key: "comunicacion", label: "Comunicación", icon: MessageSquare },
];

function ExpedienteDetail() {
  const { folio } = Route.useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("resumen");
  const [copied, setCopied] = useState(false);

  const contract = useMemo<SignedContract | null>(
    () => (typeof window === "undefined" ? null : findContract(folio)),
    [folio],
  );

  if (!contract) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-10 text-center shadow-card-soft">
          <h1 className="text-xl font-black text-foreground">Expediente no encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No existe ningún expediente con folio <span className="font-mono">{folio}</span>.
          </p>
          <button
            onClick={() => navigate({ to: "/expedientes" })}
            className="mt-6 inline-flex items-center gap-2 rounded-md gradient-brand px-4 py-2 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a expedientes
          </button>
        </div>
      </DashboardShell>
    );
  }

  const copy = async () => {
    await navigator.clipboard.writeText(contract.folio);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          to="/expedientes"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-action"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Expedientes
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-card-soft">
          <div className="min-w-0 space-y-1.5">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-action">
              Expediente electrónico
            </p>
            <h1 className="truncate text-2xl font-black text-foreground">{contract.data.fullName}</h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-mono font-bold text-foreground hover:border-action"
              >
                {contract.folio}
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              </button>
              <span>·</span>
              <span>Firmado el {new Date(contract.signedAt).toLocaleString("es-MX")}</span>
            </div>
          </div>
          <StatusPill status={contract.status} />
        </header>

        {/* Tabs */}
        <div className="sticky top-16 z-10 -mx-1 overflow-x-auto rounded-xl border border-border bg-card/95 px-1 py-1 backdrop-blur">
          <nav className="flex gap-1">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3.5 py-2 text-xs font-bold transition ${
                    active
                      ? "bg-action text-action-foreground shadow-card-soft"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  style={active ? { color: "#050A14" } : undefined}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-6">
          {tab === "resumen" && <ResumenTab c={contract} />}
          {tab === "documentacion" && <DocumentacionTab c={contract} />}
          {tab === "contrato" && <ContratoTab c={contract} />}
          {tab === "pagos" && <PagosTab c={contract} />}
          {tab === "historial" && <HistorialTab c={contract} />}
          {tab === "comunicacion" && <ComunicacionTab c={contract} />}
        </div>
      </div>
    </DashboardShell>
  );
}

function StatusPill({ status }: { status: SignedContract["status"] }) {
  const tone =
    status === "Firmado"
      ? "bg-success-light text-success"
      : status === "Pendiente"
        ? "bg-amber-500/10 text-amber-500"
        : "bg-destructive/15 text-destructive";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
      <header className="border-b border-border px-5 py-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Row({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-border/60 py-3 last:border-0 sm:grid-cols-[180px_1fr]">
      <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className={`text-sm font-semibold text-foreground ${mono ? "break-all font-mono text-xs" : ""}`}>{v}</span>
    </div>
  );
}

function ResumenTab({ c }: { c: SignedContract }) {
  const { cuota, total, interest } = calculateMonthlyPayment(c.data.amount, c.data.termYears);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Identidad">
        <Row k="Nombre" v={c.data.fullName} />
        <Row k="CURP" v={c.data.curp} mono />
        <Row k="RFC" v={c.data.rfc} mono />
        <Row k="Teléfono" v={c.data.phone} />
        <Row k="Domicilio" v={c.data.address} />
      </Card>
      <Card title="Operación financiera">
        <Row k="Monto" v={formatMXN(c.data.amount)} />
        <Row k="Plazo" v={`${c.data.termYears} años`} />
        <Row k="Mensualidad" v={formatMXN(cuota)} />
        <Row k="Interés total" v={formatMXN(interest)} />
        <Row k="Total a pagar" v={formatMXN(total)} />
      </Card>
    </div>
  );
}

function DocumentacionTab({ c }: { c: SignedContract }) {
  const items: { label: string; src: string }[] = [
    { label: "INE — frente", src: c.identity.ineFrontDataUrl },
    { label: "INE — reverso", src: c.identity.ineBackDataUrl },
    { label: "Selfie biométrica", src: c.identity.selfieDataUrl },
    { label: "Firma autógrafa", src: c.signatureDataUrl },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="overflow-hidden rounded-xl border border-border bg-card shadow-card-soft">
          <div className="aspect-[4/3] bg-surface-alt">
            {it.src ? (
              <img src={it.src} alt={it.label} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-xs text-muted-foreground">Sin captura</div>
            )}
          </div>
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-xs font-bold text-foreground">{it.label}</span>
            {it.src && (
              <a
                href={it.src}
                download={`${c.folio}_${it.label.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.png`}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-bold hover:border-action"
              >
                <Download className="h-3 w-3" /> PNG
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ContratoTab({ c }: { c: SignedContract }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Evidencia técnica">
        <Row k="Folio" v={c.folio} mono />
        <Row k="Hash SHA-256" v={c.hash} mono />
        <Row k="Firmado en" v={new Date(c.signedAt).toLocaleString("es-MX")} />
        <Row k="Dispositivo" v={c.userAgent} mono />
        <Row k="Consentimiento biométrico" v={c.identity.biometricConsent ? "Sí" : "No"} />
      </Card>
      <Card title="Aceptaciones del titular">
        <ul className="space-y-2.5 text-sm">
          {c.acceptances.map((a, i) => (
            <li key={i} className="flex gap-2 text-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function PagosTab({ c }: { c: SignedContract }) {
  const { cuota, months } = calculateMonthlyPayment(c.data.amount, c.data.termYears);
  const start = new Date(c.signedAt);
  return (
    <Card title={`Plan de pagos — ${months} mensualidades`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-right">Cuota</th>
              <th className="px-3 py-2 text-right">Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.min(months, 24) }).map((_, i) => {
              const d = new Date(start);
              d.setMonth(d.getMonth() + i + 1);
              return (
                <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-surface-alt">
                  <td className="px-3 py-2.5 font-mono text-xs">{(i + 1).toString().padStart(3, "0")}</td>
                  <td className="px-3 py-2.5">{d.toLocaleDateString("es-MX")}</td>
                  <td className="px-3 py-2.5 text-right font-bold tabular-nums">{formatMXN(cuota)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                    {formatMXN(cuota * (i + 1))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {months > 24 && (
          <p className="px-3 py-3 text-center text-xs text-muted-foreground">
            Mostrando las primeras 24 de {months} cuotas. Descarga el PDF de tabla de pagos para el plan completo.
          </p>
        )}
      </div>
    </Card>
  );
}

function HistorialTab({ c }: { c: SignedContract }) {
  const events = [
    { t: c.signedAt, label: "Contrato firmado", desc: `Folio ${c.folio} emitido con hash técnico.` },
    { t: c.signedAt, label: "Aceptaciones registradas", desc: `${c.acceptances.length} declaraciones aceptadas.` },
    { t: c.signedAt, label: "Identidad validada", desc: "INE frente, reverso y selfie capturados." },
    { t: c.signedAt, label: "Expediente creado", desc: "Almacenado en evidencia interna." },
  ];
  return (
    <Card title="Línea de tiempo">
      <ol className="relative space-y-5 border-l-2 border-border pl-5">
        {events.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-action bg-card" />
            <p className="text-xs font-bold uppercase tracking-wider text-action">
              {new Date(e.t).toLocaleString("es-MX")}
            </p>
            <p className="text-sm font-black text-foreground">{e.label}</p>
            <p className="text-xs text-muted-foreground">{e.desc}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function ComunicacionTab({ c }: { c: SignedContract }) {
  return (
    <Card title="Canales de comunicación">
      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Aún no hay comunicaciones registradas. Cuando envíes notificaciones por WhatsApp, correo o SMS,
          se registrarán aquí con sello de tiempo y resultado de entrega.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <a
            href={`https://wa.me/${c.data.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground hover:border-action"
          >
            <MessageSquare className="h-4 w-4" /> Abrir WhatsApp
          </a>
          <a
            href={`tel:${c.data.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground hover:border-action"
          >
            Llamar a {c.data.phone}
          </a>
        </div>
      </div>
    </Card>
  );
}
