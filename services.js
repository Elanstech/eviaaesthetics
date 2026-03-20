/**
 * =============================================================================
 * EVIAESTHETICS - SERVICES PAGE JAVASCRIPT (REDESIGN)
 * Sticky nav, care toggles, scroll spy, smooth scroll, animations
 * =============================================================================
 */
'use strict';

class ServicesPageController {
    constructor() {
        // Sticky Nav
        this.stickyNav = document.getElementById('svStickyNav');
        this.navTrack = document.getElementById('svNavTrack');
        this.navPills = document.querySelectorAll('.sv-nav-pill');
        this.navLeftBtn = document.getElementById('svNavLeft');
        this.navRightBtn = document.getElementById('svNavRight');

        // Sections
        this.sections = document.querySelectorAll('.sv-section');

        // Care toggles
        this.careTriggers = document.querySelectorAll('.sv-care-trigger');

        // Scroll state
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.headerOffset = 140;

        this.init();
    }

    init() {
        this.setupStickyNav();
        this.setupNavScroll();
        this.setupScrollSpy();
        this.setupSmoothScroll();
        this.setupCareToggles();
        this.setupScrollAnimations();
        this.setupStickyNavShadow();
        this.initAOS();

        console.log('✅ Services Page Controller Ready — 10 Categories');
    }

    /* =========================================
       STICKY NAV — HORIZONTAL SCROLL
       ========================================= */
    setupStickyNav() {
        if (!this.navLeftBtn || !this.navRightBtn || !this.navTrack) return;

        this.navLeftBtn.addEventListener('click', () => {
            this.navTrack.scrollBy({ left: -200, behavior: 'smooth' });
        });

        this.navRightBtn.addEventListener('click', () => {
            this.navTrack.scrollBy({ left: 200, behavior: 'smooth' });
        });

        // Touch swipe already handled by native scroll
    }

    setupStickyNavShadow() {
        if (!this.stickyNav) return;

        const heroSection = document.getElementById('sv-hero');
        if (!heroSection) return;

        const observer = new IntersectionObserver(([entry]) => {
            this.stickyNav.classList.toggle('shadowed', !entry.isIntersecting);
        }, { threshold: 0 });

        observer.observe(heroSection);
    }

    /* =========================================
       NAV SCROLL — ARROWS VISIBILITY
       ========================================= */
    setupNavScroll() {
        if (!this.navTrack) return;

        const updateArrows = () => {
            const { scrollLeft, scrollWidth, clientWidth } = this.navTrack;
            if (this.navLeftBtn) this.navLeftBtn.style.opacity = scrollLeft > 5 ? '1' : '0.3';
            if (this.navRightBtn) this.navRightBtn.style.opacity = scrollLeft < scrollWidth - clientWidth - 5 ? '1' : '0.3';
        };

        this.navTrack.addEventListener('scroll', updateArrows, { passive: true });
        updateArrows();
        window.addEventListener('resize', updateArrows);
    }

    /* =========================================
       SCROLL SPY — HIGHLIGHT ACTIVE NAV PILL
       ========================================= */
    setupScrollSpy() {
        if (!this.sections.length || !this.navPills.length) return;

        const observerOptions = {
            rootMargin: `-${this.headerOffset + 60}px 0px -50% 0px`,
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isScrolling) {
                    const sectionId = entry.target.id;
                    this.setActiveNavPill(sectionId);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => observer.observe(section));
    }

    setActiveNavPill(sectionId) {
        this.navPills.forEach(pill => {
            const isActive = pill.getAttribute('data-target') === sectionId;
            pill.classList.toggle('active', isActive);

            // Scroll the active pill into view in the nav track
            if (isActive && this.navTrack) {
                const pillRect = pill.getBoundingClientRect();
                const trackRect = this.navTrack.getBoundingClientRect();

                if (pillRect.left < trackRect.left || pillRect.right > trackRect.right) {
                    pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            }
        });
    }

    /* =========================================
       SMOOTH SCROLL — NAV PILLS + ANCHORS
       ========================================= */
    setupSmoothScroll() {
        // Nav pills
        this.navPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = pill.getAttribute('data-target') || pill.getAttribute('href')?.substring(1);
                if (!targetId) return;

                const target = document.getElementById(targetId);
                if (!target) return;

                this.isScrolling = true;
                this.setActiveNavPill(targetId);

                const offset = this.stickyNav ? this.stickyNav.offsetHeight + 20 : 80;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });

                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = setTimeout(() => {
                    this.isScrolling = false;
                }, 1000);
            });
        });

        // Any hash link on page
        document.querySelectorAll('a[href^="#sv-"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const offset = this.stickyNav ? this.stickyNav.offsetHeight + 20 : 80;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });
            });
        });
    }

    /* =========================================
       CARE INSTRUCTION TOGGLES
       ========================================= */
    setupCareToggles() {
        this.careTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.getAttribute('data-target');
                const content = document.getElementById(targetId);
                if (!content) return;

                const isOpen = content.classList.contains('open');

                // Close all others first
                document.querySelectorAll('.sv-care-content.open').forEach(el => {
                    el.classList.remove('open');
                    const otherTrigger = document.querySelector(`[data-target="${el.id}"]`);
                    if (otherTrigger) otherTrigger.classList.remove('open');
                });

                // Toggle current
                if (!isOpen) {
                    content.classList.add('open');
                    trigger.classList.add('open');

                    // Scroll into view after animation
                    setTimeout(() => {
                        const triggerRect = trigger.getBoundingClientRect();
                        if (triggerRect.top < 0) {
                            trigger.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 300);
                }
            });
        });
    }

    /* =========================================
       SCROLL ANIMATIONS (FALLBACK FOR AOS)
       ========================================= */
    setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const elements = document.querySelectorAll('.sv-card, .sv-age-card, .sv-comparison-block, .sv-choose-box');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, i * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
            observer.observe(el);
        });
    }

    /* =========================================
       AOS INIT
       ========================================= */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 700,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80,
                delay: 0
            });
            setTimeout(() => AOS.refresh(), 500);
        }
    }
}

/* =========================================
   SCROLL PROGRESS BAR
   ========================================= */
class ServicesScrollProgress {
    constructor() {
        this.bar = document.createElement('div');
        this.bar.style.cssText = `
            position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
            background: linear-gradient(90deg, #FF8C00, #FFA500, #FF7A00);
            width: 0%; pointer-events: none; transition: width 0.1s ease;
        `;
        document.body.appendChild(this.bar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.bar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
        }, { passive: true });
    }
}

/* =========================================
   URL HASH HANDLING — DEEP LINKS
   ========================================= */
function handleHashOnLoad() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#sv-')) return;

    const target = document.querySelector(hash);
    if (!target) return;

    // Wait for layout to settle
    setTimeout(() => {
        const stickyNav = document.getElementById('svStickyNav');
        const offset = stickyNav ? stickyNav.offsetHeight + 20 : 100;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });
    }, 600);
}

/* =========================================
   VIEWPORT HEIGHT FIX
   ========================================= */
function setVH() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

/* =========================================
   INITIALIZATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    try {
        setVH();
        window.addEventListener('resize', setVH);

        const servicesController = new ServicesPageController();
        const scrollProgress = new ServicesScrollProgress();

        handleHashOnLoad();

        window.servicesController = servicesController;

        console.log('🚀 Eviaesthetics Services Page Ready');
    } catch (error) {
        console.error('Services page init error:', error);
    }
});

if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
}

console.log('📄 Services JS Loaded — Eviaesthetics Manhattan');
