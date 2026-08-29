import {
  buildThemeCss,
  DEFAULT_THEME_ID,
  getTheme,
  isValidThemeId,
  PORTFOLIO_THEMES,
} from "@/lib/themes/index";

export const PALETTE_STORAGE_KEY = "palette";
export const THEME_STYLE_ID = "noirly-dynamic-theme";

export function getThemeCssMap(): Record<string, string> {
  return Object.fromEntries(
    PORTFOLIO_THEMES.map((theme) => [theme.id, buildThemeCss(theme)]),
  );
}

export function resolvePaletteId(
  candidate: string | null | undefined,
  fallback: string,
): string {
  if (candidate && isValidThemeId(candidate)) return candidate;
  return isValidThemeId(fallback) ? fallback : DEFAULT_THEME_ID;
}

export function themeCssFor(
  themeId: string,
  cssMap: Record<string, string>,
  fallbackId: string,
): string {
  const id = resolvePaletteId(themeId, fallbackId);
  return cssMap[id] ?? cssMap[fallbackId] ?? cssMap[DEFAULT_THEME_ID] ?? "";
}

/** Applies palette CSS to the document. Safe to call before or after hydration. */
export function applyPalette(
  themeId: string,
  cssMap?: Record<string, string>,
  fallbackId: string = DEFAULT_THEME_ID,
): void {
  if (typeof document === "undefined") return;

  const map = cssMap ?? getThemeCssMap();
  const id = resolvePaletteId(themeId, fallbackId);
  const css = themeCssFor(id, map, fallbackId);

  document.documentElement.dataset.theme = id;

  let el = document.getElementById(THEME_STYLE_ID);
  if (!el) {
    el = document.createElement("style");
    el.id = THEME_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

export function readStoredPalette(fallback: string): string {
  try {
    const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
    if (stored && isValidThemeId(stored)) return stored;
  } catch {
    /* private mode */
  }
  return resolvePaletteId(null, fallback);
}

export function buildThemeBootScript(
  defaultThemeId: string,
  cssMap: Record<string, string>,
): string {
  const fallback = resolvePaletteId(defaultThemeId, DEFAULT_THEME_ID);
  return `(function(){try{
var t=localStorage.getItem("theme");
var isDark=t!=="light";
if(isDark)document.documentElement.classList.add("dark");
else document.documentElement.classList.remove("dark");
var map=${JSON.stringify(cssMap)};
var valid=${JSON.stringify(PORTFOLIO_THEMES.map((theme) => theme.id))};
var fallback=${JSON.stringify(fallback)};
var palette=localStorage.getItem("${PALETTE_STORAGE_KEY}");
if(!palette||valid.indexOf(palette)===-1)palette=fallback;
document.documentElement.dataset.theme=palette;
var el=document.getElementById("${THEME_STYLE_ID}");
if(!el){el=document.createElement("style");el.id="${THEME_STYLE_ID}";document.head.appendChild(el);}
el.textContent=map[palette]||map[fallback];
var favicon=document.createElement("link");
favicon.rel="icon";
favicon.type="image/png";
favicon.sizes="48x48";
favicon.dataset.themeSync="true";
favicon.href=isDark?"/favicon-dark-48.png":"/favicon-light-48.png";
document.head.appendChild(favicon);
}catch(e){}})();`;
}
