export const INSTITUTION = {
  legalName: "Impulso Go, S.A. de C.V., SOFOM, E.N.R.",
  shortName: "Impulso Go",
  address:
    "Fresas 12, interior 10, Col. Tlacoquemécatl, C.P. 03200, Benito Juárez, Ciudad de México.",
  representative: "Claudia Tellez Hernandez",
  representativeTitle: "Presidenta",
  jurisdiction: "Ciudad de México",
  annualRatePercent: 7,
  penaltyPercent: 10,
  allowedTermsYears: [2, 4, 6, 8] as const,
  minAmount: 10000,
  amountIncrement: 5000,
} as const;

export const BRAND = {
  tagline: "Financiamiento formal, contrato firmado y trámite en línea.",
  subtagline:
    "Proceso documentado de extremo a extremo: validación de identidad, contrato electrónico con cláusulas completas, folio, fecha y huella técnica de generación.",
  whatsappPhone: "525547823544",
  whatsappDisplay: "55 4782 3544",
  whatsappUrl: "https://api.whatsapp.com/send?phone=525547823544",
  sipresUrl: "https://webapps.condusef.gob.mx/SIPRES/jsp/home_publico.jsp?idins=16103",
  condusefUrl: "https://webapps.condusef.gob.mx/SIPRES/jsp/home_publico.jsp?idins=16103",
} as const;

export const ASSETS = {
  condusef: "/assets/impulso-go/condusef.png",
  sipres: "/assets/impulso-go/sipres-new.png",
  logo: "/assets/impulso-go/logo.png",
  hero1: "/assets/impulso-go/hero-1.jpeg",
  hero2: "/assets/impulso-go/hero-2.jpeg",
  hero3: "/assets/impulso-go/hero-3.jpeg",
} as const;
