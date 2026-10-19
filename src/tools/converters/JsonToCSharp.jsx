import React, { useState, useEffect } from 'react';
import { FileCode, Copy, Download, Check, AlertCircle } from 'lucide-react';
import { jsonToCSharp } from '../../utils/formatters';

const SAMPLE_JSON = `{
  "id": 1042,
  "nome": "Paulo Rogério",
  "email": "paulo@empresa.com",
  "ativo": true,
  "salario": 8500.50,
  "criadoEm": "2026-10-18T14:30:00Z",
  "habilidades": ["React", "TypeScript", "C#", "SQL"],
  "endereco": {
    "logradouro": "Av. Paulista, 1000",
    "cidade": "São Paulo",
    "uf": "SP",
    "cep": "01310-100"
  }
}`;

export default function JsonToCSharp({ onCopy, lang = 'pt' }) {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [rootClassName, setRootClassName] = useState('Usuario');
  const [attribute, setAttribute] = useState('system.text'); // 'system.text', 'newtonsoft', 'none'
  const [nullable, setNullable] = useState(true);
  const [csharpOutput, setCsharpOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (!jsonInput.trim()) {
        setCsharpOutput('');
        setErrorMsg(null);
        return;
      }
      const code = jsonToCSharp(jsonInput, { rootClassName, attribute, nullable });
      setCsharpOutput(code);
      setErrorMsg(null);
    } catch (e) {
      setErrorMsg(e.message);
    }
  }, [jsonInput, rootClassName, attribute, nullable]);

  const handleCopy = () => {
    navigator.clipboard.writeText(csharpOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Código C# copiado!');
  };

  const handleDownload = () => {
    const blob = new Blob([csharpOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rootClassName || 'Model'}.cs`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="workspace-grid">
      {/* Input JSON */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span>JSON de Entrada</span>
          </div>
          <div className="panel-actions">
            <button
              className="btn-ghost"
              style={{ fontSize: 11, padding: '2px 8px' }}
              onClick={() => setJsonInput(SAMPLE_JSON)}
            >
              Exemplo
            </button>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome da Classe Raiz</label>
              <input
                type="text"
                value={rootClassName}
                onChange={e => setRootClassName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="Ex: Usuario"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Atributos de Serialização</label>
              <select value={attribute} onChange={e => setAttribute(e.target.value)}>
                <option value="system.text">System.Text.Json ([JsonPropertyName])</option>
                <option value="newtonsoft">Newtonsoft.Json ([JsonProperty])</option>
                <option value="none">Nenhum (POCO puro)</option>
              </select>
            </div>
          </div>

          <label className="form-switch" style={{ marginBottom: 4 }}>
            <span>Tipos Anuláveis (Nullable Reference Types: string?)</span>
            <input
              type="checkbox"
              checked={nullable}
              onChange={e => setNullable(e.target.checked)}
            />
          </label>

          <textarea
            className="code-editor-area"
            style={{ minHeight: 280 }}
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            placeholder="Cole seu JSON aqui..."
            spellCheck="false"
          />
        </div>
      </div>

      {/* Output C# */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <FileCode size={16} />
            <span>Classes C# Geradas</span>
          </div>
          <div className="panel-actions">
            <button className="btn-secondary" onClick={handleDownload} title="Baixar arquivo .cs">
              <Download size={14} />
              <span>Baixar .cs</span>
            </button>
            <button className="btn-primary" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar C#'}</span>
            </button>
          </div>
        </div>

        <div className="panel-body">
          {errorMsg ? (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          ) : (
            <textarea
              readOnly
              className="code-editor-area"
              style={{ minHeight: 380, color: 'var(--accent-cyan)' }}
              value={csharpOutput}
              onClick={e => e.target.select()}
            />
          )}
        </div>

        <div className="panel-footer">
          <span>.NET 8 / C# 12 compatível</span>
          <span>Fortemente tipado</span>
        </div>
      </div>
    </div>
  );
}
