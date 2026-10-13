import React, { useState } from 'react';

interface BrandLogoProps {
  brandName: string;
  tagline: string;
  size?: 'sm' | 'md' | 'lg';
  hideTitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandName,
  tagline,
  size = 'md',
  hideTitle = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const containerSizes = {
    sm: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl p-0.5',
    md: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1',
    lg: 'w-20 h-20 sm:w-28 sm:h-28 rounded-3xl p-1.5 sm:p-2',
  };

  const displayName = brandName || 'Shiv Computer';

  return (
    <div id="shiv-computer-branding" className="flex flex-col items-center text-center select-none w-full max-w-full">
      {/* Visual Logo Emblem - Modern Transparent & Fitted Presentation */}
      <div className="relative mb-2 sm:mb-2.5 flex items-center justify-center group cursor-pointer">
        <div
          className={`${containerSizes[size]} bg-transparent flex items-center justify-center relative overflow-visible transition-all duration-300 group-hover:scale-105`}
        >
          {!imgError ? (
            <img
              src="/logo.png"
              alt="Shiv Computer Official Logo"
              className="w-full h-full object-contain relative z-5 transition-transform duration-300 filter drop-shadow-md"
              loading="eager"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-cyan-500/25">
              <span>SC</span>
            </div>
          )}
        </div>

        {/* Ambient status light with Cyan Glowing Accent */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-white shadow-xs shadow-cyan-500/60" />
        </span>
      </div>

      {!hideTitle && (
        <div className="flex flex-col items-center">
          {/* Brand Title: Bright Blue & Cyan Gradient (No dark colors) */}
          <h1 id="brand-heading" className="text-xl sm:text-2xl font-black tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
            <span className="bg-gradient-to-r from-sky-900 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
              {displayName}
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-xs shadow-cyan-400/80 inline-block align-middle animate-pulse" />
          </h1>

          {/* Tagline */}
          <p id="brand-tagline" className="text-[11px] sm:text-xs font-semibold text-sky-900/80 mt-1 max-w-xs flex flex-wrap items-center justify-center gap-1.5 px-2">
            <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/35 text-[10px] sm:text-[11px] text-sky-900 font-bold whitespace-nowrap">
              Digital Gujarat & CSC
            </span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-center">{tagline}</span>
          </p>
        </div>
      )}
    </div>
  );
};
