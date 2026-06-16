/* =============================================================================
   EVIAESTHETICS — SCRIPT.JS
   Manhattan Medical Spa · Editorial Luxury
   -----------------------------------------------------------------------------
   Single file. Every module feature-detects and no-ops if its elements
   aren't on the page. Modules:
     Header · Drawer · Reveal · Parallax · Compare (before/after) ·
     Magnetic · ServicesFilter · FAQ · VideoModal · HeroVideo ·
     ToTop · AnchorScroll
============================================================================= */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    /* rAF throttle for scroll handlers */
    function rafThrottle(fn) {
        let ticking = false;
        return function (...args) {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => { fn.apply(this, args); ticking = false; });
        };
    }

    /* Debounce for resize handlers */
    function debounce(fn, wait) {
        let t;
        return function (...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    /* =========================================================================
       HEADER — glass on scroll
    ========================================================================= */
    const Header = {
        init() {
            this.el = $('#evHeader');
            if (!this.el) return;
            const onScroll = rafThrottle(() => {
                this.el.classList.toggle('scrolled', window.scrollY > 40);
            });
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    };

    /* =========================================================================
       MOBILE DRAWER
    ========================================================================= */
    const Drawer = {
        init() {
            this.drawer = $('#evDrawer');
            this.burger = $('#evBurger');
            this.close  = $('#evDrawerClose');
            if (!this.drawer || !this.burger) return;

            this.isOpen = false;
            this.burger.addEventListener('click', () => this.toggle());
            this.close?.addEventListener('click', () => this.set(false));

            // Click on scrim (the drawer backdrop) closes
            this.drawer.addEventListener('click', (e) => {
                if (e.target === this.drawer) this.set(false);
            });

            // Any drawer link closes
            $$('.ev-drawer-nav a, .ev-drawer-cta a', this.drawer).forEach(a =>
                a.addEventListener('click', () => this.set(false))
            );

            // Escape closes
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) this.set(false);
            });
        },
        toggle() { this.set(!this.isOpen); },
        set(open) {
            this.isOpen = open;
            this.drawer.classList.toggle('open', open);
            this.burger.classList.toggle('active', open);
            this.burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            this.drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
            document.body.classList.toggle('ev-locked', open);
        }
    };

    /* =========================================================================
       SCROLL REVEAL — toggles .is-visible on [data-reveal]
    ========================================================================= */
    const Reveal = {
        init() {
            const els = $$('[data-reveal]');
            if (!els.length) return;

            if (reduceMotion || !('IntersectionObserver' in window)) {
                els.forEach(el => el.classList.add('is-visible'));
                return;
            }

            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

            // Stagger siblings that share a parent for a refined cascade
            els.forEach((el) => {
                const sibs = $$('[data-reveal]', el.parentElement)
                    .filter(s => s.parentElement === el.parentElement);
                const idx = sibs.indexOf(el);
                if (idx > 0) el.style.transitionDelay = Math.min(idx * 0.08, 0.4) + 's';
                io.observe(el);
            });
        }
    };

    /* =========================================================================
       IMAGE PARALLAX — gentle drift on [data-parallax]
    ========================================================================= */
    const Parallax = {
        init() {
            this.items = $$('[data-parallax]');
            if (!this.items.length || reduceMotion) return;

            const onScroll = rafThrottle(() => {
                const vh = window.innerHeight;
                this.items.forEach(img => {
                    const r = img.getBoundingClientRect();
                    if (r.bottom < 0 || r.top > vh) return;
                    const progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
                    img.style.transform =
                        `translate3d(0, ${(-progress * 26).toFixed(1)}px, 0) scale(1.06)`;
                });
            });
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    };

    /* =========================================================================
       BEFORE / AFTER SLIDERS — drag on [data-compare]
    ========================================================================= */
    const Compare = {
        init() {
            $$('[data-compare]').forEach(box => this.bind(box));
        },
        bind(box) {
            const before = $('.ev-compare-before', box);
            const handle = $('.ev-compare-handle', box);
            if (!before || !handle) return;

            let dragging = false;

            const setPos = (clientX) => {
                const rect = box.getBoundingClientRect();
                let pct = ((clientX - rect.left) / rect.width) * 100;
                pct = Math.max(0, Math.min(100, pct));
                before.style.width = pct + '%';
                handle.style.left = pct + '%';
            };

            const start = (e) => {
                dragging = true;
                box.classList.add('is-dragging');
                setPos(e.touches ? e.touches[0].clientX : e.clientX);
            };
            const move = (e) => {
                if (!dragging) return;
                setPos(e.touches ? e.touches[0].clientX : e.clientX);
            };
            const end = () => { dragging = false; box.classList.remove('is-dragging'); };

            box.addEventListener('mousedown', start);
            box.addEventListener('touchstart', start, { passive: true });
            window.addEventListener('mousemove', move);
            window.addEventListener('touchmove', move, { passive: true });
            window.addEventListener('mouseup', end);
            window.addEventListener('touchend', end);

            // Click anywhere on the image to jump the divider
            box.addEventListener('click', (e) => setPos(e.clientX));

            // Initialize at 50%
            before.style.width = '50%';
            handle.style.left = '50%';
        }
    };

    /* =========================================================================
       MAGNETIC BUTTONS — subtle pull toward cursor on .ev-magnetic
    ========================================================================= */
    const Magnetic = {
        init() {
            if (reduceMotion || window.matchMedia('(hover: none)').matches) return;
            $$('.ev-magnetic').forEach(btn => {
                const strength = 0.3;
                btn.addEventListener('mousemove', (e) => {
                    const r = btn.getBoundingClientRect();
                    const x = (e.clientX - r.left - r.width / 2) * strength;
                    const y = (e.clientY - r.top - r.height / 2) * strength;
                    btn.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
                });
                btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
            });
        }
    };

    /* =========================================================================
       SERVICES FILTER — category pills toggle .ev-hidden
    ========================================================================= */
    const ServicesFilter = {
        init() {
            this.pills = $$('.ev-filter-pill');
            this.cards = $$('.ev-service[data-category]');
            if (!this.pills.length || !this.cards.length) return;

            this.pills.forEach(pill =>
                pill.addEventListener('click', () => this.filter(pill))
            );
        },
        filter(active) {
            const cat = active.dataset.filter;
            this.pills.forEach(p => {
                const on = p === active;
                p.classList.toggle('active', on);
                p.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            this.cards.forEach(card => {
                const show = cat === 'all' || card.dataset.category === cat;
                card.classList.toggle('ev-hidden', !show);
                if (show) {
                    card.classList.remove('is-visible');
                    requestAnimationFrame(() => card.classList.add('is-visible'));
                }
            });
        }
    };

    /* =========================================================================
       FAQ ACCORDION — close siblings when one opens
    ========================================================================= */
    const FAQ = {
        init() {
            this.items = $$('.ev-faq-item');
            if (!this.items.length) return;
            this.items.forEach(item => {
                item.addEventListener('toggle', () => {
                    if (item.open) {
                        this.items.forEach(o => { if (o !== item) o.open = false; });
                    }
                });
            });
        }
    };

    /* =========================================================================
       VIDEO MODAL — "Watch the Film"
    ========================================================================= */
    const VideoModal = {
        init() {
            this.modal   = $('#evModal');
            this.trigger = $('#evWatchTour');
            this.close   = $('#evModalClose');
            this.scrim   = $('#evModalScrim');
            this.video   = $('#evModalVideo');
            if (!this.modal || !this.trigger) return;

            this.trigger.addEventListener('click', () => this.open());
            this.close?.addEventListener('click', () => this.set(false));
            this.scrim?.addEventListener('click', () => this.set(false));
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('open')) this.set(false);
            });
        },
        open() {
            this.set(true);
            if (this.video) {
                this.video.currentTime = 0;
                const p = this.video.play();
                if (p && p.catch) p.catch(() => {});
            }
        },
        set(open) {
            this.modal.classList.toggle('open', open);
            this.modal.setAttribute('aria-hidden', open ? 'false' : 'true');
            document.body.classList.toggle('ev-locked', open);
            if (!open && this.video) this.video.pause();
        }
    };

    /* =========================================================================
       HERO VIDEO — ensure autoplay on iOS/Safari
    ========================================================================= */
    const HeroVideo = {
        init() {
            const v = $('.ev-hero-video');
            if (!v) return;
            const play = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
            if (v.readyState >= 2) play();
            else v.addEventListener('loadeddata', play, { once: true });
        }
    };

    /* =========================================================================
       BACK TO TOP
    ========================================================================= */
    const ToTop = {
        init() {
            this.btn = $('#evToTop');
            if (!this.btn) return;
            const onScroll = rafThrottle(() => {
                this.btn.classList.toggle('visible', window.scrollY > 600);
            });
            window.addEventListener('scroll', onScroll, { passive: true });
            this.btn.addEventListener('click', () =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
            );
        }
    };

    /* =========================================================================
       SMOOTH ANCHOR SCROLL (offset for fixed header)
    ========================================================================= */
    const AnchorScroll = {
        init() {
            document.addEventListener('click', (e) => {
                const a = e.target.closest('a[href^="#"]');
                if (!a) return;
                const href = a.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                const target = $(href);
                if (!target) return;
                e.preventDefault();
                const headerH = parseInt(
                    getComputedStyle(document.documentElement).getPropertyValue('--header-h')
                ) || 84;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        }
    };

    /* =========================================================================
       VIEWPORT HEIGHT FIX (mobile 100vh / address-bar issue)
    ========================================================================= */
    const ViewportFix = {
        init() {
            const set = () =>
                document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
            set();
            window.addEventListener('resize', debounce(set, 150));
            window.addEventListener('orientationchange', () => setTimeout(set, 300));
        }
    };

    /* =========================================================================
       BOOT
    ========================================================================= */
    function boot() {
        Header.init();
        Drawer.init();
        Reveal.init();
        Parallax.init();
        Compare.init();
        Magnetic.init();
        ServicesFilter.init();
        FAQ.init();
        VideoModal.init();
        HeroVideo.init();
        ToTop.init();
        AnchorScroll.init();
        ViewportFix.init();

        if ('ontouchstart' in window) document.documentElement.classList.add('touch');
        console.log('✦ Eviaesthetics ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // Expose for debugging
    window.Evia = {
        reinit: boot,
        modules: { Header, Drawer, Reveal, Parallax, Compare, Magnetic, ServicesFilter, FAQ, VideoModal, HeroVideo, ToTop, AnchorScroll }
    };
})();
