/**
 * AdminGen — Generador DOCX Monolingüe EN (Addendum)
 *
 * Produce documentos en inglés con formato conversacional directo,
 * siguiendo el estilo del Addendum No. 1 Villa Magna escrito por Claudia.
 *
 * Elementos que parsea del texto de las cláusulas:
 *   - **bold** → TextRun bold
 *   - Líneas que empiezan con "• " → bullet list
 *   - Párrafos que empiezan con "⚠️ **...**" → caja destacada (tabla 1x1)
 *   - Párrafos normales → justificados
 *
 * Diferencias con generador.js (bilingüe):
 *   - 1 columna (no tabla 2 columnas)
 *   - Monolingüe (solo EN)
 *   - Numeración dinámica de cláusulas (1, 2, 3… se asignan a las activas)
 *   - Cajas destacadas de advertencia
 *   - Header con título "ADDENDUM NO. X" + logo
 *   - Footer: "Addendum No. X | Property | claudia@…"
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  SectionType,
  VerticalAlign,
  ImageRun,
} from 'docx';

// ============================================================
// CONSTANTES
// ============================================================

const PAGE_WIDTH = 12240;
const PAGE_HEIGHT = 15840;
const MARGIN = 1440; // 1" márgenes (más cómodo para lectura monolingüe)
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2); // 9360 DXA

const FONT = 'Arial';
const FONT_SIZE_BODY = 22;         // 11pt
const FONT_SIZE_CLAUSE_TITLE = 26; // 13pt bold
const FONT_SIZE_WARNING = 22;      // 11pt
const FONT_SIZE_HEADER = 20;       // 10pt
const FONT_SIZE_FOOTER = 16;       // 8pt
const FONT_SIZE_FIRMA = 20;        // 10pt

const LOGO_WIDTH = 140;
const LOGO_HEIGHT = 58;

const BORDER_THIN = { style: BorderStyle.SINGLE, size: 4, color: 'D97706' };
const BORDER_NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

// ============================================================
// PARSER DE MARKDOWN SIMPLE
// ============================================================

/**
 * Parsea runs con **negritas** dentro de una línea de texto.
 * También detecta EL ADMINISTRADOR, THE OWNER, $125 USD, etc.
 * (reusa la lógica del generador bilingüe pero aplicada al texto EN).
 */
function parseRunsConFormato(texto, fontSize = FONT_SIZE_BODY, baseBold = false) {
  if (!texto) return [new TextRun({ text: '', font: FONT, size: fontSize, bold: baseBold })];

  const runs = [];
  const regexBold = /\*\*([^*]+)\*\*/g;

  let lastIndex = 0;
  let match;
  while ((match = regexBold.exec(texto)) !== null) {
    if (match.index > lastIndex) {
      // Texto antes del bold
      const antes = texto.substring(lastIndex, match.index);
      runs.push(...parseSubtleBolds(antes, fontSize, baseBold));
    }
    // Texto en bold
    runs.push(new TextRun({
      text: match[1],
      font: FONT,
      size: fontSize,
      bold: true,
    }));
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < texto.length) {
    const resto = texto.substring(lastIndex);
    runs.push(...parseSubtleBolds(resto, fontSize, baseBold));
  }

  return runs.length ? runs : [new TextRun({ text: texto, font: FONT, size: fontSize, bold: baseBold })];
}

/**
 * Dentro de texto NO marcado con **, detecta referencias contractuales
 * (THE OWNER, THE ADMINISTRATOR, Castle Solutions) y montos ($125 USD).
 */
function parseSubtleBolds(texto, fontSize, baseBold = false) {
  if (!texto) return [];
  const runs = [];

  // Referencias contractuales + montos
  const regex = /(THE\s+(?:OWNER|ADMINISTRATOR|OWNERS|PROPERTY)|Castle\s+Solutions|CASTLEBAY\s+PV|\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?(?:\s*(?:USD|MXN))?)/g;

  let lastIndex = 0;
  let match;
  while ((match = regex.exec(texto)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({
        text: texto.substring(lastIndex, match.index),
        font: FONT, size: fontSize, bold: baseBold,
      }));
    }
    runs.push(new TextRun({
      text: match[0],
      font: FONT, size: fontSize, bold: true,
    }));
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < texto.length) {
    runs.push(new TextRun({
      text: texto.substring(lastIndex),
      font: FONT, size: fontSize, bold: baseBold,
    }));
  }

  return runs.length ? runs : [new TextRun({ text: texto, font: FONT, size: fontSize, bold: baseBold })];
}

