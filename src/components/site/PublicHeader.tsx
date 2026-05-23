import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { BRAND, INSTITUTION } from "@/lib/config";

const nav = [
  { label: "Simulador", to: "/#simulador" },
  { label: "Proceso", to: "/#proceso" },
  { label: "Confianza", to: "/#confianza" },
  { label: "Preguntas", to: "/#faq" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg gradient-brand text-white shadow-card-soft">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-black tracking-tight text-foreground">
              {INSTITUTION.shortName}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              SOFOM E.N.R.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.to}
              href={item.to}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-institutional"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="rounded-md px-3 py-2 text-sm font-bold text-institutional hover:bg-accent"
          >
            Acceso interno
          </Link>
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-md gradient-brand px-4 text-sm font-bold text-white shadow-card-soft transition hover:opacity-95"
          >
            Hablar con asesor
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md text-institutional hover:bg-accent md:hidden"
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => (
              <a
                key={item.to}
                href={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/login"
              className="rounded-md px-3 py-2.5 text-sm font-bold text-institutional hover:bg-accent"
            >
              Acceso interno
            </Link>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex h-11 items-center justify-center rounded-md gradient-brand px-4 text-sm font-bold text-white"
            >
              Hablar con asesor
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
