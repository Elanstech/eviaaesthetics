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
class EviaWhatsHotCarousel {
    constructor() {
        this.section = document.querySelector('.evia-whats-hot-carousel-section');
        this.track = document.getElementById('hotCarouselTrack');
        this.cards = document.querySelectorAll('.evia-treatment-card');
        this.prevBtn = document.getElementById('hotPrevBtn');
        this.nextBtn = document.getElementById('hotNextBtn');
        this.dotsContainer = document.getElementById('hotCarouselDots');
        this.modalOverlay = document.getElementById('treatmentModalOverlay');
        
        this.currentSlide = 0;
        this.cardWidth = 0;
        this.cardGap = 32;
        this.visibleCards = 1;
        this.maxSlide = 0;
        this.isTransitioning = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        this.isAutoplayPaused = false;
        
        // Touch/drag support
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 50;
        
        if (this.section && this.track && this.cards.length > 0) {
            this.init();
        }
    }

    init() {
        this.calculateDimensions();
        this.setupEventListeners();
        this.createDots();
        this.updateCarousel();
        this.setupModals();
        this.startAutoplay();
        
        console.log('🔥 Enhanced What\'s Hot Carousel Initialized');
    }

    calculateDimensions() {
        if (!this.cards.length) return;
        
        const containerWidth = this.track.parentElement.clientWidth;
        this.cardWidth = this.cards[0].offsetWidth;
        
        // Responsive visible cards calculation
        if (window.innerWidth >= 1200) {
            this.visibleCards = Math.min(3, this.cards.length);
        } else if (window.innerWidth >= 768) {
            this.visibleCards = Math.min(2, this.cards.length);
        } else {
            this.visibleCards = 1;
        }
        
        this.maxSlide = Math.max(0, this.cards.length - this.visibleCards);
        
        // Ensure current slide is within bounds
        if (this.currentSlide > this.maxSlide) {
            this.currentSlide = this.maxSlide;
        }
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
                this.pauseAutoplay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
                this.pauseAutoplay();
            });
        }

        // Touch/drag support
        if (this.track) {
            // Touch events
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e));

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
        this.updateDots();
        
        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    updateCarousel() {
        if (!this.track) return;
        
        const translateX = -(this.currentSlide * (this.cardWidth + this.cardGap));
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update navigation button states
        this.updateNavigationStates();
    }

    updateNavigationStates() {
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
            this.prevBtn.style.pointerEvents = this.currentSlide === 0 ? 'none' : 'auto';
        }
        
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentSlide === this.maxSlide ? '0.5' : '1';
            this.nextBtn.style.pointerEvents = this.currentSlide === this.maxSlide ? 'none' : 'auto';
        }
    }

    // Dots Navigation
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i <= this.maxSlide; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                this.pauseAutoplay();
            });
            
            this.dotsContainer.appendChild(dot);
        }
        
        this.updateDots();
    }

    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    // Touch/Drag Support
    handleTouchStart(e) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.pauseAutoplay();
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        
        this.startX = 0;
        this.currentX = 0;
    }

    handleMouseDown(e) {
        e.preventDefault();
        this.isDragging = true;
        this.startX = e.clientX;
        this.track.style.cursor = 'grabbing';
        this.pauseAutoplay();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.clientX;
        
        // Optional: Add visual feedback during drag
        const diff = this.startX - this.currentX;
        const currentTranslateX = -(this.currentSlide * (this.cardWidth + this.cardGap));
        const newTranslateX = currentTranslateX - diff * 0.5;
        
        // this.track.style.transform = `translateX(${newTranslateX}px)`;
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        } else {
            // Snap back to current position
            this.updateCarousel();
        }
        
        this.startX = 0;
        this.currentX = 0;
    }

    // Keyboard Support
    handleKeyboard(e) {
        if (!this.section.matches(':hover')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                this.pauseAutoplay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                this.pauseAutoplay();
                break;
        }
    }

    // Autoplay
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isAutoplayPaused && !this.isDragging) {
                this.nextSlide();
            }
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        this.isAutoplayPaused = true;
        
        // Resume after 10 seconds of inactivity
        setTimeout(() => {
            this.isAutoplayPaused = false;
        }, 10000);
    }

    resumeAutoplay() {
        this.isAutoplayPaused = false;
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
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

        // Book treatment button - MODIFIED TO REDIRECT TO CONTACT.HTML
        const bookBtn = document.getElementById('bookTreatmentBtn');
        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                this.closeModal();
                // Redirect to contact.html instead of scrolling to contact section
                window.location.href = 'contact.html';
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
                description: 'NAD+ (Nicotinamide Adenine Dinucleotide) IV therapy is our most advanced cellular regeneration treatment. This powerful coenzyme plays a crucial role in cellular energy production, DNA repair, and anti-aging processes. Our premium NAD+ formula helps boost cognitive function, increase energy levels, and support overall cellular health.',
                benefits: [
                    'Enhanced cellular energy production',
                    'Improved cognitive function and mental clarity',
                    'Increased metabolism and fat burning',
                    'Better sleep quality and recovery',
                    'Reduced signs of aging',
                    'Enhanced immune system function'
                ],
                details: {
                    duration: '60-90 minutes',
                    frequency: 'Weekly for optimal results',
                    results: 'Immediate energy boost',
                    downtime: 'None required'
                }
            },
            'vitamin-c-glow': {
                title: 'Vitamin C Glow',
                icon: 'ri-sun-line',
                image: 'https://beauxmedspa.com/wp-content/uploads/2025/05/beaux-vitamin-c-drip.jpg',
                price: '$180',
                duration: '45 min',
                description: 'Transform your skin from within with our high-dose Vitamin C infusion. This powerful antioxidant treatment promotes collagen production, brightens skin tone, and provides protection against environmental damage. Perfect for achieving that coveted healthy glow.',
                benefits: [
                    'Radiant, glowing complexion',
                    'Increased collagen production',
                    'Improved skin texture and tone',
                    'Enhanced immune system',
                    'Powerful antioxidant protection',
                    'Faster wound healing'
                ],
                details: {
                    duration: '30-45 minutes',
                    frequency: 'Bi-weekly maintenance',
                    results: 'Visible glow within 24 hours',
                    downtime: 'None required'
                }
            },
            'energy-boost': {
                title: 'Energy Boost',
                icon: 'ri-flashlight-line',
                image: 'https://beauxmedspa.com/wp-content/uploads/2025/05/beaux-energy-boost.jpg',
                price: '$150',
                duration: '30 min',
                description: 'Combat fatigue and reclaim your vitality with our specialized Energy Boost IV. This carefully formulated blend of B-vitamins, amino acids, and essential nutrients provides immediate and sustained energy enhancement, perfect for busy professionals and active lifestyles.',
                benefits: [
                    'Immediate energy increase',
                    'Enhanced mental focus',
                    'Improved physical performance',
                    'Better stress management',
                    'Increased motivation and productivity',
                    'Balanced mood and wellbeing'
                ],
                details: {
                    duration: '30-45 minutes',
                    frequency: 'Weekly or as needed',
                    results: 'Immediate energy boost',
                    downtime: 'None required'
                }
            },
            'immune-support': {
                title: 'Immune Support',
                icon: 'ri-shield-check-line',
                image: 'https://beauxmedspa.com/wp-content/uploads/2025/05/beaux-immune-support.jpg',
                price: '$200',
                duration: '45 min',
                description: 'Strengthen your body\'s natural defenses with our comprehensive Immune Support IV therapy. This powerful combination of vitamins, minerals, and antioxidants helps boost immune function, reduce illness duration, and maintain optimal health year-round.',
                benefits: [
                    'Strengthened immune system',
                    'Reduced illness frequency and duration',
                    'Enhanced recovery from stress',
                    'Improved overall wellness',
                    'Better resistance to infections',
                    'Increased antioxidant protection'
                ],
                details: {
                    duration: '45-60 minutes',
                    frequency: 'Monthly or seasonally',
                    results: 'Enhanced immunity within days',
                    downtime: 'None required'
                }
            }
        };

        return treatmentDatabase[treatmentType] || treatmentDatabase['nad-drip'];
    }

    populateModal(data) {
        // Update modal content
        const modalTitle = document.getElementById('modalTitle');
        const modalIcon = document.getElementById('modalIconSymbol');
        const modalImage = document.getElementById('modalImage');
        const modalDescription = document.getElementById('modalDescription');
        const modalBenefits = document.getElementById('modalBenefits');
        const modalDetails = document.getElementById('modalDetails');

        if (modalTitle) modalTitle.textContent = data.title;
        if (modalIcon) modalIcon.className = data.icon;
        if (modalImage) {
            modalImage.src = data.image;
            modalImage.alt = `${data.title} - Manhattan Medical Spa Treatment`;
        }
        if (modalDescription) modalDescription.textContent = data.description;

        // Populate benefits
        if (modalBenefits && data.benefits) {
            modalBenefits.innerHTML = '';
            data.benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                modalBenefits.appendChild(li);
            });
        }

        // Populate details
        if (modalDetails && data.details) {
            modalDetails.innerHTML = '';
            Object.entries(data.details).forEach(([key, value]) => {
                const detailItem = document.createElement('div');
                detailItem.className = 'detail-item';
                detailItem.innerHTML = `
                    <div class="detail-label">${key.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
                    <div class="detail-value">${value}</div>
                `;
                modalDetails.appendChild(detailItem);
            });
        }
    }

    // Public API
    destroy() {
        this.stopAutoplay();
        
        // Remove event listeners
        if (this.prevBtn) this.prevBtn.removeEventListener('click', this.prevSlide);
        if (this.nextBtn) this.nextBtn.removeEventListener('click', this.nextSlide);
        
        console.log('🔥 Enhanced What\'s Hot Carousel Destroyed');
    }
}

