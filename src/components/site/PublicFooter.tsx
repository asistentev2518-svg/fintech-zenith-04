import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { BRAND, INSTITUTION } from "@/lib/config";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-[#03183f] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="text-sm font-black uppercase tracking-[0.14em] text-white">
              {INSTITUTION.shortName}
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
            {INSTITUTION.legalName}. Entidad registrada con presencia documental
            en SIPRES de CONDUSEF. La simulación es referencial y no implica
            aprobación crediticia.
          </p>
          <p className="mt-3 text-xs text-white/55">{INSTITUTION.address}</p>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.16em] text-white">
            Plataforma
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/#simulador" className="hover:text-white">Simulador</a></li>
            <li><a href="/#proceso" className="hover:text-white">Proceso</a></li>
            <li><Link to="/contrato-electronico" className="text-white/60 hover:text-white">Contrato electrónico</Link></li>
            <li><Link to="/login" className="hover:text-white">Acceso interno</Link></li>
            <li>
              <a href={BRAND.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp asesor
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.16em] text-white">
            Legal
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/aviso-de-privacidad" className="hover:text-white">Aviso de privacidad</Link></li>
            <li><Link to="/terminos-y-condiciones" className="hover:text-white">Términos y condiciones</Link></li>
            <li>
              <a href={BRAND.sipresUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Consultar SIPRES
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:px-6">
          <span>© {new Date().getFullYear()} {INSTITUTION.legalName}</span>
          <span>Tasa anual fija {INSTITUTION.annualRatePercent}% · Plazos {INSTITUTION.allowedTermsYears.join(", ")} años</span>
        </div>
      </div>
    </footer>
  );
}
