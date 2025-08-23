/* ========================================
   INITIALIZATION FIXES FOR HERO & SERVICES
   ======================================== */

// Ensure AOS is properly initialized and content is visible
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with proper settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0
        });
        
        // Refresh AOS after a short delay to catch any layout shifts
        setTimeout(() => {
            AOS.refresh();
        }, 500);
    }
    
    // Ensure hero content is visible
    const heroContent = document.querySelector('.hero-content-stack');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.visibility = 'visible';
        heroContent.style.zIndex = '100';
    }
    
    // Ensure services title is visible
    const servicesTitle = document.querySelector('.services-title');
    if (servicesTitle) {
        servicesTitle.style.opacity = '1';
        servicesTitle.style.visibility = 'visible';
    }
    
    // Ensure services header is visible
    const servicesHeader = document.querySelector('.services-header');
    if (servicesHeader) {
        servicesHeader.style.opacity = '1';
        servicesHeader.style.visibility = 'visible';
    }
    
    // Force video to load properly
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.load();
        heroVideo.play().catch(e => console.log('Video autoplay prevented:', e));
    }
});

// Add window load event to catch any remaining issues
window.addEventListener('load', function() {
    // Refresh AOS after everything is loaded
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Force a layout recalculation
    document.body.style.visibility = 'hidden';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.visibility = 'visible';
});

// Add CSS overrides via JavaScript to prevent conflicts
const style = document.createElement('style');
style.textContent = `
    /* Force hero content visibility */
    .hero-content-stack {
        opacity: 1 !important;
        visibility: visible !important;
        z-index: 100 !important;
    }
    
    /* Force services content visibility */
    .services-title,
    .services-header,
    .services-subtitle {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* Ensure text is readable */
    .hero-headline-primary,
    .hero-headline-secondary,
    .hero-subheadline-elegant {
        opacity: 1 !important;
        visibility: visible !important;
    }
`;
document.head.appendChild(style);

/* ========================================
   MAIN APPLICATION CLASS
   ======================================== */
class EviaAestheticsApp {
    constructor() {
        this.components = new Map();
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 992;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.handlePreloader();
        console.log('🚀 Evia Aesthetics App Initialized');
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        window.addEventListener('load', () => this.onWindowLoad());
        window.addEventListener('resize', this.debounce(() => this.onResize(), 250));
        window.addEventListener('scroll', this.throttle(() => this.onScroll(), 16));
    }

    onDOMReady() {
        this.initializeComponents();
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50
            });
        }
    }

    onWindowLoad() {
        this.hidePreloader();
        this.components.forEach(component => {
            if (component.onWindowLoad) component.onWindowLoad();
        });
    }

    onResize() {
        const wasMobile = this.isMobile;
        const wasTablet = this.isTablet;
        
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 992;
        
        if (wasMobile !== this.isMobile || wasTablet !== this.isTablet) {
            this.components.forEach(component => {
                if (component.onResize) component.onResize();
            });
        }
    }

    onScroll() {
        this.components.forEach(component => {
            if (component.onScroll) component.onScroll();
        });
    }

    initializeComponents() {
        // Initialize all components
        this.components.set('header', new LuxuryHeader());
        this.components.set('mobileMenu', new MobileMenu());
        this.components.set('servicesCarousel', new HermesServicesCarousel());  
        this.components.set('aboutSection', new HermesAboutSection());
        this.components.set('resultsGallery', new ResultsGallery());
        this.components.set('contactForm', new LuxuryContactSection());
        this.components.set('scrollIndicator', new ScrollIndicator());
        this.components.set('servicesCarousel', new HermesFloatingButtons());
    }

    getComponent(name) {
        return this.components.get(name);
    }

    handlePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => this.hidePreloader(), 2000);
        }
    }

    hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 600);
        }
    }

    // Utility functions
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
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

/* ========================================
   HEADER COMPONENT
   ======================================== */
class LuxuryHeader {
    constructor() {
        this.header = document.getElementById('luxuryHeader') || document.querySelector('.luxury-floating-header');
        this.isScrolled = false;
        this.scrollThreshold = 100;
        this.lastScrollY = 0;
        this.ticking = false;
        
        if (this.header) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.initializeAnimations();
        console.log('🏥 Luxury Header Initialized');
    }

    bindEvents() {
        // Navigation links with luxury interactions
        const navLinks = document.querySelectorAll('.luxury-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
            link.addEventListener('mouseenter', (e) => this.handleNavHover(e, link));
            link.addEventListener('mouseleave', (e) => this.handleNavLeave(e, link));
        });

