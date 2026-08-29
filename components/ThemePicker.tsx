"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE_OUT, SPRING } from "@/lib/motion";
import { useTheme } from "@/components/ThemeProvider";
import type { ThemeDefinition } from "@/lib/themes/index";

function ThemeSwatch({ theme }: { theme: ThemeDefinition }) {
  return (
    <span className="flex shrink-0 gap-0.5" aria-hidden>
      <span
        className="size-2.5 rounded-full border border-black/10"
        style={{ background: theme.light.accent }}
      />
      <span
        className="size-2.5 rounded-full border border-white/10"
        style={{ background: theme.dark.accent }}
      />
    </span>
  );
}

type ThemePickerProps = {
  variant?: "header" | "menu";
  onSelect?: () => void;
};

export function ThemePicker({ variant = "header", onSelect }: ThemePickerProps) {
  const { paletteId, setPalette, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const activeTheme = themes.find((t) => t.id === paletteId);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function selectTheme(id: string) {
    setPalette(id);
    setOpen(false);
    onSelect?.();
  }

  if (variant === "menu") {
    return (
      <div className="mt-8 border-t border-[var(--hairline)] pt-6">
        <p className="mono-label" id={`${listId}-label`}>
          Color palette
        </p>
        <ul
          role="radiogroup"
          aria-labelledby={`${listId}-label`}
          className="mt-4 grid grid-cols-2 gap-2"
        >
          {themes.map((theme) => {
            const selected = theme.id === paletteId;
            return (
              <li key={theme.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectTheme(theme.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-[var(--r-md)] border px-3 py-2.5 text-left text-sm transition-colors",
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]"
                      : "border-[var(--hairline)] text-[var(--text-secondary)] hover:border-[var(--hairline-strong)] hover:text-[var(--text)]",
                  )}
                >
                  <ThemeSwatch theme={theme} />
                  <span className="min-w-0 flex-1 truncate font-medium">{theme.name}</span>
                  {selected ? <Check size={14} className="shrink-0 text-[var(--accent)]" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileTap={{ scale: 0.9 }}
        transition={SPRING}
        aria-label="Choose color palette"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="true"
        className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[var(--hairline)] text-[var(--text-secondary)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[var(--text)]"
      >
        <Palette size={16} aria-hidden />
        <span
          className="absolute bottom-1.5 right-1.5 size-2 rounded-full ring-2 ring-[var(--bg)]"
          style={{ background: "var(--accent)" }}
          aria-hidden
        />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={listId}
            role="dialog"
            aria-label="Color palettes"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--surface)] p-2 shadow-[var(--elev-2)]"
          >
            <p className="mono-label px-2 py-1.5" id={`${listId}-label`}>
              {activeTheme ? activeTheme.name : "Palette"}
            </p>
            <ul
              role="radiogroup"
              aria-labelledby={`${listId}-label`}
              className="max-h-[min(24rem,60vh)] overflow-y-auto"
            >
              {themes.map((theme) => {
                const selected = theme.id === paletteId;
                return (
                  <li key={theme.id}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => selectTheme(theme.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[var(--r-md)] px-2.5 py-2 text-left text-sm transition-colors",
                        selected
                          ? "bg-[var(--accent-soft)] text-[var(--text)]"
                          : "text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--text)_4%,transparent)] hover:text-[var(--text)]",
                      )}
                    >
                      <ThemeSwatch theme={theme} />
                      <span className="min-w-0 flex-1 font-medium">{theme.name}</span>
                      {selected ? (
                        <Check size={14} className="shrink-0 text-[var(--accent)]" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
