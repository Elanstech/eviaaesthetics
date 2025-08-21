/* ========================================
   EVIA AESTHETICS - COMPLETE LUXURY EXPERIENCE
   ORGANIZED JAVASCRIPT WITH ALL SECTIONS
   ======================================== */

'use strict';

/* ========================================
   GLOBAL CONFIGURATION & UTILITIES
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
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

/* ========================================
   MAIN APPLICATION
   ======================================== */

class EviaLuxuryApp {
    constructor() {
        this.isLoaded = false;
        this.components = new Map();
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
        document.addEventListener('click', (e) => this.handleGlobalClicks(e));
    }
    
    onDOMReady() {
        try {
            this.initializeComponents();
            this.initAOS();
            console.log('✅ Evia Luxury App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }
    
    initializeComponents() {
        const componentDefinitions = [
            { name: 'preloader', class: LuxuryPreloader },
            { name: 'header', class: EnhancedLuxuryHeader },
            { name: 'mobileMenu', class: UltraLuxuryMobileMenu },
            { name: 'hero', class: CinematicHero },
            { name: 'servicesCarousel', class: EnhancedServicesCarousel },
            { name: 'about', class: HermesAboutSection },
            { name: 'transformationsGallery', class: ModernTransformationsGallery },
            { name: 'instagramReviews', class: RedesignedSocialSections },
            { name: 'LuxuryProductsSection', class: HermesProductsCollection },
            { name: 'contactSection', class: HermesLuxuryContactSection },
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
        this.startSignatureAnimation();
        console.log('✨ Evia Luxury Experience fully loaded');
    }
    
    onWindowResize() {
        this.components.forEach((component) => {
            if (component && typeof component.onResize === 'function') {
                component.onResize();
            }
        });
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
            setTimeout(() => hero.startSignatureAnimation(), 2000);
        }
    }
    
    smoothScrollTo(target, offset = 100) {
        return EviaUtils.smoothScrollTo(target, offset);
    }
    
    getComponent(name) {
        return this.components.get(name);
    }
}

/* ========================================
   PRELOADER SECTION
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
        const icons = this.preloader.querySelectorAll('.medspa-icon');
        icons.forEach((icon, index) => {
            this.animateIcon(icon, index);
        });
        
        const logo = this.preloader.querySelector('.preloader-logo');
        if (logo) {
            this.animateLogo(logo);
        }
    }
    
    animateIcon(icon, index) {
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
        
        setTimeout(animate, index * 200);
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
        
        setTimeout(() => {
            clearInterval(checkInterval);
            this.fadeOut();
        }, 5000);
    }
    
    async fadeOut() {
        this.isReady = true;
        
        const icons = this.preloader.querySelectorAll('.medspa-icon');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                EviaUtils.animate(icon, [
                    { opacity: 1, transform: 'scale(1) rotate(0deg)' },
                    { opacity: 0, transform: 'scale(0.5) rotate(180deg)' }
                ], { duration: 400 });
            }, index * 50);
        });
        
        await EviaUtils.wait(300);
        
        const logo = this.preloader.querySelector('.preloader-logo');
        const loadingIndicator = this.preloader.querySelector('.loading-indicator');
        
        if (logo) EviaUtils.animate(logo, [{ opacity: 1 }, { opacity: 0 }]);
        if (loadingIndicator) EviaUtils.animate(loadingIndicator, [{ opacity: 1 }, { opacity: 0 }]);
        
        await EviaUtils.wait(500);
        
        this.preloader.classList.add('fade-out');
        
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = '';
            document.body.classList.add('preloader-complete');
        }, 1200);
    }
}

/* ========================================
   HEADER SECTION
   ======================================== */

class EnhancedLuxuryHeader {
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
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => this.handleScroll());
                this.ticking = true;
            }
        }, { passive: true });
        
        const headerCTA = document.getElementById('headerCTA');
        if (headerCTA) {
            headerCTA.addEventListener('click', () => app.smoothScrollTo('#contact'));
            headerCTA.addEventListener('mouseenter', () => this.addCTAShimmer(headerCTA));
        }
        
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
        
        if (window.innerWidth > 900) {
            if (scrollDirection === 'down' && scrollY > scrollThreshold) {
                if (!this.header.classList.contains('mobile-mode')) {
                    this.header.classList.add('mobile-mode');
                    this.header.classList.remove('scrolled');
                    this.isMobileMode = true;
                }
            } else if (scrollDirection === 'up' && scrollY < 50) {
                if (this.header.classList.contains('mobile-mode')) {
                    this.header.classList.remove('mobile-mode');
                    this.isMobileMode = false;
                }
            }
            
            if (!this.header.classList.contains('mobile-mode')) {
                const shouldTransform = scrollY > scrollThreshold;
                if (shouldTransform !== this.isScrolled) {
                    this.isScrolled = shouldTransform;
                    this.header.classList.toggle('scrolled', this.isScrolled);
                }
            }
        } else {
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
            shimmer.offsetHeight;
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
            this.header.classList.remove('mobile-mode');
            this.isMobileMode = false;
            const toggle = document.getElementById('mobileToggle');
            if (toggle) toggle.classList.remove('active');
        }
    }
}

/* ========================================
   MOBILE MENU SECTION
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
    }
    
    bindEvents() {
        if (this.close) {
            this.close.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
            });
        }
        
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeMenu());
        }
        
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
            }
        });
        
        const menuCTA = document.querySelector('.menu-cta');
        if (menuCTA) {
            menuCTA.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick();
            });
        }
        
        window.addEventListener('resize', EviaUtils.debounce(() => {
            if (this.isOpen && window.innerWidth > EviaConfig.breakpoints.tablet) {
                this.closeMenu();
            }
        }, 250));
    }
    
    prepareAnimations() {
        this.navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(50px) scale(0.9)';
            item.style.transition = `all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.1}s`;
        });
    }
    
    async openMenu() {
        if (this.isOpen || this.animationInProgress) return;
        
        this.animationInProgress = true;
        this.isOpen = true;
        
        document.body.style.overflow = 'hidden';
        
        this.backdrop.classList.add('active');
        this.menu.classList.add('active');
        
        await EviaUtils.wait(200);
        
        this.navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0) scale(1)';
            }, index * 100);
        });
        
        this.animationInProgress = false;
    }
    
    async closeMenu() {
        if (!this.isOpen || this.animationInProgress) return;
        
        this.animationInProgress = true;
        this.isOpen = false;
        
        const toggle = document.getElementById('mobileToggle');
        if (toggle) toggle.classList.remove('active');
        
        const reverseItems = Array.from(this.navItems).reverse();
        reverseItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(50px) scale(0.9)';
            }, index * 50);
        });
        
        await EviaUtils.wait(400);
        
        setTimeout(() => {
            this.menu.classList.remove('active');
            this.backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }, 600);
        
        this.animationInProgress = false;
    }
    
    async navigateAndClose(href, itemIndex = 0) {
        await this.closeMenu();
        
        setTimeout(() => {
            app.smoothScrollTo(href);
        }, 300);
    }
    
    handleCTAClick() {
        this.navigateAndClose('#contact');
    }
    
    onResize() {
        if (this.isOpen && window.innerWidth > EviaConfig.breakpoints.tablet) {
            this.closeMenu();
        }
    }
}

/* ========================================
   HERO SECTION
   ======================================== */

class SimpleHermesSignature {
    constructor() {
        this.signatureWrapper = document.querySelector('.hermes-signature-wrapper');
        this.signatureContainer = document.querySelector('.signature-container');
        this.signatureLine = document.querySelector('.signature-line');
        this.signatureCredentials = document.querySelector('.signature-credentials');
        this.signatureUnderline = document.querySelector('.signature-underline');
        
        this.isAnimating = false;
        this.isDesktop = window.innerWidth > 1024;
        this.animationStarted = false;
        
        this.init();
    }
    
    init() {
        if (!this.isDesktop || !this.signatureWrapper) {
            console.log('📱 Simple signature disabled on mobile/tablet');
            return;
        }
        
        this.setupEventListeners();
        console.log('✨ Simple Hermès Signature initialized');
    }
    
    setupEventListeners() {
        if (this.signatureContainer) {
            this.signatureContainer.addEventListener('click', () => {
                this.onClick();
            });
            
            this.signatureContainer.addEventListener('mouseenter', () => {
                this.onHover();
            });
        }
        
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    start() {
        if (!this.isDesktop || this.animationStarted) return;
        
        setTimeout(() => {
            this.showSignature();
        }, 2000);
        
        this.animationStarted = true;
    }
    
    showSignature() {
        if (!this.signatureWrapper) return;
        
        this.signatureWrapper.classList.add('signature-active');
        
        setTimeout(() => {
            if (this.signatureLine) {
                this.signatureLine.classList.add('traced');
            }
        }, 400);
        
        setTimeout(() => {
            if (this.signatureCredentials) {
                this.signatureCredentials.classList.add('traced');
            }
        }, 800);
        
        setTimeout(() => {
            if (this.signatureUnderline) {
                this.signatureUnderline.classList.add('traced');
            }
        }, 1200);
        
        console.log('✨ Simple signature animation completed');
    }
    
    onHover() {
        if (!this.signatureContainer || this.isAnimating) return;
        
        this.signatureContainer.style.boxShadow = `
            0 12px 40px rgba(0, 0, 0, 0.08),
            0 6px 20px rgba(255, 140, 0, 0.15),
            0 0 20px rgba(255, 140, 0, 0.1)
        `;
        
        setTimeout(() => {
            if (this.signatureContainer) {
                this.signatureContainer.style.boxShadow = '';
            }
        }, 1000);
    }
    
    onClick() {
        if (this.isAnimating) return;
        
        if (this.signatureContainer) {
            this.signatureContainer.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.signatureContainer.style.transform = '';
            }, 200);
        }
        
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 150);
        
        this.trackSignatureClick();
    }
    
    handleResize() {
        const wasDesktop = this.isDesktop;
        this.isDesktop = window.innerWidth > 1024;
        
        if (wasDesktop && !this.isDesktop) {
            if (this.signatureWrapper) {
                this.signatureWrapper.style.display = 'none';
            }
        }
        
        if (!wasDesktop && this.isDesktop) {
            if (this.signatureWrapper) {
                this.signatureWrapper.style.display = 'block';
            }
        }
    }
    
    trackSignatureClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'signature_click', {
                event_category: 'engagement',
                event_label: 'simple_hermes_signature',
                value: 1
            });
        }
        
        console.log('📊 Simple signature click tracked');
    }
    
    restart() {
        this.animationStarted = false;
        
        if (this.signatureLine) this.signatureLine.classList.remove('traced');
        if (this.signatureCredentials) this.signatureCredentials.classList.remove('traced');
        if (this.signatureUnderline) this.signatureUnderline.classList.remove('traced');
        if (this.signatureWrapper) this.signatureWrapper.classList.remove('signature-active');
        
        setTimeout(() => {
            this.start();
        }, 500);
    }
    
    destroy() {
        if (this.signatureContainer) {
            this.signatureContainer.removeEventListener('click', this.onClick);
            this.signatureContainer.removeEventListener('mouseenter', this.onHover);
        }
        
        window.removeEventListener('resize', this.handleResize);
        
        console.log('🗑️ Simple Hermès Signature destroyed');
    }
}

class CinematicHero {
    constructor() {
        this.hero = document.querySelector('.cinematic-hero');
        this.primaryCTA = document.querySelector('.hero-cta-signature');
        this.signatureContainer = document.querySelector('.signature-container');
        this.signatureAnimation = null;
        this.hasAnimatedSignature = false;
        
        if (this.hero) {
            this.init();
        }
    }
    
    init() {
        this.initCTAButtons();
        this.initScrollIndicator();
        this.initStatPills();
        this.initVideo();
        this.initSignatureAnimation();
    }
    
    initCTAButtons() {
        if (this.primaryCTA) {
            this.primaryCTA.addEventListener('click', () => app.smoothScrollTo('#contact'));
            this.primaryCTA.addEventListener('mouseenter', () => this.addCTAShimmer());
        }
    }
    
