import React from 'react';
import {
  ShieldCheck,
  Building,
  UserCheck,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AboutPage: React.FC = () => {
  const { language, setCurrentView } = useApp();

  return (
    <div className="w-full min-h-screen text-slate-100 pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0a192f]/45 border border-cyan-400/25 backdrop-blur-md shadow-2xl shadow-black/40 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-3">
            <Building className="w-3.5 h-3.5 text-cyan-300" />
            <span>{language === 'gu' ? 'શિવ કમ્પ્યુટર વિશે' : 'About Shiv Computer'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'gu' ? 'તમારું કામ, અમારી જવાબદારી' : 'Your Work Our Responsibility'}
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-2 max-w-2xl leading-relaxed">
            {language === 'gu'
              ? 'કેશોદ તથા સમગ્ર સૌરાષ્ટ્ર વિસ્તારમાં ખેડૂત ભાઈઓ અને નાગરિકો માટે છેલ્લા અનેક વર્ષોથી વિશ્વસનીય ડિજિટલ સેવા કેન્દ્ર.'
              : 'Serving farmers and citizens across Keshod with transparent, expedited digital governance and documentation solutions.'}
          </p>
        </div>

        {/* Story & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0a192f]/40 border border-white/12 backdrop-blur-md shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-white">
              {language === 'gu' ? 'અમારું લક્ષ્ય અને પ્રતિબદ્ધતા' : 'Our Mission & Heritage'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'gu'
                ? 'શિવ કમ્પ્યુટરની સ્થાપના સામાન્ય નાગરિકો અને ગ્રામ્ય વિસ્તારના ખેડૂતોને સરકારી કચેરીઓના ચક્કરમાંથી મુક્તિ અપાવીને એક જ સ્થળે તમામ ઓનલાઇન સેવાઓ સચોટ રીતે પૂરી પાડવાના હેતુથી કરવામાં આવી છે.'
                : 'Shiv Computer was founded with a singular purpose: eliminating red tape for rural farmers and citizens by providing a transparent, prompt, and technologically advanced single-window service hub.'}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'gu'
                ? 'આઈ-ખેડૂત પોર્ટલ પર પાક નુકસાની, સબસીડી, તાર ફેન્સિંગ, આવકના દાખલા, જાતિના દાખલા, સોગંદનામા, ૭/૧૨ નકલ અને પાન કાર્ડ જેવી સેવાઓ સંપૂર્ણ કાળજી સાથે પૂર્ણ કરવામાં આવે છે.'
                : 'From complex iKhedut subvention schemes and AnyRoR land record verification to certified income affidavits and biometric e-KYC, every submission is handled with extreme accuracy.'}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-white">100% Official Compliance</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-white">Guaranteed Prompt Service</span>
              </div>
            </div>
          </div>

          {/* Key Leadership Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Raviraj Makwana Card */}
            <div className="p-6 rounded-3xl bg-[#0a192f]/40 border border-cyan-400/30 backdrop-blur-md shadow-xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-xl font-black shrink-0 shadow-md">
                RM
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Raviraj Makwana</h3>
                <span className="text-xs text-cyan-300 font-semibold block">Founder & Key Operator</span>
                <span className="text-xs text-slate-300 mt-0.5 block">+91 83202 18440 / 92134 88440</span>
              </div>
            </div>

            {/* Nikund Solanki Card */}
            <div className="p-6 rounded-3xl bg-[#0a192f]/40 border border-sky-400/30 backdrop-blur-md shadow-xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-white text-xl font-black shrink-0 shadow-md">
                NS
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Nikund Solanki</h3>
                <span className="text-xs text-sky-300 font-semibold block">Operations & Support Associate</span>
                <span className="text-xs text-slate-300 mt-0.5 block">+91 81604 84989</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('contact');
                  window.location.hash = '#/contact';
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer"
              >
                Contact Our Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
