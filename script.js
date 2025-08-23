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
        this.components.set('servicesCarousel', new HermesServicesCarousel()); // New carousel
        this.components.set('aboutSection', new HermesAboutSection());
        this.components.set('resultsGallery', new ResultsGallery());
        this.components.set('contactForm', new LuxuryContactSection());
        this.components.set('scrollIndicator', new ScrollIndicator());
        this.components.set('floatingButtons', new HermesFloatingButtons());
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
            link.addEventListener('mouseenter', () => this.onNavHover(link));
        });

        // Scroll handling
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    handleNavClick(e, link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(`#${targetId}`);
        
        // Track navigation
        this.trackNavigation(targetId);
    }

    onNavHover(link) {
        // Add subtle hover effects
        link.style.transform = 'translateY(-1px)';
        setTimeout(() => {
            link.style.transform = 'translateY(0)';
        }, 200);
    }

    toggleMobileMenu() {
        if (window.eviaApp && window.eviaApp.getComponent('mobileMenu')) {
            window.eviaApp.getComponent('mobileMenu').toggleMenu();
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

    trackNavigation(section) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'navigation_click', {
                'event_category': 'Header Navigation',
                'event_label': section
            });
        }
    }

    initializeAnimations() {
        // Add luxury entrance animations
        if (this.header) {
            this.header.style.opacity = '0';
            this.header.style.transform = 'translateY(-100%)';
            
            setTimeout(() => {
                this.header.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.header.style.opacity = '1';
                this.header.style.transform = 'translateY(0)';
            }, 500);
        }
    }
}

/* ========================================
   MOBILE MENU COMPONENT
   ======================================== */
