import React, { useRef } from 'react';
import {
  Sprout,
  FileText,
  CreditCard,
  Calculator,
  Headphones,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Zap,
  Building,
  Phone,
  MessageCircle,
  FolderDown,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LoginForm } from '../LoginForm';
import { CurrentView, ServiceCardItem } from '../../types';
import { GOOGLE_MAPS_LOCATION_URL } from '../../data/mockData';

interface HomePageProps {
  onForgotPasswordClick: (prefillIdentifier?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onForgotPasswordClick }) => {
  const {
    t,
    language,
    navigateToView,
    isAuthenticated,
    authRole,
    currentUser,
    selectedRole,
    setSelectedRole,
  } = useApp();

  const servicesScrollRef = useRef<HTMLDivElement>(null);

  const scrollServices = (direction: 'left' | 'right') => {
    if (servicesScrollRef.current) {
      const scrollAmount = 340;
      servicesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const navigateTo = (view: CurrentView) => {
    navigateToView(view);
  };

  // 6 Services Cards for Section 2
  const serviceCards: ServiceCardItem[] = [
    {
      id: 'agri-forms',
      title: 'Agriculture Forms',
      titleGu: 'ખેતી લાયક ફોર્મ્સ',
      subtitle: 'Kheti Layak Forms',
      description: 'i-Khedut portal applications, crop damage relief (Kisan Sahay), tractor subsidy, solar water pump (KUSUM) & wire fencing schemes.',
      descriptionGu: 'આઈ-ખેડૂત પોર્ટલ, કિસાન સહાય યોજના, ટ્રેક્ટર સહાય, સોલાર પંપ (કુસુમ) અને તાર ફેન્સિંગ યોજનાના ઓનલાઇન ફોર્મ.',
      icon: <Sprout className="w-6 h-6 text-emerald-600" />,
      tag: 'i-Khedut Portal',
      tagGu: 'આઈ-ખેડૂત પોર્ટલ',
      targetView: 'forms' as CurrentView,
      gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
      borderColor: 'group-hover:border-emerald-400',
    },
    {
      id: 'govt-forms',
      title: 'Government Forms',
      titleGu: 'સરકારી યોજના ફોર્મ્સ',
      subtitle: 'Online Form Filling',
      description: 'Digital Gujarat caste & income certificates, Non-Creamy Layer, e-Samaj Kalyan scholarships, widow & old-age pensions, ration card services.',
      descriptionGu: 'ડિજિટલ ગુજરાત આવક/જાતિના દાખલા, ઈ-સમાજ કલ્યાણ, ગંગા સ્વરૂપા વિધવા સહાય, વૃદ્ધ પેન્શન અને રેશન કાર્ડ સુધારા.',
      icon: <FileText className="w-6 h-6 text-[#2196F3]" />,
      tag: 'Digital Gujarat',
      tagGu: 'ડિજિટલ ગુજરાત',
      targetView: 'forms' as CurrentView,
      gradient: 'from-blue-500/15 via-sky-500/10 to-transparent',
      borderColor: 'group-hover:border-[#2196F3]',
    },
    {
      id: 'doc-download',
      title: 'Documents Download',
      titleGu: 'દસ્તાવેજ ડાઉનલોડ',
      subtitle: 'Download Required Documents',
      description: 'Instant certified 7/12 & 8-A land record copies (AnyRoR), affidavit formats, deed drafts, PAN card acknowledgement, e-KYC printouts.',
      descriptionGu: 'અધિકૃત ૭/૧૨ અને ૮-અ જમીન નકલ (AnyRoR), સોગંદનામા ફોર્મેટ, દસ્તાવેજ મુસદ્દા અને ઈ-કેવાયસી પ્રિન્ટઆઉટ.',
      icon: <FolderDown className="w-6 h-6 text-blue-600" />,
      tag: 'AnyRoR Verified',
      tagGu: 'અધિકૃત નકલ',
      targetView: 'documents' as CurrentView,
      gradient: 'from-cyan-500/15 via-blue-500/10 to-transparent',
      borderColor: 'group-hover:border-blue-400',
    },
    {
      id: 'payments-upi',
      title: 'Online Payments',
      titleGu: 'ઓનલાઇન પેમેન્ટ્સ',
      subtitle: 'UPI, Card & Net Banking',
      description: 'Safe government treasury challan payments, electricity bill payments, property tax, mobile recharge and direct UPI portal checkout.',
      descriptionGu: 'સરકારી ચલણ, લાઈટ બિલ, વેરા બિલ અને તમામ ઓનલાઇન ફી યુપીઆઇ અને કાર્ડ દ્વારા સુરક્ષિત ચૂકવણી.',
      icon: <CreditCard className="w-6 h-6 text-amber-600" />,
      tag: 'Secure Gateway',
      tagGu: 'સુરક્ષિત ગેટવે',
      targetView: 'payments' as CurrentView,
      gradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
      borderColor: 'group-hover:border-amber-400',
    },
    {
      id: 'auto-calc',
      title: 'Auto Calculation',
      titleGu: 'ઓટો કેલ્ક્યુલેશન',
      subtitle: 'Instant Calculations',
      description: 'Instant Vigha to Acre land unit converter, official government fee estimator, age eligibility checker for schemes & stamp duty tools.',
      descriptionGu: 'વીઘા-એકર-ચોરસવાર જમીન ગણતરી, સરકારી ફી ગણતરી અને યોજનાઓ માટે ઉંમર પાત્રતા કેલ્ક્યુલેટર.',
      icon: <Calculator className="w-6 h-6 text-purple-600" />,
      tag: 'Instant Tool',
      tagGu: 'ત્વરિત સાધન',
      targetView: 'calculator' as CurrentView,
      gradient: 'from-purple-500/15 via-indigo-500/10 to-transparent',
      borderColor: 'group-hover:border-purple-400',
    },
    {
      id: 'support-help',
      title: 'Support & Guidance',
      titleGu: 'સપોર્ટ અને માર્ગદર્શન',
      subtitle: 'Help & Guidance',
      description: 'Expert personal consultation by Raviraj Makwana and Nikund Solanki. WhatsApp and phone call assistance for all applications.',
      descriptionGu: 'રવિરાજ મકવાણા અને નિકુંદ સોલંકી દ્વારા વ્યક્તિગત માર્ગદર્શન, વોટ્સએપ અને કોલ હેલ્પલાઇન.',
      icon: <Headphones className="w-6 h-6 text-teal-600" />,
      tag: 'Helpline Service',
      tagGu: 'સહાય કેન્દ્ર',
      targetView: 'contact' as CurrentView,
      gradient: 'from-teal-500/15 via-emerald-500/10 to-transparent',
      borderColor: 'group-hover:border-teal-400',
    },
  ];

  return (
    <div className="w-full min-h-screen text-[#243447] pb-16 pt-20 sm:pt-24">
      {/* =========================================================================
          SECTION 1: HERO SECTION (Left Welcome Content + Right Glass Login Panel)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Welcome & Value Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5FF] border border-[#2196F3]/30 self-start shadow-xs">
              <Sparkles className="w-4 h-4 text-[#2196F3] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-[#2196F3] tracking-wide">
                {language === 'gu'
                  ? 'શિવ કમ્પ્યુટર — વિશ્વસનીય ડિજિટલ સેવા કેન્દ્ર'
                  : 'Shiv Computer — Trusted Digital Service Platform'}
              </span>
            </div>

            {/* Main Brand Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-[#243447]">
              <span>{language === 'gu' ? 'તમામ સરકારી અને કૃષિ સેવાઓ' : 'Fast, Reliable'}</span>{' '}
              <span className="text-[#2196F3]">
                {language === 'gu' ? 'એક જ સ્થળે' : 'Online Digital Services'}
              </span>
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-base sm:text-xl font-bold text-[#64748B] leading-relaxed max-w-2xl">
              Online Services | Form Filling | Agriculture Forms | Digital Support
            </p>

            {/* Gujarati Welcome Message */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D8E8F5] text-sm sm:text-base text-[#243447] leading-relaxed shadow-xs">
              <p className="font-medium">
                {language === 'gu'
                  ? 'ખેડૂત સહાય યોજનાઓ, આઈ-ખેડૂત પોર્ટલ, આવક અને જાતિના દાખલા, સોગંદનામા તેમજ તમામ ઓનલાઇન ફોર્મ સચોટ અને ઝડપથી ભરવા માટે કેશોદ ખાતેનું અગ્રણી કેન્દ્ર.'
                  : 'Empowering citizens & farmers across Keshod with seamless government form submissions, iKhedut agriculture schemes, certified certificates, and verified document downloads.'}
              </p>
            </div>

            {/* 3 Core Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-[#D8E8F5] flex items-center gap-3 hover:border-[#90CAF9] transition-all shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#EAF5FF] border border-[#2196F3]/30 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-[#2196F3]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#243447]">
                    {language === 'gu' ? 'ઝડપી સેવા' : 'Fast Service'}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {language === 'gu' ? 'સેમ ડે પ્રોસેસિંગ' : 'Same-day processing'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D8E8F5] flex items-center gap-3 hover:border-[#90CAF9] transition-all shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#EAF5FF] border border-[#2196F3]/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#2196F3]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#243447]">
                    {language === 'gu' ? 'સુરક્ષિત અને અધિકૃત' : 'Secure & Reliable'}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {language === 'gu' ? 'સરકારી પોર્ટલ પ્રમાણિત' : 'Official compliance'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D8E8F5] flex items-center gap-3 hover:border-[#90CAF9] transition-all shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#EAF5FF] border border-[#2196F3]/30 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 text-[#2196F3]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#243447]">
                    {language === 'gu' ? 'સહાય કેન્દ્ર' : '24/7 Support'}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {language === 'gu' ? 'વોટ્સએપ હેલ્પલાઇન' : 'WhatsApp helpline'}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('services')}
                className="px-6 py-3 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{language === 'gu' ? 'સેવાઓ જુઓ' : 'Explore Services'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('applications')}
                className="px-6 py-3 rounded-xl bg-[#EAF5FF] hover:bg-[#DCEEFF] border border-[#D8E8F5] text-[#2196F3] text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle className="w-4 h-4 text-[#2196F3]" />
                <span>{language === 'gu' ? 'અરજી સ્ટેટસ તપાસો' : 'Track Application'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Transparent Glass Login Panel (or User Welcome Card if logged in) */}
          <div className="lg:col-span-5 flex justify-center">
            {isAuthenticated ? (
              <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-[#D8E8F5] shadow-sm text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF5FF] border border-[#2196F3]/30 flex items-center justify-center text-[#2196F3] text-2xl font-black shadow-xs">
                  {authRole === 'admin' ? 'A' : (currentUser?.name?.charAt(0) || 'U')}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-2">
                    {authRole === 'admin' ? 'Administrator' : 'Verified Citizen'}
                  </div>
                  <h3 className="text-xl font-bold text-[#243447]">
                    {language === 'gu' ? 'સ્વાગત છે,' : 'Welcome back,'} {currentUser?.name || (authRole === 'admin' ? 'Admin' : 'User')}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 truncate">
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
                    className="w-full py-3 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{authRole === 'admin' ? 'Open Admin Dashboard' : 'Open User Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('documents')}
                    className="w-full py-2.5 rounded-xl bg-[#EAF5FF] hover:bg-[#DCEEFF] border border-[#D8E8F5] text-[#2196F3] text-xs font-bold transition-all cursor-pointer shadow-xs"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[#D8E8F5]">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-2">
              {language === 'gu' ? 'મુખ્ય સેવાઓ' : 'Our Services'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#243447] tracking-tight">
              {language === 'gu' ? 'ડિજિટલ અને સરકારી સેવાઓ' : 'Comprehensive Digital Solutions'}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl font-medium">
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
              className="p-2.5 rounded-xl bg-white hover:bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] hover:text-[#2196F3] transition-colors cursor-pointer shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollServices('right')}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] hover:text-[#2196F3] transition-colors cursor-pointer shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={servicesScrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'thin' }}
        >
          {serviceCards.map((service) => (
            <div
              key={service.id}
              onClick={() => navigateTo(service.targetView)}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] p-5 sm:p-6 rounded-2xl bg-white border border-[#D8E8F5] hover:border-[#90CAF9] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Header: Icon & Tag */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    {service.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30">
                    {language === 'gu' ? service.tagGu : service.tag}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-bold text-[#243447] group-hover:text-[#2196F3] transition-colors">
                  {language === 'gu' ? service.titleGu : service.title}
                </h3>
                <div className="text-xs font-semibold text-[#2196F3] mb-2">
                  {service.subtitle}
                </div>

                {/* Description */}
                <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                  {language === 'gu' ? service.descriptionGu : service.description}
                </p>
              </div>

              {/* Bottom Action Arrow */}
              <div className="pt-5 mt-4 border-t border-[#D8E8F5] flex items-center justify-between text-xs font-bold text-[#2196F3] group-hover:text-[#1976D2] transition-colors">
                <span>{language === 'gu' ? 'વિગતો જુઓ' : 'Learn More'}</span>
                <div className="w-7 h-7 rounded-lg bg-[#EAF5FF] flex items-center justify-center group-hover:bg-[#2196F3] group-hover:text-white transition-colors shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: LOWER INFORMATION SECTION (4 Clean Light Panels)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[#D8E8F5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* PANEL A: Agriculture Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs relative overflow-hidden group">
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 mb-3">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'gu' ? 'કૃષિ અને ખેડૂત કલ્યાણ' : 'Farmer & Agriculture Care'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#243447]">
                  {language === 'gu' ? 'ખેડૂત મિત્રો માટે સમર્પિત સેવાઓ' : 'Dedicated Portal for Saurashtra Farmers'}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
                  {language === 'gu'
                    ? 'આઈ-ખેડૂત યોજના, તાર ફેન્સિંગ, સોલાર પંપ સબસીડી, પાક નુકસાની સહાય અને જમીન મહેસૂલ રેકોર્ડ્સ માટે નિષ્ણાત સહાય.'
                    : 'End-to-end guidance for iKhedut applications, land extract verifications (AnyRoR), solar pump subsidies, and agricultural grants.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('forms')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{language === 'gu' ? 'ખેતી લાયક ફોર્મ્સ જુઓ' : 'Browse Agriculture Forms'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* PANEL B: Quick Access Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs relative overflow-hidden group">
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-3">
                  <Zap className="w-3.5 h-3.5 text-[#2196F3]" />
                  <span>{language === 'gu' ? 'ઝડપી સુવિધાઓ' : 'Quick Access Hub'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#243447]">
                  {language === 'gu' ? 'ત્વરિત લિંક્સ અને એકાઉન્ટ સેવાઓ' : 'Fast Application & Document Access'}
                </h3>
              </div>

              {/* 4 Quick Access Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => navigateTo('applications')}
                  className="p-3 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-left transition-all cursor-pointer group shadow-xs"
                >
                  <FileText className="w-4 h-4 text-[#2196F3] mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-[#243447]">
                    {language === 'gu' ? 'મારી અરજીઓ' : 'My Applications'}
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    {language === 'gu' ? 'લાઈવ રેકોર્ડ' : 'Application list'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('applications')}
                  className="p-3 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-left transition-all cursor-pointer group shadow-xs"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-[#243447]">
                    {language === 'gu' ? 'સ્ટેટસ ટ્રેક' : 'Track Status'}
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    {language === 'gu' ? 'પ્રગતિ જુઓ' : 'Check timeline'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('documents')}
                  className="p-3 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-left transition-all cursor-pointer group shadow-xs"
                >
                  <FolderDown className="w-4 h-4 text-[#2196F3] mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-[#243447]">
                    {language === 'gu' ? 'દસ્તાવેજ ડાઉનલોડ' : 'Download Docs'}
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    {language === 'gu' ? 'પીડીએફ અને પ્રમાણપત્ર' : 'PDFs & formats'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('payments')}
                  className="p-3 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-left transition-all cursor-pointer group shadow-xs"
                >
                  <CreditCard className="w-4 h-4 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-[#243447]">
                    {language === 'gu' ? 'પેમેન્ટ હિસ્ટ્રી' : 'Payment History'}
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    {language === 'gu' ? 'ફી અને રસીદ' : 'Fee receipts'}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* PANEL C: Business Information Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30">
                <Building className="w-3.5 h-3.5 text-[#2196F3]" />
                <span>{language === 'gu' ? 'સંપર્ક અને કાર્યાલય' : 'Business & Office Information'}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#243447]">Shiv Computer Keshod</h3>
                <p className="text-xs text-[#64748B] mt-1 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2196F3] shrink-0 mt-0.5" />
                  <span>Near Old Railway Crossing, Char Chok, Keshod - 362220, Dist. Junagadh, Gujarat</span>
                </p>
              </div>

              {/* Both Contact Persons: Raviraj Makwana & Nikund Solanki */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Raviraj Makwana */}
                <div className="p-3 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="text-xs font-bold text-[#243447]">Raviraj Makwana</div>
                    <div className="text-[11px] text-[#2196F3] font-semibold mt-0.5">+91 83202 18440 / 92134 88440</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#D8E8F5]">
                    <a
                      href="https://wa.me/918320218440"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="tel:+918320218440"
                      className="px-2.5 py-1 rounded-lg bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 text-[11px] font-bold flex items-center gap-1 hover:bg-[#DCEEFF]"
                    >
                      <Phone className="w-3 h-3 text-[#2196F3]" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>

                {/* Nikund Solanki */}
                <div className="p-3 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="text-xs font-bold text-[#243447]">Nikund Solanki</div>
                    <div className="text-[11px] text-[#2196F3] font-semibold mt-0.5">+91 81604 84989</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#D8E8F5]">
                    <a
                      href="https://wa.me/918160484989"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="tel:+918160484989"
                      className="px-2.5 py-1 rounded-lg bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 text-[11px] font-bold flex items-center gap-1 hover:bg-[#DCEEFF]"
                    >
                      <Phone className="w-3 h-3 text-[#2196F3]" />
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
                  className="w-full py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>{language === 'gu' ? 'ગૂગલ મેપ્સ પર લોકેશન જુઓ' : 'Open Location in Google Maps'}</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              </div>
            </div>
          </div>

          {/* PANEL D: Brand Banner Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F5FAFF] border border-[#D8E8F5] p-1.5 flex items-center justify-center shadow-xs hover:scale-105 transition-transform cursor-pointer shrink-0"
                  title="Shiv Computer — Home"
                  aria-label="Go to Home"
                >
                  <img
                    src="/logo.png"
                    alt="Shiv Computer Logo"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </button>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#243447]">
                    {language === 'gu' ? 'તમારું કામ, અમારી જવાબદારી' : 'Your Work, Our Responsibility'}
                  </h3>
                  <div className="text-xs font-bold text-[#2196F3] mt-0.5">
                    CSC &amp; Digital Gujarat Authorized Service Center
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">
                {language === 'gu'
                  ? 'વિશ્વસનીય, પારદર્શક અને સમયસર સેવાઓ સાથે ખેડૂત ભાઈઓ અને નાગરિકો માટે છેલ્લા અનેક વર્ષોથી સમર્પિત કેન્દ્ર. તમામ કામગીરી સરકારી નિયમો અનુસાર.'
                  : 'Delivering dedicated digital governance services with absolute transparency, efficiency, and personal operator support across Saurashtra.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#EAF5FF] text-[#2196F3] text-[11px] font-bold border border-[#2196F3]/30 shadow-xs">
                  CSC Certified
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#EAF5FF] text-[#2196F3] text-[11px] font-bold border border-[#2196F3]/30 shadow-xs">
                  Digital Gujarat
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#EAF5FF] text-[#2196F3] text-[11px] font-bold border border-[#2196F3]/30 shadow-xs">
                  iKhedut Authorized
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#EAF5FF] text-[#2196F3] text-[11px] font-bold border border-[#2196F3]/30 shadow-xs">
                  ISO Standard Security
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#D8E8F5] flex items-center justify-between text-xs text-[#64748B]">
              <span>© {new Date().getFullYear()} Shiv Computer Keshod</span>
              <button
                type="button"
                onClick={() => navigateTo('about')}
                className="text-[#2196F3] hover:text-[#1976D2] font-bold flex items-center gap-1 cursor-pointer"
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
