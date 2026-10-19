// Master registry of all developer tools in StackKit DevStudio
// Optimized for SEO with descriptive English slugs and Portuguese alias resolution

export const categories = [
  { id: 'all', name: 'Todas', nameEn: 'All', icon: 'LayoutGrid' },
  { id: 'brazil', name: 'Brasil', nameEn: 'Brazil', icon: 'Flag' },
  { id: 'generators', name: 'Geradores', nameEn: 'Generators', icon: 'Wand2' },
  { id: 'formatters', name: 'Formatadores', nameEn: 'Formatters', icon: 'Code' },
  { id: 'converters', name: 'Conversores', nameEn: 'Converters', icon: 'ArrowLeftRight' },
  { id: 'encoders', name: 'Encode / Decode', nameEn: 'Encode / Decode', icon: 'Binary' },
  { id: 'network', name: 'Rede & Tempo', nameEn: 'Network & Time', icon: 'Globe' },
  { id: 'utilities', name: 'Utilidades', nameEn: 'Utilities', icon: 'Wrench' }
];

export const tools = [
  // BRASIL
  {
    id: 'cpf-generator',
    aliasIds: ['gerador-de-cpf'],
    categoryId: 'brazil',
    name: 'Gerador de CPF',
    nameEn: 'CPF Generator',
    description: 'Gere CPFs válidos para testes, com ou sem máscara e em lote',
    descriptionEn: 'Generate valid Brazilian CPFs for testing, with or without mask and in bulk',
    icon: 'IdCard',
    popular: true,
    tags: ['cpf', 'brasil', 'documentos', 'validacao', 'lote']
  },
  {
    id: 'cnpj-generator',
    aliasIds: ['gerador-de-cnpj'],
    categoryId: 'brazil',
    name: 'Gerador de CNPJ',
    nameEn: 'CNPJ Generator',
    description: 'Gere CNPJs válidos (numéricos e alfanuméricos) para testes',
    descriptionEn: 'Generate valid Brazilian CNPJs (numeric & alphanumeric) for testing',
    icon: 'Building2',
    popular: true,
    tags: ['cnpj', 'brasil', 'empresa', 'alfanumerico', 'documentos']
  },
  {
    id: 'rg-generator',
    aliasIds: ['gerador-de-rg'],
    categoryId: 'brazil',
    name: 'Gerador de RG',
    nameEn: 'RG Generator',
    description: 'Gere números de RG válidos no padrão SSP-SP para testes',
    descriptionEn: 'Generate valid RG identity numbers for testing',
    icon: 'Contact2',
    popular: false,
    tags: ['rg', 'identidade', 'brasil', 'documentos']
  },
  {
    id: 'document-generator',
    aliasIds: ['gerar-documentos'],
    categoryId: 'brazil',
    name: 'Gerar Documentos',
    nameEn: 'Generate Documents',
    description: 'Gere CPF, CNPJ e RG válidos simultaneamente em um só lugar',
    descriptionEn: 'Generate valid CPF, CNPJ and RG documents all in one click',
    icon: 'FileText',
    popular: false,
    tags: ['documentos', 'cpf', 'cnpj', 'rg', 'pacote']
  },
  {
    id: 'cpf-cnpj-validator',
    aliasIds: ['validar-cpf-cnpj'],
    categoryId: 'brazil',
    name: 'Validar CPF e CNPJ',
    nameEn: 'Validate CPF & CNPJ',
    description: 'Valide CPF e CNPJ (inclusive o novo alfanumérico) em tempo real ou em lote',
    descriptionEn: 'Validate CPF and CNPJ numbers (including alphanumeric) in real-time or bulk',
    icon: 'BadgeCheck',
    popular: false,
    tags: ['validar', 'cpf', 'cnpj', 'checar', 'verificador']
  },
  {
    id: 'pix-generator',
    aliasIds: ['gerador-pix'],
    categoryId: 'brazil',
    name: 'Gerador de PIX',
    nameEn: 'PIX QR Code Generator',
    description: 'Crie QR Code e PIX copia e cola no padrão EMV com valor e descrição',
    descriptionEn: 'Create scannable PIX QR codes and copy-paste payloads with amount & description',
    icon: 'Banknote',
    popular: true,
    tags: ['pix', 'pagamento', 'qr code', 'banco central', 'emv']
  },
  {
    id: 'fake-person-generator',
    aliasIds: ['gerar-pessoa'],
    categoryId: 'brazil',
    name: 'Gerar Pessoa',
    nameEn: 'Person Generator',
    description: 'Gere perfis fictícios brasileiros completos (nome, CPF, RG, endereço, CEP)',
    descriptionEn: 'Generate realistic Brazilian fake profiles with name, docs, and address',
    icon: 'UserCheck',
    popular: false,
    tags: ['pessoa', 'fake data', 'mock', 'perfil', 'endereco', 'cep']
  },
  {
    id: 'overtime-calculator',
    aliasIds: ['calculo-hora-extra'],
    categoryId: 'brazil',
    name: 'Calcular Hora Extra',
    nameEn: 'Overtime Calculator',
    description: 'Calcule o valor das horas extras a 50%, 100% e o reflexo no DSR',
    descriptionEn: 'Calculate overtime pay at 50%, 100% and DSR weekly rest allowance',
    icon: 'Clock',
    popular: false,
    tags: ['hora extra', 'trabalho', 'clt', 'salario', 'dsr']
  },
  {
    id: 'nb-generator',
    aliasIds: ['gerador-nb', 'numero-beneficio', 'nb-inss', 'inss-nb'],
    categoryId: 'brazil',
    name: 'Gerador de NB (INSS)',
    nameEn: 'INSS Benefit Number Generator (NB)',
    description: 'Gere e valide números de benefício do INSS (NB) com dígito verificador módulo 11 em lote ou individual',
    descriptionEn: 'Generate and validate official Brazilian INSS benefit numbers (NB) with modulo 11 check digit',
    icon: 'FileBadge',
    popular: true,
    tags: ['nb', 'inss', 'beneficio', 'previdencia', 'aposentadoria', 'gerador', 'validador', 'batch', 'lote']
  },
  {
    id: 'processo-generator',
    aliasIds: ['gerador-processo', 'numero-processo', 'processo-judicial', 'cnj-generator', 'lawsuit-generator'],
    categoryId: 'brazil',
    name: 'Gerador de Processo Judicial (CNJ)',
    nameEn: 'Lawsuit Number Generator (CNJ)',
    description: 'Gere e valide números de processo judicial no padrão unificado do CNJ (Resolução 65/2008) com cálculo módulo 97',
    descriptionEn: 'Generate and validate official Brazilian lawsuit numbers formatted according to CNJ standard (Res. 65/2008) with modulo 97 checksum',
    icon: 'Scale',
    popular: true,
    tags: ['processo', 'judicial', 'cnj', 'tribunal', 'stf', 'stj', 'trf', 'trt', 'tj', 'advogado', 'direito', 'gerador', 'validador', 'batch', 'lote']
  },

  // GERADORES
  {
    id: 'color-palette-generator',
    aliasIds: ['gerador-paleta-cores', 'coolors'],
    categoryId: 'generators',
    name: 'Gerador de Paleta de Cores',
    nameEn: 'Color Palette Generator',
    description: 'Gere paletas harmônicas com barra de espaço, trave cores, ajuste tons e exporte em CSS, SVG e PNG',
    descriptionEn: 'Generate harmonious color palettes with spacebar, lock colors, pick shades, and export to CSS, SVG, and PNG',
    icon: 'Palette',
    popular: true,
    tags: ['coolors', 'paleta', 'cores', 'color', 'palette', 'harmonia', 'css', 'design', 'contraste', 'daltonismo']
  },
  {
    id: 'qr-code-generator',
    aliasIds: ['gerar-qrcode'],
    categoryId: 'generators',
    name: 'Gerar QR Code',
    nameEn: 'QR Code Generator',
    description: 'Crie QR Codes a partir de links e textos com download em PNG e SVG',
    descriptionEn: 'Generate QR codes from links and text with custom colors and PNG/SVG download',
    icon: 'QrCode',
    popular: true,
    tags: ['qrcode', 'qr', 'codigo', 'imagem', 'png', 'svg']
  },
  {
    id: 'password-generator',
    aliasIds: ['gerar-senha'],
    categoryId: 'generators',
    name: 'Gerar Senha Segura',
    nameEn: 'Password Generator',
    description: 'Gere senhas criptograficamente fortes com medição de entropia',
    descriptionEn: 'Generate strong cryptographically secure passwords with entropy gauge',
    icon: 'KeyRound',
    popular: true,
    tags: ['senha', 'password', 'seguranca', 'criptografia', 'forte']
  },
  {
    id: 'whatsapp-link-generator',
    aliasIds: ['link-whatsapp'],
    categoryId: 'generators',
    name: 'Gerar Link WhatsApp',
    nameEn: 'WhatsApp Link Generator',
    description: 'Crie links diretos para WhatsApp prontos para compartilhar com mensagem',
    descriptionEn: 'Create click-to-chat WhatsApp direct links with pre-filled messages',
    icon: 'MessageCircle',
    popular: false,
    tags: ['whatsapp', 'link', 'wa.me', 'mensagem', 'contato']
  },
  {
    id: 'credit-card-generator',
    aliasIds: ['gerador-cartao-de-credito'],
    categoryId: 'generators',
    name: 'Cartão de Crédito para Testes',
    nameEn: 'Test Credit Card',
    description: 'Gere e valide números de cartão de teste pelo algoritmo de Luhn',
    descriptionEn: 'Generate and validate test credit card numbers using Luhn algorithm',
    icon: 'CreditCard',
    popular: false,
    tags: ['cartao', 'visa', 'mastercard', 'amex', 'luhn', 'checkout']
  },
  {
    id: 'hash-generator',
    aliasIds: ['gerar-hash'],
    categoryId: 'generators',
    name: 'Gerador de Hash',
    nameEn: 'Hash Generator',
    description: 'Gere hashes MD5, SHA1, SHA256 e SHA512 instantaneamente no navegador',
    descriptionEn: 'Compute MD5, SHA-1, SHA-256 and SHA-512 hashes instantly',
    icon: 'Hash',
    popular: false,
    tags: ['hash', 'md5', 'sha1', 'sha256', 'sha512', 'checksum']
  },
  {
    id: 'guid-uuid-generator',
    aliasIds: ['guid-generator'],
    categoryId: 'generators',
    name: 'Gerar GUID / UUID',
    nameEn: 'GUID / UUID Generator',
    description: 'Gere identificadores únicos UUID v4 em lote com opções de formato',
    descriptionEn: 'Generate unique UUID v4 identifiers in bulk with format options',
    icon: 'Fingerprint',
    popular: false,
    tags: ['guid', 'uuid', 'v4', 'id', 'aleatorio']
  },
  {
    id: 'lorem-ipsum-generator',
    aliasIds: ['lorem-ipsum'],
    categoryId: 'generators',
    name: 'Lorem Ipsum',
    nameEn: 'Lorem Ipsum Generator',
    description: 'Gere texto Lorem Ipsum de preenchimento por parágrafos, frases ou palavras',
    descriptionEn: 'Generate dummy placeholder Lorem Ipsum text by paragraphs, sentences, or words',
    icon: 'AlignLeft',
    popular: false,
    tags: ['lorem', 'ipsum', 'texto', 'dummy', 'mock']
  },

  // FORMATADORES
  {
    id: 'json-formatter',
    aliasIds: ['formatar-json'],
    categoryId: 'formatters',
    name: 'Formatar JSON',
    nameEn: 'JSON Formatter',
    description: 'Formate, valide, organize chaves e minifique código JSON',
    descriptionEn: 'Format, validate, sort keys, and minify JSON code',
    icon: 'Braces',
    popular: true,
    tags: ['json', 'formatar', 'prettify', 'minificar', 'validar']
  },
  {
    id: 'xml-formatter',
    aliasIds: ['formatar-xml'],
    categoryId: 'formatters',
    name: 'Formatar XML',
    nameEn: 'XML Formatter',
    description: 'Formate, idente e organize documentos XML com validação sintática',
    descriptionEn: 'Format, indent, and organize XML documents with syntax checking',
    icon: 'FileCode2',
    popular: false,
    tags: ['xml', 'formatar', 'identar', 'minificar', 'markup']
  },
  {
    id: 'sql-formatter',
    aliasIds: ['formatar-sql'],
    categoryId: 'formatters',
    name: 'Formatar SQL',
    nameEn: 'SQL Formatter',
    description: 'Formate queries SQL para melhor leitura com ajuste de keywords',
    descriptionEn: 'Format SQL queries for readability with keyword casing control',
    icon: 'Database',
    popular: false,
    tags: ['sql', 'query', 'banco de dados', 'formatar', 'select']
  },

  // CONVERSORES
  {
    id: 'json-to-csharp',
    aliasIds: ['conversor-json-class'],
    categoryId: 'converters',
    name: 'JSON ↔ C#',
    nameEn: 'JSON to C# Classes',
    description: 'Converta JSON em classes C# POCO com atributos e tipagem automática',
    descriptionEn: 'Convert JSON to strongly-typed C# POCO classes with serialization attributes',
    icon: 'FileCode',
    popular: false,
    tags: ['json', 'c#', 'csharp', 'dotnet', 'poco', 'classes']
  },
  {
    id: 'xml-to-json',
    aliasIds: ['conversor-xml-json'],
    categoryId: 'converters',
    name: 'XML ↔ JSON',
    nameEn: 'XML to JSON',
    description: 'Converta bidirecionalmente entre estruturas XML e JSON',
    descriptionEn: 'Bidirectionally convert between XML and JSON documents',
    icon: 'ArrowLeftRight',
    popular: false,
    tags: ['xml', 'json', 'converter', 'transformar']
  },
  {
    id: 'csv-to-json',
    aliasIds: ['conversor-csv-json'],
    categoryId: 'converters',
    name: 'CSV ↔ JSON',
    nameEn: 'CSV to JSON',
    description: 'Converta planilhas e dados CSV em JSON e vice-versa',
    descriptionEn: 'Convert spreadsheet CSV data to JSON and vice versa',
    icon: 'Table',
    popular: false,
    tags: ['csv', 'json', 'planilha', 'excel', 'dados']
  },
  {
    id: 'json-to-yaml',
    aliasIds: ['conversor-json-yaml'],
    categoryId: 'converters',
    name: 'JSON ↔ YAML',
    nameEn: 'JSON to YAML',
    description: 'Converta entre JSON e YAML estruturado para configurações',
    descriptionEn: 'Convert between JSON and YAML for config files and pipelines',
    icon: 'FileCog',
    popular: false,
    tags: ['json', 'yaml', 'yml', 'config', 'devops']
  },
  {
    id: 'json-stringify',
    aliasIds: [],
    categoryId: 'converters',
    name: 'JSON ↔ String',
    nameEn: 'JSON ↔ String Escaper',
    description: 'Converta JSON em string de uma linha com escape de aspas e vice-versa',
    descriptionEn: 'Convert JSON to an escaped one-line string literal and unescape',
    icon: 'Quote',
    popular: false,
    tags: ['stringify', 'escape', 'unescape', 'string', 'env']
  },
  {
    id: 'base64-to-file',
    aliasIds: ['conversor-base64-arquivo'],
    categoryId: 'converters',
    name: 'Base64 ↔ Arquivo',
    nameEn: 'Base64 ↔ File',
    description: 'Converta arquivos locais para Base64 e reconstrua arquivos de strings Base64',
    descriptionEn: 'Convert files to Base64 data URIs and decode Base64 back into downloadable files',
    icon: 'FileUp',
    popular: false,
    tags: ['base64', 'arquivo', 'upload', 'data uri', 'imagem', 'pdf']
  },
  {
    id: 'timestamp-converter',
    aliasIds: [],
    categoryId: 'converters',
    name: 'Timestamp / Epoch',
    nameEn: 'Unix Timestamp Converter',
    description: 'Converta timestamp Unix em segundos ou ms em data legível e vice-versa',
    descriptionEn: 'Convert Unix epoch timestamps to human readable dates and vice-versa',
    icon: 'CalendarClock',
    popular: false,
    tags: ['timestamp', 'epoch', 'data', 'hora', 'unix', 'utc']
  },
  {
    id: 'color-converter',
    aliasIds: ['conversor-cores'],
    categoryId: 'converters',
    name: 'Conversor de Cores',
    nameEn: 'Color Converter & Contrast',
    description: 'Converta entre HEX, RGB, HSL e analise contraste de acessibilidade WCAG',
    descriptionEn: 'Convert colors between HEX, RGB, HSL and test WCAG accessibility contrast',
    icon: 'Palette',
    popular: false,
    tags: ['cores', 'hex', 'rgb', 'hsl', 'wcag', 'contraste', 'design']
  },
  {
    id: 'number-base-converter',
    aliasIds: ['conversor-base-numerica'],
    categoryId: 'converters',
    name: 'Base Numérica',
    nameEn: 'Number Base Converter',
    description: 'Converta números simultaneamente entre decimal, binário, octal e hexadecimal',
    descriptionEn: 'Convert numbers simultaneously between decimal, binary, octal and hex',
    icon: 'Binary',
    popular: false,
    tags: ['base', 'binario', 'hexadecimal', 'octal', 'decimal', 'bits']
  },

  // ENCODE / DECODE
  {
    id: 'url-encoder-decoder',
    aliasIds: ['url-encode-decode'],
    categoryId: 'encoders',
    name: 'URL Encode / Decode',
    nameEn: 'URL Encode / Decode',
    description: 'Codifique e decodifique parâmetros de URLs com visualizador de query strings',
    descriptionEn: 'Encode and decode URLs and inspect query parameters in a visual table',
    icon: 'Link2',
    popular: false,
    tags: ['url', 'uri', 'encode', 'decode', 'query', 'params']
  },
  {
    id: 'base64-encoder-decoder',
    aliasIds: ['base64-encode-decode'],
    categoryId: 'encoders',
    name: 'Base64 Encode / Decode',
    nameEn: 'Base64 Text Encode / Decode',
    description: 'Codifique e decodifique texto em Base64 com suporte total a UTF-8',
    descriptionEn: 'Encode and decode UTF-8 strings into Base64 safely',
    icon: 'FileText',
    popular: false,
    tags: ['base64', 'texto', 'encode', 'decode', 'utf-8']
  },
  {
    id: 'jwt-inspector',
    aliasIds: ['jwt-encode-decode'],
    categoryId: 'encoders',
    name: 'JWT Inspector',
    nameEn: 'JWT Token Inspector',
    description: 'Decodifique tokens JWT, analise header, payload claims e tempo de expiração',
    descriptionEn: 'Decode and inspect JWT tokens, claims, and expiration status safely client-side',
    icon: 'ShieldCheck',
    popular: true,
    tags: ['jwt', 'token', 'auth', 'bearer', 'claims', 'seguranca']
  },

  // REDE & TEMPO
  {
    id: 'world-time-buddy',
    aliasIds: ['world-time-converter', 'world-clock', 'wtb'],
    categoryId: 'network',
    name: 'World Time Buddy & Fuso Horário',
    nameEn: 'World Time Buddy & Time Zone Converter',
    description: 'Compare horários mundiais em grade interativa de 24h, encontre horários ideais e agende reuniões globais',
    descriptionEn: 'Compare world time zones side-by-side with interactive 24-hour scrubber, day/night indicators, and meeting scheduler',
    icon: 'Clock',
    popular: true,
    tags: ['world time buddy', 'time zone', 'fuso horario', 'reuniao', 'horario mundial', 'relogio', 'meeting', 'gmt', 'utc']
  },
  {
    id: 'my-ip-address',
    aliasIds: ['meu-ip'],
    categoryId: 'network',
    name: 'Obter Meu IP',
    nameEn: 'What is My IP Address',
    description: 'Veja seu endereço de IP público atual e informações de conexão',
    descriptionEn: 'Check your public IP address and connection environment details',
    icon: 'Globe',
    popular: false,
    tags: ['ip', 'rede', 'ipv4', 'ipv6', 'publico', 'internet']
  },

  // UTILIDADES
  {
    id: 'html-viewer',
    aliasIds: ['visualizar-html'],
    categoryId: 'utilities',
    name: 'Visualizar HTML',
    nameEn: 'HTML Real-Time Preview',
    description: 'Visualize código HTML, CSS e JavaScript ao vivo em sandbox isolada',
    descriptionEn: 'Live sandboxed preview of HTML, CSS, and JS snippets with templates',
    icon: 'Eye',
    popular: false,
    tags: ['html', 'preview', 'render', 'css', 'javascript']
  },
  {
    id: 'string-utilities',
    aliasIds: [],
    categoryId: 'utilities',
    name: 'Padronizador de Texto',
    nameEn: 'String Utilities',
    description: 'Transforme texto: caixa alta, baixa, camelCase, snake_case, remover acentos',
    descriptionEn: 'Transform case (camelCase, snake_case, PascalCase, slugify) and clean text',
    icon: 'CaseSensitive',
    popular: false,
    tags: ['texto', 'string', 'camelcase', 'snake_case', 'slug', 'acentos']
  },
  {
    id: 'regex-tester',
    aliasIds: ['testador-regex'],
    categoryId: 'utilities',
    name: 'Testador de Regex',
    nameEn: 'Regex Tester',
    description: 'Teste expressões regulares em tempo real com destaque visual e presets úteis',
    descriptionEn: 'Test regular expressions in real-time with visual match highlighting and cheat sheet',
    icon: 'Regex',
    popular: false,
    tags: ['regex', 'expressao regular', 'match', 'pattern', 'validacao']
  },
  {
    id: 'text-diff',
    aliasIds: ['comparar-textos'],
    categoryId: 'utilities',
    name: 'Diff de Textos',
    nameEn: 'Text Diff Checker',
    description: 'Compare dois textos e veja as adições e remoções linha a linha',
    descriptionEn: 'Compare two texts side-by-side or unified with syntax highlighted diffs',
    icon: 'GitCompare',
    popular: false,
    tags: ['diff', 'comparar', 'texto', 'git', 'alteracoes']
  },
  {
    id: 'cron-expression-explainer',
    aliasIds: ['explicador-cron'],
    categoryId: 'utilities',
    name: 'Explicador de Cron',
    nameEn: 'Cron Expression Explainer',
    description: 'Entenda qualquer expressão cron de 5 partes explicada em linguagem humana',
    descriptionEn: 'Translate any standard 5-part cron schedule into clear human language',
    icon: 'Timer',
    popular: false,
    tags: ['cron', 'agendamento', 'schedule', 'tempo', 'explica']
  },
  {
    id: 'markdown-previewer',
    aliasIds: ['preview-markdown'],
    categoryId: 'utilities',
    name: 'Preview de Markdown',
    nameEn: 'Markdown Live Editor',
    description: 'Escreva Markdown e veja o resultado renderizado com tabelas e código',
    descriptionEn: 'Write and preview Markdown live with syntax styling, tables and copy options',
    icon: 'FileType',
    popular: false,
    tags: ['markdown', 'md', 'editor', 'preview', 'documentacao']
  },
  {
    id: 'character-counter',
    aliasIds: ['contador-de-caracteres'],
    categoryId: 'utilities',
    name: 'Contador de Caracteres',
    nameEn: 'Character & Word Counter',
    description: 'Conte caracteres, palavras, linhas e estime tempo de leitura e fala',
    descriptionEn: 'Count characters, words, lines and calculate estimated reading time',
    icon: 'LetterText',
    popular: true,
    tags: ['contador', 'palavras', 'caracteres', 'leitura', 'estatisticas']
  }
];

// Helper: Resolve tool by exact ID or legacy alias
export function findToolByIdOrAlias(searchId) {
  if (!searchId) return null;
  const clean = searchId.replace('#', '').trim().toLowerCase();
  return tools.find(t => t.id === clean || (t.aliasIds && t.aliasIds.includes(clean))) || null;
}
