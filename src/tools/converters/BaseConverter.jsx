import React, { useState } from 'react';
import { Binary, Copy, Check } from 'lucide-react';

export default function BaseConverter({ onCopy, lang = 'pt' }) {
  const [dec, setDec] = useState('255');
  const [bin, setBin] = useState('11111111');
  const [oct, setOct] = useState('377');
  const [hex, setHex] = useState('FF');
  const [copiedKey, setCopiedKey] = useState(null);

  const updateFromDecimal = (val) => {
    setDec(val);
    try {
      if (!val.trim()) {
        setBin(''); setOct(''); setHex('');
        return;
      }
      const bInt = BigInt(val.trim());
      setBin(bInt.toString(2));
      setOct(bInt.toString(8));
      setHex(bInt.toString(16).toUpperCase());
    } catch (e) {
      // invalid input
    }
  };

  const updateFromBinary = (val) => {
    setBin(val);
    try {
      if (!val.trim()) {
        setDec(''); setOct(''); setHex('');
        return;
      }
      const bInt = BigInt('0b' + val.trim());
      setDec(bInt.toString(10));
      setOct(bInt.toString(8));
      setHex(bInt.toString(16).toUpperCase());
    } catch (e) {}
  };

  const updateFromOctal = (val) => {
    setOct(val);
    try {
      if (!val.trim()) {
        setDec(''); setBin(''); setHex('');
        return;
      }
      const bInt = BigInt('0o' + val.trim());
      setDec(bInt.toString(10));
      setBin(bInt.toString(2));
      setHex(bInt.toString(16).toUpperCase());
    } catch (e) {}
  };

  const updateFromHex = (val) => {
    setHex(val);
    try {
      if (!val.trim()) {
        setDec(''); setBin(''); setOct('');
        return;
      }
      const bInt = BigInt('0x' + val.trim());
      setDec(bInt.toString(10));
      setBin(bInt.toString(2));
      setOct(bInt.toString(8));
    } catch (e) {}
  };

  const handleCopy = (key, val) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) onCopy(`${key.toUpperCase()} copiado!`);
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Binary size={16} />
          <span>Conversor de Base Numérica (Binário, Octal, Decimal, Hexadecimal)</span>
        </div>
      </div>

      <div className="panel-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          {/* Decimal */}
          <div className="form-group">
            <label className="form-label">
              <span>Decimal (Base 10)</span>
              <button className="btn-icon" onClick={() => handleCopy('dec', dec)} title="Copiar">
                {copiedKey === 'dec' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </label>
            <input
              type="text"
              value={dec}
              onChange={e => updateFromDecimal(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0-9"
              style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          {/* Hexadecimal */}
          <div className="form-group">
            <label className="form-label">
              <span>Hexadecimal (Base 16)</span>
              <button className="btn-icon" onClick={() => handleCopy('hex', hex)} title="Copiar">
                {copiedKey === 'hex' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </label>
            <input
              type="text"
              value={hex}
              onChange={e => updateFromHex(e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase())}
              placeholder="0-9, A-F"
              style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          {/* Binário */}
          <div className="form-group">
            <label className="form-label">
              <span>Binário (Base 2)</span>
              <button className="btn-icon" onClick={() => handleCopy('bin', bin)} title="Copiar">
                {copiedKey === 'bin' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </label>
            <input
              type="text"
              value={bin}
              onChange={e => updateFromBinary(e.target.value.replace(/[^01]/g, ''))}
              placeholder="0 ou 1"
              style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          {/* Octal */}
          <div className="form-group">
            <label className="form-label">
              <span>Octal (Base 8)</span>
              <button className="btn-icon" onClick={() => handleCopy('oct', oct)} title="Copiar">
                {copiedKey === 'oct' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </label>
            <input
              type="text"
              value={oct}
              onChange={e => updateFromOctal(e.target.value.replace(/[^0-7]/g, ''))}
              placeholder="0-7"
              style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <span>Digite em qualquer campo para converter simultaneamente</span>
        <span>Suporte a números inteiros arbitrários (BigInt)</span>
      </div>
    </div>
  );
}
