import React, { useState, useEffect } from 'react';
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck, ShieldAlert } from 'lucide-react';
import { generatePassword, calculatePasswordStrength } from '../../utils/cryptoHelpers';

export default function PasswordGenerator({ onCopy, lang = 'pt' }) {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [password, setPassword] = useState('');
  const [batchList, setBatchList] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (quantity === 1) {
      const pwd = generatePassword({ length, uppercase, lowercase, numbers, symbols, excludeAmbiguous });
      setPassword(pwd);
      setBatchList([]);
    } else {
      const list = [];
      for (let i = 0; i < quantity; i++) {
        list.push(generatePassword({ length, uppercase, lowercase, numbers, symbols, excludeAmbiguous }));
      }
      setBatchList(list);
      setPassword(list[0]);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous, quantity]);

  const strength = calculatePasswordStrength(password);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Senha copiada com sucesso!');
  };

  return (
    <div className="workspace-grid">
      {/* Settings */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <KeyRound size={16} />
            <span>Regras da Senha</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">
              <span>Tamanho da Senha</span>
              <span className="badge badge-cyan">{length} caracteres</span>
            </label>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={e => setLength(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label className="form-switch">
              <span>Maiúsculas (A-Z)</span>
              <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} />
            </label>

            <label className="form-switch">
              <span>Minúsculas (a-z)</span>
              <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)} />
            </label>

            <label className="form-switch">
              <span>Números (0-9)</span>
              <input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)} />
            </label>

            <label className="form-switch">
              <span>Símbolos (!@#$...)</span>
              <input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} />
            </label>
          </div>

          <label className="form-switch">
            <div>
              <div>Evitar caracteres ambíguos</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Exclui '1', 'l', 'I', '0', 'O'</div>
            </div>
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={e => setExcludeAmbiguous(e.target.checked)}
            />
          </label>

          <div className="form-group">
            <label className="form-label">
              <span>Gerar em Lote</span>
              <span className="badge badge-purple">{quantity} senhas</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
            />
          </div>

          <button className="btn-primary" onClick={handleGenerate} style={{ marginTop: 4 }}>
            <RefreshCw size={16} />
            <span>Gerar Nova Senha</span>
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <ShieldCheck size={16} />
            <span>Senha Gerada</span>
          </div>
          <div className="panel-actions">
            <button className="btn-secondary" onClick={() => handleCopy(quantity > 1 ? batchList.join('\n') : password)}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        <div className="panel-body">
          {quantity === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="result-box" style={{ padding: '16px 18px' }}>
                <span className="result-box-value" style={{ wordBreak: 'break-all', fontSize: 20 }}>
                  {password}
                </span>
                <button className="btn-icon" onClick={() => handleCopy(password)}>
                  {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
                </button>
              </div>

              {/* Entropy / Strength Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>Nível de Segurança:</span>
                  <span style={{ color: strength.color, fontWeight: 700 }}>
                    {strength.label} ({strength.entropy} bits de entropia)
                  </span>
                </div>
                <div style={{ width: '100%', height: 8, background: 'var(--bg-input)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${strength.percent}%`,
                    height: '100%',
                    background: strength.color,
                    transition: 'width 250ms ease-out'
                  }} />
                </div>
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
                🔒 <strong>Segurança Criptográfica:</strong> Utiliza <code>crypto.getRandomValues()</code> nativo do navegador para gerar números pseudoaleatórios criptograficamente seguros (CSPRNG), invulneráveis a ataques de força bruta previsíveis.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {batchList.length} senhas geradas com {length} caracteres:
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
          <span>{length} caracteres</span>
          <span>CSPRNG Web Crypto API</span>
        </div>
      </div>
    </div>
  );
}
