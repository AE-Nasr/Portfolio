"use client";

/*
 * CommandPalette.tsx
 * Author: Ahmed Emad Nasr
 *
 * The palette itself. It is lazy-loaded from CommandPaletteMount, so all
 * the heavy imports here (portfolio.ts) stay out of the main bundle.
 *
 * The commands are built once at module level (they are constant), and the
 * parts that depend on the current page are computed in useMemo.
 *
 * Search: simple subsequence matching with priority ordering —
 * a literal match at the start > a literal match anywhere > scattered
 * characters in order. More than enough for a few dozen commands, and with
 * no extra library.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { caseEvidenceLibrary } from "@/app/core/config/cases";
import { YOUTUBE_CHANNEL_URL } from "@/app/core/config/youtube";
import { normalizePublicHref } from "@/app/blog/blog-utils";
import { scrollToElement, scrollToTop } from "@/app/core/utils/scroll";
import styles from "./CommandPalette.module.css";

type CommandGroup = "Navigate" | "Cases" | "Links" | "Actions";

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: CommandGroup;
  /** Extra search terms that are not shown in the UI */
  keywords?: string;
  run: (ctx: CommandContext) => void;
};

type CommandContext = {
  goToSection: (id: string) => void;
  goToRoute: (href: string) => void;
  close: () => void;
};

const EMAIL = "ahmed.em.nasr@gmail.com";
const CV_HREF = "Assets/cv/AhmedEmadNasr_CV.pdf";

// ─── Static commands ─────────────────────────────────────────────────────────

const PORTFOLIO_SECTIONS: { id: string; label: string }[] = [
  { id: "Home", label: "Home" },
  { id: "Experience", label: "Experience" },
  { id: "Projects", label: "Projects" },
  { id: "Certifications", label: "Certifications" },
];

const BLOG_SECTIONS: { id: string; label: string }[] = [
  { id: "blog-pdfs-title", label: "PDF Library" },
  { id: "youtube-hub-title", label: "YouTube Hub" },
];

const LINK_COMMANDS: Command[] = [
  {
    id: "link-linkedin",
    label: "LinkedIn",
    hint: "opens in a new tab",
    group: "Links",
    keywords: "profile social contact",
    run: () => window.open("https://www.linkedin.com/in/ahmed-emad-nasr/", "_blank", "noopener"),
  },
  {
    id: "link-github",
    label: "GitHub",
    hint: "opens in a new tab",
    group: "Links",
    keywords: "code repos source",
    run: () => window.open("https://github.com/AE-Nasr", "_blank", "noopener"),
  },
  {
    id: "link-x",
    label: "X / Twitter",
    hint: "opens in a new tab",
    group: "Links",
    keywords: "twitter social 0x3omda",
    run: () => window.open("https://x.com/0x3omda", "_blank", "noopener"),
  },
  {
    id: "link-youtube",
    label: "YouTube channel",
    hint: "opens in a new tab",
    group: "Links",
    keywords: "videos training arabic",
    run: () => window.open(YOUTUBE_CHANNEL_URL, "_blank", "noopener"),
  },
  {
    id: "link-rss",
    label: "RSS feed",
    hint: "/feed.xml",
    group: "Links",
    keywords: "subscribe feed atom",
    run: () => window.open(normalizePublicHref("feed.xml"), "_blank", "noopener"),
  },
];

const ACTION_COMMANDS: Command[] = [
  {
    id: "action-cv-open",
    label: "Open CV",
    hint: "PDF",
    group: "Actions",
    keywords: "resume cv download pdf",
    run: () => window.open(normalizePublicHref(CV_HREF), "_blank", "noopener"),
  },
  {
    id: "action-email",
    label: "Copy email address",
    hint: EMAIL,
    group: "Actions",
    keywords: "mail contact hire",
    run: () => {
      void navigator.clipboard?.writeText(EMAIL);
    },
  },
  {
    id: "action-email-send",
    label: "Send an email",
    hint: "opens your mail app",
    group: "Actions",
    keywords: "contact hire mailto",
    run: () => {
      window.location.href = `mailto:${EMAIL}`;
    },
  },
  {
    id: "action-terminal",
    label: "Open terminal",
    hint: "or type 3omda",
    group: "Actions",
    keywords: "shell console cli easter egg",
    run: () => window.dispatchEvent(new CustomEvent("sensei:open-terminal")),
  },
  {
    id: "action-shortcuts",
    label: "Keyboard shortcuts",
    hint: "?",
    group: "Actions",
    keywords: "keys help hotkeys",
    run: () => window.dispatchEvent(new CustomEvent("sensei:open-shortcuts")),
  },
  {
    id: "action-top",
    label: "Back to top",
    group: "Actions",
    keywords: "scroll up start",
    run: () => scrollToTop(),
  },
];

// Each case leads to its own page
const CASE_COMMANDS: Command[] = caseEvidenceLibrary.map((item) => ({
  id: `case-${item.id}`,
  label: item.title,
  hint: item.category ?? item.platform,
  group: "Cases",
  keywords: [item.platform, item.category, ...(item.tags ?? []), ...(item.tools ?? [])]
    .filter(Boolean)
    .join(" "),
  run: (ctx) => ctx.goToRoute(`/blog/${item.id}`),
}));

// ─── Search ──────────────────────────────────────────────────────────────────

/**
 * Returns a match score, or -1 when there is no match at all.
 * A higher score sorts earlier.
 */
