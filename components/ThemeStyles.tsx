import { buildThemeCss, DEFAULT_THEME_ID, getTheme } from "@/lib/themes/index";

export function ThemeStyles({ themeId }: { themeId: string }) {
  const theme = getTheme(themeId) ?? getTheme(DEFAULT_THEME_ID)!;
  const css = buildThemeCss(theme);

  return (
    <style
      id="noirly-dynamic-theme"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
