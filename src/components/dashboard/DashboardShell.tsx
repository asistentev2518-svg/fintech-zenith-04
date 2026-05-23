import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderArchive,
  FileSignature,
  TableProperties,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Search,
} from "lucide-react";
import { INSTITUTION } from "@/lib/config";

const navItems = [
  { to: "/dashboard", label: "Resumen", icon: LayoutDashboard, ready: true },
  { to: "/expedientes", label: "Expedientes", icon: FolderArchive, ready: true },
  { to: "/contratos", label: "Contratos", icon: FileSignature, ready: true },
  { to: "/tablas", label: "Tablas de montos", icon: TableProperties, ready: true },
  { to: "/configuracion", label: "Configuración", icon: Settings, ready: true },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const logout = () => {
    sessionStorage.removeItem("ig.session");
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen bg-surface-alt">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg gradient-brand text-white shadow-card-soft">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-black tracking-tight text-foreground">
                {INSTITUTION.shortName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Sistema interno
              </span>
            </span>
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 p-3">
          <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
            General
          </p>
          {navItems.map((item) => {
            const active =
              pathname === item.to ||
              (item.to !== "/dashboard" && pathname.startsWith(item.to));
            const className = `group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
              active
                ? "bg-surface text-institutional"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`;
            const inner = (
              <>
                <item.icon
                  className={`h-4 w-4 ${active ? "text-action" : "text-muted-foreground group-hover:text-foreground"}`}
                />
                {item.label}
                {!item.ready && (
                  <span className="ml-auto rounded-full bg-surface px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-action">
                    Pronto
                  </span>
                )}
                {active && item.ready && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-action" />}
              </>
            );
            return item.ready ? (
              <Link
                key={item.to}
                to={item.to as string}
                onClick={() => setOpen(false)}
                className={className}
              >
                {inner}
              </Link>
            ) : (
              <button
                key={item.to}
                type="button"
                onClick={() => setOpen(false)}
                className={`${className} cursor-not-allowed opacity-70`}
                disabled
              >
                {inner}
              </button>
            );
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-sidebar-border p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Menú"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar expediente, folio, cliente…"
              className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-action focus:ring-2 focus:ring-action/15"
            />
          </div>

          <button className="relative grid h-10 w-10 place-items-center rounded-md text-muted-foreground hover:bg-accent">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-action" />
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-border bg-card pl-3 pr-1 py-1 sm:flex">
            <div className="flex flex-col text-right leading-tight">
              <span className="text-xs font-bold text-foreground">Operador</span>
              <span className="text-[10px] text-muted-foreground">Sesión activa</span>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-full gradient-brand text-xs font-black text-white">
              OP
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
