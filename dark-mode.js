// GlorifyTC — Dark mode toggle + localStorage persistence
(function () {
  var KEY = 'glorifytc_theme';
  var root = document.documentElement;

  function setTheme(dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(KEY, dark ? 'dark' : 'light');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTheme(root.getAttribute('data-theme') !== 'dark');
      });
    });
  });
})();
