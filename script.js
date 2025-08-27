/* ========================================
   EVIA AESTHETICS - COMPLETE ORGANIZED SCRIPT
   Manhattan Med Spa - Luxury Experience
   ======================================== */

// Initialize AOS and ensure content visibility
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0
        });
        
        setTimeout(() => AOS.refresh(), 500);
    }
    
    // Ensure hero content is visible
    const heroContent = document.querySelector('.hero-content-stack');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.visibility = 'visible';
        heroContent.style.zIndex = '100';
    }
    
    // Force video to load properly
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.load();
        heroVideo.play().catch(e => console.log('Video autoplay prevented:', e));
    }
});

// Add CSS overrides to prevent conflicts
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    .hero-content-stack {
        opacity: 1 !important;
        visibility: visible !important;
        z-index: 100 !important;
    }
    
    .services-title, .services-header, .services-subtitle {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    .hero-headline-primary, .hero-headline-secondary, .hero-subheadline-elegant {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    .modern-mobile-menu {
        transform: translateX(100%);
        visibility: hidden;
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .modern-mobile-menu.active {
        transform: translateX(0);
        visibility: visible;
    }
    
    .modern-mobile-backdrop {
        opacity: 0;
        visibility: hidden;
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .modern-mobile-backdrop.active {
        opacity: 1;
        visibility: visible;
    }
    
    .click-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .luxury-nav-link:focus,
    .mobile-nav-link:focus,
    .circle-logo-container:focus,
    .circle-menu-toggle:focus {
        outline: 2px solid var(--hermes-orange);
        outline-offset: 2px;
    }
    
    .touch-device *:hover {
        -webkit-tap-highlight-color: transparent;
    }
    
    @supports(padding: max(0px)) {
        .hermes-floating-controls {
            padding-bottom: max(20px, env(safe-area-inset-bottom));
            padding-left: max(20px, env(safe-area-inset-left));
            padding-right: max(20px, env(safe-area-inset-right));
        }
        
        .modern-mobile-menu {
            padding-bottom: max(20px, env(safe-area-inset-bottom));
        }
    }
`;
document.head.appendChild(globalStyles);

/* ========================================
   PRELOADER
   ======================================== */
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader') || document.querySelector('.evia-modern-preloader');
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingText = document.querySelector('.loading-text');
        this.isLoaded = false;
        
        if (this.preloader) {
            this.init();
            console.log('✅ Preloader Initialized');
        }
    }

    init() {
        this.startLoadingSequence();
        this.simulateLoading();
        
        // Also hide on window load
        window.addEventListener('load', () => {
            setTimeout(() => this.hidePreloader(), 500);
        });
    }

    startLoadingSequence() {
        const loadingMessages = [
            'Initializing luxury experience...',
            'Loading premium components...',
            'Preparing Manhattan elegance...',
            'Almost ready...'
        ];

        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            if (this.loadingText && messageIndex < loadingMessages.length) {
                this.loadingText.textContent = loadingMessages[messageIndex];
                messageIndex++;
            } else {
                clearInterval(messageInterval);
            }
        }, 600);
    }

    simulateLoading() {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            
            if (this.progressFill) {
                this.progressFill.style.width = Math.min(progress, 100) + '%';
            }

            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => this.hidePreloader(), 300);
            }
        }, 150);
    }

    hidePreloader() {
        if (this.isLoaded || !this.preloader) return;
        
        this.isLoaded = true;
        this.preloader.classList.add('loaded');
        this.preloader.style.opacity = '0';
        this.preloader.style.visibility = 'hidden';
        
        setTimeout(() => {
            if (this.preloader && this.preloader.parentNode) {
                this.preloader.remove();
            }
        }, 600);
        
        console.log('🎉 Preloader Complete');
    }
}

/* ========================================
   MODERN LUXURY HEADER
   ======================================== */
class ModernLuxuryHeader {
    constructor() {
        this.header = document.getElementById('luxuryHeader') || document.querySelector('.luxury-floating-header');
        this.navLinks = document.querySelectorAll('.luxury-nav-link, .mobile-nav-link');
        this.desktopCtaButton = document.getElementById('luxuryHeaderCTA') || document.querySelector('.luxury-cta-button');
        this.mobileCtaButton = document.querySelector('.mobile-cta-button');
        this.logoWrapper = document.querySelector('.logo-glow-wrapper');
        this.mobileLogoContainer = document.querySelector('.circle-logo-container');
        this.mobileToggle = document.getElementById('mobileToggle') || document.querySelector('.circle-menu-toggle');
        this.isScrolled = false;
        this.scrollThreshold = 100;
        
        if (this.header) {
            this.init();
            console.log('✅ Modern Luxury Header Initialized');
        }
    }

    init() {
        this.bindEvents();
        this.setupScrollHandler();
        this.setupIntersectionObserver();
    }

    bindEvents() {
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                    this.setActiveNavLink(link);
                    
                    // Close mobile menu if open
                    if (window.mobileMenu && window.mobileMenu.isOpen) {
                        window.mobileMenu.close();
                    }
                }
            });
        });

        // Desktop CTA button
        if (this.desktopCtaButton) {
            this.desktopCtaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.createRippleEffect(this.desktopCtaButton);
                this.scrollToSection('#contact');
            });
        }

        // Mobile CTA button
        if (this.mobileCtaButton) {
            this.mobileCtaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('#contact');
                if (window.mobileMenu && window.mobileMenu.isOpen) {
                    window.mobileMenu.close();
                }
            });
        }

        // Logo click handlers
        if (this.logoWrapper) {
            this.logoWrapper.addEventListener('click', () => {
                this.scrollToTop();
            });
        }

        if (this.mobileLogoContainer) {
            this.mobileLogoContainer.addEventListener('click', () => {
                this.scrollToTop();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.mobileMenu && window.mobileMenu.isOpen) {
                window.mobileMenu.close();
            }
        });
    }

    setupScrollHandler() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                    const shouldBeScrolled = scrollY > this.scrollThreshold;
                    
                    if (shouldBeScrolled !== this.isScrolled) {
                        this.isScrolled = shouldBeScrolled;
                        this.header.classList.toggle('scrolled', this.isScrolled);
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        const observerOptions = {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
                    if (correspondingLink) {
                        this.setActiveNavLink(correspondingLink);
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const headerHeight = this.header.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight - 20;

        this.smoothScrollTo(targetPosition, 800);
    }

    scrollToTop() {
        this.smoothScrollTo(0, 800);
    }

    smoothScrollTo(target, duration) {
        const start = window.pageYOffset;
        const distance = target - start;
        let startTime = null;

        const animateScroll = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutCubic(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animateScroll);
        };

        requestAnimationFrame(animateScroll);
    }

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.luxury-nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.classList.add('click-ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

/* ========================================
   MOBILE MENU FUNCTIONALITY - FIXED
   ======================================== */
class ModernMobileMenu {
    constructor() {
        // More flexible element selection
        this.toggle = this.findElement([
            '#mobileToggle',
            '.circle-menu-toggle',
            '[data-mobile-toggle]'
        ]);
        
        this.menu = this.findElement([
            '#mobileMenu',
            '.modern-mobile-menu',
            '[data-mobile-menu]'
        ]);
        
        this.backdrop = this.findElement([
            '#mobileBackdrop',
            '.modern-mobile-backdrop',
            '[data-mobile-backdrop]'
        ]);
        
        this.closeBtn = this.findElement([
            '#mobileClose',
            '.mobile-menu-close',
            '[data-mobile-close]'
        ]);
        
        this.navLinks = document.querySelectorAll('.mobile-nav-link');
        this.ctaBtn = document.querySelector('.mobile-cta-button');
        this.isOpen = false;
        this.body = document.body;
        
        console.log('Mobile Menu Debug - Elements found:', {
            toggle: !!this.toggle,
            menu: !!this.menu,
            backdrop: !!this.backdrop,
            closeBtn: !!this.closeBtn,
            navLinks: this.navLinks.length
        });
        
        if (this.toggle && this.menu) {
            this.init();
            console.log('✅ Modern Mobile Menu Initialized');
        } else {
            console.error('❌ Mobile Menu: Missing required elements');
            this.debugElements();
        }
    }

    findElement(selectors) {
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    debugElements() {
        console.log('Mobile Menu Debug - Available elements:');
        console.log('All potential toggles:', document.querySelectorAll('[class*="toggle"], [class*="menu"], [id*="toggle"], [id*="menu"]'));
        console.log('All potential menus:', document.querySelectorAll('[class*="mobile"], [class*="menu"]'));
    }

    init() {
        this.setupInitialState();
        this.bindEvents();
        this.setupKeyboardNavigation();
        
        // Make globally available immediately
        window.mobileMenu = this;
    }

    setupInitialState() {
        if (this.menu) {
            this.menu.classList.remove('active');
            this.menu.style.transform = 'translateX(100%)';
            this.menu.style.visibility = 'hidden';
        }
        
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
            this.backdrop.style.opacity = '0';
            this.backdrop.style.visibility = 'hidden';
        }
        
        if (this.toggle) {
            this.toggle.classList.remove('active');
        }
        
        this.body.classList.remove('mobile-menu-open');
        this.isOpen = false;
    }

    bindEvents() {
        // Toggle button - Multiple event types for better compatibility
        if (this.toggle) {
            // Mouse events
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu toggle clicked');
                this.toggle();
            });

            // Touch events
            this.toggle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            this.toggle.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu toggle touched');
                this.toggle();
            });
        }

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            });
        }

        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                this.close();
            });
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.close(), 150);
            });
        });

        // CTA button
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToContact();
                this.close();
            });
        }

        // Prevent scrolling when menu is open
        if (this.menu) {
            this.menu.addEventListener('touchmove', (e) => {
                if (this.isOpen) {
                    e.stopPropagation();
                }
            });
        }

        // Handle resize - close menu on desktop
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth >= 993 && this.isOpen) {
                this.close();
            }
        }, 250));

        // Global click handler
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.close();
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
            }
        });
    }

    handleTabNavigation(e) {
        const focusableElements = this.menu.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    toggle() {
        console.log('Toggle called, current state:', this.isOpen);
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.isOpen) return;

        console.log('📱 Opening Mobile Menu');
        this.isOpen = true;
        this.body.classList.add('mobile-menu-open');
        
        if (this.toggle) this.toggle.classList.add('active');
        if (this.menu) {
            this.menu.classList.add('active');
            this.menu.style.transform = 'translateX(0)';
            this.menu.style.visibility = 'visible';
        }
        if (this.backdrop) {
            this.backdrop.classList.add('active');
            this.backdrop.style.opacity = '1';
            this.backdrop.style.visibility = 'visible';
        }
        
        // Animate menu items
        this.animateMenuItems('in');
        
        // Focus first menu item
        setTimeout(() => {
            const firstLink = this.menu?.querySelector('.mobile-nav-link');
            if (firstLink) firstLink.focus();
        }, 300);
        
        // Prevent body scroll
        if (typeof window.preventBodyScroll === 'function') {
            window.preventBodyScroll(true);
        }
    }

    close() {
        if (!this.isOpen) return;

        console.log('📱 Closing Mobile Menu');
        this.isOpen = false;
        this.body.classList.remove('mobile-menu-open');
        
        if (this.toggle) this.toggle.classList.remove('active');
        if (this.menu) {
            this.menu.classList.remove('active');
            this.menu.style.transform = 'translateX(100%)';
        }
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
            this.backdrop.style.opacity = '0';
            this.backdrop.style.visibility = 'hidden';
        }
        
        setTimeout(() => {
            if (this.menu) this.menu.style.visibility = 'hidden';
        }, 600);
        
        // Animate menu items
        this.animateMenuItems('out');
        
        // Return focus to toggle button
        if (this.toggle) this.toggle.focus();
        
        // Restore body scroll
        if (typeof window.preventBodyScroll === 'function') {
            window.preventBodyScroll(false);
        }
    }

    animateMenuItems(direction) {
        const menuItems = this.menu?.querySelectorAll('.mobile-nav-link') || [];
        
        menuItems.forEach((item, index) => {
            if (direction === 'in') {
                item.style.transform = 'translateX(50px)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    item.style.transform = 'translateX(0)';
                    item.style.opacity = '1';
                }, index * 50);
            } else {
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.transform = 'translateX(50px)';
                    item.style.opacity = '0';
                }, index * 30);
                
                setTimeout(() => {
                    item.style.transition = '';
                    item.style.transform = '';
                    item.style.opacity = '';
                }, 500);
            }
        });
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
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
}

/* ========================================
   EVIA WHAT'S HOT CAROUSEL
   ======================================== */

class EviaWhatsHotCarousel {
    constructor() {
        this.section = document.getElementById('whatsHotSection');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dots = document.querySelectorAll('#carouselDots .dot');
        this.cards = document.querySelectorAll('.evia-treatment-card');
        this.learnMoreBtns = document.querySelectorAll('.learn-more-btn');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modals = document.querySelectorAll('.evia-treatment-modal');
        this.closeButtons = document.querySelectorAll('.evia-modal-close');
        this.bookButtons = document.querySelectorAll('.evia-modal-book-btn');

        // Carousel state
        this.currentSlide = 0;
        this.cardWidth = 364; // 340px + 24px gap
        this.cardsPerView = this.getCardsPerView();
        this.maxSlide = Math.max(0, this.cards.length - this.cardsPerView);
        this.isTransitioning = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;

        // Touch handling
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.dragThreshold = 50;

        // Modal state
        this.activeModal = null;
        this.isModalOpen = false;

        this.init();
    }

    init() {
        if (!this.section || !this.track) {
            console.warn('What\'s Hot carousel elements not found');
            return;
        }

        console.log('🔥 Initializing What\'s Hot Carousel');

        this.setupEventListeners();
        this.setupModalFunctionality();
        this.setupResponsive();
        this.setupAccessibility();
        this.updateCarousel();
        this.startAutoplay();

        console.log('✅ What\'s Hot Carousel initialized successfully');
    }

    getCardsPerView() {
        const containerWidth = this.section?.offsetWidth || window.innerWidth;
        if (containerWidth >= 1200) return 3;
        if (containerWidth >= 768) return 2;
        return 1;
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Learn More buttons
        this.learnMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const treatment = btn.getAttribute('data-treatment');
                this.openModal(treatment);
            });
        });

        // Touch/Swipe support
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
            this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

            // Mouse drag support
            this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.track.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.track.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isModalOpen) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeModal();
            }
        });

        // Pause autoplay on hover
        if (this.section) {
            this.section.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.section.addEventListener('mouseleave', () => this.startAutoplay());
        }

        // Window resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    setupModalFunctionality() {
        // Close button handlers
        this.closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Overlay click to close
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // Book button handlers
        this.bookButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleBooking();
            });
        });
    }

    setupResponsive() {
        this.cardsPerView = this.getCardsPerView();
        this.maxSlide = Math.max(0, this.cards.length - this.cardsPerView);
        this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
    }

    setupAccessibility() {
        // Add ARIA labels
        if (this.prevBtn) this.prevBtn.setAttribute('aria-label', 'Previous treatments');
        if (this.nextBtn) this.nextBtn.setAttribute('aria-label', 'Next treatments');

        // Card accessibility
        this.cards.forEach((card, index) => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `View details for treatment ${index + 1}`);
        });

        // Modal accessibility
        this.modals.forEach(modal => {
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
        });
    }

    // Carousel Navigation Methods
    nextSlide() {
        if (this.isTransitioning) return;
        if (this.currentSlide < this.maxSlide) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            // Loop back to beginning
            this.goToSlide(0);
        }
    }

    prevSlide() {
        if (this.isTransitioning) return;
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            // Loop to end
            this.goToSlide(this.maxSlide);
        }
    }

    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;

        this.currentSlide = Math.max(0, Math.min(slideIndex, this.maxSlide));
        this.updateCarousel();
    }

    updateCarousel() {
        if (!this.track) return;

        this.isTransitioning = true;

        // Calculate transform
        const translateX = -this.currentSlide * this.cardWidth;
        this.track.style.transform = `translateX(${translateX}px)`;

        // Update navigation buttons
        this.updateNavButtons();

        // Update dots
        this.updateDots();

        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    updateNavButtons() {
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.disabled = false;
            this.nextBtn.disabled = false;
        }
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    // Touch/Mouse Handling
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.isDragging = true;
        this.pauseAutoplay();
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        if (!this.isDragging) return;

        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > this.dragThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }

        this.isDragging = false;
        this.startAutoplay();
    }

    handleMouseDown(e) {
        if (e.target.closest('.learn-more-btn')) return;
        
        this.touchStartX = e.clientX;
        this.isDragging = true;
        this.pauseAutoplay();
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.touchEndX = e.clientX;
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;

        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > this.dragThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }

        this.isDragging = false;
        this.startAutoplay();
    }

    // Modal Methods
    openModal(treatmentType) {
        if (this.isModalOpen) return;

        const modal = document.getElementById(`modal-${treatmentType}`);
        if (!modal || !this.modalOverlay) {
            console.warn(`Modal not found for treatment: ${treatmentType}`);
            return;
        }

        console.log(`Opening modal for: ${treatmentType}`);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Show overlay
        this.modalOverlay.classList.add('active');
        
        // Show specific modal
        modal.style.display = 'block';
        
        // Set active modal
        this.activeModal = modal;
        this.isModalOpen = true;

        // Focus management
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 300);
        }

        // Animate modal content
        this.animateModalContent(modal);

        // Track modal open
        this.trackEvent('modal_opened', treatmentType);
    }

    closeModal() {
        if (!this.isModalOpen || !this.activeModal) return;

        console.log('Closing modal');

        // Hide specific modal
        this.activeModal.style.display = 'none';
        
        // Hide overlay
        this.modalOverlay.classList.remove('active');

        // Restore body scroll
        document.body.style.overflow = '';

        // Reset state
        this.activeModal = null;
        this.isModalOpen = false;

        // Track modal close
        this.trackEvent('modal_closed', 'user_action');
    }

    animateModalContent(modal) {
        // Animate benefit list items
        const benefits = modal.querySelectorAll('.benefit-list li');
        benefits.forEach((benefit, index) => {
            benefit.style.opacity = '0';
            benefit.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                benefit.style.transition = 'all 0.4s ease';
                benefit.style.opacity = '1';
                benefit.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });

        // Animate stars
        const stars = modal.querySelectorAll('.stars i');
        stars.forEach((star, index) => {
            setTimeout(() => {
                star.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    star.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }

    handleBooking() {
        console.log('Booking button clicked');
        this.closeModal();
        this.scrollToContact();
        this.trackEvent('booking_clicked', 'modal_cta');
        this.showNotification('Redirecting to booking...', 'success');
    }

    // Autoplay Methods
    startAutoplay() {
        if (this.isModalOpen) return;
        
        this.pauseAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    // Utility Methods
    handleResize() {
        const newCardsPerView = this.getCardsPerView();
        if (newCardsPerView !== this.cardsPerView) {
            this.cardsPerView = newCardsPerView;
            this.maxSlide = Math.max(0, this.cards.length - this.cardsPerView);
            this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
            this.updateCarousel();
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact') || 
                             document.querySelector('.contact-section') ||
                             document.querySelector('[data-section="contact"]');
        
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback: scroll to bottom
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `evia-carousel-notification evia-notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--white, #FFFFFF);
            color: var(--text-primary, #2A1B0A);
            padding: 16px 24px;
            border-radius: var(--radius-lg, 1rem);
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.08), 0 12px 40px rgba(255, 140, 0, 0.08);
            border-left: 4px solid var(--hermes-orange, #FF8C00);
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.4s ease;
            font-family: var(--font-inter, 'Inter', sans-serif);
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }

    trackEvent(action, category) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: 'whats_hot_carousel'
            });
        }
        
        console.log(`📊 Event tracked: ${action} - ${category}`);
    }

    // Public API Methods
    destroy() {
        console.log('🗑️ Destroying What\'s Hot Carousel');
        
        this.pauseAutoplay();
        
        // Remove all event listeners by cloning and replacing elements
        if (this.prevBtn) {
            this.prevBtn.replaceWith(this.prevBtn.cloneNode(true));
        }
        if (this.nextBtn) {
            this.nextBtn.replaceWith(this.nextBtn.cloneNode(true));
        }
        
        this.dots.forEach(dot => {
            dot.replaceWith(dot.cloneNode(true));
        });
        
        this.learnMoreBtns.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
    }

    // Static methods for external control
    static getInstance() {
        return window.eviaWhatsHotCarousel;
    }
}

