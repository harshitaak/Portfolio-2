/**
 * Runs synchronously in <head> before main.css so light mode paints correctly
 * on full page navigations (avoids flash of dark theme when pref is light).
 * Also picks the favicon variant, which tracks the OS scheme rather than this one.
 */
(function () {
  try {
    var key = 'theme-preference';
    var pref = localStorage.getItem(key);
    if (!pref) {
      pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (pref === 'light') {
      document.documentElement.classList.add('light-mode');
    }

    // First load of the session gets the navbar intro; internal navigations don't,
    // so the header stays put across view transitions. Flag is set immediately
    // rather than on animation end so back/forward can't replay it.
    if (!sessionStorage.getItem('nav-intro-seen')) {
      document.documentElement.classList.add('first-load');
      sessionStorage.setItem('nav-intro-seen', '1');
    }
  } catch (e) {
    /* ignore private mode / denied storage */
  }

  // The favicon follows the OS colour scheme rather than the site's .light-mode
  // class: it is painted on the browser's tab strip, whose background the page does
  // not control. Swapping it here in JS rather than relying on the
  // @media (prefers-color-scheme) rule inside favicon.svg, because Chrome ignores
  // that rule for favicons (crbug.com/1311553) and renders the light-mode colour.
  // Separate try from the block above so denied storage cannot skip this.
  try {
    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    var paintFavicon = function () {
      var link = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
      if (!link) return;

      var href = darkQuery.matches
        ? 'assets/img/favicon-dark.svg'
        : 'assets/img/favicon.svg';
      if (link.getAttribute('href') === href) return;

      // Chrome only re-reads the icon when the <link> element itself is replaced,
      // not when href alone changes on the existing node.
      var next = link.cloneNode(false);
      next.setAttribute('href', href);
      link.parentNode.replaceChild(next, link);
    };

    paintFavicon();
    darkQuery.addEventListener('change', paintFavicon);
  } catch (e) {
    /* leave the static favicon in place */
  }
})();
