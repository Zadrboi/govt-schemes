'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DrishtiEmblem from '@/components/DrishtiEmblem';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Lock, Mail, ShieldCheck, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const submitEmail = customEmail || email;
    const submitPass = customPass || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: submitEmail, password: submitPass }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('Connection interrupted. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    handleLogin(undefined, demoEmail, 'demo123');
  };

  return (
    <div className="w-full min-h-screen bg-surface dark:bg-slate-950/50 pt-28 pb-20 px-4 flex items-center justify-center transition-colors">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-[28px] border border-line dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Visual Column */}
        <div className="relative hidden md:flex flex-col justify-between p-8 text-white overflow-hidden bg-slate-950">
          <Image
            src="/images/auth-bg.jpg"
            alt="Assam Infrastructure and Valley"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <div className="relative z-10">
            <DrishtiEmblem size={32} />
          </div>

          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800">
              Statutory Open Ledger
            </span>
            <h2 className="editorial-headline text-2xl font-normal leading-tight text-white">
              Radical transparency for every public rupee.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verify treasury disbursements with geotagged satellite imagery and citizen audit trail.
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="flex md:hidden justify-center pb-2">
              <DrishtiEmblem size={32} />
            </div>
            <h1 className="editorial-headline text-2xl font-semibold text-ink dark:text-slate-100">
              {t.loginHeader || 'Sign In to Drishti Ledger'}
            </h1>
            <p className="text-xs text-ink-muted dark:text-slate-400">
              Authenticated role-based access for citizens, field officers, and statutory auditors.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 font-medium">
              {error}
            </div>
          )}

          {/* 1-Click Sandbox Persona Quick Logins */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary dark:text-sky-400 block font-mono">
              ⚡ Evaluator 1-Click Role Access (Real Session Cookie)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => loginAsDemo('dc@demo.yojna')}
                disabled={loading}
                className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-ink dark:text-blue-100 font-semibold text-center transition-all shadow-xs flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-xs text-primary dark:text-sky-400">DC Commissioner</span>
                <span className="text-[10px] font-normal text-ink-muted dark:text-slate-400">Executive &amp; Audit Queue</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('officer@demo.yojna')}
                disabled={loading}
                className="p-3 rounded-2xl bg-surface dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-line dark:border-slate-700 text-ink dark:text-slate-100 font-semibold text-center transition-all shadow-xs flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-xs text-secondary dark:text-sky-400">Field Inspector</span>
                <span className="text-[10px] font-normal text-ink-muted dark:text-slate-400">Milestones &amp; Inspections</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('citizen@demo.yojna')}
                disabled={loading}
                className="p-3 rounded-2xl bg-surface dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-line dark:border-slate-700 text-ink dark:text-slate-100 font-semibold text-center transition-all shadow-xs flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-xs text-emerald-700 dark:text-emerald-400">Citizen (Public)</span>
                <span className="text-[10px] font-normal text-ink-muted dark:text-slate-400">Gram Sabha Oversight</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-line dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-ink-muted dark:text-slate-400 uppercase">Or Manual Credentials</span>
            <div className="flex-grow border-t border-line dark:border-slate-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink dark:text-slate-100">Official Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-muted dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@demo.yojna"
                  required
                  className="w-full text-base sm:text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-surface dark:bg-slate-800 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink dark:text-slate-100">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full text-base sm:text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-surface dark:bg-slate-800 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{t.loginSubmitBtn || 'Sign In Securely'}</span>
            </button>
          </form>

          <div className="text-center text-[11px] text-ink-muted dark:text-slate-400">
            Protected by OWASP ASVS Security Controls &amp; bcrypt cost 12.
          </div>
        </div>
      </div>
    </div>
  );
}
