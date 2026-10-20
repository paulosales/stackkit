import React, { useState, useMemo, useCallback } from 'react';
import {
  Mail,
  Copy,
  Check,
  Download,
  Code,
  RefreshCw,
  Trash2,
  Eye,
  Palette,
  ChevronDown,
  FileText,
  Sun,
  Moon,
  HelpCircle,
  User,
  Phone,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

const LinkedInIcon = ({ size = 14, color = '#0077b5' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GitHubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const InstagramIcon = ({ size = 14, color = '#e1306c' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import {
  DEFAULT_SIGNATURE,
  FONT_OPTIONS,
  TEMPLATE_IDS,
  generateSignature,
  wrapAsHtmlDocument,
  copyFormattedSignature,
  copyPlainText,
  downloadTextFile,
  fontStack,
} from './emailSignature/signatureGenerator';
import { TRANSLATIONS } from './emailSignature/signatureTranslations';

const PRESET_COLORS = ['#1d4ed8', '#0284c7', '#059669', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#334155'];

export default function EmailSignatureGenerator({ onCopy, lang = 'pt' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.pt;

  // Form State
  const [data, setData] = useState(DEFAULT_SIGNATURE);

  // Accordion open states
  const [openSections, setOpenSections] = useState({
    general: true,
    contact: true,
    media: false,
    design: true,
  });

  // Preview tab: 'visual' | 'code' | 'text'
  const [activeTab, setActiveTab] = useState('visual');
  const [darkPreview, setDarkPreview] = useState(false);

  // Action feedback states
  const [copiedFormatted, setCopiedFormatted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Toggle accordion section
  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Field change handlers
  const handleFieldChange = useCallback((field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSocialChange = useCallback((field, value) => {
    setData((prev) => ({
      ...prev,
      social: { ...prev.social, [field]: value },
    }));
  }, []);

  // Quick Presets
  const handleLoadSample = () => {
    setData(DEFAULT_SIGNATURE);
    if (onCopy) onCopy(t.presets.loaded);
  };

  const handleClearAll = () => {
    setData({
      fullName: '',
      jobTitle: '',
      company: '',
      department: '',
      email: '',
      phone: '',
      mobile: '',
      website: '',
      address: '',
      city: '',
      state: '',
      photoUrl: '',
      social: {
        linkedin: '',
        github: '',
        twitter: '',
        instagram: '',
      },
      primaryColor: '#1d4ed8',
      secondaryColor: '#334155',
      fontFamily: 'Arial',
      template: 'classic',
    });
    if (onCopy) onCopy(t.presets.cleared);
  };

  // Generate signature memoized
  const signature = useMemo(() => {
    return generateSignature(data, t.labels);
  }, [data, t.labels]);

  // Copy Formatted Signature (Rich HTML)
  const handleCopyFormatted = async () => {
    setCopiedFormatted(true);
    const result = await copyFormattedSignature(signature.html, signature.text);
    setTimeout(() => setCopiedFormatted(false), 2000);

    if (result.success) {
      if (onCopy) onCopy(t.actions.toastCopySuccess);
    } else {
      if (onCopy) onCopy(t.actions.toastCopyError, 'error');
    }
  };

  // Copy HTML Source Code
  const handleCopyCode = async () => {
    setCopiedCode(true);
    await copyPlainText(signature.html);
    setTimeout(() => setCopiedCode(false), 2000);
    if (onCopy) onCopy(t.actions.toastCodeSuccess);
  };

  // Copy Plain Text
  const handleCopyPlainText = async () => {
    setCopiedText(true);
    await copyPlainText(signature.text);
    setTimeout(() => setCopiedText(false), 2000);
    if (onCopy) onCopy('Texto simples copiado!');
  };

  // Download HTML File
  const handleDownload = () => {
    const slug = (data.fullName || 'email-signature')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'signature';

    const fullDoc = wrapAsHtmlDocument(signature.html, `${data.fullName || 'Assinatura'} - Email Signature`);
    downloadTextFile(`${slug}.html`, fullDoc);
    if (onCopy) onCopy(t.actions.toastDownload);
  };

  // Prepare iframe HTML document for the visual simulation
  const iframeContent = useMemo(() => {
    const bg = darkPreview ? '#1e293b' : '#ffffff';
    const textCol = darkPreview ? '#f8fafc' : '#333333';
    const borderCol = darkPreview ? '#334155' : '#e2e8f0';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: ${bg};
      color: ${textCol};
      font-family: ${fontStack(data)};
      padding: 20px;
      line-height: 1.5;
      font-size: 13px;
      transition: background-color 0.2s;
    }
    .greeting {
      margin-bottom: 16px;
      color: ${darkPreview ? '#cbd5e1' : '#64748b'};
      font-size: 13px;
    }
    .divider {
      height: 1px;
      background: ${borderCol};
      margin: 16px 0;
    }
    table {
      border-collapse: collapse;
    }
    a {
      text-decoration: none;
    }
  </style>
</head>
<body>
  <p class="greeting">${t.preview.regards}</p>
  <div class="signature-container">
    ${signature.html}
  </div>
</body>
</html>`;
  }, [darkPreview, data, signature.html, t.preview.regards]);

  return (
    <div className="email-signature-tool" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Presets Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '4px 2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--accent-cyan)',
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={12} /> 100% Client-Side & Privado
          </span>
          <span>Compatível com Gmail, Outlook Desktop/Web, Apple Mail e Thunderbird</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn-secondary" onClick={handleLoadSample} title="Carregar dados de exemplo padrão">
            <RefreshCw size={13} />
            <span>{t.presets.loadSample}</span>
          </button>
          <button className="btn-ghost" onClick={handleClearAll} title="Limpar todos os campos">
            <Trash2 size={13} />
            <span>{t.presets.clear}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace Grid */}
      <div className="workspace-grid" style={{ alignItems: 'start' }}>
        {/* Left Column: Input Form with Collapsible Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* SECTION 1: Informações Gerais */}
          <div className="workspace-panel">
            <div
              className="panel-header"
              onClick={() => toggleSection('general')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="panel-title">
                <User size={16} className="text-cyan" />
                <span>{t.sections.general.title}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                  — {t.sections.general.desc}
                </span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  transform: openSections.general ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  color: 'var(--text-muted)',
                }}
              />
            </div>

            {openSections.general && (
              <div className="panel-body">
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1.2 }}>
                    <label className="form-label">
                      <span>{t.fields.fullName.label}</span>
                      <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={data.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      placeholder={t.fields.fullName.placeholder}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">{t.fields.jobTitle.label}</label>
                    <input
                      type="text"
                      value={data.jobTitle}
                      onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                      placeholder={t.fields.jobTitle.placeholder}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.fields.company.label}</label>
                    <input
                      type="text"
                      value={data.company}
                      onChange={(e) => handleFieldChange('company', e.target.value)}
                      placeholder={t.fields.company.placeholder}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.fields.department.label}</label>
                    <input
                      type="text"
                      value={data.department}
                      onChange={(e) => handleFieldChange('department', e.target.value)}
                      placeholder={t.fields.department.placeholder}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Contatos */}
          <div className="workspace-panel">
            <div
              className="panel-header"
              onClick={() => toggleSection('contact')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="panel-title">
                <Phone size={16} className="text-cyan" />
                <span>{t.sections.contact.title}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                  — {t.sections.contact.desc}
                </span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  transform: openSections.contact ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  color: 'var(--text-muted)',
                }}
              />
            </div>

            {openSections.contact && (
              <div className="panel-body">
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1.2 }}>
                    <label className="form-label">{t.fields.email.label}</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder={t.fields.email.placeholder}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">{t.fields.website.label}</label>
                    <input
                      type="text"
                      value={data.website}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                      placeholder={t.fields.website.placeholder}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.fields.phone.label}</label>
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder={t.fields.phone.placeholder}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.fields.mobile.label}</label>
                    <input
                      type="tel"
                      value={data.mobile}
                      onChange={(e) => handleFieldChange('mobile', e.target.value)}
                      placeholder={t.fields.mobile.placeholder}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.fields.address.label}</label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder={t.fields.address.placeholder}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1.5 }}>
                    <label className="form-label">{t.fields.city.label}</label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      placeholder={t.fields.city.placeholder}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">{t.fields.state.label}</label>
                    <input
                      type="text"
                      value={data.state}
                      onChange={(e) => handleFieldChange('state', e.target.value)}
                      placeholder={t.fields.state.placeholder}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Mídia & Redes Sociais */}
          <div className="workspace-panel">
            <div
              className="panel-header"
              onClick={() => toggleSection('media')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="panel-title">
                <ImageIcon size={16} className="text-cyan" />
                <span>{t.sections.media.title}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                  — {t.sections.media.desc}
                </span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  transform: openSections.media ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  color: 'var(--text-muted)',
                }}
              />
            </div>

            {openSections.media && (
              <div className="panel-body">
                <div className="form-group">
                  <label className="form-label">
                    <span>{t.fields.photoUrl.label}</span>
                    {data.photoUrl && (
                      <span style={{ fontSize: 11, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={12} /> URL ativa
                      </span>
                    )}
                  </label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {data.photoUrl && (
                      <img
                        src={data.photoUrl}
                        alt="Avatar Preview"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--border-strong)',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <input
                      type="url"
                      style={{ flex: 1 }}
                      value={data.photoUrl}
                      onChange={(e) => handleFieldChange('photoUrl', e.target.value)}
                      placeholder={t.fields.photoUrl.placeholder}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.fields.photoUrl.hint}</span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <LinkedInIcon size={14} color="#0077b5" />
                      <span>{t.fields.linkedin.label}</span>
                    </label>
                    <input
                      type="url"
                      value={data.social.linkedin}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      placeholder={t.fields.linkedin.placeholder}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <GitHubIcon size={14} />
                      <span>{t.fields.github.label}</span>
                    </label>
                    <input
                      type="url"
                      value={data.social.github}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                      placeholder={t.fields.github.placeholder}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <TwitterIcon size={14} />
                      <span>{t.fields.twitter.label}</span>
                    </label>
                    <input
                      type="url"
                      value={data.social.twitter}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      placeholder={t.fields.twitter.placeholder}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <InstagramIcon size={14} color="#e1306c" />
                      <span>{t.fields.instagram.label}</span>
                    </label>
                    <input
                      type="url"
                      value={data.social.instagram}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      placeholder={t.fields.instagram.placeholder}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Design e Estilo */}
          <div className="workspace-panel">
            <div
              className="panel-header"
              onClick={() => toggleSection('design')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="panel-title">
                <Palette size={16} className="text-cyan" />
                <span>{t.sections.design.title}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                  — {t.sections.design.desc}
                </span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  transform: openSections.design ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  color: 'var(--text-muted)',
                }}
              />
            </div>

            {openSections.design && (
              <div className="panel-body">
                {/* Template Cards */}
                <div className="form-group">
                  <label className="form-label">{t.templates.label}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {TEMPLATE_IDS.map((tplId) => {
                      const tplMeta = t.templates[tplId] || {};
                      const isSelected = data.template === tplId;
                      return (
                        <div
                          key={tplId}
                          onClick={() => handleFieldChange('template', tplId)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                            background: isSelected ? 'rgba(6, 182, 212, 0.08)' : 'var(--bg-input)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                              {tplMeta.label}
                            </span>
                            {isSelected && <CheckCircle2 size={14} className="text-cyan" />}
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                            {tplMeta.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Colors Row */}
                <div className="form-row">
                  {/* Primary Color */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>{t.fields.primaryColor.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                        {t.fields.primaryColor.desc}
                      </span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="color"
                        value={data.primaryColor}
                        onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                        style={{
                          width: 42,
                          height: 38,
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          background: 'transparent',
                        }}
                      />
                      <input
                        type="text"
                        value={data.primaryColor}
                        onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                        style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                    {/* Quick color dots */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      {PRESET_COLORS.map((c) => (
                        <div
                          key={`p-${c}`}
                          onClick={() => handleFieldChange('primaryColor', c)}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: c,
                            cursor: 'pointer',
                            border: data.primaryColor === c ? '2px solid #fff' : '1px solid rgba(0,0,0,0.2)',
                            boxShadow: data.primaryColor === c ? '0 0 0 2px var(--accent-cyan)' : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>{t.fields.secondaryColor.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                        {t.fields.secondaryColor.desc}
                      </span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="color"
                        value={data.secondaryColor}
                        onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                        style={{
                          width: 42,
                          height: 38,
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          background: 'transparent',
                        }}
                      />
                      <input
                        type="text"
                        value={data.secondaryColor}
                        onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                        style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                    {/* Quick color dots */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      {PRESET_COLORS.map((c) => (
                        <div
                          key={`s-${c}`}
                          onClick={() => handleFieldChange('secondaryColor', c)}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: c,
                            cursor: 'pointer',
                            border: data.secondaryColor === c ? '2px solid #fff' : '1px solid rgba(0,0,0,0.2)',
                            boxShadow: data.secondaryColor === c ? '0 0 0 2px var(--accent-cyan)' : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Font Family */}
                <div className="form-group">
                  <label className="form-label">{t.fields.fontFamily.label}</label>
                  <select
                    value={data.fontFamily}
                    onChange={(e) => handleFieldChange('fontFamily', e.target.value)}
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label} ({f.stack})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Email Preview, Action Buttons, and Code Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 16 }}>
          {/* Main Preview Panel Card */}
          <div className="workspace-panel" style={{ overflow: 'hidden' }}>
            {/* Simulation Header with Mac Traffic Lights */}
            <div
              className="panel-header"
              style={{
                background: 'var(--bg-surface-elevated)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginLeft: 8 }}>
                  {t.preview.newMessage}
                </span>
              </div>

              {/* View Mode Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  className={`btn-ghost ${activeTab === 'visual' ? 'active' : ''}`}
                  onClick={() => setActiveTab('visual')}
                  style={{
                    fontSize: 11.5,
                    padding: '4px 10px',
                    height: 28,
                    borderRadius: 'var(--radius-sm)',
                    background: activeTab === 'visual' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                    color: activeTab === 'visual' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  }}
                >
                  <Eye size={13} style={{ marginRight: 4 }} />
                  <span>{t.preview.tabs.visual}</span>
                </button>

                <button
                  className={`btn-ghost ${activeTab === 'code' ? 'active' : ''}`}
                  onClick={() => setActiveTab('code')}
                  style={{
                    fontSize: 11.5,
                    padding: '4px 10px',
                    height: 28,
                    borderRadius: 'var(--radius-sm)',
                    background: activeTab === 'code' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                    color: activeTab === 'code' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  }}
                >
                  <Code size={13} style={{ marginRight: 4 }} />
                  <span>{t.preview.tabs.code}</span>
                </button>

                <button
                  className={`btn-ghost ${activeTab === 'text' ? 'active' : ''}`}
                  onClick={() => setActiveTab('text')}
                  style={{
                    fontSize: 11.5,
                    padding: '4px 10px',
                    height: 28,
                    borderRadius: 'var(--radius-sm)',
                    background: activeTab === 'text' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                    color: activeTab === 'text' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  }}
                >
                  <FileText size={13} style={{ marginRight: 4 }} />
                  <span>{t.preview.tabs.text}</span>
                </button>

                {activeTab === 'visual' && (
                  <button
                    className="btn-icon"
                    onClick={() => setDarkPreview((prev) => !prev)}
                    title={darkPreview ? t.preview.lightPreview : t.preview.darkPreview}
                    style={{ width: 28, height: 28, marginLeft: 6 }}
                  >
                    {darkPreview ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} />}
                  </button>
                )}
              </div>
            </div>

            {/* Email Metadata Strip (To & Subject) */}
            <div
              style={{
                padding: '10px 18px',
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                fontSize: 12,
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontWeight: 600, width: 60, color: 'var(--text-secondary)' }}>
                  {t.preview.to}
                </span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {data.email || t.preview.toPlaceholder}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontWeight: 600, width: 60, color: 'var(--text-secondary)' }}>
                  {t.preview.subject}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {t.preview.subjectValue}
                </span>
              </div>
            </div>

            {/* Content Area Based on Active Tab */}
            {activeTab === 'visual' && (
              <div
                style={{
                  minHeight: 260,
                  maxHeight: 460,
                  overflowY: 'auto',
                  background: darkPreview ? '#1e293b' : '#ffffff',
                  transition: 'background-color 0.2s',
                  position: 'relative',
                }}
              >
                <iframe
                  title="Live Email Preview"
                  srcDoc={iframeContent}
                  sandbox="allow-same-origin"
                  style={{
                    width: '100%',
                    height: 290,
                    border: 'none',
                    display: 'block',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
            )}

            {activeTab === 'code' && (
              <div style={{ position: 'relative' }}>
                <textarea
                  readOnly
                  className="code-editor-area"
                  style={{
                    minHeight: 290,
                    maxHeight: 460,
                    margin: 0,
                    borderRadius: 0,
                    border: 'none',
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                  value={signature.html}
                />
                <button
                  className="btn-secondary"
                  onClick={handleCopyCode}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    fontSize: 11.5,
                    padding: '4px 10px',
                    height: 28,
                  }}
                >
                  {copiedCode ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copiedCode ? 'Copiado!' : 'Copiar HTML'}</span>
                </button>
              </div>
            )}

            {activeTab === 'text' && (
              <div style={{ position: 'relative' }}>
                <textarea
                  readOnly
                  className="code-editor-area"
                  style={{
                    minHeight: 290,
                    maxHeight: 460,
                    margin: 0,
                    borderRadius: 0,
                    border: 'none',
                    fontSize: 12.5,
                    lineHeight: 1.6,
                  }}
                  value={signature.text}
                />
                <button
                  className="btn-secondary"
                  onClick={handleCopyPlainText}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    fontSize: 11.5,
                    padding: '4px 10px',
                    height: 28,
                  }}
                >
                  {copiedText ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copiedText ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>
            )}

            {/* Action Buttons Panel Footer */}
            <div
              style={{
                padding: '16px 18px',
                background: 'var(--bg-surface-elevated)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* Primary Copy Action */}
              <button
                className="btn-primary"
                onClick={handleCopyFormatted}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                {copiedFormatted ? <Check size={18} /> : <Copy size={18} />}
                <span>
                  {copiedFormatted ? 'Assinatura Copiada! ⭐' : t.actions.copySignature}
                </span>
              </button>

              {/* Secondary Actions Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button className="btn-secondary" onClick={handleCopyCode} style={{ justifyContent: 'center' }}>
                  {copiedCode ? <Check size={14} color="#10b981" /> : <Code size={14} />}
                  <span>{copiedCode ? 'Copiado!' : t.actions.copyCode}</span>
                </button>

                <button className="btn-secondary" onClick={handleDownload} style={{ justifyContent: 'center' }}>
                  <Download size={14} />
                  <span>{t.actions.download}</span>
                </button>
              </div>

              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center', marginTop: 2 }}>
                {t.actions.copySignatureDesc}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Compatibility & FAQ Section - Full Width Responsive Grid */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <HelpCircle size={16} className="text-cyan" />
            <span>{t.faq.title}</span>
          </div>
        </div>

        <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {t.faq.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {item.q}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
