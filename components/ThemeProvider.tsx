"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  buildThemeCss,
  DEFAULT_THEME_ID,
  getTheme,
  isValidThemeId,
  PORTFOLIO_THEMES,
  type ThemeDefinition,
} from "@/lib/themes/index";

export const PALETTE_STORAGE_KEY = "palette";

type ThemeContextValue = {
  paletteId: string;
  setPalette: (id: string) => void;
  themes: ThemeDefinition[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function applyPalette(themeId: string) {
  const theme = getTheme(themeId) ?? getTheme(DEFAULT_THEME_ID)!;
  document.documentElement.dataset.theme = theme.id;
  const el = document.getElementById("noirly-dynamic-theme");
  if (el) {
    el.textContent = buildThemeCss(theme);
  }
}

export function readStoredPalette(fallback: string): string {
  try {
    const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
    if (stored && isValidThemeId(stored)) return stored;
  } catch {
    /* private mode */
  }
  return isValidThemeId(fallback) ? fallback : DEFAULT_THEME_ID;
}

export function ThemeProvider({
  defaultThemeId,
  children,
}: {
  defaultThemeId: string;
  children: ReactNode;
}) {
  const resolvedDefault = isValidThemeId(defaultThemeId)
    ? defaultThemeId
    : DEFAULT_THEME_ID;
  const [paletteId, setPaletteId] = useState(resolvedDefault);

  useLayoutEffect(() => {
    const id = readStoredPalette(resolvedDefault);
    setPaletteId(id);
    applyPalette(id);
  }, [resolvedDefault]);

  const setPalette = (id: string) => {
    if (!isValidThemeId(id)) return;
    setPaletteId(id);
    applyPalette(id);
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, id);
    } catch {
      /* private mode */
    }
  };

  const value = useMemo(
    () => ({ paletteId, setPalette, themes: PORTFOLIO_THEMES }),
    [paletteId],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
