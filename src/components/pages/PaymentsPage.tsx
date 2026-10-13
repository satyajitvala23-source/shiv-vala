import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle,
  IndianRupee,
  Receipt,
  Search,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaymentsPage: React.FC = () => {
  const { language, payments } = useApp();
  const [refSearch, setRefSearch] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sample official service charges
  const feeSchedule = [
    { name: 'Income Certificate (આવકનો દાખલો)', dept: 'Revenue / Panchayat', govtFee: '₹20', serviceFee: '₹30', total: '₹50' },
    { name: 'Caste Certificate / Non-Creamy Layer', dept: 'Social Welfare', govtFee: '₹20', serviceFee: '₹30', total: '₹50' },
    { name: '7/12 & 8-A Signed Copy', dept: 'AnyRoR Revenue', govtFee: '₹5 - ₹20', serviceFee: '₹20', total: '₹25 - ₹40' },
    { name: 'iKhedut Scheme Application', dept: 'Agriculture Dept', govtFee: '₹0 (Free)', serviceFee: '₹50', total: '₹50' },
    { name: 'PM Kisan Registration / e-KYC', dept: 'Central Agriculture', govtFee: '₹0 (Free)', serviceFee: '₹40', total: '₹40' },
    { name: 'Ration Card Member Addition / Update', dept: 'Food & Civil Supplies', govtFee: '₹20', serviceFee: '₹30', total: '₹50' },
    { name: 'Ayushman Bharat Card Generation', dept: 'Health Dept', govtFee: '₹0 (Free)', serviceFee: '₹30', total: '₹30' },
    { name: 'E-Shram Card Registration', dept: 'Labour & Employment', govtFee: '₹0 (Free)', serviceFee: '₹30', total: '₹30' },
  ];

  const handleSearchReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refSearch.trim()) return;
    setHasSearched(true);
    const found = payments.find(
      (p) =>
        p.id.toLowerCase() === refSearch.trim().toLowerCase() ||
        p.applicationId.toLowerCase() === refSearch.trim().toLowerCase()
    );
    setSearchResult(found || null);
  };

  return (
    <div className="w-full min-h-screen text-slate-100 pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0a192f]/45 border border-cyan-400/25 backdrop-blur-md shadow-2xl shadow-black/40 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-3">
            <CreditCard className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'gu' ? 'પારદર્શક ફી અને પેમેન્ટ્સ' : 'Transparent Fee & Payment Architecture'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'gu' ? 'સરકારી ચલણ અને સેવા ફી વિગતો' : 'Service Charges & Secure Payment Guide'}
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-2 max-w-2xl leading-relaxed">
            {language === 'gu'
              ? 'તમામ સરકારી ચલણ અને ફોર્મ સહાયક ફીની સ્પષ્ટ અને પારદર્શક યાદી. કોઈ છુપી ફી નહીં.'
              : 'Clear government fee schedules, verified digital receipts, and UPI QR architecture ready for future gateway integration.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'gu' ? '૧૦૦% સત્તાવાર સરકારી દર' : '100% Official Govt Challans'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>{language === 'gu' ? 'તમામ UPI એપ્સ માન્ય' : 'Accepts GPay, PhonePe, Paytm'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{language === 'gu' ? 'સુરક્ષિત પેમેન્ટ આર્કિટેક્ચર' : 'Encrypted Reference Tracking'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Fee Schedule Table */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#0a192f]/40 border border-white/12 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                  {language === 'gu' ? 'પ્રમાણિત ફી કોષ્ટક' : 'Standard Service Fee Schedule'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">Fixed & Regulated Rates</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-cyan-300 text-xs uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Service Name</th>
                    <th className="pb-3 font-semibold">Department</th>
                    <th className="pb-3 font-semibold text-right">Govt Challan</th>
                    <th className="pb-3 font-semibold text-right">Center Charge</th>
                    <th className="pb-3 font-semibold text-right text-white">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {feeSchedule.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 pr-2 font-medium text-white">{item.name}</td>
                      <td className="py-3.5 px-2 text-xs text-slate-300">{item.dept}</td>
                      <td className="py-3.5 px-2 text-right text-slate-300">{item.govtFee}</td>
                      <td className="py-3.5 px-2 text-right text-slate-300">{item.serviceFee}</td>
                      <td className="py-3.5 pl-2 text-right font-bold text-amber-300">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                {language === 'gu'
                  ? 'નોંધ: સરકારી ફી કચેરી દ્વારા સમયાંતરે બદલાઈ શકે છે. તમામ પેમેન્ટ સામે અધિકૃત કોમ્પ્યુટર પ્રિન્ટેડ રસીદ આપવામાં આવે છે.'
                  : 'Notice: Official government challan fees are subject to government gazette revisions. Official receipts are issued for every processed application.'}
              </span>
            </div>
          </div>

          {/* Right Column: Receipt Verification & Payment Modes */}
          <div className="lg:col-span-4 space-y-6">
            {/* Payment Modes Card */}
            <div className="p-6 rounded-3xl bg-[#0a192f]/40 border border-white/12 backdrop-blur-md shadow-xl text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'gu' ? 'કેન્દ્ર ખાતે ડિજિટલ ચુકવણી' : 'Counter Digital Payments'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {language === 'gu'
                    ? 'શિવ કમ્પ્યુટર ખાતે તમામ યુપીઆઈ સ્કેનર અને નેટબેંકિંગ ચુકવણી ઉપલબ્ધ.'
                    : 'Direct BHIM UPI, Google Pay, PhonePe QR scanner available on counter.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Instant Receipt Confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Zero Convenience Surcharge</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>GST/Tax Compliant Tracking</span>
                </div>
              </div>
            </div>

            {/* Check Receipt Reference */}
            <div className="p-6 rounded-3xl bg-[#0a192f]/40 border border-white/12 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  {language === 'gu' ? 'રસીદ / પેમેન્ટ ચકાસણી' : 'Verify Receipt / Transaction'}
                </h3>
              </div>

              <form onSubmit={handleSearchReceipt} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter Receipt ID (e.g. PAY-1001)"
                  value={refSearch}
                  onChange={(e) => setRefSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer"
                >
                  Verify Receipt Status
                </button>
              </form>

              {hasSearched && (
                <div className="pt-2">
                  {searchResult ? (
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-xs space-y-1">
                      <div className="font-bold text-emerald-300">Payment Confirmed</div>
                      <div className="text-slate-300">Amount: ₹{searchResult.amount}</div>
                      <div className="text-slate-300">Method: {searchResult.method}</div>
                      <div className="text-slate-300">Date: {searchResult.date}</div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs text-amber-200">
                      Receipt reference not found. Please check the ID or contact Raviraj Makwana at counter.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