        // CTA button with enhanced interactions
        const ctaBtn = document.getElementById('luxuryHeaderCTA') || document.querySelector('.luxury-cta-button');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => this.handleCtaClick(e));
            ctaBtn.addEventListener('mouseenter', (e) => this.handleCtaHover(e));
            ctaBtn.addEventListener('mouseleave', (e) => this.handleCtaLeave(e));
        }

        // Mobile toggle
        const mobileToggle = document.getElementById('luxuryMobileToggle') || document.querySelector('.luxury-mobile-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', (e) => this.handleMobileToggle(e));
        }

        // Logo interactions
        const logoWrapper = document.querySelector('.logo-glow-wrapper');
        if (logoWrapper) {
            logoWrapper.addEventListener('click', () => this.scrollToTop());
        }

        // Smooth scroll detection
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Resize handler
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    }

    initializeAnimations() {
        // Initialize ambient orb animations
        this.initAmbientOrbs();
        
        // Initialize navigation ripple effects
        this.initNavRipples();
        
        // Initialize CTA shimmer effect
        this.initCtaShimmer();
    }

    initAmbientOrbs() {
        const orbs = document.querySelectorAll('.ambient-orb');
        orbs.forEach((orb, index) => {
            // Add random animation delays for more organic movement
            const delay = Math.random() * 5000;
            orb.style.animationDelay = `-${delay}ms`;
            
            // Add subtle mouse follow effect
            document.addEventListener('mousemove', (e) => {
                this.animateOrb(orb, e, index);
            });
        });
    }

    animateOrb(orb, event, index) {
        const rect = this.header.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const factor = (index + 1) * 0.02;
        const translateX = (x - rect.width / 2) * factor;
        const translateY = (y - rect.height / 2) * factor;
        
        orb.style.transform = `translate(${translateX}px, ${translateY}px) scale(${1 + factor})`;
    }

    initNavRipples() {
        const navLinks = document.querySelectorAll('.luxury-nav-link');
        navLinks.forEach(link => {
            const ripple = link.querySelector('.nav-ripple');
            if (ripple) {
                link.addEventListener('mouseenter', (e) => {
                    this.createRippleEffect(ripple, e);
                });
            }
        });
    }

    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.2) 0%, transparent 70%);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: luxuryRipple 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    initCtaShimmer() {
        const ctaBtn = document.querySelector('.luxury-cta-button');
        if (ctaBtn) {
            // Add periodic shimmer effect
            setInterval(() => {
                if (!ctaBtn.matches(':hover')) {
                    this.triggerShimmer(ctaBtn);
                }
            }, 8000);
        }
    }

    triggerShimmer(button) {
        const shimmer = button.querySelector('.cta-shimmer');
        if (shimmer) {
            shimmer.style.transition = 'none';
            shimmer.style.left = '-100%';
            
            requestAnimationFrame(() => {
                shimmer.style.transition = 'left 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                shimmer.style.left = '100%';
            });
        }
    }

    handleNavClick(event, link) {
        const href = link.getAttribute('href');
        
        if (href.startsWith('#')) {
            event.preventDefault();
            this.scrollToSection(href);
            this.setActiveNavLink(link);
            this.createClickFeedback(link);
        }
    }

    handleNavHover(event, link) {
        // Enhanced hover effect with subtle scaling
        const ripple = link.querySelector('.nav-ripple');
        if (ripple) {
            ripple.style.transform = 'scale(1.05)';
        }
    }

    handleNavLeave(event, link) {
        const ripple = link.querySelector('.nav-ripple');
        if (ripple) {
            ripple.style.transform = 'scale(1)';
        }
    }

    handleCtaClick(event) {
        this.scrollToSection('#contact');
        this.createCtaClickEffect(event.currentTarget);
    }

    handleCtaHover(event) {
        const button = event.currentTarget;
        const ambientGlow = button.querySelector('.cta-ambient-glow');
        
        if (ambientGlow) {
            ambientGlow.style.opacity = '1';
            ambientGlow.style.transform = 'scale(1.1)';
        }
    }

    handleCtaLeave(event) {
        const button = event.currentTarget;
        const ambientGlow = button.querySelector('.cta-ambient-glow');
        
        if (ambientGlow) {
            ambientGlow.style.opacity = '0';
            ambientGlow.style.transform = 'scale(1)';
        }
    }

    createCtaClickEffect(button) {
        // Create expanding circle effect
        const rect = button.getBoundingClientRect();
        const circle = document.createElement('div');
        
        circle.style.cssText = `
            position: fixed;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%);
            width: 100px;
            height: 100px;
            left: ${rect.left + rect.width / 2 - 50}px;
            top: ${rect.top + rect.height / 2 - 50}px;
            transform: scale(0);
            animation: ctaClickExpand 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(circle);
        
        setTimeout(() => {
            if (circle.parentNode) {
                circle.parentNode.removeChild(circle);
            }
        }, 800);
    }

    handleMobileToggle(event) {
        const toggle = event.currentTarget;
        toggle.classList.toggle('active');
        
        // Trigger mobile menu if it exists
        const mobileMenu = document.getElementById('mobileMenu') || document.querySelector('.modern-mobile-menu');
        if (mobileMenu) {
            // Trigger existing mobile menu logic
            if (window.eviaApp && window.eviaApp.getComponent('mobileMenu')) {
                window.eviaApp.getComponent('mobileMenu').toggleMenu();
            }
        }
    }

    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateScrollState();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateScrollState() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const shouldBeScrolled = scrollY > this.scrollThreshold;
        
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.header.classList.toggle('scrolled', this.isScrolled);
            
            // Add subtle entrance animation
            if (this.isScrolled) {
                this.animateScrolledState();
            }
        }
        
        this.lastScrollY = scrollY;
    }

    animateScrolledState() {
        const container = this.header.querySelector('.luxury-glass-container');
        if (container) {
            container.style.transform = 'translateY(-2px) scale(1.01)';
            
            setTimeout(() => {
                container.style.transform = 'translateY(-2px) scale(1)';
            }, 300);
        }
    }

    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = this.header.offsetHeight;
            const elementPosition = element.offsetTop - headerHeight - 20;
            
            // Smooth scroll with custom easing
            this.smoothScrollTo(elementPosition, 1000);
        }
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Custom easing function for luxury feel
            const easeProgress = this.easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    scrollToTop() {
        this.smoothScrollTo(0, 800);
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.luxury-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    createClickFeedback(element) {
        // Add subtle click feedback
        element.style.transform = 'translateY(-1px) scale(0.98)';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }

    handleResize() {
        // Recalculate any position-dependent animations
        this.updateScrollState();
    }

    // Utility function
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
}

// CSS animations to add to the page
const luxuryAnimations = `
<style>
@keyframes luxuryRipple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes ctaClickExpand {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(3);
        opacity: 0;
    }
}
</style>`;

// Initialize luxury header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add animations to head
    document.head.insertAdjacentHTML('beforeend', luxuryAnimations);
    
    // Initialize luxury header
    if (document.querySelector('.luxury-floating-header')) {
        window.luxuryHeader = new LuxuryHeader();
    }
});

// Export for integration with existing app
if (typeof window !== 'undefined') {
    window.LuxuryHeader = LuxuryHeader;
}

/* ========================================
   MOBILE MENU COMPONENT
   ======================================== */
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileToggle');
        this.menu = document.getElementById('mobileMenu');
        this.backdrop = document.getElementById('mobileBackdrop');
        this.closeBtn = document.getElementById('mobileClose');
        this.navLinks = document.querySelectorAll('.mobile-nav-link');
        this.isOpen = false;
        
        if (this.toggle && this.menu) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Toggle button
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeMenu());
        }

        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeMenu());
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateAndClose(href);
                }
            });
        });

        // CTA button
        const ctaBtn = document.querySelector('.mobile-cta-button');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => this.navigateAndClose('#contact'));
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        this.backdrop.classList.add('active');
        document.body.classList.add('mobile-menu-open');
        
        // Animate nav links
        this.navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
            }, index * 50);
        });
    }

    closeMenu() {
        this.isOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        this.backdrop.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
        
        // Reset nav links
        this.navLinks.forEach(link => {
            link.style.transform = '';
            link.style.opacity = '';
        });
    }

    navigateAndClose(target) {
        this.closeMenu();
        setTimeout(() => {
            const element = document.querySelector(target);
            if (element) {
                const headerHeight = 80;
                const elementPosition = element.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }

    onResize() {
        if (window.innerWidth > 992 && this.isOpen) {
            this.closeMenu();
        }
    }
}

/* ========================================
   SERVICES CAROUSEL COMPONENT
   ======================================== */

class HermesServicesCarousel {
    constructor() {
        this.carousel = document.getElementById('servicesCarousel');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoplayBtn = document.getElementById('autoplayBtn');
        this.currentCounter = document.querySelector('.counter-current');
        this.totalCounter = document.querySelector('.counter-total');
        this.progressFill = document.querySelector('.progress-fill');
        
        // State management
        this.currentIndex = 0;
        this.totalSlides = 0;
        this.slideWidth = 0;
        this.gap = 24;
        this.isAutoplay = true;
        this.autoplayInterval = null;
        this.isMobile = window.innerWidth <= 768;
        this.isTransitioning = false;
        this.isPaused = false;
        
        // Touch handling
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        this.isScrolling = false;
        
        // Performance optimization
        this.resizeTimeout = null;
        this.lastScrollTime = 0;
        
        if (this.carousel && this.track) {
            this.init();
        }
    }

    init() {
        this.calculateDimensions();
        this.bindEvents();
        this.updateCounters();
        this.updateProgress();
        this.bindServiceNavigation();
        this.initializeCards();
        this.startAutoplay();
        this.setupIntersectionObserver();
        
        console.log('✨ Hermes Services Carousel Initialized with Luxury Experience');
    }

    calculateDimensions() {
        const cards = this.track.querySelectorAll('.hermes-service-card');
        this.totalSlides = cards.length;
        
        if (this.totalCounter) {
            this.totalCounter.textContent = String(this.totalSlides).padStart(2, '0');
        }
        
        if (cards.length > 0 && !this.isMobile) {
            const cardRect = cards[0].getBoundingClientRect();
            this.slideWidth = cardRect.width;
            const trackStyles = window.getComputedStyle(this.track);
            this.gap = parseInt(trackStyles.gap) || 24;
        }
    }

    bindEvents() {
        // Navigation buttons with luxury feedback
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                this.addRippleEffect(e.currentTarget, e);
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                this.addRippleEffect(e.currentTarget, e);
                this.nextSlide();
            });
        }

        // Autoplay toggle with enhanced feedback
        if (this.autoplayBtn) {
            this.autoplayBtn.addEventListener('click', (e) => {
                this.addRippleEffect(e.currentTarget, e);
                this.toggleAutoplay();
            });
        }

        // Enhanced touch events for mobile
        if (this.track) {
            this.bindTouchEvents();
        }

        // Keyboard navigation with luxury feel
        document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));

        // Optimized resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });

        // Mouse enter/leave for sophisticated pause behavior
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.carousel.addEventListener('mouseleave', () => this.handleMouseLeave());
        }

        // Focus management for accessibility
        this.bindAccessibilityEvents();
    }

    bindTouchEvents() {
        // Enhanced touch handling with scroll detection
        this.track.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        }, { passive: false });

        this.track.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        }, { passive: true });
    }

    bindServiceNavigation() {
        // Enhanced service navigation with loading states
        const learnBtns = document.querySelectorAll('.hermes-learn-btn');
        learnBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.addButtonLoadingState(btn);
                const serviceType = btn.dataset.service;
                this.navigateToService(serviceType, 'learn_more_btn');
            });
        });

        // Card click navigation with visual feedback
        const serviceCards = document.querySelectorAll('.hermes-service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Only navigate if not clicking on interactive elements
                if (!e.target.closest('button') && !e.target.closest('a')) {
                    this.addCardPressEffect(card);
                    const serviceType = card.dataset.service;
                    this.navigateToService(serviceType, 'card_click');
                }
            });
        });

        // CTA buttons with enhanced tracking
        const primaryCta = document.querySelector('.hermes-primary-cta');
        const secondaryCta = document.querySelector('.hermes-secondary-cta');
        
        if (primaryCta) {
            primaryCta.addEventListener('click', (e) => {
                this.trackEvent('view_all_services_clicked', { source: 'primary_cta' });
                this.addLinkLoadingFeedback('Exploring all services...');
            });
        }

        if (secondaryCta) {
            secondaryCta.addEventListener('click', (e) => {
                this.trackEvent('schedule_consultation_clicked', { source: 'secondary_cta' });
            });
        }
    }

    initializeCards() {
        // Add entrance animations and luxury touches
        const cards = document.querySelectorAll('.hermes-service-card');
        cards.forEach((card, index) => {
            // Stagger entrance animations
            setTimeout(() => {
                card.classList.add('initialized');
            }, index * 150);

            // Add luxury hover sound effect preparation
            card.addEventListener('mouseenter', () => {
                this.playLuxuryHoverSound();
            });
        });
    }

    navigateToService(serviceType, source = 'unknown') {
        // Enhanced navigation with luxury loading feedback
        this.showLuxuryNavigationFeedback(serviceType);
        
        // Track the interaction with detailed analytics
        this.trackEvent('service_navigation', { 
            service: serviceType, 
            source: source,
            current_index: this.currentIndex,
            timestamp: Date.now()
        });
        
        // Service URL mapping
        const serviceMapping = {
            'botox': 'botox-fillers',
            'weight-management': 'weight-management',
            'iv-therapy': 'iv-therapy',
            'microneedling': 'microneedling',
            'prp': 'prp-therapy',
            'chemical-peels': 'chemical-peels'
        };
        
        const serviceHash = serviceMapping[serviceType] || serviceType;
        
        // Luxury transition timing
        setTimeout(() => {
            window.location.href = `services.html#${serviceHash}`;
        }, 400);
    }

    showLuxuryNavigationFeedback(serviceType) {
        const serviceNames = {
            'botox': 'Botox & Fillers',
            'weight-management': 'Weight Management',
            'iv-therapy': 'IV Therapy',
            'microneedling': 'Microneedling',
            'prp': 'PRP Therapy',
            'chemical-peels': 'Chemical Peels'
        };

        const feedback = document.createElement('div');
        feedback.className = 'hermes-navigation-feedback';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, 
                rgba(255, 140, 0, 0.95) 0%, 
                rgba(255, 165, 0, 0.95) 50%, 
                rgba(255, 122, 0, 0.95) 100%);
            color: white;
            padding: 20px 32px;
            border-radius: 60px;
            font-family: 'Inter', sans-serif;
            font-size: 15px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(40px);
            box-shadow: 
                0 20px 80px rgba(255, 140, 0, 0.4),
                inset 0 1px 2px rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            letter-spacing: 0.5px;
        `;
        
        feedback.innerHTML = `
            <div class="hermes-loading-spinner" style="
                width: 18px; 
                height: 18px; 
                border: 2px solid rgba(255,255,255,0.3); 
                border-top: 2px solid white; 
                border-radius: 50%; 
                animation: luxurySpinner 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
            "></div>
            <span>Loading ${serviceNames[serviceType] || 'service'} details...</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translate(-50%, -50%) scale(0.95)';
                setTimeout(() => feedback.remove(), 500);
            }
        }, 1200);
    }

    addButtonLoadingState(button) {
        const originalContent = button.innerHTML;
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.8';
        
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 16px; 
            height: 16px; 
            border: 2px solid rgba(255,255,255,0.3); 
            border-top: 2px solid white; 
            border-radius: 50%; 
            animation: luxurySpinner 1s linear infinite;
            margin-right: 8px;
        `;
        
        button.innerHTML = '';
        button.appendChild(spinner);
        button.appendChild(document.createTextNode('Loading...'));
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.pointerEvents = '';
            button.style.opacity = '';
        }, 400);
    }

    addCardPressEffect(card) {
        card.style.transform = 'translateY(-8px) scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    }

    addRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: hermesRipple 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            pointer-events: none;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlide();
        this.restartAutoplay();
        this.trackEvent('carousel_next', { index: this.currentIndex });
        
        setTimeout(() => this.isTransitioning = false, 600);
    }

    previousSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
        this.restartAutoplay();
        this.trackEvent('carousel_previous', { index: this.currentIndex });
        
        setTimeout(() => this.isTransitioning = false, 600);
    }

    updateSlide() {
        if (!this.isMobile) {
            const translateX = -(this.currentIndex * (this.slideWidth + this.gap));
            this.track.style.transform = `translateX(${translateX}px)`;
        }
        
        this.updateCounters();
        this.updateProgress();
        this.highlightActiveCard();
        this.updateCardVisibility();
    }

    updateCounters() {
        if (this.currentCounter) {
            this.currentCounter.textContent = String(this.currentIndex + 1).padStart(2, '0');
        }
    }

    updateProgress() {
        if (this.progressFill) {
            const progress = ((this.currentIndex + 1) / this.totalSlides) * 100;
            this.progressFill.style.width = `${progress}%`;
        }
    }

    highlightActiveCard() {
        const cards = this.track.querySelectorAll('.hermes-service-card');
        cards.forEach((card, index) => {
            card.classList.toggle('active-slide', index === this.currentIndex);
            
            // Add luxury glow effect to active card
            if (index === this.currentIndex) {
                card.style.boxShadow = '0 20px 80px rgba(255, 140, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)';
            } else {
                card.style.boxShadow = '';
            }
        });
    }

    updateCardVisibility() {
        // Optimize performance by managing card visibility
        const cards = this.track.querySelectorAll('.hermes-service-card');
        const viewportRange = 2; // Show 2 cards on each side of current
        
        cards.forEach((card, index) => {
            const isVisible = Math.abs(index - this.currentIndex) <= viewportRange;
            card.style.willChange = isVisible ? 'transform' : 'auto';
        });
    }

    startAutoplay() {
        if (this.isAutoplay && !this.isMobile && !this.autoplayInterval && !this.isPaused) {
            this.autoplayInterval = setInterval(() => {
                if (!document.hidden && this.isCarouselVisible()) {
                    this.nextSlide();
                }
            }, 4500); // Slightly longer for luxury feel
        }
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    pauseAutoplay() {
        this.isPaused = true;
        this.stopAutoplay();
    }

    resumeAutoplay() {
        this.isPaused = false;
        if (this.isAutoplay && !this.isMobile) {
            setTimeout(() => this.startAutoplay(), 1500);
        }
    }

    restartAutoplay() {
        this.stopAutoplay();
        if (this.isAutoplay && !this.isMobile) {
            setTimeout(() => this.startAutoplay(), 3000);
        }
    }

    toggleAutoplay() {
        this.isAutoplay = !this.isAutoplay;
        
        if (this.autoplayBtn) {
            const icon = this.autoplayBtn.querySelector('i');
            if (icon) {
                icon.className = this.isAutoplay ? 'ri-pause-line' : 'ri-play-line';
            }
        }

        if (this.isAutoplay) {
            this.resumeAutoplay();
        } else {
            this.pauseAutoplay();
        }

        this.trackEvent('autoplay_toggled', { enabled: this.isAutoplay });
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isScrolling = false;
    }

    handleTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = this.touchStartX - touchX;
        const diffY = this.touchStartY - touchY;

        // Determine if this is a horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe - prevent default to avoid page scroll
            e.preventDefault();
            this.isScrolling = false;
        } else {
            // Vertical scroll - allow default behavior
            this.isScrolling = true;
        }
    }

    handleTouchEnd(e) {
        if (!this.touchStartX || this.isScrolling) return;

        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) > this.minSwipeDistance) {
            if (swipeDistance > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
        
        // Reset touch values
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
    }

    handleKeyboardNav(e) {
        if (!this.isCarouselVisible() || this.isTransitioning) return;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoplay();
                break;
            case 'Enter':
                if (document.activeElement.classList.contains('hermes-service-card')) {
                    e.preventDefault();
                    const serviceType = document.activeElement.dataset.service;
                    this.navigateToService(serviceType, 'keyboard');
                }
                break;
        }
    }

    handleMouseEnter() {
        this.pauseAutoplay();
    }

    handleMouseLeave() {
        this.resumeAutoplay();
    }

    setupIntersectionObserver() {
        // Pause carousel when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.resumeAutoplay();
                } else {
                    this.pauseAutoplay();
                }
            });
        }, { threshold: 0.5 });

        if (this.carousel) {
            observer.observe(this.carousel);
        }
    }

    bindAccessibilityEvents() {
        // Enhanced accessibility for service cards
        const cards = document.querySelectorAll('.hermes-service-card');
        cards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Learn more about ${card.querySelector('.hermes-service-title')?.textContent || 'service'}`);
        });
    }

    isCarouselVisible() {
        if (!this.carousel) return false;
        const rect = this.carousel.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            this.calculateDimensions();
            
            if (this.isMobile) {
                this.stopAutoplay();
                this.track.style.transform = '';
            } else {
                if (this.isAutoplay) {
                    this.startAutoplay();
                }
                this.updateSlide();
            }
        } else if (!this.isMobile) {
            this.calculateDimensions();
            this.updateSlide();
        }
    }

    addLinkLoadingFeedback(message) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #2A1B0A 0%, #5D4E37 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        `;
        
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateX(100px)';
            setTimeout(() => feedback.remove(), 400);
        }, 2000);
    }

    playLuxuryHoverSound() {
        // Placeholder for luxury hover sound effect
        // Could integrate with Web Audio API for subtle luxury sounds
        if (window.AudioContext && this.isAutoplay) {
            // Implement subtle luxury hover sound
        }
    }

    trackEvent(eventName, eventData = {}) {
        // Enhanced analytics tracking
        const analyticsData = {
            event_category: 'Hermes Services Carousel',
            event_label: eventData.service || 'general',
            custom_parameters: {
                carousel_state: {
                    current_index: this.currentIndex,
                    total_slides: this.totalSlides,
                    is_autoplay: this.isAutoplay,
                    is_mobile: this.isMobile
                },
                user_interaction: {
                    timestamp: Date.now(),
                    viewport_width: window.innerWidth,
                    viewport_height: window.innerHeight
                },
                ...eventData
            }
        };

        // Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, analyticsData);
        }

        // Custom analytics endpoint (if available)
        if (window.customAnalytics) {
            window.customAnalytics.track(eventName, analyticsData);
        }
        
        // Development logging
        console.log(`📊 Hermes Carousel Event: ${eventName}`, analyticsData);
    }

    // Public API methods for external control
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides && index !== this.currentIndex && !this.isTransitioning) {
            this.currentIndex = index;
            this.updateSlide();
            this.restartAutoplay();
            this.trackEvent('goto_slide', { target_index: index });
        }
    }

    pause() {
        this.pauseAutoplay();
    }

    resume() {
        this.resumeAutoplay();
    }

    getCurrentSlide() {
        return this.currentIndex;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    destroy() {
        // Clean up all event listeners and intervals
        this.stopAutoplay();
        
        // Remove event listeners
        if (this.prevBtn) this.prevBtn.removeEventListener('click', this.previousSlide);
        if (this.nextBtn) this.nextBtn.removeEventListener('click', this.nextSlide);
        if (this.autoplayBtn) this.autoplayBtn.removeEventListener('click', this.toggleAutoplay);
        
        // Remove touch events
        if (this.track) {
            this.track.removeEventListener('touchstart', this.handleTouchStart);
            this.track.removeEventListener('touchmove', this.handleTouchMove);
            this.track.removeEventListener('touchend', this.handleTouchEnd);
        }
        
        document.removeEventListener('keydown', this.handleKeyboardNav);
        window.removeEventListener('resize', this.handleResize);
        
        // Clear timeouts
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        
        console.log('✨ Hermes Services Carousel Destroyed');
    }
}

