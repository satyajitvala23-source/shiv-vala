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
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
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
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#d8e0dc] dark:border-white/10 bg-[#fbfaf6]/90 dark:bg-[#141c20]/90 text-[#222c30] dark:text-[#edeae0] text-xs sm:text-sm font-medium hover:bg-white dark:hover:bg-[#1a2429] transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
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
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'text-[#222c30] dark:text-[#edeae0] hover:bg-emerald-500/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* LOGIN TYPE OPTION (TOP-RIGHT CORNER) */}
        <div id="login-type-selector-wrapper" className="flex items-center">
          {/* Segmented Pill Toggle for desktop/tablet */}
          <div
            id="login-type-toggle-group"
            className="hidden sm:inline-flex p-1 bg-[#ede8dc]/80 dark:bg-[#141c20]/90 border border-[#d8e0dc] dark:border-white/10 rounded-xl shadow-xs"
            role="radiogroup"
            aria-label="Login Type Selector"
          >
            <button
              type="button"
              id="role-toggle-admin"
              role="radio"
              aria-checked={role === 'admin'}
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-teal-800 to-teal-900 text-white shadow-xs border border-teal-700/60'
                  : 'text-[#3a4750] dark:text-[#cbd5d0] hover:text-[#161e22] dark:hover:text-white'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${role === 'admin' ? 'text-teal-300' : 'text-slate-400'}`} />
              <span>{adminLabel}</span>
            </button>

            <button
              type="button"
              id="role-toggle-user"
              role="radio"
              aria-checked={role === 'user'}
              onClick={() => onRoleChange('user')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs border border-emerald-500/60'
                  : 'text-[#3a4750] dark:text-[#cbd5d0] hover:text-[#161e22] dark:hover:text-white'
              }`}
            >
              <User className={`w-3.5 h-3.5 ${role === 'user' ? 'text-emerald-200' : 'text-slate-400'}`} />
              <span>{userLabel}</span>
            </button>
          </div>

          {/* Compact Dropdown view for mobile screens */}
          <div className="relative sm:hidden" ref={roleRef} id="login-type-mobile-dropdown">
            <button
              type="button"
              id="role-dropdown-mobile-btn"
              onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#d8e0dc] dark:border-white/10 bg-[#fbfaf6] dark:bg-[#141c20] text-[#161e22] dark:text-[#f7f6f0] text-xs font-semibold shadow-xs"
            >
              {role === 'admin' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              ) : (
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
              <span className="truncate max-w-[70px]">{role === 'admin' ? adminLabel : userLabel}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRoleDropdownOpen && (
              <div className="glass-dropdown absolute right-0 mt-1.5 w-36 max-w-[calc(100vw-1.5rem)] py-1 z-50">
                <button
                  type="button"
                  id="mobile-role-select-admin"
                  onClick={() => {
                    onRoleChange('admin');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${
                    role === 'admin' ? 'bg-teal-500/15 text-teal-800 dark:text-teal-300 font-semibold' : 'text-[#222c30] dark:text-[#edeae0]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    {adminLabel}
                  </span>
                  {role === 'admin' && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                </button>
                <button
                  type="button"
                  id="mobile-role-select-user"
                  onClick={() => {
                    onRoleChange('user');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${
                    role === 'user' ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold' : 'text-[#222c30] dark:text-[#edeae0]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {userLabel}
                  </span>
                  {role === 'user' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
