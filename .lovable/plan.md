# Plan revisado — Fases 5 a 7 (sin Cloud, sin email)

Se descarta Fase 4 (Lovable Cloud). Se mantiene `localStorage` como única persistencia. Se remueve cualquier campo `email` del wizard y formularios. Foco: generación robusta de PDF y PNG, contrato manual imprimible, hardening y QA integral.

---

## Fase 5 — Contrato manual imprimible + exportación PNG institucional

1. **Eliminar campo email** en `StepDatos.tsx`, esquema Zod y tipos de `contracts.ts`. Limpiar referencias en `ContractDocument.tsx`, `ContractDetailModal.tsx` y `validar.$folio.tsx`.
2. **Ruta `/contrato-manual`** (pública o bajo `_authenticated`, default: autenticada):
   - Formulario rápido: nombre, CURP, RFC, monto, plazo, dirección.
   - Render A4 imprimible reutilizando `ContractDocument` en modo "manual" (sin firma digital, con líneas para firma física y huella).
   - Botones: **Imprimir** (`window.print()` con `@media print` que oculta chrome) y **Exportar PDF** (reusa `pdf-export.ts`).
3. **`src/lib/png-export.ts`**:
   - Render 1080×1350 con `html2canvas` scale 2, fondo blanco.
   - Header con logo + folio + QR validación; pie con CONDUSEF/SIPRES y datos legales de `config.ts`.
   - Descarga como `contrato-{folio}.png`.
4. **`src/components/contract/ContractCardInstitutional.tsx`**: tarjeta visual 1080×1350 (folio, monto, plazo, cliente, fecha, sellos). Montada off-screen al exportar.
5. **Botones nuevos en `ContractDetailModal`**: "Exportar PNG" junto a "Reexportar PDF".
6. **CSS `@media print`** en `styles.css`: ocultar header/sidebar/botones, fondo blanco, A4.

## Fase 6 — Hardening, SEO y accesibilidad

1. **SEO por ruta**: `head()` con title <60, description <160, og:title/og:description, canonical. `/firma-contrato`, `/contrato-manual` y `/validar/$folio` con `meta robots noindex`.
2. **JSON-LD `FinancialService`** en `/` (landing).
3. **Accesibilidad**: foco visible, labels en todos los inputs del wizard, `aria-live` en errores de validación, contraste AA verificado.
4. **Validación Zod estricta**: CURP (regex 18 chars), RFC (regex 12-13), teléfono MX (10 dígitos), monto múltiplo de 5000, plazo en `allowedTermsYears`.
5. **errorComponent + notFoundComponent** en cada ruta con loader; `defaultErrorComponent` en router.
6. **Sitemap**: verificar que incluye solo rutas indexables (excluir wizard/validar/dashboard).

## Fase 7 — QA integral fase por fase

Recorrido con verificación funcional y reporte ✅/⚠️ + fixes en el momento.

- **F1 — Landing + simulador**: navegar `/`, validar hero, simulador calcula correctamente contra `finance.ts` (cuota, CAT, total), footer con SIPRES/CONDUSEF, responsive 375/1169.
- **F2 — Login + wizard**: login `impulso26/252627`, recorrer 5 pasos (sin email), firmar, generar PDF; convertir PDF a imágenes con `pdftoppm` y revisar páginas (sin cortes, sin overflow, sin solapes).
- **F3 — Dashboard**: tabla contratos, búsqueda/filtros, modal detalle, reexport PDF, métricas dashboard, tabla montos vs `finance.ts`, configuración.
- **F5 — Manual + PNG**: formulario `/contrato-manual` genera PDF imprimible; `@media print` oculta chrome; PNG 1080×1350 verificado (dimensiones exactas, legible, QR escaneable).
- **F6 — Hardening**: `<head>` por ruta correcto, `noindex` aplicado, validaciones Zod rechazan inputs inválidos, error boundaries muestran fallback.

Reporte final consolidado por fase con capturas de QA (imágenes temporales en `/tmp`, no se entregan al usuario).

---

## Detalles técnicos

- **Sin backend**: toda la persistencia sigue en `localStorage` vía `contracts.ts`. Credenciales fijas en `auth.ts`.
- **Sin email**: eliminar de schema, formularios, render de contrato y validación pública.
- **Sin memoria de proyecto**: no se crean entradas en `mem://`.
- **Archivos nuevos**: `src/lib/png-export.ts`, `src/components/contract/ContractCardInstitutional.tsx`, `src/routes/_authenticated.contrato-manual.tsx`.
- **Archivos editados**: `StepDatos.tsx`, `contracts.ts`, `ContractDocument.tsx`, `ContractDetailModal.tsx`, `validar.$folio.tsx`, `styles.css` (print), todas las rutas (head/SEO + boundaries).
- **Dependencias**: ninguna nueva (reutiliza `html2canvas`, `jspdf`, `qrcode`).

## Supuestos

- Contrato manual queda bajo `_authenticated` (operador interno lo genera).
- PNG institucional formato 1080×1350 (vertical estilo institucional).
- Si el wizard ya guardó email en `localStorage` de pruebas previas, se ignora al renderear.