    addCTAShimmer() {
        const shimmer = this.primaryCTA.querySelector('.cta-shimmer');
        if (shimmer) {
            shimmer.style.left = '-100%';
            shimmer.style.transition = 'none';
            shimmer.offsetHeight;
            shimmer.style.transition = 'left 0.8s ease';
            shimmer.style.left = '100%';
        }
    }
    
    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator-elegant');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => app.smoothScrollTo('#services'));
        }
    }
    
    initStatPills() {
        const statPills = document.querySelectorAll('.stat-pill');
        
        statPills.forEach((pill, index) => {
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                pill.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                pill.style.opacity = '1';
                pill.style.transform = 'translateY(0)';
            }, 1500 + (index * 150));
        });
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
    }
    
    initSignatureAnimation() {
        if (window.innerWidth > 1024) {
            this.signatureAnimation = new SimpleHermesSignature();
        }
    }
    
    startSignatureAnimation() {
        if (this.signatureAnimation && !this.hasAnimatedSignature) {
            this.signatureAnimation.start();
            this.hasAnimatedSignature = true;
            return;
        }
        
        const signatureWrapper = document.querySelector('.hermes-signature-wrapper');
        if (signatureWrapper && !this.hasAnimatedSignature) {
            this.hasAnimatedSignature = true;
            
            signatureWrapper.classList.add('signature-active');
            
            setTimeout(() => {
                const signatureLine = signatureWrapper.querySelector('.signature-line');
                if (signatureLine) signatureLine.classList.add('traced');
            }, 400);
            
            setTimeout(() => {
                const credentials = signatureWrapper.querySelector('.signature-credentials');
                if (credentials) credentials.classList.add('traced');
            }, 800);
            
            setTimeout(() => {
                const underline = signatureWrapper.querySelector('.signature-underline');
                if (underline) underline.classList.add('traced');
            }, 1200);
            
            console.log('✨ Fallback signature animation started');
        }
    }
    
    addSignatureHoverEffect(card) {
        const sparkles = card.querySelectorAll('.sparkle-dot');
        sparkles.forEach((sparkle, index) => {
            setTimeout(() => {
                sparkle.style.animation = 'sparkleFloat 1s ease-in-out';
            }, index * 100);
        });
        
        setTimeout(() => {
            sparkles.forEach(sparkle => {
                sparkle.style.animation = 'sparkleFloat 3s ease-in-out infinite';
            });
        }, 1000);
    }
    
    addSignatureClickEffect(card) {
        card.style.transform = 'translateY(-3px) scale(1.05)';
        
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
        
        this.addSignatureHoverEffect(card);
    }
}

/* ========================================
   SERVICES SECTION
   ======================================== */

class EnhancedServicesCarousel {
    constructor() {
        this.carousel = document.getElementById('servicesCarousel');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        this.autoplayBtn = document.getElementById('autoplayBtn');
        this.learnMoreBtn = document.getElementById('learnMoreBtn');
        
        this.progressFill = document.getElementById('progressFill');
        this.currentSlide = document.getElementById('currentSlide');
        this.totalSlides = document.getElementById('totalSlides');
        this.currentCounter = document.getElementById('currentCounter');
        this.totalCounter = document.getElementById('totalCounter');
        
        this.currentIndex = 0;
        this.totalCards = 0;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDuration = 5000;
        this.isMobile = false;
        this.isDesktop = false;
        this.cardWidth = 0;
        this.gap = 24;
        this.isTransitioning = false;
        
        // Enhanced touch handling properties
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchCurrentX = 0;
        this.touchCurrentY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isDragging = false;
        this.isHorizontalGesture = false;
        this.hasUserInteracted = false;
        this.touchThreshold = 10; // Reduced threshold for more responsive detection
        this.swipeThreshold = 50; // Minimum distance for a swipe
        this.touchStartTime = 0;
        this.maxTouchTime = 500; // Maximum time for a valid swipe
        
        this.resizeTimeout = null;
        this.scrollTimeout = null;
        this.isScrollingHorizontally = false;
        
        if (this.carousel && this.track) {
            this.init();
        }
    }
    
    init() {
        this.detectDeviceType();
        this.calculateDimensions();
        this.createDots();
        this.bindEvents();
        this.initializeCards();
        this.updateAllIndicators();
        this.setupIntersectionObserver();
        
        if (this.isDesktop) {
            this.startAutoPlay();
        } else {
            this.setupMobileScrolling();
        }
        
        console.log('✨ Enhanced Services Carousel initialized with fixed touch handling');
    }
    
    detectDeviceType() {
        this.isMobile = window.innerWidth <= 1024;
        this.isDesktop = !this.isMobile;
        
        document.body.classList.toggle('carousel-mobile', this.isMobile);
        document.body.classList.toggle('carousel-desktop', this.isDesktop);
    }
    
    calculateDimensions() {
        const cards = this.track.querySelectorAll('.service-card');
        this.totalCards = cards.length;
        
        if (this.isDesktop && cards.length > 0) {
            const cardRect = cards[0].getBoundingClientRect();
            this.cardWidth = cardRect.width;
            const trackStyles = window.getComputedStyle(this.track);
            this.gap = parseInt(trackStyles.gap) || 24;
        }
        
        this.updateNavigationVisibility();
    }
    
