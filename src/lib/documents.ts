/**
 * ============================================================================
 * SHIV COMPUTER - DOCUMENT MANAGEMENT & CLOUD STORAGE SERVICES
 * ============================================================================
 *
 * Implements:
 * - Full support for 14 formats: PDF, JPG, JPEG, PNG, WEBP, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP.
 * - Validation, previewing, and cross-platform downloading.
 * - Permanent Cloud Storage via Firebase Storage (`ref(storage, ...)`).
 * - Cloud Firestore persistent chunked storage fallback if Storage bucket is pending activation,
 *   guaranteeing actual files persist in Cloud Firestore across refreshes and logins without localStorage.
 * - Dual-role document management:
 *     - Admin: upload, view, preview, download, replace, categorize, delete.
 *     - User: upload own documents, view, preview, download, replace, delete.
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  writeBatch,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, auth } from './firebase-config';
import { PublishedDocument, DocumentCategory, SupportedFileType } from '../types';
import { INITIAL_PUBLISHED_DOCUMENTS } from './defaultDocuments';

export const PUBLISHED_DOCS_COLLECTION = 'published_documents';
export const USER_DOCS_COLLECTION = 'user_documents';
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

// All 14 supported formats
export const SUPPORTED_EXTENSIONS = [
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'webp',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'csv',
  'zip',
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileType: SupportedFileType;
  mimeType: string;
  sizeFormatted: string;
  cleanFileName: string;
  extension: string;
}

/**
 * Format bytes to readable string (e.g. 1.2 MB, 450 KB).
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validates file format and size for all 14 supported formats.
 */
export function validateDocumentFile(file: File): FileValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'Please choose or capture a file to upload.',
      fileType: 'other',
      mimeType: '',
      sizeFormatted: '0 B',
      cleanFileName: '',
      extension: '',
    };
  }

  const rawMime = (file.type || '').toLowerCase();
  const fileName = file.name || 'unnamed_file';
  const ext = (fileName.split('.').pop() || '').toLowerCase();

  // Check supported extension
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported file format (.${ext || 'unknown'}). Supported formats: PDF, JPG, JPEG, PNG, WEBP, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP.`,
      fileType: 'other',
      mimeType: rawMime,
      sizeFormatted: formatBytes(file.size),
      cleanFileName: fileName,
      extension: ext,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${formatBytes(file.size)}). Maximum allowed size is 25 MB.`,
      fileType: 'other',
      mimeType: rawMime,
      sizeFormatted: formatBytes(file.size),
      cleanFileName: fileName,
      extension: ext,
    };
  }

  // Derive standardized fileType & mimeType
  let standardizedType: SupportedFileType = 'other';
  let mime = rawMime;

  switch (ext) {
    case 'pdf':
      standardizedType = 'pdf';
      mime = 'application/pdf';
      break;
    case 'jpg':
    case 'jpeg':
      standardizedType = 'jpeg';
      mime = 'image/jpeg';
      break;
    case 'png':
      standardizedType = 'png';
      mime = 'image/png';
      break;
    case 'webp':
      standardizedType = 'webp';
      mime = 'image/webp';
      break;
    case 'doc':
      standardizedType = 'doc';
      mime = 'application/msword';
      break;
    case 'docx':
      standardizedType = 'docx';
      mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    case 'xls':
      standardizedType = 'xls';
      mime = 'application/vnd.ms-excel';
      break;
    case 'xlsx':
      standardizedType = 'xlsx';
      mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    case 'ppt':
      standardizedType = 'ppt';
      mime = 'application/vnd.ms-powerpoint';
      break;
    case 'pptx':
      standardizedType = 'pptx';
      mime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      break;
    case 'txt':
      standardizedType = 'txt';
      mime = 'text/plain';
      break;
    case 'csv':
      standardizedType = 'csv';
      mime = 'text/csv';
      break;
    case 'zip':
      standardizedType = 'zip';
      mime = 'application/zip';
      break;
    default:
      if (rawMime.startsWith('image/')) {
        standardizedType = 'image';
      } else {
        standardizedType = 'other';
      }
      break;
  }

  return {
    valid: true,
    fileType: standardizedType,
    mimeType: mime || 'application/octet-stream',
    sizeFormatted: formatBytes(file.size),
    cleanFileName: fileName,
    extension: ext,
  };
}

