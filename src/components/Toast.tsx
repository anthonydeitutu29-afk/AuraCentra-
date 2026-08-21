import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastNotification } from '../types';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  // Auto-dismiss each toast
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) => {
      return setTimeout(() => {
        onDismiss(t.id);
      }, t.duration || 4000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, onDismiss]);

  return (
    <div 
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-[9999] flex flex-col gap-2 max-w-sm sm:w-80 pointer-events-none"
      id="toast-notification-container"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          let bgColor = 'bg-blue-950/95 text-blue-100 border-blue-800/80 shadow-blue-950/40';
          let icon = <Info className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 shrink-0 mt-0.5" />;

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-950/95 text-emerald-100 border-emerald-800/80 shadow-emerald-950/40';
            icon = <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />;
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-950/95 text-rose-100 border-rose-800/80 shadow-rose-950/40';
            icon = <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-rose-400 shrink-0 mt-0.5" />;
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-950/95 text-amber-100 border-amber-800/80 shadow-amber-950/40';
            icon = <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400 shrink-0 mt-0.5" />;
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.92 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${bgColor}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold leading-tight truncate">{toast.title}</h5>
                {toast.message && (
                  <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed line-clamp-3">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export const ToastContainer = Toast;

