import React, { useState, useEffect } from 'react';

interface ScrollProgressBarProps {
  showPercentageBadge?: boolean;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  showPercentageBadge = true,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          
          if (scrollHeight > 0) {
            const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
            setScrollProgress(progress);
          } else {
            setScrollProgress(0);
          }

          setIsScrolling(true);
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            setIsScrolling(false);
          }, 1500);

          ticking = false;
        });

        ticking = true;
      }
    };

    // Calculate initial progress
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <>
      {/* 1. Subtle Progress Bar Track & Indicator at the Very Top */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-slate-200/40 dark:bg-slate-800/40 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(37,99,235,0.6)] dark:shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Floating Exploration Depth Pill Indicator for Smartphone & Desktop */}
      {showPercentageBadge && scrollProgress > 3 && (
        <div
          className={`fixed top-3 right-3 sm:top-4 sm:right-6 z-50 pointer-events-none transition-all duration-300 transform ${
            isScrolling
              ? 'opacity-90 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-2 scale-95'
          }`}
          aria-hidden="true"
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] font-mono font-bold tracking-tight shadow-md border border-slate-700/50 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300">{Math.round(scrollProgress)}%</span>
            <span className="text-slate-400 text-[9px] uppercase hidden xs:inline">Explored</span>
          </div>
        </div>
      )}
    </>
  );
};
