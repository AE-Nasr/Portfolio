/*
 * File: layout.tsx
 * Author: Ahmed Emad Nasr
 * PERF IMPROVEMENTS:
 * 1. Removed fonts.gstatic.com preconnect (next/font is self-hosted).
 * 2. Moved theme-color to Viewport export for Next.js static optimization.
 * 3. Kept Structured Data stringified at module scope (Zero CPU overhead).
 */

import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Overlock, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { knowledgeEducationItems } from "@/app/core/config/experience";
import { certifications, certificationsJsonLd } from "@/app/core/config/certifications";
import { achievements } from "@/app/core/config/achievements";
import { skillGroups } from "@/app/core/config/skills";
import { SmoothScroll } from "./components/smooth-scroll";
// FIXED: `dynamic(..., { ssr: false })` cannot live in a Server Component, and
// this file is one (it exports `metadata`). The call moved into CursorMount,
// which is a Client Component. Same deferred-chunk benefit, legal placement.
import CursorMount from "./components/cursor-mount";
import CyberBackground from "./core/components/CyberBackground";
import SiteFooter from "./core/components/SiteFooter";
// شريط تقدّم القراءة — مركّب هنا مرة واحدة عشان يشتغل على البورتفوليو
// والبلوج مع بعض، من غير تكرار في كل page-client.
import ScrollProgress from "./core/components/ScrollProgress";
import BackToTop from "./core/components/BackToTop";
// الـ palette نفسه بيتحمّل lazy جوه المكوّن ده — مفيش أي كود منه في الـ
// bundle الأساسي لحد أول Ctrl+K.
import CommandPaletteMount from "./core/components/CommandPaletteMount";
// بيسجّل public/sw.js بعد الـ load، production بس. الموقع فعلاً بيعلن
// نفسه installable في manifest.ts — من غيره التثبيت شكل من غير caching حقيقي.
import ServiceWorkerRegister from "./core/components/ServiceWorkerRegister";
// مقفول لحد ما NEXT_PUBLIC_PLAUSIBLE_DOMAIN يتحط — شوف الكومنت جوه
// Analytics.tsx. من غير المتغيّر ده الكومبوننت بيرجع null.
import Analytics from "./core/components/Analytics";
// سكربت صغير بيتنفّذ في <head> قبل أول paint ويكتب data-tier على <html>.
// من غيره الـ CSS gating (html[data-tier="low"]) مكانش بيشتغل غير بعد الـ
// hydration — يعني كل الأنيميشن التقيل بيتحمّل ثمنه بالكامل بالظبط في
// النافذة اللي الـ LCP والـ TBT بيتقاسوا فيها.
import { DEVICE_TIER_SCRIPT } from "./core/hooks/useDeviceTier";

// ─── Viewport ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  /*
   * viewportFit: "cover" اتجرّب واترجع.
   *
   * الفكرة كانت إنه يشتغل مع appleWebApp.statusBarStyle =
   * "black-translucent" فتمتد الصفحة تحت الـ notch. بس ده بيغيّر أبعاد
   * الـ viewport على الموبايل، وده الجزء اللي فيه مخاطرة حقيقية مقابل
   * مكسب بيبان في الـ PWA المثبّتة بس.
   *
   * لو حبيت ترجّعه بعدين، رجّعه لوحده وجرّب اللمس على تليفون حقيقي قبل
   * ما تضيف أي حاجة تانية معاه.
   */
  /* Deliberately NOT set: maximumScale / userScalable. Locking zoom breaks
     WCAG 1.4.4 and is the single most common accessibility failure on
     portfolio sites. Pinch-zoom stays available. */
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://ae-nasr.github.io/Portfolio/"),
  applicationName: "Ahmed Emad Nasr Portfolio",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ahmed Portfolio",
    /*
     * كان "/Assets/…" — مسار من الجذر.
     *
     * Next بيضيف الـ basePath تلقائياً لصور openGraph و twitter (بيعملها
     * resolve مقابل metadataBase)، بس **مش** لـ startupImage. فسكربت فحص
     * اللينكات لقى ده آخر عنوان في الموقع كله طالع من غير /Portfolio
     * قدامه — يعني أيقونة شاشة البداية على iOS كانت 404.
     *
     * عنوان مطلق كامل، زي صور الـ OG في page.tsx بالظبط.
     */
    startupImage: ["https://ae-nasr.github.io/Portfolio/Assets/art-gallery/Images/logo/3omda.webp"],
  },
  /*
   * الـ metadata كانت فيها appleWebApp.capable = true من غير أي أيقونة —
   * يعني الموقع بيقول لـ iOS "أنا قابل للتثبيت" وبعدين مبيديش أيقونة،
   * فالنظام بياخد screenshot للصفحة ويستخدمه كأيقونة.
   *
   * favicon.ico في app/ بيتلقط تلقائياً. الباقي لازم يتكتب.
   */
