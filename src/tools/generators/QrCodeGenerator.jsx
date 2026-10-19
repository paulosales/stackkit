import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Download, Copy, Check, Settings, Sparkles, Image as ImageIcon, Upload, Trash2, Ban } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { drawQrWithLogo, getSvgWithLogo, PRESET_LOGOS } from '../../utils/qrCodeUtils';

export default function QrCodeGenerator({ onCopy, lang = 'pt' }) {
  const [text, setText] = useState('https://stackkit.com.br');
  const [size, setSize] = useState(280);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('H'); // Default H for best logo tolerance
  const [copied, setCopied] = useState(false);

  // Logo / Image in QR Code state
  const [logoPreset, setLogoPreset] = useState('none'); // 'none' | 'pix' | 'whatsapp' | 'globe' | 'star' | 'custom'
  const [customLogoUrl, setCustomLogoUrl] = useState(null);
  const [logoSizePercent, setLogoSizePercent] = useState(22);
  const [logoShape, setLogoShape] = useState('rounded'); // 'rounded' | 'circle'
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Active logo data URL
  const activeLogoUrl = logoPreset === 'custom'
    ? customLogoUrl
    : (PRESET_LOGOS.find(p => p.id === logoPreset)?.svg || null);

  // Re-render QR code whenever properties change
  useEffect(() => {
    if (!canvasRef.current) return;

    drawQrWithLogo({
      canvas: canvasRef.current,
      text: text || ' ',
      size,
      darkColor,
      lightColor,
      errorLevel: activeLogoUrl ? 'H' : errorLevel,
      logoUrl: activeLogoUrl,
      logoSizePercent,
      logoShape,
      logoBgColor: lightColor
    });
  }, [text, size, darkColor, lightColor, errorLevel, activeLogoUrl, logoSizePercent, logoShape]);

  // Handle user uploading custom image
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onCopy) onCopy('Por favor, selecione um arquivo de imagem válido (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (onCopy) onCopy('O arquivo deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomLogoUrl(event.target.result);
      setLogoPreset('custom');
      setErrorLevel('H');
      if (onCopy) onCopy('Imagem adicionada ao QR Code!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    setCustomLogoUrl(null);
    setLogoPreset('none');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onCopy) onCopy('Imagem removida do QR Code.');
  };

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${Date.now()}.png`;
    a.click();
    if (onCopy) onCopy('QR Code com imagem baixado como PNG!');
  };

  const handleDownloadSvg = async () => {
    try {
      const baseSvg = await QRCodeLib.toString(text || ' ', {
        type: 'svg',
        width: size,
        margin: 2,
        errorCorrectionLevel: activeLogoUrl ? 'H' : errorLevel,
        color: {
          dark: darkColor,
          light: lightColor
        }
      });

      const finalSvg = getSvgWithLogo({
        svgString: baseSvg,
        size,
        logoUrl: activeLogoUrl,
        logoSizePercent,
        logoShape,
        lightColor
      });

      const blob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' });
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
        if (onCopy) onCopy('Imagem do QR Code copiada para a área de transferência!');
      });
    } catch (e) {
      // Fallback: copy text
      navigator.clipboard.writeText(text);
      if (onCopy) onCopy('Conteúdo de texto copiado!');
    }
  };

  return (
    <div className="workspace-grid">
      {/* Config Panel */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Settings size={16} />
            <span>Conteúdo e Cores</span>
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

          {/* Logo / Image in QR Code Section */}
          <div className="qr-logo-section">
            <div className="qr-logo-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ImageIcon size={15} className="text-cyan" />
                <span style={{ fontWeight: 700, fontSize: 13 }}>Imagem ou Logotipo no Centro</span>
              </div>
              {activeLogoUrl && (
                <span className="badge badge-emerald" style={{ fontSize: 10.5 }}>Ativo</span>
              )}
            </div>

            {/* Presets and Upload Selector */}
            <div className="qr-presets-row">
              {PRESET_LOGOS.map(preset => {
                const isActive = logoPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`qr-preset-chip ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setLogoPreset(preset.id);
                      if (preset.id !== 'none') setErrorLevel('H');
                    }}
                  >
                    {preset.svg ? (
                      <img src={preset.svg} alt={preset.label} className="qr-preset-icon-img" />
                    ) : (
                      <Ban size={13} style={{ opacity: 0.6 }} />
                    )}
                    <span>{preset.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                className={`qr-preset-chip ${logoPreset === 'custom' ? 'active' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={13} />
                <span>Upload</span>
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            {/* Custom Logo Details */}
            {logoPreset === 'custom' && customLogoUrl && (
              <div className="qr-custom-logo-card">
                <img src={customLogoUrl} alt="Custom Logo Preview" className="qr-custom-logo-thumb" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Sua imagem carregada</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Centralizada no QR Code</div>
                </div>
                <button
                  type="button"
                  className="city-action-btn delete-btn"
                  title="Remover imagem"
                  onClick={handleRemoveCustomLogo}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}

            {/* Logo Customization Settings (if a logo is active) */}
            {activeLogoUrl && (
              <div className="qr-logo-options-box">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <span>Tamanho da Imagem</span>
                      <span className="badge badge-cyan">{logoSizePercent}%</span>
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="26"
                      step="1"
                      value={logoSizePercent}
                      onChange={e => setLogoSizePercent(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Formato do Emblema</label>
                    <div className="qr-shape-toggle">
                      <button
                        type="button"
                        className={`qr-shape-btn ${logoShape === 'rounded' ? 'active' : ''}`}
                        onClick={() => setLogoShape('rounded')}
                      >
                        Arredondado
                      </button>
                      <button
                        type="button"
                        className={`qr-shape-btn ${logoShape === 'circle' ? 'active' : ''}`}
                        onClick={() => setLogoShape('circle')}
                      >
                        Círculo
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                  <span>🛡️</span>
                  <span>Correção de erro elevada automaticamente para <strong>Máxima (H: 30%)</strong> para garantir a leitura em celulares.</span>
                </div>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span>Dimensão do QR Code</span>
                <span className="badge badge-cyan">{size}px</span>
              </label>
              <input
                type="range"
                min="180"
                max="400"
                step="20"
                value={size}
                onChange={e => setSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correção de Erro</label>
              <select
                value={activeLogoUrl ? 'H' : errorLevel}
                disabled={Boolean(activeLogoUrl)}
                onChange={e => setErrorLevel(e.target.value)}
              >
                <option value="L">Baixa (7% redundância)</option>
                <option value="M">Média (15% redundância)</option>
                <option value="Q">Alta (25% redundância)</option>
                <option value="H">Máxima (30% redundância - Recomendada com imagem)</option>
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
          <span>{activeLogoUrl ? 'Logotipo central incorporado' : 'Pronto para impressão ou leitura em celulares'}</span>
        </div>
      </div>
    </div>
  );
}
