export * from './i18n/translations';
import { translations, SupportedLanguage, Translations } from './i18n/translations';

export function getTranslation(lang: SupportedLanguage = 'en'): Translations {
  return translations[lang] || translations.en;
}

export function translate(key: keyof Translations | string, lang: SupportedLanguage = 'en', fallback?: string): string {
  const dict = translations[lang] || translations.en;
  return (dict as any)[key] || (translations.en as any)[key] || fallback || String(key);
}

export default translations;
