import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'stacked' | 'horizontal';
  className?: string;
  showTagline?: boolean;
  showSubtitle?: boolean;
  lightBackground?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  showTagline = false,
  showSubtitle = false,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base font-extrabold',
    md: 'text-base sm:text-xl font-black tracking-tight',
    lg: 'text-xl sm:text-2xl font-black tracking-tight',
    xl: 'text-2xl sm:text-4xl font-black tracking-tight',
  };

  const taglineSizes = {
    sm: 'text-[7px] sm:text-[9px]',
    md: 'text-[7.5px] sm:text-[10px]',
    lg: 'text-[10px] sm:text-xs',
    xl: 'text-xs sm:text-sm',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} id="auracentra-brand-logo">
      {/* Official AuraCentra AC Monogram Emblem */}
      <div className={`relative ${iconDimensions[size]} shrink-0 rounded-2xl overflow-hidden shadow-md shadow-blue-600/20 bg-white border border-blue-100 dark:border-blue-900 flex items-center justify-center p-0.5 group transition-transform hover:scale-105`}>
        <img
          src="/auracentra-logo.png"
          alt="AuraCentra Logo"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback SVG icon if image fails
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
        
        {/* Vector Fallback */}
        <div className="hidden w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 rounded-xl items-center justify-center text-white font-black text-xl tracking-tighter">
          AC
        </div>
      </div>

      {variant !== 'icon' && (
        <div className={`flex flex-col ${variant === 'stacked' ? 'items-center text-center' : ''}`}>
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${titleSizes[size]} bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 dark:from-white dark:via-blue-200 dark:to-cyan-400 bg-clip-text text-transparent`}>
              AuraCentra
            </span>
          </div>

          {/* Subline Tagline */}
          <div className={`flex items-center gap-1.5 font-bold tracking-[0.2em] text-blue-600 dark:text-cyan-400 ${taglineSizes[size]} uppercase mt-0.5`}>
            <span>CONNECT</span>
            <span className="text-blue-400">•</span>
            <span>DISCOVER</span>
            <span className="text-blue-400">•</span>
            <span>GROW</span>
          </div>

          {showSubtitle && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm leading-snug">
              A digital platform where businesses enlist and customers get access to what they need, <strong className="text-blue-600 dark:text-cyan-400">without stress</strong>.
            </p>
          )}

          {showTagline && !showSubtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Find Businesses. Discover Opportunities. Grow Together.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