// Modal Animation Keyframes
const modalAnimationCSS = `
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
`;

// Inject animation CSS
if (!document.querySelector('#modal-animations')) {
    const style = document.createElement('style');
    style.id = 'modal-animations';
    style.textContent = modalAnimationCSS;
    document.head.appendChild(style);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize carousel
    window.eviaWhatsHotCarousel = new EviaWhatsHotCarousel();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EviaWhatsHotCarousel;
}

/* ========================================
   GLOBAL FUNCTIONS (for HTML onclick events)
   ======================================== */
function openLearnMoreModal(packageId) {
    if (window.hermesWhatsHot) {
        window.hermesWhatsHot.openLearnMoreModal(packageId);
    }
}

function closeLearnMoreModal() {
    if (window.hermesWhatsHot) {
        window.hermesWhatsHot.closeLearnMoreModal();
    }
}

function switchToBookingModal() {
    if (window.hermesWhatsHot) {
        window.hermesWhatsHot.switchToBookingModal();
    }
}

function openBookingModal(packageId) {
    if (window.hermesWhatsHot) {
        window.hermesWhatsHot.openBookingModal(packageId);
    }
}

function closeBookingModal() {
    if (window.hermesWhatsHot) {
        window.hermesWhatsHot.closeBookingModal();
    }
}

