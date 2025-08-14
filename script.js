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
            { name: 'ModernTransformationsGallery', class: ModernTransformationsGallery },
            { name: 'LuxuryContactSection', class: LuxuryContactSection },
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
        this.isMobileMode = false;
        
        if (this.header) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.initNavigation();
        this.startHeaderAnimations();
        console.log('✨ Enhanced Header with Mobile Mode initialized');
    }
    
    bindEvents() {
        // Optimized scroll handler with mobile mode functionality
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
        const scrollDirection = scrollY > this.lastScrollY ? 'down' : 'up';
        const scrollThreshold = 100;
        const returnThreshold = 50; // Hysteresis to prevent jitter
        
        // Only apply mobile mode on desktop (not on actual mobile devices)
        if (window.innerWidth > 900) {
            if (scrollDirection === 'down' && scrollY > scrollThreshold) {
                // Scrolling down past threshold - switch to mobile mode
                if (!this.header.classList.contains('mobile-mode')) {
                    this.header.classList.add('mobile-mode');
                    this.header.classList.remove('scrolled');
                    this.isMobileMode = true;
                    console.log('Header switched to mobile mode');
                }
            } else if (scrollDirection === 'up' && scrollY < returnThreshold) {
                // Scrolling up and near top - switch back to desktop mode
                if (this.header.classList.contains('mobile-mode')) {
                    this.header.classList.remove('mobile-mode');
                    this.isMobileMode = false;
                    console.log('Header switched back to desktop mode');
                }
            }
            
            // Handle normal scrolled state for desktop mode (when not in mobile mode)
            if (!this.header.classList.contains('mobile-mode')) {
                const shouldTransform = scrollY > scrollThreshold;
                if (shouldTransform !== this.isScrolled) {
                    this.isScrolled = shouldTransform;
                    this.header.classList.toggle('scrolled', this.isScrolled);
                }
            }
        } else {
            // On actual mobile devices, remove mobile-mode class and use normal behavior
            this.header.classList.remove('mobile-mode');
            this.isMobileMode = false;
            const shouldTransform = scrollY > scrollThreshold;
            if (shouldTransform !== this.isScrolled) {
                this.isScrolled = shouldTransform;
                this.header.classList.toggle('scrolled', this.isScrolled);
            }
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
            
            // Only apply floating animation in desktop mode (not mobile mode)
            if (!this.isScrolled && !this.isMobileMode) {
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
        if (window.innerWidth <= 900) {
            // On actual mobile, remove mobile-mode class and mobile toggle active state
            this.header.classList.remove('mobile-mode');
            this.isMobileMode = false;
            const toggle = document.getElementById('mobileToggle');
            if (toggle) {
                toggle.classList.remove('active');
            }
        } else {
            // On desktop, check current scroll position to determine if mobile mode should be active
            const scrollY = window.pageYOffset;
            if (scrollY > 100) {
                this.header.classList.add('mobile-mode');
                this.isMobileMode = true;
            } else {
                this.header.classList.remove('mobile-mode');
                this.isMobileMode = false;
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
   ModernTransformationsGallery
   ======================================== */

class ModernTransformationsGallery {
    constructor() {
        this.gallery = document.querySelector('.modern-transformations-section');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.resultItems = document.querySelectorAll('.result-item');
        this.comparisonContainers = document.querySelectorAll('.comparison-container');
        this.ctaButton = document.getElementById('modernResultsCTA');
        this.activeFilter = 'all';

        if (this.gallery) {
            this.init();
        }
    }

    init() {
        this.initImageComparisons();
        this.initFilterSystem();
        this.initCTAButton();
        this.initIntersectionObserver();
        console.log('✨ Modern Transformations Gallery initialized');
    }

    initImageComparisons() {
        this.comparisonContainers.forEach(container => {
            this.setupImageComparison(container);
        });
    }

    setupImageComparison(container) {
        const afterImage = container.querySelector('.after-image');
        const sliderHandle = container.querySelector('.slider-handle');
        let isDragging = false;
        let currentPosition = 50; // Start at 50%

        if (!afterImage || !sliderHandle) return;

        // Set initial position
        this.updateImageReveal(afterImage, sliderHandle, currentPosition);

        // Mouse events
        sliderHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
            document.body.style.cursor = 'ew-resize';
            container.style.userSelect = 'none';

            const handleMouseMove = (e) => {
                if (!isDragging) return;
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                currentPosition = percentage;
                this.updateImageReveal(afterImage, sliderHandle, percentage);
            };

            const handleMouseUp = () => {
                isDragging = false;
                document.body.style.cursor = '';
                container.style.userSelect = '';
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        // Touch events for mobile
        sliderHandle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();

            const handleTouchMove = (e) => {
                if (!isDragging || !e.touches[0]) return;
                const rect = container.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                currentPosition = percentage;
                this.updateImageReveal(afterImage, sliderHandle, percentage);
            };

            const handleTouchEnd = () => {
                isDragging = false;
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        });

        // Auto-demo on hover (desktop only)
        if (!this.isMobile()) {
            container.addEventListener('mouseenter', () => {
                if (!isDragging) {
                    this.startAutoDemo(afterImage, sliderHandle, currentPosition);
                }
            });

            container.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    this.resetToCenter(afterImage, sliderHandle);
                    currentPosition = 50;
                }
            });
        }

        // Click anywhere on container to move slider
        container.addEventListener('click', (e) => {
            if (e.target.closest('.slider-handle')) return;
            
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            currentPosition = percentage;
            
            this.animateImageReveal(afterImage, sliderHandle, percentage);
        });
    }

    updateImageReveal(afterImage, sliderHandle, percentage) {
        afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        sliderHandle.parentElement.style.left = `${percentage}%`;
    }

    animateImageReveal(afterImage, sliderHandle, targetPercentage) {
        const currentPercentage = parseFloat(sliderHandle.parentElement.style.left) || 50;
        const duration = 600;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            const currentValue = currentPercentage + (targetPercentage - currentPercentage) * easedProgress;

            this.updateImageReveal(afterImage, sliderHandle, currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    startAutoDemo(afterImage, sliderHandle, currentPosition) {
        const targetPosition = currentPosition > 50 ? 20 : 80;
        this.animateImageReveal(afterImage, sliderHandle, targetPosition);
    }

    resetToCenter(afterImage, sliderHandle) {
        this.animateImageReveal(afterImage, sliderHandle, 50);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    initFilterSystem() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.setActiveFilter(filter);
                this.filterResults(filter);
            });
        });
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeButton = document.querySelector(`[data-filter="${filter}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    filterResults(filter) {
        this.resultItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                setTimeout(() => {
                    item.classList.remove('filtered-out');
                }, index * 50);
            } else {
                item.classList.add('filtered-out');
            }
        });

        // Update grid layout after filtering
        setTimeout(() => {
            this.updateGridLayout();
        }, 300);
    }

    updateGridLayout() {
        const visibleItems = Array.from(this.resultItems).filter(item => 
            !item.classList.contains('filtered-out')
        );

        // Add stagger animation to visible items
        visibleItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 100}ms`;
        });

        // Remove delays after animation
        setTimeout(() => {
            visibleItems.forEach(item => {
                item.style.transitionDelay = '';
            });
        }, visibleItems.length * 100 + 500);
    }

    initCTAButton() {
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', () => {
                this.handleCTAClick();
            });

            this.ctaButton.addEventListener('mouseenter', () => {
                this.addCTAEffect();
            });
        }
    }

    handleCTAClick() {
        // Add click animation
        this.ctaButton.style.transform = 'translateY(-2px) scale(0.98)';
        
        setTimeout(() => {
            this.ctaButton.style.transform = '';
        }, 150);

        // Navigate to contact section
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 200);

        // Show feedback
        this.showBookingFeedback();
    }

    addCTAEffect() {
        const glow = this.ctaButton.querySelector('.button-glow');
        if (glow) {
            glow.style.opacity = '0.4';
            setTimeout(() => {
                glow.style.opacity = '0';
            }, 1000);
        }
    }

    showBookingFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 107, 0, 0.95);
            color: white;
            padding: 16px 24px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(255, 107, 0, 0.4);
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        feedback.innerHTML = `
            <i class="ri-calendar-check-line" style="font-size: 16px;"></i>
            <span>Redirecting to consultation booking...</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 400);
        }, 2500);
    }

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger animation for result items
                    if (entry.target.classList.contains('results-grid')) {
                        const items = entry.target.querySelectorAll('.result-item');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe main elements
        const elementsToObserve = [
            this.gallery.querySelector('.transformations-header'),
            this.gallery.querySelector('.filter-navigation'),
            this.gallery.querySelector('.results-grid'),
            this.gallery.querySelector('.modern-cta')
        ].filter(Boolean);

        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    }

    isMobile() {
        return window.innerWidth <= 768;
    }

    onResize() {
        // Reset any active comparisons on resize
        this.comparisonContainers.forEach(container => {
            const afterImage = container.querySelector('.after-image');
            const sliderHandle = container.querySelector('.slider-handle');
            if (afterImage && sliderHandle) {
                this.updateImageReveal(afterImage, sliderHandle, 50);
            }
        });
    }

    destroy() {
        // Cleanup event listeners if needed
        console.log('🗑️ Modern Transformations Gallery destroyed');
    }
}

/* ========================================
   CONTACT FORM COMPONENT
   ======================================== */

class LuxuryContactSection {
    constructor() {
        this.isInitialized = false;
        this.formLoaded = false;
        this.observers = new Map();
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }
    
    onDOMReady() {
        try {
            this.initializeElements();
            this.bindEvents();
            this.initializeAnimations();
            this.handleElfsightForm();
            this.initializeObservers();
            
            this.isInitialized = true;
            console.log('✨ Luxury Contact Section initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing contact section:', error);
        }
    }
    
    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.elements = {
            section: document.querySelector('.luxury-contact-section'),
            viewMapBtn: document.querySelector('.view-map-btn'),
            callBtns: document.querySelectorAll('.call-btn, .method-action[data-action="call"], .emergency-cta'),
            emailBtns: document.querySelectorAll('.email-btn, .method-action[data-action="email"]'),
            methodCards: document.querySelectorAll('.method-card'),
            socialLinks: document.querySelectorAll('.social-link'),
            formLoading: document.getElementById('formLoading'),
            elfsightForm: document.getElementById('elfsightForm'),
            particles: document.querySelectorAll('.particle'),
            floatingElements: document.querySelectorAll('.floating-element')
        };
        
        // Validate required elements
        if (!this.elements.section) {
            throw new Error('Contact section not found');
        }
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Map view button
        if (this.elements.viewMapBtn) {
            this.elements.viewMapBtn.addEventListener('click', () => this.openMap());
        }
        
        // Call buttons
        this.elements.callBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCall(e));
        });
        
        // Email buttons
        this.elements.emailBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleEmail(e));
        });
        
        // Method cards hover effects
        this.elements.methodCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onMethodCardHover(card));
            card.addEventListener('mouseleave', () => this.onMethodCardLeave(card));
        });
        
        // Social links
        this.elements.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSocialClick(e, link));
        });
        
        // Window events
        window.addEventListener('resize', this.debounce(() => this.onWindowResize(), 250));
        window.addEventListener('scroll', this.throttle(() => this.onWindowScroll(), 100));
    }
    
    /**
     * Initialize animations and effects
     */
    initializeAnimations() {
        this.startParticleAnimations();
        this.initializeFloatingElements();
        this.initializeHoverEffects();
    }
    
    /**
     * Handle Elfsight form loading
     */
    handleElfsightForm() {
        // Show loading state initially
        this.showFormLoading();
        
        // Check for Elfsight script
        this.waitForElfsight();
        
        // Fallback timeout
        setTimeout(() => {
            if (!this.formLoaded) {
                this.onFormLoadTimeout();
            }
        }, 10000); // 10 second timeout
    }
    
    /**
     * Wait for Elfsight to load
     */
    waitForElfsight() {
        const checkElfsight = () => {
            // Check if Elfsight is available
            if (window.ElfsightInstagram || document.querySelector('.elfsight-app-db15691a-379c-4773-8900-983e7e393d0f iframe')) {
                this.onFormLoaded();
                return;
            }
            
            // Check if the widget container has content
            const widgetContainer = document.querySelector('.elfsight-app-db15691a-379c-4773-8900-983e7e393d0f');
            if (widgetContainer && (widgetContainer.children.length > 0 || widgetContainer.innerHTML.trim() !== '')) {
                setTimeout(() => this.onFormLoaded(), 1000);
                return;
            }
            
            // Continue checking
            setTimeout(checkElfsight, 500);
        };
        
        // Start checking after a short delay
        setTimeout(checkElfsight, 1000);
    }
    
    /**
     * Form loading complete
     */
    onFormLoaded() {
        if (this.formLoaded) return;
        
        this.formLoaded = true;
        this.hideFormLoading();
        
        // Add custom styling to form
        setTimeout(() => {
            this.styleElfsightForm();
        }, 500);
        
        console.log('✅ Contact form loaded successfully');
    }
    
    /**
     * Form loading timeout
     */
    onFormLoadTimeout() {
        console.warn('⚠️ Form loading timeout - showing fallback');
        this.showFormFallback();
    }
    
    /**
     * Show form loading state
     */
    showFormLoading() {
        if (this.elements.formLoading) {
            this.elements.formLoading.style.display = 'flex';
        }
        if (this.elements.elfsightForm) {
            this.elements.elfsightForm.style.opacity = '0';
        }
    }
    
    /**
     * Hide form loading state
     */
    hideFormLoading() {
        if (this.elements.formLoading) {
            this.elements.formLoading.style.opacity = '0';
            this.elements.formLoading.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.elements.formLoading.style.display = 'none';
            }, 300);
        }
        
        if (this.elements.elfsightForm) {
            this.elements.elfsightForm.style.opacity = '1';
            this.elements.elfsightForm.style.transform = 'scale(1)';
        }
    }
    
    /**
     * Show form fallback
     */
    showFormFallback() {
        if (this.elements.formLoading) {
            this.elements.formLoading.innerHTML = `
                <div class="fallback-content">
                    <div class="fallback-icon">
                        <i class="ri-phone-line"></i>
                    </div>
                    <h4>Unable to load form</h4>
                    <p>Please call us directly to schedule your consultation</p>
                    <button class="fallback-call-btn" onclick="window.location.href='tel:2016394983'">
                        <i class="ri-phone-line"></i>
                        <span>Call (201) 639-4983</span>
                    </button>
                </div>
            `;
        }
    }
    
    /**
     * Style Elfsight form
     */
    styleElfsightForm() {
        const formIframe = document.querySelector('.elfsight-app-db15691a-379c-4773-8900-983e7e393d0f iframe');
        if (formIframe) {
            formIframe.style.borderRadius = '20px';
            formIframe.style.border = '1px solid rgba(255, 140, 0, 0.1)';
            formIframe.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        }
    }
    
    /**
     * Initialize intersection observers
     */
    initializeObservers() {
        // Scroll-triggered animations
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger specific animations
                    if (entry.target.classList.contains('contact-header')) {
                        this.animateHeader();
                    } else if (entry.target.classList.contains('contact-info')) {
                        this.animateContactInfo();
                    } else if (entry.target.classList.contains('contact-form-side')) {
                        this.animateFormSide();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements
        const elementsToObserve = [
            '.contact-header',
            '.contact-info',
            '.contact-form-side',
            '.emergency-contact'
        ];
        
        elementsToObserve.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                animateOnScroll.observe(element);
            }
        });
        
        this.observers.set('scroll', animateOnScroll);
    }
    
    /**
     * Animate header entrance
     */
    animateHeader() {
        const badge = document.querySelector('.section-badge');
        const title = document.querySelector('.section-title');
        const description = document.querySelector('.section-description');
        
        if (badge) {
            badge.style.animation = 'slideInDown 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        }
        
        if (title) {
            setTimeout(() => {
                title.style.animation = 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            }, 200);
        }
        
        if (description) {
            setTimeout(() => {
                description.style.animation = 'fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            }, 400);
        }
    }
    
    /**
     * Animate contact info cards
     */
    animateContactInfo() {
        const cards = document.querySelectorAll('.location-card, .method-card, .appointment-notice');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = `slideInLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            }, index * 100);
        });
    }
    
    /**
     * Animate form side
     */
    animateFormSide() {
        const formContainer = document.querySelector('.form-container');
        
        if (formContainer) {
            formContainer.style.animation = 'slideInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        }
    }
    
    /**
     * Handle map opening
     */
    openMap() {
        const address = '65 W 36th St, 10th Floor, New York, NY 10018';
        const encodedAddress = encodeURIComponent(address);
        
        // Try Google Maps first, fallback to Apple Maps on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        let mapUrl;
        if (isIOS) {
            mapUrl = `maps://maps.google.com/maps?q=${encodedAddress}`;
        } else {
            mapUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
        }
        
        // Add click animation
        this.addClickFeedback(this.elements.viewMapBtn);
        
        // Open map
        setTimeout(() => {
            window.open(mapUrl, '_blank');
        }, 150);
        
        // Analytics tracking
        this.trackEvent('map_view', 'contact', 'location_click');
    }
    
    /**
     * Handle phone calls
     */
    handleCall(event) {
        event.preventDefault();
        
        const phoneNumber = '2016394983';
        const telLink = `tel:${phoneNumber}`;
        
        // Add click animation
        this.addClickFeedback(event.currentTarget);
        
        // Show calling feedback
        this.showCallingFeedback();
        
        // Make call
        setTimeout(() => {
            window.location.href = telLink;
        }, 300);
        
        // Analytics tracking
        this.trackEvent('phone_call', 'contact', 'call_button_click');
    }
    
    /**
     * Handle email
     */
    handleEmail(event) {
        event.preventDefault();
        
        const email = 'info@eviaesthetics.com';
        const subject = 'Consultation Request - Eviaesthetics';
        const body = 'Hello,\n\nI would like to schedule a consultation for aesthetic treatments.\n\nThank you!';
        
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Add click animation
        this.addClickFeedback(event.currentTarget);
        
        // Open email client
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 150);
        
        // Analytics tracking
        this.trackEvent('email_click', 'contact', 'email_button_click');
    }
    
    /**
     * Handle social link clicks
     */
    handleSocialClick(event, link) {
        const platform = link.classList.contains('instagram') ? 'instagram' : 
                        link.classList.contains('facebook') ? 'facebook' : 'unknown';
        
        // Add click animation
        this.addClickFeedback(link);
        
        // Analytics tracking
        this.trackEvent('social_click', 'contact', platform);
    }
    
    /**
     * Method card hover effects
     */
    onMethodCardHover(card) {
        const icon = card.querySelector('.method-icon');
        const action = card.querySelector('.method-action');
        
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        if (action) {
            action.style.transform = 'scale(1.1)';
        }
    }
    
    onMethodCardLeave(card) {
        const icon = card.querySelector('.method-icon');
        const action = card.querySelector('.method-action');
        
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
        
        if (action) {
            action.style.transform = 'scale(1)';
        }
    }
    
    /**
     * Start particle animations
     */
    startParticleAnimations() {
        this.elements.particles.forEach((particle, index) => {
            // Random delay for natural effect
            const delay = Math.random() * 10000;
            particle.style.animationDelay = `-${delay}ms`;
            
            // Vary animation duration for diversity
            const duration = 20000 + (Math.random() * 10000);
            particle.style.animationDuration = `${duration}ms`;
        });
    }
    
    /**
     * Initialize floating elements
     */
    initializeFloatingElements() {
        this.elements.floatingElements.forEach((element, index) => {
            // Random delays and durations for natural movement
            const delay = Math.random() * 30000;
            const duration = 25000 + (Math.random() * 15000);
            
            element.style.animationDelay = `-${delay}ms`;
            element.style.animationDuration = `${duration}ms`;
        });
    }
    
    /**
     * Initialize hover effects
     */
    initializeHoverEffects() {
        // Add magnetic effect to buttons
        const magneticButtons = document.querySelectorAll('.view-map-btn, .method-action, .emergency-cta');
        
        magneticButtons.forEach(button => {
            this.addMagneticEffect(button);
        });
    }
    
    /**
     * Add magnetic effect to element
     */
    addMagneticEffect(element) {
        if (this.isMobile()) return;
        
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.1s ease-out';
        });
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.3;
            const moveY = y * 0.3;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            element.style.transform = 'translate(0px, 0px)';
        });
    }
    
    /**
     * Add click feedback animation
     */
    addClickFeedback(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease-out';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 150);
    }
    
    /**
     * Show calling feedback
     */
    showCallingFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'call-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <div class="feedback-icon">
                    <i class="ri-phone-line"></i>
                </div>
                <div class="feedback-text">
                    <h4>Initiating Call...</h4>
                    <p>Please wait while we connect you</p>
                </div>
            </div>
        `;
        
        // Styles
        Object.assign(feedback.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.8)',
            background: 'rgba(255, 140, 0, 0.95)',
            color: 'white',
            padding: '24px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(255, 140, 0, 0.4)',
            zIndex: '10000',
            opacity: '0',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        });
        
        document.body.appendChild(feedback);
        
        // Animate in
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Remove after delay
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2500);
    }
    
    /**
     * Window resize handler
     */
    onWindowResize() {
        // Recalculate animations if needed
        if (this.isMobile()) {
            // Disable magnetic effects on mobile
            this.disableMagneticEffects();
        } else {
            // Re-enable magnetic effects on desktop
            this.initializeHoverEffects();
        }
    }
    
    /**
     * Window scroll handler
     */
    onWindowScroll() {
        // Parallax effect for floating elements
        if (!this.isMobile()) {
            this.updateParallax();
        }
    }
    
    /**
     * Update parallax effects
     */
    updateParallax() {
        const scrolled = window.pageYOffset;
        const sectionRect = this.elements.section?.getBoundingClientRect();
        
        if (!sectionRect) return;
        
        // Only apply parallax when section is in view
        if (sectionRect.bottom >= 0 && sectionRect.top <= window.innerHeight) {
            this.elements.floatingElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrolled * speed;
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
    }
    
    /**
     * Disable magnetic effects
     */
    disableMagneticEffects() {
        const magneticElements = document.querySelectorAll('.view-map-btn, .method-action, .emergency-cta');
        magneticElements.forEach(element => {
            element.style.transform = '';
            element.style.transition = '';
        });
    }
    
    /**
     * Track events (Analytics)
     */
    trackEvent(action, category, label) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: 1
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                action: action,
                category: category
            });
        }
        
        console.log(`📊 Event tracked: ${action} - ${category} - ${label}`);
    }
    
    /**
     * Check if mobile device
     */
    isMobile() {
        return window.innerWidth <= 768 || 'ontouchstart' in window;
    }
    
    /**
     * Debounce utility
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Throttle utility
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Cleanup method
     */
    destroy() {
        // Clear observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('scroll', this.onWindowScroll);
        
        console.log('🗑️ Contact section destroyed');
    }
}

/**
 * Additional CSS animations for JavaScript-triggered effects
 */
const additionalStyles = `
    <style>
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .call-feedback .feedback-content {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .call-feedback .feedback-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            animation: emergencyPulse 1.5s ease-in-out infinite;
        }
        
        .call-feedback .feedback-text h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .call-feedback .feedback-text p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
        
        .fallback-content {
            text-align: center;
            padding: 20px;
        }
        
        .fallback-icon {
            width: 60px;
            height: 60px;
            background: var(--gradient-hermes-orange);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            margin: 0 auto 20px;
        }
        
        .fallback-content h4 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
        }
        
        .fallback-content p {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 20px;
        }
        
        .fallback-call-btn {
            background: var(--gradient-hermes-orange);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .fallback-call-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 140, 0, 0.3);
        }
    </style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Initialize contact section when DOM is ready
let contactSection;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        contactSection = new LuxuryContactSection();
    });
} else {
    contactSection = new LuxuryContactSection();
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
