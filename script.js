/* ========================================
   EVIA AESTHETICS - COMPLETE SCRIPT
   Manhattan Med Spa - Luxury Experience
   ======================================== */

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
        }
    }

    init() {
        this.startLoadingSequence();
        this.simulateLoading();
        
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
    }
}

/* ========================================
   MODERN HERMES HEADER - ENHANCED
   ======================================== */

class ModernHermesHeader {
    constructor() {
        this.header = document.getElementById('hermesHeader') || document.querySelector('.hermes-modern-header');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.desktopHamburger = document.getElementById('desktopHamburger');
        this.mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        this.menuCloseBtn = document.getElementById('menuCloseBtn');
        this.shopNowBtns = document.querySelectorAll('.shop-now-btn, .mobile-shop-btn');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item');
        this.body = document.body;
        
        // State management
        this.isScrolled = false;
        this.isMobileMenuOpen = false;
        this.scrollThreshold = 80;
        this.lastScrollY = 0;
        this.isAnimating = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        if (this.header) {
            this.init();
        }
    }

    init() {
        this.setupInitialState();
        this.bindEvents();
        this.setupScrollDetection();
        this.setupShopRedirect();
        this.setupNavigationHandlers();
        this.setupAccessibility();
        this.preloadAssets();
        
        // Expose to global scope
        window.modernHermesHeader = this;
        
        console.log('Modern Hermes Header initialized successfully');
    }

