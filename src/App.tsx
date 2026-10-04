import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { LoginForm } from './components/LoginForm';
import { HeaderControls } from './components/HeaderControls';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { AIChatbot } from './components/AIChatbot';
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
    setLanguage,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#ddf3fd] to-[#aed9f4] dark:from-[#050e1a] dark:to-[#060f1c] text-sky-700 dark:text-sky-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 rounded-full border-[3px] border-cyan-400/25 border-t-cyan-400 border-r-sky-500 animate-spin" />
          <p className="text-xs font-semibold tracking-widest uppercase text-sky-600/80 dark:text-sky-400/80">
            {language === 'gu' ? 'શિવ કમ્પ્યુટર પોર્ટલ લોડ થઈ રહ્યું છે...' : 'Loading Shiv Portal...'}
          </p>
        </div>
      </div>
    );
  }

  // Gatekeeper: Enforce Sign In / Sign Up for Admin or User before website open
  if (!isAuthenticated || currentView === 'login' || currentView === 'register' || currentView === 'admin-login') {
    const activeAuthRole = currentView === 'admin-login' ? 'admin' : (currentView === 'register' ? 'user' : selectedRole);

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#ddf3fd] via-[#c8eafa] to-[#b4d9f2] dark:from-[#050e1a] dark:via-[#06101e] dark:to-[#040c16] text-[#0c3a56] dark:text-[#c8e8f8] transition-colors duration-300">
        <HeaderControls
          role={activeAuthRole}
          onRoleChange={(newRole) => {
            setSelectedRole(newRole);
            if (newRole === 'admin') {
              setCurrentView('admin-login');
              window.location.hash = '#/admin-login';
            } else {
              setCurrentView('login');
              window.location.hash = '#/login';
            }
          }}
          language={language}
          onLanguageChange={setLanguage}
          adminLabel={t.adminBadge}
          userLabel={t.userBadge}
        />

        <main className="flex-1 flex items-center justify-center py-6 sm:py-10 px-4">
          <LoginForm
            role={activeAuthRole}
            t={t}
            onForgotPasswordClick={(id) => {
              setForgotInitialIdentifier(id || '');
              setIsForgotModalOpen(true);
            }}
            onBackToHomeClick={() => {
              if (activeAuthRole === 'admin') {
                setSelectedRole('user');
                setCurrentView('login');
                window.location.hash = '#/login';
              } else {
                setSelectedRole('admin');
                setCurrentView('admin-login');
                window.location.hash = '#/admin-login';
              }
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

        {/* Shiv AI Assistant: shown only on Login and Dashboard pages */}
        {(currentView === 'login' || currentView === 'admin-login') && <AIChatbot />}
      </div>
    );
  }

  // Strict RBAC protection: Only users with role === 'admin' can access Admin Dashboard
  // Normal users (authRole === 'user') are ALWAYS routed to UserDashboard, never AdminDashboard.
  // Even if URL is manually changed to #/admin-dashboard, the authRole check prevents access.
  const isAdminView = currentView === 'admin-dashboard' && authRole === 'admin';
  return (
    <>
      <DynamicGlassBackground />
      {isAdminView ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
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
      <AIChatbot />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
