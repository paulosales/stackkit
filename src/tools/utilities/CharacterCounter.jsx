import React, { useState } from 'react';
import { LetterText, Copy, Trash2, Check, Clock, Volume2 } from 'lucide-react';

const SAMPLE_TEXT = `O StackKit é uma suíte completa de utilitários rápidos para desenvolvedores, arquitetos e estudantes de tecnologia.
Todas as ferramentas funcionam 100% no seu navegador sem dependência de APIs remotas para manter seus dados seguros.
Conte palavras, caracteres, tempo estimado de leitura e inspecione frequências em tempo real.`;

export default function CharacterCounter({ onCopy, lang = 'pt' }) {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  // Stats calculation
  const totalChars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const lines = text ? text.split('\n').length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;

  // Reading time (200 words per minute) & Speaking time (130 words per minute)
  const readingTimeMinutes = Math.ceil(wordCount / 200) || 1;
  const speakingTimeMinutes = Math.ceil(wordCount / 130) || 1;

  // Word frequency
  const frequencyMap = {};
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-zA-Z0-9áéíóúâêîôûãõç]/g, '');
    if (clean.length > 2) {
      frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
    }
  });

  const topWords = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Texto copiado!');
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <LetterText size={16} />
          <span>Contador de Caracteres, Palavras e Estatísticas de Leitura</span>
        </div>
        <div className="panel-actions">
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          <button className="btn-icon" onClick={() => setText('')} title="Limpar">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="panel-body">
        {/* Main Stats Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Caracteres</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 4 }}>
              {totalChars}
            </div>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sem Espaços</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-purple)', marginTop: 4 }}>
              {charsNoSpaces}
            </div>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Palavras</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 4 }}>
              {wordCount}
            </div>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Linhas</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-amber)', marginTop: 4 }}>
              {lines}
            </div>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Parágrafos</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
              {paragraphs}
            </div>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Frases</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f43f5e', marginTop: 4 }}>
              {sentences}
            </div>
          </div>
        </div>

        {/* Reading and Speaking Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{
            padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12
          }}>
            <Clock size={20} color="var(--accent-cyan)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tempo Estimado de Leitura</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                ~{readingTimeMinutes} min ({wordCount} palavras a 200 ppm)
              </div>
            </div>
          </div>

          <div style={{
            padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12
          }}>
            <Volume2 size={20} color="var(--accent-emerald)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tempo Estimado de Fala</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                ~{speakingTimeMinutes} min ({wordCount} palavras a 130 ppm)
              </div>
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="form-group">
          <label className="form-label">Digite ou cole o texto para análise contínua:</label>
          <textarea
            className="code-editor-area"
            style={{ minHeight: 220 }}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Comece a digitar aqui..."
          />
        </div>

        {/* Word Density */}
        {topWords.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              Palavras mais Frequentes:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {topWords.map(([w, cnt]) => (
                <div
                  key={w}
                  style={{
                    padding: '4px 10px', background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)',
                    fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{w}</span>
                  <span className="badge badge-cyan" style={{ fontSize: 10 }}>{cnt}x</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <span>Contagem em tempo real e análise lexical</span>
        <span>Ideal para redação, SEO e limits de redes sociais</span>
      </div>
    </div>
  );
}
