import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, RefreshCw, Download, Check, Settings, Sparkles } from 'lucide-react';
import { generateRG } from '../../utils/brazilianAlgorithms';

export default function RgGenerator({ onCopy, lang = 'pt' }) {
  const { t } = useTranslation();
  const [rg, setRg] = useState('');
  const [mask, setMask] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [batchList, setBatchList] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (quantity === 1) {
      const newRg = generateRG(mask);
      setRg(newRg);
      setBatchList([]);
    } else {
      const list = [];
      for (let i = 0; i < quantity; i++) {
        list.push(generateRG(mask));
      }
      setBatchList(list);
      setRg(list[0]);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [mask, quantity]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy(t('tools.rg.copied'));
  };

  const handleDownload = () => {
    const content = quantity > 1 ? batchList.join('\n') : rg;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rgs_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (onCopy) onCopy(t('tools.common.fileDownloaded'));
  };

  return (
    <div className="workspace-grid">
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Settings size={16} />
            <span>{t('tools.rg.settings')}</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">{t('tools.common.formatting')}</label>
            <label className="form-switch">
              <span>{t('tools.rg.formatMaskDesc')}</span>
              <input
                type="checkbox"
                checked={mask}
                onChange={e => setMask(e.target.checked)}
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>{t('tools.common.quantityToGenerate')}</span>
              <span className="badge badge-emerald">{quantity} {quantity === 1 ? 'RG' : 'RGs'}</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
            />
          </div>

          <button className="btn-primary" onClick={handleGenerate} style={{ marginTop: 8 }}>
            <RefreshCw size={16} />
            <span>{t('tools.rg.generateBtn')}</span>
          </button>
        </div>
      </div>

      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sparkles size={16} />
            <span>{t('tools.rg.generated')}</span>
          </div>
          <div className="panel-actions">
            <button className="btn-secondary" onClick={() => handleCopy(quantity > 1 ? batchList.join('\n') : rg)}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? t('tools.common.copied') : t('tools.common.copy')}</span>
            </button>
            <button className="btn-icon" onClick={handleDownload} title={t('tools.common.downloadTxt')}>
              <Download size={15} />
            </button>
          </div>
        </div>

        <div className="panel-body">
          {quantity === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="result-box">
                <span className="result-box-value">{rg}</span>
                <button
                  className="btn-icon"
                  onClick={() => handleCopy(rg)}
                  title={t('tools.common.copy')}
                >
                  {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                </button>
              </div>

              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: 12.5,
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  🪪 Registro Geral (SSP)
                </div>
                {t('tools.rg.infoDesc')}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {batchList.length} RGs gerados:
              </div>
              <textarea
                readOnly
                className="batch-output"
                value={batchList.join('\n')}
                onClick={e => e.target.select()}
              />
            </div>
          )}
        </div>

        <div className="panel-footer">
          <span>{mask ? '12 caracteres' : '9 dígitos'}</span>
          <span>Padrão SSP</span>
        </div>
      </div>
    </div>
  );
}
