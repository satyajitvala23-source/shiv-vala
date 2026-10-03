import React from 'react';

export const DynamicGlassBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none bg-gradient-to-b from-[#fbfaf6] via-[#f5f3e9] to-[#ede8dc] dark:from-[#0c1113] dark:via-[#10171a] dark:to-[#080c0e]"
    >
      {/* Emerald Green primary ambient aura */}
      <div className="absolute -top-[12%] -left-[8%] w-[55vw] h-[55vw] max-w-[680px] max-h-[680px] rounded-full bg-gradient-to-br from-emerald-500/18 via-teal-600/12 to-transparent blur-3xl dynamic-blob-1 transform-gpu" />

      {/* Deep Teal supporting ambient depth */}
      <div className="absolute top-[18%] -right-[10%] w-[48vw] h-[48vw] max-w-[580px] max-h-[580px] rounded-full bg-gradient-to-bl from-teal-700/16 via-emerald-600/10 to-transparent blur-3xl dynamic-blob-2 transform-gpu" />

      {/* Rich Emerald & Teal bottom radiance */}
      <div className="absolute -bottom-[10%] left-[20%] w-[52vw] h-[52vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-tr from-teal-900/15 via-emerald-500/10 to-transparent blur-3xl dynamic-blob-3 transform-gpu" />

      {/* Subtle floating Soft Cream warm highlight glow */}
      <div className="absolute top-[55%] right-[12%] w-72 h-72 rounded-full bg-emerald-400/8 dark:bg-emerald-500/5 blur-2xl dynamic-float-slow transform-gpu" />

      {/* Concentric rings for subtle tactile depth in Emerald & Deep Teal */}
      <div className="absolute top-[15%] left-[26%] w-80 h-80 rounded-full border border-emerald-500/15 dark:border-emerald-400/10 dynamic-float-slow" />
      <div className="absolute bottom-[20%] right-[16%] w-96 h-96 rounded-full border border-teal-600/15 dark:border-teal-400/10 dynamic-float-reverse" />

      {/* Specular dot matrix pattern in emerald / soft charcoal */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(5,150,105,0.08)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(52,211,153,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-75" />
    </div>
  );
};
