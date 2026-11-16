import type { Worksheet } from '../types';

export const ORIGINAL_WORKSHEET_TEMPLATE: Worksheet = {
  id: 'original-template',
  title: 'Handwriting Practice',
  showTitle: true,
  header: {
    showName: true,
    nameLabel: 'Name: ______________________',
    showGrade: true,
    gradeLabel: 'Grade: ______',
    showDate: false,
    dateLabel: 'Date: ____________',
    showScore: false,
    scoreLabel: 'Score: ______',
  },
  guidelines: {
    rowHeight: 70,
    midlinePosition: 30,
    baselinePosition: 55,
    topLineColor: '#a9a9a9',
    topLineStyle: 'solid',
    topLineWidth: 1,
    midLineColor: '#b0c4de',
    midLineStyle: 'dashed',
    midLineWidth: 2,
    baselineColor: '#e74c3c',
    baselineStyle: 'solid',
    baselineWidth: 2,
    bottomLineColor: '#a9a9a9',
    bottomLineStyle: 'solid',
    bottomLineWidth: 1,
    slantEnabled: false,
    slantAngle: 55,
    slantSpacing: 30,
    slantColor: '#cbd5e1',
    slantOpacity: 0.5,
    slantWidth: 1,
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", cursive, sans-serif',
    fontFamilyName: 'Chalkboard / Comic (Original)',
    fontSize: 42,
    letterSpacing: 6,
    textOffsetBottom: 12,
    textColor: '#000000',
    traceColor: '#e0e0e0',
    traceStyle: 'solid',
  },
  layout: {
    paperSize: 'a4',
    orientation: 'portrait',
    gapBetweenRows: 26,
    sectionGap: 24,
    showPageNumber: true,
  },
  pages: [
    {
      id: 'page-1',
      pageNumber: 1,
      sections: [
        {
          id: 'sec-1',
          title: '1. Trace the uppercase and lowercase pairs:',
          showTitle: true,
          rows: [
            { id: 'r1', type: 'trace', text: 'Aa Bb Cc Dd Ee Ff Gg Hh' },
            { id: 'r2', type: 'model', text: 'Aa Bb Cc Dd Ee Ff Gg Hh' },
            { id: 'r3', type: 'trace', text: 'Ii Jj Kk Ll Mm Nn Oo Pp' },
            { id: 'r4', type: 'model', text: 'Ii Jj Kk Ll Mm Nn Oo Pp' },
            { id: 'r5', type: 'trace', text: 'Qq Rr Ss Tt Uu Vv Ww Xx' },
            { id: 'r6', type: 'model', text: 'Qq Rr Ss Tt Uu Vv Ww Xx' },
            { id: 'r7', type: 'trace', text: 'Yy Zz' },
            { id: 'r8', type: 'model', text: 'Yy Zz' },
          ],
        },
        {
          id: 'sec-2',
          title: '2. Trace and copy the sentences:',
          showTitle: true,
          rows: [
            { id: 'r9', type: 'trace', text: 'The quick brown fox' },
            { id: 'r10', type: 'model', text: 'The quick brown fox' },
            { id: 'r11', type: 'trace', text: 'jumps over the lazy dog.' },
            { id: 'r12', type: 'model', text: 'jumps over the lazy dog.' },
          ],
        },
        {
          id: 'sec-3',
          title: '3. Write your own sentence:',
          showTitle: true,
          rows: [
            { id: 'r13', type: 'blank', text: '' },
            { id: 'r14', type: 'blank', text: '' },
          ],
        },
      ],
    },
  ],
  createdAt: 1731670000000,
  updatedAt: 1731670000000,
};

