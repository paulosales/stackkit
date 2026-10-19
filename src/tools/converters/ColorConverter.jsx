import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check, Sparkles } from 'lucide-react';

export default function ColorConverter({ onCopy, lang = 'pt' }) {
  const [hex, setHex] = useState('#06b6d4');
  const [copiedKey, setCopiedKey] = useState(null);

  // Helper conversions
  const hexToRgb = (h) => {
    let clean = h.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    if (clean.length !== 6) return { r: 6, g: 182, b: 212 };
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const getLuminance = (r, g, b) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const rgbaString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  // Contrast
  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastWhite = (1.05 / (lum + 0.05)).toFixed(2);
  const contrastBlack = ((lum + 0.05) / 0.05).toFixed(2);

  const handleCopy = (key, val) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) onCopy(`${key.toUpperCase()} copiado!`);
  };

  return (
    <div className="workspace-grid">
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Palette size={16} />
            <span>Seletor de Cor e Formatos</span>
          </div>
        </div>

        <div className="panel-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <input
              type="color"
              value={hex.startsWith('#') && hex.length === 7 ? hex : '#06b6d4'}
              onChange={e => setHex(e.target.value)}
              style={{
                width: 64, height: 64, borderRadius: 'var(--radius-md)',
                cursor: 'pointer', padding: 2, border: '1px solid var(--border-strong)'
              }}
            />
            <div style={{ flex: 1 }}>
              <label className="form-label">Código HEX</label>
              <input
                type="text"
                value={hex}
                onChange={e => setHex(e.target.value)}
                placeholder="#06b6d4"
                style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <div className="form-group">
              <span className="form-label">RGB:</span>
              <div className="result-box" style={{ padding: '8px 12px' }}>
                <span>{rgbString}</span>
                <button className="btn-icon" onClick={() => handleCopy('rgb', rgbString)}>
                  {copiedKey === 'rgb' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">RGBA:</span>
              <div className="result-box" style={{ padding: '8px 12px' }}>
                <span>{rgbaString}</span>
                <button className="btn-icon" onClick={() => handleCopy('rgba', rgbaString)}>
                  {copiedKey === 'rgba' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">HSL:</span>
              <div className="result-box" style={{ padding: '8px 12px' }}>
                <span>{hslString}</span>
                <button className="btn-icon" onClick={() => handleCopy('hsl', hslString)}>
                  {copiedKey === 'hsl' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sparkles size={16} />
            <span>Acessibilidade e Contraste (WCAG)</span>
          </div>
        </div>

        <div className="panel-body">
          {/* Swatch Preview */}
          <div style={{
            height: 100,
            borderRadius: 'var(--radius-lg)',
            background: hex,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            color: lum > 0.5 ? '#000000' : '#ffffff',
            fontWeight: 700,
            fontSize: 16
          }}>
            Texto de Exemplo
          </div>

          {/* Contrast cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
            <div style={{
              padding: 12, borderRadius: 'var(--radius-md)', background: '#ffffff', color: '#000000',
              border: '1px solid var(--border-subtle)', textAlign: 'center'
            }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Contraste com Branco</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{contrastWhite}:1</div>
              <span className={`badge ${Number(contrastWhite) >= 4.5 ? 'badge-emerald' : 'badge-rose'}`} style={{ marginTop: 4 }}>
                {Number(contrastWhite) >= 4.5 ? 'WCAG AA Aprovado' : 'Reprovado'}
              </span>
            </div>

            <div style={{
              padding: 12, borderRadius: 'var(--radius-md)', background: '#000000', color: '#ffffff',
              border: '1px solid var(--border-subtle)', textAlign: 'center'
            }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Contraste com Preto</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{contrastBlack}:1</div>
              <span className={`badge ${Number(contrastBlack) >= 4.5 ? 'badge-emerald' : 'badge-rose'}`} style={{ marginTop: 4 }}>
                {Number(contrastBlack) >= 4.5 ? 'WCAG AA Aprovado' : 'Reprovado'}
              </span>
            </div>
          </div>
        </div>

        <div className="panel-footer">
          <span>Norma WCAG 2.1 (AA: 4.5:1, AAA: 7:1)</span>
          <span>HEX, RGB, HSL sincronizados</span>
        </div>
      </div>
    </div>
  );
}
