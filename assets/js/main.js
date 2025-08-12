/**
* Template Name: Personal
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Updated: Mar 05 2025 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Hide header on scroll down, show on scroll up
   */
  (function setupHideOnScrollHeader() {
    const bodyEl = document.body;
    const headerEl = document.getElementById('header');
    if (!headerEl) return;

    let lastY = window.scrollY;
    let ticking = false;
    const threshold = 8; // ignore micro scrolls

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      if (Math.abs(delta) < threshold) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (delta > 0 && y > 80) {
            // scrolling down
            bodyEl.classList.add('hide-header');
          } else {
            // scrolling up
            bodyEl.classList.remove('hide-header');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });



  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
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
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

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
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

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
   * Initiate glightbox
   * For Doodles (#doodles-grid), override ordering so next follows row-wise visual order
   */
  let glightbox = GLightbox({ selector: '.glightbox' });

  (function setupDoodlesLightbox() {
    const grid = document.getElementById('doodles-grid');
    if (!grid || typeof GLightbox !== 'function') return;

    // Destroy generic instance to avoid duplicate handlers on Doodles page
    if (glightbox && typeof glightbox.destroy === 'function') {
      glightbox.destroy();
      glightbox = null;
    }

    function computeSorted() {
      const anchors = Array.from(grid.querySelectorAll('.glightbox'));
      const tolerance = 24; // px threshold to treat same row
      const items = anchors.map(a => ({ a, rect: a.getBoundingClientRect() }));
      items.sort((i1, i2) => {
        const dy = i1.rect.top - i2.rect.top;
        if (Math.abs(dy) > tolerance) return dy;
        return i1.rect.left - i2.rect.left;
      });
      const elements = items.map(i => ({ href: i.a.getAttribute('href'), type: 'image' }));
      const orderAnchors = items.map(i => i.a);
      return { elements, orderAnchors };
    }

    let sorted = null;
    let doodlesLightbox = null;

    grid.addEventListener('click', function (e) {
      const link = e.target.closest('a.glightbox');
      if (!link || !grid.contains(link)) return;
      e.preventDefault();
      if (!sorted) sorted = computeSorted();
      if (!doodlesLightbox) doodlesLightbox = GLightbox({ elements: sorted.elements });
      const index = Math.max(0, sorted.orderAnchors.indexOf(link));
      doodlesLightbox.openAt(index);
    });
  })();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

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
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });


  
  window.addEventListener('load', function() {
    new Swiper('.my-carousel', {
      loop: true,
      navigation: {
        nextEl: '.my-carousel .swiper-button-next',
        prevEl: '.my-carousel .swiper-button-prev'
      },
      pagination: {
        el: '.my-carousel .swiper-pagination',
        clickable: true
      },
      slidesPerView: 1,
      spaceBetween: 30
    });
  });

})();

// Old theme toggle implementation removed - replaced with modern data-theme approach below


// Theme toggle using .light-mode class approach
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const storageKey = 'theme-preference';

  // Get saved theme preference or system preference
  function getThemePreference() {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply theme to body class
  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.add('light-mode');
    } else {
      body.classList.remove('light-mode');
    }
    
    // Update aria-label for accessibility
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
    
    console.log('Theme applied:', theme); // Debug log
  }

  // Save theme preference
  function saveTheme(theme) {
    localStorage.setItem(storageKey, theme);
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    applyTheme(newTheme);
    saveTheme(newTheme);
    
    console.log('Theme toggled from', currentTheme, 'to', newTheme); // Debug log
  }

  // Initialize theme
  const initialTheme = getThemePreference();
  applyTheme(initialTheme);

  // Add click listener
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Sync with system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const systemTheme = e.matches ? 'dark' : 'light';
    applyTheme(systemTheme);
    saveTheme(systemTheme);
  });
});
        

//Draw plugin
gsap.registerPlugin(DrawSVGPlugin);

