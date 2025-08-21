/* ========================================
   EVIA AESTHETICS - COMPLETE LUXURY EXPERIENCE
   ORGANIZED JAVASCRIPT WITH SIGNATURE ANIMATION
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
            { name: 'LuxuryProductsSection', class: LuxuryMedSpaProducts },
            { name: 'contactSection', class: LuxuryContactSection },
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
   PRELOADER
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
   HEADER
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
   MOBILE MENU
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
   HERO
   ======================================== */

/* ========================================
   HERO SECTION WITH SIMPLE SIGNATURE ANIMATION
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
        
        // Show wrapper
        this.signatureWrapper.classList.add('signature-active');
        
        // Animate signature line
        setTimeout(() => {
            if (this.signatureLine) {
                this.signatureLine.classList.add('traced');
            }
        }, 400);
        
        // Animate credentials
        setTimeout(() => {
            if (this.signatureCredentials) {
                this.signatureCredentials.classList.add('traced');
            }
        }, 800);
        
        // Animate underline
        setTimeout(() => {
            if (this.signatureUnderline) {
                this.signatureUnderline.classList.add('traced');
            }
        }, 1200);
        
        console.log('✨ Simple signature animation completed');
    }
    
    onHover() {
        if (!this.signatureContainer || this.isAnimating) return;
        
        // Add subtle glow effect
        this.signatureContainer.style.boxShadow = `
            0 12px 40px rgba(0, 0, 0, 0.08),
            0 6px 20px rgba(255, 140, 0, 0.15),
            0 0 20px rgba(255, 140, 0, 0.1)
        `;
        
        // Reset after hover
        setTimeout(() => {
            if (this.signatureContainer) {
                this.signatureContainer.style.boxShadow = '';
            }
        }, 1000);
    }
    
    onClick() {
        if (this.isAnimating) return;
        
        // Click feedback
        if (this.signatureContainer) {
            this.signatureContainer.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.signatureContainer.style.transform = '';
            }, 200);
        }
        
        // Navigate to contact
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 150);
        
        // Track click
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
        
        // Reset classes
        if (this.signatureLine) this.signatureLine.classList.remove('traced');
        if (this.signatureCredentials) this.signatureCredentials.classList.remove('traced');
        if (this.signatureUnderline) this.signatureUnderline.classList.remove('traced');
        if (this.signatureWrapper) this.signatureWrapper.classList.remove('signature-active');
        
        // Restart animation
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
    
    // Updated signature animation initialization
    initSignatureAnimation() {
        if (window.innerWidth > 1024) {
            this.signatureAnimation = new SimpleHermesSignature();
        }
    }
    
    // Updated signature animation start method
    startSignatureAnimation() {
        if (this.signatureAnimation && !this.hasAnimatedSignature) {
            this.signatureAnimation.start();
            this.hasAnimatedSignature = true;
            return;
        }
        
        // Fallback for any other signature elements
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
   SERVICES
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
        
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isDragging = false;
        this.isHorizontalScroll = false;
        this.touchThreshold = 15;
        this.hasUserInteracted = false;
        
        this.resizeTimeout = null;
        this.scrollTimeout = null;
        
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
        
        console.log('✨ Enhanced Services Carousel initialized');
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
        
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.onResize();
            }, 250);
        });
        
        if (this.isMobile) {
            this.bindMobileTouchEvents();
        }
    }
    
    bindMobileTouchEvents() {
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.isDragging = false;
            this.isHorizontalScroll = false;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!e.touches[0]) return;
            
            const touchCurrentX = e.touches[0].clientX;
            const touchCurrentY = e.touches[0].clientY;
            const diffX = Math.abs(touchCurrentX - this.touchStartX);
            const diffY = Math.abs(touchCurrentY - this.touchStartY);
            
            if (!this.isDragging && (diffX > this.touchThreshold || diffY > this.touchThreshold)) {
                this.isDragging = true;
                
                if (diffX > diffY && diffX > this.touchThreshold) {
                    this.isHorizontalScroll = true;
                    this.track.classList.add('scrolling-horizontal');
                    e.preventDefault();
                } else {
                    this.isHorizontalScroll = false;
                    this.track.classList.remove('scrolling-horizontal');
                }
            }
            
            if (this.isDragging && this.isHorizontalScroll) {
                e.preventDefault();
            }
        }, { passive: false });
        
        this.track.addEventListener('touchend', (e) => {
            if (!e.changedTouches[0]) return;
            
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            
            if (this.isDragging && this.isHorizontalScroll) {
                this.handleTouchEnd();
                this.handleUserInteraction();
            }
            
            this.isDragging = false;
            this.isHorizontalScroll = false;
            this.track.classList.remove('scrolling-horizontal');
        }, { passive: true });
        
        this.track.addEventListener('scroll', this.throttle(() => {
            this.updateMobileProgress();
        }, 16), { passive: true });
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
    
    setupMobileScrolling() {
        this.track.style.scrollBehavior = 'smooth';
        this.track.style.overflowX = 'auto';
        this.track.style.scrollSnapType = 'x mandatory';
        
        this.updateMobileProgress();
    }
    
    handleTouchEnd() {
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = Math.abs(this.touchStartY - this.touchEndY);
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold && Math.abs(diffX) > diffY) {
            if (diffX > 0) {
                this.scrollToNextCard();
            } else {
                this.scrollToPreviousCard();
            }
        }
    }
    
    scrollToNextCard() {
        const cards = this.track.querySelectorAll('.service-card');
        const currentScroll = this.track.scrollLeft;
        const cardWidth = cards[0]?.offsetWidth || 300;
        const gap = parseInt(window.getComputedStyle(this.track).gap) || 16;
        
        const nextScroll = currentScroll + cardWidth + gap;
        this.track.scrollTo({
            left: nextScroll,
            behavior: 'smooth'
        });
    }
    
    scrollToPreviousCard() {
        const cards = this.track.querySelectorAll('.service-card');
        const currentScroll = this.track.scrollLeft;
        const cardWidth = cards[0]?.offsetWidth || 300;
        const gap = parseInt(window.getComputedStyle(this.track).gap) || 16;
        
        const prevScroll = Math.max(0, currentScroll - cardWidth - gap);
        this.track.scrollTo({
            left: prevScroll,
            behavior: 'smooth'
        });
    }
    
    updateMobileProgress() {
        if (!this.isMobile) return;
        
        const scrollLeft = this.track.scrollLeft;
        const maxScroll = this.track.scrollWidth - this.track.clientWidth;
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
        
        const cardWidth = this.track.querySelector('.service-card')?.offsetWidth || 300;
        const gap = parseInt(window.getComputedStyle(this.track).gap) || 16;
        const currentSlideIndex = Math.round(scrollLeft / (cardWidth + gap));
        
        if (this.currentSlide) {
            this.currentSlide.textContent = Math.min(this.totalCards, Math.max(1, currentSlideIndex + 1));
        }
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
    
    addRippleEffect(button) {
        const ripple = button.querySelector('.cta-ripple');
        if (!ripple) return;
        
        button.classList.add('ripple-active');
        
        setTimeout(() => {
            button.classList.remove('ripple-active');
        }, 600);
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
    
    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
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
        
        card.addEventListener('mousemove', (e) => {
            this.handleCardTilt(card, e);
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
        }
        
        if (this.isDesktop) {
            this.createDots();
        }
        
        if (this.isMobile) {
            this.bindMobileTouchEvents();
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
        
        window.removeEventListener('resize', this.onResize);
        
        console.log('🗑️ Enhanced Services Carousel destroyed');
    }
}

/* ========================================
   ABOUT
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
        // Learn More Button
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLearnMoreClick();
            });
            
            this.learnMoreBtn.addEventListener('mouseenter', () => {
                this.addButtonShine(this.learnMoreBtn);
            });
        }
        
        // Consultation Button
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
        
        // Special animations for specific elements
        if (element.classList.contains('hermes-content-layout')) {
            this.animateContentLayout(element);
        } else if (element.classList.contains('hermes-certifications-section')) {
            this.animateCertifications(element);
        }
    }
    
    animateContentLayout(layout) {
        const profileCard = layout.querySelector('.hermes-doctor-profile');
        const contentCards = layout.querySelectorAll('.hermes-philosophy-card, .hermes-expertise-showcase, .hermes-cta-section');
        
        // Animate profile card first
        if (profileCard) {
            setTimeout(() => {
                profileCard.style.transform = 'translateY(0)';
                profileCard.style.opacity = '1';
            }, 200);
        }
        
        // Then animate content cards
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
        
        // Add loading animation
        this.showLoadingFeedback('Loading about page...');
        
        // Navigate to about.html after a brief delay
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
        
        // Add spinning animation to icon
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
        
        // Remove event listeners by cloning nodes
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

// Spin animation for loading icons
const spinKeyframes = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Add the animation to the document
if (!document.querySelector('#hermes-spin-animation')) {
    const style = document.createElement('style');
    style.id = 'hermes-spin-animation';
    style.textContent = spinKeyframes;
    document.head.appendChild(style);
}

// Integration with existing app structure
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.hermes-about-section')) {
        const hermesAboutSection = new HermesAboutSection();
        window.HermesAboutSection = hermesAboutSection;
        console.log('🚀 Hermès About Section ready');
    }
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (window.HermesAboutSection) {
        if (document.hidden) {
            document.querySelector('.hermes-about-section')?.style.setProperty('animation-play-state', 'paused');
        } else {
            document.querySelector('.hermes-about-section')?.style.setProperty('animation-play-state', 'running');
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.HermesAboutSection) {
        window.HermesAboutSection.onResize();
    }
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HermesAboutSection };
}

/* ========================================
   TRANSFORMATIONS
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
   PRODUCTS
   ======================================== */