    setupInitialState() {
        // Set initial header state
        this.updateHeaderState();
        
        // Ensure mobile menu is closed
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.remove('active');
            this.mobileMenuOverlay.style.opacity = '0';
            this.mobileMenuOverlay.style.visibility = 'hidden';
        }
        
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.remove('active');
        }
        
        if (this.desktopHamburger) {
            this.desktopHamburger.classList.remove('active');
        }
        
        this.body.classList.remove('menu-open');
        this.isMobileMenuOpen = false;
    }

    bindEvents() {
        // Mobile menu toggle events
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Desktop hamburger events (appears on scroll)
        if (this.desktopHamburger) {
            this.desktopHamburger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Menu close button
        if (this.menuCloseBtn) {
            this.menuCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMobileMenu();
            });
        }

        // Overlay click to close
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === this.mobileMenuOverlay) {
                    this.closeMobileMenu();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    setupScrollDetection() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    handleScroll() {
        const currentScrollY = window.scrollY || document.documentElement.scrollTop;
        const shouldBeScrolled = currentScrollY > this.scrollThreshold;
        
        // Update header state if scroll status changed
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.updateHeaderScrollState();
        }
        
        // Close mobile menu on significant scroll
        if (this.isMobileMenuOpen && Math.abs(currentScrollY - this.lastScrollY) > 100) {
            this.closeMobileMenu();
        }
        
        this.lastScrollY = currentScrollY;
    }

    updateHeaderScrollState() {
        if (!this.header) return;
        
        this.header.classList.toggle('scrolled', this.isScrolled);
        
        // Dispatch scroll state change event
        this.dispatchHeaderEvent('scrollStateChanged', { 
            isScrolled: this.isScrolled,
            scrollY: this.lastScrollY 
        });
    }

    updateHeaderState() {
        // Initial state setup
        if (this.header) {
            this.header.style.opacity = '1';
            this.header.style.visibility = 'visible';
            this.header.style.transform = 'translateY(0)';
        }
    }

    // Mobile Menu Functions
    toggleMobileMenu() {
        if (this.isAnimating) return;
        
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (this.isAnimating || this.isMobileMenuOpen) return;
        
        this.isAnimating = true;
        this.isMobileMenuOpen = true;
        
        // Update both toggle buttons state
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.add('active');
        }
        
        if (this.desktopHamburger) {
            this.desktopHamburger.classList.add('active');
        }
        
        // Show overlay
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.add('active');
            this.mobileMenuOverlay.style.opacity = '1';
            this.mobileMenuOverlay.style.visibility = 'visible';
        }
        
        // Lock body scroll
        this.lockBodyScroll();
        
        // Animate menu items in
        this.animateMenuItemsIn();
        
        // Add vibration feedback on mobile
        if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate(50);
        }
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
            
            // Focus management
            const firstNavItem = this.mobileMenuOverlay?.querySelector('.mobile-nav-item');
            if (firstNavItem) {
                firstNavItem.focus();
            }
        }, 400);
        
        // Dispatch event
        this.dispatchHeaderEvent('mobileMenuOpened');
    }

    closeMobileMenu() {
        if (this.isAnimating || !this.isMobileMenuOpen) return;
        
        this.isAnimating = true;
        this.isMobileMenuOpen = false;
        
        // Update both toggle buttons state
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.remove('active');
        }
        
        if (this.desktopHamburger) {
            this.desktopHamburger.classList.remove('active');
        }
        
        // Hide overlay
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.remove('active');
            this.mobileMenuOverlay.style.opacity = '0';
            
            setTimeout(() => {
                this.mobileMenuOverlay.style.visibility = 'hidden';
            }, 400);
        }
        
        // Unlock body scroll
        this.unlockBodyScroll();
        
        // Animate menu items out
        this.animateMenuItemsOut();
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
            
            // Return focus to active toggle button
            const activeToggle = window.innerWidth > 768 && this.isScrolled ? 
                this.desktopHamburger : this.mobileMenuToggle;
            
            if (activeToggle) {
                activeToggle.focus();
            }
        }, 400);
        
        // Dispatch event
        this.dispatchHeaderEvent('mobileMenuClosed');
    }

    animateMenuItemsIn() {
        const menuItems = this.mobileMenuOverlay?.querySelectorAll('.mobile-nav-item, .mobile-shop-btn, .mobile-consultation-btn, .social-link');
        
        if (!menuItems) return;
        
        menuItems.forEach((item, index) => {
            // Set initial state
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) translateX(20px)';
            item.style.transition = 'none';
            
            // Animate in with staggered delay
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) translateX(0)';
                
                // Add entrance effect
                if (item.classList.contains('mobile-nav-item')) {
                    this.addItemGlowEffect(item);
                }
            }, 100 + (index * 80));
        });
    }

    animateMenuItemsOut() {
        const menuItems = this.mobileMenuOverlay?.querySelectorAll('.mobile-nav-item, .mobile-shop-btn, .mobile-consultation-btn, .social-link');
        
        if (!menuItems) return;
        
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px) translateX(30px)';
            }, index * 30);
        });
        
        // Reset all animations after close
        setTimeout(() => {
            menuItems.forEach(item => {
                item.style.transition = '';
                item.style.opacity = '';
                item.style.transform = '';
            });
        }, 500);
    }

    addItemGlowEffect(item) {
        setTimeout(() => {
            const originalBoxShadow = item.style.boxShadow;
            item.style.boxShadow = '0 0 20px rgba(255, 140, 0, 0.3)';
            
            setTimeout(() => {
                item.style.transition = 'box-shadow 0.6s ease';
                item.style.boxShadow = originalBoxShadow;
            }, 200);
        }, 100);
    }

    // Body Scroll Management
    lockBodyScroll() {
        const scrollY = window.scrollY;
        this.body.style.position = 'fixed';
        this.body.style.top = `-${scrollY}px`;
        this.body.style.width = '100%';
        this.body.style.overflow = 'hidden';
        this.body.classList.add('menu-open');
        this.body.dataset.scrollPosition = scrollY;
    }

    unlockBodyScroll() {
        const scrollY = this.body.dataset.scrollPosition;
        this.body.style.position = '';
        this.body.style.top = '';
        this.body.style.width = '';
        this.body.style.overflow = '';
        this.body.classList.remove('menu-open');
        
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0'));
        }
    }

    // Shop Now Redirect Handler
    setupShopRedirect() {
        this.shopNowBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleShopRedirect(btn);
            });
        });
    }

    handleShopRedirect(button) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Add click feedback
        this.addClickFeedback(button);
        
        // Show loading state
        this.showActionFeedback('Loading shop...', 'ri-shopping-bag-3-line');
        
        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Redirect after animations
        setTimeout(() => {
            window.location.href = 'https://us.alumiermd.com/products?code=54T7P4HH';
        }, this.isMobileMenuOpen ? 600 : 300);
    }

    addClickFeedback(element) {
        if (!element) return;
        
        // Scale animation
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.15s ease';
        
        // Cleanup
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 200);
    }

    showActionFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.className = 'header-action-feedback';
        
        feedback.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: var(--gradient-hermes-orange);
            color: white;
            padding: 16px 24px;
            border-radius: 50px;
            font-family: var(--font-inter);
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            opacity: 0;
            pointer-events: none;
            box-shadow: 0 20px 60px rgba(255, 140, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 200px;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
                    feedback.remove();
                }
            }, 400);
        }, 2500);
    }

    // Navigation Handlers
    setupNavigationHandlers() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.handleHashNavigation(href, link);
                }
            });
        });
    }

    handleHashNavigation(href, link) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Close mobile menu if open
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
                
                // Wait for menu close animation
                setTimeout(() => {
                    this.scrollToTarget(targetElement, link);
                }, 400);
            } else {
                this.scrollToTarget(targetElement, link);
            }
        }
    }

    scrollToTarget(targetElement, link) {
        const headerHeight = this.header?.offsetHeight || 80;
        const additionalOffset = 20;
        const targetPosition = targetElement.offsetTop - headerHeight - additionalOffset;
        
        // Add active state to navigation link
        this.setActiveNavLink(link);
        
        // Smooth scroll
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
        
        // Add scroll indicator feedback
        this.showActionFeedback(`Navigating to ${targetElement.id}...`, 'ri-navigation-line');
    }

    setActiveNavLink(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Resize Handler
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // Close mobile menu on resize to desktop
        if (!isMobile && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update header state
        this.updateHeaderState();
        
        // Dispatch resize event
        this.dispatchHeaderEvent('headerResized', { 
            isMobile: isMobile,
            width: window.innerWidth 
        });
    }

    // Accessibility Setup
    setupAccessibility() {
        // Add ARIA attributes
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
            this.mobileMenuToggle.setAttribute('aria-controls', 'mobileMenuOverlay');
        }
        
        if (this.desktopHamburger) {
            this.desktopHamburger.setAttribute('aria-label', 'Toggle navigation menu');
            this.desktopHamburger.setAttribute('aria-expanded', 'false');
            this.desktopHamburger.setAttribute('aria-controls', 'mobileMenuOverlay');
        }
        
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.setAttribute('role', 'dialog');
            this.mobileMenuOverlay.setAttribute('aria-label', 'Navigation menu');
            this.mobileMenuOverlay.setAttribute('aria-modal', 'true');
        }
    }

    // Asset Preloading
    preloadAssets() {
        const criticalAssets = [
            'images/logo.png',
            'images/mobilelogo.png'
        ];
        
        criticalAssets.forEach(src => {
            const img = new Image();
            img.src = src;
            img.loading = 'eager';
        });
    }

    // Event System
    dispatchHeaderEvent(eventName, detail = {}) {
        const event = new CustomEvent(`hermes:header:${eventName}`, {
            detail: {
                header: this,
                timestamp: Date.now(),
                ...detail
            }
        });
        
        document.dispatchEvent(event);
    }

    // Utility Functions
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

    // Public API Methods
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        this.showActionFeedback('Scrolling to top...', 'ri-arrow-up-line');
    }

    navigateToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            this.scrollToTarget(targetElement);
        }
    }

    // Cleanup for SPA compatibility
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Unlock body if needed
        if (this.isMobileMenuOpen) {
            this.unlockBodyScroll();
        }
        
        // Clear animations
        this.isAnimating = false;
        
        console.log('Modern Hermes Header destroyed');
    }
}

