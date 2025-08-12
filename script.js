/* ========================================
   EVIA AESTHETICS - OPTIMIZED LUXURY EXPERIENCE
   PERFORMANCE ENHANCED & MOBILE OPTIMIZED
   WITH ENHANCED HEADER & MOBILE MENU
   + LUXURY FLOATING ACTION BUTTONS
   ======================================== */

'use strict';

/* ========================================
   GLOBAL UTILITIES & CONFIGURATION
   ======================================== */

const EviaConfig = {
    breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        large: 1200
    },
    
    animations: {
        duration: {
            fast: 300,
            medium: 600,
            slow: 1000
        },
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    
    carousel: {
        autoPlayDuration: 4000,
        transitionDuration: 800
    }
};

const EviaUtils = {
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    smoothScrollTo(target, offset = 100) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;
        
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },
    
    animate(element, keyframes, options = {}) {
        if (!element) return Promise.resolve();
        
        const defaultOptions = {
            duration: EviaConfig.animations.duration.medium,
            easing: EviaConfig.animations.easing,
            fill: 'forwards'
        };
        
        return element.animate(keyframes, { ...defaultOptions, ...options });
    },
    
    isMobile() {
        return window.innerWidth <= EviaConfig.breakpoints.tablet;
    },
    
    isTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

/* ========================================
   MAIN APPLICATION CLASS
   ======================================== */

class EviaLuxuryApp {
    constructor() {
        this.isLoaded = false;
        this.components = new Map();
        this.observerInstances = new Map();
        
        this.init();
    }
    
    init() {
        this.bindGlobalEvents();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }
    
    bindGlobalEvents() {
        window.addEventListener('load', () => this.onWindowLoad());
        window.addEventListener('resize', EviaUtils.debounce(() => this.onWindowResize(), 250));
        
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));
        
        // Global click handlers
        document.addEventListener('click', (e) => this.handleGlobalClicks(e));
    }
    
    onDOMReady() {
        try {
            this.initializeComponents();
            this.initializeObservers();
            this.initAOS();
            
            console.log('✅ Evia Luxury App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            this.handleInitializationError(error);
        }
    }
    
    initializeComponents() {
        const componentDefinitions = [
            { name: 'preloader', class: LuxuryPreloader },
            { name: 'header', class: EnhancedHermesLuxuryHeader },
            { name: 'mobileMenu', class: UltraLuxuryMobileMenu },
            { name: 'hero', class: CinematicHero },
            { name: 'servicesCarousel', class: LuxuryServicesCarousel },
            { name: 'beforeAfter', class: BeforeAfterSlider },
            { name: 'contactForm', class: ContactForm },
            { name: 'magneticEffects', class: MagneticEffects },
            { name: 'floatingButtons', class: LuxuryFloatingButtons }
        ];
        
        componentDefinitions.forEach(({ name, class: ComponentClass }) => {
            try {
                this.components.set(name, new ComponentClass());
            } catch (error) {
                console.warn(`⚠️ Failed to initialize ${name}:`, error);
            }
        });
    }
    
    initializeObservers() {
        this.initScrollObserver();
        this.initVisibilityObserver();
    }
    
    initScrollObserver() {
        const animateElements = document.querySelectorAll('[data-animate], .service-card, .result-card, .contact-item');
        
        if (!animateElements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -5% 0px'
        });
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(el);
        });
        
        this.observerInstances.set('scroll', observer);
    }
    
    initVisibilityObserver() {
        // Page visibility API for performance optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 100,
                disable: EviaUtils.isMobile() ? 'mobile' : false
            });
        }
    }
    
    onWindowLoad() {
        this.isLoaded = true;
        document.body.classList.add('loaded');
        
        // Start signature animation after everything loads
        this.startSignatureAnimation();
        
        console.log('✨ Evia Luxury Experience fully loaded');
    }
    
    onWindowResize() {
        // Update components on resize
        this.components.forEach((component, name) => {
            if (component && typeof component.onResize === 'function') {
                component.onResize();
            }
        });
    }
    
    handleGlobalKeyboard(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'h':
                    e.preventDefault();
                    this.smoothScrollTo('#home', 0);
                    break;
                case 's':
                    e.preventDefault();
                    this.smoothScrollTo('#services');
                    break;
                case 'c':
                    e.preventDefault();
                    this.smoothScrollTo('#contact');
                    break;
            }
        }
        
        // Escape key handling for mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = this.components.get('mobileMenu');
            if (mobileMenu && mobileMenu.isOpen) {
                mobileMenu.closeMenu();
            }
        }
    }
    
    handleGlobalClicks(e) {
        // Handle service CTAs
        if (e.target.closest('.service-cta, .service-btn')) {
            e.preventDefault();
            this.smoothScrollTo('#contact');
            return;
        }
        
        // Handle anchor links
        const link = e.target.closest('a[href^="#"]');
        if (link && link.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = link.getAttribute('href');
            this.smoothScrollTo(target);
        }
    }
    
    startSignatureAnimation() {
        const hero = this.components.get('hero');
        if (hero && hero.startSignatureAnimation) {
            setTimeout(() => {
                hero.startSignatureAnimation();
            }, 2000);
        }
    }
    
    pauseAnimations() {
        // Pause resource-intensive animations when page is hidden
        document.body.classList.add('animations-paused');
    }
    
    resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }
    
    handleInitializationError(error) {
        // Graceful fallback for initialization errors
        console.error('App initialization failed, attempting recovery...', error);
        
        setTimeout(() => {
            try {
                this.initializeComponents();
                console.log('✅ Recovery successful');
            } catch (recoveryError) {
                console.error('❌ Recovery failed:', recoveryError);
            }
        }, 1000);
    }
    
    // Public API
    smoothScrollTo(target, offset = 100) {
        return EviaUtils.smoothScrollTo(target, offset);
    }
    
    getComponent(name) {
        return this.components.get(name);
    }
    
    destroy() {
        // Cleanup method
        this.observerInstances.forEach(observer => observer.disconnect());
        this.components.forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
    }
}

/* ========================================
   PRELOADER COMPONENT
   ======================================== */

class LuxuryPreloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.minDisplayTime = 2500;
        this.startTime = Date.now();
        this.isReady = false;
        
        if (this.preloader) {
            this.init();
        }
    }
    
    init() {
        document.body.style.overflow = 'hidden';
        this.startAnimations();
        this.checkReadyState();
    }
    
    startAnimations() {
        // Enhanced floating animations for icons
        const icons = this.preloader.querySelectorAll('.medspa-icon');
        icons.forEach((icon, index) => {
            this.animateIcon(icon, index);
        });
        
        // Logo pulse animation
        const logo = this.preloader.querySelector('.preloader-logo');
        if (logo) {
            this.animateLogo(logo);
        }
    }
    
    animateIcon(icon, index) {
        const baseDelay = index * 200;
        const duration = 4000 + (index * 300);
        
        const animate = () => {
            const time = Date.now() * 0.001;
            const offset = index * 0.7;
            const x = Math.sin(time + offset) * 20;
            const y = Math.cos(time * 0.8 + offset) * 15;
            const rotation = Math.sin(time + offset) * 10;
            
            icon.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            
            if (!this.isReady) {
                requestAnimationFrame(animate);
            }
        };
        
        setTimeout(animate, baseDelay);
    }
    
    animateLogo(logo) {
        const animate = () => {
            const time = Date.now() * 0.0008;
            const scale = 1 + Math.sin(time) * 0.02;
            logo.style.transform = `scale(${scale})`;
            
            if (!this.isReady) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    checkReadyState() {
        const checkInterval = setInterval(() => {
            const timeElapsed = Date.now() - this.startTime;
            const timeReady = timeElapsed >= this.minDisplayTime;
            const pageReady = document.readyState === 'complete';
            
            if (timeReady && pageReady) {
                clearInterval(checkInterval);
                this.fadeOut();
            }
        }, 100);
        
        // Fallback timeout
        setTimeout(() => {
            clearInterval(checkInterval);
            this.fadeOut();
        }, 5000);
    }
    
    async fadeOut() {
        this.isReady = true;
        
        // Staggered fade out of icons
        const icons = this.preloader.querySelectorAll('.medspa-icon');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                EviaUtils.animate(icon, [
                    { opacity: 1, transform: 'scale(1) rotate(0deg)' },
                    { opacity: 0, transform: 'scale(0.5) rotate(180deg)' }
                ], { duration: 400 });
            }, index * 50);
        });
        
        // Fade out logo and loading indicator
        await EviaUtils.wait(300);
        
        const logo = this.preloader.querySelector('.preloader-logo');
        const loadingIndicator = this.preloader.querySelector('.loading-indicator');
        
        if (logo) {
            EviaUtils.animate(logo, [
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0.8)' }
            ]);
        }
        
        if (loadingIndicator) {
            EviaUtils.animate(loadingIndicator, [
                { opacity: 1 },
                { opacity: 0 }
            ]);
        }
        
        // Fade out entire preloader
        await EviaUtils.wait(500);
        
        this.preloader.classList.add('fade-out');
        
        // Remove from DOM
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = '';
            document.body.classList.add('preloader-complete');
        }, 1200);
    }
}

/* ========================================
   ENHANCED HEADER COMPONENT
   ======================================== */

class EnhancedHermesLuxuryHeader {
    constructor() {
        this.header = document.getElementById('header');
        this.lastScrollY = 0;
        this.ticking = false;
        this.isScrolled = false;
        
        if (this.header) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.initNavigation();
        this.startHeaderAnimations();
        console.log('✨ Enhanced Header initialized');
    }
    
