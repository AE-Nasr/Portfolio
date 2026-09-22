"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHeader } from "@/app/core/utils/utils";
import Icon from "@/app/core/icons/Icon";
import styles from "./sensei-header.module.css";
import { scrollToElement } from "@/app/core/utils/scroll";

// دالة لمطابقة المسميات المختصرة
const getShortLabel = (section: string) => {
  switch (section.toLowerCase()) {
    case "home": return "HOME";
    case "experience": return "EXP";
    case "projects": case "work": return "WORK";
    case "certifications": case "cert": return "CERT";
    default: return section.toUpperCase();
  }
};

export default function SenseiHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const { isMenuOpen, activeSection, toggleMenu, sectionIcons, setActiveSection, setIsMenuOpen } = useHeader();

  // التحقق مما إذا كان المستخدم داخل صفحة البلوج
  const isBlog = pathname === "/blog" || pathname.startsWith("/blog/");

  // ── Scroll Event Handler (تغيير كلاس الهيدر عند السكرول بدون رندر إضافي) ──
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      headerRef.current?.classList.toggle(styles.scrolled, window.scrollY > 18);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // ── قفل السكرول في الموبايل عند فتح القائمة ──────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // ── Nav click handler ─────────────────────────────────────────────────────
  const handleNavClick = (section: string, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveSection(section);
    const target = document.getElementById(section);
    if (!target) return;
    
    /* رجعت قفزة فورية بطلب صريح — بدل السكرول الناعم اللي كان هنا.
       scrollToElement لسه بتحسب ارتفاع الهيدر الثابت، بس immediate:true
       بيتخطى محرك Lenis ويقفز على طول. */
    const doScroll = () => scrollToElement(target, { immediate: true });

    if (isMenuOpen) {
      setIsMenuOpen(false);
      requestAnimationFrame(doScroll);
    } else {
      doScroll();
    }
  };

  return (
    <>
      <header ref={headerRef} className={styles.header} data-site-header="true">
        <div className={styles.headerInner}>
          <div className={styles.headerContent}>
            
            {/* جهة اليسار: الـ Logo الجديد AE */}
            <div className={styles.brand}>
              <span className={styles.brandText}>
                AE<span className={styles.brandDot}>.</span>
              </span>
            </div>

            {/* القائمة الموحدة الصافية بعرض الصفحة */}
            <nav
              id="main-navigation"
              className={isMenuOpen ? `${styles.navbar} ${styles.active}` : styles.navbar}
              aria-label="Main navigation"
            >
              {Object.entries(sectionIcons).map(([section, icon]) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className={activeSection === section ? styles.active : undefined}
                  onClick={(e) => handleNavClick(section, e)}
                  aria-current={activeSection === section ? "page" : undefined}
                >
                  <Icon name={icon} />
                  {getShortLabel(section)}
                </a>
              ))}

              {/* زرار البلوج المظبوط */}
              <Link
                href="/blog"
                className={isBlog ? styles.active : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {/* أيقونة كتاب/مقال مناسبة للبلوج */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                BLOG
              </Link>
            </nav>

            {/* زر القائمة للموبايل فقط */}
            <button
              type="button"
              className={isMenuOpen ? `${styles.menuIcon} ${styles.active}` : styles.menuIcon}
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              aria-controls="main-navigation"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>

          </div>
        </div>
      </header>

      {/* شاشة الخلفية للموبايل */}
      <button
        type="button"
        className={isMenuOpen ? `${styles.backdrop} ${styles.backdropActive}` : styles.backdrop}
        aria-label="Close navigation menu"
        onClick={() => setIsMenuOpen(false)}
        tabIndex={isMenuOpen ? 0 : -1}
      />
    </>
  );
}