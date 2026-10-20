// Comprehensive educational publisher content, guides, technical specifications, and FAQs for StackKit DevStudio tools
// Designed to provide high-value editorial content for developers and satisfy Google AdSense / Webmaster content policies

export const categoryGuides = {
  brazil: {
    titlePt: 'Guia de Documentos e Algoritmos Fiscais Brasileiros',
    titleEn: 'Guide to Brazilian Fiscal Documents and Validation Algorithms',
    introPt: 'No Brasil, sistemas fiscais, previdenciários e judiciais dependem de identificadores numéricos com validação matemática baseada em dígitos verificadores (DVs). Ferramentas de geração e validação são essenciais para testes de software, homologação de sistemas ERP e qualidade de dados.',
    introEn: 'In Brazil, fiscal, social security, and judicial platforms rely on mathematical identifiers verified by check digits. These utilities provide developers and QA engineers with mathematically valid test data for local software compliance.',
    commonFaq: [
      {
        qPt: 'Os documentos gerados têm valor legal ou fiscal real?',
        qEn: 'Do generated documents hold real legal or financial validity?',
        aPt: 'Não. Todos os números gerados (CPF, CNPJ, RG, NB, Processo CNJ) seguem estritamente as fórmulas matemáticas oficiais (Módulo 11 da Receita Federal, Resolução 65/2008 do CNJ, etc.), mas são criados ficticiamente apenas para testes em ambientes de desenvolvimento e homologação de software.',
        aEn: 'No. All generated numbers follow official mathematical verification algorithms (Modulo 11, CNJ Resolution 65/2008), but are fictitious samples created strictly for software development, QA testing, and unit tests.'
      },
      {
        qPt: 'Por que os testes de software exigem validação de dígitos verificadores?',
        qEn: 'Why do software systems require valid check digits for testing?',
        aPt: 'Sistemas que realizam cadastros de clientes, emissão de notas fiscais ou faturamento bloqueiam entradas com dígitos verificadores inválidos. Utilizar dados matematicamente coerentes permite testar o fluxo de ponta a ponta sem rejeições prematuras de formulário.',
        aEn: 'Enterprise forms, ERPs, and billing platforms enforce strict check-digit algorithms. Using mathematically coherent data allows engineers to test full workflows without early validation failure.'
      }
    ]
  },
  generators: {
    titlePt: 'Guia de Geradores para Produtividade e Desenvolvimento',
    titleEn: 'Developer Productivity and Asset Generators Guide',
    introPt: 'Ferramentas de geração aceleram o fluxo de trabalho permitindo criar paletas de cores harmônicas, assinaturas de e-mail profissionais em HTML, QR Codes com múltiplos formatos e senhas com alta entropia criptográfica.',
    introEn: 'Generator utilities accelerate daily developer workflows, providing instant color harmony creation, clean HTML email signatures, high-resolution QR Codes, and cryptographically secure passwords.',
    commonFaq: [
      {
        qPt: 'Como funciona a geração de senhas e dados sensíveis?',
        qEn: 'How are passwords and sensitive data generated safely?',
        aPt: 'Todas as chaves, senhas e identificadores são gerados utilizando a API criptográfica nativa do navegador (window.crypto.getRandomValues). Nenhum dado gerado é transmitido ou salvo em servidores remotos.',
        aEn: 'All keys, hashes, and passwords rely on the browser\'s native Web Cryptography API (crypto.getRandomValues). No data is ever transmitted or stored on remote servers.'
      }
    ]
  },
  formatters: {
    titlePt: 'Guia de Formatação e Padronização de Código',
    titleEn: 'Code Formatting and Syntax Standardization Guide',
    introPt: 'Formatadores transformam dados brutos, minificados ou desorganizados em estruturas legíveis com indentação consistente, facilitando a depuração de APIs e a revisão de código.',
    introEn: 'Formatters parse and beautify raw, minified, or messy data structures with consistent indentation, accelerating API debugging, inspection, and code reviews.',
    commonFaq: [
      {
        qPt: 'Meus dados e payloads JSON/SQL são enviados para algum servidor?',
        qEn: 'Are my payloads sent to any third-party server during formatting?',
        aPt: 'Não. O processamento sintático e a formatação ocorrem 100% no motor JavaScript do seu navegador local.',
        aEn: 'No. Syntax analysis, validation, and beautification execute 100% locally in your client browser runtime.'
      }
    ]
  },
  converters: {
    titlePt: 'Guia de Conversão e Transformação de Dados',
    titleEn: 'Data Transformation and Serialization Guide',
    introPt: 'Conversão rápida entre formatos estruturados (JSON, CSV, XML, YAML e C# POCOs) reduz o atrito na integração de sistemas legados com arquiteturas modernas.',
    introEn: 'Instant transformations between structured data formats (JSON, CSV, XML, YAML, C# classes) eliminate integration friction across heterogeneous systems.',
    commonFaq: [
      {
        qPt: 'Como lidar com estruturas aninhadas durante a conversão?',
        qEn: 'How are deeply nested structures handled during conversion?',
        aPt: 'Nossos conversores preservam hierarquias de objetos, gerando chaves compostas para tabelas CSV ou classes C# tipadas automaticamente.',
        aEn: 'Our converters preserve object hierarchies, generating dot-notation headers for tabular CSVs or typed nested classes for C# POCOs.'
      }
    ]
  },
  encoders: {
    titlePt: 'Guia de Codificação, Hashing e Segurança Web',
    titleEn: 'Web Encoding, Hashing, and Security Tokens Guide',
    introPt: 'Codificação segura em Base64, URL Encoding e inspeção detalhada de tokens JWT são pilares da comunicação web moderna e segurança de APIs REST.',
    introEn: 'Safe Base64 encoding, URL percent-encoding, and JWT token claims inspection are foundational to modern web security and API integrations.',
    commonFaq: [
      {
        qPt: 'É seguro colar tokens de autenticação reais no JWT Inspector?',
        qEn: 'Is it safe to inspect real authentication tokens?',
        aPt: 'Sim. A ferramenta StackKit opera inteiramente no cliente. Nenhuma requisição HTTP contendo seu token é disparada. Para maior segurança, nunca compartilhe tokens que contenham chaves privadas ou assinaturas não expiradas.',
        aEn: 'Yes. StackKit executes client-side. No network requests containing your token are initiated. For security best practices, never publish tokens containing private claims or active sensitive sessions.'
      }
    ]
  },
  network: {
    titlePt: 'Guia de Rede, Fusos Horários e Produtividade Global',
    titleEn: 'Network, Time Zones, and Global Collaboration Guide',
    introPt: 'Coordenação de equipes globais exige precisão em fusos horários e diagnóstico rápido de conexões e endereços de rede.',
    introEn: 'Coordinating distributed remote teams demands precision across world time zones, day/night schedules, and network inspection.',
    commonFaq: [
      {
        qPt: 'Como o World Time Buddy calcula o horário de verão (DST)?',
        qEn: 'How does World Time Buddy compute Daylight Saving Time (DST)?',
        aPt: 'O conversor utiliza a biblioteca IANA Time Zone Database através da API nativa Intl do JavaScript, aplicando automaticamente as transições de horário de verão vigentes em cada país.',
        aEn: 'The scheduler utilizes the IANA Time Zone Database via the native browser Intl API, automatically factoring in regional Daylight Saving Time transitions.'
      }
    ]
  },
  utilities: {
    titlePt: 'Guia de Utilidades e Testes de Expressões Regulares',
    titleEn: 'Developer Utilities, Regex, and Citizenship Test Guide',
    introPt: 'Expressões regulares, visualizadores de markdown e simuladores de exames oficiais como o Canadian Citizenship Test complementam a rotina de estudos e desenvolvimento.',
    introEn: 'Regex testers, diff checkers, and authentic official study simulators provide complete workstation utilities for professional engineers.',
    commonFaq: [
      {
        qPt: 'As perguntas do teste de cidadania canadense são oficiais?',
        qEn: 'Are the Canadian citizenship test questions official?',
        aPt: 'Sim. O simulador reproduz as 600 perguntas oficiais do guia Discover Canada com cronômetro de 45 minutos e a interface idêntica ao exame online do IRCC.',
        aEn: 'Yes. The simulator accurately reproduces the 600 official Discover Canada study questions with a 45-minute timer and the authentic IRCC exam layout.'
      }
    ]
  }
};