function scrollToContact() {
    const carousel = EviaWhatsHotCarousel.getInstance();
    if (carousel) {
        carousel.scrollToContact();
    } else {
        // Fallback implementation
        const contactSection = document.getElementById('contact') || 
                             document.querySelector('.contact-section') ||
                             document.querySelector('[data-section="contact"]');
        
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize when DOM is ready
function initEviaWhatsHotCarousel() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.eviaWhatsHotCarousel = new EviaWhatsHotCarousel();
        });
    } else {
        window.eviaWhatsHotCarousel = new EviaWhatsHotCarousel();
    }
}

// Auto-initialize
initEviaWhatsHotCarousel();

// Lazy load carousel functionality when section comes into view
if ('IntersectionObserver' in window) {
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id === 'whatsHotSection') {
                // Trigger any additional animations or lazy loading here
                const cards = entry.target.querySelectorAll('.evia-treatment-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                // Unobserve after first intersection
                carouselObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe the section when it's available
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const whatsHotSection = document.getElementById('whatsHotSection');
                if (whatsHotSection) {
                    carouselObserver.observe(whatsHotSection);
                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Global error handler for carousel-related errors
window.addEventListener('error', (e) => {
    if (e.filename && e.filename.includes('whats-hot') || 
        e.message.includes('carousel') || 
        e.message.includes('modal')) {
        console.error('What\'s Hot Carousel Error:', e.error);
        
        // Graceful degradation - ensure basic functionality
        const cards = document.querySelectorAll('.evia-treatment-card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }
});

// Performance monitoring
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('whats-hot-carousel-start');
    
    window.addEventListener('load', () => {
        performance.mark('whats-hot-carousel-end');
        performance.measure('whats-hot-carousel-load', 'whats-hot-carousel-start', 'whats-hot-carousel-end');
        
        const measure = performance.getEntriesByName('whats-hot-carousel-load')[0];
        if (measure) {
            console.log(`⚡ What's Hot Carousel loaded in ${measure.duration.toFixed(2)}ms`);
        }
    });
}

// Support for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EviaWhatsHotCarousel;
}

if (typeof define === 'function' && define.amd) {
    define([], () => EviaWhatsHotCarousel);
}

// Make available globally
window.EviaWhatsHotCarousel = EviaWhatsHotCarousel;

/* ========================================
   HERO SECTION
   ======================================== */
class HeroSection {
    constructor() {
        this.hero = document.querySelector('.cinematic-hero');
        this.ctaBtn = document.querySelector('.hero-cta-signature');
        this.scrollIndicator = document.querySelector('.hero-scroll-indicator-elegant');
        
        if (this.hero) {
            this.init();
            console.log('✅ Hero Section Initialized');
        }
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToContact();
            });
            
            this.ctaBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.scrollToContact();
            });
        }

        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToServices();
            });
            
            this.scrollIndicator.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.scrollToServices();
            });
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    scrollToServices() {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const headerHeight = 80;
            const elementPosition = servicesSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
}