export const ORIGINAL_WORKSHEET_TEMPLATE_PT: Worksheet = {
  ...ORIGINAL_WORKSHEET_TEMPLATE,
  title: 'Prática de Caligrafia',
  header: {
    ...ORIGINAL_WORKSHEET_TEMPLATE.header,
    nameLabel: 'Nome: ______________________',
    gradeLabel: 'Turma: ______',
    dateLabel: 'Data: ____________',
    scoreLabel: 'Nota: ______',
  },
  pages: [
    {
      id: 'page-1',
      pageNumber: 1,
      sections: [
        {
          id: 'sec-1',
          title: '1. Cubra os pares em maiúsculas e minúsculas:',
          showTitle: true,
          rows: [
            { id: 'r1', type: 'trace', text: 'Aa Bb Cc Dd Ee Ff Gg Hh' },
            { id: 'r2', type: 'model', text: 'Aa Bb Cc Dd Ee Ff Gg Hh' },
            { id: 'r3', type: 'trace', text: 'Ii Jj Kk Ll Mm Nn Oo Pp' },
            { id: 'r4', type: 'model', text: 'Ii Jj Kk Ll Mm Nn Oo Pp' },
            { id: 'r5', type: 'trace', text: 'Qq Rr Ss Tt Uu Vv Ww Xx' },
            { id: 'r6', type: 'model', text: 'Qq Rr Ss Tt Uu Vv Ww Xx' },
            { id: 'r7', type: 'trace', text: 'Yy Zz' },
            { id: 'r8', type: 'model', text: 'Yy Zz' },
          ],
        },
        {
          id: 'sec-2',
          title: '2. Cubra e copie as frases:',
          showTitle: true,
          rows: [
            { id: 'r9', type: 'trace', text: 'Um pequeno jabuti xereta' },
            { id: 'r10', type: 'model', text: 'Um pequeno jabuti xereta' },
            { id: 'r11', type: 'trace', text: 'viu dez cegonhas felizes.' },
            { id: 'r12', type: 'model', text: 'viu dez cegonhas felizes.' },
          ],
        },
        {
          id: 'sec-3',
          title: '3. Escreva sua própria frase:',
          showTitle: true,
          rows: [
            { id: 'r13', type: 'blank', text: '' },
            { id: 'r14', type: 'blank', text: '' },
          ],
        },
      ],
    },
  ],
};

export const ORIGINAL_WORKSHEET_TEMPLATE_ES: Worksheet = {
  ...ORIGINAL_WORKSHEET_TEMPLATE,
  title: 'Práctica de Caligrafía',
  header: {
    ...ORIGINAL_WORKSHEET_TEMPLATE.header,
    nameLabel: 'Nombre: ______________________',
    gradeLabel: 'Curso: ______',
    dateLabel: 'Fecha: ____________',
    scoreLabel: 'Nota: ______',
  },
  pages: [
    {
      id: 'page-1',
      pageNumber: 1,
      sections: [
        {
          id: 'sec-1',
          title: '1. Traza los pares en mayúsculas y minúsculas:',
          showTitle: true,
          rows: [
            { id: 'r1', type: 'trace', text: 'Aa Bb Cc Dd Ee Ff Gg Hh' },
            { id: 'r2', type: 'model', text: 'Aa Bb Cc Dd Ee Ff Gg Hh' },
            { id: 'r3', type: 'trace', text: 'Ii Jj Kk Ll Mm Nn Oo Pp' },
            { id: 'r4', type: 'model', text: 'Ii Jj Kk Ll Mm Nn Oo Pp' },
            { id: 'r5', type: 'trace', text: 'Qq Rr Ss Tt Uu Vv Ww Xx' },
            { id: 'r6', type: 'model', text: 'Qq Rr Ss Tt Uu Vv Ww Xx' },
            { id: 'r7', type: 'trace', text: 'Yy Zz' },
            { id: 'r8', type: 'model', text: 'Yy Zz' },
          ],
        },
        {
          id: 'sec-2',
          title: '2. Traza y copia las frases:',
          showTitle: true,
          rows: [
            { id: 'r9', type: 'trace', text: 'El veloz murciélago hindú' },
            { id: 'r10', type: 'model', text: 'El veloz murciélago hindú' },
            { id: 'r11', type: 'trace', text: 'comía feliz cardillo y kiwi.' },
            { id: 'r12', type: 'model', text: 'comía feliz cardillo y kiwi.' },
          ],
        },
        {
          id: 'sec-3',
          title: '3. Escribe tu propia frase:',
          showTitle: true,
          rows: [
            { id: 'r13', type: 'blank', text: '' },
            { id: 'r14', type: 'blank', text: '' },
          ],
        },
      ],
    },
  ],
};

