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
            { name: 'preloader', class: CornerPreloader },
            { name: 'header', class: EnhancedLuxuryHeader },
            { name: 'mobileMenu', class: UltraLuxuryMobileMenu },
            { name: 'hero', class: CinematicHero },
            { name: 'servicesCarousel', class: EnhancedServicesCarousel },
            { name: 'about', class: HermesAboutSection },
            { name: 'resultsGallery', class: ResultsShowcaseGallery },
            { name: 'instagramReviews', class: RedesignedSocialSections },
            { name: 'LuxuryProductsSection', class: EnhancedProductsCarousel },
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

class CornerPreloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.isMobile = window.innerWidth <= 768;
        this.minDisplayTime = 1500; // 1.5 seconds minimum
        this.startTime = Date.now();
        this.fadeOutStarted = false;
        
        if (this.preloader) {
            this.init();
        }
    }
    
    init() {
        console.log(`🚀 Starting corner preloader`);
        
        // Start animations
        this.startAnimations();
        
        // Monitor load state
        this.checkReadyState();
        
        // Force cleanup after maximum time
        setTimeout(() => {
            if (!this.fadeOutStarted) {
                console.log('⏰ Maximum time reached, hiding preloader');
                this.fadeOut();
            }
        }, 3000);
    }
    
    startAnimations() {
        const logo = this.preloader.querySelector('.preloader-logo');
        const progressFill = this.preloader.querySelector('.progress-fill');
        
        // Add logo hover effects for desktop
        if (logo && !this.isMobile) {
            logo.addEventListener('mouseenter', () => {
                logo.style.transform = 'scale(1.05) rotate(180deg)';
                logo.style.transition = 'transform 0.3s ease';
            });
            
            logo.addEventListener('mouseleave', () => {
                logo.style.transform = 'scale(1)';
                logo.style.transition = 'transform 3s linear';
            });
        }
        
        // Start progress bar
        if (progressFill) {
            setTimeout(() => {
                progressFill.style.animation = 'progressBarFill 2s ease-out forwards';
            }, 100);
        }
    }
    
    checkReadyState() {
        const checkInterval = setInterval(() => {
            const timeElapsed = Date.now() - this.startTime;
            const timeReady = timeElapsed >= this.minDisplayTime;
            const pageReady = document.readyState === 'complete';
            
            if (timeReady && pageReady && !this.fadeOutStarted) {
                clearInterval(checkInterval);
                this.fadeOut();
            }
        }, 100);
    }
    
    async fadeOut() {
        if (this.fadeOutStarted) return;
        
        this.fadeOutStarted = true;
        console.log('👋 Hiding corner preloader');
        
        // Add fade out class
        this.preloader.classList.add('fade-out');
        
        // Wait for transition
        await this.wait(600);
        
        // Remove from DOM
        this.preloader.remove();
        
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        
        console.log('✅ Corner preloader removed');
    }
    
    // Utility method
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize corner preloader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cornerPreloader = new CornerPreloader();
});

// Handle page load
window.addEventListener('load', () => {
    console.log('📄 Page fully loaded');
});

