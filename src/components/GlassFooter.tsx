import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CurrentView } from '../types';
import { GOOGLE_MAPS_LOCATION_URL } from '../data/mockData';

export const GlassFooter: React.FC = () => {
  const { setCurrentView, language } = useApp();

  const navigateTo = (view: CurrentView) => {
    setCurrentView(view);
    window.location.hash = `#/${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/30 bg-white/25 backdrop-blur-xl text-slate-700 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/40 border border-white/50 p-0.5 flex items-center justify-center shadow-xs">
                <img src="/logo.png" alt="Shiv Computer" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-black text-base text-slate-900 tracking-tight">Shiv Computer</span>
                <span className="text-[11px] text-sky-700 block font-bold">Digital Gujarat & CSC</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {language === 'gu'
                ? 'ખેડૂત સહાય, તમામ સરકારી યોજનાઓ, આવક/જાતિના દાખલા અને ઓનલાઇન સેવાઓ માટે આપનું વિશ્વાસપાત્ર કેન્દ્ર.'
                : 'Premier digital service hub empowering farmers and citizens with fast government form processing and certified document issuance.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-850 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Your Work Our Responsibility</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'gu' ? 'મુખ્ય લિંક્સ' : 'Navigation Links'}
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: 'Home Page', labelGu: 'હોમ પેજ' },
                { id: 'services', label: 'All Services', labelGu: 'તમામ સેવાઓ' },
                { id: 'forms', label: 'Govt & Agriculture Forms', labelGu: 'સરકારી અને કૃષિ ફોર્મ્સ' },
                { id: 'documents', label: 'Document Hub', labelGu: 'દસ્તાવેજ ડાઉનલોડ' },
                { id: 'applications', label: 'Track Application Status', labelGu: 'સ્ટેટસ ટ્રેક કરો' },
                { id: 'calculator', label: 'Land & Age Calculator', labelGu: 'જમીન અને ઉંમર કેલ્ક્યુલેટર' },
                { id: 'payments', label: 'Payment & Fee Guide', labelGu: 'પેમેન્ટ અને ફી વિગતો' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => navigateTo(item.id as CurrentView)}
                    className="hover:text-sky-700 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer text-left font-medium"
                  >
                    <ChevronRight className="w-3 h-3 text-sky-600" />
                    <span>{language === 'gu' ? item.labelGu : item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Key Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'gu' ? 'સંપર્ક વ્યક્તિઓ' : 'Official Key Contacts'}
            </h4>
            <div className="space-y-3 text-xs">
              {/* Contact 1 */}
              <div className="p-3 rounded-xl bg-white/35 border border-white/50 space-y-1 shadow-xs">
                <div className="font-bold text-slate-900">Raviraj Makwana</div>
                <div className="text-sky-800 font-semibold">+91 83202 18440 / 92134 88440</div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://wa.me/918320218440"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                  </a>
                  <span className="text-slate-400">·</span>
                  <a href="tel:+918320218440" className="text-[11px] text-sky-700 font-bold hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3 text-sky-600" /> Call
                  </a>
                </div>
              </div>

              {/* Contact 2 */}
              <div className="p-3 rounded-xl bg-white/35 border border-white/50 space-y-1 shadow-xs">
                <div className="font-bold text-slate-900">Nikund Solanki</div>
                <div className="text-sky-800 font-semibold">+91 81604 84989</div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://wa.me/918160484989"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                  </a>
                  <span className="text-slate-400">·</span>
                  <a href="tel:+918160484989" className="text-[11px] text-sky-700 font-bold hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3 text-sky-600" /> Call
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Office Address & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'gu' ? 'કાર્યાલયનું સરનામું' : 'Office Location'}
            </h4>
            <div className="text-xs text-slate-700 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Near Old Railway Crossing, Char Chok, Keshod - 362220, Gujarat</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div>Mon - Sat: 9:00 AM - 8:00 PM</div>
                  <div>Sunday: 10:00 AM - 2:00 PM</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={GOOGLE_MAPS_LOCATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-500/20"
              >
                <MapPin className="w-3.5 h-3.5 text-white" />
                <span>{language === 'gu' ? 'ગૂગલ મેપ્સ પર જુઓ' : 'View on Google Maps'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            © {new Date().getFullYear()} Shiv Computer Keshod. All rights reserved.
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className="hover:text-sky-800 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => navigateTo('contact')}
              className="hover:text-sky-800 transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => navigateTo('payments')}
              className="hover:text-sky-800 transition-colors cursor-pointer"
            >
              Fees
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
