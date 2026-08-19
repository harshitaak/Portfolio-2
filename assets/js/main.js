

function reportThemeModeToGA(theme) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('set', 'user_properties', {
    theme_mode: theme
  });
}

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);


  /**
   * Mobile nav toggle
   */
  let mobileNavScrollY = 0;

  function setMobileToggleIcon(isOpen) {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (!mobileNavToggleBtn) return;

    // Lucide icon swap for the mobile toggle.
    if (mobileNavToggleBtn.hasAttribute('data-lucide')) {
      mobileNavToggleBtn.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
  }

  function mobileNavToogle() {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (!mobileNavToggleBtn) return;

    const body = document.querySelector('body');
    const opening = !body.classList.contains('mobile-nav-active');

    if (opening) {
      mobileNavScrollY = window.scrollY;
      body.style.top = '-' + mobileNavScrollY + 'px';
    } else {
      body.style.top = '';
    }

    body.classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('menu');
    mobileNavToggleBtn.classList.toggle('close');
    setMobileToggleIcon(opening);

    if (!opening) {
      requestAnimationFrame(function () {
        window.scrollTo(0, mobileNavScrollY);
      });
    }
  }
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.mobile-nav-toggle')) return;
    mobileNavToogle();
  });

  /**
   * Hide mobile nav on same-page/hash links
   *
   * .js-deck-egg is excluded: it needs seven clicks to do anything, and
   * closing the menu on the first one would make it unreachable on mobile.
   * Excluding it here rather than stopping propagation from the egg's own
   * handler keeps this independent of listener registration order.
   */
  document.querySelectorAll('#navmenu a:not(.js-deck-egg)').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Sliding surface behind the desktop nav items.
   * One shadowed pill glides to whichever item is hovered or focused, and
   * returns to the current page's .active item (or hides) when the nav is left.
   */
  function initNavPill() {
    const list = document.querySelector('#navmenu > ul');
    if (!list) return;

    const desktop = window.matchMedia('(min-width: 768px)');

    // Idempotent: a re-run must not stack pills.
    list.querySelectorAll(':scope > .nav-pill').forEach(el => el.remove());

    const pill = document.createElement('span');
    pill.className = 'nav-pill no-anim';
    pill.setAttribute('aria-hidden', 'true');
    list.prepend(pill);

    function isTrackable(li) {
      if (!li || li.parentElement !== list) return false;
      if (li.offsetParent === null) return false; // hidden, e.g. the d-md-none theme toggle
      const link = li.querySelector('a');
      return !!link && !link.classList.contains('nav-disabled');
    }

    function restingItem() {
      const active = list.querySelector(':scope > li > a.active');
      const li = active ? active.closest('li') : null;
      return isTrackable(li) ? li : null;
    }

    function place(li) {
      pill.style.setProperty('--nav-x', li.offsetLeft + 'px');
      pill.style.setProperty('--nav-w', li.offsetWidth + 'px');
    }

    // Stretch the surface along its direction of travel, then let it settle.
    let travelTimer = 0;
    function flagTravel() {
      pill.classList.add('is-travelling');
      clearTimeout(travelTimer);
      travelTimer = setTimeout(function() {
        pill.classList.remove('is-travelling');
      }, 170);
    }

    let currentLi = null;

    function moveTo(li) {
      if (li === currentLi) return; // pointerover re-fires on every child element
      currentLi = li;

      if (!li) {
        pill.classList.remove('is-visible');
        return;
      }
      if (pill.classList.contains('is-visible')) {
        place(li); // already on screen: glide across
        flagTravel();
        return;
      }
      // Appearing from nothing: land on the item first, then fade in, so the
      // pill never slides in from the left edge of the nav.
      pill.classList.add('no-anim');
      place(li);
      void pill.offsetWidth; // flush the jump before transitions resume
      pill.classList.remove('no-anim');
      pill.classList.add('is-visible');
    }

    // Re-anchor without animating: initial paint, resize, font swap.
    function settle() {
      const li = restingItem();
      currentLi = li;
      pill.classList.add('no-anim');
      pill.classList.remove('is-travelling');
      if (li) {
        place(li);
        pill.classList.add('is-visible');
      } else {
        pill.classList.remove('is-visible');
      }
      void pill.offsetWidth;
      pill.classList.remove('no-anim');
    }

    list.addEventListener('pointerover', function(e) {
      if (!desktop.matches) return;
      const li = e.target.closest('li');
      if (isTrackable(li)) moveTo(li);
    });

    list.addEventListener('focusin', function(e) {
      if (!desktop.matches) return;
      const li = e.target.closest('li');
      if (isTrackable(li)) moveTo(li);
    });

    list.addEventListener('pointerleave', function() {
      if (!desktop.matches) return;
      moveTo(restingItem());
    });

    list.addEventListener('focusout', function(e) {
      if (!desktop.matches) return;
      if (list.contains(e.relatedTarget)) return; // focus is still inside the nav
      moveTo(restingItem());
    });

    settle();

    if (typeof ResizeObserver === 'function') {
      let firstObservation = true;
      new ResizeObserver(function() {
        if (firstObservation) {
          firstObservation = false;
          return;
        }
        settle();
      }).observe(list);
    } else {
      window.addEventListener('resize', settle);
    }

    // Satoshi loads async; nav item widths shift once it lands.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(settle);
    }

    desktop.addEventListener('change', settle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavPill);
  } else {
    initNavPill();
  }



  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Floating back button
   */
  let floatingBackButton = document.querySelector('#floating-back-button');

  function toggleFloatingBackButton() {
    if (floatingBackButton) {
      // Show floating back button when user has scrolled down
      const hasScrolled = window.scrollY > 100;
      
      if (hasScrolled) {
        floatingBackButton.classList.add('active');
      } else {
        floatingBackButton.classList.remove('active');
      }
    }
  }

  // Add click listener to floating back button
  if (floatingBackButton) {
    floatingBackButton.addEventListener('click', (e) => {
      e.preventDefault();
      // Go back in browser history
      window.history.back();
    });
  }

  window.addEventListener('load', toggleFloatingBackButton);
  document.addEventListener('scroll', toggleFloatingBackButton);

  /**
   * Floating theme toggle button
   */
  let floatingThemeToggle = document.querySelector('#floating-theme-toggle');

  function toggleFloatingThemeToggle() {
    if (floatingThemeToggle) {
      // Show floating toggle when user has scrolled down (navbar is now part of scrollable area)
      const hasScrolled = window.scrollY > 100;
      
      if (hasScrolled) {
        floatingThemeToggle.classList.add('active');
      } else {
        floatingThemeToggle.classList.remove('active');
      }
    }
  }

  // Add click listener to floating theme toggle
  if (floatingThemeToggle) {
    floatingThemeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const root = document.documentElement;
      const body = document.body;
      const currentTheme = root.classList.contains('light-mode') ? 'light' : 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      if (newTheme === 'light') {
        root.classList.add('light-mode');
        body.classList.add('light-mode');
      } else {
        root.classList.remove('light-mode');
        body.classList.remove('light-mode');
      }

      localStorage.setItem('theme-preference', newTheme);
      reportThemeModeToGA(newTheme);

      floatingThemeToggle.setAttribute('aria-label', `Switch to ${newTheme === 'light' ? 'dark' : 'light'} mode`);

      const navThemeToggle = document.getElementById('theme-toggle');
      if (navThemeToggle) {
        navThemeToggle.setAttribute('aria-label', `Switch to ${newTheme === 'light' ? 'dark' : 'light'} mode`);
      }
    });
  }

  window.addEventListener('load', toggleFloatingThemeToggle);
  document.addEventListener('scroll', toggleFloatingThemeToggle);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');

    // Optional: each typed item can point at its own page via data-typed-links,
    // listed in the same order as data-typed-items. "#" means "no link yet".
    let typed_links = (selectTyped.getAttribute('data-typed-links') ?? '').split(',');
    let typedLink = selectTyped.closest('.typed-link');

    let typed_options = {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    };

    // Each item is only on screen for a few seconds, so the rotation is held
    // while the visitor reaches for the link. It is only ever held on a fully
    // typed word — pausing mid-word reads as a broken animation — so a hover
    // that lands mid-word waits for the word to finish before holding.
    let hovering = false;
    let held = false;

    function holdRotation(self) {
      let current = self.strings[self.arrayPos] ?? '';
      // Ignore anything but a completely typed word: mid-type, or mid-backspace
      // after the hold was released, the displayed text won't match.
      // Trimmed: every item carries a leading space from the data-typed-items
      // split, and typed.js writes through innerHTML. Mid-type and mid-backspace
      // states are still rejected — the displayed text is a strict prefix there.
      if (held || selectTyped.textContent.trim() !== current.trim()) {
        return;
      }
      held = true;
      // stop() alone only raises typed.js's pause flag; it leaves the queued
      // backspace pending and records the resume point only once that fires.
      // Dropping the timer and seeding the resume point ourselves makes both
      // the hold and the release deterministic, however briefly it was held.
      clearTimeout(self.timeout);
      self.pause.typewrite = false;
      self.pause.curString = current;
      self.pause.curStrPos = current.length;
      self.stop();
    }

    function releaseRotation() {
      if (!held) {
        return;
      }
      held = false;
      typedInstance.start();
    }

    if (typedLink) {
      typed_options.preStringTyped = function(index) {
        let href = (typed_links[index] ?? '').trim() || '#';
        typedLink.setAttribute('href', href);
        typedLink.setAttribute('aria-label', (typed_strings[index] ?? '').trim());
        if (href === '#') {
          typedLink.setAttribute('tabindex', '-1');
          typedLink.setAttribute('aria-disabled', 'true');
        } else {
          typedLink.removeAttribute('tabindex');
          typedLink.removeAttribute('aria-disabled');
        }
      };

      // Fires the moment the word is fully typed — the only safe point to hold
      typed_options.onStringTyped = function(index, self) {
        if (hovering) {
          holdRotation(self);
        }
      };
    }

    let typedInstance = new Typed('.typed', typed_options);

    if (typedLink) {
      // The anchor only ever holds the current word, so its width — and with it
      // its hit box — tracks the text character by character. Reserving the
      // widest string keeps the box still. Measured rather than set in ch units
      // because the font is Satoshi at a clamp() size with letter-spacing,
      // which ch only approximates.
      function reserveTypedWidth() {
        let probe = document.createElement('span');
        let styles = getComputedStyle(selectTyped);
        probe.style.position = 'absolute';
        probe.style.visibility = 'hidden';
        probe.style.whiteSpace = 'pre';
        // Set individually: the `font` shorthand reads back empty in some engines.
        ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(function(prop) {
          probe.style[prop] = styles[prop];
        });
        selectTyped.parentNode.appendChild(probe);

        let widest = 0;
        typed_strings.forEach(function(string) {
          probe.textContent = string;
          widest = Math.max(widest, probe.getBoundingClientRect().width);
        });
        probe.remove();

        // typed.js appends its own cursor inside the anchor (showCursor is left
        // at its default), so that width is part of the box too.
        let cursor = typedInstance.cursor;
        if (cursor) {
          widest += cursor.getBoundingClientRect().width;
        }
        typedLink.style.minWidth = Math.ceil(widest) + 'px';
      }

      // Wait for Satoshi: measuring against the fallback font sizes it wrong.
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(reserveTypedWidth);
      } else {
        reserveTypedWidth();
      }

      // --hero-body is viewport-relative, so the reservation is width-dependent.
      let resizeTimer = null;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(reserveTypedWidth, 150);
      });

      typedLink.addEventListener('focus', function() {
        hovering = true;
        holdRotation(typedInstance);
      });
      typedLink.addEventListener('blur', function() {
        hovering = false;
        releaseRotation();
      });

      // Releasing on the first mouseleave means a single stray pixel across the
      // edge costs a whole rotation, since re-entry lands mid-backspace and
      // holdRotation rejects it. A short grace period absorbs that jitter.
      // Keyboard focus has none, so focus/blur above release immediately.
      let leaveTimer = null;
      typedLink.addEventListener('mouseenter', function() {
        clearTimeout(leaveTimer);
        hovering = true;
        // Already sitting on a finished word? Hold it straight away.
        holdRotation(typedInstance);
      });
      typedLink.addEventListener('mouseleave', function() {
        clearTimeout(leaveTimer);
        leaveTimer = setTimeout(function() {
          hovering = false;
          releaseRotation();
        }, 120);
      });
    }
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox with proper configuration
   */
  let glightbox = null;

  function initGLightbox() {
    if (typeof GLightbox !== 'function') return;
    
    // Destroy existing instance if any
    if (glightbox && typeof glightbox.destroy === 'function') {
      glightbox.destroy();
    }

    // Initialize with proper settings
    glightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: false,
      moreText: 'Read more',
      moreLength: 60,
      zoomable: true,
      draggable: true,
      dragTolerance: 40,
      preload: true,
      svg: {
        arrows: {
          prev: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"></polyline></svg>',
          next: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"></polyline></svg>',
          close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        }
      }
    });
  }

  // Initialize on page load
  window.addEventListener('load', initGLightbox);

  // Re-initialize when navigating (for SPA-like behavior)
  window.addEventListener('popstate', initGLightbox);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    // Deep link support: portfolio.html#filter-product opens on the Furniture filter.
    // The hash is the data-filter class without its leading dot; an empty hash means "All".
    function filterButtonFromHash() {
      let selector = location.hash ? '.' + location.hash.slice(1) : '*';
      return isotopeItem.querySelector('.isotope-filters li[data-filter="' + selector + '"]');
    }

    function setActiveFilter(button) {
      let activeButton = isotopeItem.querySelector('.isotope-filters .filter-active');
      if (activeButton) {
        activeButton.classList.remove('filter-active');
      }
      button.classList.add('filter-active');
    }

    // An unknown hash leaves the default filter untouched
    let hashButton = location.hash ? filterButtonFromHash() : null;
    if (hashButton) {
      filter = hashButton.getAttribute('data-filter');
      setActiveFilter(hashButton);
    }

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        setActiveFilter(this);
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

    // Hash links followed from this same page don't reload it, so re-filter on hashchange too
    window.addEventListener('hashchange', function() {
      let button = filterButtonFromHash();
      if (!button || !initIsotope) {
        return;
      }
      setActiveFilter(button);
      initIsotope.arrange({
        filter: button.getAttribute('data-filter')
      });
      if (typeof aosInit === 'function') {
        aosInit();
      }
    });

  });


  
  window.addEventListener('load', function() {
    // Initialize all custom carousels with their own prev/next buttons
    const customCarousels = document.querySelectorAll('.custom-carousel-nav');
    customCarousels.forEach(function(customCarousel) {
      const swiper = new Swiper(customCarousel, {
        loop: true,
        pagination: {
          el: customCarousel.querySelector('.swiper-pagination'),
          clickable: true
        },
        slidesPerView: 1,
        spaceBetween: 30
      });

      // Real buttons replaced the old left-20%/right-20% coordinate hit test,
      // so the arrows are now keyboard operable. stopPropagation keeps a click
      // from also reaching any handler bound further up the tree.
      const prevBtn = customCarousel.querySelector('.carousel-nav-btn--prev');
      const nextBtn = customCarousel.querySelector('.carousel-nav-btn--next');

      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          swiper.slidePrev();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          swiper.slideNext();
        });
      }
    });
  });

})();