// Detailed editorial content, step-by-step instructions, and FAQs for specific tools
export const toolSpecificContent = {
  'jwt-inspector': {
    titlePt: 'O que é o JWT Inspector e Como Decodificar Tokens JWT?',
    titleEn: 'What is a JWT and How to Inspect JSON Web Tokens Safely?',
    overviewPt: 'O JSON Web Token (JWT), definido pela RFC 7519, é um padrão aberto compacto e autocontido para transmitir informações de segurança entre duas partes como um objeto JSON. Um token JWT é composto por três partes separadas por pontos (.): Header (Cabeçalho), Payload (Dados e Declarações) e Signature (Assinatura digital). Nossa ferramenta permite inspecionar e decodificar cada camada em tempo real, verificando algoritmo (HS256, RS256), tempo de expiração (exp), emissor (iss), destinatário (aud) e claims personalizadas.',
    overviewEn: 'A JSON Web Token (JWT), specified in RFC 7519, is an open standard format for securely transmitting information between parties as a compact JSON object. A JWT consists of three dot-separated components: Header, Payload, and Signature. StackKit JWT Inspector allows developers to inspect, verify, and debug token claims, expiration timestamps, issuance dates, and signature algorithms (HS256, RS256) client-side with zero data transmission.',
    howToPt: [
      'Cole o token JWT completo (no formato xxx.yyy.zzz) na caixa de entrada principal.',
      'O cabeçalho (Header) e o corpo de dados (Payload) serão decodificados automaticamente em JSON formatado.',
      'Verifique os campos de tempo (exp, iat, nbf) convertidos automaticamente para horários humanos legíveis.',
      'Insira a chave secreta HMAC para validar a integridade da assinatura, ou inspecione as chaves públicas para algoritmos assimétricos.'
    ],
    howToEn: [
      'Paste the complete JWT token string (xxx.yyy.zzz format) into the input editor.',
      'The token Header and Payload claims are automatically parsed into syntax-highlighted JSON.',
      'Examine timestamp claims (exp, iat, nbf) automatically converted into localized human dates.',
      'Optionally supply your HMAC secret key to test signature verification in real-time.'
    ],
    faqs: [
      {
        qPt: 'Decodificar um token expõe a chave secreta do servidor?',
        qEn: 'Does decoding a JWT expose the server secret key?',
        aPt: 'Não. O Header e o Payload de um JWT são apenas codificados em Base64Url, não criptografados. Qualquer pessoa que possua o token pode ler seu conteúdo. A chave secreta só é necessária para validar ou assinar o token, nunca estando contida nele.',
        aEn: 'No. The Header and Payload are Base64Url-encoded, not encrypted. Anyone holding the token can decode its claims. The secret signing key is kept exclusively on your server and is never embedded in the token.'
      },
      {
        qPt: 'Qual a diferença entre JWT assinado (JWS) e criptografado (JWE)?',
        qEn: 'What is the difference between JWS (signed) and JWE (encrypted)?',
        aPt: 'Um JWS garante autenticidade e integridade (prova que o conteúdo não foi alterado), enquanto os dados são legíveis. Já um JWE (JSON Web Encryption) criptografa o payload para que apenas o destinatário com a chave privada possa ler as informações.',
        aEn: 'A JWS guarantees authenticity and tamper-proof integrity while keeping claims readable. A JWE (JSON Web Encryption) encrypts the payload so that only holders of the private decryption key can inspect the claims.'
      },
      {
        qPt: 'Esta ferramenta envia meu token para algum servidor?',
        qEn: 'Does StackKit send my JWT to any remote backend?',
        aPt: 'Não. Todo o processo de decodificação e validação de assinatura roda 100% no seu navegador através do motor Web Crypto local. Seus tokens nunca trafegam pela rede.',
        aEn: 'No. All parsing, claims inspection, and HMAC verification execute 100% client-side inside your browser runtime. Sensitive credentials never leave your device.'
      }
    ]
  },

  'cpf-generator': {
    titlePt: 'Guia do Gerador de CPF: Validação Matemática e Testes de Software',
    titleEn: 'CPF Generator Guide: Modulo 11 Algorithm and Software QA Testing',
    overviewPt: 'O Cadastro de Pessoas Físicas (CPF) é o registro mantido pela Receita Federal do Brasil para identificar cidadãos e contribuintes. Composto por 11 dígitos no formato 000.000.000-00, os dois últimos dígitos são dígitos verificadores (DV1 e DV2) calculados a partir dos nove primeiros dígitos por meio do algoritmo de Módulo 11 com pesos decrescentes. Esta ferramenta gera combinações matematicamente válidas estritamente para homologação de sistemas.',
    overviewEn: 'The Cadastro de Pessoas Físicas (CPF) is Brazil\'s primary taxpayer identification number. Composed of 11 digits formatted as 000.000.000-00, the last two digits are calculated via the official Modulo 11 check-digit algorithm with descending weights. This tool generates mathematically sound mock CPFs for software QA and database validation testing.',
    howToPt: [
      'Escolha se deseja gerar o CPF com pontuação/máscara (000.000.000-00) ou apenas números.',
      'Opcionalmente, filtre pelo Estado de origem fiscal com base no nono dígito do documento.',
      'Clique em "Gerar CPF" ou use a geração em lote para criar múltiplos registros de teste.',
      'Copie o resultado com um clique para colar no seu formulário de teste.'
    ],
    howToEn: [
      'Select whether to generate masked numbers (000.000.000-00) or raw numeric strings.',
      'Optionally filter by state of issuance based on the 9th digit of the sequence.',
      'Click "Generate" or use bulk generation to produce multiple test records.',
      'Copy the resulting numbers directly to your clipboard for database or UI tests.'
    ],
    faqs: [
      {
        qPt: 'Como o nono dígito identifica a Unidade da Federação de emissão do CPF?',
        qEn: 'How does the 9th digit identify the state of issuance?',
        aPt: 'O nono dígito indica a Região Fiscal emissora: 1 (DF, GO, MS, MT, TO), 2 (AC, AM, AP, PA, RO, RR), 3 (CE, MA, PI), 4 (AL, PB, PE, RN), 5 (BA, SE), 6 (MG), 7 (ES, RJ), 8 (SP), 9 (PR, SC) e 0 (RS).',
        aEn: 'The 9th digit designates the fiscal tax region: 1 (DF/GO/MS/MT/TO), 2 (AC/AM/AP/PA/RO/RR), 3 (CE/MA/PI), 4 (AL/PB/PE/RN), 5 (BA/SE), 6 (MG), 7 (ES/RJ), 8 (SP), 9 (PR/SC), and 0 (RS).'
      },
      {
        qPt: 'Estes números de CPF pertencem a pessoas reais?',
        qEn: 'Do generated CPFs belong to real people?',
        aPt: 'Não. Os números são gerados aleatoriamente com algoritmos matemáticos e devem ser usados exclusivamente em ambientes de homologação e teste de software, nunca para transações comerciais ou cadastros reais.',
        aEn: 'No. Numbers are generated randomly using mathematical formulas and should only be used in QA/staging environments, never for real legal or financial registrations.'
      }
    ]
  },

  'cnpj-generator': {
    titlePt: 'Guia do Gerador de CNPJ: Padrão Numérico e Alfanumérico',
    titleEn: 'CNPJ Generator Guide: Classic Numeric and Alphanumeric Format',
    overviewPt: 'O Cadastro Nacional da Pessoa Jurídica (CNPJ) identifica empresas e organizações no Brasil. Composto por 14 caracteres no formato 00.000.000/0001-00 (onde 0001 representa matriz e 00 os dígitos verificadores), o CNPJ foi atualizado pela Receita Federal para suportar o padrão alfanumérico a partir de 2026. Nossa ferramenta suporta tanto o formato numérico clássico quanto o novo formato alfanumérico.',
    overviewEn: 'The Cadastro Nacional da Pessoa Jurídica (CNPJ) identifies commercial entities in Brazil. Formatted as 00.000.000/0001-00, recent Brazilian Revenue guidelines established the transition to alphanumeric CNPJs. StackKit CNPJ Generator supports both legacy numeric and new alphanumeric formats with full check-digit validation.',
    howToPt: [
      'Selecione o formato desejado (Numérico clássico ou Novo Alfanumérico 2026).',
      'Defina se deseja a máscara padrão (00.000.000/0001-00) ou apenas os caracteres limpos.',
      'Gere registros unitários ou em lote para testes de ERPs e sistemas fiscais.'
    ],
    howToEn: [
      'Choose between classic numeric or the new alphanumeric format.',
      'Toggle punctuation masks (00.000.000/0001-00) or raw strings.',
      'Generate single or bulk samples for ERP billing tests.'
    ],
    faqs: [
      {
        qPt: 'Como funciona a validação do novo CNPJ Alfanumérico?',
        qEn: 'How does alphanumeric CNPJ verification work?',
        aPt: 'No formato alfanumérico, letras são convertidas para seus valores numéricos correspondentes na tabela ASCII menos 48, mantendo o cálculo de Módulo 11 para os dois dígitos finais.',
        aEn: 'In the alphanumeric format, letters map to their ASCII code minus 48, preserving the classic Modulo 11 check algorithm for the final two verification digits.'
      }
    ]
  },

  'pix-generator': {
    titlePt: 'Gerador de Pix Copia e Cola & QR Code Estático (EMVCo)',
    titleEn: 'Pix Copia e Cola & Static EMVCo QR Code Generator',
    overviewPt: 'O Pix é o sistema de pagamentos instantâneos criado pelo Banco Central do Brasil (BACEN). Um código Pix Copia e Cola (BR Code) segue o padrão internacional EMVCo em formato TLV (Tag-Length-Value), incorporando chave Pix (CPF, CNPJ, e-mail, telefone ou chave aleatória EVP), nome do recebedor, cidade, valor da transação e ID da transação (TXID). Esta ferramenta cria payloads EMVCo com cálculo de redundância cíclica CRC16-CCITT em tempo real.',
    overviewEn: 'Pix is the instant payment network operated by the Central Bank of Brazil (BACEN). Pix payload strings (BR Code) follow the international EMVCo Tag-Length-Value standard, encoding the Pix Key, merchant name, city, optional transaction amount, and transaction ID with cyclic redundancy check CRC16-CCITT verification.',
    howToPt: [
      'Selecione o tipo de chave Pix (CPF/CNPJ, E-mail, Telefone ou Chave Aleatória).',
      'Informe o nome do recebedor e a cidade (máximo 25 e 15 caracteres, respectivamente).',
      'Opcionalmente defina um valor fixo e o identificador TXID.',
      'Copie o código Pix Copia e Cola ou escaneie o QR Code gerado em qualquer app bancário.'
    ],
    howToEn: [
      'Select your Pix key type (CPF/CNPJ, Email, Phone, or Random EVP key).',
      'Input the merchant name and city (limited to 25 and 15 alphanumeric characters).',
      'Optionally specify a fixed transaction amount and TXID identifier.',
      'Copy the Pix string or scan the rendered QR Code with any Brazilian mobile banking app.'
    ],
    faqs: [
      {
        qPt: 'Qual o algoritmo usado no cálculo do CRC do Pix?',
        qEn: 'Which checksum algorithm does Pix EMVCo utilize?',
        aPt: 'O payload utiliza CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF) em formato hexadecimal de 4 caracteres colocado ao final da string.',
        aEn: 'Pix uses CRC16-CCITT (polynomial 0x1021, init 0xFFFF) rendered as a 4-character uppercase hexadecimal checksum.'
      }
    ]
  },

  'canadian-citizenship-test': {
    titlePt: 'Simulador do Teste Oficial de Cidadania Canadense (Discover Canada)',
    titleEn: 'Official Canadian Citizenship Practice Test Simulator',
    overviewPt: 'O Teste de Cidadania Canadense é administrado pela Imigração, Refugiados e Cidadania do Canadá (IRCC) para solicitantes de cidadania entre 18 e 54 anos. O exame consiste em 20 questões de múltipla escolha ou verdadeiro/falso baseadas no guia oficial "Discover Canada: The Rights and Responsibilities of Citizenship". Para passar, é necessário acertar pelo menos 15 de 20 questões (75%) em até 45 minutos. Nosso simulador reproduz com exatidão a interface oficial do governo canadense.',
    overviewEn: 'The Canadian Citizenship Test is administered by Immigration, Refugees and Citizenship Canada (IRCC) for citizenship applicants aged 18 to 54. The test contains 20 multiple-choice and true/false questions based on the official study guide "Discover Canada: The Rights and Responsibilities of Citizenship". A passing score requires 15 out of 20 correct answers (75%) within a 45-minute limit. StackKit features 600 verified questions and an authentic IRCC exam simulation interface.',
    howToPt: [
      'Pratique os 30 testes individuais com 20 perguntas cada e feedback imediato.',
      'Estude capítulos específicos do Discover Canada (História, Geografia, Governo, Monarquia, Economia, Regiões).',
      'Faça o Exame Simulado Oficial com cronômetro de 45 minutos, paleta de 20 questões e marcação para revisão.',
      'Revise seus erros no Centro de Revisão para fixar o aprendizado.'
    ],
    howToEn: [
      'Practice 30 standalone 20-question practice tests with immediate answer feedback.',
      'Study specific Discover Canada chapters (History, Geography, Canadian Symbols, Government, Justice).',
      'Take the full 45-minute timed exam simulator matching the official IRCC interface with review flags.',
      'Track mistakes and review saved questions in your personal progress center.'
    ],
    faqs: [
      {
        qPt: 'Quantas questões preciso acertar para passar no teste de cidadania canadense?',
        qEn: 'What is the passing score for the Canadian citizenship test?',
        aPt: 'Você precisa acertar pelo menos 15 de 20 perguntas (75%). O teste tem duração máxima de 45 minutos.',
        aEn: 'You must answer at least 15 out of 20 questions correctly (75%). The official time limit is 45 minutes.'
      },
      {
        qPt: 'O simulador funciona offline?',
        qEn: 'Does the citizenship practice simulator work offline?',
        aPt: 'Sim. Todo o banco de 600 questões e o progresso do usuário são armazenados localmente no navegador.',
        aEn: 'Yes. All 600 questions and your practice progress are stored locally on your device in browser storage.'
      }
    ]
  },

  'world-time-buddy': {
    titlePt: 'World Time Buddy & Conversor de Fuso Horário para Reuniões Globais',
    titleEn: 'World Time Buddy & Global Meeting Time Zone Converter',
    overviewPt: 'Coordenar reuniões e chamadas entre profissionais espalhados por diferentes continentes exige rápida visualização de sobreposição de horários de trabalho. O StackKit World Time Buddy oferece uma grade interativa de 24 horas onde você compara múltiplas cidades simultaneamente, visualizando faixas de horário comercial (verde), noite (azul escuro) e finais de semana.',
    overviewEn: 'Scheduling international conference calls and coordinating remote development teams across continents requires instant visualization of overlapping working hours. StackKit World Time Buddy provides an interactive 24-hour visual slider comparing time zones side-by-side with color-coded business hours, night blocks, and meeting link generation.',
    howToPt: [
      'Adicione as cidades ou fusos horários desejados através da busca inteligente.',
      'Arraste o cursor horário para encontrar a melhor janela de sobreposição comercial.',
      'Copie o resumo da reunião formatado para colar diretamente em convites de e-mail ou Slack.'
    ],
    howToEn: [
      'Add target cities or IANA time zones using the search field.',
      'Scrub across the 24-hour bar to find optimal mutual business hours.',
      'Copy the formatted meeting time table directly to email or Slack invites.'
    ],
    faqs: [
      {
        qPt: 'Como a ferramenta lida com fusos horários de meia hora (como Índia UTC+5:30)?',
        qEn: 'How does the tool handle half-hour offsets like India (UTC+5:30)?',
        aPt: 'Nossa grade suporta todos os fusos horários oficiais IANA, incluindo offsets de meia hora (Índia, Adelaide, Território do Norte da Austrália, Irã) e de 45 minutos (Nepal, Chatham).',
        aEn: 'The engine supports all IANA zones including 30-minute offsets (India, Adelaide, Iran) and 45-minute offsets (Nepal, Chatham Islands).'
      }
    ]
  },

  'color-palette-generator': {
    titlePt: 'Gerador de Paleta de Cores Coolors com Contraste WCAG',
    titleEn: 'Coolors-Style Color Palette Generator with WCAG Contrast',
    overviewPt: 'Criar esquemas de cores acessíveis e esteticamente balanceados é fundamental para interfaces digitais. Inspirado no Coolors, este gerador permite criar paletas harmônicas pressionando a barra de espaço, travar cores favoritas, ajustar saturação e luminosidade, e verificar o contraste WCAG 2.1 para conformidade de acessibilidade.',
    overviewEn: 'Crafting accessible, harmonious color schemes is vital for modern UI/UX design. Inspired by Coolors, this palette generator creates balanced color harmonies at the press of the Spacebar, with color locking, brightness/saturation sliders, and real-time WCAG 2.1 contrast ratio calculations.',
    howToPt: [
      'Pressione a barra de espaço para gerar uma nova combinação de cores instantaneamente.',
      'Clique no ícone de cadeado para travar as cores que deseja manter.',
      'Ajuste matiz, saturação e brilho individualmente ou exporte em HEX, RGB, HSL e CSS.',
      'Verifique a pontuação de contraste WCAG para garantir leitura confortável de textos.'
    ],
    howToEn: [
      'Press the Spacebar to generate fresh color harmonies instantly.',
      'Click the lock icon on any color column to preserve it while randomizing others.',
      'Adjust hue, saturation, and luminance, or export as CSS variables, HEX, or SVG.',
      'Inspect WCAG accessibility contrast scores to guarantee legible text.'
    ],
    faqs: [
      {
        qPt: 'O que significa conformidade de contraste WCAG AA e AAA?',
        qEn: 'What do WCAG AA and AAA contrast ratings mean?',
        aPt: 'O padrão WCAG 2.1 define que textos normais devem ter taxa de contraste de pelo menos 4.5:1 (nível AA) e 7:1 (nível AAA) contra o fundo para garantir legibilidade para pessoas com baixa visão ou daltonismo.',
        aEn: 'WCAG 2.1 guidelines mandate a minimum 4.5:1 contrast ratio for body text (AA) and 7:1 for enhanced accessibility (AAA) to ensure legibility for visually impaired users.'
      }
    ]
  },

  'email-signature-generator': {
    titlePt: 'Gerador de Assinaturas de E-mail em HTML para Gmail, Outlook e Apple Mail',
    titleEn: 'HTML Email Signature Generator for Gmail, Outlook, and Apple Mail',
    overviewPt: 'Assinaturas de e-mail profissionais aumentam a credibilidade da sua empresa e facilitam o contato com clientes e parceiros. Nossa ferramenta gera código HTML em tabelas embutidas com CSS inline, garantindo renderização perfeita em clientes de e-mail como Gmail, Microsoft Outlook, Apple Mail, Thunderbird e smartphones.',
    overviewEn: 'Professional email signatures establish brand trust and streamline communication. StackKit generates production-grade HTML signatures utilizing inline CSS and tabular formatting, ensuring pixel-perfect layout across Gmail, Outlook, Apple Mail, and mobile devices.',
    howToPt: [
      'Preencha seus dados pessoais (nome, cargo, empresa) e informações de contato.',
      'Insira links de redes sociais e URLs de foto de perfil ou logotipo da empresa.',
      'Escolha entre templates modernos (Corporativo, Minimalista, Criativo, Elegante).',
      'Clique em "Copiar Assinatura Formatada" e cole diretamente nas configurações do Gmail ou Outlook.'
    ],
    howToEn: [
      'Fill in your name, job title, company, phone, and contact details.',
      'Include social links and profile photo or brand logo URLs.',
      'Select a design template (Corporate, Minimalist, Creative, Compact).',
      'Click "Copy Rich Signature" and paste directly into Gmail or Outlook settings.'
    ],
    faqs: [
      {
        qPt: 'Por que assinaturas de e-mail precisam de tabelas HTML em vez de DIVs?',
        qEn: 'Why do email signatures require HTML tables instead of modern CSS flexbox?',
        aPt: 'Clientes de e-mail como o Microsoft Outlook para Windows utilizam o motor de renderização do Word, que não suporta flexbox ou grid CSS. O uso de tabelas HTML tradicionais é o único método para garantir que a assinatura não se desfaça.',
        aEn: 'Desktop email clients like Microsoft Outlook use the Microsoft Word rendering engine, which lacks support for modern CSS Flexbox or Grid. Nested HTML tables are required for cross-client compatibility.'
      }
    ]
  },

  'json-formatter': {
    titlePt: 'Formatador e Validador de JSON Online (RFC 8259)',
    titleEn: 'Online JSON Formatter & Validator (RFC 8259)',
    overviewPt: 'O JavaScript Object Notation (JSON) é o padrão de fato para troca de dados na web moderna. Esta ferramenta valida a conformidade com a RFC 8259, corrigindo problemas comuns de sintaxe, indentando nós com 2 ou 4 espaços e fornecendo visualização em árvore interativa e minificação.',
    overviewEn: 'JSON is the ubiquitous standard for web APIs and microservices. StackKit JSON Formatter parses, validates, and beautifies raw JSON with 2-space or 4-space indentation, provides interactive tree-node collapsing, and offers instant payload minification.',
    howToPt: [
      'Cole sua string JSON na área de entrada esquerda.',
      'O validador aponta a linha e coluna exata de eventuais erros sintáticos.',
      'Escolha a indentação desejada (2 espaços, 4 espaços ou minificado).',
      'Copie o JSON limpo com um clique.'
    ],
    howToEn: [
      'Paste your raw JSON payload into the input editor.',
      'The parser flags exact line and column syntax errors in real-time.',
      'Choose 2-space, 4-space, or minified formatting.',
      'Copy the beautified JSON with one click.'
    ],
    faqs: [
      {
        qPt: 'A ferramenta suporta JSON com comentários ou trailing commas?',
        qEn: 'Does the formatter support JSON comments or trailing commas?',
        aPt: 'O formatador possui modo tolerante capaz de higienizar JSON5, removendo vírgulas sobressalentes e comentários antes da validação estrita RFC 8259.',
        aEn: 'Our tolerant parser cleans up JSON5 quirks, stripping trailing commas and comments before enforcing strict RFC 8259 compliance.'
      }
    ]
  },

  'qr-code-generator': {
    titlePt: 'Gerador de QR Code com Exportação em Alta Resolução (PNG e SVG)',
    titleEn: 'High-Resolution QR Code Generator (PNG & SVG)',
    overviewPt: 'O Quick Response (QR) Code (ISO/IEC 18004) é uma matriz bidimensional amplamente utilizada para URLs, redes Wi-Fi, contatos vCard e pagamentos. Nossa ferramenta permite personalizar cores, margens e os 4 níveis de correção de erro Reed-Solomon (L: 7%, M: 15%, Q: 25%, H: 30%).',
    overviewEn: 'QR Codes (ISO/IEC 18004) are 2D matrix symbologies used globally for web URLs, Wi-Fi configuration, vCard contacts, and digital payments. StackKit supports full color customization, quiet zone adjustments, and all four Reed-Solomon error correction levels (L: 7%, M: 15%, Q: 25%, H: 30%).',
    howToPt: [
      'Digite ou cole o texto, URL ou dado desejado.',
      'Ajuste o nível de correção de erro (use H se for imprimir ou colocar logotipo no centro).',
      'Personalize as cores de primeiro plano e de fundo.',
      'Baixe como imagem PNG de alta resolução ou vetor SVG escalável.'
    ],
    howToEn: [
      'Enter the target URL, text, or payment string.',
      'Select error correction level (use Level H for high-density printing).',
      'Customize foreground and background color palettes.',
      'Export as high-resolution PNG or vector SVG.'
    ],
    faqs: [
      {
        qPt: 'Qual o tamanho mínimo recomendado para imprimir um QR Code?',
        qEn: 'What is the minimum recommended size for printing a QR Code?',
        aPt: 'Para leitura confiável por câmeras de smartphones a uma distância normal de 30 cm, o QR Code deve ter pelo menos 2 cm x 2 cm.',
        aEn: 'For dependable scanning at a standard 30 cm distance, physical QR Codes should be printed at a minimum of 2 cm x 2 cm (0.8 in).'
      }
    ]
  },

  'password-generator': {
    titlePt: 'Gerador de Senhas Fortes e Seguras com Entropia Criptográfica',
    titleEn: 'Strong Password Generator with Cryptographic Entropy',
    overviewPt: 'Senhas seguras exigem alta aleatoriedade para resistir a ataques de dicionário e força bruta (brute-force). O gerador do StackKit utiliza a API Web Cryptography (crypto.getRandomValues), garantindo entropia criptograficamente segura superior a 80 bits conforme as diretrizes NIST SP 800-63B.',
    overviewEn: 'Secure passwords demand high mathematical randomness to withstand brute-force dictionary attacks. StackKit Password Generator leverages the Web Cryptography API (window.crypto.getRandomValues) to guarantee cryptographically secure entropy (>80 bits) adhering to NIST SP 800-63B guidelines.',
    howToPt: [
      'Escolha o comprimento desejado (recomendado: 16 caracteres ou mais).',
      'Selecione os conjuntos de caracteres: maiúsculas, minúsculas, números e símbolos especiais.',
      'Opcionalmente exclua caracteres ambíguos (como 1, l, I, 0, O).',
      'Copie a senha com a certeza de que ela nunca foi transmitida pela rede.'
    ],
    howToEn: [
      'Select the desired length (16+ characters recommended).',
      'Toggle character sets: uppercase, lowercase, numbers, and symbols.',
      'Optionally exclude ambiguous characters (such as 1, l, I, 0, O).',
      'Copy the password with zero risk of network interception.'
    ],
    faqs: [
      {
        qPt: 'A senha gerada fica gravada no histórico ou nos servidores do StackKit?',
        qEn: 'Are generated passwords saved in history or on StackKit servers?',
        aPt: 'Não. O cálculo de aleatoriedade é realizado estritamente na memória volátil do seu navegador.',
        aEn: 'No. Passwords reside exclusively in volatile local browser memory and are never persisted or logged.'
      }
    ]
  },

  'credit-card-generator': {
    titlePt: 'Gerador de Cartão de Crédito para Testes (Algoritmo de Luhn)',
    titleEn: 'Credit Card Test Generator (Luhn Algorithm Mod 10)',
    overviewPt: 'Desenvolvedores de plataformas de e-commerce e gateways de pagamento (Stripe, PagSeguro, Mercado Pago, Adyen) necessitam de números de cartão fictícios que passem na validação do Algoritmo de Luhn (Módulo 10). Esta ferramenta gera cartões fictícios para as principais bandeiras (Visa, Mastercard, Amex, Elo, Hipercard) estritamente para testes de integração em ambiente sandbox.',
    overviewEn: 'E-commerce engineers and payment gateway integrators require mock card numbers satisfying the Luhn Mod 10 checksum algorithm (ISO/IEC 7812). StackKit produces synthetic card numbers for Visa, Mastercard, American Express, and Elo strictly for sandbox testing.',
    howToPt: [
      'Selecione a bandeira desejada (Visa, Mastercard, Amex, Elo).',
      'Escolha a quantidade de cartões fictícios a serem gerados.',
      'Copie o número, data de validade futura e código CVV gerados para seu ambiente de teste sandbox.'
    ],
    howToEn: [
      'Select the target card brand (Visa, Mastercard, Amex, Elo).',
      'Specify quantity of test numbers.',
      'Copy generated synthetic PAN, future expiry date, and CVV to your staging sandbox.'
    ],
    faqs: [
      {
        qPt: 'Posso usar esses cartões para compras reais na internet?',
        qEn: 'Can these card numbers be used for real internet purchases?',
        aPt: 'Não. Esses números não possuem conta bancária, saldo ou autorização real. Eles servem exclusivamente para testes de software em ambientes de homologação (sandbox).',
        aEn: 'No. These are synthetic test fixtures with zero real credit balance. Any live production authorization attempt will be rejected immediately by banking processors.'
      }
    ]
  },

  'overtime-calculator': {
    titlePt: 'Calculadora de Horas Extras CLT (50%, 100% e Reflexo no DSR)',
    titleEn: 'Brazilian Overtime Pay Calculator (50%, 100% & DSR)',
    overviewPt: 'O cálculo de horas extras no regime CLT brasileiro segue as diretrizes da Constituição Federal e da Consolidação das Leis do Trabalho. As horas extras em dias úteis recebem adicional mínimo de 50%, enquanto domingos e feriados recebem 100%. Além do adicional de horas, a legislação trabalhista brasileira (Lei 605/1949 e Súmula 172 do TST) exige o cálculo do reflexo no Descanso Semanal Remunerado (DSR).',
    overviewEn: 'Brazilian labor law specifies overtime compensation calculated from monthly base salary and contracted monthly hours. Standard workdays receive a minimum 50% premium, while Sundays and official holidays receive 100%, plus statutory DSR (Weekly Paid Rest) reflections.',
    howToPt: [
      'Informe o salário base bruto e a carga horária mensal contratual (geralmente 220 horas).',
      'Insira a quantidade de horas extras trabalhadas a 50% e a 100%.',
      'Informe a quantidade de dias úteis e de domingos/feriados do mês de apuração.',
      'Visualize o valor da hora normal, os adicionais de horas extras e o valor do reflexo no DSR discriminados.'
    ],
    howToEn: [
      'Enter gross base salary and contractual monthly hours (typically 220h).',
      'Input the number of overtime hours worked at 50% and 100%.',
      'Provide the count of working days and Sundays/holidays for the current month.',
      'Review detailed breakdown of base hourly rate, overtime premiums, and DSR reflection.'
    ],
    faqs: [
      {
        qPt: 'Como é calculada a fórmula do DSR sobre horas extras?',
        qEn: 'How is the DSR reflection on overtime computed?',
        aPt: 'A fórmula oficial é: DSR = (Total das horas extras do mês / Número de dias úteis) × Número de domingos e feriados do mês.',
        aEn: 'The statutory formula is: DSR = (Total monthly overtime / Working days in month) × Sundays and holidays in month.'
      }
    ]
  },

  'nb-generator': {
    titlePt: 'Gerador e Validador de Número de Benefício do INSS (NB)',
    titleEn: 'INSS Benefit Number Generator & Validator (NB)',
    overviewPt: 'O Número de Benefício (NB) é o identificador único composto por 10 dígitos atribuído pela Previdência Social (INSS) aos aposentados e pensionistas no Brasil. O décimo dígito é um dígito verificador calculado a partir dos nove primeiros dígitos com base no algoritmo oficial do Dataprev. Esta ferramenta permite gerar e validar números de benefício para homologação de sistemas previdenciários e bancários.',
    overviewEn: 'The INSS Benefit Number (NB) is a 10-digit identifier assigned by Brazil\'s National Social Security Institute to pension and retirement beneficiaries. The 10th digit is a check digit calculated via the official Dataprev algorithm. StackKit allows QA teams to generate and validate mock benefit numbers for banking compliance testing.',
    howToPt: [
      'Defina se deseja gerar com ou sem máscara (000.000.000-0).',
      'Clique em "Gerar NB" para criar números matematicamente válidos.',
      'Cole qualquer número existente na aba de validação para checar sua autenticidade matemática.'
    ],
    howToEn: [
      'Choose formatted mask (000.000.000-0) or raw digits.',
      'Click "Generate NB" to produce valid test numbers.',
      'Use the validation tab to verify the mathematical validity of any benefit number.'
    ],
    faqs: [
      {
        qPt: 'Qual o algoritmo do dígito verificador do NB do INSS?',
        qEn: 'Which algorithm validates the INSS NB check digit?',
        aPt: 'O Dataprev utiliza uma variação do Módulo 11 com multiplicadores de 2 a 10 aplicados da direita para a esquerda aos 9 primeiros dígitos.',
        aEn: 'Dataprev uses a Modulo 11 variation with ascending multipliers (2 through 10) applied from right to left across the first 9 digits.'
      }
    ]
  },

  'processo-generator': {
    titlePt: 'Gerador de Número de Processo Judicial Unificado CNJ (Resolução 65/2008)',
    titleEn: 'CNJ Unified Judicial Lawsuit Number Generator (Resolution 65/2008)',
    overviewPt: 'O Conselho Nacional de Justiça (CNJ) estabeleceu pela Resolução nº 65/2008 a numeração única de processos judiciais em todo o território brasileiro. Composta por 20 dígitos no formato NNNNNNN-DD.AAAA.J.TR.OOOO, a estrutura identifica o número sequencial do processo (NNNNNNN), os dígitos verificadores calculados por Módulo 97 na base 10 (DD), o ano de ajuizamento (AAAA), o segmento da Justiça (J), o tribunal respectivo (TR) e a vara de origem (OOOO).',
    overviewEn: 'Brazil\'s National Council of Justice (CNJ) enacted Resolution 65/2008 establishing a 20-digit standardized lawsuit number format (NNNNNNN-DD.AAAA.J.TR.OOOO). Verification digits (DD) are verified through the Modulo 97 Base 10 algorithm specified in ISO 7064.',
    howToPt: [
      'Selecione o segmento do Judiciário (Justiça Federal, Justiça do Trabalho, Justiça Estadual, STF, STJ, etc.).',
      'Informe o ano de distribuição desejado.',
      'Gere números válidos com máscara padrão para testes de sistemas de gestão jurídica (LegalTech).'
    ],
    howToEn: [
      'Select court segment (Federal, Labor, State Court, High Courts).',
      'Specify judicial filing year.',
      'Generate valid masked lawsuit numbers for LegalTech software QA.'
    ],
    faqs: [
      {
        qPt: 'Como são calculados os dígitos verificadores DD no processo CNJ?',
        qEn: 'How are verification digits DD calculated in CNJ lawsuit numbers?',
        aPt: 'Os dígitos utilizam a norma ISO 7064 Módulo 97, calculando: DD = 98 - ((NNNNNNN * 100000000000000 + AAAA * 1000000000 + J * 100000000 + TR * 10000 + OOOO) * 100 % 97).',
        aEn: 'Check digits follow ISO 7064 Modulo 97 Base 10: DD = 98 - (ConcatenatedNumber * 100 % 97).'
      }
    ]
  },

  'base64-encoder-decoder': {
    titlePt: 'Codificador e Decodificador Base64 Online (RFC 4648)',
    titleEn: 'Online Base64 Encoder & Decoder (RFC 4648)',
    overviewPt: 'A codificação Base64 (RFC 4648) converte dados binários ou sequências de texto em uma representação ASCII segura utilizando um alfabeto de 64 caracteres imprimíveis (A-Z, a-z, 0-9, + e /). É amplamente utilizada em URLs de dados (data URIs), cabeçalhos HTTP de autenticação básica e transmissão de anexos em protocolos de e-mail MIME.',
    overviewEn: 'Base64 encoding (RFC 4648) represents binary data in an ASCII string format using a radix-64 representation (A-Z, a-z, 0-9, +, /). It is essential for inline Data URIs, HTTP Basic Authentication headers, and email attachments.',
    howToPt: [
      'Cole o texto ou payload na área de entrada.',
      'Escolha a operação: Codificar (Encode) ou Decodificar (Decode).',
      'Ative a opção URL-Safe se o resultado for ser utilizado em parâmetros de URL (substitui + por - e / por _).',
      'Copie o resultado instantaneamente.'
    ],
    howToEn: [
      'Paste your string or payload into the input editor.',
      'Toggle operation: Encode or Decode.',
      'Enable URL-Safe mode to replace + with - and / with _ for web safety.',
      'Copy the encoded or decoded output.'
    ],
    faqs: [
      {
        qPt: 'Base64 é um método de criptografia?',
        qEn: 'Is Base64 considered encryption?',
        aPt: 'Não. Base64 é apenas um formato de codificação de dados, não oferecendo nenhuma confidencialidade ou segurança criptográfica. Qualquer pessoa pode decodificar uma string Base64 instantaneamente.',
        aEn: 'No. Base64 is an encoding representation, not encryption. It provides zero confidentiality, as anyone can decode it instantly.'
      }
    ]
  },

  'regex-tester': {
    titlePt: 'Testador de Expressões Regulares (Regex) Online com Explicação Sintática',
    titleEn: 'Online Regular Expression (Regex) Tester & Debugger',
    overviewPt: 'Expressões regulares (Regex) fornecem uma linguagem formal concisa e poderosa para localizar, validar e substituir padrões de texto. O StackKit Regex Tester avalia padrões em tempo real com suporte a flags (g, i, m, s, u), agrupamento de captura (capture groups) e detalhamento de correspondências.',
    overviewEn: 'Regular expressions provide a formal syntax for searching, validating, and manipulating text strings. StackKit Regex Tester provides real-time pattern matching with full flag toggling (g, i, m, s, u), named capture groups, and match highlighting.',
    howToPt: [
      'Insira seu padrão regex no campo de expressão.',
      'Ative as flags desejadas (Global, Insensível a maiúsculas, Multilinha, etc.).',
      'Cole o texto de teste na área principal para ver os destaques imediatos.',
      'Inspecione os grupos capturados na tabela detalhada.'
    ],
    howToEn: [
      'Enter your regular expression in the pattern field.',
      'Toggle flags (global, case-insensitive, multiline).',
      'Paste test text to see real-time highlighted match blocks.',
      'Inspect matched capture groups in the breakdown table.'
    ],
    faqs: [
      {
        qPt: 'Qual o motor de regex utilizado na ferramenta?',
        qEn: 'Which regex engine does this utility run?',
        aPt: 'A ferramenta utiliza o motor ECMAScript nativo do navegador, garantindo compatibilidade direta com código JavaScript, TypeScript e NodeJS.',
        aEn: 'It runs the browser\'s native ECMAScript RegExp engine, ensuring 100% fidelity with JavaScript, TypeScript, and Node.js environments.'
      }
    ]
  }
};

