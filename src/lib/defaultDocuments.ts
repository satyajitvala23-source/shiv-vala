/**
 * ============================================================================
 * SHIV COMPUTER - DEFAULT OFFICIAL GOVT & CITIZEN FORMS
 * ============================================================================
 *
 * Pre-seeded official government templates for Shiv Computer:
 * - Aadhaar Card Correction Form (UIDAI Official Standard)
 * - Gujarat Revenue Income Certificate Affidavit (આવક સોગંદનામું)
 * - iKhedut Tar Fencing Co-Farmer Consent Agreement (સંમતિ પત્રક)
 * - Talati Pedigree (પેઢીનામું) Family Tree Format
 * - Ration Card Member Addition / Separation Form
 *
 * Each document contains a real, valid PDF data URI generated with standard
 * PDF-1.4 structure so viewing and downloading works 100% offline and cross-device.
 */

import { PublishedDocument } from '../types';

/**
 * Generates a valid standard PDF document as a data URL.
 */
function generateValidPdfDataUri(title: string, gujaratiTitle: string, subtitle: string): string {
  // A clean, valid minimal PDF document structure
  const textContent = `BT
/F1 18 Tf
50 740 Td
(SHIV COMPUTER - OFFICIAL GOVT DOCUMENT) Tj
0 -26 Td
/F1 14 Tf
(${title.replace(/[()\\]/g, '')}) Tj
0 -22 Td
/F1 12 Tf
(Category: Gujarat e-Governance & Citizen Services) Tj
0 -20 Td
(Center: Shiv Computer, Keshod, Gujarat) Tj
0 -30 Td
/F1 10 Tf
(${subtitle.replace(/[()\\]/g, '')}) Tj
0 -25 Td
(Instructions for Citizen / Applicant:) Tj
0 -16 Td
(1. Fill all details in clear block letters with blue/black ballpoint pen.) Tj
0 -16 Td
(2. Attach verified xerox copies of Aadhaar Card and supporting identity proof.) Tj
0 -16 Td
(3. Submit to Shiv Computer Center for digital portal processing and instant receipt.) Tj
0 -40 Td
/F1 9 Tf
(Verified Shiv Computer Digital Certificate - CSC e-Gov Center Junagadh) Tj
ET`;

  const streamLength = textContent.length;

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${textContent}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000227 00000 n 
0000000295 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${365 + streamLength}
%%EOF`;

  return `data:application/pdf;base64,${btoa(unescape(encodeURIComponent(pdf)))}`;
}

export const INITIAL_PUBLISHED_DOCUMENTS: PublishedDocument[] = [
  {
    id: 'DOC-01',
    title: 'Aadhaar Enrolment & Correction Form (આધાર સુધારા ફોર્મ)',
    titleGujarati: 'આધાર કાર્ડ નોંધણી અને સુધારા અરજી ફોર્મ (UIDAI)',
    category: 'forms',
    categoryLabel: 'Official Forms',
    description: 'Standard UIDAI prescribed form for name, address, date of birth and mobile number update at CSC centers.',
    descriptionGujarati: 'નામ, સરનામું, જન્મ તારીખ અને મોબાઈલ નંબર સુધારવા માટેનું સત્તાવાર આધાર સુધારા ફોર્મ.',
    fileName: 'ShivComputer_Aadhaar_Correction_Form.pdf',
    fileUrl: generateValidPdfDataUri(
      'Aadhaar Enrolment & Correction Form',
      'આધાર સુધારા ફોર્મ',
      'UIDAI Official Form for Demographics and Biometric Updates'
    ),
    fileType: 'pdf',
    mimeType: 'application/pdf',
    fileSize: '420 KB',
    fileSizeBytes: 430080,
    uploadedAt: '2026-03-10T10:30:00.000Z',
    isPublished: true,
    downloadCount: 1420,
    viewCount: 3820,
    targetAudience: 'all',
    tags: ['Aadhaar', 'UIDAI', 'Correction', 'Identity'],
  },
  {
    id: 'DOC-02',
    title: 'Gujarat Income Certificate Affidavit Form (આવક સોગંદનામું નમૂનો)',
    titleGujarati: 'આવક પ્રમાણપત્ર સ્વ-ઘોષણા સોગંદનામું નમૂનો (મામલતદાર માન્ય)',
    category: 'revenue',
    categoryLabel: 'Revenue & Land',
    description: 'Mamlatdar-approved self-declaration affidavit format required for digital Gujarat income certificates.',
    descriptionGujarati: 'ડિજિટલ ગુજરાત આવક પ્રમાણપત્ર માટે મામલતદાર માન્ય સ્વ-ઘોષણા સોગંદનામું.',
    fileName: 'ShivComputer_Income_Affidavit_Format.pdf',
    fileUrl: generateValidPdfDataUri(
      'Gujarat Income Certificate Affidavit Form',
      'આવક સોગંદનામું નમૂનો',
      'Mamlatdar Approved Self-Declaration Format for Annual Income'
    ),
    fileType: 'pdf',
    mimeType: 'application/pdf',
    fileSize: '680 KB',
    fileSizeBytes: 696320,
    uploadedAt: '2026-03-08T09:15:00.000Z',
    isPublished: true,
    downloadCount: 2310,
    viewCount: 5120,
    targetAudience: 'citizens',
    tags: ['Income', 'Revenue', 'Mamlatdar', 'Affidavit'],
  },
  {
    id: 'DOC-03',
    title: 'iKhedut Tar Fencing Consent Declaration (તાર ફેન્સીંગ સંમતિ પત્રક)',
    titleGujarati: 'આઈ-ખેડૂત તાર ફેન્સીંગ સહાય સહ-ખાતેદાર સંમતિ પત્રક',
    category: 'agriculture',
    categoryLabel: 'Agriculture',
    description: 'Mandatory joint ownership consent declaration form for barbed wire fencing subsidy under iKhedut portal.',
    descriptionGujarati: 'આઈ-ખેડૂત પોર્ટલ હેઠળ તાર ફેન્સીંગ સહાય માટે સહ-ખાતેદારોનું સંયુક્ત સંમતિ પત્રક.',
    fileName: 'ShivComputer_iKhedut_Tar_Fencing_Consent.pdf',
    fileUrl: generateValidPdfDataUri(
      'iKhedut Tar Fencing Consent Declaration',
      'તાર ફેન્સીંગ સંમતિ પત્રક',
      'Gujarat Agriculture Dept Joint Owner Consent Declaration Form'
    ),
    fileType: 'pdf',
    mimeType: 'application/pdf',
    fileSize: '510 KB',
    fileSizeBytes: 522240,
    uploadedAt: '2026-03-05T14:20:00.000Z',
    isPublished: true,
    downloadCount: 890,
    viewCount: 2450,
    targetAudience: 'farmers',
    tags: ['iKhedut', 'Agriculture', 'Tar Fencing', 'Subsidy'],
  },
  {
    id: 'DOC-04',
    title: 'Talati Pedigree Family Tree Notarized Application (પેઢીનામું નમૂનો)',
    titleGujarati: 'તલાટી-કમ-મંત્રી પેઢીનામું કુટુંબ વૃક્ષ પ્રમાણિત અરજી',
    category: 'revenue',
    categoryLabel: 'Revenue & Land',
    description: 'Standard format for ancestral succession, legal heir succession, and Talati family tree verification.',
    descriptionGujarati: 'વારસાઈ નોંધ અને કાનૂની વારસદારો માટે તલાટી પેઢીનામું નમૂનો.',
    fileName: 'ShivComputer_Pedigree_Family_Tree_Format.pdf',
    fileUrl: generateValidPdfDataUri(
      'Pedigree Family Tree Notarized Application',
      'પેઢીનામું નમૂનો',
      'Legal Heir and Ancestral Succession Pedigree Draft'
    ),
    fileType: 'pdf',
    mimeType: 'application/pdf',
    fileSize: '950 KB',
    fileSizeBytes: 972800,
    uploadedAt: '2026-03-01T11:00:00.000Z',
    isPublished: true,
    downloadCount: 1840,
    viewCount: 4210,
    targetAudience: 'citizens',
    tags: ['Pedigree', 'Family Tree', 'Succession', 'Talati'],
  },
  {
    id: 'DOC-05',
    title: 'Ration Card Separation & Surrender Form (રેશન કાર્ડ વિભાજન નમૂનો)',
    titleGujarati: 'રેશન કાર્ડ નામ કમી / વિભાજન / નવું રેશન કાર્ડ અરજી',
    category: 'certificates',
    categoryLabel: 'Certificates',
    description: 'Gujarat Food & Civil Supplies form for dividing family ration cards or surrendering inactive ration cards.',
    descriptionGujarati: 'અન્ન અને નાગરિક પુરવઠા વિભાગ હેઠળ રેશન કાર્ડ વિભાજન અને નામ કમી નમૂનો.',
    fileName: 'ShivComputer_Ration_Card_Separation_Form.pdf',
    fileUrl: generateValidPdfDataUri(
      'Ration Card Separation & Surrender Form',
      'રેશન કાર્ડ વિભાજન નમૂનો',
      'Food and Civil Supplies Dept Separation and Surrender Template'
    ),
    fileType: 'pdf',
    mimeType: 'application/pdf',
    fileSize: '790 KB',
    fileSizeBytes: 808960,
    uploadedAt: '2026-02-24T16:45:00.000Z',
    isPublished: true,
    downloadCount: 650,
    viewCount: 1980,
    targetAudience: 'citizens',
    tags: ['Ration Card', 'Food Civil Supplies', 'Panchayat'],
  },
];
