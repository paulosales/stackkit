import React, { useState } from 'react';
import { Star, Share2, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import { tools, categories } from '../data/toolsData';
import DynamicIcon from './DynamicIcon';

// Brazil Tools
import CpfGenerator from '../tools/brazil/CpfGenerator';
import CnpjGenerator from '../tools/brazil/CnpjGenerator';
import RgGenerator from '../tools/brazil/RgGenerator';
import DocumentGenerator from '../tools/brazil/DocumentGenerator';
import CpfCnpjValidator from '../tools/brazil/CpfCnpjValidator';
import PixGenerator from '../tools/brazil/PixGenerator';
import PersonGenerator from '../tools/brazil/PersonGenerator';
import OvertimeCalculator from '../tools/brazil/OvertimeCalculator';

// Generator Tools
import PaletteGenerator from '../tools/generators/PaletteGenerator';
import QrCodeGenerator from '../tools/generators/QrCodeGenerator';
import PasswordGenerator from '../tools/generators/PasswordGenerator';
import WhatsAppLinkGenerator from '../tools/generators/WhatsAppLinkGenerator';
import CreditCardGenerator from '../tools/generators/CreditCardGenerator';
import HashGenerator from '../tools/generators/HashGenerator';
import GuidGenerator from '../tools/generators/GuidGenerator';
import LoremIpsumGenerator from '../tools/generators/LoremIpsumGenerator';

// Formatter Tools
import JsonFormatter from '../tools/formatters/JsonFormatter';
import XmlFormatter from '../tools/formatters/XmlFormatter';
import SqlFormatter from '../tools/formatters/SqlFormatter';

// Converter Tools
import JsonToCSharp from '../tools/converters/JsonToCSharp';
import XmlJsonConverter from '../tools/converters/XmlJsonConverter';
import CsvJsonConverter from '../tools/converters/CsvJsonConverter';
import JsonYamlConverter from '../tools/converters/JsonYamlConverter';
import JsonStringify from '../tools/converters/JsonStringify';
import Base64FileConverter from '../tools/converters/Base64FileConverter';
import TimestampConverter from '../tools/converters/TimestampConverter';
import ColorConverter from '../tools/converters/ColorConverter';
import BaseConverter from '../tools/converters/BaseConverter';

// Encoders
import UrlEncoder from '../tools/encoders/UrlEncoder';
import Base64Encoder from '../tools/encoders/Base64Encoder';
import JwtInspector from '../tools/encoders/JwtInspector';

// Network
import MyIp from '../tools/network/MyIp';

// Utilities
import HtmlViewer from '../tools/utilities/HtmlViewer';
import StringUtilities from '../tools/utilities/StringUtilities';
import RegexTester from '../tools/utilities/RegexTester';
import TextDiff from '../tools/utilities/TextDiff';
import CronExplainer from '../tools/utilities/CronExplainer';
import MarkdownPreview from '../tools/utilities/MarkdownPreview';
import CharacterCounter from '../tools/utilities/CharacterCounter';

export default function ToolLayout({
  toolId,
  onGoBack,
  favorites = [],
  onToggleFavorite,
  onToast,
  lang = 'pt'
}) {
  const tool = tools.find(t => t.id === toolId);
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
      case 'gerador-de-cpf': return <CpfGenerator {...props} />;
      case 'gerador-de-cnpj': return <CnpjGenerator {...props} />;
      case 'gerador-de-rg': return <RgGenerator {...props} />;
      case 'gerar-documentos': return <DocumentGenerator {...props} />;
      case 'validar-cpf-cnpj': return <CpfCnpjValidator {...props} />;
      case 'gerador-pix': return <PixGenerator {...props} />;
      case 'gerar-pessoa': return <PersonGenerator {...props} />;
      case 'calculo-hora-extra': return <OvertimeCalculator {...props} />;

      // Generators
      case 'gerador-paleta-cores': return <PaletteGenerator {...props} />;
      case 'gerar-qrcode': return <QrCodeGenerator {...props} />;
      case 'gerar-senha': return <PasswordGenerator {...props} />;
      case 'link-whatsapp': return <WhatsAppLinkGenerator {...props} />;
      case 'gerador-cartao-de-credito': return <CreditCardGenerator {...props} />;
      case 'gerar-hash': return <HashGenerator {...props} />;
      case 'guid-generator': return <GuidGenerator {...props} />;
      case 'lorem-ipsum': return <LoremIpsumGenerator {...props} />;

      // Formatters
      case 'formatar-json': return <JsonFormatter {...props} />;
      case 'formatar-xml': return <XmlFormatter {...props} />;
      case 'formatar-sql': return <SqlFormatter {...props} />;

      // Converters
      case 'conversor-json-class': return <JsonToCSharp {...props} />;
      case 'conversor-xml-json': return <XmlJsonConverter {...props} />;
      case 'conversor-csv-json': return <CsvJsonConverter {...props} />;
      case 'conversor-json-yaml': return <JsonYamlConverter {...props} />;
      case 'json-stringify': return <JsonStringify {...props} />;
      case 'conversor-base64-arquivo': return <Base64FileConverter {...props} />;
      case 'timestamp-converter': return <TimestampConverter {...props} />;
      case 'conversor-cores': return <ColorConverter {...props} />;
      case 'conversor-base-numerica': return <BaseConverter {...props} />;

      // Encoders
      case 'url-encode-decode': return <UrlEncoder {...props} />;
      case 'base64-encode-decode': return <Base64Encoder {...props} />;
      case 'jwt-encode-decode': return <JwtInspector {...props} />;

      // Network
      case 'meu-ip': return <MyIp {...props} />;

      // Utilities
      case 'visualizar-html': return <HtmlViewer {...props} />;
      case 'string-utilities': return <StringUtilities {...props} />;
      case 'testador-regex': return <RegexTester {...props} />;
      case 'comparar-textos': return <TextDiff {...props} />;
      case 'explicador-cron': return <CronExplainer {...props} />;
      case 'preview-markdown': return <MarkdownPreview {...props} />;
      case 'contador-de-caracteres': return <CharacterCounter {...props} />;

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
                <span className="badge badge-cyan">{category.name}</span>
              )}
            </div>
            <p className="tool-header-desc">
              {lang === 'pt' ? tool.description : (tool.descriptionEn || tool.description)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="tool-header-actions">
          <button
            className={`btn-icon ${isFav ? 'active' : ''}`}
            onClick={() => onToggleFavorite(tool.id)}
            title={isFav ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          >
            <Star size={18} fill={isFav ? 'var(--accent-amber)' : 'none'} color={isFav ? 'var(--accent-amber)' : 'currentColor'} />
          </button>

          <button
            className="btn-icon"
            onClick={handleShare}
            title="Compartilhar Link da Ferramenta"
          >
            <Share2 size={17} />
          </button>

          <button
            className="btn-icon"
            onClick={() => setResetKey(k => k + 1)}
            title="Limpar / Reiniciar Ferramenta"
          >
            <RefreshCw size={17} />
          </button>

          <button className="btn-secondary" onClick={onGoBack}>
            <ArrowLeft size={15} />
            <span>Voltar ao Catálogo</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool Content */}
      <div style={{ marginTop: 4 }}>
        {renderToolComponent()}
      </div>
    </div>
  );
}