// Handle preloader complete event
window.addEventListener('preloaderComplete', () => {
    console.log('🎉 Corner preloader completed');
});

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
   SERVICES SECTION - FIXED MOBILE FUNCTIONALITY
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
        
        // Simplified touch handling properties
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchCurrentX = 0;
        this.touchCurrentY = 0;
        this.isDragging = false;
        this.hasUserInteracted = false;
        this.swipeThreshold = 80; // Increased threshold for more deliberate swipes
        this.touchStartTime = 0;
        this.maxTouchTime = 300; // Reduced time for quicker response
        
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
        
        console.log('✨ Enhanced Services Carousel initialized with improved mobile handling');
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
        
        // Simplified mobile touch events
        if (this.isMobile) {
            this.bindSimplifiedTouchEvents();
        }
    }
    
    bindSimplifiedTouchEvents() {
        // Use passive listeners for better performance
        this.track.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        }, { passive: true }); // Keep passive to not interfere with scrolling
        
        this.track.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        }, { passive: true });
        
        // Track scroll events for progress indication
        this.track.addEventListener('scroll', this.throttle(() => {
            this.updateMobileProgress();
        }, 16), { passive: true });
    }
    
    handleTouchStart(e) {
        if (!e.touches[0]) return;
        
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchCurrentX = this.touchStartX;
        this.touchCurrentY = this.touchStartY;
        this.touchStartTime = Date.now();
        this.isDragging = false;
    }
    
    handleTouchMove(e) {
        if (!e.touches[0]) return;
        
        this.touchCurrentX = e.touches[0].clientX;
        this.touchCurrentY = e.touches[0].clientY;
        
        // Only start tracking after significant movement
        const deltaX = Math.abs(this.touchCurrentX - this.touchStartX);
        const deltaY = Math.abs(this.touchCurrentY - this.touchStartY);
        
        if (!this.isDragging && (deltaX > 10 || deltaY > 10)) {
            this.isDragging = true;
        }
    }
    
    handleTouchEnd(e) {
        if (!e.changedTouches[0] || !this.isDragging) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchDuration = Date.now() - this.touchStartTime;
        
        const deltaX = this.touchStartX - touchEndX;
        const deltaY = Math.abs(this.touchStartY - touchEndY);
        
        // Only process clear horizontal swipes that are fast and deliberate
        if (touchDuration < this.maxTouchTime &&
            Math.abs(deltaX) > this.swipeThreshold &&
            Math.abs(deltaX) > deltaY * 2) { // Ensure horizontal dominance
            
            this.handleSwipeGesture(deltaX);
            this.handleUserInteraction();
        }
        
        // Reset state
        this.resetTouchState();
    }
    
    resetTouchState() {
        this.isDragging = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchCurrentX = 0;
        this.touchCurrentY = 0;
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
        // Simple mobile scroll setup
        this.track.style.scrollBehavior = 'smooth';
        this.track.style.overflowX = 'auto';
        this.track.style.overflowY = 'visible';
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
            this.bindSimplifiedTouchEvents();
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

// Initialize the carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const servicesCarousel = new EnhancedServicesCarousel();
    
    // Make it globally accessible if needed
    window.servicesCarousel = servicesCarousel;
});

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
   RESULTS SHOWCASE SECTION - FIXED VERSION
   ======================================== */

class ResultsShowcaseGallery {
    constructor() {
        this.gallery = document.querySelector('.results-showcase');
        this.filterButtons = document.querySelectorAll('.results-showcase__filter');
        this.resultItems = document.querySelectorAll('.results-showcase__item');
        this.comparisonContainers = document.querySelectorAll('.results-showcase__comparison');
        this.ctaButton = document.getElementById('resultsCtaBtn');
        this.activeFilter = 'all';
        this.isInitialized = false;

        if (this.gallery) {
            this.init();
        }
    }

    init() {
        if (this.isInitialized) return;
        
        try {
            this.initImageComparisons();
            this.initFilterSystem();
            this.initCTAButton();
            this.initIntersectionObserver();
            this.initResponsiveHandling();
            
            this.isInitialized = true;
            console.log('✨ Results Showcase Gallery initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Results Showcase:', error);
        }
    }

    initImageComparisons() {
        this.comparisonContainers.forEach(container => {
            this.setupImageComparison(container);
        });
    }

    setupImageComparison(container) {
        const afterImage = container.querySelector('.results-showcase__image--after');
        const sliderHandle = container.querySelector('.results-showcase__slider-handle');
        const slider = container.querySelector('.results-showcase__slider');
        
        if (!afterImage || !sliderHandle || !slider) {
            console.warn('Missing comparison elements in container:', container);
            return;
        }

        let isDragging = false;
        let currentPosition = 50; // Start at 50%

        // Initialize the comparison
        this.updateImageReveal(afterImage, slider, currentPosition);

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
                this.updateImageReveal(afterImage, slider, percentage);
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
                this.updateImageReveal(afterImage, slider, percentage);
            };

