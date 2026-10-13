import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Moon,
  Sun,
  User,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  FileText,
  Briefcase,
  HelpCircle,
  Phone,
  Home,
  CheckCircle2,
  FolderOpen,
  CreditCard,
  Calculator,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CurrentView } from '../types';
import { LANGUAGES } from '../translations';

interface GlassNavbarProps {
  onSearchQuery?: (query: string) => void;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({ onSearchQuery }) => {
  const {
    currentView,
    setCurrentView,
    isAuthenticated,
    authRole,
    currentUser,
    logout,
    language,
    setLanguage,
    theme,
    toggleTheme,
    setSelectedRole,
    t,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Track window scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (view: CurrentView) => {
    setCurrentView(view);
    window.location.hash = `#/${view}`;
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchQuery) {
      onSearchQuery(searchQuery);
    }
    if (currentView !== 'services' && currentView !== 'forms') {
      navigateTo('services');
    }
  };

  const navLinks: { id: CurrentView; label: string; labelGu: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', labelGu: 'હોમ', icon: <Home className="w-4 h-4" /> },
    { id: 'services', label: 'Services', labelGu: 'સેવાઓ', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'forms', label: 'Forms', labelGu: 'ફોર્મ્સ', icon: <FileText className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', labelGu: 'દસ્તાવેજો', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'applications', label: 'Track Status', labelGu: 'સ્ટેટસ ટ્રેક', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', labelGu: 'પેમેન્ટ્સ', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'about', label: 'About', labelGu: 'અમારા વિશે', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', labelGu: 'સંપર્ક', icon: <Phone className="w-4 h-4" /> },
  ];

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header
      id="main-glass-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/35 backdrop-blur-xl border-b border-white/50 shadow-md shadow-sky-900/5 py-2.5 sm:py-3'
          : 'bg-white/20 backdrop-blur-md border-b border-white/40 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo & Name */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-transparent p-0.5 flex items-center justify-center relative shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Shiv Computer Logo"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white shadow-xs shadow-cyan-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg bg-linear-to-r from-sky-900 via-sky-700 to-cyan-600 bg-clip-text text-transparent drop-shadow-xs tracking-tight group-hover:from-sky-800 group-hover:to-cyan-500 transition-all">
                  Shiv Computer
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-xs shadow-cyan-400/80 animate-pulse" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-sky-800/85 font-semibold tracking-wide">
                Digital Gujarat & CSC Center
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => navigateTo(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-900 border border-sky-400/40 font-semibold shadow-xs shadow-sky-500/10'
                      : 'text-slate-700 hover:text-sky-900 hover:bg-white/30'
                  }`}
                >
                  {link.icon}
                  <span>{language === 'gu' ? link.labelGu : link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search bar & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center relative w-44 lg:w-52"
            >
              <input
                type="text"
                placeholder={language === 'gu' ? 'સેવા / ફોર્મ શોધો...' : 'Search forms & services...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearchQuery) onSearchQuery(e.target.value);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/40 hover:bg-white/55 border border-white/60 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-white/75 focus:ring-2 focus:ring-cyan-400/30 shadow-xs transition-all backdrop-blur-md"
              />
              <Search className="w-3.5 h-3.5 text-sky-600 absolute left-2.5 pointer-events-none" />
            </form>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="px-2.5 py-1.5 rounded-xl bg-white/30 hover:bg-white/45 border border-white/45 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors backdrop-blur-md cursor-pointer"
                aria-label="Toggle language"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-600" />
              </button>

              {isLangOpen && (
                <div className="glass-dropdown absolute right-0 mt-1.5 w-36 py-1.5 z-50 animate-in fade-in zoom-in-95 bg-white/95 border border-white/60 shadow-lg rounded-xl">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        language === l.code
                          ? 'bg-sky-500/15 text-sky-900 font-bold'
                          : 'text-slate-700 hover:bg-sky-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeLabel}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-white/30 hover:bg-white/45 border border-white/45 text-sky-800 transition-colors backdrop-blur-md cursor-pointer"
              aria-label="Toggle theme mode"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-sky-700" />}
            </button>

            {/* User Profile / Login Button */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-400/40 text-sky-950 text-xs font-semibold hover:border-cyan-400 transition-all backdrop-blur-md cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-sky-500/30 border border-sky-400/40 flex items-center justify-center text-[11px] font-bold text-sky-900">
                    {authRole === 'admin' ? 'A' : (currentUser?.name?.charAt(0) || 'U')}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">
                    {authRole === 'admin' ? 'Admin' : (currentUser?.name || 'User')}
                  </span>
                  <ChevronDown className="w-3 h-3 text-sky-700" />
                </button>

                {isProfileOpen && (
                  <div className="glass-dropdown absolute right-0 mt-2 w-56 p-2 z-50 animate-in fade-in zoom-in-95 bg-white/95 border border-white/60 shadow-xl rounded-2xl">
                    <div className="p-2 border-b border-slate-200/60 mb-1">
                      <div className="font-semibold text-xs text-slate-900">
                        {authRole === 'admin' ? 'Administrator' : currentUser?.name || 'User'}
                      </div>
                      <div className="text-[11px] text-sky-700 truncate">
                        {currentUser?.email || (authRole === 'admin' ? 'Admin' : 'User')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        if (authRole === 'admin') {
                          navigateTo('admin-dashboard');
                        } else {
                          navigateTo('user-dashboard');
                        }
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-700 hover:bg-sky-500/15 hover:text-sky-900 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      <span>{authRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigateTo('profile');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-700 hover:bg-sky-500/15 hover:text-sky-900 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'gu' ? 'પ્રોફાઇલ સેટિંગ્સ' : 'Profile Settings'}</span>
                    </button>
                    <div className="border-t border-slate-200/60 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          navigateTo('home');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'gu' ? 'લૉગ આઉટ' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('user');
                    navigateTo('login');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white text-xs sm:text-sm font-semibold shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'gu' ? 'લૉગિન' : 'Sign In'}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-white/30 hover:bg-white/45 border border-white/45 text-slate-800 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-sky-700" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/30 pb-4 animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-3 relative">
              <input
                type="text"
                placeholder={language === 'gu' ? 'સેવા / ફોર્મ શોધો...' : 'Search forms & services...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearchQuery) onSearchQuery(e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/40 border border-white/50 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <Search className="w-4 h-4 text-sky-600 absolute left-3 top-2.5" />
            </form>

            <div className="grid grid-cols-2 gap-1.5">
              {navLinks.map((link) => {
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => navigateTo(link.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-900 border border-sky-400/40 font-semibold'
                        : 'text-slate-700 hover:bg-white/30'
                    }`}
                  >
                    {link.icon}
                    <span>{language === 'gu' ? link.labelGu : link.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Admin / User Login links if not authenticated */}
            {!isAuthenticated && (
              <div className="mt-3 pt-3 border-t border-white/30 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('user');
                    navigateTo('login');
                  }}
                  className="flex-1 py-2 rounded-xl bg-sky-500/20 text-sky-900 border border-sky-400/35 text-xs font-semibold text-center cursor-pointer"
                >
                  {language === 'gu' ? 'યુઝર લૉગિન' : 'User Login'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    navigateTo('admin-login');
                  }}
                  className="flex-1 py-2 rounded-xl bg-white/30 text-slate-700 border border-white/40 text-xs font-semibold text-center cursor-pointer"
                >
                  {language === 'gu' ? 'એડમિન લૉગિન' : 'Admin Login'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
