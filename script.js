/**
 * =============================================================================
 * EVIA AESTHETICS - COMPLETE ORGANIZED JAVASCRIPT
 * =============================================================================
 * Manhattan Medical Spa - Luxury Hermes Experience
 * Modular architecture with clean separation of concerns
 */

'use strict';

// =============================================================================
// GLOBAL CONFIGURATION
// =============================================================================
const EVIA_CONFIG = {
    animationDuration: 600,
    scrollOffset: 100,
    autoPlayInterval: 4000,
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    colors: {
        primary: '#1a1a1a',
        accent: '#FF8C00',
        white: '#ffffff'
    },
    urls: {
        shop: 'https://us.alumiermd.com/products?code=54T7P4HH',
        contact: 'contact.html',
        portfolio: 'portfolio.html',
        services: 'services.html',
        about: 'about.html'
    }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
class EviaUtils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isMobile() {
        return window.innerWidth <= EVIA_CONFIG.breakpoints.mobile;
    }

    static smoothScrollTo(target, duration = 1200) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.offsetTop - EVIA_CONFIG.scrollOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = EviaUtils.easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    static showNotification(message, type = 'success', iconClass = 'ri-check-line') {
        const notification = document.createElement('div');
        notification.className = `evia-notification ${type}`;
        
        notification.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)' : '#ef4444'};
            color: white;
            padding: 16px 24px;
            border-radius: 50px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            pointer-events: none;
            box-shadow: 0 15px 35px rgba(255, 140, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    static createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// =============================================================================
// PRELOADER COMPONENT
// =============================================================================
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
        
        console.log('🔄 Preloader Initialized');
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

// =============================================================================
// MODERN HERMES HEADER COMPONENT
// =============================================================================
class ModernHermesHeader {
    constructor() {
        this.header = document.getElementById('hermesHeader') || document.querySelector('.hermes-modern-header');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.desktopHamburger = document.getElementById('desktopHamburger');
        this.mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        this.menuCloseBtn = document.getElementById('menuCloseBtn');
        this.shopNowBtns = document.querySelectorAll('.shop-now-btn, .mobile-shop-btn');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item');
        
        this.isScrolled = false;
        this.isMobileMenuOpen = false;
        this.scrollThreshold = 80;
        this.lastScrollY = 0;
        this.isAnimating = false;
        
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
        
        window.modernHermesHeader = this;
        console.log('🎯 Modern Hermes Header Initialized');
    }

    setupInitialState() {
        this.updateHeaderState();
        
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
        
        document.body.classList.remove('menu-open');
        this.isMobileMenuOpen = false;
    }

    bindEvents() {
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        if (this.desktopHamburger) {
            this.desktopHamburger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        if (this.menuCloseBtn) {
            this.menuCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMobileMenu();
            });
        }

        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === this.mobileMenuOverlay) {
                    this.closeMobileMenu();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        window.addEventListener('resize', EviaUtils.debounce(() => {
            this.handleResize();
        }, 250));
    }

    setupScrollDetection() {
        window.addEventListener('scroll', EviaUtils.throttle(() => {
            this.handleScroll();
        }, 16), { passive: true });
    }

    handleScroll() {
        const currentScrollY = window.scrollY || document.documentElement.scrollTop;
        const shouldBeScrolled = currentScrollY > this.scrollThreshold;
        
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.updateHeaderScrollState();
        }
        
        if (this.isMobileMenuOpen && Math.abs(currentScrollY - this.lastScrollY) > 100) {
            this.closeMobileMenu();
        }
        
        this.lastScrollY = currentScrollY;
    }

    updateHeaderScrollState() {
        if (!this.header) return;
        
        this.header.classList.toggle('scrolled', this.isScrolled);
        this.dispatchHeaderEvent('scrollStateChanged', { 
            isScrolled: this.isScrolled,
            scrollY: this.lastScrollY 
        });
    }

    updateHeaderState() {
        if (this.header) {
            this.header.style.opacity = '1';
            this.header.style.visibility = 'visible';
            this.header.style.transform = 'translateY(0)';
        }
    }

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
        
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.add('active');
        }
        
        if (this.desktopHamburger) {
            this.desktopHamburger.classList.add('active');
        }
        
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.add('active');
            this.mobileMenuOverlay.style.opacity = '1';
            this.mobileMenuOverlay.style.visibility = 'visible';
        }
        
        this.lockBodyScroll();
        this.animateMenuItemsIn();
        
        if ('vibrate' in navigator && EviaUtils.isMobile()) {
            navigator.vibrate(50);
        }
        
        setTimeout(() => {
            this.isAnimating = false;
            const firstNavItem = this.mobileMenuOverlay?.querySelector('.mobile-nav-item');
            if (firstNavItem) {
                firstNavItem.focus();
            }
        }, 400);
        
        this.dispatchHeaderEvent('mobileMenuOpened');
    }

    closeMobileMenu() {
        if (this.isAnimating || !this.isMobileMenuOpen) return;
        
        this.isAnimating = true;
        this.isMobileMenuOpen = false;
        
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.remove('active');
        }
        
        if (this.desktopHamburger) {
            this.desktopHamburger.classList.remove('active');
        }
        
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.remove('active');
            this.mobileMenuOverlay.style.opacity = '0';
            
            setTimeout(() => {
                this.mobileMenuOverlay.style.visibility = 'hidden';
            }, 400);
        }
        
        this.unlockBodyScroll();
        this.animateMenuItemsOut();
        
        setTimeout(() => {
            this.isAnimating = false;
            const activeToggle = window.innerWidth > 768 && this.isScrolled ? 
                this.desktopHamburger : this.mobileMenuToggle;
            
            if (activeToggle) {
                activeToggle.focus();
            }
        }, 400);
        
        this.dispatchHeaderEvent('mobileMenuClosed');
    }

    animateMenuItemsIn() {
        const menuItems = this.mobileMenuOverlay?.querySelectorAll('.mobile-nav-item, .mobile-shop-btn, .mobile-consultation-btn, .social-link');
        
        if (!menuItems) return;
        
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) translateX(20px)';
            item.style.transition = 'none';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) translateX(0)';
                
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

    lockBodyScroll() {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.body.classList.add('menu-open');
        document.body.dataset.scrollPosition = scrollY;
    }

    unlockBodyScroll() {
        const scrollY = document.body.dataset.scrollPosition;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0'));
        }
    }

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
        this.addClickFeedback(button);
        this.showActionFeedback('Loading shop...', 'ri-shopping-bag-3-line');
        
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        setTimeout(() => {
            window.location.href = EVIA_CONFIG.urls.shop;
        }, this.isMobileMenuOpen ? 600 : 300);
    }

    addClickFeedback(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.15s ease';
        
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
            background: var(--gradient-hermes-orange, linear-gradient(135deg, #FF8C00 0%, #FFA500 100%));
            color: white;
            padding: 16px 24px;
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
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
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
        
        this.setActiveNavLink(link);
        
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
        
        this.showActionFeedback(`Navigating to ${targetElement.id}...`, 'ri-navigation-line');
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
            link.classList.remove('active');
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (!isMobile && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        this.updateHeaderState();
        this.dispatchHeaderEvent('headerResized', { 
            isMobile: isMobile,
            width: window.innerWidth 
        });
    }

    setupAccessibility() {
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

    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        if (this.isMobileMenuOpen) {
            this.unlockBodyScroll();
        }
        
        this.isAnimating = false;
        console.log('Modern Hermes Header destroyed');
    }
}

// =============================================================================
// HERO SECTION COMPONENT
// =============================================================================
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
        
        console.log('🎬 Hero Section Initialized');
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
            const headerHeight = 80;
            const targetPosition = nextSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
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
}

// =============================================================================
// WHATS HOT PACKAGES SECTION COMPONENT
// =============================================================================
class EviaHolidayPackages {
    constructor() {
        this.section = document.querySelector('.evia-whats-hot-packages-section');
        this.packageTiles = document.querySelectorAll('.package-tile');
        this.modalOverlay = document.getElementById('packageModalOverlay');
        this.modal = document.getElementById('packageModal');
        
        this.currentPackage = null;
        this.isModalOpen = false;
        
        if (this.section && this.packageTiles.length > 0) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.setupModals();
        this.initAnimations();
        
        console.log('🎁 Holiday Packages Initialized');
    }

    setupEventListeners() {
        this.packageTiles.forEach(tile => {
            const learnMoreBtn = tile.querySelector('.learn-more-btn');
            if (learnMoreBtn) {
                learnMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const packageType = tile.dataset.package || learnMoreBtn.dataset.package;
                    this.openModal(packageType);
                });
            }

            const bookNowBtn = tile.querySelector('.book-now-btn');
            if (bookNowBtn) {
                bookNowBtn.addEventListener('click', (e) => {
                    this.trackBookingClick(tile.dataset.package);
                });
            }

            tile.addEventListener('mouseenter', () => this.enhanceTileVisually(tile));
            tile.addEventListener('mouseleave', () => this.resetTileVisuals(tile));
        });

        const primaryCtaBtn = document.querySelector('.primary-cta-btn');
        const secondaryCtaBtn = document.querySelector('.secondary-cta-btn');
        
        if (primaryCtaBtn) {
            primaryCtaBtn.addEventListener('click', () => {
                this.trackEvent('primary_cta_clicked', { location: 'bottom_section' });
            });
        }

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        window.addEventListener('resize', EviaUtils.debounce(() => {
            this.handleResize();
        }, 250));
    }

    setupModals() {
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay) {
                    this.closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay?.classList.contains('active')) {
                this.closeModal();
            }
        });

        const bookBtn = document.getElementById('bookPackageBtn');
        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                this.closeModal();
                window.location.href = EVIA_CONFIG.urls.contact;
            });
        }
    }

    openModal(packageType) {
        if (!this.modalOverlay) return;

        const packageData = this.getPackageData(packageType);
        this.populateModal(packageData);
        
        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isModalOpen = true;
        this.currentPackage = packageType;

        if (this.modal) {
            this.modal.style.animation = 'modalSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }

        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.style.opacity = '0';
            modalImage.onload = () => {
                modalImage.style.transition = 'opacity 0.5s ease';
                modalImage.style.opacity = '1';
            };
        }

        this.trackEvent('package_modal_opened', { package: packageType });
    }

    closeModal() {
        if (!this.modalOverlay) return;

        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this.isModalOpen = false;
        this.currentPackage = null;

        this.trackEvent('package_modal_closed');
    }

    getPackageData(packageType) {
        const packageDatabase = {
            'eye-rejuvenation': {
                title: 'Eye Rejuvenation Elite',
                icon: 'ri-eye-line',
                image: 'https://beauxmedspa.com/wp-content/uploads/2025/05/under-eye-treatment.jpg',
                price: '$500',
                originalPrice: '$1,030',
                duration: '90 min',
                description: 'Our comprehensive under-eye transformation package combines the latest in aesthetic medicine. This elite treatment includes mesotherapy with cutting-edge exosomes for cellular regeneration, precision Botox application to smooth fine lines, and premium Alumier eye cream for ongoing care.',
                benefits: [
                    'Dramatic reduction in under-eye bags and puffiness',
                    'Significant improvement in dark circles',
                    'Smoothing of fine lines and wrinkles',
                    'Enhanced skin texture and firmness',
                    'Long-lasting hydration and protection',
                    'Includes premium take-home eye cream'
                ],
                details: {
                    'Package Value': '$1,030 (Save $530)',
                    'Treatment Time': '90-120 minutes',
                    'Package Limit': 'Maximum 2 per client',
                    'Results Timeline': 'Immediate improvement, peak at 2-4 weeks',
                    'Includes': 'Mesotherapy + Exosomes + Botox + Eye Cream'
                }
            },
            'holiday-glow': {
                title: 'Holiday Glow Transformation',
                icon: 'ri-sun-line',
                image: 'https://beauxmedspa.com/wp-content/uploads/2025/05/holiday-glow-treatment.jpg',
                price: '$600',
                originalPrice: '$950',
                duration: '75 min',
                description: 'Get ready for the holidays with our signature glow package! This transformative treatment combines Profhilo bio-remodeling for deep hydration and skin quality improvement with a medium-grade chemical peel for renewed radiance.',
                benefits: [
                    'Intense skin hydration and bio-remodeling',
                    'Improved skin texture and elasticity',
                    'Reduced fine lines and enhanced firmness',
                    'Radiant, glowing complexion',
                    'Professional skincare at 20% discount',
                    'Perfect for holiday events and photos'
                ],
                details: {
                    'Package Value': '$950 + Skincare Bonus',
                    'Treatment Time': '60-90 minutes',
                    'Package Limit': 'Maximum 2 per client',
                    'Skincare Bonus': '20% off $500 pack (now $400)',
                    'Results Timeline': 'Immediate glow, continued improvement for weeks'
                }
            },
            'lip-skin-revival': {
                title: 'Lip & Skin Revival',
                icon: 'ri-heart-pulse-line',
                image: 'https://beauxmedspa.com/wp-content/uploads/2025/05/lip-skin-treatment.jpg',
                price: '$1,000',
                originalPrice: '$1,600',
                duration: '120 min',
                description: 'The ultimate combination for complete facial rejuvenation! This luxury package pairs professional lip plumping and hydration with dermal fillers alongside advanced skin pen microneedling.',
                benefits: [
                    'Fuller, more defined and hydrated lips',
                    'Natural-looking lip enhancement',
                    'Improved overall skin texture and tone',
                    'Reduced appearance of fine lines and scars',
                    'Enhanced collagen production',
                    'Exclusive skincare savings with purchase'
                ],
                details: {
                    'Package Value': '$1,600 (Save $600)',
                    'Treatment Time': '2-2.5 hours total',
                    'Lip Enhancement': 'Professional dermal filler application',
                    'Skin Treatment': 'Advanced microneedling therapy',
                    'Bonus Offer': '20% off skincare products'
                }
            }
        };

        return packageDatabase[packageType] || packageDatabase['eye-rejuvenation'];
    }

    populateModal(data) {
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
            modalImage.alt = `${data.title} - Manhattan Medical Spa Package`;
        }
        if (modalDescription) modalDescription.textContent = data.description;

        if (modalBenefits && data.benefits) {
            modalBenefits.innerHTML = '';
            data.benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                modalBenefits.appendChild(li);
            });
        }

        if (modalDetails && data.details) {
            modalDetails.innerHTML = '';
            Object.entries(data.details).forEach(([key, value]) => {
                const detailItem = document.createElement('div');
                detailItem.className = 'detail-item';
                
                if (key === 'Package Value') {
                    detailItem.classList.add('package-value-highlight');
                }
                
                detailItem.innerHTML = `
                    <div class="detail-label">${key.replace(/([A-Z])/g, ' $1')}</div>
                    <div class="detail-value">${value}</div>
                `;
                modalDetails.appendChild(detailItem);
            });
        }
    }

    enhanceTileVisually(tile) {
        const packageIcon = tile.querySelector('.package-icon-container');
        const packageImage = tile.querySelector('.package-bg-image');
        
        if (packageIcon) {
            packageIcon.style.transform = 'translateX(-50%) scale(1.1)';
        }
        
        if (packageImage) {
            packageImage.style.transform = 'scale(1.1)';
        }

        tile.style.boxShadow = `
            0 25px 60px rgba(0, 0, 0, 0.15),
            0 12px 40px rgba(255, 140, 0, 0.25)
        `;
    }

    resetTileVisuals(tile) {
        const packageIcon = tile.querySelector('.package-icon-container');
        const packageImage = tile.querySelector('.package-bg-image');
        
        if (packageIcon) {
            packageIcon.style.transform = 'translateX(-50%) scale(1)';
        }
        
        if (packageImage) {
            packageImage.style.transform = 'scale(1)';
        }

        tile.style.boxShadow = '';
    }

    initAnimations() {
        this.observePackageTiles();
        
        this.packageTiles.forEach((tile, index) => {
            tile.style.opacity = '0';
            tile.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                tile.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                tile.style.opacity = '1';
                tile.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    }

    observePackageTiles() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.animatePackageTile(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        this.packageTiles.forEach(tile => observer.observe(tile));
    }

    animatePackageTile(tile) {
        const badge = tile.querySelector('.package-badge');
        const icon = tile.querySelector('.package-icon-container');
        
        if (badge) {
            badge.style.animation = 'pulse-glow 2s infinite';
        }
        
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'translateX(-50%) scale(1.1)';
                setTimeout(() => {
                    icon.style.transform = 'translateX(-50%) scale(1)';
                }, 300);
            }, 500);
        }
    }

    handleKeyboard(e) {
        if (!this.section.matches(':hover') && !this.isModalOpen) return;
        
        switch(e.key) {
            case 'Escape':
                if (this.isModalOpen) {
                    e.preventDefault();
                    this.closeModal();
                }
                break;
            case '1':
            case '2':
            case '3':
                if (!this.isModalOpen) {
                    e.preventDefault();
                    const tileIndex = parseInt(e.key) - 1;
                    const tile = this.packageTiles[tileIndex];
                    if (tile) {
                        const packageType = tile.dataset.package;
                        this.openModal(packageType);
                    }
                }
                break;
        }
    }

    handleResize() {
        if (EviaUtils.isMobile()) {
            this.packageTiles.forEach(tile => {
                if (tile.classList.contains('featured')) {
                    tile.style.transform = 'none';
                }
            });
        } else {
            this.packageTiles.forEach(tile => {
                if (tile.classList.contains('featured')) {
                    tile.style.transform = 'scale(1.05)';
                }
            });
        }
    }

    trackBookingClick(packageType) {
        this.trackEvent('package_booking_clicked', {
            package: packageType,
            location: 'package_tile'
        });
    }

    trackEvent(eventName, eventData = {}) {
        const analyticsData = {
            event_category: 'Holiday Packages',
            event_label: eventData.package || 'general',
            custom_parameters: {
                package_type: eventData.package,
                location: eventData.location,
                timestamp: Date.now(),
                viewport_width: window.innerWidth,
                viewport_height: window.innerHeight,
                ...eventData
            }
        };

        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, analyticsData);
        }

        if (window.customAnalytics) {
            window.customAnalytics.track(eventName, analyticsData);
        }
        
        console.log(`📊 Holiday Packages Event: ${eventName}`, analyticsData);
    }

    openPackageModal(packageType) {
        this.openModal(packageType);
    }

    closePackageModal() {
        this.closeModal();
    }

    getPackageInfo(packageType) {
        return this.getPackageData(packageType);
    }

    highlightPackage(packageType) {
        const tile = document.querySelector(`[data-package="${packageType}"]`);
        if (tile) {
            tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.enhanceTileVisually(tile);
            
            setTimeout(() => {
                this.resetTileVisuals(tile);
            }, 2000);
        }
    }

    destroy() {
        this.packageTiles.forEach(tile => {
            tile.removeEventListener('mouseenter', this.enhanceTileVisually);
            tile.removeEventListener('mouseleave', this.resetTileVisuals);
        });
        
        console.log('🎁 Holiday Packages Component Destroyed');
    }
}

