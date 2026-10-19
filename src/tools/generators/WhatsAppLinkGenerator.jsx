import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ExternalLink, Copy, Check, QrCode } from 'lucide-react';
import QRCodeLib from 'qrcode';

export default function WhatsAppLinkGenerator({ onCopy, lang = 'pt' }) {
  const [ddi, setDdi] = useState('55');
  const [phone, setPhone] = useState('11987654321');
  const [message, setMessage] = useState('Olá! Gostaria de mais informações.');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanDdi = ddi.replace(/\D/g, '') || '55';
    const fullNumber = `${cleanDdi}${cleanPhone}`;

    let generated = `https://wa.me/${fullNumber}`;
    if (message.trim()) {
      generated += `?text=${encodeURIComponent(message.trim())}`;
    }
    setLink(generated);

    if (canvasRef.current && cleanPhone.length >= 8) {
      QRCodeLib.toCanvas(canvasRef.current, generated, {
        width: 180,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [ddi, phone, message]);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Link do WhatsApp copiado!');
  };

  const handleOpen = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="workspace-grid">
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <MessageCircle size={16} />
            <span>Dados do WhatsApp</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-row">
            <div className="form-group" style={{ flex: 0.8 }}>
              <label className="form-label">DDI (País)</label>
              <input
                type="text"
                value={ddi}
                onChange={e => setDdi(e.target.value)}
                placeholder="55"
              />
            </div>

            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">DDD + Número de Telefone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Ex: 11999998888"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mensagem Padrão (Opcional)</label>
            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Digite o texto que o usuário enviará..."
            />
          </div>
        </div>
      </div>

      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <ExternalLink size={16} />
            <span>Link Gerado e QR Code</span>
          </div>
          <div className="panel-actions">
            <button className="btn-secondary" onClick={handleOpen}>
              <ExternalLink size={14} />
              <span>Abrir WhatsApp</span>
            </button>
            <button className="btn-primary" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>
        </div>

        <div className="panel-body" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            padding: 12,
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            display: 'inline-flex'
          }}>
            <canvas ref={canvasRef} style={{ width: 180, height: 180, display: 'block' }} />
          </div>

          <div style={{ width: '100%', marginTop: 8 }}>
            <label className="form-label" style={{ textAlign: 'left', marginBottom: 6 }}>Link Direto:</label>
            <div className="result-box" style={{ fontSize: 13 }}>
              <span style={{ wordBreak: 'break-all' }}>{link}</span>
              <button className="btn-icon" onClick={handleCopy} title="Copiar link">
                {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="panel-footer">
          <span>Compatível com WhatsApp Web, iOS e Android</span>
          <span>wa.me API</span>
        </div>
      </div>
    </div>
  );
}
