import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Camera,
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  Plus,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Globe,
  Tag,
  Share2,
  FileSpreadsheet,
  FileCode,
  Archive,
  File,
  User,
} from 'lucide-react';
import {
  PublishedDocument,
  DocumentCategory,
  Application,
  ApplicationStatus,
} from '../../types';
import {
  validateDocumentFile,
  createPublishedDocumentDoc,
  replacePublishedDocumentFile,
  updatePublishedDocumentDoc,
  deletePublishedDocumentDoc,
  subscribeToPublishedDocuments,
  subscribeToAllUserDocuments,
  deleteUserDocumentDoc,
  formatBytes,
} from '../../lib/documents';
import { downloadDocumentCrossPlatform } from '../../lib/downloadHelper';
import { DocumentViewerModal } from './DocumentViewerModal';

interface AdminDocumentManagerProps {
  applications: Application[];
  onOpenAppReview: (app: Application) => void;
  getStatusBadge: (status: ApplicationStatus) => string;
  getStatusLabel: (status: ApplicationStatus) => string;
  language?: 'en' | 'gu';
}

export const AdminDocumentManager: React.FC<AdminDocumentManagerProps> = ({
  applications,
  onOpenAppReview,
  getStatusBadge,
  getStatusLabel,
  language = 'en',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'published' | 'verification'>('published');
  const [documents, setDocuments] = useState<PublishedDocument[]>([]);
  const [citizenDocs, setCitizenDocs] = useState<PublishedDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(true);

  // Search & Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Viewer Modal State
  const [viewerDoc, setViewerDoc] = useState<PublishedDocument | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);

  // Upload Form Fields
  const [docTitle, setDocTitle] = useState('');
  const [docTitleGu, setDocTitleGu] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('forms');
  const [docDescription, setDocDescription] = useState('');
  const [docDescriptionGu, setDocDescriptionGu] = useState('');
  const [docAudience, setDocAudience] = useState<'all' | 'citizens' | 'farmers' | 'students'>('all');
  const [isPublishedNow, setIsPublishedNow] = useState(true);

  // Replace Document State
  const [docToReplace, setDocToReplace] = useState<PublishedDocument | null>(null);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replaceProgress, setReplaceProgress] = useState(0);
  const [replaceError, setReplaceError] = useState<string | null>(null);

  // Delete Confirmation State
  const [docToDelete, setDocToDelete] = useState<PublishedDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to Published Documents
  useEffect(() => {
    setLoadingDocs(true);
    const unsubscribe = subscribeToPublishedDocuments((docs) => {
      setDocuments(docs);
      setLoadingDocs(false);
    }, false);

    return () => unsubscribe();
  }, []);

  // Subscribe to Citizen Uploaded Documents
  useEffect(() => {
    const unsubCitizen = subscribeToAllUserDocuments((docs) => {
      setCitizenDocs(docs);
    });

    return () => unsubCitizen();
  }, []);

  // Handle File Selection
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

    // Auto-fill title if empty
    if (!docTitle) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setDocTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }

    // Generate local preview for images
    if (['jpg', 'jpeg', 'png', 'webp'].includes(validation.extension)) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validation = validateDocumentFile(file);

    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    if (!docTitle) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setDocTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }

    if (['jpg', 'jpeg', 'png', 'webp'].includes(validation.extension)) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Submit Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select or capture a file to upload.');
      return;
    }

    if (!docTitle.trim()) {
      setUploadError('Please enter a document title.');
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

      await createPublishedDocumentDoc(
        {
          title: docTitle.trim(),
          titleGujarati: docTitleGu.trim() || undefined,
          category: docCategory,
          categoryLabel: getCategoryLabel(docCategory),
          description: docDescription.trim() || 'Official document provided by Shiv Computer.',
          descriptionGujarati: docDescriptionGu.trim() || undefined,
          fileName: selectedFile.name,
          fileUrl: '',
          fileType: validation.fileType,
          mimeType: validation.mimeType,
          fileSize: validation.sizeFormatted,
          fileSizeBytes: selectedFile.size,
          uploadedAt: new Date().toISOString(),
          isPublished: isPublishedNow,
          downloadCount: 0,
          viewCount: 0,
          targetAudience: docAudience,
        },
        selectedFile,
        (progress) => setUploadProgress(progress)
      );

      setUploadSuccessNotice(`"${docTitle}" published successfully to Cloud Storage!`);
      setTimeout(() => setUploadSuccessNotice(null), 4000);

      // Reset form and close modal
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setDocTitle('');
      setDocTitleGu('');
      setDocDescription('');
      setDocDescriptionGu('');
      setIsUploadModalOpen(false);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to complete document upload.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Replace File Submit
  const handleReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docToReplace || !replacementFile) {
      setReplaceError('Please select a new file to replace the existing one.');
      return;
    }

    setIsReplacing(true);
    setReplaceProgress(0);
    setReplaceError(null);

    try {
      await replacePublishedDocumentFile(
        docToReplace.id,
        replacementFile,
        (p) => setReplaceProgress(p)
      );

      setUploadSuccessNotice(`File replaced successfully for "${docToReplace.title}"!`);
      setTimeout(() => setUploadSuccessNotice(null), 4000);

      setDocToReplace(null);
      setReplacementFile(null);
    } catch (err: any) {
      setReplaceError(err?.message || 'Failed to replace file.');
    } finally {
      setIsReplacing(false);
      setReplaceProgress(0);
    }
  };

  // Toggle Published Status
  const handleTogglePublished = async (docItem: PublishedDocument) => {
    await updatePublishedDocumentDoc(docItem.id, {
      isPublished: !docItem.isPublished,
    });
  };

  // Delete Document
  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    if (docToDelete.id.startsWith('USERDOC-')) {
      await deleteUserDocumentDoc(docToDelete.id, docToDelete.storagePath);
    } else {
      await deletePublishedDocumentDoc(docToDelete.id, docToDelete.storagePath);
    }
    setDocToDelete(null);
  };

  // Download Action
  const handleDownload = async (docItem: PublishedDocument) => {
    await downloadDocumentCrossPlatform({
      fileUrl: docItem.fileUrl,
      fileName: docItem.fileName,
      mimeType: docItem.mimeType,
    });
  };

  // Inspect Applicant Document
  const handleInspectApplicantDoc = (docName: string, docSize: string, docDate: string) => {
    const tempDoc: PublishedDocument = {
      id: `APP-DOC-${Date.now()}`,
      title: docName,
      category: 'forms',
      description: `Applicant submitted verification proof (${docSize} • ${docDate})`,
      fileName: docName.endsWith('.pdf') || docName.endsWith('.jpg') || docName.endsWith('.png') ? docName : `${docName}.pdf`,
      fileUrl: `data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUj4+ZW5kb2JqCjQgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PmVuZG9iago1IDAgb2JqPDwvTGVuZ3RoIDE0MD4+c3RyZWFtCkJUCi9GMTQgMTYgVGYKNTAgNzUwIFRkCihBcHBMaWNhbnQgRG9jdW1lbnQgUHJvb2Y6ICkeY29tZW50VmVyaWZpY2F0aW9uIFNoaXYgQ29tcHV0ZXIpIFRqCjAgLTMwIFRkCihEaWdpdGFsIFN1Ym1pc3Npb24gQXBwcm92ZWQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExNyAwMDAwMCBuIAowMDAwMDAwMjI3IDAwMDAwIG4gCjAwMDAwMDAyOTUgMDAwMDAgbiAKdHJhaWxlcjw8L1NpemUgNi9Sb290IDEgMCBSPj5zdGFydHhyZWYKNDg5CiUlRU9G`,
      fileType: docName.toLowerCase().endsWith('.png') || docName.toLowerCase().endsWith('.jpg') ? 'image' : 'pdf',
      mimeType: 'application/pdf',
      fileSize: docSize,
      fileSizeBytes: 500000,
      uploadedAt: docDate,
      isPublished: true,
      downloadCount: 1,
      viewCount: 1,
      targetAudience: 'all',
    };
    setViewerDoc(tempDoc);
  };

  // Filtered Published Documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.titleGujarati && doc.titleGujarati.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  function getCategoryLabel(cat: DocumentCategory): string {
    switch (cat) {
      case 'certificates':
        return language === 'gu' ? 'સરકારી પ્રમાણપત્રો' : 'Certificates';
      case 'revenue':
        return language === 'gu' ? 'મહેસૂલ અને ૭/૧૨ રેકોર્ડ્સ' : 'Revenue & Land';
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
              {language === 'gu'
                ? 'દસ્તાવેજ વ્યવસ્થાપન અને ક્લાઉડ સ્ટોરેજ સેન્ટર'
                : 'Universal Document Management & Cloud Storage'}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>14 Formats Supported</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'gu'
              ? 'નાગરિકો માટે સરકારી ફોર્મ્સ અપલોડ કરો, બદલો (Replace), જુઓ, ડાઉનલોડ કરો અને આવેલી અરજીઓના દસ્તાવેજો ચકાસો.'
              : 'Admin controls to upload, preview, download, replace, categorize, and delete documents with permanent cloud storage.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setFilePreviewUrl(null);
              setUploadError(null);
              setIsUploadModalOpen(true);
            }}
            className="btn-glossy-primary px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{language === 'gu' ? 'નવો દસ્તાવેજ અપલોડ કરો' : 'Upload New Document'}</span>
          </button>
        </div>
      </div>

      {/* Success Notice */}
      {uploadSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{uploadSuccessNotice}</span>
        </div>
      )}

      {/* Sub Tabs Toggle Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('published')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'published'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>
            {language === 'gu' ? 'પ્રકાશિત સત્તાવાર દસ્તાવેજો' : 'Published Official Documents'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
            {documents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('verification')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'verification'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>
            {language === 'gu' ? 'નાગરિકોના દસ્તાવેજો (Citizen Locker)' : 'Citizen Uploaded Documents & Proofs'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
            {citizenDocs.length + applications.reduce((acc, app) => acc + app.uploadedDocuments.length, 0)}
          </span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SUBTAB 1: PUBLISHED DOCUMENTS LIBRARY */}
      {/* ===================================================================== */}
      {activeSubTab === 'published' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'gu'
                    ? 'દસ્તાવેજ શોધો (Search title, category, filename)...'
                    : 'Search published documents by title, category, or file...'
                }
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Category Select */}
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
                <option value="agriculture">Agriculture (ખેતીવાડી)</option>
                <option value="forms">Official Forms (ફોર્મ્સ)</option>
                <option value="notices">Circulars (પરિપત્રો)</option>
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          {loadingDocs ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
              <span>Loading document catalog...</span>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No documents found
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No documents match your filter. Click "Upload New Document" to add official forms or circulars.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((docItem) => {
                const ext = (docItem.fileName.split('.').pop() || '').toLowerCase();
                const isDocPdf = docItem.fileType === 'pdf' || ext === 'pdf';

                return (
                  <div
                    key={docItem.id}
                    className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 group transition-all hover:shadow-md hover:border-blue-500/30"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-[11px] mb-3">
                        <span className="uppercase px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono text-[10px]">
                          {getCategoryLabel(docItem.category)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getFormatBadge(docItem.fileType, docItem.fileName)}`}>
                            .{ext.toUpperCase()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleTogglePublished(docItem)}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                              docItem.isPublished
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                            }`}
                            title="Toggle Publish Status"
                          >
                            {docItem.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </div>
                      </div>

                      {/* Header with Icon & Title */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                            isDocPdf
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                              : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {isDocPdf ? (
                            <FileText className="w-5 h-5" />
                          ) : (
                            <ImageIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {docItem.title}
                          </h3>
                          {docItem.titleGujarati && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5 font-medium">
                              {docItem.titleGujarati}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                            {docItem.description}
                          </p>
                        </div>
                      </div>

                      {/* Info footer strip: Filename, Size, Upload Date */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1 text-[11px] text-slate-400 font-mono">
                        <div className="flex items-center justify-between">
                          <span className="truncate max-w-[160px]" title={docItem.fileName}>{docItem.fileName}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{docItem.fileSize}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{new Date(docItem.uploadedAt).toLocaleDateString()}</span>
                          <span>{docItem.downloadCount} downloads</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: View, Download, Replace, Delete */}
                    <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setViewerDoc(docItem)}
                        className="py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 transition-colors active:scale-95"
                        title="Preview Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(docItem)}
                        className="py-2 px-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center justify-center gap-1 transition-colors active:scale-95"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDocToReplace(docItem);
                          setReplacementFile(null);
                          setReplaceError(null);
                        }}
                        className="py-2 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 font-semibold text-xs flex items-center justify-center gap-1 transition-colors active:scale-95"
                        title="Replace File"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Replace</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDocToDelete(docItem)}
                        className="py-2 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center transition-colors active:scale-95"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 2: CITIZEN UPLOADED DOCUMENTS & APPLICANT PROOFS */}
      {/* ===================================================================== */}
      {activeSubTab === 'verification' && (
        <div className="space-y-6">
          {/* Section A: Direct Citizen Locker Uploads */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Citizen Locker Uploads ({citizenDocs.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Documents directly uploaded by registered citizens into their personal cloud lockers.
                </p>
              </div>
            </div>

            {citizenDocs.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No citizen locker documents uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {citizenDocs.map((cdoc) => {
                  const ext = (cdoc.fileName.split('.').pop() || '').toLowerCase();
                  return (
                    <div
                      key={cdoc.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-2">
                          <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                            {cdoc.uploadedBy || 'Citizen'}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getFormatBadge(cdoc.fileType, cdoc.fileName)}`}>
                            .{ext.toUpperCase()}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {cdoc.title}
                        </h4>
                        <div className="text-[11px] text-slate-400 font-mono truncate mt-1">
                          {cdoc.fileName} • {cdoc.fileSize}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Uploaded: {new Date(cdoc.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setViewerDoc(cdoc)}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(cdoc)}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDocToDelete(cdoc)}
                          className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100"
                          title="Delete Citizen Doc"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section B: Applicant Verification Proofs from Applications */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Service Application Document Attachments</span>
            </h3>

            {applications.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No applicant documents pending verification.
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                          {app.id}
                        </span>
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {app.serviceName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Applicant: <strong>{app.applicantName}</strong> ({app.applicantPhone})
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border self-start ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {getStatusLabel(app.status)}
                    </span>
                  </div>

                  {/* Proof list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                    {app.uploadedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div className="overflow-hidden pr-2">
                          <div className="font-medium text-xs text-slate-800 dark:text-slate-200 truncate">
                            {doc.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {doc.size} • {doc.date}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              doc.status === 'Verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === 'Needs Correction'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {doc.status}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleInspectApplicantDoc(doc.name, doc.size, doc.date)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Inspect Document Proof"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenAppReview(app)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open Application Review & Verification Controls</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. UPLOAD DOCUMENT MODAL */}
      {/* ===================================================================== */}
      {isUploadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="glass-card relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl sm:rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {language === 'gu'
                      ? 'નવો દસ્તાવેજ અથવા ફોર્મ અપલોડ કરો'
                      : 'Upload & Publish Document'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Supports 14 formats: PDF, JPG, PNG, WEBP, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP (max 25 MB).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isUploading) setIsUploadModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Hidden file inputs */}
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

              {/* Drag & Drop Upload Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  selectedFile
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-xs">
                          {selectedFile.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {formatBytes(selectedFile.size)} • {selectedFile.type || 'Document'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Change File
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreviewUrl(null);
                        }}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Drag and drop your file here, or browse
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PDF, JPG, JPEG, PNG, WEBP, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP (max 25 MB)
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
                      >
                        Browse Files
                      </button>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Use Camera</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
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

              {/* Title & Gujarati Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document Title (English)*
                  </label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. 7/12 Land Record Application Format"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document Title (ગુજરાતી)
                  </label>
                  <input
                    type="text"
                    value={docTitleGu}
                    onChange={(e) => setDocTitleGu(e.target.value)}
                    placeholder="દા.ત. ૭/૧૨ જમીન નોંધણી અરજી નમૂનો"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category & Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category*
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="forms">Official Application Forms (અરજી ફોર્મ્સ)</option>
                    <option value="certificates">Government Certificates (પ્રમાણપત્રો)</option>
                    <option value="revenue">Revenue & Land Extracts (મહેસૂલ અને ૭/૧૨)</option>
                    <option value="agriculture">Farmer Subsidy Schemes (ખેતીવાડી સહાય)</option>
                    <option value="notices">Official Notices & Circulars (પરિપત્રો)</option>
                    <option value="general">General Documentation (સામાન્ય)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={docAudience}
                    onChange={(e) => setDocAudience(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="all">All Citizens (બધા નાગરિકો)</option>
                    <option value="citizens">General Citizens</option>
                    <option value="farmers">Farmers & Landowners (ખેડૂતો)</option>
                    <option value="students">Students & Youths (વિદ્યાર્થીઓ)</option>
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={2}
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  placeholder="Official instructions for filling or submitting this form..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Publish State */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="publish-now-checkbox"
                  checked={isPublishedNow}
                  onChange={(e) => setIsPublishedNow(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="publish-now-checkbox" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                  Make available immediately in public library (isPublished: true)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="btn-glossy-primary px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading...' : 'Publish Document'}</span>
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
                  Replace Document File
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-xs font-medium">
                  {docToReplace.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload an updated file (PDF, Office, Image, Archive, or Data). The existing record metadata, view count, and categories will remain intact.
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
                    setReplacementFile(f);
                    setReplaceError(null);
                  } else {
                    setReplaceError(val.error || 'Invalid file');
                  }
                }
              }}
              className="hidden"
            />

            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/40">
              {replacementFile ? (
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                    {replacementFile.name}
                  </div>
                  <div className="text-slate-400">{formatBytes(replacementFile.size)}</div>
                  <button
                    type="button"
                    onClick={() => replaceFileInputRef.current?.click()}
                    className="text-xs text-blue-600 font-semibold underline mt-1"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => replaceFileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs"
                >
                  Select Replacement File
                </button>
              )}
            </div>

            {isReplacing && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-blue-600 font-medium">
                  <span>Uploading to Cloud Storage...</span>
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
                disabled={isReplacing || !replacementFile}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                {isReplacing ? 'Updating...' : 'Confirm Replace'}
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
                Delete document?
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
                Confirm Delete
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