// Initialize Header System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize new header
    const modernHeader = new ModernHermesHeader();
    
    // Add to global scope for compatibility
    window.ModernHermesHeader = ModernHermesHeader;
    window.modernHermesHeader = modernHeader;
    
    console.log('Modern Hermes Header System Loaded');
});

// Global utility functions
window.hermesHeaderUtils = {
    scrollToContact: () => {
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
        }
    },
    
    openShop: () => {
        const header = window.modernHermesHeader;
        if (header) {
            header.handleShopRedirect(document.querySelector('.shop-now-btn'));
        } else {
            window.location.href = 'https://us.alumiermd.com/products?code=54T7P4HH';
        }
    },
    
    closeAllMenus: () => {
        if (window.modernHermesHeader && window.modernHermesHeader.isMobileMenuOpen) {
            window.modernHermesHeader.closeMobileMenu();
        }
        
        if (window.mobileMenu && window.mobileMenu.isOpen) {
            window.mobileMenu.close();
        }
    }
};

/* ========================================
   HERO SECTION
   ======================================== */
class HeroSection {
    constructor() {
        this.heroSection = document.querySelector('.cinematic-hero');
        this.ctaButton = document.getElementById('luxuryHeroCTA') || document.querySelector('.hero-cta-signature');
        this.scrollIndicator = document.querySelector('.hero-scroll-indicator-elegant');
        this.videoElement = document.querySelector('.hero-video');
        
        if (this.heroSection) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.setupVideoHandling();
        this.setupScrollIndicator();
        this.ensureContentVisibility();
    }

