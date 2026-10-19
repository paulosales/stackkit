import React, { useState } from 'react';
import { FileCog, Copy, Download, Check, AlertCircle } from 'lucide-react';
import { jsonToYaml, yamlToJson } from '../../utils/formatters';

const SAMPLE_JSON = `{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "stackkit-api",
    "labels": {
      "app": "stackkit"
    }
  },
  "spec": {
    "replicas": 3,
    "strategy": {
      "type": "RollingUpdate"
    }
  }
}`;

export default function JsonYamlConverter({ onCopy, lang = 'pt' }) {
  const [direction, setDirection] = useState('json2yaml'); // 'json2yaml' or 'yaml2json'
  const [inputVal, setInputVal] = useState(SAMPLE_JSON);
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
      if (direction === 'json2yaml') {
        const res = jsonToYaml(inputVal);
        setOutputVal(res);
      } else {
        const res = yamlToJson(inputVal);
        setOutputVal(res);
      }
      setErrorMsg(null);
      if (onCopy) onCopy('Conversão concluída!');
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  const toggleDirection = () => {
    const nextDir = direction === 'json2yaml' ? 'yaml2json' : 'json2yaml';
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
    const ext = direction === 'json2yaml' ? 'yaml' : 'json';
    const blob = new Blob([outputVal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileCog size={16} />
          <span>Conversor JSON ↔ YAML</span>
        </div>
        <div className="panel-actions">
          <button className="btn-secondary" onClick={toggleDirection}>
            <span>{direction === 'json2yaml' ? 'JSON → YAML' : 'YAML → JSON'}</span>
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
              <span>{direction === 'json2yaml' ? 'JSON de Entrada' : 'YAML de Entrada'}</span>
              <span className="badge badge-cyan">{direction === 'json2yaml' ? 'JSON' : 'YAML'}</span>
            </label>
            <textarea
              className="code-editor-area"
              style={{ minHeight: 340 }}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={direction === 'json2yaml' ? 'Cole seu JSON aqui...' : 'Cole seu YAML aqui...'}
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>{direction === 'json2yaml' ? 'YAML Convertido' : 'JSON Convertido'}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-icon" onClick={handleDownload} disabled={!outputVal} title="Baixar">
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
        <span>Ideal para manifests Kubernetes, Docker Compose e pipelines CI/CD</span>
        <span>Processamento local instantâneo</span>
      </div>
    </div>
  );
}
