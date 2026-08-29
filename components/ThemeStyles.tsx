import { buildThemeCss, DEFAULT_THEME_ID, getTheme } from "@/lib/themes/index";
import { THEME_STYLE_ID } from "@/lib/themes/palette";

export function ThemeStyles({
  themeId,
  nonce,
}: {
  themeId: string;
  nonce?: string;
}) {
  const theme = getTheme(themeId) ?? getTheme(DEFAULT_THEME_ID)!;
  const css = buildThemeCss(theme);

  return (
    <style
      id={THEME_STYLE_ID}
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
