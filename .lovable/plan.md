# Plan de ejecución — PROMPT_DEFINITIVO

Leí las 797 líneas. El documento pide dos cosas críticas marcadas como "CORRECCIÓN CRÍTICA" + un rediseño dark-mode futurista del ecosistema completo. Para ser honesto contigo: lo segundo son ~10+ horas de trabajo (rediseño visual de 9 páginas con tokens nuevos, layouts nuevos, tabs nuevos, timelines, funnels, chats, etc.). Si lo hago todo de una sola pasada el resultado será inconsistente y romperá funcionalidad ya validada.

Te propongo ejecutar en **3 fases**, empezando AHORA por las dos correcciones críticas que el propio documento marca como prioridad #1 y #2:

## FASE 1 — Correcciones críticas (esta ejecución, ahora)

**1.1 Inputs con borde gris (#546E7A) en vez de negro** — Corrección crítica #1
- Editar `src/components/ui/input.tsx`, `textarea.tsx`, `select.tsx` y tokens en `src/styles.css` para que el border default use el nuevo token (mapeado a `oklch` para mantener tema light actual + dark futuro).
- Focus: cyan #00E5CC con glow 3px alpha 0.15.
- Hover, error, success, disabled según especificación líneas 87-116.

**1.2 Eliminar html2canvas-pro, migrar a jsPDF puro vectorial** — Corrección crítica #2
- Crear `src/lib/pdf-vector.ts` con un builder reusable (header institucional + footer CONDUSEF/SIPRES, fuente Helvetica nativa, coords mm).
- Migrar los 4 documentos del generador:
  - `aprobacion_<folio>_<fecha>_<apellido>.pdf`
  - `cancelacion_<folio>_<fecha>_<apellido>.pdf`
  - `poliza_<folio>_<fecha>_<apellido>.pdf`
  - `privacidad_<folio>_<fecha>_<apellido>.pdf`
- Migrar `/tabla-pagos` (ya tiene `payment-pdf.ts` vectorial — verificar formato de nombre).
- Migrar `/tablas` (tabla de montos) a PDF vectorial con `autoTable`.
- Reemplazar botones "PNG" por "PDF" en las 3 rutas (`_authenticated.generador.tsx`, `_authenticated.tablas.tsx`, `_authenticated.tabla-pagos.tsx`).
- Eliminar `src/lib/png-export.ts` (deja de usarse) y `html2canvas-pro` del `package.json`.
- **Mantener** `src/lib/pdf-export.ts` (html2canvas-pro) **solo** si el contrato firmado (`ContractDocument.tsx`, `firma-contrato`) sigue dependiendo de él para conservar la firma manuscrita en imagen; si se puede migrar también, se migra.

**1.3 QA funcional con browser**
- Abrir `/generador`, llenar datos demo, descargar los 4 PDFs.
- Abrir `/tabla-pagos`, descargar PDF.
- Abrir `/tablas`, descargar PDF.
- Verificar con `pdftotext` que el texto sea seleccionable.
- Verificar inputs en `/login`, `/contrato`, `/generador`: border gris, focus cyan.

## FASE 2 — Dark mode futurista (siguiente turno, si apruebas)

- Activar `.dark` por default en rutas `_authenticated.*` (landing pública se queda light).
- Aplicar tokens `--bg-page #050A14`, `--bg-surface #0A1628`, `--bg-card #0F1F3A`, `--accent-cyan #00E5CC`, `--accent-amber #FF6B35` mapeados a `oklch` en `src/styles.css` dentro de `.dark`.
- Rehacer `DashboardShell` (sidebar 260px, header 64px, footer fijo h-12) con la nueva paleta.
- Cargar fuentes Space Grotesk / Outfit / JetBrains Mono.
- Aplicar scrollbar, selección, focus-ring, toasts, modales, dropdowns, tooltips, loaders según spec global.

## FASE 3 — Nuevas páginas y módulos (turno posterior)

- `/dashboard` con KPIs animados + funnel + tabla recientes + alertas.
- `/expedientes` con filtros + tabla sticky + paginación.
- `/expedientes/[id]` (NUEVA ruta) con tabs Resumen/Documentación/Contrato/Pagos/Historial/Comunicación.
- `/configuracion` con tabs Parámetros/Usuarios/Aviso privacidad/Notificaciones/Integraciones.
- Login split-screen rediseñado.
- Landing pública refinada (light mode) con simulador rediseñado y carrusel testimonios.

## Detalles técnicos relevantes

- Las correcciones #1 y #2 son **no destructivas**: no rompen rutas existentes, solo cambian estilo de inputs y motor de generación de documentos.
- jsPDF + jspdf-autotable + qrcode ya están instalados (los usa `payment-pdf.ts`). No requiere `bun add`.
- El nombre de archivo nuevo `{tipo}_{folio}_{fecha}_{apellido}.pdf` se calcula desde `MasterData.name` y `MasterData.folio`.
- Los tokens nuevos se añaden en `:root` como variables hex crudas (`--bg-page-hex: #050A14`) y se referencian desde `.dark { ... }` para no romper el tema light actual.

## Riesgos

- El contrato digital firmado (`ContractDocument.tsx` con firma SignaturePad) usa html2canvas para preservar el trazo. Si migro ese flujo a jsPDF puro, la firma manuscrita se renderiza como imagen embebida (`doc.addImage` del PNG del canvas de firma) — sigue siendo vectorial el resto del PDF. Lo dejo así para no perder la firma.
- Si insistes en Fase 2 y 3 en este mismo turno, lo hago, pero advierto: ejecutar 9 páginas rediseñadas en una sola pasada sin QA intermedio probablemente introduzca regresiones visuales que tendrás que reportar después.

## ¿Apruebo y ejecuto Fase 1 ahora?

Responde "sí" o "ejecuta fase 1" y arranco. Si quieres que haga todo de corrido (Fase 1 + 2 + 3 en una sola megaejecución), dilo explícitamente y procedo, asumiendo el riesgo de regresiones.
