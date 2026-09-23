"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useMemo, useState, useEffect, useRef, useDeferredValue } from "react";
import { blogYoutubeVideos, blogYoutubePlaylists, blogFeaturedYoutubeVideo, YOUTUBE_CHANNEL_URL } from "@/app/core/config/youtube";
import { caseScreenshotsByEvidenceId } from "@/app/core/config/cases";
import styles from "./page.module.css";
import { formatDate, normalizePublicHref } from "./blog-utils";
import type { PdfResource, GalleryState } from "./blog-types";
import LoadingScreen from "@/app/components/loader/sensei_loader";
import BlogFilterBar, { type Facet } from "./components/BlogFilterBar";

// FIX: every one of these was `ssr: false`, so the exported /blog/index.html
// contained NO case studies, NO titles, NO links — an empty shell. All the
// CollectionPage + DigitalDocument JSON-LD in page.tsx described content that
// was not in the HTML. Dropping `ssr: false` keeps the code-splitting (the JS
// still loads as a separate chunk) while prerendering the markup at build time.
import AppBar from "./blog_header/sensei-header";
import BlogPdfLibrarySection from "./components/BlogPdfLibrarySection";

const BlogMediaSections = dynamic(() => import("./components/BlogMediaSections"));
const KanjiDivider = dynamic(() => import("@/app/core/components/KanjiDivider"));
// The modal genuinely never renders on load — ssr:false is correct HERE.
const BlogGalleryModal = dynamic(() => import("./components/BlogGalleryModal"), { ssr: false });

/*
 * `startHere` بييجي جاهز مرندر من page.tsx (Server Component). لو الملف ده
 * استورد الكومبوننت مباشرة كان هيبقى client component ويحزّم مكتبة الـ
 * cases في bundle المتصفح — نفس السبب اللي خلّى خريطة ATT&CK تتبعت كـ prop
 * في الصفحة الرئيسية.
 *
 * sortedPdfs / searchIndex / categoryFacets / toolFacets وأرقام العداد
 * التلاتة كلها محسوبة في page.tsx وقت الـ build دلوقتي — قبل كده كانت
 * بتتحسب هنا (في المتصفح) مع كل تحميل صفحة. caseScreenshotsByEvidenceId
 * لسه مستوردة هنا مباشرة لأن الجاليري محتاج مسارات الصور الفعلية وقت
 * التفاعل، مش مجرد أرقام.
 */
type BlogPageClientProps = {
  startHere?: React.ReactNode;
  sortedPdfs: PdfResource[];
  searchIndex: Record<string, string>;
  categoryFacets: Facet[];
  toolFacets: Facet[];
  totalCasesCount: number;
  casesWithScreenshotsCount: number;
  totalScreenshotAssets: number;
  cvResourceId: string;
};

