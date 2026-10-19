import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Download, Check, Settings, Sparkles } from 'lucide-react';
import { generateCNPJ } from '../../utils/brazilianAlgorithms';

export default function CnpjGenerator({ onCopy, lang = 'pt' }) {
  const [cnpj, setCnpj] = useState('');
  const [mask, setMask] = useState(true);
  const [isAlphanumeric, setIsAlphanumeric] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [batchList, setBatchList] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (quantity === 1) {
      const newCnpj = generateCNPJ(mask, isAlphanumeric);
      setCnpj(newCnpj);
      setBatchList([]);
    } else {
      const list = [];
      for (let i = 0; i < quantity; i++) {
        list.push(generateCNPJ(mask, isAlphanumeric));
      }
      setBatchList(list);
      setCnpj(list[0]);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [mask, isAlphanumeric, quantity]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy(lang === 'pt' ? 'CNPJ copiado!' : 'CNPJ copied!');
  };

  const handleDownload = () => {
    const content = quantity > 1 ? batchList.join('\n') : cnpj;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cnpjs_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (onCopy) onCopy(lang === 'pt' ? 'Arquivo baixado!' : 'File downloaded!');
  };

  return (
    <div className="workspace-grid">
      {/* Settings */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Settings size={16} />
            <span>{lang === 'pt' ? 'Configurações de CNPJ' : 'CNPJ Settings'}</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">{lang === 'pt' ? 'Padrão do CNPJ' : 'CNPJ Standard'}</label>
            <label className="form-switch">
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {lang === 'pt' ? 'CNPJ Alfanumérico (Novo Padrão RFB)' : 'Alphanumeric CNPJ (New RFB Standard)'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {lang === 'pt' ? 'Primeiros 12 dígitos contêm letras e números' : 'First 12 digits include letters and numbers'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAlphanumeric}
                onChange={e => setIsAlphanumeric(e.target.checked)}
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">{lang === 'pt' ? 'Formatação' : 'Formatting'}</label>
            <label className="form-switch">
              <span>{lang === 'pt' ? 'Incluir pontuação (00.000.000/0001-00)' : 'Include punctuation (00.000.000/0001-00)'}</span>
              <input
                type="checkbox"
                checked={mask}
                onChange={e => setMask(e.target.checked)}
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>{lang === 'pt' ? 'Quantidade a gerar' : 'Quantity to generate'}</span>
              <span className="badge badge-purple">{quantity} {quantity === 1 ? 'CNPJ' : 'CNPJs'}</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
            />
          </div>

          <button className="btn-primary" onClick={handleGenerate} style={{ marginTop: 8 }}>
            <RefreshCw size={16} />
            <span>{lang === 'pt' ? 'Gerar Novo(s) CNPJ(s)' : 'Generate New CNPJ(s)'}</span>
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sparkles size={16} />
            <span>{lang === 'pt' ? 'CNPJ Gerado' : 'Generated CNPJ'}</span>
          </div>
          <div className="panel-actions">
            <button className="btn-secondary" onClick={() => handleCopy(quantity > 1 ? batchList.join('\n') : cnpj)}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? (lang === 'pt' ? 'Copiado!' : 'Copied!') : (lang === 'pt' ? 'Copiar' : 'Copy')}</span>
            </button>
            <button className="btn-icon" onClick={handleDownload} title={lang === 'pt' ? 'Baixar TXT' : 'Download TXT'}>
              <Download size={15} />
            </button>
          </div>
        </div>

        <div className="panel-body">
          {quantity === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="result-box">
                <span className="result-box-value">{cnpj}</span>
                <button
                  className="btn-icon"
                  onClick={() => handleCopy(cnpj)}
                  title="Copiar"
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
                  🏢 {isAlphanumeric ? 'CNPJ Alfanumérico' : 'CNPJ Tradicional Numérico'}
                </div>
                {isAlphanumeric
                  ? 'A Receita Federal estabeleceu o CNPJ Alfanumérico para expandir a capacidade de números cadastrais. Os dois últimos dígitos continuam sendo numéricos verificadores calculados via ASCII - 48.'
                  : 'Válido de acordo com a regra de validação dos dois dígitos verificadores (D1 e D2) calculados com os pesos oficiais 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {batchList.length} CNPJs gerados:
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
          <span>{isAlphanumeric ? 'Alfanumérico' : 'Numérico'} · {mask ? '18 caracteres' : '14 dígitos'}</span>
          <span>Receita Federal do Brasil</span>
        </div>
      </div>
    </div>
  );
}
