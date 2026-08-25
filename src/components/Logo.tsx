import React from 'react';
import { AuraCentraLogoSVG } from './AuraCentraLogo';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon' | 'stacked' | 'horizontal' | 'badge';
  className?: string;
  showTagline?: boolean;
  showSubtitle?: boolean;
  lightBackground?: boolean;
  showRuleLines?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  showTagline = true,
  showSubtitle = false,
  showRuleLines = true,
}) => {
  const pixelSizes = {
    xs: 26,
    sm: 34,
    md: 42,
    lg: 56,
    xl: 72,
    '2xl': 96,
  };

  const titleSizes = {
    xs: 'text-sm font-black',
    sm: 'text-base font-black tracking-tight',
    md: 'text-lg sm:text-xl font-black tracking-tight',
    lg: 'text-2xl sm:text-3xl font-black tracking-tight',
    xl: 'text-3xl sm:text-4xl font-black tracking-tight',
    '2xl': 'text-4xl sm:text-5xl font-black tracking-tight',
  };

  const taglineSizes = {
    xs: 'text-[7px]',
    sm: 'text-[8px] tracking-[0.2em]',
    md: 'text-[9px] sm:text-[10px] tracking-[0.24em]',
    lg: 'text-[11px] sm:text-xs tracking-[0.26em]',
    xl: 'text-xs sm:text-sm tracking-[0.28em]',
    '2xl': 'text-sm sm:text-base tracking-[0.3em]',
  };

  const boxSizes = {
    xs: 'w-7 h-7 rounded-lg p-0.5',
    sm: 'w-9 h-9 rounded-xl p-1',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-1',
    lg: 'w-14 h-14 rounded-2xl p-1.5',
    xl: 'w-18 h-18 rounded-2xl p-2',
    '2xl': 'w-24 h-24 rounded-3xl p-2.5',
  };

  if (variant === 'icon') {
    return (
      <div 
        className={`inline-flex items-center justify-center relative ${boxSizes[size]} bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/60 shadow-xs transition-transform hover:scale-105 ${className}`}
        id="auracentra-icon-logo"
      >
        <AuraCentraLogoSVG size={pixelSizes[size]} className="w-full h-full object-contain" />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`} id="auracentra-brand-stacked">
        {/* Logo Pin */}
        <div className="relative p-2 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/70 shadow-md mb-2 flex items-center justify-center">
          <AuraCentraLogoSVG size={pixelSizes[size] * 1.2} />
        </div>

        {/* Title */}
        <div className="flex items-center leading-none">
          <span className={`${titleSizes[size]} text-[#155DFC] dark:text-[#38BDF8]`}>Aura</span>
          <span className={`${titleSizes[size]} text-[#0A1C44] dark:text-white`}>Centra</span>
        </div>

        {/* Tagline */}
        {(showTagline || showSubtitle) && (
          <div className="flex items-center justify-center gap-2 w-full mt-1.5">
            {showRuleLines && <div className="h-[1px] flex-1 max-w-[28px] bg-gradient-to-r from-transparent to-[#155DFC]" />}
            <div className={`flex items-center gap-1.5 font-black ${taglineSizes[size]} text-[#0A1C44] dark:text-cyan-300 uppercase`}>
              <span>CONNECT</span>
              <span className="text-[#155DFC]">•</span>
              <span>DISCOVER</span>
              <span className="text-[#155DFC]">•</span>
              <span>GROW</span>
            </div>
            {showRuleLines && <div className="h-[1px] flex-1 max-w-[28px] bg-gradient-to-l from-transparent to-[#155DFC]" />}
          </div>
        )}

        {/* Subtitle Value Proposition */}
        {showSubtitle && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 max-w-sm">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Ghana's verified business discovery network connecting trusted enterprises with customers,{' '}
              <strong className="text-[#155DFC] dark:text-[#38BDF8] font-black">across all 16 regions.</strong>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default: Horizontal / Full Variant
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`} id="auracentra-brand-logo">
      {/* Official AuraCentra Pin Logo Box */}
      <div className={`relative shrink-0 ${boxSizes[size]} bg-white dark:bg-slate-900 border border-blue-100/90 dark:border-blue-900/60 shadow-xs flex items-center justify-center transition-transform hover:scale-105`}>
        <AuraCentraLogoSVG size={pixelSizes[size]} className="w-full h-full object-contain" />
      </div>

      {/* Brand Text Content */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none tracking-tight">
          <span className={`${titleSizes[size]} text-[#155DFC] dark:text-[#38BDF8]`}>Aura</span>
          <span className={`${titleSizes[size]} text-[#0A1C44] dark:text-white`}>Centra</span>
        </div>

        {/* Subline Tagline */}
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
            {showRuleLines && <div className="hidden sm:block w-3 h-[1px] bg-gradient-to-r from-transparent to-[#155DFC]" />}
            <div className={`flex items-center gap-1 font-black ${taglineSizes[size]} text-[#0A1C44] dark:text-cyan-300 uppercase whitespace-nowrap`}>
              <span>CONNECT</span>
              <span className="text-[#155DFC]">•</span>
              <span>DISCOVER</span>
              <span className="text-[#155DFC]">•</span>
              <span>GROW</span>
            </div>
            {showRuleLines && <div className="hidden sm:block w-3 h-[1px] bg-gradient-to-l from-transparent to-[#155DFC]" />}
          </div>
        )}

        {showSubtitle && (
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm leading-snug">
            A digital platform where businesses enlist and customers get access to what they need,{' '}
            <strong className="text-[#155DFC] dark:text-[#38BDF8] font-black">without stress.</strong>
          </p>
        )}
      </div>
    </div>
  );
};