export function getDefaultWorksheet(lang?: string): Worksheet {
  const normalized = (lang || '').toLowerCase();
  if (normalized.startsWith('pt')) return JSON.parse(JSON.stringify(ORIGINAL_WORKSHEET_TEMPLATE_PT));
  if (normalized.startsWith('es')) return JSON.parse(JSON.stringify(ORIGINAL_WORKSHEET_TEMPLATE_ES));
  return JSON.parse(JSON.stringify(ORIGINAL_WORKSHEET_TEMPLATE));
}

export const CALLIGRAPHY_COPPERPLATE_TEMPLATE: Worksheet = {
  id: 'calligraphy-copperplate',
  title: 'Copperplate Calligraphy Practice',
  showTitle: true,
  header: {
    showName: true,
    nameLabel: 'Name: ______________________',
    showGrade: false,
    gradeLabel: 'Grade: ______',
    showDate: true,
    dateLabel: 'Date: ____________',
    showScore: false,
    scoreLabel: 'Score: ______',
  },
  guidelines: {
    rowHeight: 72,
    midlinePosition: 30,
    baselinePosition: 54,
    topLineColor: '#94a3b8',
    topLineStyle: 'solid',
    topLineWidth: 1,
    midLineColor: '#93c5fd',
    midLineStyle: 'dashed',
    midLineWidth: 2,
    baselineColor: '#dc2626',
    baselineStyle: 'solid',
    baselineWidth: 2,
    bottomLineColor: '#94a3b8',
    bottomLineStyle: 'solid',
    bottomLineWidth: 1,
    slantEnabled: true,
    slantAngle: 55,
    slantSpacing: 28,
    slantColor: '#cbd5e1',
    slantOpacity: 0.65,
    slantWidth: 1,
  },
  typography: {
    fontFamily: '"Great Vibes", cursive',
    fontFamilyName: 'Great Vibes (Flourish Calligraphy)',
    fontSize: 44,
    letterSpacing: 4,
    textOffsetBottom: 14,
    textColor: '#0f172a',
    traceColor: '#cbd5e1',
    traceStyle: 'solid',
  },
  layout: {
    paperSize: 'a4',
    orientation: 'portrait',
    gapBetweenRows: 24,
    sectionGap: 24,
    showPageNumber: true,
  },
  pages: [
    {
      id: 'page-1',
      pageNumber: 1,
      sections: [
        {
          id: 'sec-1',
          title: '1. Basic Underturn and Ovals:',
          showTitle: true,
          rows: [
            { id: 'cp1', type: 'trace', text: 'i  u  w  e  c  o  a  d' },
            { id: 'cp2', type: 'blank', text: '' },
            { id: 'cp3', type: 'trace', text: 'm  n  v  x  r  s' },
            { id: 'cp4', type: 'blank', text: '' },
          ],
        },
        {
          id: 'sec-2',
          title: '2. Ascenders & Descenders with 55° Slant:',
          showTitle: true,
          rows: [
            { id: 'cp5', type: 'trace', text: 'b  h  k  l  t  f' },
            { id: 'cp6', type: 'blank', text: '' },
            { id: 'cp7', type: 'trace', text: 'g  j  p  q  y  z' },
            { id: 'cp8', type: 'blank', text: '' },
          ],
        },
        {
          id: 'sec-3',
          title: '3. Connecting Words & Flourishes:',
          showTitle: true,
          rows: [
            { id: 'cp9', type: 'trace', text: 'Calligraphy  Harmony  Art' },
            { id: 'cp10', type: 'blank', text: '' },
            { id: 'cp11', type: 'trace', text: 'Practice creates mastery' },
            { id: 'cp12', type: 'blank', text: '' },
          ],
        },
      ],
    },
  ],
  createdAt: 1731670100000,
  updatedAt: 1731670100000,
};

