/**
 * =============================================================================
 * EVIAESTHETICS — UNIFIED SCRIPT
 * Manhattan Medical Spa · Hermes Luxury Design
 * =============================================================================
 * Single consolidated file for:
 *   - Shared:  header, mobile menu, floating buttons, smooth scroll
 *   - Home:    cinematic hero, video modal, services carousel + filter,
 *              results slider, products carousel, FAQ accordion, parallax
 *   - Any:     components feature-detect and no-op if elements aren't on page
 * Works alongside about.js on about.html (no conflicts).
 */

(function() {
    'use strict';

    /* =========================================================================
       CONFIG
       ========================================================================= */
    const CONFIG = {
        scrollThreshold: 80,
        counterDuration: 2000,
        breakpoints: { mobile: 768, tablet: 1024 },
        urls: {
            shop: 'https://us.alumiermd.com/products?code=54T7P4HH',
            contact: 'contact.html',
            services: 'services.html',
            about: 'about.html'
        },
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isTouch: 'ontouchstart' in window
    };

    /* =========================================================================
       UTILS (shared helpers — one copy, not duplicated per class)
       ========================================================================= */
    const U = {
        $: (sel, ctx = document) => ctx.querySelector(sel),
        $$: (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel)),

        isMobile: () => window.innerWidth <= CONFIG.breakpoints.mobile,

        debounce(fn, wait) {
            let t;
            return function(...args) {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, args), wait);
            };
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

        rafThrottle(fn) {
            let pending = false;
            return function(...args) {
                if (pending) return;
                pending = true;
                requestAnimationFrame(() => {
                    fn.apply(this, args);
                    pending = false;
                });
            };
        },

        easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        easeOutCubic: t => 1 - Math.pow(1 - t, 3),

        scrollTo(target, offset = 80) {
            const el = typeof target === 'string' ? U.$(target) : target;
            if (!el) return;
            const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        },

        lockScroll() {
            const y = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${y}px`;
            document.body.style.width = '100%';
            document.body.dataset.scrollY = y;
        },

        unlockScroll() {
            const y = document.body.dataset.scrollY;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (y) window.scrollTo(0, parseInt(y));
        },

        onVisible(el, cb, options = {}) {
            if (!el || !('IntersectionObserver' in window)) { cb(); return null; }
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        cb(entry.target);
                        if (options.once !== false) obs.unobserve(entry.target);
                    }
                });
            }, {
                threshold: options.threshold || 0.25,
                rootMargin: options.rootMargin || '0px'
            });
            obs.observe(el);
            return obs;
        }
    };

    /* =========================================================================
       HEADER (shared across all pages)
       ========================================================================= */
    const Header = {
        init() {
            this.el = U.$('#hermesHeader') || U.$('.hermes-modern-header');
            if (!this.el) return;

            this.mobileToggle = U.$('#mobileMenuToggle');
            this.desktopHamburger = U.$('#desktopHamburger');
            this.closeBtn = U.$('#menuCloseBtn');
            this.overlay = U.$('#mobileMenuOverlay');
            this.isOpen = false;
            this.isScrolled = false;

            this.bindEvents();
            this.setupScroll();
            this.setupAccessibility();
        },

        bindEvents() {
            [this.mobileToggle, this.desktopHamburger].forEach(btn => {
                if (btn) btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggle();
                });
            });

            if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());

            if (this.overlay) {
                this.overlay.addEventListener('click', (e) => {
                    if (e.target === this.overlay) this.close();
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) this.close();
            });

            // Close on nav link click
            U.$$('.mobile-nav-item', this.overlay).forEach(link => {
                link.addEventListener('click', () => setTimeout(() => this.close(), 200));
            });
        },

        setupScroll() {
            const onScroll = U.rafThrottle(() => {
                const scrolled = window.scrollY > CONFIG.scrollThreshold;
                if (scrolled !== this.isScrolled) {
                    this.isScrolled = scrolled;
                    this.el.classList.toggle('scrolled', scrolled);
                }
            });
            window.addEventListener('scroll', onScroll, { passive: true });
        },

        setupAccessibility() {
            [this.mobileToggle, this.desktopHamburger].forEach(btn => {
                if (!btn) return;
                btn.setAttribute('aria-expanded', 'false');
                btn.setAttribute('aria-controls', 'mobileMenuOverlay');
            });
            if (this.overlay) {
                this.overlay.setAttribute('role', 'dialog');
                this.overlay.setAttribute('aria-modal', 'true');
            }
        },

        toggle() { this.isOpen ? this.close() : this.open(); },

        open() {
            if (!this.overlay || this.isOpen) return;
            this.isOpen = true;
            this.overlay.classList.add('active');
            this.mobileToggle?.classList.add('active');
            this.desktopHamburger?.classList.add('active');
            [this.mobileToggle, this.desktopHamburger].forEach(b => b?.setAttribute('aria-expanded', 'true'));
            U.lockScroll();
        },

        close() {
            if (!this.overlay || !this.isOpen) return;
            this.isOpen = false;
            this.overlay.classList.remove('active');
            this.mobileToggle?.classList.remove('active');
            this.desktopHamburger?.classList.remove('active');
            [this.mobileToggle, this.desktopHamburger].forEach(b => b?.setAttribute('aria-expanded', 'false'));
            U.unlockScroll();
        }
    };

    /* =========================================================================
       FLOATING BUTTONS (back-to-top + contact FAB — shared)
       ========================================================================= */
    const FloatingButtons = {
        init() {
            this.backToTop = U.$('#backToTopBtn');
            this.contactFab = U.$('#contactFabBtn');
            this.backdrop = U.$('#contactBackdrop');

            if (this.backToTop) this.setupBackToTop();
            if (this.contactFab) this.setupContactFab();
        },

        setupBackToTop() {
            const onScroll = U.rafThrottle(() => {
                this.backToTop.classList.toggle('visible', window.scrollY > 400);
            });
            window.addEventListener('scroll', onScroll, { passive: true });

            this.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        setupContactFab() {
            const mainBtn = U.$('.main-contact-btn', this.contactFab);
            if (!mainBtn) return;

            this.fabOpen = false;

            mainBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFab();
            });

            if (this.backdrop) {
                this.backdrop.addEventListener('click', () => this.closeFab());
            }

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (this.fabOpen && !this.contactFab.contains(e.target)) {
                    this.closeFab();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.fabOpen) this.closeFab();
            });

            // Close on scroll
            const onScroll = U.throttle(() => {
                if (this.fabOpen && Math.abs(window.scrollY - (this.lastY || 0)) > 150) {
                    this.closeFab();
                }
                this.lastY = window.scrollY;
            }, 100);
            window.addEventListener('scroll', onScroll, { passive: true });
        },

        toggleFab() { this.fabOpen ? this.closeFab() : this.openFab(); },

        openFab() {
            this.fabOpen = true;
            this.contactFab.classList.add('expanded');
            this.backdrop?.classList.add('active');
        },

        closeFab() {
            this.fabOpen = false;
            this.contactFab.classList.remove('expanded');
            this.backdrop?.classList.remove('active');
        }
    };

    /* =========================================================================
       SMOOTH SCROLL (all internal #links)
       ========================================================================= */
    const SmoothScroll = {
        init() {
            document.addEventListener('click', (e) => {
                const anchor = e.target.closest('a[href^="#"]');
                if (!anchor) return;
                const href = anchor.getAttribute('href');
                if (href === '#' || href.length < 2) return;

                const target = U.$(href);
                if (!target) return;

                e.preventDefault();
                U.scrollTo(target, 80);
            });
        }
    };

    /* =========================================================================
       CINEMATIC HERO (home page)
       ========================================================================= */
    const CinematicHero = {
        init() {
            this.hero = U.$('.hm-cinema-hero');
            if (!this.hero) return;

            this.video = U.$('.hm-video', this.hero);
            this.scrollEl = U.$('.hm-hero-scroll', this.hero);

            this.setupVideo();
            this.setupScrollFade();
        },

        setupVideo() {
            if (!this.video) return;
            // Ensure autoplay on iOS/Safari
            const tryPlay = () => {
                const p = this.video.play();
                if (p && typeof p.catch === 'function') {
                    p.catch(() => { /* autoplay blocked, no-op */ });
                }
            };
            if (this.video.readyState >= 2) tryPlay();
            else this.video.addEventListener('loadeddata', tryPlay, { once: true });
        },

        setupScrollFade() {
            if (!this.scrollEl) return;
            const onScroll = U.rafThrottle(() => {
                const opacity = Math.max(0, 0.75 - window.scrollY / 500);
                this.scrollEl.style.opacity = opacity;
            });
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    };

    /* =========================================================================
       VIDEO MODAL (Watch Full Tour)
       ========================================================================= */
    const VideoModal = {
        init() {
            this.modal = U.$('#hmVideoModal');
            this.trigger = U.$('#hmWatchFullTour');
            this.closeBtn = U.$('#hmVideoModalClose');
            this.player = U.$('#hmVideoModalPlayer');

            if (!this.modal || !this.trigger) return;

            this.isOpen = false;

            this.trigger.addEventListener('click', () => this.open());
            if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());

            // Backdrop click
            const backdrop = U.$('.hm-video-modal-backdrop', this.modal);
            if (backdrop) backdrop.addEventListener('click', () => this.close());

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) this.close();
            });
        },

        open() {
            this.modal.classList.add('active');
            this.modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('hm-video-modal-open');
            this.isOpen = true;

            // Small delay so animation plays before video starts
            setTimeout(() => {
                if (this.player) {
                    this.player.currentTime = 0;
                    const p = this.player.play();
                    if (p && p.catch) p.catch(() => {});
                }
            }, 300);
        },

        close() {
            this.modal.classList.remove('active');
            this.modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('hm-video-modal-open');
            this.isOpen = false;

            if (this.player) {
                this.player.pause();
                this.player.currentTime = 0;
            }
        }
    };

    /* =========================================================================
       SERVICES FILTER (category pills)
       ========================================================================= */
    const ServicesFilter = {
        init() {
            this.pills = U.$$('.hm-filter-pill');
            this.cards = U.$$('.hermes-service-card[data-category]');

            if (!this.pills.length || !this.cards.length) return;

            this.pills.forEach(pill => {
                pill.addEventListener('click', () => this.filter(pill));
            });
        },

        filter(activePill) {
            const category = activePill.dataset.filter;

            this.pills.forEach(pill => {
                const isActive = pill === activePill;
                pill.classList.toggle('active', isActive);
                pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            this.cards.forEach(card => {
                const match = category === 'all' || card.dataset.category === category;
                card.classList.toggle('hm-filtered-out', !match);
            });

            // Scroll carousel back to start on filter change
            const scrollContainer = U.$('#hermesScrollContainer');
            if (scrollContainer) scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }
    };

    /* =========================================================================
       SERVICES CAROUSEL (arrow-navigation + touch)
       ========================================================================= */
    const ServicesCarousel = {
        init() {
            this.container = U.$('#hermesScrollContainer');
            this.leftBtn = U.$('#hermesScrollLeft');
            this.rightBtn = U.$('#hermesScrollRight');

            if (!this.container) return;

            this.scrollAmount = 360;
            this.isAnimating = false;

            this.calculateScroll();
            this.bindEvents();
            this.updateArrows();
        },

        calculateScroll() {
            const firstCard = U.$('.hermes-service-card', this.container);
            if (!firstCard) return;
            const style = window.getComputedStyle(firstCard.parentElement);
            const gap = parseInt(style.gap) || 32;
            this.scrollAmount = firstCard.offsetWidth + gap;
        },

        bindEvents() {
            if (this.leftBtn) this.leftBtn.addEventListener('click', () => this.scroll(-1));
            if (this.rightBtn) this.rightBtn.addEventListener('click', () => this.scroll(1));

            this.container.addEventListener('scroll', U.rafThrottle(() => this.updateArrows()), { passive: true });

            window.addEventListener('resize', U.debounce(() => {
                this.calculateScroll();
                this.updateArrows();
            }, 250));

            // Touch swipe
            this.setupSwipe();
        },

        setupSwipe() {
            let startX = 0, startY = 0, isSwiping = false;

            this.container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isSwiping = false;
            }, { passive: true });

            this.container.addEventListener('touchmove', (e) => {
                if (!startX) return;
                const dx = Math.abs(e.touches[0].clientX - startX);
                const dy = Math.abs(e.touches[0].clientY - startY);
                if (dx > dy && dx > 10) isSwiping = true;
            }, { passive: true });

            this.container.addEventListener('touchend', (e) => {
                if (!isSwiping) return;
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) this.scroll(diff > 0 ? 1 : -1);
                startX = 0; startY = 0; isSwiping = false;
            }, { passive: true });
        },

        scroll(direction) {
            if (this.isAnimating) return;
            this.calculateScroll();

            this.isAnimating = true;
            const start = this.container.scrollLeft;
            const max = this.container.scrollWidth - this.container.clientWidth;
            const target = Math.max(0, Math.min(max, start + (this.scrollAmount * direction)));
            const distance = target - start;
            const duration = 500;
            const startTime = performance.now();

            const animate = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                this.container.scrollLeft = start + distance * U.easeOutCubic(progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isAnimating = false;
                    this.updateArrows();
                }
            };
            requestAnimationFrame(animate);
        },

        updateArrows() {
            if (!this.leftBtn || !this.rightBtn) return;
            const scrolled = this.container.scrollLeft;
            const max = this.container.scrollWidth - this.container.clientWidth;

            this.leftBtn.disabled = scrolled <= 5;
            this.rightBtn.disabled = scrolled >= max - 5;
            this.leftBtn.classList.toggle('hermes-arrow-disabled', this.leftBtn.disabled);
            this.rightBtn.classList.toggle('hermes-arrow-disabled', this.rightBtn.disabled);
        }
    };

    /* =========================================================================
       BEFORE/AFTER RESULTS SLIDERS
       ========================================================================= */
    const ResultsSliders = {
        init() {
            this.sliders = U.$$('.showcase-comparison-slider');
            if (!this.sliders.length) return;

            this.sliders.forEach(slider => this.initSlider(slider));
        },

        initSlider(slider) {
            const container = slider.closest('.showcase-comparison-container');
            const before = U.$('.showcase-before-image', container);
            const handle = U.$('.showcase-slider-handle', slider);
            if (!container || !before || !handle) return;

            let isDragging = false;

            const setPosition = (percent) => {
                percent = Math.max(0, Math.min(100, percent));
                slider.style.left = `${percent}%`;
                before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
                slider.setAttribute('data-position', percent);
                handle.setAttribute('aria-valuenow', Math.round(percent));
            };

            const getPercent = (clientX) => {
                const rect = container.getBoundingClientRect();
                return ((clientX - rect.left) / rect.width) * 100;
            };

            // Accessibility
            handle.setAttribute('role', 'slider');
            handle.setAttribute('aria-valuemin', '0');
            handle.setAttribute('aria-valuemax', '100');
            handle.setAttribute('aria-valuenow', '50');
            handle.setAttribute('tabindex', '0');

            // Initialize at 50%
            setPosition(50);

            // Mouse
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isDragging = true;
                handle.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                setPosition(getPercent(e.clientX));
            });

            document.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                handle.style.cursor = 'ew-resize';
            });

            // Touch
            handle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isDragging = true;
            }, { passive: false });

            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                setPosition(getPercent(e.touches[0].clientX));
            }, { passive: true });

            document.addEventListener('touchend', () => { isDragging = false; });

            // Click to jump
            container.addEventListener('click', (e) => {
                if (e.target.closest('.showcase-slider-handle')) return;
                setPosition(getPercent(e.clientX));
            });

            // Keyboard
            handle.addEventListener('keydown', (e) => {
                const current = parseFloat(slider.dataset.position) || 50;
                const step = e.shiftKey ? 10 : 2;
                if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition(current - step); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(current + step); }
                else if (e.key === 'Home') { e.preventDefault(); setPosition(0); }
                else if (e.key === 'End') { e.preventDefault(); setPosition(100); }
            });
        }
    };

    /* =========================================================================
       ALUMIER PRODUCTS CAROUSEL
       ========================================================================= */
    const ProductsCarousel = {
        init() {
            this.track = U.$('#alumierTrack');
            if (!this.track) return;

            this.cards = U.$$('.alumier-product-card', this.track);
            this.prevBtn = U.$('#alumierPrev');
            this.nextBtn = U.$('#alumierNext');
            this.progress = U.$('#alumierProgress');
            this.currentEl = U.$('#alumierCurrent');
            this.totalEl = U.$('#alumierTotal');

            this.index = 0;
            this.cardsPerView = this.getCardsPerView();
            this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);

            this.update();
            this.bindEvents();
        },

        getCardsPerView() {
            const w = window.innerWidth;
            if (w >= 992) return 3;
            if (w >= 768) return 2;
            return 1;
        },

        bindEvents() {
            this.prevBtn?.addEventListener('click', () => this.go(-1));
            this.nextBtn?.addEventListener('click', () => this.go(1));

            window.addEventListener('resize', U.debounce(() => {
                const newPerView = this.getCardsPerView();
                if (newPerView !== this.cardsPerView) {
                    this.cardsPerView = newPerView;
                    this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
                    this.index = Math.min(this.index, this.totalSlides - 1);
                    this.update();
                }
            }, 200));

            // Touch swipe
            let startX = 0;
            this.track.addEventListener('touchstart', (e) => {
                startX = e.changedTouches[0].clientX;
            }, { passive: true });

            this.track.addEventListener('touchend', (e) => {
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) this.go(diff > 0 ? 1 : -1);
            }, { passive: true });
        },

        go(direction) {
            const next = this.index + direction;
            if (next < 0 || next >= this.totalSlides) return;
            this.index = next;
            this.update();
        },

        update() {
            if (!this.cards.length) return;

            const cardW = this.cards[0].offsetWidth;
            const gap = parseInt(getComputedStyle(this.track).gap) || 0;
            this.track.style.transform = `translateX(-${(cardW + gap) * this.index}px)`;

            if (this.prevBtn) this.prevBtn.disabled = this.index === 0;
            if (this.nextBtn) this.nextBtn.disabled = this.index === this.totalSlides - 1;

            if (this.progress) {
                this.progress.style.transform = `scaleX(${(this.index + 1) / this.totalSlides})`;
            }
            if (this.currentEl) this.currentEl.textContent = this.index + 1;
            if (this.totalEl) this.totalEl.textContent = this.totalSlides;
        }
    };

    /* =========================================================================
       FAQ ACCORDION (enhances native <details> elements)
       ========================================================================= */
    const FAQ = {
        init() {
            this.items = U.$$('.hm-faq-item');
            if (!this.items.length) return;

            this.items.forEach(item => {
                const summary = U.$('.hm-faq-question', item);
                if (!summary) return;

                summary.addEventListener('click', (e) => {
                    // Let native details handle it, but close others
                    setTimeout(() => {
                        if (item.open) {
                            this.items.forEach(other => {
                                if (other !== item && other.open) other.open = false;
                            });
                        }
                    }, 0);
                });
            });
        }
    };

    /* =========================================================================
       PARALLAX ORBS (subtle scroll-based drift)
       ========================================================================= */
    const Parallax = {
        init() {
            if (CONFIG.reducedMotion || U.isMobile()) return;

            this.orbs = U.$$('.hm-orb, .hm-exp-orb, .hm-cp-orb, .hm-orb-faq-1, .hm-orb-faq-2, .ab-hero-orb, .ab-ph-orb, .ab-ma-orb, .ab-sa-orb, .ab-wh-orb, .ab-cta-orb');
            if (!this.orbs.length) return;

            const onScroll = U.rafThrottle(() => {
                const scrollY = window.scrollY;
                this.orbs.forEach((orb, i) => {
                    const section = orb.closest('section');
                    if (!section) return;
                    const rect = section.getBoundingClientRect();
                    if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

                    const speed = 0.08 + (i % 3) * 0.04;
                    orb.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
                });
            });

            window.addEventListener('scroll', onScroll, { passive: true });
        }
    };

    /* =========================================================================
       BUTTON RIPPLES (subtle micro-interaction)
       ========================================================================= */
    const Ripples = {
        init() {
            const selector = '.hm-btn-primary, .hm-btn-ghost, .hm-btn-watch, .hm-card-btn-primary, .hm-card-btn-book, .shop-now-btn, .book-consultation-btn';
            document.addEventListener('click', (e) => {
                const btn = e.target.closest(selector);
                if (!btn) return;
                this.createRipple(btn, e);
            });

            if (!document.getElementById('evia-ripple-style')) {
                const s = document.createElement('style');
                s.id = 'evia-ripple-style';
                s.textContent = `
                    @keyframes eviaRipple { to { transform: scale(4); opacity: 0; } }
                    .evia-ripple {
                        position: absolute; border-radius: 50%;
                        background: rgba(255, 255, 255, 0.45);
                        transform: scale(0); pointer-events: none;
                        animation: eviaRipple 0.6s ease-out;
                        z-index: 2;
                    }
                    .hm-btn-ghost .evia-ripple,
                    .hm-card-btn-primary .evia-ripple { background: rgba(255, 140, 0, 0.2); }
                `;
                document.head.appendChild(s);
            }
        },

        createRipple(el, e) {
            const rect = el.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement('span');
            ripple.className = 'evia-ripple';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
            if (getComputedStyle(el).overflow === 'visible') el.style.overflow = 'hidden';

            el.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    };

    /* =========================================================================
       AOS INITIALIZATION
       ========================================================================= */
    const AOSInit = {
        init() {
            if (typeof AOS === 'undefined') return;

            AOS.init({
                duration: 900,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80,
                disable: CONFIG.reducedMotion
            });

            // Refresh after images/videos settle
            window.addEventListener('load', () => {
                setTimeout(() => AOS.refresh(), 300);
            });

            window.addEventListener('resize', U.debounce(() => AOS.refresh(), 250));
        }
    };

    /* =========================================================================
       VIEWPORT HEIGHT FIX (mobile 100vh issue)
       ========================================================================= */
    const ViewportFix = {
        init() {
            const set = () => {
                document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
            };
            set();
            window.addEventListener('resize', U.debounce(set, 150));
            window.addEventListener('orientationchange', () => setTimeout(set, 300));
        }
    };

    /* =========================================================================
       APP CONTROLLER
       ========================================================================= */
    const App = {
        init() {
            // Shared (every page)
            Header.init();
            FloatingButtons.init();
            SmoothScroll.init();
            AOSInit.init();
            ViewportFix.init();
            Ripples.init();

            // Home-specific (no-op if not present)
            CinematicHero.init();
            VideoModal.init();
            ServicesFilter.init();
            ServicesCarousel.init();
            ResultsSliders.init();
            ProductsCarousel.init();
            FAQ.init();
            Parallax.init();

            // Touch device class
            if (CONFIG.isTouch) document.documentElement.classList.add('touch-device');

            console.log('✨ Eviaesthetics initialized');
        }
    };

    /* =========================================================================
       BOOT
       ========================================================================= */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

    // Expose for debugging / external integration
    window.Evia = {
        utils: U,
        config: CONFIG,
        modules: { Header, FloatingButtons, CinematicHero, VideoModal, ServicesFilter, ServicesCarousel, ResultsSliders, ProductsCarousel, FAQ, Parallax },
        reinit: () => App.init()
    };

    // Global helper (backward compat with existing inline handlers)
    window.scrollToContact = () => {
        const el = U.$('#contact') || U.$('.hc-contact-masterpiece') || U.$('.hm-contact-preview');
        if (el) U.scrollTo(el, 80);
    };

})();
