import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
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
    setIsNavbarVisible,
    navigateToView,
    isAuthenticated,
    authRole,
    currentUser,
    logout,
    language,
    setLanguage,
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
      setIsScrolled(window.scrollY > 15);
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
      {/* ── Top Light-Theme Glass Navbar ── */}
      <header
        id="main-glass-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 translate-y-0 opacity-100 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-[#D8E8F5] shadow-xs py-2 sm:py-2.5'
            : 'bg-white/85 backdrop-blur-md border-b border-[#D8E8F5]/80 py-2 sm:py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">

            {/* Shiv Computer Logo & Brand Name (navigates to Home) */}
            <button
              id="navbar-logo-btn"
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none shrink-0"
              aria-label="Go to Home"
              title="Shiv Computer — Home"
            >
              <div className="h-12 sm:h-14 lg:h-[56px] w-auto flex items-center justify-center relative shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Shiv Computer Logo"
                  className="h-full w-auto object-contain filter drop-shadow-xs"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-base sm:text-lg lg:text-xl text-[#243447] tracking-tight leading-none group-hover:text-[#2196F3] transition-colors">
                  Shiv Computer
                </span>
                <span className="text-[10px] text-[#64748B] font-semibold tracking-wide mt-1 hidden sm:block leading-none">
                  Your Work Our Responsibility
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
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
                    ? 'bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 shadow-xs'
                    : 'text-[#243447] hover:text-[#2196F3] hover:bg-[#EAF5FF]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#2196F3]" />
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
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#F5FAFF] hover:bg-white border border-[#D8E8F5] text-[#243447] placeholder-[#64748B] focus:outline-none focus:border-[#2196F3] focus:bg-white shadow-xs transition-all"
                />
                <Search className="w-3.5 h-3.5 text-[#2196F3] absolute left-2.5 pointer-events-none" />
              </form>

              {/* Language Selector Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  id="navbar-language-toggle"
                  onClick={() => setIsLangOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-xs font-semibold text-[#243447] transition-all cursor-pointer"
                  aria-label="Change Language"
                >
                  <span className="text-sm">{currentLangObj.flag}</span>
                  <span className="hidden sm:inline font-bold">{currentLangObj.code.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 text-[#64748B]" />
                </button>

                {isLangOpen && (
                  <div
                    id="navbar-language-menu"
                    className="absolute right-0 mt-2 w-40 bg-white border border-[#D8E8F5] shadow-lg rounded-2xl py-1.5 z-50 animate-in fade-in zoom-in-95"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                          language === l.code
                            ? 'bg-[#EAF5FF] text-[#2196F3] font-bold'
                            : 'text-[#243447] hover:bg-[#F5FAFF]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeLabel}</span>
                        </span>
                        {language === l.code && <Check className="w-3 h-3 text-[#2196F3]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Button */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  id="navbar-notif-toggle"
                  onClick={() => setIsNotifOpen((prev) => !prev)}
                  className="relative p-1.5 sm:p-2 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-[#243447] transition-colors cursor-pointer"
                  aria-label="View notifications"
                  title="Notifications"
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
                    id="navbar-notifications-menu"
                    className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl py-3 z-50 animate-in fade-in zoom-in-95 bg-white border border-[#D8E8F5] shadow-xl"
                  >
                    <div className="px-4 pb-2.5 border-b border-[#D8E8F5] flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#243447]">
                        {language === 'gu' ? 'સૂચનાઓ' : 'Notifications'} ({notifications.length})
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-semibold text-[#2196F3] bg-[#EAF5FF] px-2 py-0.5 rounded-full border border-[#2196F3]/20">
                          {unreadCount} {language === 'gu' ? 'નવી' : 'new'}
                        </span>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[#D8E8F5]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#64748B]">
                          {language === 'gu' ? 'કોઈ નવી સૂચનાઓ નથી' : 'No new notifications'}
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
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

              {/* User Profile / Login Button */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    id="navbar-profile-toggle"
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-[#EAF5FF] border border-[#2196F3]/30 text-[#2196F3] text-xs font-semibold hover:border-[#2196F3] transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#2196F3]/20 border border-[#2196F3]/30 flex items-center justify-center text-[11px] font-bold text-[#2196F3]">
                      {authRole === 'admin' ? 'A' : (currentUser?.name?.charAt(0) || 'U')}
                    </div>
                    <span className="max-w-[80px] truncate hidden sm:inline text-[#243447] font-bold">
                      {authRole === 'admin' ? 'Admin' : (currentUser?.name || 'User')}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#2196F3]" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 p-2 z-50 animate-in fade-in zoom-in-95 bg-white border border-[#D8E8F5] shadow-xl rounded-2xl">
                      <div className="p-2 border-b border-[#D8E8F5] mb-1">
                        <div className="font-semibold text-xs text-[#243447]">
                          {authRole === 'admin' ? 'Administrator' : currentUser?.name || 'User'}
                        </div>
                        <div className="text-[11px] text-[#2196F3] truncate">
                          {currentUser?.email || (authRole === 'admin' ? 'Admin' : 'User')}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleNavClick(authRole === 'admin' ? 'admin-dashboard' : 'user-dashboard');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-[#243447] hover:bg-[#EAF5FF] hover:text-[#2196F3] transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#2196F3]" />
                        <span>{authRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleNavClick('profile');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-[#243447] hover:bg-[#EAF5FF] hover:text-[#2196F3] transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-[#2196F3]" />
                        <span>{language === 'gu' ? 'પ્રોફાઇલ સેટિંગ્સ' : 'Profile Settings'}</span>
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
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2196F3] to-[#0288D1] text-white text-xs font-semibold shadow-md shadow-[#2196F3]/25 hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{language === 'gu' ? 'લૉગિન' : 'Sign In'}</span>
                  </button>
                </div>
              )}

              {/* Collapse Navbar Button */}
              <button
                type="button"
                onClick={() => setIsNavbarVisible(false)}
                className="hidden sm:flex p-1.5 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-[#64748B] hover:text-[#243447] transition-colors cursor-pointer"
                title={language === 'gu' ? 'નેવબાર છુપાવો' : 'Hide Navbar'}
                aria-label="Hide Navbar"
              >
                <ChevronUp className="w-4 h-4" />
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                id="navbar-mobile-drawer-toggle"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden p-1.5 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-[#243447] transition-colors cursor-pointer"
                aria-label="Open navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#2196F3]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-[#D8E8F5] pb-4 animate-in fade-in slide-in-from-top-4 duration-200">
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
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] placeholder-[#64748B] focus:outline-none focus:border-[#2196F3] focus:bg-white"
                />
                <Search className="w-4 h-4 text-[#2196F3] absolute left-3 top-2.5" />
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
                      ? 'bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 font-semibold'
                      : 'text-[#243447] hover:bg-[#EAF5FF]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#2196F3]" />
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

              {/* Quick Admin / User Login links if not authenticated */}
              {!isAuthenticated && (
                <div className="mt-3 pt-3 border-t border-[#D8E8F5] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('user');
                      handleNavClick('login');
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 text-xs font-semibold text-center cursor-pointer"
                  >
                    {language === 'gu' ? 'યુઝર લૉગિન' : 'User Login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('admin');
                      handleNavClick('admin-login');
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#F5FAFF] text-[#243447] border border-[#D8E8F5] text-xs font-semibold text-center cursor-pointer"
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
