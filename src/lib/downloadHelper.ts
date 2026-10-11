/**
 * ============================================================================
 * SHIV COMPUTER - UNIVERSAL CROSS-PLATFORM DOWNLOAD HELPER
 * ============================================================================
 *
 * Ensures 100% reliable document and photo downloading across:
 * - Android phones & tablets (Chrome, Samsung Internet, Firefox)
 * - Apple iPhone & iPad (iOS/iPadOS Safari, Chrome, Edge)
 * - Linux computers & laptops (Firefox, Chromium)
 * - Windows computers & laptops (Chrome, Edge, Firefox)
 * - macOS & MacBooks (Safari, Chrome)
 *
 * Special features:
 * - Preserves original uncorrupted file data and valid extension (.pdf, .jpg, .png, .webp).
 * - Handles CORS seamlessly with intelligent fallback mechanisms.
 * - Detects iOS/iPadOS to provide direct Share / Save-to-Files flow when mobile Safari restricts anchor downloads.
 * - Supports Data URLs, Blob URLs, and Remote HTTPS URLs without failing.
 */

export interface DevicePlatformInfo {
  platform: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Other';
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isSafari: boolean;
  isAndroid: boolean;
  browserName: string;
}

/**
 * Detects the user's operating system, device type, and active browser.
 */
export function getDevicePlatformInfo(): DevicePlatformInfo {
  if (typeof window === 'undefined' || !navigator) {
    return {
      platform: 'Other',
      isMobile: false,
      isTablet: false,
      isIOS: false,
      isSafari: false,
      isAndroid: false,
      browserName: 'Unknown',
    };
  }

  const ua = navigator.userAgent || '';
  const platformStr = (navigator as any).userAgentData?.platform || navigator.platform || '';

  // 1. iOS / iPadOS Detection (including modern iPads reporting as MacIntel with touch points)
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (platformStr === 'MacIntel' && navigator.maxTouchPoints > 1);

  // 2. Android Detection
  const isAndroid = /Android/i.test(ua);

  // 3. Tablet detection
  const isTablet =
    /iPad/i.test(ua) ||
    (platformStr === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua));

  // 4. Mobile detection
  const isMobile = isIOS || isAndroid || /Mobi|Opera Mini/i.test(ua);

  // 5. Operating System classification
  let platform: DevicePlatformInfo['platform'] = 'Other';
  if (isIOS) platform = 'iOS';
  else if (isAndroid) platform = 'Android';
  else if (/Win/i.test(platformStr) || /Windows/i.test(ua)) platform = 'Windows';
  else if (/Mac/i.test(platformStr) || /Macintosh/i.test(ua)) platform = 'macOS';
  else if (/Linux/i.test(platformStr) || /Linux/i.test(ua)) platform = 'Linux';

  // 6. Browser Identification
  let browserName = 'Browser';
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  if (/SamsungBrowser/i.test(ua)) browserName = 'Samsung Internet';
  else if (/Edg/i.test(ua)) browserName = 'Microsoft Edge';
  else if (/Chrome/i.test(ua)) browserName = 'Google Chrome';
  else if (/Firefox/i.test(ua)) browserName = 'Mozilla Firefox';
  else if (isSafari) browserName = 'Safari';

  return {
    platform,
    isMobile,
    isTablet,
    isIOS,
    isSafari,
    isAndroid,
    browserName,
  };
}

/**
 * Ensures a filename has the correct file extension based on mimeType or file format.
 */
