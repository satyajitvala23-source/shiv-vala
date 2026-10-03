import React from 'react';
import {
  MapPin,
  UserCheck,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GOOGLE_MAPS_LOCATION_URL } from '../../data/mockData';

interface OfficeAddressCardProps {
  className?: string;
  showWorkingHours?: boolean;
  highlightAdmin?: boolean;
}

export const OfficeAddressCard: React.FC<OfficeAddressCardProps> = ({
  className = '',
  showWorkingHours = true,
  highlightAdmin = false,
}) => {
  const { t, language, websiteContent } = useApp();

  // Contact 1: Raviraj Makwana (+91 83202 18440)
  const contact1Name = websiteContent?.ownerName || 'Raviraj Makwana';
  const contact1Phone = '+91 83202 18440';
  const contact1WhatsappUrl = 'https://wa.me/918320218440';
  const contact1CallUrl = 'tel:+918320218440';

  // Contact 2: Nikund Solanki (+91 81604 84989)
  const contact2Name = websiteContent?.secondaryContactName || 'Nikund Solanki';
  const contact2Phone = '+91 81604 84989';
  const contact2WhatsappUrl = 'https://wa.me/918160484989';
  const contact2CallUrl = 'tel:+918160484989';

  // Official Google Maps location link (Requirement: https://maps.app.goo.gl/Qp12UPnnrWvBTeQQ8?g_st=ac8)
  const googleMapsUrl = websiteContent?.googleMapsUrl || GOOGLE_MAPS_LOCATION_URL;

  // Address: "Near Old Railway Crossing, Char Chok, Keshod - 362220"
  const mapsButtonLabel = t.addressCard.viewLocationOnGoogleMaps || t.addressCard.viewOnMap || 'View Location on Google Maps';

  return (
    <div
      id="office-address-card"
      className={`glass-panel rounded-2xl overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Top Banner / Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-blue-500/10 via-transparent to-emerald-500/10 border-b border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                Shiv Computer
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {t.addressCard.verifiedCenter}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'gu' ? 'CSC અને ડિજિટલ સેવા કેન્દ્ર • કેશોદ' : 'CSC & e-Governance Facilitation Center • Keshod'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {highlightAdmin && (
            <span className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 backdrop-blur-xs">
              {language === 'gu' ? 'અધિકૃત કેન્દ્ર વિગતો' : 'Official Center Profile'}
            </span>
          )}

          {/* Quick Header Google Maps Link */}
          <a
            id="header-google-maps-link"
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 transition-all shadow-xs"
            title={mapsButtonLabel}
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 text-blue-500/80" />
          </a>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Two-column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* SECTION 1: OWNER & CONTACT INFORMATION (Raviraj Makwana & Nikund Solanki) */}
          <div className="glass-card p-4 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{language === 'gu' ? 'અધિકૃત સંપર્ક વ્યક્તિઓ' : 'Official Key Contacts'}</span>
              </div>

              {/* Contact 1: Raviraj Makwana */}
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                    RM
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {t.addressCard.owner}:
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {contact1Name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.addressCard.centerOwnerSub}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={contact1WhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[36px] inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all"
                    title={language === 'gu' ? 'રવિરાજ મકવાણા સાથે વોટ્સએપ ચેટ' : 'WhatsApp Raviraj Makwana'}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>WhatsApp: {contact1Phone}</span>
                  </a>
                  <a
                    href={contact1CallUrl}
                    className="min-h-[36px] inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 transition-all"
                    title={language === 'gu' ? 'રવિરાજ મકવાણાને ફોન કરો' : 'Call Raviraj Makwana'}
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* Contact 2: Nikund Solanki */}
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
                    NS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {language === 'gu' ? 'સહ-સંચાલક / પ્રતિનિધિ:' : 'Co-Administrator / Support:'}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {contact2Name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'gu' ? 'ડિજિટલ સેવા અને નાગરિક સપોર્ટ' : 'Citizen Assistance & Operations'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={contact2WhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[36px] inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all"
                    title={language === 'gu' ? 'નિકુંદ સોલંકી સાથે વોટ્સએપ ચેટ' : 'WhatsApp Nikund Solanki'}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>WhatsApp: {contact2Phone}</span>
                  </a>
                  <a
                    href={contact2CallUrl}
                    className="min-h-[36px] inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 transition-all"
                    title={language === 'gu' ? 'નિકુંદ સોલંકીને ફોન કરો' : 'Call Nikund Solanki'}
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: OFFICE ADDRESS */}
          <div className="glass-card p-4 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{t.addressCard.officeAddressTitle}</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  Keshod • PIN 362220
                </span>
              </div>

              <div className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t.addressCard.address}:
                </div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>📍 Shiv Computer</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Near Old Railway Crossing,</p>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Char Chok, Keshod - 362220,</p>
                <p className="text-slate-600 dark:text-slate-300">Gujarat, India.</p>
              </div>

              {showWorkingHours && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{t.addressCard.workingHours}: {websiteContent?.workingHours || t.addressCard.workingHoursVal}</span>
                </div>
              )}
            </div>

            {/* In-Card Google Maps Location Button */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-white/10">
              <a
                id="address-card-direct-maps-btn"
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 border border-blue-400/30 transition-all text-center group"
              >
                <Navigation className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform shrink-0" />
                <span>{mapsButtonLabel}</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeAddressCard;
