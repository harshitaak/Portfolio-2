# Harshit Taak — Portfolio

A personal portfolio website for **Harshit Taak** — a Product Designer exploring how digital tools are designed and made. The site brings together professional work, design philosophy, and multidisciplinary projects spanning UX, furniture, branding, and art.

> "I design digital tools."

## Live Site

Static site hosted on **GitHub Pages** at the custom domain recorded in [`cname.txt`](cname.txt).

- Site: <https://www.harshitaak.com>
- Repository: <https://github.com/harshitaak/Portfolio-2>

Deploys are automatic: [`.github/workflows/static.yml`](.github/workflows/static.yml) uploads the whole repository as a Pages artifact on every push to `main` (and can be run manually from the Actions tab). There is no build step in CI — what is committed is what ships.

## Local Development

No bundler or dev server dependency is required. Because the pages load assets by relative path, open them through a local HTTP server rather than `file://`:

```powershell
./server.ps1        # serves the repo root at http://localhost:8000
```

[`server.ps1`](server.ps1) is a small `HttpListener`-based static file server with a MIME-type map; press `Ctrl+C` to stop it.

## Pages

| Page | What's inside |
| --- | --- |
| [`index.html`](index.html) | Landing page with hero, typed headline, and feature cards |
| [`about.html`](about.html) | Bio, testimonials, professional + academic timeline, interests, and notes about the site |
| [`philosophy.html`](philosophy.html) | The three kinds of digital "things" — static sites, linear-journey apps, and digital tools |
| [`portfolio.html`](portfolio.html) | Filterable project gallery: All, Digital, Furniture, Visual, Art |

### Case studies

Each project is its own standalone HTML page.

| Category | Pages |
| --- | --- |
| Digital | [`Aquata.html`](Aquata.html), [`OTG.html`](OTG.html), [`Humane Technology.html`](Humane%20Technology.html), [`Nu.html`](Nu.html), [`Whatsapp.html`](Whatsapp.html), [`Lettuce Love.html`](Lettuce%20Love.html), [`Designing Epiphanies.html`](Designing%20Epiphanies.html) |
| Furniture / Product | [`Pilotis.html`](Pilotis.html), [`Bamboo Table.html`](Bamboo%20Table.html), [`Camping stool.html`](Camping%20stool.html), [`GRPVC Bench.html`](GRPVC%20Bench.html), [`Bicycle mount.html`](Bicycle%20mount.html), [`Tilt.html`](Tilt.html) |
| Visual / Branding | [`Pidah.html`](Pidah.html), [`Montra.html`](Montra.html), [`Samsung Fam.html`](Samsung%20Fam.html) |
| Art | [`Doodles.html`](Doodles.html), [`Renders.html`](Renders.html), [`Letter.html`](Letter.html) |

`service-details.html` is an unused leftover from the original Bootstrap template.

## Highlights

- **Dark mode by default**, light mode opt-in. The preference is stored in `localStorage` and applied before first paint by [`assets/js/theme-init.js`](assets/js/theme-init.js) to avoid a flash; the toggle lives in the header (and in the mobile nav).
- **Minimal three-token palette** inspired by print design: `--paper`, `--ink`, and `--color`, defined in OKLCH with three additional accent hues (`--color-2/3/4`).
- **Semantic type scale** — display / headline / title / subtitle / body / caption tokens, all set in **Satoshi**, self-hosted from [`assets/fonts/`](assets/fonts/).
- **Scroll-driven and hover animations** — GSAP-drawn SVG underlines (with a `stroke-dashoffset` fallback, since the DrawSVG plugin is paid), AOS reveals, and Lenis smooth scrolling.
- **Respects `prefers-reduced-motion`** — Lenis is skipped entirely so scroll-driven sections stay consistent for visitors who ask for less motion.
- **Interactive project gallery** powered by Isotope with category filters and GLightbox image viewing.
- **Responsive layout** on Bootstrap 5, with a custom cursor.
- **GA4 analytics** in each page's `<head>`, plus a `theme_mode` user property reported from [`assets/js/main.js`](assets/js/main.js).

