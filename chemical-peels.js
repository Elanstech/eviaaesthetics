/* ================================================================
   CHEMICAL PEELS & MESOTHERAPY – Landing Page JavaScript
   Eviaesthetics Manhattan Medical Spa
   
   ES6 Class Architecture
   Dependencies: AOS library (loaded globally), script.js (shared)
   ================================================================ */

'use strict';

/**
 * FAQ Accordion Controller
 * Manages expand/collapse behavior for FAQ items
 */
class FAQAccordion {
    constructor() {
        this.items = document.querySelectorAll('.cp-faq-item');
        this.activeItem = null;

        if (this.items.length) {
            this.init();
        }
    }

    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.cp-faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggle(item));
            }
        });
    }

    toggle(item) {
        if (this.activeItem && this.activeItem !== item) {
            this.close(this.activeItem);
        }

        if (item.classList.contains('cp-faq-active')) {
            this.close(item);
        } else {
            this.open(item);
        }
    }

    open(item) {
        item.classList.add('cp-faq-active');
        this.activeItem = item;

        const answer = item.querySelector('.cp-faq-answer');
        if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    }

    close(item) {
        item.classList.remove('cp-faq-active');

        const answer = item.querySelector('.cp-faq-answer');
        if (answer) {
            answer.style.maxHeight = '0';
        }

        if (this.activeItem === item) {
            this.activeItem = null;
        }
    }
}


/**
 * Scroll Indicator Controller
 * Hides the scroll-down indicator once user scrolls past hero
 */
class ScrollIndicator {
    constructor() {
        this.el = document.getElementById('cpScrollIndicator');
        this.threshold = 200;
        this.hidden = false;

        if (this.el) {
            this.init();
        }
    }

    init() {
        // Click to smooth scroll past hero
        this.el.addEventListener('click', () => {
            const target = document.getElementById('why-peels');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Hide on scroll
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }

    onScroll() {
        const scrolled = window.scrollY > this.threshold;

        if (scrolled && !this.hidden) {
            this.el.classList.add('cp-hidden');
            this.hidden = true;
        } else if (!scrolled && this.hidden) {
            this.el.classList.remove('cp-hidden');
            this.hidden = false;
        }
    }
}


/**
 * Smooth Scroll Handler
 * Intercepts anchor links that point to sections on this page
 */
class SmoothScrollLinks {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');

        if (this.links.length) {
            this.init();
        }
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const headerOffset = 80;
                        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                }
            });
        });
    }
}


/**
 * Stats Counter Animation
 * Animates hero stat numbers when they come into view
 */
class StatsAnimator {
    constructor() {
        this.stats = document.querySelectorAll('.cp-stat-number');
        this.animated = false;

        if (this.stats.length) {
            this.init();
        }
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated) {
                        this.animated = true;
                        this.animateAll();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );

        const container = document.querySelector('.cp-hero-stats');
        if (container) {
            observer.observe(container);
        }
    }

    animateAll() {
        this.stats.forEach(stat => {
            const text = stat.textContent.trim();
            const match = text.match(/^([\d,]+)(\+|%|K\+)?$/);

            if (match) {
                const rawNum = parseInt(match[1].replace(/,/g, ''), 10);
                const suffix = match[2] || '';
                this.countUp(stat, rawNum, suffix, 1500);
            }
        });
    }

    countUp(el, target, suffix, duration) {
        const start = 0;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * eased);

            el.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    }
}


/**
 * Treatment Card Hover Parallax
 * Subtle tilt effect on treatment cards (desktop only)
 */
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.cp-treatment-card');
        this.isDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches;

        if (this.cards.length && this.isDesktop) {
            this.init();
        }
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.onMove(e, card));
            card.addEventListener('mouseleave', () => this.onLeave(card));
        });
    }

    onMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
            perspective(800px)
            translateY(-8px)
            rotateX(${y * -4}deg)
            rotateY(${x * 4}deg)
        `;
    }

    onLeave(card) {
        card.style.transform = '';
    }
}


/**
 * Main App – Bootstraps all page modules
 */
class ChemicalPeelsApp {
    constructor() {
        this.modules = {};
    }

    init() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 60,
                disable: 'mobile'
            });
        }

        // Bootstrap modules
        this.modules.faq = new FAQAccordion();
        this.modules.scrollIndicator = new ScrollIndicator();
        this.modules.smoothScroll = new SmoothScrollLinks();
        this.modules.stats = new StatsAnimator();
        this.modules.cardTilt = new CardTilt();
    }
}

// Launch
document.addEventListener('DOMContentLoaded', () => {
    const app = new ChemicalPeelsApp();
    app.init();
});
