import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { BRAND, INSTITUTION } from "@/lib/config";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0E1A] text-[#9CA3AF]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Producto */}
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] text-white">
              <Sparkles className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="text-sm font-extrabold uppercase tracking-[0.16em] text-white">
              {INSTITUTION.shortName}
            </span>
          </div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
            Producto
          </h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#simulador" className="hover:text-white">Simulador</a></li>
            <li><a href="#proceso" className="hover:text-white">Proceso</a></li>
            <li><a href="#faq" className="hover:text-white">Preguntas frecuentes</a></li>
            <li><a href="#contacto" className="hover:text-white">Contacto</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
            Legal
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/aviso-de-privacidad" className="hover:text-white">Aviso de privacidad</Link></li>
            <li><Link to="/terminos-y-condiciones" className="hover:text-white">Términos y condiciones</Link></li>
            <li>
              <a href={BRAND.sipresUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Buró de Entidades Financieras
              </a>
            </li>
            <li>
              <a href={BRAND.condusefUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                CONDUSEF · SIPRES
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
            Contacto
          </h4>
          <p className="text-sm leading-6">
            Fresas 12, Int. 10, Col. Tlacoquemécatl<br />
            C.P. 03200, Benito Juárez, CDMX
          </p>
          <p className="mt-3 text-xs text-[#6B7280]">
            Registro SIPRES: <span className="font-mono text-[#9CA3AF]">16103</span>
          </p>
          <p className="text-xs text-[#6B7280]">
            WhatsApp: <a href={BRAND.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">{BRAND.whatsappDisplay}</a>
          </p>
        </div>

        {/* Seguridad */}
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
            Seguridad
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Certificado SSL/TLS</li>
            <li>Cifrado AES-256</li>
            <li>Validación biométrica</li>
            <li>Expediente documental trazable</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-[#6B7280] sm:flex-row sm:items-center sm:px-6">
          <span>© {new Date().getFullYear()} {INSTITUTION.legalName}</span>
          <span>
            Tasa anual fija {INSTITUTION.annualRatePercent}% · Plazos {INSTITUTION.allowedTermsYears.join(", ")} años · Mínimo $10,000 MXN
          </span>
        </div>
      </div>
    </footer>
  );
}
