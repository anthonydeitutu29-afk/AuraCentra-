import React from 'react';

interface AuraCentraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  variant?: 'full' | 'icon' | 'stacked' | 'horizontal' | 'badge';
  className?: string;
  showTagline?: boolean;
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const AuraCentraLogoSVG: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 520 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Deep Primary 3D Gradient for A & C */}
        <linearGradient id="ac-primary-grad" x1="120" y1="50" x2="420" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00A2FF" />
          <stop offset="25%" stopColor="#0077FF" />
          <stop offset="65%" stopColor="#0050E6" />
          <stop offset="100%" stopColor="#002B99" />
        </linearGradient>

        {/* Top Arc & Swoosh Dynamic Glow Gradient */}
        <linearGradient id="ac-swoosh-grad" x1="100" y1="360" x2="420" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="40%" stopColor="#0088FF" />
          <stop offset="85%" stopColor="#0055EE" />
          <stop offset="100%" stopColor="#0033BB" />
        </linearGradient>

        {/* Specular Edge Highlight for 3D bevels */}
        <linearGradient id="ac-specular" x1="180" y1="60" x2="280" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8AE2FF" />
          <stop offset="45%" stopColor="#0099FF" />
          <stop offset="100%" stopColor="#0044CC" />
        </linearGradient>

        {/* Shadow Core Gradient for Column & Depth */}
        <linearGradient id="ac-inner-pillar" x1="190" y1="210" x2="250" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0080FF" />
          <stop offset="50%" stopColor="#0050D0" />
          <stop offset="100%" stopColor="#002888" />
        </linearGradient>

        {/* Spherical Orb 3D Radial Gradient inside C */}
        <radialGradient id="ac-orb-grad" cx="38%" cy="36%" r="62%">
          <stop offset="0%" stopColor="#00D8FF" />
          <stop offset="35%" stopColor="#0080FF" />
          <stop offset="70%" stopColor="#0047C8" />
          <stop offset="100%" stopColor="#001F70" />
        </radialGradient>

        {/* Soft Drop Shadow Filter for Sculpted Depth */}
        <filter id="ac-3d-shadow" x="-8%" y="-8%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0048b3" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter="url(#ac-3d-shadow)">
        {/* Stylized 'A' - Primary Left Diagonal Stroke and Apex */}
        <path
          d="M216 68 C224 68 238 72 248 85 L288 152 L150 368 L92 368 L196 90 C202 75 208 68 216 68 Z"
          fill="url(#ac-primary-grad)"
        />

        {/* Stylized 'A' - Apex Bevel Highlight */}
        <path
          d="M216 68 L248 85 L276 132 L248 108 L224 74 Z"
          fill="url(#ac-specular)"
        />

        {/* 'A' Vertical Inner Column & Base Structure */}
        <path
          d="M208 245 L248 245 L248 370 L208 370 Z"
          fill="url(#ac-inner-pillar)"
        />

        {/* 'A' Base Ground Shelf Line */}
        <path
          d="M178 370 C200 367 245 367 274 370 L278 374 L174 374 Z"
          fill="url(#ac-specular)"
        />

        {/* Dynamic Sweeping Curved Arc Swoosh bridging A into C */}
        <path
          d="M96 368 C140 286 218 208 335 190 C388 182 432 195 454 212 C405 200 316 214 232 268 C168 308 126 352 96 368 Z"
          fill="url(#ac-swoosh-grad)"
        />

        {/* 'C' Sculpted Outer Ring & Crescent */}
        <path
          d="M394 148 C456 174 496 230 496 302 C496 396 422 462 328 462 C244 462 178 404 162 326 C190 354 246 394 320 394 C382 394 434 352 434 294 C434 242 392 196 340 180 C362 165 378 156 394 148 Z"
          fill="url(#ac-primary-grad)"
        />

        {/* 'C' Upper Tip Specular Glow */}
        <path
          d="M388 148 C432 166 472 198 488 234 C472 212 444 190 404 174 Z"
          fill="url(#ac-specular)"
        />

        {/* Central Spherical Orb inside C */}
        <circle
          cx="348"
          cy="300"
          r="45"
          fill="url(#ac-orb-grad)"
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
      {/* 1. Sculpted 3D AC Monogram */}
      <div className="w-28 h-28 mb-3 flex items-center justify-center filter drop-shadow-md">
        <AuraCentraLogoSVG size={110} />
      </div>

      {/* 2. Official AuraCentra Brand Name */}
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center justify-center leading-none mb-2">
        <span className="text-[#0A1C44] dark:text-white">Aura</span>
        <span className="text-[#0088FF] dark:text-[#38BDF8]">Centra</span>
      </h1>

      {/* 3. Official Tagline with Decorative Dividing Bars */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-xs my-2 text-[10px] sm:text-xs font-black tracking-[0.26em] text-[#0A1C44] dark:text-cyan-300">
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#0088FF]/50 to-[#0088FF]" />
        <div className="flex items-center gap-1.5 shrink-0 uppercase">
          <span>CONNECT</span>
          <span className="text-[#0088FF]">•</span>
          <span>DISCOVER</span>
          <span className="text-[#0088FF]">•</span>
          <span>GROW</span>
        </div>
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#0088FF]/50 to-[#0088FF]" />
      </div>

      {/* 4. Subtitle Value Proposition */}
      {showSubtitle && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 w-full px-2">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            A digital platform where businesses enlist and customers get access to what they need,{' '}
            <strong className="text-[#0088FF] dark:text-[#38BDF8] font-black">without stress.</strong>
          </p>
        </div>
      )}

      {/* 5. Bottom Dynamic Accent Wave */}
      <div className="w-full h-2 mt-4 rounded-full bg-gradient-to-r from-[#0A1C44] via-[#0077FF] to-[#00D2FF]" />
    </div>
  );
};
