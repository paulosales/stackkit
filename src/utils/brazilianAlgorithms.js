// Brazilian algorithm utilities: CPF, CNPJ (numeric & alphanumeric), RG, Credit Card (Luhn), PIX EMV

/**
 * Remove non-alphanumeric characters
 */
export function cleanDocument(val) {
  if (!val) return '';
  return val.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Clean numeric only
 */
export function cleanDigits(val) {
  if (!val) return '';
  return val.replace(/\D/g, '');
}

/**
 * Generate a valid CPF
 * @param {boolean} mask - whether to format as 000.000.000-00
 * @param {number|string|null} originState - 0 to 9 representing regional fiscal state, or null for random
 */
export function generateCPF(mask = true, originState = null) {
  const digits = [];
  for (let i = 0; i < 8; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // 9th digit can define origin state (0: RS; 1: DF, GO, MT, MS, TO; 2: AC, AP, AM, PA, RO, RR; etc.)
  if (originState !== null && originState !== '' && !isNaN(Number(originState))) {
    digits.push(Number(originState) % 10);
  } else {
    digits.push(Math.floor(Math.random() * 10));
  }

  // First verification digit
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += digits[i] * (10 - i);
  }
  let rest1 = sum1 % 11;
  const d1 = rest1 < 2 ? 0 : 11 - rest1;
  digits.push(d1);

  // Second verification digit
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += digits[i] * (11 - i);
  }
  let rest2 = sum2 % 11;
  const d2 = rest2 < 2 ? 0 : 11 - rest2;
  digits.push(d2);

  const raw = digits.join('');
  if (!mask) return raw;
  return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
}

/**
 * Validate a CPF
 * @param {string} cpf
 */
export function validateCPF(cpf) {
  if (!cpf) return { valid: false, message: 'CPF vazio' };
  const clean = cleanDigits(cpf);
  if (clean.length !== 11) {
    return { valid: false, message: `CPF deve ter 11 dígitos (tem ${clean.length})` };
  }

  // Check for repeated sequences (00000000000, 11111111111, etc.)
  if (/^(\d)\1{10}$/.test(clean)) {
    return { valid: false, message: 'CPF com todos os dígitos iguais é inválido' };
  }

  const digits = clean.split('').map(Number);

  // Verify digit 1
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += digits[i] * (10 - i);
  }
  let rest1 = sum1 % 11;
  const expD1 = rest1 < 2 ? 0 : 11 - rest1;
  if (digits[9] !== expD1) {
    return { valid: false, message: 'Primeiro dígito verificador inválido' };
  }

  // Verify digit 2
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += digits[i] * (11 - i);
  }
  let rest2 = sum2 % 11;
  const expD2 = rest2 < 2 ? 0 : 11 - rest2;
  if (digits[10] !== expD2) {
    return { valid: false, message: 'Segundo dígito verificador inválido' };
  }

  const stateMap = {
    0: 'RS',
    1: 'DF, GO, MT, MS, TO',
    2: 'AC, AP, AM, PA, RO, RR',
    3: 'CE, MA, PI',
    4: 'AL, PB, PE, RN',
    5: 'BA, SE',
    6: 'MG',
    7: 'ES, RJ',
    8: 'SP',
    9: 'PR, SC'
  };

  return {
    valid: true,
    message: 'CPF Válido',
    originState: stateMap[digits[8]],
    formatted: `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9, 11)}`
  };
}

/**
 * Generate CNPJ
 * Supports traditional numeric CNPJ and the new 2026 Alphanumeric CNPJ specification
 */
