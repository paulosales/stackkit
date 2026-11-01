import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, RefreshCw, Download, Check, ShieldCheck, FileBadge, Sparkles, Hash, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateNB, formatNB, validateNB } from '../../utils/brazilianAlgorithms';

export default function NbGenerator({ onCopy }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'validator'

  // Generator State
  const [nbRaw, setNbRaw] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [batchList, setBatchList] = useState([]);
  const [copiedFormatted, setCopiedFormatted] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  // Validator State
  const [validateInput, setValidateInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  // Initial generation
  const handleGenerate = useCallback(() => {
    if (quantity === 1) {
      const raw = generateNB(false);
      setNbRaw(raw);
      setBatchList([]);
    } else {
      const list = [];
      for (let i = 0; i < quantity; i++) {
        list.push(generateNB(false));
      }
      setBatchList(list);
      setNbRaw(list[0]);
    }
  }, [quantity]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Copy helper
  const copyToClipboard = (text, type = 'formatted') => {
    navigator.clipboard.writeText(text);
    if (type === 'formatted') {
      setCopiedFormatted(true);
      setTimeout(() => setCopiedFormatted(false), 1500);
    } else if (type === 'raw') {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 1500);
    } else if (type === 'batch') {
      setCopiedBatch(true);
      setTimeout(() => setCopiedBatch(false), 1500);
    }
    if (onCopy) {
      onCopy(t('tools.nb.toasts.copied', { text }));
    }
  };

  // Keyboard shortcut listener for 'g', 'ctrl+c', 'alt+c'
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleGenerate();
      } else if (e.altKey && e.key.toLowerCase() === 'c' && nbRaw) {
        e.preventDefault();
        copyToClipboard(formatNB(nbRaw), 'formatted');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && nbRaw && !window.getSelection()?.toString()) {
        e.preventDefault();
        copyToClipboard(nbRaw, 'raw');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nbRaw, handleGenerate]);

  // Handle batch download
  const handleDownloadBatch = () => {
    const content = quantity > 1
      ? batchList.map(n => `${formatNB(n)} (Raw: ${n})`).join('\n')
      : `${formatNB(nbRaw)} (Raw: ${nbRaw})`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inss_nb_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (onCopy) onCopy(t('tools.common.fileDownloaded'));
  };

  // Handle validation
  const handleValidateChange = (e) => {
    const val = e.target.value;
    setValidateInput(val);
    if (!val.trim()) {
      setValidationResult(null);
      return;
    }
    setValidationResult(validateNB(val));
  };

  const formattedDisplay = formatNB(nbRaw);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Subheader Navigation Pills */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          className={`category-chip ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          <Sparkles size={14} />
          <span>{t('tools.nb.tabs.generator')}</span>
        </button>
        <button
          className={`category-chip ${activeTab === 'validator' ? 'active' : ''}`}
          onClick={() => setActiveTab('validator')}
        >
          <ShieldCheck size={14} />
          <span>{t('tools.nb.tabs.validator')}</span>
        </button>
      </div>

      {activeTab === 'generator' && (
        <div className="workspace-grid">
          {/* Settings Panel */}
          <div className="workspace-panel">
            <div className="panel-header">
              <div className="panel-title">
                <FileBadge size={16} />
                <span>{t('tools.nb.generator.optionsTitle')}</span>
              </div>
            </div>

            <div className="panel-body">
              <div className="form-group">
                <label className="form-label">
                  <span>{t('tools.nb.generator.batchQuantity')}</span>
                  <span className="badge badge-cyan">{quantity} {quantity === 1 ? 'NB' : 'NBs'}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>{t('tools.nb.generator.individual')}</span>
                  <span>10</span>
                  <span>25</span>
                  <span>{t('tools.nb.generator.batchHint')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                <button className="btn-primary" onClick={handleGenerate} style={{ justifyContent: 'center' }}>
                  <RefreshCw size={15} />
                  <span>{t('tools.nb.generator.generateBtn')}</span>
                  <kbd style={{ marginLeft: 6, fontSize: 10, opacity: 0.8 }}>G</kbd>
                </button>

                {quantity > 1 && (
                  <button className="btn-secondary" onClick={handleDownloadBatch} style={{ justifyContent: 'center' }}>
                    <Download size={15} />
                    <span>{t('tools.nb.generator.downloadBtn', { count: quantity })}</span>
                  </button>
                )}
              </div>

              {/* Keyboard Shortcuts Hint */}
              <div style={{
                marginTop: 20,
                padding: 12,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: 12,
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
                  ⌨️ {t('tools.nb.shortcuts.title')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('tools.nb.shortcuts.generate')}</span>
                    <kbd>G</kbd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('tools.nb.shortcuts.copyFormatted')}</span>
                    <kbd>Alt + C</kbd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('tools.nb.shortcuts.copyRaw')}</span>
                    <kbd>Ctrl + C</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="workspace-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Hash size={16} />
                <span>{t('tools.nb.result.title')}</span>
              </div>
              <div className="panel-actions">
                <span className="badge badge-emerald">
                  <Check size={11} style={{ marginRight: 4 }} />
                  {t('tools.nb.result.validModulo11')}
                </span>
              </div>
            </div>

            <div className="panel-body">
              {/* Dual Display Cards (Formatted & Raw) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Formatted Card */}
                <div
                  onClick={() => copyToClipboard(formattedDisplay, 'formatted')}
                  style={{
                    padding: 18,
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  title={t('tools.nb.result.copyFormattedTooltip')}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {t('tools.nb.result.formattedLabel')}
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                      {formattedDisplay}
                    </div>
                  </div>

                  <button className="btn-secondary" style={{ pointerEvents: 'none' }}>
                    {copiedFormatted ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                    <span>{copiedFormatted ? t('tools.common.copied') : t('tools.common.copy')}</span>
                  </button>
                </div>

                {/* Raw Card */}
                <div
                  onClick={() => copyToClipboard(nbRaw, 'raw')}
                  style={{
                    padding: 18,
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  title={t('tools.nb.result.copyRawTooltip')}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {t('tools.nb.result.rawLabel')}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                      {nbRaw}
                    </div>
                  </div>

                  <button className="btn-secondary" style={{ pointerEvents: 'none' }}>
                    {copiedRaw ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                    <span>{copiedRaw ? t('tools.common.copied') : t('tools.common.copy')}</span>
                  </button>
                </div>
              </div>

              {/* Batch list view if quantity > 1 */}
              {quantity > 1 && batchList.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {t('tools.nb.result.batchListTitle', { count: batchList.length })}
                    </span>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => copyToClipboard(batchList.map(formatNB).join('\n'), 'batch')}
                    >
                      {copiedBatch ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedBatch ? t('tools.nb.result.allCopied') : t('tools.nb.result.copyAll')}</span>
                    </button>
                  </div>

                  <div className="custom-scrollbar" style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {batchList.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: 13,
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatNB(item)}</span>
                          <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: 11 }}>({item})</span>
                        </div>
                        <button
                          className="btn-icon"
                          style={{ width: 26, height: 26 }}
                          onClick={() => copyToClipboard(formatNB(item), 'formatted')}
                          title={t('tools.nb.result.copyItemTooltip')}
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validator Tab */}
      {activeTab === 'validator' && (
        <div className="workspace-panel">
          <div className="panel-header">
            <div className="panel-title">
              <ShieldCheck size={16} />
              <span>{t('tools.nb.validator.title')}</span>
            </div>
          </div>

          <div className="panel-body">
            <div className="form-group">
              <label className="form-label">{t('tools.nb.validator.inputLabel')}</label>
              <input
                type="text"
                placeholder={t('tools.nb.validator.placeholder')}
                value={validateInput}
                onChange={handleValidateChange}
                style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}
                maxLength={14}
              />
            </div>

            {/* Validation Outcome Card */}
            {validationResult && (
              <div style={{
                marginTop: 16,
                padding: 16,
                borderRadius: 'var(--radius-md)',
                background: validationResult.valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${validationResult.valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}>
                {validationResult.valid ? (
                  <CheckCircle2 size={22} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <AlertCircle size={22} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: validationResult.valid ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {validationResult.valid ? t('tools.nb.validator.valid') : t('tools.nb.validator.invalid')}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {validationResult.message}
                  </div>

                  {validationResult.valid && validationResult.details && (
                    <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 12 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('tools.nb.validator.baseSequence')} </span>
                        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{validationResult.details.sequence}</strong>
                      </div>
                      <div style={{ fontSize: 12 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('tools.nb.validator.checkDigit')} </span>
                        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{validationResult.details.dv}</strong>
                      </div>
                      <div style={{ fontSize: 12 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('tools.nb.validator.officialFormat')} </span>
                        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>{validationResult.details.formatted}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Information & Documentation Card */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Info size={16} />
            <span>{t('tools.nb.doc.title')}</span>
          </div>
        </div>

        <div className="panel-body" style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p>
            {t('tools.nb.doc.desc')}
          </p>

          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>
                {t('tools.nb.doc.structureTitle')}
              </div>
              <div>{t('tools.nb.doc.structureDesc')}</div>
            </div>

            <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>
                {t('tools.nb.doc.calcTitle')}
              </div>
              <div>{t('tools.nb.doc.calcDesc')}</div>
            </div>

            <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>
                {t('tools.nb.doc.testingTitle')}
              </div>
              <div>{t('tools.nb.doc.testingDesc')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
