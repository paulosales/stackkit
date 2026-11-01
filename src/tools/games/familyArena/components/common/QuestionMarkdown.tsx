import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export interface QuestionMarkdownProps {
  content: string;
  size?: 'large' | 'medium' | 'small' | 'compact';
  className?: string;
  align?: 'center' | 'left';
}

function SafeImage({
  src,
  alt,
  size = 'large',
}: {
  src: string;
  alt: string;
  size: 'large' | 'medium' | 'small' | 'compact';
}) {
  const [failed, setFailed] = useState(false);

  const sizeClasses = {
    large: 'max-h-64 sm:max-h-80',
    medium: 'max-h-48 sm:max-h-60',
    small: 'max-h-36 sm:max-h-48',
    compact: 'max-h-32 sm:max-h-40',
  }[size];

  if (failed) {
    return (
      <div className="my-2 flex items-center justify-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
        <ImageIcon className="w-4 h-4 mr-1.5 opacity-60 flex-shrink-0" />
        <span className="truncate">{alt || 'Image unavailable'}</span>
      </div>
    );
  }

  return (
    <div className="my-2.5 sm:my-3 flex flex-col items-center justify-center">
      <img
        src={src}
        alt={alt || 'Question Image'}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`${sizeClasses} max-w-full rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/80 object-contain transition-all hover:scale-[1.01]`}
      />
      {alt && (
        <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 italic max-w-md text-center truncate">
          {alt}
        </span>
      )}
    </div>
  );
}