// =============================================================================
// SERVICES CAROUSEL COMPONENT
// =============================================================================
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
        
        console.log('🏥 Services Scroller Initialized');
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
                window.location.href = `${EVIA_CONFIG.urls.services}#${service}`;
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

// =============================================================================
// ABOUT SECTION COMPONENT
// =============================================================================
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
        
        console.log('👨‍⚕️ About Section Initialized');
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
            window.location.href = EVIA_CONFIG.urls.about;
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
}

// =============================================================================
// RESULTS SHOWCASE COMPONENT
// =============================================================================
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
        this.sliderPositions = new Map();
        this.intersectionObserver = null;
        
        this.animationDuration = 600;
        this.observerThreshold = 0.2;
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
            console.log('📸 Results Showcase Initialized');
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
                window.location.href = EVIA_CONFIG.urls.portfolio;
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
        
        EviaUtils.createRippleEffect(element, { clientX: element.offsetLeft + element.offsetWidth/2, clientY: element.offsetTop + element.offsetHeight/2 });
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 200);
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
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
            color: white;
            padding: 18px 28px;
            border-radius: 50px;
            font-family: 'Inter', sans-serif;
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
            img.style.transition = 'all 0.4s ease';
        });
        
        const details = card.querySelector('.showcase-result-details');
        if (details) {
            details.style.transform = 'translateY(-2px)';
            details.style.transition = 'transform 0.4s ease';
        }
        
        const badge = card.querySelector('.showcase-treatment-badge');
        if (badge) {
            badge.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.3)';
            badge.style.transition = 'box-shadow 0.4s ease';
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
    }

    triggerElementAnimation(element) {
        if (element.classList.contains('showcase-result-card')) {
            this.animateCardEntrance(element);
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
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
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
        window.addEventListener('resize', EviaUtils.debounce(() => {
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
                window.location.href = EVIA_CONFIG.urls.portfolio;
            });
        }
        
        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToContact();
            });
        }
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
        
        console.log('📸 Results Showcase destroyed');
    }
}

