import React, { useState, useEffect } from 'react';
import { AlignLeft, RefreshCw, Copy, Check, Settings } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum'
];

export default function LoremIpsumGenerator({ onCopy, lang = 'pt' }) {
  const [type, setType] = useState('paragraphs'); // 'paragraphs', 'words', 'sentences', 'lists'
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [htmlTags, setHtmlTags] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSentence = () => {
    const len = Math.floor(Math.random() * 10) + 8;
    const words = [];
    for (let i = 0; i < len; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 4) + 4;
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  const generate = () => {
    let result = '';

    if (type === 'words') {
      const words = [];
      if (startWithLorem) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }
      while (words.length < count) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      result = words.slice(0, count).join(' ');
    } else if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
        } else {
          sentences.push(generateSentence());
        }
      }
      result = sentences.join(' ');
    } else if (type === 'lists') {
      const items = [];
      for (let i = 0; i < count; i++) {
        items.push(generateSentence());
      }
      result = htmlTags
        ? `<ul>\n${items.map(it => `  <li>${it}</li>`).join('\n')}\n</ul>`
        : items.map(it => `• ${it}`).join('\n');
    } else {
      // paragraphs
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        let p = generateParagraph();
        if (i === 0 && startWithLorem) {
          p = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + p;
        }
        paragraphs.push(htmlTags ? `<p>${p}</p>` : p);
      }
      result = paragraphs.join('\n\n');
    }

    setGeneratedText(result);
  };

  useEffect(() => {
    generate();
  }, [type, count, startWithLorem, htmlTags]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Texto Lorem Ipsum copiado!');
  };

  const wordsCount = generatedText.trim().split(/\s+/).filter(Boolean).length;
  const charsCount = generatedText.length;

  return (
    <div className="workspace-grid">
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Settings size={16} />
            <span>Configurações do Lorem Ipsum</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">Tipo de Preenchimento</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="paragraphs">Parágrafos</option>
              <option value="sentences">Frases</option>
              <option value="words">Palavras</option>
              <option value="lists">Lista de itens</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Quantidade</span>
              <span className="badge badge-cyan">{count} {type}</span>
            </label>
            <input
              type="range"
              min="1"
              max={type === 'words' ? 100 : 15}
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            <label className="form-switch">
              <span>Iniciar com "Lorem ipsum dolor sit amet..."</span>
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={e => setStartWithLorem(e.target.checked)}
              />
            </label>

            <label className="form-switch">
              <span>Adicionar tags HTML (&lt;p&gt; ou &lt;ul&gt;)</span>
              <input
                type="checkbox"
                checked={htmlTags}
                onChange={e => setHtmlTags(e.target.checked)}
              />
            </label>
          </div>

          <button className="btn-primary" onClick={generate} style={{ marginTop: 8 }}>
            <RefreshCw size={16} />
            <span>Regerar Texto</span>
          </button>
        </div>
      </div>

      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <AlignLeft size={16} />
            <span>Texto Gerado</span>
          </div>
          <div className="panel-actions">
            <button className="btn-primary" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>
        </div>

        <div className="panel-body">
          <textarea
            readOnly
            className="code-editor-area"
            style={{ minHeight: 280 }}
            value={generatedText}
            onClick={e => e.target.select()}
          />
        </div>

        <div className="panel-footer">
          <span>{wordsCount} palavras · {charsCount} caracteres</span>
          <span>Texto de preenchimento padrão</span>
        </div>
      </div>
    </div>
  );
}