export const QuestionMarkdown: React.FC<QuestionMarkdownProps> = ({
  content,
  size = 'large',
  className = '',
  align = 'center',
}) => {
  if (!content) return null;

  // Inline regex parser: Images, Links, Bold-Italic, Bold, Italic, Strikethrough, Code
  const parseInline = (str: string, keyPrefix: string): React.ReactNode => {
    const regex = /(!\[.*?\]\(.*?\)|\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|~~.*?~~|`.*?`|\[.*?\]\(.*?\))/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      const token = match[0];
      const partKey = `${keyPrefix}-${match.index}`;

      if (token.startsWith('![') && token.includes('](')) {
        // Image
        const alt = token.slice(2, token.indexOf(']('));
        const src = token.slice(token.indexOf('](') + 2, -1).trim();
        parts.push(<SafeImage key={partKey} src={src} alt={alt} size={size} />);
      } else if (token.startsWith('[') && token.includes('](')) {
        // Link
        const label = token.slice(1, token.indexOf(']('));
        const href = token.slice(token.indexOf('](') + 2, -1).trim();
        parts.push(
          <a
            key={partKey}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 underline hover:opacity-80 transition font-medium"
          >
            {label}
          </a>
        );
      } else if (token.startsWith('***') && token.endsWith('***')) {
        parts.push(
          <strong key={partKey} className="font-extrabold italic text-slate-900 dark:text-white">
            {token.slice(3, -3)}
          </strong>
        );
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={partKey} className="font-extrabold text-slate-900 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={partKey} className="italic text-slate-800 dark:text-slate-100">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('~~') && token.endsWith('~~')) {
        parts.push(
          <del key={partKey} className="line-through opacity-70">
            {token.slice(2, -2)}
          </del>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={partKey}
            className="px-1.5 py-0.5 rounded-md font-mono text-[0.9em] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      lastIndex = match.index + token.length;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  // Block parser for code blocks, headers, lists, blockquotes, and paragraphs
  const renderBlocks = () => {
    const lines = content.split('\n');
    const blocks: React.ReactNode[] = [];
    let inCode = false;
    let codeLines: string[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = (key: string) => {
      if (listBuffer && listBuffer.items.length > 0) {
        if (listBuffer.type === 'ul') {
          blocks.push(
            <ul
              key={`ul-${key}`}
              className="list-disc list-inside text-left my-2 space-y-1 text-slate-800 dark:text-slate-200"
            >
              {listBuffer.items.map((it, idx) => (
                <li key={idx}>{parseInline(it, `ul-${key}-${idx}`)}</li>
              ))}
            </ul>
          );
        } else {
          blocks.push(
            <ol
              key={`ol-${key}`}
              className="list-decimal list-inside text-left my-2 space-y-1 text-slate-800 dark:text-slate-200"
            >
              {listBuffer.items.map((it, idx) => (
                <li key={idx}>{parseInline(it, `ol-${key}-${idx}`)}</li>
              ))}
            </ol>
          );
        }
        listBuffer = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code blocks ```
      if (trimmed.startsWith('```')) {
        flushList(`before-code-${i}`);
        if (inCode) {
          blocks.push(
            <pre
              key={`code-${i}`}
              className="my-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 text-left overflow-x-auto shadow-inner"
            >
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
          codeLines = [];
          inCode = false;
        } else {
          inCode = true;
          codeLines = [];
        }
        continue;
      }

      if (inCode) {
        codeLines.push(line);
        continue;
      }

      // Standalone Image: ![alt](url)
      const isStandaloneImage = /^!\[(.*?)\]\((.*?)\)$/.test(trimmed);
      if (isStandaloneImage) {
        flushList(`img-${i}`);
        const match = /^!\[(.*?)\]\((.*?)\)$/.exec(trimmed);
        if (match) {
          blocks.push(
            <SafeImage key={`block-img-${i}`} src={match[2].trim()} alt={match[1]} size={size} />
          );
        }
        continue;
      }

      // Headers: #, ##, ###
      if (trimmed.startsWith('### ')) {
        flushList(`h3-${i}`);
        blocks.push(
          <h4 key={`h3-${i}`} className="font-bold text-lg sm:text-xl my-2 text-slate-900 dark:text-white">
            {parseInline(trimmed.slice(4), `h3-content-${i}`)}
          </h4>
        );
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushList(`h2-${i}`);
        blocks.push(
          <h3 key={`h2-${i}`} className="font-bold text-xl sm:text-2xl my-2 text-slate-900 dark:text-white">
            {parseInline(trimmed.slice(3), `h2-content-${i}`)}
          </h3>
        );
        continue;
      }
      if (trimmed.startsWith('# ')) {
        flushList(`h1-${i}`);
        blocks.push(
          <h2 key={`h1-${i}`} className="font-extrabold text-2xl sm:text-3xl my-2 text-slate-900 dark:text-white">
            {parseInline(trimmed.slice(2), `h1-content-${i}`)}
          </h2>
        );
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        flushList(`bq-${i}`);
        blocks.push(
          <blockquote
            key={`bq-${i}`}
            className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-3.5 my-2.5 italic text-slate-600 dark:text-slate-300 text-left bg-indigo-50/40 dark:bg-indigo-950/20 py-1.5 rounded-r-xl"
          >
            {parseInline(trimmed.slice(2), `bq-content-${i}`)}
          </blockquote>
        );
        continue;
      }

      // Lists
      if (/^[-*]\s+/.test(trimmed)) {
        if (!listBuffer || listBuffer.type !== 'ul') {
          flushList(`ul-switch-${i}`);
          listBuffer = { type: 'ul', items: [] };
        }
        listBuffer.items.push(trimmed.replace(/^[-*]\s+/, ''));
        continue;
      }
      if (/^\d+\.\s+/.test(trimmed)) {
        if (!listBuffer || listBuffer.type !== 'ol') {
          flushList(`ol-switch-${i}`);
          listBuffer = { type: 'ol', items: [] };
        }
        listBuffer.items.push(trimmed.replace(/^\d+\.\s+/, ''));
        continue;
      }

      // Empty line / paragraph break
      if (trimmed === '') {
        flushList(`empty-${i}`);
        continue;
      }

      // Regular line / paragraph
      flushList(`p-${i}`);
      blocks.push(
        <div key={`p-${i}`} className="leading-snug my-1">
          {parseInline(line, `inline-${i}`)}
        </div>
      );
    }

    // Flush any pending list or unclosed code block
    flushList('final');
    if (inCode && codeLines.length > 0) {
      blocks.push(
        <pre
          key="code-final"
          className="my-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 text-left overflow-x-auto shadow-inner"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    }

    return blocks;
  };

  const textSizes = {
    large: 'text-2xl sm:text-4xl font-extrabold',
    medium: 'text-xl sm:text-3xl font-extrabold',
    small: 'text-base sm:text-lg font-bold',
    compact: 'text-sm font-bold',
  }[size];

  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div
      className={`family-arena-markdown ${textSizes} ${alignClass} text-slate-900 dark:text-white leading-tight break-words ${className}`}
    >
      {renderBlocks()}
    </div>
  );
};

