/* ========================================
   EVIA AESTHETICS - REFINED LUXURY EXPERIENCE
   OPTIMIZED & ORGANIZED JAVASCRIPT
   WITH PRODUCTS SECTION FUNCTIONALITY
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
   MAIN APPLICATION CLASS
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
            { name: 'servicesCarousel', class: LuxuryServicesCarousel },
            { name: 'transformationsGallery', class: ModernTransformationsGallery },
            { name: 'LuxuryProductsSection', class: LuxuryProductsSection },
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
    
    // Public API
    smoothScrollTo(target, offset = 100) {
        return EviaUtils.smoothScrollTo(target, offset);
    }
    
    getComponent(name) {
        return this.components.get(name);
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
   ENHANCED HEADER COMPONENT
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
        this.initStatPills();
        this.initVideo();
        this.prepareSignatureAnimation();
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
    
    prepareSignatureAnimation() {
        if (!this.signatureContainer) return;
        
        const chars = this.signatureContainer.querySelectorAll('.signature-char, .signature-comma');
        const underline = this.signatureContainer.querySelector('.signature-underline-animated');
        const writingIndicator = this.signatureContainer.querySelector('.writing-indicator');
        const sparkles = this.signatureContainer.querySelectorAll('.sparkle');
        
        chars.forEach(char => {
            char.style.opacity = '0';
            char.style.transform = 'translateY(20px) rotate(-5deg)';
        });
        
        if (underline) {
            underline.style.width = '0';
            underline.style.opacity = '0';
        }
        
        if (writingIndicator) writingIndicator.style.opacity = '0';
        
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
        
        if (writingIndicator) {
            setTimeout(() => {
                writingIndicator.style.opacity = '1';
                writingIndicator.style.transform = 'scale(1)';
                writingIndicator.style.transition = 'all 0.3s ease-out';
            }, 300);
        }
        
        chars.forEach((char, index) => {
            const delay = 500 + (index * 200);
            
            setTimeout(() => {
                char.style.transition = 'all 0.6s ease-out';
                char.style.opacity = '1';
                char.style.transform = 'translateY(0) rotate(0deg)';
            }, delay);
        });
        
        const totalDelay = chars.length * 200 + 800;
        setTimeout(() => {
            if (underline) {
                underline.style.transition = 'all 1.5s ease-out';
                underline.style.width = '100%';
                underline.style.opacity = '1';
            }
            
            if (writingIndicator) {
                writingIndicator.style.opacity = '0';
                writingIndicator.style.transform = 'scale(0.8)';
            }
            
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
    }
}

/* ========================================
   SERVICES CAROUSEL COMPONENT
   ======================================== */