// =============================================================================
// LUXURY CAROUSEL CONTROLLER (PRODUCTS SECTION)
// =============================================================================
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
        
        if (this.track && this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.startAutoPlay();
        this.setupProductInteractions();
        this.initializeCounter();
        this.setupButtons();
        
        console.log('🧴 Luxury Carousel Initialized');
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
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        }
        
        const section = document.querySelector('.luxury-carousel-section');
        if (section) {
            section.addEventListener('mouseenter', () => this.pauseAutoPlay());
            section.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    setupProductInteractions() {
        this.slides.forEach((slide, index) => {
            const card = slide.querySelector('.luxury-carousel-product-card');
            if (card) {
                card.addEventListener('click', () => this.handleProductClick(index));
                card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
                card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
            }
        });
    }
    
    setupButtons() {
        const shopBtn = document.querySelector('.luxury-carousel-shop-btn');
        if (shopBtn) {
            shopBtn.removeAttribute('onclick');
            shopBtn.style.pointerEvents = 'auto';
            shopBtn.style.cursor = 'pointer';
            shopBtn.style.zIndex = '10';
            
            shopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                shopBtn.style.transform = 'scale(0.95) translateY(-4px)';
                this.showFeedback('Opening AlumierMD Shop...', 'ri-shopping-bag-line');
                
                setTimeout(() => {
                    shopBtn.style.transform = '';
                    window.open(EVIA_CONFIG.urls.shop, '_blank');
                }, 150);
            });
        }
        
        const consultBtn = document.querySelector('.luxury-carousel-consult-btn');
        if (consultBtn) {
            consultBtn.removeAttribute('onclick');
            consultBtn.style.pointerEvents = 'auto';
            consultBtn.style.cursor = 'pointer';
            consultBtn.style.zIndex = '10';
            
            consultBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                consultBtn.style.transform = 'scale(0.95) translateY(-4px)';
                this.showFeedback('Redirecting to contact...', 'ri-calendar-line');
                
                setTimeout(() => {
                    consultBtn.style.transform = '';
                    window.location.href = EVIA_CONFIG.urls.contact;
                }, 150);
            });
        }
        
        const consultLink = document.querySelector('.consultation-link');
        if (consultLink) {
            consultLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFeedback('Redirecting to contact...', 'ri-arrow-right-line');
                setTimeout(() => {
                    window.location.href = EVIA_CONFIG.urls.contact;
                }, 300);
            });
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex;
        }
        this.updateDisplay();
        this.resetAutoPlay();
    }
    
    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateDisplay();
        this.resetAutoPlay();
    }
    
    updateDisplay() {
        if (!this.track) return;
        
        const slideWidth = 100 / this.slidesPerView;
        const translateX = -(this.currentIndex * slideWidth);
        
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateProgressBar();
        this.updateCounter();
        this.updateNavigationState();
        this.animateCards();
    }
    
    updateProgressBar() {
        if (!this.progressBar) return;
        
        const progress = this.maxIndex > 0 ? (this.currentIndex / this.maxIndex) * 100 : 0;
        this.progressBar.style.width = `${progress}%`;
    }
    
    updateCounter() {
        if (this.currentSlideElement) {
            this.currentSlideElement.textContent = this.currentIndex + 1;
        }
    }
    
    updateNavigationState() {
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.5' : '1';
        }
    }
    
    animateCards() {
        this.slides.forEach((slide, index) => {
            const card = slide.querySelector('.luxury-carousel-product-card');
            if (card) {
                if (index >= this.currentIndex && index < this.currentIndex + this.slidesPerView) {
                    card.classList.add('card-animate');
                } else {
                    card.classList.remove('card-animate');
                }
            }
        });
    }
    
    handleProductClick(index) {
        this.showFeedback(`Viewing Product ${index + 1}`, 'ri-eye-line');
    }
    
    handleCardHover(card, isEntering) {
        if (isEntering) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.15)';
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.pauseAutoPlay();
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
        this.resumeAutoPlay();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
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
        if (!document.querySelector('.luxury-carousel-section:hover')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.isAutoPlaying ? this.pauseAutoPlay() : this.resumeAutoPlay();
                break;
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
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (this.isAutoPlaying) {
                this.nextSlide();
            }
        }, EVIA_CONFIG.autoPlayInterval);
    }
    
    pauseAutoPlay() {
        this.isAutoPlaying = false;
    }
    
    resumeAutoPlay() {
        this.isAutoPlaying = true;
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        setTimeout(() => {
            this.resumeAutoPlay();
        }, 2000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.isAutoPlaying = false;
    }
    
    showFeedback(message, icon = 'ri-check-line') {
        const existingFeedback = document.querySelector('.carousel-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const feedback = document.createElement('div');
        feedback.className = 'carousel-feedback';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 50px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            opacity: 0;
            pointer-events: none;
            box-shadow: 0 20px 60px rgba(255, 140, 0, 0.4);
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 200px;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
                    feedback.remove();
                }
            }, 400);
        }, 2500);
    }
    
    goToSlide(index) {
        if (index >= 0 && index <= this.maxIndex) {
            this.currentIndex = index;
            this.updateDisplay();
        }
    }
    
    getCurrentSlide() {
        return this.currentIndex;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    destroy() {
        this.stopAutoPlay();
        
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.prevSlide);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.nextSlide);
        }
        
        console.log('🧴 Luxury Carousel destroyed');
    }
}

