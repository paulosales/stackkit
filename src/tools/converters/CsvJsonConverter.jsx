import React, { useState } from 'react';
import { Table, Copy, Download, Check, AlertCircle, ArrowLeftRight } from 'lucide-react';
import { csvToJson, jsonToCsv } from '../../utils/formatters';

const SAMPLE_CSV = `id,nome,cargo,cidade,salario
1,Lucas Silva,Tech Lead,São Paulo,14500
2,Mariana Costa,Frontend Engineer,Curitiba,9800
3,Felipe Santos,DevOps Specialist,Belo Horizonte,11200
4,Beatriz Oliveira,Product Designer,Florianópolis,9000`;

export default function CsvJsonConverter({ onCopy, lang = 'pt' }) {
  const [direction, setDirection] = useState('csv2json'); // 'csv2json' or 'json2csv'
  const [delimiter, setDelimiter] = useState(',');
  const [inputVal, setInputVal] = useState(SAMPLE_CSV);
  const [outputVal, setOutputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!inputVal.trim()) {
      setOutputVal('');
      setErrorMsg(null);
      return;
    }
    try {
      if (direction === 'csv2json') {
        const res = csvToJson(inputVal, delimiter);
        setOutputVal(res);
      } else {
        const res = jsonToCsv(inputVal, delimiter);
        setOutputVal(res);
      }
      setErrorMsg(null);
      if (onCopy) onCopy('Conversão concluída!');
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  const toggleDirection = () => {
    const nextDir = direction === 'csv2json' ? 'json2csv' : 'csv2json';
    setDirection(nextDir);
    if (outputVal) {
      setInputVal(outputVal);
      setOutputVal('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Resultado copiado!');
  };

  const handleDownload = () => {
    const ext = direction === 'csv2json' ? 'json' : 'csv';
    const type = direction === 'csv2json' ? 'application/json' : 'text/csv';
    const blob = new Blob([outputVal], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Table size={16} />
          <span>Conversor CSV ↔ JSON</span>
        </div>
        <div className="panel-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Delimitador:</span>
            <select
              value={delimiter}
              onChange={e => setDelimiter(e.target.value)}
              style={{ padding: '4px 8px', fontSize: 12, height: 32 }}
            >
              <option value=",">Vírgula (,)</option>
              <option value=";">Ponto e vírgula (;)</option>
              <option value="&#9;">Tabulação (\t)</option>
            </select>
          </div>

          <button className="btn-secondary" onClick={toggleDirection}>
            <span>{direction === 'csv2json' ? 'CSV → JSON' : 'JSON → CSV'}</span>
          </button>
          <button className="btn-primary" onClick={handleConvert}>
            Converter
          </button>
        </div>
      </div>

      <div className="panel-body">
        {errorMsg && (
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="workspace-grid" style={{ gap: 16 }}>
          <div className="form-group">
            <label className="form-label">
              <span>{direction === 'csv2json' ? 'CSV de Entrada' : 'JSON de Entrada'}</span>
              <span className="badge badge-cyan">{direction === 'csv2json' ? 'CSV' : 'JSON'}</span>
            </label>
            <textarea
              className="code-editor-area"
              style={{ minHeight: 340 }}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={direction === 'csv2json' ? 'Cole os dados da planilha ou CSV...' : 'Cole o array JSON [{...}]...'}
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>{direction === 'csv2json' ? 'JSON Resultante' : 'CSV Resultante'}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-icon" onClick={handleDownload} disabled={!outputVal} title="Baixar arquivo">
                  <Download size={14} />
                </button>
                <button className="btn-icon" onClick={handleCopy} disabled={!outputVal} title="Copiar">
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
            <textarea
              readOnly
              className="code-editor-area"
              style={{ minHeight: 340, color: 'var(--accent-cyan)' }}
              value={outputVal}
              placeholder="O resultado convertido aparecerá aqui..."
            />
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <span>Compatível com Excel, Google Planilhas e bancos de dados</span>
        <span>Reconhecimento automático de números e booleanos</span>
      </div>
    </div>
  );
}
