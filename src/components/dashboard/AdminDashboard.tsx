import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  FileSpreadsheet,
  Layers,
  Users,
  Settings,
  LogOut,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  IndianRupee,
  KeyRound,
  Lock,
  ShieldCheck,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Application,
  ApplicationStatus,
  ServiceItem,
} from '../../types';
import { updateAccountPassword, sendFirebasePasswordResetEmail } from '../../lib/auth';
import { DashboardHeader } from './DashboardHeader';
import { ApplicationDetailsModal } from './ApplicationDetailsModal';
import { ServiceModal } from './ServiceModal';
import { OfficeAddressCard } from './OfficeAddressCard';
import { AnimatedCounter } from '../AnimatedCounter';
import { AdminDocumentManager } from './AdminDocumentManager';
import { GlassFooter } from '../GlassFooter';

type AdminTab = 'dashboard' | 'documents' | 'applications' | 'services' | 'users' | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    t,
    language,
    logout,
    currentUser,
    applications,
    services,
    agricultureServices,
    users,
    payments,
    deleteService,
    addService,
    updateService,
    toggleUserStatus,
    updateUser,
    updateApplicationStatus,
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

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [selectedAppForModal, setSelectedAppForModal] = useState<Application | null>(null);
  const [serviceModalState, setServiceModalState] = useState<{
    isOpen: boolean;
    serviceToEdit: ServiceItem | null;
    category: 'general' | 'agriculture';
  }>({
    isOpen: false,
    serviceToEdit: null,
    category: 'general',
  });

  // Filter & Search states
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');

  // Password state for Admin
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [passUpdateMsg, setPassUpdateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [resetEmailSentMsg, setResetEmailSentMsg] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassUpdateMsg(null);
    if (!adminNewPass) {
      setPassUpdateMsg({ type: 'error', text: 'Please enter a new password.' });
      return;
    }
    if (adminNewPass.length < 6) {
      setPassUpdateMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (adminNewPass !== adminConfirmPass) {
      setPassUpdateMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsUpdatingPass(true);
    try {
      await updateAccountPassword(adminNewPass);
      setPassUpdateMsg({
        type: 'success',
        text: 'Admin password updated successfully in Firebase Authentication.',
      });
      setAdminNewPass('');
      setAdminConfirmPass('');
    } catch (err: any) {
      setPassUpdateMsg({
        type: 'error',
        text: err?.message || 'Could not update password. Please re-authenticate and try again.',
      });
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleSendAdminResetEmail = async () => {
    setIsSendingResetEmail(true);
    setResetEmailSentMsg(null);
    try {
      const email = currentUser?.email || 'satyajitvala23@gmail.com';
      await sendFirebasePasswordResetEmail(email);
      setResetEmailSentMsg(`A password reset link has been dispatched to: ${email}`);
    } catch (err: any) {
      alert(`Could not send reset link: ${err?.message || 'Network error'}`);
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  // Metrics
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.status === 'Pending').length;
  const processingApps = applications.filter((a) => a.status === 'Processing').length;
  const completedApps = applications.filter((a) => a.status === 'Completed' || a.status === 'Approved').length;
  const totalRevenue = payments.reduce((acc, p) => acc + (p.status === 'Successful' ? p.amount : 0), 0);

  // Application filtering
  const filteredApps = applications.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.applicantName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.applicantPhone.includes(appSearch);
    const matchesStatus = appStatusFilter === 'all' || a.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // User filtering
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(userSearch.toLowerCase())) ||
      u.phone.includes(userSearch)
  );

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

  // Nav Items list
  const navItems = [
    { id: 'dashboard' as AdminTab, label: t.adminSidebar?.dashboard || 'Dashboard', icon: LayoutDashboard },
    { id: 'documents' as AdminTab, label: language === 'gu' ? 'દસ્તાવેજ વ્યવસ્થાપન' : 'Document Manager', icon: FolderOpen },
    { id: 'applications' as AdminTab, label: t.adminSidebar?.applications || 'Applications', icon: FileSpreadsheet, badge: pendingApps },
    { id: 'services' as AdminTab, label: t.adminSidebar?.services || 'Services', icon: Layers },
    { id: 'users' as AdminTab, label: language === 'gu' ? 'યુઝર્સ (Users)' : 'Users', icon: Users, badge: users.length },
    { id: 'settings' as AdminTab, label: language === 'gu' ? 'સેટિંગ્સ (Settings)' : 'Admin Settings', icon: Settings },
  ];

  return (
    <div id="admin-dashboard-container" className="min-h-screen flex flex-col bg-transparent text-slate-900 relative z-10 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <DashboardHeader
        role="admin"
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden min-w-0 w-full max-w-full">
        {/* Left Sidebar */}
        <aside
          id="admin-sidebar"
          className={`glass-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Scrollable Navigation */}
          <div className="p-3 overflow-y-auto space-y-1">
            {/* Sidebar Official Logo Branding (55-70px tall, no extra text, navigates to Home) */}
            <button
              type="button"
              id="admin-sidebar-logo-btn"
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
              {language === 'gu' ? 'મેનૂ' : 'Menu'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
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
                          : 'bg-amber-100  text-amber-800 '
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin Sign Out footer */}
          <div className="p-3 border-t border-slate-200/80 shrink-0">
            <button
              id="admin-logout-button"
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{t.adminSidebar?.logout || 'Sign Out'}</span>
            </button>
          </div>
        </aside>

        {/* Mobile Backdrop */}
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
            id="admin-dashboard-top-brand"
            className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-linear-to-r from-white/80 via-sky-50/70 to-cyan-50/80 border border-white/80 backdrop-blur-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                id="admin-dash-brand-logo-btn"
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
                    {language === 'gu' ? 'એડમિન કંટ્રોલ પેનલ' : 'Admin Control Panel'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-purple-500/15 text-purple-800 border border-purple-400/30">
                    {language === 'gu' ? 'સંચાલન' : 'Management'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium truncate mt-0.5">
                  {language === 'gu'
                    ? 'સત્તાવાર સંચાલન, ફોર્મ્સ અને દસ્તાવેજ વ્યવસ્થાપન પોર્ટલ'
                    : 'Official Administration, Forms & Document Management'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/70 border border-white/80 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{language === 'gu' ? 'સક્રિય એડમિન' : 'Active Admin'}</span>
              </div>
            </div>
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/70 border border-slate-200/80 backdrop-blur-xl shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-700 border border-sky-500/25">
                      {language === 'gu' ? 'એડમિન કંટ્રોલ' : 'Admin'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
                    {language === 'gu' ? 'એડમિન ડેશબોર્ડ' : 'Admin Dashboard'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {language === 'gu'
                      ? 'દસ્તાવેજો અપલોડ કરો, અરજીઓ ચકાસો અને યુઝર એકાઉન્ટ્સ સંચાલિત કરો.'
                      : 'Upload and manage official documents, review applications, and administer user services.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('documents')}
                    className="btn-glossy-primary px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-sky-500/20 active:scale-95"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>{language === 'gu' ? 'દસ્તાવેજ મેનેજર' : 'Manage Documents'}</span>
                  </button>
                </div>
              </div>

              {/* Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
                  <div className="text-xs text-slate-500">Total Applications</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    <AnimatedCounter value={totalApps} />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
                  <div className="text-xs text-amber-600">Pending Review</div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                    <AnimatedCounter value={pendingApps} />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
                  <div className="text-xs text-blue-600">In Processing</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                    <AnimatedCounter value={processingApps} />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
                  <div className="text-xs text-emerald-600">Registered Users</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                    <AnimatedCounter value={users.length} />
                  </div>
                </div>
              </div>

              {/* Recent Applications table */}
              <div className="rounded-3xl bg-white/80 border border-slate-200/80 shadow-xs overflow-hidden backdrop-blur-md">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Recent Applications Pending Action
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-semibold text-sky-600 hover:underline"
                  >
                    View All ({applications.length}) →
                  </button>
                </div>

                <div className="table-responsive-container">
                  <table className="w-full min-w-[620px] text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Application ID</th>
                        <th className="py-3 px-4">Applicant</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {applications.slice(0, 6).map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-sky-600">{app.id}</td>
                          <td className="py-3 px-4 font-medium">{app.applicantName}</td>
                          <td className="py-3 px-4">{app.serviceName}</td>
                          <td className="py-3 px-4 text-slate-500 text-xs">{app.applicationDate}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                              {getStatusLabel(app.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedAppForModal(app)}
                              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-sky-600 hover:text-white font-semibold text-xs transition-colors"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Office Details Card */}
              <OfficeAddressCard highlightAdmin={true} />
            </div>
          )}

          {/* TAB 2: DOCUMENT MANAGER (CORE ADMIN CAPABILITY) */}
          {activeTab === 'documents' && (
            <AdminDocumentManager language={language} />
          )}

          {/* TAB 3: APPLICATIONS MANAGEMENT */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Applications Management
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Review submitted documents, record department notes, and update statuses.
                  </p>
                </div>
              </div>

              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center bg-white/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs backdrop-blur-md">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    placeholder="Search by ID, applicant name, phone, or service..."
                    className="w-full pl-2.5 pr-2 py-0.5 text-xs sm:text-sm bg-transparent outline-none text-slate-900"
                  />
                </div>

                <div className="flex items-center bg-white/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs text-xs backdrop-blur-md">
                  <Filter className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <select
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value)}
                    className="bg-transparent outline-none text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Document Required">Document Required</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-3">
                {filteredApps.length === 0 ? (
                  <div className="p-12 text-center bg-white/70 rounded-3xl border border-slate-200 text-slate-400">
                    No matching applications found.
                  </div>
                ) : (
                  filteredApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-3xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-600">{app.id}</span>
                          <span className="font-bold text-sm text-slate-900">{app.serviceName}</span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          Applicant: {app.applicantName} ({app.applicantPhone})
                        </div>
                        <div className="text-xs text-slate-400">
                          Submitted on {app.applicationDate} • Fee: ₹{app.fee} ({app.paymentStatus})
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(app.status)}`}>
                          {getStatusLabel(app.status)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedAppForModal(app)}
                          className="px-4 py-2 rounded-xl btn-glossy-primary font-semibold text-xs"
                        >
                          Review & Update
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Services Catalog Management
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Add new digital services, adjust service fees, and manage requirements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setServiceModalState({ isOpen: true, serviceToEdit: null, category: 'general' })}
                  className="btn-glossy-primary px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...services, ...agricultureServices].map((service) => (
                  <div
                    key={service.id}
                    className="p-5 rounded-3xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 backdrop-blur-md"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-sky-600 font-bold mb-1">
                        <span className="truncate pr-2">{service.department}</span>
                        <span className="font-extrabold text-slate-900 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30 shrink-0">
                          ₹{service.fee}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">{service.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400">Time: {service.processingTime}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setServiceModalState({ isOpen: true, serviceToEdit: service, category: 'general' })}
                          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteService(service.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    User Accounts Management
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    View registered users, monitor verification statuses, and toggle account access.
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  {users.length} Registered Users
                </span>
              </div>

              {/* User search */}
              <div className="flex items-center bg-white/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs backdrop-blur-md">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search users by name, email, username, or phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-2.5 pr-2 py-0.5 text-xs sm:text-sm bg-transparent outline-none text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.length === 0 ? (
                  <div className="col-span-full p-12 text-center bg-white/70 rounded-3xl border border-slate-200 text-slate-400">
                    No users matching search.
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-5 rounded-3xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 backdrop-blur-md"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-sm text-slate-900">{user.name}</div>
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(user.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              user.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {user.status}
                          </button>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                          <div>Email: {user.email}</div>
                          <div>Phone: {user.phone || 'Not provided'}</div>
                          {user.username && <div>Username: @{user.username}</div>}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Role: {user.role === 'admin' ? 'Admin' : 'User'}</span>
                        <span>Joined: {user.joinedDate || 'Recently'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Admin System Settings & Security
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Firebase Authentication credentials and official center configuration.
                </p>
              </div>

              {/* Password update card */}
              <div className="max-w-xl p-5 sm:p-6 rounded-3xl bg-white/80 border border-slate-200/80 shadow-xs space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Admin Password & Credentials
                    </h3>
                    <p className="text-xs text-slate-400">
                      Update your administrator password directly in Firebase Authentication.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-3 pt-1 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      New Admin Password (min 6 chars)
                    </label>
                    <input
                      type="password"
                      value={adminNewPass}
                      onChange={(e) => setAdminNewPass(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={adminConfirmPass}
                      onChange={(e) => setAdminConfirmPass(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-sky-500"
                    />
                  </div>

                  {passUpdateMsg && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      passUpdateMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      <span>{passUpdateMsg.text}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleSendAdminResetEmail}
                      disabled={isSendingResetEmail}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSendingResetEmail ? 'animate-spin' : ''}`} />
                      <span>{isSendingResetEmail ? 'Sending...' : 'Send Reset Email'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isUpdatingPass || !adminNewPass}
                      className="btn-glossy-primary px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isUpdatingPass ? 'Updating...' : 'Update Password'}</span>
                    </button>
                  </div>

                  {resetEmailSentMsg && (
                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs">
                      {resetEmailSentMsg}
                    </div>
                  )}
                </form>
              </div>

              {/* Center Office details */}
              <OfficeAddressCard highlightAdmin={true} />
            </div>
          )}

          {/* Dedicated Glass Footer on Admin Dashboard */}
          <div className="pt-8">
            <GlassFooter />
          </div>
        </main>
      </div>

      {/* Application Details Modal */}
      {selectedAppForModal && (
        <ApplicationDetailsModal
          application={selectedAppForModal}
          role="admin"
          onClose={() => setSelectedAppForModal(null)}
        />
      )}

      {/* Service Modal */}
      {serviceModalState.isOpen && (
        <ServiceModal
          isOpen={serviceModalState.isOpen}
          serviceToEdit={serviceModalState.serviceToEdit}
          defaultCategory={serviceModalState.category}
          onClose={() => setServiceModalState({ isOpen: false, serviceToEdit: null, category: 'general' })}
          onSave={(newOrUpdated) => {
            if (serviceModalState.serviceToEdit) {
              updateService(serviceModalState.serviceToEdit.id, newOrUpdated);
            } else {
              addService(newOrUpdated);
            }
          }}
        />
      )}
    </div>
  );
};
