/* =============================================================================
   EVIAESTHETICS — SCRIPT.JS (ES6 module)
   Editorial magazine redesign
   -----------------------------------------------------------------------------
   Loaded with <script type="module">, so this file runs in module scope —
   no IIFE wrapper needed, and it's automatically deferred and strict mode.

   Every module is an ES6 class that feature-detects and no-ops if its
   elements aren't on the page:
     Curtain · Header · Drawer · Reveal · Parallax · Counters ·
     IndexPreview (floating image) · IndexFilter · Faq · VideoModal ·
     HeroVideo · ToTop · AnchorScroll · ViewportFix
============================================================================= */

/* =============================================================================
   HELPERS
============================================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $  = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

/** rAF throttle for scroll/pointer handlers */
const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            fn(...args);
            ticking = false;
        });
    };
};

/** Debounce for resize handlers */
const debounce = (fn, wait) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
    };
};

/* =============================================================================
   CURTAIN — page-load reveal, then stagger the cover in
============================================================================= */
class Curtain {
    constructor() {
        this.el = $('#edCurtain');
        this.done = false;
    }

    init() {
        if (!this.el || reduceMotion) {
            this.lift();
            return;
        }

        // Lift once fonts/first paint settle — hard fallback at 2.2s
        const go = () => {
            if (this.done) return;
            this.done = true;
            setTimeout(() => this.lift(), 350);
        };

        if (document.readyState === 'complete') go();
        else window.addEventListener('load', go, { once: true });
        setTimeout(go, 2200);
    }

    lift() {
        this.el?.classList.add('lifted');
        document.body.classList.add('ed-loaded');
    }
}

/* =============================================================================
   HEADER — glass on scroll
============================================================================= */
class Header {
    constructor() {
        this.el = $('#edHeader');
    }

    init() {
        if (!this.el) return;
        const onScroll = rafThrottle(() => {
            this.el.classList.toggle('scrolled', window.scrollY > 40);
        });
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
}

/* =============================================================================
   MOBILE DRAWER
============================================================================= */
class Drawer {
    constructor() {
        this.drawer   = $('#edDrawer');
        this.burger   = $('#edBurger');
        this.closeBtn = $('#edDrawerClose');
        this.isOpen   = false;
    }

    init() {
        if (!this.drawer || !this.burger) return;

        this.burger.addEventListener('click', () => this.toggle());
        this.closeBtn?.addEventListener('click', () => this.set(false));

        // Click on scrim closes
        this.drawer.addEventListener('click', (e) => {
            if (e.target === this.drawer) this.set(false);
        });

        // Any drawer link closes
        $$('.ed-drawer-nav a, .ed-drawer-cta a', this.drawer)
            .forEach(a => a.addEventListener('click', () => this.set(false)));

        // Escape closes
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.set(false);
        });
    }

    toggle() {
        this.set(!this.isOpen);
    }

    set(open) {
        this.isOpen = open;
        this.drawer.classList.toggle('open', open);
        this.burger.classList.toggle('active', open);
        this.burger.setAttribute('aria-expanded', String(open));
        this.drawer.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('ed-locked', open);
    }
}