export function generateCNPJ(mask = true, isAlphanumeric = false) {
  const chars = [];
  const alphaPool = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  if (!isAlphanumeric) {
    // 8 root digits
    for (let i = 0; i < 8; i++) {
      chars.push(Math.floor(Math.random() * 10));
    }
    // standard branch 0001
    chars.push(0, 0, 0, 1);
  } else {
    // 8 root characters (letters and numbers)
    for (let i = 0; i < 8; i++) {
      chars.push(alphaPool[Math.floor(Math.random() * alphaPool.length)]);
    }
    // 4 branch characters
    chars.push('0', '0', '0', '1');
  }

  // Calculate verification digits using ASCII code - 48 modulo 11 algorithm
  // Weights for D1: 5,4,3,2,9,8,7,6,5,4,3,2
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    const val = typeof chars[i] === 'string' ? chars[i].toUpperCase().charCodeAt(0) - 48 : chars[i];
    sum1 += val * weights1[i];
  }
  let rest1 = sum1 % 11;
  const d1 = rest1 < 2 ? 0 : 11 - rest1;
  chars.push(d1);

  // Weights for D2: 6,5,4,3,2,9,8,7,6,5,4,3,2
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    const val = typeof chars[i] === 'string' ? chars[i].toUpperCase().charCodeAt(0) - 48 : chars[i];
    sum2 += val * weights2[i];
  }
  let rest2 = sum2 % 11;
  const d2 = rest2 < 2 ? 0 : 11 - rest2;
  chars.push(d2);

  const raw = chars.join('');
  if (!mask) return raw;
  return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}/${raw.slice(8, 12)}-${raw.slice(12, 14)}`;
}

/**
 * Validate CNPJ (numeric or alphanumeric)
 */
export function validateCNPJ(cnpj) {
  if (!cnpj) return { valid: false, message: 'CNPJ vazio' };
  const clean = cleanDocument(cnpj).toUpperCase();

  if (clean.length !== 14) {
    return { valid: false, message: `CNPJ deve ter 14 caracteres (tem ${clean.length})` };
  }

  const isAlpha = /[A-Z]/.test(clean.slice(0, 12));

  // Numeric verification
  if (!isAlpha) {
    if (/^(\d)\1{13}$/.test(clean)) {
      return { valid: false, message: 'CNPJ com dígitos repetidos é inválido' };
    }
  }

  const chars = clean.split('');
  // Check verification digits: last 2 MUST be digits
  if (!/^\d{2}$/.test(clean.slice(12, 14))) {
    return { valid: false, message: 'Os dois últimos caracteres do CNPJ devem ser numéricos' };
  }

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    const val = chars[i].charCodeAt(0) - 48;
    sum1 += val * weights1[i];
  }
  let rest1 = sum1 % 11;
  const expD1 = rest1 < 2 ? 0 : 11 - rest1;
  if (Number(chars[12]) !== expD1) {
    return { valid: false, message: 'Primeiro dígito verificador do CNPJ inválido' };
  }

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    const val = chars[i].charCodeAt(0) - 48;
    sum2 += val * weights2[i];
  }
  let rest2 = sum2 % 11;
  const expD2 = rest2 < 2 ? 0 : 11 - rest2;
  if (Number(chars[13]) !== expD2) {
    return { valid: false, message: 'Segundo dígito verificador do CNPJ inválido' };
  }

  return {
    valid: true,
    message: isAlpha ? 'CNPJ Alfanumérico Válido' : 'CNPJ Válido',
    isAlphanumeric: isAlpha,
    formatted: `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12, 14)}`
  };
}

/**
 * Generate a valid RG (SSP-SP pattern)
 */
export function generateRG(mask = true) {
  const digits = [];
  for (let i = 0; i < 8; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Weights 2,3,4,5,6,7,8,9
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * (i + 2);
  }
  const rest = sum % 11;
  const d = rest === 10 ? 'X' : (rest === 0 ? '0' : String(11 - rest));
  const raw = `${digits.join('')}${d}`;

  if (!mask) return raw;
  return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}-${raw.slice(8)}`;
}

/**
 * Validate RG (SSP-SP pattern)
 */
export function validateRG(rg) {
  if (!rg) return { valid: false, message: 'RG vazio' };
  const clean = cleanDocument(rg).toUpperCase();
  if (clean.length !== 9) {
    return { valid: false, message: `RG deve ter 9 caracteres (tem ${clean.length})` };
  }

  const digits = clean.slice(0, 8).split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * (i + 2);
  }
  const rest = sum % 11;
  const expD = rest === 10 ? 'X' : (rest === 0 ? '0' : String(11 - rest));

  if (clean[8] !== expD) {
    return { valid: false, message: `Dígito verificador inválido (esperado: ${expD})` };
  }

  return {
    valid: true,
    message: 'RG Válido (SSP-SP)',
    formatted: `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}-${clean.slice(8)}`
  };
}

/**
 * Luhn Algorithm check for Credit Card numbers
 */
