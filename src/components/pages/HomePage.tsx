import React, { useRef } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sprout,
  FileText,
  FolderDown,
  CreditCard,
  Calculator,
  Headphones,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Search,
  UserCheck,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LoginForm } from '../LoginForm';
import { CurrentView } from '../../types';
import { GOOGLE_MAPS_LOCATION_URL } from '../../data/mockData';

interface HomePageProps {
  onForgotPasswordClick: (identifier?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onForgotPasswordClick }) => {
  const {
    language,
    t,
    isAuthenticated,
    authRole,
    currentUser,
    setCurrentView,
    setSelectedRole,
    selectedRole,
  } = useApp();

  const servicesScrollRef = useRef<HTMLDivElement>(null);

  const scrollServices = (direction: 'left' | 'right') => {
    if (servicesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      servicesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const navigateTo = (view: CurrentView) => {
    setCurrentView(view);
    window.location.hash = `#/${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 6 Essential Services for the horizontal scroll section
  const serviceCards = [
    {
      id: 'agri-forms',
      title: 'Agriculture Forms',
      titleGu: 'ખેતી લાયક ફોર્મ્સ',
      subtitle: 'Kheti Layak Forms',
      description: 'iKhedut portal applications, PM Kisan Samman Nidhi, crop insurance, solar pump & tractor subvention schemes.',
      descriptionGu: 'આઈ-ખેડૂત પોર્ટલ અરજી, પીએમ કિસાન, પાક નુકસાની સહાય, તાર ફેન્સિંગ, સોલાર પંપ અને ટ્રેક્ટર સબસીડી.',
      icon: <Sprout className="w-6 h-6 text-emerald-400" />,
      tag: 'Khedut Sahay',
      tagGu: 'ખેડૂત સહાય',
      targetView: 'forms' as CurrentView,
      gradient: 'from-emerald-500/20 via-teal-500/15 to-transparent',
      borderColor: 'group-hover:border-emerald-400/50',
    },
    {
      id: 'govt-forms',
      title: 'Government Forms',
      titleGu: 'સરકારી ફોર્મ્સ',
      subtitle: 'Online Form Filling',
      description: 'Income certificates, caste certificates, Non-Creamy Layer, Ration card updates, E-Shram, and Ayushman Bharat.',
      descriptionGu: 'આવકનો દાખલો, જાતિનો દાખલો, નોન-ક્રિમીલેયર, રેશન કાર્ડ નામ સુધારણા, ઈ-શ્રમ અને આયુષ્માન કાર્ડ.',
      icon: <FileText className="w-6 h-6 text-cyan-400" />,
      tag: 'Digital Gujarat',
      tagGu: 'ડિજિટલ ગુજરાત',
      targetView: 'forms' as CurrentView,
      gradient: 'from-cyan-500/20 via-blue-500/15 to-transparent',
      borderColor: 'group-hover:border-cyan-400/50',
    },
    {
      id: 'doc-downloads',
      title: 'Documents & Affidavits',
      titleGu: 'દસ્તાવેજો અને સોગંદનામા',
      subtitle: 'Download Required Documents',
      description: 'Pre-verified government affidavits, application formats, checklist forms, stamp papers, and guidelines.',
      descriptionGu: 'સરકારી સોગંદનામાના ફોર્મેટ, અરજી પત્રકો, દસ્તાવેજ ચેકલિસ્ટ અને કચેરી માન્ય નિયમાવલીઓ.',
      icon: <FolderDown className="w-6 h-6 text-sky-400" />,
      tag: 'Fast Download',
      tagGu: 'ડાઉનલોડ',
      targetView: 'documents' as CurrentView,
      gradient: 'from-sky-500/20 via-indigo-500/15 to-transparent',
      borderColor: 'group-hover:border-sky-400/50',
    },
    {
      id: 'online-payments',
      title: 'Payments & Fees',
      titleGu: 'પેમેન્ટ્સ અને ફી વિગતો',
      subtitle: 'UPI, Card & Online Payments',
      description: 'Transparent government challan fees, instant UPI QR code verification, service receipt tracking.',
      descriptionGu: 'પારદર્શક સરકારી ચલણ ફી, ત્વરિત UPI QR કોડ ચુકવણી અને સર્વિસ રીસીપ્ટ સ્ટેટસ.',
      icon: <CreditCard className="w-6 h-6 text-amber-400" />,
      tag: 'Secure UPI',
      tagGu: 'સુરક્ષિત પેમેન્ટ',
      targetView: 'payments' as CurrentView,
      gradient: 'from-amber-500/20 via-orange-500/15 to-transparent',
      borderColor: 'group-hover:border-amber-400/50',
    },
    {
      id: 'auto-calc',
      title: 'Auto Calculations',
      titleGu: 'ઓટો કેલ્ક્યુલેટર',
      subtitle: 'Instant Calculations',
      description: 'Accurate land area converter (Vigha to Guntha to Sq. Meters), Age calculator for eligibility, and stamp duty.',
      descriptionGu: 'જમીન માપણી કન્વર્ટર (વીઘા, ગુંઠા, ચો.મી.), વય મર્યાદા કેલ્ક્યુલેટર અને સ્ટેમ્પ ડ્યુટી અંદાજ.',
      icon: <Calculator className="w-6 h-6 text-indigo-400" />,
      tag: 'Instant Tool',
      tagGu: 'ગણતરી સાધન',
      targetView: 'calculator' as CurrentView,
      gradient: 'from-indigo-500/20 via-purple-500/15 to-transparent',
      borderColor: 'group-hover:border-indigo-400/50',
    },
    {
      id: 'support-help',
      title: 'Support & Guidance',
      titleGu: 'સપોર્ટ અને માર્ગદર્શન',
      subtitle: 'Help & Guidance',
      description: 'Expert personal consultation by Raviraj Makwana and Nikund Solanki. WhatsApp and phone call assistance.',
      descriptionGu: 'રવિરાજ મકવાણા અને નિકુંદ સોલંકી દ્વારા વ્યક્તિગત માર્ગદર્શન, વોટ્સએપ અને કોલ હેલ્પલાઇન.',
      icon: <Headphones className="w-6 h-6 text-teal-400" />,
      tag: '24/7 Helpline',
      tagGu: 'સહાય કેન્દ્ર',
      targetView: 'contact' as CurrentView,
      gradient: 'from-teal-500/20 via-emerald-500/15 to-transparent',
      borderColor: 'group-hover:border-teal-400/50',
    },
  ];

  return (
    <div className="w-full min-h-screen text-slate-800 pb-16 pt-20 sm:pt-24">
      {/* =========================================================================
          SECTION 1: HERO SECTION (Left Welcome Content + Right Glass Login Panel)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Luminous Welcome & Value Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/40 backdrop-blur-md self-start shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-sky-900 tracking-wide">
                {language === 'gu'
                  ? 'શિવ કમ્પ્યુટર — વિશ્વસનીય ડિજિટલ સેવા કેન્દ્ર'
                  : 'Shiv Computer — Premium Digital Service Platform'}
              </span>
            </div>

            {/* Main Brand Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900">
              <span>{language === 'gu' ? 'તમામ સરકારી અને કૃષિ સેવાઓ' : 'Fast, Reliable'}</span>{' '}
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {language === 'gu' ? 'એક જ સ્થળે' : 'Online Digital Services'}
              </span>
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-base sm:text-xl font-bold text-sky-900/90 leading-relaxed max-w-2xl">
              Online Services | Form Filling | Agriculture Forms | Digital Support
            </p>

            {/* Gujarati Welcome Message */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/35 border border-sky-300/40 backdrop-blur-md text-sm sm:text-base text-sky-950 leading-relaxed shadow-lg shadow-sky-950/5">
              <p className="font-medium">
                {language === 'gu'
                  ? 'ખેડૂત સહાય યોજનાઓ, આઈ-ખેડૂત પોર્ટલ, આવક અને જાતિના દાખલા, સોગંદનામા તેમજ તમામ ઓનલાઇન ફોર્મ સચોટ અને ઝડપથી ભરવા માટે કેશોદ ખાતેનું અગ્રણી કેન્દ્ર.'
                  : 'Empowering citizens & farmers across Keshod with seamless government form submissions, iKhedut agriculture schemes, certified certificates, and verified document downloads.'}
              </p>
            </div>

            {/* 3 Core Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/30 border border-white/50 backdrop-blur-md flex items-center gap-3 hover:border-cyan-400/50 hover:bg-white/40 transition-all shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-sky-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'gu' ? 'ઝડપી સેવા' : 'Fast Service'}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {language === 'gu' ? 'સેમ ડે પ્રોસેસિંગ' : 'Same-day processing'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/30 border border-white/50 backdrop-blur-md flex items-center gap-3 hover:border-blue-400/50 hover:bg-white/40 transition-all shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-400/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'gu' ? 'સુરક્ષિત અને અધિકૃત' : 'Secure & Reliable'}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {language === 'gu' ? 'સરકારી પોર્ટલ પ્રમાણિત' : 'Official compliance'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/30 border border-white/50 backdrop-blur-md flex items-center gap-3 hover:border-teal-400/50 hover:bg-white/40 transition-all shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-400/30 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-teal-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'gu' ? 'સહાય ડેસ્ક' : '24/7 Support'}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {language === 'gu' ? 'વોટ્સએપ હેલ્પલાઇન' : 'WhatsApp guidance'}
                  </div>
                </div>
              </div>
            </div>

            {/* Explore Services CTA Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigateTo('services')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>{language === 'gu' ? 'સેવાઓ જુઓ' : 'Explore Services'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('applications')}
                className="px-5 py-3 rounded-xl bg-white/40 hover:bg-white/60 border border-white/60 text-sky-900 font-bold text-sm transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{language === 'gu' ? 'અરજી સ્ટેટસ તપાસો' : 'Track Application'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Transparent Glass Login Panel (or User Welcome Card if logged in) */}
          <div className="lg:col-span-5 flex justify-center">
            {isAuthenticated ? (
              <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/25 border border-white/50 backdrop-blur-xl shadow-xl shadow-sky-900/10 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-500/30">
                  {authRole === 'admin' ? 'A' : (currentUser?.name?.charAt(0) || 'U')}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-800 border border-sky-400/40 mb-2">
                    {authRole === 'admin' ? 'Administrator' : 'Verified Citizen'}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {language === 'gu' ? 'સ્વાગત છે,' : 'Welcome back,'} {currentUser?.name || (authRole === 'admin' ? 'Admin' : 'User')}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 truncate">
                    {currentUser?.email || (authRole === 'admin' ? 'admin@shivcomputer.com' : 'user@shivcomputer.com')}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (authRole === 'admin') {
                        navigateTo('admin-dashboard');
                      } else {
                        navigateTo('user-dashboard');
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-bold text-sm shadow-md shadow-cyan-500/25 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{authRole === 'admin' ? 'Open Admin Dashboard' : 'Open User Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('documents')}
                    className="w-full py-2.5 rounded-xl bg-white/40 hover:bg-white/60 border border-white/50 text-sky-900 text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    {language === 'gu' ? 'મારા અધિકૃત દસ્તાવેજો' : 'My Authorized Documents'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <LoginForm
                  role={selectedRole}
                  t={t}
                  onForgotPasswordClick={onForgotPasswordClick}
                  onBackToHomeClick={() => {
                    setSelectedRole(selectedRole === 'admin' ? 'user' : 'admin');
                  }}
                  onLoginSuccess={(role) => {
                    if (role === 'admin') {
                      navigateTo('admin-dashboard');
                    } else {
                      navigateTo('user-dashboard');
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: OUR SERVICES (Horizontal Scrollable Glass Card Section)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-white/30">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-800 border border-sky-400/30 mb-2">
              {language === 'gu' ? 'મુખ્ય સેવાઓ' : 'Our Services'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {language === 'gu' ? 'ડિજિટલ અને સરકારી સેવાઓ' : 'Comprehensive Digital Solutions'}
            </h2>
            <p className="text-xs sm:text-sm text-sky-900/80 mt-1 max-w-xl font-medium">
              {language === 'gu'
                ? 'ખેડૂતો અને નાગરિકો માટે તમામ પ્રકારના ઓનલાઇન ફોર્મ, સોગંદનામા અને દસ્તાવેજ સેવાઓ.'
                : 'Browse our full spectrum of government, revenue, agricultural and certificate services.'}
            </p>
          </div>

          {/* Scroll Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollServices('left')}
              className="p-2.5 rounded-xl bg-white/35 hover:bg-white/55 border border-white/50 text-slate-800 hover:text-sky-700 transition-colors cursor-pointer shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollServices('right')}
              className="p-2.5 rounded-xl bg-white/35 hover:bg-white/55 border border-white/50 text-slate-800 hover:text-sky-700 transition-colors cursor-pointer shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={servicesScrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-sky-400/40 scrollbar-track-transparent snap-x snap-mandatory"
          style={{ scrollbarWidth: 'thin' }}
        >
          {serviceCards.map((service) => (
            <div
              key={service.id}
              onClick={() => navigateTo(service.targetView)}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] p-5 sm:p-6 rounded-2xl bg-white/20 border border-white/40 hover:border-cyan-400/60 backdrop-blur-md shadow-md shadow-sky-900/5 hover:shadow-cyan-500/15 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Header: Icon & Tag */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/40 border border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    {service.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-850 border border-sky-400/35">
                    {language === 'gu' ? service.tagGu : service.tag}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {language === 'gu' ? service.titleGu : service.title}
                </h3>
                <div className="text-xs font-semibold text-sky-700 mb-2">
                  {service.subtitle}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {language === 'gu' ? service.descriptionGu : service.description}
                </p>
              </div>

              {/* Bottom Action Arrow */}
              <div className="pt-5 mt-4 border-t border-white/30 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-sky-900 transition-colors">
                <span>{language === 'gu' ? 'વિગતો જુઓ' : 'Learn More'}</span>
                <div className="w-7 h-7 rounded-lg bg-white/40 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-400 group-hover:text-white transition-colors shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: LOWER INFORMATION SECTION (4 Transparent Glass Panels)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-white/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* PANEL A: Agriculture Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/25 border border-emerald-300/60 backdrop-blur-md shadow-lg shadow-emerald-900/5 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-400/35 mb-3">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'gu' ? 'કૃષિ અને ખેડૂત સહાય' : 'Agriculture & Khedut Sahay'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'gu'
                    ? 'ધરતીપુત્રો માટે સમર્પિત કલ્યાણકારી સેવાઓ'
                    : 'Dedicated Support for Farmers & Agriculture'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                  {language === 'gu'
                    ? '૭/૧૨ અને ૮-અ નકલ, આઈ-ખેડૂત પોર્ટલ પર સબસીડી અરજીઓ, તાર ફેન્સિંગ સહાય, બોરવેલ, દવા છંટકાવ પંપ તેમજ પાક વીમા સહાય માટે કેશોદ ખાતેનું અગ્રણી કેન્દ્ર.'
                    : 'Fast and reliable assistance for 7/12 & 8A land records, iKhedut portal applications, fence subventions, borewell subsidies, and PM Kisan updates.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('forms')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <span>{language === 'gu' ? 'ખેતી લાયક ફોર્મ્સ જુઓ' : 'Browse Agriculture Forms'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* PANEL B: Quick Access Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/25 border border-sky-300/60 backdrop-blur-md shadow-lg shadow-sky-900/5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-800 border border-sky-400/35 mb-3">
                  <Zap className="w-3.5 h-3.5 text-sky-600" />
                  <span>{language === 'gu' ? 'ઝડપી સુવિધાઓ' : 'Quick Access Hub'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'gu' ? 'ત્વરિત લિંક્સ અને એકાઉન્ટ સેવાઓ' : 'Fast Application & Document Access'}
                </h3>
              </div>

              {/* 4 Quick Access Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => navigateTo('applications')}
                  className="p-3 rounded-xl bg-white/35 hover:bg-white/55 border border-white/50 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <FileText className="w-4 h-4 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'gu' ? 'મારી અરજીઓ' : 'My Applications'}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {language === 'gu' ? 'લાઈવ રેકોર્ડ' : 'Application list'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('applications')}
                  className="p-3 rounded-xl bg-white/35 hover:bg-white/55 border border-white/50 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'gu' ? 'સ્ટેટસ ટ્રેક' : 'Track Status'}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {language === 'gu' ? 'પ્રગતિ જુઓ' : 'Check timeline'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('documents')}
                  className="p-3 rounded-xl bg-white/35 hover:bg-white/55 border border-white/50 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <FolderDown className="w-4 h-4 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'gu' ? 'દસ્તાવેજ ડાઉનલોડ' : 'Download Docs'}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {language === 'gu' ? 'પીડીએફ અને પ્રમાણપત્ર' : 'PDFs & formats'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('payments')}
                  className="p-3 rounded-xl bg-white/35 hover:bg-white/55 border border-white/50 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <CreditCard className="w-4 h-4 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'gu' ? 'પેમેન્ટ હિસ્ટ્રી' : 'Payment History'}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {language === 'gu' ? 'ફી અને રસીદ' : 'Fee receipts'}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* PANEL C: Business Information Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/25 border border-cyan-300/60 backdrop-blur-md shadow-lg shadow-cyan-900/5 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-800 border border-sky-400/35">
                <Building className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'gu' ? 'સંપર્ક અને કાર્યાલય' : 'Business & Office Information'}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Shiv Computer Keshod</h3>
                <p className="text-xs text-slate-700 mt-1 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>Near Old Railway Crossing, Char Chok, Keshod - 362220, Dist. Junagadh, Gujarat</span>
                </p>
              </div>

              {/* Both Contact Persons: Raviraj Makwana & Nikund Solanki */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Raviraj Makwana */}
                <div className="p-3 rounded-xl bg-white/35 border border-white/50 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Raviraj Makwana</div>
                    <div className="text-[11px] text-sky-800 font-semibold mt-0.5">+91 83202 18440 / 92134 88440</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/40">
                    <a
                      href="https://wa.me/918320218440"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-800 border border-emerald-400/35 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-500/25"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="tel:+918320218440"
                      className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-800 border border-sky-400/35 text-[11px] font-bold flex items-center gap-1 hover:bg-sky-500/25"
                    >
                      <Phone className="w-3 h-3 text-sky-600" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>

                {/* Nikund Solanki */}
                <div className="p-3 rounded-xl bg-white/35 border border-white/50 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Nikund Solanki</div>
                    <div className="text-[11px] text-sky-800 font-semibold mt-0.5">+91 81604 84989</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/40">
                    <a
                      href="https://wa.me/918160484989"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-800 border border-emerald-400/35 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-500/25"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="tel:+918160484989"
                      className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-800 border border-sky-400/35 text-[11px] font-bold flex items-center gap-1 hover:bg-sky-500/25"
                    >
                      <Phone className="w-3 h-3 text-sky-600" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps Location Button */}
              <div className="pt-2">
                <a
                  href={GOOGLE_MAPS_LOCATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20"
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>{language === 'gu' ? 'ગૂગલ મેપ્સ પર લોકેશન જુઓ' : 'Open Location in Google Maps'}</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              </div>
            </div>
          </div>

          {/* PANEL D: Brand Banner Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/25 border border-blue-300/60 backdrop-blur-md shadow-lg shadow-blue-900/5 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/50 border border-white/60 p-1 flex items-center justify-center shadow-xs">
                  <img
                    src="/logo.png"
                    alt="Shiv Computer"
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Shiv Computer</h3>
                  <div className="text-xs font-bold text-sky-700">
                    Your Work Our Responsibility | તમારું કામ, અમારી જવાબદારી
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {language === 'gu'
                  ? 'વિશ્વસનીય, પારદર્શક અને સમયસર સેવાઓ સાથે ખેડૂત ભાઈઓ અને નાગરિકો માટે છેલ્લા અનેક વર્ષોથી સમર્પિત કેન્દ્ર. તમામ કામગીરી સરકારી નિયમો અનુસાર.'
                  : 'Delivering dedicated digital governance services with absolute transparency, efficiency, and personal operator support across Saurashtra.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/40 text-sky-900 text-[11px] font-bold border border-white/50 shadow-xs">
                  CSC Certified
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/40 text-sky-900 text-[11px] font-bold border border-white/50 shadow-xs">
                  Digital Gujarat
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/40 text-sky-900 text-[11px] font-bold border border-white/50 shadow-xs">
                  iKhedut Authorized
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/40 text-sky-900 text-[11px] font-bold border border-white/50 shadow-xs">
                  ISO Standard Security
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/30 flex items-center justify-between text-xs text-slate-600">
              <span>© {new Date().getFullYear()} Shiv Computer Keshod</span>
              <button
                type="button"
                onClick={() => navigateTo('about')}
                className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'gu' ? 'વધુ વાંચો' : 'About Us'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