// Enhanced CSS animations for luxury effects
const hermesLuxuryCSS = `
<style>
@keyframes luxurySpinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes hermesRipple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.hermes-service-card.active-slide {
    z-index: 5;
}

.hermes-service-card.initialized {
    opacity: 1;
    transform: translateY(0);
}

.hermes-service-card:not(.initialized) {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hermes-navigation-feedback {
    animation: luxuryFadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

@keyframes luxuryFadeIn {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

/* Luxury focus styles */
.hermes-service-card:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.3);
}

.hermes-carousel-nav:focus,
.hermes-autoplay-toggle:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.4);
}
</style>`;

// Initialize the Hermes carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add luxury CSS animations
    document.head.insertAdjacentHTML('beforeend', hermesLuxuryCSS);
    
    // Initialize carousel with luxury enhancements
    if (document.getElementById('servicesCarousel')) {
        window.hermesServicesCarousel = new HermesServicesCarousel();
        
        // Add global accessibility enhancements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
        
        console.log('🏛️ Hermes Luxury Experience Activated');
    }
});

// Export for external use and testing
if (typeof window !== 'undefined') {
    window.HermesServicesCarousel = HermesServicesCarousel;
}

// Performance monitoring (optional)
if ('performance' in window && 'mark' in performance) {
    performance.mark('hermes-carousel-script-loaded');
}

/* ========================================
   ABOUT SECTION COMPONENT
   ======================================== */
/**
 * Hermes About Section Component
 * Enhanced luxury about section with navigation and analytics
 */