function confirmBooking() {
    if (window.hermesWhatsHot) {
        window.hermesWhatsHot.confirmBooking();
    }
}

function closeConfirmation() {
    if (window.hermesWhatsHot) {
        window.hermesWhatsHot.closeConfirmation();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        window.hermesWhatsHot = new HermesWhatsHotSection();
        console.log('🔥 Hermes What\'s Hot System Loaded');
    } catch (error) {
        console.error('Failed to initialize Hermes What\'s Hot section:', error);
    }
});

// Global window assignment for external access
window.HermesWhatsHotSection = HermesWhatsHotSection;


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
        this.section = document.querySelector('.hermes-results-showcase-section');
        this.showcaseContainer = document.querySelector('.results-showcase-container');
        this.portfolioBtn = document.getElementById('showcasePortfolioBtn');
        this.consultationBtn = document.getElementById('showcaseConsultationBtn');
        this.resultCards = document.querySelectorAll('.showcase-result-card');
        this.comparisonSliders = document.querySelectorAll('.showcase-comparison-slider');
        
        this.activeSlider = null;
        this.isAnimating = false;
        this.isDragging = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.sliderPositions = new Map();
        this.intersectionObserver = null;
        
        this.animationDuration = 600;
        this.observerThreshold = 0.2;
        this.sliderSensitivity = 0.8;
        this.autoResetDelay = 3000;
        
        if (this.section) {
            this.init();
        }
    }

    init() {
        try {
            this.setupInitialState();
            this.initializeBeforeAfterSliders();
            this.bindEvents();
            this.setupIntersectionObserver();
            this.setupAccessibilityFeatures();
            this.initializeAnimations();
            this.preloadImages();
            
            window.hermesResultsShowcase = this;
            
            console.log('Hermes Results Showcase initialized successfully');
        } catch (error) {
            console.error('Results Showcase initialization failed:', error);
            this.setupFallbackBehavior();
        }
    }

    setupInitialState() {
        this.comparisonSliders.forEach((slider, index) => {
            const initialPosition = 50;
            this.sliderPositions.set(slider, initialPosition);
            this.updateSliderPosition(slider, initialPosition);
        });
        
        this.resultCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    }

    initializeBeforeAfterSliders() {
        this.comparisonSliders.forEach((slider, index) => {
            const container = slider.closest('.showcase-comparison-container');
            const beforeImage = container.querySelector('.showcase-before-image');
            const afterImage = container.querySelector('.showcase-after-image');
            const handle = slider.querySelector('.showcase-slider-handle');
            
            if (!container || !beforeImage || !afterImage || !handle) {
                console.warn(`Slider ${index}: Missing required elements`);
                return;
            }
            
            let currentPosition = 50;
            let isActive = false;
            let startPosition = 0;
            let animationFrame = null;
            
            slider.showcaseData = {
                container,
                beforeImage,
                afterImage,
                handle,
                currentPosition,
                isActive,
                startPosition,
                animationFrame
            };
            
            this.updateSliderPosition(slider, currentPosition);
            this.bindSliderEvents(slider);
            this.setupSliderAccessibility(slider, index);
        });
    }

    bindSliderEvents(slider) {
        const data = slider.showcaseData;
        const { container, handle } = data;
        
        handle.addEventListener('mousedown', (e) => this.startSliderDrag(e, slider));
        document.addEventListener('mousemove', (e) => this.handleSliderDrag(e, slider));
        document.addEventListener('mouseup', () => this.endSliderDrag(slider));
        
        handle.addEventListener('touchstart', (e) => this.startSliderTouch(e, slider), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleSliderTouch(e, slider), { passive: false });
        document.addEventListener('touchend', () => this.endSliderDrag(slider));
        
        container.addEventListener('click', (e) => this.handleSliderClick(e, slider));
        
        container.addEventListener('mouseenter', () => this.enhanceSliderVisually(slider));
        container.addEventListener('mouseleave', () => this.resetSliderVisuals(slider));
        
        container.addEventListener('dblclick', () => this.animateSliderTo(slider, 50));
    }

    startSliderDrag(e, slider) {
        e.preventDefault();
        const data = slider.showcaseData;
        
        data.isActive = true;
        data.startPosition = this.getPositionFromEvent(e, data.container);
        
        this.activeSlider = slider;
        this.isDragging = true;
        
        data.handle.style.cursor = 'grabbing';
        data.container.style.userSelect = 'none';
        data.handle.style.transform = 'translate(-50%, -50%) scale(1.1)';
        
        this.pauseAutoAnimations();
    }

    startSliderTouch(e, slider) {
        e.preventDefault();
        const touch = e.touches[0];
        const data = slider.showcaseData;
        
        data.isActive = true;
        data.startPosition = this.getPositionFromEvent(touch, data.container);
        
        this.activeSlider = slider;
        this.isDragging = true;
        this.touchStartX = touch.clientX;
        
        data.handle.style.transform = 'translate(-50%, -50%) scale(1.1)';
        data.container.style.userSelect = 'none';
        
        this.pauseAutoAnimations();
    }

    handleSliderDrag(e, slider) {
        if (!slider.showcaseData.isActive || slider !== this.activeSlider) return;
        
        const position = this.getPositionFromEvent(e, slider.showcaseData.container);
        this.updateSliderPosition(slider, position);
    }

    handleSliderTouch(e, slider) {
        if (!slider.showcaseData.isActive || slider !== this.activeSlider) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const position = this.getPositionFromEvent(touch, slider.showcaseData.container);
        this.updateSliderPosition(slider, position);
    }

    endSliderDrag(slider) {
        if (!slider || !slider.showcaseData) return;
        
        const data = slider.showcaseData;
        
        data.isActive = false;
        this.activeSlider = null;
        this.isDragging = false;
        
        data.handle.style.cursor = 'ew-resize';
        data.container.style.userSelect = '';
        data.handle.style.transform = 'translate(-50%, -50%)';
        
        this.resumeAutoAnimations();
        
        this.addSliderRippleEffect(slider);
    }

    handleSliderClick(e, slider) {
        if (e.target.closest('.showcase-slider-handle')) return;
        
        const position = this.getPositionFromEvent(e, slider.showcaseData.container);
        this.animateSliderTo(slider, position);
    }

    getPositionFromEvent(event, container) {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        return percentage;
    }

    updateSliderPosition(slider, percentage) {
        if (!slider.showcaseData) return;
        
        const { container, beforeImage } = slider.showcaseData;
        
        slider.style.left = percentage + '%';
        
        beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        
        slider.setAttribute('data-position', percentage);
        this.sliderPositions.set(slider, percentage);
        
        const handle = slider.showcaseData.handle;
        if (handle) {
            handle.setAttribute('aria-valuenow', Math.round(percentage));
        }
    }

    animateSliderTo(slider, targetPercentage) {
        if (!slider.showcaseData) return;
        
        const currentPercentage = this.sliderPositions.get(slider) || 50;
        const duration = this.animationDuration;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            const currentPos = currentPercentage + (targetPercentage - currentPercentage) * easedProgress;
            this.updateSliderPosition(slider, currentPos);
            
            if (progress < 1) {
                slider.showcaseData.animationFrame = requestAnimationFrame(animate);
            } else {
                this.addSliderCompletionEffect(slider);
            }
        };
        
        if (slider.showcaseData.animationFrame) {
            cancelAnimationFrame(slider.showcaseData.animationFrame);
        }
        
        slider.showcaseData.animationFrame = requestAnimationFrame(animate);
    }

    addSliderRippleEffect(slider) {
        const handle = slider.showcaseData?.handle;
        if (!handle) return;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: rgba(255, 140, 0, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 1000;
        `;
        
        handle.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            ripple.style.transform = 'translate(-50%, -50%) scale(8)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    addSliderCompletionEffect(slider) {
        const handle = slider.showcaseData?.handle;
        if (!handle) return;
        
        handle.style.boxShadow = `
            0 12px 35px rgba(0, 0, 0, 0.2),
            0 6px 20px rgba(255, 140, 0, 0.4),
            0 0 20px rgba(255, 140, 0, 0.3)
        `;
        
        setTimeout(() => {
            handle.style.boxShadow = '';
        }, 800);
    }

    enhanceSliderVisually(slider) {
        const data = slider.showcaseData;
        if (!data || data.isActive) return;
        
        const { beforeImage, afterImage, handle } = data;
        
        [beforeImage, afterImage].forEach(img => {
            const imgElement = img.querySelector('img');
            if (imgElement) {
                imgElement.style.transform = 'scale(1.05)';
                imgElement.style.filter = 'brightness(1.1) contrast(1.05)';
            }
        });
        
        handle.style.transform = 'translate(-50%, -50%) scale(1.05)';
        handle.style.boxShadow = `
            0 12px 35px rgba(0, 0, 0, 0.2),
            0 6px 20px rgba(255, 140, 0, 0.3)
        `;
    }

    resetSliderVisuals(slider) {
        const data = slider.showcaseData;
        if (!data || data.isActive) return;
        
        const { beforeImage, afterImage, handle } = data;
        
        [beforeImage, afterImage].forEach(img => {
            const imgElement = img.querySelector('img');
            if (imgElement) {
                imgElement.style.transform = '';
                imgElement.style.filter = '';
            }
        });
        
        handle.style.transform = 'translate(-50%, -50%)';
        handle.style.boxShadow = '';
    }

    setupSliderAccessibility(slider, index) {
        const handle = slider.showcaseData?.handle;
        if (!handle) return;
        
        handle.setAttribute('tabindex', '0');
        handle.setAttribute('role', 'slider');
        handle.setAttribute('aria-label', `Before and after comparison slider ${index + 1}`);
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        handle.setAttribute('aria-valuenow', '50');
        handle.setAttribute('aria-orientation', 'horizontal');
    }

    bindEvents() {
        if (this.portfolioBtn) {
            this.portfolioBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePortfolioClick();
            });
            
            this.portfolioBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handlePortfolioClick();
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

        this.resultCards.forEach((card, index) => {
            this.setupCardInteractions(card, index);
        });

        this.setupKeyboardNavigation();
        
        this.setupWindowEvents();
    }

    setupCardInteractions(card, index) {
        card.addEventListener('mouseenter', () => {
            this.enhanceCardVisually(card);
        });
        
        card.addEventListener('mouseleave', () => {
            this.resetCardVisuals(card);
        });
        
        card.addEventListener('touchstart', () => {
            this.addCardTouchFeedback(card);
        }, { passive: true });
        
        card.addEventListener('touchend', () => {
            this.removeCardTouchFeedback(card);
        }, { passive: true });
        
        card.setAttribute('tabindex', '0');
        card.addEventListener('focus', () => {
            this.focusCard(card);
        });
        
        card.addEventListener('blur', () => {
            this.blurCard(card);
        });
    }

    handlePortfolioClick() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        this.addClickFeedback(this.portfolioBtn);
        this.showActionFeedback('Loading portfolio gallery...', 'ri-gallery-line');
        
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.4s ease';
            document.body.style.opacity = '0.7';
            
            setTimeout(() => {
                window.location.href = 'portfolio.html';
            }, 200);
        }, 800);
    }

    handleConsultationClick() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        this.addClickFeedback(this.consultationBtn);
        this.showActionFeedback('Opening consultation booking...', 'ri-calendar-check-line');
        
        setTimeout(() => {
            this.openBookingModal();
            this.isAnimating = false;
        }, 1000);
    }

    addClickFeedback(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        this.createClickRipple(element);
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 200);
    }

    createClickRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'showcase-click-ripple';
        
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            ripple.style.transform = 'translate(-50%, -50%) scale(6)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    showActionFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.className = 'showcase-action-feedback';
        
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
            padding: 18px 28px;
            border-radius: 50px;
            font-family: var(--font-inter);
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            opacity: 0;
            pointer-events: none;
            box-shadow: 0 25px 80px rgba(255, 140, 0, 0.4);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 280px;
            justify-content: center;
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
            }, 500);
        }, 3000);
    }

    openBookingModal() {
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) {
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            this.scrollToContact();
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact') || 
                             document.querySelector('.contact-section') ||
                             document.querySelector('[data-section="contact"]');
        
        if (contactSection) {
            const headerHeight = 80;
            const additionalOffset = 20;
            const targetPosition = contactSection.offsetTop - headerHeight - additionalOffset;
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
            
            this.showActionFeedback('Scrolling to contact...', 'ri-arrow-down-line');
        }
    }

    enhanceCardVisually(card) {
        if (this.isDragging) return;
        
        const comparison = card.querySelector('.showcase-comparison-container');
        if (!comparison) return;
        
        const images = comparison.querySelectorAll('.showcase-before-image img, .showcase-after-image img');
        images.forEach(img => {
            img.style.transform = 'scale(1.05)';
            img.style.filter = 'brightness(1.1) contrast(1.05)';
            img.style.transition = 'all 0.4s var(--ease-luxury)';
        });
        
        const details = card.querySelector('.showcase-result-details');
        if (details) {
            details.style.transform = 'translateY(-2px)';
            details.style.transition = 'transform 0.4s var(--ease-luxury)';
        }
        
        const badge = card.querySelector('.showcase-treatment-badge');
        if (badge) {
            badge.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.3)';
            badge.style.transition = 'box-shadow 0.4s var(--ease-luxury)';
        }
    }

    resetCardVisuals(card) {
        if (this.isDragging) return;
        
        const comparison = card.querySelector('.showcase-comparison-container');
        if (!comparison) return;
        
        const images = comparison.querySelectorAll('.showcase-before-image img, .showcase-after-image img');
        images.forEach(img => {
            img.style.transform = '';
            img.style.filter = '';
        });
        
        const details = card.querySelector('.showcase-result-details');
        if (details) {
            details.style.transform = '';
        }
        
        const badge = card.querySelector('.showcase-treatment-badge');
        if (badge) {
            badge.style.boxShadow = '';
        }
    }

    addCardTouchFeedback(card) {
        card.style.transform = 'scale(0.98)';
        card.style.transition = 'transform 0.2s ease';
    }

    removeCardTouchFeedback(card) {
        card.style.transform = '';
        setTimeout(() => {
            card.style.transition = '';
        }, 200);
    }

    focusCard(card) {
        card.style.outline = '3px solid rgba(255, 140, 0, 0.5)';
        card.style.outlineOffset = '4px';
        
        this.scrollCardIntoView(card);
    }

    blurCard(card) {
        card.style.outline = '';
        card.style.outlineOffset = '';
    }

    scrollCardIntoView(card) {
        const cardRect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (cardRect.top < 100 || cardRect.bottom > windowHeight - 100) {
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.section.contains(document.activeElement)) return;
            
            const activeElement = document.activeElement;
            
            if (activeElement.closest('.showcase-comparison-slider')) {
                this.handleSliderKeyboard(e, activeElement.closest('.showcase-comparison-slider'));
            } else if (activeElement.classList.contains('showcase-result-card')) {
                this.handleCardKeyboard(e, activeElement);
            }
        });
    }

    handleSliderKeyboard(e, slider) {
        if (!slider.showcaseData) return;
        
        let currentPosition = this.sliderPositions.get(slider) || 50;
        let newPosition = currentPosition;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                newPosition = Math.max(0, currentPosition - 5);
                break;
            case 'ArrowRight':
                e.preventDefault();
                newPosition = Math.min(100, currentPosition + 5);
                break;
            case 'Home':
                e.preventDefault();
                newPosition = 0;
                break;
            case 'End':
                e.preventDefault();
                newPosition = 100;
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                newPosition = 50;
                break;
        }
        
        if (newPosition !== currentPosition) {
            this.animateSliderTo(slider, newPosition);
        }
    }

    handleCardKeyboard(e, card) {
        const cardIndex = Array.from(this.resultCards).indexOf(card);
        
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                if (cardIndex < this.resultCards.length - 1) {
                    this.resultCards[cardIndex + 1].focus();
                }
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                if (cardIndex > 0) {
                    this.resultCards[cardIndex - 1].focus();
                }
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                const slider = card.querySelector('.showcase-comparison-slider .showcase-slider-handle');
                if (slider) {
                    slider.focus();
                }
                break;
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: this.observerThreshold,
            rootMargin: '50px 0px -50px 0px'
        };
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, observerOptions);
        
        this.resultCards.forEach(card => {
            this.intersectionObserver.observe(card);
        });
        
        const ctaSections = [
            document.querySelector('.showcase-portfolio-cta'),
            document.querySelector('.showcase-consultation-cta')
        ];
        
        ctaSections.forEach(section => {
            if (section) {
                this.intersectionObserver.observe(section);
            }
        });
    }

    triggerElementAnimation(element) {
        if (element.classList.contains('showcase-result-card')) {
            this.animateCardEntrance(element);
        }
        
        if (element.classList.contains('showcase-portfolio-cta') || 
            element.classList.contains('showcase-consultation-cta')) {
            this.animateCtaEntrance(element);
        }
    }

    animateCardEntrance(card) {
        const cardIndex = Array.from(this.resultCards).indexOf(card);
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            
            card.style.boxShadow = `
                0 40px 100px rgba(0, 0, 0, 0.12),
                0 20px 60px rgba(255, 140, 0, 0.15)
            `;
            
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 1000);
            
            const slider = card.querySelector('.showcase-comparison-slider');
            if (slider && !this.isDragging) {
                setTimeout(() => {
                    this.demonstrateSlider(slider);
                }, 800 + (cardIndex * 400));
            }
        }, cardIndex * 200);
    }

    animateCtaEntrance(ctaElement) {
        ctaElement.style.opacity = '1';
        ctaElement.style.transform = 'translateY(0)';
        
        const wrapper = ctaElement.querySelector('.showcase-portfolio-wrapper, .showcase-consultation-wrapper');
        if (wrapper) {
            setTimeout(() => {
                wrapper.style.animation = 'showcasePulse 2s ease-in-out';
            }, 300);
        }
    }

    demonstrateSlider(slider) {
        if (this.isDragging || !slider.showcaseData) return;
        
        this.animateSliderTo(slider, 75);
        
        setTimeout(() => {
            if (!this.isDragging) {
                this.animateSliderTo(slider, 50);
            }
        }, 1200);
    }

    initializeAnimations() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes showcasePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            
            @keyframes showcaseGlow {
                0%, 100% { 
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06),
                               0 8px 25px rgba(255, 140, 0, 0.04);
                }
                50% { 
                    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.08),
                               0 12px 30px rgba(255, 140, 0, 0.12);
                }
            }
            
            .showcase-animate-in {
                animation: showcaseSlideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            @keyframes showcaseSlideUp {
                0% {
                    opacity: 0;
                    transform: translateY(40px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .showcase-result-card:focus {
                outline: 3px solid rgba(255, 140, 0, 0.5);
                outline-offset: 4px;
            }
            
            .showcase-slider-handle:focus {
                outline: 3px solid rgba(255, 140, 0, 0.6);
                outline-offset: 2px;
                box-shadow: 
                    0 12px 35px rgba(0, 0, 0, 0.2),
                    0 6px 20px rgba(255, 140, 0, 0.4);
            }
            
            @media (prefers-reduced-motion: reduce) {
                .showcase-result-card,
                .showcase-slider-handle,
                .showcase-portfolio-btn,
                .showcase-consultation-btn {
                    animation: none !important;
                    transition: none !important;
                }
            }
        `;
        
        document.head.appendChild(styleSheet);
    }

    pauseAutoAnimations() {
        this.comparisonSliders.forEach(slider => {
            if (slider.showcaseData?.animationFrame) {
                cancelAnimationFrame(slider.showcaseData.animationFrame);
                slider.showcaseData.animationFrame = null;
            }
        });
    }

    resumeAutoAnimations() {
        setTimeout(() => {
            if (!this.isDragging) {
                this.comparisonSliders.forEach((slider, index) => {
                    setTimeout(() => {
                        this.demonstrateSlider(slider);
                    }, index * 800);
                });
            }
        }, this.autoResetDelay);
    }

    setupWindowEvents() {
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoAnimations();
            } else {
                this.resumeAutoAnimations();
            }
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
                this.refreshSliderPositions();
            }, 500);
        });
    }

    handleResize() {
        this.refreshSliderPositions();
        
        this.updateCardLayout();
        
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    refreshSliderPositions() {
        this.comparisonSliders.forEach(slider => {
            const position = this.sliderPositions.get(slider) || 50;
            this.updateSliderPosition(slider, position);
        });
    }

    updateCardLayout() {
        const grid = document.querySelector('.results-showcase-grid');
        if (grid) {
            grid.style.display = 'none';
            grid.offsetHeight;
            grid.style.display = '';
        }
    }

    preloadImages() {
        const images = document.querySelectorAll('.showcase-before-image img, .showcase-after-image img');
        
        images.forEach(img => {
            if (img.dataset.src) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const image = entry.target;
                            image.src = image.dataset.src;
                            image.classList.add('showcase-loaded');
                            imageObserver.unobserve(image);
                        }
                    });
                });
                
                imageObserver.observe(img);
            } else {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        });
    }

    setupAccessibilityFeatures() {
        this.setupScreenReaderSupport();
        
        this.setupHighContrastSupport();
        
        this.setupReducedMotionSupport();
    }

    setupScreenReaderSupport() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        
        this.section.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }

    announceSliderChange(slider, position) {
        if (!this.liveRegion) return;
        
        const cardTitle = slider.closest('.showcase-result-card')
                               ?.querySelector('.showcase-result-name')
                               ?.textContent || 'Treatment';
        
        const percentage = Math.round(position);
        let announcement;
        
        if (percentage < 25) {
            announcement = `${cardTitle}: Showing mostly before image`;
        } else if (percentage > 75) {
            announcement = `${cardTitle}: Showing mostly after image`;
        } else {
            announcement = `${cardTitle}: Showing equal before and after`;
        }
        
        this.liveRegion.textContent = announcement;
    }

    setupHighContrastSupport() {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        
        const updateContrast = (e) => {
            document.documentElement.classList.toggle('high-contrast', e.matches);
        };
        
        updateContrast(mediaQuery);
        mediaQuery.addListener(updateContrast);
    }

    setupReducedMotionSupport() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const updateMotion = (e) => {
            document.documentElement.classList.toggle('reduced-motion', e.matches);
            
            if (e.matches) {
                this.pauseAutoAnimations();
            }
        };
        
        updateMotion(mediaQuery);
        mediaQuery.addListener(updateMotion);
    }

    setupFallbackBehavior() {
        this.comparisonSliders.forEach(slider => {
            const container = slider.closest('.showcase-comparison-container');
            if (!container) return;
            
            container.addEventListener('click', (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = (x / rect.width) * 100;
                
                slider.style.left = percentage + '%';
                const beforeImage = container.querySelector('.showcase-before-image');
                if (beforeImage) {
                    beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                }
            });
        });
        
        if (this.portfolioBtn) {
            this.portfolioBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'portfolio.html';
            });
        }
        
        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToContact();
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

    throttle(func, wait) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, wait);
            }
        };
    }

    resetAllSliders() {
        this.comparisonSliders.forEach(slider => {
            this.animateSliderTo(slider, 50);
        });
    }

    navigateToPortfolio() {
        this.handlePortfolioClick();
    }

    openConsultationBooking() {
        this.handleConsultationClick();
    }

    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        this.pauseAutoAnimations();
        
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyboard);
        
        console.log('Hermes Results Showcase destroyed');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        try {
            const hermesResults = new HermesResultsShowcase();
            
            window.HermesResultsShowcase = HermesResultsShowcase;
            window.hermesResultsShowcase = hermesResults;
            
            console.log('Hermes Results Showcase System Loaded');
        } catch (error) {
            console.error('Failed to initialize Results Showcase:', error);
        }
    }, 150);
});