const score = (haystack: string, needle: string): number => {
  if (!needle) return 0;

  const h = haystack.toLowerCase();
  const idx = h.indexOf(needle);

  if (idx === 0) return 1000;
  if (idx > 0) return 500 - Math.min(idx, 400);

  // fallback: the characters in order, but not necessarily adjacent
  let pos = 0;
  for (let i = 0; i < needle.length; i++) {
    pos = h.indexOf(needle[i], pos);
    if (pos === -1) return -1;
    pos++;
  }
  return 100;
};

const GROUP_ORDER: CommandGroup[] = ["Navigate", "Cases", "Actions", "Links"];

// ─── Component ───────────────────────────────────────────────────────────────

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const isBlog = pathname.startsWith("/blog");

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  // ── The context the commands operate in ─────────────────────────────────
  /* حساب إزاحة الهيدر كان مكرّر هنا وفي CommandPaletteMount وفي
     الهيدرين — أربع نسخ من نفس السطرين. بقى في getHeaderOffset. */
  const goToSection = useCallback((id: string) => {
    scrollToElement(document.getElementById(id));
  }, []);

  const goToRoute = useCallback((href: string) => router.push(href), [router]);

  const ctx = useMemo<CommandContext>(
    () => ({ goToSection, goToRoute, close: onClose }),
    [goToSection, goToRoute, onClose],
  );

  // ── Build the commands for the current page ─────────────────────────────
  const commands = useMemo<Command[]>(() => {
    const sections = isBlog ? BLOG_SECTIONS : PORTFOLIO_SECTIONS;

    const nav: Command[] = sections.map((section) => ({
      id: `nav-${section.id}`,
      label: section.label,
      hint: "section",
      group: "Navigate",
      run: (c) => c.goToSection(section.id),
    }));

    nav.push(
      isBlog
        ? {
            id: "nav-portfolio",
            label: "Back to portfolio",
            hint: "page",
            group: "Navigate",
            keywords: "home main index",
            run: (c) => c.goToRoute("/"),
          }
        : {
            id: "nav-blog",
            label: "Blog — cases & writeups",
            hint: "page",
            group: "Navigate",
            keywords: "cases reports dfir writeups pdf",
            run: (c) => c.goToRoute("/blog"),
          },
    );

    return [...nav, ...CASE_COMMANDS, ...ACTION_COMMANDS, ...LINK_COMMANDS];
  }, [isBlog]);

  // ── Filter and sort ─────────────────────────────────────────────────────
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return [...commands].sort(
        (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group),
      );
    }

    const scored: { cmd: Command; value: number }[] = [];
    for (const cmd of commands) {
      const labelScore = score(cmd.label, needle);
      const keywordScore = cmd.keywords ? score(cmd.keywords, needle) : -1;
      const best = Math.max(labelScore, keywordScore === -1 ? -1 : keywordScore * 0.6);
      if (best >= 0) scored.push({ cmd, value: best });
    }

    return scored
      .sort((a, b) => b.value - a.value || GROUP_ORDER.indexOf(a.cmd.group) - GROUP_ORDER.indexOf(b.cmd.group))
      .slice(0, 40)
      .map((s) => s.cmd);
  }, [commands, query]);

  // Reset to the first result whenever the query changes
  useEffect(() => setActiveIndex(0), [query]);

  // ── Open/close: focus + scroll lock ─────────────────────────────────────
  useEffect(() => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, []);

  const runCommand = useCallback(
    (cmd: Command | undefined) => {
      if (!cmd) return;
      onClose();
      // Close first, so the scroll lock lifts before any scrolling happens
      requestAnimationFrame(() => cmd.run(ctx));
    },
    [ctx, onClose],
  );

  // ── Keyboard ────────────────────────────────────────────────────────────
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(Math.max(0, results.length - 1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(results[activeIndex]);
    }
  };

  // Keep the active item visible while navigating by keyboard
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // The group heading is written once, at the first item in that group
  let lastGroup: CommandGroup | null = null;

  return (
    <div
      data-fx="overlay" data-overlay="top"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.panel} onKeyDown={onKeyDown}>
        <div className={styles.searchRow}>
          <span className={styles.prompt} aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            data-fx="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections, cases, links…"
            aria-label="Search commands"
            aria-controls="command-palette-list"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className={styles.escKey} onClick={onClose} aria-label="Close">
            ESC
          </button>
        </div>

        <ul id="command-palette-list" ref={listRef} className={styles.list} role="listbox">
          {results.map((cmd, i) => {
            const showGroup = cmd.group !== lastGroup;
            lastGroup = cmd.group;

            return (
              <li key={cmd.id} className={styles.listItem}>
                {showGroup && <p className={styles.groupLabel}>{cmd.group}</p>}
                <button
                  type="button"
                  data-index={i}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={i === activeIndex ? `${styles.row} ${styles.rowActive}` : styles.row}
                  onMouseMove={() => setActiveIndex(i)}
                  onClick={() => runCommand(cmd)}
                >
                  <span className={styles.rowLabel}>{cmd.label}</span>
                  {cmd.hint && <span className={styles.rowHint}>{cmd.hint}</span>}
                </button>
              </li>
            );
          })}

          {results.length === 0 && (
            <li className={styles.empty}>
              No match for “{query.trim()}”. Try a tool name, a case, or a section.
            </li>
          )}
        </ul>

        <div className={styles.footer}>
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
          <span className={styles.footerCount}>{results.length} result(s)</span>
        </div>
      </div>
    </div>
  );
}
