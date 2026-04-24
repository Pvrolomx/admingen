/**
 * AdminGen — Plantilla: Addendum Personalizado al Contrato de Administración
 * Castle Solutions / CASTLEBAY PV, SRL DE CV
 *
 * Documento accesorio que se genera por separado del contrato principal
 * y lo modifica/precisa para acomodar circunstancias específicas de
 * ciertos propietarios.
 *
 * Casos de uso típicos:
 *   - Owners de memoria volátil (requieren confirmaciones escritas)
 *   - Owners ausentes largas temporadas (régimen de visitas preventivas)
 *   - Owners que contratan directamente a sus propios proveedores
 *   - Owners con requisitos de seguridad específicos (acceso restringido)
 *   - Owners cuyos emails informales requieren canal formal
 *   - Owners que traen huracanes sin estar presentes (checklist de cierre)
 *   - Owners cuyas visitas de cortesía del admin requieren autorización expresa
 *   - Owners que acumulan pendientes durante ausencia (lista pre-temporada)
 *
 * Cada cláusula es toggleable — se activan solo las que aplican al cliente.
 *
 * Versión 1.0.0 — MVP con 3 cláusulas piloto (memoria, contractors, acceso).
 * Las 5 restantes se agregan en commits siguientes.
 */

const PLANTILLA_ADDENDUM = {

  // ============================================================
  // META
  // ============================================================

  meta: {
    id: 'addendum_personalizado',
    version: '1.0.0',
    nombre: 'Addendum al Contrato de Administración',
    nombre_en: 'Addendum to Administration Agreement',
    idiomas: ['es', 'en'],
    formato: 'bilingue_tabla',
    nota_idioma: {
      es: 'La traducción al idioma inglés es mera cortesía. En el evento de una controversia, la versión en español prevalecerá.',
      en: 'The translation to English is mere courtesy. In the event of a controversy, the Spanish version will prevail.',
    },
  },

  // ============================================================
  // PARTES — mismas que el contrato principal
  // ============================================================

  partes: [
    {
      id: 'propietario',
      rol: 'propietario',
      etiqueta: 'Propietario / Owner',
      etiqueta_en: 'Owner',
      min: 1,
      max: 4,
      tiposPermitidos: ['fisica'],
      campos: [
        { id: 'nombre', tipo: 'texto', requerido: true, etiqueta: 'Nombre completo', etiqueta_en: 'Full name' },
        { id: 'genero', tipo: 'select', requerido: true, etiqueta: 'Género', opciones: [{ valor: 'M', texto: 'Masculino' }, { valor: 'F', texto: 'Femenino' }] },
        { id: 'email', tipo: 'email', requerido: true, etiqueta: 'Correo electrónico', etiqueta_en: 'Email' },
        { id: 'celular', tipo: 'tel', requerido: false, etiqueta: 'Celular / WhatsApp', etiqueta_en: 'Cell / WhatsApp' },
      ],
    },
    {
      id: 'administrador',
      rol: 'administrador',
      etiqueta: 'Administrador / Manager',
      etiqueta_en: 'Administrator',
      min: 1,
      max: 1,
      tiposPermitidos: ['moral'],
      fijo: true,
      campos: [],
      defaults: {
        razonSocial: 'CASTLEBAY PV, SRL DE CV',
        representante: { nombre: 'Claudia Rebeca Castillo Soto', genero: 'F' },
        domicilio: 'Paseo del Arque 59, Las Ceibas, Bahía de Banderas, Nayarit, 63735',
        email: 'claudia@castlesolutions.biz',
        celular: '+52 322 306 8482',
      },
    },
  ],

  // ============================================================
  // CAMPOS ESPECÍFICOS DEL ADDENDUM
  // ============================================================

  campos: {
    propiedad: {
      etiqueta: 'Datos de la propiedad',
      etiqueta_en: 'Property data',
      campos: [
        { id: 'direccion', tipo: 'textarea', requerido: true, etiqueta: 'Dirección completa de la propiedad', etiqueta_en: 'Full property address' },
      ],
    },
    contrato_base: {
      etiqueta: 'Referencia al contrato principal',
      etiqueta_en: 'Reference to main contract',
      campos: [
        { id: 'fecha_contrato', tipo: 'texto', requerido: true, etiqueta: 'Fecha del contrato principal', etiqueta_en: 'Date of main contract', placeholder: 'ej. 15 de abril de 2026' },
        { id: 'fecha_contrato_en', tipo: 'texto', requerido: false, etiqueta: 'Fecha (EN)', etiqueta_en: 'Date (EN)', placeholder: 'ej. April 15, 2026' },
      ],
    },
    fechas: {
      etiqueta: 'Fecha del addendum',
      etiqueta_en: 'Addendum date',
      campos: [
        { id: 'ciudad_firma', tipo: 'select', requerido: true, etiqueta: 'Ciudad de firma', opciones: [
          { valor: 'pv', texto: 'Puerto Vallarta, Jalisco' },
          { valor: 'nv', texto: 'Nuevo Vallarta, Nayarit' },
        ], default: 'pv' },
      ],
    },
    umbrales: {
      etiqueta: 'Umbrales (opcional, para algunas cláusulas)',
      etiqueta_en: 'Thresholds (optional, for certain clauses)',
      campos: [
        { id: 'umbral_confirmacion', tipo: 'numero', requerido: false, etiqueta: 'Umbral confirmación escrita (USD)', etiqueta_en: 'Written confirmation threshold (USD)', default: 500 },
      ],
    },
  },

  // ============================================================
  // BLOQUES (cláusulas del addendum)
  // ============================================================

  bloques: [

    // PREÁMBULO — Siempre presente
    {
      id: 'preambulo',
      siempre: true,
      tipo: 'preambulo',
      render: (ctx) => ({
        es: `En la ciudad de ${ctx.ciudad_firma === 'nv' ? 'Nuevo Vallarta, Nayarit' : 'Puerto Vallarta, Jalisco'}, el día ${ctx.fecha_larga_es || '___'}, comparecen por una parte EL PROPIETARIO, representado por ${ctx.propietario.nombres}, y por la otra parte EL ADMINISTRADOR, CASTLEBAY PV, SRL DE CV, representada por su Representante legal Claudia Rebeca Castillo Soto, quienes acuerdan suscribir el presente ADDENDUM al Contrato de Administración y Mantenimiento de fecha ${ctx.fecha_contrato || '___'} (en adelante "EL CONTRATO PRINCIPAL"), con el fin de puntualizar y formalizar determinados acuerdos específicos aplicables a LA PROPIEDAD materia del mismo.\n\nEste ADDENDUM forma parte integrante de EL CONTRATO PRINCIPAL. En lo no previsto expresamente en este documento, continuarán aplicando íntegramente las disposiciones de EL CONTRATO PRINCIPAL. En caso de contradicción entre ambos documentos, prevalecerá lo dispuesto en este ADDENDUM por ser acuerdo posterior y específico.`,
        en: `In the city of ${ctx.ciudad_firma === 'nv' ? 'Nuevo Vallarta, Nayarit' : 'Puerto Vallarta, Jalisco'}, on ${ctx.fecha_larga_en || '___'}, appearing on one side THE OWNER, represented by ${ctx.propietario.nombres}, and on the other side THE ADMINISTRATOR, CASTLEBAY PV, SRL DE CV, represented by its Legal Representative Claudia Rebeca Castillo Soto, who agree to subscribe to this ADDENDUM to the Property Management and Maintenance Contract dated ${ctx.fecha_contrato_en || ctx.fecha_contrato || '___'} (hereinafter "THE MAIN CONTRACT"), for the purpose of specifying and formalizing certain specific agreements applicable to THE PROPERTY subject to said contract.\n\nThis ADDENDUM is an integral part of THE MAIN CONTRACT. In all matters not expressly provided for in this document, the provisions of THE MAIN CONTRACT shall continue to apply in their entirety. In case of contradiction between both documents, the provisions of this ADDENDUM shall prevail as a subsequent and specific agreement.`,
      }),
    },

    // CLÁUSULAS — todas condicionales toggleables

    // I — MEMORIA E INSTRUCCIONES CAMBIANTES (confirmación escrita)
    {
      id: 'ad_memoria_cambios',
      condicional: true,
      default: false,
      etiqueta: 'Instrucciones cambiantes — confirmación escrita',
      etiqueta_en: 'Changing instructions — written confirmation',
      numero_romano: 'I',
      subtitulo: { es: 'PRIMERA.- CONFIRMACIÓN ESCRITA DE INSTRUCCIONES', en: 'FIRST.- WRITTEN CONFIRMATION OF INSTRUCTIONS' },
      render: (ctx) => ({
        es: `Las partes reconocen que la administración eficiente de LA PROPIEDAD requiere claridad y estabilidad en las instrucciones que EL PROPIETARIO comunica a EL ADMINISTRADOR. En consecuencia, las partes convienen lo siguiente:\n\n(i) Toda instrucción de EL PROPIETARIO que implique gastos, compras, contratación de terceros u obras por monto superior a $${ctx.umbral_confirmacion || 500} USD (${ctx.umbral_confirmacion_palabras || 'quinientos dólares americanos'}), deberá ser confirmada por escrito por correo electrónico antes de su ejecución.\n\n(ii) EL ADMINISTRADOR queda expresamente facultado para diferir la ejecución de cualquier instrucción hasta contar con dicha confirmación escrita, sin que ello genere responsabilidad alguna por demora, pérdida de oportunidad o daño derivado.\n\n(iii) Cuando EL PROPIETARIO modifique una instrucción previamente comunicada, la instrucción vigente será la más reciente confirmada por escrito. EL ADMINISTRADOR no será responsable de ejecuciones basadas en instrucciones posteriormente modificadas cuando dicha modificación no le haya sido comunicada con antelación razonable.\n\n(iv) EL ADMINISTRADOR llevará un registro cronológico de las instrucciones recibidas, su confirmación y su ejecución, el cual podrá ser consultado por EL PROPIETARIO en cualquier momento.`,
        en: `The parties recognize that the efficient administration of THE PROPERTY requires clarity and stability in the instructions that THE OWNER communicates to THE ADMINISTRATOR. Accordingly, the parties agree as follows:\n\n(i) Any instruction from THE OWNER involving expenses, purchases, contracting of third parties, or works for an amount exceeding $${ctx.umbral_confirmacion || 500} USD (${ctx.umbral_confirmacion_palabras_en || 'five hundred US dollars'}), must be confirmed in writing via email prior to its execution.\n\n(ii) THE ADMINISTRATOR is expressly authorized to defer the execution of any instruction until such written confirmation is obtained, without generating any liability for delay, loss of opportunity, or derivative damage.\n\n(iii) When THE OWNER modifies a previously communicated instruction, the prevailing instruction shall be the most recent one confirmed in writing. THE ADMINISTRATOR shall not be liable for executions based on instructions that were subsequently modified when such modification was not communicated with reasonable advance notice.\n\n(iv) THE ADMINISTRATOR shall maintain a chronological record of received instructions, their confirmation, and their execution, which may be consulted by THE OWNER at any time.`,
      }),
    },

    // II — CONTRATISTAS DE TERCEROS (deslinde)
    {
      id: 'ad_contractors_terceros',
      condicional: true,
      default: false,
      etiqueta: 'Contratistas de terceros — deslinde',
      etiqueta_en: 'Third-party contractors — release',
      numero_romano: 'II',
      subtitulo: { es: 'SEGUNDA.- CONTRATISTAS Y PROVEEDORES DE TERCEROS', en: 'SECOND.- THIRD-PARTY CONTRACTORS AND PROVIDERS' },
      render: (ctx) => ({
        es: `Las partes reconocen que EL PROPIETARIO podrá, por su propia iniciativa y cuenta, contratar directamente contratistas, proveedores o prestadores de servicios ajenos a la red de proveedores verificados por EL ADMINISTRADOR (en adelante "CONTRATISTAS DE TERCEROS"). En tal supuesto:\n\n(i) La selección, vetting, supervisión y pago de los CONTRATISTAS DE TERCEROS será responsabilidad exclusiva de EL PROPIETARIO. EL ADMINISTRADOR no asume obligación alguna de verificación, supervisión, garantía o aseguramiento respecto de su trabajo.\n\n(ii) EL ADMINISTRADOR queda liberado de toda responsabilidad por daños, defectos, pérdidas, robos, accidentes laborales, incumplimientos, vicios ocultos o cualquier otra consecuencia derivada del trabajo de CONTRATISTAS DE TERCEROS en LA PROPIEDAD.\n\n(iii) No obstante lo anterior, EL ADMINISTRADOR, como cortesía profesional y dentro de sus posibilidades operativas, podrá facilitar el acceso a LA PROPIEDAD y apoyar la comunicación entre EL PROPIETARIO y los CONTRATISTAS DE TERCEROS, sin que tal apoyo genere responsabilidad alguna.\n\n(iv) EL PROPIETARIO se obliga a informar previamente a EL ADMINISTRADOR de la identidad del CONTRATISTA DE TERCEROS, las fechas de intervención y el alcance de los trabajos, con el único propósito de coordinar el acceso y evitar conflictos con los servicios regulares de LA PROPIEDAD.\n\n(v) EL PROPIETARIO se obliga expresamente a sacar en paz y a salvo a EL ADMINISTRADOR de cualquier reclamación, daño, demanda o responsabilidad que terceros pudieran ejercer en relación con el trabajo de los CONTRATISTAS DE TERCEROS.`,
        en: `The parties recognize that THE OWNER may, at their own initiative and expense, directly hire contractors, suppliers, or service providers outside the network of verified providers of THE ADMINISTRATOR (hereinafter "THIRD-PARTY CONTRACTORS"). In such case:\n\n(i) The selection, vetting, supervision, and payment of THIRD-PARTY CONTRACTORS shall be the exclusive responsibility of THE OWNER. THE ADMINISTRATOR assumes no obligation of verification, supervision, guarantee, or insurance regarding their work.\n\n(ii) THE ADMINISTRATOR is released from all liability for damages, defects, losses, theft, labor accidents, breaches, hidden defects, or any other consequence derived from the work of THIRD-PARTY CONTRACTORS at THE PROPERTY.\n\n(iii) Notwithstanding the foregoing, THE ADMINISTRATOR, as a professional courtesy and within operational possibilities, may facilitate access to THE PROPERTY and support communication between THE OWNER and the THIRD-PARTY CONTRACTORS, without such support generating any liability.\n\n(iv) THE OWNER agrees to inform THE ADMINISTRATOR in advance of the identity of the THIRD-PARTY CONTRACTOR, the dates of intervention, and the scope of the work, for the sole purpose of coordinating access and avoiding conflicts with regular services at THE PROPERTY.\n\n(v) THE OWNER expressly agrees to hold harmless THE ADMINISTRATOR from any claim, damage, lawsuit, or liability that third parties may exercise in relation to the work of THIRD-PARTY CONTRACTORS.`,
      }),
    },

    // III — ACCESO DE TERCEROS A LA PROPIEDAD
    {
      id: 'ad_acceso_terceros',
      condicional: true,
      default: false,
      etiqueta: 'Acceso nominativo de terceros',
      etiqueta_en: 'Named access of third parties',
      numero_romano: 'III',
      subtitulo: { es: 'TERCERA.- AUTORIZACIÓN DE ACCESO A TERCEROS', en: 'THIRD.- AUTHORIZATION OF ACCESS TO THIRD PARTIES' },
      render: (ctx) => ({
        es: `Las partes convienen un régimen estricto de acceso a LA PROPIEDAD por personas distintas a EL PROPIETARIO y al personal autorizado de EL ADMINISTRADOR, en los siguientes términos:\n\n(i) EL PROPIETARIO comunicará a EL ADMINISTRADOR, por escrito y de forma nominativa, la lista de personas autorizadas a ingresar a LA PROPIEDAD durante la ausencia de EL PROPIETARIO, señalando nombre completo, relación con EL PROPIETARIO, y alcance/duración de la autorización.\n\n(ii) EL ADMINISTRADOR no permitirá el acceso a LA PROPIEDAD a persona alguna no incluida expresamente en dicha lista, salvo en caso de emergencia (incendio, inundación, alerta de condominio, intervención de autoridad) en los que actuará conforme al mejor interés de la preservación de LA PROPIEDAD y documentará las circunstancias.\n\n(iii) Cualquier modificación a la lista de personas autorizadas deberá constar por escrito enviado por correo electrónico de EL PROPIETARIO a EL ADMINISTRADOR, con al menos 24 (veinticuatro) horas de anticipación cuando sea posible.\n\n(iv) EL ADMINISTRADOR llevará registro de cada acceso autorizado con la fecha, hora de entrada y salida, y propósito declarado de la visita, a disposición de EL PROPIETARIO en cualquier momento.\n\n(v) EL PROPIETARIO reconoce que el incumplimiento de este protocolo por parte de personas que él mismo haya referido libera a EL ADMINISTRADOR de responsabilidad por cualquier consecuencia derivada de dicho incumplimiento.`,
        en: `The parties agree on a strict access regime to THE PROPERTY by persons other than THE OWNER and the authorized personnel of THE ADMINISTRATOR, in the following terms:\n\n(i) THE OWNER shall communicate to THE ADMINISTRATOR, in writing and by name, the list of persons authorized to enter THE PROPERTY during THE OWNER'S absence, indicating full name, relationship to THE OWNER, and scope/duration of authorization.\n\n(ii) THE ADMINISTRATOR shall not allow access to THE PROPERTY to any person not expressly included in said list, except in case of emergency (fire, flood, condominium alert, authority intervention) in which THE ADMINISTRATOR shall act in the best interest of preserving THE PROPERTY and shall document the circumstances.\n\n(iii) Any modification to the list of authorized persons must be in writing sent via email from THE OWNER to THE ADMINISTRATOR, with at least 24 (twenty-four) hours of advance notice when possible.\n\n(iv) THE ADMINISTRATOR shall maintain a record of each authorized access with the date, time of entry and exit, and stated purpose of the visit, available to THE OWNER at any time.\n\n(v) THE OWNER acknowledges that non-compliance with this protocol by persons referred by THE OWNER releases THE ADMINISTRATOR from liability for any consequence derived from such non-compliance.`,
      }),
    },

    // FIRMAS
    {
      id: 'firmas',
      tipo: 'firmas',
      siempre: true,
      render: (ctx) => ({
        firmas: [
          { nombre: ctx.propietario.nombres, rol_es: ctx.propietario.clave === 'mp' || ctx.propietario.clave === 'fp' ? 'PROPIETARIOS / OWNERS' : 'PROPIETARIO / OWNER' },
          { nombre: 'Claudia Rebeca Castillo Soto', rol_es: 'Representante legal / Legal Representative\nCASTLEBAY PV, SRL DE CV\nADMINISTRADORA / ADMINISTRATOR' },
        ],
        testigos: false,
        aceptacion: false,
      }),
    },
  ],
};

export default PLANTILLA_ADDENDUM;
