export const DECLARACIONES_TEXT =
  "EL CLIENTE declara bajo protesta de decir verdad que la información proporcionada en la solicitud y en este contrato es verídica, completa, exacta y actualizada; que cuenta con la capacidad legal para contratar; que los ingresos que declara son lícitos y comprobables; y que autoriza a IMPULSO GO para verificar, procesar y consultar dicha información en las fuentes que considere necesarias.";

export interface ContractClause {
  n: string;
  title: string;
  paragraphs: string[];
}

export const CONTRACT_CLAUSES: ContractClause[] = [
  {
    n: "PRIMERA.",
    title: "PAGOS",
    paragraphs: [
      "EL CLIENTE se obliga a pagar a IMPULSO GO las cantidades que se deriven del presente financiamiento conforme al plazo, periodicidad y monto establecidos en la solicitud.",
      "En caso de incumplimiento en cualquier pago, IMPULSO GO podrá cobrar intereses moratorios sobre el monto vencido, y podrá declarar el vencimiento anticipado del contrato, exigiendo el pago total del adeudo, intereses, comisiones, gastos y accesorios que correspondan.",
      "Los pagos deberán realizarse en las fechas y por los medios que IMPULSO GO le indique. El pago realizado se aplicará primero a intereses, luego a comisiones y gastos, y posteriormente al capital.",
    ],
  },
  {
    n: "SEGUNDA.",
    title: "DOMICILIOS Y MEDIOS DE CONTACTO",
    paragraphs: [
      "Para todos los efectos legales derivados de este contrato, EL CLIENTE señala como su domicilio el indicado en la solicitud.",
      "Asimismo, autoriza expresamente a IMPULSO GO a enviar cualquier aviso, comunicación, notificación, estado de cuenta, requerimiento o información relacionada con este contrato a través de llamadas telefónicas, mensajes de texto (SMS), WhatsApp, correo electrónico y cualquier otro medio físico o electrónico que tenga registrado.",
      "EL CLIENTE reconoce como válidas y suficientes dichas comunicaciones.",
    ],
  },
  {
    n: "TERCERA.",
    title: "INFORMACIÓN CREDITICIA",
    paragraphs: [
      "EL CLIENTE autoriza expresamente a IMPULSO GO para consultar, solicitar, obtener, usar, compartir, procesar y considerar su información crediticia ante las Sociedades de Información Crediticia que estime necesarias, tanto al inicio, durante la vigencia y al término de este contrato.",
      "En caso de incumplimiento, atraso o falta de pago, IMPULSO GO podrá reportar dicho comportamiento a las Sociedades de Información Crediticia correspondientes, lo cual puede afectar su historial crediticio.",
    ],
  },
  {
    n: "CUARTA.",
    title: "COSTO ANUAL TOTAL (CAT)",
    paragraphs: [
      "EL CLIENTE reconoce y acepta que el Costo Anual Total (CAT) del financiamiento, expresado en términos porcentuales anuales, incluye todos los costos, comisiones, gastos e impuestos inherentes al presente contrato, de conformidad con las disposiciones aplicables.",
      "El CAT puede variar de acuerdo con el monto del financiamiento, el plazo y el comportamiento de pago del CLIENTE.",
      "IMPULSO GO entregará al CLIENTE, antes de la formalización del contrato, la hoja de cálculo y la información detallada utilizada para determinar el CAT aplicable.",
    ],
  },
  {
    n: "QUINTA.",
    title: "VERIFICACIÓN Y VALIDACIÓN DIGITAL",
    paragraphs: [
      "EL CLIENTE autoriza a IMPULSO GO para verificar su identidad, información, documentos y referencias a través de medios físicos, electrónicos y digitales, incluyendo pero no limitado a plataformas internas, bases de datos, burós de crédito, consultas públicas, instituciones financieras y proveedores de información.",
      "EL CLIENTE acepta que la firma autógrafa, electrónica, digital o cualquier otro mecanismo de aceptación utilizado en este contrato, así como los mensajes de texto, WhatsApp, correos electrónicos y llamadas telefónicas, tendrán plena validez jurídica y serán suficientes para acreditar su voluntad, instrucciones y consentimiento.",
      "La información y evidencia generada a través de medios electrónicos, ópticos, magnéticos o de cualquier otra tecnología será admisible y tendrá el mismo valor probatorio que un documento firmado físicamente.",
    ],
  },
  {
    n: "SEXTA.",
    title: "COMISIONES DE PAGO",
    paragraphs: [
      'EL CLIENTE, se obliga a pagar adelantadamente a "IMPULSO GO, S.A. de C.V. SOFOM, E.N.R." las comisiones, gastos de cobranza, intereses por el monto que se genera una vez vencida la vigencia del contrato, lo cual si se cancela pagaria una penalización del 10% una vez firmado dicho contrato.',
    ],
  },
  {
    n: "SÉPTIMA.",
    title: "CANCELACIÓN DEL CONTRATO Y PENALIZACIÓN",
    paragraphs: [
      "EL CLIENTE podrá solicitar la cancelación del presente contrato antes del desembolso del financiamiento. En este caso, reconoce y acepta que deberá cubrir una penalización equivalente al 10% (diez por ciento) del monto solicitado, por concepto de gastos administrativos, operativos, de análisis, validación, gestión y recursos utilizados hasta ese momento.",
    ],
  },
  {
    n: "OCTAVA.",
    title: "ACEPTACIÓN, LEGISLACIÓN Y JURISDICCIÓN",
    paragraphs: [
      "EL CLIENTE manifiesta que ha leído íntegramente el presente contrato, comprendiendo su contenido, alcance y consecuencias legales y financieras, por lo que lo acepta de manera libre, voluntaria e informada, sin error, dolo, mala fe o vicio alguno del consentimiento.",
      "Este contrato se rige e interpreta conforme a las leyes de los Estados Unidos Mexicanos. Para la solución de cualquier controversia que se derive del presente contrato, las partes se someten expresamente a la jurisdicción de los tribunales competentes de la Ciudad de México.",
    ],
  },
];
