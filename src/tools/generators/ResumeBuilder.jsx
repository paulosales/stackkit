import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Download,
  Upload,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  Check,
  CheckCircle2,
  Eye,
  Edit3,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Loader2
} from 'lucide-react';
import { Linkedin } from './resumeBuilder/icons';
import { exportResumeToPdf } from './resumeBuilder/pdfExporter';

import {
  getSavedResumes,
  saveAllResumes,
  getActiveResumeId,
  setActiveResumeId,
  createNewResume,
  duplicateResume,
  normalizeResume,
  TEMPLATES,
  ACCENT_COLORS,
  FONT_OPTIONS,
  DEMO_RESUMES
} from './resumeBuilder/resumeModel';

import ResumePreviewRenderer from './resumeBuilder/templates/ResumePreviewRenderer';
import LinkedInImportModal from './resumeBuilder/LinkedInImportModal';
import './resumeBuilder/ResumeBuilder.css';

export default function ResumeBuilder({ lang = 'en', onToast }) {
  // 1. Resumes state
  const [resumes, setResumes] = useState(() => getSavedResumes(lang));
  const [activeId, setActiveId] = useState(() => getActiveResumeId(resumes));
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'

  // 2. Navigation & UI state
  const [activeEditorTab, setActiveEditorTab] = useState('personal'); // personal, summary, experience, education, skills, projects, additional, design
  const [mobileView, setMobileView] = useState('editor'); // 'editor' | 'preview'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [resumeLang, setResumeLang] = useState(lang === 'pt' ? 'pt' : 'en');

  // File import ref
  const fileInputRef = useRef(null);

  // Active resume object with normalized data
  const activeResume = useMemo(() => {
    const found = resumes.find(r => r.id === activeId) || resumes[0] || createNewResume('Default Resume', 'modern', lang);
    return normalizeResume(found);
  }, [resumes, activeId, lang]);

  // Sync active ID to localStorage
  useEffect(() => {
    if (activeResume?.id) {
      setActiveResumeId(activeResume.id);
    }
  }, [activeResume?.id]);

  // Debounced auto-save to localStorage
  const saveTimeoutRef = useRef(null);
  const triggerAutoSave = useCallback((updatedResumes) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveAllResumes(updatedResumes);
      setSaveStatus('saved');
    }, 400);
  }, []);

  // Update active resume data helper
  const updateActiveResume = useCallback((updater) => {
    setResumes(prevList => {
      if (!Array.isArray(prevList) || prevList.length === 0) return prevList;
      const targetId = activeId || activeResume?.id;
      const targetExists = prevList.some(r => r.id === targetId);

      const nextList = prevList.map((r, idx) => {
        const isMatch = targetExists ? (r.id === targetId) : (idx === 0);
        if (isMatch) {
          const updated = typeof updater === 'function' ? updater(r) : { ...r, ...updater };
          return {
            ...updated,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      });
      triggerAutoSave(nextList);
      return nextList;
    });
  }, [activeId, activeResume?.id, triggerAutoSave]);

  // Nested section updater
  const updateSection = useCallback((sectionKey, dataOrFn) => {
    updateActiveResume(prev => {
      const prevData = prev?.data || {};
      const prevSection = prevData[sectionKey];
      const nextSection = typeof dataOrFn === 'function' ? dataOrFn(prevSection) : dataOrFn;
      return {
        ...prev,
        data: {
          ...prevData,
          [sectionKey]: nextSection
        }
      };
    });
  }, [updateActiveResume]);

  // Personal Info field update
  const updatePersonal = (field, val) => {
    updateSection('personal', prev => ({ ...prev, [field]: val }));
  };

  // --- Resume List Management ---
  const handleCreateNewResume = () => {
    const defaultTitle = lang === 'pt' ? `Novo Currículo ${resumes.length + 1}` : `New Resume ${resumes.length + 1}`;
    const name = window.prompt(lang === 'pt' ? 'Nome do novo currículo:' : 'New resume title:', defaultTitle);
    if (!name || !name.trim()) return;

    const newRes = createNewResume(name.trim(), activeResume.template || 'modern', lang);
    const nextList = [newRes, ...resumes];
    setResumes(nextList);
    setActiveId(newRes.id);
    saveAllResumes(nextList);
    if (onToast) onToast(lang === 'pt' ? 'Novo currículo criado!' : 'New resume created!');
  };

  const handleDuplicateResume = () => {
    const dup = duplicateResume(activeResume);
    const nextList = [dup, ...resumes];
    setResumes(nextList);
    setActiveId(dup.id);
    saveAllResumes(nextList);
    if (onToast) onToast(lang === 'pt' ? 'Currículo duplicado com sucesso!' : 'Resume duplicated successfully!');
  };

  const handleRenameResume = () => {
    const newName = window.prompt(
      lang === 'pt' ? 'Novo nome para este currículo:' : 'Rename this resume:',
      activeResume.title
    );
    if (!newName || !newName.trim() || newName.trim() === activeResume.title) return;

    updateActiveResume({ title: newName.trim() });
    if (onToast) onToast(lang === 'pt' ? 'Currículo renomeado!' : 'Resume renamed!');
  };

  const handleDeleteResume = () => {
    if (resumes.length <= 1) {
      alert(lang === 'pt' ? 'Você precisa manter pelo menos um currículo.' : 'You must keep at least one resume.');
      return;
    }
    const confirm = window.confirm(
      lang === 'pt'
        ? `Tem certeza que deseja excluir o currículo "${activeResume.title}"?`
        : `Are you sure you want to delete "${activeResume.title}"?`
    );
    if (!confirm) return;

    const nextList = resumes.filter(r => r.id !== activeResume.id);
    setResumes(nextList);
    setActiveId(nextList[0].id);
    saveAllResumes(nextList);
    if (onToast) onToast(lang === 'pt' ? 'Currículo excluído.' : 'Resume deleted.');
  };

  const handleResetSampleData = () => {
    const confirm = window.confirm(
      lang === 'pt'
        ? 'Deseja substituir este currículo pelos dados de exemplo completos?'
        : 'Do you want to reset this resume with the complete demo sample data?'
    );
    if (!confirm) return;

    const demo = DEMO_RESUMES[lang] || DEMO_RESUMES.en;
    updateActiveResume({
      template: demo.template,
      accentColor: demo.accentColor,
      font: demo.font,
      data: JSON.parse(JSON.stringify(demo.data))
    });
    if (onToast) onToast(lang === 'pt' ? 'Dados de exemplo carregados!' : 'Sample data loaded!');
  };

  // --- LinkedIn Data Application ---
  const handleApplyLinkedInData = (extracted, mode = 'merge') => {
    // Generate fresh unique IDs for all extracted items to prevent key collisions
    const timestamp = Date.now();
    const cleanExtracted = {
      ...extracted,
      experience: (extracted?.experience || []).map((exp, i) => ({
        ...exp,
        id: `exp_${timestamp}_${i}_${Math.random().toString(36).substring(2, 6)}`
      })),
      education: (extracted?.education || []).map((edu, i) => ({
        ...edu,
        id: `edu_${timestamp}_${i}_${Math.random().toString(36).substring(2, 6)}`
      })),
      skills: (extracted?.skills || []).map((sk, i) => ({
        ...sk,
        id: `sk_${timestamp}_${i}_${Math.random().toString(36).substring(2, 6)}`
      })),
      certifications: (extracted?.certifications || []).map((c, i) => ({
        ...c,
        id: `cert_${timestamp}_${i}_${Math.random().toString(36).substring(2, 6)}`
      })),
      languages: (extracted?.languages || []).map((l, i) => ({
        ...l,
        id: `lang_${timestamp}_${i}_${Math.random().toString(36).substring(2, 6)}`
      }))
    };

    updateActiveResume(prev => {
      if (mode === 'replace') {
        return {
          ...prev,
          data: {
            ...prev.data,
            personal: { ...prev.data.personal, ...cleanExtracted.personal },
            summary: cleanExtracted.summary || prev.data.summary,
            experience: cleanExtracted.experience && cleanExtracted.experience.length > 0 ? cleanExtracted.experience : prev.data.experience,
            education: cleanExtracted.education && cleanExtracted.education.length > 0 ? cleanExtracted.education : prev.data.education,
            skills: cleanExtracted.skills && cleanExtracted.skills.length > 0 ? cleanExtracted.skills : prev.data.skills,
            languages: cleanExtracted.languages && cleanExtracted.languages.length > 0 ? cleanExtracted.languages : prev.data.languages
          }
        };
      }

      // Merge mode
      return {
        ...prev,
        data: {
          ...prev.data,
          personal: {
            ...prev.data.personal,
            fullName: cleanExtracted.personal?.fullName || prev.data.personal.fullName,
            jobTitle: cleanExtracted.personal?.jobTitle || prev.data.personal.jobTitle,
            location: cleanExtracted.personal?.location || prev.data.personal.location,
            email: cleanExtracted.personal?.email || prev.data.personal.email,
            phone: cleanExtracted.personal?.phone || prev.data.personal.phone,
            linkedin: cleanExtracted.personal?.linkedin || prev.data.personal.linkedin,
            github: cleanExtracted.personal?.github || prev.data.personal.github,
            photoUrl: cleanExtracted.personal?.photoUrl || prev.data.personal.photoUrl
          },
          summary: cleanExtracted.summary || prev.data.summary,
          experience: [
            ...(cleanExtracted.experience || []),
            ...prev.data.experience
          ],
          education: [
            ...(cleanExtracted.education || []),
            ...prev.data.education
          ],
          skills: [
            ...prev.data.skills,
            ...(cleanExtracted.skills || []).filter(s => !prev.data.skills.some(existing => existing.name.toLowerCase() === s.name.toLowerCase()))
          ],
          languages: [
            ...(prev.data.languages || []),
            ...(cleanExtracted.languages || []).filter(l => !(prev.data.languages || []).some(existing => existing.language.toLowerCase() === l.language.toLowerCase()))
          ],
          certifications: [
            ...(prev.data.certifications || []),
            ...(cleanExtracted.certifications || []).filter(c => !(prev.data.certifications || []).some(existing => existing.name.toLowerCase() === c.name.toLowerCase()))
          ]
        }
      };
    });

    if (onToast) {
      onToast(lang === 'pt' ? 'Dados do LinkedIn importados com sucesso!' : 'LinkedIn profile data imported successfully!');
    }
  };

  // --- Export & Import JSON ---
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(activeResume, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (activeResume.title || 'resume').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.href = url;
    link.download = `${safeTitle}_stackkit.json`;
    link.click();
    URL.revokeObjectURL(url);
    if (onToast) onToast(lang === 'pt' ? 'Currículo exportado como JSON!' : 'Resume exported as JSON!');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!imported.data || !imported.data.personal) {
          throw new Error('Invalid resume schema');
        }
        const newId = `resume_${Date.now()}_imported`;
        const newRes = {
          ...imported,
          id: newId,
          title: imported.title ? `${imported.title} (Imported)` : 'Imported Resume',
          updatedAt: new Date().toISOString()
        };
        const nextList = [newRes, ...resumes];
        setResumes(nextList);
        setActiveId(newId);
        saveAllResumes(nextList);
        if (onToast) onToast(lang === 'pt' ? 'Currículo importado com sucesso!' : 'Resume imported successfully!');
      } catch (err) {
        alert(lang === 'pt' ? 'Arquivo JSON inválido ou incompatível.' : 'Invalid or incompatible resume JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- Real JS PDF Download (Renders real PDF without browser print headers/footers) ---
  const handleDownloadPdf = async () => {
    const docElement = document.getElementById('resume-printable-document');
    if (!docElement) return;

    setIsDownloadingPdf(true);
    try {
      const fullName = activeResume.data?.personal?.fullName || activeResume.title || 'resume';
      const safeName = fullName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_');
      const filename = `${lang === 'pt' ? 'curriculo' : 'resume'}_${safeName}.pdf`;

      await exportResumeToPdf(docElement, filename);
      if (onToast) {
        onToast(lang === 'pt' ? 'PDF baixado com sucesso!' : 'PDF downloaded successfully!');
      }
    } catch (err) {
      console.error('PDF export error:', err);
      alert(lang === 'pt' ? 'Erro ao gerar PDF. Tente novamente.' : 'Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // --- Experience Helpers ---
  const addExperience = () => {
    const newExp = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      bulletPoints: ['']
    };
    updateSection('experience', prev => [newExp, ...(Array.isArray(prev) ? prev : [])]);
    if (onToast) onToast(lang === 'pt' ? 'Nova experiência adicionada.' : 'New experience added.');
  };

  const removeExperience = (id, index) => {
    updateSection('experience', prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        if (!id || String(list[index]?.id) === String(id)) {
          return list.filter((_, idx) => idx !== index);
        }
      }
      if (id !== undefined && id !== null && id !== '') {
        const foundIdx = list.findIndex(item => String(item.id) === String(id));
        if (foundIdx !== -1) {
          return list.filter((_, idx) => idx !== foundIdx);
        }
      }
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        return list.filter((_, idx) => idx !== index);
      }
      return list;
    });
    if (onToast) onToast(lang === 'pt' ? 'Experiência removida.' : 'Experience removed.');
  };

  const updateExperienceItem = (id, field, value, index) => {
    updateSection('experience', prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.map((item, idx) => {
        const isMatch = (id !== undefined && id !== null && id !== '' && String(item.id) === String(id)) || idx === index;
        return isMatch ? { ...item, [field]: value } : item;
      });
    });
  };

  const addExperienceBullet = (expId, expIndex) => {
    updateSection('experience', prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.map((item, idx) => {
        const isMatch = (expId && String(item.id) === String(expId)) || idx === expIndex;
        if (isMatch) {
          return {
            ...item,
            bulletPoints: [...(item.bulletPoints || []), '']
          };
        }
        return item;
      });
    });
  };

  const updateExperienceBullet = (expId, bulletIdx, value, expIndex) => {
    updateSection('experience', prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.map((item, idx) => {
        const isMatch = (expId && String(item.id) === String(expId)) || idx === expIndex;
        if (isMatch) {
          const nextBps = [...(item.bulletPoints || [])];
          nextBps[bulletIdx] = value;
          return { ...item, bulletPoints: nextBps };
        }
        return item;
      });
    });
  };

  const removeExperienceBullet = (expId, bulletIdx, expIndex) => {
    updateSection('experience', prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.map((item, idx) => {
        const isMatch = (expId && String(item.id) === String(expId)) || idx === expIndex;
        if (isMatch) {
          return {
            ...item,
            bulletPoints: (item.bulletPoints || []).filter((_, bIdx) => bIdx !== bulletIdx)
          };
        }
        return item;
      });
    });
  };

  // --- Education Helpers ---
  const addEducation = () => {
    const newEdu = {
      id: `edu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      details: ''
    };
    updateSection('education', prev => [newEdu, ...(Array.isArray(prev) ? prev : [])]);
    if (onToast) onToast(lang === 'pt' ? 'Nova formação adicionada.' : 'New education added.');
  };

  const removeEducation = (id, index) => {
    updateSection('education', prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        if (!id || String(list[index]?.id) === String(id)) {
          return list.filter((_, idx) => idx !== index);
        }
      }
      if (id !== undefined && id !== null && id !== '') {
        const foundIdx = list.findIndex(e => String(e.id) === String(id));
        if (foundIdx !== -1) {
          return list.filter((_, idx) => idx !== foundIdx);
        }
      }
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        return list.filter((_, idx) => idx !== index);
      }
      return list;
    });
    if (onToast) onToast(lang === 'pt' ? 'Formação removida.' : 'Education removed.');
  };

  const updateEducationItem = (id, field, value, index) => {
    updateSection('education', prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.map((e, idx) => {
        const isMatch = (id && String(e.id) === String(id)) || idx === index;
        return isMatch ? { ...e, [field]: value } : e;
      });
    });
  };

  // --- Skills Helpers ---
  const addSkill = () => {
    const newSkill = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      category: 'Technical',
      level: 'Proficient'
    };
    updateSection('skills', prev => [...(Array.isArray(prev) ? prev : []), newSkill]);
  };

  const removeSkill = (id, index) => {
    updateSection('skills', prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        if (!id || String(list[index]?.id) === String(id)) {
          return list.filter((_, idx) => idx !== index);
        }
      }
      if (id !== undefined && id !== null && id !== '') {
        const foundIdx = list.findIndex(s => String(s.id) === String(id));
        if (foundIdx !== -1) {
          return list.filter((_, idx) => idx !== foundIdx);
        }
      }
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        return list.filter((_, idx) => idx !== index);
      }
      return list;
    });
    if (onToast) onToast(lang === 'pt' ? 'Competência removida.' : 'Skill removed.');
  };

  const updateSkillItem = (id, field, value, index) => {
    updateSection('skills', prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.map((s, idx) => {
        const isMatch = (id && String(s.id) === String(id)) || idx === index;
        return isMatch ? { ...s, [field]: value } : s;
      });
    });
  };

  // --- Projects Helpers ---
  const addProject = () => {
    const newProj = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      role: '',
      url: '',
      description: '',
      techStack: []
    };
    updateSection('projects', prev => [newProj, ...(Array.isArray(prev) ? prev : [])]);
    if (onToast) onToast(lang === 'pt' ? 'Novo projeto adicionado.' : 'New project added.');
  };

  const removeProject = (id, index) => {
    updateSection('projects', prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        if (!id || String(list[index]?.id) === String(id)) {
          return list.filter((_, idx) => idx !== index);
        }
      }
      if (id !== undefined && id !== null && id !== '') {
        const foundIdx = list.findIndex(p => String(p.id) === String(id));
        if (foundIdx !== -1) {
          return list.filter((_, idx) => idx !== foundIdx);
        }
      }
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        return list.filter((_, idx) => idx !== index);
      }
      return list;
    });
    if (onToast) onToast(lang === 'pt' ? 'Projeto removido.' : 'Project removed.');
  };

  const updateProjectItem = (id, field, value, index) => {
    updateSection('projects', prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.map((p, idx) => {
        const isMatch = (id && String(p.id) === String(id)) || idx === index;
        return isMatch ? { ...p, [field]: value } : p;
      });
    });
  };

  // --- Certifications & Languages ---
  const addCert = () => {
    const newCert = { id: `cert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, name: '', issuer: '', date: '', url: '' };
    updateSection('certifications', prev => [...(prev || []), newCert]);
  };

  const removeCert = (id, index) => {
    updateSection('certifications', prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        if (!id || String(list[index]?.id) === String(id)) {
          return list.filter((_, idx) => idx !== index);
        }
      }
      if (id !== undefined && id !== null && id !== '') {
        const foundIdx = list.findIndex(c => String(c.id) === String(id));
        if (foundIdx !== -1) {
          return list.filter((_, idx) => idx !== foundIdx);
        }
      }
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        return list.filter((_, idx) => idx !== index);
      }
      return list;
    });
    if (onToast) onToast(lang === 'pt' ? 'Certificação removida.' : 'Certification removed.');
  };

  const updateCert = (id, field, value, index) => {
    updateSection('certifications', prev => (prev || []).map((c, idx) => {
      const isMatch = (id && String(c.id) === String(id)) || idx === index;
      return isMatch ? { ...c, [field]: value } : c;
    }));
  };

  const addLanguage = () => {
    const newLang = { id: `lang_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, language: '', proficiency: 'Fluent' };
    updateSection('languages', prev => [...(prev || []), newLang]);
  };

  const removeLanguage = (id, index) => {
    updateSection('languages', prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        if (!id || String(list[index]?.id) === String(id)) {
          return list.filter((_, idx) => idx !== index);
        }
      }
      if (id !== undefined && id !== null && id !== '') {
        const foundIdx = list.findIndex(l => String(l.id) === String(id));
        if (foundIdx !== -1) {
          return list.filter((_, idx) => idx !== foundIdx);
        }
      }
      if (typeof index === 'number' && index >= 0 && index < list.length) {
        return list.filter((_, idx) => idx !== index);
      }
      return list;
    });
    if (onToast) onToast(lang === 'pt' ? 'Idioma removido.' : 'Language removed.');
  };

  const updateLanguage = (id, field, value, index) => {
    updateSection('languages', prev => (prev || []).map((l, idx) => {
      const isMatch = (id && String(l.id) === String(id)) || idx === index;
      return isMatch ? { ...l, [field]: value } : l;
    }));
  };

  // Editor Tabs definition
  const editorTabs = [
    { id: 'personal', label: lang === 'pt' ? 'Dados Pessoais' : 'Personal', icon: User },
    { id: 'summary', label: lang === 'pt' ? 'Resumo' : 'Summary', icon: FileText },
    { id: 'experience', label: lang === 'pt' ? 'Experiência' : 'Experience', icon: Briefcase, count: activeResume.data.experience?.length },
    { id: 'education', label: lang === 'pt' ? 'Formação' : 'Education', icon: GraduationCap, count: activeResume.data.education?.length },
    { id: 'skills', label: lang === 'pt' ? 'Habilidades' : 'Skills', icon: Wrench, count: activeResume.data.skills?.length },
    { id: 'projects', label: lang === 'pt' ? 'Projetos' : 'Projects', icon: FolderGit2, count: activeResume.data.projects?.length },
    { id: 'additional', label: lang === 'pt' ? 'Certs & Idiomas' : 'Certs & Langs', icon: Award },
    { id: 'design', label: lang === 'pt' ? 'Modelos & Cores' : 'Templates & Design', icon: Layers }
  ];

  return (
    <div className="resume-builder-container">
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJson}
        accept=".json"
        style={{ display: 'none' }}
      />

      {/* 1. TOP ACTION TOOLBAR */}
      <div className="rb-topbar">
        <div className="rb-topbar-left">
          {/* Active Resume Selector */}
          <div className="rb-resume-select-wrap">
            <label className="rb-label" style={{ margin: 0 }}>
              {lang === 'pt' ? 'Currículo:' : 'Resume:'}
            </label>
            <select
              className="rb-resume-select"
              value={activeResume.id}
              onChange={(e) => setActiveId(e.target.value)}
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Layout Dropdown in Toolbar */}
          <div className="rb-resume-select-wrap">
            <label className="rb-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Layers size={13} className="text-cyan" />
              {lang === 'pt' ? 'Modelo:' : 'Layout:'}
            </label>
            <select
              className="rb-resume-select"
              value={activeResume.template || 'modern'}
              onChange={(e) => updateActiveResume({ template: e.target.value })}
            >
              {TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>
                  {lang === 'pt' ? t.name : (t.nameEn || t.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions for Resumes */}
          <button className="btn-secondary" onClick={handleCreateNewResume} title={lang === 'pt' ? 'Criar novo currículo' : 'Create new resume'}>
            <Plus size={14} />
            <span className="hidden sm:inline">{lang === 'pt' ? 'Novo' : 'New'}</span>
          </button>

          <button className="btn-secondary" onClick={handleDuplicateResume} title={lang === 'pt' ? 'Duplicar currículo' : 'Duplicate resume'}>
            <Copy size={14} />
            <span className="hidden md:inline">{lang === 'pt' ? 'Duplicar' : 'Duplicate'}</span>
          </button>

          <button className="btn-secondary" onClick={handleRenameResume} title={lang === 'pt' ? 'Renomear' : 'Rename'}>
            <Edit3 size={14} />
          </button>

          {resumes.length > 1 && (
            <button className="rb-btn-icon-danger" onClick={handleDeleteResume} title={lang === 'pt' ? 'Excluir' : 'Delete'}>
              <Trash2 size={16} />
            </button>
          )}

          {/* Save status badge */}
          <div className="rb-status-badge">
            <CheckCircle2 size={13} />
            <span>{saveStatus === 'saving' ? (lang === 'pt' ? 'Salvando...' : 'Saving...') : (lang === 'pt' ? 'Salvo localmente' : 'Saved locally')}</span>
          </div>
        </div>

        <div className="rb-topbar-right">
          {/* LinkedIn Import Button */}
          <button
            className="btn-secondary"
            style={{ color: '#0077b5', borderColor: 'rgba(0, 119, 181, 0.4)' }}
            onClick={() => setIsLinkedInModalOpen(true)}
          >
            <Linkedin size={15} />
            <span>{lang === 'pt' ? 'Importar do LinkedIn' : 'Import from LinkedIn'}</span>
          </button>

          {/* Sample Data Reset */}
          <button className="btn-secondary" onClick={handleResetSampleData} title={lang === 'pt' ? 'Carregar dados de exemplo' : 'Load sample data'}>
            <RotateCcw size={14} />
            <span className="hidden lg:inline">{lang === 'pt' ? 'Exemplo' : 'Sample'}</span>
          </button>

          {/* Export JSON */}
          <button className="btn-secondary" onClick={handleExportJson} title={lang === 'pt' ? 'Exportar JSON' : 'Export JSON'}>
            <Download size={14} />
            <span className="hidden lg:inline">JSON</span>
          </button>

          {/* Import JSON */}
          <button className="btn-secondary" onClick={() => fileInputRef.current?.click()} title={lang === 'pt' ? 'Importar JSON' : 'Import JSON'}>
            <Upload size={14} />
          </button>

          {/* Real JS PDF Download Button */}
          <button
            className="btn-primary"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            style={{ fontWeight: 700 }}
            title={lang === 'pt' ? 'Baixar arquivo PDF de alta definição' : 'Download high-resolution PDF file'}
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{lang === 'pt' ? 'Gerando PDF...' : 'Generating PDF...'}</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>{lang === 'pt' ? 'Baixar PDF' : 'Download PDF'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Switcher (Edit vs Preview) */}
      <div className="rb-mobile-tabs">
        <button
          className={`btn-secondary ${mobileView === 'editor' ? 'active' : ''}`}
          onClick={() => setMobileView('editor')}
        >
          <Edit3 size={15} />
          {lang === 'pt' ? 'Editar Conteúdo' : 'Edit Content'}
        </button>
        <button
          className={`btn-secondary ${mobileView === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileView('preview')}
        >
          <Eye size={15} />
          {lang === 'pt' ? 'Visualizar Folha' : 'Preview Document'}
        </button>
      </div>

      {/* 2. MAIN WORKSTATION (SPLIT PANE) */}
      <div className="rb-workstation">
        {/* LEFT COLUMN: EDITOR PANEL */}
        <div className="rb-editor-panel" style={{ display: mobileView === 'preview' ? 'none' : 'flex' }}>
          {/* Subtabs Header */}
          <div className="rb-editor-tabs-nav">
            {editorTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`rb-editor-tab-btn ${activeEditorTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveEditorTab(tab.id)}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span style={{ fontSize: 10, background: 'var(--border-strong)', padding: '1px 5px', borderRadius: 999 }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="rb-editor-content">
            {/* TAB: Personal Info */}
            {activeEditorTab === 'personal' && (
              <>
                <div className="rb-form-row">
                  <div className="rb-form-group">
                    <label className="rb-label">{lang === 'pt' ? 'Nome Completo' : 'Full Name'}</label>
                    <input
                      type="text"
                      className="rb-input"
                      placeholder="Alex Morgan"
                      value={activeResume.data.personal.fullName || ''}
                      onChange={(e) => updatePersonal('fullName', e.target.value)}
                    />
                  </div>
                  <div className="rb-form-group">
                    <label className="rb-label">{lang === 'pt' ? 'Título / Cargo Desejado' : 'Job Title / Headline'}</label>
                    <input
                      type="text"
                      className="rb-input"
                      placeholder="Senior Full Stack Engineer"
                      value={activeResume.data.personal.jobTitle || ''}
                      onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                    />
                  </div>
                </div>

                <div className="rb-form-row">
                  <div className="rb-form-group">
                    <label className="rb-label">Email</label>
                    <input
                      type="email"
                      className="rb-input"
                      placeholder="name@email.com"
                      value={activeResume.data.personal.email || ''}
                      onChange={(e) => updatePersonal('email', e.target.value)}
                    />
                  </div>
                  <div className="rb-form-group">
                    <label className="rb-label">{lang === 'pt' ? 'Telefone' : 'Phone'}</label>
                    <input
                      type="text"
                      className="rb-input"
                      placeholder="+1 (555) 234-5678"
                      value={activeResume.data.personal.phone || ''}
                      onChange={(e) => updatePersonal('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="rb-form-row">
                  <div className="rb-form-group">
                    <label className="rb-label">{lang === 'pt' ? 'Localização' : 'Location'}</label>
                    <input
                      type="text"
                      className="rb-input"
                      placeholder="San Francisco, CA / Remote"
                      value={activeResume.data.personal.location || ''}
                      onChange={(e) => updatePersonal('location', e.target.value)}
                    />
                  </div>
                  <div className="rb-form-group">
                    <label className="rb-label">{lang === 'pt' ? 'Website / Portfólio' : 'Website / Portfolio'}</label>
                    <input
                      type="text"
                      className="rb-input"
                      placeholder="https://yoursite.dev"
                      value={activeResume.data.personal.website || ''}
                      onChange={(e) => updatePersonal('website', e.target.value)}
                    />
                  </div>
                </div>

                <div className="rb-form-row">
                  <div className="rb-form-group">
                    <label className="rb-label">LinkedIn</label>
                    <input
                      type="text"
                      className="rb-input"
                      placeholder="https://linkedin.com/in/username"
                      value={activeResume.data.personal.linkedin || ''}
                      onChange={(e) => updatePersonal('linkedin', e.target.value)}
                    />
                  </div>
                  <div className="rb-form-group">
                    <label className="rb-label">GitHub</label>
                    <input
                      type="text"
                      className="rb-input"
                      placeholder="https://github.com/username"
                      value={activeResume.data.personal.github || ''}
                      onChange={(e) => updatePersonal('github', e.target.value)}
                    />
                  </div>
                </div>

                <div className="rb-form-group">
                  <label className="rb-label">{lang === 'pt' ? 'Foto de Perfil (URL Opcional)' : 'Profile Photo (Optional Image URL)'}</label>
                  <input
                    type="url"
                    className="rb-input"
                    placeholder="https://example.com/avatar.jpg"
                    value={activeResume.data.personal.photoUrl || ''}
                    onChange={(e) => updatePersonal('photoUrl', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* TAB: Summary */}
            {activeEditorTab === 'summary' && (
              <div className="rb-form-group">
                <label className="rb-label">
                  {lang === 'pt' ? 'Resumo Profissional / Objetivo' : 'Professional Summary / Objective'}
                </label>
                <textarea
                  className="rb-textarea"
                  style={{ minHeight: 180 }}
                  placeholder={
                    lang === 'pt'
                      ? 'Descreva sua trajetória profissional, conquistas mensuráveis, tecnologias centrais e valor que você gera para equipes e projetos...'
                      : 'Describe your professional journey, key quantifiable achievements, core tech stack, and the value you bring to engineering teams...'
                  }
                  value={activeResume.data.summary || ''}
                  onChange={(e) => updateSection('summary', e.target.value)}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {activeResume.data.summary?.length || 0} {lang === 'pt' ? 'caracteres (ideal: 300-600)' : 'characters (recommended: 300-600)'}
                </span>
              </div>
            )}

            {/* TAB: Experience */}
            {activeEditorTab === 'experience' && (
              <>
                <button type="button" className="rb-add-item-btn" onClick={addExperience}>
                  <Plus size={16} />
                  <span>{lang === 'pt' ? 'Adicionar Experiência Profissional' : 'Add Work Experience'}</span>
                </button>

                {(activeResume.data.experience || []).map((exp, expIdx) => (
                  <div key={exp.id || `exp_idx_${expIdx}`} className="rb-item-card">
                    <div className="rb-item-card-header">
                      <span className="rb-item-card-title" title={exp.role || ''}>
                        {exp.role || (lang === 'pt' ? 'Novo Cargo' : 'New Position')}
                      </span>
                      <button
                        type="button"
                        className="rb-btn-icon-danger rb-item-delete-btn"
                        onClick={() => removeExperience(exp.id, expIdx)}
                        title={lang === 'pt' ? 'Excluir esta experiência' : 'Delete this experience'}
                        aria-label={lang === 'pt' ? 'Excluir esta experiência' : 'Delete this experience'}
                      >
                        <Trash2 size={14} />
                        <span className="rb-delete-label">{lang === 'pt' ? 'Excluir' : 'Delete'}</span>
                      </button>
                    </div>

                    <div className="rb-form-row">
                      <div className="rb-form-group">
                        <label className="rb-label">{lang === 'pt' ? 'Cargo / Posição' : 'Role / Title'}</label>
                        <input
                          type="text"
                          className="rb-input"
                          placeholder="Lead Software Engineer"
                          value={exp.role || ''}
                          onChange={(e) => updateExperienceItem(exp.id, 'role', e.target.value, expIdx)}
                        />
                      </div>
                      <div className="rb-form-group">
                        <label className="rb-label">{lang === 'pt' ? 'Empresa' : 'Company'}</label>
                        <input
                          type="text"
                          className="rb-input"
                          placeholder="Acme Corp"
                          value={exp.company || ''}
                          onChange={(e) => updateExperienceItem(exp.id, 'company', e.target.value, expIdx)}
                        />
                      </div>
                    </div>

                    <div className="rb-form-row">
                      <div className="rb-form-group">
                        <label className="rb-label">{lang === 'pt' ? 'Início' : 'Start Date'}</label>
                        <input
                          type="text"
                          className="rb-input"
                          placeholder="2021 / Jan 2021"
                          value={exp.startDate || ''}
                          onChange={(e) => updateExperienceItem(exp.id, 'startDate', e.target.value, expIdx)}
                        />
                      </div>
                      <div className="rb-form-group">
                        <label className="rb-label">{lang === 'pt' ? 'Término' : 'End Date'}</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            type="text"
                            className="rb-input"
                            placeholder="Present / 2024"
                            disabled={exp.current}
                            value={exp.current ? (lang === 'pt' ? 'Presente' : 'Present') : (exp.endDate || '')}
                            onChange={(e) => updateExperienceItem(exp.id, 'endDate', e.target.value, expIdx)}
                          />
                          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            <input
                              type="checkbox"
                              checked={!!exp.current}
                              onChange={(e) => updateExperienceItem(exp.id, 'current', e.target.checked, expIdx)}
                            />
                            {lang === 'pt' ? 'Atual' : 'Current'}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="rb-form-group">
                      <label className="rb-label">{lang === 'pt' ? 'Localização' : 'Location'}</label>
                      <input
                        type="text"
                        className="rb-input"
                        placeholder="Remote / San Francisco, CA"
                        value={exp.location || ''}
                        onChange={(e) => updateExperienceItem(exp.id, 'location', e.target.value, expIdx)}
                      />
                    </div>

                    {/* Bullet Points */}
                    <div className="rb-form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="rb-label">{lang === 'pt' ? 'Conquistas & Responsabilidades (Bullets)' : 'Bullet Points (Key Achievements)'}</label>
                        <button
                          type="button"
                          onClick={() => addExperienceBullet(exp.id, expIdx)}
                          style={{ fontSize: 11, color: 'var(--accent-cyan)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                        >
                          + {lang === 'pt' ? 'Adicionar Bullet' : 'Add Bullet'}
                        </button>
                      </div>

                      <div className="rb-bullet-list">
                        {(exp.bulletPoints || []).map((bp, bpIdx) => (
                          <div key={bpIdx} className="rb-bullet-row">
                            <span style={{ color: 'var(--accent-cyan)', fontSize: 14 }}>•</span>
                            <input
                              type="text"
                              className="rb-input rb-bullet-input"
                              placeholder={lang === 'pt' ? 'Descreva uma conquista mensurável com ação e impacto...' : 'Action verb + task + measurable impact...'}
                              value={bp || ''}
                              onChange={(e) => updateExperienceBullet(exp.id, bpIdx, e.target.value, expIdx)}
                            />
                            <button
                              type="button"
                              className="rb-btn-icon-danger"
                              style={{ flexShrink: 0 }}
                              onClick={() => removeExperienceBullet(exp.id, bpIdx, expIdx)}
                              title={lang === 'pt' ? 'Excluir bullet' : 'Delete bullet'}
                              aria-label={lang === 'pt' ? 'Excluir bullet' : 'Delete bullet'}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* TAB: Education */}
            {activeEditorTab === 'education' && (
              <>
                <button type="button" className="rb-add-item-btn" onClick={addEducation}>
                  <Plus size={16} />
                  <span>{lang === 'pt' ? 'Adicionar Formação Acadêmica' : 'Add Education'}</span>
                </button>

                {(activeResume.data.education || []).map((edu, eduIdx) => (
                  <div key={edu.id || `edu_idx_${eduIdx}`} className="rb-item-card">
                    <div className="rb-item-card-header">
                      <span className="rb-item-card-title" title={edu.degree || ''}>
                        {edu.degree || (lang === 'pt' ? 'Novo Grau' : 'Degree')}
                      </span>
                      <button
                        type="button"
                        className="rb-btn-icon-danger rb-item-delete-btn"
                        onClick={() => removeEducation(edu.id, eduIdx)}
                        title={lang === 'pt' ? 'Excluir esta formação' : 'Delete this education'}
                        aria-label={lang === 'pt' ? 'Excluir esta formação' : 'Delete this education'}
                      >
                        <Trash2 size={14} />
                        <span className="rb-delete-label">{lang === 'pt' ? 'Excluir' : 'Delete'}</span>
                      </button>
                    </div>

                    <div className="rb-form-row">
                      <div className="rb-form-group">
                        <label className="rb-label">{lang === 'pt' ? 'Instituição' : 'Institution / University'}</label>
                        <input
                          type="text"
                          className="rb-input"
                          placeholder="University of California"
                          value={edu.institution || ''}
                          onChange={(e) => updateEducationItem(edu.id, 'institution', e.target.value, eduIdx)}
                        />
                      </div>
                      <div className="rb-form-group">
                        <label className="rb-label">{lang === 'pt' ? 'Grau / Nível' : 'Degree'}</label>
                        <input
                          type="text"
                          className="rb-input"
                          placeholder="B.S. in Computer Science"
                          value={edu.degree || ''}
                          onChange={(e) => updateEducationItem(edu.id, 'degree', e.target.value, eduIdx)}
                        />
                      </div>
                    </div>

                    <div className="rb-form-row">
                      <div className="rb-form-group">
                        <label className="rb-label">{lang === 'pt' ? 'Ano Início' : 'Start Year'}</label>
                        <input
                          type="text"
                          className="rb-input"
                          placeholder="2016"
                          value={edu.startDate || ''}
                          onChange={(e) => updateEducationItem(edu.id, 'startDate', e.target.value, eduIdx)}
                        />
                      </div>
                      <div className="rb-form-group">
                        <label className="rb-label">{lang === 'pt' ? 'Ano Término' : 'End Year'}</label>
                        <input
                          type="text"
                          className="rb-input"
                          placeholder="2020"
                          value={edu.endDate || ''}
                          onChange={(e) => updateEducationItem(edu.id, 'endDate', e.target.value, eduIdx)}
                        />
                      </div>
                    </div>

                    <div className="rb-form-group">
                      <label className="rb-label">{lang === 'pt' ? 'Honras / GPA / Detalhes' : 'Honors / GPA / Details'}</label>
                      <input
                        type="text"
                        className="rb-input"
                        placeholder="Dean's Honor List, Magna Cum Laude"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducationItem(edu.id, 'gpa', e.target.value, eduIdx)}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* TAB: Skills */}
            {activeEditorTab === 'skills' && (
              <>
                <button type="button" className="rb-add-item-btn" onClick={addSkill}>
                  <Plus size={16} />
                  <span>{lang === 'pt' ? 'Adicionar Competência' : 'Add Skill'}</span>
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                  {(activeResume.data.skills || []).map((sk, skIdx) => (
                    <div key={sk.id || `sk_idx_${skIdx}`} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="rb-input"
                        placeholder="TypeScript, Docker, etc."
                        value={sk.name || ''}
                        onChange={(e) => updateSkillItem(sk.id, 'name', e.target.value, skIdx)}
                      />
                      <button
                        type="button"
                        className="rb-btn-icon-danger"
                        style={{ flexShrink: 0 }}
                        onClick={() => removeSkill(sk.id, skIdx)}
                        title={lang === 'pt' ? 'Excluir competência' : 'Delete skill'}
                        aria-label={lang === 'pt' ? 'Excluir competência' : 'Delete skill'}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TAB: Projects */}
            {activeEditorTab === 'projects' && (
              <>
                <button type="button" className="rb-add-item-btn" onClick={addProject}>
                  <Plus size={16} />
                  <span>{lang === 'pt' ? 'Adicionar Projeto em Destaque' : 'Add Featured Project'}</span>
                </button>

                {(activeResume.data.projects || []).map((proj, projIdx) => (
                  <div key={proj.id || `proj_idx_${projIdx}`} className="rb-item-card">
                    <div className="rb-item-card-header">
                      <span className="rb-item-card-title" title={proj.name || ''}>
                        {proj.name || (lang === 'pt' ? 'Novo Projeto' : 'Project Name')}
                      </span>
                      <button
                        type="button"
                        className="rb-btn-icon-danger rb-item-delete-btn"
                        onClick={() => removeProject(proj.id, projIdx)}
                        title={lang === 'pt' ? 'Excluir este projeto' : 'Delete this project'}
                        aria-label={lang === 'pt' ? 'Excluir este projeto' : 'Delete this project'}
                      >
                        <Trash2 size={14} />
                        <span className="rb-delete-label">{lang === 'pt' ? 'Excluir' : 'Delete'}</span>
                      </button>
                    </div>

                    <div className="rb-form-row">
                      <div className="rb-form-group">
                        <label className="rb-label">{lang === 'pt' ? 'Nome do Projeto' : 'Project Name'}</label>
                        <input
                          type="text"
                          className="rb-input"
                          placeholder="Task Queue Engine"
                          value={proj.name || ''}
                          onChange={(e) => updateProjectItem(proj.id, 'name', e.target.value, projIdx)}
                        />
                      </div>
                      <div className="rb-form-group">
                        <label className="rb-label">URL / Link</label>
                        <input
                          type="text"
                          className="rb-input"
                          placeholder="https://github.com/..."
                          value={proj.url || ''}
                          onChange={(e) => updateProjectItem(proj.id, 'url', e.target.value, projIdx)}
                        />
                      </div>
                    </div>

                    <div className="rb-form-group">
                      <label className="rb-label">{lang === 'pt' ? 'Stack / Tecnologias (separadas por vírgula)' : 'Tech Stack (comma-separated)'}</label>
                      <input
                        type="text"
                        className="rb-input"
                        placeholder="React, Node.js, PostgreSQL"
                        value={(proj.techStack || []).join(', ')}
                        onChange={(e) => {
                          const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateProjectItem(proj.id, 'techStack', arr, projIdx);
                        }}
                      />
                    </div>

                    <div className="rb-form-group">
                      <label className="rb-label">{lang === 'pt' ? 'Descrição do Projeto' : 'Description'}</label>
                      <textarea
                        className="rb-textarea"
                        placeholder="Key features, architecture, and results..."
                        value={proj.description || ''}
                        onChange={(e) => updateProjectItem(proj.id, 'description', e.target.value, projIdx)}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* TAB: Certifications & Languages */}
            {activeEditorTab === 'additional' && (
              <>
                <div className="rb-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="rb-label">{lang === 'pt' ? 'Certificações' : 'Certifications'}</label>
                    <button
                      type="button"
                      onClick={addCert}
                      style={{ fontSize: 11, color: 'var(--accent-cyan)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      + {lang === 'pt' ? 'Adicionar Certificado' : 'Add Certificate'}
                    </button>
                  </div>

                  {(activeResume.data.certifications || []).map((cert, certIdx) => (
                    <div key={cert.id || `cert_idx_${certIdx}`} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <input
                        type="text"
                        className="rb-input"
                        placeholder="AWS Solutions Architect"
                        value={cert.name || ''}
                        onChange={(e) => updateCert(cert.id, 'name', e.target.value, certIdx)}
                      />
                      <input
                        type="text"
                        className="rb-input"
                        style={{ width: 140 }}
                        placeholder="Issuer (e.g. AWS)"
                        value={cert.issuer || ''}
                        onChange={(e) => updateCert(cert.id, 'issuer', e.target.value, certIdx)}
                      />
                      <input
                        type="text"
                        className="rb-input"
                        style={{ width: 80 }}
                        placeholder="2023"
                        value={cert.date || ''}
                        onChange={(e) => updateCert(cert.id, 'date', e.target.value, certIdx)}
                      />
                      <button
                        type="button"
                        className="rb-btn-icon-danger"
                        style={{ flexShrink: 0 }}
                        onClick={() => removeCert(cert.id, certIdx)}
                        title={lang === 'pt' ? 'Excluir certificado' : 'Delete certificate'}
                        aria-label={lang === 'pt' ? 'Excluir certificado' : 'Delete certificate'}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rb-form-group" style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="rb-label">{lang === 'pt' ? 'Idiomas' : 'Languages'}</label>
                    <button
                      type="button"
                      onClick={addLanguage}
                      style={{ fontSize: 11, color: 'var(--accent-cyan)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      + {lang === 'pt' ? 'Adicionar Idioma' : 'Add Language'}
                    </button>
                  </div>

                  {(activeResume.data.languages || []).map((l, lIdx) => (
                    <div key={l.id || `lang_idx_${lIdx}`} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <input
                        type="text"
                        className="rb-input"
                        placeholder="English"
                        value={l.language || ''}
                        onChange={(e) => updateLanguage(l.id, 'language', e.target.value, lIdx)}
                      />
                      <input
                        type="text"
                        className="rb-input"
                        style={{ width: 180 }}
                        placeholder="Fluent / Native"
                        value={l.proficiency || ''}
                        onChange={(e) => updateLanguage(l.id, 'proficiency', e.target.value, lIdx)}
                      />
                      <button
                        type="button"
                        className="rb-btn-icon-danger"
                        style={{ flexShrink: 0 }}
                        onClick={() => removeLanguage(l.id, lIdx)}
                        title={lang === 'pt' ? 'Excluir idioma' : 'Delete language'}
                        aria-label={lang === 'pt' ? 'Excluir idioma' : 'Delete language'}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TAB: Design & Themes */}
            {activeEditorTab === 'design' && (
              <>
                <div className="rb-form-group">
                  <label className="rb-label">{lang === 'pt' ? 'Modelo de Layout' : 'Resume Template'}</label>
                  <div className="rb-theme-grid">
                    {TEMPLATES.map(tpl => {
                      const isActive = activeResume.template === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          className={`rb-template-card ${isActive ? 'active' : ''}`}
                          onClick={() => updateActiveResume({ template: tpl.id })}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 6 }}>
                            <span className="rb-template-title">{lang === 'pt' ? tpl.name : (tpl.nameEn || tpl.name)}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                              {tpl.badge && (
                                <span className="rb-template-tag">
                                  {lang === 'pt' ? tpl.badge : (tpl.badgeEn || tpl.badge)}
                                </span>
                              )}
                              {isActive && <Check size={14} className="text-emerald" />}
                            </div>
                          </div>
                          <span className="rb-template-desc">{lang === 'pt' ? tpl.desc : (tpl.descEn || tpl.desc)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rb-form-group">
                  <label className="rb-label">{lang === 'pt' ? 'Cor de Destaque' : 'Accent Color'}</label>
                  <div className="rb-colors-row">
                    {ACCENT_COLORS.map(color => (
                      <button
                        key={color.id}
                        type="button"
                        className={`rb-color-swatch ${activeResume.accentColor === color.hex ? 'active' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => updateActiveResume({ accentColor: color.hex })}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="rb-form-row">
                  <div className="rb-form-group">
                    <label className="rb-label">{lang === 'pt' ? 'Família Tipográfica' : 'Typography'}</label>
                    <select
                      className="rb-select"
                      value={activeResume.font || 'inter'}
                      onChange={(e) => updateActiveResume({ font: e.target.value })}
                    >
                      {FONT_OPTIONS.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rb-form-group">
                    <label className="rb-label">{lang === 'pt' ? 'Idioma dos Títulos da Folha' : 'Resume Section Labels'}</label>
                    <select
                      className="rb-select"
                      value={resumeLang}
                      onChange={(e) => setResumeLang(e.target.value)}
                    >
                      <option value="en">English (Work Experience, Education)</option>
                      <option value="pt">Português (Experiência Profissional, Formação)</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE ZOOMABLE A4 PREVIEW */}
        <div className="rb-preview-panel" style={{ display: mobileView === 'editor' && window.innerWidth <= 1100 ? 'none' : 'flex' }}>
          {/* Quick Layout Switcher Bar */}
          <div className="rb-layout-bar">
            <div className="rb-layout-bar-header">
              <div className="rb-layout-bar-label">
                <Layers size={14} className="text-cyan" />
                <span>{lang === 'pt' ? 'Selecionar Layout do Currículo:' : 'Select Resume Layout:'}</span>
              </div>
              <span className="rb-layout-bar-hint">
                {lang === 'pt' ? 'Alterna o modelo instantaneamente' : 'Switches layout instantly'}
              </span>
            </div>
            <div className="rb-layout-pills">
              {TEMPLATES.map(tpl => {
                const isActive = activeResume.template === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    className={`rb-layout-pill-btn ${isActive ? 'active' : ''}`}
                    onClick={() => updateActiveResume({ template: tpl.id })}
                    title={lang === 'pt' ? tpl.desc : (tpl.descEn || tpl.desc)}
                  >
                    {isActive && <Check size={13} className="text-emerald" />}
                    <span>{lang === 'pt' ? tpl.name : (tpl.nameEn || tpl.name)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zoom controls bar */}
          <div className="rb-preview-controls">
            <div className="rb-zoom-group">
              <Eye size={15} className="text-cyan" />
              <span>{lang === 'pt' ? 'Folha A4 em Tempo Real' : 'Live A4 Print Document'}</span>
            </div>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: 12 }}
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span style={{ fontSize: 12, minWidth: 42, textAlign: 'center', color: 'var(--text-muted)' }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: 12 }}
                onClick={() => setZoomLevel(prev => Math.min(1.3, prev + 0.1))}
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: 12 }}
                onClick={() => setZoomLevel(1)}
                title="Reset Zoom"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Printable Document Container */}
          <div className="rb-sheet-viewport">
            <div
              id="resume-printable-document"
              style={{
                transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined
              }}
            >
              <ResumePreviewRenderer
                resume={activeResume}
                template={activeResume.template || 'modern'}
                accentColor={activeResume.accentColor || '#0284c7'}
                font={activeResume.font || 'inter'}
                lang={resumeLang}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. LINKEDIN IMPORT MODAL */}
      <LinkedInImportModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        onApplyData={handleApplyLinkedInData}
        lang={lang}
      />
    </div>
  );
}
