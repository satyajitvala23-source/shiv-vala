import React from 'react';

export const DynamicGlassBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none bg-gradient-to-b from-[#ddf3fd] via-[#c8eafa] to-[#aed9f4] dark:from-[#050e1a] dark:via-[#06101e] dark:to-[#040c16]"
    >
      {/* Primary aqua ambient aura — top-left */}
      <div className="absolute -top-[12%] -left-[8%] w-[58vw] h-[58vw] max-w-[720px] max-h-[720px] rounded-full bg-gradient-to-br from-cyan-400/22 via-sky-500/14 to-transparent blur-3xl dynamic-blob-1 transform-gpu" />

      {/* Crystal blue secondary depth — top-right */}
      <div className="absolute top-[14%] -right-[10%] w-[50vw] h-[50vw] max-w-[620px] max-h-[620px] rounded-full bg-gradient-to-bl from-sky-400/18 via-cyan-500/12 to-transparent blur-3xl dynamic-blob-2 transform-gpu" />

      {/* Deep blue-aqua bottom radiance */}
      <div className="absolute -bottom-[8%] left-[18%] w-[55vw] h-[55vw] max-w-[680px] max-h-[680px] rounded-full bg-gradient-to-tr from-blue-700/14 via-cyan-400/10 to-transparent blur-3xl dynamic-blob-3 transform-gpu" />

      {/* Soft lavender-blue floating glow — mid-right */}
      <div className="absolute top-[52%] right-[10%] w-80 h-80 rounded-full bg-sky-300/12 dark:bg-cyan-500/8 blur-2xl dynamic-float-slow transform-gpu" />

      {/* Ice white highlight glow — upper-center */}
      <div className="absolute top-[8%] left-[38%] w-64 h-64 rounded-full bg-white/20 dark:bg-sky-300/6 blur-2xl dynamic-float-reverse transform-gpu" />

      {/* Concentric crystal rings — left depth */}
      <div className="absolute top-[20%] left-[22%] w-96 h-96 rounded-full border border-cyan-400/18 dark:border-cyan-400/12 dynamic-float-slow" />
      {/* Concentric crystal rings — bottom right */}
      <div className="absolute bottom-[18%] right-[14%] w-[28rem] h-[28rem] rounded-full border border-sky-400/14 dark:border-sky-400/10 dynamic-float-reverse" />

      {/* Water surface shimmer — thin ring */}
      <div className="absolute top-[40%] left-[55%] w-48 h-48 rounded-full border border-cyan-300/20 dark:border-cyan-300/10 dynamic-float-slow" style={{ animationDelay: '4s' }} />

      {/* Specular dot matrix pattern — crystal aqua */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.07)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(34,211,238,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
    </div>
  );
};
