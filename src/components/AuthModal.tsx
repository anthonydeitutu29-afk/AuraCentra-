import React from 'react';
import { UserProfile } from '../types';
import { AuthPage } from './AuthPage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
  customTitle?: string;
  customSubtitle?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin',
  customTitle,
  customSubtitle,
  theme = 'dark',
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col animate-in fade-in duration-200">
      <AuthPage
        initialMode={initialMode}
        customTitle={customTitle}
        customSubtitle={customSubtitle}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onBackToPortal={onClose}
        onLoginSuccess={(user) => {
          onLoginSuccess(user);
          onClose();
        }}
      />
    </div>
  );
};