export const PANGRAMS_MULTI_PAGE_TEMPLATE: Worksheet = {
  id: 'famous-pangrams',
  title: 'Calligraphy Pangrams & Quotes',
  showTitle: true,
  header: {
    showName: true,
    nameLabel: 'Name: ______________________',
    showGrade: false,
    gradeLabel: 'Grade: ______',
    showDate: true,
    dateLabel: 'Date: ____________',
    showScore: false,
    scoreLabel: 'Score: ______',
  },
  guidelines: {
    rowHeight: 68,
    midlinePosition: 29,
    baselinePosition: 52,
    topLineColor: '#a1a1aa',
    topLineStyle: 'solid',
    topLineWidth: 1,
    midLineColor: '#93c5fd',
    midLineStyle: 'dashed',
    midLineWidth: 2,
    baselineColor: '#ef4444',
    baselineStyle: 'solid',
    baselineWidth: 2,
    bottomLineColor: '#a1a1aa',
    bottomLineStyle: 'solid',
    bottomLineWidth: 1,
    slantEnabled: true,
    slantAngle: 60,
    slantSpacing: 32,
    slantColor: '#e2e8f0',
    slantOpacity: 0.55,
    slantWidth: 1,
  },
  typography: {
    fontFamily: '"Cedarville Cursive", cursive',
    fontFamilyName: 'Cedarville Cursive',
    fontSize: 40,
    letterSpacing: 4,
    textOffsetBottom: 14,
    textColor: '#18181b',
    traceColor: '#d4d4d8',
    traceStyle: 'solid',
  },
  layout: {
    paperSize: 'a4',
    orientation: 'portrait',
    gapBetweenRows: 26,
    sectionGap: 24,
    showPageNumber: true,
  },
  pages: [
    {
      id: 'page-1',
      pageNumber: 1,
      sections: [
        {
          id: 'sec-p1',
          title: 'Part 1: Classic Alphabet Pangrams',
          showTitle: true,
          rows: [
            { id: 'pg1', type: 'trace', text: 'The quick brown fox jumps' },
            { id: 'pg2', type: 'blank', text: '' },
            { id: 'pg3', type: 'trace', text: 'over the lazy dog near the river.' },
            { id: 'pg4', type: 'blank', text: '' },
            { id: 'pg5', type: 'trace', text: 'Pack my box with five dozen jugs.' },
            { id: 'pg6', type: 'blank', text: '' },
            { id: 'pg7', type: 'trace', text: 'Sphinx of black quartz, judge my vow.' },
            { id: 'pg8', type: 'blank', text: '' },
          ],
        },
      ],
    },
    {
      id: 'page-2',
      pageNumber: 2,
      sections: [
        {
          id: 'sec-p2',
          title: 'Part 2: Literary Invocations & Free Practice',
          showTitle: true,
          rows: [
            { id: 'pg9', type: 'trace', text: 'Jackdaws love my big sphinx of quartz.' },
            { id: 'pg10', type: 'blank', text: '' },
            { id: 'pg11', type: 'trace', text: 'How vexingly quick daft zebras jump!' },
            { id: 'pg12', type: 'blank', text: '' },
            { id: 'pg13', type: 'model', text: 'To write beautifully is to think clearly.' },
            { id: 'pg14', type: 'blank', text: '' },
            { id: 'pg15', type: 'blank', text: '' },
          ],
        },
      ],
    },
  ],
  createdAt: 1731670200000,
  updatedAt: 1731670200000,
};