## Tech Stack

Hand-written HTML, CSS, and vanilla JavaScript. Vendor libraries are committed under `assets/vendor/`; a few are pulled from CDNs.

**Vendored locally**

- [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/) — footer social marks only
- [AOS](https://michalsnik.github.io/aos/) — animate on scroll
- [Swiper](https://swiperjs.com/) — carousels
- [Isotope](https://isotope.metafizzy.co/) + [imagesLoaded](https://imagesloaded.desandro.com/) — filterable grid
- [GLightbox](https://biati-digital.github.io/glightbox/) — lightbox gallery
- [Typed.js](https://github.com/mattboldt/typed.js/) — typed hero headline
- [Satoshi](https://www.fontshare.com/fonts/satoshi) by Deni Anggara — self-hosted webfonts

**From CDN**

- [GSAP](https://gsap.com/) 3.13 — animations and drawn SVG underlines
- [Lenis](https://github.com/darkroomengineering/lenis) 1.2.3 — smooth scrolling
- [Lucide](https://lucide.dev/) 1.31 — the only icon set, referenced via `data-lucide`
- Google Fonts (Roboto, Poppins, Raleway)

### Tailwind (optional, currently unused)

The repo has a Tailwind CSS v4 toolchain wired up in [`package.json`](package.json), but **no page links `assets/css/tailwind.css` yet** — all styling currently comes from `main.css`. To work with it:

```bash
npm install
npm run tailwind:watch    # assets/css/tailwind-input.css -> assets/css/tailwind.css
npm run tailwind:build    # one-off, minified
```

Add `<link href="assets/css/tailwind.css" rel="stylesheet">` to a page to actually use the output.

## Project Structure

```
Portfolio/
├── index.html                  # Landing page
├── about.html                  # About, testimonials, timeline
├── philosophy.html             # Design philosophy
├── portfolio.html              # Project gallery
├── <project>.html              # Individual case studies
├── server.ps1                  # Local PowerShell static server (port 8000)
├── cname.txt                   # Custom domain
├── package.json                # Tailwind build scripts (optional)
├── tailwind.config.js
├── .github/workflows/static.yml # GitHub Pages deploy
└── assets/
    ├── css/                    # main.css, satoshi.css, tailwind-input.css, tailwind.css
    ├── js/                     # main.js, theme-init.js
    ├── fonts/                  # Satoshi (woff2/woff/ttf/eot)
    ├── img/                    # Images grouped by project
    └── vendor/                 # Bootstrap, AOS, Swiper, Isotope, GLightbox, Typed.js
```

## Customization

- **Content**: Edit text and images directly inside the HTML files.
- **Theme colors**: Tweak the *Paper / Ink / Color* tokens in [`assets/css/main.css`](assets/css/main.css) — the dark values live in `:root`, the light values in `.light-mode`.
- **Type scale**: Adjust the `--text-*-font` tokens in the same `:root` block.
- **Projects**: Add a card in `portfolio.html` with the right `filter-app` / `filter-product` / `filter-branding` / `filter-books` class, then link it to a new case-study page.
- **Analytics**: Replace the GA4 Measurement ID (`G-8TQZB3JJF8`) in each HTML file's `<head>`.
- **Resume link**: Update the Google Drive link in [`about.html`](about.html).
- **Domain**: Change [`cname.txt`](cname.txt) and the Pages settings for the repo.

## Credits

- Typography: **Satoshi** by Deni Anggara
- Hosting: **GitHub Pages**
- Icons: Lucide (all UI icons); Bootstrap Icons (footer social marks)
- Animation and UI libraries listed above

## Contact

- Email: [harshit.ea@gmail.com](mailto:harshit.ea@gmail.com)
- LinkedIn: [linkedin.com/in/harshitaak](https://www.linkedin.com/in/harshitaak/)
- Instagram: [@harshittaak](https://www.instagram.com/harshittaak/)

---

Made with care, and a healthy appetite for better tools.
