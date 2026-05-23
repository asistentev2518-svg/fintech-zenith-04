import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { INSTITUTION } from "@/lib/config";

export const Route = createFileRoute("/aviso-de-privacidad")({
  head: () => ({
    meta: [
      { title: "Aviso de Privacidad — Impulso Go" },
      { name: "description", content: "Aviso de privacidad integral de Impulso Go, S.A. de C.V., SOFOM, E.N.R." },
    ],
  }),
  component: AvisoPage,
});

function AvisoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-action">Legal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-institutional">
          Aviso de Privacidad
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {INSTITUTION.legalName}, con domicilio en {INSTITUTION.address}, es responsable
          del tratamiento de los datos personales que el titular le proporcione.
        </p>

        <div className="prose prose-sm mt-10 max-w-none text-foreground prose-headings:text-institutional prose-headings:font-black prose-headings:tracking-tight prose-p:leading-7 prose-p:text-foreground/80">
          <h2>Finalidades del tratamiento</h2>
          <p>
            Los datos personales recabados se utilizan para identificación del cliente,
            integración del expediente, evaluación crediticia, formalización del contrato,
            prevención de fraude y cumplimiento de obligaciones legales.
          </p>
          <h2>Datos personales recabados</h2>
          <p>
            Nombre, identificación oficial (INE), imagen facial, CURP, teléfono, correo
            electrónico, domicilio, información financiera y datos generados durante el
            proceso de firma electrónica (folio, fecha, dispositivo, huella técnica).
          </p>
          <h2>Transferencias</h2>
          <p>
            La información no se comparte con terceros sin el consentimiento expreso del
            titular, salvo aquellas transferencias previstas por disposición legal.
          </p>
          <h2>Derechos ARCO</h2>
          <p>
            El titular puede ejercer en cualquier momento sus derechos de Acceso,
            Rectificación, Cancelación u Oposición a través de los canales oficiales de
            atención de {INSTITUTION.shortName}.
          </p>
          <h2>Vigencia</h2>
          <p>
            Este aviso podrá actualizarse en cualquier momento. Las modificaciones se
            informarán mediante la plataforma institucional.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
