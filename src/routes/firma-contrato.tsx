import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { ContractWizard } from "@/components/contract/ContractWizard";

export const Route = createFileRoute("/firma-contrato")({
  head: () => ({
    meta: [
      { title: "Firma tu contrato — Impulso Go" },
      { name: "description", content: "Proceso digital para firma de contrato de financiamiento Impulso Go." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FirmaContratoPage,
});

function FirmaContratoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      <PublicHeader />
      <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-action">
            Firma digital
          </p>
          <h1 className="mt-2 text-balance text-3xl font-black tracking-tight text-institutional sm:text-4xl">
            Contrato electrónico Impulso Go
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Completa cada paso para firmar tu contrato con folio, fecha y huella
            técnica de generación.
          </p>
        </div>
        <ContractWizard />
      </main>
      <PublicFooter />
    </div>
  );
}
