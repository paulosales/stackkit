import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Download, Copy, Check, Settings, Sparkles } from 'lucide-react';
import QRCodeLib from 'qrcode';

export default function QrCodeGenerator({ onCopy, lang = 'pt' }) {
  const [text, setText] = useState('https://stackkit.com.br');
  const [size, setSize] = useState(260);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('M'); // L, M, Q, H
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCodeLib.toCanvas(canvasRef.current, text || ' ', {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: {
        dark: darkColor,
        light: lightColor
      }
    }, (err) => {
      if (err) console.error(err);
    });
  }, [text, size, darkColor, lightColor, errorLevel]);

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${Date.now()}.png`;
    a.click();
    if (onCopy) onCopy('QR Code baixado como PNG!');
  };

  const handleDownloadSvg = async () => {
    try {
      const svgString = await QRCodeLib.toString(text || ' ', {
        type: 'svg',
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: darkColor,
          light: lightColor
        }
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode_${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      if (onCopy) onCopy('QR Code baixado como SVG!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        if (onCopy) onCopy('Imagem do QR Code copiada!');
      });
    } catch (e) {
      // Fallback: copy text
      navigator.clipboard.writeText(text);
      if (onCopy) onCopy('Conteúdo copiado!');
    }
  };

  return (
    <div className="workspace-grid">
      {/* Config Panel */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Settings size={16} />
            <span>Conteúdo e Personalização</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">Texto ou Link (URL)</label>
            <textarea
              rows={3}
              placeholder="Digite o texto, link ou conteúdo para o QR Code..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cor do Código</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="color"
                  value={darkColor}
                  onChange={e => setDarkColor(e.target.value)}
                  style={{ width: 42, height: 38, padding: 2, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={darkColor}
                  onChange={e => setDarkColor(e.target.value)}
                  style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cor de Fundo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="color"
                  value={lightColor}
                  onChange={e => setLightColor(e.target.value)}
                  style={{ width: 42, height: 38, padding: 2, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={lightColor}
                  onChange={e => setLightColor(e.target.value)}
                  style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span>Dimensão</span>
                <span className="badge badge-cyan">{size}px</span>
              </label>
              <input
                type="range"
                min="160"
                max="400"
                step="20"
                value={size}
                onChange={e => setSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correção de Erro</label>
              <select value={errorLevel} onChange={e => setErrorLevel(e.target.value)}>
                <option value="L">Baixa (7% redundância)</option>
                <option value="M">Média (15% redundância)</option>
                <option value="Q">Alta (25% redundância)</option>
                <option value="H">Máxima (30% redundância)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sparkles size={16} />
            <span>Visualização ao Vivo</span>
          </div>
          <div className="panel-actions">
            <button className="btn-secondary" onClick={handleDownloadSvg}>
              <Download size={14} />
              <span>SVG</span>
            </button>
            <button className="btn-secondary" onClick={handleDownloadPng}>
              <Download size={14} />
              <span>PNG</span>
            </button>
            <button className="btn-primary" onClick={handleCopyImage}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        <div className="panel-body" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            padding: 16,
            background: lightColor,
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            display: 'inline-flex'
          }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>

        <div className="panel-footer">
          <span>{text.length} caracteres codificados</span>
          <span>Pronto para impressão ou leitura em celulares</span>
        </div>
      </div>
    </div>
  );
}
