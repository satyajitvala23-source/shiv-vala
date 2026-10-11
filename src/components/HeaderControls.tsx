import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, User, ChevronDown, Check } from 'lucide-react';
import { LanguageCode, LoginRole } from '../types';
import { LANGUAGES } from '../translations';

interface HeaderControlsProps {
  role: LoginRole;
  onRoleChange: (role: LoginRole) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  adminLabel: string;
  userLabel: string;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  role,
  onRoleChange,
  language,
  onLanguageChange,
  adminLabel,
  userLabel,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header
      id="login-header-bar"
      className="w-full max-w-full px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-4 flex items-center justify-between z-30 min-w-0"
    >
      {/* Left corner official Shiv Computer logo branding */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink">
        <div className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-[#fbfaf6]/90 dark:bg-[#141c20]/90 backdrop-blur-md border border-[#d8e0dc]/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all min-w-0">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-transparent p-0.5 flex items-center justify-center relative shrink-0 group">
            <img
              src="/logo.png"
              alt="Shiv Computer Logo"
              className="w-full h-full object-contain filter drop-shadow-sm relative z-5 transition-transform duration-200 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="font-extrabold text-xs sm:text-base text-[#161e22] dark:text-[#f7f6f0] tracking-tight leading-tight flex items-center gap-1 truncate">
              <span className="truncate">Shiv Computer</span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 inline-block shrink-0 shadow-2xs shadow-emerald-500/50" />
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-semibold leading-tight hidden sm:inline truncate">
              Digital Gujarat & CSC
            </span>
          </div>
        </div>
      </div>

      {/* TOP-RIGHT CORNER: Controls cluster */}
      <div id="top-right-controls" className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">
        {/* Language Selector Dropdown */}
        <div className="relative" ref={langRef} id="language-selector-container">
          <button
            type="button"
            id="language-selector-button"
            onClick={() => setIsLangOpen((prev) => !prev)}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-sky-200/70 dark:border-cyan-400/18 bg-white/65 dark:bg-sky-950/65 backdrop-blur-md text-[#0c3a56] dark:text-[#c8e8f8] text-xs sm:text-sm font-medium hover:bg-white/90 dark:hover:bg-sky-900/80 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            aria-label="Select Language"
            aria-expanded={isLangOpen}
          >
            <span className="text-sm sm:text-base leading-none">{currentLang.flag}</span>
            <span className="font-medium hidden sm:inline">{currentLang.nativeLabel}</span>
            <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div
              id="language-dropdown-menu"
              className="glass-dropdown absolute right-0 mt-1.5 w-40 sm:w-44 max-w-[calc(100vw-1.5rem)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Language / ભાષા
              </div>
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    id={`lang-option-${lang.code}`}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-left transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/12 dark:bg-cyan-500/20 text-sky-800 dark:text-sky-300 font-semibold'
                        : 'text-[#0c3a56] dark:text-[#c8e8f8] hover:bg-cyan-500/7 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* LOGIN TYPE: Display only two compact buttons: Admin and User */}
        <div id="login-type-selector-wrapper" className="flex items-center">
          <div
            id="login-type-toggle-group"
            className="inline-flex p-1 bg-white/70 dark:bg-sky-950/70 border border-sky-200/80 dark:border-cyan-400/25 rounded-2xl shadow-sm backdrop-blur-xl"
            role="radiogroup"
            aria-label="Login Role Selection"
          >
            <button
              type="button"
              id="role-toggle-admin"
              role="radio"
              aria-checked={role === 'admin'}
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                role === 'admin'
                  ? 'btn-glossy-primary shadow-md'
                  : 'text-[#2c5970] dark:text-[#7aafcc] hover:text-[#0c3a56] dark:hover:text-white hover:bg-sky-500/10'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${role === 'admin' ? 'text-white' : 'text-slate-400'}`} />
              <span>Admin</span>
            </button>

            <button
              type="button"
              id="role-toggle-user"
              role="radio"
              aria-checked={role === 'user'}
              onClick={() => onRoleChange('user')}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                role === 'user'
                  ? 'btn-glossy-primary shadow-md'
                  : 'text-[#2c5970] dark:text-[#7aafcc] hover:text-[#0c3a56] dark:hover:text-white hover:bg-sky-500/10'
              }`}
            >
              <User className={`w-3.5 h-3.5 ${role === 'user' ? 'text-white' : 'text-slate-400'}`} />
              <span>User</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
