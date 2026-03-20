/**
 * =============================================================================
 * EVIAESTHETICS - LANDING PAGE JAVASCRIPT
 * Microneedling & PRP Therapy Landing Page
 * Lightweight, conversion-focused interactions
 * =============================================================================
 */

'use strict';

class LandingPageManager {
    constructor() {
        this.header = document.getElementById('lpHeader');
        this.faqItems = document.querySelectorAll('.lp-faq-item');
        this.serviceCards = document.querySelectorAll('.lp-service-card');
        this.whyCards = document.querySelectorAll('.lp-why-card');
        this.ctaButtons = document.querySelectorAll('.lp-btn-primary, .lp-btn-secondary, .lp-header-cta-btn');
        this.statNumbers = document.querySelectorAll('.lp-stat-number[data-count]');

        this.isScrolled = false;
        this.scrollThreshold = 60;

        this.init();
    }

    init() {
        this.setupStickyHeader();
        this.setupSmoothScroll();
        this.setupFaqAccordion();
        this.setupScrollAnimations();
        this.setupCtaTracking();
        this.setupCountUpAnimation();
        this.initAOS();

        console.log('✅ Landing Page Manager Initialized');
    }

    /* =========================================
       STICKY HEADER
       ========================================= */
    setupStickyHeader() {
        if (!this.header) return;

        const onScroll = () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const shouldBeScrolled = scrollY > this.scrollThreshold;

            if (shouldBeScrolled !== this.isScrolled) {
                this.isScrolled = shouldBeScrolled;
                this.header.classList.toggle('scrolled', shouldBeScrolled);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* =========================================
       SMOOTH SCROLL TO SECTIONS
       ========================================= */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '#top') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const headerHeight = this.header ? this.header.offsetHeight : 80;
                const trustBarHeight = document.querySelector('.lp-trust-bar')?.offsetHeight || 0;
                const offset = headerHeight + trustBarHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });

                // Track CTA clicks for analytics
                this.trackEvent('cta_click', {
                    label: anchor.textContent.trim(),
                    destination: href
                });
            });
        });
    }

    /* =========================================
       FAQ ACCORDION
       ========================================= */
    setupFaqAccordion() {
        this.faqItems.forEach(item => {
            const summary = item.querySelector('summary');
            if (!summary) return;

            summary.addEventListener('click', () => {
                // Close other open items
                this.faqItems.forEach(other => {
                    if (other !== item && other.hasAttribute('open')) {
                        other.removeAttribute('open');
                    }
                });

                // Track FAQ interaction
                const question = summary.querySelector('span')?.textContent || '';
                this.trackEvent('faq_click', { question: question });
            });
        });
    }

    /* =========================================
       SCROLL REVEAL ANIMATIONS
       ========================================= */
    setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const animateElements = [
            ...this.serviceCards,
            ...this.whyCards,
            ...document.querySelectorAll('.lp-category-block'),
            ...document.querySelectorAll('.lp-care-block')
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        animateElements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.08}s`;
            observer.observe(el);
        });
    }

    /* =========================================
       CTA CLICK TRACKING
       ========================================= */
    setupCtaTracking() {
        // Track phone calls
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('phone_call', {
                    label: 'Landing Page Call',
                    phone: link.getAttribute('href')
                });
                this.trackConversion('phone_call');
            });
        });

        // Track email clicks
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('email_click', {
                    label: 'Landing Page Email',
                    email: link.getAttribute('href')
                });
                this.trackConversion('email_click');
            });
        });

        // Track SMS clicks
        document.querySelectorAll('a[href^="sms:"]').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('sms_click', {
                    label: 'Landing Page SMS'
                });
                this.trackConversion('sms_click');
            });
        });

        // Track CTA button clicks with ripple
        this.ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addRippleEffect(btn, e);
            });
        });

        // Track service card interactions
        this.serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const title = card.querySelector('.lp-card-title')?.textContent || '';
                this.trackEvent('service_hover', { service: title });
            });
        });
    }

    /* =========================================
       COUNT UP ANIMATION
       ========================================= */
    setupCountUpAnimation() {
        if (!('IntersectionObserver' in window) || this.statNumbers.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.statNumbers.forEach(el => observer.observe(el));
    }

    animateCount(element) {
        const target = parseInt(element.dataset.count, 10);
        if (!target) return;

        const duration = 2000;
        const startTime = performance.now();
        const suffix = element.textContent.includes('+') ? '+' : '';

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            element.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString() + suffix;
            }
        };

        requestAnimationFrame(update);
    }

    /* =========================================
       RIPPLE EFFECT
       ========================================= */
    addRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.35);
            border-radius: 50%;
            transform: scale(0);
            animation: lpRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 100;
        `;

        element.style.position = element.style.position || 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    /* =========================================
       AOS INITIALIZATION
       ========================================= */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80,
                delay: 0
            });

            setTimeout(() => AOS.refresh(), 500);
        }
    }

    /* =========================================
       ANALYTICS TRACKING HELPERS
       ========================================= */
    trackEvent(eventName, params = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Landing Page - Microneedling PRP',
                ...params
            });
        }

        // Google Ads conversion tracking
        if (typeof gtag !== 'undefined' && params.conversion_id) {
            gtag('event', 'conversion', {
                send_to: params.conversion_id
            });
        }

        // Console log for development
        console.log(`📊 Event: ${eventName}`, params);
    }

    trackConversion(type) {
        // Google Ads phone call conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: 'AW-CONVERSION_ID/LABEL',
                event_callback: function() {
                    console.log('Conversion tracked:', type);
                }
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', { content_name: type });
        }

        console.log(`🎯 Conversion: ${type}`);
    }
}

/* =========================================
   SCROLL PROGRESS INDICATOR (optional)
   ========================================= */
class ScrollProgress {
    constructor() {
        this.createIndicator();
        this.bindEvents();
    }

    createIndicator() {
        this.bar = document.createElement('div');
        this.bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #FF8C00, #FFA500);
            z-index: 9999;
            transition: width 0.1s ease;
            width: 0%;
            pointer-events: none;
        `;
        document.body.appendChild(this.bar);
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            this.bar.style.width = `${progress}%`;
        }, { passive: true });
    }
}

/* =========================================
   INJECT RIPPLE ANIMATION KEYFRAMES
   ========================================= */
function injectRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes lpRipple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/* =========================================
   VIEWPORT HEIGHT FIX (mobile browsers)
   ========================================= */
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/* =========================================
   INITIALIZATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    try {
        injectRippleStyles();
        setViewportHeight();

        const landingPage = new LandingPageManager();
        const scrollProgress = new ScrollProgress();

        // Viewport height recalculation on resize
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 500);
        });

        // Expose for debugging
        window.landingPage = landingPage;

        console.log('🚀 Eviaesthetics Landing Page Ready');

    } catch (error) {
        console.error('Landing page initialization error:', error);
    }
});

// Touch device detection
if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Landing Page Error:', event.message);
});

console.log('📄 Eviaesthetics Landing Page JS Loaded');
