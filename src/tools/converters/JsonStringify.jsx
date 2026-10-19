import React, { useState } from 'react';
import { Quote, Copy, Check, ArrowLeftRight, AlertCircle } from 'lucide-react';

const SAMPLE_JSON = `{
  "database": "production_cluster",
  "port": 5432,
  "ssl": true,
  "credentials": {
    "user": "stackkit_admin",
    "timeout": 30
  }
}`;

export default function JsonStringify({ onCopy, lang = 'pt' }) {
  const [direction, setDirection] = useState('stringify'); // 'stringify' or 'unescape'
  const [inputVal, setInputVal] = useState(SAMPLE_JSON);
  const [outputVal, setOutputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!inputVal.trim()) {
      setOutputVal('');
      setErrorMsg(null);
      return;
    }
    try {
      if (direction === 'stringify') {
        const parsed = JSON.parse(inputVal);
        const minified = JSON.stringify(parsed);
        const escaped = JSON.stringify(minified);
        setOutputVal(escaped);
      } else {
        // Unescape string back to json
        let str = inputVal.trim();
        if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
          str = JSON.parse(str);
        } else {
          str = str.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        const parsed = typeof str === 'string' ? JSON.parse(str) : str;
        setOutputVal(JSON.stringify(parsed, null, 2));
      }
      setErrorMsg(null);
      if (onCopy) onCopy('Transformação realizada!');
    } catch (e) {
      setErrorMsg('Erro: ' + e.message);
    }
  };

  const toggleDirection = () => {
    const nextDir = direction === 'stringify' ? 'unescape' : 'stringify';
    setDirection(nextDir);
    if (outputVal) {
      setInputVal(outputVal);
      setOutputVal('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Resultado copiado!');
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Quote size={16} />
          <span>JSON ↔ String (Stringify & Unescape)</span>
        </div>
        <div className="panel-actions">
          <button className="btn-secondary" onClick={toggleDirection}>
            <span>{direction === 'stringify' ? 'JSON → String com Escape' : 'String Escapada → JSON'}</span>
          </button>
          <button className="btn-primary" onClick={handleProcess}>
            Processar
          </button>
        </div>
      </div>

      <div className="panel-body">
        {errorMsg && (
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="workspace-grid" style={{ gap: 16 }}>
          <div className="form-group">
            <label className="form-label">
              <span>{direction === 'stringify' ? 'JSON Objeto de Entrada' : 'String com Escape de Entrada'}</span>
            </label>
            <textarea
              className="code-editor-area"
              style={{ minHeight: 340 }}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={direction === 'stringify' ? 'Cole o JSON aqui...' : 'Cole a string escapada (ex: "{\\"key\\":\\"value\\"}")'}
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Resultado:</span>
              <button
                className="btn-icon"
                onClick={handleCopy}
                disabled={!outputVal}
                title="Copiar"
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <textarea
              readOnly
              className="code-editor-area"
              style={{ minHeight: 340, color: 'var(--accent-cyan)' }}
              value={outputVal}
              placeholder="O resultado aparecerá aqui..."
            />
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <span>Ideal para variáveis de ambiente .env e strings embutidas em código</span>
        <span>Escape e des-escape seguro</span>
      </div>
    </div>
  );
}
