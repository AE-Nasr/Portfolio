"use client";

/*
 * File: sensei-header.tsx (blog)
 * Author: Ahmed Emad Nasr
 * Purpose: Blog navigation header — restyled to match the ultra-minimalist
 *          full-width trapezoid header used on the main site.
 */

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { useScrollSpy } from "@/app/core/utils/utils";

import Icon from "@/app/core/icons/Icon";
import { scrollToElement } from "@/app/core/utils/scroll";
import styles from "@/app/components/header/sensei-header.module.css";

const NAV_ITEMS = [
  { label: "Cases",       targetId: "blog-pdfs-title",   icon: "faFileLines" },
  { label: "YouTube Hub", targetId: "youtube-hub-title", icon: "faYoutube" },
] as const;

const SPY_SECTIONS = NAV_ITEMS.map(({ label, targetId }) => ({ label, elementId: targetId }));

const ShieldIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1L14 4V9C14 12.3 11.3 14.9 8 16C4.7 14.9 2 12.3 2 9V4L8 1Z" />
  </svg>
);

export default function SenseiHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { activeSection, setActiveSection } = useScrollSpy({
    sections: SPY_SECTIONS,
    defaultSection: "Cases",
    storageKey: "blog-activeSection",
  });

  // ── Scroll → CSS class, zero re-renders ──────────────────────────────────
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

  // ── Body scroll lock (mobile only) ────────────────────────────────────────
  useEffect(() => {
    if (window.innerWidth > 768) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  // ── Nav click ─────────────────────────────────────────────────────────────
  const handleNavClick = (label: string, targetId: string, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveSection(label);

    const target = document.getElementById(targetId);
    if (!target) return;

    /* رجعت قفزة فورية بطلب صريح، زي الهيدر الرئيسي بالظبط. */
    const doScroll = () => scrollToElement(target, { immediate: true });

    if (isMenuOpen) { setIsMenuOpen(false); requestAnimationFrame(doScroll); }
    else doScroll();
  };

  return (
    <>
      <header ref={headerRef} className={styles.header} data-site-header="true">
        <div className={styles.headerInner}>
          <div className={styles.headerContent}>

            {/* جهة اليسار: الـ Logo + الاسم بالعربي */}
            <div className={styles.brand}>
             <span className={styles.brandText}>
                AE<span className={styles.brandDot}>.</span>
              </span>
            </div>

            {/* القائمة الموحدة الصافية بعرض الصفحة */}
            <nav
              id="main-navigation"
              className={isMenuOpen ? `${styles.navbar} ${styles.active}` : styles.navbar}
              aria-label="Blog navigation"
            >
              {NAV_ITEMS.map(({ label, targetId, icon }) => (
                <a
                  key={label}
                  href={`#${targetId}`}
                  className={activeSection === label ? styles.active : undefined}
                  onClick={(e) => handleNavClick(label, targetId, e)}
                  aria-current={activeSection === label ? "page" : undefined}
                >
                  <Icon name={icon} />
                  {label}
                </a>
              ))}

              <span className={styles.navDivider} aria-hidden="true" />

              {/* رابط الرجوع للبورتفوليو */}
              <Link
                href="/"
                aria-label="Back to portfolio"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon name="faArrowLeft" aria-hidden="true" />
                PORTFOLIO
              </Link>
            </nav>

            {/* زر القائمة للموبايل فقط */}
            <button
              type="button"
              className={isMenuOpen ? `${styles.menuIcon} ${styles.active}` : styles.menuIcon}
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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