import React, { useEffect, useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  ExternalLink, 
  QrCode, 
  ShieldCheck
} from 'lucide-react';
import QRCode from 'qrcode';
import { Business } from '../types';

interface QRCodeShareModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info') => void;
}

export const QRCodeShareModal: React.FC<QRCodeShareModalProps> = ({
  business,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (business && isOpen) {
      const shareUrl = `${window.location.origin}/?business=${business.id}`;
      QRCode.toDataURL(shareUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => {
          setQrDataUrl(url);
        })
        .catch((err) => {
          console.error('Failed to generate QR code', err);
        });
    }
  }, [business, isOpen]);

  if (!isOpen || !business) return null;

  const shareUrl = `${window.location.origin}/?business=${business.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onShowToast('Link Copied!', 'Listing URL copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Check out *${business.name}* on AuraCentra Ghana Verified Business Directory:\n${shareUrl}\n\n📍 ${business.city}, ${business.region}\n⭐ Rating: ${business.rating.toFixed(1)}/5.0 (${business.reviewCount} reviews)`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Discover ${business.name} on AuraCentra Ghana Verified Directory`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleDownloadQRBadge = () => {
    if (!qrDataUrl) return;

    // Draw customized AuraCentra printable QR card
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 600, 760);

    // Decorative gradient card
    const grad = ctx.createLinearGradient(0, 0, 600, 760);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.roundRect(24, 24, 552, 712, 24);
    ctx.fill();

    // Top Header: AuraCentra
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AURACENTRA GHANA', 300, 70);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Verified Business Directory & Growth Hub', 300, 95);

    // Business Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(business.name.length > 25 ? business.name.slice(0, 25) + '...' : business.name, 300, 145);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '15px sans-serif';
    ctx.fillText(`${business.category} • ${business.city}, Ghana`, 300, 175);

    // White QR container
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(140, 210, 320, 320, 16);
    ctx.fill();

    // Draw QR Code Image
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 150, 220, 300, 300);

      // Verified Badge footer
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✓ VERIFIED GHANA BUSINESS', 300, 580);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText('Scan to view full profile, contact & reviews', 300, 615);
      ctx.fillText(`Tony's Digital Marketing Hub | 0508203673`, 300, 680);

      // Convert to download link
      const link = document.createElement('a');
      link.download = `${business.slug}-auracentra-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      onShowToast('Badge Downloaded!', 'QR Standee downloaded successfully', 'success');
    };
    qrImg.src = qrDataUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto"
        id={`qr-modal-${business.id}`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Share & QR Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instant digital access for customers
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-center">
          {/* QR Code Container */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 dark:border-slate-700 shadow-md inline-block mx-auto">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`${business.name} QR Code`}
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
              />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-50 text-slate-400">
                <span>Generating QR...</span>
              </div>
            )}
            <div className="mt-2 text-center">
              <span className="text-xs font-bold text-slate-900">
                {business.name}
              </span>
              <p className="text-[11px] text-slate-500">
                {business.city}, Ghana
              </p>
            </div>
          </div>

          {/* Copy Link Bar */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-300 font-mono px-2 outline-none truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Share directly via:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareFacebook}
                className="py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={handleShareTwitter}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>X / Twitter</span>
              </button>
            </div>
          </div>

          {/* Download Standee / Print QR Badge Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDownloadQRBadge}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable Store Standee QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
