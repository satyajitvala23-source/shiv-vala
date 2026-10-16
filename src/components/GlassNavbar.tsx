import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Moon,
  Sun,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  LogIn,
  LogOut,
  FileText,
  Briefcase,
  Phone,
  Home,
  CheckCircle2,
  FolderOpen,
  CreditCard,
  Info,
  LayoutDashboard,
  Bell,
  Check,
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
    isNavbarVisible,
    setIsNavbarVisible,
    navigateToView,
    isAuthenticated,
    authRole,
    currentUser,
    logout,
    language,
    setLanguage,
    theme,
    toggleTheme,
    setSelectedRole,
    notifications,
    markNotificationAsRead,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: CurrentView) => {
    setMobileMenuOpen(false);
    navigateToView(view);
    setIsNavbarVisible(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchQuery) {
      onSearchQuery(searchQuery);
    }
    handleNavClick('services');
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
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* ── Auto-hide Floating Hamburger Menu Button (Shown when navbar is collapsed) ── */}
      {!isNavbarVisible && (
        <button
          id="floating-nav-hamburger-btn"
          type="button"
          onClick={() => setIsNavbarVisible(true)}
          className="fixed top-3 left-3 sm:left-5 z-50 flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-lg shadow-sky-950/10 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open Navigation Menu"
          title={language === 'gu' ? 'નેવિગેશન મેનૂ ખોલો' : 'Open Navigation Menu'}
        >
          <Menu className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-bold bg-linear-to-r from-sky-900 via-sky-700 to-cyan-600 bg-clip-text text-transparent">
            {language === 'gu' ? 'મેનૂ' : 'Menu'}
          </span>
        </button>
      )}

      {/* ── Top Glass Navbar ── */}
      <header
        id="main-glass-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          !isNavbarVisible
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        } ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-sky-100/80 dark:border-white/10 shadow-md shadow-sky-900/10 py-1.5 sm:py-2'
            : 'bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b border-sky-100/60 dark:border-white/10 py-2 sm:py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">

            {/* Official Shiv Computer Logo (Prominent 55-65px tall, no extra text, navigates to Home) */}
            <button
              id="navbar-logo-btn"
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center group cursor-pointer focus:outline-none shrink-0"
              aria-label="Go to Home"
              title="Shiv Computer — Home"
            >
              <div className="h-12 sm:h-14 md:h-[62px] w-auto max-w-[180px] flex items-center justify-center relative shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Shiv Computer Logo"
                  className="h-full w-auto object-contain filter drop-shadow-md"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Main Navigation">
              {/* Dashboard button */}
              <button
                id="nav-link-dashboard"
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    handleNavClick(authRole === 'admin' ? 'admin-dashboard' : 'user-dashboard');
                  } else {
                    setSelectedRole('user');
                    handleNavClick('login');
                  }
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'user-dashboard' || currentView === 'admin-dashboard'
                    ? 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/40 shadow-xs shadow-sky-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:text-sky-900 dark:hover:text-sky-200 hover:bg-white/30 dark:hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{language === 'gu' ? 'ડેશબોર્ડ' : 'Dashboard'}</span>
              </button>

              {navLinks.map((link) => {
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/40 shadow-xs shadow-sky-500/10'
                        : 'text-slate-700 dark:text-slate-300 hover:text-sky-900 dark:hover:text-sky-200 hover:bg-white/30 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {link.icon}
                    <span>{language === 'gu' ? link.labelGu : link.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Search bar & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Desktop Search Input */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center relative w-36 lg:w-44 xl:w-48"
              >
                <input
                  id="glass-navbar-search"
                  type="text"
                  placeholder={language === 'gu' ? 'સેવા / ફોર્મ શોધો...' : 'Search forms & services...'}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearchQuery) onSearchQuery(e.target.value);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/40 dark:bg-slate-800/50 hover:bg-white/55 border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/75 shadow-xs transition-all backdrop-blur-md"
                />
                <Search className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 absolute left-2.5 pointer-events-none" />
              </form>

              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  id="navbar-lang-toggle"
                  onClick={() => setIsLangOpen((prev) => !prev)}
                  className="px-2 py-1.5 rounded-xl bg-white/30 dark:bg-slate-800/50 hover:bg-white/45 border border-white/45 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors backdrop-blur-md cursor-pointer"
                  aria-label="Toggle language"
                >
                  <span className="text-sm leading-none">{currentLangObj.flag}</span>
                  <span className="hidden sm:inline text-[11px]">{currentLangObj.code.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isLangOpen && (
                  <div className="glass-dropdown absolute right-0 mt-1.5 w-36 py-1.5 z-50 animate-in fade-in zoom-in-95 bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-white/10 shadow-lg rounded-xl">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        id={`lang-option-${l.code}`}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          language === l.code
                            ? 'bg-sky-500/15 text-sky-900 dark:text-sky-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeLabel}</span>
                        </span>
                        {language === l.code && <Check className="w-3 h-3 text-sky-600 dark:text-sky-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Light / Dark Mode Toggle */}
              <button
                type="button"
                id="navbar-theme-toggle"
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-xl bg-white/30 dark:bg-slate-800/50 hover:bg-white/45 border border-white/45 dark:border-white/10 text-sky-800 dark:text-sky-300 transition-colors backdrop-blur-md cursor-pointer"
                aria-label="Toggle theme mode"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-700" />}
              </button>

              {/* Notification Button */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  id="navbar-notif-toggle"
                  onClick={() => setIsNotifOpen((prev) => !prev)}
                  className="relative p-1.5 sm:p-2 rounded-xl bg-white/30 dark:bg-slate-800/50 hover:bg-white/45 border border-white/45 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-colors backdrop-blur-md cursor-pointer"
                  aria-label="View notifications"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold shadow-sm ring-1 ring-white dark:ring-slate-900">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div
                    id="navbar-notifications-menu"
                    className="glass-dropdown absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl py-3 z-50 animate-in fade-in zoom-in-95 bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-white/10 shadow-xl"
                  >
                    <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">
                        {language === 'gu' ? 'સૂચનાઓ' : 'Notifications'} ({notifications.length})
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          {unreadCount} {language === 'gu' ? 'નવી' : 'new'}
                        </span>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          {language === 'gu' ? 'કોઈ નવી સૂચનાઓ નથી' : 'No new notifications'}
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-3.5 hover:bg-slate-100/50 dark:hover:bg-white/5 cursor-pointer transition-colors ${
                              !n.read ? 'bg-sky-500/10 dark:bg-sky-500/10' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0">{n.date}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile / Login Button */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    id="navbar-profile-toggle"
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-400/40 text-sky-950 dark:text-sky-200 text-xs font-semibold hover:border-cyan-400 transition-all backdrop-blur-md cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-lg bg-sky-500/30 border border-sky-400/40 flex items-center justify-center text-[11px] font-bold text-sky-900 dark:text-sky-200">
                      {authRole === 'admin' ? 'A' : (currentUser?.name?.charAt(0) || 'U')}
                    </div>
                    <span className="max-w-[80px] truncate hidden sm:inline">
                      {authRole === 'admin' ? 'Admin' : (currentUser?.name || 'User')}
                    </span>
                    <ChevronDown className="w-3 h-3 text-sky-700 dark:text-sky-400" />
                  </button>

                  {isProfileOpen && (
                    <div className="glass-dropdown absolute right-0 mt-2 w-56 p-2 z-50 animate-in fade-in zoom-in-95 bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-white/10 shadow-xl rounded-2xl">
                      <div className="p-2 border-b border-slate-200/60 dark:border-white/10 mb-1">
                        <div className="font-semibold text-xs text-slate-900 dark:text-white">
                          {authRole === 'admin' ? 'Administrator' : currentUser?.name || 'User'}
                        </div>
                        <div className="text-[11px] text-sky-700 dark:text-sky-400 truncate">
                          {currentUser?.email || (authRole === 'admin' ? 'Admin' : 'User')}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleNavClick(authRole === 'admin' ? 'admin-dashboard' : 'user-dashboard');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-sky-500/15 hover:text-sky-900 dark:hover:text-sky-300 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-sky-600" />
                        <span>{authRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleNavClick('profile');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-sky-500/15 hover:text-sky-900 dark:hover:text-sky-300 transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'gu' ? 'પ્રોફાઇલ સેટિંગ્સ' : 'Profile Settings'}</span>
                      </button>
                      <div className="border-t border-slate-200/60 dark:border-white/10 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                            handleNavClick('home');
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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
                      handleNavClick('login');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{language === 'gu' ? 'લૉગિન' : 'Sign In'}</span>
                  </button>
                </div>
              )}

              {/* Collapse Navbar Button (Auto-hide trigger) */}
              <button
                type="button"
                onClick={() => setIsNavbarVisible(false)}
                className="hidden sm:flex p-1.5 rounded-xl bg-white/30 dark:bg-slate-800/50 hover:bg-white/45 border border-white/45 dark:border-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title={language === 'gu' ? 'નેવબાર છુપાવો' : 'Hide Navbar'}
                aria-label="Hide Navbar"
              >
                <ChevronUp className="w-4 h-4" />
              </button>

              {/* Mobile Menu Hamburger (for drawer) */}
              <button
                type="button"
                id="navbar-mobile-drawer-toggle"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden p-1.5 rounded-xl bg-white/30 dark:bg-slate-800/50 hover:bg-white/45 border border-white/45 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                aria-label="Open navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-sky-700 dark:text-sky-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-white/30 dark:border-white/10 pb-4 animate-in fade-in slide-in-from-top-4 duration-200">
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
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/40 dark:bg-slate-800/60 border border-white/50 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <Search className="w-4 h-4 text-sky-600 dark:text-sky-400 absolute left-3 top-2.5" />
              </form>

              <div className="grid grid-cols-2 gap-1.5">
                {/* Dashboard button on mobile */}
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) {
                      handleNavClick(authRole === 'admin' ? 'admin-dashboard' : 'user-dashboard');
                    } else {
                      setSelectedRole('user');
                      handleNavClick('login');
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-left transition-colors cursor-pointer ${
                    currentView === 'user-dashboard' || currentView === 'admin-dashboard'
                      ? 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/40 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{language === 'gu' ? 'ડેશબોર્ડ' : 'Dashboard'}</span>
                </button>

                {navLinks.map((link) => {
                  const isActive = currentView === link.id;
                  return (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => handleNavClick(link.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/40 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-800/50'
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
                <div className="mt-3 pt-3 border-t border-white/30 dark:border-white/10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('user');
                      handleNavClick('login');
                    }}
                    className="flex-1 py-2 rounded-xl bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/35 text-xs font-semibold text-center cursor-pointer"
                  >
                    {language === 'gu' ? 'યુઝર લૉગિન' : 'User Login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('admin');
                      handleNavClick('admin-login');
                    }}
                    className="flex-1 py-2 rounded-xl bg-white/30 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border border-white/40 dark:border-white/10 text-xs font-semibold text-center cursor-pointer"
                  >
                    {language === 'gu' ? 'એડમિન લૉગિન' : 'Admin Login'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

