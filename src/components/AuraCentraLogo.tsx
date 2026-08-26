import React from 'react';

interface AuraCentraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  variant?: 'full' | 'icon' | 'stacked' | 'horizontal' | 'badge';
  className?: string;
  showTagline?: boolean;
  showSubtitle?: boolean;
  inverted?: boolean;
}

/**
 * Exact Vector recreation of the AuraCentra Store-Pin Logo (Image 2):
 * - Outer thin circular halo orbit arch
 * - Smooth royal blue teardrop map pin with white circular core
 * - Store / shopfront with 4-scallop awning, window and door inside pin
 * - 3 Concentric ground perspective radar waves / ripples at the pin's base
 * - High-contrast "AuraCentra" brand typography
 */
export const AuraCentraLogoSVG: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="60 40 380 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Vibrant Royal Blue gradient for Pin */}
        <linearGradient id="aura-pin-left" x1="160" y1="100" x2="250" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E6AFF" />
          <stop offset="50%" stopColor="#155DFC" />
          <stop offset="100%" stopColor="#0B48DF" />
        </linearGradient>

        <linearGradient id="aura-pin-right" x1="250" y1="100" x2="340" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#155DFC" />
          <stop offset="60%" stopColor="#0D44D4" />
          <stop offset="100%" stopColor="#083096" />
        </linearGradient>

        {/* Halo Arch Gradient */}
        <linearGradient id="aura-orbit-grad" x1="80" y1="60" x2="420" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#155DFC" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Ground Ripples Gradient */}
        <linearGradient id="aura-ripple-grad" x1="160" y1="360" x2="340" y2="410" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D44D4" />
          <stop offset="50%" stopColor="#155DFC" />
          <stop offset="100%" stopColor="#092F96" />
        </linearGradient>
      </defs>

      {/* 1. Outer Halo / Orbit Arch Line */}
      <path
        d="M 100 230 A 155 155 0 1 1 400 230"
        stroke="url(#aura-orbit-grad)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 2. Concentric Ground Perspective Ripples / Radar Waves */}
      {/* Outer Ripple */}
      <ellipse
        cx="250"
        cy="378"
        rx="92"
        ry="24"
        stroke="url(#aura-ripple-grad)"
        strokeWidth="8"
        fill="none"
      />
      {/* Middle Ripple */}
      <ellipse
        cx="250"
        cy="378"
        rx="62"
        ry="16"
        stroke="url(#aura-ripple-grad)"
        strokeWidth="7"
        fill="none"
      />
      {/* Inner Core Ripple */}
      <ellipse
        cx="250"
        cy="378"
        rx="32"
        ry="9"
        stroke="url(#aura-ripple-grad)"
        strokeWidth="6"
        fill="#0D44D4"
      />

      {/* 3. Location Pin Teardrop Body */}
      <path
        d="M 250 90 
           C 185 90, 142 138, 142 202 
           C 142 260, 205 320, 250 366 
           C 295 320, 358 260, 358 202 
           C 358 138, 315 90, 250 90 Z"
        fill="url(#aura-pin-left)"
      />

      {/* Right Half Facet for Subtle 3D Volume */}
      <path
        d="M 250 90 
           C 315 90, 358 138, 358 202 
           C 358 260, 295 320, 250 366 
           L 250 90 Z"
        fill="url(#aura-pin-right)"
      />

      {/* Inner White Cutout Disc */}
      <circle
        cx="250"
        cy="196"
        r="64"
        fill="#FFFFFF"
      />

      {/* 4. Storefront / Shop Icon Inside Pin */}
      {/* Awning Top Bar */}
      <rect
        x="210"
        y="166"
        width="80"
        height="7"
        rx="3.5"
        fill="#155DFC"
      />

      {/* Scalloped Awning */}
      <path
        d="M 208 174 
           L 292 174 
           L 288 190 
           C 285 195, 276 195, 273 190 
           C 270 195, 261 195, 258 190 
           C 255 195, 246 195, 243 190 
           C 240 195, 231 195, 228 190 
           C 225 195, 216 195, 212 190 
           Z"
        fill="#155DFC"
      />

      {/* Store Front Wall Base */}
      <rect
        x="214"
        y="190"
        width="72"
        height="38"
        rx="2"
        fill="#155DFC"
      />

      {/* Store Window (Left Cutout) */}
      <rect
        x="221"
        y="197"
        width="23"
        height="22"
        rx="2"
        fill="#FFFFFF"
      />

      {/* Store Door (Right Cutout) */}
      <rect
        x="253"
        y="197"
        width="24"
        height="31"
        rx="2"
        fill="#FFFFFF"
      />
    </svg>
  );
};

export const AuraCentraFullBrandLogoSVG: React.FC<{
  className?: string;
  size?: number;
  textColorMode?: 'auto' | 'light' | 'dark';
}> = ({ className = '', size = 180, textColorMode = 'auto' }) => {
  const auraColor = textColorMode === 'light' ? '#60a5fa' : '#155DFC';
  const centraColor = textColorMode === 'light' ? '#FFFFFF' : '#0A1C44';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <AuraCentraLogoSVG size={size} />
      <div className="flex items-center text-center font-black tracking-tight leading-none mt-1">
        <span style={{ color: auraColor }} className="text-2xl sm:text-3xl font-black">Aura</span>
        <span style={{ color: centraColor }} className="text-2xl sm:text-3xl font-black">Centra</span>
      </div>
    </div>
  );
};

export const AuraCentraFullBadge: React.FC<{
  className?: string;
  showSubtitle?: boolean;
}> = ({ className = '', showSubtitle = true }) => {
  return (
    <div className={`flex flex-col items-center text-center p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-blue-100 dark:border-blue-900/60 shadow-xl max-w-md mx-auto ${className}`}>
      {/* 1. Official Store Pin Logo */}
      <div className="w-28 h-28 mb-2 flex items-center justify-center filter drop-shadow-md">
        <AuraCentraLogoSVG size={110} />
      </div>

      {/* 2. Official AuraCentra Brand Name */}
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center justify-center leading-none mb-2">
        <span className="text-[#155DFC] dark:text-[#38BDF8]">Aura</span>
        <span className="text-[#0A1C44] dark:text-white">Centra</span>
      </h1>

      {/* 3. Official Tagline */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-xs my-2 text-[10px] sm:text-xs font-black tracking-[0.26em] text-[#0A1C44] dark:text-cyan-300">
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#155DFC]/50 to-[#155DFC]" />
        <div className="flex items-center gap-1.5 shrink-0 uppercase">
          <span>CONNECT</span>
          <span className="text-[#155DFC]">•</span>
          <span>DISCOVER</span>
          <span className="text-[#155DFC]">•</span>
          <span>GROW</span>
        </div>
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#155DFC]/50 to-[#155DFC]" />
      </div>

      {/* 4. Subtitle Value Proposition */}
      {showSubtitle && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 w-full px-2">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Ghana's verified business discovery network connecting trusted enterprises with customers,{' '}
            <strong className="text-[#155DFC] dark:text-[#38BDF8] font-black">across all 16 regions.</strong>
          </p>
        </div>
      )}

      {/* 5. Bottom Dynamic Accent Wave */}
      <div className="w-full h-2 mt-4 rounded-full bg-gradient-to-r from-[#155DFC] via-[#2575FC] to-[#0A1C44]" />
    </div>
  );
};
