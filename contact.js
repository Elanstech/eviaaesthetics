/* =============================================================================
   EVIAESTHETICS — CONTACT.JS (ES6 module)
   Editorial magazine redesign · contact page layer
   -----------------------------------------------------------------------------
   Loaded with <script type="module"> alongside script.js, which already
   handles: header glass, drawer, [data-reveal], back-to-top, and in-page
   anchor clicks.

   This file adds the page-specific modules:
     FormFlash (highlight the form card when jumped to) ·
     DeepLink (offset fix for arriving at #contact-form from another page) ·
     ScrollProgress
============================================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $  = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

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
   FORM FLASH — gently highlight the form card when the user jumps to it
   via any #contact-form link (styles live in contact.css: .ct-flash)
============================================================================= */
class FormFlash {
    constructor() {
        this.card = $('#ctFormCard');
    }

    init() {
        if (!this.card) return;

        $$('a[href$="#contact-form"], a[href="#contact-form"]').forEach(link =>
            link.addEventListener('click', () => setTimeout(() => this.flash(), 650))
        );

        if (window.location.hash === '#contact-form') {
            setTimeout(() => this.flash(), 900);
        }
    }

    flash() {
        this.card.classList.add('ct-flash');
        setTimeout(() => this.card.classList.remove('ct-flash'), 1400);
    }
}

/* =============================================================================
   DEEP LINK — land correctly when arriving with a hash from another page
   (every other page's "Book Consultation" points at contact.html#contact-form)
============================================================================= */
class DeepLink {
    init() {
        const { hash } = window.location;
        if (!hash || hash.length < 2) return;
        const target = $(hash);
        if (!target) return;
        setTimeout(() => scrollToTarget(target), 450);
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
   BOOT
============================================================================= */
const contactModules = {
    formFlash:      new FormFlash(),
    deepLink:       new DeepLink(),
    scrollProgress: new ScrollProgress(),
};

const bootContact = () => {
    Object.values(contactModules).forEach(m => m.init());
    console.log('✦ Eviaesthetics — correspondence ready');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootContact);
} else {
    bootContact();
}

window.EviaContact = { reinit: bootContact, modules: contactModules };
