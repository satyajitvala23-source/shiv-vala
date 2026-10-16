import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Check,
  ChevronDown,
  ChevronUp,
  LogOut,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  Search,
  Home,
  Briefcase,
  FileText,
  FolderOpen,
  CheckCircle2,
  CreditCard,
  Info,
  Phone,
  LayoutDashboard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../translations';
import { CurrentView, LanguageCode, LoginRole } from '../../types';

interface DashboardHeaderProps {
  role: LoginRole;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  role,
  onToggleSidebar,
  isSidebarOpen,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}) => {
  const {
    t,
    language,
    setLanguage,
    theme,
    toggleTheme,
    currentUser,
    notifications,
    markNotificationAsRead,
    logout,
    currentView,
    isNavbarVisible,
    setIsNavbarVisible,
    navigateToView,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Filter notifications for this role
  const roleNotifications = notifications.filter(
    (n) => n.targetRole === 'all' || n.targetRole === role || (role === 'user' && n.userId === currentUser.id)
  );
  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  const currentSearchValue = searchValue !== undefined ? searchValue : internalSearch;
  const handleSearchInput = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  const defaultSearchPlaceholder =
    language === 'gu' ? 'સેવા / ફોર્મ શોધો...' : 'Search forms & services...';

  // Navigate to any view: closes mobile drawer and auto-collapses top navbar as requested
  const handleNavClick = (view: CurrentView) => {
    setIsMobileNavOpen(false);
    navigateToView(view);
    setIsNavbarVisible(false);
  };

  // Navigation links — matching public GlassNavbar
  const navLinks: { id: CurrentView; label: string; labelGu: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', labelGu: 'હોમ', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Services', labelGu: 'સેવાઓ', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'forms', label: 'Forms', labelGu: 'ફોર્મ્સ', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'documents', label: 'Documents', labelGu: 'દસ્તાવેજો', icon: <FolderOpen className="w-3.5 h-3.5" /> },
    { id: 'applications', label: 'Track Status', labelGu: 'સ્ટેટસ ટ્રેક', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'payments', label: 'Payments', labelGu: 'પેમેન્ટ્સ', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About', labelGu: 'અમારા વિશે', icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact', labelGu: 'સંપર્ક', icon: <Phone className="w-3.5 h-3.5" /> },
  ];

  // If navbar is collapsed, render small floating menu hamburger button
  if (!isNavbarVisible) {
    return (
      <div className="fixed top-3 left-3 sm:left-5 z-50 flex items-center gap-2">
        {onToggleSidebar && (
          <button
            type="button"
            id="dashboard-floating-sidebar-btn"
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-sky-950/10 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle Sidebar"
            title={language === 'gu' ? 'સાઇડબાર' : 'Sidebar'}
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
            <span className="text-xs font-semibold">{language === 'gu' ? 'સાઇડબાર' : 'Sidebar'}</span>
          </button>
        )}
        <button
          id="dashboard-show-nav-btn"
          type="button"
          onClick={() => setIsNavbarVisible(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-sky-950/10 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open Navigation Menu"
          title={language === 'gu' ? 'નેવિગેશન મેનૂ ખોલો' : 'Open Navigation Menu'}
        >
          <Menu className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-bold bg-linear-to-r from-sky-900 via-sky-700 to-cyan-600 dark:from-sky-300 dark:to-cyan-400 bg-clip-text text-transparent">
            {language === 'gu' ? 'મેનૂ' : 'Menu'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <header
      id="dashboard-header-bar"
      className={`glass-navbar sticky top-0 z-30 w-full max-w-full transition-all duration-200 ${
        isScrolled ? 'shadow-md shadow-sky-900/8' : ''
      }`}
    >
      {/* ── Top Row: Brand + Nav Links + Controls ── */}
      <div className="px-3 sm:px-5 py-2 flex items-center justify-between gap-2 min-w-0">

        {/* Left: Mobile sidebar toggle + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sidebar hamburger (mobile only) */}
          <button
            type="button"
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-white/10 transition-colors shrink-0"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Official Shiv Computer Logo (Prominent 55-60px tall, no extra text, navigates to Home) */}
          <button
            type="button"
            id="dash-header-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center group cursor-pointer focus:outline-none shrink-0"
            aria-label="Go to Home"
            title="Shiv Computer — Home"
          >
            <div className="h-11 sm:h-13 md:h-[58px] w-auto max-w-[160px] flex items-center justify-center relative shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Shiv Computer Logo"
                className="h-full w-auto object-contain filter drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>

          {/* Role Badge */}
          {role === 'admin' ? (
            <div
              id="header-role-badge"
              className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-900 dark:text-sky-300 border border-sky-400/35 shadow-xs backdrop-blur-xs whitespace-nowrap"
            >
              <ShieldCheck className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>Admin</span>
            </div>
          ) : (
            <div
              id="header-role-badge"
              className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-900 dark:text-sky-300 border border-sky-400/35 shadow-xs backdrop-blur-xs whitespace-nowrap"
            >
              <UserCheck className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>User</span>
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-0.5" aria-label="Dashboard navigation">
          {/* Dashboard shortcut */}
          <button
            type="button"
            id="dash-header-nav-dashboard"
            onClick={() => handleNavClick(role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              (currentView === 'admin-dashboard' || currentView === 'user-dashboard')
                ? 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/40 shadow-xs shadow-sky-500/10'
                : 'text-slate-700 dark:text-slate-300 hover:text-sky-900 dark:hover:text-sky-200 hover:bg-white/40 dark:hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                id={`dash-header-nav-${link.id}`}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/40 shadow-xs shadow-sky-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:text-sky-900 dark:hover:text-sky-200 hover:bg-white/40 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.icon}
                <span>{language === 'gu' ? link.labelGu : link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Search + Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Desktop Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNavClick('services');
            }}
            className="hidden md:flex relative items-center"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              id="navbar-search-input"
              type="text"
              value={currentSearchValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder={searchPlaceholder || defaultSearchPlaceholder}
              className="glass-input w-40 lg:w-52 xl:w-44 2xl:w-56 pl-8 pr-7 py-1.5 text-xs rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
            />
            {currentSearchValue && (
              <button
                type="button"
                onClick={() => handleSearchInput('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              id="dash-language-button"
              onClick={() => setIsLangOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              title={language === 'gu' ? 'ભાષા પસંદ કરો' : 'Select Language'}
            >
              <span className="text-sm leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline font-semibold text-[11px]">{currentLang.code.toUpperCase()}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div
                id="dash-language-menu"
                className="glass-dropdown absolute right-0 mt-2 w-40 rounded-2xl py-1.5 z-50 animate-in fade-in zoom-in-95"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-white/10">
                  {language === 'gu' ? 'ભાષા' : 'Language'}
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    id={`dash-lang-option-${lang.code}`}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                      lang.code === language
                        ? 'bg-blue-50/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </span>
                    {lang.code === language && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark/Light Mode Toggle */}
          <button
            type="button"
            id="theme-toggle-button"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="notifications-toggle-button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer"
              aria-label="View notifications"
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
                id="notifications-dropdown-menu"
                className="glass-dropdown absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl py-3 z-50 animate-in fade-in zoom-in-95"
              >
                <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                    {language === 'gu' ? 'સૂચનાઓ' : 'Notifications'} ({roleNotifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                      {unreadCount} {language === 'gu' ? 'નવી' : 'new'}
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                  {roleNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {language === 'gu' ? 'કોઈ નવી સૂચનાઓ નથી' : 'No new notifications'}
                    </div>
                  ) : (
                    roleNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3.5 hover:bg-slate-100/50 dark:hover:bg-white/5 cursor-pointer transition-colors ${
                          !n.read ? 'bg-blue-500/10 dark:bg-blue-500/10' : ''
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

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              id="user-profile-menu-button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {role === 'admin' ? 'A' : currentUser.name.charAt(0)}
              </div>
              <span className="hidden lg:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                {role === 'admin' ? 'Admin' : (currentUser.name || 'User')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div
                id="user-profile-dropdown-menu"
                className="glass-dropdown absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95"
              >
                <div className="p-2 border-b border-slate-100 dark:border-white/10 mb-1">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">
                    {currentUser.name || (role === 'admin' ? 'Admin' : 'User')}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.email || (role === 'admin' ? 'Admin' : 'User')}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    id="header-logout-btn"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{role === 'admin' ? t.adminSidebar.logout : t.userSidebar.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collapse Navbar Button */}
          <button
            type="button"
            id="dash-header-collapse-btn"
            onClick={() => setIsNavbarVisible(false)}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer"
            title={language === 'gu' ? 'નેવબાર છુપાવો' : 'Hide Navbar'}
            aria-label="Hide Navbar"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Mobile nav hamburger (for nav links — separate from sidebar toggle) */}
          <button
            type="button"
            id="mobile-nav-menu-toggle"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation links"
          >
            {isMobileNavOpen ? <X className="w-4 h-4 text-sky-700" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile / Tablet Nav Drawer (Navigation Links + Search) ── */}
      {isMobileNavOpen && (
        <div className="xl:hidden px-3 pb-4 pt-2 border-t border-white/30 dark:border-white/10 animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Mobile Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNavClick('services');
            }}
            className="relative mb-3"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={currentSearchValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder={searchPlaceholder || defaultSearchPlaceholder}
              className="glass-input w-full pl-9 pr-8 py-2 text-xs rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none"
            />
            {currentSearchValue && (
              <button
                type="button"
                onClick={() => handleSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Mobile Nav Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {/* Dashboard shortcut */}
            <button
              type="button"
              onClick={() => handleNavClick(role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                (currentView === 'admin-dashboard' || currentView === 'user-dashboard')
                  ? 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{language === 'gu' ? 'ડેશબોર્ડ' : 'Dashboard'}</span>
            </button>

            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.icon}
                  <span>{language === 'gu' ? link.labelGu : link.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
