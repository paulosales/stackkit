import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check, FileText } from 'lucide-react';
import { generateCPF, generateCNPJ, generateRG } from '../../utils/brazilianAlgorithms';

export default function DocumentGenerator({ onCopy, lang = 'pt' }) {
  const [mask, setMask] = useState(true);
  const [isAlphanumeric, setIsAlphanumeric] = useState(false);
  const [docs, setDocs] = useState({ cpf: '', cnpj: '', rg: '' });
  const [copiedKey, setCopiedKey] = useState(null);

  const generateAll = () => {
    setDocs({
      cpf: generateCPF(mask),
      cnpj: generateCNPJ(mask, isAlphanumeric),
      rg: generateRG(mask)
    });
  };

  useEffect(() => {
    generateAll();
  }, [mask, isAlphanumeric]);

  const copyItem = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) onCopy(`${key.toUpperCase()} copiado!`);
  };

  const copyAll = () => {
    const text = `CPF: ${docs.cpf}\nCNPJ: ${docs.cnpj}\nRG: ${docs.rg}`;
    navigator.clipboard.writeText(text);
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) onCopy('Todos os documentos copiados!');
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileText size={16} />
          <span>{lang === 'pt' ? 'Gerador Unificado de Documentos' : 'Unified Document Generator'}</span>
        </div>
        <div className="panel-actions">
          <button className="btn-secondary" onClick={copyAll}>
            {copiedKey === 'all' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedKey === 'all' ? 'Todos Copiados!' : 'Copiar Todos'}</span>
          </button>
          <button className="btn-primary" onClick={generateAll}>
            <RefreshCw size={15} />
            <span>Gerar Novos</span>
          </button>
        </div>
      </div>

      <div className="panel-body">
        {/* Preferences */}
        <div className="form-row" style={{ marginBottom: 8 }}>
          <label className="form-switch">
            <span>Incluir máscara de pontuação</span>
            <input
              type="checkbox"
              checked={mask}
              onChange={e => setMask(e.target.checked)}
            />
          </label>
          <label className="form-switch">
            <span>CNPJ Alfanumérico (Novo Padrão)</span>
            <input
              type="checkbox"
              checked={isAlphanumeric}
              onChange={e => setIsAlphanumeric(e.target.checked)}
            />
          </label>
        </div>

        {/* CPF Row */}
        <div className="form-group">
          <label className="form-label">
            <span>Cadastro de Pessoa Física (CPF)</span>
            <span className="badge badge-cyan">Válido</span>
          </label>
          <div className="result-box">
            <span className="result-box-value">{docs.cpf}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="btn-icon"
                onClick={() => setDocs(prev => ({ ...prev, cpf: generateCPF(mask) }))}
                title="Regerar apenas CPF"
              >
                <RefreshCw size={15} />
              </button>
              <button
                className="btn-icon"
                onClick={() => copyItem('cpf', docs.cpf)}
                title="Copiar CPF"
              >
                {copiedKey === 'cpf' ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* CNPJ Row */}
        <div className="form-group">
          <label className="form-label">
            <span>Cadastro Nacional da Pessoa Jurídica (CNPJ)</span>
            <span className="badge badge-purple">{isAlphanumeric ? 'Alfanumérico' : 'Numérico'}</span>
          </label>
          <div className="result-box">
            <span className="result-box-value">{docs.cnpj}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="btn-icon"
                onClick={() => setDocs(prev => ({ ...prev, cnpj: generateCNPJ(mask, isAlphanumeric) }))}
                title="Regerar apenas CNPJ"
              >
                <RefreshCw size={15} />
              </button>
              <button
                className="btn-icon"
                onClick={() => copyItem('cnpj', docs.cnpj)}
                title="Copiar CNPJ"
              >
                {copiedKey === 'cnpj' ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* RG Row */}
        <div className="form-group">
          <label className="form-label">
            <span>Registro Geral (RG - SSP)</span>
            <span className="badge badge-emerald">SSP-SP</span>
          </label>
          <div className="result-box">
            <span className="result-box-value">{docs.rg}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="btn-icon"
                onClick={() => setDocs(prev => ({ ...prev, rg: generateRG(mask) }))}
                title="Regerar apenas RG"
              >
                <RefreshCw size={15} />
              </button>
              <button
                className="btn-icon"
                onClick={() => copyItem('rg', docs.rg)}
                title="Copiar RG"
              >
                {copiedKey === 'rg' ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <span>Geração instantânea e segura para testes em desenvolvimento</span>
        <span>Receita Federal e SSP</span>
      </div>
    </div>
  );
}
