import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  User,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const { applications, language, isAuthenticated, currentUser, setCurrentView } = useApp();
  const [appSearchId, setAppSearchId] = useState('');
  const [searchedApp, setSearchedApp] = useState<Application | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appSearchId.trim()) return;
    setHasSearched(true);
    const found = applications.find(
      (app) => app.id.toLowerCase() === appSearchId.trim().toLowerCase()
    );
    setSearchedApp(found || null);
  };

  // Status steps mapping
  const getStepProgress = (status: string) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Document Required':
        return 1;
      case 'Processing':
        return 2;
      case 'Approved':
      case 'Completed':
        return 4;
      default:
        return 2;
    }
  };

  return (
    <div className="w-full min-h-screen text-slate-100 pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0a192f]/45 border border-cyan-400/25 backdrop-blur-md shadow-2xl shadow-black/40 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>{language === 'gu' ? 'લાઈવ અરજી ટ્રેકિંગ' : 'Live Application Tracking'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'gu' ? 'અરજી સ્ટેટસ અને પ્રગતિ તપાસો' : 'Track Your Application Status Online'}
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-2 max-w-2xl leading-relaxed">
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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 text-sm focus:outline-none focus:border-cyan-400 backdrop-blur-md"
              />
              <Search className="w-4 h-4 text-cyan-300 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              {language === 'gu' ? 'સ્ટેટસ જુઓ' : 'Track Now'}
            </button>
          </form>
        </div>

        {/* Track Result Card */}
        {hasSearched && (
          <div className="mb-10 animate-in fade-in">
            {searchedApp ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0a192f]/45 border border-cyan-400/40 backdrop-blur-md shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold text-cyan-300">{searchedApp.id}</span>
                    <h2 className="text-xl font-bold text-white mt-0.5">{searchedApp.serviceName}</h2>
                    <span className="text-xs text-slate-300">Applicant: {searchedApp.applicantName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        searchedApp.status === 'Approved' || searchedApp.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : searchedApp.status === 'Processing'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
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
                      const isCurrent = currentProgress === st.step;

                      return (
                        <div
                          key={st.step}
                          className={`p-4 rounded-2xl border transition-all ${
                            isComplete
                              ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200'
                              : 'bg-white/5 border-white/10 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isComplete
                                  ? 'bg-cyan-400 text-slate-900 shadow-xs shadow-cyan-400'
                                  : 'bg-white/10 text-slate-400'
                              }`}
                            >
                              {st.step}
                            </div>
                            <span className="text-xs font-bold text-white">
                              {language === 'gu' ? st.titleGu : st.title}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-80">{st.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {searchedApp.adminNotes && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                    <strong className="text-cyan-300 block mb-0.5">Operator / Admin Note:</strong>
                    <span>{searchedApp.adminNotes}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-[#0a192f]/45 border border-amber-400/30 backdrop-blur-md text-center">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-white">Application ID Not Found</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Please verify the Application reference number on your slip, or contact the Shiv Computer counter in Keshod.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Existing Applications (if logged in or sample overview) */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold text-white">
              {isAuthenticated
                ? (language === 'gu' ? 'તમારી તાજેતરની અરજીઓ' : 'Your Submitted Applications')
                : (language === 'gu' ? 'તાજેતરની પ્રક્રિયા કરેલી અરજીઓ' : 'Recently Processed Applications')}
            </h3>
            <span className="text-xs text-cyan-300">{applications.length} Records</span>
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
                className="p-4 sm:p-5 rounded-2xl bg-[#0a192f]/40 border border-white/10 backdrop-blur-md hover:border-cyan-400/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-cyan-300">{app.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      app.status === 'Approved' || app.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {app.serviceName}
                </h4>
                <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
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
