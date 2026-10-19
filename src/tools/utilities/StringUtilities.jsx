import React, { useState } from 'react';
import { CaseSensitive, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

export default function StringUtilities({ onCopy, lang = 'pt' }) {
  const [text, setText] = useState('Transformador de texto avançado do StackKit com suporte a acentuação e programação!');
  const [copied, setCopied] = useState(false);

  const toCamelCase = (str) => {
    return str
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, match => match.toLowerCase());
  };

  const toPascalCase = (str) => {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  const toSnakeCase = (str) => {
    return str
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .toLowerCase();
  };

  const toKebabCase = (str) => {
    return str
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .toLowerCase();
  };

  const toConstantCase = (str) => {
    return toSnakeCase(str).toUpperCase();
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toSentenceCase = (str) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const slugify = (str) => {
    return removeAccents(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const reverseText = (str) => {
    return str.split('').reverse().join('');
  };

  const removeExtraSpaces = (str) => {
    return str.replace(/\s+/g, ' ').trim();
  };

  const removeLineBreaks = (str) => {
    return str.replace(/[\r\n]+/g, ' ').trim();
  };

  const applyTransformation = (transformFn) => {
    setText(transformFn(text));
    if (onCopy) onCopy('Transformação aplicada!');
  };

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
          <CaseSensitive size={16} />
          <span>Padronizador de Texto e Utilitários de String</span>
        </div>
        <div className="panel-actions">
          <button className="btn-primary" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>
        </div>
      </div>

      <div className="panel-body">
        <div className="form-group">
          <label className="form-label">Texto para Transformar</label>
          <textarea
            className="code-editor-area"
            style={{ minHeight: 180 }}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Digite ou cole o texto aqui..."
          />
        </div>

        {/* Transformation Action Buttons */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
            Transformações Rápidas:
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button className="btn-secondary" onClick={() => applyTransformation(t => t.toUpperCase())}>
              MAIÚSCULAS
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(t => t.toLowerCase())}>
              minúsculas
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(toTitleCase)}>
              Primeira Letra Maiúscula
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(toSentenceCase)}>
              Formato de Frase
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(toCamelCase)}>
              camelCase
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(toPascalCase)}>
              PascalCase
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(toSnakeCase)}>
              snake_case
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(toKebabCase)}>
              kebab-case
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(toConstantCase)}>
              CONSTANT_CASE
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(slugify)}>
              slugify-para-url
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(removeAccents)}>
              Remover Acentos
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(removeExtraSpaces)}>
              Remover Espaços Extras
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(removeLineBreaks)}>
              Remover Quebras de Linha
            </button>
            <button className="btn-secondary" onClick={() => applyTransformation(reverseText)}>
              Inverter Texto
            </button>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <span>{text.length} caracteres · {text.trim().split(/\s+/).filter(Boolean).length} palavras</span>
        <span>Suporte completo ao português e padrões de código</span>
      </div>
    </div>
  );
}
