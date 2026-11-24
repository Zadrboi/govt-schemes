import { describe, it, expect } from 'vitest';
import { translations, SupportedLanguage } from '@/lib/i18n/translations';

describe('Accessibility & Multilingual Parity (GIGW 3.0 & WCAG 2.1 AA)', () => {
  const languages: SupportedLanguage[] = ['en', 'as', 'hi', 'bn'];

  it('ensures all 4 required languages have complete translations without missing keys', () => {
    const requiredKeys = Object.keys(translations.en) as (keyof typeof translations.en)[];

    for (const lang of languages) {
      const langTranslations = translations[lang];
      expect(langTranslations).toBeDefined();

      for (const key of requiredKeys) {
        expect(langTranslations[key], `Missing key "${key}" in language "${lang}"`).toBeDefined();
        expect(langTranslations[key].length).toBeGreaterThan(0);
      }
    }
  });

  it('validates that skip-to-content accessibility target exists in translations', () => {
    expect(translations.en.skipToContent).toBe('Skip to Main Content');
    expect(translations.as.skipToContent).toBe('মুখ্য বিষয়বস্তুলৈ যাওক');
    expect(translations.hi.skipToContent).toBe('मुख्य सामग्री पर जाएं');
    expect(translations.bn.skipToContent).toBe('মূল বিষয়ে যান');
  });
});