/* =============================================================================
   SCROLL REVEAL — toggles .is-visible on [data-reveal]
============================================================================= */
class Reveal {
    init() {
        const els = $$('[data-reveal]');
        if (!els.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            els.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(({ isIntersecting, target }) => {
                if (isIntersecting) {
                    target.classList.add('is-visible');
                    io.unobserve(target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        // Stagger siblings that share a parent for a refined cascade
        els.forEach((el) => {
            const sibs = $$('[data-reveal]', el.parentElement)
                .filter(s => s.parentElement === el.parentElement);
            const idx = sibs.indexOf(el);
            if (idx > 0) el.style.transitionDelay = `${Math.min(idx * 0.07, 0.35)}s`;
            io.observe(el);
        });
    }
}

/* =============================================================================
   IMAGE PARALLAX — gentle drift on [data-parallax]
============================================================================= */
class Parallax {
    constructor() {
        this.items = $$('[data-parallax]');
    }

    init() {
        if (!this.items.length || reduceMotion) return;

        const onScroll = rafThrottle(() => {
            const vh = window.innerHeight;
            this.items.forEach(img => {
                const r = img.getBoundingClientRect();
                if (r.bottom < 0 || r.top > vh) return;
                const progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
                img.style.transform =
                    `translate3d(0, ${(-progress * 24).toFixed(1)}px, 0) scale(1.06)`;
            });
        });
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
}

/* =============================================================================
   COUNTERS — count-up for [data-count] in the ledger
============================================================================= */
class Counters {
    init() {
        const els = $$('[data-count]');
        if (!els.length) return;

        if (!('IntersectionObserver' in window)) {
            els.forEach(el => {
                el.textContent = (parseInt(el.dataset.count, 10) || 0).toLocaleString();
            });
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(({ isIntersecting, target }) => {
                if (isIntersecting) {
                    this.run(target);
                    io.unobserve(target);
                }
            });
        }, { threshold: 0.4 });

        els.forEach(el => io.observe(el));
    }

    run(el) {
        const target = parseInt(el.dataset.count, 10) || 0;
        if (reduceMotion) {
            el.textContent = target.toLocaleString();
            return;
        }
        const dur = 1400;
        const t0 = performance.now();
        const tick = (now) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - (1 - p) ** 3;
            el.textContent = Math.round(target * eased).toLocaleString();
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
}

/* =============================================================================
   INDEX PREVIEW — floating image follows cursor over treatment rows
============================================================================= */
class IndexPreview {
    constructor() {
        this.list    = $('#edIndexList');
        this.preview = $('#edPreview');
        this.img     = this.preview ? $('img', this.preview) : null;
        this.x = 0;  this.y = 0;    // target (cursor)
        this.cx = 0; this.cy = 0;   // current (lerped)
        this.active = false;
        this.raf = null;
    }

    init() {
        if (!this.list || !this.preview) return;
        if (reduceMotion || window.matchMedia('(hover: none)').matches) return;

        $$('.ed-row', this.list).forEach(row => {
            row.addEventListener('mouseenter', () => {
                const src = row.dataset.img;
                if (src && this.img.getAttribute('src') !== src) this.img.src = src;
                this.show();
            });
        });

        this.list.addEventListener('mousemove', (e) => {
            this.x = e.clientX;
            this.y = e.clientY;
        });
        this.list.addEventListener('mouseleave', () => this.hide());
    }

    show() {
        if (this.active) return;
        this.active = true;
        // Snap to cursor so it doesn't fly in from a corner
        this.cx = this.x;
        this.cy = this.y;
        this.preview.classList.add('on');
        this.loop();
    }

    hide() {
        this.active = false;
        this.preview.classList.remove('on');
        if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
    }

    loop() {
        if (!this.active) return;
        // Lerp toward the cursor for a soft, weighty follow
        this.cx += (this.x - this.cx) * 0.14;
        this.cy += (this.y - this.cy) * 0.14;
        this.preview.style.left = `${this.cx.toFixed(1)}px`;
        this.preview.style.top  = `${this.cy.toFixed(1)}px`;
        this.raf = requestAnimationFrame(() => this.loop());
    }
}

/* =============================================================================
   INDEX FILTER — category pills toggle .ed-hidden on rows
============================================================================= */
class IndexFilter {
    constructor() {
        this.pills = $$('.ed-filter-pill');
        this.rows  = $$('.ed-row[data-category]');
    }

    init() {
        if (!this.pills.length || !this.rows.length) return;
        this.pills.forEach(pill =>
            pill.addEventListener('click', () => this.filter(pill))
        );
    }

    filter(active) {
        const cat = active.dataset.filter;
        this.pills.forEach(p => {
            const on = p === active;
            p.classList.toggle('active', on);
            p.setAttribute('aria-selected', String(on));
        });
        this.rows.forEach(row => {
            const show = cat === 'all' || row.dataset.category === cat;
            row.classList.toggle('ed-hidden', !show);
            if (show) {
                row.classList.remove('is-visible');
                requestAnimationFrame(() => row.classList.add('is-visible'));
            }
        });
    }
}

/* =============================================================================
   FAQ ACCORDION — close siblings when one opens
============================================================================= */
class Faq {
    constructor() {
        this.items = $$('.ed-faq-item');
    }

    init() {
        if (!this.items.length) return;
        this.items.forEach(item => {
            item.addEventListener('toggle', () => {
                if (!item.open) return;
                this.items.forEach(other => {
                    if (other !== item) other.open = false;
                });
            });
        });
    }
}

/* =============================================================================
   VIDEO MODAL — "Watch the Film"
============================================================================= */
class VideoModal {
    constructor() {
        this.modal    = $('#edModal');
        this.trigger  = $('#edWatchTour');
        this.closeBtn = $('#edModalClose');
        this.scrim    = $('#edModalScrim');
        this.video    = $('#edModalVideo');
    }

    init() {
        if (!this.modal || !this.trigger) return;

        this.trigger.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.set(false));
        this.scrim?.addEventListener('click', () => this.set(false));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('open')) this.set(false);
        });
    }

    open() {
        this.set(true);
        if (this.video) {
            this.video.currentTime = 0;
            this.video.play()?.catch(() => {});
        }
    }

    set(open) {
        this.modal.classList.toggle('open', open);
        this.modal.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('ed-locked', open);
        if (!open) this.video?.pause();
    }
}

/* =============================================================================
   HERO VIDEO — ensure autoplay on iOS/Safari
============================================================================= */
class HeroVideo {
    init() {
        const video = $('.ed-cover-video');
        if (!video) return;
        const play = () => video.play()?.catch(() => {});
        if (video.readyState >= 2) play();
        else video.addEventListener('loadeddata', play, { once: true });
    }
}

/* =============================================================================
   BACK TO TOP
============================================================================= */
class ToTop {
    constructor() {
        this.btn = $('#edToTop');
    }

    init() {
        if (!this.btn) return;
        const onScroll = rafThrottle(() => {
            this.btn.classList.toggle('visible', window.scrollY > 600);
        });
        window.addEventListener('scroll', onScroll, { passive: true });
        this.btn.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
        );
    }
}

/* =============================================================================
   SMOOTH ANCHOR SCROLL (offset for fixed header)
============================================================================= */
class AnchorScroll {
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
                getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
                10
            ) || 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    }
}

