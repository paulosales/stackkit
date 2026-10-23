// Resume Data Model, Demo Presets, and LocalStorage Multi-Resume Management

export const STORAGE_KEY_RESUMES = 'stackkit_resumes_list_v1';
export const STORAGE_KEY_ACTIVE = 'stackkit_active_resume_id_v1';

export const TEMPLATES = [
  { id: 'modern', name: 'Modern Tech', nameEn: 'Modern Tech', badge: 'Popular', badgeEn: 'Popular', desc: 'Layout moderno de coluna única com destaques visuais', descEn: 'Sleek single-column layout with tech badge accents' },
  { id: 'minimalist', name: 'Minimalista Suíço', nameEn: 'Minimalist Swiss', badge: 'Editorial', badgeEn: 'Editorial', desc: 'Grid editorial assimétrico com tipografia limpa e espaçamento refinado', descEn: 'Asymmetric Swiss grid with clean typography and refined whitespace' },
  { id: 'compact', name: 'Tech Compacto', nameEn: 'Silicon Tech Compact', badge: 'Tech / TI', badgeEn: 'Tech / Dev', desc: 'Estrutura condensada de alta densidade ideal para desenvolvedores e TI', descEn: 'High-density single-page layout engineered for tech & engineering' },
  { id: 'executive', name: 'Executive Classic', nameEn: 'Executive Classic', badge: 'Corporativo', badgeEn: 'Corporate', desc: 'Cabeçalho formal centralizado com tipografia serifada elegante', descEn: 'Formal, centered header with elegant typography' },
  { id: 'creative', name: 'Creative Split', nameEn: 'Creative Split (Sidebar)', badge: '2 Colunas', badgeEn: '2 Columns', desc: 'Duas colunas com barra lateral colorida para competências', descEn: 'Two-column layout with colored sidebar for skills & info' },
  { id: 'nordic', name: 'Nordic Timeline', nameEn: 'Nordic Timeline', badge: 'Linha do Tempo', badgeEn: 'Timeline', desc: 'Design escandinavo em linha do tempo com marcos visuais', descEn: 'Clean timeline design with milestone dots and tech tags' },
  { id: 'elegant', name: 'Clássico Elegante', nameEn: 'Luxe Serif / Academic', badge: 'Clássico', badgeEn: 'Classic', desc: 'Estética refinada em tons suaves com detalhes clássicos e moldura sutil', descEn: 'Refined serif aesthetic with warm tones, frame borders & consulting style' },
  { id: 'infographic', name: 'Infográfico Visual', nameEn: 'Visual Infographic', badge: 'Visual', badgeEn: 'Visual', desc: 'Cards visuais modernos com ícones coloridos e destaque para projetos', descEn: 'Modern card-based visual design with icon badges & skill pills' },
  { id: 'bold', name: 'Banner de Destaque', nameEn: 'Bold Accent Banner', badge: 'Impacto', badgeEn: 'High Impact', desc: 'Cabeçalho com faixa colorida em largura total de alto impacto visual', descEn: 'Full-width colored header banner with high contrast & modern cards' },
  { id: 'ats', name: 'ATS Standard Pro', nameEn: 'ATS Standard Pro', badge: '100% ATS', badgeEn: '100% ATS', desc: '100% otimizado para robôs de triagem (Workday/Taleo/Greenhouse)', descEn: '100% ATS parser compliant, clean high-density structure' }
];

export const ACCENT_COLORS = [
  { id: 'cyan', name: 'Tech Cyan', hex: '#0284c7', light: '#e0f2fe' },
  { id: 'indigo', name: 'Indigo Blue', hex: '#4f46e5', light: '#eef2ff' },
  { id: 'emerald', name: 'Emerald Green', hex: '#059669', light: '#ecfdf5' },
  { id: 'navy', name: 'Corporate Navy', hex: '#1e3a8a', light: '#eff6ff' },
  { id: 'rose', name: 'Burgundy Rose', hex: '#be123c', light: '#fff1f2' },
  { id: 'slate', name: 'Monochrome Slate', hex: '#334155', light: '#f1f5f9' }
];

export const FONT_OPTIONS = [
  { id: 'inter', name: 'Inter (Modern Sans)', family: "'Inter', sans-serif" },
  { id: 'jakarta', name: 'Plus Jakarta Sans (Contemporary)', family: "'Plus Jakarta Sans', sans-serif" },
  { id: 'roboto', name: 'Roboto / Open Sans', family: "'Roboto', sans-serif" },
  { id: 'merriweather', name: 'Merriweather (Classic Serif)', family: "'Merriweather', Georgia, serif" }
];

export const EMPTY_RESUME = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    photoUrl: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: []
};

