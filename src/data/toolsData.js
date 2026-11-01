// Master registry of all developer tools in StackKit DevStudio
// Optimized for SEO with descriptive English slugs and Portuguese alias resolution

export const categories = [
  { id: 'all', name: 'Todas', nameEn: 'All', nameEs: 'Todas', icon: 'LayoutGrid' },
  { id: 'brazil', name: 'Brasil', nameEn: 'Brazil', nameEs: 'Brasil', icon: 'Flag' },
  { id: 'generators', name: 'Geradores', nameEn: 'Generators', nameEs: 'Generadores', icon: 'Wand2' },
  { id: 'formatters', name: 'Formatadores', nameEn: 'Formatters', nameEs: 'Formateadores', icon: 'Code' },
  { id: 'converters', name: 'Conversores', nameEn: 'Converters', nameEs: 'Conversores', icon: 'ArrowLeftRight' },
  { id: 'encoders', name: 'Encode / Decode', nameEn: 'Encode / Decode', nameEs: 'Codificar / Decodificar', icon: 'Binary' },
  { id: 'network', name: 'Rede & Tempo', nameEn: 'Network & Time', nameEs: 'Red y Tiempo', icon: 'Globe' },
  { id: 'utilities', name: 'Utilidades', nameEn: 'Utilities', nameEs: 'Utilidades', icon: 'Wrench' },
  { id: 'games', name: 'Jogos', nameEn: 'Games', nameEs: 'Juegos', icon: 'Gamepad2' }
];