export function validateLuhn(cardNumber) {
  const digits = cleanDigits(cardNumber);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

/**
 * Generate test credit card by brand
 */
export function generateCreditCard(brand = 'visa') {
  let bin = '4';
  let length = 16;

  switch (brand.toLowerCase()) {
    case 'mastercard':
      bin = ['51', '52', '53', '54', '55'][Math.floor(Math.random() * 5)];
      length = 16;
      break;
    case 'amex':
      bin = ['34', '37'][Math.floor(Math.random() * 2)];
      length = 15;
      break;
    case 'elo':
      bin = ['401178', '438935', '504175', '636297'][Math.floor(Math.random() * 4)];
      length = 16;
      break;
    case 'hipercard':
      bin = ['606282', '384100'][Math.floor(Math.random() * 2)];
      length = 16;
      break;
    case 'discover':
      bin = '6011';
      length = 16;
      break;
    case 'visa':
    default:
      bin = '4';
      length = 16;
      break;
  }

  const digits = bin.split('').map(Number);
  while (digits.length < length - 1) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Calculate check digit with Luhn
  let sum = 0;
  let alternate = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits[i];
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  digits.push(checkDigit);

  // Generate expiration date (1 to 5 years from now)
  const now = new Date();
  const expMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const expYear = String((now.getFullYear() % 100) + Math.floor(Math.random() * 5) + 1).padStart(2, '0');
  const cvv = brand === 'amex'
    ? String(Math.floor(Math.random() * 9000) + 1000)
    : String(Math.floor(Math.random() * 900) + 100);

  const rawNumber = digits.join('');
  let formattedNumber = rawNumber;
  if (length === 15) {
    // 4-6-5 format for Amex
    formattedNumber = `${rawNumber.slice(0, 4)} ${rawNumber.slice(4, 10)} ${rawNumber.slice(10)}`;
  } else {
    // 4-4-4-4 format
    formattedNumber = rawNumber.replace(/(\d{4})/g, '$1 ').trim();
  }

  return {
    number: formattedNumber,
    rawNumber,
    brand: brand.toUpperCase(),
    expMonth,
    expYear,
    expiration: `${expMonth}/${expYear}`,
    cvv,
    holderName: 'CLIENTE TESTE STACKKIT'
  };
}

/**
 * Detect brand from number
 */
export function detectCreditCardBrand(number) {
  const clean = cleanDigits(number);
  if (/^4/.test(clean)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
  if (/^3[47]/.test(clean)) return 'AMEX';
  if (/^(4011|4389|5041|6362)/.test(clean)) return 'ELO';
  if (/^(6062|3841)/.test(clean)) return 'HIPERCARD';
  if (/^6011/.test(clean)) return 'DISCOVER';
  return 'DESCONHECIDO';
}

/**
 * Standard CRC16-CCITT for PIX EMV
 */
export function crc16CCITT(str) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Format TLV (Tag-Length-Value) entry
 */
function formatTLV(tag, value) {
  if (value === undefined || value === null) return '';
  const valStr = String(value);
  const len = String(valStr.length).padStart(2, '0');
  return `${tag}${len}${valStr}`;
}

/**
 * Strip Brazilian accents for EMV compatibility
 */
export function normalizeText(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

/**
 * Generate standard PIX Copia e Cola payload
 */
export function generatePixPayload({
  pixKey,
  keyType = 'cpf',
  merchantName = 'STACKKIT',
  merchantCity = 'SAO PAULO',
  amount = '',
  txId = '***',
  description = ''
}) {
  let cleanKey = pixKey ? pixKey.trim() : '';
  if (keyType === 'cpf' || keyType === 'cnpj') {
    cleanKey = cleanDigits(cleanKey);
  } else if (keyType === 'telefone') {
    cleanKey = cleanKey.replace(/\D/g, '');
    if (!cleanKey.startsWith('55') && cleanKey.length >= 10) {
      cleanKey = `+55${cleanKey}`;
    } else if (!cleanKey.startsWith('+')) {
      cleanKey = `+${cleanKey}`;
    }
  }

  const normName = normalizeText(merchantName || 'RECEBEDOR').slice(0, 25);
  const normCity = normalizeText(merchantCity || 'BRASIL').slice(0, 15);
  const cleanTxId = (txId ? txId.replace(/[^a-zA-Z0-9]/g, '') : '***').slice(0, 25) || '***';

  // 26 Merchant Account Info
  let merchantAccountInfo = formatTLV('00', 'br.gov.bcb.pix') + formatTLV('01', cleanKey);
  if (description) {
    merchantAccountInfo += formatTLV('02', normalizeText(description).slice(0, 40));
  }

  let payload = '';
  // 00 Payload Format Indicator
  payload += formatTLV('00', '01');
  // 01 Point of Initiation Method (12 = dynamic QR, 11 = static QR)
  payload += formatTLV('01', '12');
  // 26 Merchant Account Information
  payload += formatTLV('26', merchantAccountInfo);
  // 52 Merchant Category Code
  payload += formatTLV('52', '0000');
  // 53 Transaction Currency (986 = BRL)
  payload += formatTLV('53', '986');

  // 54 Transaction Amount
  if (amount && Number(amount) > 0) {
    const formattedAmount = Number(amount).toFixed(2);
    payload += formatTLV('54', formattedAmount);
  }

  // 58 Country Code
  payload += formatTLV('58', 'BR');
  // 59 Merchant Name
  payload += formatTLV('59', normName);
  // 60 Merchant City
  payload += formatTLV('60', normCity);

  // 62 Additional Data Field Template
  const additionalData = formatTLV('05', cleanTxId);
  payload += formatTLV('62', additionalData);

  // 63 CRC16 prefix
  payload += '6304';
  const checksum = crc16CCITT(payload);
  return `${payload}${checksum}`;
}

// -------------------------------------------------------------
// NÚMERO DO BENEFÍCIO (NB) - INSS
// -------------------------------------------------------------

/**
 * Format raw NB into 000.000.000-0
 * @param {string|number} nb 
 */
export function formatNB(nb) {
  if (!nb) return '';
  let clean = String(nb).replace(/\D/g, '');
  while (clean.length < 10) {
    clean = '0' + clean;
  }
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9, 10)}`;
}

/**
 * Generate a valid INSS Benefit Number (NB)
 * Uses Modulo 11 with weights [2, 9, 8, 7, 6, 5, 4, 3, 2]
 * @param {boolean} mask - format as 000.000.000-0
 */
export function generateNB(mask = true) {
  const pesos = [2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digits = [];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    const d = Math.floor(Math.random() * 10);
    digits.push(d);
    sum += d * pesos[i];
  }

  let dv = sum % 11;
  if (dv === 0 || dv === 1) {
    dv = 0;
  } else {
    dv = 11 - dv;
  }

  digits.push(dv);
  const raw = digits.join('');
  return mask ? formatNB(raw) : raw;
}

/**
 * Validate an INSS Benefit Number (NB)
 * @param {string} nb 
 */
export function validateNB(nb) {
  if (!nb) return { valid: false, message: 'Número do Benefício vazio' };
  const clean = cleanDigits(nb);
  if (clean.length !== 10) {
    return { valid: false, message: `O NB deve conter 10 dígitos (encontrados ${clean.length})` };
  }

  const digits = clean.split('').map(Number);
  const pesos = [2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += digits[i] * pesos[i];
  }

  let expectedDv = sum % 11;
  if (expectedDv === 0 || expectedDv === 1) {
    expectedDv = 0;
  } else {
    expectedDv = 11 - expectedDv;
  }

  if (digits[9] !== expectedDv) {
    return {
      valid: false,
      message: `Dígito verificador inválido: esperado ${expectedDv}, encontrado ${digits[9]}`
    };
  }

  return {
    valid: true,
    message: 'Número do Benefício (NB) válido',
    details: {
      sequence: clean.slice(0, 9),
      dv: digits[9],
      formatted: formatNB(clean)
    }
  };
}

// -------------------------------------------------------------
// NÚMERO DE PROCESSO JUDICIAL UNIFICADO (CNJ) - Resolução 65/2008
// Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
// -------------------------------------------------------------

export const JUSTICE_SEGMENTS = [
  { value: 0, label: 'Qualquer Segmento (Aleatório)', labelEn: 'Any Segment (Random)' },
  { value: 1, label: '1 - STF (Supremo Tribunal Federal)', labelEn: '1 - STF (Supreme Federal Court)' },
  { value: 2, label: '2 - CNJ (Conselho Nacional de Justiça)', labelEn: '2 - CNJ (National Justice Council)' },
  { value: 3, label: '3 - STJ (Superior Tribunal de Justiça)', labelEn: '3 - STJ (Superior Court of Justice)' },
  { value: 4, label: '4 - Justiça Federal (TRF)', labelEn: '4 - Federal Justice (TRF)' },
  { value: 5, label: '5 - Justiça do Trabalho (TRT)', labelEn: '5 - Labor Justice (TRT)' },
  { value: 6, label: '6 - Justiça Eleitoral (TRE)', labelEn: '6 - Electoral Justice (TRE)' },
  { value: 7, label: '7 - Justiça Militar da União (CJM)', labelEn: '7 - Military Justice of the Union' },
  { value: 8, label: '8 - Justiça dos Estados e DF (TJ)', labelEn: '8 - State Justice & DF (TJ)' },
  { value: 9, label: '9 - Justiça Militar Estadual (TJM)', labelEn: '9 - State Military Justice (TJM)' }
];

export const JUSTICE_TRIBUNALS = {
  1: [{ value: 0, label: '00 - STF Único', labelEn: '00 - Single STF' }],
  2: [{ value: 0, label: '00 - CNJ Único', labelEn: '00 - Single CNJ' }],
  3: [{ value: 0, label: '00 - STJ Único', labelEn: '00 - Single STJ' }],
  4: [
    { value: 1, label: '01 - TRF 1ª Região (DF, GO, TO, MT, BA, PI, MA, PA, AM, AC, RO, RR, AP)' },
    { value: 2, label: '02 - TRF 2ª Região (RJ, ES)' },
    { value: 3, label: '03 - TRF 3ª Região (SP, MS)' },
    { value: 4, label: '04 - TRF 4ª Região (RS, PR, SC)' },
    { value: 5, label: '05 - TRF 5ª Região (PE, CE, AL, SE, RN, PB)' },
    { value: 6, label: '06 - TRF 6ª Região (MG)' }
  ],
  5: [
    { value: 1, label: '01 - TRT 1ª Região (RJ)' },
    { value: 2, label: '02 - TRT 2ª Região (SP - Capital/Litoral)' },
    { value: 3, label: '03 - TRT 3ª Região (MG)' },
    { value: 4, label: '04 - TRT 4ª Região (RS)' },
    { value: 5, label: '05 - TRT 5ª Região (BA)' },
    { value: 6, label: '06 - TRT 6ª Região (PE)' },
    { value: 7, label: '07 - TRT 7ª Região (CE)' },
    { value: 8, label: '08 - TRT 8ª Região (PA/AP)' },
    { value: 9, label: '09 - TRT 9ª Região (PR)' },
    { value: 10, label: '10 - TRT 10ª Região (DF/TO)' },
    { value: 11, label: '11 - TRT 11ª Região (AM/RR)' },
    { value: 12, label: '12 - TRT 12ª Região (SC)' },
    { value: 13, label: '13 - TRT 13ª Região (PB)' },
    { value: 14, label: '14 - TRT 14ª Região (RO/AC)' },
    { value: 15, label: '15 - TRT 15ª Região (Campinas/Interior SP)' },
    { value: 16, label: '16 - TRT 16ª Região (MA)' },
    { value: 17, label: '17 - TRT 17ª Região (ES)' },
    { value: 18, label: '18 - TRT 18ª Região (GO)' },
    { value: 19, label: '19 - TRT 19ª Região (AL)' },
    { value: 20, label: '20 - TRT 20ª Região (SE)' },
    { value: 21, label: '21 - TRT 21ª Região (RN)' },
    { value: 22, label: '22 - TRT 22ª Região (PI)' },
    { value: 23, label: '23 - TRT 23ª Região (MT)' },
    { value: 24, label: '24 - TRT 24ª Região (MS)' }
  ],
  6: [
    { value: 1, label: '01 - TRE Acre (AC)' },
    { value: 2, label: '02 - TRE Alagoas (AL)' },
    { value: 3, label: '03 - TRE Amapá (AP)' },
    { value: 4, label: '04 - TRE Amazonas (AM)' },
    { value: 5, label: '05 - TRE Bahia (BA)' },
    { value: 6, label: '06 - TRE Ceará (CE)' },
    { value: 7, label: '07 - TRE Distrito Federal (DF)' },
    { value: 8, label: '08 - TRE Espírito Santo (ES)' },
    { value: 9, label: '09 - TRE Goiás (GO)' },
    { value: 10, label: '10 - TRE Maranhão (MA)' },
    { value: 11, label: '11 - TRE Mato Grosso (MT)' },
    { value: 12, label: '12 - TRE Mato Grosso do Sul (MS)' },
    { value: 13, label: '13 - TRE Minas Gerais (MG)' },
    { value: 14, label: '14 - TRE Pará (PA)' },
    { value: 15, label: '15 - TRE Paraíba (PB)' },
    { value: 16, label: '16 - TRE Paraná (PR)' },
    { value: 17, label: '17 - TRE Pernambuco (PE)' },
    { value: 18, label: '18 - TRE Piauí (PI)' },
    { value: 19, label: '19 - TRE Rio de Janeiro (RJ)' },
    { value: 20, label: '20 - TRE Rio Grande do Norte (RN)' },
    { value: 21, label: '21 - TRE Rio Grande do Sul (RS)' },
    { value: 22, label: '22 - TRE Rondônia (RO)' },
    { value: 23, label: '23 - TRE Roraima (RR)' },
    { value: 24, label: '24 - TRE Santa Catarina (SC)' },
    { value: 25, label: '25 - TRE São Paulo (SP)' },
    { value: 26, label: '26 - TRE Sergipe (SE)' },
    { value: 27, label: '27 - TRE Tocantins (TO)' }
  ],
  7: [
    { value: 1, label: '01 - 1ª CJM (RJ/ES)' },
    { value: 2, label: '02 - 2ª CJM (SP)' },
    { value: 3, label: '03 - 3ª CJM (RS)' },
    { value: 4, label: '04 - 4ª CJM (MG)' },
    { value: 5, label: '05 - 5ª CJM (PR/SC)' },
    { value: 6, label: '06 - 6ª CJM (BA/SE)' },
    { value: 7, label: '07 - 7ª CJM (PE/AL/PB/RN)' },
    { value: 8, label: '08 - 8ª CJM (PA/AP/MA)' },
    { value: 9, label: '09 - 9ª CJM (MS/MT)' },
    { value: 10, label: '10 - 10ª CJM (CE/PI)' },
    { value: 11, label: '11 - 11ª CJM (DF/GO/TO)' },
    { value: 12, label: '12 - 12ª CJM (AM/AC/RO/RR)' }
  ],
  8: [
    { value: 1, label: '01 - TJAC (Acre)' },
    { value: 2, label: '02 - TJAL (Alagoas)' },
    { value: 3, label: '03 - TJAP (Amapá)' },
    { value: 4, label: '04 - TJAM (Amazonas)' },
    { value: 5, label: '05 - TJBA (Bahia)' },
    { value: 6, label: '06 - TJCE (Ceará)' },
    { value: 7, label: '07 - TJDFT (Distrito Federal e Territórios)' },
    { value: 8, label: '08 - TJES (Espírito Santo)' },
    { value: 9, label: '09 - TJGO (Goiás)' },
    { value: 10, label: '10 - TJMA (Maranhão)' },
    { value: 11, label: '11 - TJMT (Mato Grosso)' },
    { value: 12, label: '12 - TJMS (Mato Grosso do Sul)' },
    { value: 13, label: '13 - TJMG (Minas Gerais)' },
    { value: 14, label: '14 - TJPA (Pará)' },
    { value: 15, label: '15 - TJPB (Paraíba)' },
    { value: 16, label: '16 - TJPR (Paraná)' },
    { value: 17, label: '17 - TJPE (Pernambuco)' },
    { value: 18, label: '18 - TJPI (Piauí)' },
    { value: 19, label: '19 - TJRJ (Rio de Janeiro)' },
    { value: 20, label: '20 - TJRN (Rio Grande do Norte)' },
    { value: 21, label: '21 - TJRS (Rio Grande do Sul)' },
    { value: 22, label: '22 - TJRO (Rondônia)' },
    { value: 23, label: '23 - TJRR (Roraima)' },
    { value: 24, label: '24 - TJSC (Santa Catarina)' },
    { value: 25, label: '25 - TJSP (São Paulo)' },
    { value: 26, label: '26 - TJSE (Sergipe)' },
    { value: 27, label: '27 - TJTO (Tocantins)' }
  ],
  9: [
    { value: 13, label: '13 - TJMMG (Minas Gerais)' },
    { value: 21, label: '21 - TJMRS (Rio Grande do Sul)' },
    { value: 26, label: '26 - TJMSP (São Paulo)' }
  ]
};

const padZero = (num, size) => String(num).padStart(size, '0');

/**
 * Calculate CNJ checksum (mod 97)
 */
export function checksumCNJ(sequence, ano, orgao, tribunal, origem) {
  const r1 = Number(sequence) % 97;
  const r2 = Number(`${r1}${padZero(ano, 4)}${orgao}${padZero(tribunal, 2)}`) % 97;
  const r3 = Number(`${r2}${padZero(origem, 4)}00`) % 97;
  return 98 - r3;
}

/**
 * Generate a valid Lawsuit Process Number (CNJ)
 * @param {object} options
 */
export function generateNumeroProcesso(options = {}) {
  const { orgao = 0, tribunal = 0, ano = null, mask = true } = options;

  const sequence = Math.floor(Math.random() * 9999999) + 1;
  const currentYear = new Date().getFullYear();
  const anoAjuizamento = ano && !isNaN(Number(ano)) && Number(ano) >= 1900 && Number(ano) <= 2100
    ? Number(ano)
    : currentYear;

  let orgaoSegmento = Number(orgao);
  if (!orgaoSegmento || orgaoSegmento < 1 || orgaoSegmento > 9) {
    orgaoSegmento = Math.floor(Math.random() * 9) + 1;
  }

  let selectedTribunal = Number(tribunal);
  const possibleTribunals = JUSTICE_TRIBUNALS[orgaoSegmento];
  if (!selectedTribunal && possibleTribunals && possibleTribunals.length) {
    const randomPick = possibleTribunals[Math.floor(Math.random() * possibleTribunals.length)];
    selectedTribunal = randomPick.value;
  } else if (!selectedTribunal) {
    selectedTribunal = 0;
  }

  const origem = Math.floor(Math.random() * 8998) + 1;

  const dv = checksumCNJ(sequence, anoAjuizamento, orgaoSegmento, selectedTribunal, origem);

  const formatted = `${padZero(sequence, 7)}-${padZero(dv, 2)}.${padZero(anoAjuizamento, 4)}.${padZero(orgaoSegmento, 1)}.${padZero(selectedTribunal, 2)}.${padZero(origem, 4)}`;

  return mask ? formatted : formatted.replace(/\D/g, '');
}

/**
 * Format raw 20-digit string into CNJ format NNNNNNN-DD.AAAA.J.TR.OOOO
 * @param {string} val 
 */
export function formatNumeroProcesso(val) {
  if (!val) return '';
  const clean = cleanDigits(val);
  if (clean.length !== 20) return val;
  return `${clean.slice(0, 7)}-${clean.slice(7, 9)}.${clean.slice(9, 13)}.${clean.slice(13, 14)}.${clean.slice(14, 16)}.${clean.slice(16, 20)}`;
}

/**
 * Validate a Lawsuit Process Number (CNJ)
 * @param {string} val 
 */
export function validateNumeroProcesso(val) {
  if (!val) return { valid: false, message: 'Número de processo vazio' };
  const clean = cleanDigits(val);
  if (clean.length !== 20) {
    return { valid: false, message: `O número de processo CNJ deve conter 20 dígitos (encontrados ${clean.length})` };
  }

  const sequence = Number(clean.slice(0, 7));
  const dv = Number(clean.slice(7, 9));
  const ano = Number(clean.slice(9, 13));
  const orgao = Number(clean.slice(13, 14));
  const tribunal = Number(clean.slice(14, 16));
  const origem = Number(clean.slice(16, 20));

  const expectedDv = checksumCNJ(sequence, ano, orgao, tribunal, origem);

  if (dv !== expectedDv) {
    return {
      valid: false,
      message: `Dígito verificador inválido: esperado ${padZero(expectedDv, 2)}, encontrado ${padZero(dv, 2)}`
    };
  }

  const segmentObj = JUSTICE_SEGMENTS.find(s => s.value === orgao);
  const tribunalObj = JUSTICE_TRIBUNALS[orgao]?.find(t => t.value === tribunal);

  return {
    valid: true,
    message: 'Número de processo judicial válido (Padrão CNJ)',
    details: {
      sequence: padZero(sequence, 7),
      dv: padZero(dv, 2),
      ano,
      orgao,
      orgaoName: segmentObj ? segmentObj.label : `Órgão ${orgao}`,
      orgaoNameEn: segmentObj ? segmentObj.labelEn : `Organ ${orgao}`,
      tribunal: padZero(tribunal, 2),
      tribunalName: tribunalObj ? tribunalObj.label : `Tribunal ${tribunal}`,
      origem: padZero(origem, 4),
      formatted: formatNumeroProcesso(clean)
    }
  };
}