class LuxuryMedSpaProducts {
    constructor() {
        this.section = document.querySelector('.luxury-medspa-products');
        this.header = document.querySelector('.luxury-products-header');
        this.showcase = document.querySelector('.luxury-products-showcase');
        this.cta = document.querySelector('.luxury-collection-cta');
        this.productCards = document.querySelectorAll('.luxury-product-card');
        this.productCTAs = document.querySelectorAll('.luxury-product-cta');
        this.catalogButton = document.getElementById('luxuryCatalogBtn');
        this.partnershipEmblem = document.querySelector('.partnership-emblem');
        
        this.isInitialized = false;
        this.observers = new Map();
        this.animationQueue = [];
        this.isVisible = false;
        
        if (this.section) {
            this.init();
        }
    }
    
    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupScrollRevealSystem();
            this.bindProductInteractions();
            this.bindCTAEvents();
            this.initializeAnimations();
            this.setupPerformanceOptimizations();
            this.initializeLuxuryEffects();
            
            this.isInitialized = true;
            console.log('✨ Luxury MedSpa Products Section initialized');
        } catch (error) {
            console.error('❌ Error initializing Luxury Products section:', error);
        }
    }
    
    /* ========================================
       SCROLL REVEAL SYSTEM
       ======================================== */
    
    setupScrollRevealSystem() {
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
        
        // Elements to reveal
        const revealElements = [
            this.header,
            this.showcase,
            this.cta
        ].filter(Boolean);
        
        revealElements.forEach(element => {
            if (element.hasAttribute('data-products-reveal')) {
                revealObserver.observe(element);
            }
        });
        
        this.observers.set('reveal', revealObserver);
        
        // Main section visibility observer
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
    }
    
    revealElement(element) {
        element.classList.add('revealed');
        
        // Special animations for specific elements
        if (element.classList.contains('luxury-products-showcase')) {
            this.animateProductCards();
        } else if (element.classList.contains('luxury-collection-cta')) {
            this.animateCollectionCTA();
        }
    }
    
    animateProductCards() {
        this.productCards.forEach((card, index) => {
            setTimeout(() => {
                this.addCardEntranceEffect(card);
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    addCardEntranceEffect(card) {
        // Animate product showcase elements
        const showcase = card.querySelector('.product-showcase');
        const productImage = card.querySelector('.product-image');
        const rating = card.querySelector('.luxury-product-rating');
        const information = card.querySelector('.product-information');
        
        if (showcase) {
            setTimeout(() => {
                showcase.style.transform = 'translateY(0)';
                showcase.style.opacity = '1';
            }, 100);
        }
        
        if (productImage) {
            setTimeout(() => {
                productImage.style.transform = 'scale(1) translateY(0)';
                productImage.style.opacity = '1';
            }, 200);
        }
        
        if (rating) {
            setTimeout(() => {
                rating.style.opacity = '1';
                rating.style.transform = 'translateY(0) scale(1)';
            }, 300);
        }
        
        if (information) {
            const infoElements = information.children;
            Array.from(infoElements).forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 400 + (index * 100));
            });
        }
    }
    
    animateCollectionCTA() {
        const ornaments = this.cta.querySelectorAll('.ornament-medallion');
        ornaments.forEach((ornament, index) => {
            setTimeout(() => {
                ornament.style.transform = 'scale(1.1) rotate(180deg)';
                setTimeout(() => {
                    ornament.style.transform = 'scale(1) rotate(360deg)';
                }, 300);
            }, index * 200);
        });
    }
    
    /* ========================================
       PRODUCT INTERACTIONS
       ======================================== */
    
    bindProductInteractions() {
        this.productCards.forEach(card => {
            this.setupCardInteractions(card);
            this.setupCardTiltEffect(card);
        });
        
        // Partnership emblem interaction
        if (this.partnershipEmblem) {
            this.setupPartnershipEmblemInteraction();
        }
    }
    
    setupCardInteractions(card) {
        const productImage = card.querySelector('.product-image');
        const excellence_badge = card.querySelector('.product-excellence-badge');
        const features = card.querySelectorAll('.feature-capsule');
        const rating = card.querySelector('.luxury-product-rating');
        
        card.addEventListener('mouseenter', () => {
            this.onCardHover(card, productImage, excellence_badge, features, rating);
        });
        
        card.addEventListener('mouseleave', () => {
            this.onCardLeave(card, productImage, excellence_badge, features, rating);
        });
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.luxury-product-cta')) {
                this.handleCardClick(card, e);
            }
        });
        
        // Feature capsule interactions
        features.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                this.addFeatureGlow(feature);
            });
        });
        
        // Excellence badge interaction
        if (excellence_badge) {
            excellence_badge.addEventListener('mouseenter', () => {
                this.triggerBadgeShine(excellence_badge);
            });
        }
    }
    
    onCardHover(card, productImage, badge, features, rating) {
        // Enhanced hover animations
        if (productImage) {
            productImage.style.transform = 'scale(1.08) translateY(-12px) rotateY(8deg)';
        }
        
        if (badge) {
            this.triggerBadgeShine(badge);
        }
        
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateY(-2px) scale(1.02)';
                feature.style.borderColor = 'rgba(255, 140, 0, 0.3)';
                feature.style.background = 'rgba(255, 140, 0, 0.1)';
            }, index * 50);
        });
        
        if (rating) {
            rating.style.transform = 'scale(1.05)';
            rating.style.boxShadow = '0 6px 20px rgba(255, 140, 0, 0.15)';
        }
        
        this.activateCardAmbientEffects(card);
    }
    
    onCardLeave(card, productImage, badge, features, rating) {
        if (productImage) {
            productImage.style.transform = 'scale(1) translateY(0) rotateY(0)';
        }
        
        features.forEach(feature => {
            feature.style.transform = 'translateY(0) scale(1)';
            feature.style.borderColor = 'rgba(255, 140, 0, 0.1)';
            feature.style.background = 'rgba(255, 248, 240, 0.8)';
        });
        
        if (rating) {
            rating.style.transform = 'scale(1)';
            rating.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
        }
    }
    
    setupCardTiltEffect(card) {
        if (this.isMobile()) return;
        
        card.addEventListener('mousemove', (e) => {
            this.handleCardTilt(card, e);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-16px) scale(1.02) rotateX(0) rotateY(0)';
        });
    }
    
    handleCardTilt(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;
        
        card.style.transform = `translateY(-16px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    handleCardClick(card, event) {
        this.createLuxuryRippleEffect(card, event);
        
        const productName = card.querySelector('.product-title')?.textContent;
        if (productName) {
            this.showProductInteractionFeedback(productName);
        }
        
        // Premium click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        this.trackProductCardClick(productName);
    }
    
    /* ========================================
       CTA EVENTS & INTERACTIONS
       ======================================== */
    
    bindCTAEvents() {
        // Product CTAs
        this.productCTAs.forEach(cta => {
            cta.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleProductCTA(cta);
            });
            
            cta.addEventListener('mouseenter', () => {
                this.addCTALuxuryEffect(cta);
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
    
    handleProductCTA(cta) {
        const productCard = cta.closest('.luxury-product-card');
        const productName = productCard.querySelector('.product-title')?.textContent || 'Product';
        const productUrl = cta.getAttribute('data-url') || 'https://us.alumiermd.com/products?code=54T7P4HH';
        
        // Premium click animation with enhanced feedback
        cta.style.transform = 'translateY(-2px) scale(0.98)';
        this.triggerCTAShimmer(cta);
        
        setTimeout(() => {
            cta.style.transform = '';
        }, 150);
        
        this.showProductCTAFeedback(productName);
        
        setTimeout(() => {
            window.open(productUrl, '_blank', 'noopener,noreferrer');
        }, 400);
        
        this.trackProductCTAClick(productName);
    }
    
    handleCatalogClick() {
        this.catalogButton.style.transform = 'translateY(-6px) scale(0.98)';
        this.triggerCatalogShimmer();
        
        setTimeout(() => {
            this.catalogButton.style.transform = '';
        }, 150);
        
        this.showCatalogLoadingFeedback();
        
        setTimeout(() => {
            window.open('https://us.alumiermd.com/products?code=54T7P4HH', '_blank', 'noopener,noreferrer');
        }, 400);
        
        this.trackCatalogClick();
    }
    
    /* ========================================
       LUXURY EFFECTS & ANIMATIONS
       ======================================== */
    
    initializeLuxuryEffects() {
        // Initialize floating molecules
        this.startMoleculeAnimation();
        
        // Initialize ambient orb effects
        this.startAmbientEffects();
        
        // Initialize partnership emblem glow
        this.initializePartnershipGlow();
    }
    
    setupPartnershipEmblemInteraction() {
        const emblem = this.partnershipEmblem.querySelector('.emblem-frame');
        const seal = this.partnershipEmblem.querySelector('.partnership-seal');
        
        emblem.addEventListener('mouseenter', () => {
            this.activatePartnershipGlow();
        });
        
        emblem.addEventListener('click', () => {
            this.handlePartnershipClick();
        });
    }
    
    activatePartnershipGlow() {
        const glow = this.partnershipEmblem.querySelector('.emblem-glow');
        const seal = this.partnershipEmblem.querySelector('.partnership-seal');
        
        if (glow) {
            glow.style.opacity = '1';
        }
        
        if (seal) {
            seal.style.transform = 'scale(1.08) rotate(5deg)';
        }
    }
    
    handlePartnershipClick() {
        const emblem = this.partnershipEmblem.querySelector('.emblem-frame');
        
        emblem.style.transform = 'translateY(-8px) scale(1.02) rotate(2deg)';
        
        setTimeout(() => {
            emblem.style.transform = '';
        }, 200);
        
        this.showPartnershipFeedback();
        this.trackPartnershipClick();
    }
    
    activateCardAmbientEffects(card) {
        const ambientGlow = card.querySelector('.card-ambient-glow');
        const imageAura = card.querySelector('.image-aura');
        const platformReflection = card.querySelector('.platform-reflection');
        
        if (ambientGlow) {
            ambientGlow.style.opacity = '1';
        }
        
        if (imageAura) {
            imageAura.style.opacity = '1';
        }
        
        if (platformReflection) {
            platformReflection.style.opacity = '1';
        }
    }
    
    triggerBadgeShine(badge) {
        const shine = badge.querySelector('.badge-shine');
        if (shine) {
            shine.style.left = '-100%';
            shine.style.transition = 'none';
            shine.offsetHeight; // Force reflow
            shine.style.transition = 'left 0.8s ease';
            shine.style.left = '100%';
        }
    }
    
    triggerCTAShimmer(cta) {
        const shimmer = cta.querySelector('.cta-luxury-shimmer');
        if (shimmer) {
            shimmer.style.left = '-100%';
            shimmer.style.transition = 'none';
            shimmer.offsetHeight; // Force reflow
            shimmer.style.transition = 'left 1s ease';
            shimmer.style.left = '100%';
        }
    }
    
    triggerCatalogShimmer() {
        const shimmer = this.catalogButton.querySelector('.catalog-luxury-shimmer');
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
    
    addCTALuxuryEffect(cta) {
        this.triggerCTAShimmer(cta);
        
        const background = cta.querySelector('.cta-background');
        if (background) {
            background.style.opacity = '0.1';
            setTimeout(() => {
                background.style.opacity = '';
            }, 600);
        }
    }
    
    addCatalogHoverEffect() {
        this.triggerCatalogShimmer();
        
        const ornaments = this.cta.querySelectorAll('.ornament-medallion');
        ornaments.forEach(ornament => {
            ornament.style.transform = 'scale(1.1) rotate(180deg)';
            setTimeout(() => {
                ornament.style.transform = '';
            }, 600);
        });
    }
    
    /* ========================================
       RIPPLE & FEEDBACK EFFECTS
       ======================================== */
    
    createLuxuryRippleEffect(element, event) {
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
    
    showProductInteractionFeedback(productName) {
        const feedback = this.createLuxuryFeedbackElement(
            `Viewing ${productName}`,
            'rgba(139, 92, 246, 0.95)',
            'ri-eye-line'
        );
        
        this.displayLuxuryFeedback(feedback, 2000);
    }
    
    showProductCTAFeedback(productName) {
        const feedback = this.createLuxuryFeedbackElement(
            `Opening ${productName} details...`,
            'rgba(255, 140, 0, 0.95)',
            'ri-external-link-line'
        );
        
        this.displayLuxuryFeedback(feedback, 2500);
    }
    
    showCatalogLoadingFeedback() {
        const feedback = this.createLuxuryFeedbackElement(
            'Opening AlumierMD catalog...',
            'rgba(16, 185, 129, 0.95)',
            'ri-shopping-bag-line'
        );
        
        this.displayLuxuryFeedback(feedback, 3000);
    }
    
    showPartnershipFeedback() {
        const feedback = this.createLuxuryFeedbackElement(
            'Exclusive AlumierMD Partnership',
            'rgba(255, 140, 0, 0.95)',
            'ri-award-line'
        );
        
        this.displayLuxuryFeedback(feedback, 2500);
    }
    
    createLuxuryFeedbackElement(message, backgroundColor, iconClass) {
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
        
        return feedback;
    }
    
    displayLuxuryFeedback(feedback, duration = 2500) {
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
    
    /* ========================================
       PERFORMANCE & OPTIMIZATION
       ======================================== */
    
    setupPerformanceOptimizations() {
        // Add GPU acceleration to animated elements
        const animatedElements = this.section.querySelectorAll(
            '.luxury-product-card, .product-image, .card-ambient-glow, .luxury-product-cta'
        );
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, box-shadow, opacity';
            element.style.backfaceVisibility = 'hidden';
            element.style.transform = 'translateZ(0)';
        });
        
        // Intersection observer for performance
        this.setupPerformanceObserver();
    }
    
    setupPerformanceObserver() {
        const performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                if (entry.isIntersecting) {
                    this.enableCardAnimations(card);
                } else {
                    this.disableCardAnimations(card);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px 50px 0px'
        });
        
        this.productCards.forEach(card => {
            performanceObserver.observe(card);
        });
        
        this.observers.set('performance', performanceObserver);
    }
    
    enableCardAnimations(card) {
        card.style.willChange = 'transform, box-shadow';
    }
    
    disableCardAnimations(card) {
        card.style.willChange = 'auto';
    }
    
    /* ========================================
       ANIMATION SYSTEMS
       ======================================== */
    
    initializeAnimations() {
        // Initialize card entrance animations
        this.productCards.forEach((card, index) => {
            this.prepareCardForAnimation(card, index);
        });
        
        // Initialize CTA animations
        if (this.cta) {
            this.prepareCTAForAnimation();
        }
    }
    
    prepareCardForAnimation(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(80px)';
        card.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
        
        // Prepare child elements
        const showcase = card.querySelector('.product-showcase');
        const productImage = card.querySelector('.product-image');
        const rating = card.querySelector('.luxury-product-rating');
        const information = card.querySelector('.product-information');
        
        if (showcase) {
            showcase.style.opacity = '0';
            showcase.style.transform = 'translateY(40px)';
            showcase.style.transition = 'all 0.6s ease';
        }
        
        if (productImage) {
            productImage.style.opacity = '0';
            productImage.style.transform = 'scale(0.8) translateY(20px)';
            productImage.style.transition = 'all 0.8s ease';
        }
        
        if (rating) {
            rating.style.opacity = '0';
            rating.style.transform = 'translateY(20px) scale(0.9)';
            rating.style.transition = 'all 0.6s ease';
        }
        
        if (information) {
            Array.from(information.children).forEach((element, childIndex) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = `all 0.5s ease ${childIndex * 0.1}s`;
            });
        }
    }
    
    prepareCTAForAnimation() {
        this.cta.style.opacity = '0';
        this.cta.style.transform = 'translateY(80px)';
        this.cta.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s';
    }
    
    startMoleculeAnimation() {
        const molecules = this.section.querySelectorAll('.molecule');
        
        molecules.forEach((molecule, index) => {
            this.animateMolecule(molecule, index);
        });
    }
    
    animateMolecule(molecule, index) {
        const delay = index * 5000; // Stagger molecules
        
        setTimeout(() => {
            if (this.isVisible) {
                molecule.style.animationPlayState = 'running';
            }
        }, delay);
    }
    
    startAmbientEffects() {
        const orbs = this.section.querySelectorAll('.ambient-orb');
        
        orbs.forEach(orb => {
            orb.style.animationPlayState = 'running';
        });
    }
    
    initializePartnershipGlow() {
        const seal = this.section.querySelector('.partnership-seal');
        
        if (seal) {
            // Start the rotating border animation
            const beforeElement = seal.querySelector('::before');
            if (beforeElement) {
                beforeElement.style.animationPlayState = 'running';
            }
        }
    }
    
    onSectionVisible() {
        // Start ambient animations when section becomes visible
        this.startAmbientEffects();
        this.startMoleculeAnimation();
    }
    
    /* ========================================
       TRACKING & ANALYTICS
       ======================================== */
    
    trackProductCardClick(productName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'luxury_product_card_click', {
                event_category: 'products',
                event_label: productName,
                value: 1
            });
        }
        
        console.log(`📊 Luxury Product card clicked: ${productName}`);
    }
    
    trackProductCTAClick(productName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'luxury_product_cta_click', {
                event_category: 'products',
                event_label: productName,
                value: 1
            });
        }
        
        console.log(`📊 Luxury Product CTA clicked: ${productName}`);
    }
    
    trackCatalogClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'luxury_catalog_view', {
                event_category: 'products',
                event_label: 'alumiermd_full_catalog',
                value: 1
            });
        }
        
        console.log('📊 Luxury Catalog opened');
    }
    
    trackPartnershipClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'partnership_emblem_click', {
                event_category: 'engagement',
                event_label: 'alumiermd_partnership',
                value: 1
            });
        }
        
        console.log('📊 Partnership emblem clicked');
    }
    
    /* ========================================
       UTILITY METHODS
       ======================================== */
    
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
        // Disable complex animations on mobile
        this.productCards.forEach(card => {
            card.style.willChange = 'auto';
            card.removeEventListener('mousemove', this.handleCardTilt);
        });
    }
    
    optimizeForDesktop() {
        // Re-enable full animations on desktop
        this.productCards.forEach(card => {
            card.style.willChange = 'transform, box-shadow';
        });
        
        // Re-setup tilt effects
        this.productCards.forEach(card => {
            this.setupCardTiltEffect(card);
        });
    }
    
    pause() {
        // Pause all animations
        const orbs = this.section.querySelectorAll('.ambient-orb');
        const molecules = this.section.querySelectorAll('.molecule');
        
        orbs.forEach(orb => {
            orb.style.animationPlayState = 'paused';
        });
        
        molecules.forEach(molecule => {
            molecule.style.animationPlayState = 'paused';
        });
    }
    
    play() {
        // Resume all animations
        const orbs = this.section.querySelectorAll('.ambient-orb');
        const molecules = this.section.querySelectorAll('.molecule');
        
        orbs.forEach(orb => {
            orb.style.animationPlayState = 'running';
        });
        
        molecules.forEach(molecule => {
            molecule.style.animationPlayState = 'running';
        });
    }
    
    refresh() {
        this.destroy();
        this.init();
    }
    
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // Remove event listeners by cloning elements
        this.productCards.forEach(card => {
            card.replaceWith(card.cloneNode(true));
        });
        
        if (this.catalogButton) {
            this.catalogButton.replaceWith(this.catalogButton.cloneNode(true));
        }
        
        this.isInitialized = false;
        
        console.log('🗑️ Luxury MedSpa Products Section destroyed');
    }
}

/* ========================================
   INITIALIZATION & INTEGRATION
   ======================================== */

// Initialize the Luxury MedSpa Products section
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.luxury-medspa-products')) {
        const luxuryProductsSection = new LuxuryMedSpaProducts();
        window.LuxuryMedSpaProducts = luxuryProductsSection;
        console.log('🚀 Luxury MedSpa Products Section ready');
    }
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (window.LuxuryMedSpaProducts) {
        if (document.hidden) {
            window.LuxuryMedSpaProducts.pause();
        } else {
            window.LuxuryMedSpaProducts.play();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.LuxuryMedSpaProducts) {
        window.LuxuryMedSpaProducts.onResize();
    }
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LuxuryMedSpaProducts };
}

/* ========================================
   CONTACT
   ======================================== */

class LuxuryContactSection {
    constructor() {
        this.isInitialized = false;
        this.formLoaded = false;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
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
            this.handleElfsightForm();
            
            this.isInitialized = true;
            console.log('✨ Luxury Contact Section initialized');
        } catch (error) {
            console.error('❌ Error initializing contact section:', error);
        }
    }
    
    initializeElements() {
        this.elements = {
            section: document.querySelector('.luxury-contact-section'),
            viewMapBtn: document.querySelector('.view-map-btn'),
            callBtns: document.querySelectorAll('.call-btn, .method-action[data-action="call"], .emergency-cta'),
            emailBtns: document.querySelectorAll('.email-btn, .method-action[data-action="email"]'),
            methodCards: document.querySelectorAll('.method-card'),
            socialLinks: document.querySelectorAll('.social-link'),
            formLoading: document.getElementById('formLoading'),
            elfsightForm: document.getElementById('elfsightForm')
        };
        
        if (!this.elements.section) {
            throw new Error('Contact section not found');
        }
    }
    
    bindEvents() {
        if (this.elements.viewMapBtn) {
            this.elements.viewMapBtn.addEventListener('click', () => this.openMap());
        }
        
        this.elements.callBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCall(e));
        });
        
        this.elements.emailBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleEmail(e));
        });
        
        this.elements.methodCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onMethodCardHover(card));
            card.addEventListener('mouseleave', () => this.onMethodCardLeave(card));
        });
        
        this.elements.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSocialClick(e, link));
        });
    }
    
    handleElfsightForm() {
        this.showFormLoading();
        this.waitForElfsight();
        
        setTimeout(() => {
            if (!this.formLoaded) {
                this.onFormLoadTimeout();
            }
        }, 10000);
    }
    
    waitForElfsight() {
        const checkElfsight = () => {
            if (window.ElfsightInstagram || document.querySelector('.elfsight-app-db15691a-379c-4773-8900-983e7e393d0f iframe')) {
                this.onFormLoaded();
                return;
            }
            
            const widgetContainer = document.querySelector('.elfsight-app-db15691a-379c-4773-8900-983e7e393d0f');
            if (widgetContainer && (widgetContainer.children.length > 0 || widgetContainer.innerHTML.trim() !== '')) {
                setTimeout(() => this.onFormLoaded(), 1000);
                return;
            }
            
            setTimeout(checkElfsight, 500);
        };
        
        setTimeout(checkElfsight, 1000);
    }
    
    onFormLoaded() {
        if (this.formLoaded) return;
        
        this.formLoaded = true;
        this.hideFormLoading();
        
        setTimeout(() => {
            this.styleElfsightForm();
        }, 500);
    }
    
    onFormLoadTimeout() {
        this.showFormFallback();
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
            this.elements.elfsightForm.style.opacity = '1';
        }
    }
    
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
    
    styleElfsightForm() {
        const formIframe = document.querySelector('.elfsight-app-db15691a-379c-4773-8900-983e7e393d0f iframe');
        if (formIframe) {
            formIframe.style.borderRadius = '20px';
            formIframe.style.border = '1px solid rgba(255, 140, 0, 0.1)';
            formIframe.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        }
    }
    
    openMap() {
        const address = '65 W 36th St, 10th Floor, New York, NY 10018';
        const encodedAddress = encodeURIComponent(address);
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        let mapUrl;
        if (isIOS) {
            mapUrl = `maps://maps.google.com/maps?q=${encodedAddress}`;
        } else {
            mapUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
        }
        
        this.addClickFeedback(this.elements.viewMapBtn);
        
        setTimeout(() => {
            window.open(mapUrl, '_blank');
        }, 150);
        
        this.trackEvent('map_view', 'contact', 'location_click');
    }
    
    handleCall(event) {
        event.preventDefault();
        
        const phoneNumber = '2016394983';
        const telLink = `tel:${phoneNumber}`;
        
        this.addClickFeedback(event.currentTarget);
        this.showCallingFeedback();
        
        setTimeout(() => {
            window.location.href = telLink;
        }, 300);
        
        this.trackEvent('phone_call', 'contact', 'call_button_click');
    }
    
    handleEmail(event) {
        event.preventDefault();
        
        const email = 'info@eviaesthetics.com';
        const subject = 'Consultation Request - Eviaesthetics';
        const body = 'Hello,\n\nI would like to schedule a consultation for aesthetic treatments.\n\nThank you!';
        
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        this.addClickFeedback(event.currentTarget);
        
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 150);
        
        this.trackEvent('email_click', 'contact', 'email_button_click');
    }
    
    handleSocialClick(event, link) {
        const platform = link.classList.contains('instagram') ? 'instagram' : 
                        link.classList.contains('facebook') ? 'facebook' : 'unknown';
        
        this.addClickFeedback(link);
        this.trackEvent('social_click', 'contact', platform);
    }
    
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
    
    addClickFeedback(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease-out';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 150);
    }
    
    showCallingFeedback() {
        const feedback = document.createElement('div');
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
        
        requestAnimationFrame(() => {
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
            }, 300);
        }, 2500);
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
}

