import React, { useState } from 'react';
import { Database, Copy, Download, Trash2, Check, RefreshCw } from 'lucide-react';
import { formatSql } from '../../utils/formatters';

const SAMPLE_SQL = `select u.id, u.nome, u.email, count(p.id) as total_pedidos, sum(p.valor) as total_gasto from usuarios u left join pedidos p on u.id = p.usuario_id where u.ativo = 1 and p.status = 'pago' group by u.id, u.nome, u.email having sum(p.valor) > 500 order by total_gasto desc limit 50;`;

export default function SqlFormatter({ onCopy, lang = 'pt' }) {
  const [inputSql, setInputSql] = useState(SAMPLE_SQL);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    const formatted = formatSql(inputSql, uppercaseKeywords);
    setInputSql(formatted);
    if (onCopy) onCopy('SQL formatado!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('SQL copiado!');
  };

  const handleDownload = () => {
    const blob = new Blob([inputSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Database size={16} />
          <span>Formatador de Queries SQL</span>
        </div>
        <div className="panel-actions">
          <label className="form-switch" style={{ padding: '4px 10px', fontSize: 12, height: 32 }}>
            <span>Palavras-chave em MAIÚSCULAS</span>
            <input
              type="checkbox"
              checked={uppercaseKeywords}
              onChange={e => setUppercaseKeywords(e.target.checked)}
            />
          </label>

          <button className="btn-primary" onClick={handleFormat}>
            Formatar SQL
          </button>
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          <button className="btn-icon" onClick={handleDownload} title="Baixar SQL">
            <Download size={15} />
          </button>
          <button className="btn-icon" onClick={() => setInputSql('')} title="Limpar">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="panel-body">
        <textarea
          className="code-editor-area"
          style={{ minHeight: 380 }}
          value={inputSql}
          onChange={e => setInputSql(e.target.value)}
          placeholder="Cole sua query SQL aqui..."
          spellCheck="false"
        />
      </div>

      <div className="panel-footer">
        <span>{inputSql.length} caracteres · {inputSql.split('\n').length} linhas</span>
        <button
          className="btn-ghost"
          style={{ padding: '2px 8px', fontSize: 11 }}
          onClick={() => setInputSql(SAMPLE_SQL)}
        >
          Carregar Exemplo SQL
        </button>
      </div>
    </div>
  );
}