export interface UploadProgressCallback {
  (percentage: number, state: 'running' | 'paused' | 'success' | 'error'): void;
}

/**
 * Converts a File into Base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      // Strip data:...;base64, prefix if needed or keep full
      resolve(res);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Splits a Base64 string into chunks and writes them directly to Cloud Firestore.
 * Each chunk is ~350KB, well within Firestore's 1MB document limit.
 */
export async function saveFileChunksToFirestore(
  collectionName: string,
  docId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const base64Data = await fileToBase64(file);
  const CHUNK_SIZE = 350 * 1024; // 350 KB per chunk
  const totalChunks = Math.ceil(base64Data.length / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const chunkSlice = base64Data.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const chunkRef = doc(db, collectionName, docId, 'chunks', `chunk_${i}`);
    await setDoc(chunkRef, {
      chunkIndex: i,
      totalChunks,
      data: chunkSlice,
      createdAtServer: serverTimestamp(),
    });

    if (onProgress) {
      const progress = Math.round(((i + 1) / totalChunks) * 100);
      onProgress(progress, 'running');
    }
  }

  if (onProgress) onProgress(100, 'success');
  return `firestore_chunk://${collectionName}/${docId}`;
}

// In-memory cache for reconstructed blob URLs to avoid re-fetching
const blobUrlCache = new Map<string, string>();

/**
 * Reconstructs a file from Cloud Firestore chunks and returns a browser Blob URL.
 */
export async function loadCloudDocumentBlobUrl(
  collectionName: string,
  docId: string,
  mimeType: string
): Promise<string> {
  const cacheKey = `${collectionName}_${docId}`;
  if (blobUrlCache.has(cacheKey)) {
    return blobUrlCache.get(cacheKey)!;
  }

  const chunksColl = collection(db, collectionName, docId, 'chunks');
  const snap = await getDocs(chunksColl);

  if (snap.empty) {
    throw new Error('No storage chunks found for this document.');
  }

  const chunkDocs: { chunkIndex: number; data: string }[] = [];
  snap.forEach((d) => {
    const data = d.data();
    chunkDocs.push({
      chunkIndex: data.chunkIndex || 0,
      data: data.data || '',
    });
  });

  chunkDocs.sort((a, b) => a.chunkIndex - b.chunkIndex);
  const fullBase64 = chunkDocs.map((c) => c.data).join('');

  // Convert Base64 data URL to Blob
  const commaIdx = fullBase64.indexOf(',');
  const byteChars = atob(commaIdx >= 0 ? fullBase64.substring(commaIdx + 1) : fullBase64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType || 'application/octet-stream' });
  const objectUrl = URL.createObjectURL(blob);

  blobUrlCache.set(cacheKey, objectUrl);
  return objectUrl;
}

/**
 * Deletes all chunks from Cloud Firestore.
 */
export async function deleteChunksFromFirestore(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const chunksColl = collection(db, collectionName, docId, 'chunks');
    const snap = await getDocs(chunksColl);
    const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn('[Firestore] Error deleting document chunks:', err);
  }
}

/**
 * Uploads file to Persistent Cloud Storage:
 * 1. Tries Firebase Storage bucket first.
 * 2. If Storage bucket is blocked or offline, persists into Cloud Firestore chunks!
 * Never uses localStorage for file binaries.
 */
