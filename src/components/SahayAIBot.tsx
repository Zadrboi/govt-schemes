'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { 
  Sparkles, X, Send, Bot, User, Volume2, VolumeX, 
  ExternalLink, ThumbsUp, ThumbsDown, Loader2, MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: { title: string; section?: string; url?: string }[];
  suggestedAction?: { label: string; url: string };
  evidence?: boolean;
}

export default function SahayAIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prompts: Record<SupportedLanguage, string> = {
      en: t.sahayWelcome || 'Hello! I am Sahay AI (সহায়). Ask me about Assam development schemes, Sipajhar water project status, statutory audits, or how to file an RTPS grievance.',
      as: t.sahayWelcome || 'নমস্কাৰ! মই সহায় এআই (Sahay AI)। অসমৰ উন্নয়নমূলক আঁচনি, চিপাঝাৰ খোৱাপানী প্ৰকল্প বা অভিযোগ দাখিল সম্পৰ্কে সোধক।',
      hi: t.sahayWelcome || 'नमस्ते! मैं सहाय AI (Sahay AI) हूँ। असम विकास योजनाओं, सिपाझार पेयजल परियोजना स्थिति या आरटीपीएस शिकायत के बारे में पूछें।',
      bn: t.sahayWelcome || 'নমস্কার! আমি সহায় এআই (Sahay AI)। অসমের বিভিন্ন উন্নয়ন প্রকল্প ও সিপাহীঝাড় পানীয় জল প্রকল্প সম্পর্কে অনুসন্ধান করুন।',
    };

    setMessages((prev) => {
      if (prev.length === 0 || (prev.length === 1 && prev[0].id === 'welcome')) {
        return [
          {
            id: 'welcome',
            sender: 'assistant',
            text: prompts[lang],
          },
        ];
      }
      return prev;
    });
  }, [lang, t.sahayWelcome]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.concat(userMsg).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          prompt: userMsg.text,
          language: lang,
          lang: lang,
          messages: historyPayload,
          pageContext: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      });

      const data = await res.json();

      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.response || data.answer || data.data?.answer || 'Response received.',
          citations: data.citations || data.data?.citations || [],
          suggestedAction: data.suggestedAction || data.data?.suggestedAction,
          evidence: data.hasSufficientEvidence ?? data.data?.hasSufficientEvidence,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(assistantMsg.text);
          utterance.lang = lang === 'as' || lang === 'bn' ? 'bn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
          window.speechSynthesis.speak(utterance);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: data.error || 'Statutory inquiry returned no matching record. Please contact Helpline 1905.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Network connectivity reduced. Local statutory rules: Grievance under RTPS Act requires resolution within 15 days.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFeedback = async (messageId: string, rating: 'HELPFUL' | 'INCORRECT') => {
    try {
      await fetch('/api/assistant/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryLang: lang,
          userPrompt: 'Feedback',
          assistantResponse: 'User marked response',
          rating,
        }),
      });
      alert(rating === 'HELPFUL' ? 'Thank you for your feedback!' : 'Feedback noted for statutory audit review.');
    } catch {
      // Ignore network fail
    }
  };

  return (
    <aside aria-label="Sahay AI Assistant" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]">
      {/* Pure Circular Launcher Orb */}
      {!isOpen && (
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(true)}
          aria-label="Open Sahay AI Assistant"
          aria-expanded={isOpen}
          className="group relative flex items-center justify-center w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full aspect-square bg-[#1d4ed8] dark:bg-[#60a5fa] text-white dark:text-slate-950 shadow-[0_10px_35px_rgba(29,78,216,0.38)] hover:shadow-[0_14px_45px_rgba(29,78,216,0.48)] transition-all duration-300 hover:scale-105 active:scale-95 ring-4 ring-white/30 dark:ring-slate-900/40"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          <span className="sr-only">Open Sahay AI Assistant</span>
          {/* Subtle status dot */}
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full" />
        </button>
      )}

      {/* Slide-Up Chat Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Sahay AI Assistant Window"
          aria-modal="true"
          className="fixed inset-x-3 bottom-16 sm:bottom-auto sm:right-auto sm:inset-auto sm:static w-auto sm:w-[420px] h-[72dvh] sm:h-[580px] max-h-[560px] sm:max-h-[85vh] bg-white dark:bg-slate-900 rounded-[22px] sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#e4ecf5] dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#1d4ed8] to-[#0284c7] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight leading-none">Sahay AI (সহায়)</h3>
                <p className="text-[10px] text-blue-100 mt-1 opacity-90">{t.sahayCopilotSubtitle || 'Statutory Public Scheme Copilot'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Voice Readout Toggle */}
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-1.5 rounded-full transition-colors ${
                  voiceEnabled ? 'bg-white/30 text-white' : 'hover:bg-white/20 text-blue-100'
                }`}
                title={voiceEnabled ? 'Disable Voice Readout' : 'Enable Voice Readout'}
                aria-label={voiceEnabled ? 'Disable Voice Readout' : 'Enable Voice Readout'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className="p-1.5 hover:bg-white/20 text-white rounded-full transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc] dark:bg-slate-950/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1d4ed8] dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200 dark:border-blue-800">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-[#1d4ed8] text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-900 text-[#0f172a] dark:text-slate-100 border border-[#e4ecf5] dark:border-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Citations / Evidence Badges */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                        Statutory Citations
                      </span>
                      {m.citations.map((c, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#0284c7] dark:text-sky-400">
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.title} {c.section ? `(${c.section})` : ''}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Quick Action */}
                  {m.suggestedAction && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <a
                        href={m.suggestedAction.url}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1d4ed8] dark:text-blue-400 hover:underline"
                      >
                        <span>{m.suggestedAction.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Feedback Thumb controls for Assistant replies */}
                  {m.sender === 'assistant' && m.id !== 'welcome' && (
                    <div className="mt-2.5 flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-slate-400">
                      <span className="text-[10px]">Helpful?</span>
                      <button
                        onClick={() => sendFeedback(m.id, 'HELPFUL')}
                        className="p-1 hover:text-[#1d4ed8] transition-colors"
                        title="Helpful response"
                        aria-label="Helpful"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => sendFeedback(m.id, 'INCORRECT')}
                        className="p-1 hover:text-red-500 transition-colors"
                        title="Inaccurate response"
                        aria-label="Inaccurate"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 pl-1">
                <Loader2 className="w-4 h-4 animate-spin text-[#1d4ed8]" />
                <span className="text-xs">Verifying statutory ledger data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-[#e4ecf5] dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar text-[11px]">
            <button
              onClick={() => {
                setInput('Show Sipajhar water project audit status');
              }}
              className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[#1d4ed8] dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-slate-700 shrink-0 transition-colors"
            >
              Sipajhar Water Status
            </button>
            <button
              onClick={() => {
                setInput('How do I submit an offline geotagged audit proof?');
              }}
              className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[#1d4ed8] dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-slate-700 shrink-0 transition-colors"
            >
              Offline Verification
            </button>
            <button
              onClick={() => {
                setInput('Check eligibility for Rural Housing Scheme');
              }}
              className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[#1d4ed8] dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-slate-700 shrink-0 transition-colors"
            >
              Housing Eligibility
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-slate-900 border-t border-[#e4ecf5] dark:border-slate-800 flex items-center gap-2"
          >
            <label htmlFor="sahay-input" className="sr-only">Ask Sahay AI</label>
            <input
              id="sahay-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.sahayInputPlaceholder || 'Ask in English, অসমীয়া, हिन्दी, or বাংলা...'}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-base sm:text-xs rounded-full bg-[#f4f7fb] dark:bg-slate-800 text-[#0f172a] dark:text-white border border-[#e4ecf5] dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-[#1d4ed8] hover:bg-blue-700 disabled:opacity-40 text-white rounded-full transition-transform active:scale-95 shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