class HermesAboutSection {
    constructor() {
        this.section = document.querySelector('.hermes-about-showcase');
        this.profileCard = document.querySelector('.doctor-profile-luxury');
        this.profileCtaBtn = document.querySelector('.doctor-profile-cta');
        this.mobileProfileBtn = document.querySelector('.mobile-profile-btn');
        this.primaryCta = document.querySelector('.primary-cta-luxury');
        this.secondaryCta = document.querySelector('.secondary-cta-luxury');
        this.expertiseItems = document.querySelectorAll('.expertise-item');
        
        // State management
        this.isAnimating = false;
        this.hasBeenViewed = false;
        this.interactionCount = 0;
        
        // Performance optimization
        this.resizeTimeout = null;
        this.scrollTimeout = null;
        
        if (this.section) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
        this.initializeLuxuryEffects();
        this.setupAccessibility();
        
        console.log('✨ Hermes About Section Initialized with Luxury Experience');
    }

    bindEvents() {
        // Profile CTA navigation
        if (this.profileCtaBtn) {
            this.profileCtaBtn.addEventListener('click', (e) => {
                this.handleProfileNavigation(e, 'profile_cta_desktop');
            });
        }

        if (this.mobileProfileBtn) {
            this.mobileProfileBtn.addEventListener('click', (e) => {
                this.handleProfileNavigation(e, 'profile_cta_mobile');
            });
        }

        // Primary CTA (Meet Dr. Nano)
        if (this.primaryCta) {
            this.primaryCta.addEventListener('click', (e) => {
                this.handlePrimaryCta(e);
            });
        }

        // Secondary CTA (Schedule Consultation)
        if (this.secondaryCta) {
            this.secondaryCta.addEventListener('click', (e) => {
                this.handleSecondaryCta(e);
            });
        }

        // Expertise items interaction
        this.expertiseItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                this.handleExpertiseClick(e, item, index);
            });
            
            item.addEventListener('mouseenter', () => {
                this.handleExpertiseHover(item);
            });
        });

        // Profile card enhanced interactions
        if (this.profileCard) {
            this.profileCard.addEventListener('mouseenter', () => this.handleProfileCardHover());
            this.profileCard.addEventListener('mouseleave', () => this.handleProfileCardLeave());
            this.profileCard.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this.handleProfileCardClick(e);
                }
            });
        }

        // Window events
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));
    }

    handleProfileNavigation(event, source) {
        if (this.isAnimating) return;
        
        event.preventDefault();
        this.isAnimating = true;
        
        // Add luxury loading state to button
        this.addLuxuryLoadingState(event.currentTarget);
        
        // Show navigation feedback
        this.showLuxuryNavigationFeedback('about');
        
        // Track interaction
        this.trackEvent('profile_navigation_clicked', {
            source: source,
            interaction_count: ++this.interactionCount,
            viewport_width: window.innerWidth,
            time_on_section: this.getTimeOnSection()
        });
        
        // Navigate with luxury timing
        setTimeout(() => {
            window.location.href = 'about.html';
        }, 600);
    }

    handlePrimaryCta(event) {
        event.preventDefault();
        
        // Add shimmer effect
        this.triggerShimmerEffect(event.currentTarget);
        
        // Show loading feedback
        this.showLuxuryNavigationFeedback('about', 'Exploring Dr. Nano\'s complete profile...');
        
        // Track primary CTA click
        this.trackEvent('primary_cta_clicked', {
            cta_text: 'Meet Dr. Nano',
            section: 'about',
            user_journey_step: 'profile_discovery'
        });
        
        // Navigate to about page
        setTimeout(() => {
            window.location.href = 'about.html';
        }, 500);
    }

    handleSecondaryCta(event) {
        // Add ripple effect
        this.addRippleEffect(event.currentTarget, event);
        
        // Track consultation request
        this.trackEvent('consultation_requested', {
            source: 'about_section_secondary_cta',
            doctor_interest: true
        });
        
        // Smooth scroll to contact section
        this.smoothScrollToContact();
    }

    handleExpertiseClick(event, item, index) {
        const specialty = item.dataset.specialty;
        
        // Add click feedback
        this.addExpertiseClickEffect(item);
        
        // Track expertise interest
        this.trackEvent('expertise_clicked', {
            specialty: specialty,
            index: index,
            section: 'about_expertise_preview'
        });
        
        // Show feedback about expertise
        this.showExpertiseFeedback(specialty);
    }

    handleExpertiseHover(item) {
        // Add luxury hover sound effect
        this.playLuxuryHoverSound();
        
        // Enhanced hover animation
        const icon = item.querySelector('.expertise-icon');
        if (icon) {
            icon.style.transform = 'rotate(10deg) scale(1.1)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }

    handleProfileCardHover() {
        // Track hover engagement
        this.trackEvent('profile_card_hovered', {
            engagement_type: 'hover',
            time_on_section: this.getTimeOnSection()
        });
        
        // Add subtle glow effect
        this.addProfileGlowEffect();
    }

    handleProfileCardLeave() {
        // Remove glow effect
        this.removeProfileGlowEffect();
    }

    handleProfileCardClick(event) {
        if (window.innerWidth <= 768) {
            // Mobile card click navigation
            this.handleProfileNavigation(event, 'profile_card_mobile');
        } else {
            // Desktop card click feedback
            this.addCardPressEffect();
            this.showMobileHint();
        }
    }

    showLuxuryNavigationFeedback(destination, customMessage = null) {
        const messages = {
            'about': 'Loading Dr. Nano\'s complete profile...',
            'consultation': 'Preparing consultation booking...'
        };

        const message = customMessage || messages[destination] || 'Loading...';

        const feedback = document.createElement('div');
        feedback.className = 'hermes-navigation-feedback';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, 
                rgba(255, 140, 0, 0.95) 0%, 
                rgba(255, 165, 0, 0.95) 50%, 
                rgba(255, 122, 0, 0.95) 100%);
            color: white;
            padding: 24px 36px;
            border-radius: 60px;
            font-family: 'Inter', sans-serif;
            font-size: 15px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(40px);
            box-shadow: 
                0 25px 100px rgba(255, 140, 0, 0.4),
                inset 0 1px 2px rgba(255, 255, 255, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            gap: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            letter-spacing: 0.5px;
            min-width: 300px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <div class="hermes-luxury-spinner" style="
                width: 20px; 
                height: 20px; 
                border: 2.5px solid rgba(255,255,255,0.3); 
                border-top: 2.5px solid white; 
                border-radius: 50%; 
                animation: luxurySpinner 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
            "></div>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Auto-remove if navigation doesn't happen
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translate(-50%, -50%) scale(0.95)';
                setTimeout(() => feedback.remove(), 600);
            }
        }, 3000);
    }

    addLuxuryLoadingState(button) {
        const originalContent = button.innerHTML;
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.8';
        
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 16px; 
            height: 16px; 
            border: 2px solid rgba(255,255,255,0.3); 
            border-top: 2px solid white; 
            border-radius: 50%; 
            animation: luxurySpinner 1s linear infinite;
            margin-right: 8px;
        `;
        
        button.innerHTML = '';
        button.appendChild(spinner);
        button.appendChild(document.createTextNode('Loading...'));
        
        // Restore after navigation timeout
        setTimeout(() => {
            if (button.parentNode) {
                button.innerHTML = originalContent;
                button.style.pointerEvents = '';
                button.style.opacity = '';
            }
        }, 1000);
    }

    triggerShimmerEffect(element) {
        const shimmer = element.querySelector('.cta-shimmer-effect');
        if (shimmer) {
            shimmer.style.transition = 'none';
            shimmer.style.left = '-100%';
            
            requestAnimationFrame(() => {
                shimmer.style.transition = 'left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                shimmer.style.left = '100%';
            });
        }
    }

    addRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: hermesRipple 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            pointer-events: none;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
    }

    addExpertiseClickEffect(item) {
        item.style.transform = 'translateY(-2px) scale(0.98)';
        setTimeout(() => {
            item.style.transform = '';
        }, 200);
    }

    addProfileGlowEffect() {
        if (this.profileCard) {
            this.profileCard.style.boxShadow = `
                0 25px 100px rgba(255, 140, 0, 0.15),
                0 10px 40px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 140, 0, 0.1)
            `;
        }
    }

    removeProfileGlowEffect() {
        if (this.profileCard) {
            this.profileCard.style.boxShadow = '';
        }
    }

    addCardPressEffect() {
        if (this.profileCard) {
            this.profileCard.style.transform = 'translateY(-6px) scale(0.98)';
            setTimeout(() => {
                this.profileCard.style.transform = '';
            }, 200);
        }
    }

    showExpertiseFeedback(specialty) {
        const specialtyNames = {
            'injectables': 'Injectable Treatments',
            'wellness': 'Medical Wellness',
            'aesthetic': 'Aesthetic Procedures'
        };

        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #2A1B0A 0%, #5D4E37 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        feedback.innerHTML = `
            <i class="ri-information-line"></i>
            <span>Learn more about ${specialtyNames[specialty] || specialty} on the About page</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateX(100px)';
            setTimeout(() => feedback.remove(), 500);
        }, 4000);
    }

    showMobileHint() {
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(42, 27, 10, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            white-space: nowrap;
            z-index: 100;
        `;
        
        hint.textContent = 'Click "View Full Profile" button to learn more';
        this.profileCard.style.position = 'relative';
        this.profileCard.appendChild(hint);
        
        requestAnimationFrame(() => {
            hint.style.opacity = '1';
            hint.style.transform = 'translateX(-50%) translateY(-5px)';
        });
        
        setTimeout(() => {
            if (hint.parentNode) {
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 300);
            }
        }, 3000);
    }

    smoothScrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 100;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            this.smoothScrollTo(elementPosition, 1200);
        }
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Luxury easing function
            const easeProgress = this.easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    setupIntersectionObserver() {
        // Track when section comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasBeenViewed) {
                    this.hasBeenViewed = true;
                    this.sectionViewTime = Date.now();
                    
                    // Track section view
                    this.trackEvent('about_section_viewed', {
                        viewport_width: window.innerWidth,
                        viewport_height: window.innerHeight,
                        scroll_depth: Math.round((window.pageYOffset / document.body.scrollHeight) * 100)
                    });
                    
                    // Trigger entrance animations
                    this.triggerEntranceAnimations();
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        if (this.section) {
            observer.observe(this.section);
        }
    }

    triggerEntranceAnimations() {
        // Stagger entrance animations for luxury feel
        const elements = [
            this.section.querySelector('.hermes-about-header'),
            this.section.querySelector('.doctor-profile-luxury'),
            this.section.querySelector('.expertise-preview-column'),
            this.section.querySelector('.about-transformation-cta')
        ];

        elements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.classList.add('animate-entrance');
                }, index * 200);
            }
        });
    }

    initializeLuxuryEffects() {
        // Add subtle parallax effect to background orbs
        window.addEventListener('scroll', () => {
            if (!this.scrollTimeout) {
                this.scrollTimeout = setTimeout(() => {
                    this.updateParallaxEffects();
                    this.scrollTimeout = null;
                }, 16);
            }
        }, { passive: true });

        // Initialize hover effects for better performance
        this.preloadHoverEffects();
    }

    updateParallaxEffects() {
        if (!this.isElementInViewport()) return;

        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        const orbs = this.section.querySelectorAll('.ambient-orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.2;
            orb.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
        });
    }

    preloadHoverEffects() {
        // Preload hover states for smoother interactions
        const hoverElements = [
            this.profileCard,
            ...this.expertiseItems,
            this.primaryCta,
            this.secondaryCta
        ];

        hoverElements.forEach(element => {
            if (element) {
                element.style.willChange = 'transform, box-shadow';
            }
        });
    }

    setupAccessibility() {
        // Enhanced keyboard navigation
        const interactiveElements = [
            this.profileCtaBtn,
            this.mobileProfileBtn,
            this.primaryCta,
            this.secondaryCta,
            ...this.expertiseItems
        ];

        interactiveElements.forEach(element => {
            if (element) {
                element.setAttribute('tabindex', '0');
                element.addEventListener('focus', (e) => this.handleElementFocus(e));
                element.addEventListener('blur', (e) => this.handleElementBlur(e));
            }
        });
    }

    handleElementFocus(event) {
        event.target.style.outline = '3px solid rgba(255, 140, 0, 0.5)';
        event.target.style.outlineOffset = '2px';
    }

    handleElementBlur(event) {
        event.target.style.outline = '';
        event.target.style.outlineOffset = '';
    }

    handleKeyboardNav(event) {
        if (!this.isElementInViewport()) return;

        switch(event.key) {
            case 'Enter':
            case ' ':
                const focusedElement = document.activeElement;
                if (focusedElement && this.section.contains(focusedElement)) {
                    event.preventDefault();
                    focusedElement.click();
                }
                break;
        }
    }

    handleResize() {
        // Update parallax calculations and responsive behaviors
        this.updateParallaxEffects();
        
        // Track resize for analytics
        this.trackEvent('viewport_resized', {
            new_width: window.innerWidth,
            new_height: window.innerHeight
        });
    }

    playLuxuryHoverSound() {
        // Placeholder for luxury hover sound effect
        if (window.AudioContext && this.hasBeenViewed) {
            // Could implement subtle luxury hover sounds
        }
    }

    isElementInViewport() {
        if (!this.section) return false;
        const rect = this.section.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    getTimeOnSection() {
        return this.sectionViewTime ? Date.now() - this.sectionViewTime : 0;
    }

    trackEvent(eventName, eventData = {}) {
        // Enhanced analytics tracking
        const analyticsData = {
            event_category: 'Hermes About Section',
            event_label: eventData.source || 'general',
            custom_parameters: {
                section_state: {
                    has_been_viewed: this.hasBeenViewed,
                    interaction_count: this.interactionCount,
                    time_on_section: this.getTimeOnSection()
                },
                user_context: {
                    timestamp: Date.now(),
                    viewport_width: window.innerWidth,
                    viewport_height: window.innerHeight,
                    user_agent: navigator.userAgent.substr(0, 100)
                },
                ...eventData
            }
        };

        // Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, analyticsData);
        }

        // Custom analytics endpoint
        if (window.customAnalytics) {
            window.customAnalytics.track(eventName, analyticsData);
        }
        
        // Development logging
        console.log(`📊 Hermes About Event: ${eventName}`, analyticsData);
    }

    // Public API methods
    scrollToSection() {
        if (this.section) {
            this.section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    highlightExpertise(specialty) {
        const expertiseItem = document.querySelector(`[data-specialty="${specialty}"]`);
        if (expertiseItem) {
            expertiseItem.classList.add('highlighted');
            setTimeout(() => {
                expertiseItem.classList.remove('highlighted');
            }, 2000);
        }
    }

    getInteractionStats() {
        return {
            interactionCount: this.interactionCount,
            timeOnSection: this.getTimeOnSection(),
            hasBeenViewed: this.hasBeenViewed
        };
    }

    destroy() {
        // Clean up event listeners and timeouts
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        
        // Remove event listeners
        const elements = [
            this.profileCtaBtn,
            this.mobileProfileBtn,
            this.primaryCta,
            this.secondaryCta,
            ...this.expertiseItems
        ];

        elements.forEach(element => {
            if (element) {
                element.replaceWith(element.cloneNode(true));
            }
        });
        
        console.log('✨ Hermes About Section Destroyed');
    }
}

// Enhanced CSS animations and luxury effects
const hermesAboutLuxuryCSS = `
<style>
@keyframes luxurySpinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes hermesRipple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.animate-entrance {
    animation: luxuryEntrance 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes luxuryEntrance {
    0% {
        opacity: 0;
        transform: translateY(40px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.expertise-item.highlighted {
    transform: translateY(-8px) scale(1.02) !important;
    border-color: rgba(255, 140, 0, 0.4) !important;
    box-shadow: 0 12px 40px rgba(255, 140, 0, 0.2) !important;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

/* Focus styles for accessibility */
.hermes-about-showcase *:focus {
    outline: 3px solid rgba(255, 140, 0, 0.5) !important;
    outline-offset: 2px !important;
}

/* Performance optimizations */
.doctor-profile-luxury,
.expertise-item,
.primary-cta-luxury,
.secondary-cta-luxury {
    will-change: transform;
}

/* Luxury loading states */
.luxury-loading {
    position: relative;
    overflow: hidden;
}

.luxury-loading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 140, 0, 0.1) 50%, 
        transparent 100%);
    animation: luxuryShimmer 2s ease-in-out infinite;
}

@keyframes luxuryShimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .hermes-navigation-feedback {
        left: 10px !important;
        right: 10px !important;
        transform: translateY(-50%) !important;
        min-width: auto !important;
        max-width: calc(100vw - 20px) !important;
    }
}
</style>`;

// Initialize the Hermes About Section when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add luxury CSS animations
    document.head.insertAdjacentHTML('beforeend', hermesAboutLuxuryCSS);
    
    // Initialize about section with luxury enhancements
    if (document.querySelector('.hermes-about-showcase')) {
        window.hermesAboutSection = new HermesAboutSection();
        
        console.log('🏛️ Hermes About Experience Activated');
    }
});

// Export for external use and testing
if (typeof window !== 'undefined') {
    window.HermesAboutSection = HermesAboutSection;
}

// Performance monitoring
if ('performance' in window && 'mark' in performance) {
    performance.mark('hermes-about-script-loaded');
}

/* ========================================
   RESULTS GALLERY COMPONENT
   ======================================== */
class ResultsGallery {
    constructor() {
        this.gallery = document.querySelector('.results-showcase');
        this.filterButtons = document.querySelectorAll('.results-showcase__filter');
        this.resultItems = document.querySelectorAll('.results-showcase__item');
        this.mobileResultsBtn = document.getElementById('mobileResultsBtn');
        this.resultsCtaBtn = document.getElementById('resultsCtaBtn');
        this.activeFilter = 'all';
        
        if (this.gallery) {
            this.init();
        }
    }

    init() {
        this.initImageComparisons();
        this.initFilterSystem();
        this.bindEvents();
    }

    initImageComparisons() {
        const comparisons = document.querySelectorAll('.results-showcase__comparison');
        
        comparisons.forEach(comparison => {
            const slider = comparison.querySelector('.comparison-slider');
            const afterImage = comparison.querySelector('.comparison-image.after');
            
            if (slider && afterImage) {
                let isMouseDown = false;
                
                const updateSlider = (e) => {
                    const rect = comparison.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    
                    slider.style.left = `${percentage}%`;
                    afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                };
                
                slider.addEventListener('mousedown', (e) => {
                    isMouseDown = true;
                    updateSlider(e);
                });
                
                comparison.addEventListener('mousemove', (e) => {
                    if (isMouseDown) updateSlider(e);
                });
                
                document.addEventListener('mouseup', () => {
                    isMouseDown = false;
                });
                
                // Touch events for mobile
                slider.addEventListener('touchstart', (e) => {
                    isMouseDown = true;
                    const touch = e.touches[0];
                    updateSlider({ clientX: touch.clientX });
                }, { passive: true });
                
                comparison.addEventListener('touchmove', (e) => {
                    if (isMouseDown) {
                        e.preventDefault();
                        const touch = e.touches[0];
                        updateSlider({ clientX: touch.clientX });
                    }
                });
                
                comparison.addEventListener('touchend', () => {
                    isMouseDown = false;
                });
            }
        });
    }

    initFilterSystem() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.setActiveFilter(filter);
                this.filterResults(filter);
            });
        });
    }

    bindEvents() {
        if (this.mobileResultsBtn) {
            this.mobileResultsBtn.addEventListener('click', () => {
                this.showMobileResultsFeedback();
            });
        }

        if (this.resultsCtaBtn) {
            this.resultsCtaBtn.addEventListener('click', () => {
                this.scrollToContact();
            });
        }
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        this.filterButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.filter === filter);
        });
    }

    filterResults(filter) {
        this.resultItems.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
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

    showMobileResultsFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
            color: white; padding: 20px 32px; border-radius: 24px;
            font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
            z-index: 10000; pointer-events: none; opacity: 0;
            backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(255, 140, 0, 0.4);
            display: flex; align-items: center; gap: 12px; min-width: 280px; justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="ri-camera-line" style="font-size: 18px;"></i>
            <span>Loading full gallery...</span>
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
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }
}

/* ========================================
   CONTACT FORM COMPONENT
   ======================================== */
class LuxuryContactSection {
    constructor() {
        this.section = document.querySelector('.luxury-contact-section');
        this.isInitialized = false;
        this.observers = new Map();
        this.animationQueue = [];
        
        if (this.section) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.initScrollAnimations();
        this.initMapInteractions();
        this.initFormEnhancements();
        this.initParticleAnimations();
        this.trackUserInteractions();
        
        this.isInitialized = true;
        console.log('🏥 Luxury Contact Section Initialized');
    }

    bindEvents() {
        // Action buttons
        const actionBtns = this.section.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleActionClick(e, btn));
            btn.addEventListener('mouseenter', (e) => this.handleActionHover(e, btn));
            btn.addEventListener('mouseleave', (e) => this.handleActionLeave(e, btn));
        });

        // Emergency buttons
        const emergencyBtns = this.section.querySelectorAll('.emergency-btn');
        emergencyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleEmergencyClick(e, btn));
        });

        // Contact method cards
        const methodCards = this.section.querySelectorAll('.method-card');
        methodCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateMethodCard(card, 'enter'));
            card.addEventListener('mouseleave', () => this.animateMethodCard(card, 'leave'));
        });

        // Location and form cards
        const cards = this.section.querySelectorAll('.location-card, .form-container, .emergency-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.addCardGlow(card));
            card.addEventListener('mouseleave', () => this.removeCardGlow(card));
        });

        // Map interactions
        const mapContainer = this.section.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.addEventListener('click', () => this.handleMapClick());
        }

        // Resize handler
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));

        // Badge interactions
        const badge = this.section.querySelector('.luxury-badge');
        if (badge) {
            badge.addEventListener('mouseenter', () => this.animateBadge(badge, true));
            badge.addEventListener('mouseleave', () => this.animateBadge(badge, false));
        }
    }

    initScrollAnimations() {
        const animatedElements = this.section.querySelectorAll('[data-aos]');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
        this.observers.set('scroll', observer);

        // Title animation
        this.initTitleAnimation();
    }

    initTitleAnimation() {
        const titleAccent = this.section.querySelector('.title-accent');
        if (titleAccent) {
            // Add enhanced gradient animation
            titleAccent.style.backgroundSize = '300% 300%';
            
            // Trigger animation on scroll
            const titleObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        titleAccent.style.animation = 'gradientShift 4s ease-in-out infinite';
                        titleObserver.unobserve(entry.target);
                    }
                });
            });

            titleObserver.observe(titleAccent);
        }
    }

    initMapInteractions() {
        const mapContainer = this.section.querySelector('.map-container');
        const mapOverlay = this.section.querySelector('.map-overlay');
        
        if (mapContainer && mapOverlay) {
            // Add hover effects
            mapContainer.addEventListener('mouseenter', () => {
                mapOverlay.style.transform = 'translateY(-5px) scale(1.02)';
                mapOverlay.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
            });
            
            mapContainer.addEventListener('mouseleave', () => {
                mapOverlay.style.transform = 'translateY(0) scale(1)';
                mapOverlay.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
            });

            // Enhanced map click interaction
            mapContainer.addEventListener('click', (e) => {
                if (e.target.tagName !== 'IFRAME') {
                    this.openDirections();
                }
            });
        }
    }

    initFormEnhancements() {
        const formWrapper = this.section.querySelector('.elfsight-form-wrapper');
        if (formWrapper) {
            // Monitor for Elfsight form load
            this.waitForElfsightForm(formWrapper);
        }

        // Form container interactions
        const formContainer = this.section.querySelector('.form-container');
        if (formContainer) {
            formContainer.addEventListener('focusin', () => {
                formContainer.classList.add('form-focused');
            });
            
            formContainer.addEventListener('focusout', () => {
                formContainer.classList.remove('form-focused');
            });
        }
    }

    waitForElfsightForm(wrapper, attempts = 0) {
        const maxAttempts = 50; // 10 seconds
        
        if (attempts > maxAttempts) return;
        
        const elfsightWidget = wrapper.querySelector('[class*="elfsight"]');
        
        if (elfsightWidget) {
            this.enhanceElfsightForm(elfsightWidget);
        } else {
            setTimeout(() => {
                this.waitForElfsightForm(wrapper, attempts + 1);
            }, 200);
        }
    }

    enhanceElfsightForm(widget) {
        try {
            // Add custom styling class
            widget.classList.add('luxury-elfsight-form');
            
            // Monitor for form submission
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        // Check for success message
                        const successMessage = widget.querySelector('[class*="success"], [class*="thank"]');
                        if (successMessage) {
                            this.handleFormSuccess();
                        }
                    }
                });
            });

            observer.observe(widget, {
                childList: true,
                subtree: true
            });

            console.log('✅ Elfsight form enhanced successfully');
        } catch (error) {
            console.warn('Could not enhance Elfsight form:', error);
        }
    }

    initParticleAnimations() {
        const particles = this.section.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            // Random animation delay
            const delay = Math.random() * 25000;
            particle.style.animationDelay = `-${delay}ms`;
            
            // Random horizontal drift
            const drift = (Math.random() - 0.5) * 100;
            particle.style.setProperty('--drift', `${drift}px`);
        });
    }

    trackUserInteractions() {
        // Track phone clicks
        const phoneLinks = this.section.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('contact_phone_click', {
                    location: 'contact_section',
                    phone_number: link.href.replace('tel:', '')
                });
            });
        });

        // Track SMS clicks
        const smsLinks = this.section.querySelectorAll('a[href^="sms:"]');
        smsLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('contact_sms_click', {
                    location: 'contact_section',
                    phone_number: link.href.replace('sms:', '')
                });
            });
        });

        // Track directions clicks
        const directionsLinks = this.section.querySelectorAll('a[href*="maps.google"]');
        directionsLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('directions_click', {
                    location: 'contact_section'
                });
            });
        });
    }

    // Event Handlers
    handleActionClick(event, button) {
        event.preventDefault();
        
        // Create ripple effect
        this.createRippleEffect(button, event);
        
        // Handle navigation
        const href = button.getAttribute('href');
        if (href) {
            setTimeout(() => {
                if (href.startsWith('tel:') || href.startsWith('sms:')) {
                    window.location.href = href;
                } else if (href.includes('maps.google')) {
                    window.open(href, '_blank');
                }
            }, 200);
        }
    }

    handleActionHover(event, button) {
        const icon = button.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(15deg) scale(1.1)';
        }
    }

    handleActionLeave(event, button) {
        const icon = button.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(0deg) scale(1)';
        }
    }

    handleEmergencyClick(event, button) {
        const isCall = button.classList.contains('call');
        const isText = button.classList.contains('text');
        
        // Show feedback message
        if (isCall) {
            this.showFeedback('Initiating call...', 'ri-phone-line', '#27ae60');
        } else if (isText) {
            this.showFeedback('Opening message...', 'ri-message-3-line', '#3498db');
        }
        
        // Create click effect
        this.createButtonClickEffect(button);
    }

    handleMapClick() {
        this.showFeedback('Opening directions...', 'ri-navigation-line', '#e74c3c');
    }

    handleFormSuccess() {
        // Create success animation
        this.showSuccessAnimation();
        
        // Track form submission
        this.trackEvent('contact_form_submitted', {
            form_type: 'elfsight',
            location: 'contact_section'
        });
    }

    handleResize() {
        // Recalculate animations for mobile
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.optimizeForMobile();
        } else {
            this.optimizeForDesktop();
        }
    }

    // Animation Methods
    animateElement(element) {
        const animationType = element.dataset.aos;
        const delay = parseInt(element.dataset.aosDelay) || 0;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            
            switch (animationType) {
                case 'fade-up':
                    element.style.transform = 'translateY(0)';
                    break;
                case 'fade-down':
                    element.style.transform = 'translateY(0)';
                    break;
                case 'fade-left':
                    element.style.transform = 'translateX(0)';
                    break;
                case 'fade-right':
                    element.style.transform = 'translateX(0)';
                    break;
                default:
                    element.style.transform = 'none';
            }
        }, delay);
    }

    animateMethodCard(card, action) {
        const icon = card.querySelector('.method-icon');
        
        if (action === 'enter') {
            icon.style.transform = 'rotate(10deg) scale(1.1)';
            icon.style.background = 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)';
            icon.style.color = 'white';
        } else {
            icon.style.transform = 'rotate(0deg) scale(1)';
            icon.style.background = 'rgba(255, 140, 0, 0.1)';
            icon.style.color = '#FF8C00';
        }
    }

    animateBadge(badge, isHover) {
        const glow = badge.querySelector('.badge-glow');
        const icon = badge.querySelector('i');
        
        if (isHover) {
            if (glow) glow.style.opacity = '1';
            if (icon) icon.style.transform = 'rotate(15deg) scale(1.1)';
        } else {
            if (glow) glow.style.opacity = '0';
            if (icon) icon.style.transform = 'rotate(0deg) scale(1)';
        }
    }

    addCardGlow(card) {
        const existingGlow = card.querySelector('.card-hover-glow');
        if (!existingGlow) {
            const glow = document.createElement('div');
            glow.className = 'card-hover-glow';
            glow.style.cssText = `
                position: absolute;
                inset: 0;
                background: radial-gradient(circle at center, rgba(255, 140, 0, 0.08), transparent 70%);
                border-radius: inherit;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.5s ease;
                z-index: 1;
            `;
            card.appendChild(glow);
            
            requestAnimationFrame(() => {
                glow.style.opacity = '1';
            });
        }
    }

    removeCardGlow(card) {
        const glow = card.querySelector('.card-hover-glow');
        if (glow) {
            glow.style.opacity = '0';
            setTimeout(() => {
                if (glow.parentNode) {
                    glow.parentNode.removeChild(glow);
                }
            }, 500);
        }
    }

    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 100;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    createButtonClickEffect(button) {
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    showFeedback(message, icon, color = '#FF8C00') {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(20px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 250px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="${icon}" style="font-size: 16px;"></i>
            <span>${message}</span>
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
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }

    showSuccessAnimation() {
        const success = document.createElement('div');
        success.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            color: white;
            padding: 20px 32px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(39, 174, 96, 0.4);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            justify-content: center;
        `;
        
        success.innerHTML = `
            <div style="
                width: 24px; 
                height: 24px; 
                border-radius: 50%; 
                background: white; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                color: #27ae60;
                font-size: 14px;
            ">
                <i class="ri-check-line"></i>
            </div>
            <span>Message sent successfully! We'll contact you soon.</span>
        `;
        
        document.body.appendChild(success);
        
        requestAnimationFrame(() => {
            success.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            success.style.opacity = '1';
            success.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Confetti effect
        this.createConfettiEffect();
        
        setTimeout(() => {
            success.style.opacity = '0';
            success.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => success.remove(), 500);
        }, 4000);
    }

    createConfettiEffect() {
        const colors = ['#FF8C00', '#FFA500', '#FFD700', '#27ae60', '#3498db'];
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${color};
                top: 50%;
                left: 50%;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: confetti 2s ease-out forwards;
            `;
            
            confetti.style.setProperty('--random-x', (Math.random() - 0.5) * 400 + 'px');
            confetti.style.setProperty('--random-y', -(Math.random() * 200 + 100) + 'px');
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 2000);
        }
    }

    optimizeForMobile() {
        // Reduce particle count on mobile
        const particles = this.section.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 1) {
                particle.style.display = 'none';
            }
        });
    }

    optimizeForDesktop() {
        // Restore all particles on desktop
        const particles = this.section.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.display = '';
        });
    }

    openDirections() {
        const address = '65 West 36th Street 10th Floor New York NY 10018';
        const encodedAddress = encodeURIComponent(address);
        const url = `https://maps.google.com/?q=${encodedAddress}`;
        window.open(url, '_blank');
    }

    trackEvent(eventName, parameters = {}) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        // Facebook Pixel tracking
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, parameters);
        }
        
        // Console log for debugging
        console.log('📊 Event tracked:', eventName, parameters);
    }

    // Utility Methods
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

    // Public Methods
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remove event listeners
        // Note: In a real implementation, you'd store references to remove them
        
        this.isInitialized = false;
        console.log('🏥 Luxury Contact Section Destroyed');
    }

    refresh() {
        if (this.isInitialized) {
            this.destroy();
            this.init();
        }
    }
}

