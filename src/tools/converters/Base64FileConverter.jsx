import React, { useState } from 'react';
import { FileUp, Download, Copy, Check, Upload, Image as ImageIcon } from 'lucide-react';

export default function Base64FileConverter({ onCopy, lang = 'pt' }) {
  const [mode, setMode] = useState('file2base64'); // 'file2base64' or 'base642file'

  // File to Base64 state
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [dataUriOutput, setDataUriOutput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // Base64 to File state
  const [base64Input, setBase64Input] = useState('');
  const [reconstructedMime, setReconstructedMime] = useState('application/octet-stream');
  const [downloadFileName, setDownloadFileName] = useState('arquivo_reconstruido');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type || 'application/octet-stream');

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setDataUriOutput(result);
      // Strip data:mime/type;base64,
      const raw = result.split(',')[1] || '';
      setBase64Output(raw);

      if (file.type.startsWith('image/')) {
        setPreviewUrl(result);
      } else {
        setPreviewUrl('');
      }
      if (onCopy) onCopy('Arquivo codificado em Base64!');
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) onCopy('Copiado com sucesso!');
  };

  const handleDownloadDecoded = () => {
    try {
      let rawBase64 = base64Input.trim();
      let mime = reconstructedMime;

      if (rawBase64.startsWith('data:')) {
        const parts = rawBase64.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) mime = mimeMatch[1];
        rawBase64 = parts[1] || '';
      }

      const byteCharacters = atob(rawBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mime });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName || 'download_file';
      a.click();
      URL.revokeObjectURL(url);
      if (onCopy) onCopy('Arquivo baixado com sucesso!');
    } catch (e) {
      alert('Base64 inválido: não foi possível decodificar.');
    }
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileUp size={16} />
          <span>Conversor Base64 ↔ Arquivo</span>
        </div>
        <div className="panel-actions">
          <button
            className={`btn-secondary ${mode === 'file2base64' ? 'active' : ''}`}
            onClick={() => setMode('file2base64')}
          >
            Arquivo → Base64
          </button>
          <button
            className={`btn-secondary ${mode === 'base642file' ? 'active' : ''}`}
            onClick={() => setMode('base642file')}
          >
            Base64 → Arquivo
          </button>
        </div>
      </div>

      <div className="panel-body">
        {mode === 'file2base64' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Drag & Drop Area */}
            <label style={{
              border: '2px dashed var(--border-strong)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--bg-input)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              transition: 'border-color 150ms'
            }}>
              <Upload size={32} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Clique para selecionar um arquivo do seu computador</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Imagens, PDFs, áudios, vídeos, documentos ou binários (processado 100% localmente)
                </div>
              </div>
              <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>

            {fileName && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{
                  padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13
                }}>
                  <span><strong>{fileName}</strong> ({(fileSize / 1024).toFixed(1)} KB)</span>
                  <span className="badge badge-cyan">{mimeType}</span>
                </div>

                {previewUrl && (
                  <div style={{ textAlign: 'center', padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
                    />
                  </div>
                )}

                <div className="form-group">
                  <div className="form-label">
                    <span>Data URI Completo (para src="" em HTML/CSS)</span>
                    <button className="btn-icon" onClick={() => handleCopy('dataUri', dataUriOutput)} title="Copiar">
                      {copiedKey === 'dataUri' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    rows={4}
                    className="code-editor-area"
                    style={{ minHeight: 90 }}
                    value={dataUriOutput}
                    onClick={e => e.target.select()}
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <span>Base64 Puro (Sem cabeçalho data:)</span>
                    <button className="btn-icon" onClick={() => handleCopy('raw', base64Output)} title="Copiar">
                      {copiedKey === 'raw' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    rows={4}
                    className="code-editor-area"
                    style={{ minHeight: 90 }}
                    value={base64Output}
                    onClick={e => e.target.select()}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1.5 }}>
                <label className="form-label">Nome do Arquivo para Download</label>
                <input
                  type="text"
                  value={downloadFileName}
                  onChange={e => setDownloadFileName(e.target.value)}
                  placeholder="Ex: imagem.png ou documento.pdf"
                />
              </div>

              <div className="form-group">
                <label className="form-label">MIME Type</label>
                <input
                  type="text"
                  value={reconstructedMime}
                  onChange={e => setReconstructedMime(e.target.value)}
                  placeholder="image/png, application/pdf"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cole a string Base64 (ou Data URI)</label>
              <textarea
                className="code-editor-area"
                style={{ minHeight: 180 }}
                value={base64Input}
                onChange={e => setBase64Input(e.target.value)}
                placeholder="Cole aqui: data:image/png;base64,iVBORw0KGgo... ou a string crua"
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleDownloadDecoded}
              disabled={!base64Input.trim()}
              style={{ alignSelf: 'flex-start' }}
            >
              <Download size={16} />
              <span>Decodificar e Baixar Arquivo</span>
            </button>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <span>Processamento 100% no navegador via FileReader e Blob API</span>
        <span>Sem limites de envio para servidores</span>
      </div>
    </div>
  );
}