    bindEvents() {
        // Optimized scroll handler
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => this.handleScroll());
                this.ticking = true;
            }
        }, { passive: true });
        
        // Header CTA
        const headerCTA = document.getElementById('headerCTA');
        if (headerCTA) {
            headerCTA.addEventListener('click', () => {
                app.smoothScrollTo('#contact');
            });
            
            headerCTA.addEventListener('mouseenter', () => {
                this.addCTAShimmer(headerCTA);
            });
        }
        
        // Logo click
        const headerLogo = this.header.querySelector('.header-logo');
        if (headerLogo) {
            headerLogo.addEventListener('click', () => {
                app.smoothScrollTo('#home', 0);
            });
        }
        
        // Mobile toggle
        const mobileToggle = document.getElementById('mobileToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldTransform = scrollY > 100;
        
        if (shouldTransform !== this.isScrolled) {
            this.isScrolled = shouldTransform;
            this.header.classList.toggle('scrolled', this.isScrolled);
        }
        
        this.lastScrollY = scrollY;
        this.ticking = false;
    }
    
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    app.smoothScrollTo(href);
                    this.updateActiveLink(href);
                });
                
                // Enhanced hover effects
                link.addEventListener('mouseenter', () => {
                    this.addNavLinkShine(link);
                });
            }
        });
        
        this.initActiveNavigation();
    }
    
    addNavLinkShine(link) {
        if (EviaUtils.isMobile()) return;
        
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s ease;
            pointer-events: none;
            border-radius: 1.5rem;
            z-index: 0;
        `;
        
        link.style.position = 'relative';
        link.appendChild(shine);
        
        requestAnimationFrame(() => {
            shine.style.left = '100%';
        });
        
        setTimeout(() => {
            if (shine.parentNode) {
                shine.parentNode.removeChild(shine);
            }
        }, 600);
    }
    
    addCTAShimmer(cta) {
        const shimmer = cta.querySelector('.cta-shine');
        if (shimmer) {
            shimmer.style.left = '-100%';
            shimmer.style.transition = 'none';
            shimmer.offsetHeight; // Force reflow
            shimmer.style.transition = 'left 0.8s ease';
            shimmer.style.left = '100%';
        }
    }
    
    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveLink(`#${id}`);
                }
            });
        }, {
            threshold: [0.3, 0.7],
            rootMargin: '-20% 0px -20% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveLink(href) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }
    
    startHeaderAnimations() {
        const container = this.header.querySelector('.aluminum-container');
        if (!container || EviaUtils.isMobile()) return;
        
        let floatOffset = 0;
        
        const animate = () => {
            if (document.hidden) return;
            
            floatOffset += 0.005;
            const yOffset = Math.sin(floatOffset) * 0.5;
            
            if (!this.isScrolled) {
                container.style.transform = `translateY(${yOffset}px)`;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    toggleMobileMenu() {
        const toggle = document.getElementById('mobileToggle');
        if (toggle) {
            toggle.classList.toggle('active');
            
            // Enhanced toggle animation
            if (toggle.classList.contains('active')) {
                EviaUtils.animate(toggle, [
                    { transform: 'scale(1) rotate(0deg)' },
                    { transform: 'scale(1.1) rotate(180deg)' }
                ], { duration: 400, easing: EviaConfig.animations.bounce });
            } else {
                EviaUtils.animate(toggle, [
                    { transform: 'scale(1.1) rotate(180deg)' },
                    { transform: 'scale(1) rotate(360deg)' }
                ], { duration: 400, easing: EviaConfig.animations.bounce });
            }
            
            const mobileMenu = app.getComponent('mobileMenu');
            if (mobileMenu) {
                if (toggle.classList.contains('active')) {
                    mobileMenu.openMenu();
                } else {
                    mobileMenu.closeMenu();
                }
            }
        }
    }
    
    onResize() {
        if (window.innerWidth > EviaConfig.breakpoints.tablet) {
            const toggle = document.getElementById('mobileToggle');
            if (toggle) {
                toggle.classList.remove('active');
            }
        }
    }
}

/* ========================================
   ULTRA-LUXURY MOBILE MENU COMPONENT
   ======================================== */

class UltraLuxuryMobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileToggle');
        this.menu = document.getElementById('mobileMenu');
        this.backdrop = document.getElementById('mobileBackdrop');
        this.close = document.getElementById('mobileClose');
        this.navItems = document.querySelectorAll('.nav-item');
        this.isOpen = false;
        this.animationInProgress = false;
        
        if (this.toggle && this.menu) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.prepareAnimations();
        console.log('🎭 Ultra-Luxury Mobile Menu initialized');
    }
    
    bindEvents() {
        // Close button with enhanced animation
        if (this.close) {
            this.close.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
            });
            
            this.close.addEventListener('mouseenter', () => {
                this.addCloseHoverEffect();
            });
        }
        
        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Enhanced navigation links
        this.navItems.forEach((item, index) => {
            const link = item.querySelector('.nav-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        this.navigateAndClose(href, index);
                    }
                });
                
                // Advanced hover effects
                link.addEventListener('mouseenter', () => {
                    this.playNavHoverEffect(item);
                });
                
                link.addEventListener('mouseleave', () => {
                    this.resetNavHoverEffect(item);
                });
            }
        });
        
        // Enhanced menu CTA
        const menuCTA = document.querySelector('.menu-cta');
        if (menuCTA) {
            menuCTA.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick();
            });
            
            menuCTA.addEventListener('mouseenter', () => {
                this.addCTAGlow(menuCTA);
            });
        }
        
        // Social links with micro-interactions
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.addSocialHoverEffect(link);
            });
        });
        
        // Window resize
        window.addEventListener('resize', EviaUtils.debounce(() => {
            if (this.isOpen && window.innerWidth > EviaConfig.breakpoints.tablet) {
                this.closeMenu();
            }
        }, 250));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    prepareAnimations() {
        // Set initial states for animations
        this.navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(50px) scale(0.9)';
            item.style.transition = `all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.1}s`;
        });
        
        const menuFooter = document.querySelector('.menu-footer');
        if (menuFooter) {
            menuFooter.style.opacity = '0';
            menuFooter.style.transform = 'translateY(30px) scale(0.95)';
            menuFooter.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s';
        }
    }
    
    async openMenu() {
        if (this.isOpen || this.animationInProgress) return;
        
        this.animationInProgress = true;
        this.isOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Enhanced backdrop animation
        this.backdrop.classList.add('active');
        EviaUtils.animate(this.backdrop, [
            { opacity: 0 },
            { opacity: 1 }
        ], { duration: 600 });
        
        // Enhanced menu slide-in
        this.menu.classList.add('active');
        EviaUtils.animate(this.menu, [
            { transform: 'translateX(100%) scale(0.9)', opacity: 0 },
            { transform: 'translateX(0) scale(1)', opacity: 1 }
        ], { duration: 800, easing: EviaConfig.animations.bounce });
        
        await EviaUtils.wait(200);
        
        // Staggered navigation items animation
        this.navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0) scale(1)';
                
                // Add micro-bounce effect
                setTimeout(() => {
                    EviaUtils.animate(item, [
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.02)' },
                        { transform: 'scale(1)' }
                    ], { duration: 300 });
                }, 200);
            }, index * 100);
        });
        
        // Animate footer with enhanced effect
        const menuFooter = document.querySelector('.menu-footer');
        if (menuFooter) {
            setTimeout(() => {
                menuFooter.style.opacity = '1';
                menuFooter.style.transform = 'translateY(0) scale(1)';
            }, 600);
        }
        
        // Add floating animation to decorative elements
        this.startDecorationAnimations();
        
        this.animationInProgress = false;
        console.log('🌟 Mobile menu opened with luxury animations');
    }
    
    async closeMenu() {
        if (!this.isOpen || this.animationInProgress) return;
        
        this.animationInProgress = true;
        this.isOpen = false;
        
        // Update toggle state
        const toggle = document.getElementById('mobileToggle');
        if (toggle) {
            toggle.classList.remove('active');
        }
        
        // Reverse animate footer
        const menuFooter = document.querySelector('.menu-footer');
        if (menuFooter) {
            menuFooter.style.opacity = '0';
            menuFooter.style.transform = 'translateY(30px) scale(0.95)';
        }
        
        // Reverse animate navigation items
        const reverseItems = Array.from(this.navItems).reverse();
        reverseItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(50px) scale(0.9)';
            }, index * 50);
        });
        
        await EviaUtils.wait(400);
        
        // Enhanced menu slide-out
        EviaUtils.animate(this.menu, [
            { transform: 'translateX(0) scale(1)', opacity: 1 },
            { transform: 'translateX(100%) scale(0.9)', opacity: 0 }
        ], { duration: 600, easing: EviaConfig.animations.bounce });
        
        // Fade backdrop
        EviaUtils.animate(this.backdrop, [
            { opacity: 1 },
            { opacity: 0 }
        ], { duration: 400 });
        
        setTimeout(() => {
            this.menu.classList.remove('active');
            this.backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }, 600);
        
        this.animationInProgress = false;
        console.log('✨ Mobile menu closed');
    }
    
    async navigateAndClose(href, itemIndex = 0) {
        // Highlight selected item with premium effect
        if (itemIndex >= 0 && this.navItems[itemIndex]) {
            const item = this.navItems[itemIndex];
            EviaUtils.animate(item, [
                { background: 'transparent', transform: 'scale(1)' },
                { background: 'rgba(255, 140, 0, 0.15)', transform: 'scale(1.05)' },
                { background: 'transparent', transform: 'scale(1)' }
            ], { duration: 600 });
        }
        
        await this.closeMenu();
        
        setTimeout(() => {
            app.smoothScrollTo(href);
        }, 300);
    }
    
    playNavHoverEffect(item) {
        const icon = item.querySelector('.nav-icon');
        const arrow = item.querySelector('.nav-arrow');
        
        if (icon) {
            EviaUtils.animate(icon, [
                { transform: 'scale(1) rotate(0deg)' },
                { transform: 'scale(1.1) rotate(5deg)' }
            ], { duration: 300 });
        }
        
        if (arrow) {
            EviaUtils.animate(arrow, [
                { transform: 'translateX(0)' },
                { transform: 'translateX(5px)' }
            ], { duration: 300 });
        }
    }
    
    resetNavHoverEffect(item) {
        const icon = item.querySelector('.nav-icon');
        const arrow = item.querySelector('.nav-arrow');
        
        if (icon) {
            EviaUtils.animate(icon, [
                { transform: 'scale(1.1) rotate(5deg)' },
                { transform: 'scale(1) rotate(0deg)' }
            ], { duration: 300 });
        }
        
        if (arrow) {
            EviaUtils.animate(arrow, [
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });
        }
    }
    
    addCloseHoverEffect() {
        const closeIcon = this.close.querySelector('.close-icon');
        if (closeIcon) {
            EviaUtils.animate(closeIcon, [
                { transform: 'scale(1) rotate(0deg)' },
                { transform: 'scale(1.1) rotate(90deg)' }
            ], { duration: 300 });
        }
    }
    
    addCTAGlow(cta) {
        const glow = cta.querySelector('.cta-glow');
        if (glow) {
            glow.style.opacity = '0.6';
            setTimeout(() => {
                glow.style.opacity = '0';
            }, 1000);
        }
    }
    
    addSocialHoverEffect(link) {
        EviaUtils.animate(link, [
            { transform: 'scale(1) rotate(0deg)' },
            { transform: 'scale(1.1) rotate(5deg)' }
        ], { duration: 300 });
    }
    
    handleCTAClick() {
        this.navigateAndClose('#contact');
        
        // Add success feedback
        this.showSuccessFeedback();
    }
    
    showSuccessFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00, #FFB84D);
            color: white;
            padding: 1rem 2rem;
            border-radius: 2rem;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(255, 140, 0, 0.4);
        `;
        feedback.textContent = 'Redirecting to consultation...';
        
        document.body.appendChild(feedback);
        
        EviaUtils.animate(feedback, [
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
        ], { duration: 300 });
        
        setTimeout(() => {
            EviaUtils.animate(feedback, [
                { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' }
            ], { duration: 300 }).then(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            });
        }, 2000);
    }
    
    startDecorationAnimations() {
        const orbs = document.querySelectorAll('.decoration-orb');
        orbs.forEach((orb, index) => {
            orb.style.animation = `float-gentle ${20 + index * 5}s ease-in-out infinite`;
        });
        
        const dots = document.querySelectorAll('.grid-dot');
        dots.forEach((dot, index) => {
            dot.style.animation = `pulse-dot 3s ease-in-out infinite ${index * 0.5}s`;
        });
    }
    
    onResize() {
        if (this.isOpen && window.innerWidth > EviaConfig.breakpoints.tablet) {
            this.closeMenu();
        }
    }
}

/* ========================================
   CINEMATIC HERO COMPONENT
   ======================================== */

class CinematicHero {
    constructor() {
        this.hero = document.querySelector('.cinematic-hero');
        this.primaryCTA = document.querySelector('.hero-cta-signature');
        this.signatureContainer = document.querySelector('.signature-container');
        this.hasAnimatedSignature = false;
        
        if (this.hero) {
            this.init();
        }
    }
    
    init() {
        this.initCTAButtons();
        this.initScrollIndicator();
        this.initFloatingElements();
        this.initStatPills();
        this.initVideo();
        this.prepareSignatureAnimation();
    }
    
    initCTAButtons() {
        if (this.primaryCTA) {
            this.primaryCTA.addEventListener('click', () => {
                app.smoothScrollTo('#contact');
            });
            
            this.primaryCTA.addEventListener('click', (e) => {
                this.triggerCTARipple(e);
            });
            
            this.primaryCTA.addEventListener('mouseenter', () => {
                this.addCTAShimmer();
            });
        }
    }
    
    triggerCTARipple(e) {
        if (EviaUtils.isMobile()) return;
        
        const rect = this.primaryCTA.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
            pointer-events: none;
            z-index: 10;
        `;
        
        this.primaryCTA.appendChild(ripple);
        
        EviaUtils.animate(ripple, [
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(6)', opacity: 0 }
        ], { duration: 800 }).then(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        });
    }
    
    addCTAShimmer() {
        const shimmer = this.primaryCTA.querySelector('.cta-shimmer');
        if (shimmer) {
            shimmer.style.left = '-100%';
            shimmer.style.transition = 'none';
            shimmer.offsetHeight; // Force reflow
            shimmer.style.transition = 'left 0.8s ease';
            shimmer.style.left = '100%';
        }
    }
    
    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator-elegant');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                app.smoothScrollTo('#services');
            });
        }
    }
    
    initFloatingElements() {
        if (EviaUtils.isMobile()) return;
        
        const orbs = document.querySelectorAll('.orb');
        const bubbles = document.querySelectorAll('.aqua-bubble');
        
        [...orbs, ...bubbles].forEach((element, index) => {
            this.addParallaxEffect(element, index * 0.3);
        });
    }
    
    addParallaxEffect(element, multiplier) {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.1 * (multiplier + 1);
            element.style.transform = `translateY(${rate}px)`;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }
    
    initStatPills() {
        const statPills = document.querySelectorAll('.stat-pill');
        
        statPills.forEach((pill, index) => {
            // Entrance animation
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                pill.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                pill.style.opacity = '1';
                pill.style.transform = 'translateY(0)';
            }, 1500 + (index * 150));
            
            // Hover effects
            pill.addEventListener('mouseenter', () => {
                this.animateStatPillHover(pill);
            });
            
            pill.addEventListener('mouseleave', () => {
                this.resetStatPillHover(pill);
            });
        });
    }
    
    animateStatPillHover(pill) {
        if (EviaUtils.isMobile()) return;
        
        EviaUtils.animate(pill, [
            { transform: 'translateY(0) scale(1)' },
            { transform: 'translateY(-8px) scale(1.05)' }
        ], { duration: 300 });
    }
    
    resetStatPillHover(pill) {
        EviaUtils.animate(pill, [
            { transform: 'translateY(-8px) scale(1.05)' },
            { transform: 'translateY(0) scale(1)' }
        ], { duration: 300 });
    }
    
    initVideo() {
        const video = document.querySelector('.hero-video');
        if (!video) return;
        
        video.addEventListener('loadeddata', () => {
            video.style.opacity = '0.6';
        });
        
        const playVideo = () => {
            if (video.paused) {
                video.play().catch(() => {
                    console.warn('Video autoplay prevented');
                });
            }
        };
        
        ['loadeddata', 'canplay'].forEach(event => {
            video.addEventListener(event, playVideo);
        });
        
        // Pause/resume based on page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                video.pause();
            } else {
                playVideo();
            }
        });
    }
    
    prepareSignatureAnimation() {
        if (!this.signatureContainer) return;
        
        const chars = this.signatureContainer.querySelectorAll('.signature-char, .signature-comma');
        const underline = this.signatureContainer.querySelector('.signature-underline-animated');
        const writingIndicator = this.signatureContainer.querySelector('.writing-indicator');
        const sparkles = this.signatureContainer.querySelectorAll('.sparkle');
        
        // Reset all elements
        chars.forEach(char => {
            char.style.opacity = '0';
            char.style.transform = 'translateY(20px) rotate(-5deg)';
        });
        
        if (underline) {
            underline.style.width = '0';
            underline.style.opacity = '0';
        }
        
        if (writingIndicator) {
            writingIndicator.style.opacity = '0';
        }
        
        sparkles.forEach(sparkle => {
            sparkle.style.opacity = '0';
        });
    }
    
    startSignatureAnimation() {
        if (this.hasAnimatedSignature || !this.signatureContainer) return;
        
        this.hasAnimatedSignature = true;
        
        const chars = this.signatureContainer.querySelectorAll('.signature-char, .signature-comma');
        const underline = this.signatureContainer.querySelector('.signature-underline-animated');
        const writingIndicator = this.signatureContainer.querySelector('.writing-indicator');
        const sparkles = this.signatureContainer.querySelectorAll('.sparkle');
        
        // Show writing indicator
        if (writingIndicator) {
            setTimeout(() => {
                writingIndicator.style.opacity = '1';
                writingIndicator.style.transform = 'scale(1)';
                writingIndicator.style.transition = 'all 0.3s ease-out';
            }, 300);
        }
        
        // Animate each character
        chars.forEach((char, index) => {
            const delay = 500 + (index * 200);
            
            setTimeout(() => {
                char.style.transition = 'all 0.6s ease-out';
                char.style.opacity = '1';
                char.style.transform = 'translateY(0) rotate(0deg)';
                
                // Add subtle shake effect
                this.addWritingShake();
            }, delay);
        });
        
        // Animate underline
        const totalDelay = chars.length * 200 + 800;
        setTimeout(() => {
            if (underline) {
                underline.style.transition = 'all 1.5s ease-out';
                underline.style.width = '100%';
                underline.style.opacity = '1';
            }
            
            // Hide writing indicator
            if (writingIndicator) {
                writingIndicator.style.opacity = '0';
                writingIndicator.style.transform = 'scale(0.8)';
            }
            
            // Trigger sparkles
            sparkles.forEach((sparkle, index) => {
                setTimeout(() => {
                    sparkle.style.transition = 'all 2s ease-out';
                    sparkle.style.opacity = '1';
                    sparkle.style.transform = 'scale(1) rotate(360deg)';
                    
                    setTimeout(() => {
                        sparkle.style.opacity = '0';
                    }, 1500);
                }, index * 500);
            });
        }, totalDelay);
        
        // Add hover effects after animation
        setTimeout(() => {
            this.addSignatureHoverEffects();
        }, totalDelay + 2000);
    }
    
    addWritingShake() {
        if (!this.signatureContainer) return;
        
        this.signatureContainer.style.animation = 'writeShake 0.3s ease-out';
        setTimeout(() => {
            this.signatureContainer.style.animation = '';
        }, 300);
    }
    
    addSignatureHoverEffects() {
        if (!this.signatureContainer || EviaUtils.isMobile()) return;
        
        this.signatureContainer.addEventListener('mouseenter', () => {
            const chars = this.signatureContainer.querySelectorAll('.signature-char, .signature-comma');
            chars.forEach((char, index) => {
                setTimeout(() => {
                    char.style.animation = 'signatureHover 0.6s ease-in-out';
                }, index * 50);
            });
        });
        
        this.signatureContainer.addEventListener('click', () => {
            this.replaySignatureAnimation();
        });
    }
    
    replaySignatureAnimation() {
        this.hasAnimatedSignature = false;
        this.prepareSignatureAnimation();
        setTimeout(() => {
            this.startSignatureAnimation();
        }, 100);
    }
    
    onResize() {
        // Adjust for mobile
        if (EviaUtils.isMobile()) {
            const statPills = document.querySelectorAll('.stat-pill');
            statPills.forEach(pill => {
                pill.style.transform = 'translateY(0)';
            });
        }
    }
}