// Theme toggle using .light-mode on <html> and <body> (early init in theme-init.js)
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const body = document.body;
  const storageKey = 'theme-preference';

  function getThemePreference() {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      root.classList.add('light-mode');
      body.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
      body.classList.remove('light-mode');
    }

    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }

    const floatingThemeToggle = document.querySelector('#floating-theme-toggle');
    if (floatingThemeToggle) {
      floatingThemeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }

    reportThemeModeToGA(theme);
  }

  function saveTheme(theme) {
    localStorage.setItem(storageKey, theme);
  }

  function toggleTheme() {
    const currentTheme = root.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    applyTheme(newTheme);
    saveTheme(newTheme);
  }

  const initialTheme = getThemePreference();
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Only follow OS theme when user has not chosen a stored preference.
  // Otherwise spurious "change" events would flash dark then re-apply light and could overwrite localStorage.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem(storageKey)) return;
    const systemTheme = e.matches ? 'dark' : 'light';
    applyTheme(systemTheme);
  });
});
        

//Draw plugin - only register if available (DrawSVGPlugin is a paid Club GreenSock plugin)
var hasDrawSVGPlugin = typeof DrawSVGPlugin !== 'undefined';
if (hasDrawSVGPlugin) {
  gsap.registerPlugin(DrawSVGPlugin);
}

