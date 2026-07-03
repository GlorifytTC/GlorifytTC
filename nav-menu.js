/* nav-menu.js — shared mobile hamburger navigation for ALL pages.

   The site has a fragmented CSS setup: some pages load the shared
   styles.css, others load their own per-page stylesheet (Contact.css,
   About.css, …). To work everywhere regardless of which stylesheet a
   page uses, this script injects both the required CSS *and* the
   hamburger button, then wires up the slide-in menu defined in styles.css.
   Selectors are prefixed with `.navbar` so they out-specify the per-page
   `.nav-links { display:none }` rule, and colors are literal so they
   don't depend on each page's CSS variables. Safe to include on any page. */
(function () {
    var CSS = '' +
        'html, body { overflow-x: hidden; }' +
        '.nav-toggle {' +
        '  display: none; width: 2.7rem; height: 2.7rem;' +
        '  align-items: center; justify-content: center;' +
        '  background: rgba(255,255,255,0.05);' +
        '  border: 1px solid rgba(255,255,255,0.1);' +
        '  border-radius: 0.7rem; color: rgba(255,255,255,0.9);' +
        '  font-size: 1.15rem; cursor: pointer;' +
        '  transition: all 0.3s ease; position: relative; z-index: 1300;' +
        '}' +
        '.nav-toggle:hover { border-color: #00f5ff; color: #00f5ff; }' +
        '@media (max-width: 768px) {' +
        '  .nav-toggle { display: inline-flex; }' +
        '  .navbar .nav-right .cta-button { display: none; }' +
        '  .navbar .nav-links {' +
        '    display: flex; flex-direction: column; align-items: flex-start;' +
        '    gap: 0.25rem; position: fixed; top: 0; right: 0; height: 100vh;' +
        '    width: min(80vw, 320px); padding: 5.5rem 1.75rem 2rem;' +
        '    background: rgba(0,0,0,0.97);' +
        '    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);' +
        '    border-left: 1px solid rgba(255,255,255,0.1);' +
        '    box-shadow: -10px 0 40px rgba(0,0,0,0.5);' +
        '    transform: translateX(100%);' +
        '    transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);' +
        '    z-index: 1200; overflow-y: auto;' +
        '  }' +
        '  .navbar .nav-links.open { transform: translateX(0); }' +
        '  .navbar .nav-links a {' +
        '    width: 100%; padding: 0.85rem 0; font-size: 1.05rem;' +
        '    border-bottom: 1px solid rgba(255,255,255,0.05);' +
        '  }' +
        '  .navbar .nav-links a::after { display: none; }' +
        '}';

    function injectCss() {
        if (document.getElementById('nav-menu-styles')) return;
        var style = document.createElement('style');
        style.id = 'nav-menu-styles';
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    function init() {
        injectCss();

        var navRight = document.querySelector('.navbar .nav-right');
        var navLinks = document.querySelector('.navbar .nav-links');
        if (!navRight || !navLinks) return;

        // If a page already manages its own toggle (e.g. emailbot.js), skip.
        if (document.getElementById('navToggle')) return;

        var toggle = document.createElement('button');
        toggle.className = 'nav-toggle';
        toggle.id = 'navToggle';
        toggle.setAttribute('aria-label', 'Menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        navRight.appendChild(toggle);

        function setOpen(open) {
            navLinks.classList.toggle('open', open);
            toggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            toggle.setAttribute('aria-expanded', open);
        }

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            setOpen(!navLinks.classList.contains('open'));
        });

        navLinks.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { setOpen(false); });
        });

        document.addEventListener('click', function (e) {
            if (navLinks.classList.contains('open') &&
                !navLinks.contains(e.target) && !toggle.contains(e.target)) {
                setOpen(false);
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
