import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { ASSETS, INSTITUTION } from "@/lib/config";
import { login as doLogin } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acceso interno — Impulso Go" },
      { name: "description", content: "Acceso al sistema interno de gestión documental de Impulso Go." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (!email || !password) {
      setError("Ingresa usuario y contraseña.");
      setLoading(false);
      return;
    }
    sessionStorage.setItem("ig.session", JSON.stringify({ email, at: Date.now() }));
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative isolate hidden overflow-hidden gradient-hero text-white lg:block">
        <img
          src={ASSETS.hero2}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="panel-grid absolute inset-0 -z-10 opacity-30" />
        <div className="flex h-full flex-col justify-between p-12">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 backdrop-blur">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-black tracking-tight">{INSTITUTION.shortName}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
                Sistema interno
              </span>
            </span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-balance text-3xl font-black leading-tight">
              Operación financiera con trazabilidad documental.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Plataforma interna para gestión de expedientes, contratos firmados
              y exportaciones institucionales.
            </p>
          </div>

          <p className="text-[11px] text-white/55">
            © {new Date().getFullYear()} {INSTITUTION.legalName}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center bg-background px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-action">
            <Lock className="h-3.5 w-3.5" />
            Acceso restringido
          </div>
          <h1 className="text-3xl font-black tracking-tight text-institutional">
            Inicia sesión
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa con tus credenciales corporativas.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Field label="Correo corporativo" htmlFor="email">
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground outline-none transition focus:border-action focus:ring-4 focus:ring-action/15"
                placeholder="nombre@impulsogo.mx"
              />
            </Field>
            <Field label="Contraseña" htmlFor="password">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground outline-none transition focus:border-action focus:ring-4 focus:ring-action/15"
                placeholder="••••••••"
              />
            </Field>

            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md gradient-brand text-sm font-bold text-white shadow-card-soft transition hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Validando…" : "Ingresar al sistema"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              ¿Problemas para acceder?{" "}
              <Link to="/" className="font-bold text-action hover:underline">
                Contacta a TI
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
