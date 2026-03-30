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
  } catch (e) {
    /* ignore private mode / denied storage */
  }
})();
