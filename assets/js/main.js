/*==============================================================
  TABLE OF CONTENTS — Ctrl+F the entry name to jump to it
  Entries are listed in file order, top to bottom.
================================================================

  reportThemeModeToGA .............. mirror the active theme into GA user properties

  MAIN IIFE ("use strict")
    toggleScrolled ................. .scrolled on <body> once past the fold
    Mobile nav toggle .............. GSAP open/close + icon morph, scroll-position restore
    Hide mobile nav ................ nav links close the mobile menu (egg excluded)
    initNavPill .................... sliding pill behind the desktop nav items
    Scroll top button
    Floating back button
    Floating theme toggle button
    aosInit ........................ Animate-On-Scroll
    Hero rotating word ............. letter cascade (GSAP), optional per-item links
    initGLightbox .................. lightbox, re-inits on popstate
    Init isotope layout and filters  portfolio grid
    custom-carousel-nav ............ swiper with real prev/next buttons

  TOP-LEVEL (each wires up its own DOMContentLoaded / load)
    Theme toggle ................... .light-mode + localStorage (early init in theme-init.js)
    Draw plugin .................... optional paid DrawSVGPlugin, registered only if present
    svgVariants .................... shared underline paths, indexed by attribute
    initDrawRandomUnderline ........ [draw-line] hover underlines
    initHeadlineDrawLines .......... stamps a variant into .headline-draw__line
    syncHeadlineDrawTitleGroupLineWidths  match SVG width to the rendered heading
    initHeroHeadline ............... SplitText word reveal on the index hero h1
    initDiagramTrigger ............. plays each .diagram-build once on view
    initBasicCustomCursor .......... GSAP quickTo cursor follower
    lenis .......................... smooth scroll, skipped for reduced motion
    Slides easter egg .............. seven clicks on Philosophy reveal Slides
    Analytics events ............... contact clicks, portfolio cards/filters, case-study scroll depth

================================================================*/

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
  let mobileNavOpen = false;
  let mobileNavTl = null;

  // A body-level tint behind the menu card (see .mobile-nav-backdrop in
  // main.css), so it also covers the floating buttons, which sit outside
  // the header.
  const mobileNavBackdrop = document.createElement('div');
  mobileNavBackdrop.className = 'mobile-nav-backdrop';
  mobileNavBackdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(mobileNavBackdrop);

  // Open: the tint fades in, the bottom sheet slides up, the links fade in one
  // after another, and the Lucide "menu" lines fold into an X. Close plays it
  // backwards, faster. Built per open so nothing lingers inline on desktop.
  // Links only fade (no y): the sheet scrolls (overflow-y: auto), and a link
  // moving inside it could flash a scroll bar.
  function buildMobileNavTl(toggle) {
    let lines = toggle.querySelectorAll('path, line');
    let tl = gsap.timeline({ paused: true, onReverseComplete: finishMobileNavClose })
      .fromTo(mobileNavBackdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0)
      .fromTo('#navmenu > ul', { yPercent: 100 },
        { yPercent: 0, duration: 0.6, ease: 'expo.out' }, 0)
      .fromTo('#navmenu > ul > li', { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.05 }, 0.12);

    if (lines.length === 3) {
      tl.to(lines[0], { y: 7, duration: 0.2, ease: 'power3.inOut' }, 0)
        .to(lines[2], { y: -7, duration: 0.2, ease: 'power3.inOut' }, 0)
        .to(lines[1], { scaleX: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.2 }, 0)
        .to(lines[0], { rotation: 45, transformOrigin: '50% 50%', duration: 0.4, ease: 'power3.inOut' }, 0.18)
        .to(lines[2], { rotation: -45, transformOrigin: '50% 50%', duration: 0.4, ease: 'power3.inOut' }, 0.18);
    }
    return tl;
  }

  function finishMobileNavClose() {
    if (mobileNavOpen) return; // re-opened mid-close
    const body = document.querySelector('body');
    if (mobileNavTl) {
      mobileNavTl.kill();
      mobileNavTl = null;
      gsap.set([mobileNavBackdrop, '#navmenu > ul', '#navmenu > ul > li', '.mobile-nav-toggle path, .mobile-nav-toggle line'], { clearProps: 'all' });
    }
    body.style.top = '';
    body.classList.remove('mobile-nav-active');
    requestAnimationFrame(function () {
      window.scrollTo(0, mobileNavScrollY);
    });
  }

  function mobileNavToogle() {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (!mobileNavToggleBtn) return;

    const body = document.querySelector('body');
    const opening = !mobileNavOpen;
    const hasGsap = typeof gsap !== 'undefined';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mobileNavOpen = opening;

    mobileNavToggleBtn.classList.toggle('menu', !opening);
    mobileNavToggleBtn.classList.toggle('close', opening);
    mobileNavToggleBtn.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
    mobileNavToggleBtn.setAttribute('aria-expanded', String(opening));

    if (opening) {
      // Not yet closed from a previous open? Then the page is still pinned.
      if (!body.classList.contains('mobile-nav-active')) {
        mobileNavScrollY = window.scrollY;
        body.style.top = '-' + mobileNavScrollY + 'px';
        body.classList.add('mobile-nav-active');
      }
      if (hasGsap) {
        mobileNavTl = mobileNavTl || buildMobileNavTl(mobileNavToggleBtn);
        // Reduced motion: jump straight to the open state (X icon included)
        reduced ? mobileNavTl.progress(1) : mobileNavTl.timeScale(1).play();
      }
    } else if (mobileNavTl && !reduced) {
      mobileNavTl.timeScale(1.6).reverse();
    } else {
      finishMobileNavClose();
    }
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNavOpen) mobileNavToogle();
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.mobile-nav-toggle')) return;
    mobileNavToogle();
  });

  /**
   * Close the mobile nav on a click outside the menu panel.
   *
   * The open overlay is .navmenu stretched over the viewport, with the links
   * in its > ul; everything between the two is backdrop, so a tap there reads
   * as "dismiss". Clicks on .mobile-nav-toggle are left alone — the listener
   * above already toggles those, and closing here too would cancel it out.
   */
  document.addEventListener('click', function (e) {
    if (!mobileNavOpen) return;
    if (e.target.closest('.mobile-nav-toggle')) return;
    if (e.target.closest('#navmenu > ul')) return;
    mobileNavToogle();
  });

  /**
   * Drag the bottom sheet down to dismiss it.
   *
   * Plain pointer events rather than GSAP's Draggable, which would need a
   * script tag on every page. The drag offset is a GSAP `y` on top of the
   * timeline's yPercent; finishMobileNavClose clears it with the rest.
   */
  function initMobileNavDrag() {
    const sheet = document.querySelector('#navmenu > ul');
    if (!sheet || typeof gsap === 'undefined') return;

    const THRESHOLD = 6;      // px before a press counts as a drag, so taps stay taps
    const DISMISS_RATIO = 0.3; // of the sheet's height
    const FLICK_SPEED = 0.4;   // px/ms downward...
    const FLICK_MIN = 20;      // ...over at least this many px
    let pointerId = null;
    let startY = 0, lastY = 0, lastT = 0, speed = 0, dy = 0;
    let dragging = false;
    let swallowClick = false;

    function reduced() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    sheet.addEventListener('pointerdown', function(e) {
      if (!mobileNavOpen || pointerId !== null) return;
      swallowClick = false;
      if (mobileNavTl && mobileNavTl.progress() < 1) mobileNavTl.progress(1);
      pointerId = e.pointerId;
      startY = lastY = e.clientY;
      lastT = e.timeStamp;
      speed = dy = 0;
      dragging = false;
    });

    sheet.addEventListener('pointermove', function(e) {
      if (e.pointerId !== pointerId) return;
      if (!dragging) {
        if (Math.abs(e.clientY - startY) < THRESHOLD) return;
        dragging = true;
        sheet.setPointerCapture(pointerId);
      }
      dy = Math.max(0, e.clientY - startY);
      let dt = e.timeStamp - lastT;
      if (dt > 0) speed = (e.clientY - lastY) / dt;
      lastY = e.clientY;
      lastT = e.timeStamp;
      gsap.set(sheet, { y: dy });
      gsap.set(mobileNavBackdrop, { opacity: 1 - dy / sheet.offsetHeight });
    });

    function release(e) {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      // The click that follows a drag isn't a tap. On touch it can arrive a
      // beat later, so the flag holds until the next press or 400ms.
      swallowClick = true;
      setTimeout(function() { swallowClick = false; }, 400);

      let height = sheet.offsetHeight;
      let instant = reduced();
      if (dy > height * DISMISS_RATIO || (speed > FLICK_SPEED && dy > FLICK_MIN)) {
        if (!instant) gsap.to(sheet, { y: height, duration: 0.2, ease: 'power2.in' });
        mobileNavToogle();
      } else if (instant) {
        gsap.set(sheet, { y: 0 });
        gsap.set(mobileNavBackdrop, { opacity: 1 });
      } else {
        gsap.to(sheet, { y: 0, duration: 0.35, ease: 'power3.out' });
        gsap.to(mobileNavBackdrop, { opacity: 1, duration: 0.35, ease: 'power3.out' });
      }
    }
    sheet.addEventListener('pointerup', release);
    sheet.addEventListener('pointercancel', release);

    // Capture phase, so a drag that starts on a link neither opens it nor
    // reaches the outside-click handler.
    sheet.addEventListener('click', function(e) {
      if (!swallowClick) return;
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }
  initMobileNavDrag();

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
      if (mobileNavOpen) {
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
    // Pages with no [data-aos] markup do not ship aos.js, so guard the global
    // the way initGLightbox does — an unguarded call would halt the rest of main.js.
    if (typeof AOS === 'undefined') return;

    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Navbar and footer intro — both fire on the same tick as the hero stagger.
   * They are the last beat of the ladder, not the first: the class swaps in a
   * longer-delayed animation that lands 1s after the final floating card. The
   * footer mirrors the header, rising from below as the header drops from
   * above. Timings, the hidden state and the reduced-motion / no-JS fallbacks
   * all live in main.css.
   */
  window.addEventListener('load', function () {
    // On a slow load the JS-free fallback animation may already have played
    // out. Restarting the clock then would yank a settled bar back off screen
    // and re-slide it, so leave it where it is.
    const settled = (el, name) =>
      typeof el.getAnimations === 'function' &&
      el.getAnimations().some(
        (a) => a.animationName === name && a.playState === 'finished'
      );

    const header = document.getElementById('header');
    if (header && !settled(header, 'nav-slide-down')) {
      header.classList.add('nav-intro');
    }

    // The footer's transform runs on its inner container (see main.css), so
    // that is where the fallback animation has to be checked for.
    const footer = document.getElementById('footer');
    const footerInner = footer && footer.querySelector(':scope > .container');
    if (footerInner && !settled(footerInner, 'footer-slide-up')) {
      footer.classList.add('footer-intro');
    }
  }, { once: true });

  /**
   * Hero rotating word: letter cascade (GSAP)
   * The word's letters drop out one after another, the underline resizes to
   * the next word, and its letters rise in. Markup contract is unchanged:
   * .typed carries data-typed-items (+ optional data-typed-links, same order;
   * "#" means "no link yet") inside an a.typed-link.
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    const items = selectTyped.getAttribute('data-typed-items').split(',').map(s => s.trim());
    const links = (selectTyped.getAttribute('data-typed-links') ?? '').split(',').map(s => s.trim());
    const typedLink = selectTyped.closest('.typed-link');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const HOLD = 2.2; // seconds each word stays put

    let index = 0;
    let nextCall = null;
    let hovering = false;

    // Measured rather than set in ch units: Satoshi at a clamp() size with
    // letter-spacing is only approximated by ch.
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;';
    function measure(text) {
      let styles = getComputedStyle(selectTyped);
      // Set individually: the `font` shorthand reads back empty in some engines.
      ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing'].forEach(function(prop) {
        probe.style[prop] = styles[prop];
      });
      probe.textContent = text;
      return probe.getBoundingClientRect().width;
    }

    function setLink(i) {
      if (!typedLink) return;
      let href = links[i] || '#';
      typedLink.setAttribute('href', href);
      typedLink.setAttribute('aria-label', items[i]);
      if (href === '#') {
        typedLink.setAttribute('tabindex', '-1');
        typedLink.setAttribute('aria-disabled', 'true');
      } else {
        typedLink.removeAttribute('tabindex');
        typedLink.removeAttribute('aria-disabled');
      }
    }

    function letters(text) {
      selectTyped.textContent = '';
      return Array.from(text).map(function(char) {
        let span = document.createElement('span');
        span.className = 'typed__ch';
        span.textContent = char;
        selectTyped.appendChild(span);
        return span;
      });
    }

    // A swap that starts while the visitor is on the link still finishes;
    // the next one is simply never scheduled until they leave.
    function schedule() {
      nextCall = gsap.delayedCall(HOLD, swap);
      if (hovering) nextCall.pause();
    }

    function swap() {
      index = (index + 1) % items.length;
      let word = items[index];
      setLink(index);

      if (reduceMotion) {
        selectTyped.textContent = word;
        gsap.set(selectTyped, { width: measure(word) });
        schedule();
        return;
      }

      // The new word starts rising as soon as the last old letter is out,
      // while the underline is still resizing, so there is no empty beat.
      let outgoing = selectTyped.querySelectorAll('.typed__ch');
      let outEnd = 0.35 + 0.02 * Math.max(outgoing.length - 1, 0);
      gsap.timeline()
        .to(outgoing, { yPercent: -110, duration: 0.35, ease: 'power2.in', stagger: 0.02 }, 0)
        .to(selectTyped, { width: measure(word), duration: 0.6, ease: 'power3.inOut' }, 0.15)
        .add(function() {
          gsap.fromTo(letters(word), { yPercent: 110 }, {
            yPercent: 0, duration: 0.5, ease: 'power3.out', stagger: 0.025,
            onComplete: schedule
          });
        }, outEnd);
    }

    // The anchor's hit box stays at the widest word so it never sweeps across
    // the pointer; the anchor ends the paragraph, so the space costs nothing.
    function reserveWidth() {
      selectTyped.parentNode.appendChild(probe);
      if (typedLink) {
        typedLink.style.minWidth = Math.ceil(Math.max.apply(null, items.map(measure))) + 'px';
      }
      gsap.set(selectTyped, { width: measure(items[index]) });
    }

    if (typeof gsap !== 'undefined') {
      letters(items[0]);
      setLink(0);
      // Wait for Satoshi: measuring against the fallback font sizes it wrong.
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function() {
        reserveWidth();
        schedule();
      });

      // --hero-body is viewport-relative, so the measurements are width-dependent.
      let resizeTimer = null;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(reserveWidth, 150);
      });
    }

    if (typedLink && typeof gsap !== 'undefined') {
      function hold() {
        hovering = true;
        if (nextCall) nextCall.pause();
      }
      function release() {
        hovering = false;
        if (nextCall) nextCall.resume();
      }
      typedLink.addEventListener('focus', hold);
      typedLink.addEventListener('blur', release);

      // A short grace period absorbs a stray pixel across the edge.
      // Keyboard focus has none, so focus/blur above release immediately.
      let leaveTimer = null;
      typedLink.addEventListener('mouseenter', function() {
        clearTimeout(leaveTimer);
        hold();
      });
      typedLink.addEventListener('mouseleave', function() {
        clearTimeout(leaveTimer);
        leaveTimer = setTimeout(release, 120);
      });
    }
  }

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

/**
 * Hero headline: words rise out of a mask (SplitText, index only).
 * Words, not chars, so the link inside the h1 stays readable.
 * The underline then draws on its own 2s timer (initDrawRandomUnderline).
 */
function initHeroHeadline() {
  const h1 = document.querySelector('.hero h1');
  if (!h1 || !document.documentElement.classList.contains('hero-split')) return;
  document.fonts.ready.then(() => {
    try {
      SplitText.create(h1, {
        type: 'words',
        mask: 'words',
        // No hyphen: SplitText suffixes every \w+ run, so "hero-word" would become "hero-mask-word-mask"
        wordsClass: 'heroword', // masks get .heroword-mask (descender padding in main.css)
        aria: 'none',
        onSplit(self) {
          return gsap.from(self.words, { yPercent: 130, duration: 0.9, ease: 'power4.out', stagger: 0.08, delay: 0.2 });
        }
      });
    } finally {
      h1.style.visibility = 'visible';
    }
  });
}
document.addEventListener('DOMContentLoaded', initHeroHeadline);

/**
 * .diagram-build: play the build once, on a clock, when the figure scrolls
 * into view (main.css holds it paused under .is-armed until .is-built).
 * --scrub diagrams run off scroll position instead and are left alone.
 */
function initDiagramTrigger() {
  const svgs = document.querySelectorAll('.diagram-build:not(.diagram-build--scrub)');
  if (!svgs.length) return;
  if (!('IntersectionObserver' in window)) {
    svgs.forEach((svg) => svg.classList.add('is-armed', 'is-built'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-built');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  svgs.forEach((svg) => {
    svg.classList.add('is-armed');
    io.observe(svg);
  });
}
document.addEventListener('DOMContentLoaded', initDiagramTrigger);

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

/**
 * Analytics events
 * contact_click      method (email | linkedin | instagram), link_location (header | footer | page)
 * select_content     a portfolio card was opened; item_id is the case-study filename
 * portfolio_filter   filter_name is the filter's label (All, Digital, Furniture, ...)
 * case_study_scroll  percent_scrolled 25/50/75/100, once each per page view
 * project_name comes from the gtag('config') call in each case-study page's <head>.
 */
(function () {
  function track(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  }

  const CONTACT_METHODS = [
    ['mail.google.com', 'email'],
    ['mailto:', 'email'],
    ['linkedin.com/in/harshitaak', 'linkedin'],
    ['instagram.com/harshittaak', 'instagram']
  ];

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href');
      const match = CONTACT_METHODS.find(function (m) { return href.includes(m[0]); });
      if (match) {
        track('contact_click', {
          method: match[1],
          link_location: link.closest('#footer') ? 'footer' : link.closest('#header') ? 'header' : 'page'
        });
      }
      if (link.classList.contains('portfolio-link')) {
        // "Samsung%20Fam.html" -> "Samsung Fam", matching project_name on that page
        track('select_content', {
          content_type: 'case_study',
          item_id: decodeURIComponent(href.split('/').pop().replace(/\.html$/, ''))
        });
      }
    }

    const filter = e.target.closest('.isotope-filters li');
    if (filter) {
      track('portfolio_filter', { filter_name: filter.textContent.trim() });
    }
  });

  // Case-study scroll depth. GA4's built-in scroll event only fires at 90%.
  const config = (window.dataLayer || []).find(function (args) {
    return args[0] === 'config' && args[2] && args[2].project_name;
  });
  if (!config) return;

  const projectName = config[2].project_name;
  const thresholds = [25, 50, 75, 100];

  function checkScrollDepth() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
    while (thresholds.length && percent >= thresholds[0] - 1) {
      track('case_study_scroll', {
        project_name: projectName,
        percent_scrolled: thresholds.shift()
      });
    }
    if (!thresholds.length) {
      window.removeEventListener('scroll', checkScrollDepth);
    }
  }

  window.addEventListener('scroll', checkScrollDepth, { passive: true });
})();
