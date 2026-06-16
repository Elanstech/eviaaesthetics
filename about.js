/* =============================================================================
   ABOUT.JS — Eviaesthetics
   Page-specific: animated count-up for the hero stats. Runs alongside script.js.
============================================================================= */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nums = Array.from(document.querySelectorAll('.ab-stat-num[data-count]'));
    if (!nums.length) return;

    const format = (n) => n.toLocaleString('en-US');

    const run = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || '';

        if (reduceMotion) { el.textContent = format(target) + suffix; return; }

        const duration = 1600;
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = format(Math.round(target * ease(p))) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                run(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    nums.forEach(el => io.observe(el));
})();
