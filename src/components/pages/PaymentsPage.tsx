import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Receipt,
  CheckCircle,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaymentsPage: React.FC = () => {
  const { language, payments } = useApp();
  const [refSearch, setRefSearch] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const feeSchedule = [
    { name: 'PM-Kisan e-KYC', dept: 'Agriculture & Farmers Welfare', govtFee: '₹0', serviceFee: '₹50', total: '₹50' },
    { name: 'i-Khedut Scheme Application', dept: 'Govt of Gujarat (DOA)', govtFee: '₹0', serviceFee: '₹100', total: '₹100' },
    { name: 'Ayushman Bharat Golden Card (PVC)', dept: 'National Health Authority', govtFee: '₹0', serviceFee: '₹50', total: '₹50' },
    { name: 'PAN Card (New / Correction)', dept: 'Income Tax (UTIITSL/NSDL)', govtFee: '₹107', serviceFee: '₹100', total: '₹207' },
    { name: 'Income Certificate (Aavak Dakhlo)', dept: 'Revenue Department', govtFee: '₹20', serviceFee: '₹100', total: '₹120' },
    { name: 'Caste Certificate (Jati Dakhlo)', dept: 'Social Justice & Empowerment', govtFee: '₹20', serviceFee: '₹100', total: '₹120' },
    { name: 'Non-Creamy Layer (NCL)', dept: 'Revenue Department', govtFee: '₹50', serviceFee: '₹100', total: '₹150' },
    { name: '7/12 & 8A RoR Certified Copy', dept: 'AnyRoR Revenue Gujarat', govtFee: '₹20', serviceFee: '₹50', total: '₹70' },
    { name: 'Driving License Slot Booking', dept: 'Parivahan Sarathi', govtFee: '₹500', serviceFee: '₹150', total: '₹650' },
    { name: 'E-Shram Card Registration', dept: 'Ministry of Labour', govtFee: '₹0', serviceFee: '₹50', total: '₹50' },
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
    <div className="w-full min-h-screen text-[#243447] pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-3">
            <CreditCard className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>{language === 'gu' ? 'પારદર્શક ફી અને પેમેન્ટ્સ' : 'Transparent Fee & Payment Architecture'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#243447] tracking-tight">
            {language === 'gu' ? 'સરકારી ચલણ અને સેવા ફી વિગતો' : 'Service Charges & Secure Payment Guide'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            {language === 'gu'
              ? 'તમામ સરકારી ચલણ અને ફોર્મ સહાયક ફીની સ્પષ્ટ અને પારદર્શક યાદી. કોઈ છુપી ફી નહીં.'
              : 'Clear government fee schedules, verified digital receipts, and UPI QR architecture ready for future gateway integration.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#D8E8F5] text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'gu' ? '૧૦૦% સત્તાવાર સરકારી દર' : '100% Official Govt Challans'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#2196F3]">
              <QrCode className="w-4 h-4 text-[#2196F3]" />
              <span>{language === 'gu' ? 'તમામ UPI એપ્સ માન્ય' : 'Accepts GPay, PhonePe, Paytm'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>{language === 'gu' ? 'સુરક્ષિત પેમેન્ટ આર્કિટેક્ચર' : 'Encrypted Reference Tracking'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Fee Schedule Table */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#2196F3]" />
                <h3 className="text-lg font-bold text-[#243447]">
                  {language === 'gu' ? 'પ્રમાણિત ફી કોષ્ટક' : 'Standard Service Fee Schedule'}
                </h3>
              </div>
              <span className="text-xs text-[#64748B]">Fixed & Regulated Rates</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#D8E8F5] text-[#243447] text-xs uppercase tracking-wider bg-[#F5FAFF]">
                    <th className="py-3 px-3 font-semibold">Service Name</th>
                    <th className="py-3 px-3 font-semibold">Department</th>
                    <th className="py-3 px-3 font-semibold text-right">Govt Challan</th>
                    <th className="py-3 px-3 font-semibold text-right">Center Charge</th>
                    <th className="py-3 px-3 font-semibold text-right text-[#243447]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8E8F5]">
                  {feeSchedule.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F5FAFF] transition-colors">
                      <td className="py-3.5 px-3 font-medium text-[#243447]">{item.name}</td>
                      <td className="py-3.5 px-3 text-xs text-[#64748B]">{item.dept}</td>
                      <td className="py-3.5 px-3 text-right text-[#64748B]">{item.govtFee}</td>
                      <td className="py-3.5 px-3 text-right text-[#64748B]">{item.serviceFee}</td>
                      <td className="py-3.5 px-3 text-right font-bold text-[#2196F3]">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#EAF5FF] border border-[#D8E8F5] text-xs text-[#243447] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#2196F3] shrink-0 mt-0.5" />
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
            <div className="p-6 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EAF5FF] border border-[#2196F3]/30 flex items-center justify-center text-[#2196F3] shadow-xs">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#243447]">
                  {language === 'gu' ? 'કેન્દ્ર ખાતે ડિજિટલ ચુકવણી' : 'Counter Digital Payments'}
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  {language === 'gu'
                    ? 'શિવ કમ્પ્યુટર ખાતે તમામ યુપીઆઈ સ્કેનર અને નેટબેંકિંગ ચુકવણી ઉપલબ્ધ.'
                    : 'Direct BHIM UPI, Google Pay, PhonePe QR scanner available on counter.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5FAFF] border border-[#D8E8F5] text-xs text-[#243447] space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Instant Receipt Confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-[#2196F3] font-semibold">
                  <CheckCircle className="w-4 h-4 text-[#2196F3]" />
                  <span>Zero Convenience Surcharge</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 font-semibold">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                  <span>GST/Tax Compliant Tracking</span>
                </div>
              </div>
            </div>

            {/* Check Receipt Reference */}
            <div className="p-6 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#2196F3]" />
                <h3 className="text-sm font-bold text-[#243447]">
                  {language === 'gu' ? 'રસીદ / પેમેન્ટ ચકાસણી' : 'Verify Receipt / Transaction'}
                </h3>
              </div>

              <form onSubmit={handleSearchReceipt} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter Receipt ID (e.g. PAY-1001)"
                  value={refSearch}
                  onChange={(e) => setRefSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] placeholder-[#64748B] focus:outline-none focus:border-[#2196F3] focus:bg-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Verify Receipt Status
                </button>
              </form>

              {hasSearched && (
                <div className="pt-2">
                  {searchResult ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                      <div className="font-bold text-emerald-800">Payment Confirmed</div>
                      <div className="text-emerald-700">Amount: ₹{searchResult.amount}</div>
                      <div className="text-emerald-700">Method: {searchResult.method}</div>
                      <div className="text-emerald-700">Date: {searchResult.date}</div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
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
