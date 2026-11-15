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
      .map(char => `${char}${char.toLowerCase()}`)
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
 * Common calligraphy sample sentences & pangrams
 */
export const SAMPLE_PANGRAMS = [
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
