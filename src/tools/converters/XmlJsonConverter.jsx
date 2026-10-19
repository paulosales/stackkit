import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Download, Check, AlertCircle } from 'lucide-react';

const SAMPLE_XML = `<user id="101">
  <name>Paulo Santos</name>
  <email>paulo@dev.com</email>
  <role>Senior Engineer</role>
  <skills>
    <skill>React</skill>
    <skill>Vite</skill>
    <skill>Node</skill>
  </skills>
</user>`;

export default function XmlJsonConverter({ onCopy, lang = 'pt' }) {
  const [direction, setDirection] = useState('xml2json'); // 'xml2json' or 'json2xml'
  const [inputVal, setInputVal] = useState(SAMPLE_XML);
  const [outputVal, setOutputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  // XML to JSON converter
  const convertXmlToJson = (xmlStr) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'application/xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML Inválido: ' + parserError.textContent.split('\n')[0]);
    }

    const domToJson = (node) => {
      // Text node
      if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue.trim();
      }

      const obj = {};

      // Attributes
      if (node.attributes && node.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          obj['@attributes'][attr.name] = attr.value;
        }
      }

      // Children
      const childNodes = Array.from(node.childNodes).filter(
        n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.nodeValue.trim())
      );

      if (childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE) {
        if (!obj['@attributes']) {
          return childNodes[0].nodeValue.trim();
        } else {
          obj['#text'] = childNodes[0].nodeValue.trim();
          return obj;
        }
      }

      childNodes.forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const childName = child.nodeName;
          const childVal = domToJson(child);
          if (obj[childName]) {
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(childVal);
          } else {
            obj[childName] = childVal;
          }
        }
      });

      return obj;
    };

    const root = doc.documentElement;
    const result = { [root.nodeName]: domToJson(root) };
    return JSON.stringify(result, null, 2);
  };

  // JSON to XML converter
  const convertJsonToXml = (jsonStr) => {
    const obj = JSON.parse(jsonStr);

    const toXml = (o, tagName = 'root') => {
      if (o === null || o === undefined) return `<${tagName}/>`;
      if (typeof o !== 'object') return `<${tagName}>${String(o)}</${tagName}>`;

      let xml = `<${tagName}`;
      let attrs = '';
      let children = '';

      if (o['@attributes']) {
        for (const [k, v] of Object.entries(o['@attributes'])) {
          attrs += ` ${k}="${String(v).replace(/"/g, '&quot;')}"`;
        }
      }

      xml += attrs;

      if (o['#text']) {
        children += o['#text'];
      }

      for (const [k, v] of Object.entries(o)) {
        if (k === '@attributes' || k === '#text') continue;
        if (Array.isArray(v)) {
          v.forEach(item => {
            children += '\n  ' + toXml(item, k);
          });
        } else {
          children += '\n  ' + toXml(v, k);
        }
      }

      if (children) {
        xml += `>${children}\n</${tagName}>`;
      } else {
        xml += '/>';
      }

      return xml;
    };

    const keys = Object.keys(obj);
    if (keys.length === 1) {
      return `<?xml version="1.0" encoding="UTF-8"?>\n` + toXml(obj[keys[0]], keys[0]);
    }
    return `<?xml version="1.0" encoding="UTF-8"?>\n` + toXml(obj, 'root');
  };

  const handleConvert = () => {
    if (!inputVal.trim()) {
      setOutputVal('');
      setErrorMsg(null);
      return;
    }
    try {
      if (direction === 'xml2json') {
        const res = convertXmlToJson(inputVal);
        setOutputVal(res);
      } else {
        const res = convertJsonToXml(inputVal);
        setOutputVal(res);
      }
      setErrorMsg(null);
      if (onCopy) onCopy('Conversão realizada com sucesso!');
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  const toggleDirection = () => {
    const newDir = direction === 'xml2json' ? 'json2xml' : 'xml2json';
    setDirection(newDir);
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

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <ArrowLeftRight size={16} />
          <span>Conversor XML ↔ JSON</span>
        </div>
        <div className="panel-actions">
          <button className="btn-secondary" onClick={toggleDirection}>
            <span>{direction === 'xml2json' ? 'XML → JSON' : 'JSON → XML'}</span>
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
              <span>{direction === 'xml2json' ? 'XML de Entrada' : 'JSON de Entrada'}</span>
              <span className="badge badge-cyan">{direction === 'xml2json' ? 'XML' : 'JSON'}</span>
            </label>
            <textarea
              className="code-editor-area"
              style={{ minHeight: 340 }}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={direction === 'xml2json' ? 'Cole seu XML aqui...' : 'Cole seu JSON aqui...'}
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>{direction === 'xml2json' ? 'JSON Convertido' : 'XML Convertido'}</span>
              <button
                className="btn-icon"
                onClick={handleCopy}
                disabled={!outputVal}
                title="Copiar resultado"
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
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
        <span>Suporte a nós aninhados, arrays e atributos</span>
        <span>Parser nativo seguro</span>
      </div>
    </div>
  );
}
