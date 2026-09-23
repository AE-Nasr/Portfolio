"use client";

/*
 * smooth-scroll.tsx — FIXED
 *
 * Bugs fixed:
 *
 * 1. `useLenis()` was called in the SAME component that renders <ReactLenis>.
 *    The context provider lives inside the returned JSX, so the parent can
 *    never read it — `lenis` was always null and the entire useEffect body
 *    never ran. Fix: the hook now lives in a CHILD of the provider.
 *
 * 2. The GSAP/ScrollTrigger bridge that used to live here was calling
 *    `lenis.raf()` a second time from GSAP's own ticker — on top of the
 *    raf loop Lenis already runs by itself (`autoRaf` defaults to `true`
 *    in `lenis-react`, confirmed in its source). Every scroll frame on
 *    every page was doing that work twice. And GSAP + ScrollTrigger
 *    (~70 KB) were being downloaded for it, even though nothing else in
 *    this codebase uses ScrollTrigger (checked: no other match in app/).
 *    Fix: removed the bridge. Lenis drives its own loop; nothing else
 *    needs to piggyback on it.
 *
 * 3. Lenis ran at full strength on every device. Smooth-scroll hijacking is
 *    a top cause of stutter on low-end phones, and it fights native momentum
 *    scrolling on touch. Fix: disabled entirely at the low tier.
 */

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { useDeviceTier } from "@/app/core/hooks/useDeviceTier";
import { registerLenis, EASE_OUT_EXPO, SCROLL_DURATION } from "@/app/core/utils/scroll";
import KeyboardScroll from "@/app/core/components/KeyboardScroll";

/* ── ظبط سرعة السكرول من هنا ── (العجلة + الـ touchpad) */
const WHEEL_LERP = 0.1;
const WHEEL_MULTIPLIER = 1;

/**
 * Lives INSIDE <ReactLenis>, so useLenis() can actually reach the context.
 * Renders nothing — كل شغلها إنها تسجّل الـ instance عشان الأزرار
 * واللينكات (scrollToElement/scrollToTop في core/utils/scroll) تعدّي من
 * نفس المحرّك اللي العجلة بتعدّي منه، بدل ما كل واحد فيهم ينده
 * window.scrollTo بمنحنى المتصفح الثابت لوحده.
 */
function LenisRegister() {
  const lenis = useLenis();

  useEffect(() => {
    registerLenis(lenis ?? null);
    return () => registerLenis(null);
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const tier = useDeviceTier();

  // On weak hardware native scrolling beats any JS-driven easing. Bailing out
  // here also means Lenis never attaches its wheel/touch listeners at all.
  if (tier === "low") {
    /* Lenis مش بيتركّب هنا، بس الكيبورد لسه محتاج يشتغل: من غير Lenis
       مفيش `scroll-behavior: auto !important`، فـ scrollToY بيرجع لحركة
       المتصفح الأصلية — وهي بتشتغل على الـ compositor، يعني أرخص من أي
       حاجة نكتبها. نفس المفاتيح، نفس الإحساس، صفر جافاسكريبت للحركة. */
    return (
      <>
        <KeyboardScroll />
        {children}
      </>
    );
  }

  return (
    <ReactLenis
      root
      options={{
        /*
         * سرعة سكرول العجلة والـ touchpad (الاتنين بيعدّوا من هنا).
         *
         * lerp = نسبة المسافة المتبقية اللي بتتقطع كل فريم. أعلى = أسرع.
         * Lenis بيستخدم lerp أو duration، مش الاتنين — فـ lerp لوحده كفاية.
         *
         * wheelMultiplier = مسافة كل "نقرة" عجلة أو حركة إصبعين على الـ
         * touchpad. 1 = المسافة الطبيعية، أقل = أبطأ، أكتر = أسرع.
         *
         * القيم اللي كانت قبل كده: lerp 0.032 (high) / 0.06 (mid) و
         * wheelMultiplier 0.72 — دي كانت مقصودة بطيئة. القيم الجديدة هي
         * الـ defaults بتاعة Lenis نفسها (lerp 0.1, wheelMultiplier 1)،
         * ولو لسه عايزها أسرع زوّد الرقمين، ولو عايزها أبطأ نزّلهم.
         */
        lerp: WHEEL_LERP,
        wheelMultiplier: WHEEL_MULTIPLIER,
        smoothWheel: true,

        /*
         * لينكات الـ hash (#Contact، #Projects، اللينكات جوه المقالات).
         * Lenis عنده تعامل جاهز معاها وكان مقفول — يعني أي <a href="#x">
         * في الموقع كان بيقفّز. بننفس المدة والمنحنى بتوع باقي الحركات
         * عشان الإحساس يفضل واحد.
         */
        anchors: { duration: SCROLL_DURATION, easing: EASE_OUT_EXPO },
        // Never hijack touch scrolling — it breaks momentum and feels laggy.
        syncTouch: false,
      }}
    >
      <LenisRegister />
      {/* الكيبورد. Lenis بيمسك العجلة واللمس بس، مفيش تعامل مع
          الكيبورد فيه — فمن غير ده الأسهم وPage Down بيقفّزوا. */}
      <KeyboardScroll />
      {children}
    </ReactLenis>
  );
}