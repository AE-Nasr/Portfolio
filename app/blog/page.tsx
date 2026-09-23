import type { Metadata } from "next";
import BlogPageClient from "./page-client";
// Server Component: بيقرا مكتبة الـ cases وقت الـ build. بيتبعت كـ prop
// عشان page-client (client component) ماستوردهوش ويجرّ الداتا للمتصفح.
import StartHere from "./components/StartHere";
import { caseEvidenceLibrary, caseScreenshotsByEvidenceId } from "@/app/core/config/cases";
import type { PdfResource } from "./blog-types";
import type { Facet } from "./components/BlogFilterBar";

const SITE_BASE_URL = "https://ae-nasr.github.io/Portfolio";

const toAbsoluteAssetUrl = (href: string): string => {
  if (/^https?:\/\//i.test(href)) return href;
  const normalized = href.startsWith("/") ? href : `/${href}`;
  return `${SITE_BASE_URL}${normalized}`;
};

const pdfResources = [
  {
    id: "soc-analyst-cv",
    title: "Ahmed Emad SOC Analyst CV",
    type: "PDF CV",
    href: "Assets/cv/AhmedEmadNasr_CV.pdf",
  },
  ...caseEvidenceLibrary,
];

/*
 * ─── فلاتر البلوج، محسوبة هنا مرة واحدة وقت الـ build ────────────────────
 *
 * كانت الحسابات دي (blogPdfResources, SEARCH_INDEX, الفلاتر، الترتيب،
 * وحارس CASE_IDS) بتتنفّذ جوه page-client.tsx — يعني في متصفح كل زائر مع
 * كل تحميل صفحة. المكتبة 38 عنصر بس فالتكلفة كانت صغيرة أصلاً، لكن نقلها
 * هنا معناه:
 *   1. حارس CASE_IDS (لو حد ضاف case من غير صفحة تفاصيل) بيوقّف الـ build
 *      لو الداتا غلط، بدل ما يرمي error في متصفح الزائر بعد النشر.
 *   2. الكود اللي بيحسب دول (helper functions زي countValues) مبيتبعتش
 *      للمتصفح خالص.
 *
 * الحجم الفعلي اللي بيوصل للمتصفح ما بيتغيرش: BlogCard بيعرض كل حقول الـ
 * case (title, description, tags, tools...) لكل الـ 38 كارت، فالنص نفسه
 * لازم يوصل في الحالتين. اللي اتغيّر هو مكان الحساب بس، مش حجم الداتا.
 */
const wannacryId = "malware-analysis-wannacry";
const wannacryCase = caseEvidenceLibrary.find((item) => item.id === wannacryId);

const cvResource: PdfResource = {
  id: "soc-analyst-cv",
  title: "Ahmed Emad Nasr SOC & Cybersecurity Analyst CV",
  platform: "Professional Profile",
  type: "PDF CV",
  href: "Assets/cv/AhmedEmadNasr_CV.pdf",
  detailHref: "/cv",
};

const blogPdfResources: PdfResource[] = wannacryCase
  ? [cvResource, wannacryCase, ...caseEvidenceLibrary.filter((item) => item.id !== wannacryId)]
  : [cvResource, ...caseEvidenceLibrary];

/*
 * حارس: أي عنصر في المكتبة لازم يكون ليه صفحة تفاصيل موجودة فعلاً — يا إما
 * لأنه case (والـ id بتاعه في caseEvidenceLibrary) يا إما لأنه محدد
 * detailHref بنفسه. دلوقتي بيتنفّذ وقت الـ build، فلو حد ضاف case ناقصها
 * الـ build نفسه بيفشل بدل ما يوصل لينك 404 صامت للموقع المنشور.
 */
const CASE_IDS = new Set(caseEvidenceLibrary.map((item) => item.id));
for (const item of blogPdfResources) {
  if (!item.detailHref && !CASE_IDS.has(item.id)) {
    throw new Error(
      `[blog] "${item.id}" is in the library but has no generated case page. ` +
      `Either add it to caseEvidenceLibrary, or give it an explicit detailHref.`,
    );
  }
}

const PDF_DATE_MS: Record<string, number> = Object.fromEntries(
  blogPdfResources.map((item) => [item.id, item.date ? new Date(item.date).getTime() : 0]),
);

// كل الكلام اللي ممكن حد يدوّر بيه على case واحدة، متجمّع في نص واحد
// lowercase مرة واحدة وقت الـ build. البحث في المتصفح بعد كده مجرد
// includes() على النص الجاهز ده.
const SEARCH_INDEX: Record<string, string> = Object.fromEntries(
  blogPdfResources.map((item) => [
    item.id,
    [
      item.title,
      item.description,
      item.platform,
      item.type,
      item.category,
      item.difficulty,
      ...(item.tags ?? []),
      ...(item.tools ?? []),
      ...(item.skillsGained ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  ]),
);

/** عدّاد بسيط بيرجّع القيم مرتبة بالأكتر ظهوراً */
const countValues = (values: (string | undefined)[]): Facet[] => {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
};

const CATEGORY_FACETS = countValues(caseEvidenceLibrary.map((item) => item.category));

// الأدوات كتير، فبناخد الأشهر بس — قايمة chips طويلة أوي بتبقى ضوضا مش فلترة
const TOOL_FACETS = countValues(
  caseEvidenceLibrary.flatMap((item) => [...(item.tools ?? [])]),
).slice(0, 12);

// الترتيب الافتراضي (CV، الحالة المميزة، بعدين الأحدث وباللي معاه صور
// الأول) ثابت وما بيتغيّرش مع تفاعل الزائر، فمحسوب هنا مرة واحدة.
const sortedPdfs: PdfResource[] = [...blogPdfResources].sort((a, b) => {
  if (a.id === cvResource.id) return -1;
  if (b.id === cvResource.id) return 1;
  if (a.id === wannacryId) return -1;
  if (b.id === wannacryId) return 1;

  const aShots = (caseScreenshotsByEvidenceId[a.id] ?? []).length > 0;
  const bShots = (caseScreenshotsByEvidenceId[b.id] ?? []).length > 0;
  if (aShots !== bShots) return aShots ? -1 : 1;

  return (PDF_DATE_MS[b.id] ?? 0) - (PDF_DATE_MS[a.id] ?? 0);
});

const totalCasesCount = caseEvidenceLibrary.length;
const casesWithScreenshotsCount = caseEvidenceLibrary.filter(
  (i) => (caseScreenshotsByEvidenceId[i.id] ?? []).length > 0,
).length;
const totalScreenshotAssets = Object.values(caseScreenshotsByEvidenceId).reduce(
  (sum, shots) => sum + shots.length,
  0,
);

// ─── Structured Data ──────────────────────────────────────────────────────────

const casesStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Ahmed Emad Nasr 🇪🇬 🇵🇸 | Cybersecurity Blog - SOC Incident Reports, DFIR Writeups & Malware Analysis",
  description:
    "Comprehensive collection of SOC incident response reports, DFIR writeups, malware analysis, and threat hunting cases with detailed documentation.",
  url: `${SITE_BASE_URL}/blog`,
  publisher: {
    "@type": "Person",
    name: "Ahmed Emad Nasr",
    jobTitle: ["SOC Analyst", "Incident Response Analyst", "Cybersecurity Analyst"], // توحيد المسمى الوظيفي
    sameAs: [
      "https://linkedin.com/in/ahmed-emad-nasr/", // تم تعديل رابط لينكدان ليتطابق مع الـ CV
      "https://x.com/0x3omda",
      "https://github.com/AE-Nasr"
    ],
  },
  /* الحالات اللي مالهاش PDF مبتدخلش هنا: DigitalDocument من غير contentUrl
     ادّعاء بوجود ملف مش موجود. */
  hasPart: pdfResources
    .filter((item): item is typeof item & { href: string } => Boolean(item.href))
    .map((item, index) => ({
    "@type": "DigitalDocument",
    "@id": `${SITE_BASE_URL}/blog#pdf-${index + 1}`,
    name: item.title,
    description: (item as any)?.description || item.title,
    genre: item.type,
    contentUrl: toAbsoluteAssetUrl(item.href),
    encodingFormat: "application/pdf",
    author: { "@type": "Person", name: "Ahmed Emad Nasr" },
    datePublished: (item as any)?.date || "2025-01-01",
    keywords:
      (item as any)?.tags?.join(", ") || "cybersecurity, incident response, SOC, DFIR",
  })),
  keywords:
    "SOC analyst, incident response, cybersecurity, DFIR, threat analysis, writeups, security reports, malware analysis",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Portfolio",
      item: `${SITE_BASE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${SITE_BASE_URL}/blog`,
    },
  ],
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Ahmed Emad Nasr | Blog - SOC Incident Reports & Cybersecurity Writeups",
  description:
    "Explore SOC incident response reports, DFIR investigations, malware analysis, and cybersecurity threat analysis cases with detailed documentation.",
  keywords: [
    "SOC analyst reports",
    "incident response writeups",
    "cybersecurity cases",
    "DFIR investigations",
    "threat analysis",
    "malware analysis",
    "security documentation",
    "LetsDefend simulations",
    "Wazuh",
    "SIEM"
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_BASE_URL}/blog`,
    title: "Ahmed Emad Nasr | Blog - SOC Incident Reports & Cybersecurity Writeups",
    description:
      "Comprehensive SOC incident response reports, DFIR writeups, malware analysis, and threat hunting cases.",
    siteName: "Ahmed Emad Nasr - SOC & Cybersecurity Analyst", // تعديل الـ SiteName
    images: [
      {
        /*
         * كان "/Assets/art-gallery/logo/logo.png" — والتعليق اللي كان هنا
         * بيشك في المسار وهو محق: `Images/` ناقصة والامتداد غلط. الملف
         * الحقيقي هو Images/logo/My_Logo.webp، وهو المستخدم في كل مكان
         * تاني في المشروع.
         *
         * النتيجة إن أي مشاركة لصفحة البلوج على لينكدإن أو تويتر أو
         * واتساب كانت بتطلع من غير صورة.
         */
        url: toAbsoluteAssetUrl("/Assets/art-gallery/Images/logo/3omda.webp"),
        width: 1200,
        height: 630,
        alt: "Security Analysis Blog by Ahmed Emad Nasr",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@0x3omda", // تم توحيد الـ Handle ليتطابق مع الـ Portfolio
    site: "@0x3omda",
    title: "Ahmed Emad Nasr | Blog - SOC & DFIR Reports",
    description:
      "Explore incident response cases, threat analysis, malware reverse engineering, and security investigations.",
    /* نفس المسار الغلط بتاع og:image كان متكرر هنا كمان — أنا ظبّطت
       الأول وفات ده. سكربت فحص الأصول مسكه. */
    images: [toAbsoluteAssetUrl("/Assets/art-gallery/Images/logo/3omda.webp")],
  },
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(casesStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <BlogPageClient
        startHere={<StartHere />}
        sortedPdfs={sortedPdfs}
        searchIndex={SEARCH_INDEX}
        categoryFacets={CATEGORY_FACETS}
        toolFacets={TOOL_FACETS}
        totalCasesCount={totalCasesCount}
        casesWithScreenshotsCount={casesWithScreenshotsCount}
        totalScreenshotAssets={totalScreenshotAssets}
        cvResourceId={cvResource.id}
      />
    </>
  );
}