// ============================================================
// CONSTRUCTORES DE ELEMENTOS
// ============================================================

/**
 * Caja destacada de advertencia (⚠️): tabla 1x1 con fondo amarillo claro
 * y borde naranja, con el texto dentro en negrita.
 */
function crearCajaAdvertencia(texto) {
  // Limpiar el "⚠️ " inicial si viene con él
  const textoLimpio = texto.replace(/^[⚠️ ]+/, '').trim();

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            shading: { fill: 'FEF3C7', type: ShadingType.CLEAR }, // amarillo claro
            borders: {
              top: BORDER_THIN, bottom: BORDER_THIN,
              left: BORDER_THIN, right: BORDER_THIN,
            },
            margins: { top: 180, bottom: 180, left: 240, right: 240 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({ text: '⚠️  ', font: FONT, size: FONT_SIZE_WARNING, bold: true }),
                  ...parseRunsConFormato(textoLimpio, FONT_SIZE_WARNING, true),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Procesa el texto de una cláusula y devuelve un array de elementos
 * (Paragraph | Table) listos para agregar a la sección.
 */
function parsearCuerpoClausula(texto) {
  const elementos = [];
  const parrafos = texto.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  for (const parrafo of parrafos) {
    // ¿Es una caja de advertencia? (⚠️ al inicio)
    if (parrafo.startsWith('⚠️') || parrafo.startsWith('⚠')) {
      elementos.push(crearCajaAdvertencia(parrafo));
      elementos.push(new Paragraph({ spacing: { before: 0, after: 80 }, children: [] })); // espacio
      continue;
    }

    // ¿Es una lista? (tiene líneas que empiezan con "• ")
    const lineas = parrafo.split('\n');
    const esLista = lineas.every(l => l.trim().startsWith('•') || l.trim() === '');

    if (esLista) {
      for (const linea of lineas) {
        const limpio = linea.trim().replace(/^•\s*/, '');
        if (!limpio) continue;
        elementos.push(
          new Paragraph({
            spacing: { before: 40, after: 40 },
            indent: { left: 360, hanging: 240 },
            children: [
              new TextRun({ text: '•  ', font: FONT, size: FONT_SIZE_BODY }),
              ...parseRunsConFormato(limpio, FONT_SIZE_BODY),
            ],
          })
        );
      }
      continue;
    }

    // Párrafo normal: puede tener título en bold al inicio o ser todo bold
    // Los headers de cláusula ya vienen en negrita como **Titulo**, los manejamos aparte.
    // Aquí solo es prosa.
    elementos.push(
      new Paragraph({
        spacing: { before: 80, after: 80 },
        alignment: AlignmentType.JUSTIFIED,
        children: parseRunsConFormato(parrafo, FONT_SIZE_BODY),
      })
    );
  }

  return elementos;
}

/**
 * Crea una cláusula completa: número + título (extraído del **texto**) + cuerpo.
 */
function crearClausula(bloque, numeroClausula) {
  const elementos = [];
  const texto = bloque.en || '';

  // Extraer el título de la cláusula: primera línea que sea **Title**
  const matchTitulo = texto.match(/^\*\*([^*]+)\*\*\s*\n\n/);
  let titulo = '';
  let cuerpo = texto;

  if (matchTitulo) {
    titulo = matchTitulo[1];
    cuerpo = texto.substring(matchTitulo[0].length);
  }

  // Número + título
  if (titulo) {
    elementos.push(
      new Paragraph({
        spacing: { before: 360, after: 160 },
        children: [
          new TextRun({
            text: `${numeroClausula}.  `,
            font: FONT,
            size: FONT_SIZE_CLAUSE_TITLE,
            bold: true,
            color: '0D9488', // teal-500 de la marca Castle
          }),
          new TextRun({
            text: titulo,
            font: FONT,
            size: FONT_SIZE_CLAUSE_TITLE,
            bold: true,
          }),
        ],
      })
    );
  }

  // Cuerpo
  elementos.push(...parsearCuerpoClausula(cuerpo));

  return elementos;
}

/**
 * Tabla resumen arriba (Property / Owner / Administrator / Effective Date).
 */
function crearTablaEncabezado(meta, datos) {
  const filas = [
    ['Property', datos.propiedad || ''],
    ['Owner', datos.owner || ''],
    ['Administrator', 'Claudia Rebeca Castillo Soto — Castle Solutions / CASTLEBAY PV, SRL DE CV'],
    ['Effective Date', datos.fecha_efectiva || ''],
  ];

  const COL_LABEL = 2400;
  const COL_VALUE = CONTENT_WIDTH - COL_LABEL;

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [COL_LABEL, COL_VALUE],
    rows: filas.map(([label, value]) => new TableRow({
      children: [
        new TableCell({
          width: { size: COL_LABEL, type: WidthType.DXA },
          shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB' },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB' },
            left: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB' },
            right: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB' },
          },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          children: [new Paragraph({
            children: [new TextRun({ text: label, font: FONT, size: FONT_SIZE_BODY, bold: true })],
          })],
        }),
        new TableCell({
          width: { size: COL_VALUE, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB' },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB' },
            left: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB' },
            right: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB' },
          },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          children: [new Paragraph({
            children: [new TextRun({ text: value, font: FONT, size: FONT_SIZE_BODY })],
          })],
        }),
      ],
    })),
  });
}

