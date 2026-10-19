import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Copy, Check, AlertCircle, Clock } from 'lucide-react';
import { parseJwt } from '../../utils/cryptoHelpers';

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlBhdWxvIFNhbnRvcyIsImVtYWlsIjoicGF1bG9AZGV2LmNvbS5iciIsInJvbGVzIjpbImFkbWluIiwiZGV2ZWxvcGVyIl0sImlhdCI6MTc2MDAwMDAwMCwiZXhwIjoyMDgwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;

export default function JwtInspector({ onCopy, lang = 'pt' }) {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [decoded, setDecoded] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (!token.trim()) {
      setDecoded(null);
      setErrorMsg(null);
      return;
    }
    try {
      const result = parseJwt(token);
      setDecoded(result);
      setErrorMsg(null);
    } catch (e) {
      setErrorMsg(e.message);
      setDecoded(null);
    }
  }, [token]);

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) onCopy('Copiado!');
  };

  const formatDate = (epochSec) => {
    if (!epochSec) return '-';
    return new Date(epochSec * 1000).toLocaleString('pt-BR', { timeZoneName: 'short' });
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <ShieldCheck size={16} />
          <span>Inspecionador de Token JWT (JSON Web Token)</span>
        </div>
        <div className="panel-actions">
          <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setToken(SAMPLE_JWT)}>
            Token Exemplo
          </button>
        </div>
      </div>

      <div className="panel-body">
        {/* Token Input */}
        <div className="form-group">
          <label className="form-label">Cole o Token JWT Codificado</label>
          <textarea
            rows={4}
            className="code-editor-area"
            style={{ minHeight: 90, fontSize: 12.5 }}
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Cole o token JWT (header.payload.signature)..."
          />
        </div>

        {errorMsg && (
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {decoded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Status Banner */}
            <div style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-lg)',
              background: decoded.isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              border: `1px solid ${decoded.isExpired ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {decoded.isExpired ? (
                  <ShieldAlert size={22} color="#ef4444" />
                ) : (
                  <ShieldCheck size={22} color="#10b981" />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: decoded.isExpired ? '#ef4444' : '#10b981' }}>
                    Status do Token: {decoded.status}
                  </div>
                  {decoded.payload.exp && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Expira em: {formatDate(decoded.payload.exp)}
                    </div>
                  )}
                </div>
              </div>

              <div className="badge badge-purple">
                Alg: {decoded.header.alg || 'none'}
              </div>
            </div>

            {/* Header & Payload split */}
            <div className="workspace-grid" style={{ gap: 16 }}>
              {/* Header */}
              <div className="form-group">
                <div className="form-label">
                  <span style={{ color: 'var(--accent-rose)' }}>Cabeçalho (Header):</span>
                  <button className="btn-icon" onClick={() => handleCopy('header', decoded.header)}>
                    {copiedKey === 'header' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
                <textarea
                  readOnly
                  className="code-editor-area"
                  style={{ minHeight: 220, color: '#fb7185' }}
                  value={JSON.stringify(decoded.header, null, 2)}
                />
              </div>

              {/* Payload */}
              <div className="form-group">
                <div className="form-label">
                  <span style={{ color: 'var(--accent-purple)' }}>Carga Útil (Payload Claims):</span>
                  <button className="btn-icon" onClick={() => handleCopy('payload', decoded.payload)}>
                    {copiedKey === 'payload' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
                <textarea
                  readOnly
                  className="code-editor-area"
                  style={{ minHeight: 220, color: '#c084fc' }}
                  value={JSON.stringify(decoded.payload, null, 2)}
                />
              </div>
            </div>

            {/* Signature */}
            <div className="form-group">
              <span className="form-label" style={{ color: 'var(--accent-cyan)' }}>Assinatura (Signature):</span>
              <div className="result-box" style={{ fontSize: 12, color: '#38bdf8' }}>
                <span style={{ wordBreak: 'break-all' }}>{decoded.signature}</span>
                <button className="btn-icon" onClick={() => handleCopy('sig', decoded.signature)}>
                  {copiedKey === 'sig' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <span>RFC 7519 JSON Web Token Standard</span>
        <span>Processado estritamente no cliente, sua chave privada nunca é solicitada</span>
      </div>
    </div>
  );
}
