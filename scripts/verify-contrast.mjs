import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contrastRatio } from "./contrast-utils.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "design-system/contrast-manifest.json"), "utf8"),
);

let failed = 0;

for (const theme of manifest.themes) {
  console.log(`\n=== ${theme.id}: ${theme.name} ===`);
  for (const mode of ["light", "dark"]) {
    const t = theme[mode];
    const pairs = [
      ["text on bg", t.text, t.bg],
      ["accent-ink on accent", t.accentInk, t.accent],
      ["accent on bg", t.accent, t.bg],
      ["text on surface", t.text, t.surface],
    ];
    for (const [name, fg, bg] of pairs) {
      const ratio = contrastRatio(fg, bg);
      const pass = ratio >= 4.5 ? "PASS" : "FAIL";
      if (ratio < 4.5) failed++;
      console.log(`  [${mode}] ${name}: ${ratio.toFixed(2)}:1 ${pass}`);
    }
  }
}

if (failed > 0) {
  console.error(`\n${failed} pair(s) below WCAG AA normal text (4.5:1).`);
  process.exit(1);
}

console.log("\nAll theme pairs pass WCAG AA normal text.");
