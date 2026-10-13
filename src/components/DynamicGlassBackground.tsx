import React from 'react';

export const DynamicGlassBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none bg-sky-50"
    >
      {/* High-quality Bright Agricultural & Modern Workspace Background Image */}
      <img
        src="/assets/bright_field_workspace.jpg"
        alt="Lush Agricultural Field and Modern Glass Computer Workspace"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.02] saturate-[1.06] transition-opacity duration-700"
        loading="eager"
      />

      {/* Subtle light translucent overlay so background stays clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/45 via-white/25 to-sky-100/40" />
      <div className="absolute inset-0 bg-radial-at-t from-cyan-400/15 via-transparent to-transparent pointer-events-none" />

      {/* Fresh sky blue, cyan and soft luminous glow auras */}
      <div className="absolute -top-[10%] -left-[5%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-br from-cyan-300/35 via-sky-300/20 to-transparent blur-3xl dynamic-blob-1 transform-gpu opacity-75" />
      <div className="absolute top-[20%] -right-[8%] w-[52vw] h-[52vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-bl from-blue-300/30 via-cyan-200/30 to-transparent blur-3xl dynamic-blob-2 transform-gpu opacity-70" />
      <div className="absolute -bottom-[8%] left-[20%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-tr from-emerald-200/30 via-teal-200/25 to-transparent blur-3xl dynamic-blob-3 transform-gpu opacity-65" />

      {/* Subtle digital technology grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.12)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full border border-cyan-400/20 dynamic-float-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full border border-sky-400/20 dynamic-float-reverse pointer-events-none" />
    </div>
  );
};