class EnhancedServicesCarousel {
    constructor() {
        this.carousel = document.getElementById('servicesCarousel');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        this.autoplayBtn = document.getElementById('autoplayBtn');
        
        // Progress indicators
        this.progressFill = document.getElementById('progressFill');
        this.currentSlide = document.getElementById('currentSlide');
        this.totalSlides = document.getElementById('totalSlides');
        this.currentCounter = document.getElementById('currentCounter');
        this.totalCounter = document.getElementById('totalCounter');
        
        // State management
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
        this.touchEndX = 0;
        this.isDragging = false;
        this.hasUserInteracted = false;
        
        // Throttle and debounce utilities
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
    
    /* ========================================
       DEVICE DETECTION & SETUP
       ======================================== */
    
    detectDeviceType() {
        this.isMobile = window.innerWidth <= 1024;
        this.isDesktop = !this.isMobile;
        
        // Update body class for CSS targeting
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
    
    /* ========================================
       EVENT BINDING
       ======================================== */
    
    bindEvents() {
        // Navigation buttons
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
        
        // Autoplay control
        if (this.autoplayBtn) {
            this.autoplayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAutoPlay();
            });
        }
        
        // Service CTA buttons
        this.bindServiceCTAs();
        
        // Resize handling with debounce
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.onResize();
            }, 250);
        });
        
        // Mobile touch events
        if (this.isMobile) {
            this.bindMobileTouchEvents();
        }
    }
    
    bindMobileTouchEvents() {
        // Prevent default touch behavior on track for horizontal scrolling
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.isDragging = true;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            const touchCurrentX = e.touches[0].clientX;
            const diffX = Math.abs(touchCurrentX - this.touchStartX);
            
            // If horizontal movement is detected, prevent vertical scrolling
            if (diffX > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        
        this.track.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleTouchEnd();
            this.isDragging = false;
        }, { passive: true });
        
        // Handle scroll events on mobile
        this.track.addEventListener('scroll', () => {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.updateMobileProgress();
            }, 16); // ~60fps
        }, { passive: true });
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
    
    /* ========================================
       DESKTOP CAROUSEL FUNCTIONALITY
       ======================================== */
    
    nextSlide() {
        if (this.isTransitioning || this.isMobile) return;
        
        const maxIndex = this.getMaxIndex();
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        } else if (this.isAutoPlaying) {
            // Loop back to start for autoplay
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
        
        // Reset transition flag
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
    
    /* ========================================
       MOBILE SCROLLING FUNCTIONALITY
       ======================================== */
    
    setupMobileScrolling() {
        // Enable smooth scrolling
        this.track.style.scrollBehavior = 'smooth';
        this.track.style.overflowX = 'auto';
        this.track.style.scrollSnapType = 'x mandatory';
        
        // Set initial mobile progress
        this.updateMobileProgress();
    }
    
    handleTouchEnd() {
        const diffX = this.touchStartX - this.touchEndX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            this.handleUserInteraction();
            
            if (diffX > 0) {
                // Swipe left - next slide
                this.scrollToNextCard();
            } else {
                // Swipe right - previous slide
                this.scrollToPreviousCard();
            }
        }
    }
    
    scrollToNextCard() {
        const cards = this.track.querySelectorAll('.service-card');
        const currentScroll = this.track.scrollLeft;
        const cardWidth = cards[0]?.offsetWidth || 300;
        const gap = 16;
        
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
        const gap = 16;
        
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
        
        // Update slide counter
        const cardWidth = this.track.querySelector('.service-card')?.offsetWidth || 300;
        const gap = 16;
        const currentSlideIndex = Math.round(scrollLeft / (cardWidth + gap));
        
        if (this.currentSlide) {
            this.currentSlide.textContent = Math.min(this.totalCards, Math.max(1, currentSlideIndex + 1));
        }
    }
    
    /* ========================================
       DOTS NAVIGATION
       ======================================== */
    
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
    
    /* ========================================
       AUTOPLAY FUNCTIONALITY
       ======================================== */
    
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
    
    /* ========================================
       INDICATOR UPDATES
       ======================================== */
    
    updateAllIndicators() {
        this.updateDots();
        this.updateCounters();
        this.updateNavigationState();
        
        if (this.isMobile) {
            this.updateMobileProgress();
        }
    }
    
    updateCounters() {
        // Desktop counter
        if (this.currentCounter && this.isDesktop) {
            this.currentCounter.textContent = String(this.currentIndex + 1).padStart(2, '0');
        }
        
        if (this.totalCounter && this.isDesktop) {
            this.totalCounter.textContent = String(this.totalCards).padStart(2, '0');
        }
        
        // Mobile counter
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
        
        // Desktop navigation
        if (this.prevBtn) this.prevBtn.style.display = shouldShowDesktopNav ? 'flex' : 'none';
        if (this.nextBtn) this.nextBtn.style.display = shouldShowDesktopNav ? 'flex' : 'none';
        
        // Desktop dots
        if (this.dotsContainer) {
            this.dotsContainer.style.display = shouldShowDesktopNav ? 'flex' : 'none';
        }
    }
    
    /* ========================================
       CARD INITIALIZATION & ANIMATIONS
       ======================================== */
    
    initializeCards() {
        const cards = this.track.querySelectorAll('.service-card');
        
        cards.forEach((card, index) => {
            // Set scroll snap alignment for mobile
            if (this.isMobile) {
                card.style.scrollSnapAlign = 'center';
            }
            
            // Initialize card animations
            this.setupCardAnimations(card, index);
        });
    }
    
    setupCardAnimations(card, index) {
        // Add entrance animation delay
        card.style.setProperty('--animation-delay', `${index * 100}ms`);
        
        // Setup hover effects
        this.setupCardHoverEffects(card);
    }
    
    setupCardHoverEffects(card) {
        if (this.isMobile) return;
        
        card.addEventListener('mouseenter', () => {
            this.onCardHover(card);
        });
        
        card.addEventListener('mouseleave', () => {
            this.onCardLeave(card);
        });
    }
    
    onCardHover(card) {
        // Add subtle floating animation
        card.style.animationName = 'cardFloat';
        card.style.animationDuration = '3s';
        card.style.animationIterationCount = 'infinite';
        card.style.animationTimingFunction = 'ease-in-out';
    }
    
    onCardLeave(card) {
        // Remove floating animation
        card.style.animationName = '';
    }
    
    /* ========================================
       INTERSECTION OBSERVER
       ======================================== */
    
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
        // Trigger card entrance animations
        const cards = this.track.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100);
        });
    }
    
    /* ========================================
       SERVICE BOOKING FUNCTIONALITY
       ======================================== */
    
    handleServiceBooking(cta) {
        const serviceType = cta.getAttribute('data-service');
        
        // Add ripple effect
        this.addRippleEffect(cta);
        
        // Add click feedback
        cta.style.transform = 'translateY(-1px) scale(0.98)';
        setTimeout(() => {
            cta.style.transform = '';
        }, 150);
        
        // Show booking feedback
        this.showBookingFeedback(serviceType);
        
        // Navigate to contact section
        setTimeout(() => {
            this.scrollToContact();
        }, 300);
        
        // Track analytics
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
        
        // Animate in
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Animate out
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
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_booking_click', {
                event_category: 'services',
                event_label: serviceType,
                value: 1
            });
        }
        
        console.log(`📊 Service booking clicked: ${serviceType}`);
    }
    
    /* ========================================
       RESIZE HANDLING
       ======================================== */
    
    onResize() {
        const wasDesktop = this.isDesktop;
        this.detectDeviceType();
        
        // If device type changed
        if (wasDesktop !== this.isDesktop) {
            this.handleDeviceTypeChange();
        }
        
        this.calculateDimensions();
        this.updateNavigationVisibility();
        
        if (this.isDesktop) {
            // Reset desktop carousel
            const maxIndex = this.getMaxIndex();
            if (this.currentIndex > maxIndex) {
                this.currentIndex = Math.max(0, maxIndex);
            }
            this.updateCarousel();
        } else {
            // Reset mobile scrolling
            this.setupMobileScrolling();
            this.updateMobileProgress();
        }
        
        this.updateAllIndicators();
    }
    
    handleDeviceTypeChange() {
        // Stop autoplay when switching to mobile
        if (this.isMobile && this.isAutoPlaying) {
            this.stopAutoPlay();
        }
        
        // Reset transforms
        if (this.isMobile) {
            this.track.style.transform = '';
        }
        
        // Recreate dots if needed
        if (this.isDesktop) {
            this.createDots();
        }
    }
    
    /* ========================================
       UTILITY METHODS
       ======================================== */
    
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
    
    /* ========================================
       PUBLIC API
       ======================================== */
    
    // Public methods for external control
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
        // Clean up intervals
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        // Clean up timeouts
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.onResize);
        
        console.log('🗑️ Enhanced Services Carousel destroyed');
    }
}