export const tools = [
  // BRASIL
  {
    id: 'cpf-generator',
    aliasIds: ['gerador-de-cpf'],
    categoryId: 'brazil',
    name: 'Gerador de CPF',
    nameEn: 'CPF Generator',
    nameEs: 'Generador de CPF',
    description: 'Gere CPFs válidos para testes, com ou sem máscara e em lote',
    descriptionEn: 'Generate valid Brazilian CPFs for testing, with or without mask and in bulk',
    descriptionEs: 'Genere CPFs válidos para pruebas de software, con o sin máscara y por lote',
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
    nameEs: 'Generador de CNPJ',
    description: 'Gere CNPJs válidos (numéricos e alfanuméricos) para testes',
    descriptionEn: 'Generate valid Brazilian CNPJs (numeric & alphanumeric) for testing',
    descriptionEs: 'Genere CNPJs válidos (numéricos y alfanuméricos) para pruebas técnicas',
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
    nameEs: 'Generador de RG',
    description: 'Gere números de RG válidos no padrão SSP-SP para testes',
    descriptionEn: 'Generate valid RG identity numbers for testing',
    descriptionEs: 'Genere números de RG válidos según el estándar brasileño para pruebas',
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
    nameEs: 'Generar Documentos',
    description: 'Gere CPF, CNPJ e RG válidos simultaneamente em um só lugar',
    descriptionEn: 'Generate valid CPF, CNPJ and RG documents all in one click',
    descriptionEs: 'Genere CPF, CNPJ y RG válidos simultáneamente en un solo clic',
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
    nameEs: 'Validar CPF y CNPJ',
    description: 'Valide CPF e CNPJ (inclusive o novo alfanumérico) em tempo real ou em lote',
    descriptionEn: 'Validate CPF and CNPJ numbers (including alphanumeric) in real-time or bulk',
    descriptionEs: 'Valide CPF y CNPJ (incluido el alfanumérico) en tiempo real o en lote',
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
    nameEs: 'Generador de PIX',
    description: 'Crie QR Code e PIX copia e cola no padrão EMV com valor e descrição',
    descriptionEn: 'Create scannable PIX QR codes and copy-paste payloads with amount & description',
    descriptionEs: 'Cree códigos QR y payloads PIX copia y pega con importe y descripción',
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
    nameEs: 'Generar Persona Ficticia',
    description: 'Gere perfis fictícios brasileiros completos (nome, CPF, RG, endereço, CEP)',
    descriptionEn: 'Generate realistic Brazilian fake profiles with name, docs, and address',
    descriptionEs: 'Genere perfiles ficticios completos con nombre, documentos y dirección',
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
    nameEs: 'Calcular Horas Extras',
    description: 'Calcule o valor das horas extras a 50%, 100% e o reflexo no DSR',
    descriptionEn: 'Calculate overtime pay at 50%, 100% and DSR weekly rest allowance',
    descriptionEs: 'Calcule el valor de las horas extras al 50%, 100% y el impacto en el descanso semanal',
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
    nameEs: 'Generador de NB (INSS)',
    description: 'Gere e valide números de benefício do INSS (NB) com dígito verificador módulo 11 em lote ou individual',
    descriptionEn: 'Generate and validate official Brazilian INSS benefit numbers (NB) with modulo 11 check digit',
    descriptionEs: 'Genere y valide números de beneficio del INSS (NB) con dígito verificador módulo 11',
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
    nameEs: 'Generador de Proceso Judicial (CNJ)',
    description: 'Gere e valide números de processo judicial no padrão unificado do CNJ (Resolução 65/2008) com cálculo módulo 97',
    descriptionEn: 'Generate and validate official Brazilian lawsuit numbers formatted according to CNJ standard (Res. 65/2008) with modulo 97 checksum',
    descriptionEs: 'Genere y valide números de procesos judiciales según el estándar unificado CNJ (Res. 65/2008)',
    icon: 'Scale',
    popular: true,
    tags: ['processo', 'judicial', 'cnj', 'tribunal', 'stf', 'stj', 'trf', 'trt', 'tj', 'advogado', 'direito', 'gerador', 'validador', 'batch', 'lote']
  },

  // GERADORES
  {
    id: 'resume-builder',
    aliasIds: ['gerador-de-curriculo', 'curriculo-maker', 'cv-generator', 'resume-maker'],
    categoryId: 'generators',
    name: 'Gerador de Currículo',
    nameEn: 'Resume Builder & CV Maker',
    nameEs: 'Creador de Currículum y CV',
    description: 'Crie currículos profissionais com importação do LinkedIn, múltiplos layouts e exportação para PDF',
    descriptionEn: 'Create professional resumes with LinkedIn import, multiple layouts, local storage, and crisp PDF export',
    descriptionEs: 'Cree currículums profesionales con importación de LinkedIn, múltiples plantillas y exportación a PDF',
    icon: 'FileText',
    popular: true,
    tags: ['curriculo', 'resume', 'cv', 'linkedin', 'pdf', 'ats', 'templates', 'gerador', 'carreira']
  },
  {
    id: 'email-signature-generator',
    aliasIds: ['gerador-assinatura-email', 'gerador-assinaturas', 'assinatura-email', 'email-signature'],
    categoryId: 'generators',
    name: 'Gerador de Assinatura de E-mail',
    nameEn: 'HTML Email Signature Generator',
    nameEs: 'Generador de Firma de Correo HTML',
    description: 'Crie assinaturas de e-mail profissionais em HTML compatíveis com Gmail, Outlook e Apple Mail',
    descriptionEn: 'Create professional HTML email signatures 100% compatible with Gmail, Outlook, Apple Mail and Thunderbird',
    descriptionEs: 'Cree firmas de correo profesionales en HTML compatibles con Gmail, Outlook y Apple Mail',
    icon: 'Mail',
    popular: true,
    tags: ['assinatura', 'email', 'signature', 'html', 'gmail', 'outlook', 'marketing', 'gerador', 'templates']
  },
  {
    id: 'color-palette-generator',
    aliasIds: ['gerador-paleta-cores', 'coolors'],
    categoryId: 'generators',
    name: 'Gerador de Paleta de Cores',
    nameEn: 'Color Palette Generator',
    nameEs: 'Generador de Paleta de Colores',
    description: 'Gere paletas harmônicas com barra de espaço, trave cores, ajuste tons e exporte em CSS, SVG e PNG',
    descriptionEn: 'Generate harmonious color palettes with spacebar, lock colors, pick shades, and export to CSS, SVG, and PNG',
    descriptionEs: 'Genere paletas armónicas con la barra espaciadora, bloquee colores y exporte a CSS, SVG y PNG',
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
    nameEs: 'Generador de Código QR',
    description: 'Crie QR Codes a partir de links e textos com download em PNG e SVG',
    descriptionEn: 'Generate QR codes from links and text with custom colors and PNG/SVG download',
    descriptionEs: 'Cree códigos QR a partir de enlaces y texto con descarga en PNG y SVG',
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
    nameEs: 'Generador de Contraseñas Seguras',
    description: 'Gere senhas criptograficamente fortes com medição de entropia',
    descriptionEn: 'Generate strong cryptographically secure passwords with entropy gauge',
    descriptionEs: 'Genere contraseñas criptográficamente seguras con medidor de entropía',
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
    nameEs: 'Generador de Enlaces de WhatsApp',
    description: 'Crie links diretos para WhatsApp prontos para compartilhar com mensagem',
    descriptionEn: 'Create click-to-chat WhatsApp direct links with pre-filled messages',
    descriptionEs: 'Cree enlaces directos para WhatsApp con mensaje personalizado listos para compartir',
    icon: 'MessageCircle',
    popular: true,
    tags: ['whatsapp', 'link', 'wa.me', 'mensagem', 'contato']
  },
  {
    id: 'credit-card-generator',
    aliasIds: ['gerador-cartao-de-credito'],
    categoryId: 'generators',
    name: 'Cartão de Crédito para Testes',
    nameEn: 'Test Credit Card',
    nameEs: 'Tarjetas de Crédito de Prueba',
    description: 'Gere e valide números de cartão de teste pelo algoritmo de Luhn',
    descriptionEn: 'Generate and validate test credit card numbers using Luhn algorithm',
    descriptionEs: 'Genere y valide números de tarjeta de prueba mediante el algoritmo de Luhn',
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
    nameEs: 'Generador de Hash',
    description: 'Gere hashes MD5, SHA1, SHA256 e SHA512 instantaneamente no navegador',
    descriptionEn: 'Compute MD5, SHA-1, SHA-256 and SHA-512 hashes instantly',
    descriptionEs: 'Calcule hashes MD5, SHA-1, SHA-256 y SHA-512 al instante en el navegador',
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
    nameEs: 'Generador de GUID / UUID',
    description: 'Gere identificadores únicos UUID v4 em lote com opções de formato',
    descriptionEn: 'Generate unique UUID v4 identifiers in bulk with format options',
    descriptionEs: 'Genere identificadores únicos UUID v4 en lote con opciones de formato',
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
    nameEs: 'Generador Lorem Ipsum',
    description: 'Gere texto Lorem Ipsum de preenchimento por parágrafos, frases ou palavras',
    descriptionEn: 'Generate dummy placeholder Lorem Ipsum text by paragraphs, sentences, or words',
    descriptionEs: 'Genere texto simulado de relleno por párrafos, oraciones o palabras',
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
    nameEs: 'Formateador JSON',
    description: 'Formate, valide, organize chaves e minifique código JSON',
    descriptionEn: 'Format, validate, sort keys, and minify JSON code',
    descriptionEs: 'Formatee, valide, ordene claves y minifique código JSON',
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
    nameEs: 'Formateador XML',
    description: 'Formate, idente e organize documentos XML com validação sintática',
    descriptionEn: 'Format, indent, and organize XML documents with syntax checking',
    descriptionEs: 'Formatee, indente y organice documentos XML con validación sintáctica',
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
    nameEs: 'Formateador SQL',
    description: 'Formate queries SQL para melhor leitura com ajuste de keywords',
    descriptionEn: 'Format SQL queries for readability with keyword casing control',
    descriptionEs: 'Formatee consultas SQL para facilitar su lectura con control de mayúsculas',
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
    nameEs: 'JSON ↔ C#',
    description: 'Converta JSON em classes C# POCO com atributos e tipagem automática',
    descriptionEn: 'Convert JSON to strongly-typed C# POCO classes with serialization attributes',
    descriptionEs: 'Convierta JSON en clases C# POCO fuertemente tipadas con atributos',
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
    nameEs: 'XML ↔ JSON',
    description: 'Converta bidirecionalmente entre estruturas XML e JSON',
    descriptionEn: 'Bidirectionally convert between XML and JSON documents',
    descriptionEs: 'Convierta bidireccionalmente entre documentos XML y JSON',
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
    nameEs: 'CSV ↔ JSON',
    description: 'Converta planilhas e dados CSV em JSON e vice-versa',
    descriptionEn: 'Convert spreadsheet CSV data to JSON and vice versa',
    descriptionEs: 'Convierta datos de hojas de cálculo CSV a JSON y viceversa',
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
    nameEs: 'JSON ↔ YAML',
    description: 'Converta entre JSON e YAML estruturado para configurações',
    descriptionEn: 'Convert between JSON and YAML for config files and pipelines',
    descriptionEs: 'Convierta entre estructuras JSON y YAML para configuraciones y pipelines',
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
    nameEs: 'JSON ↔ String',
    description: 'Converta JSON em string de uma linha com escape de aspas e vice-versa',
    descriptionEn: 'Convert JSON to an escaped one-line string literal and unescape',
    descriptionEs: 'Convierta JSON en una cadena escapada de una sola línea y viceversa',
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
    nameEs: 'Base64 ↔ Archivo',
    description: 'Converta arquivos locais para Base64 e reconstrua arquivos de strings Base64',
    descriptionEn: 'Convert files to Base64 data URIs and decode Base64 back into downloadable files',
    descriptionEs: 'Convierta archivos locales a Base64 y reconstruya archivos descargables',
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
    nameEs: 'Convertidor de Timestamp / Epoch',
    description: 'Converta timestamp Unix em segundos ou ms em data legível e vice-versa',
    descriptionEn: 'Convert Unix epoch timestamps to human readable dates and vice-versa',
    descriptionEs: 'Convierta marcas de tiempo Unix en segundos o ms a fecha legible y viceversa',
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
    nameEs: 'Conversor de Colores y Contraste',
    description: 'Converta entre HEX, RGB, HSL e analise contraste de acessibilidade WCAG',
    descriptionEn: 'Convert colors between HEX, RGB, HSL and test WCAG accessibility contrast',
    descriptionEs: 'Convierta colores entre HEX, RGB, HSL y evalúe contraste de accesibilidad WCAG',
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
    nameEs: 'Conversor de Base Numérica',
    description: 'Converta números simultaneamente entre decimal, binário, octal e hexadecimal',
    descriptionEn: 'Convert numbers simultaneously between decimal, binary, octal and hex',
    descriptionEs: 'Convierta números simultáneamente entre decimal, binario, octal y hexadecimal',
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
    nameEs: 'URL Encode / Decode',
    description: 'Codifique e decodifique parâmetros de URLs com visualizador de query strings',
    descriptionEn: 'Encode and decode URLs and inspect query parameters in a visual table',
    descriptionEs: 'Codifique y decodifique parámetros de URLs con visor de query strings',
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
    nameEs: 'Base64 Encode / Decode',
    description: 'Codifique e decodifique texto em Base64 com suporte total a UTF-8',
    descriptionEn: 'Encode and decode UTF-8 strings into Base64 safely',
    descriptionEs: 'Codifique y decodifique texto en Base64 con soporte total para UTF-8',
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
    nameEs: 'Inspector de Tokens JWT',
    description: 'Decodifique tokens JWT, analise header, payload claims e tempo de expiração',
    descriptionEn: 'Decode and inspect JWT tokens, claims, and expiration status safely client-side',
    descriptionEs: 'Decodifique tokens JWT, inspeccione encabezado, payload y estado de expiración',
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
    nameEs: 'World Time Buddy y Husos Horarios',
    description: 'Compare horários mundiais em grade interativa de 24h, encontre horários ideais e agende reuniões globais',
    descriptionEn: 'Compare world time zones side-by-side with interactive 24-hour scrubber, day/night indicators, and meeting scheduler',
    descriptionEs: 'Compare horarios mundiales en una cuadrícula interactiva de 24h y agende reuniones',
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
    nameEs: '¿Cuál es mi Dirección IP?',
    description: 'Veja seu endereço de IP público atual e informações de conexão',
    descriptionEn: 'Check your public IP address and connection environment details',
    descriptionEs: 'Consulte su dirección IP pública actual y detalles del entorno de red',
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
    nameEs: 'Visor de HTML en Tiempo Real',
    description: 'Visualize código HTML, CSS e JavaScript ao vivo em sandbox isolada',
    descriptionEn: 'Live sandboxed preview of HTML, CSS, and JS snippets with templates',
    descriptionEs: 'Previsualice fragmentos de HTML, CSS y JavaScript en vivo en sandbox aislada',
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
    nameEs: 'Utilidades de Texto',
    description: 'Transforme texto: caixa alta, baixa, camelCase, snake_case, remover acentos',
    descriptionEn: 'Transform case (camelCase, snake_case, PascalCase, slugify) and clean text',
    descriptionEs: 'Transforme formato (mayúsculas, minúsculas, camelCase, snake_case) y limpie texto',
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
    nameEs: 'Probador de Expresiones Regulares (Regex)',
    description: 'Teste expressões regulares em tempo real com destaque visual e presets úteis',
    descriptionEn: 'Test regular expressions in real-time with visual match highlighting and cheat sheet',
    descriptionEs: 'Pruebe expresiones regulares en tiempo real con resaltado visual y guía rápida',
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
    nameEs: 'Comparador de Textos (Diff)',
    description: 'Compare dois textos e veja as adições e remoções linha a linha',
    descriptionEn: 'Compare two texts side-by-side or unified with syntax highlighted diffs',
    descriptionEs: 'Compare dos textos lado a lado o unificado con resaltado sintáctico de cambios',
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
    nameEs: 'Explicador de Expresiones Cron',
    description: 'Entenda qualquer expressão cron de 5 partes explicada em linguagem humana',
    descriptionEn: 'Translate any standard 5-part cron schedule into clear human language',
    descriptionEs: 'Descifre cualquier expresión cron estándar de 5 partes explicada en lenguaje natural',
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
    nameEs: 'Editor y Previsualizador de Markdown',
    description: 'Escreva Markdown e veja o resultado renderizado com tabelas e código',
    descriptionEn: 'Write and preview Markdown live with syntax styling, tables and copy options',
    descriptionEs: 'Escriba y previsualice Markdown en tiempo real con tablas, formato y resaltado de código',
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
    nameEs: 'Contador de Caracteres y Palabras',
    description: 'Conte caracteres, palavras, linhas e estime tempo de leitura e fala',
    descriptionEn: 'Count characters, words, lines and calculate estimated reading time',
    descriptionEs: 'Cuente caracteres, palabras, líneas y calcule tiempo estimado de lectura y locución',
    icon: 'LetterText',
    popular: true,
    tags: ['contador', 'palavras', 'caracteres', 'leitura', 'estatisticas']
  },
  {
    id: 'canadian-citizenship-test',
    aliasIds: ['citizenship-test', 'teste-cidadania-canada', 'canada-citizenship'],
    categoryId: 'utilities',
    name: 'Teste de Cidadania Canadense',
    nameEn: 'Canadian Citizenship Test',
    nameEs: 'Examen de Ciudadanía Canadiense',
    description: 'Pratique para o exame oficial de cidadania canadense com 30 simulados, 600 questões e simulador real IRCC',
    descriptionEn: 'Prepare for the official Canadian Citizenship Test with 30 practice tests, 600 questions, and a realistic timed IRCC exam simulator',
    descriptionEs: 'Prepárese para el examen oficial de ciudadanía canadiense con simuladores cronometrados del IRCC',
    icon: 'GraduationCap',
    popular: true,
    tags: ['canada', 'cidadania', 'citizenship', 'ircc', 'discover canada', 'simulado', 'exam']
  },
  {
    id: 'family-arena',
    aliasIds: ['quiz-arena', 'family-quiz', 'arena-quiz', 'trivia-arena'],
    categoryId: 'games',
    name: 'Family Arena',
    nameEn: 'Family Arena',
    nameEs: 'Family Arena',
    description: 'Jogo de quiz multiplayer peer-to-peer em tempo real para TV, celular e família com zero servidores',
    descriptionEn: 'Real-time peer-to-peer multiplayer trivia game for TV, mobile and party nights with zero backend servers',
    descriptionEs: 'Juego de preguntas multijugador peer-to-peer en tiempo real para TV, móvil y reuniones familiares sin servidores',
    icon: 'Gamepad2',
    popular: true,
    tags: ['quiz', 'jogo', 'multiplayer', 'trivia', 'game', 'webrtc', 'p2p', 'familia', 'party', 'juegos']
  }
];

// Helper: Resolve tool by exact ID or legacy alias
export function findToolByIdOrAlias(searchId) {
  if (!searchId) return null;
  const clean = searchId.replace('#', '').trim().toLowerCase();
  return tools.find(t => t.id === clean || (t.aliasIds && t.aliasIds.includes(clean))) || null;
}

// Localization helpers for tools and categories
export function getToolName(tool, lang = 'pt') {
  if (!tool) return '';
  if (lang === 'es') return tool.nameEs || tool.nameEn || tool.name;
  if (lang === 'en') return tool.nameEn || tool.name;
  return tool.name;
}

export function getToolDescription(tool, lang = 'pt') {
  if (!tool) return '';
  if (lang === 'es') return tool.descriptionEs || tool.descriptionEn || tool.description;
  if (lang === 'en') return tool.descriptionEn || tool.description;
  return tool.description;
}

export function getCategoryName(category, lang = 'pt') {
  if (!category) return '';
  if (lang === 'es') return category.nameEs || category.nameEn || category.name;
  if (lang === 'en') return category.nameEn || category.name;
  return category.name;
}