/* ========================================
   SERVICES CAROUSEL
   ======================================== */
class HermesServicesScroller {
  constructor() {
    this.scrollContainer = document.getElementById('hermesScrollContainer');
    this.scrollGrid = document.querySelector('.hermes-services-grid');
    this.leftArrow = document.getElementById('hermesScrollLeft');
    this.rightArrow = document.getElementById('hermesScrollRight');
    this.serviceCards = document.querySelectorAll('.hermes-service-card');
    this.learnBtns = document.querySelectorAll('.hermes-learn-btn');
    
    this.scrollAmount = 360;
    this.isScrolling = false;
    this.animationFrame = null;
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };
    
    if (this.scrollContainer && this.scrollGrid) {
        this.initializeElements();
        this.setupCardAnimations();
        this.bindEvents();
        this.updateArrowStates();
        this.initializeIntersectionObserver();
        console.log('✅ Hermes Services Scroller Initialized');
    }
  }

  initializeElements() {
    this.calculateScrollAmount();
  }

  setupCardAnimations() {
    this.serviceCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 200 + (index * 150));
    });

    this.setupCardHoverEffects();
  }

  setupCardHoverEffects() {
    this.serviceCards.forEach((card) => {
      const cardInner = card.querySelector('.hermes-card-inner');
      const serviceImage = card.querySelector('.hermes-service-image img');
      const serviceNumber = card.querySelector('.hermes-service-number');
      const learnBtn = card.querySelector('.hermes-learn-btn');

      card.addEventListener('mouseenter', () => {
        this.activateCardHover(card, cardInner, serviceImage, serviceNumber, learnBtn);
      });

      card.addEventListener('mouseleave', () => {
        this.deactivateCardHover(card, cardInner, serviceImage, serviceNumber, learnBtn);
      });

      card.addEventListener('touchstart', () => {
        this.activateCardTouch(card);
      }, { passive: true });

      card.addEventListener('touchend', () => {
        this.deactivateCardTouch(card);
      }, { passive: true });
    });
  }

  activateCardHover(card, cardInner, serviceImage, serviceNumber, learnBtn) {
    if (cardInner) {
        cardInner.style.transform = 'translateY(-12px) scale(1.03)';
        cardInner.style.boxShadow = `
          0 24px 64px rgba(0, 0, 0, 0.12),
          0 8px 32px rgba(255, 140, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.9)
        `;
    }

    if (serviceImage) {
      serviceImage.style.transform = 'scale(1.08)';
    }

    if (serviceNumber) {
      serviceNumber.style.transform = 'scale(1.1)';
      serviceNumber.style.boxShadow = '0 8px 20px rgba(255, 140, 0, 0.3)';
    }

    if (learnBtn) {
      learnBtn.style.transform = 'translateY(-2px)';
      learnBtn.style.boxShadow = `
        0 12px 24px rgba(255, 140, 0, 0.3),
        0 4px 12px rgba(0, 0, 0, 0.1)
      `;
    }

    card.classList.add('hermes-card-hovering');
  }

  deactivateCardHover(card, cardInner, serviceImage, serviceNumber, learnBtn) {
    if (cardInner) {
        cardInner.style.transform = '';
        cardInner.style.boxShadow = '';
    }

    if (serviceImage) {
      serviceImage.style.transform = '';
    }

    if (serviceNumber) {
      serviceNumber.style.transform = '';
      serviceNumber.style.boxShadow = '';
    }

    if (learnBtn) {
      learnBtn.style.transform = '';
      learnBtn.style.boxShadow = '';
    }

    card.classList.remove('hermes-card-hovering');
  }

  activateCardTouch(card) {
    card.style.transform = 'scale(0.98)';
    card.style.transition = 'transform 0.2s ease';
  }

  deactivateCardTouch(card) {
    card.style.transform = '';
    setTimeout(() => {
      card.style.transition = '';
    }, 200);
  }

  bindEvents() {
    if (this.leftArrow) {
      this.leftArrow.addEventListener('click', () => this.scrollLeft());
    }
    if (this.rightArrow) {
      this.rightArrow.addEventListener('click', () => this.scrollRight());
    }

    this.learnBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleLearnMore(e));
      btn.addEventListener('mouseenter', () => this.activateButtonHover(btn));
      btn.addEventListener('mouseleave', () => this.deactivateButtonHover(btn));
    });

    if (this.scrollContainer) {
      this.scrollContainer.addEventListener('scroll', () => {
        this.handleScroll();
      });
    }

    this.bindEnhancedTouchEvents();
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    window.addEventListener('resize', () => this.handleResize());
    this.bindAccessibilityEvents();
  }

  bindEnhancedTouchEvents() {
    if (!this.scrollContainer) return;

    let touchState = {
      startX: 0,
      startY: 0,
      startTime: 0,
      isScrolling: false,
      isSwiping: false,
      velocity: 0
    };

    this.scrollContainer.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchState.startX = touch.clientX;
      touchState.startY = touch.clientY;
      touchState.startTime = Date.now();
      touchState.isScrolling = false;
      touchState.isSwiping = false;
      
      this.cancelScrollAnimation();
    }, { passive: true });

    this.scrollContainer.addEventListener('touchmove', (e) => {
      if (!touchState.startX || !touchState.startY) return;

      const touch = e.touches[0];
      const currentX = touch.clientX;
      const currentY = touch.clientY;
      const diffX = touchState.startX - currentX;
      const diffY = touchState.startY - currentY;

      if (!touchState.isScrolling && !touchState.isSwiping) {
        if (Math.abs(diffY) > Math.abs(diffX)) {
          touchState.isScrolling = true;
        } else if (Math.abs(diffX) > 10) {
          touchState.isSwiping = true;
          e.preventDefault();
        }
      }

      if (touchState.isSwiping) {
        e.preventDefault();
        const currentTime = Date.now();
        const timeDiff = currentTime - touchState.startTime;
        touchState.velocity = Math.abs(diffX) / timeDiff;
      }
    }, { passive: false });

    this.scrollContainer.addEventListener('touchend', (e) => {
      if (!touchState.startX || touchState.isScrolling) {
        this.resetTouchState(touchState);
        return;
      }

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const diffX = touchState.startX - endX;
      const minSwipeDistance = 50;
      const minSwipeVelocity = 0.3;

      if (Math.abs(diffX) > minSwipeDistance || touchState.velocity > minSwipeVelocity) {
        if (diffX > 0) {
          this.scrollRight();
        } else {
          this.scrollLeft();
        }
      }

      this.resetTouchState(touchState);
    }, { passive: true });
  }

  resetTouchState(touchState) {
    touchState.startX = 0;
    touchState.startY = 0;
    touchState.startTime = 0;
    touchState.isScrolling = false;
    touchState.isSwiping = false;
    touchState.velocity = 0;
  }

  bindAccessibilityEvents() {
    this.serviceCards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('focus', () => {
        card.classList.add('hermes-card-focused');
        this.scrollCardIntoView(card);
      });
      card.addEventListener('blur', () => {
        card.classList.remove('hermes-card-focused');
      });

      card.addEventListener('keydown', (e) => {
        switch(e.key) {
          case 'ArrowRight':
            e.preventDefault();
            if (index < this.serviceCards.length - 1) {
              this.serviceCards[index + 1].focus();
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (index > 0) {
              this.serviceCards[index - 1].focus();
            }
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            const learnBtn = card.querySelector('.hermes-learn-btn');
            if (learnBtn) learnBtn.click();
            break;
        }
      });
    });
  }

  activateButtonHover(btn) {
    const arrow = btn.querySelector('.hermes-btn-arrow');
    if (arrow) {
      arrow.style.transform = 'translateX(4px)';
    }
  }

  deactivateButtonHover(btn) {
    const arrow = btn.querySelector('.hermes-btn-arrow');
    if (arrow) {
      arrow.style.transform = '';
    }
  }

  handleScroll() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.updateArrowStates();
      this.updateCardVisibility();
    }, 16);
  }

  updateCardVisibility() {
    if (!this.scrollContainer) return;

    const containerRect = this.scrollContainer.getBoundingClientRect();
    
    this.serviceCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const isVisible = cardRect.left < containerRect.right && cardRect.right > containerRect.left;
      
      card.classList.toggle('hermes-card-visible', isVisible);
    });
  }

  handleKeyboard(e) {
    const servicesSection = document.querySelector('.hermes-services-section');
    if (!servicesSection || !this.isElementInViewport(servicesSection)) return;

    switch(e.key) {
      case 'ArrowLeft':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.scrollLeft();
        }
        break;
      case 'ArrowRight':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.scrollRight();
        }
        break;
      case 'Home':
        e.preventDefault();
        this.scrollToStart();
        break;
      case 'End':
        e.preventDefault();
        this.scrollToEnd();
        break;
    }
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.calculateScrollAmount();
      this.updateArrowStates();
      this.updateCardVisibility();
    }, 250);
  }

  calculateScrollAmount() {
    if (!this.scrollGrid) return;

    const cards = this.scrollGrid.querySelectorAll('.hermes-service-card');
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      const computedStyle = window.getComputedStyle(this.scrollGrid);
      const gap = parseInt(computedStyle.gap) || 32;
      this.scrollAmount = cardWidth + gap;
    }
  }

  scrollLeft() {
    if (this.isScrolling || !this.scrollContainer) return;
    
    this.calculateScrollAmount();
    const currentScroll = this.scrollContainer.scrollLeft;
    const targetScroll = Math.max(0, currentScroll - this.scrollAmount);
    
    this.smoothScrollTo(targetScroll);
  }

  scrollRight() {
    if (this.isScrolling || !this.scrollContainer) return;
    
    this.calculateScrollAmount();
    const currentScroll = this.scrollContainer.scrollLeft;
    const maxScroll = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
    const targetScroll = Math.min(maxScroll, currentScroll + this.scrollAmount);
    
    this.smoothScrollTo(targetScroll);
  }

  smoothScrollTo(targetScroll) {
    if (!this.scrollContainer) return;

    this.isScrolling = true;
    const startScroll = this.scrollContainer.scrollLeft;
    const distance = targetScroll - startScroll;
    const duration = 600;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const easeProgress = this.easeOutCubic(progress);
      this.scrollContainer.scrollLeft = startScroll + (distance * easeProgress);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animateScroll);
      } else {
        this.isScrolling = false;
        this.updateArrowStates();
        this.updateCardVisibility();
      }
    };

    this.animationFrame = requestAnimationFrame(animateScroll);
  }

  cancelScrollAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
      this.isScrolling = false;
    }
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  updateArrowStates() {
    if (!this.scrollContainer || !this.leftArrow || !this.rightArrow) return;

    const scrollLeft = this.scrollContainer.scrollLeft;
    const maxScroll = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
    
    this.leftArrow.disabled = scrollLeft <= 5;
    this.rightArrow.disabled = scrollLeft >= maxScroll - 5;

    this.leftArrow.classList.toggle('hermes-arrow-disabled', this.leftArrow.disabled);
    this.rightArrow.classList.toggle('hermes-arrow-disabled', this.rightArrow.disabled);
  }

  scrollCardIntoView(card) {
    if (!this.scrollContainer || !card) return;

    const containerRect = this.scrollContainer.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    
    if (cardRect.left < containerRect.left || cardRect.right > containerRect.right) {
      const cardIndex = Array.from(this.serviceCards).indexOf(card);
      this.scrollToCard(cardIndex);
    }
  }

  handleLearnMore(e) {
    const btn = e.currentTarget;
    const service = btn.dataset.service;
    
    btn.style.transform = 'scale(0.95)';
    btn.style.transition = 'transform 0.15s ease';
    
    btn.classList.add('hermes-btn-clicked');
    
    setTimeout(() => {
      btn.style.transform = '';
      btn.classList.remove('hermes-btn-clicked');
    }, 150);

    setTimeout(() => {
      document.body.style.transition = 'opacity 0.3s ease';
      document.body.style.opacity = '0.8';
      
      setTimeout(() => {
        window.location.href = `services.html#${service}`;
      }, 150);
    }, 200);
  }

  initializeIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('hermes-card-in-viewport');
        } else {
          entry.target.classList.remove('hermes-card-in-viewport');
        }
      });
    }, this.observerOptions);

    this.serviceCards.forEach(card => {
      this.intersectionObserver.observe(card);
    });
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  scrollToStart() {
    this.smoothScrollTo(0);
  }

  scrollToEnd() {
    if (!this.scrollContainer) return;
    const maxScroll = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
    this.smoothScrollTo(maxScroll);
  }

  scrollToCard(cardIndex) {
    if (cardIndex < 0 || cardIndex >= this.serviceCards.length) return;
    
    this.calculateScrollAmount();
    const targetScroll = cardIndex * this.scrollAmount;
    this.smoothScrollTo(targetScroll);
  }

  destroy() {
    this.cancelScrollAnimation();
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    clearTimeout(this.resizeTimeout);
    clearTimeout(this.scrollTimeout);
    console.log('🗑️ Hermes Services Scroller destroyed');
  }
}