export const BLANK_DRILLS_TEMPLATE: Worksheet = {
  id: 'blank-drills',
  title: 'Calligraphy Practice & Warm-up Grid',
  showTitle: true,
  header: {
    showName: true,
    nameLabel: 'Calligrapher: ___________________',
    showGrade: false,
    gradeLabel: 'Grade: ______',
    showDate: true,
    dateLabel: 'Date: ____________',
    showScore: false,
    scoreLabel: 'Score: ______',
  },
  guidelines: {
    rowHeight: 70,
    midlinePosition: 30,
    baselinePosition: 54,
    topLineColor: '#a1a1aa',
    topLineStyle: 'solid',
    topLineWidth: 1,
    midLineColor: '#93c5fd',
    midLineStyle: 'dashed',
    midLineWidth: 2,
    baselineColor: '#e11d48',
    baselineStyle: 'solid',
    baselineWidth: 2,
    bottomLineColor: '#a1a1aa',
    bottomLineStyle: 'solid',
    bottomLineWidth: 1,
    slantEnabled: true,
    slantAngle: 55,
    slantSpacing: 25,
    slantColor: '#cbd5e1',
    slantOpacity: 0.6,
    slantWidth: 1,
  },
  typography: {
    fontFamily: '"Alex Brush", cursive',
    fontFamilyName: 'Alex Brush',
    fontSize: 42,
    letterSpacing: 4,
    textOffsetBottom: 14,
    textColor: '#0f172a',
    traceColor: '#cbd5e1',
    traceStyle: 'solid',
  },
  layout: {
    paperSize: 'a4',
    orientation: 'portrait',
    gapBetweenRows: 24,
    sectionGap: 20,
    showPageNumber: true,
  },
  pages: [
    {
      id: 'page-1',
      pageNumber: 1,
      sections: [
        {
          id: 'sec-b1',
          title: 'Daily Calligraphy Drill Lines (55° Slant Guide):',
          showTitle: true,
          rows: [
            { id: 'b1', type: 'blank', text: '' },
            { id: 'b2', type: 'blank', text: '' },
            { id: 'b3', type: 'blank', text: '' },
            { id: 'b4', type: 'blank', text: '' },
            { id: 'b5', type: 'blank', text: '' },
            { id: 'b6', type: 'blank', text: '' },
            { id: 'b7', type: 'blank', text: '' },
            { id: 'b8', type: 'blank', text: '' },
          ],
        },
      ],
    },
  ],
  createdAt: 1731670300000,
  updatedAt: 1731670300000,
};