// CSS Animations (to be added to the CSS)
const additionalCSS = `
<style>
@keyframes ripple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes confetti {
    0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translate(var(--random-x), var(--random-y)) rotate(360deg);
        opacity: 0;
    }
}

.form-focused {
    border-color: rgba(255, 140, 0, 0.4) !important;
    box-shadow: 
        0 30px 100px rgba(0, 0, 0, 0.1),
        0 15px 50px rgba(255, 140, 0, 0.15) !important;
}

.luxury-elfsight-form {
    border-radius: 16px !important;
    overflow: hidden !important;
}
</style>
`;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add additional CSS
    document.head.insertAdjacentHTML('beforeend', additionalCSS);
    
    // Initialize the contact section
    window.luxuryContactSection = new LuxuryContactSection();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LuxuryContactSection;
}

/* ========================================
   SCROLL INDICATOR COMPONENT
   ======================================== */
class ScrollIndicator {
    constructor() {
        this.scrollIndicator = document.querySelector('.hero-scroll-indicator-elegant');
        
        if (this.scrollIndicator) {
            this.init();
        }
    }

    init() {
        this.scrollIndicator.addEventListener('click', () => {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

/* ========================================
   FLOATING BUTTONS JS
   ======================================== */

class HermesFloatingButtons {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTopBtn');
        this.contactFabBtn = document.getElementById('contactFabBtn');
        this.contactBackdrop = document.getElementById('contactBackdrop');
        this.mainContactBtn = this.contactFabBtn?.querySelector('.main-contact-btn');
        this.contactOptions = document.querySelectorAll('.contact-option');
        
        // State management
        this.isContactExpanded = false;
        this.isBackToTopVisible = false;
        this.scrollThreshold = 400;
        this.lastScrollY = 0;
        this.ticking = false;
        
        // Performance optimization
        this.scrollTimeout = null;
        this.resizeTimeout = null;
        
        // Interaction tracking
        this.backToTopClicks = 0;
        this.contactInteractions = {
            call: 0,
            instagram: 0,
            email: 0
        };
        
        if (this.backToTopBtn || this.contactFabBtn) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.setupScrollObserver();
        this.setupAccessibility();
        this.initializeAnimations();
        
        console.log('✨ Hermes Floating Buttons Initialized');
    }

    bindEvents() {
        // Back to Top button events
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', (e) => this.handleBackToTop(e));
            this.backToTopBtn.addEventListener('mouseenter', () => this.handleBackToTopHover());
            this.backToTopBtn.addEventListener('mouseleave', () => this.handleBackToTopLeave());
        }

        // Contact FAB events
        if (this.mainContactBtn) {
            this.mainContactBtn.addEventListener('click', (e) => this.toggleContactFab(e));
            this.mainContactBtn.addEventListener('mouseenter', () => this.handleContactFabHover());
            this.mainContactBtn.addEventListener('mouseleave', () => this.handleContactFabLeave());
        }

        // Contact backdrop
        if (this.contactBackdrop) {
            this.contactBackdrop.addEventListener('click', () => this.closeContactFab());
        }

        // Individual contact options
        this.contactOptions.forEach(option => {
            const link = option.querySelector('.contact-link');
            const contactType = option.dataset.contact;
            
            if (link && contactType) {
                link.addEventListener('click', (e) => this.handleContactClick(e, contactType));
                link.addEventListener('mouseenter', () => this.handleContactOptionHover(option));
                link.addEventListener('mouseleave', () => this.handleContactOptionLeave(option));
            }
        });

        // Global events
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
        
        // Touch events for mobile
        if ('ontouchstart' in window) {
            this.bindTouchEvents();
        }
    }

    setupScrollObserver() {
        // Optimize scroll performance with Intersection Observer
        const sentinel = document.createElement('div');
        sentinel.style.cssText = `
            position: absolute;
            top: ${this.scrollThreshold}px;
            height: 1px;
            width: 1px;
            pointer-events: none;
            visibility: hidden;
        `;
        document.body.appendChild(sentinel);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const shouldShow = !entry.isIntersecting;
                this.toggleBackToTopVisibility(shouldShow);
            });
        }, {
            rootMargin: '0px',
            threshold: 0
        });

        observer.observe(sentinel);
    }

    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateScrollState();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateScrollState() {
        const scrollY = window.pageYOffset;
        const shouldShow = scrollY > this.scrollThreshold;
        
        // Close contact FAB if scrolling and expanded
        if (this.isContactExpanded && Math.abs(scrollY - this.lastScrollY) > 100) {
            this.closeContactFab();
        }
        
        this.lastScrollY = scrollY;
    }

    toggleBackToTopVisibility(shouldShow) {
        if (shouldShow !== this.isBackToTopVisible) {
            this.isBackToTopVisible = shouldShow;
            
            if (this.backToTopBtn) {
                this.backToTopBtn.classList.toggle('visible', shouldShow);
                
                // Analytics tracking
                if (shouldShow && this.backToTopClicks === 0) {
                    this.trackEvent('back_to_top_shown', {
                        scroll_depth: Math.round((window.pageYOffset / document.body.scrollHeight) * 100)
                    });
                }
            }
        }
    }

    handleBackToTop(event) {
        event.preventDefault();
        this.backToTopClicks++;
        
        // Add click effect
        this.addClickEffect(this.backToTopBtn);
        
        // Smooth scroll to top with luxury easing
        this.smoothScrollToTop();
        
        // Track interaction
        this.trackEvent('back_to_top_clicked', {
            click_count: this.backToTopClicks,
            current_scroll_position: window.pageYOffset,
            time_on_page: this.getTimeOnPage()
        });
    }

    smoothScrollToTop() {
        const startPosition = window.pageYOffset;
        const distance = startPosition;
        const duration = Math.min(1500, Math.max(800, distance / 3)); // Dynamic duration
        let startTime = null;

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition - (distance * easeProgress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Ensure we're exactly at the top
                window.scrollTo(0, 0);
                this.onScrollComplete();
            }
        };

        requestAnimationFrame(animation);
    }

    onScrollComplete() {
        // Add subtle success feedback
        this.showScrollCompleteNotification();
        
        // Track scroll completion
        this.trackEvent('scroll_to_top_completed', {
            duration: 'smooth_scroll',
            final_position: window.pageYOffset
        });
    }

    showScrollCompleteNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        `;
        
        notification.innerHTML = `
            <i class="ri-check-line"></i>
            <span>Back to top!</span>
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => notification.remove(), 400);
        }, 2000);
    }

    toggleContactFab(event) {
        event.stopPropagation();
        
        if (this.isContactExpanded) {
            this.closeContactFab();
        } else {
            this.openContactFab();
        }
    }

    openContactFab() {
        this.isContactExpanded = true;
        this.contactFabBtn.classList.add('expanded');
        
        // Add staggered entrance animations
        this.contactOptions.forEach((option, index) => {
            setTimeout(() => {
                option.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                option.style.opacity = '1';
                option.style.visibility = 'visible';
            }, index * 100);
        });
        
        // Track expansion
        this.trackEvent('contact_fab_expanded', {
            options_count: this.contactOptions.length,
            viewport_width: window.innerWidth
        });
    }

    closeContactFab() {
        if (!this.isContactExpanded) return;
        
        this.isContactExpanded = false;
        this.contactFabBtn.classList.remove('expanded');
        
        // Reset option styles
        this.contactOptions.forEach(option => {
            option.style.transform = '';
            option.style.opacity = '';
            option.style.visibility = '';
        });
        
        // Track collapse
        this.trackEvent('contact_fab_collapsed');
    }

    handleContactClick(event, contactType) {
        // Don't prevent default - let the link work
        this.contactInteractions[contactType]++;
        
        // Add click effect
        this.addClickEffect(event.currentTarget);
        
        // Show interaction feedback
        this.showContactFeedback(contactType);
        
        // Track contact interaction
        this.trackEvent('contact_method_clicked', {
            method: contactType,
            click_count: this.contactInteractions[contactType],
            total_interactions: Object.values(this.contactInteractions).reduce((a, b) => a + b, 0),
            time_on_page: this.getTimeOnPage()
        });
        
        // Close FAB after interaction
        setTimeout(() => {
            this.closeContactFab();
        }, 500);
    }

    showContactFeedback(contactType) {
        const messages = {
            call: 'Opening phone dialer...',
            instagram: 'Opening Instagram...',
            email: 'Opening email client...'
        };

        const colors = {
            call: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            instagram: 'linear-gradient(135deg, #E1306C 0%, #C13584 50%, #833AB4 100%)',
            email: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 30px;
            background: ${colors[contactType]};
            color: white;
            padding: 12px 18px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px) scale(0.8);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            max-width: 200px;
        `;
        
        notification.innerHTML = `
            <div class="feedback-spinner" style="
                width: 12px; 
                height: 12px; 
                border: 1.5px solid rgba(255,255,255,0.3); 
                border-top: 1.5px solid white; 
                border-radius: 50%; 
                animation: spin 1s linear infinite;
            "></div>
            <span>${messages[contactType]}</span>
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0) scale(1)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px) scale(0.8)';
            setTimeout(() => notification.remove(), 400);
        }, 2500);
    }

    handleBackToTopHover() {
        this.playHoverSound();
        this.addHoverGlow(this.backToTopBtn);
    }

    handleBackToTopLeave() {
        this.removeHoverGlow(this.backToTopBtn);
    }

    handleContactFabHover() {
        this.playHoverSound();
        this.addHoverGlow(this.mainContactBtn);
    }

    handleContactFabLeave() {
        this.removeHoverGlow(this.mainContactBtn);
    }

    handleContactOptionHover(option) {
        this.playHoverSound();
        this.addHoverGlow(option.querySelector('.contact-link'));
    }

    handleContactOptionLeave(option) {
        this.removeHoverGlow(option.querySelector('.contact-link'));
    }

    addClickEffect(element) {
        element.style.transform = element.style.transform + ' scale(0.95)';
        
        setTimeout(() => {
            element.style.transform = element.style.transform.replace(' scale(0.95)', '');
        }, 150);
        
        // Add ripple effect
        this.createRippleEffect(element);
    }

    createRippleEffect(element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: rippleEffect 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            pointer-events: none;
            z-index: 100;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    addHoverGlow(element) {
        const glowDiv = element.querySelector('.btn-ambient-glow, .option-ambient-glow');
        if (glowDiv) {
            glowDiv.style.opacity = '1';
        }
    }

    removeHoverGlow(element) {
        const glowDiv = element.querySelector('.btn-ambient-glow, .option-ambient-glow');
        if (glowDiv) {
            glowDiv.style.opacity = '0';
        }
    }

    bindTouchEvents() {
        // Enhanced touch support for mobile
        if (this.mainContactBtn) {
            this.mainContactBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.addClickEffect(this.mainContactBtn);
            }, { passive: false });
        }

        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.addClickEffect(this.backToTopBtn);
            }, { passive: false });
        }
    }

    setupAccessibility() {
        // Enhanced keyboard navigation
        const focusableElements = [
            this.backToTopBtn,
            this.mainContactBtn,
            ...Array.from(document.querySelectorAll('.contact-link'))
        ];

        focusableElements.forEach(element => {
            if (element) {
                element.setAttribute('tabindex', '0');
                element.addEventListener('focus', (e) => this.handleElementFocus(e));
                element.addEventListener('blur', (e) => this.handleElementBlur(e));
            }
        });

        // ARIA labels
        if (this.backToTopBtn) {
            this.backToTopBtn.setAttribute('aria-label', 'Scroll back to top of page');
            this.backToTopBtn.setAttribute('role', 'button');
        }

        if (this.mainContactBtn) {
            this.mainContactBtn.setAttribute('aria-label', 'Open contact options menu');
            this.mainContactBtn.setAttribute('role', 'button');
            this.mainContactBtn.setAttribute('aria-expanded', 'false');
        }
    }

    handleElementFocus(event) {
        event.target.style.outline = '3px solid rgba(255, 140, 0, 0.6)';
        event.target.style.outlineOffset = '2px';
    }

    handleElementBlur(event) {
        event.target.style.outline = '';
        event.target.style.outlineOffset = '';
    }

    handleKeyboard(event) {
        switch(event.key) {
            case 'Escape':
                if (this.isContactExpanded) {
                    this.closeContactFab();
                }
                break;
                
            case 'Enter':
            case ' ':
                const focusedElement = document.activeElement;
                if (focusedElement === this.backToTopBtn) {
                    event.preventDefault();
                    this.handleBackToTop(event);
                } else if (focusedElement === this.mainContactBtn) {
                    event.preventDefault();
                    this.toggleContactFab(event);
                }
                break;
        }
    }

    handleDocumentClick(event) {
        // Close contact FAB if clicking outside
        if (this.isContactExpanded && 
            !this.contactFabBtn.contains(event.target)) {
            this.closeContactFab();
        }
    }

    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Close contact FAB on resize to prevent positioning issues
            if (this.isContactExpanded) {
                this.closeContactFab();
            }
            
            // Track resize
            this.trackEvent('floating_buttons_resized', {
                new_width: window.innerWidth,
                new_height: window.innerHeight
            });
        }, 250);
    }

    initializeAnimations() {
        // Add entrance animation delay
        setTimeout(() => {
            if (this.backToTopBtn) {
                this.backToTopBtn.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            if (this.contactFabBtn) {
                this.contactFabBtn.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        }, 500);
    }

    playHoverSound() {
        // Placeholder for subtle hover sound effect
        if (window.AudioContext && 'createOscillator' in AudioContext.prototype) {
            // Could implement subtle luxury hover sounds
        }
    }

    getTimeOnPage() {
        return Date.now() - (window.pageLoadTime || Date.now());
    }

    trackEvent(eventName, eventData = {}) {
        // Enhanced analytics tracking
        const analyticsData = {
            event_category: 'Hermes Floating Buttons',
            event_label: eventData.method || 'general',
            custom_parameters: {
                button_state: {
                    back_to_top_visible: this.isBackToTopVisible,
                    contact_expanded: this.isContactExpanded,
                    back_to_top_clicks: this.backToTopClicks,
                    contact_interactions: this.contactInteractions
                },
                user_context: {
                    timestamp: Date.now(),
                    viewport_width: window.innerWidth,
                    viewport_height: window.innerHeight,
                    scroll_position: window.pageYOffset,
                    page_height: document.body.scrollHeight
                },
                ...eventData
            }
        };

        // Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, analyticsData);
        }

        // Custom analytics endpoint
        if (window.customAnalytics) {
            window.customAnalytics.track(eventName, analyticsData);
        }
        
        // Development logging
        console.log(`📊 Floating Buttons Event: ${eventName}`, analyticsData);
    }

    // Public API methods
    showBackToTop() {
        this.toggleBackToTopVisibility(true);
    }

    hideBackToTop() {
        this.toggleBackToTopVisibility(false);
    }

    openContactMenu() {
        if (!this.isContactExpanded) {
            this.openContactFab();
        }
    }

    closeContactMenu() {
        if (this.isContactExpanded) {
            this.closeContactFab();
        }
    }

    getInteractionStats() {
        return {
            backToTopClicks: this.backToTopClicks,
            contactInteractions: { ...this.contactInteractions },
            isContactExpanded: this.isContactExpanded,
            isBackToTopVisible: this.isBackToTopVisible
        };
    }

    destroy() {
        // Clean up event listeners and timeouts
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyboard);
        document.removeEventListener('click', this.handleDocumentClick);
        
        console.log('✨ Hermes Floating Buttons Destroyed');
    }
}

