import React, { useState, useEffect } from 'react';
import { Globe, Copy, Check, RefreshCw, Wifi, Shield } from 'lucide-react';

export default function MyIp({ onCopy, lang = 'pt' }) {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({});

  const fetchIp = async () => {
    setLoading(true);
    try {
      // Primary: ipify
      const res = await fetch('https://api.ipify.org?format=json');
      if (res.ok) {
        const data = await res.json();
        setIp(data.ip);
      } else {
        throw new Error('Fallback needed');
      }
    } catch (e) {
      try {
        // Fallback: icanhazip
        const res2 = await fetch('https://icanhazip.com/');
        if (res2.ok) {
          const text = await res2.text();
          setIp(text.trim());
        } else {
          setIp('127.0.0.1 (Local / Offline)');
        }
      } catch (err) {
        setIp('127.0.0.1 (Modo Offline / Sem Conexão)');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIp();

    setBrowserInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform || 'Desconhecida',
      screenResolution: `${window.screen.width} x ${window.screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled ? 'Habilitados' : 'Desabilitados'
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Endereço IP copiado!');
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Globe size={16} />
          <span>Informações de Rede e Meu IP Público</span>
        </div>
        <div className="panel-actions">
          <button className="btn-secondary" onClick={fetchIp} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
            <span>Atualizar IP</span>
          </button>
        </div>
      </div>

      <div className="panel-body">
        {/* Main IP Display */}
        <div style={{
          padding: '28px 24px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: 4 }}>
              Seu Endereço de IP Público:
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {loading ? 'Consultando...' : (ip || '127.0.0.1')}
            </div>
          </div>

          <button className="btn-primary" onClick={handleCopy} disabled={!ip}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'IP Copiado!' : 'Copiar Meu IP'}</span>
          </button>
        </div>

        {/* Environment details */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
            Detalhes do Navegador e Ambiente Local:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fuso Horário (Timezone):</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                {browserInfo.timeZone || 'UTC'}
              </div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Idioma do Sistema:</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                {browserInfo.language || 'pt-BR'}
              </div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Resolução da Tela:</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                {browserInfo.screenResolution || '-'}
              </div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>User Agent:</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, wordBreak: 'break-all' }}>
                {browserInfo.userAgent || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <span>Requisição direta e segura via HTTPS</span>
        <span>Privacidade preservada</span>
      </div>
    </div>
  );
}
