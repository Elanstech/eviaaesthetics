/**
 * =============================================================================
 * EVIAESTHETICS — ABOUT PAGE
 * Cinematic Interactions, Counters & Parallax
 * =============================================================================
 * Works alongside script.js (which handles the header, mobile menu,
 * floating buttons, and AOS). This file adds the about-page-only polish.
 */

(function() {
    'use strict';

    /* =========================================================================
       CONFIG
       ========================================================================= */
    const AB_CONFIG = {
        counterDuration: 2200,
        parallaxStrength: 0.15,
        tiltMax: 6,
        observerThreshold: 0.25,
        observerMargin: '0px 0px -80px 0px',
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isMobile: () => window.innerWidth <= 768,
        isTouch: 'ontouchstart' in window
    };

    /* =========================================================================
       UTILS
       ========================================================================= */
    const AbUtils = {
        easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        },

        easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        },

        throttle(fn, wait) {
            let last = 0;
            return function(...args) {
                const now = Date.now();
                if (now - last >= wait) {
                    last = now;
                    fn.apply(this, args);
                }
            };
        },

        debounce(fn, wait) {
            let timer;
            return function(...args) {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), wait);
            };
        },

        onVisible(el, callback, options = {}) {
            if (!('IntersectionObserver' in window) || !el) {
                callback();
                return;
            }
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: options.threshold || AB_CONFIG.observerThreshold,
                rootMargin: options.rootMargin || AB_CONFIG.observerMargin
            });
            observer.observe(el);
            return observer;
        },

        formatNumber(num) {
            return Math.floor(num).toLocaleString('en-US');
        }
    };

    /* =========================================================================
       1. STAT COUNTER ANIMATIONS
       ========================================================================= */
    function initStatCounters() {
        const counters = document.querySelectorAll('.ab-stat-number');
        if (!counters.length) return;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10);
            if (isNaN(target)) return;

            counter.textContent = '0';

            AbUtils.onVisible(counter, () => {
                animateCount(counter, target);
            }, { threshold: 0.4 });
        });
    }

    function animateCount(element, target) {
        if (AB_CONFIG.reducedMotion) {
            element.textContent = AbUtils.formatNumber(target);
            return;
        }

        const duration = AB_CONFIG.counterDuration;
        const startTime = performance.now();
        const startValue = 0;

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = AbUtils.easeOutExpo(progress);
            const current = startValue + (target - startValue) * eased;

            element.textContent = AbUtils.formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = AbUtils.formatNumber(target);
                // Small pulse at completion
                element.style.transform = 'scale(1.08)';
                setTimeout(() => {
                    element.style.transform = '';
                    element.style.transition = 'transform 0.4s ease';
                }, 200);
            }
        }

        requestAnimationFrame(update);
    }

    /* =========================================================================
       2. PORTRAIT TILT EFFECT
       ========================================================================= */
    function initPortraitTilt() {
        const portrait = document.querySelector('.ab-portrait-frame');
        if (!portrait || AB_CONFIG.isTouch || AB_CONFIG.reducedMotion) return;

        const wrap = portrait.closest('.ab-hero-portrait-wrap');
        if (!wrap) return;

        let rafId = null;
        let targetRX = 0, targetRY = 0;
        let currentRX = 0, currentRY = 0;

        function onMouseMove(e) {
            const rect = wrap.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) / (rect.width / 2);
            const deltaY = (e.clientY - centerY) / (rect.height / 2);

            targetRY = deltaX * AB_CONFIG.tiltMax;
            targetRX = -deltaY * AB_CONFIG.tiltMax;

            if (!rafId) rafId = requestAnimationFrame(updateTilt);
        }

        function onMouseLeave() {
            targetRX = 0;
            targetRY = 0;
            if (!rafId) rafId = requestAnimationFrame(updateTilt);
        }

        function updateTilt() {
            currentRX += (targetRX - currentRX) * 0.12;
            currentRY += (targetRY - currentRY) * 0.12;

            portrait.style.transform = `perspective(1200px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) translateZ(10px)`;

            if (Math.abs(currentRX - targetRX) > 0.05 || Math.abs(currentRY - targetRY) > 0.05) {
                rafId = requestAnimationFrame(updateTilt);
            } else {
                rafId = null;
            }
        }

        wrap.addEventListener('mousemove', onMouseMove);
        wrap.addEventListener('mouseleave', onMouseLeave);
    }

    /* =========================================================================
       3. PARALLAX ORBS
       ========================================================================= */
    function initParallaxOrbs() {
        if (AB_CONFIG.reducedMotion || AB_CONFIG.isMobile()) return;

        const orbs = document.querySelectorAll(
            '.ab-hero-orb, .ab-ph-orb, .ab-ma-orb, .ab-sa-orb, .ab-wh-orb, .ab-cta-orb'
        );
        if (!orbs.length) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.pageYOffset;

            orbs.forEach((orb, index) => {
                const speed = AB_CONFIG.parallaxStrength * (0.5 + (index % 3) * 0.3);
                const section = orb.closest('section');
                if (!section) return;

                const rect = section.getBoundingClientRect();
                // Only animate when section is in/near viewport
                if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

                const offset = scrollY * speed;
                orb.style.transform = `translate3d(0, ${offset}px, 0)`;
            });

            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* =========================================================================
       4. SMOOTH SCROLL FOR INTERNAL LINKS
       ========================================================================= */
    function initSmoothScroll() {
        // Scroll cue click
        const scrollCue = document.querySelector('.ab-scroll-cue');
        if (scrollCue) {
            scrollCue.style.cursor = 'pointer';
            scrollCue.addEventListener('click', () => {
                const philosophy = document.getElementById('abPhilosophy');
                if (philosophy) {
                    const offset = philosophy.offsetTop - 80;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            });
        }

        // Any internal hash links on the page
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const offset = target.offsetTop - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            });
        });
    }

    /* =========================================================================
       5. BUTTON RIPPLE EFFECTS
       ========================================================================= */
    function initButtonRipples() {
        const buttons = document.querySelectorAll('.ab-btn-primary, .ab-btn-ghost');

        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                createRipple(this, e);
            });
        });

        // Inject ripple keyframe once
        if (!document.getElementById('ab-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ab-ripple-style';
            style.textContent = `
                @keyframes abRipple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                .ab-ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: scale(0);
                    animation: abRipple 0.7s ease-out;
                    pointer-events: none;
                    z-index: 3;
                }
                .ab-btn-ghost .ab-ripple {
                    background: rgba(255, 140, 0, 0.25);
                }
            `;
            document.head.appendChild(style);
        }
    }

    function createRipple(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ab-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        // Ensure the parent can contain the ripple
        const originalPosition = getComputedStyle(element).position;
        if (originalPosition === 'static') {
            element.style.position = 'relative';
        }
        const originalOverflow = getComputedStyle(element).overflow;
        if (originalOverflow === 'visible') {
            element.style.overflow = 'hidden';
        }

        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    }

    /* =========================================================================
       6. TIMELINE REVEAL
       ========================================================================= */
    function initTimelineReveal() {
        const nodes = document.querySelectorAll('.ab-timeline-node');
        if (!nodes.length) return;

        nodes.forEach((node, index) => {
            AbUtils.onVisible(node, (el) => {
                // Pulse the marker
                const marker = el.querySelector('.ab-node-marker');
                if (marker && !AB_CONFIG.reducedMotion) {
                    marker.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    marker.style.transform = 'scale(1.15)';
                    setTimeout(() => {
                        marker.style.transform = '';
                    }, 600);
                }

                // Draw the connecting line progressively (handled by timeline-line via CSS)
                el.classList.add('ab-node-visible');
            }, { threshold: 0.35 });
        });
    }

    /* =========================================================================
       7. VIDEO PLAYER ENHANCEMENT
       ========================================================================= */
    function initVideoPlayer() {
        const video = document.querySelector('.ab-video');
        const badge = document.querySelector('.ab-video-badge');
        if (!video) return;

        video.addEventListener('play', () => {
            if (badge) {
                badge.style.transition = 'opacity 0.4s ease';
                badge.style.opacity = '0';
            }
        });

        video.addEventListener('pause', () => {
            if (badge) badge.style.opacity = '1';
        });

        video.addEventListener('ended', () => {
            if (badge) badge.style.opacity = '1';
        });
    }

    /* =========================================================================
       8. FLOATING BADGES SUBTLE DRIFT
       ========================================================================= */
    function initFloatingBadges() {
        if (AB_CONFIG.reducedMotion || AB_CONFIG.isMobile()) return;

        const badges = document.querySelectorAll('.ab-floating-badge');
        if (!badges.length) return;

        let scrollY = window.pageYOffset;
        let ticking = false;

        function update() {
            const newScrollY = window.pageYOffset;
            const diff = newScrollY - scrollY;

            badges.forEach((badge, i) => {
                const speed = (i + 1) * 0.08;
                const currentY = parseFloat(badge.dataset.drift || '0');
                const newY = currentY + diff * speed;
                badge.dataset.drift = newY.toString();

                // Clamp to avoid runaway values
                const clamped = Math.max(-30, Math.min(30, newY));
                badge.style.setProperty('--drift', `${clamped}px`);
            });

            scrollY = newScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        // Inject CSS to apply drift without breaking existing float animation
        const style = document.createElement('style');
        style.textContent = `
            .ab-floating-badge {
                --drift: 0px;
            }
        `;
        document.head.appendChild(style);
    }

    /* =========================================================================
       9. HOVER ENHANCEMENTS (Mastery + Why cards)
       ========================================================================= */
    function initHoverEnhancements() {
        if (AB_CONFIG.isTouch) return;

        const cards = document.querySelectorAll('.ab-mastery-card, .ab-why-card, .ab-pillar, .ab-feature');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Tiny follow effect for cards
                this.style.willChange = 'transform';
            });

            card.addEventListener('mouseleave', function() {
                setTimeout(() => { this.style.willChange = 'auto'; }, 600);
            });
        });
    }

    /* =========================================================================
       10. HERO ENTRANCE ANIMATION
       ========================================================================= */
    function initHeroEntrance() {
        if (AB_CONFIG.reducedMotion) return;

        const hero = document.querySelector('.ab-cinematic-hero');
        if (!hero) return;

        // Stagger the floating badges in after the portrait appears
        const badges = hero.querySelectorAll('.ab-floating-badge');
        badges.forEach((badge, i) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(30px) scale(0.8)';
            badge.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';

            setTimeout(() => {
                badge.style.opacity = '';
                badge.style.transform = '';
            }, 1200 + i * 250);
        });
    }

    /* =========================================================================
       11. AOS REFRESH / COMPATIBILITY
       ========================================================================= */
    function initAOSAbout() {
        if (typeof AOS !== 'undefined') {
            // If AOS was already initialized by script.js, just refresh
            try {
                AOS.refresh();
            } catch (e) {
                AOS.init({
                    duration: 1000,
                    easing: 'ease-out-cubic',
                    once: true,
                    offset: 100
                });
            }

            // Refresh after all lazy elements load
            window.addEventListener('load', () => {
                setTimeout(() => AOS.refresh(), 300);
            });
        }
    }

    /* =========================================================================
       12. SCROLL-BASED HERO FADE
       ========================================================================= */
    function initHeroFade() {
        const scrollCue = document.querySelector('.ab-scroll-cue');
        if (!scrollCue) return;

        let ticking = false;

        function updateFade() {
            const scrolled = window.pageYOffset;
            const opacity = Math.max(0, 1 - scrolled / 400);
            scrollCue.style.opacity = opacity;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateFade);
                ticking = true;
            }
        }, { passive: true });
    }

    /* =========================================================================
       13. RESPONSIVE HANDLER
       ========================================================================= */
    function initResponsive() {
        const handleResize = AbUtils.debounce(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 250);

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 300);
        });
    }

    /* =========================================================================
       14. CTA BUTTON MAGNETIC EFFECT
       ========================================================================= */
    function initMagneticButtons() {
        if (AB_CONFIG.isTouch || AB_CONFIG.reducedMotion) return;

        const magnets = document.querySelectorAll('.ab-btn-primary');

        magnets.forEach(btn => {
            let rafId = null;

            btn.addEventListener('mousemove', function(e) {
                if (rafId) cancelAnimationFrame(rafId);

                rafId = requestAnimationFrame(() => {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    const moveX = x * 0.2;
                    const moveY = y * 0.2;

                    this.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-4px) scale(1.03)`;
                });
            });

            btn.addEventListener('mouseleave', function() {
                if (rafId) cancelAnimationFrame(rafId);
                this.style.transform = '';
                this.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                setTimeout(() => { this.style.transition = ''; }, 500);
            });
        });
    }

    /* =========================================================================
       INITIALIZATION
       ========================================================================= */
    function init() {
        initAOSAbout();
        initStatCounters();
        initPortraitTilt();
        initParallaxOrbs();
        initSmoothScroll();
        initButtonRipples();
        initTimelineReveal();
        initVideoPlayer();
        initFloatingBadges();
        initHoverEnhancements();
        initHeroEntrance();
        initHeroFade();
        initResponsive();
        initMagneticButtons();

        console.log('✨ Eviaesthetics About Page — Initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose utilities for debugging
    window.AbAboutPage = {
        utils: AbUtils,
        config: AB_CONFIG,
        reinit: init
    };

})();
