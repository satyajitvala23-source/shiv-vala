import React, { useState, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Smartphone,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { PublishedDocument, FormTemplate, DocumentCategory } from '../../types';
import {
  subscribeToPublishedDocuments,
  recordDocumentDownload,
} from '../../lib/documents';
import {
  downloadDocumentCrossPlatform,
  getDevicePlatformInfo,
} from '../../lib/downloadHelper';
import { DocumentViewerModal } from './DocumentViewerModal';

interface UserDocumentHubProps {
  forms: FormTemplate[];
  incrementFormDownload: (id: string) => void;
  language?: 'en' | 'gu';
}

export const UserDocumentHub: React.FC<UserDocumentHubProps> = ({
  forms,
  incrementFormDownload,
  language = 'en',
}) => {
  const [documents, setDocuments] = useState<PublishedDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');

  const [viewerDoc, setViewerDoc] = useState<PublishedDocument | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const deviceInfo = getDevicePlatformInfo();

  useEffect(() => {
    setLoading(true);
    // Subscribe to real-time published documents (isPublished === true)
    const unsubscribe = subscribeToPublishedDocuments((docs) => {
      setDocuments(docs);
      setLoading(false);
    }, true);

    return () => unsubscribe();
  }, []);

  const handleDownload = async (docItem: PublishedDocument) => {
    setDownloadingId(docItem.id);
    setDownloadNotice(null);

    try {
      const res = await downloadDocumentCrossPlatform({
        fileUrl: docItem.fileUrl,
        fileName: docItem.fileName,
        mimeType: docItem.mimeType,
      });

      // Record download count
      recordDocumentDownload(docItem.id);

      setDownloadNotice(res.message);
      setTimeout(() => setDownloadNotice(null), 5000);
    } catch {
      setDownloadNotice('Download initiated. Tap "View" to open directly if not saved.');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const titleMatch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.titleGujarati &&
        doc.titleGujarati.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());

    const catMatch = categoryFilter === 'all' || doc.category === categoryFilter;
    const audMatch =
      audienceFilter === 'all' ||
      doc.targetAudience === 'all' ||
      doc.targetAudience === audienceFilter;

    return titleMatch && catMatch && audMatch;
  });

  function getCategoryLabel(cat: DocumentCategory): string {
    switch (cat) {
      case 'certificates':
        return language === 'gu' ? 'સરકારી પ્રમાણપત્રો' : 'Certificates';
      case 'revenue':
        return language === 'gu' ? 'મહેસૂલ અને ૭/૧૨' : 'Revenue & Land';
      case 'agriculture':
        return language === 'gu' ? 'ખેતીવાડી સહાય' : 'Agriculture';
      case 'forms':
        return language === 'gu' ? 'અરજી ફોર્મ્સ' : 'Official Forms';
      case 'notices':
        return language === 'gu' ? 'પરિપત્રો અને નોટિસ' : 'Notices';
      default:
        return 'General';
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {language === 'gu'
                ? 'સત્તાવાર સરકારી ફોર્મ્સ અને દસ્તાવેજો ડાઉનલોડ'
                : 'Official Application Forms, Affidavits & Documents'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'gu'
                ? 'સરકારી પ્રમાણપત્રો, ૭/૧૨ આવક સોગંદનામા અને સહાય યોજનાઓના સત્તાવાર નમૂના ડાઉનલોડ કરો.'
                : 'Download and view verified government applications, affidavit drafts, and land record formats on all devices.'}
            </p>
          </div>

          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Govt Approved Formats</span>
          </span>
        </div>
      </div>

      {/* Mobile Device Helpful Tip */}
      {deviceInfo.isMobile && (
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <Smartphone className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            {deviceInfo.isIOS ? (
              <span>
                <strong>iPhone / iPad Tip:</strong> Tap <strong>View</strong> for live preview or tap{' '}
                <strong>Download</strong> &rarr; Share icon &rarr; <em>"Save to Files"</em> to save directly.
              </span>
            ) : (
              <span>
                <strong>Mobile Download Ready:</strong> All files download uncorrupted to your device's
                Downloads folder or open in your browser for instant viewing.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Download Result Notice */}
      {downloadNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadNotice(null)}
            className="text-xs font-semibold underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'gu'
                ? 'ફોર્મ અથવા દસ્તાવેજ શોધો (Search Aadhaar, Income, 7/12, iKhedut)...'
                : 'Search forms or documents by title, keyword, or service...'
            }
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter documents by category"
            className="py-2 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
          >
            <option value="all">All Categories (બધા વર્ગ)</option>
            <option value="certificates">Certificates (પ્રમાણપત્રો)</option>
            <option value="revenue">Revenue & 7/12 (મહેસૂલ)</option>
            <option value="agriculture">Agriculture Schemes (ખેતીવાડી)</option>
            <option value="forms">Official Forms (અરજી ફોર્મ્સ)</option>
            <option value="notices">Official Circulars (પરિપત્રો)</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
          <span>Loading official forms & documents...</span>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No matching documents found
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try searching for another keyword or select "All Categories".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((docItem) => {
            const isPdf = docItem.fileType === 'pdf';
            const displayTitle =
              language === 'gu' && docItem.titleGujarati
                ? docItem.titleGujarati
                : docItem.title;
            const displayDesc =
              language === 'gu' && docItem.descriptionGujarati
                ? docItem.descriptionGujarati
                : docItem.description;

            return (
              <div
                key={docItem.id}
                className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 group transition-all hover:shadow-md hover:border-blue-500/30"
              >
                <div>
                  {/* Category and Size Badge */}
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-3">
                    <span className="uppercase px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono text-[10px]">
                      {getCategoryLabel(docItem.category)}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{docItem.fileSize}</span>
                  </div>

                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                        isPdf
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {displayTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {displayDesc}
                      </p>
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{language === 'gu' ? 'સરકારી નમૂનો' : 'Govt Approved'}</span>
                    </div>
                    <span className="font-medium text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                      {docItem.downloadCount} {language === 'gu' ? 'ડાઉનલોડ્સ' : 'downloads'}
                    </span>
                  </div>
                </div>

                {/* Working Action Buttons (View + Download) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setViewerDoc(docItem)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>{language === 'gu' ? 'જુઓ (View)' : 'View Preview'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(docItem)}
                    disabled={downloadingId === docItem.id}
                    className="py-2.5 px-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {downloadingId === docItem.id
                        ? '...'
                        : language === 'gu'
                        ? 'ડાઉનલોડ'
                        : 'Download'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Viewer Modal */}
      <DocumentViewerModal
        document={viewerDoc}
        onClose={() => setViewerDoc(null)}
        language={language}
      />
    </div>
  );
};
