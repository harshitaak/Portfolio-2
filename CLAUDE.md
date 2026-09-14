# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Hand-written static portfolio site (HTML + CSS + vanilla JS) for Harshit Taak, deployed to GitHub Pages at www.harshitaak.com. There is no build step, no bundler, no tests, and no templating: every page is a complete standalone HTML file, and what is committed is what ships (`.github/workflows/static.yml` uploads the repo root on every push to `main`).

## Commands

Pages load assets by relative path, so serve over HTTP — `file://` will not load CSS.

```bash
npx -y serve -l 8000 .        # http://localhost:8000 (also wired into .claude/launch.json as "portfolio")
```

`server.ps1` (the README's suggested server) currently crashes after the first response with a Content-Length error, so prefer `serve`.

Tailwind is wired up but **unused** — no page links `assets/css/tailwind.css`, and `main.css` `@import`s it only for the preflight/utility layer already committed. Only touch it if you actually add Tailwind classes:

```bash
npm run tailwind:build        # assets/css/tailwind-input.css -> assets/css/tailwind.css (minified)
npm run tailwind:watch
```

`sharp` is a devDependency for one-off image optimization scripts (run from scratchpad, not committed).

## Architecture

**Pages.** `index.html`, `about.html`, `philosophy.html`, `portfolio.html`, plus ~19 case-study pages named after the project (`Aquata.html`, `Bamboo Table.html`, … — spaces in filenames are intentional and referenced with `%20`). `service-details.html` is a dead Bootstrap-template leftover.

**Shared chrome is copy-pasted, not templated.** The `<head>` (GA4 snippet, `theme-init.js`, vendor CSS, `main.css`, Lenis CSS), `<header id="header">`, `<footer id="footer">`, and the floating buttons appear verbatim in every page. A change to nav, footer, meta, or script includes must be applied to every HTML file — grep for the block and edit all of them.

**Styling — one file, three tokens.** All site styling is `assets/css/main.css` (~110 KB, has a table-of-contents comment at the top; Ctrl+F the section name). The palette is `--paper` (background), `--ink` (foreground), `--color` (accent, plus `--color-2/3/4`), all OKLCH. Dark values live in `:root`, light overrides in `.light-mode`. Never introduce raw hex colors in CSS or inlined SVGs; use the tokens so both themes work. Type scale is `--text-{display,headline,title,subtitle,body,caption}-*` tokens, all Satoshi (self-hosted in `assets/fonts/`).

**Theme.** Dark by default. `assets/js/theme-init.js` runs synchronously in `<head>` before `main.css`: reads `localStorage['theme-preference']` (falls back to OS scheme), adds `.light-mode` to `<html>` to avoid a flash, sets a one-per-session `.first-load` class for the navbar intro, and swaps the SVG favicon by OS scheme (Chrome ignores `prefers-color-scheme` inside favicon SVGs). The toggle itself and the `theme_mode` GA user property live in `assets/js/main.js`.

**JS — `assets/js/main.js`** (also has a TOC comment). One IIFE for template-ish behaviors (scrolled header, mobile nav, nav pill, AOS, Typed.js, GLightbox, Isotope filters, Swiper) plus top-level modules: hand-drawn underlines (`svgVariants` array; elements opt in with `draw-line` / `draw-line-style="N"` attributes; uses GSAP's paid DrawSVG plugin if present, else a `stroke-dashoffset` fallback), custom cursor (GSAP `quickTo`), Lenis smooth scroll (skipped under `prefers-reduced-motion`), and a Slides easter egg. Cross-page navigation uses the View Transitions API (`@view-transition` in `main.css`, `view-transition-name: page-content`).

**Vendor.** Bootstrap 5, AOS, Swiper, Isotope + imagesLoaded, GLightbox, Typed.js are vendored under `assets/vendor/`. GSAP 3.13, Lenis 1.2.3, and Lucide come from CDN. Lucide (`data-lucide`) is the only UI icon set; Bootstrap Icons are used only for footer social marks.

**Portfolio grid.** Cards in `portfolio.html` are filtered by Isotope via `filter-app` / `filter-product` / `filter-branding` / `filter-books` classes (Digital / Furniture / Visual / Art). Adding a project = a card here + a new case-study page + images under `assets/img/<Project>/`.

**`_design_work/`** is not part of the site. It holds Claude Design canvas artboards (`*.dc.html`, `canvas.json`) and `build.mjs`, which inlines the Satoshi woff2 and derives `LightMode.dc.html` from `Main.dc.html` by hex substitution. Ignore it unless asked about design mockups.

## Working conventions

- Follow `.cursor/rules/karpathy-guidelines.mdc`: surgical diffs, no speculative abstractions, match existing style, mention (don't delete) unrelated dead code.
- Images: `assets/img/Hero/2.1.png` and `assets/img/Pilotis/untitled folder/1/Joinery 4.png` have load-bearing alpha and must stay PNG — never flatten to JPEG.
- Verify visual changes in the browser in both themes (toggle in the header) and at mobile width; there is no other test surface.