export const DEMO_RESUMES = {
  en: {
    id: 'demo-tech-en',
    title: 'Senior Software Engineer (Tech)',
    updatedAt: new Date().toISOString(),
    template: 'modern',
    accentColor: '#0284c7',
    font: 'inter',
    density: 'normal',
    data: {
      personal: {
        fullName: 'Alex Morgan',
        jobTitle: 'Senior Full-Stack & Cloud Engineer',
        email: 'alex.morgan.dev@email.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA / Remote',
        website: 'https://alexmorgan.dev',
        linkedin: 'https://linkedin.com/in/alexmorgandev',
        github: 'https://github.com/alexmorgandev',
        photoUrl: ''
      },
      summary: 'Results-driven Senior Full-Stack Engineer with 7+ years of experience architecting high-concurrency cloud systems, distributed microservices, and modern web applications. Proven track record leading engineering teams, improving API latency by 40%, and maintaining 99.99% uptime across production clusters. Passionate about clean code, automated testing, and developer productivity tools.',
      experience: [
        {
          id: 'exp-1',
          role: 'Lead Full-Stack Engineer',
          company: 'CloudScale Technologies',
          location: 'San Francisco, CA',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          description: 'Leading a core platform team of 7 engineers developing distributed multi-tenant SaaS services processing 50M+ daily events.',
          bulletPoints: [
            'Architected event-driven microservices with Node.js, Go, and Kafka, reducing transaction processing latency by 35%.',
            'Migrated frontend architecture to React 19, TypeScript, and Vite, improving initial page load speeds by 52%.',
            'Implemented zero-trust authentication pipelines integrating OAuth2, JWT with RSA keys, and automated RBAC permissions.',
            'Mentored 5 junior and mid-level engineers through structured pairing, code reviews, and system design workshops.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Senior Software Engineer',
          company: 'FinPulse Systems',
          location: 'Austin, TX (Remote)',
          startDate: '2019',
          endDate: '2022',
          current: false,
          description: 'Developed real-time banking analytics dashboards, transaction engines, and customer portal APIs.',
          bulletPoints: [
            'Designed resilient RESTful and GraphQL APIs in Node.js and PostgreSQL handling $120M in monthly financial workflows.',
            'Containerized legacy monolith using Docker and Kubernetes on AWS (EKS), cutting cloud infrastructure costs by 22%.',
            'Introduced end-to-end integration test suites with Playwright and Jest, lowering production regression bugs by 45%.'
          ]
        },
        {
          id: 'exp-3',
          role: 'Software Developer',
          company: 'Apex Digital Labs',
          location: 'Seattle, WA',
          startDate: '2017',
          endDate: '2019',
          current: false,
          description: 'Built customer-facing web applications and internal administrative tooling.',
          bulletPoints: [
            'Engineered responsive web portals using React, Redux, and Tailwind CSS serving 300,000+ active monthly users.',
            'Optimized complex SQL queries and indexing strategies on PostgreSQL, reducing slow queries by 60%.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of Washington',
          degree: 'Bachelor of Science (B.S.)',
          fieldOfStudy: 'Computer Science & Software Engineering',
          location: 'Seattle, WA',
          startDate: '2013',
          endDate: '2017',
          gpa: '3.8 / 4.0 (Dean\'s Honor List)',
          details: 'Focus on Distributed Systems, Algorithms, Database Management, and Network Security.'
        }
      ],
      skills: [
        { id: 'sk-1', name: 'TypeScript / JavaScript', category: 'Languages', level: 'Expert' },
        { id: 'sk-2', name: 'Go (Golang)', category: 'Languages', level: 'Proficient' },
        { id: 'sk-3', name: 'Python', category: 'Languages', level: 'Proficient' },
        { id: 'sk-4', name: 'React & Next.js', category: 'Frontend', level: 'Expert' },
        { id: 'sk-5', name: 'Node.js & Express', category: 'Backend', level: 'Expert' },
        { id: 'sk-6', name: 'PostgreSQL & Redis', category: 'Databases', level: 'Expert' },
        { id: 'sk-7', name: 'Docker & Kubernetes', category: 'DevOps / Cloud', level: 'Proficient' },
        { id: 'sk-8', name: 'AWS (S3, EKS, Lambda)', category: 'DevOps / Cloud', level: 'Proficient' },
        { id: 'sk-9', name: 'System Design & Microservices', category: 'Architecture', level: 'Expert' },
        { id: 'sk-10', name: 'CI/CD & GitHub Actions', category: 'DevOps / Cloud', level: 'Proficient' }
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'Distributed Task Queue (GoQueue)',
          role: 'Creator & Maintainer',
          url: 'https://github.com/alexmorgandev/goqueue',
          techStack: ['Go', 'Redis', 'gRPC', 'Docker'],
          description: 'High-performance distributed task scheduler handling delayed job execution and dead-letter retries with sub-millisecond dispatch.'
        },
        {
          id: 'proj-2',
          name: 'Developer Tooling Hub',
          role: 'Lead Architect',
          url: 'https://stackkit.com.br',
          techStack: ['React', 'Vite', 'Web Crypto API', 'CSS Modules'],
          description: 'Private, zero-server-storage client-side developer workstation featuring 40+ utilities used by thousands of engineers.'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services (AWS)',
          date: '2023',
          url: 'https://aws.amazon.com'
        },
        {
          id: 'cert-2',
          name: 'Certified Kubernetes Application Developer (CKAD)',
          issuer: 'The Linux Foundation',
          date: '2022',
          url: 'https://www.cncf.io'
        }
      ],
      languages: [
        { id: 'lang-1', language: 'English', proficiency: 'Native / Bilingual' },
        { id: 'lang-2', language: 'Portuguese', proficiency: 'Professional Working' },
        { id: 'lang-3', language: 'Spanish', proficiency: 'Conversational' }
      ]
    }
  },
  pt: {
    id: 'demo-tech-pt',
    title: 'Engenheiro de Software Sênior (Tech)',
    updatedAt: new Date().toISOString(),
    template: 'modern',
    accentColor: '#0284c7',
    font: 'inter',
    density: 'normal',
    data: {
      personal: {
        fullName: 'Lucas Fernandes Silva',
        jobTitle: 'Engenheiro de Software Full Stack Sênior',
        email: 'lucas.fernandes.dev@email.com',
        phone: '+55 (11) 98765-4321',
        location: 'São Paulo, SP / Remoto',
        website: 'https://lucasfernandes.dev',
        linkedin: 'https://linkedin.com/in/lucasfernandesdev',
        github: 'https://github.com/lucasfernandesdev',
        photoUrl: ''
      },
      summary: 'Engenheiro de Software com mais de 7 anos de experiência no desenvolvimento de sistemas distribuídos de alta concorrência, microsserviços em nuvem e aplicações web modernas. Histórico comprovado liderando equipes técnicas, reduzindo latência de APIs em mais de 35% e garantindo 99.99% de disponibilidade em clusters de produção.',
      experience: [
        {
          id: 'exp-1',
          role: 'Tech Lead / Engenheiro Full Stack Sênior',
          company: 'Fintech Brasil Inovação',
          location: 'São Paulo, SP',
          startDate: '2022',
          endDate: 'Presente',
          current: true,
          description: 'Liderança técnica de squad de 7 engenheiros focados no gateway de pagamentos e liquidação Pix de alta volumetria.',
          bulletPoints: [
            'Desenvolveu microsserviços orientados a eventos com Node.js, Go e Apache Kafka com processamento de mais de 40M de requisições diárias.',
            'Migrou a interface de gestão para React, TypeScript e Vite, aumentando o índice de satisfação do usuário e velocidade de carregamento em 50%.',
            'Implantou esteiras completas de CI/CD via GitHub Actions e monitoramento com Prometheus e Grafana.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Engenheiro de Software Pleno',
          company: 'TechCorp Soluções em Nuvem',
          location: 'Campinas, SP (Remoto)',
          startDate: '2019',
          endDate: '2022',
          current: false,
          description: 'Desenvolvimento e escalabilidade de ERP em nuvem para clientes corporativos de grande porte.',
          bulletPoints: [
            'Construiu APIs RESTful escaláveis em Node.js com PostgreSQL e Redis para controle financeiro e emissão de notas fiscais.',
            'Otimizou rotinas críticas de banco de dados reduzindo tempos de resposta de relatórios de 14s para 1.2s.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'Universidade de São Paulo (USP)',
          degree: 'Bacharelado em Ciência da Computação',
          fieldOfStudy: 'Ciência da Computação e Engenharia de Software',
          location: 'São Paulo, SP',
          startDate: '2015',
          endDate: '2019',
          gpa: 'Destaque acadêmico',
          details: 'Ênfase em Algoritmos Avançados, Bancos de Dados Relacionais e Não-Relacionais e Segurança de Software.'
        }
      ],
      skills: [
        { id: 'sk-1', name: 'TypeScript / JavaScript', category: 'Linguagens', level: 'Avançado' },
        { id: 'sk-2', name: 'Go (Golang)', category: 'Linguagens', level: 'Intermediário' },
        { id: 'sk-3', name: 'React & Next.js', category: 'Frontend', level: 'Avançado' },
        { id: 'sk-4', name: 'Node.js & Express / NestJS', category: 'Backend', level: 'Avançado' },
        { id: 'sk-5', name: 'PostgreSQL, Redis & MongoDB', category: 'Bancos de Dados', level: 'Avançado' },
        { id: 'sk-6', name: 'Docker & Kubernetes', category: 'DevOps / Cloud', level: 'Avançado' },
        { id: 'sk-7', name: 'AWS (S3, ECS, Lambda, RDS)', category: 'DevOps / Cloud', level: 'Avançado' },
        { id: 'sk-8', name: 'Arquitetura de Microsserviços', category: 'Arquitetura', level: 'Avançado' }
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'Engine de Conciliação Financeira Pix',
          role: 'Desenvolvedor Principal',
          url: 'https://github.com/lucasfernandesdev/pix-engine',
          techStack: ['Node.js', 'Go', 'Redis', 'PostgreSQL'],
          description: 'Sistema de alta performance para validação em lote de comprovantes Pix e payloads EMV.'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services (AWS)',
          date: '2023',
          url: 'https://aws.amazon.com'
        }
      ],
      languages: [
        { id: 'lang-1', language: 'Português', proficiency: 'Nativo' },
        { id: 'lang-2', language: 'Inglês', proficiency: 'Fluente / Profissional' }
      ]
    }
  }
};

// Normalize and ensure unique IDs for all resume items
export function normalizeResume(resume) {
  if (!resume || typeof resume !== 'object') return resume;
  const data = resume.data || {};
  const seenIds = new Set();

  const ensureUniqueId = (item, prefix, idx) => {
    let id = item?.id ? String(item.id) : null;
    if (!id || seenIds.has(id)) {
      id = `${prefix}_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
    }
    seenIds.add(id);
    return { ...item, id };
  };

  return {
    ...resume,
    id: resume.id || `resume_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    data: {
      ...EMPTY_RESUME,
      ...data,
      personal: { ...EMPTY_RESUME.personal, ...(data.personal || {}) },
      experience: Array.isArray(data.experience)
        ? data.experience.map((exp, i) => ensureUniqueId(exp, 'exp', i))
        : [],
      education: Array.isArray(data.education)
        ? data.education.map((edu, i) => ensureUniqueId(edu, 'edu', i))
        : [],
      skills: Array.isArray(data.skills)
        ? data.skills.map((sk, i) => ensureUniqueId(sk, 'sk', i))
        : [],
      projects: Array.isArray(data.projects)
        ? data.projects.map((proj, i) => ensureUniqueId(proj, 'proj', i))
        : [],
      certifications: Array.isArray(data.certifications)
        ? data.certifications.map((cert, i) => ensureUniqueId(cert, 'cert', i))
        : [],
      languages: Array.isArray(data.languages)
        ? data.languages.map((l, i) => ensureUniqueId(l, 'lang', i))
        : []
    }
  };
}

// LocalStorage helpers
export function getSavedResumes(lang = 'en') {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESUMES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeResume);
      }
    }
  } catch (err) {
    console.error('Failed to load resumes from LocalStorage:', err);
  }

  // Fallback: seed with default demo resume for current language
  const defaultResume = normalizeResume(DEMO_RESUMES[lang] || DEMO_RESUMES.en);
  const initial = [defaultResume];
  try {
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(initial));
    localStorage.setItem(STORAGE_KEY_ACTIVE, defaultResume.id);
  } catch (err) {
    // LocalStorage might be full or disabled
  }
  return initial;
}

