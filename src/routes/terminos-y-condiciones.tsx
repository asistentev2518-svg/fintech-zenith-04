import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { INSTITUTION } from "@/lib/config";

export const Route = createFileRoute("/terminos-y-condiciones")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones — Impulso Go" },
      { name: "description", content: "Términos y condiciones de uso de la plataforma Impulso Go." },
    ],
  }),
  component: TerminosPage,
});

function TerminosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-action">Legal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-institutional">
          Términos y Condiciones
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          El acceso y uso de la plataforma de {INSTITUTION.shortName} implica la
          aceptación íntegra de los presentes términos.
        </p>

        <div className="prose prose-sm mt-10 max-w-none text-foreground prose-headings:text-institutional prose-headings:font-black prose-headings:tracking-tight prose-p:leading-7 prose-p:text-foreground/80">
          <h2>Objeto</h2>
          <p>
            La plataforma facilita la simulación, integración documental y firma
            electrónica de contratos de financiamiento. La simulación es referencial y
            no implica aprobación crediticia.
          </p>
          <h2>Formalización</h2>
          <p>
            Toda operación queda sujeta a evaluación crediticia, validación documental
            y formalización contractual conforme a la legislación aplicable.
          </p>
          <h2>Tasa y plazos</h2>
          <p>
            Tasa anual fija de {INSTITUTION.annualRatePercent}% con plazos autorizados de{" "}
            {INSTITUTION.allowedTermsYears.join(", ")} años.
          </p>
          <h2>Jurisdicción</h2>
          <p>
            Las partes se someten a la jurisdicción de los tribunales competentes de{" "}
            {INSTITUTION.jurisdiction}, renunciando a cualquier otra que pudiera
            corresponderles.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