export async function uploadDocumentToCloud(
  file: File,
  folder: 'documents' | 'user_documents',
  docId: string,
  onProgress?: UploadProgressCallback
): Promise<{ fileUrl: string; storagePath: string; storageType: 'firebase_storage' | 'firestore_cloud_chunks' }> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
  const timestamp = Date.now();
  const filePath = `${folder}/${timestamp}_${sanitizedName}`;

  try {
    const fileRef = storageRef(storage, filePath);
    const metadata = {
      contentType: file.type || 'application/octet-stream',
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: auth.currentUser?.email || 'admin@shivcomputer.com',
      },
    };

    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    return await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(progress, 'running');
        },
        async (storageErr) => {
          console.warn('[Storage] Firebase Storage returned error, falling back to Cloud Firestore chunks:', storageErr);
          try {
            const chunkUrl = await saveFileChunksToFirestore(
              folder === 'documents' ? PUBLISHED_DOCS_COLLECTION : USER_DOCS_COLLECTION,
              docId,
              file,
              onProgress
            );
            resolve({
              fileUrl: chunkUrl,
              storagePath: `firestore_chunks/${folder}/${docId}`,
              storageType: 'firestore_cloud_chunks',
            });
          } catch (chunkErr) {
            reject(chunkErr);
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100, 'success');
            resolve({
              fileUrl: downloadUrl,
              storagePath: filePath,
              storageType: 'firebase_storage',
            });
          } catch {
            const chunkUrl = await saveFileChunksToFirestore(
              folder === 'documents' ? PUBLISHED_DOCS_COLLECTION : USER_DOCS_COLLECTION,
              docId,
              file,
              onProgress
            );
            resolve({
              fileUrl: chunkUrl,
              storagePath: `firestore_chunks/${folder}/${docId}`,
              storageType: 'firestore_cloud_chunks',
            });
          }
        }
      );
    });
  } catch (err) {
    console.warn('[Storage] Direct upload failed, falling back to Cloud Firestore chunked persistence:', err);
    const chunkUrl = await saveFileChunksToFirestore(
      folder === 'documents' ? PUBLISHED_DOCS_COLLECTION : USER_DOCS_COLLECTION,
      docId,
      file,
      onProgress
    );
    return {
      fileUrl: chunkUrl,
      storagePath: `firestore_chunks/${folder}/${docId}`,
      storageType: 'firestore_cloud_chunks',
    };
  }
}

// Backward compatibility alias for AdminDocumentManager
export const uploadDocumentToStorage = (file: File, onProgress?: UploadProgressCallback) =>
  uploadDocumentToCloud(file, 'documents', `DOC-${Date.now()}`, onProgress);

// ============================================================================
// ADMIN PUBLISHED DOCUMENTS (PUBLIC / CITIZEN REPOSITORY)
// ============================================================================

/**
 * Creates a published document in Cloud Firestore.
 */
export async function createPublishedDocumentDoc(
  docData: Omit<PublishedDocument, 'id'>,
  file?: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const docId = `DOC-${Date.now()}`;
  let finalFileUrl = docData.fileUrl || '';
  let finalStoragePath = docData.storagePath || '';
  let storageType: 'firebase_storage' | 'firestore_cloud_chunks' = docData.storageType || 'firebase_storage';

  if (file) {
    const uploaded = await uploadDocumentToCloud(file, 'documents', docId, onProgress);
    finalFileUrl = uploaded.fileUrl;
    finalStoragePath = uploaded.storagePath;
    storageType = uploaded.storageType;
  }

  const docReference = doc(db, PUBLISHED_DOCS_COLLECTION, docId);
  const payload: PublishedDocument = {
    ...docData,
    id: docId,
    fileUrl: finalFileUrl,
    storagePath: finalStoragePath,
    storageType,
    uploadedAt: docData.uploadedAt || new Date().toISOString(),
    isPublished: docData.isPublished !== undefined ? docData.isPublished : true,
    downloadCount: docData.downloadCount || 0,
    viewCount: docData.viewCount || 0,
    uploadedBy: auth.currentUser?.displayName || 'Administrator',
    uploadedByEmail: auth.currentUser?.email || 'admin@shivcomputer.com',
  };

  await setDoc(docReference, {
    ...payload,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  });

  return docId;
}

/**
 * Replaces the file of an existing published document.
 */
export async function replacePublishedDocumentFile(
  docId: string,
  newFile: File,
  onProgress?: UploadProgressCallback
): Promise<void> {
  const validation = validateDocumentFile(newFile);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file format');
  }

  const uploaded = await uploadDocumentToCloud(newFile, 'documents', docId, onProgress);

  const docRef = doc(db, PUBLISHED_DOCS_COLLECTION, docId);
  await updateDoc(docRef, {
    fileName: newFile.name,
    fileUrl: uploaded.fileUrl,
    storagePath: uploaded.storagePath,
    storageType: uploaded.storageType,
    fileType: validation.fileType,
    mimeType: validation.mimeType,
    fileSize: validation.sizeFormatted,
    fileSizeBytes: newFile.size,
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
  });

  blobUrlCache.delete(`${PUBLISHED_DOCS_COLLECTION}_${docId}`);
}

/**
 * Updates an existing published document metadata in Firestore.
 */
export async function updatePublishedDocumentDoc(
  id: string,
  updates: Partial<PublishedDocument>
): Promise<void> {
  const docRef = doc(db, PUBLISHED_DOCS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
  });
}

