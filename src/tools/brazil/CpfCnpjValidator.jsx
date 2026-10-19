import React, { useState } from 'react';
import { BadgeCheck, CheckCircle2, XCircle, Copy, Check, ListFilter } from 'lucide-react';
import { validateCPF, validateCNPJ, cleanDigits, cleanDocument } from '../../utils/brazilianAlgorithms';

export default function CpfCnpjValidator({ onCopy, lang = 'pt' }) {
  const [singleInput, setSingleInput] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [mode, setMode] = useState('single'); // 'single' or 'batch'

  // Single Validation Result
  const getSingleValidation = (val) => {
    if (!val || !val.trim()) return null;
    const cleanDoc = cleanDocument(val);

    if (cleanDoc.length === 11) {
      return { type: 'CPF', ...validateCPF(val) };
    } else if (cleanDoc.length === 14) {
      return { type: 'CNPJ', ...validateCNPJ(val) };
    } else {
      return {
        valid: false,
        type: 'Desconhecido',
        message: `Tamanho inválido (${cleanDoc.length} caracteres). CPF deve ter 11 e CNPJ deve ter 14.`
      };
    }
  };

  const singleResult = getSingleValidation(singleInput);

  // Batch Validation Results
  const getBatchValidation = (rawText) => {
    if (!rawText.trim()) return [];
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

    return lines.map(line => {
      const cleanDoc = cleanDocument(line);
      let res = { input: line, type: 'Inválido', valid: false, message: 'Tamanho incorreto' };

      if (cleanDoc.length === 11) {
        const v = validateCPF(line);
        res = { input: line, type: 'CPF', valid: v.valid, message: v.message, formatted: v.formatted };
      } else if (cleanDoc.length === 14) {
        const v = validateCNPJ(line);
        res = { input: line, type: 'CNPJ', valid: v.valid, message: v.message, formatted: v.formatted };
      }
      return res;
    });
  };

  const batchResults = getBatchValidation(batchInput);
  const validBatchCount = batchResults.filter(r => r.valid).length;
  const invalidBatchCount = batchResults.length - validBatchCount;

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <BadgeCheck size={16} />
          <span>{lang === 'pt' ? 'Validador de CPF e CNPJ' : 'CPF & CNPJ Validator'}</span>
        </div>
        <div className="panel-actions">
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              className={`btn-secondary ${mode === 'single' ? 'active' : ''}`}
              onClick={() => setMode('single')}
              style={{ padding: '4px 10px', fontSize: 12 }}
            >
              Individual
            </button>
            <button
              className={`btn-secondary ${mode === 'batch' ? 'active' : ''}`}
              onClick={() => setMode('batch')}
              style={{ padding: '4px 10px', fontSize: 12 }}
            >
              Em Lote
            </button>
          </div>
        </div>
      </div>

      <div className="panel-body">
        {mode === 'single' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">
                <span>Insira o CPF ou CNPJ para validar:</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Com ou sem máscara · Aceita CNPJ alfanumérico</span>
              </label>
              <input
                type="text"
                placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-90"
                value={singleInput}
                onChange={e => setSingleInput(e.target.value)}
                style={{ fontSize: 16, padding: '12px 14px' }}
                autoFocus
              />
            </div>

            {singleResult && (
              <div style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                background: singleResult.valid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${singleResult.valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: singleResult.valid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: singleResult.valid ? '#10b981' : '#ef4444',
                  flexShrink: 0
                }}>
                  {singleResult.valid ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 18, fontWeight: 800,
                      color: singleResult.valid ? '#10b981' : '#ef4444'
                    }}>
                      {singleResult.valid ? `${singleResult.type} Válido` : `${singleResult.type} Inválido`}
                    </span>
                    {singleResult.originState && (
                      <span className="badge badge-cyan">Região: {singleResult.originState}</span>
                    )}
                    {singleResult.isAlphanumeric && (
                      <span className="badge badge-purple">Padrão Alfanumérico</span>
                    )}
                  </div>

                  <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                    {singleResult.message}
                  </div>

                  {singleResult.formatted && (
                    <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 4 }}>
                      Formato padronizado: <strong>{singleResult.formatted}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">
                <span>Cole a lista de documentos (um por linha):</span>
                {batchResults.length > 0 && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge badge-emerald">{validBatchCount} Válidos</span>
                    <span className="badge badge-rose">{invalidBatchCount} Inválidos</span>
                  </div>
                )}
              </label>
              <textarea
                className="code-editor-area"
                style={{ minHeight: 180 }}
                placeholder={`123.456.789-00\n00.000.000/0001-91\n11111111111\n...`}
                value={batchInput}
                onChange={e => setBatchInput(e.target.value)}
              />
            </div>

            {batchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Resultados da validação ({batchResults.length}):
                </div>
                <div style={{
                  maxHeight: 250, overflowY: 'auto',
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)'
                }}>
                  {batchResults.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)',
                        fontSize: 12.5, fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {item.valid ? (
                          <CheckCircle2 size={16} color="#10b981" />
                        ) : (
                          <XCircle size={16} color="#ef4444" />
                        )}
                        <span>{item.input}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: item.valid ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                          {item.valid ? 'VÁLIDO' : 'INVÁLIDO'}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({item.type})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="panel-footer">
        <span>Validação instantânea e 100% segura no cliente</span>
        <span>Módulo 11 oficial</span>
      </div>
    </div>
  );
}
