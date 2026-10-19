import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  IndianRupee,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sprout,
  FileText,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';

interface ServicesPageProps {
  onApplyService?: (service: ServiceItem) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onApplyService }) => {
  const { services, agricultureServices, language, setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'agriculture' | 'general' | 'certificates'>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Combine regular and agriculture services
  const allServices = [...services, ...agricultureServices];

  // Filter based on search and category
  const filteredServices = allServices.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'agriculture') return s.category === 'agriculture';
    if (activeCategory === 'certificates') return s.category === 'certificate' || s.name.includes('દાખલો') || s.name.includes('Certificate');
    if (activeCategory === 'general') return s.category !== 'agriculture';
    return true;
  });

  return (
    <div className="w-full min-h-screen text-[#243447] pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-3">
            <Briefcase className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>{language === 'gu' ? 'ઓનલાઇન સેવા કેન્દ્ર' : 'Online Digital Services Catalog'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#243447] tracking-tight">
            {language === 'gu' ? 'તમામ ડિજિટલ અને સરકારી સેવાઓ' : 'Government, Revenue & Agriculture Services'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-2xl leading-relaxed">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] placeholder-[#64748B] text-xs sm:text-sm focus:outline-none focus:border-[#2196F3] focus:bg-white"
              />
              <Search className="w-4 h-4 text-[#2196F3] absolute left-3.5 top-3" />
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
                      ? 'bg-[#2196F3] text-white shadow-xs'
                      : 'bg-[#F5FAFF] hover:bg-[#EAF5FF] text-[#243447] border border-[#D8E8F5]'
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
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D8E8F5] shadow-xs hover:border-[#90CAF9] hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Department badge & Category icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/25">
                    {service.department}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#EAF5FF] border border-[#2196F3]/30 flex items-center justify-center">
                    {service.category === 'agriculture' ? (
                      <Sprout className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#2196F3]" />
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base sm:text-lg font-bold text-[#243447] group-hover:text-[#2196F3] transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                {/* Fee & Processing Time */}
                <div className="mt-4 pt-3 border-t border-[#D8E8F5] grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B]">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                    <span>Fee: <strong className="text-[#243447]">₹{service.fee}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#64748B]">
                    <Clock className="w-3.5 h-3.5 text-[#2196F3]" />
                    <span>Time: <strong className="text-[#243447]">{service.processingTime}</strong></span>
                  </div>
                </div>

                {/* Required Documents checklist preview */}
                {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                  <div className="mt-3 bg-[#F5FAFF] p-2.5 rounded-xl border border-[#D8E8F5]">
                    <div className="text-[11px] font-semibold text-[#2196F3] mb-1">
                      {language === 'gu' ? 'જરૂરી આધાર પુરાવા:' : 'Required Documents:'}
                    </div>
                    <ul className="text-[11px] text-[#64748B] space-y-0.5">
                      {service.requiredDocuments.slice(0, 3).map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{doc}</span>
                        </li>
                      ))}
                      {service.requiredDocuments.length > 3 && (
                        <li className="text-[10px] text-[#2196F3] pl-4">
                          +{service.requiredDocuments.length - 3} more documents
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#D8E8F5] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="flex-1 py-2 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-[#2196F3] text-xs font-semibold transition-colors cursor-pointer"
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
                  className="px-3.5 py-2 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'gu' ? 'અરજી કરો' : 'Apply'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#D8E8F5] shadow-xs">
            <Search className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#243447]">No services found</h3>
            <p className="text-xs text-[#64748B] mt-1">Try searching with another keyword or select All Services.</p>
          </div>
        )}

        {/* Service Details Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-[#D8E8F5] shadow-2xl space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-[#D8E8F5] pb-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5FF] text-[#2196F3]">
                    {selectedService.department}
                  </span>
                  <h3 className="text-lg font-bold text-[#243447] mt-1">{selectedService.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#243447] hover:bg-[#F5FAFF]"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">{selectedService.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-xs">
                <div>
                  <span className="text-[#64748B] block">Service Fee:</span>
                  <strong className="text-amber-700 text-sm">₹{selectedService.fee}</strong>
                </div>
                <div>
                  <span className="text-[#64748B] block">Processing Timeline:</span>
                  <strong className="text-[#2196F3] text-sm">{selectedService.processingTime}</strong>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#243447] mb-2">
                  {language === 'gu' ? 'જરૂરી કાગળો અને પુરાવાઓ:' : 'Mandatory Documents & Proofs:'}
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedService.requiredDocuments?.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#F5FAFF] border border-[#D8E8F5] text-xs text-[#243447]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#D8E8F5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 rounded-xl bg-[#F5FAFF] text-xs text-[#64748B] hover:bg-[#EAF5FF]"
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
                  className="px-4 py-2 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold shadow-xs"
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