    bindEvents() {
        // Desktop navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
                this.handleUserInteraction();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
                this.handleUserInteraction();
            });
        }
        
        if (this.autoplayBtn) {
            this.autoplayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAutoPlay();
            });
        }
        
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLearnMoreClick();
            });
        }
        
        this.bindServiceCTAs();
        
        // Window resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.onResize();
            }, 250);
        });
        
        // Enhanced mobile touch events
        if (this.isMobile) {
            this.bindEnhancedTouchEvents();
        }
    }
    
    bindEnhancedTouchEvents() {
        // Use passive listeners where possible for better scroll performance
        this.track.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        }, { passive: false }); // Not passive because we might prevent default
        
        this.track.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        }, { passive: true });
        
        this.track.addEventListener('touchcancel', (e) => {
            this.handleTouchCancel(e);
        }, { passive: true });
        
        // Track scroll events for progress indication
        this.track.addEventListener('scroll', this.throttle(() => {
            this.updateMobileProgress();
        }, 16), { passive: true });
        
        // Prevent context menu on long press
        this.track.addEventListener('contextmenu', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        });
    }
    
    handleTouchStart(e) {
        if (!e.touches[0]) return;
        
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchCurrentX = this.touchStartX;
        this.touchCurrentY = this.touchStartY;
        this.touchStartTime = Date.now();
        
        this.isDragging = false;
        this.isHorizontalGesture = false;
        this.isScrollingHorizontally = false;
        
        // Store initial scroll position
        this.initialScrollLeft = this.track.scrollLeft;
        
        // Add visual feedback
        this.track.style.cursor = 'grabbing';
    }
    
    handleTouchMove(e) {
        if (!e.touches[0]) return;
        
        this.touchCurrentX = e.touches[0].clientX;
        this.touchCurrentY = e.touches[0].clientY;
        
        const deltaX = Math.abs(this.touchCurrentX - this.touchStartX);
        const deltaY = Math.abs(this.touchCurrentY - this.touchStartY);
        
        // Determine gesture direction only after threshold is exceeded
        if (!this.isDragging && (deltaX > this.touchThreshold || deltaY > this.touchThreshold)) {
            this.isDragging = true;
            
            // Determine if this is a horizontal or vertical gesture
            if (deltaX > deltaY && deltaX > this.touchThreshold) {
                this.isHorizontalGesture = true;
                this.isScrollingHorizontally = true;
                
                // Add class to track for styling
                this.track.classList.add('scrolling-horizontal');
                
                // Prevent vertical scrolling only for horizontal gestures
                e.preventDefault();
                
            } else if (deltaY > deltaX && deltaY > this.touchThreshold) {
                this.isHorizontalGesture = false;
                // Allow vertical scrolling by not preventing default
            }
        }
        
        // Continue to prevent default for confirmed horizontal gestures
        if (this.isDragging && this.isHorizontalGesture) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        if (!e.changedTouches[0]) return;
        
        this.touchEndX = e.changedTouches[0].clientX;
        this.touchEndY = e.changedTouches[0].clientY;
        
        const touchDuration = Date.now() - this.touchStartTime;
        const deltaX = this.touchStartX - this.touchEndX;
        const deltaY = Math.abs(this.touchStartY - this.touchEndY);
        
        // Reset visual feedback
        this.track.style.cursor = '';
        this.track.classList.remove('scrolling-horizontal');
        
        // Process swipe only if it was a horizontal gesture and within time limit
        if (this.isDragging && 
            this.isHorizontalGesture && 
            touchDuration < this.maxTouchTime &&
            Math.abs(deltaX) > this.swipeThreshold &&
            Math.abs(deltaX) > deltaY) {
            
            this.handleSwipeGesture(deltaX);
            this.handleUserInteraction();
        }
        
        // Reset state
        this.resetTouchState();
    }
    
    handleTouchCancel(e) {
        this.track.style.cursor = '';
        this.track.classList.remove('scrolling-horizontal');
        this.resetTouchState();
    }
    
    resetTouchState() {
        this.isDragging = false;
        this.isHorizontalGesture = false;
        this.isScrollingHorizontally = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchCurrentX = 0;
        this.touchCurrentY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.touchStartTime = 0;
    }
    
    handleSwipeGesture(deltaX) {
        const currentScroll = this.track.scrollLeft;
        const cardWidth = this.getCardWidth();
        const gap = this.getGap();
        const scrollDistance = cardWidth + gap;
        
        if (deltaX > 0) {
            // Swipe left - show next card
            const nextScroll = currentScroll + scrollDistance;
            this.smoothScrollTo(Math.min(nextScroll, this.getMaxScrollLeft()));
        } else {
            // Swipe right - show previous card  
            const prevScroll = currentScroll - scrollDistance;
            this.smoothScrollTo(Math.max(prevScroll, 0));
        }
    }
    
    getCardWidth() {
        const card = this.track.querySelector('.service-card');
        return card ? card.offsetWidth : 300;
    }
    
    getGap() {
        const computedStyle = window.getComputedStyle(this.track);
        return parseInt(computedStyle.gap) || 16;
    }
    
    getMaxScrollLeft() {
        return this.track.scrollWidth - this.track.clientWidth;
    }
    
    smoothScrollTo(scrollLeft) {
        this.track.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
    
    setupMobileScrolling() {
        // Enhanced mobile scroll setup
        this.track.style.scrollBehavior = 'smooth';
        this.track.style.overflowX = 'auto';
        this.track.style.overflowY = 'visible'; // Allow vertical overflow
        this.track.style.scrollSnapType = 'x mandatory';
        this.track.style.WebkitOverflowScrolling = 'touch';
        
        // Ensure cards have scroll snap alignment
        const cards = this.track.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.style.scrollSnapAlign = 'center';
            card.style.scrollSnapStop = 'always';
        });
        
        this.updateMobileProgress();
    }
    
    updateMobileProgress() {
        if (!this.isMobile || !this.progressFill) return;
        
        const scrollLeft = this.track.scrollLeft;
        const maxScroll = this.getMaxScrollLeft();
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
        
        this.progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        
        // Update current slide indicator
        const cardWidth = this.getCardWidth();
        const gap = this.getGap();
        const slideWidth = cardWidth + gap;
        const currentSlideIndex = Math.round(scrollLeft / slideWidth);
        
        if (this.currentSlide) {
            this.currentSlide.textContent = Math.min(this.totalCards, Math.max(1, currentSlideIndex + 1));
        }
    }
    
    // Desktop carousel methods (unchanged)
    nextSlide() {
        if (this.isTransitioning || this.isMobile) return;
        
        const maxIndex = this.getMaxIndex();
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        } else if (this.isAutoPlaying) {
            this.currentIndex = 0;
            this.updateCarousel();
        }
    }
    
    previousSlide() {
        if (this.isTransitioning || this.isMobile) return;
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        if (this.isTransitioning || this.isMobile) return;
        
        const maxIndex = this.getMaxIndex();
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        this.updateCarousel();
        this.handleUserInteraction();
    }
    
    updateCarousel() {
        if (this.isMobile) return;
        
        this.isTransitioning = true;
        
        const translateX = -this.currentIndex * (this.cardWidth + this.gap);
        this.track.style.transform = `translateX(${translateX}px)`;
        
        this.updateAllIndicators();
        this.updateNavigationState();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }
    
    getMaxIndex() {
        const visibleCards = this.getVisibleCards();
        return Math.max(0, this.totalCards - visibleCards);
    }
    
    getVisibleCards() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 768) return 1;
        if (screenWidth <= 1200) return 2;
        return 3;
    }
    
    createDots() {
        if (!this.dotsContainer || this.isMobile) return;
        
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalCards; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            
            if (i === 0) dot.classList.add('active');
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateDots() {
        if (!this.dotsContainer || this.isMobile) return;
        
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startAutoPlay() {
        if (this.isMobile || this.hasUserInteracted) return;
        
        this.isAutoPlaying = true;
        this.updateAutoplayButton();
        
        this.autoPlayInterval = setInterval(() => {
            if (!this.hasUserInteracted && this.isAutoPlaying) {
                this.nextSlide();
            }
        }, this.autoPlayDuration);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.isAutoPlaying = false;
        this.updateAutoplayButton();
    }
    
    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
        this.handleUserInteraction();
    }
    
    updateAutoplayButton() {
        if (!this.autoplayBtn) return;
        
        const icon = this.autoplayBtn.querySelector('i');
        if (icon) {
            icon.className = this.isAutoPlaying ? 'ri-pause-line' : 'ri-play-line';
        }
        
        this.autoplayBtn.title = this.isAutoPlaying ? 'Pause Autoplay' : 'Start Autoplay';
    }
    
    handleUserInteraction() {
        this.hasUserInteracted = true;
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        }
    }
    
    updateAllIndicators() {
        this.updateDots();
        this.updateCounters();
        this.updateNavigationState();
        
        if (this.isMobile) {
            this.updateMobileProgress();
        }
    }
    
    updateCounters() {
        if (this.currentCounter && this.isDesktop) {
            this.currentCounter.textContent = String(this.currentIndex + 1).padStart(2, '0');
        }
        
        if (this.totalCounter && this.isDesktop) {
            this.totalCounter.textContent = String(this.totalCards).padStart(2, '0');
        }
        
        if (this.totalSlides) {
            this.totalSlides.textContent = this.totalCards;
        }
    }
    
    updateNavigationState() {
        if (!this.isDesktop) return;
        
        const maxIndex = this.getMaxIndex();
        
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= maxIndex;
        }
    }
    
    updateNavigationVisibility() {
        const shouldShowDesktopNav = this.isDesktop && this.totalCards > this.getVisibleCards();
        
        if (this.prevBtn) this.prevBtn.style.display = shouldShowDesktopNav ? 'flex' : 'none';
        if (this.nextBtn) this.nextBtn.style.display = shouldShowDesktopNav ? 'flex' : 'none';
        
        if (this.dotsContainer) {
            this.dotsContainer.style.display = shouldShowDesktopNav ? 'flex' : 'none';
        }
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
        const serviceType = cta.getAttribute('data-service');
        
        this.addRippleEffect(cta);
        
        cta.style.transform = 'translateY(-1px) scale(0.98)';
        setTimeout(() => {
            cta.style.transform = '';
        }, 150);
        
        this.showBookingFeedback(serviceType);
        
        setTimeout(() => {
            this.scrollToContact();
        }, 300);
        
        this.trackServiceClick(serviceType);
    }
    
    handleLearnMoreClick() {
        this.learnMoreBtn.style.transform = 'translateY(-2px) scale(0.98)';
        
        this.showLearnMoreFeedback();
        
        setTimeout(() => {
            this.learnMoreBtn.style.transform = '';
        }, 150);
        
        setTimeout(() => {
            window.location.href = 'services.html';
        }, 800);
        
        this.trackEvent('learn_more_clicked', 'services', 'detailed_services_page');
    }
    
    showBookingFeedback(serviceType) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00, #FFA500);
            color: white;
            padding: 16px 24px;
            border-radius: 20px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(20px);
            box-shadow: 0 12px 40px rgba(255, 140, 0, 0.4);
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        feedback.innerHTML = `
            <i class="ri-calendar-check-line" style="font-size: 16px;"></i>
            <span>Booking ${serviceType || 'consultation'}...</span>
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
    
    showLearnMoreFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
            color: white;
            padding: 20px 32px;
            border-radius: 24px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 15px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(255, 140, 0, 0.4);
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            min-width: 280px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="ri-information-line" style="font-size: 18px;"></i>
            <span>Loading detailed services...</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
            }, 500);
        }, 2500);
    }
    
    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    addRippleEffect(button) {
        const ripple = button.querySelector('.cta-ripple');
        if (!ripple) return;
        
        button.classList.add('ripple-active');
        
        setTimeout(() => {
            button.classList.remove('ripple-active');
        }, 600);
    }
    
    trackServiceClick(serviceType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_booking_click', {
                event_category: 'services',
                event_label: serviceType,
                value: 1
            });
        }
        
        console.log(`📊 Service booking clicked: ${serviceType}`);
    }
    
    trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: 1
            });
        }
        
        console.log(`📊 Event tracked: ${action} - ${category} - ${label}`);
    }
    
    initializeCards() {
        const cards = this.track.querySelectorAll('.service-card');
        
        cards.forEach((card, index) => {
            if (this.isMobile) {
                card.style.scrollSnapAlign = 'center';
                card.style.scrollSnapStop = 'always';
            }
            
            this.setupCardAnimations(card, index);
        });
    }
    
    setupCardAnimations(card, index) {
        card.style.setProperty('--animation-delay', `${index * 100}ms`);
        
        if (!this.isMobile) {
            this.setupCardHoverEffects(card);
        }
    }
    
    setupCardHoverEffects(card) {
        card.addEventListener('mouseenter', () => {
            this.onCardHover(card);
        });
        
        card.addEventListener('mouseleave', () => {
            this.onCardLeave(card);
        });
    }
    
    onCardHover(card) {
        card.style.animationName = 'cardFloat';
        card.style.animationDuration = '3s';
        card.style.animationIterationCount = 'infinite';
        card.style.animationTimingFunction = 'ease-in-out';
    }
    
    onCardLeave(card) {
        card.style.animationName = '';
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.onSectionVisible();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        if (this.carousel) {
            observer.observe(this.carousel);
        }
    }
    
    onSectionVisible() {
        const cards = this.track.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100);
        });
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    onResize() {
        const wasDesktop = this.isDesktop;
        this.detectDeviceType();
        
        if (wasDesktop !== this.isDesktop) {
            this.handleDeviceTypeChange();
        }
        
        this.calculateDimensions();
        this.updateNavigationVisibility();
        
        if (this.isDesktop) {
            const maxIndex = this.getMaxIndex();
            if (this.currentIndex > maxIndex) {
                this.currentIndex = Math.max(0, maxIndex);
            }
            this.updateCarousel();
        } else {
            this.setupMobileScrolling();
            this.updateMobileProgress();
        }
        
        this.updateAllIndicators();
    }
    
    handleDeviceTypeChange() {
        if (this.isMobile && this.isAutoPlaying) {
            this.stopAutoPlay();
        }
        
        if (this.isMobile) {
            this.track.style.transform = '';
            this.resetTouchState();
        }
        
        if (this.isDesktop) {
            this.createDots();
        }
        
        if (this.isMobile) {
            this.bindEnhancedTouchEvents();
        }
    }
    
    pause() {
        this.stopAutoPlay();
    }
    
    play() {
        if (this.isDesktop) {
            this.startAutoPlay();
        }
    }
    
    getCurrentIndex() {
        return this.currentIndex;
    }
    
    getTotalCards() {
        return this.totalCards;
    }
    
    destroy() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Clean up touch events
        this.resetTouchState();
        
        window.removeEventListener('resize', this.onResize);
        
        console.log('🗑️ Enhanced Services Carousel destroyed');
    }
}

/* ========================================
   ABOUT SECTION
   ======================================== */

class HermesAboutSection {
    constructor() {
        this.section = document.querySelector('.hermes-about-section');
        this.revealElements = [];
        this.isInitialized = false;
        this.observers = new Map();
        this.learnMoreBtn = document.getElementById('hermesLearnMoreBtn');
        this.consultationBtn = document.getElementById('hermesConsultationBtn');
        
        if (this.section) {
            this.init();
        }
    }
    
    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupRevealElements();
            this.bindEvents();
            this.initIntersectionObserver();
            this.initCredentialPills();
            this.initExpertiseCards();
            this.initCertificationCards();
            this.initPerformanceOptimizations();
            
            this.isInitialized = true;
            console.log('✨ Hermès About Section initialized');
        } catch (error) {
            console.error('❌ Error initializing Hermès About Section:', error);
        }
    }
    
    setupRevealElements() {
        this.revealElements = this.section.querySelectorAll('[data-hermes-reveal]');
        
        this.revealElements.forEach(element => {
            const delay = element.getAttribute('data-delay') || 0;
            element.style.transitionDelay = `${delay}ms`;
        });
    }
    
    bindEvents() {
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLearnMoreClick();
            });
            
            this.learnMoreBtn.addEventListener('mouseenter', () => {
                this.addButtonShine(this.learnMoreBtn);
            });
        }
        
        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleConsultationClick();
            });
            
            this.consultationBtn.addEventListener('mouseenter', () => {
                this.addConsultationGlow(this.consultationBtn);
            });
        }
    }
    
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.revealElements.forEach(element => {
            observer.observe(element);
        });
        
        this.observers.set('reveal', observer);
    }
    
    revealElement(element) {
        element.classList.add('reveal');
        
        if (element.classList.contains('hermes-content-layout')) {
            this.animateContentLayout(element);
        } else if (element.classList.contains('hermes-certifications-section')) {
            this.animateCertifications(element);
        }
    }
    
    animateContentLayout(layout) {
        const profileCard = layout.querySelector('.hermes-doctor-profile');
        const contentCards = layout.querySelectorAll('.hermes-philosophy-card, .hermes-expertise-showcase, .hermes-cta-section');
        
        if (profileCard) {
            setTimeout(() => {
                profileCard.style.transform = 'translateY(0)';
                profileCard.style.opacity = '1';
            }, 200);
        }
        
        contentCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, 400 + (index * 150));
        });
    }
    
    animateCertifications(section) {
        const cards = section.querySelectorAll('.hermes-cert-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }
    
    initCredentialPills() {
        const pills = this.section.querySelectorAll('.credential-pill');
        
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                this.handleCredentialClick(pill);
            });
            
            pill.addEventListener('mouseenter', () => {
                this.addPillGlow(pill);
            });
        });
    }
    
    handleCredentialClick(pill) {
        const credentialText = pill.textContent.trim();
        
        this.addRippleEffect(pill);
        this.showCredentialInfo(credentialText);
        this.trackEvent('credential_clicked', 'about', credentialText);
    }
    
    showCredentialInfo(credential) {
        const feedback = this.createLuxuryFeedback(
            `${credential} - Excellence in aesthetic medicine`,
            'rgba(16, 185, 129, 0.95)',
            'ri-award-line'
        );
        
        this.showFeedback(feedback, 3000);
    }
    
    initExpertiseCards() {
        const cards = this.section.querySelectorAll('.hermes-expertise-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleExpertiseClick(card);
            });
            
            card.addEventListener('mouseenter', () => {
                this.addCardParallax(card);
            });
        });
    }
    
    handleExpertiseClick(card) {
        const expertise = card.getAttribute('data-expertise');
        const title = card.querySelector('h4')?.textContent;
        
        this.addClickFeedback(card);
        this.showExpertiseInfo(title);
        this.trackEvent('expertise_clicked', 'about', expertise);
    }
    
    showExpertiseInfo(title) {
        const feedback = this.createLuxuryFeedback(
            `Learn more about ${title}`,
            'rgba(139, 92, 246, 0.95)',
            'ri-information-line'
        );
        
        this.showFeedback(feedback, 2500);
    }
    
    initCertificationCards() {
        const cards = this.section.querySelectorAll('.hermes-cert-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleCertificationClick(card);
            });
        });
    }
    
    handleCertificationClick(card) {
        const title = card.querySelector('h5')?.textContent;
        const subtitle = card.querySelector('p')?.textContent;
        
        this.addClickFeedback(card);
        this.showCertificationInfo(title, subtitle);
        this.trackEvent('certification_clicked', 'about', title);
    }
    
    showCertificationInfo(title, subtitle) {
        const feedback = this.createLuxuryFeedback(
            `${title} - ${subtitle}`,
            'rgba(255, 140, 0, 0.95)',
            'ri-medal-line'
        );
        
        this.showFeedback(feedback, 2500);
    }
    
    handleLearnMoreClick() {
        this.addClickFeedback(this.learnMoreBtn);
        
        this.showLoadingFeedback('Loading about page...');
        
        setTimeout(() => {
            window.location.href = 'about.html';
        }, 800);
        
        this.trackEvent('learn_more_clicked', 'about', 'about_page_navigation');
    }
    
    handleConsultationClick() {
        this.addClickFeedback(this.consultationBtn);
        
        this.showConsultationFeedback();
        
        setTimeout(() => {
            this.scrollToContact();
        }, 300);
        
        this.trackEvent('consultation_clicked', 'about', 'contact_navigation');
    }
    
    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    showLoadingFeedback(message) {
        const feedback = this.createLuxuryFeedback(
            message,
            'rgba(255, 140, 0, 0.95)',
            'ri-loader-4-line'
        );
        
        const icon = feedback.querySelector('i');
        if (icon) {
            icon.style.animation = 'spin 1s linear infinite';
        }
        
        this.showFeedback(feedback, 3000);
    }
    
    showConsultationFeedback() {
        const feedback = this.createLuxuryFeedback(
            'Redirecting to consultation booking...',
            'rgba(16, 185, 129, 0.95)',
            'ri-calendar-check-line'
        );
        
        this.showFeedback(feedback, 2000);
    }
    
    addButtonShine(button) {
        if (this.isMobile()) return;
        
        const shine = button.querySelector('.btn-hermes-shine');
        if (shine) {
            shine.style.left = '-100%';
            shine.style.transition = 'left 0.8s ease';
            
            setTimeout(() => {
                shine.style.left = '100%';
            }, 50);
        }
    }
    
    addConsultationGlow(button) {
        const ripple = button.querySelector('.consultation-ripple');
        if (ripple) {
            ripple.style.opacity = '0.1';
            setTimeout(() => {
                ripple.style.opacity = '0';
            }, 1000);
        }
    }
    
    addPillGlow(pill) {
        pill.style.boxShadow = '0 8px 32px rgba(255, 140, 0, 0.3)';
        setTimeout(() => {
            pill.style.boxShadow = '';
        }, 1000);
    }
    
    addCardParallax(card) {
        if (this.isMobile()) return;
        
        const icon = card.querySelector('.expertise-icon-frame');
        if (icon) {
            icon.style.transform = 'scale(1.1) translateY(-2px) rotate(-2deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }
    
    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: rgba(255, 140, 0, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
            pointer-events: none;
            transition: all 0.6s ease-out;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(6)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    addClickFeedback(element) {
        element.style.transform = 'scale(0.98)';
        element.style.transition = 'transform 0.1s ease-out';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 150);
    }
    
    createLuxuryFeedback(message, backgroundColor, iconClass) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${backgroundColor};
            color: white;
            padding: 20px 32px;
            border-radius: 24px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 15px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(30px);
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.15),
                0 8px 32px ${backgroundColor.replace('0.95', '0.3')};
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 350px;
            text-align: center;
            border: 2px solid rgba(255, 255, 255, 0.2);
            min-width: 280px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="${iconClass}" style="font-size: 18px;"></i>
            <span>${message}</span>
        `;
        
        return feedback;
    }
    
    showFeedback(feedback, duration = 2500) {
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
            }, 600);
        }, duration);
    }
    
    initPerformanceOptimizations() {
        const animatedElements = this.section.querySelectorAll(
            '.hermes-doctor-profile, .hermes-philosophy-card, .hermes-expertise-card, .hermes-learn-more-btn'
        );
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, box-shadow';
        });
        
        this.addScrollOptimizations();
    }
    
    addScrollOptimizations() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    onScroll() {
        if (!this.isMobile()) {
            this.updateFloatingElements();
        }
    }
    
    updateFloatingElements() {
        const scrollY = window.pageYOffset;
        const elements = this.section.querySelectorAll('.hermes-float-icon');
        
        elements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: 1
            });
        }
        
        console.log(`📊 Event tracked: ${action} - ${category} - ${label}`);
    }
    
    isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    onResize() {
        if (this.isMobile()) {
            this.optimizeForMobile();
        } else {
            this.optimizeForDesktop();
        }
    }
    
    optimizeForMobile() {
        const cards = this.section.querySelectorAll('.hermes-expertise-card, .hermes-cert-card');
        cards.forEach(card => {
            card.style.willChange = 'auto';
        });
    }
    
    optimizeForDesktop() {
        const cards = this.section.querySelectorAll('.hermes-expertise-card, .hermes-cert-card');
        cards.forEach(card => {
            card.style.willChange = 'transform, box-shadow';
        });
    }
    
    refresh() {
        this.destroy();
        this.init();
    }
    
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        if (this.learnMoreBtn) {
            this.learnMoreBtn.replaceWith(this.learnMoreBtn.cloneNode(true));
        }
        
        if (this.consultationBtn) {
            this.consultationBtn.replaceWith(this.consultationBtn.cloneNode(true));
        }
        
        this.isInitialized = false;
        
        console.log('🗑️ Hermès About Section destroyed');
    }
}

