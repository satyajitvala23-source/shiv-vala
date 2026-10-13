import React, { useState } from 'react';
import {
  Search,
  Briefcase,
  Sprout,
  FileText,
  Clock,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';

interface ServicesPageProps {
  onApplyService?: (service: ServiceItem) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onApplyService }) => {
  const { services, agricultureServices, language, setCurrentView } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'agriculture' | 'general' | 'certificates'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const allServicesList: ServiceItem[] = [...agricultureServices, ...services];

  const filteredServices = allServicesList.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'agriculture') return service.category === 'agriculture';
    if (activeCategory === 'general') return service.category === 'general';
    if (activeCategory === 'certificates') {
      return (
        service.name.toLowerCase().includes('certificate') ||
        service.name.toLowerCase().includes('દાખલો') ||
        service.name.toLowerCase().includes('income') ||
        service.name.toLowerCase().includes('caste')
      );
    }
    return true;
  });

  return (
    <div className="w-full min-h-screen text-slate-100 pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0a192f]/45 border border-cyan-400/25 backdrop-blur-md shadow-2xl shadow-black/40 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-3">
            <Briefcase className="w-3.5 h-3.5 text-cyan-300" />
            <span>{language === 'gu' ? 'ઓનલાઇન સેવા કેન્દ્ર' : 'Online Digital Services Catalog'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'gu' ? 'તમામ ડિજિટલ અને સરકારી સેવાઓ' : 'Government, Revenue & Agriculture Services'}
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-2 max-w-2xl leading-relaxed">
            {language === 'gu'
              ? 'ઝડપી પ્રોસેસિંગ, સચોટ માહિતી અને વાજબી સરકારી ચાર્જ સાથે શિવ કમ્પ્યુટર દ્વારા પૂરી પાડવામાં આવતી તમામ સેવાઓ.'
              : 'Browse transparent fee structures, processing timelines, and official document requirements.'}
          </p>

          {/* Search Bar & Filter Tabs */}
          <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder={language === 'gu' ? 'સેવા, યોજના અથવા વિભાગ શોધો...' : 'Search by service name, scheme or department...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-300 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 backdrop-blur-md"
              />
              <Search className="w-4 h-4 text-cyan-300 absolute left-3.5 top-3" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Services', labelGu: 'તમામ સેવાઓ' },
                { id: 'agriculture', label: 'Agriculture / Khedut', labelGu: 'ખેતી / ખેડૂત યોજનાઓ' },
                { id: 'general', label: 'General / Citizen', labelGu: 'નાગરિક સેવાઓ' },
                { id: 'certificates', label: 'Certificates', labelGu: 'દાખલાઓ / પ્રમાણપત્રો' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25 border border-cyan-300/40'
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                  }`}
                >
                  {language === 'gu' ? tab.labelGu : tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#0a192f]/40 border border-white/12 backdrop-blur-md shadow-xl shadow-black/25 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Department badge & Category icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-cyan-300 border border-white/15">
                    {service.department}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                    {service.category === 'agriculture' ? (
                      <Sprout className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <FileText className="w-4 h-4 text-cyan-300" />
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                {/* Fee & Processing Time */}
                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fee: <strong className="text-white">₹{service.fee}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Time: <strong className="text-white">{service.processingTime}</strong></span>
                  </div>
                </div>

                {/* Required Documents checklist preview */}
                {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                  <div className="mt-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <div className="text-[11px] font-semibold text-cyan-300 mb-1">
                      {language === 'gu' ? 'જરૂરી આધાર પુરાવા:' : 'Required Documents:'}
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-0.5">
                      {service.requiredDocuments.slice(0, 3).map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{doc}</span>
                        </li>
                      ))}
                      {service.requiredDocuments.length > 3 && (
                        <li className="text-[10px] text-cyan-300 pl-4">
                          +{service.requiredDocuments.length - 3} more documents
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-cyan-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {language === 'gu' ? 'સંપૂર્ણ વિગતો' : 'View Checklist'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onApplyService) onApplyService(service);
                    else {
                      setCurrentView('contact');
                      window.location.hash = '#/contact';
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'gu' ? 'અરજી કરો' : 'Apply'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-[#0a192f]/40 border border-white/10 backdrop-blur-md">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No services found</h3>
            <p className="text-xs text-slate-300 mt-1">Try searching with another keyword or select All Services.</p>
          </div>
        )}

        {/* Service Details Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0a192f]/95 border border-cyan-400/40 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    {selectedService.department}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedService.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{selectedService.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block">Service Fee:</span>
                  <strong className="text-amber-300 text-sm">₹{selectedService.fee}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Processing Timeline:</span>
                  <strong className="text-cyan-300 text-sm">{selectedService.processingTime}</strong>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white mb-2">
                  {language === 'gu' ? 'જરૂરી કાગળો અને પુરાવાઓ:' : 'Mandatory Documents & Proofs:'}
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedService.requiredDocuments?.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs text-slate-200 hover:bg-white/15"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(null);
                    setCurrentView('contact');
                    window.location.hash = '#/contact';
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold"
                >
                  Contact to Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