// =============================================================================
// CONTACT SECTION COMPONENT
// =============================================================================
class ContactSection {
    constructor() {
        this.section = document.querySelector('.luxury-contact-section');
        this.form = document.querySelector('.elfsight-form-wrapper');
        this.contactMethods = document.querySelectorAll('.contact-method');
        this.actionBtns = document.querySelectorAll('.action-btn');
        this.emergencyBtns = document.querySelectorAll('.emergency-btn');
        this.methodCards = document.querySelectorAll('.method-card');
        
        if (this.section) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.initializeFormEnhancements();
        this.initializeContactAnimations();
        this.setupFormValidation();
        
        console.log('📞 Contact Section Initialized');
    }

    bindEvents() {
        this.contactMethods.forEach(method => {
            method.addEventListener('click', (e) => this.handleContactClick(e, method));
            method.addEventListener('mouseenter', () => this.addHoverEffect(method));
            method.addEventListener('mouseleave', () => this.removeHoverEffect(method));
        });

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

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    EviaUtils.smoothScrollTo(target);
                }
            });
        });
    }

    handleContactClick(e, method) {
        const link = method.querySelector('a');
        const href = link?.getAttribute('href');
        
        if (href) {
            this.trackContactMethod(href);
            this.addClickEffect(method);
            
            if (href.includes('tel:')) {
                EviaUtils.showNotification('Opening phone dialer...', 'success', 'ri-phone-line');
            } else if (href.includes('mailto:')) {
                EviaUtils.showNotification('Opening email client...', 'success', 'ri-mail-line');
            } else if (href.includes('maps')) {
                EviaUtils.showNotification('Opening directions...', 'success', 'ri-map-pin-line');
            }
        }
    }

    trackContactMethod(href) {
        if (href.includes('tel:')) {
            console.log('📞 Phone contact initiated');
        } else if (href.includes('mailto:')) {
            console.log('📧 Email contact initiated');
        } else if (href.includes('maps')) {
            console.log('🗺️ Map directions requested');
        }
    }

    addHoverEffect(element) {
        const icon = element.querySelector('.method-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    }

    removeHoverEffect(element) {
        const icon = element.querySelector('.method-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    addClickEffect(element) {
        element.style.transform = 'scale(0.98)';
        setTimeout(() => {
            element.style.transform = 'translateX(5px)';
        }, 150);
        setTimeout(() => {
            element.style.transform = '';
        }, 300);
    }

    initializeFormEnhancements() {
        if (!this.form) return;
        
        this.observeFormLoading();
        
        setTimeout(() => {
            this.applyFormStyling();
        }, 1000);
    }

    observeFormLoading() {
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.classList.add('loading');
            
            setTimeout(() => {
                formContainer.classList.remove('loading');
            }, 3000);
        }
    }

    applyFormStyling() {
        const style = document.createElement('style');
        style.textContent = `
            .elfsight-app [data-elfsight-app-lazy] input,
            .elfsight-app [data-elfsight-app-lazy] textarea,
            .elfsight-app [data-elfsight-app-lazy] select {
                border: 2px solid rgba(255, 140, 0, 0.2) !important;
                border-radius: 16px !important;
                padding: 12px 16px !important;
                font-family: 'Inter', sans-serif !important;
                transition: all 0.3s ease !important;
                background: rgba(255, 255, 255, 0.9) !important;
            }
            
            .elfsight-app [data-elfsight-app-lazy] input:focus,
            .elfsight-app [data-elfsight-app-lazy] textarea:focus,
            .elfsight-app [data-elfsight-app-lazy] select:focus {
                border-color: #FF8C00 !important;
                box-shadow: 0 0 20px rgba(255, 140, 0, 0.3) !important;
                outline: none !important;
            }
            
            .elfsight-app [data-elfsight-app-lazy] button[type="submit"] {
                background: linear-gradient(135deg, #FF8C00 0%, #FFA500 50%, #FF7A00 100%) !important;
                border: none !important;
                border-radius: 25px !important;
                padding: 12px 24px !important;
                transition: all 0.3s ease !important;
                font-weight: 600 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
            }
            
            .elfsight-app [data-elfsight-app-lazy] button[type="submit"]:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4) !important;
            }
        `;
        
        document.head.appendChild(style);
    }

    setupFormValidation() {
        setTimeout(() => {
            const form = document.querySelector('.elfsight-form-wrapper form');
            if (!form) return;
            
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearValidationError.bind(this));
            });
        }, 2000);
    }

    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        
        let isValid = true;
        let errorMessage = '';
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.type === 'tel') {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
    }

    showFieldError(field, message) {
        this.clearFieldValidation(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 12px;
            margin-top: 4px;
            padding-left: 16px;
        `;
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#ef4444';
    }

    clearValidationError(event) {
        this.clearFieldValidation(event.target);
    }

    clearFieldValidation(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    initializeContactAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });
        
        this.contactMethods.forEach((method, index) => {
            method.style.opacity = '0';
            method.style.transform = 'translateY(30px)';
            method.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
            observer.observe(method);
        });
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

// =============================================================================
// FLOATING BUTTONS COMPONENT
// =============================================================================
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
        
        console.log('⬆️ Floating Buttons Initialized');
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

// =============================================================================
// GLOBAL ANIMATION SYSTEM
// =============================================================================
class GlobalAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.addGlobalStyles();
        this.initializeScrollAnimations();
        this.initializeHoverEffects();
        
        console.log('✨ Global Animations Initialized');
    }

    addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
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
            
            @keyframes pulse-glow {
                0%, 100% { 
                    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.4); 
                }
                50% { 
                    box-shadow: 0 4px 20px rgba(255, 140, 0, 0.6), 0 0 30px rgba(255, 140, 0, 0.3); 
                }
            }
            
            .animate-in {
                animation: fadeInUp 0.8s ease-out both;
            }
            
            .evia-btn {
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .evia-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 140, 0, 0.3);
            }
            
            .evia-btn:active {
                transform: translateY(0);
            }
            
            .hero-content-stack {
                opacity: 1 !important;
                visibility: visible !important;
                z-index: 100 !important;
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
            
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        document.querySelectorAll('.hero-content, .service-card, .testimonial-card, .feature-item').forEach(el => {
            observer.observe(el);
        });
    }

    initializeHoverEffects() {
        document.querySelectorAll('.evia-btn, .cta-btn, .action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                EviaUtils.createRippleEffect(btn, e);
            });
        });
    }
}

// =============================================================================
// MAIN APPLICATION CONTROLLER
// =============================================================================
class EviaAestheticsApp {
    constructor() {
        this.components = new Map();
        this.isMobile = EviaUtils.isMobile();
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
            this.components.set('whatsHot', new EviaHolidayPackages());
            this.components.set('servicesCarousel', new HermesServicesScroller());
            this.components.set('about', new ElevatedAboutSection());
            this.components.set('results', new HermesResultsShowcase());
            this.components.set('products', new LuxuryCarouselController());
            this.components.set('contact', new ContactSection());
            this.components.set('floatingButtons', new HermesFloatingButtons());
            this.components.set('globalAnimations', new GlobalAnimations());
            
            this.isInitialized = true;
            
            // Expose components globally
            window.eviaComponents = this.components;
            window.eviaApp = this;
            window.modernHermesHeader = this.components.get('header');
            window.eviaHolidayPackages = this.components.get('whatsHot');
            window.hermesResultsShowcase = this.components.get('results');
            window.luxuryCarousel = this.components.get('products');
            window.hermesFloatingButtons = this.components.get('floatingButtons');
            
            console.log('🚀 Evia Aesthetics App Initialized Successfully');
            
        } catch (error) {
            console.error('Error initializing components:', error);
            this.setupFallbackComponents();
        }
    }

    setupFallbackComponents() {
        try {
            window.modernHermesHeader = new ModernHermesHeader();
            window.eviaHolidayPackages = new EviaHolidayPackages();
            window.hermesFloatingButtons = new HermesFloatingButtons();
            window.luxuryCarousel = new LuxuryCarouselController();
            
            console.log('🔧 Fallback components initialized');
        } catch (fallbackError) {
            console.error('Fallback initialization failed:', fallbackError);
        }
    }

    setupGlobalEvents() {
        window.addEventListener('resize', EviaUtils.debounce(() => {
            const wasMobile = this.isMobile;
            this.isMobile = EviaUtils.isMobile();
            
            if (wasMobile !== this.isMobile) {
                this.handleScreenSizeChange();
            }
            
            this.components.forEach(component => {
                if (component && typeof component.handleResize === 'function') {
                    component.handleResize();
                }
            });
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
        const header = this.components.get('header');
        if (header && !this.isMobile && header.isMobileMenuOpen) {
            header.closeMobileMenu();
        }
        
        const floatingButtons = this.components.get('floatingButtons');
        if (floatingButtons && floatingButtons.isContactExpanded) {
            floatingButtons.closeContactFab();
        }
    }

    getComponent(name) {
        return this.components.get(name);
    }
}

// =============================================================================
// GLOBAL UTILITY FUNCTIONS
// =============================================================================
function scrollToContact() {
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

// Global function exports
window.scrollToContact = scrollToContact;
window.EviaUtils = EviaUtils;

// Component exports
window.ModernHermesHeader = ModernHermesHeader;
window.HeroSection = HeroSection;
window.EviaHolidayPackages = EviaHolidayPackages;
window.HermesServicesScroller = HermesServicesScroller;
window.ElevatedAboutSection = ElevatedAboutSection;
window.HermesResultsShowcase = HermesResultsShowcase;
window.LuxuryCarouselController = LuxuryCarouselController;
window.ContactSection = ContactSection;
window.HermesFloatingButtons = HermesFloatingButtons;
window.GlobalAnimations = GlobalAnimations;
window.EviaAestheticsApp = EviaAestheticsApp;

// =============================================================================
// MAIN INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS if available
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
    
    // Initialize hero video
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.load();
        heroVideo.play().catch(e => console.log('Video autoplay prevented:', e));
    }

    // Set CSS custom properties for viewport height
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 500);
    });

    // Global body scroll lock utility
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
    
    console.log('📱 DOM Content Loaded - Starting Evia Aesthetics');
});

// Add touch device detection
if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
}

// Initialize main app
let eviaApp;

const initializeApp = () => {
    try {
        eviaApp = new EviaAestheticsApp();
        console.log('✅ Evia Aesthetics Application Loaded Successfully');
    } catch (error) {
        console.error('Failed to initialize main app:', error);
        
        // Fallback initialization
        try {
            window.modernHermesHeader = new ModernHermesHeader();
            window.eviaHolidayPackages = new EviaHolidayPackages();
            window.hermesFloatingButtons = new HermesFloatingButtons();
            console.log('🔧 Fallback initialization successful');
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

// Ensure app loads on window load if not already loaded
window.addEventListener('load', () => {
    if (!window.eviaApp) {
        setTimeout(initializeApp, 100);
    }
    
    // Final visibility check
    const section = document.querySelector('.luxury-carousel-section');
    if (section) {
        section.style.opacity = '1';
    }
    
    console.log('🎯 All resources loaded - Evia Aesthetics ready');
});

// Global error handling
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

console.log('🚀 Evia Aesthetics JavaScript System Loaded - Manhattan Luxury Medical Spa');

// End of script.js
