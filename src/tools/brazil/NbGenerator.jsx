import React, { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Download, Check, ShieldCheck, FileBadge, Sparkles, Hash, Info, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateNB, formatNB, validateNB, cleanDigits } from '../../utils/brazilianAlgorithms';

export default function NbGenerator({ onCopy, lang = 'pt' }) {
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
      onCopy(lang === 'pt' ? `NB ${text} copiado!` : `NB ${text} copied!`);
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
    if (onCopy) onCopy(lang === 'pt' ? 'Arquivo TXT baixado!' : 'TXT file downloaded!');
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
          <span>{lang === 'pt' ? 'Gerador de NB' : 'NB Generator'}</span>
        </button>
        <button
          className={`category-chip ${activeTab === 'validator' ? 'active' : ''}`}
          onClick={() => setActiveTab('validator')}
        >
          <ShieldCheck size={14} />
          <span>{lang === 'pt' ? 'Validador de NB' : 'NB Validator'}</span>
        </button>
      </div>

      {activeTab === 'generator' && (
        <div className="workspace-grid">
          {/* Settings Panel */}
          <div className="workspace-panel">
            <div className="panel-header">
              <div className="panel-title">
                <FileBadge size={16} />
                <span>{lang === 'pt' ? 'Opções do Gerador' : 'Generator Options'}</span>
              </div>
            </div>

            <div className="panel-body">
              <div className="form-group">
                <label className="form-label">
                  <span>{lang === 'pt' ? 'Quantidade em Lote' : 'Batch Quantity'}</span>
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
                  <span>1 (Individual)</span>
                  <span>10</span>
                  <span>25</span>
                  <span>50 (Lote)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                <button className="btn-primary" onClick={handleGenerate} style={{ justifyContent: 'center' }}>
                  <RefreshCw size={15} />
                  <span>{lang === 'pt' ? 'Gerar Novo(s) NB' : 'Generate New NB'}</span>
                  <kbd style={{ marginLeft: 6, fontSize: 10, opacity: 0.8 }}>G</kbd>
                </button>

                {quantity > 1 && (
                  <button className="btn-secondary" onClick={handleDownloadBatch} style={{ justifyContent: 'center' }}>
                    <Download size={15} />
                    <span>{lang === 'pt' ? `Baixar ${quantity} NBs (.txt)` : `Download ${quantity} NBs (.txt)`}</span>
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
                  ⌨️ {lang === 'pt' ? 'Atalhos Rápidos de Teclado:' : 'Keyboard Shortcuts:'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{lang === 'pt' ? 'Gerar novo número:' : 'Generate new number:'}</span>
                    <kbd>G</kbd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{lang === 'pt' ? 'Copiar formatado:' : 'Copy formatted:'}</span>
                    <kbd>Alt + C</kbd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{lang === 'pt' ? 'Copiar sem formatação:' : 'Copy unformatted:'}</span>
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
                <span>{lang === 'pt' ? 'Número do Benefício Gerado' : 'Generated Benefit Number'}</span>
              </div>
              <div className="panel-actions">
                <span className="badge badge-emerald">
                  <Check size={11} style={{ marginRight: 4 }} />
                  {lang === 'pt' ? 'Dígito Módulo 11 Válido' : 'Valid Modulo 11'}
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
                  title={lang === 'pt' ? 'Clique para copiar formatado (Alt+C)' : 'Click to copy formatted (Alt+C)'}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {lang === 'pt' ? 'NB Formatado (Com Pontuação)' : 'Formatted NB (With Punctuation)'}
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                      {formattedDisplay}
                    </div>
                  </div>

                  <button className="btn-secondary" style={{ pointerEvents: 'none' }}>
                    {copiedFormatted ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                    <span>{copiedFormatted ? (lang === 'pt' ? 'Copiado!' : 'Copied!') : (lang === 'pt' ? 'Copiar' : 'Copy')}</span>
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
                  title={lang === 'pt' ? 'Clique para copiar sem máscara (Ctrl+C)' : 'Click to copy raw (Ctrl+C)'}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {lang === 'pt' ? 'NB Não Formatado (Apenas Números)' : 'Unformatted NB (Numbers Only)'}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                      {nbRaw}
                    </div>
                  </div>

                  <button className="btn-secondary" style={{ pointerEvents: 'none' }}>
                    {copiedRaw ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                    <span>{copiedRaw ? (lang === 'pt' ? 'Copiado!' : 'Copied!') : (lang === 'pt' ? 'Copiar' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Batch list view if quantity > 1 */}
              {quantity > 1 && batchList.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {lang === 'pt' ? `Lista em Lote (${batchList.length} NBs):` : `Batch List (${batchList.length} NBs):`}
                    </span>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => copyToClipboard(batchList.map(formatNB).join('\n'), 'batch')}
                    >
                      {copiedBatch ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedBatch ? (lang === 'pt' ? 'Tudo Copiado!' : 'All Copied!') : (lang === 'pt' ? 'Copiar Todos' : 'Copy All')}</span>
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
                          title={lang === 'pt' ? 'Copiar este NB' : 'Copy this NB'}
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
              <span>{lang === 'pt' ? 'Validador de Número do Benefício (NB)' : 'INSS Benefit Number (NB) Validator'}</span>
            </div>
          </div>

          <div className="panel-body">
            <div className="form-group">
              <label className="form-label">{lang === 'pt' ? 'Digite ou cole o número do benefício:' : 'Enter or paste the benefit number:'}</label>
              <input
                type="text"
                placeholder={lang === 'pt' ? 'Exemplo: 123.456.789-0 ou 1234567890' : 'Example: 123.456.789-0 or 1234567890'}
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
                    {validationResult.valid
                      ? (lang === 'pt' ? 'Número do Benefício Válido!' : 'Valid INSS Benefit Number!')
                      : (lang === 'pt' ? 'Número do Benefício Inválido' : 'Invalid Benefit Number')
                    }
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {validationResult.message}
                  </div>

                  {validationResult.valid && validationResult.details && (
                    <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 12 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Sequência Base (9 dígitos):' : 'Base Sequence (9 digits):'} </span>
                        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{validationResult.details.sequence}</strong>
                      </div>
                      <div style={{ fontSize: 12 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Dígito Verificador (DV):' : 'Check Digit (DV):'} </span>
                        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{validationResult.details.dv}</strong>
                      </div>
                      <div style={{ fontSize: 12 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Formatado Oficial:' : 'Official Format:'} </span>
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
            <span>{lang === 'pt' ? 'Como Funciona o Número do Benefício (NB)?' : 'How does the INSS Benefit Number (NB) work?'}</span>
          </div>
        </div>

        <div className="panel-body" style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p>
            {lang === 'pt'
              ? 'O Número do Benefício (NB) é um identificador único de 10 dígitos atribuído pelo INSS (Instituto Nacional do Seguro Social) a cada benefício previdenciário concedido (como aposentadoria, auxílio-doença, pensão por morte, salário-maternidade ou BPC/LOAS).'
              : 'The Benefit Number (NB) is a 10-digit unique identifier assigned by the Brazilian Social Security Institute (INSS) to each granted welfare or retirement benefit (such as retirement, disability, pension, or maternity allowance).'
            }
          </p>

          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>
                {lang === 'pt' ? 'Estrutura do NB' : 'NB Structure'}
              </div>
              <div>{lang === 'pt' ? 'Composto por 9 dígitos sequenciais seguidos de 1 dígito verificador final no formato: 000.000.000-0.' : 'Composed of 9 sequential digits followed by 1 final verification check digit in format: 000.000.000-0.'}</div>
            </div>

            <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>
                {lang === 'pt' ? 'Cálculo do Dígito (Módulo 11)' : 'Check Digit (Modulo 11)'}
              </div>
              <div>{lang === 'pt' ? 'Os primeiros 9 dígitos são multiplicados pelos pesos decrescentes [2, 9, 8, 7, 6, 5, 4, 3, 2]. O resto da divisão por 11 determina o DV.' : 'The first 9 digits are multiplied by weights [2, 9, 8, 7, 6, 5, 4, 3, 2]. The modulo 11 remainder establishes the DV.'}</div>
            </div>

            <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>
                🔒 {lang === 'pt' ? 'Uso Exclusivo para Testes' : 'For Testing Purposes Only'}
              </div>
              <div>{lang === 'pt' ? 'Ferramenta desenvolvida exclusivamente para testes de software, homologação e desenvolvimento. Os dados gerados não possuem vínculo real.' : 'Tool developed exclusively for software testing, quality assurance, and development. Generated numbers hold no real-world entitlement.'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
