import React, { useState } from 'react';
import auracentraLogoImg from '../assets/images/auracentra_logo_1790466547640.jpg';

interface AuraCentraLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AuraCentraLogo: React.FC<AuraCentraLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Exact Logo from the Final Image */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-2xs`}>
        {!imgError ? (
          <img
            src={auracentraLogoImg}
            alt="AuraCentra Logo"
            className="w-full h-full object-contain rounded-xl"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Orbital Arc Ring */}
            <path
              d="M 16 56 C 10 32 30 10 50 10 C 70 10 90 32 84 56"
              stroke="#0055FE"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Concentric Ripple Ovals at bottom */}
            <ellipse cx="50" cy="84" rx="20" ry="4" stroke="#0037B3" strokeWidth="2.5" />
            <ellipse cx="50" cy="84" rx="14" ry="2.8" stroke="#0055FE" strokeWidth="2.5" />
            <ellipse cx="50" cy="84" rx="7" ry="1.5" stroke="#0055FE" strokeWidth="2" />

            {/* Main Pin Marker (Graduated Dual Blue tone) */}
            <path
              d="M 50 20 C 35 20 25 32 25 46 C 25 60 48 81 50 83 C 52 81 75 60 75 46 C 75 32 65 20 50 20 Z"
              fill="url(#pinGradient)"
            />

            {/* Inner Storefront Building with Awning */}
            <g transform="translate(36, 32)">
              <path
                d="M 1 7 L 4 0 L 24 0 L 27 7 C 27 9 24 10 23 9 C 21 10 18 10 17 9 C 15 10 12 10 11 9 C 9 10 6 10 5 9 C 4 10 1 9 1 7 Z"
                fill="white"
              />
              <path
                d="M 3 9 L 3 20 L 25 20 L 25 9 Z"
                fill="white"
              />
              <rect x="6" y="11" width="6" height="7" rx="0.5" fill="#0055FE" />
              <rect x="15" y="11" width="7" height="9" rx="0.5" fill="#0055FE" />
            </g>

            <defs>
              <linearGradient id="pinGradient" x1="25" y1="20" x2="75" y2="83" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0066FF" />
                <stop offset="0.5" stopColor="#0052FF" />
                <stop offset="1" stopColor="#003BB5" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Exact Typography: "Aura" (Bright Blue) + "Centra" (Deep Navy / White in Dark Mode) */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight leading-none ${textSizes[size]}`}>
            <span className="text-[#0055FE] dark:text-[#387BFF]">Aura</span>
            <span className="text-[#081D4C] dark:text-white">Centra</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-tight leading-none mt-1">
            Connect. Discover. Grow
          </span>
        </div>
      )}
    </div>
  );
};
