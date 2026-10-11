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
} from 'lucide-react';
import { PublishedDocument } from '../../types';
import { downloadDocumentCrossPlatform, getDevicePlatformInfo } from '../../lib/downloadHelper';
import { recordDocumentDownload, recordDocumentView } from '../../lib/documents';

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

  const deviceInfo = getDevicePlatformInfo();

  useEffect(() => {
    // Reset view states when a new document opens
    if (doc) {
      setZoomLevel(1);
      setRotation(0);
      setCopiedLink(false);
      setDownloadNotice(null);
      // Track view count
      recordDocumentView(doc.id);
    }
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

  const isPdf =
    doc.fileType === 'pdf' ||
    doc.mimeType === 'application/pdf' ||
    doc.fileName.toLowerCase().endsWith('.pdf');

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
      if (doc.fileUrl) {
        await navigator.clipboard.writeText(doc.fileUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: doc.title,
          text: `Official Document: ${doc.title} - Shiv Computer e-Governance`,
          url: doc.fileUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadNotice(null);

    try {
      const res = await downloadDocumentCrossPlatform({
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
      });

      // Increment count
      recordDocumentDownload(doc.id);

      setDownloadNotice(res.message);
      setTimeout(() => {
        setDownloadNotice(null);
      }, 5000);
    } catch (err: any) {
      setDownloadNotice('Download initiated. If not saved, tap "Open Fullscreen" to view directly.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="glass-card relative flex flex-col w-full max-w-5xl h-[92vh] max-h-[900px] rounded-2xl sm:rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                isPdf
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              }`}
            >
              {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {displayTitle}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-mono text-[11px] uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {doc.category}
                </span>
                <span>•</span>
                <span>{doc.fileSize}</span>
                <span>•</span>
                <span className="hidden sm:inline">{doc.fileName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Quick Share on mobile */}
            {typeof navigator !== 'undefined' && (navigator as any).share && (
              <button
                type="button"
                onClick={handleShare}
                title="Share Document"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy Document Link"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
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

        {/* Notice Banner (Download feedback / iOS guidance) */}
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
        <div className="flex-1 relative overflow-hidden bg-slate-900/5 dark:bg-slate-950 flex flex-col items-center justify-center">
          {/* Controls Bar for Images */}
          {!isPdf && (
            <div className="absolute top-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-lg border border-white/20 text-xs">
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
          )}

          {/* Document Content */}
          <div className="w-full h-full flex items-center justify-center overflow-auto p-2 sm:p-4">
            {isPdf ? (
              <div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
                {/* Mobile / Tablet Friendly PDF Fallback Strip */}
                {deviceInfo.isMobile && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile View: For best pinch-to-zoom & reading</span>
                    </span>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 text-white font-medium text-xs hover:bg-amber-700 transition-colors shadow-xs"
                    >
                      <span>Open Fullscreen</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Embedded PDF iframe / object */}
                <iframe
                  src={`${doc.fileUrl}#view=FitH&toolbar=1`}
                  title={doc.title}
                  className="w-full flex-1 border-0"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={doc.fileUrl}
                  alt={doc.title}
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transition: 'transform 0.15s ease-out',
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                  className="rounded-lg shadow-md cursor-grab active:cursor-grabbing select-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Official Format</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline">
              Shiv Computer e-Governance Center
            </span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <a
              href={doc.fileUrl}
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
