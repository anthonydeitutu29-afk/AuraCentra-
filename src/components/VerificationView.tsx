import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  Award, 
  ArrowRight, 
  BadgeCheck, 
  Fingerprint, 
  MapPin, 
  Building2, 
  Search,
  Lock,
  PhoneCall
} from 'lucide-react';

interface VerificationViewProps {
  onEnlist: () => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({ onEnlist }) => {
  const [testId, setTestId] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSimulateCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId.trim()) return;

    if (testId.toUpperCase().startsWith('GHA-')) {
      setTestResult('valid');
    } else {
      setTestResult('format_warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 transition-colors">
      
      {/* Top Banner */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200/60 dark:border-blue-800 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>The AuraCentra Trust Standard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Enterprise Verification in Ghana
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          In an era of online impersonation and fraudulent social media listings, the AuraCentra Verified Checkmark proves your business is authenticated, registered, and physically operating in Ghana.
        </p>
      </div>

      {/* 3 Pillars of Ghanaian Trust */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800/90 p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
              <Fingerprint className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Pillar 1</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">National Identity Vetting</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every verified listing is anchored to an accountable Ghanaian citizen or resident via their official <strong>Ghana Card PIN (NIA)</strong>, eliminating anonymous bad actors.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>NIA Standards Compliant</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Pillar 2</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Physical GPS Validation</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We validate physical storefronts, operational offices, and warehouses using the official <strong>GhanaPost GPS digital address</strong> infrastructure across all 16 regions.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Geo-Located In Ghana</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Pillar 3</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">GRA & RGD Commercial Tax</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Corporate entities furnish their active <strong>GRA Tax Identification Number (TIN)</strong> and Registrar General registration number to prove legal standing.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Authenticated Credentials</span>
          </div>
        </div>
      </div>

      {/* Verification Lookup Simulator */}
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-blue-50/80 dark:bg-slate-800/90 border border-blue-100 dark:border-slate-700 text-center space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Check Business Credential Status
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Test our verification system with a Ghana Card PIN or GhanaPost GPS address.
        </p>

        <form onSubmit={handleSimulateCheck} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={testId}
            onChange={(e) => {
              setTestId(e.target.value);
              setTestResult(null);
            }}
            placeholder="e.g. GHA-724194012-8"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Verify ID
          </button>
        </form>

        {testResult === 'valid' && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
            ✓ Valid Ghanaian Identity Credentials format confirmed.
          </div>
        )}

        {testResult === 'format_warning' && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold animate-in fade-in">
            Format notice: Standard Ghana Card PIN format begins with "GHA-" (e.g., GHA-000000000-0).
          </div>
        )}
      </div>

      {/* Call to action */}
      <div className="text-center pt-2">
        <button
          onClick={onEnlist}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>Enlist & Apply For Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
