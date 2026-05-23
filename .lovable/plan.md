# Fase 2 — Contrato Digital + credenciales internas

## Parte A · Credenciales del sistema interno

Crear archivo `src/lib/auth.ts` con la lista de operadores autorizados (validación 100% en cliente, sin backend, sin BD — coherente con el alcance actual del proyecto):

- **ID:** `impulso26`
- **Clave:** `252627`

Actualizar `src/routes/login.tsx`:

- Renombrar el campo "Correo corporativo" → "ID de operador".
- Validar contra la lista de `auth.ts`. Si no coincide, mostrar "Credenciales inválidas" con estilo destructive.
- Guardar en `sessionStorage` `{ operatorId, at }` y redirigir a `/dashboard`.
- El guard de `_authenticated.tsx` ya está en su lugar.

> Nota de seguridad: una credencial fija en cliente es adecuada solo para una demo interna. Si más adelante quieres autenticación real (Lovable Cloud + Supabase Auth, multiusuario, roles), lo migramos sin tocar la UI.

---

## Parte B · Módulo de contrato digital (defaults razonables)

Decisiones tomadas (skipeaste las preguntas):

- **Acceso:** público desde la landing (`/firma-contrato`) + listado en el dashboard.
- **Alcance:** completo con validación de identidad + página pública de validación con QR.
- **Exportación:** PDF institucional multi-página en alta resolución (2x, html2canvas + jsPDF).

### B.1 Wizard público `/firma-contrato`

5 pasos, una sola ruta con estado interno + barra de progreso premium:

1. **Datos del solicitante** — nombre completo, CURP, RFC, email, teléfono, domicilio, monto (slider del simulador) y plazo. Validación con zod + react-hook-form. Reutiliza tokens del design system.
2. **Validación de identidad** — captura de INE frente, INE reverso y selfie usando `getUserMedia` (cámara) con fallback a subida de archivo. Checkbox de consentimiento biométrico. Previsualización antes de continuar.
3. **Lectura del contrato** — render legal completo (encabezado institucional, partes, declaraciones, cláusulas, tabla de amortización generada con `finance.ts`, anexos). 7 checkboxes de aceptación expresa (los del proyecto original — texto legal preservado).
4. **Firma digital** — canvas con `signature_pad` (ya viable en el cliente). Genera folio único `IG-YYYY-XXXX`, fecha ISO, huella técnica (hash del payload + UA + timestamp), guarda todo en estado.
5. **Confirmación** — pantalla premium con folio destacado, QR generado con `qrcode` apuntando a `/validar/{folio}`, botón "Descargar PDF" y "Volver al inicio". El expediente firmado se persiste en `localStorage` (`ig.contracts`) para que el dashboard pueda listarlo.

### B.2 Exportación PDF (resolver el render roto)

Crear `src/lib/pdf-export.ts`:

- Render dedicado en un nodo oculto con ancho fijo A4 (794px @ 96dpi) y tipografía Inter embebida — esto evita los problemas de escalado y superposición del original.
- `html2canvas` con `scale: 2`, `useCORS: true`, `backgroundColor: '#ffffff'`.
- Paginación manual: dividir el alto del canvas en páginas A4 (1123px) y pegar cada slice en `jsPDF` para evitar cortes a mitad de párrafo.
- Header/footer institucional en cada página (logo + folio + paginación).
- Validación post-render: si el canvas final pesa > 8MB, regenerar con scale: 1.5.

### B.3 Página pública `/validar/$folio`

Ruta dinámica que lee `localStorage` (demo) y muestra:

- Estado del contrato (Firmado / No encontrado) con tipografía clara.
- Folio, fecha, monto, plazo, hash de huella técnica.
- Sello visual estilo "Documento verificado" con la paleta institucional.
- Meta `noindex` para no exponer folios en buscadores.

### B.4 Integración en el dashboard

- Reemplazar la tabla mock actual de `/dashboard` por los expedientes reales leídos de `localStorage`.
- Activar el item del sidebar "Contratos" → nueva ruta `_authenticated/dashboard.contratos.tsx` con tabla, filtros (estado, fecha) y modal de detalle que reabre la vista de validación + botón "Reexportar PDF".

---

## Estructura de archivos nuevos

```text
src/lib/
  auth.ts                          # credenciales + helpers de sesión
  pdf-export.ts                    # render A4 + paginación
  contracts.ts                     # tipos, folio, hash, persistencia
src/components/contract/
  ContractWizard.tsx               # shell + stepper
  steps/StepDatos.tsx
  steps/StepIdentidad.tsx
  steps/StepLectura.tsx
  steps/StepFirma.tsx
  steps/StepConfirmacion.tsx
  ContractDocument.tsx             # render legal exportable
  SignaturePadField.tsx
src/routes/
  firma-contrato.tsx               # wizard público
  validar.$folio.tsx               # validación pública
  _authenticated.dashboard.contratos.tsx
```

Dependencias a instalar: `signature_pad`, `qrcode`, `html2canvas`, `jspdf`, `zod`, `react-hook-form`, `@hookform/resolvers`.

---

## Validaciones antes de cerrar la fase

- Login con `impulso26 / 252627` entra al dashboard; cualquier otra combinación muestra error.
- Wizard completable en desktop (1169px) y móvil (375px).
- PDF descargado abre limpio: sin texto cortado, sin superposición, header/footer en todas las páginas.
- `/validar/{folio}` muestra el contrato firmado; folio inexistente muestra estado claro.

---

## Lo que NO entra en esta fase (queda para Fase 3)

- Submódulos restantes del sidebar: Expedientes detallados, Tablas de montos, Configuración.
- Contrato manual imprimible (formato operativo del original).
- Exportación PNG 1080x1350 institucional.
- Migración a backend real (Lovable Cloud) si decides persistir contratos server-side.