/* ========================================
   ABOUT SECTION
   ======================================== */
class ElevatedAboutSection {
    constructor() {
        this.section = document.querySelector('.hermes-elevated-about');
        this.learnMoreBtn = document.getElementById('learnMoreBtn');
        this.consultationBtn = document.getElementById('consultationBtn');
        this.profileCard = document.querySelector('.doctor-profile-card');
        this.ctaCard = document.querySelector('.cta-card');
        
        this.isAnimating = false;
        this.observerThreshold = 0.2;
        
        if (this.section) {
            this.init();
            console.log('✅ Elevated About Section Initialized');
        }
    }

    init() {
        this.setupIntersectionObserver();
        this.bindEvents();
        this.setupParallaxEffects();
        this.initializeCounters();
    }

    bindEvents() {
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLearnMoreClick();
            });
            
            this.learnMoreBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleLearnMoreClick();
            });
        }

        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleConsultationClick();
            });
            
            this.consultationBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleConsultationClick();
            });
        }

        if (this.profileCard) {
            this.profileCard.addEventListener('mouseenter', () => {
                this.triggerProfileCardAnimation();
            });
        }

        const expertiseTags = document.querySelectorAll('.expertise-tag');
        expertiseTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.showExpertiseDetails(tag.textContent);
            });
        });

        const experienceItems = document.querySelectorAll('.experience-item');
        experienceItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.animateExperienceItem(item);
            });
        });
    }

    handleLearnMoreClick() {
        if (this.isAnimating) return;
        
        console.log('📖 Learn More button clicked');
        this.isAnimating = true;
        
        this.addClickFeedback(this.learnMoreBtn);
        this.showActionFeedback('Loading Dr. Nano\'s profile...', 'ri-user-line');
        
        setTimeout(() => {
            window.location.href = 'about.html';
            this.isAnimating = false;
        }, 1000);
    }

    handleConsultationClick() {
        if (this.isAnimating) return;
        
        console.log('📅 Consultation button clicked');
        this.isAnimating = true;
        
        this.addClickFeedback(this.consultationBtn);
        this.showActionFeedback('Opening consultation booking...', 'ri-calendar-check-line');
        
        setTimeout(() => {
            this.scrollToContact();
            this.isAnimating = false;
        }, 800);
    }

    addClickFeedback(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.15s ease';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 150);
    }

    showActionFeedback(message, iconClass) {
        const feedback = this.createFeedback(message, iconClass);
        this.displayFeedback(feedback);
    }

    createFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.className = 'about-action-feedback';
        feedback.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(135deg, #FF8C00, #FFA500);
            color: white;
            padding: 18px 28px;
            border-radius: 50px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            opacity: 0;
            pointer-events: none;
            box-shadow: 0 20px 60px rgba(255, 140, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 240px;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        return feedback;
    }

    displayFeedback(feedback) {
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }

    triggerProfileCardAnimation() {
        if (!this.profileCard) return;
        
        const image = this.profileCard.querySelector('.doctor-image');
        const certBadge = this.profileCard.querySelector('.certification-badge');
        
        if (image) {
            image.style.transform = 'scale(1.08) rotate(1deg)';
        }
        
        if (certBadge) {
            certBadge.style.animation = 'certificationFloat 2s ease-in-out';
        }
        
        setTimeout(() => {
            if (image) image.style.transform = '';
            if (certBadge) certBadge.style.animation = '';
        }, 2000);
    }

    animateExperienceItem(item) {
        const icon = item.querySelector('.experience-icon');
        const number = item.querySelector('.experience-number');
        
        if (icon) {
            icon.style.transform = 'rotate(360deg) scale(1.1)';
            icon.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        if (number) {
            number.style.color = '#FF8C00';
            number.style.transform = 'scale(1.1)';
            number.style.transition = 'all 0.3s ease';
        }
        
        setTimeout(() => {
            if (icon) {
                icon.style.transform = '';
                icon.style.transition = '';
            }
            if (number) {
                number.style.color = '';
                number.style.transform = '';
                number.style.transition = '';
            }
        }, 600);
    }

    showExpertiseDetails(expertise) {
        const details = {
            'Injectable Artistry': 'Advanced techniques in Botox, dermal fillers, and facial contouring.',
            'Medical Wellness': 'Comprehensive weight management and IV therapy programs.',
            'Aesthetic Innovation': 'Latest treatments including PRP, microneedling, and chemical peels.'
        };
        
        const detail = details[expertise] || 'Specialized expertise in aesthetic medicine.';
        this.showActionFeedback(detail, 'ri-information-line');
    }

    initializeCounters() {
        const counters = [
            { element: document.querySelector('.experience-number'), target: 20, suffix: '+' },
            { 
                element: document.querySelectorAll('.experience-number')[1], 
                target: 5000, 
                suffix: '+',
                formatter: (num) => num >= 1000 ? (num/1000).toFixed(0) + 'K+' : num + '+'
            },
            { element: document.querySelectorAll('.experience-number')[2], target: 98, suffix: '%' }
        ];
        
        counters.forEach(counter => {
            if (counter.element) {
                this.observeCounter(counter);
            }
        });
    }

    observeCounter(counter) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(counter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter.element);
    }

    animateCounter(counter) {
        const duration = 2000;
        const startValue = 0;
        const increment = counter.target / (duration / 16);
        let current = startValue;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < counter.target) {
                const displayValue = counter.formatter ? 
                    counter.formatter(Math.floor(current)) : 
                    Math.floor(current) + (counter.suffix || '');
                counter.element.textContent = displayValue;
                requestAnimationFrame(updateCounter);
            } else {
                const finalValue = counter.formatter ? 
                    counter.formatter(counter.target) : 
                    counter.target + (counter.suffix || '');
                counter.element.textContent = finalValue;
            }
        };
        
        updateCounter();
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    setupIntersectionObserver() {
        const observeElements = [
            '.doctor-profile-card',
            '.experience-highlight',
            '.philosophy-preview',
            '.specializations',
            '.cta-card'
        ];
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, {
            threshold: this.observerThreshold,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observeElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => observer.observe(el));
        });
    }

    triggerElementAnimation(element) {
        if (element.classList.contains('.doctor-profile-card')) {
            setTimeout(() => this.triggerProfileCardAnimation(), 300);
        }
        
        if (element.classList.contains('.cta-card')) {
            this.animateCtaCard();
        }
    }

    animateCtaCard() {
        const ctaButtons = document.querySelectorAll('.primary-cta-btn, .secondary-cta-btn');
        ctaButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.transform = 'translateY(0)';
                btn.style.opacity = '1';
            }, index * 200);
        });
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.bg-orb');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const sectionRect = this.section.getBoundingClientRect();
            
            if (sectionRect.bottom >= 0 && sectionRect.top <= window.innerHeight) {
                parallaxElements.forEach((orb, index) => {
                    const speed = 0.05 + (index * 0.02);
                    const yPos = scrolled * speed;
                    orb.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
            }
        }, { passive: true });
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
}