    ensureContentVisibility() {
        const heroContent = document.querySelector('.hero-content-stack');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.visibility = 'visible';
            heroContent.style.zIndex = '100';
        }
    }

    bindEvents() {
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToContact();
            });
        }

        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                this.scrollToNextSection();
            });
        }
    }

    setupVideoHandling() {
        if (!this.videoElement) return;

        this.videoElement.addEventListener('loadeddata', () => {
            console.log('Hero video loaded');
        });

        this.videoElement.addEventListener('error', (e) => {
            console.warn('Hero video failed to load:', e);
        });

        if (this.videoElement) {
            this.videoElement.load();
            this.videoElement.play().catch(e => console.log('Video autoplay prevented:', e));
        }
    }

    setupScrollIndicator() {
        if (!this.scrollIndicator) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrollY / 300));
            this.scrollIndicator.style.opacity = opacity;
        }, { passive: true });
    }

    scrollToNextSection() {
        const nextSection = this.heroSection.nextElementSibling;
        if (nextSection) {
            const Height = 80;
            const targetPosition = nextSection.offsetTop - Height;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const Height = 80;
            const elementPosition = contactSection.offsetTop - Height;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
}

/* ========================================
   WHATS HOT SECTION
   ======================================== */
class EnhancedWhatsHotCarousel {
    constructor() {
        this.currentSlide = 0;
        this.itemsPerView = 1;
        this.maxSlide = 0;
        this.isAutoplay = true;
        this.autoplayInterval = null;
        this.isTransitioning = false;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationId;

        // DOM Elements
        this.section = document.getElementById('whatsHotSection');
        this.track = document.getElementById('hotCarouselTrack');
        this.prevBtn = document.getElementById('hotPrevBtn');
        this.nextBtn = document.getElementById('hotNextBtn');
        this.dotsContainer = document.getElementById('hotCarouselDots');
        this.cards = document.querySelectorAll('.evia-treatment-card');
        this.modalOverlay = document.getElementById('treatmentModalOverlay');

        this.init();
    }

    init() {
        if (!this.track || !this.cards.length) {
            console.warn('What\'s Hot Carousel: Required elements not found');
            return;
        }

        this.setupCarousel();
        this.setupEventListeners();
        this.setupModals();
        this.startAutoplay();
        this.createDots();

        console.log('✨ Enhanced What\'s Hot Carousel Initialized');
    }

    setupCarousel() {
        this.calculateDimensions();
        this.updateCarousel();
        
        // Add intersection observer for performance
        this.setupIntersectionObserver();
        
        // Initialize card animations
        this.cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    calculateDimensions() {
        const containerWidth = this.track.parentElement.offsetWidth;
        const cardWidth = 340; // Base card width
        const gap = 32;

        if (window.innerWidth > 1200) {
            this.itemsPerView = Math.min(3, this.cards.length);
        } else if (window.innerWidth > 768) {
            this.itemsPerView = Math.min(2, this.cards.length);
        } else {
            this.itemsPerView = 1;
        }

        this.maxSlide = Math.max(0, this.cards.length - this.itemsPerView);
        this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
    }

    updateCarousel() {
        if (!this.track) return;

        const cardWidth = this.cards[0]?.offsetWidth || 340;
        const gap = 32;
        const moveDistance = this.currentSlide * (cardWidth + gap);

        this.track.style.transform = `translateX(-${moveDistance}px)`;
        this.updateDots();
        this.updateNavigation();
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Touch/swipe support
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
            this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

            // Mouse drag support
            this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.track.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.track.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

            // Prevent default drag behavior
            this.track.addEventListener('dragstart', (e) => e.preventDefault());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Pause autoplay on hover
        if (this.section) {
            this.section.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.section.addEventListener('mouseleave', () => this.resumeAutoplay());
        }

        // Window resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Learn more button clicks
        this.cards.forEach(card => {
            const learnMoreBtn = card.querySelector('.learn-more-btn');
            if (learnMoreBtn) {
                learnMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const treatmentType = card.dataset.treatment;
                    this.openModal(treatmentType);
                });
            }

            // Card click to open modal
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on the learn more button
                if (e.target.closest('.learn-more-btn')) return;
                
                const treatmentType = card.dataset.treatment;
                this.openModal(treatmentType);
            });
        });
    }

    // Navigation Methods
    nextSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide < this.maxSlide) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            this.goToSlide(0); // Loop back to beginning
        }
    }

    prevSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            this.goToSlide(this.maxSlide); // Loop to end
        }
    }

    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        
        this.isTransitioning = true;
        this.currentSlide = Math.max(0, Math.min(slideIndex, this.maxSlide));
        
        this.updateCarousel();
        this.addRippleEffect();

        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    // Touch/Mouse Handlers
    handleTouchStart(e) {
        this.isDragging = true;
        this.startPos = e.touches[0].clientX;
        this.pauseAutoplay();
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        const currentPos = e.touches[0].clientX;
        const diff = this.startPos - currentPos;
        
        if (Math.abs(diff) > 5) {
            e.preventDefault();
        }
    }

    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const endPos = e.changedTouches[0].clientX;
        const diff = this.startPos - endPos;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        
        this.resumeAutoplay();
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.startPos = e.clientX;
        this.track.style.cursor = 'grabbing';
        this.pauseAutoplay();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        
        const endPos = e.clientX;
        const diff = this.startPos - endPos;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        
        this.resumeAutoplay();
    }

    handleKeyboard(e) {
        if (e.target.closest('.evia-enhanced-modal')) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                this.prevSlide();
                break;
            case 'ArrowRight':
                this.nextSlide();
                break;
        }
    }

    // Dots Navigation
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i <= this.maxSlide; i++) {
            const dot = document.createElement('button');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', i);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    updateNavigation() {
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.maxSlide > 0 ? '1' : '0.5';
        }
        
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.maxSlide > 0 ? '1' : '0.5';
        }
    }

    // Autoplay Methods
    startAutoplay() {
        if (!this.isAutoplay || this.maxSlide === 0) return;
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isDragging && !document.hidden) {
                this.nextSlide();
            }
        }, 5000);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resumeAutoplay() {
        if (this.isAutoplay) {
            setTimeout(() => {
                this.startAutoplay();
            }, 1000);
        }
    }

    // Visual Effects
    addRippleEffect() {
        const ripples = document.querySelectorAll('.nav-ripple');
        ripples.forEach(ripple => {
            ripple.style.animation = 'none';
            setTimeout(() => {
                ripple.style.animation = 'navRipple 0.6s ease-out';
            }, 10);
        });
    }

    // Intersection Observer for Performance
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.resumeAutoplay();
                } else {
                    this.pauseAutoplay();
                }
            });
        }, { threshold: 0.5 });

        if (this.section) {
            observer.observe(this.section);
        }
    }

    // Resize Handler
    handleResize() {
        this.calculateDimensions();
        this.updateCarousel();
        this.createDots();
    }

    // Modal System
    setupModals() {
        // Modal close handlers
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Overlay click to close
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay?.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Book treatment button
        const bookBtn = document.getElementById('bookTreatmentBtn');
        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                this.closeModal();
                this.scrollToContact();
            });
        }
    }

    openModal(treatmentType) {
        if (!this.modalOverlay) return;

        const treatmentData = this.getTreatmentData(treatmentType);
        this.populateModal(treatmentData);
        
        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Pause carousel autoplay when modal is open
        this.pauseAutoplay();

        // Add opening animation
        const modal = this.modalOverlay.querySelector('.evia-enhanced-modal');
        if (modal) {
            modal.style.animation = 'modalSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }

        // Add fade-in effect to modal image
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.style.opacity = '0';
            modalImage.onload = () => {
                modalImage.style.transition = 'opacity 0.5s ease';
                modalImage.style.opacity = '1';
            };
        }
    }

    closeModal() {
        if (!this.modalOverlay) return;

        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Resume autoplay when modal closes
        this.resumeAutoplay();
    }

    getTreatmentData(treatmentType) {
        const treatmentDatabase = {
            'nad-drip': {
                title: 'NAD+ Drip Therapy',
                icon: 'ri-drop-line',
                image: 'https://beauxmedspa.com/wp-content/uploads/2025/05/beaux-nad-vial.jpg',
                price: '$450',
                duration: '90 min',
                description: 'NAD+ (Nicotinamide Adenine Dinucleotide) IV therapy is our most advanced cellular regeneration treatment. This essential coenzyme is delivered directly into your bloodstream, bypassing the digestive system for maximum bioavailability. NAD+ plays a crucial role in cellular energy production, DNA repair, and anti-aging processes at the molecular level.',
                benefits: [
                    'Enhanced mental clarity and cognitive function',
                    'Significant increase in natural energy levels',
                    'Accelerated cellular repair and regeneration',
                    'Improved sleep quality and mood stability',
                    'Anti-aging benefits at the cellular level',
                    'Enhanced metabolic function and fat burning'
                ],
                details: [
                    { icon: 'ri-time-line', label: 'Duration', value: '90 Minutes' },
                    { icon: 'ri-money-dollar-circle-line', label: 'Investment', value: '$450' },
                    { icon: 'ri-refresh-line', label: 'Frequency', value: 'Weekly' },
                    { icon: 'ri-shield-check-line', label: 'Safety', value: 'FDA Approved' }
                ]
            },
            'vitamin-c': {
                title: 'Vitamin C Glow Infusion',
                icon: 'ri-sun-line',
                image: 'https://images-cdn.u-buy.com.ng/675d1e49fb876a53e42dfee6-vial-vitamin-c-vial-10-ml-mccm.jpg',
                price: '$180',
                duration: '45 min',
                featured: true,
                description: 'Our signature Vitamin C Glow IV therapy delivers a concentrated dose of pharmaceutical-grade vitamin C directly to your cells for maximum absorption. This treatment supports robust immune function, promotes natural collagen production, and delivers that coveted healthy glow from within. Perfect for those seeking radiant skin and enhanced vitality.',
                benefits: [
                    'Dramatic improvement in skin brightness and tone',
                    'Powerful immune system support and protection',
                    'Natural collagen synthesis for youthful skin',
                    'Antioxidant protection against free radical damage',
                    'Enhanced natural radiance and healthy glow',
                    'Improved skin texture and reduced fine lines'
                ],
                details: [
                    { icon: 'ri-time-line', label: 'Duration', value: '45 Minutes' },
                    { icon: 'ri-money-dollar-circle-line', label: 'Investment', value: '$180' },
                    { icon: 'ri-refresh-line', label: 'Frequency', value: 'Bi-weekly' },
                    { icon: 'ri-star-line', label: 'Rating', value: '5.0 Stars' }
                ]
            },
            'hydration': {
                title: 'Hydration Plus Recovery',
                icon: 'ri-water-percent-line',
                image: 'https://naturaldripiv.com/wp-content/uploads/2022/07/Natural-Drip-Natural-Buzz-Injection.png',
                price: '$120',
                duration: '30 min',
                description: 'Our Hydration Plus IV therapy is the ultimate solution for rapid cellular rehydration and complete mineral replenishment. This carefully formulated blend of electrolytes, minerals, and fluids is delivered directly to your bloodstream for immediate absorption and maximum effectiveness. Ideal for recovery, performance, and overall wellness.',
                benefits: [
                    'Rapid rehydration at the cellular level',
                    'Complete electrolyte balance restoration',
                    'Immediate relief from dehydration symptoms',
                    'Enhanced energy and mental clarity',
                    'Optimal physical performance support',
                    'Accelerated recovery from exercise or illness'
                ],
                details: [
                    { icon: 'ri-time-line', label: 'Duration', value: '30 Minutes' },
                    { icon: 'ri-money-dollar-circle-line', label: 'Investment', value: '$120' },
                    { icon: 'ri-refresh-line', label: 'Frequency', value: 'As needed' },
                    { icon: 'ri-heart-pulse-line', label: 'Benefits', value: 'Immediate' }
                ]
            },
            'energy': {
                title: 'Energy Boost Complex',
                icon: 'ri-flashlight-line',
                image: 'https://ivymenshealth.com/wp-content/uploads/2023/01/energy-1024x1024.png',
                price: '$150',
                duration: '20 min',
                description: 'Our Energy Boost IV therapy combines a powerful synergy of B-vitamins, amino acids, and essential minerals to naturally elevate your energy levels and sharpen mental focus. This treatment is specifically formulated to combat fatigue, enhance concentration, and support sustained vitality throughout your day.',
                benefits: [
                    'Sustained natural energy without crashes',
                    'Enhanced mental focus and concentration',
                    'Reduced fatigue and brain fog',
                    'Improved mood and motivation',
                    'Healthy metabolism support',
                    'Increased productivity and performance'
                ],
                details: [
                    { icon: 'ri-time-line', label: 'Duration', value: '20 Minutes' },
                    { icon: 'ri-money-dollar-circle-line', label: 'Investment', value: '$150' },
                    { icon: 'ri-refresh-line', label: 'Frequency', value: 'Weekly' },
                    { icon: 'ri-lightning-line', label: 'Effect', value: 'Immediate' }
                ]
            },
            'immunity': {
                title: 'Immunity Shield Defense',
                icon: 'ri-shield-check-line',
                image: 'https://www.olympiapharmacy.com/wp-content/uploads/2022/11/Tri-Immune-scaled.jpg',
                price: '$200',
                duration: '60 min',
                description: 'Our Immunity Shield IV therapy provides comprehensive immune system support through a concentrated blend of immune-boosting nutrients including high-dose vitamin C, zinc, and powerful antioxidants like glutathione. This advanced formulation helps strengthen your natural defenses and provides robust protection against environmental stressors.',
                benefits: [
                    'Comprehensive immune system strengthening',
                    'Powerful antioxidant protection against illness',
                    'Accelerated recovery from minor illnesses',
                    'Reduced oxidative stress and inflammation',
                    'Enhanced overall wellness and vitality',
                    'Seasonal protection and support'
                ],
                details: [
                    { icon: 'ri-time-line', label: 'Duration', value: '60 Minutes' },
                    { icon: 'ri-money-dollar-circle-line', label: 'Investment', value: '$200' },
                    { icon: 'ri-refresh-line', label: 'Frequency', value: 'Monthly' },
                    { icon: 'ri-shield-check-line', label: 'Protection', value: 'Advanced' }
                ]
            }
        };

        return treatmentDatabase[treatmentType] || treatmentDatabase['vitamin-c'];
    }

    populateModal(data) {
        if (!data) return;

        // Update modal image
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.src = data.image;
            modalImage.alt = data.title;
        }

        // Update modal icon
        const modalIcon = document.getElementById('modalIcon');
        const modalIconSymbol = document.getElementById('modalIconSymbol');
        if (modalIcon && modalIconSymbol) {
            modalIconSymbol.className = data.icon;
            modalIcon.classList.toggle('featured', data.featured || false);
        }

        // Update modal title
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = data.title;
        }

        // Update modal description
        const modalDescription = document.getElementById('modalDescription');
        if (modalDescription) {
            modalDescription.textContent = data.description;
        }

        // Update benefits list
        const modalBenefits = document.getElementById('modalBenefits');
        if (modalBenefits && data.benefits) {
            modalBenefits.innerHTML = data.benefits.map(benefit => `
                <li>
                    <i class="ri-check-circle-fill"></i>
                    ${benefit}
                </li>
            `).join('');
        }

        // Update details grid
        const modalDetails = document.getElementById('modalDetails');
        if (modalDetails && data.details) {
            modalDetails.innerHTML = data.details.map(detail => `
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="${detail.icon}"></i>
                    </div>
                    <div class="detail-content">
                        <span class="detail-label">${detail.label}</span>
                        <span class="detail-value">${detail.value}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact') || document.querySelector('.contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedWhatsHotCarousel();
});

// Add CSS animations dynamically
const addCustomAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            0% {
                opacity: 0;
                transform: scale(0.8) translateY(50px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes navRipple {
            0% {
                opacity: 0;
                transform: scale(0);
            }
            50% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(1.2);
            }
        }

        .evia-treatment-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Enhanced hover states */
        .evia-treatment-card:hover .treatment-bg-image {
            filter: brightness(1.1);
        }

        .evia-treatment-card:hover .treatment-title {
            text-shadow: 0 2px 8px rgba(255, 140, 0, 0.3);
        }

        /* Focus states for accessibility */
        .evia-treatment-card:focus,
        .evia-carousel-nav:focus,
        .learn-more-btn:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.4);
        }

        /* Loading states */
        .modal-loading .evia-enhanced-modal-body {
            opacity: 0.7;
            pointer-events: none;
        }

        /* Smooth scrolling enhancement */
        html {
            scroll-behavior: smooth;
        }
    `;
    
    document.head.appendChild(style);
};

// Initialize animations
document.addEventListener('DOMContentLoaded', addCustomAnimations);

// Utility function for smooth scrolling to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact') || 
                          document.querySelector('.contact-section') ||
                          document.querySelector('[id*="contact"]');
    
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // Fallback - try to scroll to bottom of page if no contact section found
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
}

