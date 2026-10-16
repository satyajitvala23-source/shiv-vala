import React from 'react';
import { useApp } from '../context/AppContext';

export const DynamicGlassBackground: React.FC = () => {
  const { theme } = useApp();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none bg-[#f4f9fd] dark:bg-[#070d1e] transition-colors duration-500"
    >
      {/* 
        Light Mode: Liquid Glass 3D Blue & White background (upper half composition)
        Cover, Center, No-Repeat
      */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
          theme === 'light' ? 'opacity-95' : 'opacity-0'
        } dark:hidden transform-gpu`}
        style={{
          backgroundImage: "url('/assets/liquid-glass-light.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 
        Dark Mode: Liquid Glass 3D Dark Navy & Glowing Blue background (lower half composition)
        Cover, Center, No-Repeat
      */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
          theme === 'dark' ? 'opacity-95' : 'opacity-0'
        } hidden dark:block transform-gpu`}
        style={{
          backgroundImage: "url('/assets/liquid-glass-dark.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 
        Protective Readability Overlays:
        Ensures all text, cards, buttons, fees, and tables maintain high readability & accessibility contrast
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-sky-50/10 to-blue-50/20 dark:from-[#060b18]/45 dark:via-[#081024]/40 dark:to-[#040813]/60 pointer-events-none transition-colors duration-500" />

      {/* Radiant Cyber Ambient Light */}
      <div className="absolute top-0 inset-x-0 h-[480px] bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(14,165,233,0.15),transparent_75%)] dark:bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(6,182,212,0.20),transparent_75%)] pointer-events-none" />

      {/* Dynamic Luminous Cyan/Sky Flow Glows */}
      <div className="absolute -top-[10%] -left-[5%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-cyan-400/15 via-sky-300/10 to-transparent dark:from-cyan-400/15 dark:via-blue-600/10 dark:to-transparent blur-3xl dynamic-blob-1 transform-gpu pointer-events-none" />
      <div className="absolute top-[30%] -right-[8%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-bl from-blue-400/14 via-indigo-300/10 to-transparent dark:from-indigo-500/15 dark:via-cyan-500/10 dark:to-transparent blur-3xl dynamic-blob-2 transform-gpu pointer-events-none" />

      {/* Cyber Micro-Dots Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.08)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(56,189,248,0.12)_1px,transparent_1px)] [background-size:32px_32px] opacity-35 dark:opacity-25 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_35%,transparent_90%)] pointer-events-none" />

      {/* Grounding Gradient Fade */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-sky-100/20 to-transparent dark:from-[#040813]/70 dark:to-transparent pointer-events-none" />
    </div>
  );
};