// Universal helper that guarantees rich, high-value publisher content for ANY tool in the system
export function getToolEditorialContent(tool, lang = 'pt') {
  if (!tool) return null;

  const specific = toolSpecificContent[tool.id];
  const cat = categoryGuides[tool.categoryId] || categoryGuides['utilities'];
  const isPt = lang === 'pt';

  const title = specific
    ? (isPt ? specific.titlePt : specific.titleEn)
    : (isPt
        ? `Guia Completo: Como Usar ${tool.name}`
        : `Complete Guide: How to Use ${tool.nameEn || tool.name}`);

  const overview = specific
    ? (isPt ? specific.overviewPt : specific.overviewEn)
    : (isPt
        ? `${tool.name} é uma ferramenta profissional desenvolvida pela StackKit para acelerar rotinas de desenvolvimento e análise técnica. ${tool.description}. Executa cálculos e transformações com máxima eficiência, garantindo conformidade com padrões da indústria e segurança absoluta por meio de processamento 100% no cliente.`
        : `${tool.nameEn || tool.name} is a professional developer utility engineered by StackKit to accelerate technical workflows. ${tool.descriptionEn || tool.description}. Designed for optimal performance, strict standards compliance, and client-side data privacy.`);

  const howTo = specific
    ? (isPt ? specific.howToPt : specific.howToEn)
    : (isPt
        ? [
            `Acesse a ferramenta ${tool.name} diretamente no StackKit DevStudio.`,
            'Configure os parâmetros de entrada conforme as necessidades do seu projeto ou teste.',
            'Visualize o resultado gerado ou formatado instantaneamente na área de trabalho.',
            'Copie a saída com um único clique para o seu ambiente de desenvolvimento ou documentação.'
          ]
        : [
            `Launch the ${tool.nameEn || tool.name} utility directly in StackKit DevStudio.`,
            'Adjust input options or parameters to suit your project specifications.',
            'Inspect formatted or computed output updated in real-time in the workspace.',
            'Copy the resulting output to your clipboard with one click for unit tests or documentation.'
          ]);

  const rawFaqs = specific ? specific.faqs : cat.commonFaq;
  const faqs = rawFaqs.map(f => ({
    q: isPt ? f.qPt : f.qEn,
    a: isPt ? f.aPt : f.aEn
  }));

  // Append privacy & client-side security FAQ if not already present
  faqs.push({
    q: isPt
      ? 'Meus dados e parâmetros digitados são armazenados ou enviados para servidores?'
      : 'Are my inputs and data stored or transmitted to remote servers?',
    a: isPt
      ? 'Não. O StackKit DevStudio foi construído com arquitetura Zero Server Storage. Toda a lógica de computação, validação e formatação é executada estritamente no motor JavaScript do seu navegador. Seus dados nunca deixam seu computador.'
      : 'No. StackKit DevStudio is built with Zero Server Storage architecture. All computations, validation routines, and transformations execute exclusively in your local browser JavaScript engine. Your data never leaves your machine.'
  });

  const categoryTitle = isPt ? cat.titlePt : cat.titleEn;
  const categoryIntro = isPt ? cat.introPt : cat.introEn;

  return {
    title,
    overview,
    howTo,
    faqs,
    categoryTitle,
    categoryIntro
  };
}
