import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { LoginForm } from './components/LoginForm';
import { GlassNavbar } from './components/GlassNavbar';
import { GlassFooter } from './components/GlassFooter';
import { HomePage } from './components/pages/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { FormsPage } from './components/pages/FormsPage';
import { DocumentsPage } from './components/pages/DocumentsPage';
import { PaymentsPage } from './components/pages/PaymentsPage';
import { ApplicationsPage } from './components/pages/ApplicationsPage';
import { CalculatorPage } from './components/pages/CalculatorPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { DynamicGlassBackground } from './components/DynamicGlassBackground';

function AppContent() {
  const {
    currentView,
    setCurrentView,
    authLoading,
    isAuthenticated,
    authRole,
    selectedRole,
    setSelectedRole,
    language,
    t,
  } = useApp();

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotInitialIdentifier, setForgotInitialIdentifier] = useState('');

  // Firebase Password Reset Action Code handler
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Detect Firebase password reset query parameters (mode=resetPassword & oobCode=...)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      let mode = searchParams.get('mode');
      let oobCode = searchParams.get('oobCode');

      // Also check hash query params if routed via #/?mode=resetPassword&oobCode=...
      if (!oobCode && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        if (!mode) mode = hashParams.get('mode');
        if (!oobCode) oobCode = hashParams.get('oobCode');
      }

      if (mode === 'resetPassword' && oobCode) {
        setResetCode(oobCode);
        setIsResetModalOpen(true);
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 text-cyan-700">
        <DynamicGlassBackground />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full border-[3px] border-cyan-400/35 border-t-cyan-500 border-r-sky-500 animate-spin" />
          <p className="text-xs font-semibold tracking-widest uppercase text-cyan-800">
            {language === 'gu' ? 'શિવ કમ્પ્યુટર પોર્ટલ લોડ થઈ રહ્યું છે...' : 'Loading Shiv Computer Platform...'}
          </p>
        </div>
      </div>
    );
  }

  // Admin Dashboard View — Strict RBAC protection: Only users with role === 'admin' can access Admin Dashboard
  if (currentView === 'admin-dashboard') {
    if (authRole !== 'admin') {
      // Not admin: redirect to admin login (clean login page, no top navbar)
      return (
        <div className="min-h-screen flex flex-col relative text-slate-800">
          <DynamicGlassBackground />
          <main className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4">
            <LoginForm
              role="admin"
              t={t}
              onForgotPasswordClick={(id) => {
                setForgotInitialIdentifier(id || '');
                setIsForgotModalOpen(true);
              }}
              onBackToHomeClick={() => {
                setCurrentView('home');
                window.location.hash = '#/home';
              }}
              onLoginSuccess={() => {
                setCurrentView('admin-dashboard');
                window.location.hash = '#/admin-dashboard';
              }}
            />
          </main>
        </div>
      );
    }
    return (
      <>
        <DynamicGlassBackground />
        <AdminDashboard />
      </>
    );
  }

  // User Dashboard View — Authenticated User Portal
  if (currentView === 'user-dashboard') {
    if (!isAuthenticated) {
      // Not logged in: prompt login (clean login page, no top navbar)
      return (
        <div className="min-h-screen flex flex-col relative text-slate-800">
          <DynamicGlassBackground />
          <main className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4">
            <LoginForm
              role="user"
              t={t}
              onForgotPasswordClick={(id) => {
                setForgotInitialIdentifier(id || '');
                setIsForgotModalOpen(true);
              }}
              onBackToHomeClick={() => {
                setCurrentView('home');
                window.location.hash = '#/home';
              }}
              onLoginSuccess={() => {
                setCurrentView('user-dashboard');
                window.location.hash = '#/user-dashboard';
              }}
            />
          </main>
        </div>
      );
    }
    return (
      <>
        <DynamicGlassBackground />
        <UserDashboard />
      </>
    );
  }

  // Dedicated Login / Register View — Clean page with NO top navigation bar
  if (currentView === 'login' || currentView === 'register' || currentView === 'admin-login') {
    const activeAuthRole = currentView === 'admin-login' ? 'admin' : (currentView === 'register' ? 'user' : selectedRole);

    return (
      <div className="min-h-screen flex flex-col relative text-slate-800">
        <DynamicGlassBackground />
        {/* No GlassNavbar here — login page is intentionally clean and distraction-free */}
        <main className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4">
          <LoginForm
            role={activeAuthRole}
            t={t}
            onForgotPasswordClick={(id) => {
              setForgotInitialIdentifier(id || '');
              setIsForgotModalOpen(true);
            }}
            onBackToHomeClick={() => {
              setCurrentView('home');
              window.location.hash = '#/home';
            }}
            onLoginSuccess={(role) => {
              if (role === 'admin') {
                setCurrentView('admin-dashboard');
                window.location.hash = '#/admin-dashboard';
              } else {
                setCurrentView('user-dashboard');
                window.location.hash = '#/user-dashboard';
              }
            }}
          />
        </main>

        <ForgotPasswordModal
          isOpen={isForgotModalOpen}
          onClose={() => setIsForgotModalOpen(false)}
          initialIdentifier={forgotInitialIdentifier}
          language={language}
          t={t}
        />

        <ResetPasswordModal
          isOpen={isResetModalOpen}
          oobCode={resetCode || ''}
          onClose={() => {
            setIsResetModalOpen(false);
            setResetCode(null);
          }}
          onSuccessLogin={() => {
            setIsResetModalOpen(false);
            setResetCode(null);
            setSelectedRole('user');
            setCurrentView('login');
            window.location.hash = '#/login';
          }}
          onRequestNewLink={() => {
            setIsResetModalOpen(false);
            setResetCode(null);
            setIsForgotModalOpen(true);
          }}
          language={language}
          t={t}
        />
      </div>
    );
  }

  // Content for public routes
  let pageContent: React.ReactNode = null;
  switch (currentView) {
    case 'services':
      pageContent = <ServicesPage />;
      break;
    case 'forms':
    case 'agriculture-forms':
      pageContent = <FormsPage />;
      break;
    case 'documents':
      pageContent = <DocumentsPage />;
      break;
    case 'payments':
      pageContent = <PaymentsPage />;
      break;
    case 'applications':
      pageContent = <ApplicationsPage />;
      break;
    case 'calculator':
      pageContent = <CalculatorPage />;
      break;
    case 'about':
      pageContent = <AboutPage />;
      break;
    case 'contact':
      pageContent = <ContactPage />;
      break;
    case 'profile':
      pageContent = <ProfilePage />;
      break;
    case 'home':
    default:
      pageContent = (
        <HomePage
          onForgotPasswordClick={(id) => {
            setForgotInitialIdentifier(id || '');
            setIsForgotModalOpen(true);
          }}
        />
      );
      break;
  }

  return (
    <div className="min-h-screen flex flex-col relative text-[#243447]">
      <DynamicGlassBackground />
      <GlassNavbar />
      <main className="flex-1 min-w-0">
        {pageContent}
      </main>
      <GlassFooter />

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialIdentifier={forgotInitialIdentifier}
        language={language}
        t={t}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        oobCode={resetCode || ''}
        onClose={() => {
          setIsResetModalOpen(false);
          setResetCode(null);
        }}
        onSuccessLogin={() => {
          setIsResetModalOpen(false);
          setResetCode(null);
          setSelectedRole('user');
          setCurrentView('login');
          window.location.hash = '#/login';
        }}
        onRequestNewLink={() => {
          setIsResetModalOpen(false);
          setResetCode(null);
          setIsForgotModalOpen(true);
        }}
        language={language}
        t={t}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
