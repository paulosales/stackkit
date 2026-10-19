import React, { useState, Suspense, lazy } from 'react';
import { Star, Share2, ArrowLeft, RefreshCw, Layers, Loader2 } from 'lucide-react';
import { tools, categories, findToolByIdOrAlias } from '../data/toolsData';
import DynamicIcon from './DynamicIcon';

// Brazil Tools - Lazy Loaded chunks
const CpfGenerator = lazy(() => import('../tools/brazil/CpfGenerator'));
const CnpjGenerator = lazy(() => import('../tools/brazil/CnpjGenerator'));
const RgGenerator = lazy(() => import('../tools/brazil/RgGenerator'));
const DocumentGenerator = lazy(() => import('../tools/brazil/DocumentGenerator'));
const CpfCnpjValidator = lazy(() => import('../tools/brazil/CpfCnpjValidator'));
const PixGenerator = lazy(() => import('../tools/brazil/PixGenerator'));
const PersonGenerator = lazy(() => import('../tools/brazil/PersonGenerator'));
const OvertimeCalculator = lazy(() => import('../tools/brazil/OvertimeCalculator'));

// Generator Tools - Lazy Loaded chunks
const PaletteGenerator = lazy(() => import('../tools/generators/PaletteGenerator'));
const QrCodeGenerator = lazy(() => import('../tools/generators/QrCodeGenerator'));
const PasswordGenerator = lazy(() => import('../tools/generators/PasswordGenerator'));
const WhatsAppLinkGenerator = lazy(() => import('../tools/generators/WhatsAppLinkGenerator'));
const CreditCardGenerator = lazy(() => import('../tools/generators/CreditCardGenerator'));
const HashGenerator = lazy(() => import('../tools/generators/HashGenerator'));
const GuidGenerator = lazy(() => import('../tools/generators/GuidGenerator'));
const LoremIpsumGenerator = lazy(() => import('../tools/generators/LoremIpsumGenerator'));

// Formatter Tools - Lazy Loaded chunks
const JsonFormatter = lazy(() => import('../tools/formatters/JsonFormatter'));
const XmlFormatter = lazy(() => import('../tools/formatters/XmlFormatter'));
const SqlFormatter = lazy(() => import('../tools/formatters/SqlFormatter'));

// Converter Tools - Lazy Loaded chunks
const JsonToCSharp = lazy(() => import('../tools/converters/JsonToCSharp'));
const XmlJsonConverter = lazy(() => import('../tools/converters/XmlJsonConverter'));
const CsvJsonConverter = lazy(() => import('../tools/converters/CsvJsonConverter'));
const JsonYamlConverter = lazy(() => import('../tools/converters/JsonYamlConverter'));
const JsonStringify = lazy(() => import('../tools/converters/JsonStringify'));
const Base64FileConverter = lazy(() => import('../tools/converters/Base64FileConverter'));
const TimestampConverter = lazy(() => import('../tools/converters/TimestampConverter'));
const ColorConverter = lazy(() => import('../tools/converters/ColorConverter'));
const BaseConverter = lazy(() => import('../tools/converters/BaseConverter'));

// Encoders - Lazy Loaded chunks
const UrlEncoder = lazy(() => import('../tools/encoders/UrlEncoder'));
const Base64Encoder = lazy(() => import('../tools/encoders/Base64Encoder'));
const JwtInspector = lazy(() => import('../tools/encoders/JwtInspector'));

// Network & Time - Lazy Loaded chunks
const WorldTimeBuddy = lazy(() => import('../tools/network/WorldTimeBuddy'));
const MyIp = lazy(() => import('../tools/network/MyIp'));

// Utilities - Lazy Loaded chunks
const HtmlViewer = lazy(() => import('../tools/utilities/HtmlViewer'));
const StringUtilities = lazy(() => import('../tools/utilities/StringUtilities'));
const RegexTester = lazy(() => import('../tools/utilities/RegexTester'));
const TextDiff = lazy(() => import('../tools/utilities/TextDiff'));
const CronExplainer = lazy(() => import('../tools/utilities/CronExplainer'));
const MarkdownPreview = lazy(() => import('../tools/utilities/MarkdownPreview'));
const CharacterCounter = lazy(() => import('../tools/utilities/CharacterCounter'));

