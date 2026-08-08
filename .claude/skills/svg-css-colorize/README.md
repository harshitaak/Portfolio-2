# SVG CSS Colorizer Skill

This skill replaces hardcoded colors in SVG files with CSS custom property references (`var(--custom-property)`), enabling inlined SVGs to inherit and respond to your site's theme colors.

## Quick Start

```bash
python3 .claude/skills/svg-css-colorize/svg_colorize.py --svg path/to/icon.svg --css path/to/styles.css --out path/to/icon.inline.svg
```

## Requirements

- SVG must be **inlined directly in HTML** (`<svg>...</svg>` in markup)
- CSS file must contain color custom properties (e.g., `:root { --color-primary: #1a73e8; }`)
- Python 3.7+

## What It Does

1. **Scans the CSS file** for custom properties with color values
2. **Finds all colors in the SVG** (in `fill`, `stroke`, `stop-color`, `flood-color`, `color` attributes and inline styles)
3. **Replaces matching colors** with `var(--property-name)` references
4. **Reports unmatched colors** so you can decide how to handle them

## Example Workflow

### Before (hardcoded colors in SVG):
```svg
<svg>
  <circle fill="#ff0000" stroke="#000000" />
</svg>
```

### CSS file (styles.css):
```css
:root {
  --color-primary: #ff0000;
  --color-text: #000000;
}
```

### Run the script:
```bash
python3 .claude/skills/svg-css-colorize/svg_colorize.py \
  --svg icon.svg \
  --css styles.css \
  --out icon.inline.svg
```

### After (CSS variable references):
```svg
<svg>
  <circle fill="var(--color-primary)" stroke="var(--color-text)" />
</svg>
```

Then paste the output SVG directly into your HTML, and it will automatically use your site's colors!

## Notes

- Colors are matched by **exact value** (normalized hex/rgb) — `#fff` and `#ffffff` are treated as the same
- Colors with no matching CSS variable are left unchanged and listed in the report
- Works with gradients (`<linearGradient>`, `<radialGradient>`) via `stop-color`
- Variables that reference other variables (`--color-x: var(--color-y)`) are not resolved recursively

## Troubleshooting

**"Colors will just break"** → SVG is not inlined in HTML; it's loaded via `<img>` or CSS `url()`. Inline it first (copy/paste the SVG contents into your HTML).

**"No matching CSS variable"** → Add the missing color to your CSS custom properties and re-run the script.

**"Variable not resolving"** → Make sure the CSS variable is defined in scope (e.g., on `:root` or a parent element of the inlined SVG).
