// Formatting and conversion engines: JSON, XML, SQL, C#, CSV, YAML, Cron

/**
 * Format JSON with error reporting and optional alphabetizing
 */
export function formatJson(input, indent = 2, alphabetize = false) {
  if (!input || !input.trim()) return '';
  let parsed = JSON.parse(input);

  if (alphabetize) {
    parsed = sortKeys(parsed);
  }

  const space = indent === 'tab' ? '\t' : Number(indent);
  return JSON.stringify(parsed, null, space);
}

function sortKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = sortKeys(obj[key]);
        return result;
      }, {});
  }
  return obj;
}

export function minifyJson(input) {
  if (!input || !input.trim()) return '';
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

/**
 * Format XML with customizable indentation
 */
export function formatXml(xml, indent = 2) {
  if (!xml || !xml.trim()) return '';

  const spaceStr = indent === 'tab' ? '\t' : ' '.repeat(Number(indent));
  const cleanXml = xml.replace(/>\s*</g, '><').trim();

  const reg = /(>)(<)(\/*)/g;
  const xmlWithNewlines = cleanXml.replace(reg, '$1\r\n$2$3');
  const lines = xmlWithNewlines.split('\r\n');

  let pad = 0;
  let formatted = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    let indentModifier = 0;

    // Check if closing tag
    if (line.match(/^<\/\w/)) {
      pad = Math.max(0, pad - 1);
    } else if (line.match(/^<\w[^>]*[^\/]>.*$/) && !line.match(/^<\w[^>]*\/>/)) {
      // Opening tag that doesn't self-close or close on same line
      const openingTagMatch = line.match(/^<(\w+)/);
      if (openingTagMatch) {
        const tagName = openingTagMatch[1];
        const hasClosingOnSameLine = new RegExp(`</${tagName}>$`).test(line);
        if (!hasClosingOnSameLine) {
          indentModifier = 1;
        }
      }
    }

    formatted += spaceStr.repeat(pad) + line + '\n';
    pad += indentModifier;
  }

  return formatted.trim();
}

export function minifyXml(xml) {
  if (!xml) return '';
  return xml.replace(/>\s*</g, '><').replace(/[\r\n\t]+/g, ' ').trim();
}

/**
 * Format SQL query
 */
export function formatSql(sql, uppercaseKeywords = true) {
  if (!sql || !sql.trim()) return '';

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'GROUP BY',
    'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'VALUES',
    'INSERT INTO', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE',
    'ALTER TABLE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS', 'IN', 'NOT IN',
    'EXISTS', 'NOT EXISTS', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL', 'ASC', 'DESC'
  ];

  let formatted = sql.trim();

  // Keyword casing
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, uppercaseKeywords ? kw.toUpperCase() : kw.toLowerCase());
  });

  // Break lines before major clauses
  const majorClauses = [
    'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'FULL JOIN', 'CROSS JOIN', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING',
    'LIMIT', 'UNION ALL', 'UNION', 'VALUES', 'SET'
  ];

  majorClauses.forEach(clause => {
    const regex = new RegExp(`\\s+(${clause})\\b`, 'gi');
    formatted = formatted.replace(regex, '\n$1');
  });

  // Break subclauses
  const subClauses = ['AND', 'OR'];
  subClauses.forEach(sub => {
    const regex = new RegExp(`\\s+(${sub})\\b`, 'gi');
    formatted = formatted.replace(regex, '\n  $1');
  });

  return formatted.trim();
}

/**
 * Convert JSON to C# classes
 */
