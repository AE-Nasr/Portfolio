/*
 * core/config/certifications.ts
 * Author: Ahmed Emad Nasr
 *
 * البيانات دي متاخدة من الـ CV. قبل كده الشهادات كانت موجودة على الموقع
 * كـ 74 صورة كلها بـ alt="Certification" — يعني:
 *
 *  - الـ screen reader بيقول نفس الكلمة 74 مرة.
 *  - جوجل مش عارف إن دي eJPT ودي CCNA ودي RH124.
 *  - ومحدش يقدر يتحقق من أي واحدة فيهم.
 *
 * دلوقتي الشهادات المعروفة ليها بيانات حقيقية (اسم، جهة، سنة)، بتتعرض
 * كقايمة مقروءة فوق حيطة الصور، وبتطلّع JSON-LD من نوع
 * EducationalOccupationalCredential.
 *
 * ⚠️ ناقص حاجتين منك:
 *  1. `verifyUrl` — رابط التحقّق من كل جهة (Credly / INE / Cisco / Red Hat).
 *     ده اللي بيحوّل السطر من ادّعاء لدليل.
 *  2. `galleryIndex` — رقم الصورة المقابلة في image_display/{N}.webp.
 *     مقدرش أعرفه من غير ما أشوف الصور. من غيره الشهادة بتتعرض في القايمة
 *     عادي، بس مش مربوطة بصورتها.
 */

export type Certification = {
  /** معرّف ثابت — بيستخدم كـ key وفي الـ JSON-LD */
  id: string;
  /** اسم الشهادة زي ما هو مكتوب عليها */
  name: string;
  /** الاختصار اللي الناس بتدوّر بيه */
  shortName?: string;
  /** الجهة المانحة */
  issuer: string;
  /** سنة الحصول عليها */
  year: number;
  /** رابط التحقّق من الجهة نفسها */
  verifyUrl?: string;
  /** رقم الصورة في image_display/{N}.webp لو معروف */
  galleryIndex?: number;
};

/** مرتّبة من الأحدث للأقدم — نفس ترتيب الـ CV */
export const certifications: readonly Certification[] = [
  {
    id: "ejpt-v2",
    name: "eLearnSecurity Junior Penetration Tester v2",
    shortName: "eJPT v2",
    issuer: "INE Security",
    year: 2026,
    // verifyUrl: "https://certs.ine.com/…",
  },
  {
    id: "ccep",
    name: "Certified Cybersecurity Educator Professional",
    shortName: "CCEP",
    issuer: "Red Team Leaders",
    year: 2026,
  },
  {
    id: "rh124",
    name: "Red Hat System Administration I (RH124)",
    shortName: "RH124",
    issuer: "Red Hat",
    year: 2026,
  },
  {
    id: "malware-analysis-fundamentals",
    name: "Malware Analysis Fundamentals",
    issuer: "ITI Mahara-Tech",
    year: 2025,
  },
  {
    // من الـ CV — كانت غايبة عن الموقع تماماً.
    id: "thm-soc-l1-l2",
    name: "SOC Level 1 & SOC Level 2 Learning Paths",
    issuer: "TryHackMe",
    year: 2025,
  },
  {
    id: "cti-101",
    name: "Cyber Threat Intelligence 101",
    issuer: "arcX",
    year: 2025,
  },
  {
    id: "ccna",
    name: "Cisco Certified Network Associate (CCNA 200-301)",
    shortName: "CCNA",
    issuer: "Cisco Systems",
    year: 2024,
  },
  {
    id: "hcia-cloud",
    name: "HCIA-Cloud Computing V5.0",
    shortName: "HCIA-Cloud",
    issuer: "Huawei",
    year: 2024,
  },
  {
    id: "hcia-datacom",
    name: "HCIA-Datacom V1.0",
    shortName: "HCIA-Datacom",
    issuer: "Huawei",
    year: 2023,
  },
];

/*
 * العدد الكلي لصور الجاليري.
 *
 * كان 74، والموجود فعلاً في public/…/image_display_thumb/ هو **73**
 * (1.webp لحد 73.webp). يعني الصورة رقم 74 كانت 404 على كل تحميل لقسم
 * الشهادات.
 *
 * لو ضفت صور جديدة، زوّد الرقم ده — وسكربت check:assets هيقولك على طول
 * لو الرقم بقى أكبر من عدد الملفات.
 */
export const GALLERY_IMAGE_COUNT = 73;

/** بحث سريع بالـ galleryIndex عشان مانلفّش على المصفوفة لكل صورة */
const byGalleryIndex = new Map<number, Certification>(
  certifications
    .filter((c): c is Certification & { galleryIndex: number } => c.galleryIndex !== undefined)
    .map((c) => [c.galleryIndex, c]),
);

/**
 * النص البديل لصورة الجاليري رقم `index`.
 *
 * لو الصورة مربوطة بشهادة معروفة:
 *   "eJPT v2 certificate issued by INE Security"
 * لو لأ:
 *   "Certificate 12 of 74" — مش مثالي، بس كل صورة بقى ليها هوية مختلفة
 *   بدل 74 نسخة من نفس الجملة.
 */
export const certificationAlt = (index: number): string => {
  const cert = byGalleryIndex.get(index);
  if (!cert) return `Certificate ${index} of ${GALLERY_IMAGE_COUNT}`;
  return `${cert.shortName ?? cert.name} certificate issued by ${cert.issuer}`;
};

/**
 * JSON-LD لكل شهادة. جوجل بيستخدم النوع ده في نتايج البحث الخاصة
 * بالمؤهلات، والـ CV parsers بتقراه.
 */
export const certificationsJsonLd = (personId: string) =>
  certifications.map((cert) => ({
    "@type": "EducationalOccupationalCredential",
    name: cert.name,
    credentialCategory: "certification",
    educationalLevel: "professional",
    dateCreated: String(cert.year),
    recognizedBy: { "@type": "Organization", name: cert.issuer },
    ...(cert.verifyUrl ? { url: cert.verifyUrl } : {}),
    about: { "@id": personId },
  }));
