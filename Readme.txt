# Harshit Taak — Portfolio

A personal portfolio website for **Harshit Taak** — a Product Designer exploring how digital tools are designed and made. The site brings together professional work, design philosophy, and multidisciplinary projects spanning UX, furniture, branding, and art.

> "I design digital tools."

## Live Site

Hosted for free on **GitHub Pages**.

- Visit: `https://github.com/harshitaak/Portfolio-2`
- Replace the URL above with your actual GitHub Pages address once deployed.

## Pages

| Page | What's inside |
| --- | --- |
| [`index.html`](index.html) | Landing page with hero, typed headline, and floating feature cards |
| [`about.html`](about.html) | Bio, testimonials, professional + academic timeline, interests, and notes about the site |
| [`philosophy.html`](philosophy.html) | My take on the three kinds of digital "things" — static sites, linear-journey apps, and digital tools |
| [`portfolio.html`](portfolio.html) | Filterable project gallery: Digital, Furniture, Visual, and Art |
| Case studies | Individual project pages such as `Aquata.html`, `OTG.html`, `Humane Technology.html`, `Pilotis.html`, `Pidah.html`, `Nu.html`, `Montra.html`, and more |

## Highlights

- **Light / Dark mode** with a persistent preference (stored in `localStorage`) and a floating theme toggle.
- **Minimal three-color palette** inspired by print design: *Paper*, *Ink*, and *Color*.
- **Typography** by [Satoshi](https://www.fontshare.com/fonts/satoshi) — a modernist sans-serif by Deni Anggara.
- **Smooth scroll** via Lenis and subtle scroll-triggered animations via AOS and GSAP.
- **Interactive project gallery** powered by Isotope with category filters and GLightbox image viewing.
- **Responsive layout** built on Bootstrap 5 with a custom cursor.
- **GA4 analytics** wired up in the page headers.

## Tech Stack

Pure HTML, CSS, and vanilla JavaScript — no build step required.

- [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)
- [AOS](https://michalsnik.github.io/aos/) — animate on scroll
- [Swiper](https://swiperjs.com/) — carousels
- [Isotope](https://isotope.metafizzy.co/) + [imagesLoaded](https://imagesloaded.desandro.com/) — filterable grid
- [GLightbox](https://biati-digital.github.io/glightbox/) — lightbox gallery
- [GSAP](https://gsap.com/) — animations and drawn SVG underlines
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scrolling
- [Typed.js](https://github.com/mattboldt/typed.js/) — typed hero headline
- [Lucide](https://lucide.dev/) + Material Icons
- [Satoshi](https://www.fontshare.com/fonts/satoshi) + Google Fonts (Roboto, Poppins, Raleway)

## Project Structure

```
Portfolio/
├── index.html              # Landing page
├── about.html              # About, testimonials, timeline
├── philosophy.html         # Design philosophy
├── portfolio.html          # Project gallery
├── <project>.html          # Individual case studies
├── server.ps1              # Local PowerShell dev server
├── assets/
│   ├── css/                # main.css, satoshi.css
│   ├── js/                 # main.js, theme-init.js
│   ├── img/                # Images grouped by project
│   └── vendor/             # Bootstrap, AOS, Swiper, Isotope, GLightbox, etc.
```

## Customization

- **Content**: Edit text and images directly inside the HTML files.
- **Theme colors**: Tweak the *Paper / Ink / Color* palette in [`assets/css/main.css`](assets/css/main.css).
- **Projects**: Add a new card in `portfolio.html` and link it to a new case-study HTML page.
- **Analytics**: Replace the GA4 Measurement ID (`G-8TQZB3JJF8`) in each HTML file's `<head>` with your own.
- **Resume link**: Update the Google Drive link in [`about.html`](about.html).

## Credits

- Typography: **Satoshi** by Deni Anggara
- Hosting: **GitHub Pages**
- Icons: Lucide, Bootstrap Icons, Material Icons
- Animation and UI libraries listed above

## Contact

- Email: [harshit.ea@gmail.com](mailto:harshit.ea@gmail.com)
- LinkedIn: [linkedin.com/in/harshitaak](https://www.linkedin.com/in/harshitaak/)
- Instagram: [@harshittaak](https://www.instagram.com/harshittaak/)

---

Made with care, and a healthy appetite for better tools.

