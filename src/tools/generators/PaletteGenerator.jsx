import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Plus,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  RotateCcw,
  RotateCw,
  Eye,
  Sliders,
  Check,
  Pipette,
  Layers,
  Palette as PaletteIcon,
  HelpCircle,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToHex,
  getContrastColor,
  getWcagContrast,
  generateShades,
  getColorName,
  simulateColorBlindness,
  generateHarmoniousPalette,
  TRENDING_PALETTES
} from './colorUtils';

const DEFAULT_PALETTE = [
  { id: 'c-1', hex: '#264653', name: 'Charcoal', locked: false },
  { id: 'c-2', hex: '#2A9D8F', name: 'Persian Green', locked: false },
  { id: 'c-3', hex: '#E9C46A', name: 'Saffron', locked: false },
  { id: 'c-4', hex: '#F4A261', name: 'Sandy Brown', locked: false },
  { id: 'c-5', hex: '#E76F51', name: 'Burnt Sienna', locked: false }
];

export default function PaletteGenerator({ onCopy, lang = 'pt' }) {
  // Main palette state
  const [colors, setColors] = useState(() => {
    // Check if URL has a saved palette in query or hash (e.g. ?palette=264653-2a9d8f or #palette=...)
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.search + window.location.hash;
      if (fullUrl.includes('palette=')) {
        try {
          const match = fullUrl.match(/palette=([0-9a-fA-F-]+)/);
          if (match && match[1]) {
            const hexes = match[1].split('-');
            if (hexes.length >= 2) {
              return hexes.map((h, i) => {
                const fullHex = `#${h}`.toUpperCase();
                return {
                  id: `c-url-${i}`,
                  hex: fullHex,
                  name: getColorName(fullHex),
                  locked: false
                };
              });
            }
          }
        } catch (err) {
          console.warn('Could not parse palette from URL', err);
        }
      }
    }
    return DEFAULT_PALETTE;
  });

  // History for Undo / Redo
  const [history, setHistory] = useState([DEFAULT_PALETTE]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Settings
  const [harmonyMode, setHarmonyMode] = useState('random');
  const [blindnessMode, setBlindnessMode] = useState('normal');
  const [activeShadesColId, setActiveShadesColId] = useState(null);
  const [activePresetMenu, setActivePresetMenu] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportTab, setExportTab] = useState('css'); // 'css', 'tailwind', 'json', 'svg', 'png'
  const [copiedField, setCopiedField] = useState(null);

  // Canvas ref for PNG export
  const canvasRef = useRef(null);
  const filePickerRefs = useRef({});

  // Helper to push history
  const pushToHistory = (newPalette) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newPalette);
    // Keep last 30 states
    if (nextHistory.length > 30) nextHistory.shift();
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  // Generate new palette
  const handleGenerate = useCallback(() => {
    setColors(prevColors => {
      const newPalette = generateHarmoniousPalette(harmonyMode, prevColors);
      pushToHistory(newPalette);
      return newPalette;
    });
  }, [harmonyMode, historyIndex, history]);

  // Spacebar and Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is inside an input, textarea, contentEditable or modal
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT' ||
        (document.activeElement && document.activeElement.isContentEditable) ||
        exportModalOpen
      ) {
        return;
      }

      // Spacebar: Generate
      if (e.code === 'Space') {
        e.preventDefault();
        handleGenerate();
      }

      // Ctrl + Z / Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.code === 'KeyZ') {
        e.preventDefault();
        handleUndo();
      }

      // Ctrl + Y / Cmd + Shift + Z: Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyZ')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, exportModalOpen, historyIndex, history]);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setColors(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setColors(next);
    }
  };

  // Toggle Lock
  const handleToggleLock = (id) => {
    setColors(prev =>
      prev.map(c => (c.id === id ? { ...c, locked: !c.locked } : c))
    );
  };

  // Change Color
  const handleColorChange = (id, newHex) => {
    const cleanHex = newHex.startsWith('#') ? newHex : `#${newHex}`;
    setColors(prev => {
      const updated = prev.map(c =>
        c.id === id
          ? { ...c, hex: cleanHex.toUpperCase(), name: getColorName(cleanHex) }
          : c
      );
      pushToHistory(updated);
      return updated;
    });
  };

  // Remove Column
  const handleRemoveColor = (id) => {
    if (colors.length <= 2) {
      if (onCopy) onCopy('A paleta precisa ter no mínimo 2 cores!');
      return;
    }
    const updated = colors.filter(c => c.id !== id);
    setColors(updated);
    pushToHistory(updated);
  };

  // Add Column
  const handleAddColor = (indexToInsert = null) => {
    if (colors.length >= 10) {
      if (onCopy) onCopy('Limite máximo de 10 cores atingido!');
      return;
    }

    let newHex = '#3B82F6';
    if (indexToInsert !== null && indexToInsert >= 0 && indexToInsert < colors.length - 1) {
      // Interpolate between two neighboring colors in HSL
      const c1 = hexToRgb(colors[indexToInsert].hex);
      const c2 = hexToRgb(colors[indexToInsert + 1].hex);
      const avgR = Math.round((c1.r + c2.r) / 2);
      const avgG = Math.round((c1.g + c2.g) / 2);
      const avgB = Math.round((c1.b + c2.b) / 2);
      newHex = rgbToHex(avgR, avgG, avgB);
    } else {
      // Random fresh color
      const rndHue = Math.floor(Math.random() * 360);
      newHex = hslToHex(rndHue, 70, 50);
    }

    const newCol = {
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      hex: newHex,
      name: getColorName(newHex),
      locked: false
    };

    let updated;
    if (indexToInsert !== null) {
      updated = [...colors];
      updated.splice(indexToInsert + 1, 0, newCol);
    } else {
      updated = [...colors, newCol];
    }

    setColors(updated);
    pushToHistory(updated);
  };

  // Move Column Left / Right
  const handleMoveColumn = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= colors.length) return;
    const updated = [...colors];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setColors(updated);
    pushToHistory(updated);
  };

  // Load Preset
  const handleLoadPreset = (preset) => {
    const updated = preset.colors.map((hex, i) => ({
      id: `preset-${Date.now()}-${i}`,
      hex,
      name: getColorName(hex),
      locked: false
    }));
    setColors(updated);
    pushToHistory(updated);
    setActivePresetMenu(false);
    if (onCopy) onCopy(`Paleta "${preset.name}" carregada!`);
  };

  // Copy Color Hex
  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    if (onCopy) onCopy(`Cor ${hex} copiada com sucesso!`);
  };

  // Copy URL Share Link
  const handleSharePalette = () => {
    const hexTokens = colors.map(c => c.hex.replace('#', '')).join('-');
    const shareUrl = `${window.location.origin}/color-palette-generator?palette=${hexTokens}`;
    navigator.clipboard.writeText(shareUrl);
    if (onCopy) onCopy('Link compartilhável copiado para a área de transferência!');
  };

  // Download SVG
  const handleDownloadSvg = () => {
    const width = 1200;
    const height = 630;
    const colWidth = width / colors.length;

    let rects = '';
    let texts = '';

    colors.forEach((c, i) => {
      const displayedHex = simulateColorBlindness(c.hex, blindnessMode);
      const contrast = getContrastColor(displayedHex);
      const x = i * colWidth;

      rects += `  <rect x="${x}" y="0" width="${colWidth}" height="${height}" fill="${displayedHex}" />\n`;
      texts += `  <text x="${x + colWidth / 2}" y="${height - 110}" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="${contrast}" text-anchor="middle">${displayedHex.replace('#', '')}</text>\n`;
      texts += `  <text x="${x + colWidth / 2}" y="${height - 70}" font-family="system-ui, sans-serif" font-weight="500" font-size="16" fill="${contrast}" opacity="0.85" text-anchor="middle">${c.name}</text>\n`;
    });

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
${rects}
${texts}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stackkit-palette-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    if (onCopy) onCopy('Paleta exportada como SVG!');
  };

  // Download PNG Canvas
  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    const colWidth = width / colors.length;

    colors.forEach((c, i) => {
      const displayedHex = simulateColorBlindness(c.hex, blindnessMode);
      const contrast = getContrastColor(displayedHex);
      const x = i * colWidth;

      // Color block
      ctx.fillStyle = displayedHex;
      ctx.fillRect(x, 0, colWidth, height);

      // Hex Text
      ctx.fillStyle = contrast;
      ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(displayedHex.replace('#', ''), x + colWidth / 2, height - 110);

      // Name Text
      ctx.fillStyle = contrast;
      ctx.globalAlpha = 0.85;
      ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(c.name, x + colWidth / 2, height - 72);
      ctx.globalAlpha = 1.0;
    });

    // Branding badge at top left
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(24, 24, 180, 36, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('StackKit DevStudio', 40, 47);

    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `stackkit-palette-${Date.now()}.png`;
    link.href = imageUri;
    link.click();
    if (onCopy) onCopy('Paleta baixada em alta resolução (PNG)!');
  };

  // Export string generators
  const getCssVariablesExport = () => {
    return `:root {\n` +
      colors.map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} */`).join('\n') +
      `\n}`;
  };

  const getTailwindExport = () => {
    const entries = colors.map((c, i) => `      'color-${i + 1}': '${c.hex}', // ${c.name}`).join('\n');
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      }\n    }\n  }\n};`;
  };

  const getJsonExport = () => {
    return JSON.stringify(
      colors.map((c, i) => ({
        index: i + 1,
        hex: c.hex,
        name: c.name,
        rgb: hexToRgb(c.hex),
        hsl: rgbToHsl(hexToRgb(c.hex).r, hexToRgb(c.hex).g, hexToRgb(c.hex).b)
      })),
      null,
      2
    );
  };

  const copyExportContent = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1800);
    if (onCopy) onCopy('Código copiado para a área de transferência!');
  };

  return (
    <div className="coolors-container">
      {/* Hidden canvas for PNG export generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Top Generator Action Toolbar */}
      <div className="coolors-top-bar">
        {/* Left: Generate Button & Spacebar Hint */}
        <div className="coolors-bar-left">
          <button
            className="btn-primary coolors-generate-btn"
            onClick={handleGenerate}
            title="Pressione a barra de espaço para gerar"
          >
            <Sparkles size={18} />
            <span>Gerar Paleta</span>
            <kbd className="space-badge">Espaço</kbd>
          </button>

          {/* Undo / Redo */}
          <div className="btn-group">
            <button
              className="btn-secondary btn-icon"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Desfazer (Ctrl + Z)"
            >
              <RotateCcw size={16} />
            </button>
            <button
              className="btn-secondary btn-icon"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Refazer (Ctrl + Y)"
            >
              <RotateCw size={16} />
            </button>
          </div>
        </div>

        {/* Center: Harmony Mode & Daltonism Simulators */}
        <div className="coolors-bar-center">
          <div className="coolors-control-item">
            <Sliders size={14} className="control-icon" />
            <select
              className="select-input coolors-select"
              value={harmonyMode}
              onChange={(e) => setHarmonyMode(e.target.value)}
              title="Método de harmonia de cores"
            >
              <option value="random">Harmonia: Aleatória / Vibrante</option>
              <option value="analogous">Harmonia: Análoga</option>
              <option value="monochromatic">Harmonia: Monocromática</option>
              <option value="triadic">Harmonia: Tríade</option>
              <option value="complementary">Harmonia: Complementar</option>
              <option value="split-complementary">Harmonia: Dividido Complementar</option>
              <option value="pastel">Estilo: Pastel Suave</option>
              <option value="neon">Estilo: Cyberpunk / Neon</option>
              <option value="vintage">Estilo: Vintage / Muted</option>
            </select>
          </div>

          <div className="coolors-control-item">
            <Eye size={14} className="control-icon" />
            <select
              className="select-input coolors-select"
              value={blindnessMode}
              onChange={(e) => setBlindnessMode(e.target.value)}
              title="Simulador de Daltonismo"
            >
              <option value="normal">Visão Normal</option>
              <option value="protanopia">Protanopia (Sem Vermelho)</option>
              <option value="deuteranopia">Deuteranopia (Sem Verde)</option>
              <option value="tritanopia">Tritanopia (Sem Azul)</option>
              <option value="achromatopsia">Acromatopsia (Escala de Cinza)</option>
            </select>
          </div>
        </div>

        {/* Right: Presets, Add Color, Share & Export */}
        <div className="coolors-bar-right">
          {/* Presets dropdown toggle */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-secondary"
              onClick={() => setActivePresetMenu(!activePresetMenu)}
            >
              <PaletteIcon size={16} />
              <span>Explorar</span>
            </button>

            {activePresetMenu && (
              <div className="coolors-dropdown-menu">
                <div className="dropdown-title">Paletas em Destaque</div>
                <div className="presets-list">
                  {TRENDING_PALETTES.map((preset, idx) => (
                    <button
                      key={idx}
                      className="preset-card-item"
                      onClick={() => handleLoadPreset(preset)}
                    >
                      <div className="preset-swatches">
                        {preset.colors.map((c, ci) => (
                          <span
                            key={ci}
                            className="preset-swatch-dot"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div className="preset-info">
                        <span className="preset-name">{preset.name}</span>
                        <span className="preset-tag">{preset.tags}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Column Button */}
          <button
            className="btn-secondary"
            onClick={() => handleAddColor(null)}
            disabled={colors.length >= 10}
            title="Adicionar coluna de cor (máx 10)"
          >
            <Plus size={16} />
            <span className="hide-mobile">Cor</span>
          </button>

          {/* Share Link */}
          <button
            className="btn-secondary btn-icon"
            onClick={handleSharePalette}
            title="Compartilhar link desta paleta"
          >
            <Share2 size={16} />
          </button>

          {/* Export Modal trigger */}
          <button
            className="btn-primary coolors-export-btn"
            onClick={() => setExportModalOpen(true)}
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Interactive Color Canvas Strip (The Coolors Stage) */}
      <div className="coolors-palette-strip">
        {colors.map((col, index) => {
          const displayedHex = simulateColorBlindness(col.hex, blindnessMode);
          const contrast = getContrastColor(displayedHex);
          const isDarkText = contrast === '#0f172a';
          const wcag = getWcagContrast(displayedHex);
          const shades = generateShades(col.hex, 10);
          const isShadesOpen = activeShadesColId === col.id;

          return (
            <div
              key={col.id}
              className={`coolors-column ${col.locked ? 'is-locked' : ''}`}
              style={{
                backgroundColor: displayedHex,
                color: contrast
              }}
            >
              {/* Insert between columns hover button */}
              {index < colors.length - 1 && colors.length < 10 && (
                <button
                  className="coolors-insert-between-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddColor(index);
                  }}
                  title="Inserir cor entre estas duas"
                >
                  <Plus size={14} />
                </button>
              )}

              {/* Column Toolbar (Top of column) */}
              <div
                className="column-toolbar"
                style={{ color: contrast }}
              >
                {/* Remove button */}
                <button
                  className="column-action-btn"
                  onClick={() => handleRemoveColor(col.id)}
                  disabled={colors.length <= 2}
                  style={{ color: contrast }}
                  title="Remover cor (mínimo 2)"
                >
                  <Trash2 size={18} />
                </button>

                {/* Move Left */}
                <button
                  className="column-action-btn"
                  onClick={() => handleMoveColumn(index, -1)}
                  disabled={index === 0}
                  style={{ color: contrast }}
                  title="Mover para a esquerda"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Move Right */}
                <button
                  className="column-action-btn"
                  onClick={() => handleMoveColumn(index, 1)}
                  disabled={index === colors.length - 1}
                  style={{ color: contrast }}
                  title="Mover para a direita"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Shades and Tints Popover Toggle */}
                <div className="shades-popover-wrapper">
                  <button
                    className={`column-action-btn ${isShadesOpen ? 'active' : ''}`}
                    onClick={() => setActiveShadesColId(isShadesOpen ? null : col.id)}
                    style={{ color: contrast }}
                    title="Ver tons e sombras (Shades)"
                  >
                    <Layers size={18} />
                  </button>

                  {/* Shades Floating Dropdown */}
                  {isShadesOpen && (
                    <div className="shades-dropdown">
                      <div className="shades-dropdown-header">
                        <span>Tons de {col.name}</span>
                        <button
                          className="shades-close-btn"
                          onClick={() => setActiveShadesColId(null)}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="shades-list">
                        {shades.map((shade, si) => (
                          <div
                            key={si}
                            className="shade-item"
                            style={{ backgroundColor: shade.hex }}
                            onClick={() => {
                              handleColorChange(col.id, shade.hex);
                              setActiveShadesColId(null);
                            }}
                            title={`${shade.hex} (${shade.lightness}%)`}
                          >
                            <span
                              className="shade-hex-label"
                              style={{ color: getContrastColor(shade.hex) }}
                            >
                              {shade.hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Native Color Picker trigger */}
                <button
                  className="column-action-btn"
                  onClick={() => {
                    if (filePickerRefs.current[col.id]) {
                      filePickerRefs.current[col.id].click();
                    }
                  }}
                  style={{ color: contrast }}
                  title="Escolher cor exata"
                >
                  <Pipette size={18} />
                </button>
                <input
                  type="color"
                  ref={(el) => (filePickerRefs.current[col.id] = el)}
                  value={col.hex}
                  onChange={(e) => handleColorChange(col.id, e.target.value)}
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                />

                {/* Lock / Unlock Toggle */}
                <button
                  className={`column-action-btn lock-btn ${col.locked ? 'locked' : ''}`}
                  onClick={() => handleToggleLock(col.id)}
                  style={{ color: contrast }}
                  title={col.locked ? 'Cor travada (não mudará ao gerar)' : 'Travar cor'}
                >
                  {col.locked ? <Lock size={20} /> : <Unlock size={20} />}
                </button>
              </div>

              {/* Column Bottom / Center Meta Info */}
              <div className="column-info-block" style={{ color: contrast }}>
                {/* Hex Code (Click to copy) */}
                <div
                  className="column-hex-display"
                  onClick={() => handleCopyHex(col.hex)}
                  title="Clique para copiar o HEX"
                >
                  <span className="hex-prefix">#</span>
                  <span className="hex-value">{col.hex.replace('#', '')}</span>
                  <Copy size={15} className="hex-copy-icon" />
                </div>

                {/* Color Name */}
                <div className="column-color-name">
                  {col.name}
                </div>

                {/* Locked Indicator Tag */}
                {col.locked && (
                  <div
                    className="locked-badge"
                    style={{
                      backgroundColor: isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                      color: contrast
                    }}
                  >
                    <Lock size={12} />
                    <span>TRAVADO</span>
                  </div>
                )}

                {/* WCAG Contrast Rating */}
                <div
                  className="column-contrast-tag"
                  style={{
                    backgroundColor: isDarkText ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.14)',
                    color: contrast
                  }}
                  title={`Contraste com preto: ${wcag.ratioBlack}:1 | com branco: ${wcag.ratioWhite}:1`}
                >
                  <span>{isDarkText ? `P: ${wcag.ratioBlack}:1` : `B: ${wcag.ratioWhite}:1`}</span>
                  <span>{isDarkText ? (wcag.isBlackAa ? '· AA' : '') : (wcag.isWhiteAa ? '· AA' : '')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Controls & Quick Instructions */}
      <div className="coolors-footer">
        <div className="coolors-shortcuts-info">
          <span className="shortcut-tip">
            <kbd className="space-badge">Espaço</kbd> Gerar novas cores
          </span>
          <span className="shortcut-tip">
            <kbd className="space-badge">Ctrl + Z</kbd> Desfazer
          </span>
          <span className="shortcut-tip">
            <kbd className="space-badge">Ctrl + Y</kbd> Refazer
          </span>
          <span className="shortcut-tip">
            <Lock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Trave cores favoritas para compor harmonias
          </span>
        </div>

        <div className="coolors-count-status">
          <span>{colors.length} de 10 cores</span>
        </div>
      </div>

      {/* Export Modal */}
      {exportModalOpen && (
        <div className="modal-overlay" onClick={() => setExportModalOpen(false)}>
          <div
            className="modal-container coolors-export-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-row">
                <Download size={20} className="text-cyan" />
                <h3>Exportar Paleta de Cores</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setExportModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Visual Mini Palette Preview in Modal */}
            <div className="export-preview-strip">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="export-preview-box"
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name} (${c.hex})`}
                >
                  <span
                    className="export-preview-hex"
                    style={{ color: getContrastColor(c.hex) }}
                  >
                    {c.hex}
                  </span>
                </div>
              ))}
            </div>

            {/* Format Tabs */}
            <div className="export-tabs-nav">
              <button
                className={`export-tab-btn ${exportTab === 'css' ? 'active' : ''}`}
                onClick={() => setExportTab('css')}
              >
                <FileCode size={15} /> CSS Variables
              </button>
              <button
                className={`export-tab-btn ${exportTab === 'tailwind' ? 'active' : ''}`}
                onClick={() => setExportTab('tailwind')}
              >
                <FileCode size={15} /> Tailwind
              </button>
              <button
                className={`export-tab-btn ${exportTab === 'json' ? 'active' : ''}`}
                onClick={() => setExportTab('json')}
              >
                <FileCode size={15} /> JSON
              </button>
              <button
                className={`export-tab-btn ${exportTab === 'svg' ? 'active' : ''}`}
                onClick={() => setExportTab('svg')}
              >
                <ImageIcon size={15} /> Imagem SVG
              </button>
              <button
                className={`export-tab-btn ${exportTab === 'png' ? 'active' : ''}`}
                onClick={() => setExportTab('png')}
              >
                <ImageIcon size={15} /> Imagem PNG
              </button>
            </div>

            {/* Tab Body */}
            <div className="export-tab-content">
              {exportTab === 'css' && (
                <div className="code-export-box">
                  <pre className="code-block">{getCssVariablesExport()}</pre>
                  <button
                    className="btn-primary copy-code-btn"
                    onClick={() => copyExportContent(getCssVariablesExport(), 'css')}
                  >
                    {copiedField === 'css' ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedField === 'css' ? 'Copiado!' : 'Copiar CSS'}</span>
                  </button>
                </div>
              )}

              {exportTab === 'tailwind' && (
                <div className="code-export-box">
                  <pre className="code-block">{getTailwindExport()}</pre>
                  <button
                    className="btn-primary copy-code-btn"
                    onClick={() => copyExportContent(getTailwindExport(), 'tailwind')}
                  >
                    {copiedField === 'tailwind' ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedField === 'tailwind' ? 'Copiado!' : 'Copiar Tailwind'}</span>
                  </button>
                </div>
              )}

              {exportTab === 'json' && (
                <div className="code-export-box">
                  <pre className="code-block">{getJsonExport()}</pre>
                  <button
                    className="btn-primary copy-code-btn"
                    onClick={() => copyExportContent(getJsonExport(), 'json')}
                  >
                    {copiedField === 'json' ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedField === 'json' ? 'Copiado!' : 'Copiar JSON'}</span>
                  </button>
                </div>
              )}

              {exportTab === 'svg' && (
                <div className="image-export-info">
                  <p>Baixe a paleta em formato vetorial SVG, ideal para Figma, Illustrator ou inclusão direta no código.</p>
                  <button
                    className="btn-primary btn-large"
                    onClick={handleDownloadSvg}
                    style={{ marginTop: 16 }}
                  >
                    <Download size={18} />
                    <span>Baixar Arquivo SVG (.svg)</span>
                  </button>
                </div>
              )}

              {exportTab === 'png' && (
                <div className="image-export-info">
                  <p>Gere e baixe uma imagem de alta resolução (1200x630px) com as cores e nomes, perfeita para apresentações e redes sociais.</p>
                  <button
                    className="btn-primary btn-large"
                    onClick={handleDownloadPng}
                    style={{ marginTop: 16 }}
                  >
                    <Download size={18} />
                    <span>Baixar Imagem PNG (.png)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
