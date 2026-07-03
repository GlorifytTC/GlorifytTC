/* scroll-fx.js — adds scroll-reveal, parallax depth and 3D card tilt to the
   existing site WITHOUT changing any colours, logo or layout. Pure motion,
   layered on top. Safe to include on any page; respects reduced-motion and
   degrades gracefully if features/elements are missing. */
(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function injectCss() {
        if (document.getElementById('scroll-fx-styles')) return;
        var css = '' +
            '[data-reveal]{opacity:0;transform:translateY(30px)}' +
            '[data-reveal].fx-go{animation:fxRise .75s cubic-bezier(.2,.7,.2,1) both}' +
            '@keyframes fxRise{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}' +
            '.fx-tilt{transition:transform .3s cubic-bezier(.2,.7,.2,1)}' +
            '.fx-parallax{will-change:transform}';
        var s = document.createElement('style');
        s.id = 'scroll-fx-styles';
        s.textContent = css;
        document.head.appendChild(s);
    }

    function setupReveal() {
        if (!('IntersectionObserver' in window)) return;

        var selectors = [
            '.section-header', '.service-card', '.feature-card', '.pricing-card',
            '.stat-item', '.promo-content', '.promo-icon', '.cta-container',
            '.footer-section', '.info-card', '.team-card', '.blog-card',
            '.blog-post', '.value-card', '.timeline-item', '.contact-grid > div',
            '.featured-card', '.post-card', '.mv-card', '.founder-card',
            '.expertise-card', '.expertise-item'
        ];
        var nodes = [];
        selectors.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                if (nodes.indexOf(el) === -1) nodes.push(el);
            });
        });
        if (!nodes.length) return;

        nodes.forEach(function (el) {
            el.setAttribute('data-reveal', '');
            var sibs = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [el];
            var i = sibs.indexOf(el);
            el.dataset.fxDelay = Math.min(i, 6) * 90;
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target;
                el.style.animationDelay = (el.dataset.fxDelay || 0) + 'ms';
                el.classList.add('fx-go');
                el.addEventListener('animationend', function () {
                    el.classList.remove('fx-go');
                    el.removeAttribute('data-reveal');
                    el.style.animationDelay = '';
                }, { once: true });
                io.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        nodes.forEach(function (el) { io.observe(el); });
    }

    function setupParallax() {
        var circles = document.querySelectorAll('.bg-circle');
        var robot = document.querySelector('.robot');
        if (!circles.length && !robot) return;

        var sy = 0, mx = 0, my = 0, ticking = false;

        function apply() {
            ticking = false;
            circles.forEach(function (c, idx) {
                var depth = idx === 0 ? 0.12 : -0.08;
                c.style.transform = 'translate3d(' + (mx * (10 + idx * 6)) + 'px,' + (sy * depth + my * (8 + idx * 6)) + 'px,0)';
            });
            if (robot) {
                robot.style.transform = 'translate3d(' + (mx * 14) + 'px,' + (sy * 0.06 + my * 14) + 'px,0)';
            }
        }
        function request() { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }

        window.addEventListener('scroll', function () { sy = window.scrollY; request(); }, { passive: true });
        var hero = document.querySelector('.hero');
        (hero || window).addEventListener('mousemove', function (ev) {
            mx = (ev.clientX / window.innerWidth - 0.5);
            my = (ev.clientY / window.innerHeight - 0.5);
            request();
        });
    }

    function setupTilt() {
        if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
        var cards = document.querySelectorAll('.service-card, .feature-card, .pricing-card');
        cards.forEach(function (card) {
            card.classList.add('fx-tilt');
            card.addEventListener('mousemove', function (ev) {
                var r = card.getBoundingClientRect();
                var px = (ev.clientX - r.left) / r.width - 0.5;
                var py = (ev.clientY - r.top) / r.height - 0.5;
                card.style.transform = 'perspective(800px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 5).toFixed(2) + 'deg) translateY(-6px)';
            });
            card.addEventListener('mouseleave', function () { card.style.transform = ''; });
        });
    }

    function init() {
        if (reduce) return;
        injectCss();
        setupReveal();
        setupParallax();
        setupTilt();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