export default function BlogPageClient({
  startHere,
  sortedPdfs,
  searchIndex,
  categoryFacets,
  toolFacets,
  totalCasesCount,
  casesWithScreenshotsCount,
  totalScreenshotAssets,
  cvResourceId,
}: BlogPageClientProps) {
  const [gallery, setGallery] = useState<GalleryState | null>(null);
  const [activeEmbeds, setActiveEmbeds] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);

  // ── حالة الفلترة ────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTools, setActiveTools] = useState<string[]>([]);

  // useDeferredValue: الكتابة في الخانة تفضل فورية حتى لو إعادة رسم الكروت
  // اتأخرت فريم أو اتنين. أرخص وأدق من debounce يدوي.
  const deferredQuery = useDeferredValue(query);

  const isFiltering =
    deferredQuery.trim() !== "" || activeCategory !== null || activeTools.length > 0;

  const visiblePdfs = useMemo(() => {
    if (!isFiltering) return sortedPdfs;

    const needle = deferredQuery.trim().toLowerCase();

    return sortedPdfs.filter((item) => {
      // الـ CV مش case — بيختفي أول ما تبدأ تفلتر عشان مياخدش مكان نتيجة
      if (item.id === cvResourceId) return false;

      if (needle && !(searchIndex[item.id] ?? "").includes(needle)) return false;
      if (activeCategory && item.category !== activeCategory) return false;

      // OR جوه نفس الفلتر: "وريني اللي فيه Wazuh أو Volatility"
      if (activeTools.length > 0) {
        const tools = item.tools ?? [];
        if (!activeTools.some((tool) => tools.includes(tool))) return false;
      }

      return true;
    });
  }, [sortedPdfs, isFiltering, deferredQuery, activeCategory, activeTools, searchIndex, cvResourceId]);

  // ── مزامنة الفلاتر مع الـ URL ───────────────────────────────────────────
  // مش بنستخدم useSearchParams / router.replace عن قصد: الأولى بتفرض Suspense
  // boundary وبتخرج الصفحة من الـ static export الكامل، والتانية بتعمل
  // re-render للشجرة كلها مع كل حرف. history.replaceState بيعمل نفس الشغل
  // من غير أي واحدة منهم.
  const filtersHydrated = useRef(false);

  useEffect(() => {
    const readFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      setActiveCategory(params.get("cat"));
      const tools = params.get("tools");
      setActiveTools(tools ? tools.split(",").filter(Boolean) : []);
    };

    // بنقرا بعد الـ mount مش أثناء الـ render: الـ HTML المبني على السيرفر
    // مفيهوش فلاتر، فلو بدأنا بحالة مفلترة كان هيحصل hydration mismatch.
    readFromUrl();
    filtersHydrated.current = true;

    // زرار الرجوع في المتصفح لازم يرجّع الفلاتر اللي كانت
    window.addEventListener("popstate", readFromUrl);
    return () => window.removeEventListener("popstate", readFromUrl);
  }, []);

  useEffect(() => {
    if (!filtersHydrated.current) return;

    // debounce: Safari بيحدّد عدد نداءات replaceState في الدقيقة، والكتابة مع
    // كل حرف بتوصل للحد ده بسهولة.
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (activeCategory) params.set("cat", activeCategory);
      if (activeTools.length) params.set("tools", activeTools.join(","));

      const search = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`,
      );
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query, activeCategory, activeTools]);

  const toggleTool = useCallback((tool: string) => {
    setActiveTools((current) =>
      current.includes(tool) ? current.filter((t) => t !== tool) : [...current, tool],
    );
  }, []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setActiveCategory(null);
    setActiveTools([]);
  }, []);

  const channelVideos = useMemo(() => {
    const featured = { ...blogFeaturedYoutubeVideo, sourceUrl: blogFeaturedYoutubeVideo.sourceUrl };
    const others = blogYoutubeVideos.map((v) => ({ ...v, sourceUrl: `https://youtu.be/${v.videoId}` }));
    return [featured, ...others];
  }, []);

  const goGallery = useCallback((delta: number) => {
    setGallery((cur) => cur ? { ...cur, index: (cur.index + delta + cur.screenshots.length) % cur.screenshots.length } : null);
  }, []);

  const openGallery = useCallback((title: string, screenshots: string[], index = 0) => {
    if (screenshots.length) setGallery({ title, screenshots, index: Math.min(Math.max(index, 0), screenshots.length - 1) });
  }, []);

  // Scroll blur effect: toggles a subtle backdrop blur between background and content for smoothness
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset;
        setScrolled(y > 24);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ── Deep link (#case-<id>) ──────────────────────────────────────────────
  // المتصفح بيحاول يقفز على الهاش قبل ما الكروت تتركّب، فبيفشل بصمت.
  // بنعيد المحاولة لحد ما العنصر يبان، وبنوقف بعد ٢ ثانية بالظبط بدل ما
  // نفضل ندوّر على لينك بايظ للأبد.
  const hashTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#case-")) return;

    let cancelled = false;
    let attempts = 0;

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(hash.slice(1));
      if (el) {
        // الـ offset بتاع الهيدر متظبط بـ scroll-margin-top في BlogCard.module.css
        el.scrollIntoView({ block: "start", behavior: "auto" });
        return;
      }
      if (attempts++ < 20) hashTimer.current = window.setTimeout(tryScroll, 100);
    };

    hashTimer.current = window.setTimeout(tryScroll, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(hashTimer.current);
    };
  }, []);

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.scrollBlurOverlay} data-active={scrolled}></div>
      <LoadingScreen />
      <AppBar />
      
      {/* مسار قراءة قصير قبل المكتبة الكاملة: 38 تقرير في ليستة واحدة
          بتشلّ اللي فاتحها، وأغلب اللي بيفتح الصفحة دي عنده خمس دقايق. */}
      {startHere}

      <BlogPdfLibrarySection
        visiblePdfCards={visiblePdfs}
        screenshotsById={caseScreenshotsByEvidenceId}
        openGallery={openGallery} 
        normalizeHref={normalizePublicHref}
        leadCase={null}
        leadCaseSpotlightImage={null}
        filterBar={
          <BlogFilterBar
            query={query}
            onQueryChange={setQuery}
            categories={categoryFacets}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            tools={toolFacets}
            activeTools={activeTools}
            onToolToggle={toggleTool}
            resultCount={visiblePdfs.length}
            totalCount={totalCasesCount}
            onReset={resetFilters}
          />
        }
        onResetFilters={resetFilters}
        isFiltering={isFiltering}
      />

      <KanjiDivider text="Reports • Screenshots • Investigation • Evidence" reverse angle={-1.2} />
      
      <BlogMediaSections
        totalCasesCount={totalCasesCount} 
        casesWithScreenshotsCount={casesWithScreenshotsCount}
        totalScreenshotAssets={totalScreenshotAssets}
        filteredChannelVideos={channelVideos} 
        filteredPlaylists={blogYoutubePlaylists}
        featuredVideo={blogFeaturedYoutubeVideo} activeEmbeds={activeEmbeds}
        onActivateEmbed={(k: string) => setActiveEmbeds(c => ({...c, [k]: true}))}
        formatDate={formatDate} youtubeChannelUrl={YOUTUBE_CHANNEL_URL}
      />
      {gallery && <BlogGalleryModal gallery={gallery} currentShot={gallery.screenshots[gallery.index] ? normalizePublicHref(gallery.screenshots[gallery.index]) : null} setGallery={setGallery} goGallery={goGallery} />}
    </main>
  );
}
