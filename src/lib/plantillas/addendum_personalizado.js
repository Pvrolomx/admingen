/**
 * AdminGen — Plantilla: Addendum Personalizado al Contrato de Administración
 * Castle Solutions / CASTLEBAY PV, SRL DE CV
 *
 * Documento accesorio que se genera por separado del contrato principal
 * y lo modifica/precisa para acomodar circunstancias específicas de
 * ciertos propietarios.
 *
 * ESTILO: Las cláusulas están redactadas en tono conversacional directo
 * (siguiendo el estilo del Addendum No. 1 Brenda Maxwell / Villa Magna
 * escrito por Claudia en abril 2026). El tono es deliberadamente no-legalista
 * porque el público objetivo son dueños extranjeros que NECESITAN leer y
 * entender antes de firmar. La fuerza legal está en:
 *   - Citas textuales de emails previos del owner
 *   - Cajas de advertencia ⚠️ con deslindes explícitos
 *   - Obligación de firmar (= aceptación clara, no silenciosa)
 *
 * FORMATO: EN principal + nota ES al inicio indicando que la versión en
 * inglés prevalece. Los owners son extranjeros que leen inglés.
 *
 * Versión 2.0.0 — Reescrita completa post análisis del caso Brenda.
 */

const PLANTILLA_ADDENDUM = {

  meta: {
    id: 'addendum_personalizado',
    version: '2.0.0',
    nombre: 'Addendum al Contrato de Administración',
    nombre_en: 'Addendum to Property Management Contract',
    idiomas: ['en'],
    formato: 'monolingue_en',
    nota_idioma: {
      es: 'Este addendum se redacta en inglés como idioma principal por ser el lenguaje de trabajo con el propietario. La versión en inglés prevalecerá en caso de cualquier controversia.',
      en: 'This addendum is drafted in English as the primary language, being the working language with the owner. The English version shall prevail in case of any controversy.',
    },
  },

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

  campos: {
    propiedad: {
      etiqueta: 'Datos de la propiedad',
      etiqueta_en: 'Property data',
      campos: [
        { id: 'direccion', tipo: 'textarea', requerido: true, etiqueta: 'Dirección completa de la propiedad', etiqueta_en: 'Full property address', placeholder: 'ej. Villa Magna 352A & 352B, Puerto Vallarta, Jalisco' },
        { id: 'addendum_numero', tipo: 'texto', requerido: true, etiqueta: 'Número de addendum', etiqueta_en: 'Addendum number', default: '1', placeholder: '1' },
      ],
    },
    contrato_base: {
      etiqueta: 'Referencia al contrato principal',
      etiqueta_en: 'Reference to main contract',
      campos: [
        { id: 'fecha_contrato', tipo: 'texto', requerido: true, etiqueta: 'Fecha del contrato principal (EN)', etiqueta_en: 'Date of main contract', placeholder: 'ej. April 15, 2026' },
        { id: 'fecha_efectiva', tipo: 'texto', requerido: true, etiqueta: 'Fecha efectiva del addendum', etiqueta_en: 'Addendum effective date', placeholder: 'ej. April 23, 2026' },
      ],
    },
  },

  bloques: [

    // ENCABEZADO
    {
      id: 'encabezado',
      siempre: true,
      tipo: 'encabezado_addendum',
      render: (ctx) => ({
        en: `This document adds to and updates the existing Property Management and Maintenance Contract between the parties listed above, dated ${ctx.fecha_contrato || '___'}. Everything in the original contract still applies — this Addendum only adds new agreements and clarifications. Both parties sign below to confirm they have read and agreed to all points.`,
        es: '',
      }),
    },

    // I — Instrucciones de limpieza override
    {
      id: 'ad_instrucciones_limpieza',
      condicional: true,
      default: false,
      etiqueta: '⚠️ Instrucciones de limpieza del owner → deslinde',
      etiqueta_en: 'Cleaning instructions override',
      tipo: 'clausula_addendum',
      render: (ctx) => ({
        en: `**If You Tell Us How to Clean — We're Not Responsible for the Results**

Our contract (Sections 3a and b.1) gives Castle Solutions the right to decide how cleaning and maintenance work gets done. That means choosing the right tools, products, and methods based on what actually works best for the property.

When the owner sends specific instructions about how our team should carry out cleaning or maintenance work, we're happy to follow them as a courtesy, but we need to be clear about one thing:

⚠️ **If you tell us to do something a specific way and it causes damage or a bad result, that's on you — not on us.**

Examples of the kind of instructions this covers include:

• Specifying cleaning tools (e.g., "only a Swiffer, no mop")
• Dictating how to organize cupboards, linens, and supplies inside the units
• Requiring specific folding, placement, or arrangement of textiles and fabrics
• Requests for specific cleaning products that are not provided by the owner, as required by the contract

We'll keep doing our best to accommodate reasonable preferences. But when you override our professional judgment in writing, you take on the responsibility for the outcome.`,
        es: '',
      }),
    },

    // II — Cambios internos del equipo
    {
      id: 'ad_cambios_equipo',
      condicional: true,
      default: false,
      etiqueta: 'Cambios internos en el equipo Castle',
      etiqueta_en: 'Internal team changes',
      tipo: 'clausula_addendum',
      render: (ctx) => ({
        en: `**Changes Inside Our Team**

We want to officially let you know about two important changes at Castle Solutions that affect how your property is managed:

**Miranda Santos is now Operations Manager.** This is a promotion — Miranda now oversees our entire housekeeping and operations team. She's no longer available as a personal, on-call cleaning person for individual units. Your property will still be cleaned and inspected regularly, but by our team under Miranda's supervision, not by Miranda personally on request.

**Claudia is no longer doing field work.** Claudia's role is now focused on managing contracts, client relationships, and the business side of things. She won't be showing up personally for routine cleanings, deliveries, or maintenance visits unless there's a real emergency or a specific reason tied to the contract.

What this means for you: if you send a message asking Miranda or Claudia to personally do something at a specific time, we can't always guarantee that. Our team handles the work — Miranda makes sure it's done right.`,
        es: '',
      }),
    },

    // III — Restricciones de acceso
    {
      id: 'ad_restriccion_acceso',
      condicional: true,
      default: false,
      etiqueta: '⚠️ Restricciones de acceso → deslinde',
      etiqueta_en: 'Access restrictions → liability release',
      tipo: 'clausula_addendum',
      render: (ctx) => ({
        en: `**About Restricting Who Can Enter the Unit**

When the owner asks us to limit who has access to the unit — for example, telling us that only specific named individuals can know the codes or enter — we understand where it's coming from. Security concerns and peace of mind are legitimate reasons to want tight control over access.

But we need to be honest with you about three consequences of that approach:

• **It creates a gap in emergency coverage.** If the authorized person is on vacation or unavailable, and something goes wrong in the unit — a burst pipe, a leak from upstairs, an electrical problem — there would be nobody authorized to go in and deal with it. Our contract (Section 3a) requires us to be able to respond within 24 hours in an emergency. That's impossible if access is too narrowly restricted.

• **It shifts the responsibility to you.** If we can't get in because of your restrictions, and something gets damaged as a result, we are not responsible for that damage. By signing this Addendum, you acknowledge and accept that.

• **It affects routine service.** Weekly supervision visits included in your monthly fee require that someone from our team can enter the unit. Limiting that to only one or two people makes it very difficult to maintain that service reliably.

Any high-value items inside the unit should be reported to your contents insurance separately — Castle Solutions does not insure personal property.

⚠️ **If your access restrictions prevent us from doing our job — including responding to emergencies — Castle Solutions is not responsible for any damage or loss that results.**`,
        es: '',
      }),
    },

    // IV — Ausencia prolongada + riesgos del clima PV
    {
      id: 'ad_ausencia_prolongada',
      condicional: true,
      default: false,
      etiqueta: '⚠️ Ausencia prolongada + riesgos del clima PV',
      etiqueta_en: 'Prolonged absence + PV climate risks',
      tipo: 'clausula_addendum',
      render: (ctx) => ({
        en: `**What Happens to the Unit While You're Gone**

When the owner confirms the unit will be empty for an extended period (typically 3 to 6 months), we want to be completely honest about what that means for properties in Puerto Vallarta, because this is important.

PV is a beautiful place — but it's also hot, extremely humid (80–95% humidity most of the time), full of salt in the air from the ocean, and June through October is full-on rainy and hurricane season. Empty properties in this climate get damaged fast if nobody's keeping an eye on them. Here's what can happen:

• **Mold.** This is the big one. Mold can start growing within 24–48 hours in a closed, humid unit. By the time you come back, it can be on the walls, the ceiling, inside the cupboards, on mattresses, on furniture, and on linens. It's expensive to fix and a health hazard.

• **Bugs and rodents.** Cockroaches, ants, silverfish, and mice are common in empty coastal units. They get into linens, stored food, and furniture.

• **Appliances.** Fridges, AC units, water heaters, and washing machines need to run occasionally. If they sit completely unused for 5–6 months in this climate, seals degrade, coils get moldy, and motors can burn out.

• **Salt air corrosion.** Everything metal rusts faster here than anywhere else — hinges, locks, window tracks, appliance parts. Ocean-facing buildings get it worse.

• **Plumbing.** The U-shaped traps under sinks and drains dry out in empty units, which lets sewer gases into the apartment. Rubber seals also degrade faster in the heat.

• **Water damage you don't know about.** Leaks from the unit above, roof seepage during heavy rains, or condensation buildup can go unnoticed for weeks without someone physically checking.

• **Electrical issues.** Humidity gets into outlets and panels. Things left plugged in during power surges can create fire risks.

None of this is meant to scare you — it's just the reality of this climate. The good news is that regular visits and a light cleaning every few weeks prevent most of these problems completely.

⚠️ **If you limit our access and we can't do the weekly visits, we can't be responsible for what happens to the unit while you're away.**`,
        es: '',
      }),
    },

    // V — Protocolo de rentas + terminación por subarriendo
    {
      id: 'ad_protocolo_rentas',
      condicional: true,
      default: false,
      etiqueta: '⚠️ Protocolo de rentas + terminación por subarriendo',
      etiqueta_en: 'Rentals protocol + sublet termination',
      tipo: 'clausula_addendum',
      render: (ctx) => ({
        en: `**How Rentals Work Going Forward**

We want to make sure everyone is on the same page about what Castle Solutions does — and doesn't do — when it comes to renters. Here's how it works:

**We'll get the apartment ready.** Before any renter arrives, we make sure the unit is clean and in good condition. That's our job and we'll do it well.

**All communication with renters goes through you.** Castle Solutions will not communicate directly with renters. Any instructions, rules, or messages for them come from you, the owner. If a renter has a question or request, it goes to you first and you let us know what you'd like us to do.

**No in-person check-in or check-out.** We won't be doing in-person arrivals or departures with renters. Access will be handled through the key box or digital lock as usual. If there's an issue at check-in or check-out, the renter contacts you.

**Electricity gets measured.** We will read the electricity meter at the start and end of each rental period, and the consumption during the rental will be charged to the renter or deducted from their deposit, as coordinated with you.

⚠️ **Important: If a third party — meaning anyone who is not the owner — tries to rent or sublet the unit without Castle Solutions managing the rental through this contract, this contract is terminated immediately, without notice.**

To be clear: renters go through us, booked by you through Castle Solutions. If someone is staying in the unit under an arrangement Castle Solutions doesn't know about and isn't managing, that's a breach of contract and the agreement ends on the spot.`,
        es: '',
      }),
    },

    // VI — Trabajo de contratistas externos
    {
      id: 'ad_contractors_terceros',
      condicional: true,
      default: false,
      etiqueta: '⚠️ Trabajo de contratistas externos → deslinde',
      etiqueta_en: 'Third-party work → liability release',
      tipo: 'clausula_addendum',
      render: (ctx) => ({
        en: `**Work We Did Not Arrange — Not Our Responsibility**

Castle Solutions is only responsible for work that we arranged, supervised, or authorized on your behalf. That means:

• **If you hire someone directly** without going through us, we have no involvement in that work — not in how it's done, not in the result, and not in fixing it if something goes wrong.

• **If a contractor you found or contacted** does work in the unit, any warranty, guarantee, or follow-up on that work is between you and them. Castle Solutions is not part of that.

• **If something breaks or doesn't work right** after work that we didn't coordinate, we're not responsible for repairing it, paying for it, or managing the follow-up with the contractor.

This applies the other way too: if we coordinate a repair on your behalf and the contractor gives a warranty, we'll pass that along to you. But the warranty is between you and them — Castle Solutions does not guarantee third-party work quality, only that we verified the work was performed as instructed.

⚠️ **Castle Solutions is not liable for any work, repairs, or installations done by contractors not hired or supervised by us — regardless of when the work happened or who recommended them.**`,
        es: '',
      }),
    },

    // VII — Instrucciones cambiantes / confirmación escrita
    {
      id: 'ad_instrucciones_cambiantes',
      condicional: true,
      default: false,
      etiqueta: 'Instrucciones cambiantes → confirmación escrita',
      etiqueta_en: 'Changing instructions → written confirmation',
      tipo: 'clausula_addendum',
      render: (ctx) => ({
        en: `**When Instructions Change — We Need Them in Writing**

Managing a property well requires clarity about what the owner actually wants done. When instructions change frequently or get sent through multiple channels (email, text, voice messages), we run the risk of acting on outdated information, and that wastes money and time for everyone.

To keep things clean going forward, here's how we'll handle instructions that involve spending money or hiring people:

• **Any instruction that means spending money, buying something, hiring a contractor, or doing work for more than a few hundred dollars needs to be confirmed by email before we act on it.** This protects both of us — you don't get surprised by charges, and we don't end up executing something you later changed your mind about.

• **If you send us a new instruction that contradicts an earlier one, the most recent written instruction wins.** We can't be expected to guess which version is current.

• **We can pause execution until we get the written confirmation.** If we're waiting on that confirmation and something gets delayed, that's not on us.

• **We keep a log of what we received and what we executed.** You can ask to see it anytime.

This isn't about being rigid — it's about not wasting your money or ours when directions change mid-stream.`,
        es: '',
      }),
    },

    // VIII — Lista maestra pre-temporada
    {
      id: 'ad_master_list_preseason',
      condicional: true,
      default: false,
      etiqueta: 'Lista maestra pre-temporada',
      etiqueta_en: 'Pre-season master list',
      tipo: 'clausula_addendum',
      render: (ctx) => ({
        en: `**Pre-Season Master List — Planning Ahead**

For owners who spend only part of the year in the property and want to be personally present for repairs, installations, or major work, we'd like to propose a different way of handling requests going forward.

Instead of sending individual requests throughout the off-season (which is also our busiest period with contractors), here's what we suggest:

**In October, before you arrive for the season**, we'll put together a Master Pre-Season List. This is a single document that lists everything you want addressed during your stay: repairs, purchases, contractor visits, improvements, inspections. We review it together, decide priorities and timing, and schedule everything for when you're here.

**Why this works better for you:**

• You're personally present for the work, which is what you've asked for
• Nothing moves forward without your sign-off
• Access to the unit is managed exactly the way you want
• You're not sending emails throughout the summer trying to track status

**Why this works better for us:**

• We can coordinate contractor schedules properly instead of chasing availability during high season
• We're not executing instructions that get changed three times
• We can focus high-season attention on your unit when it actually matters

If something truly urgent comes up mid-season, of course we handle it. But routine "nice-to-have" items get batched into the master list and handled when you arrive.`,
        es: '',
      }),
    },

    // FIRMAS
    {
      id: 'firmas',
      tipo: 'firmas',
      siempre: true,
      render: (ctx) => ({
        firmas: [
          { nombre: ctx.propietario.nombres, rol_es: ctx.propietario.clave === 'mp' || ctx.propietario.clave === 'fp' ? 'OWNERS' : 'OWNER' },
          { nombre: 'Claudia Rebeca Castillo Soto', rol_es: 'Legal Representative\nCASTLEBAY PV, SRL DE CV\nADMINISTRATOR' },
        ],
        testigos: false,
        aceptacion: false,
      }),
    },
  ],
};

export default PLANTILLA_ADDENDUM;
