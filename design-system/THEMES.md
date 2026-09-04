# Color themes

> **Moved.** The palettes now live in `@noirly-dev/ui`
> (`packages/ui/src/themes/index.ts`) and are verified there with
> `pnpm themes:verify`. Edit them in noirly-ui, not here — the CSS in this
> folder is kept for reference and is not loaded at runtime.

Accessible color palettes for Noirly, verified against [WCAG AA normal text (4.5:1)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) using the same methodology as [colourcontrast.cc](https://colourcontrast.cc/).

## Palettes

| Branch | Theme | Light accent | Dark accent | Notes |
|--------|-------|--------------|-------------|-------|
| `theme/blue` | Ocean Blue | `#1d4ed8` | `#7ca6ff` | Default |
| `theme/gold` | Warm Gold | `#8a6b00` | `#ffe66d` | Dark mode uses [#222 on #ffe66d = 12.72:1](https://colourcontrast.cc/) |
| `theme/forest` | Forest Green | `#047857` | `#34d399` | |
| `theme/coral` | Coral Ember | `#c2410c` | `#ff8a7a` | |
| `theme/violet` | Soft Violet | `#6d28d9` | `#a78bfa` | |
| `theme/teal` | Deep Teal | `#0f766e` | `#2dd4bf` | |
| `theme/rose` | Rose Quartz | `#be123c` | `#fb7185` | |

Full token values and contrast ratios: `contrast-manifest.json`.

## Switch theme locally

```bash
# Generate CSS from manifest (after editing colors)
npm run themes:generate

# Verify all pairs pass WCAG AA
npm run themes:verify
```

Edit `design-system/themes/active.css` to point at a palette:

```css
@import "./gold.css";
```

## Switch theme by branch

```bash
git checkout theme/gold   # Warm Gold palette
git checkout theme/forest # Forest Green palette
# …etc
```

Each `theme/*` branch only changes `design-system/themes/active.css`.

## Checked pairs (per theme, light + dark)

- Text on background
- Accent ink on accent (buttons)
- Accent on background (links, highlights)
- Text on surface
