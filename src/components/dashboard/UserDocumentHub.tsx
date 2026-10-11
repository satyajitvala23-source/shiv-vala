import React, { useState, useEffect, useRef } from 'react';
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
  UploadCloud,
  Plus,
  Trash2,
  Camera,
  AlertCircle,
  FolderLock,
  FileSpreadsheet,
  FileCode,
  Archive,
  File,
} from 'lucide-react';
import { PublishedDocument, FormTemplate, DocumentCategory } from '../../types';
import {
  subscribeToPublishedDocuments,
  subscribeToUserDocuments,
  createUserDocumentDoc,
  replaceUserDocumentFile,
  deleteUserDocumentDoc,
  validateDocumentFile,
  recordDocumentDownload,
  formatBytes,
} from '../../lib/documents';
import {
  downloadDocumentCrossPlatform,
  getDevicePlatformInfo,
} from '../../lib/downloadHelper';
import { DocumentViewerModal } from './DocumentViewerModal';
import { useApp } from '../../context/AppContext';
import { auth } from '../../lib/firebase';

interface UserDocumentHubProps {
  forms?: FormTemplate[];
  incrementFormDownload?: (id: string) => void;
  language?: 'en' | 'gu';
}

export const UserDocumentHub: React.FC<UserDocumentHubProps> = ({
  forms = [],
  incrementFormDownload,
  language = 'en',
}) => {
  const { currentUser } = useApp();

  // Active sub-tab: 'my-docs' (User's private locker) vs 'official-forms' (Public official forms)
  const [activeSubTab, setActiveSubTab] = useState<'my-docs' | 'official-forms'>('my-docs');

  // Documents state
  const [publishedDocs, setPublishedDocs] = useState<PublishedDocument[]>([]);
  const [userDocs, setUserDocs] = useState<PublishedDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Viewer Modal
  const [viewerDoc, setViewerDoc] = useState<PublishedDocument | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // User Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('forms');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);

  // Replace File Modal
  const [docToReplace, setDocToReplace] = useState<PublishedDocument | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replaceProgress, setReplaceProgress] = useState(0);
  const [replaceError, setReplaceError] = useState<string | null>(null);

  // Delete Confirm Modal
  const [docToDelete, setDocToDelete] = useState<PublishedDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const deviceInfo = getDevicePlatformInfo();

  // 1. Subscribe to public published documents
  useEffect(() => {
    const unsubPublished = subscribeToPublishedDocuments((docs) => {
      setPublishedDocs(docs);
    }, true);

    return () => unsubPublished();
  }, []);

  // 2. Subscribe to user's uploaded documents
  useEffect(() => {
    const currentUid = auth.currentUser?.uid || currentUser?.id;
    if (!currentUid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubUser = subscribeToUserDocuments(currentUid, (docs) => {
      setUserDocs(docs);
      setLoading(false);
    });

    return () => unsubUser();
  }, [currentUser?.id]);

  // Handle file selection for new upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validation = validateDocumentFile(file);

    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setSelectedFile(null);
      setFilePreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    if (!uploadTitle) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setUploadTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }

    if (['jpg', 'jpeg', 'png', 'webp'].includes(validation.extension)) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
  };

  // Submit User Document Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please choose a file to upload.');
      return;
    }

    if (!uploadTitle.trim()) {
      setUploadError('Please provide a document title.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const validation = validateDocumentFile(selectedFile);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      await createUserDocumentDoc(
        {
          title: uploadTitle.trim(),
          category: uploadCategory,
          categoryLabel: getCategoryLabel(uploadCategory),
          description: uploadDescription.trim() || 'Citizen uploaded document',
          fileName: selectedFile.name,
          fileUrl: '',
          fileType: validation.fileType,
          mimeType: validation.mimeType,
          fileSize: validation.sizeFormatted,
          fileSizeBytes: selectedFile.size,
          uploadedAt: new Date().toISOString(),
          isPublished: false,
          downloadCount: 0,
          viewCount: 0,
          targetAudience: 'citizens',
        },
        selectedFile,
        (prog) => setUploadProgress(prog)
      );

      setUploadSuccessNotice(`"${uploadTitle}" uploaded successfully to your locker!`);
      setTimeout(() => setUploadSuccessNotice(null), 4500);

      // Reset
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setUploadTitle('');
      setUploadDescription('');
      setIsUploadModalOpen(false);
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Replace User Document File
  const handleReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docToReplace || !replaceFile) {
      setReplaceError('Please choose a replacement file.');
      return;
    }

    setIsReplacing(true);
    setReplaceProgress(0);
    setReplaceError(null);

    try {
      await replaceUserDocumentFile(docToReplace.id, replaceFile, (p) => setReplaceProgress(p));
      setUploadSuccessNotice(`File replaced successfully for "${docToReplace.title}"!`);
      setTimeout(() => setUploadSuccessNotice(null), 4000);
      setDocToReplace(null);
      setReplaceFile(null);
    } catch (err: any) {
      setReplaceError(err?.message || 'Failed to replace file.');
    } finally {
      setIsReplacing(false);
      setReplaceProgress(0);
    }
  };

  // Delete User Document
  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    try {
      await deleteUserDocumentDoc(docToDelete.id, docToDelete.storagePath);
      setDocToDelete(null);
    } catch (err: any) {
      console.error('Delete error:', err);
    }
  };

  // Download Action
  const handleDownload = async (docItem: PublishedDocument) => {
    setDownloadingId(docItem.id);
    setDownloadNotice(null);

    try {
      const res = await downloadDocumentCrossPlatform({
        fileUrl: docItem.fileUrl,
        fileName: docItem.fileName,
        mimeType: docItem.mimeType,
      });

      recordDocumentDownload(docItem.id);
      if (incrementFormDownload) incrementFormDownload(docItem.id);

      setDownloadNotice(res.message);
      setTimeout(() => setDownloadNotice(null), 5000);
    } catch {
      setDownloadNotice('Download initiated. Tap "View" to open directly if not saved.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Helper for Category Labels
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

  // Filter current active list
  const currentDocs = activeSubTab === 'my-docs' ? userDocs : publishedDocs;
  const filteredDocs = currentDocs.filter((doc) => {
    const titleMatch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.titleGujarati && doc.titleGujarati.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const catMatch = categoryFilter === 'all' || doc.category === categoryFilter;
    return titleMatch && catMatch;
  });

  const getFormatBadge = (fileType: string, fileName: string) => {
    const ext = (fileName.split('.').pop() || fileType || '').toUpperCase();
    if (ext === 'PDF') return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    if (['JPG', 'JPEG', 'PNG', 'WEBP'].includes(ext)) return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    if (['DOC', 'DOCX'].includes(ext)) return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    if (['XLS', 'XLSX', 'CSV'].includes(ext)) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    if (['PPT', 'PPTX'].includes(ext)) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    if (ext === 'ZIP') return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {language === 'gu' ? 'દસ્તાવેજ કેન્દ્ર અને ડિજિટલ લોકર' : 'Document Hub & Digital Locker'}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cloud Storage Active</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'gu'
              ? 'તમારા અંગત દસ્તાવેજો સુરક્ષિત અપલોડ કરો તથા સત્તાવાર સરકારી ફોર્મ્સ ડાઉનલોડ કરો.'
              : 'Securely upload, preview, and download your personal documents, plus access official forms.'}
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsUploadModalOpen(true);
              setUploadError(null);
            }}
            className="btn-glossy-primary px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{language === 'gu' ? 'દસ્તાવેજ અપલોડ કરો (Upload)' : 'Upload My Document'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {uploadSuccessNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{uploadSuccessNotice}</span>
        </div>
      )}

      {/* Download notice */}
      {downloadNotice && (
        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 shrink-0" />
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

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('my-docs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
            activeSubTab === 'my-docs'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>{language === 'gu' ? 'મારા અપલોડ કરેલા દસ્તાવેજો' : 'My Uploaded Documents'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            activeSubTab === 'my-docs' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {userDocs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('official-forms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'official-forms'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'gu' ? 'સત્તાવાર સરકારી ફોર્મ્સ' : 'Official Forms & Circulars'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            activeSubTab === 'official-forms' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {publishedDocs.length}
          </span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeSubTab === 'my-docs'
                ? (language === 'gu' ? 'તમારા દસ્તાવેજો શોધો...' : 'Search your uploaded documents...')
                : (language === 'gu' ? 'સત્તાવાર ફોર્મ્સ શોધો...' : 'Search official forms & guidelines...')
            }
            className="w-full pl-2.5 pr-2 py-0.5 text-xs sm:text-sm bg-transparent outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-900 px-3 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs">
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

      {/* Documents Grid / Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-xs">Loading documents...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            {activeSubTab === 'my-docs' ? <UploadCloud className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {activeSubTab === 'my-docs'
                ? (language === 'gu' ? 'તમે હજુ કોઈ દસ્તાવેજ અપલોડ કર્યા નથી' : 'No documents uploaded yet in your locker')
                : (language === 'gu' ? 'કોઈ સરકારી ફોર્મ્સ મળ્યા નથી' : 'No matching official forms found')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {activeSubTab === 'my-docs'
                ? (language === 'gu' ? 'તમારા આધાર કાર્ડ, રેશન કાર્ડ, ૭/૧૨ કે અન્ય દસ્તાવેજો કાયમી સુરક્ષિત રાખવા અપલોડ કરો.' : 'Upload your Aadhaar, PAN, Ration card, 7/12 extract, or certificates for permanent cloud backup.')
                : (language === 'gu' ? 'શોધ શબ્દ બદલીને ફરી પ્રયાસ કરો.' : 'Try adjusting your search query or filter.')}
            </p>
          </div>
          {activeSubTab === 'my-docs' && (
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'gu' ? 'પ્રથમ દસ્તાવેજ અપલોડ કરો' : 'Upload Your First Document'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((docItem) => {
            const ext = (docItem.fileName.split('.').pop() || '').toLowerCase();
            const isDocPdf = docItem.fileType === 'pdf' || ext === 'pdf';
            const isDocImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) || docItem.fileType === 'image';

            return (
              <div
                key={docItem.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Header: Category & File Format Badge */}
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
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {language === 'gu' && docItem.titleGujarati ? docItem.titleGujarati : docItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {docItem.description || 'Verified citizen document'}
                    </p>
                  </div>

                  {/* Metadata strip: Filename, Size, Upload Date */}
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

                {/* Action Buttons: Preview, Download, Replace, Delete */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {/* View / Preview Button */}
                  <button
                    type="button"
                    onClick={() => setViewerDoc(docItem)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                    title="Preview Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === 'gu' ? 'જુઓ' : 'Preview'}</span>
                  </button>

                  {/* Download Button */}
                  <button
                    type="button"
                    onClick={() => handleDownload(docItem)}
                    disabled={downloadingId === docItem.id}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
                    title="Download to device"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingId === docItem.id ? '...' : language === 'gu' ? 'ડાઉનલોડ' : 'Download'}</span>
                  </button>

                  {/* Replace Button (Only on user's own docs) */}
                  {activeSubTab === 'my-docs' && (
                    <button
                      type="button"
                      onClick={() => {
                        setDocToReplace(docItem);
                        setReplaceFile(null);
                        setReplaceError(null);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center justify-center transition-colors active:scale-95"
                      title="Replace file"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete Button (Only on user's own docs) */}
                  {activeSubTab === 'my-docs' && (
                    <button
                      type="button"
                      onClick={() => setDocToDelete(docItem)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center transition-colors active:scale-95"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. UPLOAD DOCUMENT MODAL */}
      {/* ===================================================================== */}
      {isUploadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {language === 'gu' ? 'નવો દસ્તાવેજ અપલોડ કરો' : 'Upload Document to Locker'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {language === 'gu' ? '૧૪ ફોર્મેટ્સ સપોર્ટેડ • કાયમી ક્લાઉડ સ્ટોરેજ' : '14 Formats Supported • Cloud Firestore & Storage'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <AlertCircle className="w-5 h-5 rotate-45" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 overflow-y-auto">
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Hidden File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* File Drop / Select Area */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 text-center bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-500 transition-colors">
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="truncate max-w-xs">{selectedFile.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatBytes(selectedFile.size)} • {selectedFile.type || 'Selected File'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreviewUrl(null);
                      }}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Remove & Choose Another
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Choose file to upload to your permanent locker
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PDF, JPG, JPEG, PNG, WEBP, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP (max 25 MB)
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                      >
                        Browse Files
                      </button>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Camera</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-1.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 font-medium">
                    <span>Uploading to Persistent Cloud Storage...</span>
                    <span className="font-mono">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-900 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Document Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title*
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. My Aadhaar Card, 7/12 Land Record, Income Proof..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Category*
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="forms">Identity Proofs (Aadhaar / PAN / Voter ID)</option>
                  <option value="revenue">Land Records & Revenue (7/12, 8A, Index 2)</option>
                  <option value="certificates">Certificates (Income, Caste, Residence)</option>
                  <option value="agriculture">Farmer Subsidies & Agriculture Docs</option>
                  <option value="notices">Official Receipts & Tax Bills</option>
                  <option value="general">General / Other Documents</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Additional details about this document..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Footer buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Save to Cloud'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. REPLACE FILE MODAL */}
      {/* ===================================================================== */}
      {docToReplace && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Replace File
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-xs font-medium">
                  {docToReplace.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a new file to replace the existing version. The title, category, and document history will be preserved.
            </p>

            {replaceError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{replaceError}</span>
              </div>
            )}

            <input
              ref={replaceFileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const val = validateDocumentFile(f);
                  if (val.valid) {
                    setReplaceFile(f);
                    setReplaceError(null);
                  } else {
                    setReplaceError(val.error || 'Invalid file');
                  }
                }
              }}
              className="hidden"
            />

            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/40">
              {replaceFile ? (
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                    {replaceFile.name}
                  </div>
                  <div className="text-slate-400">{formatBytes(replaceFile.size)}</div>
                  <button
                    type="button"
                    onClick={() => replaceFileInputRef.current?.click()}
                    className="text-xs text-blue-600 font-semibold underline mt-1"
                  >
                    Change selection
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => replaceFileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs"
                >
                  Choose New File
                </button>
              )}
            </div>

            {isReplacing && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-blue-600 font-medium">
                  <span>Uploading replacement...</span>
                  <span>{replaceProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-blue-100 dark:bg-blue-900 overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${replaceProgress}%` }} />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDocToReplace(null)}
                disabled={isReplacing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReplaceSubmit}
                disabled={isReplacing || !replaceFile}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                {isReplacing ? 'Replacing...' : 'Confirm Replace'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. DELETE CONFIRMATION MODAL */}
      {/* ===================================================================== */}
      {docToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Delete this document?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                "{docToDelete.title}"
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-md shadow-rose-500/20 active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. DOCUMENT VIEWER MODAL */}
      {/* ===================================================================== */}
      <DocumentViewerModal
        document={viewerDoc}
        onClose={() => setViewerDoc(null)}
        language={language}
      />
    </div>
  );
};
