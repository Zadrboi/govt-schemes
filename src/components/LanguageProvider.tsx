'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, translations, Translations } from '@/lib/i18n/translations';

export interface LanguageContextType {
  lang: SupportedLanguage;
  language: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations & Record<string, any>;
}

const defaultContext: LanguageContextType = {
  lang: 'en',
  language: 'en',
  setLang: () => {},
  setLanguage: () => {},
  t: translations.en,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    try {
      const stored = (
        localStorage.getItem('drishti-lang') ||
        localStorage.getItem('drishti_preferred_lang') ||
        localStorage.getItem('yojna_preferred_lang')
      ) as SupportedLanguage;

      if (stored && ['en', 'as', 'hi', 'bn'].includes(stored)) {
        setLangState(stored);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = stored;
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem('drishti-lang', newLang);
      localStorage.setItem('drishti_preferred_lang', newLang);
      localStorage.setItem('yojna_preferred_lang', newLang);
    } catch {
      // Ignore storage access errors
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  };

  const currentTranslations = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        lang,
        language: lang,
        setLang,
        setLanguage: setLang,
        t: currentTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