/* ========================================
   TRANSFORMATIONS SECTION
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
        let currentPosition = 50;

        if (!afterImage || !sliderHandle) return;

        this.updateImageReveal(afterImage, sliderHandle, currentPosition);

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

        if (!EviaUtils.isMobile()) {
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

        setTimeout(() => {
            this.updateGridLayout();
        }, 300);
    }

    updateGridLayout() {
        const visibleItems = Array.from(this.resultItems).filter(item => 
            !item.classList.contains('filtered-out')
        );

        visibleItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 100}ms`;
        });

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
        }
    }

    handleCTAClick() {
        this.ctaButton.style.transform = 'translateY(-2px) scale(0.98)';
        
        setTimeout(() => {
            this.ctaButton.style.transform = '';
        }, 150);

        setTimeout(() => {
            app.smoothScrollTo('#contact');
        }, 200);

        this.showBookingFeedback();
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

    onResize() {
        this.comparisonContainers.forEach(container => {
            const afterImage = container.querySelector('.after-image');
            const sliderHandle = container.querySelector('.slider-handle');
            if (afterImage && sliderHandle) {
                this.updateImageReveal(afterImage, sliderHandle, 50);
            }
        });
    }
}

/* ========================================
   INSTAGRAM & REVIEWS SECTIONS
   ======================================== */

class RedesignedSocialSections {
    constructor() {
        this.instagram = {
            initialized: false,
            widgetLoaded: false,
            container: null,
            loading: null
        };
        this.reviews = {
            initialized: false,
            widgetLoaded: false,
            container: null,
            loading: null
        };
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeRedesignedSections());
            return;
        }

        this.initializeRedesignedSections();
    }
    
    initializeRedesignedSections() {
        this.initializeInstagramSection();
        this.initializeReviewsSection();
        this.setupElfsightIntegration();
        
        console.log('✨ Redesigned Social Sections initialized');
    }

    /* ========================================
       INSTAGRAM SECTION
       ======================================== */
    
    initializeInstagramSection() {
        const instagramSection = document.querySelector('.redesigned-instagram-section');
        if (!instagramSection) return;

        this.instagram.container = document.getElementById('instagramWidgetContainer');
        this.instagram.loading = document.getElementById('instagramLoading');

        this.showInstagramLoading();
        this.setupInstagramStatsAnimation();
        this.setupInstagramObserver();

        this.instagram.initialized = true;
        console.log('📷 Instagram section initialized');
    }

    showInstagramLoading() {
        if (this.instagram.loading) {
            this.instagram.loading.style.display = 'flex';
        }
        if (this.instagram.container) {
            this.instagram.container.style.opacity = '0';
        }
    }

    hideInstagramLoading() {
        if (this.instagram.loading) {
            this.instagram.loading.style.opacity = '0';
            setTimeout(() => {
                this.instagram.loading.style.display = 'none';
            }, 300);
        }
        
        if (this.instagram.container) {
            this.instagram.container.style.opacity = '1';
        }
    }

    setupInstagramStatsAnimation() {
        const stats = document.querySelectorAll('.redesigned-instagram-section .instagram-stat-number');
        
        stats.forEach(stat => {
            const finalValue = stat.textContent;
            const isNumber = /^\d+/.test(finalValue);
            
            if (isNumber) {
                const number = parseInt(finalValue.replace(/\D/g, ''));
                this.animateCounter(stat, 0, number, 2000, finalValue.replace(/\d/g, ''));
            }
        });
    }

    setupInstagramObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    if (entry.target.classList.contains('instagram-stats')) {
                        this.setupInstagramStatsAnimation();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        const elementsToObserve = document.querySelectorAll('.redesigned-instagram-section .instagram-stats, .redesigned-instagram-section .instagram-widget-container');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    /* ========================================
       REVIEWS SECTION
       ======================================== */
    
    initializeReviewsSection() {
        const reviewsSection = document.querySelector('.redesigned-reviews-section');
        if (!reviewsSection) return;

        this.reviews.container = document.getElementById('reviewsWidgetContainer');
        this.reviews.loading = document.getElementById('reviewsLoading');

        this.showReviewsLoading();
        this.setupReviewsStatsAnimation();
        this.setupReviewsObserver();

        this.reviews.initialized = true;
        console.log('⭐ Reviews section initialized');
    }

    showReviewsLoading() {
        if (this.reviews.loading) {
            this.reviews.loading.style.display = 'flex';
        }
        if (this.reviews.container) {
            this.reviews.container.style.opacity = '0';
        }
    }

    hideReviewsLoading() {
        if (this.reviews.loading) {
            this.reviews.loading.style.opacity = '0';
            setTimeout(() => {
                this.reviews.loading.style.display = 'none';
            }, 300);
        }
        
        if (this.reviews.container) {
            this.reviews.container.style.opacity = '1';
        }
    }

    setupReviewsStatsAnimation() {
        const stats = document.querySelectorAll('.redesigned-reviews-section .reviews-stat-number');
        
        stats.forEach(stat => {
            const finalValue = stat.textContent;
            const isNumber = /^\d+/.test(finalValue);
            
            if (isNumber) {
                const number = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/[\d.]/g, '');
                this.animateCounter(stat, 0, number, 2000, suffix);
            } else if (finalValue.includes('5.0')) {
                this.animateRating(stat, 5.0);
            }
        });
    }

    setupReviewsObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    if (entry.target.classList.contains('reviews-stats-section')) {
                        this.setupReviewsStatsAnimation();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        const elementsToObserve = document.querySelectorAll('.redesigned-reviews-section .reviews-stats-section, .redesigned-reviews-section .reviews-widget-container');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    /* ========================================
       ELFSIGHT INTEGRATION
       ======================================== */
    
    setupElfsightIntegration() {
        if (!window.ElfsightLoader && !document.querySelector('script[src*="elfsight"]')) {
            this.loadElfsightScript();
        } else {
            setTimeout(() => this.checkWidgetStatus(), 1000);
        }

        this.setupWidgetChecks();
    }

    loadElfsightScript() {
        const script = document.createElement('script');
        script.src = 'https://static.elfsight.com/platform/platform.js';
        script.async = true;
        
        script.onload = () => {
            console.log('📦 Elfsight script loaded');
            setTimeout(() => this.checkWidgetStatus(), 2000);
        };
        
        script.onerror = () => {
            console.warn('⚠️ Failed to load Elfsight script');
            this.handleWidgetLoadFailure();
        };
        
        document.head.appendChild(script);
    }

    setupWidgetChecks() {
        let checkCount = 0;
        const maxChecks = 20;
        
        const checkInterval = setInterval(() => {
            checkCount++;
            
            this.checkWidgetStatus();
            
            if ((this.instagram.widgetLoaded && this.reviews.widgetLoaded) || checkCount >= maxChecks) {
                clearInterval(checkInterval);
                
                if (checkCount >= maxChecks) {
                    this.handleWidgetLoadFailure();
                }
            }
        }, 1000);
    }

    checkWidgetStatus() {
        if (!this.instagram.widgetLoaded) {
            const instagramWidget = document.querySelector('.redesigned-instagram-section .elfsight-app-20c4a42b-4210-4270-b65c-9378811208fb');
            if (instagramWidget && (instagramWidget.children.length > 0 || instagramWidget.innerHTML.trim() !== '')) {
                this.instagram.widgetLoaded = true;
                this.hideInstagramLoading();
                this.styleInstagramWidget();
                console.log('📷 Instagram widget loaded');
            }
        }

        if (!this.reviews.widgetLoaded) {
            const reviewsWidget = document.querySelector('.redesigned-reviews-section .elfsight-app-11e6a6c5-a645-4f66-855b-72683346f480');
            if (reviewsWidget && (reviewsWidget.children.length > 0 || reviewsWidget.innerHTML.trim() !== '')) {
                this.reviews.widgetLoaded = true;
                this.hideReviewsLoading();
                this.styleReviewsWidget();
                console.log('⭐ Reviews widget loaded');
            }
        }
    }

    styleInstagramWidget() {
        const widget = document.querySelector('.redesigned-instagram-section .elfsight-app-20c4a42b-4210-4270-b65c-9378811208fb');
        if (widget) {
            widget.style.borderRadius = '20px';
            widget.style.overflow = 'hidden';
            widget.style.border = 'none';
            widget.style.boxShadow = 'none';
        }
    }

    styleReviewsWidget() {
        const widget = document.querySelector('.redesigned-reviews-section .elfsight-app-11e6a6c5-a645-4f66-855b-72683346f480');
        if (widget) {
            widget.style.borderRadius = '20px';
            widget.style.overflow = 'hidden';
            widget.style.border = 'none';
            widget.style.boxShadow = 'none';
        }
    }

    handleWidgetLoadFailure() {
        console.warn('⚠️ Widgets failed to load within timeout period');
        
        if (!this.instagram.widgetLoaded && this.instagram.loading) {
            this.instagram.loading.innerHTML = `
                <div class="widget-fallback">
                    <div class="fallback-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" stroke-width="2"/>
                            <circle cx="12" cy="12" r="3" stroke="#E1306C" stroke-width="2"/>
                            <circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/>
                        </svg>
                    </div>
                    <h4>Visit Our Instagram</h4>
                    <p>Unable to load Instagram feed</p>
                    <a href="https://www.instagram.com/eviaesthetics/?hl=en" target="_blank" class="fallback-link">
                        Follow @eviaesthetics
                    </a>
                </div>
            `;
        }

        if (!this.reviews.widgetLoaded && this.reviews.loading) {
            this.reviews.loading.innerHTML = `
                <div class="widget-fallback">
                    <div class="fallback-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700"/>
                        </svg>
                    </div>
                    <h4>5.0 ★ Rating</h4>
                    <p>Unable to load reviews</p>
                    <a href="https://www.google.com/search?q=eviaesthetics+reviews" target="_blank" class="fallback-link">
                        View Google Reviews
                    </a>
                </div>
            `;
        }
    }

    /* ========================================
       UTILITY FUNCTIONS
       ======================================== */
    
    animateCounter(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const range = end - start;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(start + (range * easedProgress));
            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end + suffix;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    animateRating(element, targetRating) {
        const startTime = performance.now();
        const duration = 2000;

        const updateRating = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentRating = (targetRating * easedProgress).toFixed(1);
            
            element.textContent = currentRating;

            if (progress < 1) {
                requestAnimationFrame(updateRating);
            } else {
                element.textContent = targetRating.toFixed(1);
            }
        };

        requestAnimationFrame(updateRating);
    }

    /* ========================================
       RESPONSIVE HANDLING
       ======================================== */
    
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.querySelectorAll('.redesigned-instagram-section .instagram-gradient-orb, .redesigned-reviews-section .reviews-gradient-orb').forEach(orb => {
                orb.style.animationPlayState = 'paused';
            });
        } else {
            document.querySelectorAll('.redesigned-instagram-section .instagram-gradient-orb, .redesigned-reviews-section .reviews-gradient-orb').forEach(orb => {
                orb.style.animationPlayState = 'running';
            });
        }
    }

    /* ========================================
       PUBLIC API
       ======================================== */
    
    refresh() {
        this.instagram.widgetLoaded = false;
        this.reviews.widgetLoaded = false;
        this.setupElfsightIntegration();
    }
    
    getStatus() {
        return {
            instagram: {
                initialized: this.instagram.initialized,
                loaded: this.instagram.widgetLoaded
            },
            reviews: {
                initialized: this.reviews.initialized,
                loaded: this.reviews.widgetLoaded
            }
        };
    }

    onResize() {
        this.handleResize();
    }
}

