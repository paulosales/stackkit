import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCw, Copy, Check, BadgeCheck, XCircle } from 'lucide-react';
import { generateCreditCard, validateLuhn, detectCreditCardBrand } from '../../utils/brazilianAlgorithms';

export default function CreditCardGenerator({ onCopy, lang = 'pt' }) {
  const [brand, setBrand] = useState('visa');
  const [card, setCard] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Validation tab state
  const [testNumber, setTestNumber] = useState('');

  const handleGenerate = () => {
    setCard(generateCreditCard(brand));
  };

  useEffect(() => {
    handleGenerate();
  }, [brand]);

  const copyVal = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1500);
    if (onCopy) onCopy(`${key.toUpperCase()} copiado!`);
  };

  // Test validator
  const detectedBrand = testNumber ? detectCreditCardBrand(testNumber) : null;
  const isLuhnValid = testNumber.replace(/\D/g, '').length >= 13 ? validateLuhn(testNumber) : null;

  return (
    <div className="workspace-grid">
      {/* Generator Column */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <CreditCard size={16} />
            <span>Gerador de Cartão de Crédito de Teste</span>
          </div>
          <div className="panel-actions">
            <button className="btn-primary" onClick={handleGenerate}>
              <RefreshCw size={14} />
              <span>Gerar Novo</span>
            </button>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">Bandeira do Cartão</label>
            <select value={brand} onChange={e => setBrand(e.target.value)}>
              <option value="visa">Visa (Inicia com 4)</option>
              <option value="mastercard">MasterCard (Inicia com 51-55 ou 22-27)</option>
              <option value="elo">Elo (Brasil - Inicia com 4011, 4389, etc.)</option>
              <option value="hipercard">Hipercard (Brasil - Inicia com 6062)</option>
              <option value="amex">American Express (15 dígitos, 34/37)</option>
              <option value="discover">Discover (Inicia com 6011)</option>
            </select>
          </div>

          {/* Visual Credit Card */}
          {card && (
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              color: '#ffffff',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 200,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Chip & Brand */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 28, borderRadius: 6,
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
                }} />
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--accent-cyan)' }}>
                  {card.brand}
                </span>
              </div>

              {/* Number */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700,
                letterSpacing: '0.12em', color: '#f8fafc', textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {card.number}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 11 }}>
                <div>
                  <div style={{ opacity: 0.6, fontSize: 9 }}>TITULAR</div>
                  <div style={{ fontWeight: 600, letterSpacing: '0.05em' }}>{card.holderName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ opacity: 0.6, fontSize: 9 }}>VALIDADE</div>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{card.expiration}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ opacity: 0.6, fontSize: 9 }}>CVV</div>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{card.cvv}</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick copy table */}
          {card && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <div className="result-box" style={{ padding: '8px 12px', fontSize: 13 }}>
                <span>Número: <strong>{card.number}</strong></span>
                <button className="btn-icon" onClick={() => copyVal('numero', card.rawNumber)}>
                  {copiedField === 'numero' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="result-box" style={{ padding: '8px 12px', fontSize: 12 }}>
                  <span>Validade: {card.expiration}</span>
                  <button className="btn-icon" onClick={() => copyVal('validade', card.expiration)}>
                    {copiedField === 'validade' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="result-box" style={{ padding: '8px 12px', fontSize: 12 }}>
                  <span>CVV: {card.cvv}</span>
                  <button className="btn-icon" onClick={() => copyVal('cvv', card.cvv)}>
                    {copiedField === 'cvv' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validator Column */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <BadgeCheck size={16} />
            <span>Validador de Cartão (Algoritmo de Luhn)</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">Número do Cartão a Testar</label>
            <input
              type="text"
              placeholder="Cole ou digite o número do cartão..."
              value={testNumber}
              onChange={e => setTestNumber(e.target.value)}
              style={{ fontSize: 15 }}
            />
          </div>

          {testNumber && (
            <div style={{
              padding: 16,
              borderRadius: 'var(--radius-md)',
              background: isLuhnValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isLuhnValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 14
            }}>
              {isLuhnValid ? (
                <BadgeCheck size={28} color="#10b981" />
              ) : (
                <XCircle size={28} color="#ef4444" />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: isLuhnValid ? '#10b981' : '#ef4444' }}>
                  {isLuhnValid ? 'Número Válido pelo Algoritmo de Luhn' : 'Número Inválido (Falha no dígito verificador)'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Bandeira detectada: <strong>{detectedBrand}</strong> ({testNumber.replace(/\D/g, '').length} dígitos)
                </div>
              </div>
            </div>
          )}

          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            fontSize: 12.5,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginTop: 'auto'
          }}>
            💳 <strong>Aviso de Uso:</strong> Os cartões gerados são puramente fictícios e válidos apenas matematicamente (MOD 10 Luhn). Eles não possuem conta bancária, saldo ou validade comercial real, servindo exclusivamente para testes de checkout e validação em gateways como Stripe, Mercado Pago ou Pagar.me em modo sandbox.
          </div>
        </div>

        <div className="panel-footer">
          <span>Algoritmo de Luhn (ISO/IEC 7812)</span>
          <span>Apenas para testes</span>
        </div>
      </div>
    </div>
  );
}