export function getPresetTemplates(lang?: string): Worksheet[] {
  const normalized = (lang || '').toLowerCase();
  const defaultSheet = getDefaultWorksheet(normalized);

  if (normalized.startsWith('pt')) {
    const copperplatePt: Worksheet = {
      ...CALLIGRAPHY_COPPERPLATE_TEMPLATE,
      title: 'Prática de Caligrafia Copperplate',
      header: {
        ...CALLIGRAPHY_COPPERPLATE_TEMPLATE.header,
        nameLabel: 'Nome: ______________________',
        dateLabel: 'Data: ____________',
      },
      pages: [
        {
          id: 'page-1',
          pageNumber: 1,
          sections: [
            {
              id: 'sec-1',
              title: '1. Traços Básicos e Ovais:',
              showTitle: true,
              rows: [
                { id: 'cp1', type: 'trace', text: 'i  u  w  e  c  o  a  d' },
                { id: 'cp2', type: 'blank', text: '' },
                { id: 'cp3', type: 'trace', text: 'm  n  v  x  r  s' },
                { id: 'cp4', type: 'blank', text: '' },
              ],
            },
            {
              id: 'sec-2',
              title: '2. Hastes com Guia de 55°:',
              showTitle: true,
              rows: [
                { id: 'cp5', type: 'trace', text: 'b  h  k  l  t  f' },
                { id: 'cp6', type: 'blank', text: '' },
                { id: 'cp7', type: 'trace', text: 'g  j  p  q  y  z' },
                { id: 'cp8', type: 'blank', text: '' },
              ],
            },
            {
              id: 'sec-3',
              title: '3. Palavras Conectadas e Floreios:',
              showTitle: true,
              rows: [
                { id: 'cp9', type: 'trace', text: 'Caligrafia  Harmonia  Arte' },
                { id: 'cp10', type: 'blank', text: '' },
                { id: 'cp11', type: 'trace', text: 'A prática leva à maestria' },
                { id: 'cp12', type: 'blank', text: '' },
              ],
            },
          ],
        },
      ],
    };

    const pangramsPt: Worksheet = {
      ...PANGRAMS_MULTI_PAGE_TEMPLATE,
      title: 'Pangramas e Citações de Caligrafia',
      header: {
        ...PANGRAMS_MULTI_PAGE_TEMPLATE.header,
        nameLabel: 'Nome: ______________________',
        dateLabel: 'Data: ____________',
      },
      pages: [
        {
          id: 'page-1',
          pageNumber: 1,
          sections: [
            {
              id: 'sec-p1',
              title: 'Parte 1: Pangramas Clássicos do Alfabeto',
              showTitle: true,
              rows: [
                { id: 'pg1', type: 'trace', text: 'Um pequeno jabuti xereta' },
                { id: 'pg2', type: 'blank', text: '' },
                { id: 'pg3', type: 'trace', text: 'viu dez cegonhas felizes na beira do rio.' },
                { id: 'pg4', type: 'blank', text: '' },
                { id: 'pg5', type: 'trace', text: 'Gazeta publica hoje no jornal breve nota.' },
                { id: 'pg6', type: 'blank', text: '' },
                { id: 'pg7', type: 'trace', text: 'Zebras caolhas de Java querem passar pelo fax.' },
                { id: 'pg8', type: 'blank', text: '' },
              ],
            },
          ],
        },
        {
          id: 'page-2',
          pageNumber: 2,
          sections: [
            {
              id: 'sec-p2',
              title: 'Parte 2: Citações Literárias e Prática Livre',
              showTitle: true,
              rows: [
                { id: 'pg9', type: 'trace', text: 'Juiz faz com que dois pivetes fechem o livro.' },
                { id: 'pg10', type: 'blank', text: '' },
                { id: 'pg11', type: 'trace', text: 'Vitor viu que o táxi bateu na frágil charrete.' },
                { id: 'pg12', type: 'blank', text: '' },
                { id: 'pg13', type: 'model', text: 'Escrever com harmonia é pensar com clareza.' },
                { id: 'pg14', type: 'blank', text: '' },
                { id: 'pg15', type: 'blank', text: '' },
              ],
            },
          ],
        },
      ],
    };

    const drillsPt: Worksheet = {
      ...BLANK_DRILLS_TEMPLATE,
      title: 'Aquecimento e Treino de Caligrafia',
      header: {
        ...BLANK_DRILLS_TEMPLATE.header,
        nameLabel: 'Calígrafo(a): ___________________',
        dateLabel: 'Data: ____________',
      },
      pages: [
        {
          id: 'page-1',
          pageNumber: 1,
          sections: [
            {
              id: 'sec-b1',
              title: 'Linhas Diárias de Caligrafia (Guia de 55°):',
              showTitle: true,
              rows: BLANK_DRILLS_TEMPLATE.pages[0].sections[0].rows,
            },
          ],
        },
      ],
    };

    return [defaultSheet, copperplatePt, pangramsPt, drillsPt];
  }

  if (normalized.startsWith('es')) {
    const copperplateEs: Worksheet = {
      ...CALLIGRAPHY_COPPERPLATE_TEMPLATE,
      title: 'Práctica de Caligrafía Copperplate',
      header: {
        ...CALLIGRAPHY_COPPERPLATE_TEMPLATE.header,
        nameLabel: 'Nombre: ______________________',
        dateLabel: 'Fecha: ____________',
      },
      pages: [
        {
          id: 'page-1',
          pageNumber: 1,
          sections: [
            {
              id: 'sec-1',
              title: '1. Trazos Básicos y Ovales:',
              showTitle: true,
              rows: [
                { id: 'cp1', type: 'trace', text: 'i  u  w  e  c  o  a  d' },
                { id: 'cp2', type: 'blank', text: '' },
                { id: 'cp3', type: 'trace', text: 'm  n  v  x  r  s' },
                { id: 'cp4', type: 'blank', text: '' },
              ],
            },
            {
              id: 'sec-2',
              title: '2. Trazos con Guía de 55°:',
              showTitle: true,
              rows: [
                { id: 'cp5', type: 'trace', text: 'b  h  k  l  t  f' },
                { id: 'cp6', type: 'blank', text: '' },
                { id: 'cp7', type: 'trace', text: 'g  j  p  q  y  z' },
                { id: 'cp8', type: 'blank', text: '' },
              ],
            },
            {
              id: 'sec-3',
              title: '3. Palabras Conectadas y Florituras:',
              showTitle: true,
              rows: [
                { id: 'cp9', type: 'trace', text: 'Caligrafía  Armonía  Arte' },
                { id: 'cp10', type: 'blank', text: '' },
                { id: 'cp11', type: 'trace', text: 'La práctica crea la maestría' },
                { id: 'cp12', type: 'blank', text: '' },
              ],
            },
          ],
        },
      ],
    };

    const pangramsEs: Worksheet = {
      ...PANGRAMS_MULTI_PAGE_TEMPLATE,
      title: 'Pangramas y Citas de Caligrafía',
      header: {
        ...PANGRAMS_MULTI_PAGE_TEMPLATE.header,
        nameLabel: 'Nombre: ______________________',
        dateLabel: 'Fecha: ____________',
      },
      pages: [
        {
          id: 'page-1',
          pageNumber: 1,
          sections: [
            {
              id: 'sec-p1',
              title: 'Parte 1: Pangramas Clásicos del Alfabeto',
              showTitle: true,
              rows: [
                { id: 'pg1', type: 'trace', text: 'El veloz murciélago hindú' },
                { id: 'pg2', type: 'blank', text: '' },
                { id: 'pg3', type: 'trace', text: 'comía feliz cardillo y kiwi bajo la lluvia.' },
                { id: 'pg4', type: 'blank', text: '' },
                { id: 'pg5', type: 'trace', text: 'Jovencillo emponzoñado de whisky, ¡qué figurota!' },
                { id: 'pg6', type: 'blank', text: '' },
                { id: 'pg7', type: 'trace', text: 'Exhiban rápido la pequeña joya de cuarzo fino.' },
                { id: 'pg8', type: 'blank', text: '' },
              ],
            },
          ],
        },
        {
          id: 'page-2',
          pageNumber: 2,
          sections: [
            {
              id: 'sec-p2',
              title: 'Parte 2: Citas Literarias y Práctica Libre',
              showTitle: true,
              rows: [
                { id: 'pg9', type: 'trace', text: 'Cada vez que viajo en taxi veo un perro feliz.' },
                { id: 'pg10', type: 'blank', text: '' },
                { id: 'pg11', type: 'trace', text: 'Benjamín pidió una copa de coñac con hielo extra.' },
                { id: 'pg12', type: 'blank', text: '' },
                { id: 'pg13', type: 'model', text: 'Escribir con armonía es pensar con claridad.' },
                { id: 'pg14', type: 'blank', text: '' },
                { id: 'pg15', type: 'blank', text: '' },
              ],
            },
          ],
        },
      ],
    };

    const drillsEs: Worksheet = {
      ...BLANK_DRILLS_TEMPLATE,
      title: 'Calentamiento y Práctica de Caligrafía',
      header: {
        ...BLANK_DRILLS_TEMPLATE.header,
        nameLabel: 'Calígrafo(a): ___________________',
        dateLabel: 'Fecha: ____________',
      },
      pages: [
        {
          id: 'page-1',
          pageNumber: 1,
          sections: [
            {
              id: 'sec-b1',
              title: 'Líneas Diarias de Práctica (Guía de 55°):',
              showTitle: true,
              rows: BLANK_DRILLS_TEMPLATE.pages[0].sections[0].rows,
            },
          ],
        },
      ],
    };

    return [defaultSheet, copperplateEs, pangramsEs, drillsEs];
  }

  return [
    defaultSheet,
    CALLIGRAPHY_COPPERPLATE_TEMPLATE,
    PANGRAMS_MULTI_PAGE_TEMPLATE,
    BLANK_DRILLS_TEMPLATE,
  ];
}

export const PRESET_TEMPLATES: Worksheet[] = [
  ORIGINAL_WORKSHEET_TEMPLATE,
  CALLIGRAPHY_COPPERPLATE_TEMPLATE,
  PANGRAMS_MULTI_PAGE_TEMPLATE,
  BLANK_DRILLS_TEMPLATE,
];
