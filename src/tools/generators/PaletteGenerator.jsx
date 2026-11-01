import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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

function parsePaletteFromUrl() {
  if (typeof window === 'undefined') return null;
  const fullUrl = window.location.search + window.location.hash;
  const match = fullUrl.match(/[?&#](?:palette|colors)=([0-9a-fA-F-]+)/) ||
                (window.location.hash ? window.location.hash.match(/^#([0-9a-fA-F]{3,6}(?:-[0-9a-fA-F]{3,6})+)$/) : null);

  if (match && match[1]) {
    try {
      const tokens = match[1].split('-').filter(Boolean);
      const validHexes = tokens.filter(t => t.length === 3 || t.length === 6);
      if (validHexes.length >= 2) {
        return validHexes.map((h, i) => {
          const fullHex = `#${h.length === 3 ? h.split('').map(c => c + c).join('') : h}`.toUpperCase();
          return {
            id: `c-url-${i}-${h}`,
            hex: fullHex,
            name: getColorName(fullHex),
            locked: false
          };
        });
      }
    } catch (err) {
      console.warn('Could not parse palette from URL', err);
    }
  }
  return null;
}

export default function PaletteGenerator({ onCopy, lang = 'pt' }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || lang;
  const [isShared, setIsShared] = useState(false);

  // Main palette state
  const [colors, setColors] = useState(() => {
    return parsePaletteFromUrl() || DEFAULT_PALETTE;
  });

  // History for Undo / Redo
  const [history, setHistory] = useState(() => [parsePaletteFromUrl() || DEFAULT_PALETTE]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync when browser URL query or hash changes (e.g. Back/Forward)
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parsePaletteFromUrl();
      if (parsed) {
        setColors(parsed);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

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
      if (onCopy) onCopy(t('palette.minColorsError'));
      return;
    }
    const updated = colors.filter(c => c.id !== id);
    setColors(updated);
    pushToHistory(updated);
  };

  // Add Column
  const handleAddColor = (indexToInsert = null) => {
    if (colors.length >= 10) {
      if (onCopy) onCopy(t('palette.maxColorsError'));
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
    if (onCopy) onCopy(t('palette.presetLoaded', { name: preset.name }));
  };

  // Copy Color Hex
  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    if (onCopy) onCopy(t('palette.colorCopied', { hex }));
  };

  // Copy / Share URL Link
  const handleSharePalette = async () => {
    const hexTokens = colors.map(c => c.hex.replace('#', '')).join('-');
    const currentPath = typeof window !== 'undefined' && window.location.pathname.startsWith(`/${currentLang}`)
      ? window.location.pathname
      : `/${currentLang}/color-palette-generator`;
    const shareUrl = `${window.location.origin}${currentPath}?palette=${hexTokens}`;

    // Update browser URL query string without reloading page
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', shareUrl);
    }

    let shared = false;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: t('palette.shareTitle'),
          text: t('palette.shareText'),
          url: shareUrl
        });
        shared = true;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    if (!shared) {
      let copied = false;
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          copied = true;
        } catch {
          copied = false;
        }
      }
      if (!copied) {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = shareUrl;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          copied = document.execCommand('copy');
          document.body.removeChild(textarea);
        } catch {
          copied = false;
        }
      }

      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
      if (onCopy) {
        onCopy(copied ? t('palette.shareSuccess') : t('palette.shareError'));
      }
    } else {
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
      if (onCopy) onCopy(t('palette.shareSuccess'));
    }
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
    if (onCopy) onCopy(t('palette.svgExportSuccess'));
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
    if (onCopy) onCopy(t('palette.pngExportSuccess'));
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
    if (onCopy) onCopy(t('palette.codeCopiedSuccess'));
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
            title={t('palette.pressSpacebar')}
          >
            <Sparkles size={18} />
            <span>{t('palette.generatePalette')}</span>
            <kbd className="space-badge">{t('palette.space')}</kbd>
          </button>

          {/* Undo / Redo */}
          <div className="btn-group">
            <button
              className="btn-secondary btn-icon"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title={t('palette.undo')}
            >
              <RotateCcw size={16} />
            </button>
            <button
              className="btn-secondary btn-icon"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title={t('palette.redo')}
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
              title={t('palette.harmonyMethod')}
            >
              <option value="random">{t('palette.harmonyRandom')}</option>
              <option value="analogous">{t('palette.harmonyAnalogous')}</option>
              <option value="monochromatic">{t('palette.harmonyMonochromatic')}</option>
              <option value="triadic">{t('palette.harmonyTriadic')}</option>
              <option value="complementary">{t('palette.harmonyComplementary')}</option>
              <option value="split-complementary">{t('palette.harmonySplitComplementary')}</option>
              <option value="pastel">{t('palette.harmonyPastel')}</option>
              <option value="neon">{t('palette.harmonyNeon')}</option>
              <option value="vintage">{t('palette.harmonyVintage')}</option>
            </select>
          </div>

          <div className="coolors-control-item">
            <Eye size={14} className="control-icon" />
            <select
              className="select-input coolors-select"
              value={blindnessMode}
              onChange={(e) => setBlindnessMode(e.target.value)}
              title={t('palette.blindnessSimulator')}
            >
              <option value="normal">{t('palette.visionNormal')}</option>
              <option value="protanopia">{t('palette.protanopia')}</option>
              <option value="deuteranopia">{t('palette.deuteranopia')}</option>
              <option value="tritanopia">{t('palette.tritanopia')}</option>
              <option value="achromatopsia">{t('palette.achromatopsia')}</option>
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
              <span>{t('palette.explore')}</span>
            </button>

            {activePresetMenu && (
              <div className="coolors-dropdown-menu">
                <div className="dropdown-title">{t('palette.featuredPalettes')}</div>
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
            title={t('palette.addColorTitle')}
          >
            <Plus size={16} />
            <span className="hide-mobile">{t('palette.color')}</span>
          </button>

          {/* Share Link */}
          <button
            className={`btn-secondary btn-icon ${isShared ? 'btn-success' : ''}`}
            onClick={handleSharePalette}
            title={t('palette.shareTooltip')}
          >
            {isShared ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
          </button>

          {/* Export Modal trigger */}
          <button
            className="btn-primary coolors-export-btn"
            onClick={() => setExportModalOpen(true)}
          >
            <Download size={16} />
            <span>{t('palette.export')}</span>
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
                  title={t('palette.insertColorBetween')}
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
                  title={t('palette.removeColorTitle')}
                >
                  <Trash2 size={18} />
                </button>

                {/* Move Left */}
                <button
                  className="column-action-btn"
                  onClick={() => handleMoveColumn(index, -1)}
                  disabled={index === 0}
                  style={{ color: contrast }}
                  title={t('palette.moveLeft')}
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Move Right */}
                <button
                  className="column-action-btn"
                  onClick={() => handleMoveColumn(index, 1)}
                  disabled={index === colors.length - 1}
                  style={{ color: contrast }}
                  title={t('palette.moveRight')}
                >
                  <ChevronRight size={18} />
                </button>

                {/* Shades and Tints Popover Toggle */}
                <div className="shades-popover-wrapper">
                  <button
                    className={`column-action-btn ${isShadesOpen ? 'active' : ''}`}
                    onClick={() => setActiveShadesColId(isShadesOpen ? null : col.id)}
                    style={{ color: contrast }}
                    title={t('palette.viewShades')}
                  >
                    <Layers size={18} />
                  </button>

                  {/* Shades Floating Dropdown */}
                  {isShadesOpen && (
                    <div className="shades-dropdown">
                      <div className="shades-dropdown-header">
                        <span>{t('palette.shadesOf', { name: col.name })}</span>
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
                  title={t('palette.pickColor')}
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
                  title={col.locked ? t('palette.lockedTitle') : t('palette.lockTitle')}
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
                  title={t('palette.clickToCopyHex')}
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
                    <span>{t('palette.lockedBadge')}</span>
                  </div>
                )}

                {/* WCAG Contrast Rating */}
                <div
                  className="column-contrast-tag"
                  style={{
                    backgroundColor: isDarkText ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.14)',
                    color: contrast
                  }}
                  title={t('palette.contrastRatioTooltip', { black: wcag.ratioBlack, white: wcag.ratioWhite })}
                >
                  <span>{isDarkText ? t('palette.contrastBlackShort', { ratio: wcag.ratioBlack }) : t('palette.contrastWhiteShort', { ratio: wcag.ratioWhite })}</span>
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
            <kbd className="space-badge">{t('palette.space')}</kbd> {t('palette.tipSpace')}
          </span>
          <span className="shortcut-tip">
            <kbd className="space-badge">Ctrl + Z</kbd> {t('palette.tipUndo')}
          </span>
          <span className="shortcut-tip">
            <kbd className="space-badge">Ctrl + Y</kbd> {t('palette.tipRedo')}
          </span>
          <span className="shortcut-tip">
            <Lock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {t('palette.tipLock')}
          </span>
        </div>

        <div className="coolors-count-status">
          <span>{t('palette.colorsCount', { current: colors.length, max: 10 })}</span>
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
                <h3>{t('palette.modalExportTitle')}</h3>
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
                <ImageIcon size={15} /> {t('palette.tabSvg')}
              </button>
              <button
                className={`export-tab-btn ${exportTab === 'png' ? 'active' : ''}`}
                onClick={() => setExportTab('png')}
              >
                <ImageIcon size={15} /> {t('palette.tabPng')}
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
                    <span>{copiedField === 'css' ? t('palette.copied') : t('palette.copyCss')}</span>
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
                    <span>{copiedField === 'tailwind' ? t('palette.copied') : t('palette.copyTailwind')}</span>
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
                    <span>{copiedField === 'json' ? t('palette.copied') : t('palette.copyJson')}</span>
                  </button>
                </div>
              )}

              {exportTab === 'svg' && (
                <div className="image-export-info">
                  <p>{t('palette.svgDesc')}</p>
                  <button
                    className="btn-primary btn-large"
                    onClick={handleDownloadSvg}
                    style={{ marginTop: 16 }}
                  >
                    <Download size={18} />
                    <span>{t('palette.downloadSvgBtn')}</span>
                  </button>
                </div>
              )}

              {exportTab === 'png' && (
                <div className="image-export-info">
                  <p>{t('palette.pngDesc')}</p>
                  <button
                    className="btn-primary btn-large"
                    onClick={handleDownloadPng}
                    style={{ marginTop: 16 }}
                  >
                    <Download size={18} />
                    <span>{t('palette.downloadPngBtn')}</span>
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
