"use client";

/*
 * Terminal.tsx
 * Author: Ahmed Emad Nasr
 *
 * A small terminal that opens when you type "3omda" anywhere on the site
 * (or from the palette). Not a gimmick — it is another way to browse the
 * same content: ls shows the cases, open opens one, cat cv downloads the CV.
 *
 * All lazy, so it takes no bytes from the main bundle.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { caseEvidenceLibrary } from "@/app/core/config/cases";
import { normalizePublicHref } from "@/app/blog/blog-utils";
import styles from "./Terminal.module.css";

type Line = { id: number; text: string; kind: "in" | "out" | "err" | "dim" };

const BANNER = [
  "3OMDA SHELL v1.0 — SOC & DFIR portfolio",
  'Type "help" for commands, "exit" to close.',
];

/** Maximum number of lines kept — without it the DOM grows unbounded */
const MAX_LINES = 300;

export default function Terminal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  /* `npm run lint` failed on this: the lazy initialiser read and mutated
     lineId.current DURING render (react-hooks/refs). Under a concurrent
     render React may throw the result away — the ref keeps the increments
     from a render that never committed, so ids can collide with real lines
     later. The banner ids are known up front, so no ref is needed at all;
     the counter simply starts after them. */
  const lineId = useRef(BANNER.length);

  const [lines, setLines] = useState<Line[]>(() =>
    BANNER.map((text, index) => ({ id: index, text, kind: "dim" as const })),
  );
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const cases = useMemo(() => caseEvidenceLibrary, []);

  const print = useCallback((text: string, kind: Line["kind"] = "out") => {
    setLines((prev) => {
      const next = [...prev, { id: lineId.current++, text, kind }];
      return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
    });
  }, []);

  const printAll = useCallback(
    (texts: string[], kind: Line["kind"] = "out") => {
      setLines((prev) => {
        const next = [
          ...prev,
          ...texts.map((text) => ({ id: lineId.current++, text, kind })),
        ];
        return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
      });
    },
    [],
  );

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim();
      if (!input) return;

      print(`3omda@portfolio:~$ ${input}`, "in");
      setHistory((h) => [input, ...h].slice(0, 50));
      setHistoryIndex(-1);

      const [command, ...args] = input.split(/\s+/);
      const arg = args.join(" ");

      switch (command.toLowerCase()) {
        case "help":
          printAll([
            "help              — this list",
            "whoami            — short bio",
            "ls                — list all cases",
            "ls <keyword>      — filter the list",
            "open <n|id>       — open a case page",
            "cat cv            — open the CV",
            "skills            — most used tools",
            "contact           — how to reach me",
            "clear             — clear the screen",
            "exit              — close the terminal",
          ]);
          break;

        case "whoami":
          printAll([
            "Ahmed Emad Nasr — SOC Analyst / Blue Team.",
            "Incident response, digital forensics, malware analysis.",
            `${cases.length} documented cases in the library.`,
          ]);
          break;

        case "ls": {
          const filtered = arg
            ? cases.filter((c) =>
                `${c.title} ${c.category} ${c.tools.join(" ")} ${c.tags.join(" ")}`
                  .toLowerCase()
                  .includes(arg.toLowerCase()),
              )
            : cases;

          if (!filtered.length) {
            print(`ls: no case matches "${arg}"`, "err");
            break;
          }

          printAll(
            filtered.map((c) => {
              const index = String(cases.indexOf(c) + 1).padStart(2, "0");
              return `${index}  ${c.title}  [${c.category}]`;
            }),
          );
          break;
        }

        case "open": {
          if (!arg) {
            print("open: needs a number or an id. Try: open 1", "err");
            break;
          }

          // Accepts either a number from the list or the id itself
          const byIndex = Number.parseInt(arg, 10);
          const target = Number.isNaN(byIndex)
            ? cases.find((c) => c.id === arg)
            : cases[byIndex - 1];

          if (!target) {
            print(`open: no case "${arg}"`, "err");
            break;
          }

          print(`opening ${target.title}…`, "dim");
          onClose();
          router.push(`/blog/${target.id}`);
          break;
        }

        case "cat":
          if (arg.toLowerCase() === "cv") {
            print("opening CV…", "dim");
            window.open(normalizePublicHref("Assets/cv/AhmedEmadNasr_CV.pdf"), "_blank", "noopener");
          } else {
            print(`cat: ${arg || "missing operand"}: No such file`, "err");
          }
          break;

        case "skills": {
          const counts = new Map<string, number>();
          for (const item of cases) {
            for (const tool of item.tools) counts.set(tool, (counts.get(tool) ?? 0) + 1);
          }
          printAll(
            [...counts.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 12)
              .map(([tool, count]) => `${String(count).padStart(2, " ")}x  ${tool}`),
          );
          break;
        }

        case "contact":
          printAll([
            "email     ahmed.em.nasr@gmail.com",
            "linkedin  linkedin.com/in/ahmed-emad-nasr",
            "github    github.com/AE-Nasr",
          ]);
          break;

        case "sudo":
          print("Nice try.", "err");
          break;

        case "clear":
          setLines([]);
          break;

        case "exit":
          onClose();
          break;

        default:
          print(`${command}: command not found. Try "help".`, "err");
      }
    },
    [cases, onClose, print, printAll, router],
  );

  // ── focus + scroll lock ─────────────────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keep the view pinned to the last line
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      run(value);
      setValue("");
      return;
    }

    // ArrowUp/Down move through previous commands, like any shell
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setValue(history[next]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setValue(next < 0 ? "" : history[next] ?? "");
    }
  };

  return (
    <div
      data-fx="overlay" style={{ "--scrim": "rgba(0, 0, 0, 0.88)" } as CSSProperties}
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.window} onClick={() => inputRef.current?.focus()}>
        <div className={styles.titleBar}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.windowTitle}>3omda@portfolio: ~</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close terminal">
            ✕
          </button>
        </div>

        <div ref={bodyRef} className={styles.body}>
          {lines.map((line) => (
            <p key={line.id} className={styles[line.kind]}>
              {line.text}
            </p>
          ))}

          <div className={styles.inputRow}>
            <span className={styles.prompt} aria-hidden="true">
              3omda@portfolio:~$
            </span>
            <input
              ref={inputRef}
              className={styles.input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal input"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