icons: {
  icon: "favicon.ico",
  shortcut: "favicon.ico",
  apple: "Assets/art-gallery/Images/logo/3omda.webp",
},
manifest: "manifest.webmanifest",
  title: {
    default: "Ahmed Emad Nasr 🇪🇬 🇵🇸 | SOC & Cybersecurity Analyst",
    template: "%s | Ahmed Emad Nasr",
  },
  description:
    "Ahmed Emad Nasr's cybersecurity portfolio specializing in SOC operations, incident response, digital forensics (DFIR), threat hunting, and malware analysis.",
  keywords: [
    "Ahmed Emad Nasr", "SOC Analyst", "Cybersecurity Analyst", "Information Security Analyst",
    "Incident Response", "Threat Hunting", "SIEM", "EDR", "DFIR",
    "Wazuh", "Suricata", "Malware Analysis", "eJPT v2", 
    "Cairo", "Benha", "Portfolio",
  ],
  authors: [{ name: "Ahmed Emad Nasr" }],
  creator: "Ahmed Emad Nasr",
  publisher: "Ahmed Emad Nasr",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Ahmed Emad Nasr 🇪🇬 🇵🇸 | SOC & Cybersecurity Analyst",
    description: "Incident response, threat hunting, DFIR, and cybersecurity training from Ahmed Emad Nasr.",
    type: "website",
    url: "https://ae-nasr.github.io/Portfolio/",
    locale: "en_US",
    siteName: "Ahmed Emad Nasr Portfolio",
    images: [{
      url: "/Assets/art-gallery/Images/logo/3omda.webp",
      width: 1200,
      height: 630,
      alt: "Ahmed Emad Nasr cybersecurity portfolio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Emad Nasr 🇪🇬 🇵🇸 | SOC Analyst",
    description: "SOC analysis, incident response, threat hunting, SIEM/EDR implementation, and cybersecurity training.",
    creator: "@0x3omda",
    site: "@0x3omda",
    images: ["/Assets/art-gallery/Images/logo/3omda.webp"],
  },
  verification: {
    google: "VCIeVhcDb-vQGmE68weZARtruR_F2bUwv6hcjKYdwqo",
  },
};

// ─── Fonts ────────────────────────────────────────────────────────────────────

const overlock = Overlock({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-overlock",
  display: "swap",
});

/*
 * JetBrains Mono — كان ناقص تماماً.
 *
 * globals.css فيه `--font-mono: "JetBrains Mono", monospace` ومفيش أي حاجة
 * بتحمّل الخط ده. عدّيت على الـ CSS: **70 تصريح** بيطلبه — الـ HUD بتاع
 * الـ hero، وعناوين التكتيكات، وشارات المشاريع، والترمينال، والـ command
 * palette، وكل التواريخ والأرقام.
 *
 * كل واحدة فيهم كانت بترجع للـ monospace بتاع النظام: Courier New على
 * ويندوز، Menlo على ماك، Roboto Mono على أندرويد. يعني الحتة اللي الهوية
 * البصرية كلها قايمة عليها كانت بتتعرض بتلات خطوط مختلفة حسب جهاز الزائر —
 * وعلى ويندوز، وهو أغلب الزوار، بـ Courier New.
 *
 * وزنين بس (400 للنص، 700 للـ labels) عشان مانزوّدش الحمل.
 */
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  /*
   * next/font بيعمل <link rel="preload"> لكل ملف خط بشكل افتراضي. مع
   * Overlock بتلات أوزان + JetBrains بوزنين ده خمس طلبات بأولوية عالية
   * بتتنافس مع صورة الـ LCP على نفس نافذة الاتصال المحدودة.
   *
   * JetBrains Mono مش في أي نص فوق الطية له وزن في القياس — هو للـ HUD
   * والـ labels والترمينال. display: swap بيخلّيه يتبدّل لما يوصل.
   */
  preload: false,
});

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// ─── Structured Data ──────────────────────────────────────────────────────────

