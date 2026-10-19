import React, { useState } from 'react';
import { Binary, Copy, Check, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { utf8ToBase64, base64ToUtf8 } from '../../utils/cryptoHelpers';

const SAMPLE_TEXT = 'StackKit — Ferramentas modernas com suporte a caracteres especiais (ç, ã, é, ó) e emojis 🚀⚡🇧🇷';

export default function Base64Encoder({ onCopy, lang = 'pt' }) {
  const [direction, setDirection] = useState('encode'); // 'encode' or 'decode'
  const [urlSafe, setUrlSafe] = useState(false);
  const [inputVal, setInputVal] = useState(SAMPLE_TEXT);
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
      if (direction === 'encode') {
        const encoded = utf8ToBase64(inputVal, urlSafe);
        setOutputVal(encoded);
      } else {
        const decoded = base64ToUtf8(inputVal);
        setOutputVal(decoded);
      }
      setErrorMsg(null);
      if (onCopy) onCopy('Base64 processado!');
    } catch (e) {
      setErrorMsg('Erro: string Base64 inválida ou corrompida.');
    }
  };

  const toggleDirection = () => {
    const nextDir = direction === 'encode' ? 'decode' : 'encode';
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
          <Binary size={16} />
          <span>Base64 Encode / Decode (Texto UTF-8)</span>
        </div>
        <div className="panel-actions">
          <label className="form-switch" style={{ padding: '4px 10px', fontSize: 12, height: 32 }}>
            <span>URL-Safe (Base64url)</span>
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={e => setUrlSafe(e.target.checked)}
            />
          </label>

          <button className="btn-secondary" onClick={toggleDirection}>
            <span>{direction === 'encode' ? 'Texto → Base64' : 'Base64 → Texto'}</span>
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
              <span>{direction === 'encode' ? 'Texto Normal de Entrada' : 'Base64 de Entrada'}</span>
            </label>
            <textarea
              className="code-editor-area"
              style={{ minHeight: 340 }}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={direction === 'encode' ? 'Digite o texto a ser codificado...' : 'Cole o Base64 a ser decodificado...'}
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Resultado:</span>
              <button className="btn-icon" onClick={handleCopy} disabled={!outputVal} title="Copiar">
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
        <span>Codificação segura com TextEncoder / TextDecoder UTF-8</span>
        <span>Suporte total a acentos e emojis</span>
      </div>
    </div>
  );
}
