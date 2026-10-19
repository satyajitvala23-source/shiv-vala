import React, { useState } from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  CheckCircle,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FormSchemaItem {
  id: string;
  title: string;
  titleGu: string;
  category: 'agriculture' | 'revenue' | 'general' | 'certificate';
  department: string;
  lastDate: string;
  eligibility: string;
  requiredDocs: string[];
  officialLink: string;
}

export const FormsPage: React.FC = () => {
  const { language, setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'agriculture' | 'revenue' | 'general'>('all');

  const formsData: FormSchemaItem[] = [
    {
      id: 'f-1',
      title: 'i-Khedut Portal — Subsidized Solar Water Pump (KUSUM)',
      titleGu: 'આઈ-ખેડૂત પોર્ટલ — સોલાર વોટર પંપ યોજના (કુસુમ)',
      category: 'agriculture',
      department: 'Agriculture Dept, Gujarat',
      lastDate: '31 Oct 2026',
      eligibility: 'Farmer with minimum 1 acre agricultural land, active water source, valid 7/12 & 8-A.',
      requiredDocs: ['7/12 and 8-A Copies', 'Aadhaar Card Copy', 'Bank Passbook / Cancelled Cheque', 'Water Availability Proof'],
      officialLink: 'https://ikhedut.gujarat.gov.in',
    },
    {
      id: 'f-2',
      title: 'Digital Gujarat — Caste / Non-Creamy Layer Certificate',
      titleGu: 'ડિજિટલ ગુજરાત — આવક અને નોન-ક્રીમીલેયર પ્રમાણપત્ર',
      category: 'general',
      department: 'Social Justice & Empowerment',
      lastDate: 'Ongoing',
      eligibility: 'Resident of Gujarat belonging to OBC / SEBC / EWS categories with required income proofs.',
      requiredDocs: ['School Leaving Certificate', 'Ration Card', 'Salary Slip / Talati Income Proof', 'Affidavit in prescribed format'],
      officialLink: 'https://www.digitalgujarat.gov.in',
    },
    {
      id: 'f-3',
      title: 'AnyRoR Gujarat — Certified VF-7/12 & VF-8A RoR Extract',
      titleGu: 'AnyRoR — અધિકૃત ૭/૧૨ અને ૮-અ જમીન નકલ',
      category: 'revenue',
      department: 'Revenue Dept, Gujarat',
      lastDate: 'Permanent Instant Service',
      eligibility: 'Any land owner or citizen requiring land records verification.',
      requiredDocs: ['Survey / Khata Number', 'District, Taluka, Village Name', 'Aadhaar for identity'],
      officialLink: 'https://anyror.gujarat.gov.in',
    },
    {
      id: 'f-4',
      title: 'Tractor & Agricultural Equipment Subsidy (i-Khedut)',
      titleGu: 'ટ્રેક્ટર અને કૃષિ ઓજારો સહાય યોજના (આઈ-ખેડૂત)',
      category: 'agriculture',
      department: 'Director of Agriculture, Gandhinagar',
      lastDate: 'Seasonal Window',
      eligibility: 'Small and marginal farmers holding 7/12 and tractor RC book eligibility.',
      requiredDocs: ['Land Record 7/12', 'Aadhaar Card', 'Quotations from Authorized Dealer', 'Bank Account Details'],
      officialLink: 'https://ikhedut.gujarat.gov.in',
    },
    {
      id: 'f-5',
      title: 'Farmer Welfare Life Insurance — Varasdar / Nominee Registration',
      titleGu: 'ખેડૂત અકસ્માત વીમા યોજના — વારસદાર નોમિનેશન',
      category: 'agriculture',
      department: 'Farmer Welfare & Co-operation',
      lastDate: 'All Year Active',
      eligibility: 'Khatedar farmer or spouse meeting accidental insurance guidelines.',
      requiredDocs: ['Khatedar 7/12 / 8A', 'Nominee Aadhaar', 'Ration Card', 'Bank Passbook'],
      officialLink: 'https://agri.gujarat.gov.in',
    },
    {
      id: 'f-6',
      title: 'Property Card & City Survey RoR — e-Jameen Portal',
      titleGu: 'પ્રોપર્ટી કાર્ડ અને સિટી સર્વે ઉતારો — ઇ-જમીન પોર્ટલ',
      category: 'revenue',
      department: 'Settlement Commissioner & Land Records',
      lastDate: 'Instant Counter Service',
      eligibility: 'Urban property holder or authorized applicant.',
      requiredDocs: ['City Survey Number', 'Ward Number', 'Proof of Ownership'],
      officialLink: 'https://anyror.gujarat.gov.in',
    },
  ];

  const filteredForms = formsData.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleGu.includes(searchQuery) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="w-full min-h-screen text-[#243447] pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-3">
            <FileText className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>{language === 'gu' ? 'સરકારી અને કૃષિ ફોર્મ્સ' : 'Official Forms & Schemas'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#243447] tracking-tight">
            {language === 'gu' ? 'ઓનલાઇન ફોર્મ અને અરજી પત્રકો' : 'Government & Agriculture Online Forms'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            {language === 'gu'
              ? 'આઈ-ખેડૂત, ડિજિટલ ગુજરાત, એનીઆરઓઆર અને સરકારી યોજનાઓના ફોર્મ્સ, પાત્રતા અને નિયમો.'
              : 'Official guidelines, required documentation lists, deadline reminders, and direct application links.'}
          </p>

          {/* Search Bar & Category Filter */}
          <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder={language === 'gu' ? 'ફોર્મ અથવા યોજનાનું નામ શોધો...' : 'Search form, scheme or portal...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] placeholder-[#64748B] text-xs sm:text-sm focus:outline-none focus:border-[#2196F3] focus:bg-white"
              />
              <Search className="w-4 h-4 text-[#2196F3] absolute left-3.5 top-3" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Forms', labelGu: 'તમામ ફોર્મ્સ' },
                { id: 'agriculture', label: 'Agriculture (ખેતી)', labelGu: 'ખેતી / આઈ-ખેડૂત' },
                { id: 'revenue', label: 'Revenue (મહેસૂલ)', labelGu: 'જમીન / ૭-૧૨' },
                { id: 'general', label: 'Certificates (દાખલા)', labelGu: 'પ્રમાણપત્રો' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === tab.id
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

        {/* Forms Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredForms.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs hover:border-[#90CAF9] hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Department & Last Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/25">
                    {item.department}
                  </span>
                  <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#2196F3]" />
                    <span>{item.lastDate}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#243447] group-hover:text-[#2196F3] transition-colors">
                  {language === 'gu' ? item.titleGu : item.title}
                </h3>

                {/* Eligibility note */}
                <div className="mt-3 p-3 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-xs text-[#243447]">
                  <div className="font-semibold text-[#2196F3] text-[11px] mb-1">
                    {language === 'gu' ? 'પાત્રતા માપદંડ:' : 'Eligibility Criteria:'}
                  </div>
                  <p className="leading-relaxed text-[#64748B]">{item.eligibility}</p>
                </div>

                {/* Required Documents */}
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-[#243447] mb-1.5">
                    {language === 'gu' ? 'જરૂરી દસ્તાવેજો:' : 'Required Document Checklist:'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {item.requiredDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Official Portal link & Contact to Apply */}
              <div className="mt-5 pt-4 border-t border-[#D8E8F5] flex flex-wrap items-center justify-between gap-3">
                <a
                  href={item.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#F5FAFF] hover:bg-[#EAF5FF] border border-[#D8E8F5] text-[#2196F3] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{language === 'gu' ? 'સત્તાવાર પોર્ટલ' : 'Official Portal'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('contact');
                    window.location.hash = '#/contact';
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{language === 'gu' ? 'શિવ કમ્પ્યુટર દ્વારા ભરાવો' : 'Apply via Shiv Computer'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