export function saveAllResumes(resumes) {
  try {
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(resumes));
  } catch (err) {
    console.error('Failed to save resumes list:', err);
  }
}

export function getActiveResumeId(resumes = []) {
  try {
    const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (savedId && resumes.some(r => r.id === savedId)) {
      return savedId;
    }
  } catch {}
  return resumes[0]?.id || null;
}

export function setActiveResumeId(id) {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE, id);
  } catch {}
}

export function createNewResume(title = 'New Resume', template = 'modern', lang = 'en') {
  const newId = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  return normalizeResume({
    id: newId,
    title: title.trim() || 'Untitled Resume',
    updatedAt: new Date().toISOString(),
    template: template || 'modern',
    accentColor: '#0284c7',
    font: 'inter',
    density: 'normal',
    data: {
      ...EMPTY_RESUME,
      personal: {
        ...EMPTY_RESUME.personal,
        fullName: lang === 'pt' ? 'Seu Nome Completo' : 'Your Full Name',
        jobTitle: lang === 'pt' ? 'Seu Cargo / Área de Atuação' : 'Your Job Title / Specialization',
        email: 'your.email@example.com',
        phone: '+1 (555) 000-0000',
        location: lang === 'pt' ? 'Cidade, Estado' : 'City, Country'
      }
    }
  });
}

export function duplicateResume(sourceResume) {
  const newId = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  return normalizeResume({
    ...JSON.parse(JSON.stringify(sourceResume)),
    id: newId,
    title: `${sourceResume.title} (Copy)`,
    updatedAt: new Date().toISOString()
  });
}
