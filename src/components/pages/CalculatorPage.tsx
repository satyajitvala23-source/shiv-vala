import React, { useState } from 'react';
import {
  Calculator,
  Compass,
  Calendar,
  FileSpreadsheet,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CalculatorPage: React.FC = () => {
  const { language } = useApp();

  // Tab: 'land' | 'age' | 'stamp'
  const [activeTab, setActiveTab] = useState<'land' | 'age' | 'stamp'>('land');

  // Land converter states
  const [landValue, setLandValue] = useState<string>('1');
  const [landUnit, setLandUnit] = useState<'vigha' | 'guntha' | 'sqm' | 'sqft' | 'acre'>('vigha');

  // Age calculator states
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [asOfDate, setAsOfDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Stamp duty states
  const [docType, setDocType] = useState<'affidavit' | 'agreement' | 'poa' | 'partnership'>('affidavit');

  // Conversion calculations (Standard Gujarat: 1 Vigha = 16 Guntha = 1618.74 sq.m = 17424 sq.ft = 0.4 Acre)
  const calculateLand = () => {
    const val = parseFloat(landValue) || 0;
    let vigha = 0;
    switch (landUnit) {
      case 'vigha':
        vigha = val;
        break;
      case 'guntha':
        vigha = val / 16;
        break;
      case 'sqm':
        vigha = val / 1618.74;
        break;
      case 'sqft':
        vigha = val / 17424;
        break;
      case 'acre':
        vigha = val * 2.5;
        break;
    }

    return {
      vigha: vigha.toFixed(3),
      guntha: (vigha * 16).toFixed(2),
      sqm: (vigha * 1618.74).toFixed(2),
      sqft: (vigha * 17424).toFixed(2),
      acre: (vigha * 0.4).toFixed(3),
    };
  };

  const calculateAge = () => {
    const d1 = new Date(birthDate);
    const d2 = new Date(asOfDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 < d1) {
      return { years: 0, months: 0, days: 0 };
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days };
  };

  const getStampEstimate = () => {
    switch (docType) {
      case 'affidavit':
        return { stamp: '₹50 - ₹100', notary: '₹50', notes: 'General government affidavit for schemes/income' };
      case 'agreement':
        return { stamp: '₹300', notary: '₹100', notes: 'Simple commercial or land agreement' };
      case 'poa':
        return { stamp: '₹300', notary: '₹100', notes: 'Special power of attorney for revenue matter' };
      case 'partnership':
        return { stamp: '₹500', notary: '₹150', notes: 'Partnership deed format' };
    }
  };

  const landResults = calculateLand();
  const ageResults = calculateAge();
  const stampResults = getStampEstimate();

  return (
    <div className="w-full min-h-screen text-slate-100 pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0a192f]/45 border border-cyan-400/25 backdrop-blur-md shadow-2xl shadow-black/40 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3">
            <Calculator className="w-3.5 h-3.5 text-indigo-300" />
            <span>{language === 'gu' ? 'ત્વરિત કેલ્ક્યુલેટર સાધનો' : 'Instant Calculation Utilities'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'gu' ? 'જમીન માપણી અને વય મર્યાદા કેલ્ક્યુલેટર' : 'Instant Conversion & Eligibility Calculators'}
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-2 max-w-2xl leading-relaxed">
            {language === 'gu'
              ? 'ગુજરાત મહેસૂલ ધોરણો અનુસાર વીઘા-ગુંઠા જમીન કન્વર્ટર, સરકારી યોજનાઓ માટે ઉંમરની ગણતરી અને સ્ટેમ્પ ડ્યુટી અંદાજ.'
              : 'Accurate Saurashtra / Gujarat land measurements, exact scheme eligibility age calculator, and stamp paper estimates.'}
          </p>

          {/* Calculator Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { id: 'land', label: 'Land Area Converter (જમીન માપણી)', icon: <Compass className="w-4 h-4" /> },
              { id: 'age', label: 'Age Calculator (ઉંમર ગણતરી)', icon: <Calendar className="w-4 h-4" /> },
              { id: 'stamp', label: 'Stamp Duty Estimate (સ્ટેમ્પ અંદાજ)', icon: <FileSpreadsheet className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/30 border border-cyan-300/40'
                    : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Land Area Converter */}
        {activeTab === 'land' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0a192f]/40 border border-white/12 backdrop-blur-md shadow-xl space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>{language === 'gu' ? 'જમીન માપ દાખલ કરો' : 'Enter Land Area Value'}</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Value (સંખ્યા)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={landValue}
                    onChange={(e) => setLandValue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-lg focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">From Unit (એકમ)</label>
                  <select
                    value={landUnit}
                    onChange={(e) => setLandUnit(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#091830] border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="vigha">Vigha (વીઘા — 16 Guntha)</option>
                    <option value="guntha">Guntha (ગુંઠા)</option>
                    <option value="sqm">Square Meters (ચોરસ મીટર)</option>
                    <option value="sqft">Square Feet (ચોરસ ફૂટ)</option>
                    <option value="acre">Acre (એકર — 2.5 Vigha)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0a192f]/40 border border-cyan-400/30 backdrop-blur-md shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-cyan-300">
                {language === 'gu' ? 'રૂપાંતરિત પરિણામ (Converted Values)' : 'Converted Area Units'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 block">Vigha (વીઘા)</span>
                  <span className="text-2xl font-black text-amber-300">{landResults.vigha}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Gujarat Standard (૧૬ ગુંઠા)</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 block">Guntha (ગુંઠા)</span>
                  <span className="text-2xl font-black text-cyan-300">{landResults.guntha}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">૧ ગુંઠા = ૧૦૧.૧૭ ચો.મી.</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 block">Square Meters (ચોરસ મીટર)</span>
                  <span className="text-2xl font-black text-emerald-300">{landResults.sqm}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Official Revenue unit</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 block">Acre (એકર)</span>
                  <span className="text-2xl font-black text-sky-300">{landResults.acre}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">૧ એકર = ૨.૫ વીઘા</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Age Calculator */}
        {activeTab === 'age' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0a192f]/40 border border-white/12 backdrop-blur-md shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>{language === 'gu' ? 'જન્મ તારીખ પસંદ કરો' : 'Select Birth & Target Date'}</span>
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Date of Birth (જન્મ તારીખ)</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Age As Of Date (ગણતરીની તારીખ)</label>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0a192f]/40 border border-cyan-400/30 backdrop-blur-md shadow-xl flex flex-col justify-center space-y-6">
              <h3 className="text-lg font-bold text-cyan-300">
                {language === 'gu' ? 'ચોક્કસ ઉંમર (Exact Age Breakdown)' : 'Calculated Scheme Age'}
              </h3>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-3xl sm:text-4xl font-black text-amber-300">{ageResults.years}</span>
                  <span className="text-xs text-slate-300 block mt-1">Years (વર્ષ)</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-3xl sm:text-4xl font-black text-cyan-300">{ageResults.months}</span>
                  <span className="text-xs text-slate-300 block mt-1">Months (મહિના)</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-300">{ageResults.days}</span>
                  <span className="text-xs text-slate-300 block mt-1">Days (દિવસ)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Stamp Duty Estimator */}
        {activeTab === 'stamp' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a192f]/40 border border-white/12 backdrop-blur-md shadow-xl animate-in fade-in space-y-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
              <span>{language === 'gu' ? 'દસ્તાવેજનો પ્રકાર પસંદ કરો' : 'Select Document Type for Stamp Estimate'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'affidavit', label: 'General Affidavit (સોગંદનામું)' },
                { id: 'agreement', label: 'Sale / Rental Agreement (કરાર)' },
                { id: 'poa', label: 'Power of Attorney (મુખત્યારનામું)' },
                { id: 'partnership', label: 'Partnership Deed (ભાગીદારી પત્ર)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDocType(opt.id as any)}
                  className={`p-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                    docType === opt.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-cyan-400/25 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Stamp Paper Value:</span>
                <strong className="text-amber-300 text-base">{stampResults.stamp}</strong>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Notary Verification Approx:</span>
                <strong className="text-cyan-300 text-base">{stampResults.notary}</strong>
              </div>
              <p className="text-xs text-slate-400 pt-2 border-t border-white/10">{stampResults.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
