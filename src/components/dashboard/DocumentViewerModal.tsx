import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Calendar,
  Layers,
  AlertCircle,
  Smartphone,
  FileCode,
  Archive,
  FileSpreadsheet,
  File,
  Loader2,
} from 'lucide-react';
import { PublishedDocument } from '../../types';
import { downloadDocumentCrossPlatform, getDevicePlatformInfo } from '../../lib/downloadHelper';
import { recordDocumentDownload, recordDocumentView, loadCloudDocumentBlobUrl } from '../../lib/documents';

interface DocumentViewerModalProps {
  document: PublishedDocument | null;
  onClose: () => void;
  language?: 'en' | 'gu';
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
  language = 'en',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Resolved file URL (resolves firestore_chunk:// to object blob url)
  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string | null>(null);

  const deviceInfo = getDevicePlatformInfo();

  useEffect(() => {
    if (!doc) {
      setResolvedUrl('');
      setTextContent(null);
      return;
    }

    setZoomLevel(1);
    setRotation(0);
    setCopiedLink(false);
    setDownloadNotice(null);
    setTextContent(null);

    // Track view count
    recordDocumentView(doc.id);

    // Resolve URL
    let isCancelled = false;
    const resolve = async () => {
      setLoadingFile(true);
      try {
        let url = doc.fileUrl;
        if (url.startsWith('firestore_chunk://')) {
          const parts = url.replace('firestore_chunk://', '').split('/');
          const coll = parts[0];
          const id = parts[1];
          url = await loadCloudDocumentBlobUrl(coll, id, doc.mimeType);
        }

        if (!isCancelled) {
          setResolvedUrl(url);

          // If text or csv, try fetching content for live preview
          const ext = (doc.fileName.split('.').pop() || '').toLowerCase();
          if (['txt', 'csv'].includes(ext)) {
            try {
              const res = await fetch(url);
              if (res.ok) {
                const text = await res.text();
                if (!isCancelled) setTextContent(text.slice(0, 10000));
              }
            } catch {
              // Ignore text fetch error
            }
          }
        }
      } catch (err) {
        console.warn('[Viewer] Could not resolve cloud file url:', err);
        if (!isCancelled) setResolvedUrl(doc.fileUrl);
      } finally {
        if (!isCancelled) setLoadingFile(false);
      }
    };

    resolve();

    return () => {
      isCancelled = true;
    };
  }, [doc]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!doc) return null;

  const ext = (doc.fileName.split('.').pop() || '').toLowerCase();
  const isPdf =
    doc.fileType === 'pdf' ||
    doc.mimeType === 'application/pdf' ||
    ext === 'pdf';

  const isImage =
    ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ||
    doc.fileType === 'image' ||
    doc.fileType === 'jpeg' ||
    doc.fileType === 'png' ||
    doc.fileType === 'webp' ||
    doc.mimeType.startsWith('image/');

  const isTextOrCsv = ['txt', 'csv'].includes(ext) || doc.fileType === 'txt' || doc.fileType === 'csv';

  const isOfficeOrZip =
    ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip'].includes(ext) ||
    ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip'].includes(doc.fileType);

  const displayTitle = language === 'gu' && doc.titleGujarati ? doc.titleGujarati : doc.title;
  const displayDescription =
    language === 'gu' && doc.descriptionGujarati ? doc.descriptionGujarati : doc.description;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleCopyLink = async () => {
    try {
      const urlToCopy = resolvedUrl || doc.fileUrl;
      if (urlToCopy && !urlToCopy.startsWith('blob:')) {
        await navigator.clipboard.writeText(urlToCopy);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadNotice(null);

    try {
      const res = await downloadDocumentCrossPlatform({
        fileUrl: resolvedUrl || doc.fileUrl,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
      });

      recordDocumentDownload(doc.id);
      setDownloadNotice(res.message);
      setTimeout(() => setDownloadNotice(null), 5000);
    } catch {
      setDownloadNotice('Download initiated. Tap "Open in Tab" to view directly if needed.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper to render appropriate file format icon
  const renderFormatIcon = (size = 'w-10 h-10') => {
    if (isPdf) return <FileText className={`${size} text-red-500`} />;
    if (isImage) return <ImageIcon className={`${size} text-cyan-500`} />;
    if (ext === 'doc' || ext === 'docx') return <FileText className={`${size} text-blue-600`} />;
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return <FileSpreadsheet className={`${size} text-emerald-600`} />;
    if (ext === 'ppt' || ext === 'pptx') return <Layers className={`${size} text-amber-500`} />;
    if (ext === 'zip') return <Archive className={`${size} text-purple-500`} />;
    if (ext === 'txt') return <FileCode className={`${size} text-slate-500`} />;
    return <File className={`${size} text-blue-500`} />;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-viewer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              {renderFormatIcon('w-5 h-5')}
            </div>
            <div className="min-w-0">
              <h2 id="doc-viewer-modal-title" className="font-bold text-sm sm:text-base truncate text-slate-900 dark:text-white">
                {displayTitle}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
                <span className="font-mono font-medium uppercase text-blue-600 dark:text-blue-400">
                  .{ext.toUpperCase()}
                </span>
                <span>•</span>
                <span>{doc.fileSize}</span>
                <span>•</span>
                <span className="truncate">{doc.fileName}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy link"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Close Viewer"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {downloadNotice && (
          <div className="px-4 py-2.5 bg-blue-500/10 border-b border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between gap-2 shrink-0 animate-in fade-in">
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

        {/* Viewer Body */}
        <div className="flex-1 relative overflow-hidden bg-slate-100/60 dark:bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-5">
          {loadingFile ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500">
                {language === 'gu' ? 'દસ્તાવેજ લોડ થઈ રહ્યો છે...' : 'Retrieving document from Cloud Storage...'}
              </p>
            </div>
          ) : isPdf ? (
            /* PDF VIEWER */
            <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
              {deviceInfo.isMobile && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Screen: Open full tab for high-resolution pinch zoom</span>
                  </span>
                  <a
                    href={resolvedUrl || doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 text-white font-medium text-xs hover:bg-amber-700 transition-colors shadow-xs"
                  >
                    <span>Open Fullscreen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              <iframe
                src={`${resolvedUrl || doc.fileUrl}#view=FitH&toolbar=1`}
                title={doc.title}
                className="w-full flex-1 border-0"
              />
            </div>
          ) : isImage ? (
            /* IMAGE VIEWER WITH ZOOM & ROTATE */
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
              <div className="absolute top-2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-lg border border-white/20 text-xs">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1 hover:text-blue-400 transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-[11px] px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1 hover:text-blue-400 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-3.5 bg-white/20 mx-0.5" />
                <button
                  type="button"
                  onClick={handleRotate}
                  title="Rotate 90°"
                  className="p-1 hover:text-blue-400 transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title="Reset View"
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 transition-colors"
                >
                  Reset
                </button>
              </div>

              <img
                src={resolvedUrl || doc.fileUrl}
                alt={doc.title}
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease-out',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                className="rounded-xl shadow-md cursor-grab active:cursor-grabbing select-none"
              />
            </div>
          ) : isTextOrCsv && textContent ? (
            /* TEXT / CSV PREVIEW */
            <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Text / Data Preview ({doc.fileName})</span>
                <span className="text-[11px] font-mono text-blue-600">{doc.fileSize}</span>
              </div>
              <pre className="flex-1 overflow-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
                {textContent}
              </pre>
            </div>
          ) : (
            /* OFFICE FORMATS (DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP) FILE CARD */
            <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xl flex flex-col items-center text-center space-y-5 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-blue-500/10 via-indigo-500/15 to-sky-500/10 border border-blue-500/20 flex items-center justify-center shadow-md">
                {renderFormatIcon('w-10 h-10')}
              </div>

              <div className="space-y-1.5 max-w-md">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {ext.toUpperCase()} File Format
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {doc.fileName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {displayDescription || (language === 'gu' ? 'આ ફોર્મેટ માટે ડાઉનલોડ ઉપલબ્ધ છે' : 'Direct browser preview is not applicable for this binary format. Please download the file to view in Microsoft Office, LibreOffice, or your local viewer.')}
                </p>
              </div>

              {/* Metadata Details Grid */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-left text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">File Size</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{doc.fileSize}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Upload Date</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Category</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{doc.category}</div>
                </div>
              </div>

              {/* Prominent Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloading
                    ? (language === 'gu' ? 'ડાઉનલોડ થઈ રહ્યું છે...' : 'Downloading...')
                    : (language === 'gu' ? 'ફાઈલ ડાઉનલોડ કરો (Download)' : 'Download File Now')}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Document Format</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline">
              Shiv Computer e-Governance
            </span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <a
              href={resolvedUrl || doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Tab</span>
            </a>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>
                {isDownloading
                  ? 'Downloading...'
                  : language === 'gu'
                  ? 'ડાઉનલોડ કરો (Download)'
                  : 'Download File'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
