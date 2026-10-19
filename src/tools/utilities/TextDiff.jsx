import React, { useState } from 'react';
import { GitCompare, Copy, Check, RefreshCw } from 'lucide-react';

const SAMPLE_OLD = `function calcularTotal(itens, imposto) {
  let total = 0;
  for (let i = 0; i < itens.length; i++) {
    total += itens[i].preco;
  }
  return total + imposto;
}`;

const SAMPLE_NEW = `function calcularTotal(itens = [], imposto = 0) {
  if (!Array.isArray(itens)) return 0;
  const subtotal = itens.reduce((acc, item) => acc + (item.preco || 0), 0);
  const totalComImposto = subtotal * (1 + imposto);
  return Number(totalComImposto.toFixed(2));
}`;

export default function TextDiff({ onCopy, lang = 'pt' }) {
  const [oldText, setOldText] = useState(SAMPLE_OLD);
  const [newText, setNewText] = useState(SAMPLE_NEW);

  // Compute line-by-line diff
  const computeDiff = () => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const max = Math.max(oldLines.length, newLines.length);
    const diff = [];

    // Simple LCS / line comparison
    let i = 0, j = 0;
    while (i < oldLines.length || j < newLines.length) {
      const o = oldLines[i];
      const n = newLines[j];

      if (o === n) {
        diff.push({ type: 'unchanged', text: o, oldLine: i + 1, newLine: j + 1 });
        i++;
        j++;
      } else {
        // Look ahead
        const nextOinN = newLines.indexOf(o, j);
        const nextNinO = oldLines.indexOf(n, i);

        if (nextOinN !== -1 && (nextNinO === -1 || nextOinN - j <= nextNinO - i)) {
          diff.push({ type: 'added', text: n, newLine: j + 1 });
          j++;
        } else if (i < oldLines.length) {
          diff.push({ type: 'deleted', text: o, oldLine: i + 1 });
          i++;
        } else if (j < newLines.length) {
          diff.push({ type: 'added', text: n, newLine: j + 1 });
          j++;
        }
      }
    }
    return diff;
  };

  const diffResult = computeDiff();
  const additions = diffResult.filter(d => d.type === 'added').length;
  const deletions = diffResult.filter(d => d.type === 'deleted').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="workspace-grid">
        {/* Left: Original */}
        <div className="workspace-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>Texto Original (Antes)</span>
            </div>
            <div className="panel-actions">
              <span className="badge badge-rose">Original</span>
            </div>
          </div>
          <div className="panel-body">
            <textarea
              className="code-editor-area"
              style={{ minHeight: 220 }}
              value={oldText}
              onChange={e => setOldText(e.target.value)}
              placeholder="Cole a versão original aqui..."
            />
          </div>
        </div>

        {/* Right: Modified */}
        <div className="workspace-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>Texto Modificado (Depois)</span>
            </div>
            <div className="panel-actions">
              <span className="badge badge-emerald">Modificado</span>
            </div>
          </div>
          <div className="panel-body">
            <textarea
              className="code-editor-area"
              style={{ minHeight: 220 }}
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="Cole a nova versão aqui..."
            />
          </div>
        </div>
      </div>

      {/* Diff Result View */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <GitCompare size={16} />
            <span>Comparação Visual (Diff Linha a Linha)</span>
          </div>
          <div className="panel-actions">
            <span className="badge badge-emerald">+{additions} Adições</span>
            <span className="badge badge-rose">-{deletions} Remoções</span>
          </div>
        </div>

        <div className="panel-body" style={{ padding: 0 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            lineHeight: 1.6,
            maxHeight: 380,
            overflowY: 'auto'
          }}>
            {diffResult.map((item, idx) => {
              let bg = 'transparent';
              let color = 'var(--text-primary)';
              let sign = ' ';

              if (item.type === 'added') {
                bg = 'rgba(16, 185, 129, 0.12)';
                color = '#34d399';
                sign = '+';
              } else if (item.type === 'deleted') {
                bg = 'rgba(239, 68, 68, 0.12)';
                color = '#f87171';
                sign = '-';
              }

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    background: bg,
                    color: color,
                    padding: '2px 14px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
                  }}
                >
                  <span style={{ width: 24, userSelect: 'none', fontWeight: 700, opacity: 0.7 }}>
                    {sign}
                  </span>
                  <span style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {item.text || ' '}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel-footer">
          <span>Comparador de texto no estilo Git diff</span>
          <span>Próprio para código, configurações e textos</span>
        </div>
      </div>
    </div>
  );
}
