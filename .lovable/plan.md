# Plan de ejecución

Antes de implementar, te confirmo el alcance para evitar retrabajos. Si apruebas, ejecuto todo de corrido.

## 1. Herramienta "Generador" en login (PNG 1080×1350)

Nueva ruta `/_authenticated/generador` con 4 documentos PNG basados **exactamente** en los archivos que adjuntaste (`doc-shell.tsx`, `approval-doc.tsx`, `cancellation-doc.tsx`, `policy-doc.tsx`, `privacy-doc.tsx`). Se crean tal cual con sus mismas clases/estilos.

Archivos nuevos:
- `src/components/dashboard/shared.ts` — `MasterData`, `derive()`, `formatMoney()`, `offerDeadline72h()`, `MAIN_LOGO`, `DOC_VERSION`, `PRIVACY_CONTACT`.
- `src/components/generator/doc-shell.tsx` (tu código).
- `src/components/generator/approval-doc.tsx` (tu código).
- `src/components/generator/cancellation-doc.tsx` (tu código).
- `src/components/generator/policy-doc.tsx` (tu código).
- `src/components/generator/privacy-doc.tsx` (tu código).
- `src/routes/_authenticated.generador.tsx` — formulario maestro (nombre, RFC, monto, plazo, sucursal, ejecutivo, cuenta) + 4 botones "Exportar PNG" usando `exportNodeToPng` ya existente.

Tokens CSS añadidos a `styles.css`: `--success`, `--success-soft`, `--danger`, `--danger-soft`, `--brand`, `--ink`, `--ink-soft`, `--hairline`. Fuente `Caveat` cargada vía Google Fonts.

Dependencia: `qrcode.react` (instalar).

## 2. Contrato manual → "Contrato electrónico" público

- Renombrar ruta interna a pública: borrar `src/routes/_authenticated.contrato-manual.tsx`, crear `src/routes/contrato-electronico.tsx` (sin guardia de auth).
- Quitar campo **RFC** del formulario y del documento.
- Quitar el item del sidebar (`DashboardShell.tsx`).
- Agregar enlace **sutil** en `PublicFooter.tsx`, columna "Plataforma", como un item más entre Simulador / Proceso / Acceso interno / WhatsApp.
- Cambiar título visible a "Contrato electrónico".

## 3. Herramienta "Contrato" en login (PNG, 3 páginas)

Nueva ruta `/_authenticated/contrato` con dashboard editable de las 3 páginas del contrato digital (las que muestran tus imágenes `WhatsApp_Image_2026-05-20…` y `3.jpeg`):

- **Página 1**: Datos del cliente (nombre, CURP, sexo, teléfono, ingresos, domicilio), Datos del financiamiento (monto, tasa 7% fija, plazo, fecha otorgamiento/vencimiento), Datos bancarios (cuenta, banco). **No pide INE ni selfie.**
- **Página 2**: Declaraciones + cláusulas Primera (Pagos), Segunda (Domicilios y medios de contacto), Tercera (Información crediticia), Cuarta (CAT) — texto **transcrito tal cual** de tus imágenes.
- **Página 3**: Quinta (Verificación y validación digital), Sexta (Comisiones de pago), Séptima (Cancelación y penalización), Octava (Aceptación, legislación y jurisdicción), declaración final y bloque de firma (Cliente + Claudia Tellez Hernandez con firma "Claudia" estilo manuscrito tal cual el original).

Cada página exportable individualmente como PNG 1080×~1500 (proporción A4). Dashboard con campos editables agrupados por sección (incluye textareas para cláusulas, prefilled con el texto original) — el operador puede ajustar antes de exportar.

Archivos nuevos:
- `src/components/contract-tool/ContractP1.tsx`, `ContractP2.tsx`, `ContractP3.tsx`.
- `src/components/contract-tool/contract-defaults.ts` — texto base de las 8 cláusulas (transcrito de tus imágenes).
- `src/routes/_authenticated.contrato.tsx` — dashboard + 3 previews + 3 botones de export.

**Aplicar la misma reestructuración al wizard de contrato digital** (`/firma-contrato` y `ContractDocument.tsx`) para que el PDF firmado use los mismos textos/estructura que las imágenes. Sin tocar la lógica de firma.

## 4. Fix herramienta "Tabla de montos" (PNG 1080×1080)

La ruta `/_authenticated/tablas` actual no exporta a PNG. Se rehace:
- Input: monto (con incrementos del simulador) + botón "Generar PNG".
- Render off-screen 1080×1080 con misma estructura visual que tu imagen `10.png`: logo + título "TABLA DE MONTOS REFERENCIALES" + chip "$X a 7% ANUAL" + tabla 3 columnas (Años / Cuota / Monto final) con filas 2/4/6/8 calculadas con `finance.ts` (ya existe la fórmula correcta).
- Export con `exportNodeToPng(node, file, 1080, 1080)`.

## 5. Nueva herramienta "Tabla de pagos" (amortización PNG)

Nueva ruta `/_authenticated/tabla-pagos`. Dashboard:
- Cliente: nombre + apellido.
- Monto solicitado.
- Plazo (años: 2/4/6/8).
- Botón "Generar PNG" → renderiza 1080×1350 con header institucional + datos del cliente + resumen (monto, cuota, plazo, tasa) + tabla mensual completa (mes / fecha / pago / interés / capital / saldo) con la fórmula del simulador. Diseño cohesivo con el resto del ecosistema (mismo header/colores que `doc-shell`).

Archivos nuevos:
- `src/components/generator/payment-schedule.tsx` (componente exportable).
- `src/routes/_authenticated.tabla-pagos.tsx`.

## 6. Sidebar reorganizado

`DashboardShell` queda con:
Resumen · Expedientes · Contratos · **Contrato (editor PNG)** · **Generador (4 docs)** · **Tabla de montos** · **Tabla de pagos** · Configuración. Se quita "Contrato manual".

## 7. Fix imágenes CONDUSEF/SIPRES en landing

Diagnosticar `public/assets/impulso-go/condusef.jpg` y `sipres.png` (verificar tamaño/extensión real). Ajustar `<img>` con tamaño/object-fit correctos en `index.tsx`.

## 8. QA final (paso a paso, con browser)

- F1: landing carga, imágenes CONDUSEF/SIPRES visibles, simulador OK.
- F2: footer muestra "Contrato electrónico" sutil; ruta pública abre sin login y exporta PDF sin RFC.
- F3: login (`impulso26 / 252627`) entra, sidebar muestra las 6 herramientas, sin "Contrato manual".
- F4: Generador → cargar datos demo → exportar 4 PNG (verifico cada uno con `pdftoppm`/inspección visual en `/tmp`).
- F5: Contrato editor → editar campos → exportar 3 PNG.
- F6: Tabla de montos → ingresar $10,000 → PNG 1080×1080 igual a referencia.
- F7: Tabla de pagos → cliente demo → PNG con amortización.

## Riesgos / supuestos

- **No persisto datos** (sigue todo en memoria del formulario), respetando tu directiva previa.
- Las cláusulas del contrato se transcriben textual de tus imágenes (incluido el texto sobre penalización del 10%, validación digital, jurisdicción CDMX, firma "Claudia / Claudia Tellez Hernandez / Presidenta").
- Si alguna cláusula resulta más larga que el alto fijo de la página, ajusto tipografía/padding (no recorto contenido).
- No se agrega email en ningún formulario nuevo.

¿Apruebo y ejecuto los 8 puntos en este orden?
