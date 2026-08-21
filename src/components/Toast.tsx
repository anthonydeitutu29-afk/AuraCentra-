import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  let bgColor = 'bg-slate-900 text-white border-slate-700';
  let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

  if (toast.type === 'success') {
    bgColor = 'bg-emerald-950/95 text-emerald-100 border-emerald-800/80 shadow-emerald-950/40';
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
  } else if (toast.type === 'error') {
    bgColor = 'bg-rose-950/95 text-rose-100 border-rose-800/80 shadow-rose-950/40';
    icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
  } else if (toast.type === 'warning') {
    bgColor = 'bg-amber-950/95 text-amber-100 border-amber-800/80 shadow-amber-950/40';
    icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
  } else {
    bgColor = 'bg-blue-950/95 text-blue-100 border-blue-800/80 shadow-blue-950/40';
    icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;
  }

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${bgColor}`}
    >
      {icon}
      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>
        {toast.message && (
          <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export const ToastContainer = Toast;
