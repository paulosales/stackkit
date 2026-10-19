import React, { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Download, Check, ShieldCheck, Scale, Sparkles, Hash, Info, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import {
  generateNumeroProcesso,
  formatNumeroProcesso,
  validateNumeroProcesso,
  cleanDigits,
  JUSTICE_SEGMENTS,
  JUSTICE_TRIBUNALS
} from '../../utils/brazilianAlgorithms';

export default function ProcessoGenerator({ onCopy, lang = 'pt' }) {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'validator'

  // Generator Configuration State
  const [orgao, setOrgao] = useState(0); // 0 = Qualquer
  const [tribunal, setTribunal] = useState(0); // 0 = Qualquer
  const [ano, setAno] = useState(new Date().getFullYear());
  const [useCurrentYear, setUseCurrentYear] = useState(true);
  const [mask, setMask] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Results State
  const [processoRaw, setProcessoRaw] = useState('');
  const [batchList, setBatchList] = useState([]);
  const [copiedFormatted, setCopiedFormatted] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  // Validator State
  const [validateInput, setValidateInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  // Available tribunals for selected organ
  const availableTribunals = JUSTICE_TRIBUNALS[orgao] || [];

  // Reset tribunal when organ changes
  useEffect(() => {
    setTribunal(0);
  }, [orgao]);

  // Generation function
  const handleGenerate = useCallback(() => {
    const selectedAno = useCurrentYear ? new Date().getFullYear() : ano;

    if (quantity === 1) {
      const generated = generateNumeroProcesso({
        orgao,
        tribunal,
        ano: selectedAno,
        mask: false
      });
      setProcessoRaw(generated);
      setBatchList([]);
    } else {
      const list = [];
      for (let i = 0; i < quantity; i++) {
        list.push(
          generateNumeroProcesso({
            orgao,
            tribunal,
            ano: selectedAno,
            mask: false
          })
        );
      }
      setBatchList(list);
      setProcessoRaw(list[0]);
    }
  }, [orgao, tribunal, ano, useCurrentYear, quantity]);

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
      onCopy(lang === 'pt' ? `Processo ${text} copiado!` : `Lawsuit ${text} copied!`);
    }
  };

  // Keyboard shortcut listener for 'g', 'ctrl+c'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleGenerate();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && processoRaw && !window.getSelection()?.toString()) {
        e.preventDefault();
        copyToClipboard(mask ? formatNumeroProcesso(processoRaw) : processoRaw, mask ? 'formatted' : 'raw');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processoRaw, mask, handleGenerate]);

  // Handle batch download
  const handleDownloadBatch = () => {
    const content = quantity > 1
      ? batchList.map(n => `${formatNumeroProcesso(n)} (Raw: ${n})`).join('\n')
      : `${formatNumeroProcesso(processoRaw)} (Raw: ${processoRaw})`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `processos_cnj_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (onCopy) onCopy(lang === 'pt' ? 'Arquivo TXT baixado!' : 'TXT file downloaded!');
  };

  // Handle validation input
  const handleValidateChange = (e) => {
    const val = e.target.value;
    setValidateInput(val);
    if (!val.trim()) {
      setValidationResult(null);
      return;
    }
    setValidationResult(validateNumeroProcesso(val));
  };

  const formattedDisplay = formatNumeroProcesso(processoRaw);

  // Breakdown details of generated number
  const breakdown = processoRaw.length === 20 ? {
    seq: processoRaw.slice(0, 7),
    dv: processoRaw.slice(7, 9),
    ano: processoRaw.slice(9, 13),
    j: processoRaw.slice(13, 14),
    tr: processoRaw.slice(14, 16),
    origem: processoRaw.slice(16, 20)
  } : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Subheader Navigation Pills */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          className={`category-chip ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          <Sparkles size={14} />
          <span>{lang === 'pt' ? 'Gerador CNJ' : 'CNJ Generator'}</span>
        </button>
        <button
          className={`category-chip ${activeTab === 'validator' ? 'active' : ''}`}
          onClick={() => setActiveTab('validator')}
        >
          <ShieldCheck size={14} />
          <span>{lang === 'pt' ? 'Validador CNJ' : 'CNJ Validator'}</span>
        </button>
      </div>

      {activeTab === 'generator' && (
        <div className="workspace-grid">
          {/* Options Panel */}
          <div className="workspace-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Scale size={16} />
                <span>{lang === 'pt' ? 'Parâmetros do Processo' : 'Process Parameters'}</span>
              </div>
            </div>

            <div className="panel-body">
              {/* Órgão ou segmento da justiça */}
              <div className="form-group">
                <label className="form-label">
                  {lang === 'pt' ? 'Órgão ou Segmento da Justiça (J):' : 'Justice Organ or Segment (J):'}
                </label>
                <select value={orgao} onChange={e => setOrgao(Number(e.target.value))}>
                  {JUSTICE_SEGMENTS.map(s => (
                    <option key={s.value} value={s.value}>
                      {lang === 'pt' ? s.label : s.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tribunal selector (when available) */}
              {availableTribunals.length > 0 && (
                <div className="form-group">
                  <label className="form-label">
                    {lang === 'pt' ? 'Tribunal Específico (TR):' : 'Specific Court / Tribunal (TR):'}
                  </label>
                  <select value={tribunal} onChange={e => setTribunal(Number(e.target.value))}>
                    <option value={0}>
                      {lang === 'pt' ? 'Qualquer Tribunal (Aleatório)' : 'Any Court (Random)'}
                    </option>
                    {availableTribunals.map(t => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ano do ajuizamento */}
              <div className="form-group">
                <label className="form-label">
                  {lang === 'pt' ? 'Ano do Ajuizamento (AAAA):' : 'Filing Year (AAAA):'}
                </label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={ano}
                    disabled={useCurrentYear}
                    onChange={e => setAno(Number(e.target.value))}
                    style={{ flex: 1, opacity: useCurrentYear ? 0.7 : 1 }}
                  />
                  <label className="form-switch" style={{ width: 'auto', flexShrink: 0 }}>
                    <span style={{ fontSize: 12 }}>{lang === 'pt' ? 'Ano Atual' : 'Current Year'}</span>
                    <input
                      type="checkbox"
                      checked={useCurrentYear}
                      onChange={e => {
                        setUseCurrentYear(e.target.checked);
                        if (e.target.checked) setAno(new Date().getFullYear());
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Máscara de pontuação */}
              <div className="form-group">
                <label className="form-label">{lang === 'pt' ? 'Formatação / Máscara' : 'Formatting / Mask'}</label>
                <label className="form-switch">
                  <span>{lang === 'pt' ? 'Incluir pontuação unificada CNJ' : 'Include unified CNJ punctuation'}</span>
                  <input
                    type="checkbox"
                    checked={mask}
                    onChange={e => setMask(e.target.checked)}
                  />
                </label>
              </div>

              {/* Quantidade em lote */}
              <div className="form-group">
                <label className="form-label">
                  <span>{lang === 'pt' ? 'Quantidade a gerar' : 'Quantity to generate'}</span>
                  <span className="badge badge-cyan">{quantity} {quantity === 1 ? 'Processo' : 'Processos'}</span>
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
                  <span>1</span>
                  <span>10</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                <button className="btn-primary" onClick={handleGenerate} style={{ justifyContent: 'center' }}>
                  <RefreshCw size={15} />
                  <span>{lang === 'pt' ? 'Gerar Novo(s) Processo(s)' : 'Generate Lawsuit Number(s)'}</span>
                  <kbd style={{ marginLeft: 6, fontSize: 10, opacity: 0.8 }}>G</kbd>
                </button>

                {quantity > 1 && (
                  <button className="btn-secondary" onClick={handleDownloadBatch} style={{ justifyContent: 'center' }}>
                    <Download size={15} />
                    <span>{lang === 'pt' ? `Baixar ${quantity} Processos (.txt)` : `Download ${quantity} Lawsuits (.txt)`}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Result Display Panel */}
          <div className="workspace-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Hash size={16} />
                <span>{lang === 'pt' ? 'Número do Processo Judicial' : 'Judicial Lawsuit Number'}</span>
              </div>
              <div className="panel-actions">
                <span className="badge badge-emerald">
                  <Check size={11} style={{ marginRight: 4 }} />
                  {lang === 'pt' ? 'Resolução CNJ 65/2008 (Módulo 97)' : 'CNJ Modulo 97 Valid'}
                </span>
              </div>
            </div>

            <div className="panel-body">
              {/* Dual Display Cards (Formatted and Raw) */}
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
                  title={lang === 'pt' ? 'Clique para copiar formatado' : 'Click to copy formatted'}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {lang === 'pt' ? 'Padrão Unificado CNJ (Formatado)' : 'Unified CNJ Format (Masked)'}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '0.02em', wordBreak: 'break-all' }}>
                      {formattedDisplay}
                    </div>
                  </div>

                  <button className="btn-secondary" style={{ pointerEvents: 'none', flexShrink: 0, marginLeft: 12 }}>
                    {copiedFormatted ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                    <span>{copiedFormatted ? (lang === 'pt' ? 'Copiado!' : 'Copied!') : (lang === 'pt' ? 'Copiar' : 'Copy')}</span>
                  </button>
                </div>

                {/* Raw Card */}
                <div
                  onClick={() => copyToClipboard(processoRaw, 'raw')}
                  style={{
                    padding: 16,
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
                  title={lang === 'pt' ? 'Clique para copiar sem máscara' : 'Click to copy raw (numbers only)'}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {lang === 'pt' ? 'Apenas Números (20 dígitos)' : 'Numbers Only (20 digits)'}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', letterSpacing: '0.03em', wordBreak: 'break-all' }}>
                      {processoRaw}
                    </div>
                  </div>

                  <button className="btn-secondary" style={{ pointerEvents: 'none', flexShrink: 0, marginLeft: 12 }}>
                    {copiedRaw ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                    <span>{copiedRaw ? (lang === 'pt' ? 'Copiado!' : 'Copied!') : (lang === 'pt' ? 'Copiar' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Segment Decomposition Pills */}
              {breakdown && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    {lang === 'pt' ? 'Decomposição dos Segmentos CNJ:' : 'CNJ Segment Breakdown:'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                    <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sequencial (N)</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 2 }}>{breakdown.seq}</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dígito (D)</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: 2 }}>{breakdown.dv}</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ano (A)</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 2 }}>{breakdown.ano}</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Justiça (J)</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 2 }}>{breakdown.j}</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tribunal (TR)</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 2 }}>{breakdown.tr}</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Origem (O)</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 2 }}>{breakdown.origem}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Batch list view if quantity > 1 */}
              {quantity > 1 && batchList.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {lang === 'pt' ? `Lista em Lote (${batchList.length} Processos):` : `Batch List (${batchList.length} Lawsuits):`}
                    </span>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => copyToClipboard(batchList.map(formatNumeroProcesso).join('\n'), 'batch')}
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
                          fontSize: 12.5,
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {mask ? formatNumeroProcesso(item) : item}
                        </span>
                        <button
                          className="btn-icon"
                          style={{ width: 26, height: 26 }}
                          onClick={() => copyToClipboard(mask ? formatNumeroProcesso(item) : item, mask ? 'formatted' : 'raw')}
                          title={lang === 'pt' ? 'Copiar este processo' : 'Copy this lawsuit number'}
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
              <span>{lang === 'pt' ? 'Validador e Inspetor de Processo Judicial (CNJ)' : 'Lawsuit Number (CNJ) Validator & Inspector'}</span>
            </div>
          </div>

          <div className="panel-body">
            <div className="form-group">
              <label className="form-label">
                {lang === 'pt' ? 'Digite ou cole o número do processo:' : 'Enter or paste the lawsuit number:'}
              </label>
              <input
                type="text"
                placeholder={lang === 'pt' ? 'Exemplo: 0001234-56.2026.8.26.0100 ou 00012345620268260100' : 'Example: 0001234-56.2026.8.26.0100 or 00012345620268260100'}
                value={validateInput}
                onChange={handleValidateChange}
                style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}
                maxLength={30}
              />
            </div>

            {/* Validation Outcome Card */}
            {validationResult && (
              <div style={{
                marginTop: 16,
                padding: 18,
                borderRadius: 'var(--radius-md)',
                background: validationResult.valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${validationResult.valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14
              }}>
                {validationResult.valid ? (
                  <CheckCircle2 size={24} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <AlertCircle size={24} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div style={{ width: '100%' }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: validationResult.valid ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {validationResult.valid
                      ? (lang === 'pt' ? 'Número de Processo Judicial Válido!' : 'Valid Lawsuit Number (CNJ)!')
                      : (lang === 'pt' ? 'Número de Processo Inválido' : 'Invalid Lawsuit Number')
                    }
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {validationResult.message}
                  </div>

                  {validationResult.valid && validationResult.details && (
                    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                      <div style={{ padding: 10, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Número Sequencial:' : 'Sequential:'}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{validationResult.details.sequence}</div>
                      </div>

                      <div style={{ padding: 10, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Dígito Verificador (Módulo 97):' : 'Check Digit (Modulo 97):'}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{validationResult.details.dv}</div>
                      </div>

                      <div style={{ padding: 10, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Ano do Ajuizamento:' : 'Filing Year:'}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{validationResult.details.ano}</div>
                      </div>

                      <div style={{ padding: 10, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Segmento da Justiça (J):' : 'Justice Segment (J):'}</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                          {lang === 'pt' ? validationResult.details.orgaoName : validationResult.details.orgaoNameEn}
                        </div>
                      </div>

                      <div style={{ padding: 10, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Tribunal (TR):' : 'Court / Tribunal (TR):'}</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{validationResult.details.tribunalName}</div>
                      </div>

                      <div style={{ padding: 10, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Foro / Unidade de Origem:' : 'Court Unit of Origin:'}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{validationResult.details.origem}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Educational & Technical Info Card */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Info size={16} />
            <span>{lang === 'pt' ? 'Padrão Unificado da Numeração Processual (CNJ)' : 'Unified Lawsuit Numbering Standard (CNJ)'}</span>
          </div>
        </div>

        <div className="panel-body" style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p>
            {lang === 'pt'
              ? 'Instituído pela Resolução nº 65/2008 do Conselho Nacional de Justiça (CNJ), o padrão unificado de numeração dos processos no Poder Judiciário possui 20 dígitos estruturados em 6 campos:'
              : 'Established by Resolution No. 65/2008 of the Brazilian National Justice Council (CNJ), the unified numbering system for judicial lawsuits consists of 20 digits organized into 6 fields:'
            }
          </p>

          <div style={{
            margin: '12px 0',
            padding: 12,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: 15,
            textAlign: 'center',
            color: 'var(--accent-cyan)'
          }}>
            NNNNNNN - DD . AAAA . J . TR . OOOO
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginTop: 12 }}>
            <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <strong>NNNNNNN (7 dígitos):</strong> {lang === 'pt' ? 'Número sequencial do processo no ano.' : 'Sequential lawsuit number within year.'}
            </div>
            <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <strong>DD (2 dígitos):</strong> {lang === 'pt' ? 'Dígitos verificadores calculados via Módulo 97.' : 'Check digits calculated via Modulo 97.'}
            </div>
            <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <strong>AAAA (4 dígitos):</strong> {lang === 'pt' ? 'Ano em que o processo foi ajuizado.' : 'Year the lawsuit was originally filed.'}
            </div>
            <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <strong>J (1 dígito):</strong> {lang === 'pt' ? 'Segmento ou ramo do Poder Judiciário (1 a 9).' : 'Branch or segment of Judiciary (1 to 9).'}
            </div>
            <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <strong>TR (2 dígitos):</strong> {lang === 'pt' ? 'Identificador do tribunal ou região judiciária.' : 'Court or judicial regional circuit ID.'}
            </div>
            <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <strong>OOOO (4 dígitos):</strong> {lang === 'pt' ? 'Foro, vara ou unidade judiciária de origem.' : 'Court branch or judicial unit of origin.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
