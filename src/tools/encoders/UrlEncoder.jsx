import React, { useState } from 'react';
import { Link2, Copy, Check, ArrowLeftRight } from 'lucide-react';

const SAMPLE_URL = 'https://api.empresa.com.br/v1/usuarios?busca=desenvolvedor%20senior&cidade=S%C3%A3o%20Paulo&ativo=true&tags=react,vite,csharp';

export default function UrlEncoder({ onCopy, lang = 'pt' }) {
  const [inputText, setInputText] = useState(SAMPLE_URL);
  const [mode, setMode] = useState('component'); // 'component' or 'full'
  const [copiedKey, setCopiedKey] = useState(null);

  const encodedComponent = encodeURIComponent(inputText);
  const encodedFull = encodeURI(inputText);
  const decoded = (() => {
    try {
      return decodeURIComponent(inputText);
    } catch (e) {
      return 'Erro na decodificação: sequência malformada';
    }
  })();

  // Extract query parameters
  const extractParams = () => {
    try {
      const url = new URL(inputText.startsWith('http') ? inputText : `https://example.com?${inputText}`);
      const entries = Array.from(url.searchParams.entries());
      return entries;
    } catch (e) {
      return [];
    }
  };

  const queryParams = extractParams();

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) onCopy('Copiado!');
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Link2 size={16} />
          <span>Codificador e Decodificador de URL</span>
        </div>
      </div>

      <div className="panel-body">
        <div className="form-group">
          <label className="form-label">Texto ou URL de Entrada</label>
          <textarea
            rows={3}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Digite ou cole uma URL ou texto para codificar/decodificar..."
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          {/* Decoded */}
          <div className="form-group">
            <div className="form-label">
              <span>Texto Decodificado (decodeURIComponent):</span>
              <button className="btn-icon" onClick={() => handleCopy('dec', decoded)} title="Copiar">
                {copiedKey === 'dec' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="result-box" style={{ fontSize: 13 }}>
              <span style={{ wordBreak: 'break-all' }}>{decoded}</span>
            </div>
          </div>

          {/* Encoded Component */}
          <div className="form-group">
            <div className="form-label">
              <span>Codificado como Componente (encodeURIComponent):</span>
              <button className="btn-icon" onClick={() => handleCopy('comp', encodedComponent)} title="Copiar">
                {copiedKey === 'comp' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="result-box" style={{ fontSize: 13 }}>
              <span style={{ wordBreak: 'break-all' }}>{encodedComponent}</span>
            </div>
          </div>

          {/* Encoded Full URL */}
          <div className="form-group">
            <div className="form-label">
              <span>URL Completa (encodeURI):</span>
              <button className="btn-icon" onClick={() => handleCopy('full', encodedFull)} title="Copiar">
                {copiedKey === 'full' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="result-box" style={{ fontSize: 13 }}>
              <span style={{ wordBreak: 'break-all' }}>{encodedFull}</span>
            </div>
          </div>

          {/* Query Parameters Visualizer */}
          {queryParams.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                Parâmetros de Query Encontrados ({queryParams.length}):
              </div>
              <div style={{
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)', overflow: 'hidden'
              }}>
                {queryParams.map(([k, v], idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)',
                      fontSize: 12.5, fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{k}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="panel-footer">
        <span>RFC 3986 Standard URI Encoding</span>
        <span>Visualizador de query parameters</span>
      </div>
    </div>
  );
}