/* ========================================
   SERVICES CAROUSEL COMPONENT
   ======================================== */

class LuxuryServicesCarousel {
    constructor() {
        this.carousel = document.getElementById('servicesCarousel');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        this.scrollHint = document.getElementById('scrollHint');
        
        this.currentIndex = 0;
        this.totalSlides = 0;
        this.isAutoPlaying = false;
        this.hasAutoPlayed = false;
        this.autoPlayInterval = null;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.cardWidth = 0;
        this.gap = 32;
        
        if (this.carousel && this.track) {
            this.init();
        }
    }
    
    init() {
        this.calculateDimensions();
        this.createDots();
        this.bindEvents();
        this.initializeCards();
        this.updateCarousel(false);
        
        // Start autoplay on desktop
        if (!EviaUtils.isMobile()) {
            this.startAutoPlay();
        }
        
        console.log('🎠 Services Carousel initialized');
    }
    
    calculateDimensions() {
        const cards = this.track.querySelectorAll('.service-card');
        this.totalSlides = cards.length;
        
        if (cards.length > 0) {
            const cardRect = cards[0].getBoundingClientRect();
            this.cardWidth = cardRect.width;
            
            // Get gap from CSS
            const trackStyles = window.getComputedStyle(this.track);
            this.gap = parseInt(trackStyles.gap) || 32;
        }
        
        this.updateNavigationVisibility();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            
            if (i === 0) dot.classList.add('active');
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Touch and drag events
        this.bindDragEvents();
        
        // Service CTAs
        this.bindServiceCTAs();
        
        // Window resize
        window.addEventListener('resize', EviaUtils.debounce(() => {
            this.onResize();
        }, 250));
        
        // Intersection observer for scroll hint
        this.observeScrollHint();
    }
    
