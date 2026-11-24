'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AccessibilitySettings {
  fontSizePercent: number; // 85, 100, 115, 130, 150
  highContrast: boolean;
  textSpacing: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  theme: 'light' | 'dark';
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSizePercent: 100,
  highContrast: false,
  textSpacing: false,
  underlineLinks: false,
  reduceMotion: false,
  theme: 'light',
};

const FONT_SIZE_STEPS = [85, 100, 115, 130, 150];

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  toggleHighContrast: () => void;
  toggleTextSpacing: () => void;
  toggleUnderlineLinks: () => void;
  toggleReduceMotion: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  resetAll: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Load persisted settings on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('drishti-theme') as 'light' | 'dark' | null;
      const storedA11y = localStorage.getItem('drishti-a11y');

      let parsedA11y: Partial<AccessibilitySettings> = {};
      if (storedA11y) {
        parsedA11y = JSON.parse(storedA11y);
      }

      // Check system reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Check system dark mode if not explicitly stored
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

      const initialSettings: AccessibilitySettings = {
        fontSizePercent: parsedA11y.fontSizePercent ?? 100,
        highContrast: parsedA11y.highContrast ?? false,
        textSpacing: parsedA11y.textSpacing ?? false,
        underlineLinks: parsedA11y.underlineLinks ?? false,
        reduceMotion: parsedA11y.reduceMotion ?? prefersReducedMotion,
        theme: initialTheme,
      };

      setSettings(initialSettings);

      // Immediate DOM sync on mount
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.style.fontSize = `${initialSettings.fontSizePercent}%`;
        root.classList.toggle('high-contrast', initialSettings.highContrast);
        root.classList.toggle('a11y-spacing', initialSettings.textSpacing);
        root.classList.toggle('a11y-links', initialSettings.underlineLinks);
        root.classList.toggle('reduce-motion', initialSettings.reduceMotion);
        root.classList.toggle('dark', initialSettings.theme === 'dark');
      }
    } catch {
      // fallback to defaults if storage access fails
    }
    setMounted(true);
  }, []);

  // Synchronize document classes and styles whenever settings change
  useEffect(() => {
    if (!mounted || typeof document === 'undefined') return;

    const root = document.documentElement;

    // Font size scaling
    root.style.fontSize = `${settings.fontSizePercent}%`;

    // Classes
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('a11y-spacing', settings.textSpacing);
    root.classList.toggle('a11y-links', settings.underlineLinks);
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    root.classList.toggle('dark', settings.theme === 'dark');

    // Save to localStorage
    try {
      localStorage.setItem('drishti-theme', settings.theme);
      localStorage.setItem(
        'drishti-a11y',
        JSON.stringify({
          fontSizePercent: settings.fontSizePercent,
          highContrast: settings.highContrast,
          textSpacing: settings.textSpacing,
          underlineLinks: settings.underlineLinks,
          reduceMotion: settings.reduceMotion,
        })
      );
    } catch {
      // Ignore storage errors in sandbox
    }
  }, [settings, mounted]);

  const increaseFontSize = () => {
    setSettings((prev) => {
      const idx = FONT_SIZE_STEPS.indexOf(prev.fontSizePercent);
      const nextStep = idx < FONT_SIZE_STEPS.length - 1 ? FONT_SIZE_STEPS[idx + 1] : FONT_SIZE_STEPS[FONT_SIZE_STEPS.length - 1];
      if (typeof document !== 'undefined') {
        document.documentElement.style.fontSize = `${nextStep}%`;
      }
      return { ...prev, fontSizePercent: nextStep };
    });
  };

  const decreaseFontSize = () => {
    setSettings((prev) => {
      const idx = FONT_SIZE_STEPS.indexOf(prev.fontSizePercent);
      const prevStep = idx > 0 ? FONT_SIZE_STEPS[idx - 1] : FONT_SIZE_STEPS[0];
      if (typeof document !== 'undefined') {
        document.documentElement.style.fontSize = `${prevStep}%`;
      }
      return { ...prev, fontSizePercent: prevStep };
    });
  };

  const resetFontSize = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = '100%';
    }
    setSettings((prev) => ({ ...prev, fontSizePercent: 100 }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => {
      const next = !prev.highContrast;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('high-contrast', next);
      }
      return { ...prev, highContrast: next };
    });
  };

  const toggleTextSpacing = () => {
    setSettings((prev) => {
      const next = !prev.textSpacing;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('a11y-spacing', next);
      }
      return { ...prev, textSpacing: next };
    });
  };

  const toggleUnderlineLinks = () => {
    setSettings((prev) => {
      const next = !prev.underlineLinks;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('a11y-links', next);
      }
      return { ...prev, underlineLinks: next };
    });
  };

  const toggleReduceMotion = () => {
    setSettings((prev) => {
      const next = !prev.reduceMotion;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('reduce-motion', next);
      }
      return { ...prev, reduceMotion: next };
    });
  };

  const toggleTheme = () => {
    setSettings((prev) => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      if (typeof document !== 'undefined') {
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        try {
          localStorage.setItem('drishti-theme', nextTheme);
        } catch {}
      }
      return { ...prev, theme: nextTheme };
    });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('drishti-theme', theme);
      } catch {}
    }
    setSettings((prev) => ({ ...prev, theme }));
  };

  const resetAll = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.fontSize = '100%';
      root.classList.remove('high-contrast', 'a11y-spacing', 'a11y-links', 'reduce-motion');
      try {
        localStorage.removeItem('drishti-a11y');
      } catch {}
    }
    setSettings((prev) => ({
      ...DEFAULT_SETTINGS,
      theme: prev.theme, // preserve chosen theme
    }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleHighContrast,
        toggleTextSpacing,
        toggleUnderlineLinks,
        toggleReduceMotion,
        toggleTheme,
        setTheme,
        resetAll,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return ctx;
}

export default AccessibilityProvider;