/* =============================================================================
   VIEWPORT HEIGHT FIX (mobile 100vh / address-bar issue)
============================================================================= */
class ViewportFix {
    init() {
        const set = () =>
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        set();
        window.addEventListener('resize', debounce(set, 150));
        window.addEventListener('orientationchange', () => setTimeout(set, 300));
    }
}

/* =============================================================================
   BOOT
============================================================================= */
const modules = {
    curtain:      new Curtain(),
    header:       new Header(),
    drawer:       new Drawer(),
    reveal:       new Reveal(),
    parallax:     new Parallax(),
    counters:     new Counters(),
    indexPreview: new IndexPreview(),
    indexFilter:  new IndexFilter(),
    faq:          new Faq(),
    videoModal:   new VideoModal(),
    heroVideo:    new HeroVideo(),
    toTop:        new ToTop(),
    anchorScroll: new AnchorScroll(),
    viewportFix:  new ViewportFix(),
};

const boot = () => {
    Object.values(modules).forEach(m => m.init());
    if ('ontouchstart' in window) document.documentElement.classList.add('touch');
    console.log('✦ Eviaesthetics — editorial edition ready');
};

// type="module" scripts are deferred, so the DOM is ready — but guard anyway
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

// Expose for debugging in the console
window.Evia = { reinit: boot, modules };