/**
 * Título principal "ADDENDUM NO. X"
 */
function crearTituloAddendum(numeroAddendum, direccionPropiedad) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 80 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: `ADDENDUM NO. ${numeroAddendum}`,
          font: FONT,
          size: 32, // 16pt
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: `Property Management Contract — ${direccionPropiedad || '___'}`,
          font: FONT,
          size: 24, // 12pt
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 280 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: 'Addendum al Contrato de Administración y Mantenimiento',
          font: FONT,
          size: 20, // 10pt
          italics: true,
          color: '6B7280',
        }),
      ],
    }),
  ];
}

/**
 * Preámbulo introductorio (del bloque 'encabezado' de la plantilla).
 */
function crearPreambulo(textoEN, notaIdiomaES) {
  return [
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: textoEN,
          font: FONT,
          size: FONT_SIZE_BODY,
          italics: true,
        }),
      ],
    }),
    // Nota de prevalencia ES
    notaIdiomaES ? new Paragraph({
      spacing: { before: 80, after: 160 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: `Nota: ${notaIdiomaES}`,
          font: FONT,
          size: 18, // 9pt más pequeño
          italics: true,
          color: '6B7280',
        }),
      ],
    }) : null,
  ].filter(Boolean);
}

/**
 * Firmas al final.
 */
function crearFirmas(bloqueFirmas) {
  const elementos = [];
  const firmas = bloqueFirmas?.firmas || [];

  // Título de sección
  elementos.push(
    new Paragraph({
      spacing: { before: 600, after: 160 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'SIGNATURES',
          font: FONT,
          size: FONT_SIZE_CLAUSE_TITLE,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 240 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Both parties sign below to confirm they have read and agreed to all points of this Addendum.',
          font: FONT,
          size: FONT_SIZE_BODY,
          italics: true,
          color: '6B7280',
        }),
      ],
    })
  );

  // Cada firma
  for (let i = 0; i < firmas.length; i++) {
    const firma = firmas[i];
    const spacingBefore = i === 0 ? 400 : 300;

    elementos.push(
      new Paragraph({ spacing: { before: spacingBefore }, children: [] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '___________________________________________', font: FONT, size: FONT_SIZE_FIRMA })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80 },
        children: [new TextRun({ text: firma.nombre, font: FONT, size: FONT_SIZE_FIRMA, bold: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: firma.rol_es || '', font: FONT, size: FONT_SIZE_FIRMA })],
      }),
    );
  }

  return elementos;
}

// ============================================================
// EXPORT PRINCIPAL
// ============================================================