/* ========================================
   RESULTS GALLERY
   ======================================== */
class HermesResultsShowcase {
    constructor() {
        this.section = document.querySelector('.hermes-results-showcase');
        this.filterButtons = document.querySelectorAll('.hermes-filter-btn');
        this.resultItems = document.querySelectorAll('.hermes-result-item');
        this.ctaButton = document.getElementById('hermesResultsCtaBtn');
        
        this.comparisons = document.querySelectorAll('.result-comparison-wrapper');
        this.activeComparison = null;
        
        this.activeFilter = 'all';
        this.isAnimating = false;
        
        if (this.section) {
            this.init();
            console.log('✅ Hermes Results Showcase Initialized');
        }
    }
   
    init() {
        this.initializeComparisons();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
    }

    initializeComparisons() {
        this.comparisons.forEach(comparison => {
            const slider = comparison.querySelector('.result-slider');
            const afterImage = comparison.querySelector('.result-after');
            
            if (slider && afterImage) {
                let isActive = false;
                let currentPosition = 50;
                
                this.updateSliderPosition(comparison, currentPosition);
                
                slider.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    isActive = true;
                    this.activeComparison = comparison;
                    comparison.classList.add('dragging');
                    document.body.style.cursor = 'ew-resize';
                    this.updateSliderPosition(comparison, this.getPositionFromEvent(e, comparison));
                });
                
                comparison.addEventListener('mousemove', (e) => {
                    if (isActive && this.activeComparison === comparison) {
                        this.updateSliderPosition(comparison, this.getPositionFromEvent(e, comparison));
                    }
                });
                
                slider.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    isActive = true;
                    this.activeComparison = comparison;
                    comparison.classList.add('dragging');
                    this.updateSliderPosition(comparison, this.getPositionFromEvent(e.touches[0], comparison));
                }, { passive: false });
                