export function sanitizeFileName(name: string, fallbackMime?: string): string {
  if (!name || typeof name !== 'string') {
    name = 'ShivComputer_Document';
  }

  // Clean illegal characters for file systems across Windows/Linux/Mac/Android
  let clean = name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim();
  if (!clean) clean = 'Document';

  const extMatch = clean.match(/\.([a-zA-Z0-9]{3,4})$/);

  // If already has known extension, return sanitized
  if (extMatch) {
    const ext = extMatch[1].toLowerCase();
    if (['pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      return clean;
    }
  }

  // Derive extension from mime
  let expectedExt = '.pdf';
  if (fallbackMime) {
    const m = fallbackMime.toLowerCase();
    if (m.includes('jpeg') || m.includes('jpg')) expectedExt = '.jpg';
    else if (m.includes('png')) expectedExt = '.png';
    else if (m.includes('webp')) expectedExt = '.webp';
    else if (m.includes('pdf')) expectedExt = '.pdf';
  }

  return clean + expectedExt;
}

export interface DownloadResult {
  success: boolean;
  method: 'blob-anchor' | 'direct-anchor' | 'ios-open' | 'web-share' | 'fallback-tab';
  message: string;
}

/**
 * Universal download engine that works across Windows, macOS, Linux, Android, and iOS/iPadOS.
 */
export async function downloadDocumentCrossPlatform(options: {
  fileUrl: string;
  fileName: string;
  mimeType?: string;
}): Promise<DownloadResult> {
  const { fileUrl, fileName, mimeType } = options;
  const deviceInfo = getDevicePlatformInfo();
  const cleanName = sanitizeFileName(fileName, mimeType);

  if (!fileUrl) {
    return {
      success: false,
      method: 'fallback-tab',
      message: 'No file URL provided for download.',
    };
  }

  // Case A: Data URL (e.g. data:application/pdf;base64,... or data:image/png;base64,...)
  if (fileUrl.startsWith('data:')) {
    try {
      const byteCharacters = atob(fileUrl.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const inferredMime = fileUrl.split(';')[0].replace('data:', '') || mimeType || 'application/octet-stream';
      const blob = new Blob([byteArray], { type: inferredMime });

      return triggerBlobDownload(blob, cleanName, deviceInfo);
    } catch {
      // Direct anchor click for data URI fallback
      return triggerAnchorDownload(fileUrl, cleanName);
    }
  }

  // Case B: iOS / iPadOS Safari special handling
  // Mobile Safari historically restricts programmatically-clicked <a download> tags on remote blobs,
  // often displaying the file in-browser without a filename or ignoring the download attribute.
  if (deviceInfo.isIOS) {
    // If Web Share API is available and can share files or urls
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        // Try to fetch as blob and share
        try {
          const res = await fetch(fileUrl, { mode: 'cors' });
          if (res.ok) {
            const blob = await res.blob();
            const file = new File([blob], cleanName, { type: blob.type || mimeType || 'application/pdf' });
            if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
              await (navigator as any).share({
                title: cleanName,
                text: 'Official Document - Shiv Computer',
                files: [file],
              });
              return {
                success: true,
                method: 'web-share',
                message: 'Document shared to iOS Share Sheet! You can tap "Save to Files".',
              };
            }
          }
        } catch {
          // ignore web share failure and fall through
        }
      }

      // Reliable iOS Fallback: Open in dedicated tab with user instructions
      const win = window.open(fileUrl, '_blank', 'noopener,noreferrer');
      if (!win) {
        window.location.href = fileUrl;
      }
      return {
        success: true,
        method: 'ios-open',
        message: 'Document opened in a new tab! Tap the Share button (square with arrow) & choose "Save to Files".',
      };
    } catch (e: any) {
      window.open(fileUrl, '_blank');
      return {
        success: true,
        method: 'fallback-tab',
        message: 'Document opened. Save via your browser options.',
      };
    }
  }

  // Case C: Standard Cross-Platform Blob Fetch (Windows, Mac, Linux, Android)
  try {
    const response = await fetch(fileUrl, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const blob = await response.blob();
    return triggerBlobDownload(blob, cleanName, deviceInfo);
  } catch (err: any) {
    console.warn('[DownloadHelper] Blob fetch failed or CORS restricted. Triggering direct anchor fallback:', err);
    // Fallback: Direct Anchor / New window
    return triggerAnchorDownload(fileUrl, cleanName);
  }
}

/**
 * Creates an object URL from blob, triggers download on a hidden <a> tag, and revokes it.
 */
function triggerBlobDownload(
  blob: Blob,
  fileName: string,
  deviceInfo: DevicePlatformInfo
): DownloadResult {
  const blobUrl = window.URL.createObjectURL(blob);

  // If on iOS and not handled by share, open blob directly
  if (deviceInfo.isIOS) {
    const newTab = window.open(blobUrl, '_blank');
    if (!newTab) {
      window.location.href = blobUrl;
    }
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 15000);
    return {
      success: true,
      method: 'ios-open',
      message: 'Document opened. On iPhone/iPad: Tap Share → Save to Files.',
    };
  }

  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = blobUrl;
  link.download = fileName;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke object URL after delay
  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 2000);

  return {
    success: true,
    method: 'blob-anchor',
    message: `Downloading "${fileName}" to your device.`,
  };
}

/**
 * Fallback when direct blob creation isn't permitted or CORS restricts fetch.
 */
function triggerAnchorDownload(url: string, fileName: string): DownloadResult {
  try {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = fileName;
    link.setAttribute('download', fileName);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      success: true,
      method: 'direct-anchor',
      message: `Downloading "${fileName}". Check your downloads bar.`,
    };
  } catch (err) {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = url;
    }
    return {
      success: true,
      method: 'fallback-tab',
      message: 'Opened in a new browser tab for saving.',
    };
  }
}
