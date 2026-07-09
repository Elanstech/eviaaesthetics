/* =============================================================================
   EVIAESTHETICS — ABOUT.JS (ES6 module)
   Editorial magazine redesign · about page layer
   -----------------------------------------------------------------------------
   Loaded with <script type="module"> alongside script.js, which already
   handles: header glass, drawer, [data-reveal], [data-count] counters,
   [data-parallax], back-to-top, and in-page anchor clicks.

   This file adds the page-specific modules:
     ScrollProgress · DeepLink (offset fix for arriving at #abJourney etc.)
============================================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (selector, ctx = document) => ctx.querySelector(selector);

/** Offset that clears the fixed header */
const headerOffset = () => {
    const h = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
        10
    ) || 80;
    return h + 16;
};

const scrollToTarget = (target) => {
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
};

/* =============================================================================
   SCROLL PROGRESS — thin Hermès-orange bar along the top edge
============================================================================= */
class ScrollProgress {
    init() {
        this.bar = document.createElement('div');
        this.bar.style.cssText = `
            position: fixed; top: 0; left: 0; height: 2px; width: 0%;
            z-index: 1300; pointer-events: none;
            background: linear-gradient(90deg, #FF6B00, #FF8A33);
        `;
        document.body.appendChild(this.bar);

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            this.bar.style.width = height > 0 ? `${(scrolled / height) * 100}%` : '0%';
        }, { passive: true });
    }
}

/* =============================================================================
   DEEP LINK — land correctly when arriving with a hash from another page
   (e.g. index.html links to about.html#abJourney; the browser's native jump
   would hide the section top behind the fixed header)
============================================================================= */
class DeepLink {
    init() {
        const { hash } = window.location;
        if (!hash || hash.length < 2) return;
        const target = $(hash);
        if (!target) return;
        // Let fonts and layout settle before correcting the position
        setTimeout(() => scrollToTarget(target), 450);
    }
}

/* =============================================================================
   BOOT
============================================================================= */
const aboutModules = {
    scrollProgress: new ScrollProgress(),
    deepLink:       new DeepLink(),
};

const bootAbout = () => {
    Object.values(aboutModules).forEach(m => m.init());
    console.log('✦ Eviaesthetics — profile ready');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAbout);
} else {
    bootAbout();
}

window.EviaAbout = { reinit: bootAbout, modules: aboutModules };
