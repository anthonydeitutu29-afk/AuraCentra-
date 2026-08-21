import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Award, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2,
  Lock,
  Code
} from 'lucide-react';
import { Business } from '../types';

interface VerificationCertificateModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info') => void;
}

export const VerificationCertificateModal: React.FC<VerificationCertificateModalProps> = ({
  business,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !business) return null;

  const isVerified = business.verificationStatus === 'verified';
  const issueDate = business.verificationDetails?.verifiedAt || business.createdAt || '2025-01-01';
  const certId = `GHA-CERT-${business.id.toUpperCase().slice(0, 8)}-${new Date(issueDate).getFullYear()}`;

  const embedSnippet = `<a href="${window.location.origin}/?business=${business.id}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:#0f172a;color:#ffffff;border-radius:12px;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:bold;border:1px solid #3b82f6;">
  <span style="color:#10b981;">✓</span>
  <span>Verified Ghana Business • AuraCentra</span>
</a>`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedCode(true);
    onShowToast('Embed Code Copied!', 'Paste this HTML on your website or blog', 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 650;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 900, 650);

    // Outer double border
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 860, 610);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, 828, 578);

    // Title
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF VERIFICATION', 450, 110);

    ctx.fillStyle = '#475569';
    ctx.font = '16px sans-serif';
    ctx.fillText('AURACENTRA GHANA VERIFIED BUSINESS DIRECTORY', 450, 145);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('This is to officially certify that', 450, 200);

    // Business Name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(business.name, 450, 255);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText(`${business.category} • ${business.city}, Ghana`, 450, 290);

    ctx.fillStyle = '#475569';
    ctx.font = '15px sans-serif';
    ctx.fillText(
      'has fulfilled the rigorous standards for identity verification, legitimate location,',
      450,
      350
    );
    ctx.fillText(
      'and verified business registration in the Republic of Ghana.',
      450,
      375
    );

    // Certificate details bar
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(80, 420, 740, 90);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, 420, 740, 90);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Certificate ID: ${certId}`, 100, 450);
    ctx.fillText(`Registration Date: ${new Date(issueDate).toLocaleDateString()}`, 100, 480);

    ctx.fillText(`Verification Level: Gold Enterprise Verified`, 480, 450);
    ctx.fillText(`Partner Hub: Tony's Digital Marketing`, 480, 480);

    // Signatures / Seal
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ GOLD VERIFIED ★', 450, 570);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Authorized by AuraCentra & Tony\'s Business Hub Security Desk', 450, 595);

    // Trigger Download
    const link = document.createElement('a');
    link.download = `${business.slug}-certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    onShowToast('Certificate Downloaded!', 'Saved high resolution certificate image', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto"
        id={`certificate-modal-${business.id}`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Official Verification Certificate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AuraCentra Trust & Verification Registry
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Display Card */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-slate-800/90 dark:via-slate-900 dark:to-slate-800/90 border-2 border-amber-300 dark:border-amber-700/50 shadow-md text-center relative overflow-hidden space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Republic of Ghana Verified Listing</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {business.name}
              </h2>
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                {business.category} • {business.city}, Ghana
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              This entity has passed identity and physical presence verification in accordance with AuraCentra Business Directory and Tony's Digital Marketing Hub authentication guidelines.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 text-left bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Certificate ID</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {certId}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Verification Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Gold Verified</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Issue Date</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(issueDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Security Standard</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Ghana Card / National ID
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Certificate (PNG)</span>
            </button>
          </div>

          {/* Webmaster Embed Code */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Code className="w-4 h-4 text-blue-500" />
                <span>Embed Verified Badge On Your Website</span>
              </div>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
            <pre className="text-[11px] p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {embedSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