export async function generarDocxAddendum(bloques, meta = {}, opciones = {}) {
  const { logoBase64, datosExtras = {} } = opciones;

  // Separar bloques
  const encabezadoBloque = bloques.find(b => b.id === 'encabezado');
  const clausulasBloques = bloques.filter(b => b.tipo === 'clausula_addendum' || (b.id && b.id.startsWith('ad_') && b.tipo !== 'firmas'));
  const bloqueFirmas = bloques.find(b => b.tipo === 'firmas');

  // Datos del documento
  const numeroAddendum = datosExtras.addendum_numero || '1';
  const direccionPropiedad = datosExtras.direccion || '';
  const fechaEfectiva = datosExtras.fecha_efectiva || '';
  const ownerName = datosExtras.owner_name || '';

  // ==== Construir contenido ====
  const contenido = [];

  // Título principal
  contenido.push(...crearTituloAddendum(numeroAddendum, direccionPropiedad));

  // Tabla encabezado
  contenido.push(crearTablaEncabezado(meta, {
    propiedad: direccionPropiedad,
    owner: ownerName,
    fecha_efectiva: fechaEfectiva,
  }));

  // Espacio después de tabla
  contenido.push(new Paragraph({ spacing: { before: 240, after: 0 }, children: [] }));

  // Preámbulo (del bloque 'encabezado')
  if (encabezadoBloque) {
    contenido.push(...crearPreambulo(encabezadoBloque.en || '', meta.nota_idioma?.es));
  }

  // Cláusulas numeradas dinámicamente
  let numeroClausula = 1;
  for (const bloque of clausulasBloques) {
    contenido.push(...crearClausula(bloque, numeroClausula));
    numeroClausula++;
  }

  // Firmas
  if (bloqueFirmas) {
    contenido.push(...crearFirmas(bloqueFirmas));
  }

  // ==== Header y Footer ====

  const tieneLogoReal = logoBase64 && logoBase64.length > 200; // cualquier base64 real
  const detectImageType = (base64) => {
    if (!base64) return 'png';
    if (base64.startsWith('/9j/')) return 'jpg';
    return 'png';
  };

  const headerChildren = [];
  if (tieneLogoReal) {
    const logoBuffer = Buffer.from(logoBase64, 'base64');
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: { width: LOGO_WIDTH, height: LOGO_HEIGHT },
            type: detectImageType(logoBase64),
          }),
        ],
      })
    );
  } else {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: 'CASTLE SOLUTIONS',
            font: FONT,
            size: FONT_SIZE_HEADER,
            bold: true,
            color: '0D9488',
          }),
          new TextRun({
            text: '  —  Castlebay PV, SRL de CV  —  Puerto Vallarta, Jalisco, México',
            font: FONT,
            size: 16,
            color: '6B7280',
          }),
        ],
      })
    );
  }

  const headerDefault = new Header({ children: headerChildren });

  // Footer: "Addendum No. X  |  Property  |  claudia@..."
  const footerText = `Addendum No. ${numeroAddendum}  |  ${direccionPropiedad || '___'}  |  claudia@castlesolutions.biz`;
  const footerDefault = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: footerText, font: FONT, size: FONT_SIZE_FOOTER, color: '9CA3AF' }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'Page ', font: FONT, size: FONT_SIZE_FOOTER, color: '9CA3AF' }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: FONT_SIZE_FOOTER, color: '9CA3AF' }),
          new TextRun({ text: ' of ', font: FONT, size: FONT_SIZE_FOOTER, color: '9CA3AF' }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: FONT_SIZE_FOOTER, color: '9CA3AF' }),
        ],
      }),
    ],
  });

  // ==== Documento ====

  const pageProps = {
    page: {
      size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
      margin: {
        top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN,
        header: 360, footer: 360,
      },
    },
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: FONT_SIZE_BODY },
        },
      },
    },
    sections: [{
      properties: pageProps,
      headers: { default: headerDefault },
      footers: { default: footerDefault },
      children: contenido,
    }],
  });

  return await Packer.toBuffer(doc);
}

export async function generarDocxAddendumBlob(bloques, meta = {}, opciones = {}) {
  const buffer = await generarDocxAddendum(bloques, meta, opciones);
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}
