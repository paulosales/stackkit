import React, { useState } from 'react';
import { FileCode2, Copy, Download, Trash2, Check, AlertCircle } from 'lucide-react';
import { formatXml, minifyXml } from '../../utils/formatters';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<note date="2026-10-18">
<to>Equipe de Desenvolvimento</to>
<from>StackKit</from>
<heading>Lembrete</heading>
<body>Ferramentas gratuitas e rápidas para o dia a dia!</body>
<items>
<item id="1">Formatação de XML</item>
<item id="2">Validação sintática</item>
</items>
</note>`;

export default function XmlFormatter({ onCopy, lang = 'pt' }) {
  const [inputXml, setInputXml] = useState(SAMPLE_XML);
  const [indent, setIndent] = useState('2');
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const validateSyntax = (xml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return parserError.textContent;
    }
    return null;
  };

  const handleFormat = () => {
    const err = validateSyntax(inputXml);
    if (err) {
      setErrorMsg(err.split('\n')[0]);
      return;
    }
    const formatted = formatXml(inputXml, indent);
    setInputXml(formatted);
    setErrorMsg(null);
    if (onCopy) onCopy('XML formatado com sucesso!');
  };

  const handleMinify = () => {
    const err = validateSyntax(inputXml);
    if (err) {
      setErrorMsg(err.split('\n')[0]);
      return;
    }
    const min = minifyXml(inputXml);
    setInputXml(min);
    setErrorMsg(null);
    if (onCopy) onCopy('XML minificado!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('XML copiado!');
  };

  const handleDownload = () => {
    const blob = new Blob([inputXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document_${Date.now()}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileCode2 size={16} />
          <span>Formatador e Validador de XML</span>
        </div>
        <div className="panel-actions">
          <select
            value={indent}
            onChange={e => setIndent(e.target.value)}
            style={{ padding: '4px 8px', fontSize: 12, height: 32 }}
          >
            <option value="2">2 Espaços</option>
            <option value="4">4 Espaços</option>
            <option value="tab">Tabulação (Tab)</option>
          </select>

          <button className="btn-secondary" onClick={handleMinify}>
            Minificar
          </button>
          <button className="btn-primary" onClick={handleFormat}>
            Formatar
          </button>
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          <button className="btn-icon" onClick={handleDownload} title="Baixar arquivo XML">
            <Download size={15} />
          </button>
          <button className="btn-icon" onClick={() => setInputXml('')} title="Limpar">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="panel-body">
        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13
          }}>
            <AlertCircle size={16} />
            <span><strong>Erro de Sintaxe XML:</strong> {errorMsg}</span>
          </div>
        )}

        <textarea
          className="code-editor-area"
          style={{ minHeight: 380 }}
          value={inputXml}
          onChange={e => {
            setInputXml(e.target.value);
            setErrorMsg(null);
          }}
          placeholder="Cole seu código XML aqui..."
          spellCheck="false"
        />
      </div>

      <div className="panel-footer">
        <span>{inputXml.length} caracteres · {inputXml.split('\n').length} linhas</span>
        <button
          className="btn-ghost"
          style={{ padding: '2px 8px', fontSize: 11 }}
          onClick={() => setInputXml(SAMPLE_XML)}
        >
          Carregar Exemplo XML
        </button>
      </div>
    </div>
  );
}
