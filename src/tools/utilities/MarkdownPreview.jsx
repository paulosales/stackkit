import React, { useState } from 'react';
import { FileType, Copy, Download, Check, Bold, Italic, Heading1, Heading2, List, Code, Quote, Table } from 'lucide-react';

const SAMPLE_MD = `# StackKit DevStudio 🚀
Ferramentas completas e modernas para desenvolvedores.

## Funcionalidades Principais
- **100% Client-Side**: Seus dados nunca saem da sua máquina.
- **Rápido & Responsivo**: Construído com React 19 e Vite.
- **Padrões Brasileiros**: Suporte oficial a CPF, CNPJ, RG e PIX.

### Exemplo de Código
\`\`\`javascript
const devStudio = {
  nome: "StackKit",
  offline: true,
  status: "pronto"
};
console.log("Sucesso!");
\`\`\`

> "A melhor ferramenta é aquela que resolve seu problema sem fricção."

### Tabela de Comparação
| Recurso | StackKit | Outros Sites |
| :--- | :--- | :--- |
| Velocidade | Instantânea | Lenta |
| Privacidade | 100% Local | Envia dados ao servidor |
| Layout | Studio Multi-Abas | Lista simples |
`;

export default function MarkdownPreview({ onCopy, lang = 'pt' }) {
  const [markdown, setMarkdown] = useState(SAMPLE_MD);
  const [copied, setCopied] = useState(false);

  const insertText = (before, after = '') => {
    setMarkdown(prev => `${prev}\n${before}${after}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Markdown copiado!');
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Safe native JSX renderer for markdown lines
  const renderMarkdownJSX = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let inList = false;
    let listBuffer = [];
    let inTable = false;
    let tableBuffer = [];

    const flushList = (key) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} style={{ paddingLeft: 24, margin: '8px 0', lineHeight: 1.7 }}>
            {listBuffer.map((it, idx) => <li key={idx}>{parseInline(it)}</li>)}
          </ul>
        );
        listBuffer = [];
      }
    };

    const flushTable = (key) => {
      if (tableBuffer.length > 0) {
        const rows = tableBuffer.map(r => r.split('|').map(c => c.trim()).filter(Boolean));
        if (rows.length > 0) {
          const headers = rows[0];
          const dataRows = rows.slice(1).filter(r => !r.every(c => /^:?-+:?$/.test(c)));
          elements.push(
            <div key={`table-${key}`} style={{ overflowX: 'auto', margin: '12px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-strong)', background: 'var(--bg-surface-elevated)' }}>
                    {headers.map((h, hi) => (
                      <th key={hi} style={{ padding: '8px 12px', fontWeight: 700 }}>{parseInline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: '8px 12px' }}>{parseInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        tableBuffer = [];
      }
    };

    const parseInline = (str) => {
      // Split bold, inline code
      const parts = [];
      let remaining = str;

      // Simple regex-based inline parser
      const regex = /(\*\*.*?\*\*|\`.*?\`|\[.*?\]\(.*?\))/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(str)) !== null) {
        if (match.index > lastIndex) {
          parts.push(str.substring(lastIndex, match.index));
        }
        const m = match[0];
        if (m.startsWith('**') && m.endsWith('**')) {
          parts.push(<strong key={match.index} style={{ color: 'var(--text-primary)' }}>{m.slice(2, -2)}</strong>);
        } else if (m.startsWith('`') && m.endsWith('`')) {
          parts.push(
            <code key={match.index} style={{
              background: 'var(--bg-input)', padding: '2px 6px', borderRadius: 4,
              color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.9em'
            }}>
              {m.slice(1, -1)}
            </code>
          );
        } else if (m.startsWith('[') && m.includes('](')) {
          const label = m.slice(1, m.indexOf(']('));
          const url = m.slice(m.indexOf('](') + 2, -1);
          parts.push(
            <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
              {label}
            </a>
          );
        }
        lastIndex = match.index + m.length;
      }
      if (lastIndex < str.length) {
        parts.push(str.substring(lastIndex));
      }
      return parts.length > 0 ? parts : str;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} style={{
              background: 'var(--bg-input)', padding: '14px 16px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)', overflowX: 'auto', margin: '12px 0',
              fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--accent-cyan)'
            }}>
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          flushList(i);
          flushTable(i);
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Tables
      if (line.trim().startsWith('|')) {
        flushList(i);
        tableBuffer.push(line);
        continue;
      } else if (tableBuffer.length > 0) {
        flushTable(i);
      }

      // Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        flushTable(i);
        listBuffer.push(line.trim().slice(2));
        continue;
      } else if (listBuffer.length > 0) {
        flushList(i);
      }

      // Headings
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} style={{ fontSize: 24, fontWeight: 800, margin: '18px 0 8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>{parseInline(line.slice(2))}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 8px' }}>{parseInline(line.slice(3))}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} style={{ fontSize: 16, fontWeight: 600, margin: '14px 0 6px', color: 'var(--accent-cyan)' }}>{parseInline(line.slice(4))}</h3>);
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} style={{
            borderLeft: '3px solid var(--accent-cyan)', paddingLeft: 14, margin: '12px 0',
            color: 'var(--text-secondary)', fontStyle: 'italic'
          }}>
            {parseInline(line.slice(2))}
          </blockquote>
        );
      } else if (line.trim()) {
        elements.push(<p key={i} style={{ margin: '8px 0', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{parseInline(line)}</p>);
      }
    }

    flushList(lines.length);
    flushTable(lines.length);

    return elements;
  };

  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileType size={16} />
          <span>Editor e Preview de Markdown ao Vivo</span>
        </div>
        <div className="panel-actions">
          <button className="btn-secondary" onClick={handleDownload} title="Baixar .md">
            <Download size={14} />
            <span>Baixar .md</span>
          </button>
          <button className="btn-primary" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      <div className="panel-body">
        {/* Quick Markdown Toolbar */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
          <button className="btn-icon" onClick={() => insertText('**', 'Texto em Negrito**')} title="Negrito">
            <Bold size={15} />
          </button>
          <button className="btn-icon" onClick={() => insertText('*', 'Texto em Itálico*')} title="Itálico">
            <Italic size={15} />
          </button>
          <button className="btn-icon" onClick={() => insertText('# Título Principal')} title="Título H1">
            <Heading1 size={15} />
          </button>
          <button className="btn-icon" onClick={() => insertText('## Subtítulo')} title="Título H2">
            <Heading2 size={15} />
          </button>
          <button className="btn-icon" onClick={() => insertText('- Item da lista')} title="Lista">
            <List size={15} />
          </button>
          <button className="btn-icon" onClick={() => insertText('```javascript\nconsole.log("Hello");\n```')} title="Bloco de código">
            <Code size={15} />
          </button>
          <button className="btn-icon" onClick={() => insertText('> Citação')} title="Citação">
            <Quote size={15} />
          </button>
          <button className="btn-icon" onClick={() => insertText('| Coluna 1 | Coluna 2 |\n| :--- | :--- |\n| Dado 1 | Dado 2 |')} title="Tabela">
            <Table size={15} />
          </button>
        </div>

        <div className="workspace-grid" style={{ gap: 16 }}>
          {/* Editor Area */}
          <div className="form-group">
            <label className="form-label">Editor Markdown</label>
            <textarea
              className="code-editor-area"
              style={{ minHeight: 400 }}
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              placeholder="Escreva Markdown aqui..."
              spellCheck="false"
            />
          </div>

          {/* Rendered View */}
          <div className="form-group">
            <label className="form-label">Resultado Renderizado (GFM Seguro)</label>
            <div style={{
              minHeight: 400,
              maxHeight: 440,
              overflowY: 'auto',
              padding: '16px 20px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)'
            }}>
              {renderMarkdownJSX(markdown)}
            </div>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <span>{markdown.length} caracteres · {wordCount} palavras</span>
        <span>Renderização nativa React JSX 100% segura contra XSS</span>
      </div>
    </div>
  );
}