/* ========================================
   HERMÈS-INSPIRED PRODUCTS COLLECTION
   Interactive JavaScript Component
   ======================================== */

class HermesProductsCollection {
    constructor() {
        this.section = document.querySelector('.hermes-products-collection');
        this.header = document.querySelector('.collection-header');
        this.gallery = document.querySelector('.products-gallery');
        this.footer = document.querySelector('.collection-footer');
        this.productBooks = document.querySelectorAll('.product-book');
        this.discoverButtons = document.querySelectorAll('.discover-btn');
        this.catalogButton = document.getElementById('catalogButton');
        this.partnershipSeal = document.querySelector('.partnership-seal');
        
        this.isInitialized = false;
        this.observers = new Map();
        this.isVisible = false;
        this.animationQueue = [];
        
        if (this.section) {
            this.init();
        }
    }
    
    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupIntersectionObservers();
            this.bindProductInteractions();
            this.bindButtonEvents();
            this.initializeAnimations();
            this.setupPerformanceOptimizations();
            this.startAmbientAnimations();
            
            this.isInitialized = true;
            console.log('✨ Hermès Products Collection initialized');
        } catch (error) {
            console.error('❌ Error initializing Hermès Products Collection:', error);
        }
    }
    
    setupIntersectionObservers() {
        // Main section observer
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible) {
                    this.onSectionVisible();
                }
            });
        }, { threshold: 0.2 });
        
        sectionObserver.observe(this.section);
        this.observers.set('section', sectionObserver);
        
        // Element reveal observer
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe elements for reveal
        const revealElements = [
            this.header,
            ...this.productBooks,
            this.footer
        ].filter(Boolean);
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
        
        this.observers.set('reveal', revealObserver);
        
        // Performance observer for product books
        const performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const book = entry.target;
                if (entry.isIntersecting) {
                    this.enableBookAnimations(book);
                } else {
                    this.disableBookAnimations(book);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px 50px 0px'
        });
        
        this.productBooks.forEach(book => {
            performanceObserver.observe(book);
        });
        
        this.observers.set('performance', performanceObserver);
    }
    
    revealElement(element) {
        if (element.classList.contains('collection-header')) {
            this.animateHeader();
        } else if (element.classList.contains('product-book')) {
            this.animateProductBook(element);
        } else if (element.classList.contains('collection-footer')) {
            this.animateFooter();
        }
    }
    
    animateHeader() {
        const seal = this.header.querySelector('.partnership-seal');
        const title = this.header.querySelector('.collection-title');
        const subtitle = this.header.querySelector('.collection-subtitle');
        
        if (seal) {
            setTimeout(() => {
                seal.style.opacity = '1';
                seal.style.transform = 'translateY(0) scale(1)';
            }, 100);
        }
        
        if (title) {
            setTimeout(() => {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 300);
        }
        
        if (subtitle) {
            setTimeout(() => {
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 500);
        }
    }
    
    animateProductBook(book) {
        const index = Array.from(this.productBooks).indexOf(book);
        
        setTimeout(() => {
            book.style.opacity = '1';
            book.style.transform = 'translateY(0)';
            
            // Animate internal elements
            this.animateBookContents(book);
        }, index * 150);
    }
    
    animateBookContents(book) {
        const display = book.querySelector('.product-display');
        const details = book.querySelector('.product-details');
        const button = book.querySelector('.discover-btn');
        
        if (display) {
            setTimeout(() => {
                display.style.opacity = '1';
                display.style.transform = 'translateY(0)';
            }, 100);
        }
        
        if (details) {
            const detailElements = details.children;
            Array.from(detailElements).forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 200 + (index * 100));
            });
        }
        
        if (button) {
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 600);
        }
    }
    
    animateFooter() {
        const content = this.footer.querySelector('.footer-content');
        if (content) {
            const elements = content.children;
            Array.from(elements).forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }
    }
    
    bindProductInteractions() {
        this.productBooks.forEach(book => {
            this.setupBookInteractions(book);
            this.setupBookTiltEffect(book);
        });
        
        if (this.partnershipSeal) {
            this.setupPartnershipSealInteraction();
        }
    }
    
    setupBookInteractions(book) {
        const productImage = book.querySelector('.product-image');
        const statusBadge = book.querySelector('.status-badge');
        const features = book.querySelectorAll('.feature-pill');
        const rating = book.querySelector('.product-rating');
        
        book.addEventListener('mouseenter', () => {
            this.onBookHover(book, productImage, statusBadge, features, rating);
        });
        
        book.addEventListener('mouseleave', () => {
            this.onBookLeave(book, productImage, statusBadge, features, rating);
        });
        
        book.addEventListener('click', (e) => {
            if (!e.target.closest('.discover-btn')) {
                this.handleBookClick(book, e);
            }
        });
        
        // Feature pill interactions
        features.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                this.addFeatureGlow(feature);
            });
        });
        
        // Status badge interaction
        if (statusBadge) {
            statusBadge.addEventListener('mouseenter', () => {
                this.triggerBadgeEffect(statusBadge);
            });
        }
    }
    
    onBookHover(book, productImage, badge, features, rating) {
        // Image animation
        if (productImage) {
            productImage.style.transform = 'scale(1.1) translateY(-8px)';
        }
        
        // Badge effect
        if (badge) {
            this.triggerBadgeEffect(badge);
        }
        
        // Features animation
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateY(-2px) scale(1.02)';
                feature.style.borderColor = 'rgba(255, 140, 0, 0.3)';
                feature.style.background = 'rgba(255, 140, 0, 0.1)';
            }, index * 50);
        });
        
        // Rating animation
        if (rating) {
            rating.style.transform = 'scale(1.05)';
            rating.style.boxShadow = '0 6px 20px rgba(255, 140, 0, 0.15)';
        }
        
        // Activate glow effects
        this.activateBookGlowEffects(book);
    }
    
    onBookLeave(book, productImage, badge, features, rating) {
        // Reset image
        if (productImage) {
            productImage.style.transform = 'scale(1) translateY(0)';
        }
        
        // Reset features
        features.forEach(feature => {
            feature.style.transform = 'translateY(0) scale(1)';
            feature.style.borderColor = 'rgba(255, 140, 0, 0.08)';
            feature.style.background = 'var(--cream-soft)';
        });
        
        // Reset rating
        if (rating) {
            rating.style.transform = 'scale(1)';
            rating.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
        }
    }
    
    setupBookTiltEffect(book) {
        if (this.isMobile()) return;
        
        book.addEventListener('mousemove', (e) => {
            this.handleBookTilt(book, e);
        });
        
        book.addEventListener('mouseleave', () => {
            book.style.transform = 'translateY(-12px) scale(1.02) rotateX(0) rotateY(0)';
        });
    }
    
    handleBookTilt(book, event) {
        const rect = book.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -3;
        const rotateY = (x - centerX) / centerX * 3;
        
        book.style.transform = `translateY(-12px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    handleBookClick(book, event) {
        this.createRippleEffect(book, event);
        
        const productName = book.querySelector('.product-title')?.textContent || 'Product';
        this.showProductFeedback(productName);
        
        // Click animation
        book.style.transform = 'scale(0.98)';
        setTimeout(() => {
            book.style.transform = '';
        }, 150);
        
        this.trackProductBookClick(productName);
    }
    
    setupPartnershipSealInteraction() {
        const sealContent = this.partnershipSeal.querySelector('.seal-content');
        
        this.partnershipSeal.addEventListener('mouseenter', () => {
            this.activatePartnershipGlow();
        });
        
        this.partnershipSeal.addEventListener('click', () => {
            this.handlePartnershipClick();
        });
    }
    
    activatePartnershipGlow() {
        const sealContent = this.partnershipSeal.querySelector('.seal-content');
        if (sealContent) {
            sealContent.style.transform = 'translateY(-2px) scale(1.05)';
            sealContent.style.boxShadow = '0 8px 24px rgba(255, 140, 0, 0.3)';
        }
    }
    
    handlePartnershipClick() {
        const sealContent = this.partnershipSeal.querySelector('.seal-content');
        
        sealContent.style.transform = 'translateY(-4px) scale(1.02) rotate(2deg)';
        
        setTimeout(() => {
            sealContent.style.transform = '';
        }, 200);
        
        this.showPartnershipFeedback();
        this.trackPartnershipClick();
    }
    
    bindButtonEvents() {
        // Discover buttons
        this.discoverButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleDiscoverClick(btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                this.addButtonHoverEffect(btn);
            });
        });
        
        // Catalog button
        if (this.catalogButton) {
            this.catalogButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCatalogClick();
            });
            
            this.catalogButton.addEventListener('mouseenter', () => {
                this.addCatalogHoverEffect();
            });
        }
    }
    
    handleDiscoverClick(btn) {
        const productBook = btn.closest('.product-book');
        const productName = productBook.querySelector('.product-title')?.textContent || 'Product';
        const productUrl = btn.getAttribute('data-url') || 'https://us.alumiermd.com/products?code=54T7P4HH';
        
        // Button animation
        btn.style.transform = 'translateY(-2px) scale(0.98)';
        this.triggerButtonShimmer(btn);
        
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
        
        this.showDiscoverFeedback(productName);
        
        setTimeout(() => {
            window.open(productUrl, '_blank', 'noopener,noreferrer');
        }, 400);
        
        this.trackDiscoverClick(productName);
    }
    
    handleCatalogClick() {
        this.catalogButton.style.transform = 'translateY(-6px) scale(0.98)';
        this.triggerCatalogShimmer();
        
        setTimeout(() => {
            this.catalogButton.style.transform = '';
        }, 150);
        
        this.showCatalogFeedback();
        
        setTimeout(() => {
            window.open('https://us.alumiermd.com/products?code=54T7P4HH', '_blank', 'noopener,noreferrer');
        }, 400);
        
        this.trackCatalogClick();
    }
    
    activateBookGlowEffects(book) {
        const imageGlow = book.querySelector('.image-glow');
        
        if (imageGlow) {
            imageGlow.style.opacity = '1';
        }
    }
    
    triggerBadgeEffect(badge) {
        badge.style.transform = 'scale(1.05) translateY(-2px) rotate(2deg)';
        
        setTimeout(() => {
            badge.style.transform = '';
        }, 300);
    }
    
    triggerButtonShimmer(btn) {
        const shimmer = document.createElement('div');
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.8s ease;
            pointer-events: none;
            border-radius: inherit;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(shimmer);
        
        requestAnimationFrame(() => {
            shimmer.style.left = '100%';
        });
        
        setTimeout(() => {
            if (shimmer.parentNode) {
                shimmer.parentNode.removeChild(shimmer);
            }
        }, 800);
    }
    
    triggerCatalogShimmer() {
        const shimmer = this.catalogButton.querySelector('.btn-shine');
        if (shimmer) {
            shimmer.style.left = '-100%';
            shimmer.style.transition = 'none';
            shimmer.offsetHeight; // Force reflow
            shimmer.style.transition = 'left 1.2s ease';
            shimmer.style.left = '100%';
        }
    }
    
    addFeatureGlow(feature) {
        feature.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.15)';
        
        setTimeout(() => {
            feature.style.boxShadow = '';
        }, 1000);
    }
    
    addButtonHoverEffect(btn) {
        this.triggerButtonShimmer(btn);
    }
    
    addCatalogHoverEffect() {
        this.triggerCatalogShimmer();
        
        const footerIcon = this.footer.querySelector('.footer-icon');
        if (footerIcon) {
            footerIcon.style.transform = 'scale(1.08) rotate(5deg)';
            setTimeout(() => {
                footerIcon.style.transform = '';
            }, 600);
        }
    }
    
    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, rgba(255, 140, 0, 0.1) 50%, transparent 100%);
            border-radius: 50%;
            transform: scale(0);
            opacity: 1;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transform = 'scale(3)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
    }
    
    showProductFeedback(productName) {
        this.showFeedback(
            `Viewing ${productName}`,
            'rgba(139, 92, 246, 0.95)',
            'ri-eye-line'
        );
    }
    
    showDiscoverFeedback(productName) {
        this.showFeedback(
            `Opening ${productName} details...`,
            'rgba(255, 140, 0, 0.95)',
            'ri-external-link-line'
        );
    }
    
    showCatalogFeedback() {
        this.showFeedback(
            'Opening AlumierMD catalog...',
            'rgba(16, 185, 129, 0.95)',
            'ri-shopping-bag-line'
        );
    }
    
    showPartnershipFeedback() {
        this.showFeedback(
            'Exclusive AlumierMD Partnership',
            'rgba(255, 140, 0, 0.95)',
            'ri-award-line'
        );
    }
    
    showFeedback(message, backgroundColor, iconClass, duration = 2500) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${backgroundColor};
            color: white;
            padding: 24px 36px;
            border-radius: 28px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 16px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(40px);
            box-shadow: 
                0 24px 80px rgba(0, 0, 0, 0.15),
                0 12px 40px ${backgroundColor.replace('0.95', '0.3')};
            display: flex;
            align-items: center;
            gap: 16px;
            max-width: 400px;
            text-align: center;
            border: 3px solid rgba(255, 255, 255, 0.2);
            min-width: 320px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="${iconClass}" style="font-size: 20px;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
            }, 800);
        }, duration);
    }
    
    setupPerformanceOptimizations() {
        const animatedElements = this.section.querySelectorAll(
            '.product-book, .product-image, .image-glow, .discover-btn'
        );
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, box-shadow, opacity';
            element.style.backfaceVisibility = 'hidden';
            element.style.transform = 'translateZ(0)';
        });
    }
    
    enableBookAnimations(book) {
        book.style.willChange = 'transform, box-shadow';
    }
    
    disableBookAnimations(book) {
        book.style.willChange = 'auto';
    }
    
    initializeAnimations() {
        // Prepare header for animation
        if (this.header) {
            const seal = this.header.querySelector('.partnership-seal');
            const title = this.header.querySelector('.collection-title');
            const subtitle = this.header.querySelector('.collection-subtitle');
            
            if (seal) {
                seal.style.opacity = '0';
                seal.style.transform = 'translateY(40px) scale(0.9)';
                seal.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            
            if (title) {
                title.style.opacity = '0';
                title.style.transform = 'translateY(60px)';
                title.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            
            if (subtitle) {
                subtitle.style.opacity = '0';
                subtitle.style.transform = 'translateY(40px)';
                subtitle.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        }
        
        // Prepare product books for animation
        this.productBooks.forEach((book, index) => {
            this.prepareBookForAnimation(book, index);
        });
        
        // Prepare footer for animation
        if (this.footer) {
            this.prepareFooterForAnimation();
        }
    }
    
    prepareBookForAnimation(book, index) {
        book.style.opacity = '0';
        book.style.transform = 'translateY(80px)';
        book.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
        
        const display = book.querySelector('.product-display');
        const details = book.querySelector('.product-details');
        const button = book.querySelector('.discover-btn');
        
        if (display) {
            display.style.opacity = '0';
            display.style.transform = 'translateY(40px)';
            display.style.transition = 'all 0.6s ease';
        }
        
        if (details) {
            Array.from(details.children).forEach((element, childIndex) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = `all 0.5s ease ${childIndex * 0.1}s`;
            });
        }
        
        if (button) {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            button.style.transition = 'all 0.6s ease';
        }
    }
    
    prepareFooterForAnimation() {
        const content = this.footer.querySelector('.footer-content');
        if (content) {
            Array.from(content.children).forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(40px)';
                element.style.transition = `all 0.6s ease ${index * 0.1}s`;
            });
        }
    }
    
    startAmbientAnimations() {
        const floatingElements = this.section.querySelectorAll('.floating-element');
        
        floatingElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
    
    onSectionVisible() {
        this.startAmbientAnimations();
    }
    
    trackProductBookClick(productName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'hermes_product_book_click', {
                event_category: 'products',
                event_label: productName,
                value: 1
            });
        }
        
        console.log(`📊 Product book clicked: ${productName}`);
    }
    
    trackDiscoverClick(productName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'hermes_discover_click', {
                event_category: 'products',
                event_label: productName,
                value: 1
            });
        }
        
        console.log(`📊 Discover button clicked: ${productName}`);
    }
    
    trackCatalogClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'hermes_catalog_view', {
                event_category: 'products',
                event_label: 'alumiermd_full_catalog',
                value: 1
            });
        }
        
        console.log('📊 Catalog opened');
    }
    
    trackPartnershipClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'hermes_partnership_click', {
                event_category: 'engagement',
                event_label: 'alumiermd_partnership',
                value: 1
            });
        }
        
        console.log('📊 Partnership seal clicked');
    }
    
    isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    onResize() {
        if (this.isMobile()) {
            this.optimizeForMobile();
        } else {
            this.optimizeForDesktop();
        }
    }
    
    optimizeForMobile() {
        this.productBooks.forEach(book => {
            book.style.willChange = 'auto';
            book.removeEventListener('mousemove', this.handleBookTilt);
        });
    }
    
    optimizeForDesktop() {
        this.productBooks.forEach(book => {
            book.style.willChange = 'transform, box-shadow';
            this.setupBookTiltEffect(book);
        });
    }
    
    pause() {
        const floatingElements = this.section.querySelectorAll('.floating-element');
        
        floatingElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }
    
    play() {
        const floatingElements = this.section.querySelectorAll('.floating-element');
        
        floatingElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
    
    refresh() {
        this.destroy();
        this.init();
    }
    
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        this.productBooks.forEach(book => {
            book.replaceWith(book.cloneNode(true));
        });
        
        if (this.catalogButton) {
            this.catalogButton.replaceWith(this.catalogButton.cloneNode(true));
        }
        
        this.isInitialized = false;
        
        console.log('🗑️ Hermès Products Collection destroyed');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const hermesProducts = new HermesProductsCollection();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            hermesProducts.onResize();
        }, 250);
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            hermesProducts.pause();
        } else {
            hermesProducts.play();
        }
    });
    
    // Expose to global scope for external control
    window.HermesProductsCollection = hermesProducts;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HermesProductsCollection;
}

/* ========================================
   CONTACT SECTION
   ======================================== */
class HermesLuxuryContactSection {
    constructor() {
        this.section = document.querySelector('.hermes-contact-section');
        this.isInitialized = false;
        this.formLoaded = false;
        this.observers = new Map();
        this.animationQueue = [];
        
        // Element references
        this.elements = {};
        
        if (this.section) {
            this.init();
        }
    }

    init() {
        if (this.isInitialized) return;

        try {
            this.initializeElements();
            this.setupRevealAnimations();
            this.bindInteractions();
            this.initializeElfsightForm();
            this.setupFloatingCredentials();
            this.initializeAmbientEffects();
            this.initializeMapFeatures();
            
            this.isInitialized = true;
            console.log('✨ Hermès Luxury Contact Section initialized with enhanced map features');
        } catch (error) {
            console.error('❌ Error initializing Hermès Contact Section:', error);
        }
    }

    initializeElements() {
        this.elements = {
            // Main containers
            container: this.section.querySelector('.hermes-contact-container'),
            header: this.section.querySelector('.hermes-contact-header'),
            layout: this.section.querySelector('.hermes-contact-layout'),
            
            // Enhanced location elements
            locationCard: this.section.querySelector('.location-luxury-card'),
            mapContainer: this.section.querySelector('.location-map-container'),
            mapOverlay: this.section.querySelector('.map-overlay'),
            googleMapFrame: this.section.querySelector('.google-map-frame'),
            mapIframe: this.section.querySelector('.google-map-frame iframe'),
            directionsBtn: this.section.querySelector('.directions-btn'),
            streetViewBtn: this.section.querySelector('.street-view-btn'),
            locationActions: this.section.querySelector('.location-actions'),
            
            // Contact method elements
            methodCards: this.section.querySelectorAll('.method-luxury-card'),
            phoneCard: this.section.querySelector('.phone-card'),
            emailCard: this.section.querySelector('.email-card'),
            methodActionBtns: this.section.querySelectorAll('.method-action-btn'),
            
            // Social elements
            socialLinks: this.section.querySelectorAll('.social-link-luxury'),
            
            // Form elements
            formContainer: this.section.querySelector('.form-luxury-container'),
            formLoading: this.section.querySelector('#formLoadingLuxury'),
            elfsightForm: this.section.querySelector('#elfsightFormLuxury'),
            elfsightWidget: this.section.querySelector('.elfsight-app-db15691a-379c-4773-8900-983e7e393d0f'),
            
            // Treatment highlights
            highlightItems: this.section.querySelectorAll('.highlight-item'),
            
            // Emergency contact
            emergencySection: this.section.querySelector('.emergency-contact-luxury'),
            emergencyBtn: this.section.querySelector('.emergency-luxury-cta'),
            
            // Floating credentials
            credentialPills: this.section.querySelectorAll('.credential-pill'),
            
            // Ambient elements
            ambientOrbs: this.section.querySelectorAll('.ambient-orb'),
            floatingIcons: this.section.querySelectorAll('.float-icon'),
            
            // Reveal elements
            revealElements: this.section.querySelectorAll('[data-reveal]')
        };
    }

    setupRevealAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.elements.revealElements.forEach(element => {
            revealObserver.observe(element);
        });

        this.observers.set('reveal', revealObserver);
    }

    revealElement(element) {
        const delay = element.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
            element.classList.add('revealed');
            
            // Special animations for specific elements
            if (element.classList.contains('hermes-contact-layout')) {
                this.animateContactLayout();
            } else if (element.classList.contains('emergency-contact-luxury')) {
                this.animateEmergencySection();
            }
        }, parseInt(delay));
    }

    animateContactLayout() {
        // Animate contact info cards
        const infoCards = this.section.querySelectorAll('.location-luxury-card, .method-luxury-card, .treatment-highlights-card, .social-luxury-card');
        infoCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });

        // Animate form container
        setTimeout(() => {
            if (this.elements.formContainer) {
                this.elements.formContainer.style.opacity = '1';
                this.elements.formContainer.style.transform = 'translateY(0)';
            }
        }, 600);

        // Animate map container
        setTimeout(() => {
            this.animateMapReveal();
        }, 300);
    }

    animateMapReveal() {
        if (this.elements.mapContainer) {
            this.elements.mapContainer.style.opacity = '0';
            this.elements.mapContainer.style.transform = 'scale(0.95)';
            this.elements.mapContainer.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                this.elements.mapContainer.style.opacity = '1';
                this.elements.mapContainer.style.transform = 'scale(1)';
            }, 100);
        }
    }

    animateEmergencySection() {
        const emergencyIcon = this.elements.emergencySection?.querySelector('.emergency-icon-frame');
        const emergencyText = this.elements.emergencySection?.querySelector('.emergency-text');
        const emergencyBtn = this.elements.emergencySection?.querySelector('.emergency-luxury-cta');

        if (emergencyIcon) {
            setTimeout(() => {
                emergencyIcon.style.transform = 'scale(1.1) rotate(5deg)';
                setTimeout(() => {
                    emergencyIcon.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            }, 200);
        }

        if (emergencyText) {
            setTimeout(() => {
                emergencyText.style.opacity = '1';
                emergencyText.style.transform = 'translateX(0)';
            }, 400);
        }

        if (emergencyBtn) {
            setTimeout(() => {
                emergencyBtn.style.opacity = '1';
                emergencyBtn.style.transform = 'translateX(0)';
            }, 600);
        }
    }

    // NEW: Initialize map features
    initializeMapFeatures() {
        if (this.elements.mapIframe) {
            this.setupMapInteractions();
            this.optimizeMapPerformance();
        }
    }

    setupMapInteractions() {
        // Add hover effects to map container
        if (this.elements.mapContainer) {
            this.elements.mapContainer.addEventListener('mouseenter', () => {
                this.onMapHover();
            });
            
            this.elements.mapContainer.addEventListener('mouseleave', () => {
                this.onMapLeave();
            });
        }

        // Add click tracking to map
        if (this.elements.mapIframe) {
            this.elements.mapIframe.addEventListener('load', () => {
                this.onMapLoaded();
            });
        }
    }

    onMapHover() {
        if (this.elements.googleMapFrame) {
            this.elements.googleMapFrame.style.filter = 'grayscale(0) contrast(1.2) saturate(1.1)';
        }
        
        if (this.elements.mapOverlay) {
            this.elements.mapOverlay.style.background = 'linear-gradient(135deg, rgba(255, 140, 0, 0.98) 0%, rgba(255, 165, 0, 0.95) 100%)';
        }
    }

    onMapLeave() {
        if (this.elements.googleMapFrame) {
            this.elements.googleMapFrame.style.filter = 'grayscale(0.2) contrast(1.1) saturate(0.9)';
        }
        
        if (this.elements.mapOverlay) {
            this.elements.mapOverlay.style.background = 'linear-gradient(135deg, rgba(255, 140, 0, 0.95) 0%, rgba(255, 165, 0, 0.9) 100%)';
        }
    }

    onMapLoaded() {
        console.log('✅ Google Maps iframe loaded successfully');
        this.trackEvent('map_loaded', 'contact', 'google_maps_iframe');
    }

    optimizeMapPerformance() {
        // Lazy load map improvements
        if (this.elements.mapIframe) {
            this.elements.mapIframe.loading = 'lazy';
            
            // Add loading state
            const loadingOverlay = document.createElement('div');
            loadingOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 248, 240, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
                transition: opacity 0.5s ease;
            `;
            
            loadingOverlay.innerHTML = `
                <div style="text-align: center; color: #FF8C00;">
                    <div class="loading-spinner" style="
                        width: 32px;
                        height: 32px;
                        border: 3px solid rgba(255, 140, 0, 0.2);
                        border-top: 3px solid #FF8C00;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 12px;
                    "></div>
                    <p style="font-size: 14px; font-weight: 500;">Loading map...</p>
                </div>
            `;
            
            if (this.elements.googleMapFrame) {
                this.elements.googleMapFrame.style.position = 'relative';
                this.elements.googleMapFrame.appendChild(loadingOverlay);
                
                this.elements.mapIframe.addEventListener('load', () => {
                    setTimeout(() => {
                        loadingOverlay.style.opacity = '0';
                        setTimeout(() => {
                            if (loadingOverlay.parentNode) {
                                loadingOverlay.parentNode.removeChild(loadingOverlay);
                            }
                        }, 500);
                    }, 1000);
                });
            }
        }
    }

    bindInteractions() {
        // NEW: Enhanced directions button
        if (this.elements.directionsBtn) {
            this.elements.directionsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDirections();
            });
            
            this.elements.directionsBtn.addEventListener('mouseenter', () => {
                this.triggerButtonShine(this.elements.directionsBtn);
            });
        }

        // NEW: Street view button
        if (this.elements.streetViewBtn) {
            this.elements.streetViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleStreetView();
            });
        }

        // Method action buttons
        this.elements.methodActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                this.handleMethodAction(action, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                this.addRippleEffect(btn);
            });
        });

        // Method cards hover effects
        this.elements.methodCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onMethodCardHover(card));
            card.addEventListener('mouseleave', () => this.onMethodCardLeave(card));
            card.addEventListener('click', () => this.onMethodCardClick(card));
        });

        // Social media links
        this.elements.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleSocialClick(e, link);
            });
            
            link.addEventListener('mouseenter', () => {
                this.animateSocialHover(link);
            });
        });

        // Treatment highlights
        this.elements.highlightItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.animateHighlightHover(item);
            });
        });

        // Emergency contact button
        if (this.elements.emergencyBtn) {
            this.elements.emergencyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleEmergencyCall();
            });
            
            this.elements.emergencyBtn.addEventListener('mouseenter', () => {
                this.activateEmergencyGlow();
            });
        }

        // Location card interactions
        if (this.elements.locationCard) {
            this.elements.locationCard.addEventListener('mouseenter', () => {
                this.animateLocationCardHover();
            });
        }

        // Credential pills
        this.elements.credentialPills.forEach(pill => {
            pill.addEventListener('mouseenter', () => {
                this.animateCredentialHover(pill);
            });
            
            pill.addEventListener('click', () => {
                this.handleCredentialClick(pill);
            });
        });
    }

    // NEW: Enhanced map interactions
    handleDirections() {
        const address = '65 West 36th Street, 10th Floor, New York, NY 10018';
        const encodedAddress = encodeURIComponent(address);
        
        this.addClickFeedback(this.elements.directionsBtn);
        this.showDirectionsFeedback();
        
        // Detect device and open appropriate map
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let mapUrl;
        if (isIOS) {
            mapUrl = `maps://maps.google.com/maps?daddr=${encodedAddress}`;
        } else if (isAndroid) {
            mapUrl = `geo:0,0?q=${encodedAddress}`;
        } else {
            mapUrl = `https://maps.google.com/maps?daddr=${encodedAddress}`;
        }
        
        setTimeout(() => {
            window.open(mapUrl, '_blank', 'noopener,noreferrer');
        }, 300);
        
        this.trackEvent('directions_click', 'contact', 'map_directions');
    }

    handleStreetView() {
        const lat = '40.7506604';
        const lng = '-73.9849654';
        
        this.addClickFeedback(this.elements.streetViewBtn);
        this.showStreetViewFeedback();
        
        const streetViewUrl = `https://maps.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=12,20.09,,0,5`;
        
        setTimeout(() => {
            window.open(streetViewUrl, '_blank', 'noopener,noreferrer');
        }, 300);
        
        this.trackEvent('street_view_click', 'contact', 'map_street_view');
    }

    handleMethodAction(action, button) {
        this.addClickFeedback(button);
        
        switch (action) {
            case 'call':
                this.handlePhoneCall();
                break;
            case 'email':
                this.handleEmailContact();
                break;
            default:
                console.warn('Unknown method action:', action);
        }
    }

    handlePhoneCall() {
        const phoneNumber = '2016394983';
        const telLink = `tel:${phoneNumber}`;
        
        this.showCallingFeedback();
        
        setTimeout(() => {
            window.location.href = telLink;
        }, 300);
        
        this.trackEvent('phone_call', 'contact', 'method_action_button');
    }

    handleEmailContact() {
        const email = 'info@eviaesthetics.com';
        const subject = 'Consultation Request - Evia Aesthetics';
        const body = 'Hello,\n\nI would like to schedule a consultation for aesthetic treatments.\n\nThank you!';
        
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        this.showEmailFeedback();
        
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 300);
        
        this.trackEvent('email_contact', 'contact', 'method_action_button');
    }

    handleEmergencyCall() {
        this.addClickFeedback(this.elements.emergencyBtn);
        this.triggerEmergencyGlow();
        
        const phoneNumber = '2016394983';
        const telLink = `tel:${phoneNumber}`;
        
        this.showEmergencyCallFeedback();
        
        setTimeout(() => {
            window.location.href = telLink;
        }, 400);
        
        this.trackEvent('emergency_call', 'contact', 'urgent_consultation');
    }

    handleSocialClick(event, link) {
        const platform = this.getSocialPlatform(link);
        
        this.addClickFeedback(link);
        this.showSocialFeedback(platform);
        
        // Don't prevent default for social links - let them open normally
        this.trackEvent('social_click', 'contact', platform);
    }

    getSocialPlatform(link) {
        if (link.classList.contains('instagram')) return 'instagram';
        if (link.classList.contains('facebook')) return 'facebook';
        if (link.href.includes('instagram.com')) return 'instagram';
        if (link.href.includes('facebook.com')) return 'facebook';
        return 'social';
    }

    onMethodCardHover(card) {
        const iconFrame = card.querySelector('.method-icon-frame');
        const actionBtn = card.querySelector('.method-action-btn');
        
        if (iconFrame) {
            iconFrame.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        if (actionBtn) {
            actionBtn.style.transform = 'scale(1.1)';
            this.addRippleEffect(actionBtn);
        }
        
        card.style.boxShadow = '0 12px 48px rgba(255, 140, 0, 0.15)';
    }

    onMethodCardLeave(card) {
        const iconFrame = card.querySelector('.method-icon-frame');
        const actionBtn = card.querySelector('.method-action-btn');
        
        if (iconFrame) {
            iconFrame.style.transform = 'scale(1) rotate(0deg)';
        }
        
        if (actionBtn) {
            actionBtn.style.transform = 'scale(1)';
        }
        
        card.style.boxShadow = '';
    }

    onMethodCardClick(card) {
        this.addRippleEffectToCard(card);
        
        const actionBtn = card.querySelector('.method-action-btn');
        if (actionBtn) {
            actionBtn.click();
        }
    }

    animateSocialHover(link) {
        const iconFrame = link.querySelector('.social-icon-frame');
        const arrow = link.querySelector('.social-arrow');
        
        if (iconFrame) {
            iconFrame.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        if (arrow) {
            arrow.style.transform = 'translateX(4px)';
            arrow.style.color = '#FF8C00';
        }
    }

    animateHighlightHover(item) {
        const icon = item.querySelector('.highlight-icon');
        
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.background = 'rgba(255, 140, 0, 0.2)';
        }
        
        item.style.background = 'rgba(255, 140, 0, 0.08)';
        item.style.borderColor = 'rgba(255, 140, 0, 0.3)';
        
        setTimeout(() => {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.background = 'rgba(255, 140, 0, 0.1)';
            }
            item.style.background = 'rgba(255, 248, 240, 0.6)';
            item.style.borderColor = 'rgba(255, 140, 0, 0.1)';
        }, 1000);
    }

    animateLocationCardHover() {
        const frameCorners = this.elements.locationCard.querySelectorAll('.frame-corner');
        const headerIcon = this.elements.locationCard.querySelector('.header-icon-frame');
        
        frameCorners.forEach(corner => {
            corner.style.opacity = '1';
            corner.style.transform = 'scale(1.1)';
        });
        
        if (headerIcon) {
            headerIcon.style.transform = 'scale(1.08) rotate(5deg)';
        }
    }

    animateCredentialHover(pill) {
        pill.style.transform = 'translateY(-4px) scale(1.05)';
        pill.style.boxShadow = '0 8px 32px rgba(255, 140, 0, 0.3)';
        pill.style.borderColor = 'rgba(255, 140, 0, 0.4)';
        
        setTimeout(() => {
            pill.style.transform = 'translateY(0) scale(1)';
            pill.style.boxShadow = '';
            pill.style.borderColor = 'rgba(255, 140, 0, 0.2)';
        }, 1000);
    }

    handleCredentialClick(pill) {
        this.addClickFeedback(pill);
        
        const credentialText = pill.textContent.trim();
        this.showCredentialFeedback(credentialText);
        
        this.trackEvent('credential_click', 'contact', credentialText);
    }

    activateEmergencyGlow() {
        const glow = this.elements.emergencyBtn.querySelector('.cta-glow');
        if (glow) {
            glow.style.opacity = '1';
        }
    }

    triggerEmergencyGlow() {
        const glow = this.elements.emergencyBtn.querySelector('.cta-glow');
        if (glow) {
            glow.style.opacity = '1';
            setTimeout(() => {
                glow.style.opacity = '0';
            }, 1500);
        }
    }

    // Form handling methods
    initializeElfsightForm() {
        this.showFormLoading();
        this.waitForElfsightWidget();
        
        // Timeout fallback
        setTimeout(() => {
            if (!this.formLoaded) {
                this.handleFormLoadFailure();
            }
        }, 12000);
    }

    showFormLoading() {
        if (this.elements.formLoading) {
            this.elements.formLoading.style.display = 'flex';
        }
        if (this.elements.elfsightForm) {
            this.elements.elfsightForm.style.opacity = '0';
        }
    }

    hideFormLoading() {
        if (this.elements.formLoading) {
            this.elements.formLoading.style.opacity = '0';
            setTimeout(() => {
                this.elements.formLoading.style.display = 'none';
            }, 300);
        }
        
        if (this.elements.elfsightForm) {
            this.elements.elfsightForm.classList.add('loaded');
            this.elements.elfsightForm.style.opacity = '1';
        }
    }

    waitForElfsightWidget() {
        let checkCount = 0;
        const maxChecks = 24;
        
        const checkWidget = () => {
            checkCount++;
            
            if (this.elements.elfsightWidget) {
                const hasContent = this.elements.elfsightWidget.children.length > 0 || 
                                 this.elements.elfsightWidget.innerHTML.trim() !== '';
                
                if (hasContent) {
                    this.onFormLoaded();
                    return;
                }
            }
            
            // Check for iframe (widget loaded)
            const iframe = document.querySelector('.elfsight-app-db15691a-379c-4773-8900-983e7e393d0f iframe');
            if (iframe) {
                this.onFormLoaded();
                return;
            }
            
            if (checkCount < maxChecks) {
                setTimeout(checkWidget, 500);
            } else {
                this.handleFormLoadFailure();
            }
        };
        
        setTimeout(checkWidget, 1000);
    }

    onFormLoaded() {
        if (this.formLoaded) return;
        
        this.formLoaded = true;
        this.hideFormLoading();
        
        setTimeout(() => {
            this.styleElfsightWidget();
        }, 500);
        
        console.log('✅ Elfsight contact form loaded');
    }

    handleFormLoadFailure() {
        console.warn('⚠️ Elfsight form failed to load, showing fallback');
        
        if (this.elements.formLoading) {
            this.elements.formLoading.innerHTML = `
                <div class="form-fallback">
                    <div class="fallback-icon">
                        <i class="ri-phone-line"></i>
                    </div>
                    <h4>Contact Form Unavailable</h4>
                    <p>Please call us directly to schedule your consultation</p>
                    <div class="fallback-actions">
                        <button class="fallback-call-btn" onclick="window.location.href='tel:2016394983'">
                            <i class="ri-phone-line"></i>
                            <span>Call (201) 639-4983</span>
                        </button>
                        <button class="fallback-email-btn" onclick="window.location.href='mailto:info@eviaesthetics.com'">
                            <i class="ri-mail-line"></i>
                            <span>Send Email</span>
                        </button>
                    </div>
                </div>
            `;
        }
    }

    styleElfsightWidget() {
        const widget = this.elements.elfsightWidget;
        if (widget) {
            widget.style.borderRadius = '16px';
            widget.style.overflow = 'hidden';
            widget.style.border = 'none';
        }
        
        const iframe = widget?.querySelector('iframe');
        if (iframe) {
            iframe.style.borderRadius = '16px';
            iframe.style.border = 'none';
        }
    }

    // Effect methods
    addClickFeedback(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0.98)';
        element.style.transition = 'transform 0.15s ease-out';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 150);
    }

    addRippleEffect(element) {
        const ripple = element.querySelector('.btn-ripple');
        if (ripple) {
            element.classList.add('ripple-active');
            setTimeout(() => {
                element.classList.remove('ripple-active');
            }, 600);
        }
    }

    addRippleEffectToCard(card) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: rgba(255, 140, 0, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
            pointer-events: none;
            transition: all 0.6s ease-out;
            z-index: 10;
        `;
        
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(6)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    triggerButtonShine(button) {
        const shine = button.querySelector('.btn-shine');
        if (shine) {
            shine.style.left = '-100%';
            shine.style.transition = 'none';
            shine.offsetHeight; // Force reflow
            shine.style.transition = 'left 0.8s ease';
            shine.style.left = '100%';
        }
    }

    // NEW: Enhanced feedback methods
    showDirectionsFeedback() {
        this.showLuxuryFeedback(
            'Opening directions...',
            'rgba(34, 197, 94, 0.95)',
            'ri-map-pin-line'
        );
    }

    showStreetViewFeedback() {
        this.showLuxuryFeedback(
            'Opening street view...',
            'rgba(59, 130, 246, 0.95)',
            'ri-street-view-line'
        );
    }

    showCallingFeedback() {
        this.showLuxuryFeedback(
            'Connecting your call...',
            'rgba(16, 185, 129, 0.95)',
            'ri-phone-line'
        );
    }

    showEmailFeedback() {
        this.showLuxuryFeedback(
            'Opening email client...',
            'rgba(59, 130, 246, 0.95)',
            'ri-mail-line'
        );
    }

    showEmergencyCallFeedback() {
        this.showLuxuryFeedback(
            'Connecting urgent consultation...',
            'rgba(220, 38, 38, 0.95)',
            'ri-phone-fill'
        );
    }

    showSocialFeedback(platform) {
        const platformNames = {
            instagram: 'Instagram',
            facebook: 'Facebook'
        };
        
        const icons = {
            instagram: 'ri-instagram-line',
            facebook: 'ri-facebook-line'
        };
        
        this.showLuxuryFeedback(
            `Opening ${platformNames[platform] || 'social media'}...`,
            'rgba(139, 92, 246, 0.95)',
            icons[platform] || 'ri-external-link-line'
        );
    }

    showCredentialFeedback(credential) {
        this.showLuxuryFeedback(
            `${credential} - Excellence in care`,
            'rgba(255, 140, 0, 0.95)',
            'ri-award-line'
        );
    }

    showLuxuryFeedback(message, backgroundColor, iconClass, duration = 2500) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${backgroundColor};
            color: white;
            padding: 20px 32px;
            border-radius: 24px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 15px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(30px);
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.15),
                0 8px 32px ${backgroundColor.replace('0.95', '0.3')};
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 350px;
            text-align: center;
            border: 2px solid rgba(255, 255, 255, 0.2);
            min-width: 280px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="${iconClass}" style="font-size: 18px;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
            }, 600);
        }, duration);
    }

    // Ambient effects
    setupFloatingCredentials() {
        this.elements.credentialPills.forEach((pill, index) => {
            const delay = index * 3000;
            setTimeout(() => {
                this.startCredentialFloat(pill);
            }, delay);
        });
    }

    startCredentialFloat(pill) {
        let offset = Math.random() * Math.PI * 2;
        
        const animate = () => {
            offset += 0.01;
            const yOffset = Math.sin(offset) * 3;
            pill.style.transform = `translateY(${yOffset}px)`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    initializeAmbientEffects() {
        // Start floating icon animations
        this.elements.floatingIcons.forEach((icon, index) => {
            this.startFloatingIconAnimation(icon, index);
        });
        
        // Start ambient orb animations
        this.elements.ambientOrbs.forEach(orb => {
            orb.style.animationPlayState = 'running';
        });
    }

    startFloatingIconAnimation(icon, index) {
        let offset = index * Math.PI / 2;
        
        const animate = () => {
            offset += 0.005;
            const x = Math.sin(offset) * 10;
            const y = Math.cos(offset * 0.8) * 8;
            const rotation = Math.sin(offset) * 5;
            
            icon.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Analytics
    trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: 1
            });
        }
        
        console.log(`📊 Contact Event: ${action} - ${category} - ${label}`);
    }

    // Responsive handling
    onResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Optimize for mobile
            this.elements.floatingIcons.forEach(icon => {
                icon.style.display = 'none';
            });
        } else {
            // Restore desktop features
            this.elements.floatingIcons.forEach(icon => {
                icon.style.display = 'flex';
            });
        }
    }

    // Utility methods
    isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Public API
    refresh() {
        this.formLoaded = false;
        this.initializeElfsightForm();
    }

    getFormStatus() {
        return {
            loaded: this.formLoaded,
            widget: !!this.elements.elfsightWidget
        };
    }

    getMapStatus() {
        return {
            container: !!this.elements.mapContainer,
            iframe: !!this.elements.mapIframe,
            loaded: this.elements.mapIframe?.complete || false
        };
    }

    destroy() {
        // Clean up observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // Remove event listeners by cloning elements
        if (this.elements.directionsBtn) {
            this.elements.directionsBtn.replaceWith(this.elements.directionsBtn.cloneNode(true));
        }
        
        if (this.elements.streetViewBtn) {
            this.elements.streetViewBtn.replaceWith(this.elements.streetViewBtn.cloneNode(true));
        }
        
        if (this.elements.emergencyBtn) {
            this.elements.emergencyBtn.replaceWith(this.elements.emergencyBtn.cloneNode(true));
        }
        
        this.elements.methodActionBtns.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        this.isInitialized = false;
        console.log('🗑️ Hermès Contact Section destroyed');
    }
}

// Initialize the contact section
document.addEventListener('DOMContentLoaded', () => {
    const hermesContact = new HermesLuxuryContactSection();
    
    // Make it globally available
    window.hermesContact = hermesContact;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        hermesContact.onResize();
    });
});

// Enhanced CSS for form fallback and loading spinner
const enhancedFallbackCSS = `
    .form-fallback {
        text-align: center;
        padding: 40px 20px;
        background: rgba(255, 248, 240, 0.9);
        border-radius: 20px;
        border: 2px solid rgba(255, 140, 0, 0.1);
    }
    
    .form-fallback .fallback-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        color: white;
        font-size: 24px;
    }
    
    .form-fallback h4 {
        font-family: 'Playfair Display', serif;
        font-size: 24px;
        font-weight: 600;
        color: #1F2937;
        margin-bottom: 12px;
    }
    
    .form-fallback p {
        font-size: 16px;
        color: #6B7280;
        margin-bottom: 24px;
        line-height: 1.5;
    }
    
    .fallback-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .fallback-call-btn,
    .fallback-email-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 24px;
        border: none;
        border-radius: 50px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
    }
    
    .fallback-call-btn {
        background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
        color: white;
    }
    
    .fallback-email-btn {
        background: rgba(255, 140, 0, 0.1);
        color: #FF8C00;
        border: 2px solid rgba(255, 140, 0, 0.3);
    }
    
    .fallback-call-btn:hover,
    .fallback-email-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 140, 0, 0.3);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 480px) {
        .fallback-actions {
            flex-direction: column;
            align-items: center;
        }
        
        .fallback-call-btn,
        .fallback-email-btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
        }
    }
