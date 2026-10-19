import React, { useState } from 'react';
import { Braces, Copy, Download, Trash2, Check, AlertCircle, ArrowDownAZ } from 'lucide-react';
import { formatJson, minifyJson } from '../../utils/formatters';

const SAMPLE_JSON = `{
  "nome": "StackKit DevStudio",
  "versao": "2.0.0",
  "ativo": true,
  "ferramentas": 37,
  "tecnologias": ["React 19", "Vite", "Web Crypto API"],
  "autor": {
    "empresa": "StackKit Brasil",
    "pais": "BR"
  }
}`;

export default function JsonFormatter({ onCopy, lang = 'pt' }) {
  const [inputJson, setInputJson] = useState(SAMPLE_JSON);
  const [indent, setIndent] = useState('2');
  const [alphabetize, setAlphabetize] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const formatted = formatJson(inputJson, indent, alphabetize);
      setInputJson(formatted);
      setErrorMsg(null);
      if (onCopy) onCopy('JSON formatado com sucesso!');
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  const handleMinify = () => {
    try {
      const min = minifyJson(inputJson);
      setInputJson(min);
      setErrorMsg(null);
      if (onCopy) onCopy('JSON minificado!');
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('JSON copiado!');
  };

  const handleDownload = () => {
    const blob = new Blob([inputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Braces size={16} />
          <span>Formatador e Validador de JSON</span>
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

          <label className="form-switch" style={{ padding: '4px 8px', fontSize: 12, height: 32 }}>
            <ArrowDownAZ size={14} />
            <span>Ordenar Chaves</span>
            <input
              type="checkbox"
              checked={alphabetize}
              onChange={e => setAlphabetize(e.target.checked)}
            />
          </label>

          <button className="btn-secondary" onClick={handleMinify} title="Compactar para uma linha">
            Minificar
          </button>
          <button className="btn-primary" onClick={handleFormat} title="Formatar e identar">
            Formatar
          </button>
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          <button className="btn-icon" onClick={handleDownload} title="Baixar arquivo JSON">
            <Download size={15} />
          </button>
          <button className="btn-icon" onClick={() => setInputJson('')} title="Limpar">
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
            <span><strong>JSON Inválido:</strong> {errorMsg}</span>
          </div>
        )}

        <textarea
          className="code-editor-area"
          style={{ minHeight: 380 }}
          value={inputJson}
          onChange={e => {
            setInputJson(e.target.value);
            setErrorMsg(null);
          }}
          placeholder="Cole seu JSON aqui..."
          spellCheck="false"
        />
      </div>

      <div className="panel-footer">
        <span>{inputJson.length} caracteres · {inputJson.split('\n').length} linhas</span>
        <button
          className="btn-ghost"
          style={{ padding: '2px 8px', fontSize: 11 }}
          onClick={() => setInputJson(SAMPLE_JSON)}
        >
          Carregar Exemplo
        </button>
      </div>
    </div>
  );
}