// Sleek loading skeleton for lazy-loaded tools
function ToolSkeletonLoader() {
  return (
    <div className="tool-skeleton-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 340,
      gap: 16,
      color: 'var(--text-muted)'
    }}>
      <Loader2 size={32} className="animate-spin text-cyan" />
      <span style={{ fontSize: 14, fontWeight: 500 }}>Carregando ferramenta...</span>
    </div>
  );
}

export default function ToolLayout({
  toolId,
  onGoBack,
  favorites = [],
  onToggleFavorite,
  onToast,
  lang = 'pt'
}) {
  const tool = findToolByIdOrAlias(toolId);
  const [resetKey, setResetKey] = useState(0);

  if (!tool) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Ferramenta não encontrada</h2>
        <button className="btn-primary" onClick={onGoBack} style={{ marginTop: 16 }}>
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === tool.categoryId);
  const isFav = favorites.includes(tool.id);

  const handleShare = () => {
    const url = `${window.location.origin}/#${tool.id}`;
    navigator.clipboard.writeText(url);
    if (onToast) onToast('Link da ferramenta copiado para a área de transferência!');
  };

  const renderToolComponent = () => {
    const props = { key: resetKey, onCopy: onToast, lang };

    switch (tool.id) {
      // Brazil
      case 'cpf-generator':
      case 'gerador-de-cpf':
        return <CpfGenerator {...props} />;
      case 'cnpj-generator':
      case 'gerador-de-cnpj':
        return <CnpjGenerator {...props} />;
      case 'rg-generator':
      case 'gerador-de-rg':
        return <RgGenerator {...props} />;
      case 'document-generator':
      case 'gerar-documentos':
        return <DocumentGenerator {...props} />;
      case 'cpf-cnpj-validator':
      case 'validar-cpf-cnpj':
        return <CpfCnpjValidator {...props} />;
      case 'pix-generator':
      case 'gerador-pix':
        return <PixGenerator {...props} />;
      case 'fake-person-generator':
      case 'gerar-pessoa':
        return <PersonGenerator {...props} />;
      case 'overtime-calculator':
      case 'calculo-hora-extra':
        return <OvertimeCalculator {...props} />;

      // Generators
      case 'color-palette-generator':
      case 'gerador-paleta-cores':
        return <PaletteGenerator {...props} />;
      case 'qr-code-generator':
      case 'gerar-qrcode':
        return <QrCodeGenerator {...props} />;
      case 'password-generator':
      case 'gerar-senha':
        return <PasswordGenerator {...props} />;
      case 'whatsapp-link-generator':
      case 'link-whatsapp':
        return <WhatsAppLinkGenerator {...props} />;
      case 'credit-card-generator':
      case 'gerador-cartao-de-credito':
        return <CreditCardGenerator {...props} />;
      case 'hash-generator':
      case 'gerar-hash':
        return <HashGenerator {...props} />;
      case 'guid-uuid-generator':
      case 'guid-generator':
        return <GuidGenerator {...props} />;
      case 'lorem-ipsum-generator':
      case 'lorem-ipsum':
        return <LoremIpsumGenerator {...props} />;

      // Formatters
      case 'json-formatter':
      case 'formatar-json':
        return <JsonFormatter {...props} />;
      case 'xml-formatter':
      case 'formatar-xml':
        return <XmlFormatter {...props} />;
      case 'sql-formatter':
      case 'formatar-sql':
        return <SqlFormatter {...props} />;

      // Converters
      case 'json-to-csharp':
      case 'conversor-json-class':
        return <JsonToCSharp {...props} />;
      case 'xml-to-json':
      case 'conversor-xml-json':
        return <XmlJsonConverter {...props} />;
      case 'csv-to-json':
      case 'conversor-csv-json':
        return <CsvJsonConverter {...props} />;
      case 'json-to-yaml':
      case 'conversor-json-yaml':
        return <JsonYamlConverter {...props} />;
      case 'json-stringify':
        return <JsonStringify {...props} />;
      case 'base64-to-file':
      case 'conversor-base64-arquivo':
        return <Base64FileConverter {...props} />;
      case 'timestamp-converter':
        return <TimestampConverter {...props} />;
      case 'color-converter':
      case 'conversor-cores':
        return <ColorConverter {...props} />;
      case 'number-base-converter':
      case 'conversor-base-numerica':
        return <BaseConverter {...props} />;

      // Encoders
      case 'url-encoder-decoder':
      case 'url-encode-decode':
        return <UrlEncoder {...props} />;
      case 'base64-encoder-decoder':
      case 'base64-encode-decode':
        return <Base64Encoder {...props} />;
      case 'jwt-inspector':
      case 'jwt-encode-decode':
        return <JwtInspector {...props} />;

      // Network & Time
      case 'world-time-buddy':
        return <WorldTimeBuddy {...props} />;
      case 'my-ip-address':
      case 'meu-ip':
        return <MyIp {...props} />;

      // Utilities
      case 'html-viewer':
      case 'visualizar-html':
        return <HtmlViewer {...props} />;
      case 'string-utilities':
        return <StringUtilities {...props} />;
      case 'regex-tester':
      case 'testador-regex':
        return <RegexTester {...props} />;
      case 'text-diff':
      case 'comparar-textos':
        return <TextDiff {...props} />;
      case 'cron-expression-explainer':
      case 'explicador-cron':
        return <CronExplainer {...props} />;
      case 'markdown-previewer':
      case 'preview-markdown':
        return <MarkdownPreview {...props} />;
      case 'character-counter':
      case 'contador-de-caracteres':
        return <CharacterCounter {...props} />;

      default:
        return <div>Ferramenta em desenvolvimento.</div>;
    }
  };

  return (
    <div className="tool-workspace">
      {/* Studio Tool Header */}
      <div className="tool-header">
        <div className="tool-header-left">
          <div className="tool-header-icon">
            <DynamicIcon name={tool.icon} size={26} />
          </div>

          <div className="tool-header-meta">
            <div className="tool-header-title-row">
              <h1 className="tool-header-title">
                {lang === 'pt' ? tool.name : (tool.nameEn || tool.name)}
              </h1>
              {category && (
                <span className="badge badge-cyan">
                  {lang === 'pt' ? category.name : (category.nameEn || category.name)}
                </span>
              )}
            </div>
            <p className="tool-header-desc">
              {lang === 'pt' ? tool.description : (tool.descriptionEn || tool.description)}
            </p>
          </div>
        </div>

        <div className="tool-header-actions">
          <button
            className={`btn-secondary btn-icon ${isFav ? 'btn-favorite-active' : ''}`}
            onClick={() => onToggleFavorite(tool.id)}
            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star size={16} fill={isFav ? '#f59e0b' : 'none'} color={isFav ? '#f59e0b' : 'currentColor'} />
          </button>

          <button
            className="btn-secondary btn-icon"
            onClick={handleShare}
            title="Compartilhar ferramenta"
          >
            <Share2 size={16} />
          </button>

          <button
            className="btn-secondary btn-icon"
            onClick={() => setResetKey(k => k + 1)}
            title="Limpar / Recarregar estado"
          >
            <RefreshCw size={16} />
          </button>

          <button
            className="btn-secondary"
            onClick={onGoBack}
            title="Voltar ao catálogo geral"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Catálogo</span>
          </button>
        </div>
      </div>

      {/* Tool Content Body with Suspense for on-demand lazy loading */}
      <div className="tool-content">
        <Suspense fallback={<ToolSkeletonLoader />}>
          {renderToolComponent()}
        </Suspense>
      </div>
    </div>
  );
}
