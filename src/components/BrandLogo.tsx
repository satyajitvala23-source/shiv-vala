import React, { useState } from 'react';

interface BrandLogoProps {
  brandName?: string;
  tagline?: string;
  size?: 'sm' | 'md' | 'lg';
  hideTitle?: boolean;
  onLogoClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'lg',
  onLogoClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Approximately 100-130px wide/tall on login and registration pages
  const containerSizes = {
    sm: 'w-12 h-12 sm:w-14 sm:h-14',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-28 h-28 sm:w-32 sm:h-32 md:w-[124px] md:h-[124px]',
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.location.hash = '#/home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="shiv-computer-branding" className="flex flex-col items-center text-center select-none w-full max-w-full">
      {/* Official Shiv Computer Logo (100-130px on login/registration, no extra text beneath it) */}
      <button
        type="button"
        onClick={handleLogoClick}
        className="relative mb-2 sm:mb-3 flex items-center justify-center group cursor-pointer focus:outline-none"
        title="Shiv Computer — Home"
        aria-label="Shiv Computer Home"
      >
        <div
          className={`${containerSizes[size]} bg-transparent flex items-center justify-center relative overflow-visible transition-all duration-300 group-hover:scale-105`}
        >
          {!imgError ? (
            <img
              src="/logo.png"
              alt="Shiv Computer Official Logo"
              className="w-full h-full object-contain relative z-5 transition-transform duration-300 filter drop-shadow-lg"
              loading="eager"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 rounded-3xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-cyan-500/25">
              <span>SC</span>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