function initDrawRandomUnderline() {
  const svgVariants = [
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 20.9999C26.7762 16.2245 49.5532 11.5572 71.7979 14.6666C84.9553 16.5057 97.0392 21.8432 109.987 24.3888C116.413 25.6523 123.012 25.5143 129.042 22.6388C135.981 19.3303 142.586 15.1422 150.092 13.3333C156.799 11.7168 161.702 14.6225 167.887 16.8333C181.562 21.7212 194.975 22.6234 209.252 21.3888C224.678 20.0548 239.912 17.991 255.42 18.3055C272.027 18.6422 288.409 18.867 305 17.9999" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 24.2592C26.233 20.2879 47.7083 16.9968 69.135 13.8421C98.0469 9.5853 128.407 4.02322 158.059 5.14674C172.583 5.69708 187.686 8.66104 201.598 11.9696C207.232 13.3093 215.437 14.9471 220.137 18.3619C224.401 21.4596 220.737 25.6575 217.184 27.6168C208.309 32.5097 197.199 34.281 186.698 34.8486C183.159 35.0399 147.197 36.2657 155.105 26.5837C158.11 22.9053 162.993 20.6229 167.764 18.7924C178.386 14.7164 190.115 12.1115 201.624 10.3984C218.367 7.90626 235.528 7.06127 252.521 7.49276C258.455 7.64343 264.389 7.92791 270.295 8.41825C280.321 9.25056 296 10.8932 305 13.0242" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 29.5014C9.61174 24.4515 12.9521 17.9873 20.9532 17.5292C23.7742 17.3676 27.0987 17.7897 29.6575 19.0014C33.2644 20.7093 35.6481 24.0004 39.4178 25.5014C48.3911 29.0744 55.7503 25.7731 63.3048 21.0292C67.9902 18.0869 73.7668 16.1366 79.3721 17.8903C85.1682 19.7036 88.2173 26.2464 94.4121 27.2514C102.584 28.5771 107.023 25.5064 113.276 20.6125C119.927 15.4067 128.83 12.3333 137.249 15.0014C141.418 16.3225 143.116 18.7528 146.581 21.0014C149.621 22.9736 152.78 23.6197 156.284 24.2514C165.142 25.8479 172.315 17.5185 179.144 13.5014C184.459 10.3746 191.785 8.74853 195.868 14.5292C199.252 19.3205 205.597 22.9057 211.621 22.5014C215.553 22.2374 220.183 17.8356 222.979 15.5569C225.4 13.5845 227.457 11.1105 230.742 10.5292C232.718 10.1794 234.784 12.9691 236.164 14.0014C238.543 15.7801 240.717 18.4775 243.356 19.8903C249.488 23.1729 255.706 21.2551 261.079 18.0014C266.571 14.6754 270.439 11.5202 277.146 13.6125C280.725 14.7289 283.221 17.209 286.393 19.0014C292.321 22.3517 298.255 22.5014 305 22.5014" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.0039 32.6826C32.2307 32.8412 47.4552 32.8277 62.676 32.8118C67.3044 32.807 96.546 33.0555 104.728 32.0775C113.615 31.0152 104.516 28.3028 102.022 27.2826C89.9573 22.3465 77.3751 19.0254 65.0451 15.0552C57.8987 12.7542 37.2813 8.49399 44.2314 6.10216C50.9667 3.78422 64.2873 5.81914 70.4249 5.96641C105.866 6.81677 141.306 7.58809 176.75 8.59886C217.874 9.77162 258.906 11.0553 300 14.4892" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99805 20.9998C65.6267 17.4649 126.268 13.845 187.208 12.8887C226.483 12.2723 265.751 13.2796 304.998 13.9998" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 29.8857C52.3147 26.9322 99.4329 21.6611 146.503 17.1765C151.753 16.6763 157.115 15.9505 162.415 15.6551C163.28 15.6069 165.074 15.4123 164.383 16.4275C161.704 20.3627 157.134 23.7551 153.95 27.4983C153.209 28.3702 148.194 33.4751 150.669 34.6605C153.638 36.0819 163.621 32.6063 165.039 32.2029C178.55 28.3608 191.49 23.5968 204.869 19.5404C231.903 11.3436 259.347 5.83254 288.793 5.12258C294.094 4.99476 299.722 4.82265 305 5.45025" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`
  ];
  // Add attributes to <svg> elements
  function decorateSVG(svgEl) {
    svgEl.setAttribute('class', 'text-draw__box-svg');
    svgEl.setAttribute('preserveAspectRatio', 'none');
    svgEl.querySelectorAll('path').forEach(path => {
      path.setAttribute('stroke', 'currentColor');
    });
  }
            const containers = document.querySelectorAll('[draw-line]');
  console.log('Found draw line containers:', containers.length);
  
  containers.forEach((container, index) => {
                const box = container.querySelector('[draw-line-box]');
    console.log(`Container ${index}:`, container, 'Box:', box);
    if (!box) return;
    let enterTween = null;
    let leaveTween = null;
    container.addEventListener('mouseenter', () => {
      // Don't restart if still playing
      if (enterTween && enterTween.isActive()) return;
      if (leaveTween && leaveTween.isActive()) leaveTween.kill();
      
      // Get the specified line style from attribute
      const lineStyle = parseInt(box.getAttribute('draw-line-style')) || 0;
      const selectedIndex = lineStyle % svgVariants.length; // Ensure it's within bounds
      
      // Animate Draw
      box.innerHTML = svgVariants[selectedIndex];
      const svg = box.querySelector('svg');
      if (svg) {
        decorateSVG(svg);
        const path = svg.querySelector('path');
        if (path) {
          gsap.set(path, { drawSVG: '0%' });
          enterTween = gsap.to(path, {
            duration: 0.5,
            drawSVG: '100%',
            ease: 'power2.inOut',
            onComplete: () => { enterTween = null; }
          });
        }
      }
    });
    container.addEventListener('mouseleave', () => {
      // Do nothing on mouse leave - line stays visible
    });
    
    // Add click event to make line disappear
    container.addEventListener('click', () => {
      const path = box.querySelector('path');
      if (!path) return;
      
      const playOut = () => {
        // Don't restart if still drawing out
        if (leaveTween && leaveTween.isActive()) return;
        leaveTween = gsap.to(path, {
          duration: 0.5,
          drawSVG: '100% 100%',
          ease: 'power2.inOut',
          onComplete: () => {
            leaveTween = null;
            box.innerHTML = ''; // remove SVG when done
          }
        });
      };
      
      if (enterTween && enterTween.isActive()) {
        // Wait until draw-in finishes
        enterTween.eventCallback('onComplete', playOut);
      } else {
        playOut();
      }
    });
  });
}
// Initialize Draw Random Underline
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing draw line effect...');
  initDrawRandomUnderline();
});

// Also try initializing after a short delay to ensure GSAP is loaded
setTimeout(function() {
  console.log('Delayed initialization of draw line effect...');
  initDrawRandomUnderline();
}, 100);

// Smooth snap scroll enhancement (applies only on pages with .snapscroll)
document.addEventListener('DOMContentLoaded', function() {
  const hasSnapScroll = document.documentElement.classList.contains('snapscroll') || document.body.classList.contains('snapscroll');
  if (!hasSnapScroll) return;

  let isAnimating = false;
  let scrollTimeoutId = null;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function getScrollPaddingTop() {
    // For center-snap pages, do not add any top padding offset
    if (
      document.documentElement.classList.contains('center-snap') ||
      document.body.classList.contains('center-snap')
    ) {
      return 0;
    }
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const rootVal = rootStyle.scrollPaddingTop;
    const bodyVal = bodyStyle.scrollPaddingTop;
    const rootPad = parseFloat(rootVal);
    const bodyPad = parseFloat(bodyVal);
    if (!Number.isNaN(rootPad)) return rootPad;
    if (!Number.isNaN(bodyPad)) return bodyPad;
    // default fallback when unspecified
    return 80;
  }

  function animateScrollTo(targetY, durationMs) {
    const startY = window.scrollY;
    const delta = targetY - startY;
    if (Math.abs(delta) < 1) return;
    const duration = Math.max(250, Math.min(durationMs || 650, 1200));
    isAnimating = true;
    const startTs = performance.now();
    function step(now) {
      const t = Math.min((now - startTs) / duration, 1);
      const eased = easeOutCubic(t);
      window.scrollTo(0, startY + delta * eased);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        isAnimating = false;
      }
    }
    requestAnimationFrame(step);
  }

  function getSnapTargets() {
    // Match the CSS snap targets
    return Array.from(document.querySelectorAll('.page-title, section, .section'))
      .filter((el) => el.offsetParent !== null);
  }

  function findNearestSnapY() {
    const y = window.scrollY;
    const paddingTop = getScrollPaddingTop();
    let nearestY = null;
    let nearestDist = Infinity;
    for (const el of getSnapTargets()) {
      const elTop = y + el.getBoundingClientRect().top;
      const targetY = Math.max(0, Math.round(elTop - paddingTop));
      const dist = Math.abs(targetY - y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestY = targetY;
      }
    }
    return nearestY;
  }

  function scheduleSnap() {
    if (isAnimating) return;
    if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
    scrollTimeoutId = setTimeout(() => {
      // Avoid snapping while user is interacting with carousels (heuristic)
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.closest('.swiper') || activeEl.closest('[contenteditable="true"]'))) return;
      const targetY = findNearestSnapY();
      if (targetY == null) return;
      animateScrollTo(targetY, 650);
    }, 120);
  }

  // Listeners
  window.addEventListener('scroll', scheduleSnap, { passive: true });
  window.addEventListener('wheel', () => { if (scrollTimeoutId) clearTimeout(scrollTimeoutId); }, { passive: true });
  window.addEventListener('touchstart', () => { if (scrollTimeoutId) clearTimeout(scrollTimeoutId); }, { passive: true });
  window.addEventListener('touchend', scheduleSnap, { passive: true });
});