export function jsonToCSharp(jsonStr, { rootClassName = 'RootObject', attribute = 'system.text', nullable = true } = {}) {
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('JSON inválido');
  }

  const classes = new Map();

  function toPascalCase(str) {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, match => match.toUpperCase()) || 'Property';
  }

  function getType(val, propName) {
    if (val === null || val === undefined) {
      return nullable ? 'object?' : 'object';
    }
    if (typeof val === 'boolean') return 'bool';
    if (typeof val === 'number') {
      return Number.isInteger(val) ? 'int' : 'double';
    }
    if (typeof val === 'string') {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) return 'DateTime';
      return nullable ? 'string?' : 'string';
    }
    if (Array.isArray(val)) {
      if (val.length === 0) return nullable ? 'List<object>?' : 'List<object>';
      const elemType = getType(val[0], propName.replace(/s$/, ''));
      return nullable ? `List<${elemType}>?` : `List<${elemType}>`;
    }
    if (typeof val === 'object') {
      const subClassName = toPascalCase(propName);
      processObject(val, subClassName);
      return nullable ? `${subClassName}?` : subClassName;
    }
    return 'object';
  }

  function processObject(obj, className) {
    if (classes.has(className)) return;

    const props = [];
    for (const key of Object.keys(obj)) {
      const propPascal = toPascalCase(key);
      const propType = getType(obj[key], key);

      let attrLine = '';
      if (attribute === 'system.text') {
        attrLine = `    [JsonPropertyName("${key}")]\n`;
      } else if (attribute === 'newtonsoft') {
        attrLine = `    [JsonProperty("${key}")]\n`;
      }

      props.push(`${attrLine}    public ${propType} ${propPascal} { get; set; }`);
    }

    const classDefinition = `public class ${className}\n{\n${props.join('\n\n')}\n}`;
    classes.set(className, classDefinition);
  }

  if (Array.isArray(parsed)) {
    if (parsed.length > 0 && typeof parsed[0] === 'object') {
      processObject(parsed[0], rootClassName);
    } else {
      return `// O JSON raiz é um array primitivo: List<${typeof parsed[0] || 'object'}>`;
    }
  } else if (typeof parsed === 'object' && parsed !== null) {
    processObject(parsed, rootClassName);
  } else {
    return '// O JSON deve ser um objeto ou lista de objetos para gerar classes C#';
  }

  const usings = attribute === 'system.text'
    ? 'using System;\nusing System.Collections.Generic;\nusing System.Text.Json.Serialization;\n\n'
    : attribute === 'newtonsoft'
    ? 'using System;\nusing System.Collections.Generic;\nusing Newtonsoft.Json;\n\n'
    : 'using System;\nusing System.Collections.Generic;\n\n';

  return usings + Array.from(classes.values()).join('\n\n');
}

/**
 * CSV to JSON
 */
export function csvToJson(csv, delimiter = ',') {
  if (!csv || !csv.trim()) return '[]';

  const lines = csv.trim().split(/\r\n|\n|\r/);
  if (lines.length < 1) return '[]';

  const parseLine = line => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseLine(line);
    const obj = {};

    headers.forEach((header, index) => {
      let val = values[index] !== undefined ? values[index].trim() : '';
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (val !== '' && !isNaN(Number(val))) val = Number(val);
      obj[header] = val;
    });

    rows.push(obj);
  }

  return JSON.stringify(rows, null, 2);
}

/**
 * JSON to CSV
 */
export function jsonToCsv(jsonStr, delimiter = ',') {
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('JSON inválido');
  }

  if (!Array.isArray(parsed)) {
    if (typeof parsed === 'object' && parsed !== null) {
      parsed = [parsed];
    } else {
      throw new Error('JSON deve ser um array de objetos para converter em CSV');
    }
  }

  if (parsed.length === 0) return '';

  const headers = Array.from(new Set(parsed.flatMap(item => Object.keys(item || {}))));

  const escapeVal = val => {
    if (val === null || val === undefined) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [headers.join(delimiter)];
  for (const item of parsed) {
    const row = headers.map(header => escapeVal(item[header]));
    csvRows.push(row.join(delimiter));
  }

  return csvRows.join('\n');
}

/**
 * Lightweight JSON to YAML
 */
export function jsonToYaml(jsonStr) {
  let obj;
  try {
    obj = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('JSON inválido');
  }

  function dump(value, indent = 0) {
    const space = '  '.repeat(indent);

    if (value === null || value === undefined) return 'null';
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') {
      if (value.includes('\n') || value.includes(': ') || value.startsWith('@') || value.startsWith('#')) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value || '""';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      return value.map(item => {
        if (typeof item === 'object' && item !== null) {
          const itemDump = dump(item, indent + 1);
          return `${space}- ${itemDump.trimStart()}`;
        }
        return `${space}- ${dump(item, indent + 1)}`;
      }).join('\n');
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return '{}';
      return keys.map(k => {
        const val = value[k];
        if (typeof val === 'object' && val !== null && (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0)) {
          return `${space}${k}:\n${dump(val, indent + 1)}`;
        }
        return `${space}${k}: ${dump(val, indent + 1)}`;
      }).join('\n');
    }

    return String(value);
  }

  return dump(obj);
}

