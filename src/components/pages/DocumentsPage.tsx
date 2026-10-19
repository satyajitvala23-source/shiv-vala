import React from 'react';
import { FolderOpen, ShieldCheck, Download, Eye } from 'lucide-react';
import { UserDocumentHub } from '../dashboard/UserDocumentHub';
import { useApp } from '../../context/AppContext';

export const DocumentsPage: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="w-full min-h-screen text-[#243447] pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-3">
            <FolderOpen className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>{language === 'gu' ? 'દસ્તાવેજ કેન્દ્ર' : 'Authorized Document Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#243447] tracking-tight">
            {language === 'gu' ? 'અધિકૃત દસ્તાવેજો અને ફોર્મેટ્સ' : 'Verified Documents, PDFs & Affidavits'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            {language === 'gu'
              ? 'એડમિન દ્વારા અપલોડ કરાયેલા અધિકૃત સરકારી દસ્તાવેજો, સોગંદનામા અને અરજી ફોર્મેટ્સનું પ્રીવ્યુ અને ડાઉનલોડ.'
              : 'Secure, real-time document repository. Instant inline PDF/image preview and cross-platform download.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#D8E8F5] text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5 text-[#2196F3]">
              <Eye className="w-4 h-4 text-[#2196F3]" />
              <span>{language === 'gu' ? 'ઇનલાઇન પ્રીવ્યુ સપોર્ટ' : 'Instant Inline PDF / Image Preview'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>{language === 'gu' ? 'વન-ક્લિક સુરક્ષિત ડાઉનલોડ' : 'One-Click Fast Download'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{language === 'gu' ? 'સુરક્ષિત સંગ્રહ' : 'Protected Storage'}</span>
            </div>
          </div>
        </div>

        {/* Real-time Document Hub Component */}
        <div className="rounded-3xl bg-white border border-[#D8E8F5] p-4 sm:p-8 shadow-xs">
          <UserDocumentHub language={language} />
        </div>
      </div>
    </div>
  );
};
