/* space-bg.js — adds faint floating AI / data-science / tech symbols as a
   fixed BACKGROUND layer behind the existing site. No black hole. Does not
   change layout, colours, logo or content — it only sits behind everything
   (z-index:-1) at low opacity so it never disturbs reading. */
(function () {
    if (document.getElementById('space-bg')) return;

    var css = '' +
        '#space-bg{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none}' +
        '#space-bg .sb-it{position:absolute;color:#00f5ff;opacity:.12;' +
        'animation:sbFloat 14s ease-in-out infinite;will-change:transform}' +
        '#space-bg .sb-it.alt{color:#ffffff;opacity:.09}' +
        '@keyframes sbFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-22px) rotate(6deg)}}' +
        '@media (prefers-reduced-motion: reduce){#space-bg .sb-it{animation:none}}';
    var style = document.createElement('style');
    style.id = 'space-bg-styles';
    style.textContent = css;
    document.head.appendChild(style);

    var bg = document.createElement('div');
    bg.id = 'space-bg';
    bg.setAttribute('aria-hidden', 'true');

    /* AI + data-science themed symbols. b:1 = Font Awesome brand icon (fab). */
    var items = [
        { c: 'fa-python', b: 1 }, { c: 'fa-brain', b: 0 }, { c: 'fa-r-project', b: 1 },
        { c: 'fa-robot', b: 0 }, { c: 'fa-chart-line', b: 0 }, { c: 'fa-database', b: 0 },
        { c: 'fa-network-wired', b: 0 }, { c: 'fa-microchip', b: 0 }, { c: 'fa-diagram-project', b: 0 },
        { c: 'fa-flask', b: 0 }, { c: 'fa-square-root-variable', b: 0 }, { c: 'fa-wave-square', b: 0 },
        { c: 'fa-js', b: 1 }, { c: 'fa-aws', b: 1 }, { c: 'fa-code', b: 0 }, { c: 'fa-docker', b: 1 }
    ];

    var spots = [[9, 7], [20, 70], [15, 38], [33, 13], [45, 83], [58, 19],
                 [69, 63], [80, 33], [88, 75], [52, 49], [28, 88], [74, 88],
                 [40, 5], [12, 54], [63, 42], [83, 8]];

    items.forEach(function (it, i) {
        var el = document.createElement('i');
        el.className = (it.b ? 'fab ' : 'fas ') + it.c + ' sb-it' + (i % 2 ? ' alt' : '');
        var p = spots[i % spots.length];
        el.style.top = p[0] + '%';
        el.style.left = p[1] + '%';
        el.style.fontSize = (1.7 + Math.random() * 2.2).toFixed(2) + 'rem';
        el.style.animationDelay = (-Math.random() * 14).toFixed(2) + 's';
        el.style.animationDuration = (11 + Math.random() * 7).toFixed(1) + 's';
        bg.appendChild(el);
    });

    document.body.appendChild(bg);
})();
