import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Download, Check, Settings, Sparkles } from 'lucide-react';
import { generateCPF } from '../../utils/brazilianAlgorithms';

export default function CpfGenerator({ onCopy, lang = 'pt' }) {
  const [cpf, setCpf] = useState('');
  const [mask, setMask] = useState(true);
  const [stateDigit, setStateDigit] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [batchList, setBatchList] = useState([]);
  const [copied, setCopied] = useState(false);

  const states = [
    { value: '', label: 'Qualquer Estado (Aleatório)' },
    { value: '8', label: 'São Paulo (SP)' },
    { value: '7', label: 'Rio de Janeiro / Espírito Santo (RJ/ES)' },
    { value: '6', label: 'Minas Gerais (MG)' },
    { value: '9', label: 'Paraná / Santa Catarina (PR/SC)' },
    { value: '0', label: 'Rio Grande do Sul (RS)' },
    { value: '1', label: 'DF, GO, MT, MS, TO' },
    { value: '2', label: 'AC, AP, AM, PA, RO, RR' },
    { value: '3', label: 'CE, MA, PI' },
    { value: '4', label: 'AL, PB, PE, RN' },
    { value: '5', label: 'BA, SE' }
  ];

  const handleGenerate = () => {
    if (quantity === 1) {
      const newCpf = generateCPF(mask, stateDigit);
      setCpf(newCpf);
      setBatchList([]);
    } else {
      const list = [];
      for (let i = 0; i < quantity; i++) {
        list.push(generateCPF(mask, stateDigit));
      }
      setBatchList(list);
      setCpf(list[0]);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [mask, stateDigit, quantity]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy(lang === 'pt' ? 'CPF copiado!' : 'CPF copied!');
  };

  const handleDownload = () => {
    const content = quantity > 1 ? batchList.join('\n') : cpf;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cpfs_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (onCopy) onCopy(lang === 'pt' ? 'Arquivo baixado!' : 'File downloaded!');
  };

  return (
    <div className="workspace-grid">
      {/* Configuration Panel */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Settings size={16} />
            <span>{lang === 'pt' ? 'Opções de Geração' : 'Generation Options'}</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">{lang === 'pt' ? 'Máscara de pontuação' : 'Punctuation mask'}</label>
            <label className="form-switch">
              <span>{lang === 'pt' ? 'Formatar com pontos e traço (000.000.000-00)' : 'Format with punctuation (000.000.000-00)'}</span>
              <input
                type="checkbox"
                checked={mask}
                onChange={e => setMask(e.target.checked)}
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">{lang === 'pt' ? 'Estado de Origem (Região Fiscal)' : 'Origin Fiscal State'}</label>
            <select
              value={stateDigit}
              onChange={e => setStateDigit(e.target.value)}
            >
              {states.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>{lang === 'pt' ? 'Quantidade a gerar' : 'Quantity to generate'}</span>
              <span className="badge badge-cyan">{quantity} {quantity === 1 ? 'CPF' : 'CPFs'}</span>
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

          <button className="btn-primary" onClick={handleGenerate} style={{ marginTop: 8 }}>
            <RefreshCw size={16} />
            <span>{lang === 'pt' ? 'Gerar Novo(s) CPF(s)' : 'Generate New CPF(s)'}</span>
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sparkles size={16} />
            <span>{lang === 'pt' ? 'Resultado' : 'Output'}</span>
          </div>
          <div className="panel-actions">
            <button className="btn-secondary" onClick={() => handleCopy(quantity > 1 ? batchList.join('\n') : cpf)}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? (lang === 'pt' ? 'Copiado!' : 'Copied!') : (lang === 'pt' ? 'Copiar' : 'Copy')}</span>
            </button>
            <button className="btn-icon" onClick={handleDownload} title={lang === 'pt' ? 'Baixar como TXT' : 'Download TXT'}>
              <Download size={15} />
            </button>
          </div>
        </div>

        <div className="panel-body">
          {quantity === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="result-box">
                <span className="result-box-value">{cpf}</span>
                <button
                  className="btn-icon"
                  onClick={() => handleCopy(cpf)}
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
                  ℹ️ {lang === 'pt' ? 'Informação sobre o CPF gerado:' : 'Generated CPF details:'}
                </div>
                {lang === 'pt'
                  ? 'Os CPFs gerados por esta ferramenta são matematicamente válidos de acordo com o algoritmo de módulo 11 da Receita Federal do Brasil, próprios para testes de software em ambiente de desenvolvimento.'
                  : 'CPFs generated by this tool are mathematically valid according to the Brazilian Federal Revenue module 11 algorithm, strictly intended for software development testing.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {batchList.length} {lang === 'pt' ? 'CPFs gerados em lote:' : 'CPFs generated in batch:'}
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
          <span>{quantity === 1 ? (mask ? '14 caracteres' : '11 dígitos') : `${quantity} registros`}</span>
          <span>Algoritmo Módulo 11</span>
        </div>
      </div>
    </div>
  );
}
