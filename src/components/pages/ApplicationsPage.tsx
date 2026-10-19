import React, { useState } from 'react';
import {
  CheckCircle2,
  Search,
  Clock,
  AlertCircle,
  FileCheck,
  Building,
  User,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const { applications, language, isAuthenticated } = useApp();
  const [appSearchId, setAppSearchId] = useState('');
  const [searchedApp, setSearchedApp] = useState<Application | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appSearchId.trim()) return;

    const query = appSearchId.trim().toUpperCase();
    const found = applications.find(
      (a) =>
        a.id.toUpperCase() === query ||
        a.id.toUpperCase().includes(query) ||
        (a.applicantName && a.applicantName.toLowerCase().includes(appSearchId.toLowerCase()))
    );

    setSearchedApp(found || null);
    setHasSearched(true);
  };

  const getStepProgress = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 1;
      case 'Pending Verification':
        return 2;
      case 'Processing':
        return 3;
      case 'Approved':
      case 'Completed':
        return 4;
      default:
        return 2;
    }
  };

  return (
    <div className="w-full min-h-screen text-[#243447] pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>{language === 'gu' ? 'લાઈવ અરજી ટ્રેકિંગ' : 'Live Application Tracking'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#243447] tracking-tight">
            {language === 'gu' ? 'અરજી સ્ટેટસ અને પ્રગતિ તપાસો' : 'Track Your Application Status Online'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            {language === 'gu'
              ? 'તમારી અરજીનો નંબર (Application ID) દાખલ કરીને વર્તમાન સ્થિતિ અને મંજૂરી પ્રક્રિયા તપાસો.'
              : 'Enter your Application Reference ID to trace the step-by-step verification, departmental processing, and approval.'}
          </p>

          {/* Search Application Bar */}
          <form onSubmit={handleTrackSubmit} className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-xl">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder={language === 'gu' ? 'અરજી નંબર દાખલ કરો (દા.ત. APP-1001)' : 'Enter Application ID (e.g. APP-1001)'}
                value={appSearchId}
                onChange={(e) => setAppSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#2196F3] focus:bg-white"
              />
              <Search className="w-4 h-4 text-[#2196F3] absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {language === 'gu' ? 'સ્ટેટસ જુઓ' : 'Track Now'}
            </button>
          </form>
        </div>

        {/* Track Result Card */}
        {hasSearched && (
          <div className="mb-10 animate-in fade-in">
            {searchedApp ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D8E8F5] shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#D8E8F5]">
                  <div>
                    <span className="text-xs font-bold text-[#2196F3]">{searchedApp.id}</span>
                    <h2 className="text-xl font-bold text-[#243447] mt-0.5">{searchedApp.serviceName}</h2>
                    <span className="text-xs text-[#64748B]">Applicant: {searchedApp.applicantName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        searchedApp.status === 'Approved' || searchedApp.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : searchedApp.status === 'Processing'
                          ? 'bg-[#EAF5FF] text-[#2196F3] border-[#2196F3]/30'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}
                    >
                      {searchedApp.status}
                    </span>
                  </div>
                </div>

                {/* 4-Step Progress Tracker */}
                <div className="py-8">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                    {[
                      { step: 1, title: 'Submitted', titleGu: 'અરજી નોંધાઈ', desc: 'Received at portal' },
                      { step: 2, title: 'Verification', titleGu: 'દસ્તાવેજ ચકાસણી', desc: 'Documents checked' },
                      { step: 3, title: 'Processing', titleGu: 'કચેરી પ્રોસેસિંગ', desc: 'Department review' },
                      { step: 4, title: 'Approved', titleGu: 'મંજૂર / પ્રમાણિત', desc: 'Ready for issue' },
                    ].map((st) => {
                      const currentProgress = getStepProgress(searchedApp.status);
                      const isComplete = currentProgress >= st.step;

                      return (
                        <div
                          key={st.step}
                          className={`p-4 rounded-2xl border transition-all ${
                            isComplete
                              ? 'bg-[#EAF5FF] border-[#2196F3]/40 text-[#1976D2]'
                              : 'bg-[#F5FAFF] border-[#D8E8F5] text-[#64748B]'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isComplete
                                  ? 'bg-[#2196F3] text-white shadow-xs'
                                  : 'bg-white border border-[#D8E8F5] text-[#64748B]'
                              }`}
                            >
                              {st.step}
                            </div>
                            <span className="text-xs font-bold text-[#243447]">
                              {language === 'gu' ? st.titleGu : st.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B]">{st.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {searchedApp.adminNotes && (
                  <div className="p-4 rounded-2xl bg-[#F5FAFF] border border-[#D8E8F5] text-xs text-[#243447]">
                    <strong className="text-[#2196F3] block mb-0.5">Operator / Admin Note:</strong>
                    <span>{searchedApp.adminNotes}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-amber-300 shadow-sm text-center">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h3 className="text-base font-bold text-[#243447]">Application ID Not Found</h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Please verify the Application reference number on your slip, or contact the Shiv Computer counter in Keshod.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Existing Applications */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold text-[#243447]">
              {isAuthenticated
                ? (language === 'gu' ? 'તમારી તાજેતરની અરજીઓ' : 'Your Submitted Applications')
                : (language === 'gu' ? 'તાજેતરની પ્રક્રિયા કરેલી અરજીઓ' : 'Recently Processed Applications')}
            </h3>
            <span className="text-xs text-[#2196F3] font-semibold">{applications.length} Records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.slice(0, 6).map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  setAppSearchId(app.id);
                  setSearchedApp(app);
                  setHasSearched(true);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D8E8F5] shadow-xs hover:border-[#90CAF9] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#2196F3]">{app.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      app.status === 'Approved' || app.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#243447] group-hover:text-[#2196F3] transition-colors truncate">
                  {app.serviceName}
                </h4>
                <div className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#64748B]" />
                  <span>Date: {app.applicationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