    bindDragEvents() {
        // Mouse events
        this.track.addEventListener('mousedown', (e) => this.dragStart(e));
        this.track.addEventListener('mousemove', (e) => this.dragMove(e));
        this.track.addEventListener('mouseup', (e) => this.dragEnd(e));
        this.track.addEventListener('mouseleave', (e) => this.dragEnd(e));
        
        // Touch events - Enhanced for mobile
        this.track.addEventListener('touchstart', (e) => this.dragStart(e), { passive: false });
        this.track.addEventListener('touchmove', (e) => this.dragMove(e), { passive: false });
        this.track.addEventListener('touchend', (e) => this.dragEnd(e));
        
        // Prevent context menu
        this.track.addEventListener('contextmenu', (e) => {
            if (this.isDragging) e.preventDefault();
        });
        
        // Enhanced mobile scroll handling
        if (EviaUtils.isMobile()) {
            this.track.addEventListener('scroll', EviaUtils.throttle(() => {
                this.handleMobileScroll();
            }, 100), { passive: true });
        }
    }
    
    handleMobileScroll() {
        if (!EviaUtils.isMobile()) return;
        
        const scrollLeft = this.track.scrollLeft;
        const cardWidth = this.cardWidth + this.gap;
        const newIndex = Math.round(scrollLeft / cardWidth);
        
        if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.totalSlides) {
            this.currentIndex = newIndex;
            this.updateDots();
            this.updateCounter();
        }
    }
    
    dragStart(e) {
        if (this.isAutoPlaying || EviaUtils.isMobile()) return;
        
        this.isDragging = true;
        this.track.classList.add('dragging');
        this.startPos = this.getPositionX(e);
        this.track.style.transition = 'none';
        
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
    }
    
    dragMove(e) {
        if (!this.isDragging || EviaUtils.isMobile()) return;
        
        e.preventDefault();
        const currentPosition = this.getPositionX(e);
        this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
        
        // Add resistance at boundaries
        const maxTranslate = 0;
        const minTranslate = -(this.cardWidth + this.gap) * (this.totalSlides - this.getVisibleCards());
        
        if (this.currentTranslate > maxTranslate) {
            this.currentTranslate = maxTranslate + (this.currentTranslate - maxTranslate) * 0.3;
        } else if (this.currentTranslate < minTranslate) {
            this.currentTranslate = minTranslate + (this.currentTranslate - minTranslate) * 0.3;
        }
        
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }
    
    dragEnd(e) {
        if (!this.isDragging || EviaUtils.isMobile()) return;
        
        this.isDragging = false;
        this.track.classList.remove('dragging');
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        const threshold = this.cardWidth * 0.2;
        
        if (Math.abs(movedBy) > threshold) {
            if (movedBy < 0 && this.currentIndex < this.totalSlides - this.getVisibleCards()) {
                this.nextSlide();
            } else if (movedBy > 0 && this.currentIndex > 0) {
                this.previousSlide();
            } else {
                this.updateCarousel();
            }
        } else {
            this.updateCarousel();
        }
        
        this.track.style.transition = '';
    }
    
    getPositionX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }
    
    getVisibleCards() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= EviaConfig.breakpoints.mobile) {
            return 1;
        } else if (screenWidth <= EviaConfig.breakpoints.tablet) {
            return 1.5;
        } else if (screenWidth <= EviaConfig.breakpoints.desktop) {
            return 2;
        } else {
            return 3;
        }
    }
    
    startAutoPlay() {
        if (this.hasAutoPlayed || this.totalSlides <= this.getVisibleCards()) return;
        
        this.isAutoPlaying = true;
        this.hideScrollHint();
        
        let slideCount = 0;
        const maxSlides = this.totalSlides - this.getVisibleCards();
        
        this.autoPlayInterval = setInterval(() => {
            if (slideCount >= maxSlides) {
                this.stopAutoPlay();
                return;
            }
            
            this.nextSlide();
            slideCount++;
        }, EviaConfig.carousel.autoPlayDuration);
        
        console.log('🎬 Carousel auto-play started');
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        this.isAutoPlaying = false;
        this.hasAutoPlayed = true;
        
        setTimeout(() => {
            this.showNavigation();
        }, 500);
        
        console.log('⏹️ Carousel auto-play completed');
    }
    
    nextSlide() {
        const maxIndex = this.totalSlides - this.getVisibleCards();
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    previousSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        const maxIndex = this.totalSlides - this.getVisibleCards();
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        this.updateCarousel();
        
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        }
    }
    
    updateCarousel(animate = true) {
        if (!animate) {
            this.track.style.transition = 'none';
        }
        
        if (EviaUtils.isMobile()) {
            // Use scroll for mobile
            const scrollLeft = this.currentIndex * (this.cardWidth + this.gap);
            this.track.scrollTo({
                left: scrollLeft,
                behavior: animate ? 'smooth' : 'auto'
            });
        } else {
            // Use transform for desktop
            const translateX = -this.currentIndex * (this.cardWidth + this.gap);
            this.track.style.transform = `translateX(${translateX}px)`;
            this.prevTranslate = translateX;
            this.currentTranslate = translateX;
        }
        
        if (!animate) {
            this.track.offsetHeight; // Force reflow
            this.track.style.transition = '';
        }
        
        this.updateDots();
        this.updateButtons();
        this.updateCounter();
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (this.nextBtn) {
            const maxIndex = this.totalSlides - this.getVisibleCards();
            this.nextBtn.disabled = this.currentIndex >= maxIndex;
        }
    }
    
    updateCounter() {
        const currentSlide = document.getElementById('currentSlide');
        const totalSlides = document.getElementById('totalSlides');
        
        if (currentSlide) {
            currentSlide.textContent = String(this.currentIndex + 1).padStart(2, '0');
        }
        
        if (totalSlides) {
            totalSlides.textContent = String(this.totalSlides).padStart(2, '0');
        }
    }
    
    initializeCards() {
        const cards = this.track.querySelectorAll('.service-card');
        
        cards.forEach((card, index) => {
            // Add scroll snap for mobile
            if (EviaUtils.isMobile()) {
                card.style.scrollSnapAlign = 'start';
            }
            
            // Bind hover effects
            this.bindCardHoverEffects(card);
            
            // Intersection observer for animations
            this.observeCard(card, index);
        });
    }
    
    bindCardHoverEffects(card) {
        if (EviaUtils.isMobile()) return;
        
        const icon = card.querySelector('.service-icon-wrapper i');
        
        card.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.animation = 'icon-hover-pulse 0.6s ease-out';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.animation = '';
            }
        });
    }
    
    observeCard(card, index) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        observer.observe(card);
    }
    
    bindServiceCTAs() {
        const serviceCTAs = this.track.querySelectorAll('.service-cta');
        serviceCTAs.forEach(cta => {
            cta.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleServiceBooking(cta);
            });
        });
    }
    
    handleServiceBooking(cta) {
        // Add click animation
        const arrow = cta.querySelector('.cta-arrow');
        if (arrow) {
            arrow.style.transform = 'translateX(10px)';
            setTimeout(() => {
                arrow.style.transform = '';
            }, 300);
        }
        
        // Navigate to contact
        setTimeout(() => {
            app.smoothScrollTo('#contact');
        }, 200);
        
        // Show feedback
        this.showBookingFeedback();
    }
    
    showBookingFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 158, 24, 0.95);
            color: white;
            padding: 1rem 2rem;
            border-radius: 2rem;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        `;
        feedback.textContent = 'Redirecting to consultation...';
        
        document.body.appendChild(feedback);
        
        EviaUtils.animate(feedback, [
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
        ], { duration: 300 });
        
        setTimeout(() => {
            EviaUtils.animate(feedback, [
                { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' }
            ], { duration: 300 }).then(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            });
        }, 1500);
    }
    
    showNavigation() {
        const navigation = document.querySelector('.carousel-navigation');
        if (navigation) {
            navigation.classList.add('visible');
        }
    }
    
    hideNavigation() {
        const navigation = document.querySelector('.carousel-navigation');
        if (navigation) {
            navigation.classList.remove('visible');
        }
    }
    
    updateNavigationVisibility() {
        const shouldShow = this.totalSlides > this.getVisibleCards();
        
        if (this.prevBtn) this.prevBtn.style.display = shouldShow ? 'flex' : 'none';
        if (this.nextBtn) this.nextBtn.style.display = shouldShow ? 'flex' : 'none';
        
        const navigation = document.querySelector('.carousel-navigation');
        if (navigation) {
            navigation.style.display = shouldShow ? 'flex' : 'none';
        }
    }
    
    hideScrollHint() {
        if (this.scrollHint) {
            this.scrollHint.classList.add('hidden');
        }
    }
    
    showScrollHint() {
        if (this.scrollHint && !this.hasAutoPlayed && EviaUtils.isMobile()) {
            this.scrollHint.classList.remove('hidden');
        }
    }
    
    observeScrollHint() {
        if (!this.scrollHint || !window.IntersectionObserver) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && EviaUtils.isMobile()) {
                    this.showScrollHint();
                } else {
                    this.hideScrollHint();
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -10% 0px'
        });
        
        observer.observe(this.carousel);
    }
    
    onResize() {
        this.calculateDimensions();
        this.updateNavigationVisibility();
        
        // Ensure current position is valid
        const maxIndex = this.totalSlides - this.getVisibleCards();
        if (this.currentIndex > maxIndex) {
            this.currentIndex = Math.max(0, maxIndex);
        }
        
        this.updateCarousel(false);
        
        // Handle mobile/desktop transition
        if (EviaUtils.isMobile()) {
            if (this.isAutoPlaying) {
                this.stopAutoPlay();
            }
            
            // Enable scroll snap
            this.track.style.scrollSnapType = 'x mandatory';
            this.track.style.overflowX = 'auto';
        } else {
            this.track.style.scrollSnapType = 'none';
            this.track.style.overflowX = 'hidden';
            
            if (!this.hasAutoPlayed && !this.isAutoPlaying) {
                this.startAutoPlay();
            }
        }
        
        console.log('🔄 Carousel resized and reconfigured');
    }
    
    destroy() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        console.log('🗑️ Carousel destroyed');
    }
}

/* ========================================
   BEFORE/AFTER SLIDER COMPONENT
   ======================================== */

class BeforeAfterSlider {
    constructor() {
        this.sliders = document.querySelectorAll('.before-after-slider');
        
        if (this.sliders.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.sliders.forEach(slider => this.initSlider(slider));
    }
    
    initSlider(slider) {
        const handle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.after-image');
        let isDragging = false;
        let currentX = 50;
        
        if (!handle || !afterImage) return;
        
        // Set initial position
        handle.style.left = '50%';
        afterImage.style.clipPath = 'inset(0 50% 0 0)';
        
        const updateSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            currentX = percentage;
            handle.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        };
        
        // Mouse events
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
            
            const mouseMoveHandler = (e) => {
                if (isDragging) updateSlider(e.clientX);
            };
            
            const mouseUpHandler = () => {
                isDragging = false;
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };
            
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
        
        // Touch events
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
            
            const touchMoveHandler = (e) => {
                if (isDragging && e.touches[0]) {
                    updateSlider(e.touches[0].clientX);
                }
            };
            
            const touchEndHandler = () => {
                isDragging = false;
                document.removeEventListener('touchmove', touchMoveHandler);
                document.removeEventListener('touchend', touchEndHandler);
            };
            
            document.addEventListener('touchmove', touchMoveHandler, { passive: false });
            document.addEventListener('touchend', touchEndHandler);
        });
        
        // Auto-demo animation
        this.startAutoDemo(slider, handle, afterImage, currentX);
    }
    
    startAutoDemo(slider, handle, afterImage, currentX) {
        let autoSlideInterval;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    autoSlideInterval = setInterval(() => {
                        const targetX = currentX === 50 ? (Math.random() > 0.5 ? 20 : 80) : 50;
                        this.animateSliderTo(targetX, (progress) => {
                            currentX = progress;
                            handle.style.left = `${progress}%`;
                            afterImage.style.clipPath = `inset(0 ${100 - progress}% 0 0)`;
                        });
                    }, 4000);
                } else {
                    if (autoSlideInterval) {
                        clearInterval(autoSlideInterval);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(slider);
    }
    
    animateSliderTo(toX, updateCallback) {
        const duration = 1500;
        const startTime = Date.now();
        let fromX = 50;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            const currentValue = fromX + (toX - fromX) * easedProgress;
            
            updateCallback(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

/* ========================================
   CONTACT FORM COMPONENT
   ======================================== */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.initFormAnimations();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        const formFields = this.form.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('focus', () => this.onFieldFocus(field));
            field.addEventListener('blur', () => this.onFieldBlur(field));
            field.addEventListener('input', () => this.onFieldInput(field));
        });
    }
    
    onFieldFocus(field) {
        field.style.transform = 'translateY(-2px)';
        field.style.boxShadow = '0 8px 25px rgba(255, 158, 24, 0.15)';
    }
    
    onFieldBlur(field) {
        field.style.transform = 'translateY(0)';
        field.style.boxShadow = '';
        this.validateField(field);
    }
    
    onFieldInput(field) {
        this.clearFieldError(field);
    }
    
    initFormAnimations() {
        const formGroups = this.form.querySelectorAll('.form-group');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const groups = entry.target.querySelectorAll('.form-group');
                    groups.forEach((group, index) => {
                        setTimeout(() => {
                            group.style.opacity = '1';
                            group.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        formGroups.forEach(group => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        observer.observe(this.form);
    }
    
    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#EF4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #EF4444;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateY(0)';
        }, 10);
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formFields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        formFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please correct the errors above', 'error');
            return;
        }
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        this.submitForm(data);
    }
    
    submitForm(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.style.opacity = '0.7';
        
        // Simulate submission
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            
            this.showNotification('Thank you! We\'ll be in touch within 24 hours.', 'success');
            
            setTimeout(() => {
                this.form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.opacity = '';
                submitBtn.style.background = '';
            }, 3000);
            
            console.log('Contact form submitted:', data);
        }, 2000);
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="ri-${type === 'success' ? 'check-line' : 'error-warning-line'}" style="font-size: 1.2rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
}

/* ========================================
   MAGNETIC EFFECTS COMPONENT
   ======================================== */

class MagneticEffects {
    constructor() {
        this.magneticElements = [];
        this.strength = 0.3;
        this.isEnabled = !EviaUtils.isMobile();
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        setTimeout(() => {
            this.magneticElements = document.querySelectorAll('.magnetic-button, .magnetic-card');
            this.magneticElements.forEach(element => {
                this.addMagneticEffect(element);
            });
        }, 100);
    }
    
    addMagneticEffect(element) {
        if (!element || EviaUtils.isMobile()) return;
        
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.1s ease-out';
        });
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * this.strength;
            const moveY = y * this.strength;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            element.style.transform = 'translate(0px, 0px)';
        });
    }
    
    onResize() {
        this.isEnabled = !EviaUtils.isMobile();
        
        if (!this.isEnabled) {
            this.magneticElements.forEach(element => {
                if (element) {
                    element.style.transform = '';
                    element.style.transition = '';
                }
            });
        } else {
            this.init();
        }
    }
}

/* ========================================
   LUXURY FLOATING ACTION BUTTONS COMPONENT
   ======================================== */

class LuxuryFloatingButtons {
    constructor() {
        this.callBtn = document.getElementById('luxuryCallBtn');
        this.topBtn = document.getElementById('luxuryTopBtn');
        this.isVisible = false;
        this.scrollThreshold = 300;
        this.lastScrollY = 0;
        this.ticking = false;
        
        if (this.callBtn && this.topBtn) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.showButtonsWithDelay();
        console.log('✨ Luxury Floating Buttons initialized');
    }
    
    bindEvents() {
        // Scroll handler for back to top visibility
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => this.handleScroll());
                this.ticking = true;
            }
        }, { passive: true });
        
        // Call button functionality
        if (this.callBtn) {
            this.callBtn.addEventListener('click', (e) => this.handleCallClick(e));
            this.callBtn.addEventListener('mouseenter', () => this.addRippleEffect(this.callBtn));
        }
        
        // Back to top button functionality
        if (this.topBtn) {
            this.topBtn.addEventListener('click', (e) => this.handleTopClick(e));
            this.topBtn.addEventListener('mouseenter', () => this.addRippleEffect(this.topBtn));
        }
        
        // Window load event to show buttons
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.showButtons();
            }, 2000);
        });
        
        // Page visibility API
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.isVisible) {
                this.showButtons();
            }
        });
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldShowTop = scrollY > this.scrollThreshold;
        
        // Always show call button, conditionally show top button
        if (shouldShowTop && !this.topBtn.classList.contains('show')) {
            this.showTopButton();
        } else if (!shouldShowTop && this.topBtn.classList.contains('show')) {
            this.hideTopButton();
        }
        
        this.lastScrollY = scrollY;
        this.ticking = false;
    }
    
    showButtonsWithDelay() {
        // Show call button first
        setTimeout(() => {
            this.showCallButton();
        }, 3000);
        
        // Show top button if needed
        setTimeout(() => {
            if (window.pageYOffset > this.scrollThreshold) {
                this.showTopButton();
            }
        }, 3500);
    }
    
    showButtons() {
        this.showCallButton();
        
        if (window.pageYOffset > this.scrollThreshold) {
            this.showTopButton();
        }
        
        this.isVisible = true;
    }
    
    showCallButton() {
        if (this.callBtn && !this.callBtn.classList.contains('show')) {
            this.callBtn.style.animation = 'fab-entrance 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
            this.callBtn.classList.add('show');
            
            // Add subtle bounce after entrance
            setTimeout(() => {
                this.addBounceEffect(this.callBtn);
            }, 800);
        }
    }
    
    showTopButton() {
        if (this.topBtn && !this.topBtn.classList.contains('show')) {
            this.topBtn.style.animation = 'fab-entrance 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
            this.topBtn.classList.add('show');
            
            // Add subtle bounce after entrance
            setTimeout(() => {
                this.addBounceEffect(this.topBtn);
            }, 800);
        }
    }
    
    hideTopButton() {
        if (this.topBtn && this.topBtn.classList.contains('show')) {
            this.topBtn.classList.remove('show');
        }
    }
    
    handleCallClick(e) {
        e.preventDefault();
        
        // Add ripple effect
        this.triggerRipple(this.callBtn, e);
        
        // Add click feedback
        this.addClickFeedback(this.callBtn);
        
        // Make the call
        const phoneNumber = '2016394983'; // Remove formatting for tel: link
        const telLink = `tel:${phoneNumber}`;
        
        // Show calling feedback
        this.showCallingFeedback();
        
        // Attempt to make the call
        window.location.href = telLink;
        
        // Analytics tracking (if you have analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                event_category: 'engagement',
                event_label: 'floating_call_button'
            });
        }
        
        console.log('📞 Call button clicked - initiating call');
    }
    
    handleTopClick(e) {
        e.preventDefault();
        
        // Add ripple effect
        this.triggerRipple(this.topBtn, e);
        
        // Add click feedback
        this.addClickFeedback(this.topBtn);
        
        // Smooth scroll to top
        this.scrollToTop();
        
        // Analytics tracking (if you have analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_to_top', {
                event_category: 'navigation',
                event_label: 'floating_top_button'
            });
        }
        
        console.log('⬆️ Back to top button clicked');
    }
    
    scrollToTop() {
        const startPosition = window.pageYOffset;
        const startTime = performance.now();
        const duration = 1200; // Smooth scroll duration
        
        const easeOutCubic = (t) => {
            return 1 - Math.pow(1 - t, 3);
        };
        
        const scroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            
            window.scrollTo(0, startPosition * (1 - easedProgress));
            
            if (progress < 1) {
                requestAnimationFrame(scroll);
            } else {
                // Scroll complete callback
                this.onScrollComplete();
            }
        };
        
        requestAnimationFrame(scroll);
    }
    
    onScrollComplete() {
        // Add success feedback
        this.addSuccessFeedback(this.topBtn);
        
        // Hide top button since we're at the top
        setTimeout(() => {
            this.hideTopButton();
        }, 1000);
    }
    
    triggerRipple(button, event) {
        const ripple = button.querySelector('.fab-ripple');
        if (!ripple) return;
        
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.classList.add('ripple-active');
        
        setTimeout(() => {
            button.classList.remove('ripple-active');
        }, 600);
    }
    
    addRippleEffect(button) {
        const ripple = button.querySelector('.fab-ripple');
        if (ripple) {
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            button.classList.add('ripple-active');
            
            setTimeout(() => {
                button.classList.remove('ripple-active');
            }, 600);
        }
    }
    
    addClickFeedback(button) {
        button.style.transform = 'translateY(-4px) scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    addBounceEffect(button) {
        button.style.animation = 'none';
        button.offsetHeight; // Force reflow
        button.style.animation = 'arrow-bounce 0.6s ease-out';
        
        setTimeout(() => {
            button.style.animation = '';
        }, 600);
    }
    
    addSuccessFeedback(button) {
        const icon = button.querySelector('.fab-icon i');
        if (icon) {
            const originalClass = icon.className;
            icon.className = 'ri-check-line';
            
            setTimeout(() => {
                icon.className = originalClass;
            }, 2000);
        }
    }
    
    showCallingFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 2rem;
            font-family: var(--font-inter);
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        feedback.innerHTML = `
            <i class="ri-phone-line" style="font-size: 1.1rem;"></i>
            <span>Connecting call...</span>
        `;
        
        document.body.appendChild(feedback);
        
        // Animate in
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Animate out
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 400);
        }, 2500);
    }
    
    // Public methods for external control
    show() {
        this.showButtons();
    }
    
    hide() {
        if (this.callBtn) {
            this.callBtn.classList.remove('show');
        }
        if (this.topBtn) {
            this.topBtn.classList.remove('show');
        }
        this.isVisible = false;
    }
    
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    destroy() {
        // Cleanup event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('load', this.showButtons);
        
        if (this.callBtn) {
            this.callBtn.removeEventListener('click', this.handleCallClick);
            this.callBtn.removeEventListener('mouseenter', this.addRippleEffect);
        }
        
        if (this.topBtn) {
            this.topBtn.removeEventListener('click', this.handleTopClick);
            this.topBtn.removeEventListener('mouseenter', this.addRippleEffect);
        }
        
        console.log('🗑️ Luxury Floating Buttons destroyed');
    }
}

/* ========================================
   APPLICATION INITIALIZATION
   ======================================== */

// Global app instance
let app;

// CSS injection for dynamic animations
document.addEventListener('DOMContentLoaded', () => {
    const additionalCSS = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .animations-paused * {
            animation-play-state: paused !important;
        }
        
        @keyframes writeShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-1px); }
            75% { transform: translateX(1px); }
        }
        
        @keyframes signatureHover {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .carousel-track.dragging {
            cursor: grabbing;
        }
        
        @keyframes float-gentle {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(2deg); }
            66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes pulse-dot {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fab-entrance {
            0% {
                transform: translateY(100px) scale(0.8);
                opacity: 0;
            }
            50% {
                transform: translateY(-10px) scale(1.05);
                opacity: 0.8;
            }
            100% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }
        
        @keyframes phone-ring {
            0%, 100% { transform: rotate(0deg); }
            10%, 30% { transform: rotate(-15deg); }
            20%, 40% { transform: rotate(15deg); }
            50%, 90% { transform: rotate(0deg); }
        }
        
        @keyframes arrow-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }
        
        @keyframes fab-glow-pulse {
            0%, 100% { 
                opacity: 0.3; 
                transform: scale(1); 
            }
            50% { 
                opacity: 0.6; 
                transform: scale(1.05); 
            }
        }
        
        @media (max-width: ${EviaConfig.breakpoints.tablet}px) {
            .carousel-track {
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            
            .carousel-track::-webkit-scrollbar {
                display: none;
            }
            
            .service-card {
                scroll-snap-align: start;
                flex-shrink: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = additionalCSS;
    document.head.appendChild(style);
});

// Initialize application
function initializeApp() {
    try {
        app = new EviaLuxuryApp();
        window.app = app; // Global access
        
        console.log('🎭 Evia Luxury Application initialized successfully');
        
        // Performance monitoring
        if ('performance' in window && 'mark' in performance) {
            performance.mark('evia-app-ready');
            
            window.addEventListener('load', () => {
                performance.mark('evia-app-loaded');
                performance.measure('evia-app-load-time', 'evia-app-ready', 'evia-app-loaded');
                
                const loadTime = performance.getEntriesByName('evia-app-load-time')[0];
                console.log(`⚡ Evia App fully loaded in ${Math.round(loadTime.duration)}ms`);
            });
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize Evia App:', error);
        
        // Fallback initialization
        setTimeout(() => {
            try {
                app = new EviaLuxuryApp();
                window.app = app;
                console.log('✅ Fallback initialization successful');
            } catch (fallbackError) {
                console.error('❌ Fallback initialization failed:', fallbackError);
            }
        }, 1000);
    }
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.warn('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Utility functions for external control of floating buttons
window.showFloatingButtons = () => {
    const floatingButtons = app ? app.getComponent('floatingButtons') : window.luxuryFloatingButtons;
    if (floatingButtons) {
        floatingButtons.show();
    }
};

window.hideFloatingButtons = () => {
    const floatingButtons = app ? app.getComponent('floatingButtons') : window.luxuryFloatingButtons;
    if (floatingButtons) {
        floatingButtons.hide();
    }
};

window.toggleFloatingButtons = () => {
    const floatingButtons = app ? app.getComponent('floatingButtons') : window.luxuryFloatingButtons;
    if (floatingButtons) {
        floatingButtons.toggle();
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        EviaLuxuryApp, 
        EviaUtils, 
        LuxuryServicesCarousel,
        EviaConfig,
        EnhancedHermesLuxuryHeader,
        UltraLuxuryMobileMenu,
        LuxuryFloatingButtons
    };
}