/**
 * Lightweight YAML to JSON
 */
export function yamlToJson(yamlStr) {
  if (!yamlStr || !yamlStr.trim()) return '{}';

  // Basic YAML parse supporting key-value, lists, indentation
  const lines = yamlStr.split('\n');
  const root = {};
  const stack = [{ indent: -1, obj: root, isArray: false }];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;

    const indent = rawLine.search(/\S/);
    const line = rawLine.trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    const current = stack[stack.length - 1];

    if (line.startsWith('- ')) {
      // List item
      const valStr = line.slice(2).trim();
      let parsedVal = valStr;
      if (valStr.startsWith('"') && valStr.endsWith('"')) parsedVal = valStr.slice(1, -1);
      else if (valStr === 'true') parsedVal = true;
      else if (valStr === 'false') parsedVal = false;
      else if (valStr === 'null') parsedVal = null;
      else if (!isNaN(Number(valStr)) && valStr !== '') parsedVal = Number(valStr);

      if (!Array.isArray(current.obj)) {
        // If current wasn't marked array, convert parent target
      }
    } else if (line.includes(':')) {
      const colonIdx = line.indexOf(':');
      const key = line.slice(0, colonIdx).trim().replace(/^["']|["']$/g, '');
      const rest = line.slice(colonIdx + 1).trim();

      if (!rest) {
        // New nested object or array
        const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
        const isNextList = nextLine.startsWith('- ');
        const newChild = isNextList ? [] : {};
        current.obj[key] = newChild;
        stack.push({ indent, obj: newChild, isArray: isNextList });
      } else {
        let val = rest;
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        else if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (val === 'null') val = null;
        else if (!isNaN(Number(val)) && val !== '') val = Number(val);
        current.obj[key] = val;
      }
    }
  }

  return JSON.stringify(root, null, 2);
}

/**
 * Human readable Cron Explainer (Portuguese)
 */
export function explainCron(cronStr) {
  if (!cronStr || !cronStr.trim()) {
    return { valid: false, message: 'Expressão cron vazia' };
  }

  const parts = cronStr.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, message: `Cron deve conter 5 partes: minuto hora dia_do_mês mês dia_da_semana (recebeu ${parts.length})` };
  }

  const [min, hour, dom, month, dow] = parts;

  const monthNames = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  let desc = '';

  // Minutes description
  if (min === '*' && hour === '*') {
    desc = 'A cada minuto';
  } else if (min.startsWith('*/')) {
    const step = min.replace('*/', '');
    desc = `A cada ${step} minutos`;
  } else if (min === '0' && hour === '*') {
    desc = 'No início de cada hora';
  } else if (hour !== '*' && min !== '*') {
    desc = `Às ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;
  } else {
    desc = `No minuto ${min}`;
  }

  // Days of week
  if (dow !== '*') {
    if (dow === '1-5') {
      desc += ', de segunda a sexta-feira';
    } else if (dow === '0,6' || dow === '6,0') {
      desc += ', nos fins de semana';
    } else if (!isNaN(Number(dow))) {
      desc += `, todo(a) ${dayNames[Number(dow)] || dow}`;
    } else {
      desc += `, nos dias da semana: ${dow}`;
    }
  }

  // Day of month
  if (dom !== '*') {
    desc += `, no dia ${dom} do mês`;
  }

  // Month
  if (month !== '*') {
    if (!isNaN(Number(month)) && monthNames[Number(month)]) {
      desc += `, apenas em ${monthNames[Number(month)]}`;
    } else {
      desc += `, nos meses: ${month}`;
    }
  }

  return {
    valid: true,
    description: desc,
    parts: {
      minute: min,
      hour: hour,
      dayOfMonth: dom,
      month: month,
      dayOfWeek: dow
    }
  };
}
