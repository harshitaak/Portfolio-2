---
name: svg-css-colorize
description: Replace hardcoded colors in an SVG file with var(--custom-property) references from a linked CSS file, so an inlined SVG inherits the site's theme colors and updates automatically with dark mode, theme toggles, or palette changes. Use this whenever the user wants to "sync" or "match" SVG colors to their CSS variables, wants an SVG to use their site's color palette, mentions inlining an icon/logo/illustration with theme-aware colors, or asks to replace hardcoded hex/rgb colors in an SVG with CSS variables. Applies to portfolio sites, icon sets, logos, or any HTML/CSS project with SVGs that should be inlined into the HTML (not loaded via <img> or url(), since var() does not resolve for externally-referenced SVGs).
---

# SVG → CSS Variable Colorizer

Swaps hardcoded colors inside an SVG (`fill`, `stroke`, `stop-color`,
`flood-color`, `color`, whether as attributes or inside a `style="..."`
attribute) for `var(--custom-property)` references, based on custom
properties defined in the project's CSS file.

**Important constraint:** this only works if the SVG will be **inlined
directly in the HTML** (`<svg>...</svg>` in the markup itself). If the SVG
stays a separate `.svg` file loaded via `<img src="icon.svg">` or a CSS
`background: url(...)`, browsers will NOT resolve `var()` inside it — the
colors will just break. If the user hasn't inlined their SVGs yet, tell them
this up front and offer to help inline it (see "Inlining" below).

## Workflow

1. **Locate the CSS file** with the relevant custom properties (usually
   defined in a `:root { --color-x: #hex; }` block). Confirm with the user if
   there are multiple CSS files and it's unclear which one is linked to the
   page containing the SVG.

2. **Run the script** to do the actual replacement — don't hand-edit colors
   yourself, the script guarantees exact, deterministic matching:

   ```bash
   python3 scripts/svg_colorize.py --svg path/to/icon.svg --css path/to/styles.css --out path/to/icon.inline.svg
   ```

3. **Read the script's report.** It prints:
   - every CSS variable found and its resolved color,
   - which SVG colors were successfully replaced,
   - any SVG colors that had **no matching CSS variable** (left untouched).

   For unmatched colors, ask the user how to proceed rather than guessing:
   - Add a new CSS custom property for that color, then re-run, or
   - Map it manually to the nearest existing variable, or
   - Leave it hardcoded (e.g. it's meant to stay a fixed color, not theme-aware).

4. **Inline the result into the HTML.** Open the output SVG file and paste
   its contents directly into the HTML at the point where the icon/logo/
   illustration should appear, replacing any `<img>` tag that previously
   referenced the standalone SVG file. Strip XML declarations
   (`<?xml ...?>`) and DOCTYPE if present — they aren't valid inside HTML.

5. **Sanity check**: confirm the CSS variables used (`--color-primary` etc.)
   are actually in scope for the page (e.g. defined on `:root` or an ancestor
   of the inlined SVG), otherwise the colors will resolve to nothing.

## Notes on matching

- Matching is by **exact resolved color value** (hex/rgb, normalized —
  `#FFF` and `rgb(255,255,255)` and `#ffffff` are all treated as identical).
  It does not guess "closest" colors — that would risk silently swapping in
  the wrong variable. If a color should map to a variable but doesn't match
  exactly, the report will flag it as unmatched.
- Only variables with literal color values are used (`--color-x: #hex;` or
  `rgb(...)`). Variables that reference other variables (`--color-x:
  var(--color-y)`) aren't resolved recursively — flag this to the user if it
  comes up.
- Gradients (`<linearGradient>`, `<radialGradient>` with `<stop
  stop-color="...">`) are handled since `stop-color` is in the matched
  attribute list.

## Inlining an externally-referenced SVG (if needed first)

If the user's SVG is currently loaded via `<img src="...">` or CSS
`url(...)`, do this before running the script:

1. Open the `.svg` file and copy its contents (excluding `<?xml ...?>` /
   `<!DOCTYPE ...>` lines).
2. Replace the `<img>` tag (or the CSS `background-image` + its host
   element) with the raw `<svg>...</svg>` markup in the HTML.
3. Then proceed with the colorize workflow above on that same source file
   before inlining — it's easier to run the script on the file and paste the
   *result*, rather than coloring after pasting.

## Quick Workflow: Large SVGs with Hardcoded Hex Colors

For large SVGs (4MB+) with embedded images and hardcoded hex colors like
`#FF0000`, `#00E6FF`, etc., use the PowerShell script:

```powershell
.\colorize-inline-workflow.ps1 `
  -SvgPath "path/to/Fig.svg" `
  -HtmlPath "path/to/page.html" `
  -ColorMap @{
    "#FF0000" = "var(--color-2)"
    "#EEFF00" = "var(--color)"
    "#00E6FF" = "var(--color-3)"
    "white" = "var(--ink)"
  }
```

This script automatically:
1. Replaces all hardcoded colors with CSS variables in one pass
2. Removes XML declarations (invalid in HTML)
3. **Sets responsive dimensions**: `width="100%"` `height="auto"`
4. Inlines the SVG directly into your HTML, replacing the `<img>` tag
5. Reports success and verifies CSS variables are in scope

No need to run the Python script separately or manually copy/paste SVG
content. SVGs are fully responsive and theme-aware out of the box.
