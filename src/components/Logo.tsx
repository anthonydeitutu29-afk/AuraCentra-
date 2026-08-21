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
    md: 44,
    lg: 58,
    xl: 74,
    '2xl': 98,
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

  if (variant === 'icon') {
    return (
      <div 
        className={`inline-flex items-center justify-center relative p-1 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100/90 dark:border-blue-900/60 shadow-sm transition-transform hover:scale-105 ${className}`}
        id="auracentra-icon-logo"
      >
        <AuraCentraLogoSVG size={pixelSizes[size]} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`} id="auracentra-brand-stacked">
        {/* Monogram */}
        <div className="relative p-2 rounded-3xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/70 shadow-md mb-2 flex items-center justify-center">
          <AuraCentraLogoSVG size={pixelSizes[size] * 1.3} />
        </div>

        {/* Title */}
        <div className="flex items-center leading-none">
          <span className={`${titleSizes[size]} text-[#0A1C44] dark:text-white`}>Aura</span>
          <span className={`${titleSizes[size]} text-[#0088FF] dark:text-[#38BDF8]`}>Centra</span>
        </div>

        {/* Tagline */}
        {(showTagline || showSubtitle) && (
          <div className="flex items-center justify-center gap-2 w-full mt-1.5">
            {showRuleLines && <div className="h-[1px] flex-1 max-w-[28px] bg-gradient-to-r from-transparent to-[#0088FF]" />}
            <div className={`flex items-center gap-1.5 font-black ${taglineSizes[size]} text-[#0A1C44] dark:text-cyan-300 uppercase`}>
              <span>CONNECT</span>
              <span className="text-[#0088FF]">•</span>
              <span>DISCOVER</span>
              <span className="text-[#0088FF]">•</span>
              <span>GROW</span>
            </div>
            {showRuleLines && <div className="h-[1px] flex-1 max-w-[28px] bg-gradient-to-l from-transparent to-[#0088FF]" />}
          </div>
        )}

        {/* Subtitle Value Proposition */}
        {showSubtitle && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 max-w-sm">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              A digital platform where businesses enlist and customers get access to what they need,{' '}
              <strong className="text-[#0088FF] dark:text-[#38BDF8] font-black">without stress.</strong>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default: Horizontal / Full Variant
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`} id="auracentra-brand-logo">
      {/* Official AuraCentra AC Monogram */}
      <div className="relative shrink-0 p-1 sm:p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100/90 dark:border-blue-900/60 shadow-sm shadow-blue-600/10 flex items-center justify-center transition-transform hover:scale-105">
        <AuraCentraLogoSVG size={pixelSizes[size]} />
      </div>

      {/* Brand Text Content */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span className={`${titleSizes[size]} text-[#0A1C44] dark:text-white`}>Aura</span>
          <span className={`${titleSizes[size]} text-[#0088FF] dark:text-[#38BDF8]`}>Centra</span>
        </div>

        {/* Subline Tagline */}
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
            {showRuleLines && <div className="hidden sm:block w-3 h-[1px] bg-gradient-to-r from-transparent to-[#0088FF]" />}
            <div className={`flex items-center gap-1 font-black ${taglineSizes[size]} text-[#0A1C44] dark:text-cyan-300 uppercase whitespace-nowrap`}>
              <span>CONNECT</span>
              <span className="text-[#0088FF]">•</span>
              <span>DISCOVER</span>
              <span className="text-[#0088FF]">•</span>
              <span>GROW</span>
            </div>
            {showRuleLines && <div className="hidden sm:block w-3 h-[1px] bg-gradient-to-l from-transparent to-[#0088FF]" />}
          </div>
        )}

        {showSubtitle && (
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm leading-snug">
            A digital platform where businesses enlist and customers get access to what they need,{' '}
            <strong className="text-[#0088FF] dark:text-[#38BDF8] font-black">without stress.</strong>
          </p>
        )}
      </div>
    </div>
  );
};
