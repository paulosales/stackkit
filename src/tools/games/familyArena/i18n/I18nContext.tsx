import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LANG_STORAGE_KEY = 'family_arena_lang';

function getBrowserDefaultLanguage(): Language {
  if (typeof navigator !== 'undefined') {
    const lang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase();
    if (lang.startsWith('pt')) return 'pt';
    if (lang.startsWith('es')) return 'es';
  }
  return 'en';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLanguage?: Language }> = ({
  children,
  initialLanguage
}) => {
  const [internalLanguage, setInternalLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
      if (saved === 'en' || saved === 'pt' || saved === 'es') {
        return saved;
      }
    }
    return getBrowserDefaultLanguage();
  });

  const language = (initialLanguage && (initialLanguage === 'en' || initialLanguage === 'pt' || initialLanguage === 'es'))
    ? initialLanguage
    : internalLanguage;

  useEffect(() => {
    if (initialLanguage && (initialLanguage === 'en' || initialLanguage === 'pt' || initialLanguage === 'es')) {
      setInternalLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setInternalLanguage(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

const defaultTranslate = (key: string, params?: Record<string, string | number>): string => {
  const dict = TRANSLATIONS.en;
  let text = dict[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    });
  }

  return text;
};

const defaultContext: I18nContextType = {
  language: 'en',
  setLanguage: () => {},
  t: defaultTranslate,
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  return context || defaultContext;
};
