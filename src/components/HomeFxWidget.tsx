import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';

interface HomeFxWidgetProps {
  onOpenNewsTab: () => void;
}

export const HomeFxWidget: React.FC<HomeFxWidgetProps> = ({ onOpenNewsTab }) => {
  const [fxAmount, setFxAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState<'USD' | 'GBP' | 'EUR'>('USD');

  const rates = {
    USD: 11.03,
    GBP: 15.05,
    EUR: 12.88,
  };

  const calculatedValue = ((rates[fromCurr] || 11.03) * fxAmount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-white dark:bg-slate-800/95 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm max-w-2xl mx-auto w-full transition-colors text-left">
      
      {/* 1. LIVE BoG FX & BUSINESS NEWS pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
        <svg 
          className="w-3.5 h-3.5 text-white shrink-0" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
        </svg>
        <span>LIVE BoG FX & BUSINESS NEWS</span>
      </div>

      {/* 2. Heading */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-3 leading-snug">
        Ghana Business News & Live FX Exchange
      </h2>

      {/* 3. Subtitle / Sync status */}
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
        Synced: 11:49 AM • Bank of Ghana Interbank Feed
      </p>

      {/* 4. Three Live Currency Tickers with subtle borders */}
      <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-700/60">
        
        {/* USD / GHS */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
            <span className="text-base select-none">🇺🇸</span>
            <span>USD / GHS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
              11.03
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
              -0.1%
            </span>
          </div>
        </div>

        {/* GBP / GHS */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
            <span className="text-base select-none">🇬🇧</span>
            <span>GBP / GHS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
              15.05
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
              +0.1%
            </span>
          </div>
        </div>

        {/* EUR / GHS */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
            <span className="text-base select-none">🇪🇺</span>
            <span>EUR / GHS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
              12.88
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
              -0.0%
            </span>
          </div>
        </div>

      </div>

      {/* 5. Quick FX Converter */}
      <div className="mt-5 pt-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-3">
          <span>Quick FX Converter</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">Live BoG Rate</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <input
            type="number"
            min="1"
            value={fxAmount}
            onChange={(e) => setFxAmount(Math.max(1, Number(e.target.value)))}
            className="w-24 sm:w-28 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm text-center focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />

          <div className="relative">
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value as 'USD' | 'GBP' | 'EUR')}
              className="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-slate-400 font-bold text-sm sm:text-base select-none">=</span>

          <div className="font-bold text-emerald-600 dark:text-emerald-400 text-base sm:text-lg tracking-tight">
            GH₵ {calculatedValue}
          </div>
        </div>
      </div>

      {/* 6. Ready badge */}
      <div className="flex items-center gap-2 pt-5 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold">
        <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2] shrink-0" />
        <span>9 verified business articles ready</span>
      </div>

      {/* 7. Action Button: Open News & FX Hub → */}
      <div className="pt-4">
        <button
          onClick={onOpenNewsTab}
          className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all cursor-pointer"
        >
          <span>Open News & FX Hub</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
};