// Shared SVG line variants used by both [draw-line] (hover/GSAP) and
// .headline-draw__line (CSS scroll-driven). Index via attribute:
//   draw-line-style="N"  on [draw-line-box]
//   data-line-style="N"  on .headline-draw__line
const svgVariants = [
  `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 20.9999C26.7762 16.2245 49.5532 11.5572 71.7979 14.6666C84.9553 16.5057 97.0392 21.8432 109.987 24.3888C116.413 25.6523 123.012 25.5143 129.042 22.6388C135.981 19.3303 142.586 15.1422 150.092 13.3333C156.799 11.7168 161.702 14.6225 167.887 16.8333C181.562 21.7212 194.975 22.6234 209.252 21.3888C224.678 20.0548 239.912 17.991 255.42 18.3055C272.027 18.6422 288.409 18.867 305 17.9999" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
  `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 24.2592C26.233 20.2879 47.7083 16.9968 69.135 13.8421C98.0469 9.5853 128.407 4.02322 158.059 5.14674C172.583 5.69708 187.686 8.66104 201.598 11.9696C207.232 13.3093 215.437 14.9471 220.137 18.3619C224.401 21.4596 220.737 25.6575 217.184 27.6168C208.309 32.5097 197.199 34.281 186.698 34.8486C183.159 35.0399 147.197 36.2657 155.105 26.5837C158.11 22.9053 162.993 20.6229 167.764 18.7924C178.386 14.7164 190.115 12.1115 201.624 10.3984C218.367 7.90626 235.528 7.06127 252.521 7.49276C258.455 7.64343 264.389 7.92791 270.295 8.41825C280.321 9.25056 296 10.8932 305 13.0242" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`,
  `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 29.5014C9.61174 24.4515 12.9521 17.9873 20.9532 17.5292C23.7742 17.3676 27.0987 17.7897 29.6575 19.0014C33.2644 20.7093 35.6481 24.0004 39.4178 25.5014C48.3911 29.0744 55.7503 25.7731 63.3048 21.0292C67.9902 18.0869 73.7668 16.1366 79.3721 17.8903C85.1682 19.7036 88.2173 26.2464 94.4121 27.2514C102.584 28.5771 107.023 25.5064 113.276 20.6125C119.927 15.4067 128.83 12.3333 137.249 15.0014C141.418 16.3225 143.116 18.7528 146.581 21.0014C149.621 22.9736 152.78 23.6197 156.284 24.2514C165.142 25.8479 172.315 17.5185 179.144 13.5014C184.459 10.3746 191.785 8.74853 195.868 14.5292C199.252 19.3205 205.597 22.9057 211.621 22.5014C215.553 22.2374 220.183 17.8356 222.979 15.5569C225.4 13.5845 227.457 11.1105 230.742 10.5292C232.718 10.1794 234.784 12.9691 236.164 14.0014C238.543 15.7801 240.717 18.4775 243.356 19.8903C249.488 23.1729 255.706 21.2551 261.079 18.0014C266.571 14.6754 270.439 11.5202 277.146 13.6125C280.725 14.7289 283.221 17.209 286.393 19.0014C292.321 22.3517 298.255 22.5014 305 22.5014" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`,
  `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.0039 32.6826C32.2307 32.8412 47.4552 32.8277 62.676 32.8118C67.3044 32.807 96.546 33.0555 104.728 32.0775C113.615 31.0152 104.516 28.3028 102.022 27.2826C89.9573 22.3465 77.3751 19.0254 65.0451 15.0552C57.8987 12.7542 37.2813 8.49399 44.2314 6.10216C50.9667 3.78422 64.2873 5.81914 70.4249 5.96641C105.866 6.81677 141.306 7.58809 176.75 8.59886C217.874 9.77162 258.906 11.0553 300 14.4892" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`,
  `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99805 20.9998C65.6267 17.4649 126.268 13.845 187.208 12.8887C226.483 12.2723 265.751 13.2796 304.998 13.9998" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
  `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 29.8857C52.3147 26.9322 99.4329 21.6611 146.503 17.1765C151.753 16.6763 157.115 15.9505 162.415 15.6551C163.28 15.6069 165.074 15.4123 164.383 16.4275C161.704 20.3627 157.134 23.7551 153.95 27.4983C153.209 28.3702 148.194 33.4751 150.669 34.6605C153.638 36.0819 163.621 32.6063 165.039 32.2029C178.55 28.3608 191.49 23.5968 204.869 19.5404C231.903 11.3436 259.347 5.83254 288.793 5.12258C294.094 4.99476 299.722 4.82265 305 5.45025" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`
];