                comparison.addEventListener('touchmove', (e) => {
                    if (isActive && this.activeComparison === comparison) {
                        e.preventDefault();
                        this.updateSliderPosition(comparison, this.getPositionFromEvent(e.touches[0], comparison));
                    }
                }, { passive: false });
                
                document.addEventListener('mouseup', () => this.endDragging());
                document.addEventListener('touchend', () => this.endDragging());
                
                comparison.addEventListener('mouseenter', () => {
                    if (!isActive) {
                        comparison.classList.add('hover');
                    }
                });
                
                comparison.addEventListener('mouseleave', () => {
                    comparison.classList.remove('hover');
                });
                
                comparison.addEventListener('dblclick', () => {
                    this.animateSliderTo(comparison, 50);
                });
            }
        });
    }

    getPositionFromEvent(event, container) {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        return percentage;
    }

    updateSliderPosition(container, percentage) {
        const slider = container.querySelector('.result-slider');
        const afterImage = container.querySelector('.result-after');
        
        if (slider && afterImage) {
            slider.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            slider.dataset.position = percentage;
        }
    }

    animateSliderTo(container, targetPercentage) {
        const currentPercentage = parseFloat(container.querySelector('.result-slider').dataset.position) || 50;
        const duration = 600;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            const currentPos = currentPercentage + (targetPercentage - currentPercentage) * easedProgress;
            this.updateSliderPosition(container, currentPos);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    endDragging() {
        if (this.activeComparison) {
            this.activeComparison.classList.remove('dragging');
            this.activeComparison = null;
            document.body.style.cursor = '';
        }
    }

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAnimating) return;
                
                const filter = button.dataset.filter;
                this.handleFilterChange(filter, button);
            });
        });

        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCtaClick();
            });
            
            this.ctaButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleCtaClick();
            });
        }

        this.resultItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.enhanceItemVisually(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.resetItemVisuals(item);
            });
        });
    }

    handleFilterChange(filter, button) {
        if (filter === this.activeFilter) return;
        
        console.log(`🔍 Filtering results: ${filter}`);
        this.isAnimating = true;
        
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        this.addButtonFeedback(button);
        
        this.filterResults(filter).then(() => {
            this.activeFilter = filter;
            this.isAnimating = false;
        });
    }

    async filterResults(filter) {
        const hidePromises = Array.from(this.resultItems).map((item, index) => {
            return new Promise(resolve => {
                const categories = item.dataset.category.split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (!shouldShow) {
                    setTimeout(() => {
                        item.classList.add('hidden');
                        resolve();
                    }, index * 50);
                } else {
                    resolve();
                }
            });
        });
        
        await Promise.all(hidePromises);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const showPromises = Array.from(this.resultItems).map((item, index) => {
            return new Promise(resolve => {
                const categories = item.dataset.category.split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    setTimeout(() => {
                        item.classList.remove('hidden');
                        resolve();
                    }, index * 100);
                } else {
                    resolve();
                }
            });
        });
        
        await Promise.all(showPromises);
    }
   
    enhanceItemVisually(item) {
        const comparison = item.querySelector('.result-comparison-wrapper');
        if (comparison) {
            const images = comparison.querySelectorAll('.result-image img');
            images.forEach(img => {
                img.style.transform = 'scale(1.05)';
                img.style.filter = 'brightness(1.1) contrast(1.05)';
            });
        }
    }

    resetItemVisuals(item) {
        const comparison = item.querySelector('.result-comparison-wrapper');
        if (comparison) {
            const images = comparison.querySelectorAll('.result-image img');
            images.forEach(img => {
                img.style.transform = '';
                img.style.filter = '';
            });
        }
    }

    addButtonFeedback(button) {
        button.style.transform = 'translateY(-2px) scale(0.98)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }

    handleCtaClick() {
        console.log('📅 Results CTA clicked - Scheduling consultation');
        
        this.addCtaFeedback();
        this.showActionFeedback('Opening consultation booking...', 'ri-calendar-check-line');
        
        setTimeout(() => {
            this.scrollToContact();
        }, 1000);
    }

    addCtaFeedback() {
        if (this.ctaButton) {
            this.ctaButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.ctaButton.style.transform = '';
            }, 150);
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    showActionFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
        feedback.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00, #FFA500); color: white;
            padding: 18px 28px; border-radius: 50px; font-family: 'Inter', sans-serif;
            font-size: 14px; font-weight: 600; z-index: 10001; opacity: 0;
            display: flex; align-items: center; gap: 12px; justify-content: center;
            transition: all 0.4s ease; box-shadow: 0 20px 60px rgba(255, 140, 0, 0.3);
            min-width: 280px;
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }
   
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.section.contains(document.activeElement)) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                    if (this.activeComparison) {
                        e.preventDefault();
                        const currentPos = parseFloat(this.activeComparison.querySelector('.result-slider').dataset.position) || 50;
                        const newPos = e.key === 'ArrowLeft' ? 
                            Math.max(0, currentPos - 5) : 
                            Math.min(100, currentPos + 5);
                        this.updateSliderPosition(this.activeComparison, newPos);
                    }
                    break;
                case 'Enter':
                case ' ':
                    if (document.activeElement.classList.contains('result-comparison-wrapper')) {
                        e.preventDefault();
                        this.animateSliderTo(document.activeElement, 50);
                    }
                    break;
            }
        });
    }
   
    setupIntersectionObserver() {
        const observeElements = [
            '.hermes-result-item',
            '.hermes-results-cta'
        ];
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.triggerItemAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observeElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => observer.observe(el));
        });
    }

    triggerItemAnimation(element) {
        if (element.classList.contains('hermes-result-item')) {
            const slider = element.querySelector('.result-slider');
            if (slider) {
                setTimeout(() => {
                    this.animateSliderTo(element.querySelector('.result-comparison-wrapper'), 60);
                    setTimeout(() => {
                        this.animateSliderTo(element.querySelector('.result-comparison-wrapper'), 50);
                    }, 800);
                }, Math.random() * 500);
            }
        }
    }
}

