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
  ShieldCheck,
  Plus,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import {
  PublishedDocument,
  DocumentCategory,
} from '../../types';
import {
  validateDocumentFile,
  createPublishedDocumentDoc,
  replacePublishedDocumentFile,
  updatePublishedDocumentDoc,
  deletePublishedDocumentDoc,
  subscribeToPublishedDocuments,
  formatBytes,
} from '../../lib/documents';
import { downloadDocumentCrossPlatform } from '../../lib/downloadHelper';
import { DocumentViewerModal } from './DocumentViewerModal';

interface AdminDocumentManagerProps {
  language?: 'en' | 'gu';
}

export const AdminDocumentManager: React.FC<AdminDocumentManagerProps> = ({
  language = 'en',
}) => {
  const [documents, setDocuments] = useState<PublishedDocument[]>([]);
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

  // Replace/Edit Document State
  const [docToReplace, setDocToReplace] = useState<PublishedDocument | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<DocumentCategory>('forms');
  const [editDescription, setEditDescription] = useState('');
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replaceProgress, setReplaceProgress] = useState(0);
  const [replaceError, setReplaceError] = useState<string | null>(null);

  // Delete Confirmation State
  const [docToDelete, setDocToDelete] = useState<PublishedDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe in real-time to Published Documents
  useEffect(() => {
    setLoadingDocs(true);
    const unsubscribe = subscribeToPublishedDocuments((docs) => {
      setDocuments(docs);
      setLoadingDocs(false);
    }, false);

    return () => unsubscribe();
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

  // Upload Submission Handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadError('Please choose or take a photo of a document/PDF.');
      return;
    }

    if (!docTitle.trim()) {
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

      await createPublishedDocumentDoc(
        {
          title: docTitle.trim(),
          titleGujarati: docTitleGu.trim() || undefined,
          category: docCategory,
          categoryLabel: getCategoryLabel(docCategory),
          description: docDescription.trim(),
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
        (progress) => {
          setUploadProgress(progress);
        }
      );

      setUploadSuccessNotice(`"${docTitle}" published successfully to Firebase Storage & User Panel!`);
      setTimeout(() => setUploadSuccessNotice(null), 5000);

      // Reset
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setDocTitle('');
      setDocTitleGu('');
      setDocDescription('');
      setDocDescriptionGu('');
      setIsUploadModalOpen(false);
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed. Please check network connection.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Open Edit Modal
  const openEditModal = (docItem: PublishedDocument) => {
    setDocToReplace(docItem);
    setEditTitle(docItem.title);
    setEditCategory(docItem.category);
    setEditDescription(docItem.description || '');
    setReplacementFile(null);
    setReplaceError(null);
  };

  // Submit Edit & File Replacement
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docToReplace) return;

    setIsReplacing(true);
    setReplaceProgress(0);
    setReplaceError(null);

    try {
      // 1. If replacement file chosen, replace file in Storage
      if (replacementFile) {
        await replacePublishedDocumentFile(
          docToReplace.id,
          replacementFile,
          (progress) => setReplaceProgress(progress)
        );
      }

      // 2. Update metadata
      await updatePublishedDocumentDoc(docToReplace.id, {
        title: editTitle.trim() || docToReplace.title,
        category: editCategory,
        categoryLabel: getCategoryLabel(editCategory),
        description: editDescription.trim(),
      });

      setUploadSuccessNotice(`"${editTitle || docToReplace.title}" updated successfully!`);
      setTimeout(() => setUploadSuccessNotice(null), 4000);

      setDocToReplace(null);
      setReplacementFile(null);
    } catch (err: any) {
      setReplaceError(err?.message || 'Failed to update document.');
    } finally {
      setIsReplacing(false);
      setReplaceProgress(0);
    }
  };

  // Delete Document Handler
  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    try {
      await deletePublishedDocumentDoc(docToDelete.id, docToDelete.storagePath);
      setUploadSuccessNotice(`"${docToDelete.title}" deleted from Firebase Storage & Firestore.`);
      setTimeout(() => setUploadSuccessNotice(null), 4000);
      setDocToDelete(null);
    } catch (err: any) {
      alert(`Could not delete document: ${err?.message}`);
    }
  };

  // Toggle Published Status
  const handleTogglePublished = async (docItem: PublishedDocument) => {
    try {
      await updatePublishedDocumentDoc(docItem.id, {
        isPublished: !docItem.isPublished,
      });
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Cross-Platform Download Handler
  const handleDownload = async (docItem: PublishedDocument) => {
    await downloadDocumentCrossPlatform(docItem.fileUrl, docItem.fileName, docItem.mimeType);
  };

  // Category label helper
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

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.titleGujarati && doc.titleGujarati.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/25">
              Admin
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {documents.length} Documents in Storage
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            {language === 'gu'
              ? 'દસ્તાવેજ વ્યવસ્થાપન (Firebase Storage)'
              : 'Document Manager (Firebase Storage)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'gu'
              ? 'એડમિન કંટ્રોલ: દસ્તાવેજો અપલોડ કરો, એડિટ કરો, બદલો (Replace), જુઓ અને ડિલીટ કરો. અપલોડ કરેલા દસ્તાવેજો યુઝર પેનલમાં આપોઆપ દેખાશે.'
              : 'Admin controls to upload, edit, replace, preview, download, and delete documents. Uploads automatically appear in the User Panel.'}
          </p>
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setFilePreviewUrl(null);
            setUploadError(null);
            setIsUploadModalOpen(true);
          }}
          className="btn-glossy-primary px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-sky-500/20 active:scale-95 self-start sm:self-center"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{language === 'gu' ? 'નવો દસ્તાવેજ અપલોડ કરો' : 'Upload Document'}</span>
        </button>
      </div>

      {/* Success Notice */}
      {uploadSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{uploadSuccessNotice}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'gu'
                ? 'દસ્તાવેજ શોધો (Title, Category, File)...'
                : 'Search documents by title, category, or filename...'
            }
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
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
            <option value="agriculture">Agriculture (ખેતીવાડી)</option>
            <option value="forms">Official Forms (ફોર્મ્સ)</option>
            <option value="notices">Circulars (પરિપત્રો)</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {loadingDocs ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-slate-200/50">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-sky-600" />
          <span>Loading document catalog...</span>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 backdrop-blur-md">
          <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No documents found
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "Upload Document" above to upload documents or PDFs to Firebase Storage.
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
                className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 flex flex-col justify-between space-y-4 group transition-all hover:shadow-lg backdrop-blur-md"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-[11px] mb-3">
                    <span className="uppercase px-2.5 py-0.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-mono text-[10px]">
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
                        title="Toggle Publish Status (Controls visibility in User Panel)"
                      >
                        {docItem.isPublished ? 'Live in User Panel' : 'Hidden'}
                      </button>
                    </div>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isDocPdf
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400'
                      }`}
                    >
                      {isDocPdf ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {docItem.title}
                      </h3>
                      {docItem.titleGujarati && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5 font-medium">
                          {docItem.titleGujarati}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                        {docItem.description || 'Published official document'}
                      </p>
                    </div>
                  </div>

                  {/* Filename, Size, Date */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-1 text-[11px] text-slate-400 font-mono">
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

                {/* Admin Actions: Preview, Download, Edit/Replace, Delete */}
                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setViewerDoc(docItem)}
                    className="py-2 px-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 transition-colors active:scale-95"
                    title="Preview in Browser"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(docItem)}
                    className="py-2 px-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 font-semibold text-xs flex items-center justify-center gap-1 transition-colors active:scale-95"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(docItem)}
                    className="py-2 px-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 font-semibold text-xs flex items-center justify-center gap-1 transition-colors active:scale-95"
                    title="Edit Details / Replace File"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocToDelete(docItem)}
                    className="py-2 px-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center transition-colors active:scale-95"
                    title="Delete Document from Storage"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. UPLOAD DOCUMENT MODAL */}
      {isUploadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="glass-card relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {language === 'gu'
                      ? 'નવો દસ્તાવેજ અપલોડ કરો (Firebase Storage)'
                      : 'Upload Document to Firebase Storage'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    PDF, JPG, PNG, WEBP, DOCX, XLSX, TXT, CSV, ZIP (max 25 MB).
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

            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-emerald-400 bg-emerald-500/5'
                    : 'border-slate-300 dark:border-slate-700 hover:border-sky-500 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {formatBytes(selectedFile.size)} • Click to choose another file
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="w-8 h-8 text-sky-500 mx-auto" />
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      Click to Browse or Drag & Drop File
                    </div>
                    <div className="text-xs text-slate-400">
                      PDF, Images, Word, Excel, ZIP up to 25 MB
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Income Certificate Application Form"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="forms">Official Forms (અરજી ફોર્મ્સ)</option>
                    <option value="certificates">Certificates (પ્રમાણપત્રો)</option>
                    <option value="revenue">Revenue & 7/12 (મહેસૂલ રેકોર્ડ્સ)</option>
                    <option value="agriculture">Agriculture (ખેતીવાડી સહાય)</option>
                    <option value="notices">Circulars (પરિપત્રો / નોટિસ)</option>
                  </select>
                </div>
              </div>

              {/* Gujarati Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title (Gujarati - વૈકલ્પિક)
                </label>
                <input
                  type="text"
                  value={docTitleGu}
                  onChange={(e) => setDocTitleGu(e.target.value)}
                  placeholder="દા.ત. આવકનો દાખલો અરજી ફોર્મ"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={2}
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  placeholder="Key instructions for users..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              {/* Progress bar */}
              {isUploading && (
                <div className="space-y-1.5 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <div className="flex justify-between text-xs font-semibold text-sky-700 dark:text-sky-300">
                    <span>Uploading to Firebase Cloud Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="btn-glossy-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'Publishing...' : 'Upload & Publish to User Panel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT / REPLACE FILE MODAL */}
      {docToReplace && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="glass-card relative flex flex-col w-full max-w-lg rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Edit Document / Replace File
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDocToReplace(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              {replaceError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs">
                  {replaceError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="forms">Official Forms (અરજી ફોર્મ્સ)</option>
                  <option value="certificates">Certificates (પ્રમાણપત્રો)</option>
                  <option value="revenue">Revenue & 7/12 (મહેસૂલ રેકોર્ડ્સ)</option>
                  <option value="agriculture">Agriculture (ખેતીવાડી સહાય)</option>
                  <option value="notices">Circulars (પરિપત્રો / નોટિસ)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Replace File with New PDF/Document (Optional)
                </label>
                <input
                  ref={replaceFileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                  onChange={(e) => setReplacementFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-sky-50 file:text-sky-700 file:font-semibold hover:file:bg-sky-100"
                />
                {replacementFile && (
                  <div className="mt-1 text-emerald-600 font-semibold">
                    New file selected: {replacementFile.name} ({formatBytes(replacementFile.size)})
                  </div>
                )}
              </div>

              {isReplacing && (
                <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex justify-between text-xs font-semibold text-amber-700">
                    <span>Uploading replacement file...</span>
                    <span>{replaceProgress}%</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDocToReplace(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReplacing}
                  className="btn-glossy-primary px-4 py-2 rounded-xl font-semibold"
                >
                  {isReplacing ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {docToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="glass-card max-w-sm w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delete Document?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to permanently delete "{docToDelete.title}"? This will remove the file from Firebase Storage and remove it from the User Panel.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
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