function initDrawRandomUnderline() {
  function decorateSVG(svgEl) {
    svgEl.setAttribute('class', 'text-draw__box-svg');
    svgEl.setAttribute('preserveAspectRatio', 'none');
    svgEl.querySelectorAll('path').forEach(path => {
      path.setAttribute('stroke', 'currentColor');
    });
  }
  const containers = document.querySelectorAll('[draw-line]');
  containers.forEach((container) => {
    const box = container.querySelector('[draw-line-box]');
    if (!box) return;
    if (box.dataset.lineScheduled === '1') return; // draw once, ever
    box.dataset.lineScheduled = '1';

    const drawOnce = () => {
      // Get the specified line style from attribute
      const lineStyle = parseInt(box.getAttribute('draw-line-style')) || 0;
      const selectedIndex = lineStyle % svgVariants.length; // Ensure it's within bounds

      // Animate Draw
      box.innerHTML = svgVariants[selectedIndex];
      const svg = box.querySelector('svg');
      if (!svg) return;
      decorateSVG(svg);
      const path = svg.querySelector('path');
      if (!path) return;
      if (hasDrawSVGPlugin) {
        gsap.set(path, { drawSVG: '0%' });
        gsap.to(path, { duration: 0.5, drawSVG: '100%', ease: 'power2.inOut' });
      } else {
        var len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, { duration: 0.5, strokeDashoffset: 0, ease: 'power2.inOut' });
      }
    };

    setTimeout(drawOnce, 2000);
  });
}
// Initialize Draw Random Underline
document.addEventListener('DOMContentLoaded', initDrawRandomUnderline);
setTimeout(initDrawRandomUnderline, 100); // fallback if DOMContentLoaded already fired

