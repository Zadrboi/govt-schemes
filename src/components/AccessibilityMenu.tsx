'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { useLanguage } from './LanguageProvider';
import { Eye, RotateCcw, X, Type, Contrast, Space, Link as LinkIcon, Activity } from 'lucide-react';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    settings,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast,
    toggleTextSpacing,
    toggleUnderlineLinks,
    toggleReduceMotion,
    resetAll,
  } = useAccessibility();

  const { t } = useLanguage();

  // Close when pressing Escape or clicking outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={t.a11yTitle || 'Accessibility options'}
        title={t.a11yTitle || 'Accessibility options'}
        className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-surface/80 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center"
      >
        <Eye className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.a11yTitle || 'Accessibility preferences'}
          className="absolute right-0 mt-3 w-80 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-2xl z-[9999] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-line dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary dark:text-sky-400" />
              <h2 className="text-sm font-semibold tracking-tight text-ink dark:text-slate-100">
                {t.a11yTitle || 'Accessibility Options'}
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility menu"
              className="p-1 rounded-full text-ink-muted hover:text-ink dark:hover:text-slate-100 hover:bg-surface dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {/* Text Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> {t.a11yTextSize || 'Text Size'}
                </span>
                <span className="text-[11px] font-semibold text-primary dark:text-sky-400 px-2.5 py-0.5 rounded-full bg-pill dark:bg-blue-950 font-mono">
                  {settings.fontSizePercent}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseFontSize}
                  disabled={settings.fontSizePercent <= 85}
                  className="flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border border-line dark:border-slate-700 bg-surface dark:bg-slate-800 text-ink dark:text-slate-200 hover:bg-pill/60 disabled:opacity-40 transition-colors"
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <button
                  onClick={resetFontSize}
                  className="py-1.5 px-3 text-xs font-semibold rounded-lg border border-line dark:border-slate-700 bg-surface dark:bg-slate-800 text-ink dark:text-slate-200 hover:bg-pill/60 transition-colors"
                  aria-label="Reset font size to default (100%)"
                >
                  100%
                </button>
                <button
                  onClick={increaseFontSize}
                  disabled={settings.fontSizePercent >= 150}
                  className="flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border border-line dark:border-slate-700 bg-surface dark:bg-slate-800 text-ink dark:text-slate-200 hover:bg-pill/60 disabled:opacity-40 transition-colors"
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
                <Contrast className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> {t.a11yHighContrast || 'High Contrast'}
              </span>
              <button
                role="switch"
                aria-checked={settings.highContrast}
                onClick={toggleHighContrast}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  settings.highContrast ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Toggle high contrast mode"
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings.highContrast ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Text Spacing */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
                <Space className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> {t.a11yEnhancedSpacing || 'Enhanced Spacing'}
              </span>
              <button
                role="switch"
                aria-checked={settings.textSpacing}
                onClick={toggleTextSpacing}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  settings.textSpacing ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Toggle text spacing (WCAG 1.4.12)"
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings.textSpacing ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Underline Links */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> {t.a11yUnderlineLinks || 'Underline Links'}
              </span>
              <button
                role="switch"
                aria-checked={settings.underlineLinks}
                onClick={toggleUnderlineLinks}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  settings.underlineLinks ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Toggle underlined links"
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings.underlineLinks ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> {t.a11yReduceMotion || 'Reduce Motion'}
              </span>
              <button
                role="switch"
                aria-checked={settings.reduceMotion}
                onClick={toggleReduceMotion}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  settings.reduceMotion ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Toggle reduce motion"
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings.reduceMotion ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-line dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-ink-muted dark:text-slate-400">
              {t.a11yWcag || 'WCAG 2.2 AA compliant'}
            </span>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted hover:text-primary dark:hover:text-sky-400 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> {t.a11yResetAll || 'Reset all'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
