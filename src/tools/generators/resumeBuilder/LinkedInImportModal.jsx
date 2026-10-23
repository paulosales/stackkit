import React, { useState, useRef } from 'react';
import {
  Sparkles,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  FileUp,
  Check
} from 'lucide-react';
import { Linkedin } from './icons';
import {
  parseLinkedInProfileText,
  extractTextFromPdfFile
} from './linkedinParser';

export default function LinkedInImportModal({ isOpen, onClose, onApplyData, lang = 'en' }) {
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [mergeMode, setMergeMode] = useState('merge'); // 'merge' | 'replace'
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const t = {
    title: lang === 'pt' ? 'Importar do LinkedIn via PDF' : 'Import LinkedIn via PDF',
    subtitle: lang === 'pt'
      ? 'Carregue o PDF oficial exportado do seu LinkedIn para preencher seu currículo automaticamente.'
      : 'Upload your official LinkedIn export PDF to populate your resume automatically.',
    tabPdf: lang === 'pt' ? 'Upload do PDF do LinkedIn' : 'Upload LinkedIn PDF',
    tabPaste: lang === 'pt' ? 'Copiar & Colar Texto' : 'Paste Profile Text',
    
    // PDF tab
    pdfDropTitle: lang === 'pt' ? 'Arraste seu PDF do LinkedIn aqui' : 'Drop your LinkedIn PDF here',
    pdfDropSub: lang === 'pt' ? 'ou clique para selecionar o arquivo (.pdf)' : 'or click to browse (.pdf files)',
    pdfStep1: lang === 'pt' ? '1. No seu perfil do LinkedIn, clique no botão "Mais" ou "Recursos" (ao lado de Editar perfil).' : '1. On your LinkedIn profile, click "More" or "Resources" (next to Edit profile).',
    pdfStep2: lang === 'pt' ? '2. Selecione a opção "Salvar como PDF" (o LinkedIn baixa seu currículo completo).' : '2. Click "Save to PDF" (LinkedIn will download your full resume PDF).',
    pdfStep3: lang === 'pt' ? '3. Solte o arquivo PDF aqui para extrair experiências, formação e competências!' : '3. Drop that downloaded PDF file here to extract all work history, education, and skills!',

    // Paste tab
    pasteLabel: lang === 'pt' ? 'Ou cole o texto do seu perfil / PDF do LinkedIn:' : 'Or paste text from your LinkedIn profile / PDF:',
    pastePlaceholder: lang === 'pt'
      ? 'Cole aqui o texto copiado do seu perfil do LinkedIn (Nome, Sobre, Experiências, Formação, Competências)...'
      : 'Paste your copied LinkedIn profile text, About section, Experience list, and Skills here...',
    btnParse: lang === 'pt' ? 'Processar Texto' : 'Parse Profile Text',
    pasteTip: lang === 'pt'
      ? 'Dica: Você também pode abrir o PDF do LinkedIn, selecionar todo o texto (Ctrl+A / Cmd+A) e colar aqui.'
      : 'Tip: You can also open your LinkedIn PDF, select all text (Ctrl+A / Cmd+A), and paste it here.',

    // Preview & Apply
    previewTitle: lang === 'pt' ? 'Dados Extraídos com Sucesso:' : 'Successfully Extracted Profile:',
    mergeModeLabel: lang === 'pt' ? 'Modo de Aplicação:' : 'Import Mode:',
    mergeOption: lang === 'pt' ? 'Mesclar com dados existentes' : 'Merge with existing resume',
    replaceOption: lang === 'pt' ? 'Substituir currículo atual' : 'Replace current resume',
    btnApply: lang === 'pt' ? 'Aplicar ao Currículo' : 'Apply to Resume'
  };

  const handleProcessText = (text) => {
    if (!text || !text.trim()) {
      setErrorMsg(lang === 'pt' ? 'O arquivo ou texto está vazio.' : 'File or text is empty.');
      return;
    }

    const parsed = parseLinkedInProfileText(text);
    if (!parsed || (!parsed.personal.fullName && parsed.experience.length === 0 && parsed.skills.length === 0)) {
      setErrorMsg(lang === 'pt'
        ? 'Não foi possível detectar seções de perfil claras. Certifique-se de que o PDF ou texto contém seções como Experiência, Sobre ou Formação.'
        : 'Could not detect clear profile sections. Please make sure the PDF or text contains Experience, About, or Education sections.');
      return;
    }

    setExtractedData(parsed);
    setErrorMsg('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file) => {
    setErrorMsg('');
    setExtractedData(null);
    setLoading(true);
    setLoadingMsg(lang === 'pt' ? 'Lendo e analisando arquivo do LinkedIn...' : 'Reading and parsing LinkedIn file...');

    try {
      let text = '';
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        text = await extractTextFromPdfFile(file);
      } else {
        text = await file.text();
      }

      setLoading(false);
      handleProcessText(text);
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || (lang === 'pt' ? 'Erro ao processar arquivo.' : 'Error processing file.'));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleTextParse = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setExtractedData(null);
    handleProcessText(pastedText);
  };

  const handleApply = () => {
    if (!extractedData) return;
    onApplyData(extractedData, mergeMode);
    onClose();
  };

  return (
    <div className="rb-modal-overlay" onClick={onClose}>
      <div className="rb-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="rb-modal-header">
          <div className="rb-modal-title-group">
            <div className="rb-modal-icon-badge">
              <Linkedin size={22} color="#0077b5" />
            </div>
            <div>
              <h2 className="rb-modal-title">{t.title}</h2>
              <p className="rb-modal-sub">{t.subtitle}</p>
            </div>
          </div>
          <button className="rb-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: PDF vs Paste */}
        <div className="rb-modal-tabs">
          <button
            type="button"
            className={`rb-modal-tab ${activeTab === 'pdf' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pdf'); setErrorMsg(''); }}
          >
            <Upload size={14} />
            {t.tabPdf}
          </button>
          <button
            type="button"
            className={`rb-modal-tab ${activeTab === 'paste' ? 'active' : ''}`}
            onClick={() => { setActiveTab('paste'); setErrorMsg(''); }}
          >
            <FileText size={14} />
            {t.tabPaste}
          </button>
        </div>

        {/* Tab 1: Upload LinkedIn PDF */}
        {activeTab === 'pdf' && (
          <div className="rb-modal-body">
            <div
              className={`rb-dropzone ${isDragOver ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div className="rb-dropzone-icon">
                {loading ? <Loader2 size={24} className="animate-spin" /> : <FileUp size={24} />}
              </div>
              <div>
                <h3 className="rb-dropzone-title">{t.pdfDropTitle}</h3>
                <p className="rb-dropzone-sub">{t.pdfDropSub}</p>
              </div>
            </div>

            {/* Step-by-step instructions */}
            <div className="rb-steps-card">
              <div className="rb-step-item">
                <span className="rb-step-num">1</span>
                <span>{t.pdfStep1}</span>
              </div>
              <div className="rb-step-item">
                <span className="rb-step-num">2</span>
                <span>{t.pdfStep2}</span>
              </div>
              <div className="rb-step-item">
                <span className="rb-step-num">3</span>
                <span>{t.pdfStep3}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Quick Paste Text */}
        {activeTab === 'paste' && (
          <form onSubmit={handleTextParse} className="rb-modal-body">
            <div className="rb-form-group">
              <label className="rb-label">{t.pasteLabel}</label>
              <textarea
                className="rb-textarea"
                style={{ minHeight: 140 }}
                placeholder={t.pastePlaceholder}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                autoFocus
              />
            </div>

            <div className="rb-tip-box">
              <Sparkles size={16} className="text-cyan flex-shrink-0" />
              <span>{t.pasteTip}</span>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={!pastedText.trim()}>
              <FileText size={16} />
              {t.btnParse}
            </button>
          </form>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="rb-error-box">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Extracted Preview */}
        {extractedData && (
          <div className="rb-extracted-preview">
            <div className="rb-preview-header">
              <CheckCircle2 size={18} className="text-emerald" />
              <span className="font-bold">{t.previewTitle}</span>
            </div>

            <div className="rb-extracted-details">
              {extractedData.personal?.fullName && (
                <div><strong>{lang === 'pt' ? 'Nome:' : 'Name:'}</strong> {extractedData.personal.fullName}</div>
              )}
              {extractedData.personal?.jobTitle && (
                <div><strong>{lang === 'pt' ? 'Cargo:' : 'Title:'}</strong> {extractedData.personal.jobTitle}</div>
              )}
              {extractedData.personal?.location && (
                <div><strong>{lang === 'pt' ? 'Localização:' : 'Location:'}</strong> {extractedData.personal.location}</div>
              )}
              {extractedData.personal?.email && (
                <div><strong>{lang === 'pt' ? 'E-mail:' : 'Email:'}</strong> {extractedData.personal.email}</div>
              )}
              {extractedData.personal?.linkedin && (
                <div><strong>LinkedIn:</strong> <a href={extractedData.personal.linkedin} target="_blank" rel="noopener noreferrer">{extractedData.personal.linkedin}</a></div>
              )}
              {extractedData.experience && extractedData.experience.length > 0 && (
                <div>
                  <strong>{lang === 'pt' ? 'Experiências:' : 'Experience:'}</strong> {extractedData.experience.length} {lang === 'pt' ? 'cargos detectados' : 'positions detected'}
                </div>
              )}
              {extractedData.education && extractedData.education.length > 0 && (
                <div>
                  <strong>{lang === 'pt' ? 'Formação:' : 'Education:'}</strong> {extractedData.education.length} {lang === 'pt' ? 'cursos detectados' : 'entries detected'}
                </div>
              )}
              {extractedData.skills && extractedData.skills.length > 0 && (
                <div>
                  <strong>{lang === 'pt' ? 'Competências:' : 'Skills:'}</strong> {extractedData.skills.length} {lang === 'pt' ? 'habilidades' : 'skills'} ({extractedData.skills.slice(0, 6).map(s => s.name).join(', ')}...)
                </div>
              )}
              {extractedData.languages && extractedData.languages.length > 0 && (
                <div>
                  <strong>{lang === 'pt' ? 'Idiomas:' : 'Languages:'}</strong> {extractedData.languages.map(l => l.language).join(', ')}
                </div>
              )}
              {extractedData.summary && (
                <div>
                  <strong>{lang === 'pt' ? 'Resumo:' : 'Summary:'}</strong> {extractedData.summary.substring(0, 140)}...
                </div>
              )}
            </div>

            {/* Merge / Replace Mode and Apply Button */}
            <div className="rb-apply-footer">
              <div className="rb-mode-selector">
                <span className="rb-mode-label">{t.mergeModeLabel}</span>
                <label className="rb-radio-label">
                  <input
                    type="radio"
                    name="mergeMode"
                    value="merge"
                    checked={mergeMode === 'merge'}
                    onChange={() => setMergeMode('merge')}
                  />
                  <span>{t.mergeOption}</span>
                </label>
                <label className="rb-radio-label">
                  <input
                    type="radio"
                    name="mergeMode"
                    value="replace"
                    checked={mergeMode === 'replace'}
                    onChange={() => setMergeMode('replace')}
                  />
                  <span>{t.replaceOption}</span>
                </label>
              </div>

              <button type="button" className="btn-primary" onClick={handleApply}>
                <Check size={16} />
                {t.btnApply}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