/* ========================================
   SERVICES SECTION
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
        
        if (this.scrollContainer && this.scrollGrid) {
            this.init();
        }
    }

    init() {
        this.initializeElements();
        this.setupCardAnimations();
        this.bindEvents();
        this.updateArrowStates();
        this.initializeIntersectionObserver();
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

            const diff = touchState.startX - touchState.touchEndX;

            if (Math.abs(diff) > 50 || touchState.velocity > 0.3) {
                if (diff > 0) {
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
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

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
            const Height = 80;
            const elementPosition = contactSection.offsetTop - Height;
            
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
}

/* ========================================
   RESULTS SECTION
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
            const Height = 80;
            const elementPosition = contactSection.offsetTop - Height;
            
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
   PRODUCTS SECTION
   ======================================== */

class LuxuryCarouselController {
    constructor() {
        this.track = document.getElementById('luxuryCarouselTrack');
        this.slides = document.querySelectorAll('.luxury-carousel-slide');
        this.prevBtn = document.getElementById('luxuryCarouselPrev');
        this.nextBtn = document.getElementById('luxuryCarouselNext');
        this.progressBar = document.getElementById('luxuryCarouselProgress');
        this.currentSlideElement = document.querySelector('.luxury-carousel-current');
        this.totalSlidesElement = document.querySelector('.luxury-carousel-total');
        
        this.currentIndex = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.totalSlides = this.slides.length;
        this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.startAutoPlay();
        this.setupProductInteractions();
        this.initializeCounter();
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 3;
    }
    