// CSS animations to add
const hermesFloatingCSS = `
<style>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes rippleEffect {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

/* Smooth transitions for reduced motion */
@media (prefers-reduced-motion: reduce) {
    .hermes-back-to-top,
    .main-contact-btn,
    .contact-option {
        transition-duration: 0.2s !important;
        animation-duration: 0.2s !important;
    }
    
    .main-contact-btn {
        animation: none !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .hermes-back-to-top,
    .main-contact-btn,
    .contact-link {
        border-width: 3px !important;
        border-color: currentColor !important;
    }
}
</style>`;

// Initialize Hermes Floating Buttons when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS animations
    document.head.insertAdjacentHTML('beforeend', hermesFloatingCSS);
    
    // Set page load time for analytics
    window.pageLoadTime = Date.now();
    
    // Initialize floating buttons
    if (document.querySelector('.hermes-floating-controls')) {
        window.hermesFloatingButtons = new HermesFloatingButtons();
        
        console.log('🏛️ Hermes Floating Controls Activated');
    }
});

// Export for external use and testing
if (typeof window !== 'undefined') {
    window.HermesFloatingButtons = HermesFloatingButtons;
}

// Performance monitoring
if ('performance' in window && 'mark' in performance) {
    performance.mark('hermes-floating-buttons-loaded');
}


/* ========================================
   INITIALIZE APPLICATION
   ======================================== */
// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.eviaApp = new EviaAestheticsApp();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EviaAestheticsApp;
}