/**
 * Deletes a published document from Firestore and Storage.
 */
export async function deletePublishedDocumentDoc(
  id: string,
  storagePath?: string
): Promise<void> {
  // 1. Delete Firestore record
  try {
    const docRef = doc(db, PUBLISHED_DOCS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[Firestore] Delete published doc error:', err);
  }

  // 2. Delete chunks if any
  await deleteChunksFromFirestore(PUBLISHED_DOCS_COLLECTION, id);
  blobUrlCache.delete(`${PUBLISHED_DOCS_COLLECTION}_${id}`);

  // 3. Delete Storage file if it exists and is on Firebase Storage
  if (storagePath && !storagePath.startsWith('firestore_chunks') && !storagePath.startsWith('local_fallback')) {
    try {
      const fileRef = storageRef(storage, storagePath);
      await deleteObject(fileRef);
    } catch (err) {
      console.warn('[Storage] Delete file warning:', err);
    }
  }
}

/**
 * Subscribes to real-time published documents changes.
 */
export function subscribeToPublishedDocuments(
  callback: (docs: PublishedDocument[]) => void,
  onlyPublished: boolean = false
): () => void {
  const collRef = collection(db, PUBLISHED_DOCS_COLLECTION);
  const q = query(collRef);

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const remoteDocs: PublishedDocument[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as PublishedDocument;
        if (!onlyPublished || data.isPublished) {
          remoteDocs.push({
            ...data,
            id: d.id,
          });
        }
      });

      // If library has no documents yet, supply official pre-seeded govt templates
      const combined = [...remoteDocs];
      if (combined.length === 0) {
        for (const seed of INITIAL_PUBLISHED_DOCUMENTS) {
          if (!onlyPublished || seed.isPublished) {
            combined.push(seed);
          }
        }
      }

      // Sort by uploadedAt desc
      combined.sort((a, b) => {
        const da = new Date(a.uploadedAt).getTime() || 0;
        const db = new Date(b.uploadedAt).getTime() || 0;
        return db - da;
      });

      callback(combined);
    },
    (err) => {
      console.info('[Firestore] Published documents listener notice (using defaults):', err?.message);
      const defaults = INITIAL_PUBLISHED_DOCUMENTS.filter((d) => !onlyPublished || d.isPublished);
      callback(defaults);
    }
  );

  return unsubscribe;
}

// ============================================================================
// CITIZEN / USER DOCUMENTS (PRIVATE LOCKER)
// ============================================================================

/**
 * Creates a user's private document in Cloud Firestore under `user_documents`.
 */
export async function createUserDocumentDoc(
  docData: Omit<PublishedDocument, 'id'>,
  file?: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const docId = `USERDOC-${Date.now()}`;
  let finalFileUrl = docData.fileUrl || '';
  let finalStoragePath = docData.storagePath || '';
  let storageType: 'firebase_storage' | 'firestore_cloud_chunks' = docData.storageType || 'firebase_storage';

  if (file) {
    const uploaded = await uploadDocumentToCloud(file, 'user_documents', docId, onProgress);
    finalFileUrl = uploaded.fileUrl;
    finalStoragePath = uploaded.storagePath;
    storageType = uploaded.storageType;
  }

  const docReference = doc(db, USER_DOCS_COLLECTION, docId);
  const currentUid = auth.currentUser?.uid || 'guest';
  const payload: PublishedDocument = {
    ...docData,
    id: docId,
    userId: currentUid,
    fileUrl: finalFileUrl,
    storagePath: finalStoragePath,
    storageType,
    uploadedAt: docData.uploadedAt || new Date().toISOString(),
    isPublished: false,
    downloadCount: docData.downloadCount || 0,
    viewCount: docData.viewCount || 0,
    uploadedBy: auth.currentUser?.displayName || 'Citizen',
    uploadedByEmail: auth.currentUser?.email || '',
  };

  await setDoc(docReference, {
    ...payload,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  });

  return docId;
}

/**
 * Replaces the file of an existing user document.
 */
