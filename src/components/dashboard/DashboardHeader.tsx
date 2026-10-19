import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
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
import { CurrentView, LoginRole } from '../../types';

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
    currentUser,
    notifications,
    markNotificationAsRead,
    logout,
    currentView,
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
    (n) => n.role === 'all' || n.role === role
  );
  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  const handleNavClick = (view: CurrentView) => {
    setIsMobileNavOpen(false);
    navigateToView(view);
  };

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

  return (
    <header
      id="dashboard-header-bar"
      className={`sticky top-0 z-30 w-full max-w-full bg-white/95 backdrop-blur-xl border-b border-[#D8E8F5] transition-all duration-200 ${
        isScrolled ? 'shadow-xs' : ''
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
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[#243447] hover:bg-[#EAF5FF] border border-[#D8E8F5] transition-colors shrink-0"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-[#2196F3]" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Official Shiv Computer Logo (navigates to Home) */}
          <button
            type="button"
            id="dash-header-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center group cursor-pointer focus:outline-none shrink-0"
            aria-label="Go to Home"
            title="Shiv Computer — Home"
          >
            <div className="h-10 sm:h-12 md:h-[52px] w-auto max-w-[150px] flex items-center justify-center relative shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Shiv Computer Logo"
                className="h-full w-auto object-contain filter drop-shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>

          {/* Role Badge */}
          {role === 'admin' ? (
            <div
              id="header-role-badge"
              className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 shadow-xs whitespace-nowrap"
            >
              <ShieldCheck className="w-3 h-3 text-[#2196F3]" />
              <span>Admin</span>
            </div>
          ) : (
            <div
              id="header-role-badge"
              className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 shadow-xs whitespace-nowrap"
            >
              <UserCheck className="w-3 h-3 text-[#2196F3]" />
              <span>User</span>
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Dashboard navigation">
          {/* Dashboard shortcut */}
          <button
            type="button"
            id="dash-header-nav-dashboard"
            onClick={() => handleNavClick(role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              (currentView === 'admin-dashboard' || currentView === 'user-dashboard')
                ? 'bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 shadow-xs'
                : 'text-[#243447] hover:text-[#2196F3] hover:bg-[#EAF5FF]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#2196F3]" />
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
                    ? 'bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 shadow-xs'
                    : 'text-[#243447] hover:text-[#2196F3] hover:bg-[#EAF5FF]'
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            <input
              id="navbar-search-input"
              type="text"
              placeholder={searchPlaceholder || t.searchServices}
              value={searchValue !== undefined ? searchValue : internalSearch}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                else setInternalSearch(e.target.value);
              }}
              className="w-36 lg:w-48 pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] placeholder-[#64748B] focus:outline-none focus:border-[#2196F3] focus:bg-white shadow-xs transition-all"
            />
          </form>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              id="language-select-button"
              onClick={() => setIsLangOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#243447] hover:bg-[#EAF5FF] border border-[#D8E8F5] transition-all cursor-pointer bg-[#F5FAFF]"
              aria-label="Change language"
            >
              <span className="text-sm leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline font-bold">{currentLang.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            {isLangOpen && (
              <div
                id="language-dropdown-menu"
                className="absolute right-0 mt-2 w-44 rounded-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 bg-white border border-[#D8E8F5] shadow-lg"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                      lang.code === language
                        ? 'bg-[#EAF5FF] text-[#2196F3] font-semibold'
                        : 'text-[#243447] hover:bg-[#F5FAFF]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </span>
                    {lang.code === language && <Check className="w-3.5 h-3.5 text-[#2196F3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="notifications-toggle-button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-1.5 sm:p-2 rounded-xl text-[#243447] hover:bg-[#EAF5FF] border border-[#D8E8F5] transition-all active:scale-[0.98] cursor-pointer bg-[#F5FAFF]"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-[#2196F3]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-extrabold shadow-xs ring-1 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div
                id="notifications-dropdown-menu"
                className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl py-3 z-50 animate-in fade-in zoom-in-95 bg-white border border-[#D8E8F5] shadow-xl"
              >
                <div className="px-4 pb-2.5 border-b border-[#D8E8F5] flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#243447]">
                    {language === 'gu' ? 'સૂચનાઓ' : 'Notifications'} ({roleNotifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-[#2196F3] bg-[#EAF5FF] px-2 py-0.5 rounded-full border border-[#2196F3]/20">
                      {unreadCount} {language === 'gu' ? 'નવી' : 'new'}
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#D8E8F5]">
                  {roleNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#64748B]">
                      {language === 'gu' ? 'કોઈ નવી સૂચનાઓ નથી' : 'No new notifications'}
                    </div>
                  ) : (
                    roleNotifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3.5 hover:bg-[#F5FAFF] cursor-pointer transition-colors ${
                          !n.read ? 'bg-[#EAF5FF]/60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs text-[#243447]">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-[#64748B] shrink-0">{n.date}</span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
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
              id="profile-toggle-button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-[#EAF5FF] border border-[#2196F3]/30 text-[#2196F3] text-xs font-semibold hover:border-[#2196F3] transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-[#2196F3]/20 border border-[#2196F3]/30 flex items-center justify-center text-[11px] font-bold text-[#2196F3]">
                {role === 'admin' ? 'A' : (currentUser?.name?.charAt(0) || 'U')}
              </div>
              <span className="max-w-[80px] truncate hidden sm:inline text-[#243447] font-bold">
                {role === 'admin' ? 'Admin' : (currentUser?.name || 'User')}
              </span>
              <ChevronDown className="w-3 h-3 text-[#2196F3]" />
            </button>

            {isProfileOpen && (
              <div
                id="profile-dropdown-menu"
                className="absolute right-0 mt-2 w-56 p-2 z-50 animate-in fade-in zoom-in-95 bg-white border border-[#D8E8F5] shadow-xl rounded-2xl"
              >
                <div className="p-2 border-b border-[#D8E8F5] mb-1">
                  <div className="font-semibold text-xs text-[#243447]">
                    {role === 'admin' ? 'Administrator' : currentUser?.name || 'User'}
                  </div>
                  <div className="text-[11px] text-[#2196F3] truncate">
                    {currentUser?.email || (role === 'admin' ? 'Admin' : 'User')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleNavClick(role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-[#243447] hover:bg-[#EAF5FF] hover:text-[#2196F3] transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#2196F3]" />
                  <span>{role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</span>
                </button>
                <div className="border-t border-[#D8E8F5] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                      handleNavClick('home');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.logoutButton || 'Log Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hide Navbar Shortcut */}
          <button
            type="button"
            id="dash-header-hide-nav-btn"
            onClick={() => setIsNavbarVisible(false)}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-[#64748B] hover:text-[#243447] hover:bg-[#EAF5FF] border border-[#D8E8F5] transition-all cursor-pointer bg-[#F5FAFF]"
            title={language === 'gu' ? 'નેવબાર છુપાવો' : 'Hide Navigation'}
            aria-label="Hide Navigation"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Mobile menu toggle button */}
          <button
            type="button"
            id="dash-header-mobile-menu-btn"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl text-[#243447] hover:bg-[#EAF5FF] border border-[#D8E8F5] transition-all cursor-pointer bg-[#F5FAFF]"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X className="w-4 h-4 text-[#2196F3]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {isMobileNavOpen && (
        <div
          id="dash-header-mobile-nav"
          className="xl:hidden px-3 sm:px-5 py-3 border-t border-[#D8E8F5] bg-white animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Mobile search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNavClick('services');
            }}
            className="mb-2 relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder || t.searchServices}
              value={searchValue !== undefined ? searchValue : internalSearch}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                else setInternalSearch(e.target.value);
              }}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] placeholder-[#64748B] focus:outline-none focus:border-[#2196F3] focus:bg-white"
            />
          </form>

          {/* Mobile nav links grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleNavClick(role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-left transition-colors cursor-pointer ${
                (currentView === 'admin-dashboard' || currentView === 'user-dashboard')
                  ? 'bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 font-semibold'
                  : 'text-[#243447] hover:bg-[#EAF5FF]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#2196F3]" />
              <span>Dashboard</span>
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
                      ? 'bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 font-semibold'
                      : 'text-[#243447] hover:bg-[#EAF5FF]'
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
