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
 * Exact Vector recreation of the AuraCentra Store-Pin Logo (Image 1):
 * - Outer circular aura ring / orbit
 * - 3D sculpted vibrant blue map pin
 * - Store / shopfront icon with awning, door and window inside pin
 * - Concentric ground ripples / radar waves at the pin's base
 * - Clean "AuraCentra" brand typography
 */
export const AuraCentraLogoSVG: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="85 55 330 365"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Vibrant Royal Blue gradient for Pin */}
        <linearGradient id="aura-pin-left" x1="160" y1="100" x2="250" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2575FC" />
          <stop offset="50%" stopColor="#155DFC" />
          <stop offset="100%" stopColor="#0B48DF" />
        </linearGradient>

        <linearGradient id="aura-pin-right" x1="250" y1="100" x2="340" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#155DFC" />
          <stop offset="60%" stopColor="#0D44D4" />
          <stop offset="100%" stopColor="#072F99" />
        </linearGradient>

        {/* Orbit Ring Gradient */}
        <linearGradient id="aura-orbit-grad" x1="80" y1="60" x2="420" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Ground Ripples Gradient */}
        <linearGradient id="aura-ripple-grad" x1="160" y1="360" x2="340" y2="410" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A2A7A" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0052CC" />
        </linearGradient>

        {/* Soft Drop Shadow Filter */}
        <filter id="aura-pin-shadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0D44D4" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#aura-pin-shadow)">
        {/* 1. Outer Orbit / Halo Arch Ring */}
        <path
          d="M 125 220 A 155 155 0 1 1 375 220"
          stroke="url(#aura-orbit-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* 2. Concentric Ground Perspective Waves / Ripples */}
        {/* Outer Ripple */}
        <ellipse
          cx="250"
          cy="382"
          rx="96"
          ry="28"
          stroke="url(#aura-ripple-grad)"
          strokeWidth="11"
          fill="none"
        />
        {/* Middle Ripple */}
        <ellipse
          cx="250"
          cy="382"
          rx="66"
          ry="19"
          stroke="url(#aura-ripple-grad)"
          strokeWidth="10"
          fill="none"
        />
        {/* Inner Core Ripple */}
        <ellipse
          cx="250"
          cy="382"
          rx="36"
          ry="11"
          stroke="url(#aura-ripple-grad)"
          strokeWidth="8"
          fill="#0D44D4"
        />

        {/* 3. Location Pin Body (Left Facet & Right Facet for Dimensionality) */}
        {/* Full Pin Base Silhouette */}
        <path
          d="M 250 85 
             C 185 85, 140 135, 140 200 
             C 140 260, 205 320, 250 368 
             C 295 320, 360 260, 360 200 
             C 360 135, 315 85, 250 85 Z"
          fill="url(#aura-pin-left)"
        />

        {/* Right Half Facet Overlay for 3D depth */}
        <path
          d="M 250 85 
             C 315 85, 360 135, 360 200 
             C 360 260, 295 320, 250 368 
             L 250 85 Z"
          fill="url(#aura-pin-right)"
        />

        {/* Inner White Cutout Circle (Background for Storefront) */}
        <circle
          cx="250"
          cy="195"
          r="68"
          fill="#FFFFFF"
        />

        {/* 4. Storefront / Shop Icon Inside Pin */}
        {/* Shop Awning / Roof */}
        <path
          d="M 205 172 
             L 295 172 
             L 290 190 
             C 287 196, 277 196, 274 190 
             C 271 196, 261 196, 258 190 
             C 255 196, 245 196, 242 190 
             C 239 196, 229 196, 226 190 
             C 223 196, 213 196, 210 190 
             Z"
          fill="#155DFC"
        />
        {/* Awning Top Bar */}
        <rect
          x="208"
          y="162"
          width="84"
          height="8"
          rx="4"
          fill="#155DFC"
        />

        {/* Store Front Wall & Door / Window Base */}
        <rect
          x="215"
          y="190"
          width="70"
          height="40"
          rx="3"
          fill="#155DFC"
        />

        {/* Store Window (Left Cutout) */}
        <rect
          x="222"
          y="198"
          width="22"
          height="24"
          rx="2"
          fill="#FFFFFF"
        />

        {/* Store Door (Right Cutout) */}
        <rect
          x="254"
          y="198"
          width="24"
          height="32"
          rx="2"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
};

export const AuraCentraFullBadge: React.FC<{
  className?: string;
  showSubtitle?: boolean;
}> = ({ className = '', showSubtitle = true }) => {
  return (
    <div className={`flex flex-col items-center text-center p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-blue-100 dark:border-blue-900/60 shadow-xl max-w-md mx-auto ${className}`}>
      {/* 1. Official Store Pin Logo */}
      <div className="w-28 h-28 mb-3 flex items-center justify-center filter drop-shadow-md">
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