/* ========================================
   FLOATING BUTTONS
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
   APPLICATION INITIALIZATION
   ======================================== */

let app;

document.addEventListener('DOMContentLoaded', () => {
    const additionalCSS = `
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
        
        @keyframes premiumModalEntrance {
            0% {
                opacity: 0;
                transform: scale(0.9) translateY(20px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes premiumModalExit {
            0% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(0.9) translateY(20px);
            }
        }
        
        .carousel-track.dragging {
            cursor: grabbing;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = additionalCSS;
    document.head.appendChild(style);
});

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.warn('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

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

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.hermes-products-section')) {
        const hermesProductsSection = new HermesLuxuryProductsSection();
        window.HermesLuxuryProductsSection = hermesProductsSection;
        console.log('🚀 Hermès Luxury Products Section ready');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.premium-about-redesign')) {
        const premiumAboutSection = new PremiumAboutSection();
        window.PremiumAboutSection = premiumAboutSection;
        console.log('🚀 Premium About Section ready');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const servicesCarousel = new EnhancedServicesCarousel();
    window.servicesCarousel = servicesCarousel;
    console.log('🚀 Enhanced Services Carousel ready');
});

document.addEventListener('visibilitychange', () => {
    if (window.servicesCarousel) {
        if (document.hidden) {
            window.servicesCarousel.pause();
        } else if (!window.servicesCarousel.hasUserInteracted) {
            setTimeout(() => {
                window.servicesCarousel.play();
            }, 1000);
        }
    }
});

document.addEventListener('visibilitychange', () => {
    if (window.LuxuryMedSpaProducts) {
        if (document.hidden) {
            document.querySelector('.premium-about-redesign')?.style.setProperty('animation-play-state', 'paused');
        } else {
            document.querySelector('.premium-about-redesign')?.style.setProperty('animation-play-state', 'running');
        }
    }
});

document.addEventListener('visibilitychange', () => {
    if (window.LuxuryMedSpaProducts) {
        if (document.hidden) {
            document.querySelector('.hermes-products-section')?.style.setProperty('animation-play-state', 'paused');
        } else {
            document.querySelector('.hermes-products-section')?.style.setProperty('animation-play-state', 'running');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.PremiumAboutSection) {
        window.PremiumAboutSection.onResize();
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        EviaLuxuryApp, 
        EviaUtils, 
        EnhancedServicesCarousel,
        PremiumAboutSection,
        LuxuryMedSpa,
        ModernSignatureAnimation,
        CinematicHero,
        EviaConfig
    };
}