const STRUCTURED_DATA_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://ae-nasr.github.io/Portfolio/#person",
      name: "Ahmed Emad Nasr",
      url: "https://ae-nasr.github.io/Portfolio/",
      image: "https://ae-nasr.github.io/Portfolio/Assets/art-gallery/Images/logo/3omda.webp",
      jobTitle: ["SOC Analyst", "Incident Response Analyst", "Cybersecurity Analyst"],
      /* knowsAbout هو الحقل اللي جوجل بيستخدمه لفهم مجال الشخص. المهارات
         كانت متناثرة كتاجات في الـ JSX ومحدش مصدّرها كبيانات — دلوقتي
         مصدر واحد في config/skills.ts بيغذّي العرض والـ JSON-LD مع بعض. */
      knowsAbout: skillGroups.flatMap((group) => group.items),
      /* الشهادات كانت 74 صورة، صفر منها مفهوم لأي crawler. */
      hasCredential: certificationsJsonLd("https://ae-nasr.github.io/Portfolio/#person"),
      /* قسم الجوايز كان في الـ CV ومش موجود على الموقع بأي شكل. */
      award: achievements.map((item) => `${item.title} — ${item.context}`),
      description: "SOC Analyst and Incident Response Analyst focused on DFIR, Threat Hunting, and Security Operations.",
      email: "mailto:ahmed.em.nasr@gmail.com",
      telephone: "+20 101 397 2690",
      address: { 
        "@type": "PostalAddress", 
        addressLocality: "Cairo/Benha", 
        addressCountry: "EG" 
      },
      contactPoint: {
        "@type": "ContactPoint", contactType: "professional inquiry",
        email: "ahmed.em.nasr@gmail.com", availableLanguage: ["en", "ar"],
      },
      sameAs: [
        "https://www.linkedin.com/in/ahmed-emad-nasr/",
        "https://x.com/0x3omda",
        "https://github.com/AE-Nasr",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://ae-nasr.github.io/Portfolio/#website",
      name: "Ahmed Emad Nasr Portfolio",
      url: "https://ae-nasr.github.io/Portfolio/",
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": "https://ae-nasr.github.io/Portfolio/#profilepage",
      url: "https://ae-nasr.github.io/Portfolio/",
      mainEntity: { "@id": "https://ae-nasr.github.io/Portfolio/#person" },
      isPartOf: { "@id": "https://ae-nasr.github.io/Portfolio/#website" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://ae-nasr.github.io/Portfolio/#breadcrumbs",
      itemListElement: [
        /* اتشال عنصر Contact — القسم مبقاش موجود، وbreadcrumb بيشاور على
           anchor ميت بيبوظ الـ rich result في نتايج البحث. */
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ae-nasr.github.io/Portfolio/" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://ae-nasr.github.io/Portfolio/#homepage",
      url: "https://ae-nasr.github.io/Portfolio/",
      name: "Ahmed Emad Nasr | SOC Analyst & Cybersecurity Professional",
      description: "A portfolio homepage highlighting cybersecurity work, SIEM/EDR projects, malware analysis, and professional experience.",
      isPartOf: { "@id": "https://ae-nasr.github.io/Portfolio/#website" },
      primaryImageOfPage: { "@type": "ImageObject", url: "https://ae-nasr.github.io/Portfolio/Assets/art-gallery/Images/logo/3omda.webp" },
      about: { "@id": "https://ae-nasr.github.io/Portfolio/#person" },
      inLanguage: "en",
    },
    {
      "@type": "ItemList",
      "@id": "https://ae-nasr.github.io/Portfolio/#experience-list",
      name: "Education and Experience Timeline",
      itemListElement: knowledgeEducationItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "EducationalOccupationalCredential",
          name: item.tag,
          description: item.desc,
          credentialCategory: item.subTag,
          validFrom: item.startDate,
          validUntil: "endDate" in item ? item.endDate : undefined,
        },
      })),
    },
  ],
});

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /* suppressHydrationWarning: السكربت تحت بيضيف data-tier على <html> قبل
       ما React يعمل hydrate. من غير ده React بيشتكي من attribute مش موجود
       في الـ markup اللي جه من السيرفر. نفس نمط next-themes. */
    <html
      lang="en"
      dir="ltr"
      className={`${overlock.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          بيتنفّذ فوراً — قبل الـ CSS ما يترسم وقبل أي bundle. بيصنّف
          الجهاز ويكتب data-tier="low|mid|high" على <html>.

          globals.css فيه بالفعل ميزانية حركة كاملة معلّقة على
          html[data-tier="low"]. المشكلة كانت إن اللي بيكتب الـ attribute
          ده هو useEffect — يعني مبيشتغلش غير بعد ما الـ bundle يتحمّل
          ويعمل hydrate. النتيجة: التليفون بيدفع تكلفة الحركة الكاملة في
          أول 2–3 ثواني بالظبط، وبعدين يقفلها.
        */}
        <script dangerouslySetInnerHTML={{ __html: DEVICE_TIER_SCRIPT }} />
      </head>
      {/*
        الـ <head> اليدوي اتشال بالكامل. كان فيه سطرين:

        1. <link rel="preload" as="image" href=".../My_Logo.webp">
           بيعمل preload للملف الغلط — صورة الـ LCP هي 3omda.webp في
           sensei-home.tsx، مش اللوجو. يعني كان بيحجز اتصال لصورة مش على
           المسار الحرج ويأخّر اللي عليه. الصورة الصح بقت `priority`،
           وNext بيولّد الـ preload الصح بالمسار الصح.

        2. <link rel="icon" href="/Assets/art-gallery/Images/logo/3omda.webp">
           مسار مكتوب بإيد **من غير basePath**. سكربت فحص اللينكات أكّد
           ده: العنوان ده هو الوحيد في الموقع كله اللي طالع من غير
           /Portfolio قدامه — يعني 404 على كل تحميل صفحة، على كل صفحة.
           و`app/favicon.ico` موجود وNext بيحقنه أوتوماتيك بالمسار الصح،
           فالسطر ده كان تعريف تاني متعارض ومكسور في نفس الوقت.
      */}
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>

        {/* الخلفية المتحركة. Server Component — صفر جافاسكريبت للمتصفح،
            والحركة كلها transform/opacity على الـ GPU. أول عنصر في الـ
            body عشان يفضل ورا كل حاجة. */}
        <CyberBackground />

        <ScrollProgress />
        
        {TURNSTILE_SITE_KEY && (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
          />
        )}

        <Analytics />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA_JSON }}
        />
        
        {/*
          <MotionProvider> used to wrap this entire tree.
          It is gone from here on purpose.

          MotionProvider is <LazyMotion> — framer-motion's feature loader.
          It has to sit above any `m.*` element. When it wrapped everything,
          the motion engine was pulled onto the critical path of every page
          load, on every device.

          Its consumers were only ever two:

            · custom-cursor.tsx — desktop only, already behind a dynamic
              import and a pointer:fine check
            · sensei_loader.tsx — one fade-and-slide exit

          The loader now does that exit with a CSS transition (see
          .loader[data-state="out"]), which leaves the cursor as the single
          consumer. So the provider moved INSIDE CursorMount, on the far
          side of both the touch check and the dynamic import.

          Net effect: phones never download framer-motion at all.
        */}
        <SmoothScroll>
          {children}
          {/* تذييل لكل الصفحات — من غيره صفحتي الخصوصية والشروط مش
              هيبقى ليهم أي لينك في الموقع ومحدش هيوصلهم بالتصفح. */}
          <SiteFooter />
        </SmoothScroll>
        <CursorMount />
        <BackToTop />
        <CommandPaletteMount />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}