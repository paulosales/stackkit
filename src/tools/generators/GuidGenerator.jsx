import React, { useState, useEffect } from 'react';
import { Fingerprint, RefreshCw, Copy, Download, Check, Settings } from 'lucide-react';
import { generateUUID } from '../../utils/cryptoHelpers';

export default function GuidGenerator({ onCopy, lang = 'pt' }) {
  const [quantity, setQuantity] = useState(1);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [braces, setBraces] = useState(false);
  const [uuids, setUuids] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const list = [];
    for (let i = 0; i < quantity; i++) {
      list.push(generateUUID({ hyphens, uppercase, braces }));
    }
    setUuids(list);
  };

  useEffect(() => {
    handleGenerate();
  }, [quantity, hyphens, uppercase, braces]);

  const handleCopy = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy(quantity === 1 ? 'UUID copiado!' : `${quantity} UUIDs copiados!`);
  };

  const handleDownload = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    if (onCopy) onCopy('Arquivo baixado!');
  };

  return (
    <div className="workspace-grid">
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Settings size={16} />
            <span>Formato do GUID / UUID</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">
              <span>Quantidade</span>
              <span className="badge badge-cyan">{quantity} {quantity === 1 ? 'UUID' : 'UUIDs'}</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            <label className="form-switch">
              <span>Incluir hífens (8-4-4-4-12)</span>
              <input type="checkbox" checked={hyphens} onChange={e => setHyphens(e.target.checked)} />
            </label>

            <label className="form-switch">
              <span>Letras maiúsculas (UPPERCASE)</span>
              <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} />
            </label>

            <label className="form-switch">
              <span>Envolver em chaves {'{ ... }'}</span>
              <input type="checkbox" checked={braces} onChange={e => setBraces(e.target.checked)} />
            </label>
          </div>

          <button className="btn-primary" onClick={handleGenerate} style={{ marginTop: 8 }}>
            <RefreshCw size={16} />
            <span>Gerar Novos Identificadores</span>
          </button>
        </div>
      </div>

      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Fingerprint size={16} />
            <span>Identificadores Gerados</span>
          </div>
          <div className="panel-actions">
            <button className="btn-secondary" onClick={handleDownload} title="Baixar TXT">
              <Download size={14} />
              <span>Baixar</span>
            </button>
            <button className="btn-primary" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        <div className="panel-body">
          {quantity === 1 ? (
            <div className="result-box" style={{ fontSize: 16 }}>
              <span className="result-box-value" style={{ fontSize: 16 }}>{uuids[0]}</span>
              <button className="btn-icon" onClick={handleCopy}>
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              </button>
            </div>
          ) : (
            <textarea
              readOnly
              className="batch-output"
              value={uuids.join('\n')}
              onClick={e => e.target.select()}
            />
          )}

          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            fontSize: 12.5,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginTop: 8
          }}>
            Identificadores únicos universais padrão RFC 4122 Versão 4 gerados criptograficamente com 122 bits de entropia.
          </div>
        </div>

        <div className="panel-footer">
          <span>UUID v4 (RFC 4122)</span>
          <span>crypto.randomUUID()</span>
        </div>
      </div>
    </div>
  );
}
