import React, { useState, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Smartphone,
  RefreshCw,
  FolderOpen,
  FileSpreadsheet,
  FileCode,
  Archive,
  File,
} from 'lucide-react';
import { PublishedDocument } from '../../types';
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
  language?: 'en' | 'gu';
}

export const UserDocumentHub: React.FC<UserDocumentHubProps> = ({
  language = 'en',
}) => {
  // Published documents uploaded by Admin
  const [documents, setDocuments] = useState<PublishedDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Viewer Modal & Download Notice
  const [viewerDoc, setViewerDoc] = useState<PublishedDocument | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const deviceInfo = getDevicePlatformInfo();

  // Subscribe in real-time to documents uploaded by Admin in Firebase
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublishedDocuments((docs) => {
      setDocuments(docs);
      setLoading(false);
    }, true);

    return () => unsubscribe();
  }, []);

  // Format badge helper
  const getFormatBadge = (type: string, name: string) => {
    const ext = (name.split('.').pop() || type || '').toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'doc':
      case 'docx':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30';
      case 'ppt':
      case 'pptx':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'zip':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  // Category label helper
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'certificates':
        return language === 'gu' ? 'પ્રમાણપત્રો' : 'Certificates';
      case 'revenue':
        return language === 'gu' ? 'મહેસૂલ અને ૭/૧૨' : 'Revenue & Land';
      case 'agriculture':
        return language === 'gu' ? 'ખેતીવાડી સહાય' : 'Agriculture';
      case 'forms':
        return language === 'gu' ? 'અરજી ફોર્મ્સ' : 'Official Forms';
      case 'notices':
        return language === 'gu' ? 'પરિપત્રો / નોટિસ' : 'Notices';
      default:
        return category;
    }
  };

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.titleGujarati && doc.titleGujarati.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Cross-Platform Download Handler
  const handleDownload = async (docItem: PublishedDocument) => {
    setDownloadingId(docItem.id);
    try {
      recordDocumentDownload(docItem.id);

      const success = await downloadDocumentCrossPlatform(
        docItem.fileUrl,
        docItem.fileName,
        docItem.mimeType
      );

      if (success) {
        setDownloadNotice(
          language === 'gu'
            ? `"${docItem.fileName}" ડાઉનલોડ શરૂ થઈ ગયું છે.`
            : `Downloaded "${docItem.fileName}" to your device.`
        );
        setTimeout(() => setDownloadNotice(null), 4500);
      }
    } catch (err: any) {
      console.error('Download error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/25">
              {language === 'gu' ? 'સત્તાવાર દસ્તાવેજો' : 'Official Repository'}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {documents.length} {language === 'gu' ? 'દસ્તાવેજો ઉપલબ્ધ' : 'Documents Available'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {language === 'gu' ? 'દસ્તાવેજ કેન્દ્ર' : 'Documents & Forms'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            {language === 'gu'
              ? 'એડમિન દ્વારા અપલોડ કરેલા સત્તાવાર ફોર્મ્સ, પરિપત્રો અને દસ્તાવેજો જુઓ, પ્રિવ્યૂ કરો અને ડાઉનલોડ કરો.'
              : 'Browse, preview, and download official government forms, applications, and documents uploaded by Admin.'}
          </p>
        </div>

        {/* Quick device support tag */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-3.5 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 self-start sm:self-center">
          <Smartphone className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{deviceInfo.platform} Compatible</span>
        </div>
      </div>

      {/* Download notice toast */}
      {downloadNotice && (
        <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-200 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="font-semibold">{downloadNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadNotice(null)}
            className="text-xs font-bold underline shrink-0 hover:text-sky-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'gu' ? 'દસ્તાવેજ અથવા ફોર્મ શોધો...' : 'Search documents, PDFs, or forms...'}
            className="w-full pl-2.5 pr-2 py-0.5 text-xs sm:text-sm bg-transparent outline-none text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs text-xs backdrop-blur-md">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent outline-none text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
            >
              <option value="all">{language === 'gu' ? 'બધી કેટેગરી' : 'All Categories'}</option>
              <option value="certificates">{language === 'gu' ? 'પ્રમાણપત્રો' : 'Certificates'}</option>
              <option value="revenue">{language === 'gu' ? 'મહેસૂલ અને ૭/૧૨' : 'Revenue & Land'}</option>
              <option value="agriculture">{language === 'gu' ? 'ખેતીવાડી સહાય' : 'Agriculture'}</option>
              <option value="forms">{language === 'gu' ? 'અરજી ફોર્મ્સ' : 'Official Forms'}</option>
              <option value="notices">{language === 'gu' ? 'પરિપત્રો / નોટિસ' : 'Notices'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-slate-200/50 dark:border-slate-800">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-600" />
          <p className="text-xs font-semibold">{language === 'gu' ? 'દસ્તાવેજો લોડ થઈ રહ્યા છે...' : 'Loading official documents...'}</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-center space-y-3 backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            {language === 'gu' ? 'કોઈ દસ્તાવેજ મળ્યા નથી' : 'No documents found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {language === 'gu'
              ? 'શોધ શબ્દ અથવા કેટેગરી ફિલ્ટર બદલીને ફરી પ્રયાસ કરો.'
              : 'Try adjusting your search query or category filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((docItem) => {
            const ext = (docItem.fileName.split('.').pop() || '').toLowerCase();

            return (
              <div
                key={docItem.id}
                className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 backdrop-blur-md group"
              >
                <div>
                  {/* Top Bar: Category & Format Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg capitalize">
                      {getCategoryLabel(docItem.category)}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getFormatBadge(docItem.fileType, docItem.fileName)}`}>
                      .{ext.toUpperCase()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {language === 'gu' && docItem.titleGujarati ? docItem.titleGujarati : docItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {docItem.description || 'Verified government document'}
                    </p>
                  </div>

                  {/* Metadata: Filename, Size, Date */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="truncate max-w-[170px]" title={docItem.fileName}>
                        {docItem.fileName}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {docItem.fileSize}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(docItem.uploadedAt).toLocaleDateString()}</span>
                      </span>
                      {docItem.downloadCount !== undefined && (
                        <span className="text-slate-400 font-mono text-[10px]">
                          {docItem.downloadCount} downloads
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ONLY Preview and Download buttons for users */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {/* View / Preview Button */}
                  <button
                    type="button"
                    onClick={() => setViewerDoc(docItem)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                    title="Preview Document in Browser"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === 'gu' ? 'જુઓ (Preview)' : 'Preview'}</span>
                  </button>

                  {/* Download Button */}
                  <button
                    type="button"
                    onClick={() => handleDownload(docItem)}
                    disabled={downloadingId === docItem.id}
                    className="flex-1 py-2 px-3 rounded-xl btn-glossy-primary font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                    title="Download to device"
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

      {/* Modal for PDF and Image In-Browser Preview */}
      {viewerDoc && (
        <DocumentViewerModal
          document={viewerDoc}
          onClose={() => setViewerDoc(null)}
          language={language}
        />
      )}
    </div>
  );
};
