/* =============================================================================
   EVIAESTHETICS — SERVICES.JS (ES6 module)
   Editorial magazine redesign · services page layer
   -----------------------------------------------------------------------------
   Loaded with <script type="module"> alongside script.js, which already
   handles: header glass, drawer, [data-reveal], back-to-top, generic anchors.

   This file adds the page-specific modules:
     CategoryRail (arrows + scroll spy + smooth scroll) ·
     CareAccordions · ScrollProgress · DeepLink
============================================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $  = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

/** Offset that clears the fixed header + sticky category rail */
const railOffset = () => {
    const rail = $('#svStickyNav');
    return (rail ? rail.offsetHeight : 0) + 86;
};

const scrollToSection = (target) => {
    const top = target.getBoundingClientRect().top + window.pageYOffset - railOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
};

/* =============================================================================
   CATEGORY RAIL — horizontal index nav: arrows, scroll spy, smooth scroll
============================================================================= */
class CategoryRail {
    constructor() {
        this.rail     = $('#svStickyNav');
        this.track    = $('#svNavTrack');
        this.leftBtn  = $('#svNavLeft');
        this.rightBtn = $('#svNavRight');
        this.pills    = $$('.sv-rail-pill');
        this.sections = $$('.sv-section');
        this.isScrolling = false;
        this.scrollTimer = null;
    }

    init() {
        if (!this.rail || !this.track) return;
        this.setupArrows();
        this.setupPills();
        this.setupSpy();
        this.setupShadow();
    }

    setupArrows() {
        this.leftBtn?.addEventListener('click', () =>
            this.track.scrollBy({ left: -220, behavior: 'smooth' })
        );
        this.rightBtn?.addEventListener('click', () =>
            this.track.scrollBy({ left: 220, behavior: 'smooth' })
        );

        const updateArrows = () => {
            const { scrollLeft, scrollWidth, clientWidth } = this.track;
            if (this.leftBtn)  this.leftBtn.style.opacity  = scrollLeft > 5 ? '1' : '0.25';
            if (this.rightBtn) this.rightBtn.style.opacity = scrollLeft < scrollWidth - clientWidth - 5 ? '1' : '0.25';
        };
        this.track.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        updateArrows();
    }

    setupPills() {
        this.pills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                // Keep script.js's generic AnchorScroll from double-handling this click
                e.stopPropagation();

                const id = pill.dataset.target || pill.getAttribute('href')?.slice(1);
                const target = id && document.getElementById(id);
                if (!target) return;

                this.isScrolling = true;
                this.setActive(id);
                scrollToSection(target);

                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() => { this.isScrolling = false; }, 1000);
            });
        });

        // Footer / in-page links to #sv- sections use the rail offset too
        $$('a[href^="#sv-"]:not(.sv-rail-pill)').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = $(link.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                e.stopPropagation();
                scrollToSection(target);
            });
        });
    }

    setupSpy() {
        if (!this.sections.length || !('IntersectionObserver' in window)) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(({ isIntersecting, target }) => {
                if (isIntersecting && !this.isScrolling) this.setActive(target.id);
            });
        }, { rootMargin: '-180px 0px -55% 0px', threshold: 0 });

        this.sections.forEach(section => io.observe(section));
    }

    setActive(id) {
        this.pills.forEach(pill => {
            const on = pill.dataset.target === id;
            pill.classList.toggle('active', on);
            if (on) {
                const p = pill.getBoundingClientRect();
                const t = this.track.getBoundingClientRect();
                if (p.left < t.left || p.right > t.right) {
                    pill.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
                }
            }
        });
    }

    setupShadow() {
        const hero = $('#sv-hero');
        if (!hero || !('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver(([entry]) => {
            this.rail.classList.toggle('shadowed', !entry.isIntersecting);
        }, { threshold: 0 });
        io.observe(hero);
    }
}

/* =============================================================================
   CARE ACCORDIONS — pre/post treatment panels, one open at a time
============================================================================= */
class CareAccordions {
    constructor() {
        this.triggers = $$('.sv-care-trigger');
    }

    init() {
        if (!this.triggers.length) return;
        this.triggers.forEach(trigger =>
            trigger.addEventListener('click', () => this.toggle(trigger))
        );
    }

    toggle(trigger) {
        const body = document.getElementById(trigger.dataset.target);
        if (!body) return;

        const wasOpen = body.classList.contains('open');

        // Close all panels first
        $$('.sv-care-body.open').forEach(el => el.classList.remove('open'));
        this.triggers.forEach(t => {
            t.classList.remove('open');
            t.setAttribute('aria-expanded', 'false');
        });

        // Open the clicked one (unless it was already open)
        if (!wasOpen) {
            body.classList.add('open');
            trigger.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        }
    }
}

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
   DEEP LINK — land on the right section when arriving with a #sv- hash
============================================================================= */
class DeepLink {
    init() {
        const { hash } = window.location;
        if (!hash?.startsWith('#sv-')) return;
        const target = $(hash);
        if (!target) return;
        // Let layout (fonts, rail height) settle first
        setTimeout(() => scrollToSection(target), 500);
    }
}

/* =============================================================================
   BOOT
============================================================================= */
const servicesModules = {
    categoryRail:   new CategoryRail(),
    careAccordions: new CareAccordions(),
    scrollProgress: new ScrollProgress(),
    deepLink:       new DeepLink(),
};

const bootServices = () => {
    Object.values(servicesModules).forEach(m => m.init());
    console.log('✦ Eviaesthetics — services menu ready');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootServices);
} else {
    bootServices();
}

window.EviaServices = { reinit: bootServices, modules: servicesModules };