class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu-overlay');
        this.isOpen = false;
        
        if (this.menuToggle && this.mobileMenu) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        console.log('📱 Mobile Menu Initialized');
    }

    bindEvents() {
        // Toggle button
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on links
        const menuLinks = this.mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleMenuLinkClick(e, link);
            });
        });
        
        // Close menu when clicking overlay
        this.mobileMenu.addEventListener('click', (e) => {
            if (e.target === this.mobileMenu) {
                this.closeMenu();
            }
        });
        
        // Escape key to close
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
        this.mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-link');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    closeMenu() {
        this.isOpen = false;
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset menu items
        const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-link');
        menuItems.forEach(item => {
            item.style.opacity = '';
            item.style.transform = '';
        });
    }

    handleMenuLinkClick(e, link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        this.closeMenu();
        
        // Navigate after menu closes
        setTimeout(() => {
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.luxury-floating-header')?.offsetHeight || 80;
                    const elementPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                window.location.href = href;
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
   NEW HERMES SERVICES CAROUSEL COMPONENT
   ======================================== */

class HermesServicesCarousel {
    constructor() {
        // DOM Elements
        this.carousel = document.getElementById('servicesCarousel');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentCounter = document.querySelector('.counter-current');
        this.totalCounter = document.querySelector('.counter-total');
        this.progressFill = document.getElementById('progressFill');
        this.progressDots = document.querySelectorAll('.progress-dot');
        
        // Carousel State
        this.currentIndex = 0;
        this.totalSlides = 0;
        this.slideWidth = 0;
        this.gap = 30;
        this.isTransitioning = false;
        this.autoplayInterval = null;
        this.isAutoplayActive = true;
        this.autoplayDelay = 5000;
        
        // Touch/Swipe handling
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        this.isScrolling = false;
        this.isDragging = false;
        
        // Responsive breakpoints
        this.breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1200
        };
        
        // Performance optimization
        this.resizeTimeout = null;
        this.throttleTimeout = null;
        
        if (this.carousel && this.track) {
            this.init();
        }
    }
    
    init() {
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateUI();
        this.startAutoplay();
        
        // Initialize with first slide
        this.goToSlide(0, false);
        
        console.log('✨ Hermes Services Carousel initialized');
    }
    
    calculateDimensions() {
        const slides = this.track.querySelectorAll('.hermes-service-card');
        this.totalSlides = slides.length;
        
        if (this.totalSlides === 0) return;
        
        // Update total counter
        if (this.totalCounter) {
            this.totalCounter.textContent = this.totalSlides;
        }
        
        // Calculate slide width based on viewport
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth <= this.breakpoints.mobile) {
            this.slideWidth = 280;
            this.gap = 20;
        } else if (viewportWidth <= this.breakpoints.tablet) {
            this.slideWidth = 320;
            this.gap = 24;
        } else if (viewportWidth <= this.breakpoints.desktop) {
            this.slideWidth = 360;
            this.gap = 30;
        } else {
            this.slideWidth = 400;
            this.gap = 30;
        }
        
        // Set slide dimensions
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${this.slideWidth}px`;
        });
        
        console.log(`Carousel dimensions: slideWidth=${this.slideWidth}, gap=${this.gap}, totalSlides=${this.totalSlides}`);
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Progress dots
        this.progressDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Touch/Swipe events
        if (this.track) {
            // Touch events
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
            
            // Mouse events for desktop dragging
            this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.track.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.track.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
            
            // Prevent text selection while dragging
            this.track.addEventListener('selectstart', (e) => e.preventDefault());
        }
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Pause autoplay on hover
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else if (this.isAutoplayActive) {
                this.startAutoplay();
            }
        });
        
        // Booking buttons
        const bookingButtons = document.querySelectorAll('.secondary-cta');
        bookingButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleBookingClick(e));
        });
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isScrolling = false;
        this.isDragging = true;
        this.pauseAutoplay();
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = Math.abs(touchX - this.touchStartX);
        const deltaY = Math.abs(touchY - this.touchStartY);
        
        // Determine if user is scrolling vertically or swiping horizontally
        if (!this.isScrolling && deltaY > deltaX) {
            this.isScrolling = true;
            this.isDragging = false;
            return;
        }
        
        if (!this.isScrolling && deltaX > 10) {
            e.preventDefault(); // Prevent vertical scrolling when swiping horizontally
        }
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging || this.isScrolling) {
            this.isDragging = false;
            this.startAutoplay();
            return;
        }
        
        this.touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) > this.minSwipeDistance) {
            if (swipeDistance > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
        
        this.isDragging = false;
        this.startAutoplay();
    }
    
    handleMouseDown(e) {
        this.touchStartX = e.clientX;
        this.isDragging = true;
        this.pauseAutoplay();
        e.preventDefault();
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
    }
    
    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.touchEndX = e.clientX;
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) > this.minSwipeDistance) {
            if (swipeDistance > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
        
        this.isDragging = false;
        this.startAutoplay();
    }
    
    handleKeyDown(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.previousSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextSlide();
        }
    }
    
    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.calculateDimensions();
            this.goToSlide(this.currentIndex, false);
        }, 150);
    }
    
    previousSlide() {
        if (this.isTransitioning) return;
        
        const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.totalSlides - 1;
        this.goToSlide(newIndex);
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        const newIndex = this.currentIndex < this.totalSlides - 1 ? this.currentIndex + 1 : 0;
        this.goToSlide(newIndex);
    }
    
    goToSlide(index, animate = true) {
        if (index < 0 || index >= this.totalSlides || this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        
        // Calculate transform value
        const translateX = -(index * (this.slideWidth + this.gap));
        
        // Apply transform
        if (this.track) {
            if (animate) {
                this.track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            } else {
                this.track.style.transition = 'none';
            }
            
            this.track.style.transform = `translateX(${translateX}px)`;
        }
        
        // Update UI
        this.updateUI();
        
        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, animate ? 600 : 0);
        
        // Analytics tracking
        this.trackSlideView(index);
    }
    
    updateUI() {
        // Update counter
        if (this.currentCounter) {
            this.currentCounter.textContent = this.currentIndex + 1;
        }
        
        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = false;
            this.prevBtn.style.opacity = '1';
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = false;
            this.nextBtn.style.opacity = '1';
        }
        
        // Update progress bar
        if (this.progressFill) {
            const progressPercentage = ((this.currentIndex + 1) / this.totalSlides) * 100;
            this.progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Update progress dots
        this.progressDots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    startAutoplay() {
        if (!this.isAutoplayActive) return;
        
        this.pauseAutoplay(); // Clear any existing interval
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isDragging && !this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoplayDelay);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    handleBookingClick(e) {
        const button = e.currentTarget;
        const service = button.getAttribute('data-service');
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Track booking click
        this.trackBookingClick(service);
        
        // Here you would typically open a booking modal or redirect
        console.log(`Booking clicked for service: ${service}`);
        
        // Example: Open booking modal (you would implement this)
        // this.openBookingModal(service);
    }
    
    trackSlideView(index) {
        // Analytics tracking for slide views
        if (typeof gtag !== 'undefined') {
            gtag('event', 'carousel_slide_view', {
                'event_category': 'Services Carousel',
                'event_label': `Slide ${index + 1}`,
                'value': index
            });
        }
        
        console.log(`Slide ${index + 1} viewed`);
    }
    
    trackBookingClick(service) {
        // Analytics tracking for booking clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'booking_click', {
                'event_category': 'Services',
                'event_label': service,
                'value': 1
            });
        }
        
        console.log(`Booking clicked for: ${service}`);
    }
    
    // Public methods
    destroy() {
        this.pauseAutoplay();
        
        // Remove event listeners
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.previousSlide);
        }
        
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.nextSlide);
        }
        
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyDown);
        
        console.log('Hermes Services Carousel destroyed');
    }
    
    goTo(index) {
        this.goToSlide(index);
    }
    
    setAutoplay(enabled) {
        this.isAutoplayActive = enabled;
        if (enabled) {
            this.startAutoplay();
        } else {
            this.pauseAutoplay();
        }
    }

    onResize() {
        this.handleResize();
    }
}

/* ========================================
   ABOUT SECTION COMPONENT
   ======================================== */
class HermesAboutSection {
    constructor() {
        this.section = document.querySelector('.hermes-about-showcase');
        this.profileCard = document.querySelector('.doctor-profile-luxury');
        this.ctaButtons = document.querySelectorAll('.hermes-about-cta');
        
        if (this.section) {
            this.init();
        }
    }

    init() {
        this.setupInteractions();
        this.initializeAnimations();
        console.log('👩‍⚕️ About Section Initialized');
    }

    setupInteractions() {
        // Profile card hover effects
        if (this.profileCard) {
            this.profileCard.addEventListener('mouseenter', () => this.onProfileHover());
            this.profileCard.addEventListener('mouseleave', () => this.onProfileLeave());
        }

        // CTA button interactions
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleCtaClick(e, button));
        });
    }

    onProfileHover() {
        if (this.profileCard) {
            this.profileCard.style.transform = 'translateY(-5px) scale(1.02)';
        }
    }

    onProfileLeave() {
        if (this.profileCard) {
            this.profileCard.style.transform = 'translateY(0) scale(1)';
        }
    }

    handleCtaClick(e, button) {
        const href = button.getAttribute('href');
        
        // Add click animation
        button.style.transform = 'scale(0.98)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Track CTA clicks
        this.trackCtaClick(button);
    }

    trackCtaClick(button) {
        const ctaType = button.textContent.trim();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'about_cta_click', {
                'event_category': 'About Section',
                'event_label': ctaType
            });
        }
        
        console.log(`About CTA clicked: ${ctaType}`);
    }

    initializeAnimations() {
        // Add entrance animations for about section
        if (this.section) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(this.section);
        }
    }
}

/* ========================================
   ABOUT SECTION COMPONENT
   ======================================== */
class HermesAboutSection {
    constructor() {
        this.section = document.querySelector('.hermes-about-showcase');
        this.profileCard = document.querySelector('.doctor-profile-luxury');
        this.ctaButtons = document.querySelectorAll('.hermes-about-cta');
        
        if (this.section) {
            this.init();
        }
    }

    init() {
        this.setupInteractions();
        this.initializeAnimations();
        console.log('👩‍⚕️ About Section Initialized');
    }

    setupInteractions() {
        // Profile card hover effects
        if (this.profileCard) {
            this.profileCard.addEventListener('mouseenter', () => this.onProfileHover());
            this.profileCard.addEventListener('mouseleave', () => this.onProfileLeave());
        }

        // CTA button interactions
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleCtaClick(e, button));
        });
    }

    onProfileHover() {
        if (this.profileCard) {
            this.profileCard.style.transform = 'translateY(-5px) scale(1.02)';
        }
    }

    onProfileLeave() {
        if (this.profileCard) {
            this.profileCard.style.transform = 'translateY(0) scale(1)';
        }
    }

    handleCtaClick(e, button) {
        const href = button.getAttribute('href');
        
        // Add click animation
        button.style.transform = 'scale(0.98)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Track CTA clicks
        this.trackCtaClick(button);
    }

    trackCtaClick(button) {
        const ctaType = button.textContent.trim();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'about_cta_click', {
                'event_category': 'About Section',
                'event_label': ctaType
            });
        }
        
        console.log(`About CTA clicked: ${ctaType}`);
    }

    initializeAnimations() {
        // Add entrance animations for about section
        if (this.section) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(this.section);
        }
    }
}

/* ========================================
   LUXURY CONTACT SECTION COMPONENT
   ======================================== */
class LuxuryContactSection {
    constructor() {
        this.form = document.querySelector('.luxury-contact-form');
        this.inputs = document.querySelectorAll('.luxury-form-input input, .luxury-form-input textarea');
        this.submitBtn = document.querySelector('.luxury-submit-btn');
        this.phoneBtn = document.querySelector('.phone-action');
        this.textBtn = document.querySelector('.text-action');
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupFormValidation();
        this.setupInteractions();
        console.log('📧 Luxury Contact Form Initialized');
    }

    setupFormValidation() {
        this.inputs.forEach(input => {
            input.addEventListener('focus', () => this.onInputFocus(input));
            input.addEventListener('blur', () => this.onInputBlur(input));
            input.addEventListener('input', () => this.validateInput(input));
        });

        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    setupInteractions() {
        if (this.phoneBtn) {
            this.phoneBtn.addEventListener('click', () => this.trackPhoneClick());
        }
        
        if (this.textBtn) {
            this.textBtn.addEventListener('click', () => this.trackTextClick());
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        const inputGroup = input.parentElement;
        
        // Remove previous validation classes
        inputGroup.classList.remove('error', 'valid');
        
        if (value.length > 0) {
            if (input.type === 'email' && !this.isValidEmail(value)) {
                inputGroup.classList.add('error');
            } else {
                inputGroup.classList.add('valid');
            }
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        this.inputs.forEach(input => {
            this.validateInput(input);
            if (input.parentElement.classList.contains('error') || input.value.trim() === '') {
                isValid = false;
            }
        });

        if (isValid) {
            this.showSuccessMessage();
        } else {
            this.showErrorMessage();
        }
    }

    showSuccessMessage() {
        const feedback = document.createElement('div');
        feedback.className = 'contact-feedback success';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95));
            color: white;
            padding: 24px 32px;
            border-radius: 16px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 40px rgba(34, 197, 94, 0.3);
            z-index: 10000;
            opacity: 0;
            text-align: center;
            font-weight: 600;
        `;
        
        feedback.innerHTML = `
            <i class="ri-check-line" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
            <span>Thank you! We'll contact you soon.</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Reset form
        this.form.reset();
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 4000);
    }

    showErrorMessage() {
        const feedback = document.createElement('div');
        feedback.className = 'contact-feedback error';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95));
            color: white;
            padding: 24px 32px;
            border-radius: 16px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 40px rgba(239, 68, 68, 0.3);
            z-index: 10000;
            opacity: 0;
            text-align: center;
            font-weight: 600;
        `;
        
        feedback.innerHTML = `
            <i class="ri-error-warning-line" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
            <span>Please fill in all required fields correctly.</span>
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
        }, 3000);
    }

    onInputFocus(input) {
        input.parentElement.classList.add('focused');
    }

    onInputBlur(input) {
        input.parentElement.classList.remove('focused');
    }

    trackPhoneClick() {
        console.log('Phone call initiated');
        // Add analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_click', {
                'event_category': 'Contact',
                'event_label': 'Phone Call'
            });
        }
    }

    trackTextClick() {
        console.log('Text message initiated');
        // Add analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'text_click', {
                'event_category': 'Contact',
                'event_label': 'Text Message'
            });
        }
    }
}

/* ========================================
   HERMES FLOATING BUTTONS COMPONENT
   ======================================== */
class HermesFloatingButtons {
    constructor() {
        this.isContactMenuOpen = false;
        this.isBackToTopVisible = false;
        this.scrollThreshold = 400;
        this.lastScrollY = 0;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.createFloatingButtons();
        this.setupEventListeners();
        this.setupScrollObserver();
        
        console.log('🏛️ Hermes Floating Buttons Initialized');
    }
    
    createFloatingButtons() {
        // Create the floating controls container
        const floatingControls = document.createElement('div');
        floatingControls.className = 'hermes-floating-controls';
        floatingControls.innerHTML = `
            <!-- Back to Top Button -->
            <div class="hermes-back-to-top" id="backToTop">
                <div class="btn-corner-ornaments">
                    <div class="corner-ornament tl"></div>
                    <div class="corner-ornament tr"></div>
                    <div class="corner-ornament bl"></div>
                    <div class="corner-ornament br"></div>
                </div>
                <div class="btn-glow-ring"></div>
                <i class="ri-arrow-up-line"></i>
                <div class="success-notification" id="topNotification">
                    <i class="ri-check-line"></i>
                    <span>Top Reached!</span>
                </div>
            </div>
            
            <!-- Contact Fan-Out Menu -->
            <div class="hermes-contact-menu" id="contactMenu">
                <!-- Contact Options (Hidden by default) -->
                <div class="contact-options" id="contactOptions">
                    <a href="tel:+12016394983" class="contact-link call-option" data-contact="phone">
                        <div class="contact-corner-ornaments">
                            <div class="corner-ornament tl"></div>
                            <div class="corner-ornament tr"></div>
                            <div class="corner-ornament bl"></div>
                            <div class="corner-ornament br"></div>
                        </div>
                        <i class="ri-phone-fill"></i>
                        <div class="contact-tooltip">
                            <span>(201) 639-4983</span>
                            <div class="tooltip-arrow"></div>
                        </div>
                    </a>
                    
                    <a href="https://www.instagram.com/eviaesthetics/?hl=en" target="_blank" class="contact-link instagram-option" data-contact="instagram">
                        <div class="contact-corner-ornaments">
                            <div class="corner-ornament tl"></div>
                            <div class="corner-ornament tr"></div>
                            <div class="corner-ornament bl"></div>
                            <div class="corner-ornament br"></div>
                        </div>
                        <i class="ri-instagram-line"></i>
                        <div class="contact-tooltip">
                            <span>@eviaesthetics</span>
                            <div class="tooltip-arrow"></div>
                        </div>
                    </a>
                    
                    <a href="mailto:info@eviaesthetics.com" class="contact-link email-option" data-contact="email">
                        <div class="contact-corner-ornaments">
                            <div class="corner-ornament tl"></div>
                            <div class="corner-ornament tr"></div>
                            <div class="corner-ornament bl"></div>
                            <div class="corner-ornament br"></div>
                        </div>
                        <i class="ri-mail-fill"></i>
                        <div class="contact-tooltip">
                            <span>info@eviaesthetics.com</span>
                            <div class="tooltip-arrow"></div>
                        </div>
                    </a>
                </div>
                
                <!-- Main Contact Button -->
                <button class="main-contact-btn" id="mainContactBtn">
                    <div class="btn-corner-ornaments">
                        <div class="corner-ornament tl"></div>
                        <div class="corner-ornament tr"></div>
                        <div class="corner-ornament bl"></div>
                        <div class="corner-ornament br"></div>
                    </div>
                    <div class="btn-glow-ring"></div>
                    <div class="btn-pulse-ring"></div>
                    <i class="ri-customer-service-2-fill"></i>
                </button>
                
                <!-- Backdrop -->
                <div class="contact-backdrop" id="contactBackdrop"></div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(floatingControls);
        
        // Add CSS styles
        this.addFloatingButtonsCSS();
    }
    
    addFloatingButtonsCSS() {
        const css = `
            <style>
            .hermes-floating-controls {
                position: fixed;
                bottom: 32px;
                left: 0;
                right: 0;
                pointer-events: none;
                z-index: 9999;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                padding: 0 32px;
            }
            
            .hermes-back-to-top {
                position: relative;
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.95) 0%,
                    rgba(250, 248, 245, 0.9) 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                pointer-events: all;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(212, 175, 139, 0.2);
                opacity: 0;
                visibility: hidden;
                transform: translateY(100px) scale(0.8);
            }
            
            .hermes-back-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }
            
            .hermes-back-to-top:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 15px 35px rgba(212, 175, 139, 0.3);
            }
            
            .hermes-back-to-top i {
                color: #D4AF8B;
                font-size: 20px;
                z-index: 2;
            }
            
            .hermes-contact-menu {
                position: relative;
                pointer-events: all;
            }
            
            .main-contact-btn {
                position: relative;
                width: 64px;
                height: 64px;
                background: linear-gradient(135deg, #D4AF8B 0%, #B8956A 100%);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: gentlePulse 3s ease-in-out infinite;
            }
            
            .main-contact-btn:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 15px 35px rgba(212, 175, 139, 0.4);
            }
            
            .main-contact-btn i {
                color: white;
                font-size: 24px;
                z-index: 2;
            }
            
            .contact-options {
                position: absolute;
                bottom: 80px;
                right: 0;
                display: flex;
                flex-direction: column;
                gap: 16px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .contact-options.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .contact-link {
                position: relative;
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.95) 0%,
                    rgba(250, 248, 245, 0.9) 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(212, 175, 139, 0.2);
                transform: scale(0.8);
            }
            
            .contact-options.active .contact-link {
                transform: scale(1);
            }
            
            .contact-link:hover {
                transform: translateY(-2px) scale(1.1);
                box-shadow: 0 10px 25px rgba(212, 175, 139, 0.3);
            }
            
            .contact-link i {
                font-size: 18px;
                z-index: 2;
            }
            
            .call-option i { color: #22c55e; }
            .instagram-option i { color: #e11d48; }
            .email-option i { color: #3b82f6; }
            
            .contact-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(4px);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: -1;
            }
            
            .contact-backdrop.active {
                opacity: 1;
                visibility: visible;
            }
            
            /* Corner Ornaments */
            .btn-corner-ornaments,
            .contact-corner-ornaments {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
            }
            
            .corner-ornament {
                position: absolute;
                width: 12px;
                height: 12px;
                border: 1.5px solid rgba(212, 175, 139, 0.6);
                transition: all 0.3s ease;
            }
            
            .corner-ornament.tl {
                top: 6px;
                left: 6px;
                border-bottom: none;
                border-right: none;
                border-top-left-radius: 2px;
            }
            
            .corner-ornament.tr {
                top: 6px;
                right: 6px;
                border-bottom: none;
                border-left: none;
                border-top-right-radius: 2px;
            }
            
            .corner-ornament.bl {
                bottom: 6px;
                left: 6px;
                border-top: none;
                border-right: none;
                border-bottom-left-radius: 2px;
            }
            
            .corner-ornament.br {
                bottom: 6px;
                right: 6px;
                border-top: none;
                border-left: none;
                border-bottom-right-radius: 2px;
            }
            
            .hermes-back-to-top:hover .corner-ornament,
            .main-contact-btn:hover .corner-ornament,
            .contact-link:hover .corner-ornament {
                border-color: rgba(212, 175, 139, 0.8);
                transform: scale(1.1);
            }
            
            /* Glow Effects */
            .btn-glow-ring {
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: radial-gradient(circle, 
                    rgba(212, 175, 139, 0.4) 0%,
                    transparent 70%);
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1;
            }
            
            .hermes-back-to-top:hover .btn-glow-ring,
            .main-contact-btn:hover .btn-glow-ring {
                opacity: 1;
            }
            
            .btn-pulse-ring {
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border: 2px solid rgba(212, 175, 139, 0.3);
                border-radius: 50%;
                animation: pulseRing 2s ease-in-out infinite;
                z-index: 1;
            }
            
            /* Success Notification */
            .success-notification {
                position: absolute;
                top: -50px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95));
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                font-weight: 600;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                backdrop-filter: blur(20px);
                z-index: 3;
            }
            
            .success-notification.show {
                opacity: 1;
                visibility: visible;
                transform: translateX(-50%) translateY(-10px);
            }
            
            /* Tooltips */
            .contact-tooltip {
                position: absolute;
                right: 60px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                backdrop-filter: blur(20px);
                z-index: 4;
            }
            
            .contact-link:hover .contact-tooltip {
                opacity: 1;
                visibility: visible;
                transform: translateY(-50%) translateX(-5px);
            }
            
            .tooltip-arrow {
                position: absolute;
                right: -4px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-left: 4px solid rgba(0, 0, 0, 0.8);
                border-top: 4px solid transparent;
                border-bottom: 4px solid transparent;
            }
            
            /* Animations */
            @keyframes gentlePulse {
                0%, 100% {
                    box-shadow: 0 8px 25px rgba(212, 175, 139, 0.3);
                }
                50% {
                    box-shadow: 0 12px 35px rgba(212, 175, 139, 0.4);
                }
            }
            
            @keyframes pulseRing {
                0% {
                    transform: scale(1);
                    opacity: 0.6;
                }
                100% {
                    transform: scale(1.3);
                    opacity: 0;
                }
            }
            
            /* Mobile Responsive */
            @media (max-width: 768px) {
                .hermes-floating-controls {
                    padding: 0 20px;
                    bottom: 24px;
                }
                
                .hermes-back-to-top {
                    width: 48px;
                    height: 48px;
                }
                
                .main-contact-btn {
                    width: 56px;
                    height: 56px;
                }
                
                .contact-tooltip {
                    display: none;
                }
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .hermes-back-to-top,
                .main-contact-btn,
                .contact-link {
                    border-width: 2px !important;
                    border-color: currentColor !important;
                }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .hermes-back-to-top,
                .main-contact-btn,
                .contact-link {
                    transition-duration: 0.1s !important;
                    animation: none !important;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', css);
    }
    
    setupEventListeners() {
        // Back to top button
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => this.scrollToTop());
        }
        
        // Main contact button
        const mainContactBtn = document.getElementById('mainContactBtn');
        if (mainContactBtn) {
            mainContactBtn.addEventListener('click', () => this.toggleContactMenu());
        }
        
        // Contact options
        const contactOptions = document.querySelectorAll('.contact-link');
        contactOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleContactClick(e, option));
        });
        
        // Close menu when clicking backdrop
        const backdrop = document.getElementById('contactBackdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeContactMenu());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
    }
    
    setupScrollObserver() {
        // Use Intersection Observer for better performance
        const scrollTrigger = document.createElement('div');
        scrollTrigger.style.cssText = `
            position: absolute;
            top: ${this.scrollThreshold}px;
            height: 1px;
            width: 1px;
            pointer-events: none;
        `;
        document.body.appendChild(scrollTrigger);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.toggleBackToTopVisibility(!entry.isIntersecting);
            });
        });
        
        observer.observe(scrollTrigger);
    }
    
    toggleBackToTopVisibility(visible) {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        if (visible !== this.isBackToTopVisible) {
            this.isBackToTopVisible = visible;
            
            if (visible) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }
    
    scrollToTop() {
        const duration = 1000;
        const startPosition = window.pageYOffset;
        const startTime = performance.now();
        
        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        
        const animation = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition * (1 - easedProgress));
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                this.showSuccessNotification();
            }
        };
        
        requestAnimationFrame(animation);
        
        // Track analytics
        this.trackButtonClick('back_to_top');
    }
    
    showSuccessNotification() {
        const notification = document.getElementById('topNotification');
        if (notification) {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        }
    }
    
    toggleContactMenu() {
        if (this.isContactMenuOpen) {
            this.closeContactMenu();
        } else {
            this.openContactMenu();
        }
    }
    
    openContactMenu() {
        this.isContactMenuOpen = true;
        
        const contactOptions = document.getElementById('contactOptions');
        const backdrop = document.getElementById('contactBackdrop');
        const mainBtn = document.getElementById('mainContactBtn');
        
        if (contactOptions) contactOptions.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
        if (mainBtn) mainBtn.style.transform = 'rotate(45deg)';
        
        // Stagger animations for contact options
        const options = contactOptions?.querySelectorAll('.contact-link');
        options?.forEach((option, index) => {
            setTimeout(() => {
                option.style.transform = 'scale(1) translateY(0)';
                option.style.opacity = '1';
            }, index * 100);
        });
        
        this.trackButtonClick('contact_menu_open');
    }
    
    closeContactMenu() {
        this.isContactMenuOpen = false;
        
        const contactOptions = document.getElementById('contactOptions');
        const backdrop = document.getElementById('contactBackdrop');
        const mainBtn = document.getElementById('mainContactBtn');
        
        if (contactOptions) contactOptions.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        if (mainBtn) mainBtn.style.transform = 'rotate(0deg)';
        
        // Reset contact options
        const options = contactOptions?.querySelectorAll('.contact-link');
        options?.forEach(option => {
            option.style.transform = '';
            option.style.opacity = '';
        });
    }
    
    handleContactClick(e, option) {
        const contactType = option.getAttribute('data-contact');
        
        // Add click animation
        option.style.transform = 'scale(0.9)';
        setTimeout(() => {
            option.style.transform = '';
        }, 150);
        
        // Track contact method
        this.trackButtonClick(`contact_${contactType}`);
        
        // Close menu after click
        setTimeout(() => this.closeContactMenu(), 300);
    }
    
    handleKeyboard(e) {
        if (e.key === 'Escape' && this.isContactMenuOpen) {
            this.closeContactMenu();
        }
    }
    
    handleDocumentClick(e) {
        const contactMenu = document.getElementById('contactMenu');
        if (this.isContactMenuOpen && contactMenu && !contactMenu.contains(e.target)) {
            this.closeContactMenu();
        }
    }
    
    trackButtonClick(action) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'floating_button_click', {
                'event_category': 'Floating Buttons',
                'event_label': action,
                'value': 1
            });
        }
        
        console.log(`Floating button clicked: ${action}`);
    }
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
        
        console.log('📍 Scroll Indicator Initialized');
    }
}

/* ========================================
   RESULTS GALLERY COMPONENT
   ======================================== */
class ResultsGallery {
    constructor() {
        this.gallery = document.querySelector('.results-showcase');
        this.sliders = document.querySelectorAll('.comparison-slider');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.resultItems = document.querySelectorAll('.results-showcase__item');
        
        if (this.gallery) {
            this.init();
        }
    }

    init() {
        this.setupSliders();
        this.setupFilters();
        console.log('📸 Results Gallery Initialized');
    }

    setupSliders() {
        this.sliders.forEach(slider => {
            let isMouseDown = false;
            
            const updateSlider = (e) => {
                const rect = slider.closest('.comparison-container').getBoundingClientRect();
                const x = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                slider.style.left = `${percentage}%`;
                slider.setAttribute('data-position', percentage);
                
                const afterImage = slider.closest('.comparison-container').querySelector('.after');
                if (afterImage) {
                    afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                }
            };
            
            // Mouse events
            slider.addEventListener('mousedown', (e) => {
                isMouseDown = true;
                updateSlider(e);
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isMouseDown) updateSlider(e);
            });
            
            document.addEventListener('mouseup', () => {
                isMouseDown = false;
            });
            
            // Touch events
            slider.addEventListener('touchstart', (e) => {
                updateSlider(e);
            });
            
            slider.addEventListener('touchmove', (e) => {
                e.preventDefault();
                updateSlider(e);
            });
        });
    }

    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterResults(filter);
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    filterResults(filter) {
        this.resultItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    if (item.style.opacity === '0') {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });
    }
}

/* ========================================
   LUXURY CONTACT SECTION COMPONENT
   ======================================== */
class LuxuryContactSection {
    constructor() {
        this.form = document.querySelector('.luxury-contact-form');
        this.inputs = document.querySelectorAll('.luxury-form-input input, .luxury-form-input textarea');
        this.submitBtn = document.querySelector('.luxury-submit-btn');
        this.phoneBtn = document.querySelector('.phone-action');
        this.textBtn = document.querySelector('.text-action');
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupFormValidation();
        this.setupInteractions();
        console.log('📧 Luxury Contact Form Initialized');
    }

    setupFormValidation() {
        this.inputs.forEach(input => {
            input.addEventListener('focus', () => this.onInputFocus(input));
            input.addEventListener('blur', () => this.onInputBlur(input));
            input.addEventListener('input', () => this.validateInput(input));
        });

        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    setupInteractions() {
        if (this.phoneBtn) {
            this.phoneBtn.addEventListener('click', () => this.trackPhoneClick());
        }
        
        if (this.textBtn) {
            this.textBtn.addEventListener('click', () => this.trackTextClick());
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        const inputGroup = input.parentElement;
        
        // Remove previous validation classes
        inputGroup.classList.remove('error', 'valid');
        
        if (value.length > 0) {
            if (input.type === 'email' && !this.isValidEmail(value)) {
                inputGroup.classList.add('error');
            } else {
                inputGroup.classList.add('valid');
            }
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        this.inputs.forEach(input => {
            this.validateInput(input);
            if (input.parentElement.classList.contains('error') || input.value.trim() === '') {
                isValid = false;
            }
        });

        if (isValid) {
            this.showSuccessMessage();
        } else {
            this.showErrorMessage();
        }
    }

    showSuccessMessage() {
        const feedback = document.createElement('div');
        feedback.className = 'contact-feedback success';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95));
            color: white;
            padding: 24px 32px;
            border-radius: 16px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 40px rgba(34, 197, 94, 0.3);
            z-index: 10000;
            opacity: 0;
            text-align: center;
            font-weight: 600;
        `;
        
        feedback.innerHTML = `
            <i class="ri-check-line" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
            <span>Thank you! We'll contact you soon.</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Reset form
        this.form.reset();
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 4000);
    }

    showErrorMessage() {
        const feedback = document.createElement('div');
        feedback.className = 'contact-feedback error';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95));
            color: white;
            padding: 24px 32px;
            border-radius: 16px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 40px rgba(239, 68, 68, 0.3);
            z-index: 10000;
            opacity: 0;
            text-align: center;
            font-weight: 600;
        `;
        
        feedback.innerHTML = `
            <i class="ri-error-warning-line" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
            <span>Please fill in all required fields correctly.</span>
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
        }, 3000);
    }

    onInputFocus(input) {
        input.parentElement.classList.add('focused');
    }

    onInputBlur(input) {
        input.parentElement.classList.remove('focused');
    }

    trackPhoneClick() {
        console.log('Phone call initiated');
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_click', {
                'event_category': 'Contact',
                'event_label': 'Phone Call'
            });
        }
    }

    trackTextClick() {
        console.log('Text message initiated');
        if (typeof gtag !== 'undefined') {
            gtag('event', 'text_click', {
                'event_category': 'Contact',
                'event_label': 'Text Message'
            });
        }
    }
}

/* ========================================
   INITIALIZE APPLICATION
   ======================================== */

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.eviaApp = new EviaAestheticsApp();
});

// Handle page visibility changes for carousel
document.addEventListener('visibilitychange', () => {
    if (window.eviaApp) {
        const carousel = window.eviaApp.getComponent('servicesCarousel');
        if (carousel) {
            if (document.hidden) {
                carousel.pauseAutoplay();
            } else {
                carousel.startAutoplay();
            }
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.eviaApp) {
        window.eviaApp.components.forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EviaAestheticsApp;
}
