import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  FileText,
  FileSpreadsheet,
  User,
  LogOut,
  Search,
  ArrowRight,
  Download,
  Clock,
  AlertCircle,
  FileCheck,
  Check,
  Phone,
  Mail,
  MapPin,
  Calendar,
  KeyRound,
  ShieldCheck,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus, ServiceItem } from '../../types';
import { DashboardHeader } from './DashboardHeader';
import { ApplicationDetailsModal } from './ApplicationDetailsModal';
import { ApplyServiceModal } from './ApplyServiceModal';
import { OfficeAddressCard } from './OfficeAddressCard';
import { QuickServiceCards } from './QuickServiceCards';
import { AnimatedCounter } from '../AnimatedCounter';
import { UserDocumentHub } from './UserDocumentHub';
import { sendPasswordReset } from '../../lib/firebase';
import { GlassFooter } from '../GlassFooter';

type UserTab = 'dashboard' | 'documents' | 'services' | 'myApplications' | 'myProfile';

export const UserDashboard: React.FC = () => {
  const {
    t,
    language,
    logout,
    currentUser,
    applications,
    services,
    agricultureServices,
    updateUserProfile,
    navigateToView,
  } = useApp();

  const getStatusLabel = (status: ApplicationStatus): string => {
    switch (status) {
      case 'Approved':
        return t?.status?.approved || (language === 'gu' ? 'મંજૂર' : 'Approved');
      case 'Completed':
        return t?.status?.completed || (language === 'gu' ? 'પૂર્ણ થયેલ' : 'Completed');
      case 'Processing':
        return t?.status?.processing || (language === 'gu' ? 'પ્રક્રિયા હેઠળ' : 'Processing');
      case 'Pending':
        return t?.status?.pending || (language === 'gu' ? 'બાકી' : 'Pending');
      case 'Document Required':
        return t?.status?.documentRequired || (language === 'gu' ? 'દસ્તાવેજ જરૂરી' : 'Document Required');
      case 'Rejected':
        return t?.status?.rejected || (language === 'gu' ? 'નામંજૂર' : 'Rejected');
      default:
        return status;
    }
  };

  const [activeTab, setActiveTab] = useState<UserTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // User-specific applications
  const userApplications = applications.filter((app) => app.applicantId === currentUser.id);

  // Modals
  const [selectedAppForModal, setSelectedAppForModal] = useState<Application | null>(null);
  const [serviceToApply, setServiceToApply] = useState<ServiceItem | null>(null);

  // Profile Form state
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [phoneInput, setPhoneInput] = useState(currentUser.phone);
  const [addressInput, setAddressInput] = useState(currentUser.address);
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Profile password reset state
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSendProfilePasswordReset = async () => {
    if (!currentUser.email) return;
    setIsResettingPassword(true);
    setResetStatus(null);
    try {
      await sendPasswordReset(currentUser.email);
      setResetStatus({
        type: 'success',
        message: `Password reset email dispatched to ${currentUser.email}. Follow the instructions to reset password.`,
      });
    } catch (err: any) {
      setResetStatus({
        type: 'error',
        message: err?.message || 'Could not send reset link. Please check your connection.',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Counts for user
  const totalUserApps = userApplications.length;
  const pendingUserApps = userApplications.filter((a) => a.status === 'Pending').length;
  const processingUserApps = userApplications.filter((a) => a.status === 'Processing').length;
  const approvedUserApps = userApplications.filter(
    (a) => a.status === 'Approved' || a.status === 'Completed'
  ).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: nameInput.trim(),
      phone: phoneInput.trim(),
      address: addressInput.trim(),
    });
    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 2500);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Document Required':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Rejected':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Essential Nav Items list
  const navItems = [
    { id: 'dashboard' as UserTab, label: t.userSidebar?.dashboard || 'Dashboard', icon: LayoutDashboard },
    { id: 'documents' as UserTab, label: language === 'gu' ? 'દસ્તાવેજો (Documents)' : 'Documents', icon: FolderOpen },
    { id: 'services' as UserTab, label: t.userSidebar?.availableServices || 'Services', icon: Layers },
    { id: 'myApplications' as UserTab, label: t.userSidebar?.myApplications || 'My Applications', icon: FileSpreadsheet, badge: userApplications.length },
    { id: 'myProfile' as UserTab, label: t.userSidebar?.myProfile || 'My Profile', icon: User },
  ];

  return (
    <div id="user-dashboard-container" className="min-h-screen flex flex-col bg-transparent text-slate-900 relative z-10 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <DashboardHeader
        role="user"
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden min-w-0 w-full max-w-full">
        {/* Left Sidebar */}
        <aside
          id="user-sidebar"
          className={`glass-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Navigation */}
          <div className="p-3 overflow-y-auto space-y-1">
            {/* Sidebar Official Logo Branding (55-70px tall, no extra text, navigates to Home) */}
            <button
              type="button"
              id="user-sidebar-logo-btn"
              onClick={() => navigateToView('home')}
              className="w-full flex items-center justify-center p-3 mb-2 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs hover:bg-white/90 transition-all cursor-pointer group"
              title="Shiv Computer — Home"
              aria-label="Go to Home"
            >
              <div className="h-16 w-16 sm:h-[66px] sm:w-[66px] flex items-center justify-center relative overflow-hidden transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Shiv Computer"
                  className="w-full h-full object-contain filter drop-shadow-md relative z-5"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'gu' ? 'મેનૂ' : 'Navigation'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`user-nav-${item.id}`}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'btn-glossy-primary shadow-xs'
                      : 'text-slate-700  hover:bg-white/60 '
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200  text-slate-700 '
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Sign Out footer */}
          <div className="p-3 border-t border-slate-200/80 shrink-0">
            <button
              id="user-logout-button"
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{t.userSidebar?.logout || 'Sign Out'}</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6 min-w-0 max-w-full">
          {/* Top Shiv Computer Brand Header (Prominently displayed after login) */}
          <div
            id="user-dashboard-top-brand"
            className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-linear-to-r from-white/80 via-sky-50/70 to-cyan-50/80 border border-white/80 backdrop-blur-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                id="user-dash-brand-logo-btn"
                onClick={() => navigateToView('home')}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/70 p-1 flex items-center justify-center border border-white/80 shadow-xs shrink-0 cursor-pointer hover:scale-105 transition-transform"
                title="Shiv Computer — Home"
                aria-label="Go to Home"
              >
                <img
                  src="/logo.png"
                  alt="Shiv Computer Logo"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight bg-linear-to-r from-sky-950 via-sky-800 to-cyan-600 bg-clip-text text-transparent">
                    {language === 'gu' ? 'ડિજિટલ સેવા પોર્ટલ' : 'Citizen Services Portal'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-sky-500/15 text-sky-800 border border-sky-400/30">
                    {language === 'gu' ? 'ઑનલાઇન' : 'Online'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium truncate mt-0.5">
                  {language === 'gu'
                    ? 'તમામ ઓનલાઇન ફોર્મ્સ, ખેડૂત યોજનાઓ અને સરકારી સેવાઓ'
                    : 'Online Forms, Agriculture Schemes & Government Services'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/70 border border-white/80 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{currentUser.name || (language === 'gu' ? 'વપરાશકર્તા' : 'User')}</span>
              </div>
            </div>
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/70 border border-slate-200/80 backdrop-blur-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-700 border border-sky-500/25">
                      {language === 'gu' ? 'યુઝર એકાઉન્ટ' : 'User Account'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    {language === 'gu'
                      ? `સ્વાગત છે, ${currentUser.name || 'યુઝર'}`
                      : `Welcome, ${currentUser.name || 'User'}`}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {language === 'gu'
                      ? 'શિવ કમ્પ્યુટર ઑનલાઇન પોર્ટલ પર આપનું સ્વાગત છે. સત્તાવાર દસ્તાવેજો ડાઉનલોડ કરો અને સેવાઓ માટે અરજી કરો.'
                      : 'Access official documents uploaded by Admin, apply for digital services, and track your applications in real-time.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className="btn-glossy-primary px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-sky-500/20 active:scale-95 self-start sm:self-center"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>{language === 'gu' ? 'દસ્તાવેજો જુઓ' : 'Browse Documents'}</span>
                </button>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
                  <div className="text-xs text-slate-500">Total Applications</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    <AnimatedCounter value={totalUserApps} />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
                  <div className="text-xs text-amber-600">Pending Review</div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                    <AnimatedCounter value={pendingUserApps} />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
                  <div className="text-xs text-blue-600">In Processing</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                    <AnimatedCounter value={processingUserApps} />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
                  <div className="text-xs text-emerald-600">Approved</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                    <AnimatedCounter value={approvedUserApps} />
                  </div>
                </div>
              </div>

              {/* Quick Services */}
              <QuickServiceCards onSelectService={(s) => setServiceToApply(s)} />

              {/* Office Details Card */}
              <OfficeAddressCard />
            </div>
          )}

          {/* TAB 2: DOCUMENTS & FORMS (UPLOADED BY ADMIN) */}
          {activeTab === 'documents' && (
            <UserDocumentHub language={language} />
          )}

          {/* TAB 3: SERVICES CATALOG & APPLY */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {language === 'gu' ? 'ઉપલબ્ધ સેવાઓ' : 'Available Services'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  {language === 'gu'
                    ? 'ડિજિટલ ગુજરાત, પાન કાર્ડ, રેશન કાર્ડ અને ખેતીવાડી યોજનાઓ માટે અરજી કરો.'
                    : 'Apply for Digital Gujarat, PAN Card, Ration Card, Land records, and Farmer subsidies.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...services, ...agricultureServices].filter((s) => s.enabled).map((service) => (
                  <div
                    key={service.id}
                    className="service-gloss-card p-5 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-sky-600 font-bold mb-1">
                        <span className="truncate pr-2">{service.department}</span>
                        <span className="font-extrabold text-slate-900 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30 shrink-0">
                          ₹{service.fee}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">
                        {service.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                        <div>Processing: <strong className="text-slate-800">{service.processingTime}</strong></div>
                        <div className="text-[11px] text-slate-400 truncate">
                          Required: {service.requiredDocuments.join(', ')}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setServiceToApply(service)}
                      className="btn-glossy-primary w-full py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MY APPLICATIONS */}
          {activeTab === 'myApplications' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  My Submitted Applications
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Track live progress and review submitted applications.
                </p>
              </div>

              <div className="space-y-3">
                {userApplications.length === 0 ? (
                  <div className="p-12 text-center bg-white/70 rounded-3xl border border-slate-200 text-slate-400">
                    <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-sm">No applications submitted yet.</p>
                    <p className="text-xs mt-1">Browse services to submit your first application.</p>
                  </div>
                ) : (
                  userApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-3xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-600">{app.id}</span>
                          <span className="font-bold text-sm text-slate-900">{app.serviceName}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Submitted on {app.applicationDate} • Fee: ₹{app.fee} ({app.paymentStatus})
                        </div>
                        {app.adminNotes && (
                          <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200/50 mt-1">
                            Note from Admin: {app.adminNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(app.status)}`}>
                          {getStatusLabel(app.status)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedAppForModal(app)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-600 hover:text-white text-xs font-semibold transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MY PROFILE */}
          {activeTab === 'myProfile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  User Profile & Account Security
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Update personal contact details and manage Firebase Authentication credentials.
                </p>
              </div>

              <form
                onSubmit={handleSaveProfile}
                className="max-w-xl p-5 sm:p-6 rounded-3xl bg-white/80 border border-slate-200/80 shadow-xs space-y-4 text-xs sm:text-sm backdrop-blur-md"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.username ? `@${currentUser.username}` : '@user'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Address
                  </label>
                  <textarea
                    rows={2}
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {profileSavedNotice && (
                    <span className="text-xs text-emerald-600 font-semibold animate-in fade-in">
                      Profile updated successfully!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="ml-auto btn-glossy-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>

              {/* Account Security & Password Recovery */}
              <div
                id="user-account-security-card"
                className="max-w-xl p-5 sm:p-6 rounded-3xl bg-white/80 border border-slate-200/80 shadow-xs space-y-3.5 text-xs sm:text-sm backdrop-blur-md"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/20">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Password & Credentials
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Firebase Authentication password recovery
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  Send a password reset email to your registered account ({currentUser.email || 'your email'}) using Firebase Auth.
                </p>

                {resetStatus && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                      resetStatus.type === 'success'
                        ? 'bg-emerald-50  border-emerald-200  text-emerald-800 '
                        : 'bg-amber-50  border-amber-300  text-amber-900 '
                    }`}
                  >
                    {resetStatus.type === 'success' ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span>{resetStatus.message}</span>
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    id="user-send-password-reset-btn"
                    onClick={handleSendProfilePasswordReset}
                    disabled={isResettingPassword || !currentUser.email}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    {isResettingPassword ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Firebase Reset Link...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 text-sky-600" />
                        <span>Send Password Reset Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Dedicated Glass Footer on User Dashboard */}
          <div className="pt-8">
            <GlassFooter />
          </div>
        </main>
      </div>

      {/* Application Details Modal */}
      {selectedAppForModal && (
        <ApplicationDetailsModal
          application={selectedAppForModal}
          role="user"
          onClose={() => setSelectedAppForModal(null)}
        />
      )}

      {/* Apply For Service Modal */}
      {serviceToApply && (
        <ApplyServiceModal
          isOpen={!!serviceToApply}
          service={serviceToApply}
          onClose={() => setServiceToApply(null)}
          onSuccess={(createdApp) => {
            setSelectedAppForModal(createdApp);
            setActiveTab('myApplications');
          }}
        />
      )}
    </div>
  );
};
