#!/usr/bin/env python3
"""
svg_colorize.py

Replace hardcoded colors in an SVG with var(--css-custom-property) references,
based on custom properties defined in a linked CSS file. Intended for SVGs
that will be inlined directly into HTML (var() does not work in colors loaded
via <img src="..."> or CSS url() due to browser restrictions).

Usage:
    python svg_colorize.py --svg icon.svg --css styles.css --out icon.inline.svg

Exit behavior:
    Colors in the SVG that exactly match a CSS variable's resolved value are
    replaced. Colors that do NOT match anything are left untouched and listed
    in the report so you can decide what to do with them (add a new CSS
    variable, map manually, or leave as-is).
"""

import argparse
import re
import sys
from pathlib import Path

# ---------- color normalization ----------

HEX_RE = re.compile(r'^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$')
RGB_RE = re.compile(r'^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$')

NAMED_COLORS_TO_HEX = {
    "black": "#000000", "white": "#ffffff", "red": "#ff0000",
    "green": "#008000", "blue": "#0000ff", "none": None, "transparent": None,
}


def normalize_color(value):
    """Return a canonical lowercase 6-digit hex string for a color value,
    or None if it can't be parsed / isn't a real color (e.g. 'none')."""
    if value is None:
        return None
    v = value.strip().lower()
    if v in ("none", "transparent", "currentcolor", "inherit"):
        return None
    if v in NAMED_COLORS_TO_HEX:
        return NAMED_COLORS_TO_HEX[v]
    m = HEX_RE.match(v)
    if m:
        h = m.group(1)
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        return f"#{h.lower()}"
    m = RGB_RE.match(v)
    if m:
        r, g, b = (int(x) for x in m.groups())
        return f"#{r:02x}{g:02x}{b:02x}"
    return None


# ---------- CSS parsing ----------

CSS_VAR_DEF_RE = re.compile(r'--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);')


def extract_css_vars(css_text):
    """Return dict: normalized_hex -> var_name, using the FIRST definition
    found for each unique color (so :root wins if declared first, which it
    conventionally is)."""
    color_to_var = {}
    var_raw_values = {}
    for match in CSS_VAR_DEF_RE.finditer(css_text):
        name, raw_value = match.group(1), match.group(2).strip()
        var_raw_values[name] = raw_value
        norm = normalize_color(raw_value)
        if norm and norm not in color_to_var:
            color_to_var[norm] = name
    return color_to_var, var_raw_values


# ---------- SVG color replacement ----------

# Attributes that can carry a color value directly
COLOR_ATTRS = ["fill", "stroke", "stop-color", "flood-color", "color"]

# e.g. fill="#FF5733"  or  stroke='rgb(255, 87, 51)'
ATTR_COLOR_RE = re.compile(
    r'(\b(?:' + "|".join(COLOR_ATTRS) + r')\s*=\s*)(["\'])(.*?)\2'
)

# e.g. style="fill:#ff5733;stroke:#000"  -- matches the whole style="..." attribute
STYLE_ATTR_RE = re.compile(r'(style\s*=\s*)(["\'])(.*?)\2')

# e.g. within style content: "fill:#ff5733;stroke:#000"
STYLE_PROP_RE = re.compile(
    r'((?:^|;)\s*(?:' + "|".join(COLOR_ATTRS) + r')\s*:\s*)([^;]+)'
)


def replace_colors(svg_text, color_to_var):
    unmatched = set()
    matched = set()

    def attr_sub(m):
        prefix, quote, value = m.group(1), m.group(2), m.group(3)
        norm = normalize_color(value)
        if norm is None:
            return m.group(0)
        if norm in color_to_var:
            matched.add(norm)
            return f'{prefix}{quote}var(--{color_to_var[norm]}){quote}'
        unmatched.add(norm)
        return m.group(0)

    def style_content_sub(m):
        prefix, value = m.group(1), m.group(2)
        norm = normalize_color(value.strip())
        if norm is None:
            return m.group(0)
        if norm in color_to_var:
            matched.add(norm)
            return f'{prefix}var(--{color_to_var[norm]})'
        unmatched.add(norm)
        return m.group(0)

    def style_attr_sub(m):
        prefix, quote, content = m.group(1), m.group(2), m.group(3)
        new_content = STYLE_PROP_RE.sub(style_content_sub, content)
        return f'{prefix}{quote}{new_content}{quote}'

    out = ATTR_COLOR_RE.sub(attr_sub, svg_text)
    out = STYLE_ATTR_RE.sub(style_attr_sub, out)
    return out, matched, unmatched


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--svg", required=True, help="Path to input SVG file")
    ap.add_argument("--css", required=True, help="Path to CSS file with custom properties")
    ap.add_argument("--out", required=True, help="Path to write the modified SVG")
    args = ap.parse_args()

    svg_path = Path(args.svg)
    css_path = Path(args.css)

    if not svg_path.exists():
        sys.exit(f"SVG file not found: {svg_path}")
    if not css_path.exists():
        sys.exit(f"CSS file not found: {css_path}")

    svg_text = svg_path.read_text(encoding="utf-8")
    css_text = css_path.read_text(encoding="utf-8")

    color_to_var, var_raw_values = extract_css_vars(css_text)
    if not color_to_var:
        sys.exit("No color-valued CSS custom properties (--name: #hex/rgb;) found in the CSS file.")

    new_svg, matched, unmatched = replace_colors(svg_text, color_to_var)

    out_path = Path(args.out)
    out_path.write_text(new_svg, encoding="utf-8")

    print(f"Wrote: {out_path}")
    print(f"\nCSS variables found: {len(color_to_var)}")
    for norm, name in sorted(color_to_var.items(), key=lambda kv: kv[1]):
        print(f"  --{name}: {norm}")

    print(f"\nReplaced {len(matched)} distinct color(s) in the SVG:")
    for norm in sorted(matched):
        print(f"  {norm} -> var(--{color_to_var[norm]})")

    if unmatched:
        print(f"\n{len(unmatched)} color(s) in the SVG had NO matching CSS variable "
              f"(left unchanged):")
        for norm in sorted(unmatched):
            print(f"  {norm}")
        print("\nTo fix these, either add a matching custom property to your CSS "
              "and re-run, or edit the output SVG manually.")
    else:
        print("\nAll colors in the SVG were matched. ✅")


if __name__ == "__main__":
    main()
