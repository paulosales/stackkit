/**
 * Splits text into lines given an approximate max character limit
 */
export function wrapTextIntoLines(text: string, maxCharsPerLine = 35): string[] {
  if (!text) return [''];
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Generate alphabet pairs list
 * e.g., ["Aa Bb Cc Dd Ee Ff Gg Hh", "Ii Jj Kk Ll Mm Nn Oo Pp", "Qq Rr Ss Tt Uu Vv Ww Xx", "Yy Zz"]
 */
export function generateAlphabetPairs(chunkSize = 8): string[] {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pairs: string[] = [];
  for (let i = 0; i < letters.length; i += chunkSize) {
    const chunk = letters.slice(i, i + chunkSize);
    const line = chunk
      .split('')
      .map((char) => `${char}${char.toLowerCase()}`)
      .join(' ');
    pairs.push(line);
  }
  return pairs;
}

/**
 * Generate repeated character or word across a line
 */
export function repeatWord(word: string, count = 6, separator = '   '): string {
  if (!word) return '';
  return Array(count).fill(word).join(separator);
}

/**
 * Common English calligraphy sample sentences & pangrams
 */
export const SAMPLE_PANGRAMS_EN = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'Sphinx of black quartz, judge my vow.',
  'How vexingly quick daft zebras jump!',
  'Bright vixens jump; dozy fowl quack.',
  'Jackdaws love my big sphinx of quartz.',
  'The five boxing wizards jump quickly.',
  'Woven silk pyjamas exchanged for blue quartz.',
  'Crazy Fredrick bought many very exquisite opal jewels.',
  'Practice makes progress, patience brings perfection.',
];

/**
 * Portuguese calligraphy sample sentences & pangrams
 */
export const SAMPLE_PANGRAMS_PT = [
  'Um pequeno jabuti xereta viu dez cegonhas felizes.',
  'Gazeta publica hoje no jornal breve nota de faxina na quermesse.',
  'Juiz faz com que dois pivetes de boca fechem o livro.',
  'À noite, vovô Kowalsky vê o ímã cair no pé do pinguim queixoso.',
  'Zebras caolhas de Java querem passar pelo fax do meu avô.',
  'Vitor viu que o táxi do bispo quase bateu na frágil charrete.',
  'Grave juiz fixa no quarto de banho o polvilho de xampu.',
  'Pangrama rápido com belas letras traz exímia perfeição.',
  'A prática constante leva à caligrafia harmoniosa.',
  'Escrever com calma e ritmo transforma o pensamento em arte.',
];

/**
 * Spanish calligraphy sample sentences & pangrams
 */
export const SAMPLE_PANGRAMS_ES = [
  'El veloz murciélago hindú comía feliz cardillo y kiwi.',
  'El pingüino Wenceslao hizo kilómetros bajo exhaustiva lluvia y frío.',
  'Jovencillo emponzoñado de whisky, ¡qué figurota exhibes!',
  'Exhiban rápido la pequeña joya de cuarzo fino y brillante.',
  'Cada vez que viajo en taxi veo un perro gris jugando feliz.',
  'Benjamín pidió una copa de coñac fino con hielo extra.',
  'Quiero ver la pequeña choza con jazmines de mi abuela.',
  'Un gato rubio saltó con rapidez y atrapó un pez en el estanque.',
  'La práctica paciente perfecciona el trazo de cada letra.',
  'Escribir con ritmo y elegancia calma la mente.',
];

/**
 * Get sample pangrams according to the active language
 */
export function getSamplePangrams(lang?: string): string[] {
  const normalized = (lang || '').toLowerCase();
  if (normalized.startsWith('pt')) return SAMPLE_PANGRAMS_PT;
  if (normalized.startsWith('es')) return SAMPLE_PANGRAMS_ES;
  return SAMPLE_PANGRAMS_EN;
}

export const SAMPLE_PANGRAMS = SAMPLE_PANGRAMS_EN;
