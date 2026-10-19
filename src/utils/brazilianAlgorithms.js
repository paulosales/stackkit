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
