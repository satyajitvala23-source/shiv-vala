import React, { useState } from 'react';

interface BrandLogoProps {
  brandName: string;
  tagline: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brandName, tagline, size = 'lg' }) => {
  const [imgError, setImgError] = useState(false);

  const containerSizes = {
    sm: 'w-12 h-12 sm:w-16 sm:h-16 rounded-2xl p-1',
    md: 'w-16 h-16 sm:w-24 sm:h-24 rounded-2xl p-1.5',
    lg: 'w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-3xl p-1.5 sm:p-3',
  };

  return (
    <div id="shiv-computer-branding" className="flex flex-col items-center text-center select-none w-full max-w-full">
      {/* Visual Logo Emblem - Modern Transparent & Fitted Presentation */}
      <div className="relative mb-3 sm:mb-4 flex items-center justify-center group cursor-pointer">
        <div
          className={`${containerSizes[size]} bg-transparent flex items-center justify-center relative overflow-visible transition-all duration-300 group-hover:scale-105`}
        >
          {!imgError ? (
            <img
              src="/logo.png"
              alt="Shiv Computer Official Logo"
              className="w-full h-full object-contain relative z-5 transition-transform duration-300 filter drop-shadow-xl drop-shadow-emerald-600/25"
              loading="eager"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-emerald-700 via-teal-700 to-teal-900 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-emerald-500/25">
              <span>SC</span>
            </div>
          )}
        </div>

        {/* Ambient status light with Emerald Glowing Accent */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-5 sm:w-5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-5 sm:w-5 bg-emerald-500 border-2 border-[#fbfaf6] dark:border-[#0c1113] shadow-md shadow-emerald-500/60" />
        </span>
      </div>

      {/* Brand Title: Emerald Green + Deep Teal Gradient */}
      <h1 id="brand-heading" className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#161e22] dark:text-[#f7f6f0] flex items-center justify-center gap-1.5 flex-wrap">
        <span className="bg-linear-to-r from-emerald-800 via-teal-700 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent">
          {brandName}
        </span>
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/60 inline-block align-middle" />
      </h1>

      {/* Tagline */}
      <p id="brand-tagline" className="text-xs sm:text-sm font-semibold text-[#3a4750] dark:text-[#cbd5d0] mt-1 max-w-xs flex flex-wrap items-center justify-center gap-1.5 px-2">
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/25 dark:border-emerald-800 text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-300 font-bold whitespace-nowrap">
          Digital Gujarat & CSC
        </span>
        <span className="text-slate-400 hidden sm:inline">·</span>
        <span className="text-center">{tagline}</span>
      </p>
    </div>
  );
};
