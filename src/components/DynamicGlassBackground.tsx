import React from 'react';

/**
 * DynamicGlassBackground:
 * Provides a clean, modern, pure light-blue & white background for the entire website.
 * No full-screen photos or dark overlays, matching the Master Prompt specifications:
 * - Base Light Background: #F5FAFF
 * - Light Blue Accents: #EAF5FF / #2196F3
 * - Pure White Highlights: #FFFFFF
 * - Translucent soft radial ambient lights to give depth to frosted glass cards
 */
export const DynamicGlassBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none bg-[#F5FAFF]"
    >
      {/* Light clean gradient fill */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5FAFF] via-[#EAF5FF]/70 to-[#FFFFFF]" />

      {/* Subtle soft primary blue ambient glow (top left) */}
      <div className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-[#2196F3]/10 via-[#64B5F6]/6 to-transparent blur-3xl pointer-events-none" />

      {/* Subtle soft cyan/light-blue ambient glow (middle right) */}
      <div className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-bl from-[#00BCD4]/8 via-[#EAF5FF] to-transparent blur-3xl pointer-events-none" />

      {/* Gentle bottom light accent */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
    </div>
  );
};
