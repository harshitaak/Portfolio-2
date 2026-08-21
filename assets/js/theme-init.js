/**
 * Runs synchronously in <head> before main.css so light mode paints correctly
 * on full page navigations (avoids flash of dark theme when pref is light).
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
})();
