import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';

function detectInitialLanguage() {
  if (typeof window === 'undefined') return 'pt';
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/en/') || path === '/en') return 'en';
  if (path.startsWith('/pt/') || path === '/pt') return 'pt';
  if (path.startsWith('/es/') || path === '/es') return 'es';
  if (window.__INITIAL_LANG__) return window.__INITIAL_LANG__;
  try {
    const userLang = localStorage.getItem('stackkit_user_lang');
    if (userLang && ['en', 'pt', 'es'].includes(userLang)) return userLang;
    const saved = localStorage.getItem('stackkit_lang');
    if (saved && ['en', 'pt', 'es'].includes(saved)) return saved;
  } catch {
    // ignore
  }
  const browserLangs = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language || ''])) || [];
  for (const bLang of browserLangs) {
    const lower = bLang.toLowerCase();
    if (lower.startsWith('pt')) return 'pt';
    if (lower.startsWith('es')) return 'es';
    if (lower.startsWith('en')) return 'en';
  }
  return 'pt';
}

const initialLang = detectInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      es: { translation: es }
    },
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;

