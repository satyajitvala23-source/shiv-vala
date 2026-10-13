import React, { useState } from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  Download,
  Calendar,
  CheckCircle,
  Sprout,
  Building2,
  FileCheck,
  Tag,
  IndianRupee,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FormsPage: React.FC = () => {
  const { forms, language, setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'agriculture' | 'general' | 'revenue'>('all');

  // Pre-configured official Gujarat government & agriculture forms
  const coreForms = [
    {
      id: 'FORM-01',
      title: 'iKhedut Portal — Krushi Yantra Sahay (Tractor & Tools)',
      titleGu: 'આઈ-ખેડૂત પોર્ટલ — કૃષિ યાંત્રીકરણ સહાય (ટ્રેક્ટર અને ઓજારો)',
      category: 'agriculture',
      department: 'Directorate of Agriculture, Gujarat',
      eligibility: 'Farmer with 7/12 and 8A land records in Gujarat. One application per survey number.',
      fee: 'Online Free / Nominal CSC form assistance charge',
      lastDate: 'Current Season Active',
      requiredDocs: ['7/12 & 8A Records', 'Aadhaar Card', 'Bank Passbook Cancelled Cheque', 'Caste Certificate (if applicable)'],
      officialLink: 'https://ikhedut.gujarat.gov.in',
      pdfName: 'iKhedut_Tractor_Sahay_Form.pdf',
    },
    {
      id: 'FORM-02',
      title: 'PM Kisan Samman Nidhi (e-KYC & New Registration)',
      titleGu: 'પીએમ કિસાન સન્માન નિધિ — નવી નોંધણી અને ઇ-કેવાયસી',
      category: 'agriculture',
      department: 'Ministry of Agriculture & Farmers Welfare',
      eligibility: 'Small and marginal landholder farmer families with active bank account.',
      fee: '₹0 Portal Fee',
      lastDate: 'Open Year-round',
      requiredDocs: ['Aadhaar Card with Mobile OTP', 'Land Ownership Record (7/12)', 'Bank Account Details'],
      officialLink: 'https://pmkisan.gov.in',
      pdfName: 'PM_Kisan_Registration_Guide.pdf',
    },
    {
      id: 'FORM-03',
      title: 'AnyRoR — 7/12, 8A & Hakka Patrak (VF-6)',
      titleGu: 'એનીઆરઓઆર — ૭/૧૨, ૮-અ તથા હક્ક પત્રક (ગા.ન. ૬)',
      category: 'revenue',
      department: 'Revenue Department, Govt of Gujarat',
      eligibility: 'Any land owner or farmer in Gujarat.',
      fee: '₹5 - ₹20 Govt charge per signed copy',
      lastDate: 'Instant Available',
      requiredDocs: ['District, Taluka, Village Name', 'Survey / Khata Number'],
      officialLink: 'https://anyror.gujarat.gov.in',
      pdfName: 'AnyRoR_Land_Records_Format.pdf',
    },
    {
      id: 'FORM-04',
      title: 'Income Certificate (આવકનો દાખલો) — Digital Gujarat',
      titleGu: 'આવકનો દાખલો — ડિજિટલ ગુજરાત સેવા',
      category: 'general',
      department: 'Panchayat & Revenue Department',
      eligibility: 'Resident of Gujarat with valid address proof and family income affidavit.',
      fee: '₹20 Govt stamp / fee',
      lastDate: 'Valid for 3 years',
      requiredDocs: ['Ration Card', 'Talati Income Affidavit', 'Electricity Bill', 'Aadhaar Card'],
      officialLink: 'https://www.digitalgujarat.gov.in',
      pdfName: 'Income_Certificate_Application_Form.pdf',
    },
    {
      id: 'FORM-05',
      title: 'Caste Certificate & Non-Creamy Layer (OBC / SC / ST)',
      titleGu: 'જાતિનો દાખલો તથા નોન-ક્રિમીલેયર પ્રમાણપત્ર',
      category: 'general',
      department: 'Social Justice & Empowerment Department',
      eligibility: 'Gujarat resident belonging to recognized SEBC / SC / ST communities.',
      fee: '₹20 Govt fee',
      lastDate: '3 years for Non-Creamy Layer',
      requiredDocs: ['School Leaving Certificate', 'Father/Grandfather LC (Old Record)', 'Income Proof', 'Ration Card'],
      officialLink: 'https://www.digitalgujarat.gov.in',
      pdfName: 'Non_Creamy_Layer_Application.pdf',
    },
    {
      id: 'FORM-06',
      title: 'Tar Fencing Scheme — Kheti Rakshan Sahay',
      titleGu: 'તાર ફેન્સિંગ યોજના — ખેતી પાક રક્ષણ સહાય',
      category: 'agriculture',
      department: 'Gujarat Agro Industries Corporation',
      eligibility: 'Group of farmers with minimum contiguous agricultural land.',
      fee: 'Free Online submission',
      lastDate: 'Portal Schedule Based',
      requiredDocs: ['Cluster Farmers 7/12', 'Consent Agreement', 'Bank Details', 'Estimate Quotation'],
      officialLink: 'https://ikhedut.gujarat.gov.in',
      pdfName: 'Tar_Fencing_Cluster_Agreement.pdf',
    },
  ];

  // Merge with any dynamic forms from admin
  const allForms = [
    ...coreForms,
    ...forms.map((f) => ({
      id: f.id,
      title: f.title,
      titleGu: f.title,
      category: f.category || 'general',
      department: 'Shiv Computer Verified',
      eligibility: 'Refer to requirements',
      fee: 'Government prescribed fee',
      lastDate: f.lastUpdated,
      requiredDocs: ['Aadhaar Card', 'Passport Photo', 'Proof of Address'],
      officialLink: 'https://www.digitalgujarat.gov.in',
      pdfName: `${f.title.replace(/\s+/g, '_')}.pdf`,
    })),
  ];

  const filteredForms = allForms.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleGu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="w-full min-h-screen text-slate-100 pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0a192f]/45 border border-cyan-400/25 backdrop-blur-md shadow-2xl shadow-black/40 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-3">
            <FileText className="w-3.5 h-3.5 text-cyan-300" />
            <span>{language === 'gu' ? 'સરકારી અને કૃષિ ફોર્મ્સ' : 'Official Forms & Schemas'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'gu' ? 'ઓનલાઇન ફોર્મ અને અરજી પત્રકો' : 'Government & Agriculture Online Forms'}
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-2 max-w-2xl leading-relaxed">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-300 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 backdrop-blur-md"
              />
              <Search className="w-4 h-4 text-cyan-300 absolute left-3.5 top-3" />
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
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md border border-cyan-300/40'
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
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
              className="p-6 rounded-3xl bg-[#0a192f]/40 border border-white/12 backdrop-blur-md shadow-xl shadow-black/30 hover:border-cyan-400/40 hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Department & Last Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                    {item.department}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>{item.lastDate}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {language === 'gu' ? item.titleGu : item.title}
                </h3>

                {/* Eligibility note */}
                <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                  <div className="font-semibold text-cyan-300 text-[11px] mb-1">
                    {language === 'gu' ? 'પાત્રતા માપદંડ:' : 'Eligibility Criteria:'}
                  </div>
                  <p className="leading-relaxed">{item.eligibility}</p>
                </div>

                {/* Required Documents */}
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1.5">
                    {language === 'gu' ? 'જરૂરી દસ્તાવેજો:' : 'Required Document Checklist:'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {item.requiredDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Official Portal link & Contact to Apply */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={item.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
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