/* ========================================
   CONTACT SECTION
   ======================================== */
class ContactSection {
    constructor() {
        this.section = document.querySelector('.luxury-contact-section');
        this.actionBtns = document.querySelectorAll('.action-btn');
        this.emergencyBtns = document.querySelectorAll('.emergency-btn');
        this.methodCards = document.querySelectorAll('.method-card');
        
        if (this.section) {
            this.init();
            console.log('✅ Contact Section Initialized');
        }
    }

    init() {
        this.bindEvents();
        this.enhanceElfsightForm();
    }

    bindEvents() {
        this.actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const href = btn.getAttribute('href');
                console.log('Action button clicked:', href);
                
                if (href.startsWith('tel:') || href.startsWith('http')) {
                    this.showFeedback('Opening...', 'ri-external-link-line');
                } else {
                    e.preventDefault();
                }
            });
        });

        this.emergencyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const href = btn.getAttribute('href');
                console.log('Emergency button clicked:', href);
                
                if (href.startsWith('tel:')) {
                    this.showFeedback('Calling...', 'ri-phone-line');
                } else if (href.startsWith('sms:')) {
                    this.showFeedback('Opening messages...', 'ri-message-line');
                }
            });
        });

        this.methodCards.forEach(card => {
            const link = card.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href.startsWith('tel:')) {
                        this.showFeedback('Calling...', 'ri-phone-line');
                    }
                });
            }
        });
    }

    enhanceElfsightForm() {
        const checkForForm = () => {
            const elfsightWidget = this.section.querySelector('[class*="elfsight"]');
            if (elfsightWidget) {
                console.log('✅ Elfsight form found and enhanced');
            } else {
                setTimeout(checkForForm, 500);
            }
        };
        
        setTimeout(checkForForm, 1000);
    }

    showFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: #FF8C00;
            color: white;
            padding: 12px 18px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 500;
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            transform: translateY(20px);
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        feedback.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s ease';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(20px)';
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }
}

/* ========================================
   FLOATING BUTTONS
   ======================================== */
class HermesFloatingButtons {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTopBtn') || document.querySelector('.hermes-back-to-top');
        this.contactFabBtn = document.getElementById('contactFabBtn') || document.querySelector('.hermes-contact-fab');
        this.contactBackdrop = document.getElementById('contactBackdrop') || document.querySelector('.contact-fab-backdrop');
        this.mainContactBtn = this.contactFabBtn?.querySelector('.main-contact-btn');
        this.contactOptions = document.querySelectorAll('.contact-option');
        
        this.isContactExpanded = false;
        this.isBackToTopVisible = false;
        this.scrollThreshold = 400;
        this.lastScrollY = 0;
        this.backToTopClicks = 0;
        this.contactInteractions = {};
        
        console.log('Hermes Floating Buttons elements found:', {
            backToTop: !!this.backToTopBtn,
            contactFab: !!this.contactFabBtn,
            mainContactBtn: !!this.mainContactBtn,
            contactOptions: this.contactOptions.length
        });
        
