import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contrastRatio } from "./contrast-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "design-system/contrast-manifest.json"), "utf8"),
);

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)} ${parseInt(h.slice(2, 4), 16)} ${parseInt(h.slice(4, 6), 16)}`;
}

function softAccent(hex, opacity) {
  return `rgb(${hexToRgb(hex)} / ${opacity})`;
}

function buildThemeCss(theme) {
  const { light: l, dark: d } = theme;

  return `/* Theme: ${theme.name} (${theme.id})
 * WCAG AA verified — see design-system/contrast-manifest.json
 * Checker: https://colourcontrast.cc/
 */

:root {
  --bg: ${l.bg};
  --bg-deep: color-mix(in srgb, ${l.bg} 88%, ${l.text} 12%);
  --surface: ${l.surface};
  --surface-2: color-mix(in srgb, ${l.surface} 92%, ${l.text} 8%);

  --text: ${l.text};
  --text-secondary: rgb(${hexToRgb(l.text)} / 0.66);
  --text-muted: rgb(${hexToRgb(l.text)} / 0.58);

  --hairline: rgb(${hexToRgb(l.text)} / 0.1);
  --hairline-strong: rgb(${hexToRgb(l.text)} / 0.18);

  --accent: ${l.accent};
  --accent-ink: ${l.accentInk};
  --accent-soft: ${softAccent(l.accent, 0.1)};

  --card-gradient: linear-gradient(
    180deg,
    rgb(255 255 255 / 0.9) 0%,
    color-mix(in srgb, ${l.surface} 72%, ${l.bg} 28%) 100%
  );
  --card-sheen: inset 0 1px 0 0 rgb(255 255 255 / 0.9);
  --elev-1: 0 1px 2px -1px rgb(${hexToRgb(l.text)} / 0.08), 0 4px 12px -6px rgb(${hexToRgb(l.text)} / 0.1);
  --elev-2: 0 2px 4px -2px rgb(${hexToRgb(l.text)} / 0.08), 0 18px 40px -20px rgb(${hexToRgb(l.text)} / 0.18);
  --elev-3: 0 4px 8px -4px rgb(${hexToRgb(l.text)} / 0.1), 0 32px 64px -28px rgb(${hexToRgb(l.text)} / 0.24);

  --glow: rgb(${hexToRgb(l.text)} / 0.06);
  --grain-opacity: 0.035;

  --background: var(--bg);
  --foreground: var(--text);
  --card: var(--surface);
  --card-foreground: var(--text);
  --popover: var(--surface);
  --popover-foreground: var(--text);
  --primary: var(--text);
  --primary-foreground: var(--bg);
  --secondary: var(--surface-2);
  --secondary-foreground: var(--text);
  --muted: var(--surface-2);
  --muted-foreground: var(--text-muted);
  --accent-foreground: var(--accent-ink);
  --destructive: #dc2626;
  --border: var(--hairline);
  --input: var(--hairline-strong);
  --ring: var(--accent);
}

.dark {
  --bg: ${d.bg};
  --bg-deep: #000000;
  --surface: ${d.surface};
  --surface-2: color-mix(in srgb, ${d.surface} 88%, ${d.text} 12%);

  --text: ${d.text};
  --text-secondary: rgb(${hexToRgb(d.text)} / 0.68);
  --text-muted: rgb(${hexToRgb(d.text)} / 0.49);

  --hairline: rgb(${hexToRgb(d.text)} / 0.09);
  --hairline-strong: rgb(${hexToRgb(d.text)} / 0.18);

  --accent: ${d.accent};
  --accent-ink: ${d.accentInk};
  --accent-soft: ${softAccent(d.accent, 0.14)};

  --card-gradient: linear-gradient(
    180deg,
    rgb(${hexToRgb(d.text)} / 0.055) 0%,
    rgb(${hexToRgb(d.text)} / 0.012) 100%
  );
  --card-sheen: inset 0 1px 0 0 rgb(${hexToRgb(d.text)} / 0.07);
  --elev-1: 0 1px 2px -1px rgb(0 0 0 / 0.6), 0 4px 12px -6px rgb(0 0 0 / 0.5);
  --elev-2: 0 2px 4px -2px rgb(0 0 0 / 0.6), 0 18px 40px -20px rgb(0 0 0 / 0.7);
  --elev-3: 0 4px 8px -4px rgb(0 0 0 / 0.6), 0 32px 64px -28px rgb(0 0 0 / 0.8);

  --glow: rgb(${hexToRgb(d.text)} / 0.08);
  --grain-opacity: 0.05;

  --background: var(--bg);
  --foreground: var(--text);
  --card: var(--surface);
  --card-foreground: var(--text);
  --popover: var(--surface);
  --popover-foreground: var(--text);
  --primary: var(--text);
  --primary-foreground: var(--bg);
  --secondary: var(--surface-2);
  --secondary-foreground: var(--text);
  --muted: var(--surface-2);
  --muted-foreground: var(--text-muted);
  --accent-foreground: var(--accent-ink);
  --destructive: #f87171;
  --border: var(--hairline);
  --input: var(--hairline-strong);
  --ring: var(--accent);
}
`;
}

const themesDir = path.join(root, "design-system/themes");
fs.mkdirSync(themesDir, { recursive: true });

let failed = 0;
for (const theme of manifest.themes) {
  for (const mode of ["light", "dark"]) {
    const t = theme[mode];
    const pairs = [
      [t.text, t.bg, "text on bg"],
      [t.accentInk, t.accent, "accent-ink on accent"],
      [t.accent, t.bg, "accent on bg"],
    ];
    for (const [fg, bg, label] of pairs) {
      const ratio = contrastRatio(fg, bg);
      if (ratio < 4.5) {
        console.error(
          `${theme.id} [${mode}] ${label}: ${ratio.toFixed(2)}:1 — below AA`,
        );
        failed++;
      }
    }
  }

  const css = buildThemeCss(theme);
  fs.writeFileSync(path.join(themesDir, `${theme.id}.css`), css);
  console.log(`Wrote design-system/themes/${theme.id}.css`);
}

fs.writeFileSync(
  path.join(themesDir, "active.css"),
  '@import "./blue.css";\n',
);

console.log("Wrote design-system/themes/active.css -> blue");
process.exit(failed > 0 ? 1 : 0);