/**
 * Stamp one of the shared svgVariants into every .headline-draw__line.
 * CSS then handles the scroll-driven draw via animation-timeline: view().
 * Pick a variant per instance with: <div class="headline-draw__line" data-line-style="0..5">
 */
function initHeadlineDrawLines() {
  const lines = document.querySelectorAll('.headline-draw__line');
  lines.forEach((box) => {
    if (box.dataset.lineStamped === '1') return;
    const raw = parseInt(box.getAttribute('data-line-style'), 10);
    const idx = (Number.isFinite(raw) ? raw : 0) % svgVariants.length;
    box.innerHTML = svgVariants[idx];
    const svg = box.querySelector('svg');
    if (!svg) return;
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    const path = svg.querySelector('path');
    if (path) {
      path.setAttribute('pathLength', '1');
      path.setAttribute('stroke', 'currentColor');
    }
    box.dataset.lineStamped = '1';
  });
  if (typeof syncHeadlineDrawTitleGroupLineWidths === 'function') {
    syncHeadlineDrawTitleGroupLineWidths();
  }
}

/**
 * Match .headline-draw__line width to the heading’s rendered width.
 * Pairs with .headline-draw__title-group; fixes SVG min-intrinsic width and text-wrap: balance drift.
 */
function syncHeadlineDrawTitleGroupLineWidths() {
  document.querySelectorAll('.headline-draw__title-group').forEach((group) => {
    const title = group.querySelector('.headline-draw__title');
    const line = group.querySelector('.headline-draw__line');
    if (!title || !line) return;
    const w = title.getBoundingClientRect().width;
    if (w > 0) {
      line.style.width = `${Math.round(w * 100) / 100}px`;
    }
  });
}