    initializeCounter() {
        if (this.totalSlidesElement) {
            this.totalSlidesElement.textContent = this.totalSlides;
        }
        this.updateCounter();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse events for auto-play control
        const section = document.querySelector('.luxury-carousel-section');
        section.addEventListener('mouseenter', () => this.pauseAutoPlay());
        section.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Page visibility
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    setupProductInteractions() {
        // Product card hover effects
        this.slides.forEach((slide, index) => {
            const card = slide.querySelector('.luxury-carousel-product-card');
            if (card) {
                card.addEventListener('click', () => this.handleProductClick(index));
            }
        });
        
        // Explore catalog button
        const exploreBtn = document.querySelector('.luxury-carousel-explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const url = exploreBtn.dataset.url;
                if (url) {
                    // Add luxury click animation
                    exploreBtn.style.transform = 'scale(0.95) translateY(-4px)';
                    setTimeout(() => {
                        exploreBtn.style.transform = '';
                        window.open(url, '_blank');
                    }, 150);
                }
            });
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex; // Loop to end
        }
        this.updateDisplay();
        this.resetAutoPlay();
    }
    
    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop to beginning
        }
        this.updateDisplay();
        this.resetAutoPlay();
    }
    
    updateDisplay() {
        const slideWidth = 100 / this.slidesPerView;
        const translateX = -(this.currentIndex * slideWidth);
        
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateProgressBar();
        this.updateCounter();
        this.updateNavigationState();
        this.animateCards();
    }
    
    updateProgressBar() {
        if (this.progressBar) {
            const progress = ((this.currentIndex + 1) / this.totalSlides);
            this.progressBar.style.transform = `scaleX(${progress})`;
        }
    }
    
    updateCounter() {
        if (this.currentSlideElement) {
            this.currentSlideElement.textContent = this.currentIndex + 1;
        }
    }
    
    updateNavigationState() {
        // For infinite loop, never disable buttons
        if (this.prevBtn) this.prevBtn.disabled = false;
        if (this.nextBtn) this.nextBtn.disabled = false;
    }
    
    animateCards() {
        // Add stagger animation to visible cards
        const visibleStart = this.currentIndex;
        const visibleEnd = Math.min(visibleStart + this.slidesPerView, this.totalSlides);
        
        for (let i = visibleStart; i < visibleEnd; i++) {
            const card = this.slides[i]?.querySelector('.luxury-carousel-product-card');
            if (card) {
                card.style.animationDelay = `${(i - visibleStart) * 0.1}s`;
                card.classList.add('card-animate');
                
                setTimeout(() => {
                    card.classList.remove('card-animate');
                }, 600);
            }
        }
    }
    
    handleProductClick(index) {
        // Add luxury product selection feedback
        const card = this.slides[index]?.querySelector('.luxury-carousel-product-card');
        if (card) {
            card.style.transform = 'scale(0.98)';
            card.style.transition = 'transform 0.15s ease';
            setTimeout(() => {
                card.style.transform = '';
                card.style.transition = '';
            }, 200);
        }
    }
    
    startAutoPlay() {
        if (this.isAutoPlaying && this.totalSlides > this.slidesPerView) {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        setTimeout(() => this.resumeAutoPlay(), 2000);
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.pauseAutoPlay();
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        this.resetAutoPlay();
    }
    
    handleSwipe() {
        const swipeThreshold = 60;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    handleKeyPress(e) {
        const section = document.querySelector('.luxury-carousel-section');
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        }
    }
    
    handleResize() {
        const newSlidesPerView = this.getSlidesPerView();
        if (newSlidesPerView !== this.slidesPerView) {
            this.slidesPerView = newSlidesPerView;
            this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.updateDisplay();
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAutoPlay();
        } else {
            this.resumeAutoPlay();
        }
    }
    
    destroy() {
        this.pauseAutoPlay();
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// Enhanced luxury animations
function initLuxuryCarouselAnimations() {
    const section = document.querySelector('.luxury-carousel-section');
    const cards = document.querySelectorAll('.luxury-carousel-product-card');
    
    // Section entrance animation
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Stagger card animations with luxury timing
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 120);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    if (section) {
        sectionObserver.observe(section);
    }
    
    // Initialize card states for entrance animation
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
}

// Performance optimizations
function optimizeLuxuryCarousel() {
    // Preload product images
    const images = document.querySelectorAll('.luxury-carousel-image');
    images.forEach(img => {
        const imageUrl = img.src;
        const preloadImg = new Image();
        preloadImg.src = imageUrl;
    });
    
    // Add performance hints
    const track = document.getElementById('luxuryCarouselTrack');
    if (track) {
        track.style.willChange = 'transform';
        
        // Clean up will-change
        track.addEventListener('transitionend', () => {
            setTimeout(() => {
                track.style.willChange = 'auto';
            }, 100);
        });
    }
}

// Initialize luxury carousel system
document.addEventListener('DOMContentLoaded', function() {
    // Wait for fonts and AOS to load
    setTimeout(() => {
        const luxuryCarousel = new LuxuryCarouselController();
        initLuxuryCarouselAnimations();
        optimizeLuxuryCarousel();
        
        // Store globally for debugging
        window.luxuryCarousel = luxuryCarousel;
        
        console.log('🏺 Hermes Luxury Carousel system initialized');
    }, 150);
});

// Final load optimizations
window.addEventListener('load', function() {
    const section = document.querySelector('.luxury-carousel-section');
    if (section) {
        section.style.opacity = '1';
    }
});


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
                console.log('Elfsight form enhanced');
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
        
        if (this.backToTopBtn || this.contactFabBtn) {
            this.init();
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
                this.scrollToTop();
            });
            
            this.backToTopBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.scrollToTop();
            });
        }

        if (this.mainContactBtn) {
            this.mainContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleContactFab();
            });
            
            this.mainContactBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleContactFab();
            });
        }

        if (this.contactBackdrop) {
            this.contactBackdrop.addEventListener('click', (e) => {
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
                    this.handleContactClick(e, contactType, link);
                });
                
                link.addEventListener('touchend', (e) => {
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
        this.backToTopClicks++;
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        this.showFeedback('Scrolling to top...', 'ri-arrow-up-line');
    }

    toggleContactFab() {        
        if (this.isContactExpanded) {
            this.closeContactFab();
        } else {
            this.openContactFab();
        }
    }

    openContactFab() {
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
        this.contactInteractions[contactType] = (this.contactInteractions[contactType] || 0) + 1;
        
        const href = link.getAttribute('href');
        if (href && (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('sms:') || href.startsWith('http'))) {
            // Allow default behavior
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
}

/* ========================================
   UTILITIES
   ======================================== */
function scrollToContact() {
    const carousel = EviaWhatsHotCarousel.getInstance();
    if (carousel) {
        carousel.scrollToContact();
    } else {
        const contactSection = document.getElementById('contact') || 
                             document.querySelector('.contact-section') ||
                             document.querySelector('[data-section="contact"]');
        
        if (contactSection) {
            const Height = 80;
            const elementPosition = contactSection.offsetTop - Height;
            
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

/* ========================================
   MAIN APP
   ======================================== */
class EviaAestheticsApp {
    constructor() {
        this.components = new Map();
        this.isMobile = window.innerWidth <= 768;
        this.isInitialized = false;
        
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
            this.components.set('preloader', new Preloader());
            this.components.set('header', new ModernHermesHeader());
            this.components.set('hero', new HeroSection());
            this.components.set('whatsHot', new EnhancedWhatsHotCarousel());
            this.components.set('servicesCarousel', new HermesServicesScroller());
            this.components.set('about', new ElevatedAboutSection());
            this.components.set('results', new HermesResultsShowcase());
            this.components.set('products', new LuxuryCarouselController());
            this.components.set('contact', new ContactSection());
            this.components.set('floatingButtons', new HermesFloatingButtons());
            
            this.isInitialized = true;
            
            window.eviaComponents = this.components;
            window.mobileMenu = this.components.get('mobileMenu');
            window.eviaWhatsHotCarousel = this.components.get('whatsHot');
            
        } catch (error) {
            console.error('Error initializing components:', error);
            
            try {
                window.eviaWhatsHotCarousel = new EviaWhatsHotCarousel();
                window.hermesFloatingButtons = new HermesFloatingButtons();
                window.header = new ModernHermesHeader();
                
            } catch (fallbackError) {
                console.error('Fallback initialization failed:', fallbackError);
            }
        }
    }

    setupGlobalEvents() {
        window.addEventListener('resize', this.debounce(() => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                this.handleScreenSizeChange();
            }
            
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
   INITIALIZATION
   ======================================== */
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
    
    const heroContent = document.querySelector('.hero-content-stack');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.visibility = 'visible';
        heroContent.style.zIndex = '100';
    }
    
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.load();
        heroVideo.play().catch(e => console.log('Video autoplay prevented:', e));
    }

    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 500);
    });

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

if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
}

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

let app;

const initializeApp = () => {
    try {
        app = new EviaAestheticsApp();
        window.eviaApp = app;
        
        const mobileMenu = app.getComponent('mobileMenu');
        if (mobileMenu) {
            window.mobileMenu = mobileMenu;
        }
        
        const whatsHot = app.getComponent('whatsHot');
        if (whatsHot) {
            window.eviaWhatsHotCarousel = whatsHot;
        }
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        
        try {
            window.eviaWhatsHotCarousel = new EviaWhatsHotCarousel();
            window.hermesFloatingButtons = new HermesFloatingButtons();
            window.header = new ModernHermesHeader();
            
        } catch (fallbackError) {
            console.error('Fallback initialization failed:', fallbackError);
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

window.addEventListener('load', () => {
    if (!window.eviaApp) {
        setTimeout(initializeApp, 100);
    }
});

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
window.EnhancedWhatsHotCarousel = EnhancedWhatsHotCarousel;
window.HermesFloatingButtons = HermesFloatingButtons;
window.ModernHermesHeader = ModernHermesHeader;
window.LuxuryCarouselController = LuxuryCarouselController;
window.HermesServicesScroller = HermesServicesScroller;
window.ContactSection = ContactSection;
window.HeroSection = HeroSection;
window.ElevatedAboutSection = ElevatedAboutSection;
window.HermesResultsShowcase = HermesResultsShowcase;
