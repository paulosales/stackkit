import React from 'react';
import ModernTemplate from './ModernTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import CreativeSplitTemplate from './CreativeSplitTemplate';
import NordicTimelineTemplate from './NordicTimelineTemplate';
import CompactAtsTemplate from './CompactAtsTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import CompactTechTemplate from './CompactTechTemplate';
import ElegantLuxeTemplate from './ElegantLuxeTemplate';
import InfographicTemplate from './InfographicTemplate';
import BoldBannerTemplate from './BoldBannerTemplate';

export const RESUME_LABELS = {
  en: {
    summary: 'Professional Summary',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Technical Skills',
    projects: 'Featured Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    present: 'Present',
    contact: 'Contact Info'
  },
  pt: {
    summary: 'Resumo Profissional',
    experience: 'Experiência Profissional',
    education: 'Formação Acadêmica',
    skills: 'Competências & Habilidades',
    projects: 'Projetos em Destaque',
    certifications: 'Certificações',
    languages: 'Idiomas',
    present: 'Presente',
    contact: 'Contato'
  }
};

export default function ResumePreviewRenderer({
  resume,
  template = 'modern',
  accentColor = '#0284c7',
  font = 'inter',
  lang = 'en'
}) {
  if (!resume || !resume.data) {
    return <div className="p-8 text-center text-muted">No resume data found.</div>;
  }

  const labels = RESUME_LABELS[lang] || RESUME_LABELS.en;

  const props = {
    resume,
    accentColor: accentColor || resume.accentColor || '#0284c7',
    font: font || resume.font || 'inter',
    labels
  };

  switch (template) {
    case 'executive':
      return <ExecutiveTemplate {...props} />;
    case 'creative':
      return <CreativeSplitTemplate {...props} />;
    case 'nordic':
      return <NordicTimelineTemplate {...props} />;
    case 'ats':
      return <CompactAtsTemplate {...props} />;
    case 'minimalist':
      return <MinimalistTemplate {...props} />;
    case 'compact':
      return <CompactTechTemplate {...props} />;
    case 'elegant':
      return <ElegantLuxeTemplate {...props} />;
    case 'infographic':
      return <InfographicTemplate {...props} />;
    case 'bold':
      return <BoldBannerTemplate {...props} />;
    case 'modern':
    default:
      return <ModernTemplate {...props} />;
  }
}