        if (this.backToTopBtn || this.contactFabBtn) {
            this.init();
            console.log('✅ Hermes Floating Buttons Initialized');
        }
    }

    init() {
        this.setupInitialState();
        this.bindEvents();
        this.setupScrollObserver();
    }

    setupInitialState() {
        if (this.backToTopBtn) {
            this.backToTopBtn.classList.remove('visible');
            this.backToTopBtn.style.opacity = '0';
            this.backToTopBtn.style.visibility = 'hidden';
            this.backToTopBtn.style.transform = 'translateY(100px) scale(0.8)';
        }
        
        if (this.contactFabBtn) {
            this.contactFabBtn.classList.remove('expanded');
            this.isContactExpanded = false;
        }
        
        if (this.contactBackdrop) {
            this.contactBackdrop.classList.remove('active');
            this.contactBackdrop.style.opacity = '0';
            this.contactBackdrop.style.visibility = 'hidden';
        }
    }

    bindEvents() {
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back to top clicked');
                this.scrollToTop();
            });
            
            this.backToTopBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back to top touched');
                this.scrollToTop();
            });
        }

        if (this.mainContactBtn) {
            this.mainContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Contact FAB clicked, current state:', this.isContactExpanded);
                this.toggleContactFab();
            });
            
            this.mainContactBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Contact FAB touched');
                this.toggleContactFab();
            });
        }

        if (this.contactBackdrop) {
            this.contactBackdrop.addEventListener('click', (e) => {
                console.log('Contact backdrop clicked');
                this.closeContactFab();
            });
            
            this.contactBackdrop.addEventListener('touchend', (e) => {
                this.closeContactFab();
            });
        }

        this.contactOptions.forEach((option, index) => {
            const link = option.querySelector('.contact-link');
            const contactType = option.dataset.contact;
            
            if (link && contactType) {
                link.addEventListener('click', (e) => {
                    console.log('Contact option clicked:', contactType);
                    this.handleContactClick(e, contactType, link);
                });
                
                link.addEventListener('touchend', (e) => {
                    console.log('Contact option touched:', contactType);
                    setTimeout(() => this.closeContactFab(), 500);
                });
            }
        });

        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        document.addEventListener('click', (e) => {
            if (this.isContactExpanded && 
                this.contactFabBtn && 
                !this.contactFabBtn.contains(e.target)) {
                this.closeContactFab();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isContactExpanded) {
                this.closeContactFab();
            }
        });
    }

    setupScrollObserver() {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const shouldShow = scrollY > this.scrollThreshold;
            
            if (shouldShow !== this.isBackToTopVisible) {
                this.isBackToTopVisible = shouldShow;
                this.toggleBackToTopVisibility(shouldShow);
            }
        }, { passive: true });
    }

    handleScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        if (this.isContactExpanded && Math.abs(scrollY - this.lastScrollY) > 100) {
            this.closeContactFab();
        }
        
        this.lastScrollY = scrollY;
    }

    toggleBackToTopVisibility(shouldShow) {
        if (!this.backToTopBtn) return;
        
        console.log('Toggle back to top visibility:', shouldShow);
        
        if (shouldShow) {
            this.backToTopBtn.classList.add('visible');
            this.backToTopBtn.style.opacity = '1';
            this.backToTopBtn.style.visibility = 'visible';
            this.backToTopBtn.style.transform = 'translateY(0) scale(1)';
        } else {
            this.backToTopBtn.classList.remove('visible');
            this.backToTopBtn.style.opacity = '0';
            this.backToTopBtn.style.visibility = 'hidden';
            this.backToTopBtn.style.transform = 'translateY(100px) scale(0.8)';
        }
    }

    scrollToTop() {
        console.log('Scrolling to top');
        this.backToTopClicks++;
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        this.showFeedback('Scrolling to top...', 'ri-arrow-up-line');
    }

    toggleContactFab() {
        console.log('Toggle contact FAB, current state:', this.isContactExpanded);
        
        if (this.isContactExpanded) {
            this.closeContactFab();
        } else {
            this.openContactFab();
        }
    }

    openContactFab() {
        console.log('Opening contact FAB');
        this.isContactExpanded = true;
        
        if (this.contactFabBtn) {
            this.contactFabBtn.classList.add('expanded');
        }
        
        if (this.contactBackdrop) {
            this.contactBackdrop.classList.add('active');
            this.contactBackdrop.style.opacity = '1';
            this.contactBackdrop.style.visibility = 'visible';
        }
        
        this.contactOptions.forEach((option, index) => {
            setTimeout(() => {
                option.style.opacity = '1';
                option.style.visibility = 'visible';
                option.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    closeContactFab() {
        console.log('Closing contact FAB');
        this.isContactExpanded = false;
        
        if (this.contactFabBtn) {
            this.contactFabBtn.classList.remove('expanded');
        }
        
        if (this.contactBackdrop) {
            this.contactBackdrop.classList.remove('active');
            this.contactBackdrop.style.opacity = '0';
            this.contactBackdrop.style.visibility = 'hidden';
        }
        
        this.contactOptions.forEach(option => {
            option.style.opacity = '0';
            option.style.visibility = 'hidden';
            option.style.transform = 'translateY(50px) scale(0.8)';
        });
    }

    handleContactClick(event, contactType, link) {
        console.log('Handling contact click:', contactType);
        
        this.contactInteractions[contactType] = (this.contactInteractions[contactType] || 0) + 1;
        
        const href = link.getAttribute('href');
        if (href && (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('sms:') || href.startsWith('http'))) {
            console.log('Allowing default link behavior for:', href);
        } else {
            event.preventDefault();
        }
        
        const messages = {
            call: 'Opening phone...',
            email: 'Opening email...',
            instagram: 'Opening Instagram...',
            text: 'Opening messages...'
        };
        
        this.showFeedback(messages[contactType] || 'Opening...', this.getIconForContactType(contactType));
        
        setTimeout(() => {
            this.closeContactFab();
        }, 1000);
    }

    getIconForContactType(type) {
        const icons = {
            call: 'ri-phone-line',
            email: 'ri-mail-line',
            instagram: 'ri-instagram-line',
            text: 'ri-message-line'
        };
        return icons[type] || 'ri-contacts-line';
    }

    showFeedback(message, iconClass, color = '#FF8C00') {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${color};
            color: white;
            padding: 16px 24px;
            border-radius: 24px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 200px;
            justify-content: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;
        
        feedback.innerHTML = `
            <i class="${iconClass}" style="font-size: 18px;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s ease';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 2000);
    }

    getInteractionStats() {
        return {
            backToTopClicks: this.backToTopClicks,
            contactInteractions: { ...this.contactInteractions },
            isContactExpanded: this.isContactExpanded,
            isBackToTopVisible: this.isBackToTopVisible
        };
    }
}

/* ========================================
   MAIN APPLICATION CLASS
   ======================================== */
class EviaAestheticsApp {
    constructor() {
        this.components = new Map();
        this.isMobile = window.innerWidth <= 768;
        this.isInitialized = false;
        
        console.log('🚀 Initializing Evia Aesthetics App');
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
        
        this.setupGlobalEvents();
    }

    initializeComponents() {
        try {
            console.log('📱 Initializing all components...');
            
            this.components.set('preloader', new Preloader());
            this.components.set('mobileMenu', new ModernMobileMenu());
            this.components.set('header', new ModernLuxuryHeader());
            this.components.set('hero', new HeroSection());
            this.components.set('whatsHot', new EviaWhatsHotCarousel());
            this.components.set('servicesCarousel', new HermesServicesScroller());
            this.components.set('about', new ElevatedAboutSection());
            this.components.set('results', new HermesResultsShowcase());
            this.components.set('contact', new ContactSection());
            this.components.set('floatingButtons', new HermesFloatingButtons());
            
            this.isInitialized = true;
            console.log('✅ All components initialized successfully');
            
            // Make components globally accessible
            window.eviaComponents = this.components;
            window.mobileMenu = this.components.get('mobileMenu');
            
        } catch (error) {
            console.error('❌ Error initializing components:', error);
        }
    }

    setupGlobalEvents() {
        window.addEventListener('resize', this.debounce(() => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                console.log('📱 Screen size changed, mobile:', this.isMobile);
                this.handleScreenSizeChange();
            }
            
            // Handle carousel resize
            const whatsHot = this.components.get('whatsHot');
            if (whatsHot && typeof whatsHot.handleResize === 'function') {
                whatsHot.handleResize();
            }
        }, 250));

        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 500);
        });
    }

    handleScreenSizeChange() {
        const mobileMenu = this.components.get('mobileMenu');
        if (mobileMenu && !this.isMobile && mobileMenu.isOpen) {
            mobileMenu.close();
        }
        
        const floatingButtons = this.components.get('floatingButtons');
        if (floatingButtons && floatingButtons.isContactExpanded) {
            floatingButtons.closeContactFab();
        }
    }

    getComponent(name) {
        return this.components.get(name);
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
}

/* ========================================
   MOBILE OPTIMIZATIONS & UTILITIES
   ======================================== */

// Fix for phones that have hover states
if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
}

// Mobile optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Fix iOS Safari viewport height issues
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 500);
    });

    // Prevent body scroll function
    window.preventBodyScroll = (isLocked) => {
        if (isLocked) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.dataset.scrollY = scrollY;
        } else {
            const scrollY = document.body.dataset.scrollY;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0'));
            }
        }
    };
});

/* ========================================
   GLOBAL ERROR HANDLING
   ======================================== */
window.addEventListener('error', (event) => {
    console.error('Global JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

/* ========================================
   INITIALIZATION
   ======================================== */
let app;

const initializeApp = () => {
    try {
        app = new EviaAestheticsApp();
        window.eviaApp = app;
        
        // Ensure mobile menu is available globally
        const mobileMenu = app.getComponent('mobileMenu');
        if (mobileMenu) {
            window.mobileMenu = mobileMenu;
        }
        
        console.log('🎉 Evia Aesthetics App Fully Loaded and Ready!');
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        
        // Fallback initialization
        try {
            console.log('🔄 Attempting fallback initialization...');
            
            window.mobileMenu = new ModernMobileMenu();
            window.hermesFloatingButtons = new HermesFloatingButtons();
            window.header = new ModernLuxuryHeader();
            
            console.log('✅ Fallback initialization completed');
        } catch (fallbackError) {
            console.error('❌ Fallback initialization failed:', fallbackError);
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready
    initializeApp();
}

// Backup initialization on window load
window.addEventListener('load', () => {
    if (!window.eviaApp) {
        console.log('🔄 App not initialized, retrying...');
        setTimeout(initializeApp, 100);
    }
});

// Make components globally accessible for debugging
window.ModernMobileMenu = ModernMobileMenu;
window.EviaWhatsHotCarousel = EviaWhatsHotCarousel;
window.HermesFloatingButtons = HermesFloatingButtons;
window.ModernLuxuryHeader = ModernLuxuryHeader;
window.HermesServicesScroller = HermesServicesScroller;
window.ContactSection = ContactSection;
window.HeroSection = HeroSection;
window.ElevatedAboutSection = ElevatedAboutSection;
window.HermesResultsShowcase = HermesResultsShowcase;

console.log('📱 Complete Evia Aesthetics Script with What\'s Hot Carousel Loaded Successfully!');
