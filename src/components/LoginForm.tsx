import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  User,
  Phone,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { LoginRole, TranslationStrings } from '../types';
import { BrandLogo } from './BrandLogo';
import { useApp } from '../context/AppContext';

interface LoginFormProps {
  role: LoginRole;
  t: TranslationStrings;
  onForgotPasswordClick: (prefillIdentifier?: string) => void;
  onBackToHomeClick: () => void;
  onLoginSuccess?: (role: LoginRole) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  role,
  t,
  onForgotPasswordClick,
  onBackToHomeClick,
  onLoginSuccess,
}) => {
  const { loginWithCredentials, registerNewUser, language, currentView, setCurrentView } = useApp();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form Values
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form Values
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    title: string;
    text: string;
  } | null>(null);

  // Sync authMode with currentView
  useEffect(() => {
    if (currentView === 'register') {
      setAuthMode('register');
    } else {
      setAuthMode('login');
    }
  }, [currentView]);

  // Error message helper based on Firebase error code or custom error
  const getErrorMessage = (err: any): { title: string; text: string } => {
    const code = err?.code || err?.message;

    if (code === 'USERNAME_ALREADY_EXISTS') {
      return {
        title: language === 'gu' ? 'યુઝરનેમ ઉપલબ્ધ નથી' : 'Username Taken',
        text: t.errors.usernameTaken,
      };
    }
    if (code === 'USERNAME_TOO_SHORT') {
      return {
        title: language === 'gu' ? 'અમાન્ય યુઝરનેમ' : 'Invalid Username',
        text: t.errors.usernameInvalid,
      };
    }
    if (code === 'USER_NOT_FOUND' || code === 'auth/user-not-found') {
      return {
        title: language === 'gu' ? 'ખાતું મળ્યું નથી' : 'Account Not Found',
        text:
          language === 'gu'
            ? 'આ યુઝરનેમ અથવા ઈમેલ ધરાવતું કોઈ ખાતું મળ્યું નથી.'
            : 'No account found with this username or email address.',
      };
    }
    if (code === 'ADMIN_ACCESS_DENIED') {
      return {
        title: language === 'gu' ? 'એડમિન પરવાનગી નથી' : 'Admin Access Denied',
        text:
          language === 'gu'
            ? 'આ ખાતા પાસે એડમિન પરવાનગી નથી. કૃપા કરીને એડમિન ઓળખપત્રો વાપરો.'
            : 'This account does not have administrator privileges.',
      };
    }
    if (code === 'ACCOUNT_INACTIVE') {
      return {
        title: language === 'gu' ? 'ખાતું નિષ્ક્રિય છે' : 'Account Inactive',
        text:
          language === 'gu'
            ? 'તમારું ખાતું નિષ્ક્રિય થયેલું છે. કૃપા કરીને શિવ કમ્પ્યુટર સપોર્ટ ડેસ્કનો સંપર્ક કરો.'
            : 'Your account has been deactivated. Please contact support.',
      };
    }
    if (code === 'auth/email-already-in-use') {
      return {
        title: language === 'gu' ? 'ઈમેલ પહેલેથી નોંધાયેલું છે' : 'Email Already In Use',
        text: t.errors.emailAlreadyRegistered,
      };
    }
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return {
        title: language === 'gu' ? 'ખોટો પાસવર્ડ' : 'Invalid Credentials',
        text:
          language === 'gu'
            ? 'ખોટો પાસવર્ડ અથવા ઓળખપત્ર. કૃપા કરીને ફરી પ્રયાસ કરો.'
            : 'Incorrect password or credentials. Please try again or use Forgot Password.',
      };
    }
    if (code === 'auth/network-request-failed') {
      return {
        title: language === 'gu' ? 'નેટવર્ક સમસ્યા' : 'Network Error',
        text:
          language === 'gu'
            ? 'નેટવર્ક કનેક્શન સમસ્યા. કૃપા કરીને તમારું ઇન્ટરનેટ તપાસો.'
            : 'Network connection problem. Please verify your internet connection.',
      };
    }
    return {
      title: language === 'gu' ? 'ઓથેન્ટિકેશન નિષ્ફળ' : 'Authentication Failed',
      text: err?.message || 'Please check your information and try again.',
    };
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const newErrors: { [key: string]: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier =
        language === 'gu'
          ? 'કૃપા કરીને યુઝરનેમ અથવા ઈમેલ દાખલ કરો'
          : 'Please enter your username or email address';
    }

    if (!loginPassword) {
      newErrors.password = t.errors.passwordRequired;
    } else if (loginPassword.length < 4) {
      newErrors.password = t.errors.passwordTooShort;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      const authResult = await loginWithCredentials({
        identifier: identifier.trim(),
        password: loginPassword,
        expectedRole: role,
        rememberMe,
      });

      setStatusMessage({
        type: 'success',
        title: t.simulations.loginSuccessTitle,
        text: t.simulations.loginSuccessMsg,
      });

      if (onLoginSuccess) {
        onLoginSuccess(authResult.role as LoginRole);
      }
    } catch (err: any) {
      const errInfo = getErrorMessage(err);
      setStatusMessage({
        type: 'error',
        title: errInfo.title,
        text: errInfo.text,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const newErrors: { [key: string]: string } = {};

    if (!regFullName.trim()) {
      newErrors.name = t.errors.nameRequired;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim() || !emailPattern.test(regEmail.trim())) {
      newErrors.email = t.errors.emailInvalid;
    }

    const cleanMobile = regMobile.trim().replace(/[^0-9]/g, '');
    if (!cleanMobile) {
      newErrors.mobile = t.errors.mobileRequired || 'Mobile number is required';
    } else if (cleanMobile.length !== 10) {
      newErrors.mobile = t.errors.mobileInvalid || 'Please enter a valid 10-digit mobile number';
    }

    if (!regPassword) {
      newErrors.password = t.errors.passwordRequired;
    } else if (regPassword.length < 6) {
      newErrors.password = t.errors.passwordTooShort;
    }

    if (!regConfirmPassword) {
      newErrors.confirmPassword = t.errors.confirmPasswordRequired;
    } else if (regPassword !== regConfirmPassword) {
      newErrors.confirmPassword = t.errors.passwordsDoNotMatch;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      await registerNewUser({
        name: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        mobile: cleanMobile,
        password: regPassword,
      });

      setStatusMessage({
        type: 'success',
        title: language === 'gu' ? 'ખાતું સફળતાપૂર્વક બન્યું!' : 'Registration Successful!',
        text:
          language === 'gu'
            ? 'તમારું નાગરિક ખાતું બની ગયું છે. યુઝર ડેશબોર્ડ ખૂલી રહ્યું છે...'
            : 'Your citizen account has been created. Redirecting to User Dashboard...',
      });

      if (onLoginSuccess) {
        onLoginSuccess('user');
      }
    } catch (err: any) {
      const errInfo = getErrorMessage(err);
      setStatusMessage({
        type: 'error',
        title: errInfo.title,
        text: errInfo.text,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-w-0">
      <motion.div
        id="login-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sc-restored-login-card p-6 sm:p-8 relative overflow-hidden w-full max-w-full min-w-0"
      >
        {/* Top Centered Brand Logo — official SC logo with original aspect ratio, horizontally centered, no text underneath */}
        <div className="flex justify-center mb-3">
          <BrandLogo size="md" onLogoClick={onBackToHomeClick} />
        </div>

        {/* Card Header: Brand Name & Subtitle in crisp dark blue / slate */}
        <div className="text-center mb-6">
          <h2 id="login-heading" className="text-2xl sm:text-[26px] font-black tracking-tight text-slate-900">
            {authMode === 'register'
              ? (language === 'gu' ? 'નવું ખાતું બનાવો' : 'Create Account')
              : 'Shiv Computer'}
          </h2>
          <p id="login-subtitle" className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            {authMode === 'register'
              ? (language === 'gu' ? 'ઑનલાઇન સેવાઓ અને ફોર્મ માટે રજીસ્ટ્રેશન કરો' : 'Register to apply and track services')
              : (language === 'gu' ? 'તમારા ખાતામાં લૉગિન કરો' : 'Sign in to access your digital services')}
          </p>
        </div>

        {/* Global Feedback Banner */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              id="form-status-banner"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 border shadow-xs ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/95 border-amber-300 text-amber-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{statusMessage.title}</div>
                <div className="text-xs mt-0.5 opacity-90">{statusMessage.text}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. LOGIN FORM */}
        {authMode === 'login' && (
          <form id="login-form" onSubmit={handleLoginSubmit} noValidate className="space-y-4">
            {/* USERNAME OR EMAIL INPUT */}
            <div>
              <label
                htmlFor="login-identifier-input"
                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
              >
                {language === 'gu' ? 'યુઝરનેમ અથવા ઈમેલ' : 'Username or Email'}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-identifier-input"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                  }}
                  placeholder={language === 'gu' ? 'તમારું યુઝરનેમ અથવા ઈમેલ દાખલ કરો' : 'Enter username or email address'}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-white/75 hover:bg-white/90 focus:bg-white border text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl transition-all duration-200 outline-none backdrop-blur-md ${
                    errors.identifier
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                      : 'border-sky-200/80 hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                  }`}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.identifier}</span>
                </p>
              )}
            </div>

            {/* PASSWORD INPUT WITH SHOW/HIDE TOGGLE */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password-input"
                  className="block text-xs sm:text-sm font-semibold text-slate-800"
                >
                  {t.passwordLabel}
                </label>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder={t.passwordPlaceholder}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white/75 hover:bg-white/90 focus:bg-white border text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl transition-all duration-200 outline-none backdrop-blur-md ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                      : 'border-sky-200/80 hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                  }`}
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
              <label
                htmlFor="remember-me-checkbox"
                className="inline-flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500/20 cursor-pointer"
                />
                <span className="text-slate-700 font-semibold">{t.rememberMe}</span>
              </label>

              <button
                type="button"
                id="forgot-password-link"
                onClick={() => onForgotPasswordClick(identifier.trim())}
                className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-800 hover:underline transition-colors cursor-pointer"
              >
                {t.forgotPassword}
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <div className="pt-2">
              <button
                id="login-submit-button"
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-700 hover:via-sky-600 hover:to-cyan-600 shadow-md shadow-sky-500/25 transition-all cursor-pointer ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : 'active:scale-98'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.loggingIn}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{t.loginButton}</span>
                  </>
                )}
              </button>
            </div>

            {/* CREATE ACCOUNT / REGISTER LINK */}
            <div className="pt-2 text-center text-xs sm:text-sm text-slate-600">
              <span>{t.dontHaveAccount} </span>
              <button
                type="button"
                id="switch-to-signup-link"
                onClick={() => {
                  setAuthMode('register');
                  setCurrentView('register');
                  window.location.hash = '#/register';
                  setStatusMessage(null);
                  setErrors({});
                }}
                className="font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
              >
                {t.signUpLink}
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTRATION (SIGN UP) FORM */}
        {authMode === 'register' && (
          <form id="register-form" onSubmit={handleRegisterSubmit} noValidate className="space-y-3.5">
            {/* FULL NAME */}
            <div>
              <label
                htmlFor="reg-fullname-input"
                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1"
              >
                {t.fullNameLabel}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-fullname-input"
                  name="fullname"
                  type="text"
                  value={regFullName}
                  onChange={(e) => {
                    setRegFullName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder={t.fullNamePlaceholder}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white/75 hover:bg-white/90 focus:bg-white border text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl transition-all duration-200 outline-none backdrop-blur-md ${
                    errors.name
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                      : 'border-sky-200/80 hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="reg-email-input"
                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1"
              >
                {t.emailLabel}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email-input"
                  name="email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder={t.emailPlaceholder}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white/75 hover:bg-white/90 focus:bg-white border text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl transition-all duration-200 outline-none backdrop-blur-md ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                      : 'border-sky-200/80 hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* MOBILE NUMBER */}
            <div>
              <label
                htmlFor="reg-mobile-input"
                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1"
              >
                {t.mobileLabel}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="reg-mobile-input"
                  name="mobile"
                  type="tel"
                  maxLength={10}
                  value={regMobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setRegMobile(val);
                    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
                  }}
                  placeholder={t.mobilePlaceholder}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white/75 hover:bg-white/90 focus:bg-white border text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl transition-all duration-200 outline-none backdrop-blur-md ${
                    errors.mobile
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                      : 'border-sky-200/80 hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.mobile}</span>
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="reg-password-input"
                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1"
              >
                {t.passwordLabel}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-password-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Min 6 characters"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-11 py-2.5 bg-white/75 hover:bg-white/90 focus:bg-white border text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl transition-all duration-200 outline-none backdrop-blur-md ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                      : 'border-sky-200/80 hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="reg-confirm-password-input"
                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1"
              >
                {t.confirmPasswordLabel}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-confirm-password-input"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => {
                    setRegConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder={t.confirmPasswordPlaceholder}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-11 py-2.5 bg-white/75 hover:bg-white/90 focus:bg-white border text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl transition-all duration-200 outline-none backdrop-blur-md ${
                    errors.confirmPassword
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                      : 'border-sky-200/80 hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* REGISTER BUTTON */}
            <div className="pt-2">
              <button
                id="register-submit-button"
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-700 hover:via-sky-600 hover:to-cyan-600 shadow-md shadow-sky-500/25 transition-all cursor-pointer ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : 'active:scale-98'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.registering}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{t.registerButton}</span>
                  </>
                )}
              </button>
            </div>

            {/* SWITCH TO LOGIN LINK */}
            <div className="pt-1 text-center text-xs sm:text-sm text-slate-600">
              <span>{t.alreadyHaveAccount} </span>
              <button
                type="button"
                id="switch-to-signin-link"
                onClick={() => {
                  setAuthMode('login');
                  setCurrentView('login');
                  window.location.hash = '#/login';
                  setStatusMessage(null);
                  setErrors({});
                }}
                className="font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
              >
                {t.signInLink}
              </button>
            </div>
          </form>
        )}

        {/* Back to Home Button */}
        <div className="pt-4 text-center">
          <button
            type="button"
            id="back-to-home-button"
            onClick={onBackToHomeClick}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToHome}</span>
          </button>
        </div>

        {/* Security / Firebase Connection Sub-footer */}
        <div className="mt-5 pt-3 border-t border-sky-100 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Secured with Firebase Authentication & Cloud Firestore</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