window.addEventListener('load', function() {
    if (!window.hermesResultsShowcase) {
        setTimeout(() => {
            try {
                window.hermesResultsShowcase = new HermesResultsShowcase();
            } catch (error) {
                console.error('Fallback Results Showcase initialization failed:', error);
            }
        }, 100);
    }
});

window.hermesResultsUtils = {
    scrollToPortfolio: () => {
        if (window.hermesResultsShowcase) {
            window.hermesResultsShowcase.navigateToPortfolio();
        } else {
            window.location.href = 'portfolio.html';
        }
    },
    
    openBooking: () => {
        if (window.hermesResultsShowcase) {
            window.hermesResultsShowcase.openConsultationBooking();
        } else {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    },
    
    resetSliders: () => {
        if (window.hermesResultsShowcase) {
            window.hermesResultsShowcase.resetAllSliders();
        }
    }
};

window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('results')) {
        console.error('Results Showcase Error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            error: event.error
        });
    }
});

if ('PerformanceObserver' in window) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('results') && entry.duration > 100) {
                    console.warn(`Slow Results operation: ${entry.name} took ${entry.duration}ms`);
                }
            }
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
        
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
        
        // Shop now button
        const shopBtn = document.querySelector('.luxury-carousel-shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const url = shopBtn.dataset.url;
                if (url) {
                    // Add luxury click animation
                    shopBtn.style.transform = 'scale(0.95) translateY(-4px)';
                    setTimeout(() => {
                        shopBtn.style.transform = '';
                        window.open(url, 'https://us.alumiermd.com/products?code=54T7P4HH');
                    }, 150);
                }
            });
        }
        
        // Consultation button
        const consultBtn = document.querySelector('.luxury-carousel-consult-btn');
        if (consultBtn) {
            consultBtn.addEventListener('click', (e) => {
                // Add click animation
                consultBtn.style.transform = 'scale(0.95) translateY(-4px)';
                setTimeout(() => {
                    consultBtn.style.transform = '';
                }, 150);
            });
        }
        
        // Consultation link in partnership note
        const consultLink = document.querySelector('.consultation-link');
        if (consultLink) {
            consultLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Smooth scroll to consultation section
                const consultSection = document.querySelector('#book-consultation');
                if (consultSection) {
                    consultSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
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
            this.components.set('whatsHot', new EviaWhatsHotCarousel());
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
window.HermesWhatsHotSection = HermesWhatsHotSection;
window.HermesFloatingButtons = HermesFloatingButtons;
window.ModernHermesHeader = ModernHermesHeader;
window.LuxuryCarouselController = LuxuryCarouselController;
window.HermesServicesScroller = HermesServicesScroller;
window.ContactSection = ContactSection;
window.HeroSection = HeroSection;
window.ElevatedAboutSection = ElevatedAboutSection;
window.HermesResultsShowcase = HermesResultsShowcase;
