import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { BRAND, INSTITUTION } from "@/lib/config";

const nav = [
  { label: "Inicio", to: "/#top" },
  { label: "Simulador", to: "/#simulador" },
  { label: "Proceso", to: "/#proceso" },
  { label: "Contrato", to: "/#contrato" },
  { label: "FAQ", to: "/#faq" },
  { label: "Contacto", to: "/#contacto" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled
          ? "bg-[rgba(10,14,26,0.78)] backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] text-white shadow-[0_0_20px_rgba(59,130,246,0.45)]">
            <Sparkles className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-white">
              {INSTITUTION.shortName}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9CA3AF]">
              SOFOM · E.N.R.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a
              key={item.to}
              href={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#D1D5DB] transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/login"
            className="rounded-md px-3 py-2 text-sm font-semibold text-[#D1D5DB] hover:text-white"
          >
            Acceso interno
          </Link>
          <a
            href={`${BRAND.whatsappUrl}&utm_source=landing&utm_medium=navbar&utm_campaign=cta`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-5 text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.45)] transition hover:opacity-95"
          >
            Iniciar trámite
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md text-white hover:bg-white/5 lg:hidden"
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="mx-3 mb-3 rounded-2xl border border-white/10 bg-[rgba(10,14,26,0.92)] backdrop-blur-xl">
            <div className="flex flex-col gap-1 p-3">
              {nav.map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-white hover:bg-white/5"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/login"
                className="rounded-md px-3 py-3 text-sm font-semibold text-[#D1D5DB] hover:bg-white/5 hover:text-white"
              >
                Acceso interno
              </Link>
              <a
                href={`${BRAND.whatsappUrl}&utm_source=landing&utm_medium=mobile-nav`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 text-sm font-bold text-white"
              >
                Iniciar trámite
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
