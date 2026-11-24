# SVG Colorize Quick Reference

## 30-Second Workflow

```powershell
.\colorize-inline-workflow.ps1 `
  -SvgPath "path/to/your.svg" `
  -HtmlPath "path/to/your-page.html" `
  -ColorMap @{
    "#YourHexColor" = "var(--your-css-var)"
  }
```

That's it. The script will:
1. Replace hardcoded colors with CSS variables
2. Remove XML declaration (invalid in HTML)
3. Set width="100%" height="auto" for responsive sizing
4. Inline into your HTML automatically

---

## Common Color Mappings

For this portfolio project, use these CSS variables:

| What it is | CSS Variable | Usage |
|-----------|--------------|-------|
| Text/outlines | `var(--ink)` | Replace `white`, `#000000` |
| Primary accent | `var(--color)` | Replace blue-ish colors, `#0099FF` |
| Secondary accent | `var(--color-2)` | Replace orange, `#FFBB00`, `#FF9900` |
| Tertiary accent | `var(--color-3)` | Replace cyan, `#00E6FF`, `#00CCFF` |
| Background | `var(--paper)` | Replace light/dark backgrounds |

---

## Examples

### Example 1: Colorizing a diagram with multiple colors
```powershell
.\colorize-inline-workflow.ps1 `
  -SvgPath "assets/img/diagram.svg" `
  -HtmlPath "about.html" `
  -ColorMap @{
    "#FF0000" = "var(--color-2)"      # red → orange
    "#00E6FF" = "var(--color-3)"      # cyan → cyan var
    "white" = "var(--ink)"            # white text → theme text
  }
```

### Example 2: Just replace colors, don't inline yet
```powershell
# Just generate the colorized SVG, manually inline it later
.\colorize-inline-workflow.ps1 `
  -SvgPath "assets/img/logo.svg" `
  -ColorMap @{
    "#1a1a1a" = "var(--ink)"
    "#ffffff" = "var(--paper)"
  }
# Output will be at $env:TEMP\svg-colorized.svg
```

---

## Verification Checklist

After running the script:

- [ ] SVG is now inline in the HTML (`<svg>...</svg>` tags, not `<img>`)
- [ ] Check dark mode toggle works — colors should adapt
- [ ] Open DevTools → verify `var(--color)` etc. resolve to actual colors
- [ ] If colors look wrong, CSS variables may not be in scope (usually defined on `:root`)

---

## If Colors Don't Work

**Problem:** Colors still show as hardcoded hex or `var()` shows "invalid"

**Solution:** Verify CSS variables exist in main stylesheet:
```css
:root {
  --ink: #ffffff;
  --color: #0099ff;
  --color-2: #ffbb00;
  --color-3: #00e6ff;
  --paper: #1a1a1a;
}

@media (prefers-color-scheme: light) {
  .light-mode {
    --ink: #000000;
    --color: #0077cc;
    /* etc */
  }
}
```

If variables don't exist, add them to your CSS and re-run the script.

---

## Keep This Handy

Bookmark or save this file. Copy the workflow command above and modify:
1. `path/to/your.svg` → your SVG file
2. `path/to/your-page.html` → your HTML page
3. Color mappings → your hardcoded hex colors
