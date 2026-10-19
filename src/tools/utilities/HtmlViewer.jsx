import React, { useState } from 'react';
import { Eye, Copy, Check, RefreshCw, Maximize2 } from 'lucide-react';

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 28px;
      max-width: 380px;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      background: rgba(6, 182, 212, 0.2);
      color: #38bdf8;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    h2 { margin: 0 0 10px; font-size: 22px; color: #ffffff; }
    p { margin: 0 0 20px; color: #94a3b8; font-size: 14px; line-height: 1.5; }
    button {
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, filter 0.2s;
    }
    button:hover { transform: translateY(-2px); filter: brightness(1.1); }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">StackKit Studio</div>
    <h2>Preview HTML ao Vivo</h2>
    <p>Edite o código HTML e CSS no painel ao lado para ver as alterações renderizadas instantaneamente.</p>
    <button onclick="alert('Funciona perfeitamente!')">Testar Interação</button>
  </div>
</body>
</html>`;

export default function HtmlViewer({ onCopy, lang = 'pt' }) {
  const [htmlCode, setHtmlCode] = useState(SAMPLE_HTML);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Código HTML copiado!');
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Eye size={16} />
          <span>Visualizador e Editor de HTML ao Vivo</span>
        </div>
        <div className="panel-actions">
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setHtmlCode(SAMPLE_HTML)}>
            Exemplo
          </button>
        </div>
      </div>

      <div className="panel-body">
        <div className="workspace-grid" style={{ gap: 16 }}>
          {/* Editor */}
          <div className="form-group">
            <label className="form-label">Código HTML / CSS / JS</label>
            <textarea
              className="code-editor-area"
              style={{ minHeight: 440, fontSize: 12.5 }}
              value={htmlCode}
              onChange={e => setHtmlCode(e.target.value)}
              placeholder="Digite seu HTML aqui..."
              spellCheck="false"
            />
          </div>

          {/* Sandboxed Live Preview */}
          <div className="form-group">
            <label className="form-label">Renderização em Tempo Real (Sandbox Segura)</label>
            <div style={{
              width: '100%',
              height: 440,
              background: '#090d16',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden'
            }}>
              <iframe
                title="Preview"
                srcDoc={htmlCode}
                sandbox="allow-scripts"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <span>Iframe sandbox isolado (allow-scripts sem acesso ao ambiente pai)</span>
        <span>Renderização em tempo real</span>
      </div>
    </div>
  );
}
