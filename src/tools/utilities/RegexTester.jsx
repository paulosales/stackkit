import React, { useState } from 'react';
import { Regex, Copy, Check, AlertCircle, Sparkles } from 'lucide-react';

const PRESETS = [
  { name: 'E-mail', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
  { name: 'CPF', pattern: '\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b', flags: 'g' },
  { name: 'CNPJ', pattern: '\\b\\d{2}\\.?\\d{3}\\.?\\d{3}\\/?\\d{4}-?\\d{2}\\b', flags: 'g' },
  { name: 'Data (DD/MM/AAAA)', pattern: '\\b(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}\\b', flags: 'g' },
  { name: 'Telefone Celular BR', pattern: '\\(?([1-9]{2})\\)?\\s?9?\\d{4}-?\\d{4}', flags: 'g' },
  { name: 'URL Web', pattern: 'https?:\\/\\/[\\w\\-\\.]+(\\:[0-9]+)?(/[\\w\\-\\._~:/?#[\\]@!$&\'()*+,;=]*)?', flags: 'gi' },
  { name: 'Endereço IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g' }
];

export default function RegexTester({ onCopy, lang = 'pt' }) {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Contatos: suporte@stackkit.com.br, contato@empresa.com.br e teste123@gmail.com.');
  const [errorMsg, setErrorMsg] = useState(null);

  const testRegex = () => {
    if (!pattern) return { matches: [], error: null };
    try {
      const reg = new RegExp(pattern, flags);
      const matches = [];

      if (flags.includes('g')) {
        let match;
        while ((match = reg.exec(testText)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (reg.lastIndex === match.index) reg.lastIndex++;
        }
      } else {
        const match = reg.exec(testText);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: e.message };
    }
  };

  const { matches, error } = testRegex();

  const toggleFlag = (flag) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const applyPreset = (preset) => {
    setPattern(preset.pattern);
    setFlags(preset.flags);
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Regex size={16} />
          <span>Testador de Expressões Regulares (RegEx)</span>
        </div>
      </div>

      <div className="panel-body">
        {/* Presets bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Padrões comuns:</span>
          {PRESETS.map(p => (
            <button
              key={p.name}
              className="btn-secondary"
              style={{ padding: '3px 9px', fontSize: 11 }}
              onClick={() => applyPreset(p)}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Pattern & Flags row */}
        <div className="form-row" style={{ alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 3 }}>
            <label className="form-label">Expressão Regular (Pattern)</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0 10px' }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>/</span>
              <input
                type="text"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                placeholder="Ex: \w+@\w+\.\w+"
                style={{ border: 'none', background: 'transparent', flex: 1, fontFamily: 'var(--font-mono)' }}
              />
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>/</span>
            </div>
          </div>

          <div className="form-group" style={{ flex: 1.5 }}>
            <label className="form-label">Flags ({flags || 'nenhuma'})</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['g', 'i', 'm', 's'].map(fl => (
                <button
                  key={fl}
                  className={`btn-secondary ${flags.includes(fl) ? 'active' : ''}`}
                  onClick={() => toggleFlag(fl)}
                  style={{
                    flex: 1, padding: '8px 0', fontFamily: 'var(--font-mono)', fontWeight: 700,
                    borderColor: flags.includes(fl) ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                    color: flags.includes(fl) ? 'var(--accent-cyan)' : 'var(--text-secondary)'
                  }}
                  title={fl === 'g' ? 'Global' : fl === 'i' ? 'Case Insensitive' : fl === 'm' ? 'Multiline' : 'DotAll'}
                >
                  {fl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
          }}>
            <AlertCircle size={16} />
            <span>Regex Inválido: {error}</span>
          </div>
        )}

        {/* Test Text */}
        <div className="form-group">
          <label className="form-label">
            <span>Texto de Teste</span>
            <span className="badge badge-cyan">{matches.length} correspondência(s)</span>
          </label>
          <textarea
            rows={4}
            className="code-editor-area"
            style={{ minHeight: 120 }}
            value={testText}
            onChange={e => setTestText(e.target.value)}
            placeholder="Digite o texto de teste..."
          />
        </div>

        {/* Matches cards */}
        {matches.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Correspondências Encontradas ({matches.length}):
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8,
              maxHeight: 220, overflowY: 'auto'
            }}>
              {matches.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px', background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                    display: 'flex', flexDirection: 'column', gap: 4
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-emerald">Match #{idx + 1}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Posição: {m.index}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    "{m.text}"
                  </div>
                  {m.groups.length > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      Grupos: {m.groups.map((g, gi) => `$${gi + 1}: "${g}"`).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <span>Mecanismo nativo JavaScript RegExp</span>
        <span>Avaliação instantânea</span>
      </div>
    </div>
  );
}
