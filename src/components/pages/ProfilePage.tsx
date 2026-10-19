import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Key,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sendPasswordReset } from '../../lib/firebase';

export const ProfilePage: React.FC = () => {
  const { currentUser, authRole, logout, setCurrentView } = useApp();
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setResetLoading(true);
    setResetError(null);
    try {
      await sendPasswordReset(currentUser.email);
      setResetSent(true);
    } catch (err: any) {
      setResetError(err?.message || 'Failed to send password reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen text-[#243447] pb-16 pt-24 sm:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#EAF5FF] border border-[#2196F3]/30 flex items-center justify-center text-[#2196F3] text-3xl font-black shadow-xs">
              {authRole === 'admin' ? 'A' : (currentUser?.name?.charAt(0) || 'U')}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{authRole === 'admin' ? 'Administrator' : 'Citizen Account'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#243447]">
                {currentUser?.name || (authRole === 'admin' ? 'Admin' : 'User')}
              </h1>
              <p className="text-xs text-[#64748B] mt-1">{currentUser?.email}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await logout();
                setCurrentView('home');
                window.location.hash = '#/home';
              }}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Profile Details & Password Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#243447] flex items-center gap-2">
              <User className="w-4 h-4 text-[#2196F3]" />
              <span>Personal Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5]">
                <span className="text-[#64748B] block text-[11px]">Full Name</span>
                <span className="font-semibold text-[#243447] text-sm">{currentUser?.name || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5]">
                <span className="text-[#64748B] block text-[11px]">Email Address</span>
                <span className="font-semibold text-[#243447] text-sm">{currentUser?.email || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5]">
                <span className="text-[#64748B] block text-[11px]">Mobile Number</span>
                <span className="font-semibold text-[#243447] text-sm">{currentUser?.phone || '+91 83202 18440'}</span>
              </div>
            </div>
          </div>

          {/* Security & Password Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#243447] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2196F3]" />
                <span>Security & Credentials</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Password management is powered by Firebase Authentication. You can request a secure reset link to change your password.
              </p>
            </div>

            <div className="pt-4">
              {resetSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Password reset link sent to <strong>{currentUser?.email}</strong>. Check your inbox to set a new password.
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={resetLoading}
                  onClick={handlePasswordReset}
                  className="w-full py-3 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>{resetLoading ? 'Sending Reset Link...' : 'Change Password via Email'}</span>
                </button>
              )}

              {resetError && (
                <div className="mt-2 text-xs text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{resetError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