            const handleTouchEnd = () => {
                isDragging = false;
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        });

        // Click anywhere on comparison to move slider
        container.addEventListener('click', (e) => {
            if (e.target.closest('.results-showcase__slider-handle')) return;
            
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            currentPosition = percentage;
            
            this.animateImageReveal(afterImage, slider, percentage);
        });

        // Desktop hover effects
        if (!this.isMobile()) {
            container.addEventListener('mouseenter', () => {
                if (!isDragging) {
                    this.startAutoDemo(afterImage, slider, currentPosition);
                }
            });

            container.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    this.resetToCenter(afterImage, slider);
                    currentPosition = 50;
                }
            });
        }
    }

    updateImageReveal(afterImage, slider, percentage) {
        if (afterImage) {
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        }
        if (slider) {
            slider.style.left = `${percentage}%`;
        }
    }

    animateImageReveal(afterImage, slider, targetPercentage) {
        const currentPercentage = parseFloat(slider.style.left) || 50;
        const duration = 600;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            const currentValue = currentPercentage + (targetPercentage - currentPercentage) * easedProgress;

            this.updateImageReveal(afterImage, slider, currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    startAutoDemo(afterImage, slider, currentPosition) {
        const targetPosition = currentPosition > 50 ? 20 : 80;
        this.animateImageReveal(afterImage, slider, targetPosition);
    }

    resetToCenter(afterImage, slider) {
        this.animateImageReveal(afterImage, slider, 50);
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
                this.trackFilterClick(filter);
            });
        });
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        this.filterButtons.forEach(btn => {
            btn.classList.remove('results-showcase__filter--active');
        });

        const activeButton = document.querySelector(`[data-filter="${filter}"]`);
        if (activeButton) {
            activeButton.classList.add('results-showcase__filter--active');
        }
    }

    filterResults(filter) {
        this.resultItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                // Show with staggered animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.pointerEvents = 'auto';
                    item.setAttribute('data-hidden', 'false');
                }, index * 100);
            } else {
                // Hide immediately
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.pointerEvents = 'none';
                item.setAttribute('data-hidden', 'true');
            }
        });

        // Update grid layout after filtering
        setTimeout(() => {
            this.updateGridLayout();
        }, 500);
    }

    updateGridLayout() {
        const visibleItems = Array.from(this.resultItems).filter(item => 
            item.getAttribute('data-hidden') !== 'true'
        );

        // Add staggered reveal animation to visible items
        visibleItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 50}ms`;
        });

        // Reset transition delays after animation
        setTimeout(() => {
            visibleItems.forEach(item => {
                item.style.transitionDelay = '';
            });
        }, visibleItems.length * 50 + 500);
    }

    initCTAButton() {
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick();
            });

            this.ctaButton.addEventListener('mouseenter', () => {
                this.addButtonShine(this.ctaButton);
            });
        }
    }

    handleCTAClick() {
        // Add click feedback
        this.ctaButton.style.transform = 'translateY(-2px) scale(0.98)';
        
        setTimeout(() => {
            this.ctaButton.style.transform = '';
        }, 150);

        // Show booking feedback
        this.showBookingFeedback();

        // Scroll to contact section
        setTimeout(() => {
            this.scrollToContact();
        }, 300);

        // Track the event
        this.trackEvent('results_cta_click', 'results', 'consultation_booking');
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

    addButtonShine(button) {
        if (this.isMobile()) return;
        
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
            border-radius: inherit;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(shine);
        
        requestAnimationFrame(() => {
            shine.style.left = '100%';
        });
        
        setTimeout(() => {
            if (shine.parentNode) {
                shine.parentNode.removeChild(shine);
            }
        }, 600);
    }

    showBookingFeedback() {
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
            max-width: 350px;
            text-align: center;
            border: 2px solid rgba(255, 255, 255, 0.2);
            min-width: 280px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="ri-calendar-check-line" style="font-size: 18px;"></i>
            <span>Redirecting to consultation booking...</span>
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
                    
                    // Special handling for different elements
                    if (entry.target.classList.contains('results-showcase__header')) {
                        this.animateHeader(entry.target);
                    } else if (entry.target.classList.contains('results-showcase__filters')) {
                        this.animateFilters(entry.target);
                    } else if (entry.target.classList.contains('results-showcase__grid')) {
                        this.animateGrid(entry.target);
                    } else if (entry.target.classList.contains('results-showcase__cta')) {
                        this.animateCTA(entry.target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe main sections
        const elementsToObserve = [
            this.gallery.querySelector('.results-showcase__header'),
            this.gallery.querySelector('.results-showcase__filters'),
            this.gallery.querySelector('.results-showcase__grid'),
            this.gallery.querySelector('.results-showcase__cta')
        ].filter(Boolean);

        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    }

    animateHeader(header) {
        const elements = header.querySelectorAll('.results-showcase__badge, .results-showcase__title, .results-showcase__subtitle');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateFilters(filters) {
        const filterButtons = filters.querySelectorAll('.results-showcase__filter');
        filterButtons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateGrid(grid) {
        const items = grid.querySelectorAll('.results-showcase__item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    animateCTA(cta) {
        const elements = cta.querySelectorAll('.results-showcase__cta-title, .results-showcase__cta-text, .results-showcase__cta-button');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    initResponsiveHandling() {
        this.handleResize();
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    handleResize() {
        // Re-initialize comparison sliders on resize
        this.comparisonContainers.forEach(container => {
            const afterImage = container.querySelector('.results-showcase__image--after');
            const slider = container.querySelector('.results-showcase__slider');
            if (afterImage && slider) {
                this.updateImageReveal(afterImage, slider, 50);
            }
        });
    }

    // Utility methods
    isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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

    trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: 1
            });
        }
        
        console.log(`📊 Results Event: ${action} - ${category} - ${label}`);
    }

    trackFilterClick(filter) {
        this.trackEvent('filter_click', 'results', filter);
    }

    // Public API methods
    refresh() {
        this.isInitialized = false;
        this.init();
    }

    getActiveFilter() {
        return this.activeFilter;
    }

    setFilter(filter) {
        this.setActiveFilter(filter);
        this.filterResults(filter);
    }

    destroy() {
        // Clean up event listeners
        this.filterButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        if (this.ctaButton) {
            this.ctaButton.replaceWith(this.ctaButton.cloneNode(true));
        }

        this.comparisonContainers.forEach(container => {
            container.replaceWith(container.cloneNode(true));
        });

        window.removeEventListener('resize', this.handleResize);
        
        this.isInitialized = false;
        console.log('🗑️ Results Showcase Gallery destroyed');
    }
}

// Initialize the Results Showcase when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const resultsGallery = new ResultsShowcaseGallery();
    
    // Make it globally accessible
    window.resultsGallery = resultsGallery;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResultsShowcaseGallery;
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
   PRODUCTS SECTION - UNIQUE FUNCTIONALITY
   ======================================== */

class EnhancedProductsCarousel {
    constructor() {
        this.carousel = document.getElementById('productsCarousel');
        this.track = document.getElementById('productsCarouselTrack');
        this.prevBtn = document.getElementById('productsPrevBtn');
        this.nextBtn = document.getElementById('productsNextBtn');
        this.dotsContainer = document.getElementById('productsCarouselDots');
        this.autoplayBtn = document.getElementById('productsAutoplayBtn');
        this.catalogBtn = document.getElementById('productsCatalogBtn');
        
        this.progressFill = document.getElementById('productsProgressFill');
        this.currentSlide = document.getElementById('productsCurrentSlide');
        this.totalSlides = document.getElementById('productsTotalSlides');
        this.currentCounter = document.getElementById('productsCurrentCounter');
        this.totalCounter = document.getElementById('productsTotalCounter');
        
        this.modal = document.getElementById('productModal');
        this.modalBody = document.getElementById('productModalBody');
        this.modalClose = document.getElementById('productModalClose');
        this.modalShopBtn = document.getElementById('productModalShopBtn');
        
        this.currentIndex = 0;
        this.totalCards = 0;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDuration = 6000;
        this.isMobile = false;
        this.isDesktop = false;
        this.cardWidth = 0;
        this.gap = 24;
        this.isTransitioning = false;
        
        // Simplified touch handling properties
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchCurrentX = 0;
        this.touchCurrentY = 0;
        this.isDragging = false;
        this.hasUserInteracted = false;
        this.swipeThreshold = 80;
        this.touchStartTime = 0;
        this.maxTouchTime = 300;
        this.currentProductUrl = '';
        
        this.resizeTimeout = null;
        this.scrollTimeout = null;
        
        // Product data
        this.productData = {
            'clear-shield': {
                name: 'Clear Shield SPF 42',
                category: 'Sun Protection',
                image: 'clear.jpg',
                description: 'Lightweight, non-greasy broad spectrum sunscreen with antioxidant protection for daily use.',
                detailedDescription: 'Clear Shield SPF 42 provides superior broad-spectrum protection against UVA and UVB rays while delivering powerful antioxidants to help prevent environmental damage. This lightweight formula absorbs quickly without leaving a white residue, making it perfect for daily use under makeup or alone.',
                features: ['SPF 42 Broad Spectrum Protection', 'Non-comedogenic Formula', 'Antioxidant Rich', 'Water Resistant (40 minutes)', 'Suitable for All Skin Types'],
                benefits: ['Prevents premature aging', 'Protects against UV damage', 'Lightweight, non-greasy feel', 'Perfect base for makeup'],
                keyIngredients: ['Zinc Oxide', 'Titanium Dioxide', 'Vitamin E', 'Green Tea Extract'],
                usage: 'Apply liberally 15 minutes before sun exposure. Reapply every 2 hours or after swimming, sweating, or toweling.',
                rating: '5.0',
                reviews: '128',
                url: 'https://us.alumiermd.com/products?code=54T7P4HH'
            },
            'retinol': {
                name: 'Retinol Resurfacing Serum 0.25',
                category: 'Anti-Aging',
                image: 'retinol.jpg',
                description: 'Advanced retinol formula for skin renewal and anti-aging benefits with gentle effectiveness.',
                detailedDescription: 'This advanced retinol serum contains 0.25% pure retinol in a stabilized delivery system to minimize irritation while maximizing results. Formulated with soothing botanicals and hydrating ingredients to support skin renewal and reduce the appearance of fine lines and wrinkles.',
                features: ['0.25% Pure Retinol', 'Stabilized Delivery System', 'Night Treatment', 'Anti-Aging Formula', 'Gentle on Sensitive Skin'],
                benefits: ['Reduces fine lines and wrinkles', 'Improves skin texture', 'Promotes cellular renewal', 'Enhances skin radiance'],
                keyIngredients: ['Retinol 0.25%', 'Hyaluronic Acid', 'Vitamin E', 'Chamomile Extract'],
                usage: 'Apply 2-3 drops to clean, dry skin in the evening. Start with 2-3 times per week and gradually increase frequency. Always use SPF during the day.',
                rating: '4.9',
                reviews: '94',
                url: 'https://us.alumiermd.com/products?code=54T7P4HH'
            },
            'sheer-hydration': {
                name: 'Sheer Hydration SPF 40',
                category: 'Tinted Moisturizer',
                image: 'sheer.jpeg',
                description: 'Lightweight tinted moisturizer with broad-spectrum sun protection and natural coverage.',
                detailedDescription: 'Sheer Hydration combines the benefits of a moisturizer, sunscreen, and light coverage in one elegant formula. This universally flattering tint provides a natural, healthy glow while delivering broad-spectrum SPF 40 protection and long-lasting hydration.',
                features: ['SPF 40 Protection', 'Universal Tint', 'Hydrating Formula', 'Natural Coverage', 'All-in-One Product'],
                benefits: ['Evens skin tone', 'Provides natural coverage', 'Hydrates all day', 'Protects from UV damage'],
                keyIngredients: ['Zinc Oxide', 'Iron Oxides', 'Hyaluronic Acid', 'Vitamin C'],
                usage: 'Apply evenly to face and neck as the last step in your morning routine. Can be worn alone or under makeup.',
                rating: '4.8',
                reviews: '76',
                url: 'https://us.alumiermd.com/products?code=54T7P4HH'
            },
            'everactive': {
                name: 'EverActive C&E + Peptide',
                category: 'Vitamin C Serum',
                image: 'EverActive.jpeg',
                description: 'Powerful antioxidant serum with vitamin C, E, and peptides for radiant, youthful skin.',
                detailedDescription: 'EverActive C&E + Peptide delivers a potent combination of stable vitamin C, vitamin E, and advanced peptides in a lightweight serum. This powerful antioxidant formula brightens skin, reduces the appearance of dark spots, and supports collagen production for firmer, more youthful-looking skin.',
                features: ['Stable Vitamin C', 'Vitamin E Complex', 'Advanced Peptides', 'Brightening Formula', 'Antioxidant Protection'],
                benefits: ['Brightens complexion', 'Reduces dark spots', 'Supports collagen production', 'Protects against environmental damage'],
                keyIngredients: ['L-Ascorbic Acid', 'Vitamin E', 'Peptide Complex', 'Ferulic Acid'],
                usage: 'Apply 2-3 drops to clean skin in the morning. Follow with sunscreen. Can be used daily.',
                rating: '5.0',
                reviews: '112',
                url: 'https://us.alumiermd.com/products?code=54T7P4HH'
            }
        };
        
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
        
        console.log('✨ Enhanced Products Carousel initialized with improved mobile handling');
    }
    
    detectDeviceType() {
        this.isMobile = window.innerWidth <= 1024;
        this.isDesktop = !this.isMobile;
        
        document.body.classList.toggle('products-carousel-mobile', this.isMobile);
        document.body.classList.toggle('products-carousel-desktop', this.isDesktop);
    }
    
    calculateDimensions() {
        const cards = this.track.querySelectorAll('.product-card');
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
        
        if (this.catalogBtn) {
            this.catalogBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCatalogClick();
            });
        }
        
        this.bindProductCTAs();
        this.bindModalEvents();
        
        // Window resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.onResize();
            }, 250);
        });
        
        // Simplified mobile touch events
        if (this.isMobile) {
            this.bindSimplifiedTouchEvents();
        }
    }
    
    bindSimplifiedTouchEvents() {
        // Use passive listeners for better performance
        this.track.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        }, { passive: true });
        
        // Track scroll events for progress indication
        this.track.addEventListener('scroll', this.throttle(() => {
            this.updateMobileProgress();
        }, 16), { passive: true });
    }
    
    handleTouchStart(e) {
        if (!e.touches[0]) return;
        
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchCurrentX = this.touchStartX;
        this.touchCurrentY = this.touchStartY;
        this.touchStartTime = Date.now();
        this.isDragging = false;
    }
    
    handleTouchMove(e) {
        if (!e.touches[0]) return;
        
        this.touchCurrentX = e.touches[0].clientX;
        this.touchCurrentY = e.touches[0].clientY;
        
        const deltaX = Math.abs(this.touchCurrentX - this.touchStartX);
        const deltaY = Math.abs(this.touchCurrentY - this.touchStartY);
        
        if (!this.isDragging && (deltaX > 10 || deltaY > 10)) {
            this.isDragging = true;
        }
    }
    
    handleTouchEnd(e) {
        if (!e.changedTouches[0] || !this.isDragging) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchDuration = Date.now() - this.touchStartTime;
        
        const deltaX = this.touchStartX - touchEndX;
        const deltaY = Math.abs(this.touchStartY - touchEndY);
        
        if (touchDuration < this.maxTouchTime &&
            Math.abs(deltaX) > this.swipeThreshold &&
            Math.abs(deltaX) > deltaY * 2) {
            
            this.handleSwipeGesture(deltaX);
            this.handleUserInteraction();
        }
        
        this.resetTouchState();
    }
    
    resetTouchState() {
        this.isDragging = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchCurrentX = 0;
        this.touchCurrentY = 0;
        this.touchStartTime = 0;
    }
    
    handleSwipeGesture(deltaX) {
        const currentScroll = this.track.scrollLeft;
        const cardWidth = this.getCardWidth();
        const gap = this.getGap();
        const scrollDistance = cardWidth + gap;
        
        if (deltaX > 0) {
            const nextScroll = currentScroll + scrollDistance;
            this.smoothScrollTo(Math.min(nextScroll, this.getMaxScrollLeft()));
        } else {
            const prevScroll = currentScroll - scrollDistance;
            this.smoothScrollTo(Math.max(prevScroll, 0));
        }
    }
    
    getCardWidth() {
        const card = this.track.querySelector('.product-card');
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
        this.track.style.scrollBehavior = 'smooth';
        this.track.style.overflowX = 'auto';
        this.track.style.overflowY = 'visible';
        this.track.style.scrollSnapType = 'x mandatory';
        this.track.style.WebkitOverflowScrolling = 'touch';
        
        const cards = this.track.querySelectorAll('.product-card');
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
        
        const cardWidth = this.getCardWidth();
        const gap = this.getGap();
        const slideWidth = cardWidth + gap;
        const currentSlideIndex = Math.round(scrollLeft / slideWidth);
        
        if (this.currentSlide) {
            this.currentSlide.textContent = Math.min(this.totalCards, Math.max(1, currentSlideIndex + 1));
        }
    }
    
    // Desktop carousel methods
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
    
    bindProductCTAs() {
        // Learn More buttons
        const learnMoreBtns = this.track.querySelectorAll('.product-learn-more');
        learnMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleLearnMore(btn);
            });
        });
        
        // Shop Now buttons
        const shopNowBtns = this.track.querySelectorAll('.product-shop-now');
        shopNowBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleShopNow(btn);
            });
        });
    }
    
    bindModalEvents() {
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
        
        if (this.modalShopBtn) {
            this.modalShopBtn.addEventListener('click', () => {
                if (this.currentProductUrl) {
                    this.handleShopNowAction(this.currentProductUrl, this.modalShopBtn);
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal?.classList.contains('active') && e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    handleLearnMore(btn) {
        const productId = btn.getAttribute('data-product');
        
        this.addButtonFeedback(btn);
        
        if (productId && this.productData[productId]) {
            this.openProductModal(productId);
        }
        
        this.trackEvent('product_learn_more', 'products', productId);
    }
    
    handleShopNow(btn) {
        const url = btn.getAttribute('data-url');
        this.handleShopNowAction(url, btn);
    }
    
    handleShopNowAction(url, button) {
        if (!url) return;
        
        this.addButtonFeedback(button);
        
        this.showShopNowFeedback();
        
        setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
        }, 600);
        
        this.trackEvent('product_shop_now', 'products', 'alumiermd_store');
    }
    
    handleCatalogClick() {
        this.addButtonFeedback(this.catalogBtn);
        
        this.showCatalogFeedback();
        
        setTimeout(() => {
            window.open('https://us.alumiermd.com/products?code=54T7P4HH', '_blank', 'noopener,noreferrer');
        }, 800);
        
        this.trackEvent('catalog_view', 'products', 'full_catalog');
    }
    
    openProductModal(productId) {
        const product = this.productData[productId];
        if (!product) return;
        
        this.currentProductUrl = product.url;
        this.populateModalContent(product);
        this.showModal();
        
        this.trackEvent('product_modal_open', 'products', product.name);
    }
    
    populateModalContent(product) {
        if (!this.modalBody) return;
        
        this.modalBody.innerHTML = `
            <div class="product-modal-header">
                <div class="product-modal-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-modal-info">
                    <div class="product-modal-category">
                        <i class="ri-star-line"></i>
                        <span>${product.category}</span>
                    </div>
                    <h2 class="product-modal-name">${product.name}</h2>
                    <div class="product-modal-rating">
                        <div class="rating-stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                    </div>
                </div>
            </div>
            
            <div class="product-modal-content">
                <div class="modal-section">
                    <h3>Description</h3>
                    <p>${product.detailedDescription}</p>
                </div>
                
                <div class="modal-section">
                    <h3>Key Features</h3>
                    <ul class="features-list">
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3>Benefits</h3>
                    <ul class="benefits-list">
                        ${product.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3>Key Ingredients</h3>
                    <div class="ingredients-grid">
                        ${product.keyIngredients.map(ingredient => `<span class="ingredient-tag">${ingredient}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Usage Instructions</h3>
                    <p class="usage-text">${product.usage}</p>
                </div>
            </div>
        `;
        
        this.addModalStyles();
    }
    
    addModalStyles() {
        if (document.getElementById('product-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'product-modal-styles';
        styles.textContent = `
            .product-modal-header {
                display: flex;
                gap: 20px;
                margin-bottom: 24px;
                padding-bottom: 20px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            .product-modal-image {
                flex: 0 0 120px;
                height: 120px;
                background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            
            .product-modal-image img {
                width: 80%;
                height: 80%;
                object-fit: contain;
            }
            
            .product-modal-info {
                flex: 1;
            }
            
            .product-modal-category {
                display: flex;
                align-items: center;
                gap: 6px;
                color: #8B4513;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                margin-bottom: 8px;
            }
            
            .product-modal-name {
                font-family: 'Playfair Display', serif;
                font-size: 24px;
                font-weight: 600;
                color: #2A1B0A;
                margin-bottom: 12px;
                line-height: 1.3;
            }
            
            .product-modal-rating {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .modal-section {
                margin-bottom: 24px;
            }
            
            .modal-section h3 {
                font-family: 'Playfair Display', serif;
                font-size: 18px;
                font-weight: 600;
                color: #2A1B0A;
                margin-bottom: 12px;
            }
            
            .modal-section p {
                color: #6B5B47;
                line-height: 1.6;
                margin: 0;
            }
            
            .features-list,
            .benefits-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .features-list li,
            .benefits-list li {
                padding: 8px 0;
                color: #6B5B47;
                position: relative;
                padding-left: 20px;
            }
            
            .features-list li::before,
            .benefits-list li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #8B4513;
                font-weight: bold;
            }
            
            .ingredients-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .ingredient-tag {
                background: rgba(139, 69, 19, 0.1);
                color: #8B4513;
                padding: 6px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
                border: 1px solid rgba(139, 69, 19, 0.2);
            }
            
            .usage-text {
                background: rgba(248, 244, 236, 0.8);
                padding: 16px;
                border-radius: 12px;
                color: #6B5B47;
                line-height: 1.6;
                border-left: 4px solid #8B4513;
            }
            
            @media (max-width: 768px) {
                .product-modal-header {
                    flex-direction: column;
                    text-align: center;
                }
                
                .product-modal-image {
                    flex: none;
                    width: 100px;
                    height: 100px;
                    margin: 0 auto;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="ri-star-fill"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="ri-star-half-line"></i>';
        }
        
        return starsHTML;
    }
    
    showModal() {
        this.modal?.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.stopAutoPlay();
    }
    
    closeModal() {
        this.modal?.classList.remove('active');
        document.body.style.overflow = '';
        this.currentProductUrl = '';
        if (this.isDesktop && !this.hasUserInteracted) {
            this.startAutoPlay();
        }
    }
    
    addButtonFeedback(button) {
        if (!button) return;
        
        button.style.transform = 'translateY(-2px) scale(0.98)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }
    
    showShopNowFeedback() {
        this.showFeedback('Opening AlumierMD store...', 'ri-shopping-cart-line');
    }
    
    showCatalogFeedback() {
        this.showFeedback('Loading full catalog...', 'ri-book-open-line');
    }
    
    showFeedback(message, icon) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #8B4513, #CD853F);
            color: white;
            padding: 20px 32px;
            border-radius: 24px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transition: all 0.6s ease;
            min-width: 280px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="${icon}" style="font-size: 16px;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
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
    
    initializeCards() {
        const cards = this.track.querySelectorAll('.product-card');
        
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
        const cards = this.track.querySelectorAll('.product-card');
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
            this.bindSimplifiedTouchEvents();
        }
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
        
        this.resetTouchState();
        
        window.removeEventListener('resize', this.onResize);
        
        console.log('🗑️ Enhanced Products Carousel destroyed');
    }
}

// Initialize the carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const productsCarousel = new EnhancedProductsCarousel();
    
    // Make it globally accessible if needed
    window.productsCarousel = productsCarousel;
});

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
        ResultsShowcaseGallery,
        RedesignedSocialSections,
        EnhancedProductsCarousel,
        HermesLuxuryContactSection,
        LuxuryFloatingButtons,
        CinematicHero,
        EviaConfig
    };
}

/* ========================================
   EVIA AESTHETICS - END OF FILE
   ======================================== */
