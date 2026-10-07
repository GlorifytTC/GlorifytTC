/* GlorifyTC hero bit rain
   Columns of 0s and 1s falling from top to bottom, in the site's own colours.
   Draws into <canvas id="heroBits"> on the home page. Colours come from the
   site tokens (--accent, --ink). Pauses when the hero is off screen, does no
   work on phones (the container is hidden there), and stands still for
   visitors who prefer reduced motion. */
(function () {
    var canvas = document.getElementById('heroBits');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');

    var S = 360;                       /* logical drawing size, scaled to the real size */
    var CELL = 18;                     /* one glyph per cell */
    var COLS = S / CELL;
    var ROWS = S / CELL;
    var TRAIL = 12;                    /* glyphs in the fading tail behind each head */
    var CYCLE = ROWS + TRAIL;          /* rows a drop travels before it restarts at the top */
    var MIN_SPEED = 4;                 /* rows per second */
    var MAX_SPEED = 11;
    var FRAME_MS = 1000 / 30;
    var MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* --- colours from the site tokens --- */
    function rgbOf(token, fallback) {
        var raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
        var m = /^#([0-9a-f]{6})$/i.exec(raw);
        if (!m) return fallback;
        var n = parseInt(m[1], 16);
        return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
    }
    var ACCENT = rgbOf('--accent', '0,209,255');
    var INK = rgbOf('--ink', '233,243,248');

    /* --- columns --- */
    function bit() { return Math.random() < 0.5 ? '0' : '1'; }
    function speed() { return MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED); }
    var columns = [];
    for (var c = 0; c < COLS; c++) {
        var glyphs = [];
        for (var r = 0; r < ROWS; r++) glyphs.push(bit());
        columns.push({ head: Math.random() * CYCLE, speed: speed(), glyphs: glyphs });
    }

    /* soft edges so the rain has no visible box around it */
    function ramp(value, width) {
        var t = Math.max(0, Math.min(1, value / width));
        return t * t * (3 - 2 * t);
    }
    function edgeFade(col, row) {
        var side = ramp(Math.min(col, COLS - 1 - col) + 0.5, 3);
        var top = ramp(row + 0.5, 2.5);
        var bottom = ramp(ROWS - row - 0.5, 4);
        return side * top * bottom;
    }

    /* --- sizing: keep the canvas sharp at any width and pixel density --- */
    function resize() {
        var width = canvas.clientWidth;
        if (!width) return false;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var px = Math.round(width * dpr);
        if (canvas.width !== px) {
            canvas.width = px;
            canvas.height = px;
        }
        ctx.setTransform(px / S, 0, 0, px / S, 0, 0);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '600 14px ' + MONO;
        return true;
    }

    function step(dt) {
        for (var c = 0; c < COLS; c++) {
            var col = columns[c];
            col.head += col.speed * dt;
            if (col.head > CYCLE) {
                col.head = 0;
                col.speed = speed();
            }
            if (Math.random() < 0.1) col.glyphs[(Math.random() * ROWS) | 0] = bit();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, S, S);
        for (var c = 0; c < COLS; c++) {
            var col = columns[c];
            var x = c * CELL + CELL / 2;
            for (var r = 0; r < ROWS; r++) {
                /* two drops per column, half a cycle apart, so the rain stays full */
                var behind = col.head - r;
                if (behind < 0 || behind >= TRAIL) behind = ((col.head + CYCLE / 2) % CYCLE) - r;
                if (behind < 0 || behind >= TRAIL) continue;
                var alpha = (1 - behind / TRAIL) * edgeFade(c, r);
                if (alpha <= 0.02) continue;
                ctx.fillStyle = behind < 1
                    ? 'rgba(' + INK + ',' + alpha.toFixed(3) + ')'
                    : 'rgba(' + ACCENT + ',' + (alpha * 0.9).toFixed(3) + ')';
                ctx.fillText(col.glyphs[r], x, r * CELL + CELL / 2);
            }
        }
    }

    /* --- loop --- */
    var visible = !('IntersectionObserver' in window);
    var running = false;
    var last = 0;

    function frame(now) {
        if (!visible || document.hidden) { running = false; return; }
        var elapsed = now - last;
        if (elapsed >= FRAME_MS) {
            step(Math.min(0.1, elapsed / 1000));
            draw();
            last = now;
        }
        requestAnimationFrame(frame);
    }
    function start() {
        if (running || reduce || !visible || document.hidden) return;
        if (!resize()) return;
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
    }
    function drawStill() {
        if (resize()) draw();
    }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            if (visible) { if (reduce) drawStill(); else start(); }
        }).observe(canvas);
    } else if (reduce) {
        drawStill();
    } else {
        start();
    }

    document.addEventListener('visibilitychange', start);
    window.addEventListener('resize', function () {
        if (reduce) drawStill(); else if (running) resize(); else start();
    });
})();