function initHeadlineDrawTitleGroupLineWidths() {
  if (!document.querySelectorAll('.headline-draw__title-group').length) return;
  const run = () => {
    syncHeadlineDrawTitleGroupLineWidths();
  };
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(run);
    document.querySelectorAll('.headline-draw__title-group .headline-draw__title').forEach((el) => {
      ro.observe(el);
    });
  } else {
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(run, 100);
    });
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run);
  }
  run();
  setTimeout(run, 0);
  setTimeout(run, 200);
}

document.addEventListener('DOMContentLoaded', initHeadlineDrawTitleGroupLineWidths);
setTimeout(initHeadlineDrawTitleGroupLineWidths, 100);
document.addEventListener('DOMContentLoaded', initHeadlineDrawLines);
setTimeout(initHeadlineDrawLines, 100);

/* For basic custom cursor */
function initBasicCustomCursor() {  
  
  gsap.set(".cursor", {xPercent:-50, yPercent: -50});

  let xTo = gsap.quickTo(".cursor", "x", {duration: 0.1, ease: "power3"});
  let yTo = gsap.quickTo(".cursor", "y", {duration: 0.1, ease: "power2"});

  window.addEventListener("mousemove", e => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
}

// Initialize Basic Custom Cursor
document.addEventListener('DOMContentLoaded', () => {
  initBasicCustomCursor();
});

/* For smooth scroll */
// Lenis Link:https://github.com/darkroomengineering/lenis
// Skipped when the visitor asks for reduced motion, so the whole page
// (including the scroll-driven essay animations) stays consistent.
const lenis = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ? null
  : new Lenis({ autoRaf: true });

/**
 * Slides easter egg — a restaging of Android's developer-mode unlock.
 *
 * Seven clicks on the already-active "Philosophy" nav item reveal a "Slides"
 * item beside it, the way seven taps on Build number reveal Developer options.
 * Follows AOSP BuildNumberPreferenceController: seven taps, the countdown only
 * starts once fewer than TAPS - 2 remain (so the first two clicks are silent,
 * which is what makes the third one land), and there is no time-based reset —
 * the count lives until the page is reloaded.
 *
 * Only philosophy.html carries the hooks, so this no-ops on every other page.
 */
(function () {
  const TAPS = 7;

  // COPY SLOT: the three toast strings.
  const UNLOCKED = 'You are now a presenter!';
  const ALREADY = 'No need, you already have the slides.';
  function countdownMessage(n) {
    // AOSP uses an ICU plural here; "1 steps" reads broken.
    return 'You are now ' + n + (n === 1 ? ' step' : ' steps') + ' away from the slides.';
  }

  function initDeckEgg() {
    const trigger = document.querySelector('.js-deck-egg');
    const item = document.getElementById('deck-egg');
    const toast = document.getElementById('egg-toast');
    if (!trigger || !item || !toast) return;

    let countdown = TAPS;
    let hideTimer = 0;

    function say(message) {
      toast.textContent = message;
      toast.classList.add('is-visible');
      // Restart the dismissal rather than letting messages stack.
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        toast.classList.remove('is-visible');
      }, 2000);
    }

    function reveal() {
      // Lifts the toast clear of the button — they share the bottom-centre slot.
      document.body.classList.add('deck-unlocked');
      item.classList.add('is-revealed');
    }

    trigger.addEventListener('click', function (e) {
      // It links to the page you are already on, and the reload would reset
      // the count on every click. Suppressing it is the whole mechanism.
      e.preventDefault();

      if (countdown < 0) {
        say(ALREADY);
        return;
      }

      countdown--;

      if (countdown === 0) {
        countdown = -1;
        reveal();
        say(UNLOCKED);
        if (typeof gtag === 'function') {
          gtag('event', 'easter_egg_deck');
        }
      } else if (countdown < TAPS - 2) {
        say(countdownMessage(countdown));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeckEgg);
  } else {
    initDeckEgg();
  }
})();