/* ========================================
   ENHANCED CARD FLOATING ANIMATION
   ======================================== */

// Add CSS animation for card floating effect
const cardFloatCSS = `
@keyframes cardFloat {
    0%, 100% {
        transform: translateY(-8px) scale(1.02);
    }
    50% {
        transform: translateY(-12px) scale(1.02);
    }
}
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = cardFloatCSS;
document.head.appendChild(style);

/* ========================================
   INITIALIZATION
   ======================================== */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const servicesCarousel = new EnhancedServicesCarousel();
    
    // Make it globally accessible for debugging/external control
    window.servicesCarousel = servicesCarousel;
    
    console.log('🚀 Enhanced Services Carousel ready');
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (window.servicesCarousel) {
        if (document.hidden) {
            window.servicesCarousel.pause();
        } else if (!window.servicesCarousel.hasUserInteracted) {
            // Only resume if user hasn't interacted
            setTimeout(() => {
                window.servicesCarousel.play();
            }, 1000);
        }
    }
});

/* ========================================
   EXPORT FOR MODULE SYSTEMS
   ======================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedServicesCarousel;
}

/* ========================================
   MODERN TRANSFORMATIONS GALLERY
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

        // Touch events
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
   LUXURY PRODUCTS SECTION
   ======================================== */
class LuxuryProductsSection {
    constructor() {
        this.section = document.querySelector('.apple-products-section');
        this.productCards = document.querySelectorAll('.product-card');
        this.productCTAs = document.querySelectorAll('.product-cta');
        this.catalogButton = document.getElementById('viewCatalogBtn');
        this.scrollElements = document.querySelectorAll('[data-scroll-reveal]');
        
        this.isInitialized = false;
        this.observers = new Map();
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupScrollReveal();
            this.bindProductInteractions();
            this.bindCTAEvents();
            this.initializePerformanceOptimizations();
            
            this.isInitialized = true;
            console.log('✨ Luxury Products Section initialized');
        } catch (error) {
            console.error('❌ Error initializing products section:', error);
        }
    }
    
    /**
     * Setup scroll reveal animations using Intersection Observer
     */
    setupScrollReveal() {
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
        
        this.scrollElements.forEach(element => {
            observer.observe(element);
        });
        
        this.observers.set('scrollReveal', observer);
    }
    
    /**
     * Reveal element with smooth animation
     */
    revealElement(element) {
        element.classList.add('reveal');
        
        // Special handling for products grid
        if (element.classList.contains('products-grid')) {
            this.animateProductCards();
        }
    }
    
    /**
     * Animate product cards with staggered delay
     */
    animateProductCards() {
        this.productCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    /**
     * Bind product card interactions
     */
    bindProductInteractions() {
        this.productCards.forEach(card => {
            this.setupCardHoverEffects(card);
            this.setupCardClickEffects(card);
            this.setupMobileInteractions(card);
        });
    }
    
    /**
     * Setup hover effects for product cards
     */
    setupCardHoverEffects(card) {
        if (this.isMobile()) return;
        
        const image = card.querySelector('.product-image');
        const glow = card.querySelector('.image-glow');
        
        card.addEventListener('mouseenter', () => {
            this.onCardHover(card, image, glow);
        });
        
        card.addEventListener('mouseleave', () => {
            this.onCardLeave(card, image, glow);
        });
        
        // 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            this.handleCardTilt(card, e);
        });
    }
    
    /**
     * Handle card hover state
     */
    onCardHover(card, image, glow) {
        if (image) {
            image.style.transform = 'scale(1.05) translateY(-5px)';
        }
        
        if (glow) {
            glow.style.opacity = '1';
        }
        
        // Add subtle card animation
        this.addCardFloatEffect(card);
    }
    
    /**
     * Handle card leave state
     */
    onCardLeave(card, image, glow) {
        if (image) {
            image.style.transform = 'scale(1) translateY(0)';
        }
        
        if (glow) {
            glow.style.opacity = '0';
        }
        
        // Reset card transform
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    }
    
    /**
     * Add floating effect to card
     */
    addCardFloatEffect(card) {
        let startTime = null;
        const duration = 2000;
        
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = (elapsed % duration) / duration;
            
            const yOffset = Math.sin(progress * Math.PI * 2) * 2;
            const currentTransform = card.style.transform || '';
            
            if (currentTransform.includes('translateY(-8px)')) {
                card.style.transform = currentTransform.replace(
                    'translateY(-8px)', 
                    `translateY(${-8 + yOffset}px)`
                );
            }
            
            if (card.matches(':hover')) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * Handle 3D tilt effect on mouse move
     */
    handleCardTilt(card, event) {
        if (this.isMobile()) return;
        
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;
        
        card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    /**
     * Setup click effects for cards
     */
    setupCardClickEffects(card) {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on CTA button
            if (e.target.closest('.product-cta')) return;
            
            this.handleCardClick(card, e);
        });
    }
    
    /**
     * Handle card click with ripple effect
     */
    handleCardClick(card, event) {
        this.createRippleEffect(card, event);
        
        // Optional: Focus on product or show details
        const productName = card.querySelector('.product-name')?.textContent;
        if (productName) {
            this.showProductFeedback(productName);
        }
    }
    
    /**
     * Create ripple effect on click
     */
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
            background: rgba(255, 107, 0, 0.1);
            border-radius: 50%;
            transform: scale(0);
            opacity: 1;
            pointer-events: none;
            transition: all 0.6s ease-out;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transform = 'scale(2)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    /**
     * Setup mobile-specific interactions
     */
    setupMobileInteractions(card) {
        if (!this.isMobile()) return;
        
        // Add touch feedback
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', () => {
            card.style.transform = '';
        });
    }
    
    /**
     * Bind CTA button events
     */
    bindCTAEvents() {
        // Product CTAs
        this.productCTAs.forEach(cta => {
            cta.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleProductCTA(cta);
            });
            
            cta.addEventListener('mouseenter', () => {
                this.addCTAShineEffect(cta);
            });
        });
        
        // Catalog button
        if (this.catalogButton) {
            this.catalogButton.addEventListener('click', () => {
                this.handleCatalogClick();
            });
            
            this.catalogButton.addEventListener('mouseenter', () => {
                this.addButtonGlowEffect(this.catalogButton);
            });
        }
    }
    
    /**
     * Handle product CTA click
     */
    handleProductCTA(cta) {
        const productCard = cta.closest('.product-card');
        const productName = productCard.querySelector('.product-name')?.textContent || 'Product';
        const productUrl = cta.getAttribute('data-url') || 'https://us.alumiermd.com/products?code=54T7P4HH';
        
        // Add click animation
        cta.style.transform = 'translateY(-1px) scale(0.98)';
        setTimeout(() => {
            cta.style.transform = '';
        }, 150);
        
        // Show loading feedback
        this.showProductLoadingFeedback(productName);
        
        // Open product page
        setTimeout(() => {
            window.open(productUrl, '_blank');
        }, 300);
        
        // Track analytics
        this.trackProductClick(productName);
    }
    
    /**
     * Handle catalog button click
     */
    handleCatalogClick() {
        // Add click animation
        this.catalogButton.style.transform = 'translateY(-2px) scale(0.98)';
        
        setTimeout(() => {
            this.catalogButton.style.transform = '';
        }, 150);
        
        // Show loading feedback
        this.showCatalogLoadingFeedback();
        
        // Open catalog
        setTimeout(() => {
            window.open('https://us.alumiermd.com/products?code=54T7P4HH', '_blank');
        }, 300);
        
        // Track analytics
        this.trackCatalogClick();
    }
    
    /**
     * Add shine effect to CTA button
     */
    addCTAShineEffect(cta) {
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
        
        cta.style.position = 'relative';
        cta.appendChild(shine);
        
        requestAnimationFrame(() => {
            shine.style.left = '100%';
        });
        
        setTimeout(() => {
            if (shine.parentNode) {
                shine.parentNode.removeChild(shine);
            }
        }, 600);
    }
    
    /**
     * Add glow effect to button
     */
    addButtonGlowEffect(button) {
        const glow = button.querySelector('.btn-glow');
        if (glow) {
            glow.style.opacity = '0.4';
            setTimeout(() => {
                glow.style.opacity = '0';
            }, 1000);
        }
    }
    
    /**
     * Show product loading feedback
     */
    showProductLoadingFeedback(productName) {
        const feedback = this.createFeedbackElement(
            `Opening ${productName}...`,
            'rgba(255, 107, 0, 0.95)',
            '🛍️'
        );
        
        this.showFeedback(feedback, 2000);
    }
    
    /**
     * Show catalog loading feedback
     */
    showCatalogLoadingFeedback() {
        const feedback = this.createFeedbackElement(
            'Opening full product catalog...',
            'rgba(16, 185, 129, 0.95)',
            '📋'
        );
        
        this.showFeedback(feedback, 2500);
    }
    
    /**
     * Show product click feedback
     */
    showProductFeedback(productName) {
        const feedback = this.createFeedbackElement(
            `Viewing ${productName}`,
            'rgba(139, 92, 246, 0.95)',
            '👁️'
        );
        
        this.showFeedback(feedback, 1500);
    }
    
    /**
     * Create feedback element
     */
    createFeedbackElement(message, backgroundColor, icon) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${backgroundColor};
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 300px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        feedback.innerHTML = `
            <span style="font-size: 16px;">${icon}</span>
            <span>${message}</span>
        `;
        
        return feedback;
    }
    
    /**
     * Show feedback with animation
     */
    showFeedback(feedback, duration = 2000) {
        document.body.appendChild(feedback);
        
        // Fade in
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Fade out
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 400);
        }, duration);
    }
    
    /**
     * Initialize performance optimizations
     */
    initializePerformanceOptimizations() {
        // Add will-change for animated elements
        this.productCards.forEach(card => {
            card.style.willChange = 'transform, box-shadow';
        });
        
        // Debounce resize events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Optimize scroll events
        this.addScrollOptimizations();
    }
    
    /**
     * Add scroll optimizations
     */
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
    
    /**
     * Handle scroll events
     */
    onScroll() {
        // Add scroll-based animations or effects here
        const scrollY = window.pageYOffset;
        const sectionTop = this.section.offsetTop;
        const sectionHeight = this.section.offsetHeight;
        
        // Check if section is in viewport
        if (scrollY > sectionTop - window.innerHeight && 
            scrollY < sectionTop + sectionHeight) {
            // Section is visible
            this.onSectionVisible();
        }
    }
    
    /**
     * Handle when section becomes visible
     */
    onSectionVisible() {
        // Add any scroll-based effects here
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Update mobile state
        if (this.isMobile()) {
            this.optimizeForMobile();
        } else {
            this.optimizeForDesktop();
        }
    }
    
    /**
     * Optimize for mobile devices
     */
    optimizeForMobile() {
        this.productCards.forEach(card => {
            // Remove hover effects on mobile
            card.style.transform = '';
            card.style.willChange = 'auto';
        });
    }
    
    /**
     * Optimize for desktop
     */
    optimizeForDesktop() {
        this.productCards.forEach(card => {
            card.style.willChange = 'transform, box-shadow';
        });
    }
    
    /**
     * Track product click analytics
     */
    trackProductClick(productName) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'product_click', {
                event_category: 'products',
                event_label: productName,
                value: 1
            });
        }
        
        console.log(`📊 Product clicked: ${productName}`);
    }
    
    /**
     * Track catalog click analytics
     */
    trackCatalogClick() {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'catalog_view', {
                event_category: 'products',
                event_label: 'full_catalog',
                value: 1
            });
        }
        
        console.log('📊 Full catalog opened');
    }
    
    /**
     * Utility: Check if mobile device
     */
    isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * Utility: Debounce function
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
     * Utility: Throttle function
     */
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
    
    /**
     * Public API: Refresh section
     */
    refresh() {
        this.destroy();
        this.init();
    }
    
    /**
     * Public API: Destroy section
     */
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // Remove event listeners
        this.productCards.forEach(card => {
            card.replaceWith(card.cloneNode(true));
        });
        
        // Reset initialization state
        this.isInitialized = false;
        
        console.log('🗑️ Products section destroyed');
    }
}

/**
 * Auto-initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if products section exists
    if (document.querySelector('.apple-products-section')) {
        const productsSection = new LuxuryProductsSection();
        
        // Make it globally accessible for manual control
        window.LuxuryProductsSection = productsSection;
        
        console.log('🚀 Luxury Products Section ready');
    }
});

/**
 * Handle page visibility for performance
 */
document.addEventListener('visibilitychange', () => {
    if (window.LuxuryProductsSection) {
        if (document.hidden) {
            // Pause animations when page is hidden
            document.querySelector('.apple-products-section')?.style.setProperty('animation-play-state', 'paused');
        } else {
            // Resume animations when page is visible
            document.querySelector('.apple-products-section')?.style.setProperty('animation-play-state', 'running');
        }
    }
});

/**
 * Export for module systems
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LuxuryProductsSection;
}


/* ========================================
   CONTACT SECTION COMPONENT
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
   LUXURY FLOATING BUTTONS COMPONENT
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
        
        .carousel-track.dragging {
            cursor: grabbing;
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

// Utility functions for external control
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

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        EviaLuxuryApp, 
        EviaUtils, 
        LuxuryServicesCarousel,
        LuxuryProductsSection,
        EviaConfig
    };
}
