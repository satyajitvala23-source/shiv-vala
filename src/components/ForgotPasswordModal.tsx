import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Send,
  RefreshCw,
} from 'lucide-react';
import { TranslationStrings, LanguageCode } from '../types';
import { sendFirebasePasswordResetEmail, formatLocalizedAuthError } from '../lib/auth';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdentifier?: string;
  role?: 'admin' | 'user';
  onAdminQuickLogin?: () => void;
  language: LanguageCode;
  t: TranslationStrings;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialIdentifier = '',
  language,
  t,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  // Sync initial identifier when modal opens (prefill if it's an email or username)
  useEffect(() => {
    if (isOpen) {
      setEmail(initialIdentifier.trim());
      setErrorMessage(null);
      setSuccessEmail(null);
      setIsLoading(false);
    }
  }, [isOpen, initialIdentifier]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const strings = t.forgotPasswordModal;

  // Submit password reset request via Firebase Authentication
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage(
        language === 'gu'
          ? 'કૃપા કરીને તમારું નોંધાયેલ ઈમેલ અથવા યુઝરનેમ દાખલ કરો.'
          : 'Please enter your registered email address or username.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await sendFirebasePasswordResetEmail(trimmed);
      setSuccessEmail(res.email);
    } catch (err: any) {
      setErrorMessage(formatLocalizedAuthError(err, language));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAnother = () => {
    setSuccessEmail(null);
    setErrorMessage(null);
  };

  return (
    <div
      id="forgot-password-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-modal-title"
    >
      <motion.div
        id="forgot-password-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl bg-white/98 backdrop-blur-xl border border-[#D8E8F5] shadow-2xl p-6 sm:p-7 relative text-[#243447] my-6"
      >
        {/* Close button */}
        <button
          type="button"
          id="forgot-password-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-xl text-[#64748B] hover:text-[#243447] hover:bg-[#EAF5FF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="p-3 rounded-2xl bg-[#EAF5FF] text-[#2196F3] border border-[#D8E8F5] shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div className="pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                id="forgot-password-modal-title"
                className="text-lg font-bold tracking-tight text-[#243447]"
              >
                {strings.title}
              </h3>
              <span
                id="forgot-password-firebase-badge"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5FF] text-[#1976D2] border border-[#D8E8F5]"
              >
                <ShieldCheck className="w-3 h-3" />
                Firebase Auth
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              {strings.subtitle}
            </p>
          </div>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              id="forgot-password-error-alert"
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs sm:text-sm"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-snug flex-1">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* State: Success View */}
        {successEmail ? (
          <motion.div
            id="forgot-password-success-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-sm font-bold text-emerald-900">
                    {strings.successTitle}
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {strings.successMsg}
                  </p>
                  <div className="inline-block px-2.5 py-1 rounded-lg bg-white border border-emerald-300 font-mono text-xs font-semibold text-emerald-900 break-all">
                    {successEmail}
                  </div>
                </div>
              </div>
            </div>

            {/* Spam Folder Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'gu'
                    ? 'ઈમેલ ન મળ્યો હોય તો: સ્પામ (Spam) ફોલ્ડર તપાસો!'
                    : 'Did not receive the email? Check SPAM / Junk Folder!'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                {language === 'gu'
                  ? 'ફાયરબેઝ દ્વારા મોકલાયેલ ઈમેલ ઘણીવાર જીમેલના Spam, Junk અથવા Promotions ફોલ્ડરમાં જતો રહે છે. કૃપા કરીને સ્પામ ફોલ્ડર ખોલીને લિંક ચેક કરો.'
                  : 'Firebase automated emails (from noreply@shivv-1fd2b.firebaseapp.com) often land in Gmail Spam, Junk, or Promotions folder. Please check your spam folder.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                id="forgot-password-resend-btn"
                onClick={handleResetAnother}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:text-[#243447] hover:bg-[#EAF5FF] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{strings.resendLink}</span>
              </button>

              <button
                type="button"
                id="forgot-password-back-login-btn"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#2196F3]/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{strings.backToLogin}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Form: Simple Email/Username Input */
          <form
            id="forgot-password-email-form"
            onSubmit={handleSendResetEmail}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="forgot-password-email-input"
                className="block text-xs font-semibold text-[#243447]"
              >
                {strings.inputLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="forgot-password-email-input"
                  name="identifier"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={strings.inputPlaceholder}
                  autoFocus
                  disabled={isLoading}
                  autoComplete="username email"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-[#D8E8F5] bg-white text-[#243447] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all disabled:opacity-60"
                />
              </div>
              <p className="text-[11px] text-[#64748B] pt-0.5 leading-relaxed">
                {language === 'gu'
                  ? 'તમારા એકાઉન્ટમાં નોંધાયેલ ઈમેલ અથવા યુઝરનેમ દાખલ કરો.'
                  : 'Enter the email address or username registered with your account.'}
              </p>
            </div>

            {/* Actions: Cancel & Send Reset Link */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                id="forgot-password-cancel-btn"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#64748B] hover:text-[#243447] hover:bg-[#EAF5FF] transition-colors disabled:opacity-50"
              >
                {strings.cancel}
              </button>

              <button
                type="submit"
                id="forgot-password-submit-btn"
                disabled={isLoading || !email.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#2196F3]/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{strings.sending}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{strings.sendButton}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
