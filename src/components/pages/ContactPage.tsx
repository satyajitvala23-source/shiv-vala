import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { OfficeAddressCard } from '../dashboard/OfficeAddressCard';
import { useApp } from '../../context/AppContext';

export const ContactPage: React.FC = () => {
  const { language } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceRequired, setServiceRequired] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    // Direct WhatsApp message formatting for instant assistance
    const textMsg = `Hello Shiv Computer,\nMy Name: ${name}\nPhone: ${phone}\nService Needed: ${serviceRequired || 'General Consultation'}\nMessage: ${message}`;
    const encoded = encodeURIComponent(textMsg);
    window.open(`https://wa.me/918320218440?text=${encoded}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen text-[#243447] pb-16 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#2196F3] border border-[#2196F3]/30 mb-3">
            <Phone className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>{language === 'gu' ? 'સંપર્ક અને મુલાકાત' : 'Official Contact & Office Location'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#243447] tracking-tight">
            {language === 'gu' ? 'શિવ કમ્પ્યુટર કેશોદ કાર્યાલય' : 'Get in Touch with Shiv Computer Keshod'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            {language === 'gu'
              ? 'રવિરાજ મકવાણા અને નિકુંદ સોલંકી સાથે સીધો સંપર્ક કરો અથવા અમારા કેશોદ ખાતેના કાર્યાલયની મુલાકાત લો.'
              : 'Direct call, WhatsApp chat, and Google Maps directions to our physical office in Keshod.'}
          </p>
        </div>

        {/* Official Preserved Key Contacts & Physical Office Address Card */}
        <div className="mb-10">
          <OfficeAddressCard showWorkingHours={true} highlightAdmin={true} />
        </div>

        {/* Quick WhatsApp Inquiry Form Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D8E8F5] shadow-xs max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#243447]">
                {language === 'gu' ? 'ઝડપી વોટ્સએપ પૂછપરછ' : 'Quick WhatsApp Inquiry'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {language === 'gu' ? 'સંદેશ મોકલો અને તુરંત જવાબ મેળવો' : 'Send direct inquiry to Raviraj Makwana'}
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900">WhatsApp Chat Opened</h4>
              <p className="text-xs text-emerald-800">
                Your message has been transferred to WhatsApp. We will reply to you as soon as possible.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs text-[#2196F3] underline font-semibold cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#64748B] block mb-1">
                    {language === 'gu' ? 'તમારું નામ' : 'Your Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] text-xs sm:text-sm focus:outline-none focus:border-[#2196F3] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] block mb-1">
                    {language === 'gu' ? 'મોબાઇલ નંબર' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] text-xs sm:text-sm focus:outline-none focus:border-[#2196F3] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-1">
                  {language === 'gu' ? 'જરૂરી સેવા' : 'Service Required'}
                </label>
                <select
                  value={serviceRequired}
                  onChange={(e) => setServiceRequired(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] text-xs sm:text-sm focus:outline-none focus:border-[#2196F3] focus:bg-white"
                >
                  <option value="iKhedut Agriculture Scheme">iKhedut Agriculture Scheme (ખેડૂત યોજના)</option>
                  <option value="Income Certificate">Income Certificate (આવકનો દાખલો)</option>
                  <option value="Caste Certificate">Caste Certificate (જાતિનો દાખલો)</option>
                  <option value="7/12 & 8-A Records">7/12 & 8-A Land Records</option>
                  <option value="Ration Card Service">Ration Card Service</option>
                  <option value="Affidavit / Notary">Affidavit / Notary Formats</option>
                  <option value="Other Consultation">Other Consultation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-1">
                  {language === 'gu' ? 'સંદેશ / પ્રશ્ન' : 'Message or Question'}
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5FAFF] border border-[#D8E8F5] text-[#243447] text-xs sm:text-sm focus:outline-none focus:border-[#2196F3] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'gu' ? 'વોટ્સએપ પર મોકલો' : 'Send via WhatsApp'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
