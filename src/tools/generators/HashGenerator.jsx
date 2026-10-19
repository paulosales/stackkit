import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, Settings } from 'lucide-react';
import { md5, computeSubtleHash } from '../../utils/cryptoHelpers';

export default function HashGenerator({ onCopy, lang = 'pt' }) {
  const [inputText, setInputText] = useState('StackKit Developer Tools');
  const [uppercase, setUppercase] = useState(false);
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: ''
  });
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    async function calculate() {
      if (!inputText) {
        setHashes({ md5: '', sha1: '', sha256: '', sha384: '', sha512: '' });
        return;
      }
      try {
        const md5Val = md5(inputText);
        const [sha1Val, sha256Val, sha384Val, sha512Val] = await Promise.all([
          computeSubtleHash('SHA-1', inputText),
          computeSubtleHash('SHA-256', inputText),
          computeSubtleHash('SHA-384', inputText),
          computeSubtleHash('SHA-512', inputText)
        ]);

        const format = str => uppercase ? str.toUpperCase() : str.toLowerCase();

        setHashes({
          md5: format(md5Val),
          sha1: format(sha1Val),
          sha256: format(sha256Val),
          sha384: format(sha384Val),
          sha512: format(sha512Val)
        });
      } catch (e) {
        console.error(e);
      }
    }
    calculate();
  }, [inputText, uppercase]);

  const copyHash = (name, hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedKey(name);
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) onCopy(`Hash ${name} copiado!`);
  };

  const hashList = [
    { name: 'MD5', value: hashes.md5, bits: 128 },
    { name: 'SHA-1', value: hashes.sha1, bits: 160 },
    { name: 'SHA-256', value: hashes.sha256, bits: 256 },
    { name: 'SHA-384', value: hashes.sha384, bits: 384 },
    { name: 'SHA-512', value: hashes.sha512, bits: 512 }
  ];

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Hash size={16} />
          <span>Gerador de Hashes Criptográficos</span>
        </div>
        <div className="panel-actions">
          <label className="form-switch" style={{ padding: '4px 10px', fontSize: 12 }}>
            <span>Maiúsculas</span>
            <input
              type="checkbox"
              checked={uppercase}
              onChange={e => setUppercase(e.target.checked)}
            />
          </label>
        </div>
      </div>

      <div className="panel-body">
        <div className="form-group">
          <label className="form-label">Texto de Entrada</label>
          <textarea
            rows={3}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Digite ou cole qualquer texto para gerar os hashes em tempo real..."
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          {hashList.map(item => (
            <div key={item.name} className="form-group">
              <label className="form-label">
                <span>{item.name}</span>
                <span className="badge badge-cyan">{item.bits} bits</span>
              </label>
              <div className="result-box" style={{ padding: '8px 12px', fontSize: 12.5 }}>
                <span style={{ fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  {item.value || '...'}
                </span>
                <button
                  className="btn-icon"
                  onClick={() => copyHash(item.name, item.value)}
                  title={`Copiar ${item.name}`}
                >
                  {copiedKey === item.name ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-footer">
        <span>Web Crypto API & MD5</span>
        <span>100% no cliente sem transmissão de dados</span>
      </div>
    </div>
  );
}