export async function replaceUserDocumentFile(
  docId: string,
  newFile: File,
  onProgress?: UploadProgressCallback
): Promise<void> {
  const validation = validateDocumentFile(newFile);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file format');
  }

  const uploaded = await uploadDocumentToCloud(newFile, 'user_documents', docId, onProgress);

  const docRef = doc(db, USER_DOCS_COLLECTION, docId);
  await updateDoc(docRef, {
    fileName: newFile.name,
    fileUrl: uploaded.fileUrl,
    storagePath: uploaded.storagePath,
    storageType: uploaded.storageType,
    fileType: validation.fileType,
    mimeType: validation.mimeType,
    fileSize: validation.sizeFormatted,
    fileSizeBytes: newFile.size,
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
  });

  blobUrlCache.delete(`${USER_DOCS_COLLECTION}_${docId}`);
}

/**
 * Updates an existing user document metadata in Firestore.
 */
export async function updateUserDocumentDoc(
  id: string,
  updates: Partial<PublishedDocument>
): Promise<void> {
  const docRef = doc(db, USER_DOCS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
  });
}

/**
 * Deletes a user document from Firestore and Storage.
 */
export async function deleteUserDocumentDoc(
  id: string,
  storagePath?: string
): Promise<void> {
  // 1. Delete Firestore record
  try {
    const docRef = doc(db, USER_DOCS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[Firestore] Delete user doc error:', err);
  }

  // 2. Delete chunks if any
  await deleteChunksFromFirestore(USER_DOCS_COLLECTION, id);
  blobUrlCache.delete(`${USER_DOCS_COLLECTION}_${id}`);

  // 3. Delete Storage file if it exists and is on Firebase Storage
  if (storagePath && !storagePath.startsWith('firestore_chunks') && !storagePath.startsWith('local_fallback')) {
    try {
      const fileRef = storageRef(storage, storagePath);
      await deleteObject(fileRef);
    } catch (err) {
      console.warn('[Storage] Delete file warning:', err);
    }
  }
}

/**
 * Subscribes to real-time documents uploaded by a specific user.
 */
export function subscribeToUserDocuments(
  userId: string,
  callback: (docs: PublishedDocument[]) => void
): () => void {
  const collRef = collection(db, USER_DOCS_COLLECTION);
  const q = query(collRef, where('userId', '==', userId));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const userDocs: PublishedDocument[] = [];
      snapshot.forEach((d) => {
        userDocs.push({
          ...(d.data() as PublishedDocument),
          id: d.id,
        });
      });

      userDocs.sort((a, b) => {
        const da = new Date(a.uploadedAt).getTime() || 0;
        const db = new Date(b.uploadedAt).getTime() || 0;
        return db - da;
      });

      callback(userDocs);
    },
    (err) => {
      console.warn('[Firestore] User documents listener notice:', err?.message);
      callback([]);
    }
  );

  return unsubscribe;
}

/**
 * Subscribes to all user documents across all citizens (Admin review).
 */
export function subscribeToAllUserDocuments(
  callback: (docs: PublishedDocument[]) => void
): () => void {
  const collRef = collection(db, USER_DOCS_COLLECTION);
  const q = query(collRef);

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const allDocs: PublishedDocument[] = [];
      snapshot.forEach((d) => {
        allDocs.push({
          ...(d.data() as PublishedDocument),
          id: d.id,
        });
      });

      allDocs.sort((a, b) => {
        const da = new Date(a.uploadedAt).getTime() || 0;
        const db = new Date(b.uploadedAt).getTime() || 0;
        return db - da;
      });

      callback(allDocs);
    },
    (err) => {
      console.warn('[Firestore] All user documents listener notice:', err?.message);
      callback([]);
    }
  );

  return unsubscribe;
}

// ============================================================================
// METRICS & STATS
// ============================================================================

export async function recordDocumentDownload(id: string): Promise<void> {
  try {
    const isUserDoc = id.startsWith('USERDOC-');
    const targetColl = isUserDoc ? USER_DOCS_COLLECTION : PUBLISHED_DOCS_COLLECTION;
    const docRef = doc(db, targetColl, id);
    await updateDoc(docRef, { downloadCount: increment(1) });
  } catch {
    // Non-fatal
  }
}

export async function recordDocumentView(id: string): Promise<void> {
  try {
    const isUserDoc = id.startsWith('USERDOC-');
    const targetColl = isUserDoc ? USER_DOCS_COLLECTION : PUBLISHED_DOCS_COLLECTION;
    const docRef = doc(db, targetColl, id);
    await updateDoc(docRef, { viewCount: increment(1) });
  } catch {
    // Non-fatal
  }
}