`;

// Inject enhanced fallback CSS
if (!document.querySelector('#hermes-contact-enhanced-css')) {
    const style = document.createElement('style');
    style.id = 'hermes-contact-enhanced-css';
    style.textContent = enhancedFallbackCSS;
    document.head.appendChild(style);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HermesLuxuryContactSection;
}

/* ========================================
   FLOATING BUTTONS SECTION
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
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => this.handleScroll());
                this.ticking = true;
            }
        }, { passive: true });
        
        if (this.callBtn) {
            this.callBtn.addEventListener('click', (e) => this.handleCallClick(e));
            this.callBtn.addEventListener('mouseenter', () => this.addRippleEffect(this.callBtn));
        }
        
        if (this.topBtn) {
            this.topBtn.addEventListener('click', (e) => this.handleTopClick(e));
            this.topBtn.addEventListener('mouseenter', () => this.addRippleEffect(this.topBtn));
        }
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.showButtons();
            }, 2000);
        });
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldShowTop = scrollY > this.scrollThreshold;
        
        if (shouldShowTop && !this.topBtn.classList.contains('show')) {
            this.showTopButton();
        } else if (!shouldShowTop && this.topBtn.classList.contains('show')) {
            this.hideTopButton();
        }
        
        this.lastScrollY = scrollY;
        this.ticking = false;
    }
    
    showButtonsWithDelay() {
        setTimeout(() => {
            this.showCallButton();
        }, 3000);
        
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
            
            setTimeout(() => {
                this.addBounceEffect(this.callBtn);
            }, 800);
        }
    }
    
    showTopButton() {
        if (this.topBtn && !this.topBtn.classList.contains('show')) {
            this.topBtn.style.animation = 'fab-entrance 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
            this.topBtn.classList.add('show');
            
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
        
        this.triggerRipple(this.callBtn, e);
        this.addClickFeedback(this.callBtn);
        
        const phoneNumber = '2016394983';
        const telLink = `tel:${phoneNumber}`;
        
        this.showCallingFeedback();
        
        window.location.href = telLink;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                event_category: 'engagement',
                event_label: 'floating_call_button'
            });
        }
    }
    
    handleTopClick(e) {
        e.preventDefault();
        
        this.triggerRipple(this.topBtn, e);
        this.addClickFeedback(this.topBtn);
        
        this.scrollToTop();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_to_top', {
                event_category: 'navigation',
                event_label: 'floating_top_button'
            });
        }
    }
    
    scrollToTop() {
        const startPosition = window.pageYOffset;
        const startTime = performance.now();
        const duration = 1200;
        
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
                this.onScrollComplete();
            }
        };
        
        requestAnimationFrame(scroll);
    }
    
    onScrollComplete() {
        this.addSuccessFeedback(this.topBtn);
        
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
        button.offsetHeight;
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
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
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
    }
}

/* ========================================
   ADDITIONAL CSS INJECTION
   ======================================== */

function injectFallbackStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .widget-fallback {
            text-align: center;
            padding: 40px 20px;
            color: #6B5B47;
        }
        
        .widget-fallback .fallback-icon {
            margin-bottom: 16px;
        }
        
        .widget-fallback h4 {
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            font-weight: 600;
            color: #1D1D1F;
            margin-bottom: 8px;
        }
        
        .widget-fallback p {
            font-size: 14px;
            margin-bottom: 20px;
        }
        
        .widget-fallback .fallback-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #E1306C 0%, #833AB4 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .redesigned-reviews-section .widget-fallback .fallback-link {
            background: linear-gradient(135deg, #4285F4 0%, #34A853 100%);
        }
        
        .widget-fallback .fallback-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .animations-paused * {
            animation-play-state: paused !important;
        }
        
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
        
        @keyframes arrow-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }
        
        @keyframes cardFloat {
            0%, 100% {
                transform: translateY(-8px) scale(1.02);
            }
            50% {
                transform: translateY(-12px) scale(1.02);
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .carousel-track.dragging {
            cursor: grabbing;
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   APPLICATION INITIALIZATION
   ======================================== */

let app;

function initializeApp() {
    try {
        app = new EviaLuxuryApp();
        window.app = app;
        
        console.log('🎭 Evia Luxury Application initialized successfully');
        
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

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
    injectFallbackStyles();
    initializeApp();
});

// Window load events
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.warn('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Global utility functions
window.showFloatingButtons = () => {
    const floatingButtons = app?.getComponent('floatingButtons');
    if (floatingButtons) {
        floatingButtons.show();
    }
};

window.hideFloatingButtons = () => {
    const floatingButtons = app?.getComponent('floatingButtons');
    if (floatingButtons) {
        floatingButtons.hide();
    }
};

window.toggleFloatingButtons = () => {
    const floatingButtons = app?.getComponent('floatingButtons');
    if (floatingButtons) {
        floatingButtons.toggle();
    }
};

// Visibility change handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is hidden
        document.body.classList.add('animations-paused');
    } else {
        // Resume animations when tab is visible
        document.body.classList.remove('animations-paused');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        EviaLuxuryApp, 
        EviaUtils, 
        EnhancedServicesCarousel,
        HermesAboutSection,
        ModernTransformationsGallery,
        RedesignedSocialSections,
        HermesProductsCollection,
        HermesLuxuryContactSection,
        LuxuryFloatingButtons,
        CinematicHero,
        EviaConfig
    };
}

/* ========================================
   EVIA AESTHETICS - END OF FILE
   ======================================== */
